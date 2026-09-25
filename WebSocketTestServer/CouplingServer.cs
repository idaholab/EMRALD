using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.WebSockets;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using MessageDefLib;

namespace WebSocketTestServer
{
    // Handles the WebSocket side of EMRALD-style coupling: accepts sockets, creates per-connection state machines,
    // routes incoming commands/actions, and sends JSON messages back over the same socket.
    //
    // Multithreading: EMRALD opens one socket per simulation thread, so many sockets are served at once.
    // All shared maps are concurrent, and each socket has its own send lock because a WebSocket only allows one
    // send at a time while the receive loop, the state machine dispatcher and the sim timer can all send.
    //
    // To customize for your coupling server:
    // - Use any ConnectionInfo info as needed.
    // - Extend ConnectionStateMachine with real simulation hooks (parsing actions, advancing time, sending events).
    public sealed class CouplingServer
    {
        private readonly ConcurrentDictionary<Guid, ConnectionInfo> _connections = new();
        private readonly ConcurrentDictionary<SocketContext, byte> _sockets = new();
        private readonly ConcurrentDictionary<Task, byte> _socketTasks = new();

        // What every connection received and sent, used by tests.
        public TrafficLedger Ledger { get; } = new();

        internal IEnumerable<ConnectionInfo> ActiveConnections => _connections.Values;

        private static bool LogMessages => Program.LogMessages;

        /// <summary>
        /// Start processing a WebSocket upgrade request. The socket's lifetime is tracked so shutdown can wait for it.
        /// </summary>
        internal void AcceptWebSocket(HttpListenerContext context)
        {
            Task socketTask = ProcessWebSocketRequestAsync(context);
            _socketTasks.TryAdd(socketTask, 0);
            _ = socketTask.ContinueWith(done => _socketTasks.TryRemove(done, out _), TaskScheduler.Default);
        }

        /// <summary>
        /// Stop all state machines and abort open sockets, then wait for the socket handlers to finish.
        /// </summary>
        internal async Task ShutdownAsync(TimeSpan timeout)
        {
            foreach (var conn in _connections.Values)
                conn.StateMachine?.Cancel();

            foreach (var socket in _sockets.Keys)
                socket.Abort();

            var all = Task.WhenAll(_socketTasks.Keys.ToList());
            await Task.WhenAny(all, Task.Delay(timeout));
        }

        // Accepts a WebSocket upgrade for a single client and processes its lifecycle.
        private async Task ProcessWebSocketRequestAsync(HttpListenerContext context)
        {
            SocketContext? socketCtx = null;
            try
            {
                WebSocketContext wsContext = await context.AcceptWebSocketAsync(null);
                socketCtx = new SocketContext(wsContext.WebSocket);
                _sockets.TryAdd(socketCtx, 0);

#if DEBUG
                if (LogMessages) Console.WriteLine($"Client connected from {context.Request.RemoteEndPoint}");
                if (LogMessages) Console.WriteLine();
#endif

                await HandleWebSocketConnection(socketCtx);
            }
            catch (Exception ex)
            {
#if DEBUG
                if (LogMessages) Console.WriteLine($"Error: {ex.Message}");
#endif
            }
            finally
            {
                if (socketCtx != null)
                {
                    // Clean up any connections associated with this socket
                    CleanupDisconnectedSocket(socketCtx);
                    _sockets.TryRemove(socketCtx, out _);
                }
#if DEBUG
                if (LogMessages) Console.WriteLine("Ready for next connection...");
                if (LogMessages) Console.WriteLine();
#endif
            }
        }

        // Removes connection entries tied to a socket that has closed.
        private void CleanupDisconnectedSocket(SocketContext socketCtx)
        {
            var toRemove = _connections
                .Where(kvp => kvp.Value.SocketCtx == socketCtx)
                .Select(kvp => kvp.Key)
                .ToList();

            foreach (var conID in toRemove)
            {
                if (_connections.TryRemove(conID, out var connInfo))
                    connInfo.StateMachine?.Cancel();
#if DEBUG
                if (LogMessages) Console.WriteLine($"Cleaned up connection {conID}");
#endif
            }
        }

        // Receives messages from a client WebSocket and forwards them for handling.
        private async Task HandleWebSocketConnection(SocketContext socketCtx)
        {
            WebSocket webSocket = socketCtx.Socket;
            try
            {
                while (webSocket.State == WebSocketState.Open)
                {
                    // Block for next message from the client. Reads a whole message however many
                    // chunks it spans, so a large command is not truncated into unparseable JSON.
                    var received = await WebSocketMessageReader.ReceiveMessageAsync(
                        webSocket,
                        CancellationToken.None);

                    if (received.MessageType == WebSocketMessageType.Close)
                    {
                        await socketCtx.CloseAsync("Closing");
#if DEBUG
                        if (LogMessages) Console.WriteLine("Client disconnected");
#endif
                        break;
                    }

                    if (received.TooLarge)
                    {
#if DEBUG
                        if (LogMessages) Console.WriteLine($"Dropped oversized message ({received.ByteCount} bytes)");
#endif
                        await socketCtx.SendAsync(JsonConvert.SerializeObject(new
                        {
                            error = $"Message of {received.ByteCount} bytes exceeds the " +
                                    $"{WebSocketMessageReader.DefaultMaxMessageBytes} byte limit"
                        }));
                        continue;
                    }

                    if (received.MessageType == WebSocketMessageType.Text)
                    {
                        string message = received.Text;
#if DEBUG
                        if (LogMessages) Console.WriteLine($"Received: {message}");
#endif

                        // Process the JSON command and optionally send a response.
                        string response = await ProcessCommand(message, socketCtx);

                        if (!string.IsNullOrEmpty(response))
                        {
                            await socketCtx.SendAsync(response);
                        }
                    }
                }
            }
            catch (Exception ex)
            {
#if DEBUG
                if (LogMessages) Console.WriteLine($"Error: {ex.Message}");
#endif
            }
        }

        // Parses a JSON command string and dispatches to the appropriate handler.
        // A requestId sent with a command is echoed in its response so the client can match the two.
        private async Task<string> ProcessCommand(string message, SocketContext socketCtx)
        {
            JToken? requestId = null;
            try
            {
                var jsonObj = JObject.Parse(message);
                requestId = jsonObj["requestId"];
                string command = jsonObj["command"]?.ToString()!;

                switch (command)
                {
                    case "GetAppOptions":
                        return WithRequestId(HandleGetAppOptions(), requestId);

                    case "CreateConnection":
                        string appName = jsonObj["appName"]?.ToString()!;
                        var watchItems = jsonObj["watchItems"]?.ToObject<List<WatchItem>>();
                        return WithRequestId(HandleCreateConnection(appName!, watchItems!, socketCtx), requestId);

                    case "SendActionMsg":
                        Guid conID = Guid.Parse(jsonObj["conID"]?.ToString()!);
                        var actionWrapper = jsonObj["action"];
                        await HandleSendActionMsg(conID, actionWrapper!);
                        return null!;

                    default:
                        return WithRequestId(new JObject { ["error"] = "Unknown command" }, requestId);
                }
            }
            catch (Exception ex)
            {
                return WithRequestId(new JObject { ["error"] = ex.Message }, requestId);
            }
        }

        private static string WithRequestId(JObject response, JToken? requestId)
        {
            if (requestId != null)
                response["requestId"] = requestId;
            return response.ToString(Formatting.None);
        }

        // Returns available application names to the client.
        private static JObject HandleGetAppOptions()
        {
            var response = new JObject { ["names"] = new JArray(Enum.GetNames(typeof(AvailableApp))) };
#if DEBUG
            if (LogMessages) Console.WriteLine($"Sending app options: {response.ToString(Formatting.None)}");
#endif
            return response;
        }

        // Creates a new connection record and associated state machine.
        private JObject HandleCreateConnection(
            string appName,
            List<WatchItem> watchItems,
            SocketContext socketCtx)
        {
            Guid conID = Guid.NewGuid();

            var connInfo = new ConnectionInfo
            {
                ConID = conID,
                AppName = appName,
                WatchItems = watchItems ?? new List<WatchItem>(), // Customize: pre-process/validate watch items if needed.
                SocketCtx = socketCtx,
                Traffic = Ledger.Register(conID, appName, socketCtx.ID)
            };

            socketCtx.AddConnection(conID);
            _connections[conID] = connInfo;
            connInfo.StateMachine = new ConnectionStateMachine(connInfo); // Customize: extend the state machine for your sim.

#if DEBUG
            if (LogMessages) Console.WriteLine($"Created connection {conID} for app '{appName}'");
            if (LogMessages) Console.WriteLine($"Watch items: {string.Join(", ", (watchItems ?? new List<WatchItem>()).Select(w => w.name))}");
#endif

            return new JObject { ["conID"] = conID.ToString() };
        }

        // Forwards an action message to the proper connection state machine.
        private async Task HandleSendActionMsg(
            Guid conID,
            JToken actionWrapper)
        {
            if (actionWrapper is null)
            {
#if DEBUG
                if (LogMessages) Console.WriteLine("Action wrapper was null");
#endif
                return;
            }

            if (!_connections.TryGetValue(conID, out var connInfo))
            {
#if DEBUG
                if (LogMessages) Console.WriteLine($"Connection {conID} not found");
#endif
                return;
            }

            var wrapper = actionWrapper!;

            SimAction simAction;

            if (wrapper["simAction"] != null)
            {
                simAction = wrapper["simAction"]!.ToObject<SimAction>()!;
            }
            else if (wrapper["actType"] != null)
            {
                simAction = wrapper.ToObject<SimAction>()!;
            }
            else
            {
#if DEBUG
                if (LogMessages) Console.WriteLine("Could not parse action message");
#endif
                return;
            }
#if DEBUG
            if (LogMessages) Console.WriteLine($"Received action for {conID}: {simAction.actType}");
#endif

            await connInfo.StateMachine.HandleActionAsync(simAction);
        }
    }

    /// <summary>
    /// One client WebSocket and the connection IDs created on it. All sends go through here so only one
    /// SendAsync is outstanding at a time. The send lock is not disposed because fire-and-forget sends from the
    /// state machine may still arrive after the socket closes; they see a closed socket and return.
    /// </summary>
    internal sealed class SocketContext
    {
        private readonly SemaphoreSlim _sendLock = new(1, 1);
        private readonly ConcurrentDictionary<Guid, byte> _conIDs = new();

        internal SocketContext(WebSocket socket)
        {
            Socket = socket;
        }

        internal Guid ID { get; } = Guid.NewGuid();
        internal WebSocket Socket { get; }

        internal void AddConnection(Guid conID) => _conIDs.TryAdd(conID, 0);

        // Sends a text message payload to the client WebSocket.
        internal async Task SendAsync(string message)
        {
            byte[] buffer = Encoding.UTF8.GetBytes(message);
            await _sendLock.WaitAsync();
            try
            {
                if (Socket.State != WebSocketState.Open)
                    return;

                await Socket.SendAsync(
                    new ArraySegment<byte>(buffer),
                    WebSocketMessageType.Text,
                    true,
                    CancellationToken.None);
            }
            finally
            {
                _sendLock.Release();
            }

#if DEBUG
            if (Program.LogMessages) Console.WriteLine($"Sent: {message}");
#endif
        }

        /// <summary>
        /// A connection has terminated. The socket is closed once no other connection is using it.
        /// </summary>
        internal Task CloseForConnectionAsync(Guid conID)
        {
            _conIDs.TryRemove(conID, out _);
            if (!_conIDs.IsEmpty)
                return Task.CompletedTask;

            return CloseAsync("Terminated");
        }

        internal async Task CloseAsync(string reason)
        {
            await _sendLock.WaitAsync();
            try
            {
                if (Socket.State == WebSocketState.Open || Socket.State == WebSocketState.CloseReceived)
                    await Socket.CloseAsync(WebSocketCloseStatus.NormalClosure, reason, CancellationToken.None);
            }
            catch
            {
                // ignore close failures
            }
            finally
            {
                _sendLock.Release();
            }
        }

        internal void Abort()
        {
            try
            {
                Socket.Abort();
            }
            catch
            {
                // ignore, shutting down
            }
        }
    }

    internal class ConnectionInfo
    {
        public Guid ConID { get; set; }
        public string AppName { get; set; } = string.Empty;
        public List<WatchItem> WatchItems { get; set; } = new List<WatchItem>();
        public SocketContext SocketCtx { get; set; } = null!;
        public WebSocket Socket => SocketCtx.Socket;
        public ConnectionStateMachine StateMachine { get; set; } = null!;
        // Recorded traffic for tests.
        public ConnectionTraffic Traffic { get; set; } = null!;
    }
}
