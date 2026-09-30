// Copyright 2026 Battelle Energy Alliance
// Low-level WebSocket client that manages connection, message sending, and asynchronous receive loop for simulation coupling.
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.WebSockets;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using MessageDefLib;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

namespace CouplingWebSocket
{
  public class WebSocketClient : IDisposable
  {
    private ClientWebSocket _client;
    private CancellationTokenSource _cancellationTokenSource;
    private Task? _receiveTask;
    // ClientWebSocket allows only one outstanding SendAsync; the sim thread and receive-loop callbacks can both send.
    private readonly SemaphoreSlim _sendLock = new SemaphoreSlim(1, 1);
    // Commands are issued one at a time so a response always belongs to the single pending request.
    private readonly SemaphoreSlim _requestLock = new SemaphoreSlim(1, 1);

    // Configurable timeout in milliseconds
    public int RequestTimeoutMs { get; set; } = 5000; //set by WebApiCoupling constructor

    // Set to false to suppress console logging even in debug builds (e.g. during tests)
    public static bool LogMessages { get; set; } = true;

    // Event for incoming messages - now includes the GUID
    public event EventHandler<(Guid conID, string message)>? MessageReceived;
    public event EventHandler<string>? ErrorOccurred;
    public event EventHandler? Connected;
    public event EventHandler? Disconnected;

    public bool IsConnected => _client?.State == WebSocketState.Open;

    public WebSocketClient()
    {
      _client = new ClientWebSocket();
      _cancellationTokenSource = new CancellationTokenSource();
    }

    /// <summary>
    /// Connect to the WebSocket server
    /// </summary>
    public async Task ConnectAsync(string url)
    {
      try
      {
        await _client.ConnectAsync(new Uri(url), _cancellationTokenSource.Token)
                     .ConfigureAwait(false);
        Connected?.Invoke(this, EventArgs.Empty);
        _receiveTask = ReceiveLoop();
      }
      catch (Exception ex)
      {
        ErrorOccurred?.Invoke(this, $"Connection error: {ex.Message}");
        throw;
      }
    }

    /// <summary>
    /// Get available application options
    /// Returns list of application names
    /// </summary>
    public async Task<List<string>> GetAppOptions()
    {
      EnsureConnected();

      var request = new
      {
        command = "GetAppOptions"
      };

      string response = await SendRequestAsync(request).ConfigureAwait(false);

      // Parse the response {"names":["app1","app2",...]}
      var jsonResponse = JObject.Parse(response);
      var names = jsonResponse["names"]?.ToObject<List<string>>() ?? new List<string>();

      return names;
    }

    /// <summary>
    /// Create a connection for a specific app
    /// Returns GUID for the created connection
    /// </summary>
    public async Task<Guid> CreateConnection(string appName, List<WatchItem> watchItems)
    {
      EnsureConnected();

      var request = new
      {
        command = "CreateConnection",
        appName = appName,
        watchItems = watchItems
      };

      string response = await SendRequestAsync(request).ConfigureAwait(false);

      // Parse the GUID from the response
      if (response.StartsWith("{"))
      {
        var jsonResponse = JObject.Parse(response);
        var guidString = jsonResponse["conID"]?.ToString() ?? response;
        return Guid.Parse(guidString);
      }
      else
      {
        return Guid.Parse(response.Trim('"'));
      }
    }

    /// <summary>
    /// Send an action message (as JSON string) for a specific connection
    /// </summary>
    public async Task SendActionMsg(Guid conID, string actionJson)
    {
      EnsureConnected();

      var request = new
      {
        command = "SendActionMsg",
        conID = conID,
        action = JObject.Parse(actionJson)
      };

      var jsonRequest = JsonConvert.SerializeObject(request);
      await SendMessageAsync(jsonRequest).ConfigureAwait(false);
    }

    /// <summary>
    /// Disconnect from the server
    /// </summary>
    public async Task DisconnectAsync()
    {
      if (_client.State == WebSocketState.Open)
      {
        await _client.CloseAsync(
            WebSocketCloseStatus.NormalClosure,
            "Client closing",
            CancellationToken.None
        ).ConfigureAwait(false);
      }

      _cancellationTokenSource.Cancel();

      if (_receiveTask != null)
      {
        await _receiveTask.ConfigureAwait(false);
      }

      Disconnected?.Invoke(this, EventArgs.Empty);
    }

    private void EnsureConnected()
    {
      if (_client.State != WebSocketState.Open)
      {
        throw new InvalidOperationException("WebSocket is not connected");
      }
    }

    private async Task<string> SendRequestAsync(object request, int? timeoutMs = null)
    {
      await _requestLock.WaitAsync().ConfigureAwait(false);
      try
      {
        // Tag the command so the response can be told apart from events carrying a conID. Servers that do
        // not echo requestId fall back to the response-shape check in ProcessIncomingMessage.
        string requestId = Guid.NewGuid().ToString();
        var jsonObj = JObject.FromObject(request);
        jsonObj["requestId"] = requestId;

        // Register the waiter before sending so a fast response is not mistaken for an event.
        var waiter = new TaskCompletionSource<string>(TaskCreationOptions.RunContinuationsAsynchronously);
        _pendingRequestId = requestId;
        _responseWaiter = waiter;
        try
        {
          await SendMessageAsync(jsonObj.ToString(Formatting.None)).ConfigureAwait(false);
          string response = await WaitForResponse(waiter, timeoutMs ?? RequestTimeoutMs).ConfigureAwait(false);

          var responseObj = JObject.Parse(response);
          if (responseObj.ContainsKey("error"))
            throw new InvalidOperationException("Server error: " + responseObj["error"]?.ToString());

          return response;
        }
        finally
        {
          _responseWaiter = null;
          _pendingRequestId = null;
        }
      }
      finally
      {
        _requestLock.Release();
      }
    }

    private async Task SendMessageAsync(string message)
    {
#if DEBUG
      if (LogMessages) Console.WriteLine("Sent : " + message);
#endif
      byte[] messageBytes = Encoding.UTF8.GetBytes(message);
      await _sendLock.WaitAsync(_cancellationTokenSource.Token).ConfigureAwait(false);
      try
      {
        await _client.SendAsync(
            new ArraySegment<byte>(messageBytes),
            WebSocketMessageType.Text,
            true,
            _cancellationTokenSource.Token
        ).ConfigureAwait(false);
      }
      finally
      {
        _sendLock.Release();
      }
    }

    private volatile TaskCompletionSource<string>? _responseWaiter;
    private volatile string? _pendingRequestId;

    private static async Task<string> WaitForResponse(TaskCompletionSource<string> waiter, int timeoutMs)
    {
      var timeoutTask = Task.Delay(timeoutMs);
      var completedTask = await Task.WhenAny(waiter.Task, timeoutTask).ConfigureAwait(false);

      if (completedTask == timeoutTask)
      {
        throw new TimeoutException($"Timeout waiting for server response after {timeoutMs}ms");
      }

      return await waiter.Task.ConfigureAwait(false);
    }

    /// <summary>
    /// Whether an incoming message is the response to the pending command. A server that echoes requestId is
    /// matched exactly. Otherwise a command response is recognized by shape: GetAppOptions returns "names" and
    /// CreateConnection returns a "conID" with no "message", while events carry both "conID" and "message".
    /// </summary>
    private static bool IsResponseTo(JObject jsonObj, string? requestId)
    {
      var echoedId = jsonObj["requestId"]?.ToString();
      if (echoedId != null)
        return echoedId == requestId;

      if (jsonObj.ContainsKey("message"))
        return false;

      return jsonObj.ContainsKey("names") || jsonObj.ContainsKey("conID") || jsonObj.ContainsKey("error");
    }

    private async Task ReceiveLoop()
    {
      try
      {
        while (_client.State == WebSocketState.Open &&
               !_cancellationTokenSource.Token.IsCancellationRequested)
        {
          // Reads a whole message however many chunks it spans, so a large response is not
          // truncated into unparseable JSON fragments.
          var message = await WebSocketMessageReader.ReceiveMessageAsync(
              _client,
              _cancellationTokenSource.Token
          ).ConfigureAwait(false);

          if (message.MessageType == WebSocketMessageType.Close)
          {
            await _client.CloseAsync(
                WebSocketCloseStatus.NormalClosure,
                "Server closed",
                CancellationToken.None
            ).ConfigureAwait(false);
            Disconnected?.Invoke(this, EventArgs.Empty);
            break;
          }

          if (message.TooLarge)
          {
            ErrorOccurred?.Invoke(this, $"Dropped an incoming message of {message.ByteCount} bytes, " +
                $"over the {WebSocketMessageReader.DefaultMaxMessageBytes} byte limit");
            continue;
          }

          if (message.MessageType == WebSocketMessageType.Text)
          {
            ProcessIncomingMessage(message.Text);
          }
        }
      }
      catch (OperationCanceledException)
      {
        // Normal cancellation
      }
      catch (Exception ex)
      {
        ErrorOccurred?.Invoke(this, $"Receive error: {ex.Message}");
      }
    }

    private void ProcessIncomingMessage(string message)
    {
      try
      {
        var jsonObj = JObject.Parse(message);

        // Check if this is a command response (for GetAppOptions, CreateConnection)
        var waiter = _responseWaiter;
        if (waiter != null && !waiter.Task.IsCompleted && IsResponseTo(jsonObj, _pendingRequestId))
        {
          waiter.TrySetResult(message);
          return;
        }

        // All other messages should have a conID and go to MessageReceived event
        if (jsonObj.ContainsKey("conID"))
        {
          Guid conID = Guid.Parse(jsonObj["conID"]?.ToString() ?? string.Empty);
          MessageReceived?.Invoke(this, (conID, message));
        }
        else
        {
          // Message without conID - still invoke event with empty GUID
          MessageReceived?.Invoke(this, (Guid.Empty, message));
        }
      }
      catch (Exception ex)
      {
        ErrorOccurred?.Invoke(this, $"Message processing error: {ex.Message}");
      }
    }

    public void Dispose()
    {
      _cancellationTokenSource?.Cancel();
      _cancellationTokenSource?.Dispose();
      _client?.Dispose();
      _sendLock.Dispose();
      _requestLock.Dispose();
    }
  }
}
