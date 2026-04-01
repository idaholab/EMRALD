using System;
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
    

    // This is an AI generated Minimal WebSocket server for EMRALD-style coupling: accepts connections, creates per-connection state machines,
    // routes incoming commands/actions, and sends JSON messages back over the same socket.
    //
    // To customize for your coupling server:
    // - Adjust the listening URL/port in Main (`url` variable).
    // - Use any ConnectionInfo info as needed.
    // - Extend ConnectionStateMachine with real simulation hooks (parsing actions, advancing time, sending events).
    public class Program
    {
        // Set to false to suppress console logging even in debug builds (e.g. during tests)
        public static bool LogMessages { get; set; } = true;

        private static Dictionary<Guid, ConnectionInfo> activeConnections =
            new Dictionary<Guid, ConnectionInfo>();

        internal static IEnumerable<ConnectionInfo> GetActiveConnections() => activeConnections.Values;

        // Entry point: starts the HTTP listener and hands off WebSocket requests.
        static async Task Main(string[] args)
        {
            // Customize: change URL/port to your desired endpoint.
            string url = "http://localhost:8465/";
            HttpListener listener = new HttpListener();
            listener.Prefixes.Add(url);
            listener.Start();
            
#if DEBUG
            if (LogMessages) Console.WriteLine($"WebSocket Server started on {url}");
            if (LogMessages) Console.WriteLine("Waiting for connections...");
            if (LogMessages) Console.WriteLine();
#endif

            while (true)
            {
                HttpListenerContext context = await listener.GetContextAsync();
                if (context.Request.IsWebSocketRequest)
                {
                    // Fire-and-forget the socket processing for this client.
                    ProcessWebSocketRequest(context);
                }
                else
                {
                    context.Response.StatusCode = 400;
                    context.Response.Close();
                }
            }
        }

        // Accepts a WebSocket upgrade for a single client and processes its lifecycle.
        internal static async void ProcessWebSocketRequest(HttpListenerContext context)
        {
            WebSocketContext wsContext = await context.AcceptWebSocketAsync(null);
            WebSocket webSocket = wsContext.WebSocket;
            
#if DEBUG
            if (LogMessages) Console.WriteLine($"Client connected from {context.Request.RemoteEndPoint}");
            if (LogMessages) Console.WriteLine();
#endif

            await HandleWebSocketConnection(webSocket);

            // Clean up any connections associated with this socket
            CleanupDisconnectedSocket(webSocket);
#if DEBUG
            if (LogMessages) Console.WriteLine("Ready for next connection...");
            if (LogMessages) Console.WriteLine();
#endif
        }

        // Removes connection entries tied to a socket that has closed.
        private static void CleanupDisconnectedSocket(WebSocket socket)
        {
            var toRemove = activeConnections
                .Where(kvp => kvp.Value.Socket == socket)
                .Select(kvp => kvp.Key)
                .ToList();
            
            foreach (var conID in toRemove)
            {
                activeConnections.Remove(conID);
#if DEBUG
                if (LogMessages) Console.WriteLine($"Cleaned up connection {conID}");
#endif
            }
        }

        // Receives messages from a client WebSocket and forwards them for handling.
        private static async Task HandleWebSocketConnection(WebSocket webSocket)
        {
            byte[] buffer = new byte[8192];

            try
            {
                while (webSocket.State == WebSocketState.Open)
                {
                    // Block for next message from the client.
                    var result = await webSocket.ReceiveAsync(
                        new ArraySegment<byte>(buffer), 
                        CancellationToken.None);

                    if (result.MessageType == WebSocketMessageType.Close)
                    {
                        await webSocket.CloseAsync(
                            WebSocketCloseStatus.NormalClosure,
                            "Closing",
                            CancellationToken.None);
#if DEBUG
                        if (LogMessages) Console.WriteLine("Client disconnected");
#endif
                        break;
                    }

                    if (result.MessageType == WebSocketMessageType.Text)
                    {
                        string message = Encoding.UTF8.GetString(buffer, 0, result.Count);
#if DEBUG
                        if (LogMessages) Console.WriteLine($"Received: {message}");
#endif
                        
                        // Process the JSON command and optionally send a response.
                        string response = await ProcessCommand(message, webSocket);
                        
                        if (!string.IsNullOrEmpty(response))
                        {
                            await SendMessage(webSocket, response);
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
        private static async Task<string> ProcessCommand(string message, WebSocket socket)
        {
            try
            {
                var jsonObj = JObject.Parse(message);
                string command = jsonObj["command"]?.ToString()!;

                switch (command)
                {
                    case "GetAppOptions":
                        return HandleGetAppOptions();

                    case "CreateConnection":
                        string appName = jsonObj["appName"]?.ToString()!;
                        var watchItems = jsonObj["watchItems"]?.ToObject<List<string>>();
                        return await HandleCreateConnection(appName!, watchItems!, socket);

                    case "SendActionMsg":
                        Guid conID = Guid.Parse(jsonObj["conID"]?.ToString()!);
                        var actionWrapper = jsonObj["action"];
                        await HandleSendActionMsg(conID, actionWrapper!);
                        return null!;

                    default:
                        return JsonConvert.SerializeObject(new { error = "Unknown command" });
                }
            }
            catch (Exception ex)
            {
                return JsonConvert.SerializeObject(new { error = ex.Message });
            }
        }

        // Returns available application names to the client.
        private static string HandleGetAppOptions()
        {
            var response = new { names = Enum.GetNames(typeof(AvailableApp)) };
            string json = JsonConvert.SerializeObject(response);
#if DEBUG
            if (LogMessages) Console.WriteLine($"Sending app options: {json}");
#endif
            return json;
        }

        // Creates a new connection record and associated state machine.
        private static Task<string> HandleCreateConnection(
            string appName, 
            List<string> watchItems, 
            WebSocket socket)
        {
            Guid conID = Guid.NewGuid();
            
            var connInfo = new ConnectionInfo
            {
                ConID = conID,
                AppName = appName,
                WatchItems = watchItems ?? new List<string>(), // Customize: pre-process/validate watch items if needed.
                Socket = socket
            };

            connInfo.StateMachine = new ConnectionStateMachine(connInfo); // Customize: extend the state machine for your sim.
            
            activeConnections[conID] = connInfo;
            
#if DEBUG
            if (LogMessages) Console.WriteLine($"Created connection {conID} for app '{appName}'");
            if (LogMessages) Console.WriteLine($"Watch items: {string.Join(", ", watchItems ?? new List<string>())}");
#endif

            var response = new { conID = conID };
            return Task.FromResult(JsonConvert.SerializeObject(response));
        }

        // Forwards an action message to the proper connection state machine.
        private static async Task HandleSendActionMsg(
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

            if (!activeConnections.ContainsKey(conID))
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
            
            if (!activeConnections.TryGetValue(conID, out var connInfo))
                return;

            await connInfo.StateMachine.HandleActionAsync(simAction);
        }

        // Sends a text message payload to a client WebSocket.
        internal static async Task SendMessage(WebSocket socket, string message)
        {
            if (socket.State != WebSocketState.Open)
                return;

            byte[] buffer = Encoding.UTF8.GetBytes(message);
            await socket.SendAsync(
                new ArraySegment<byte>(buffer),
                WebSocketMessageType.Text,
                true,
                CancellationToken.None);
            
#if DEBUG
            if (LogMessages) Console.WriteLine($"Sent: {message}");
#endif
        }
    }

    class ConnectionInfo
    {
        public Guid ConID { get; set; }
        public string AppName { get; set; } = string.Empty;
        public List<string> WatchItems { get; set; } = new List<string>();
        public WebSocket Socket { get; set; } = null!;
        public ConnectionStateMachine StateMachine { get; set; } = null!;
    }
}
