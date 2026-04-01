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
    public async Task<Guid> CreateConnection(string appName, List<string> watchItems)
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
      var json = JsonConvert.SerializeObject(request);
      await SendMessageAsync(json).ConfigureAwait(false);
      return await WaitForResponse(timeoutMs ?? RequestTimeoutMs).ConfigureAwait(false);
    }

    private async Task SendMessageAsync(string message)
    {
#if DEBUG
      if (LogMessages) Console.WriteLine("Sent : " + message);
#endif
      byte[] messageBytes = Encoding.UTF8.GetBytes(message);
      await _client.SendAsync(
          new ArraySegment<byte>(messageBytes),
          WebSocketMessageType.Text,
          true,
          _cancellationTokenSource.Token
      ).ConfigureAwait(false);
    }

    private TaskCompletionSource<string>? _responseWaiter;

    private async Task<string> WaitForResponse(int timeoutMs)
    {
      _responseWaiter = new TaskCompletionSource<string>();

      var timeoutTask = Task.Delay(timeoutMs);
      var completedTask = await Task.WhenAny(_responseWaiter.Task, timeoutTask).ConfigureAwait(false);

      if (completedTask == timeoutTask)
      {
        _responseWaiter = null;
        throw new TimeoutException($"Timeout waiting for server response after {timeoutMs}ms");
      }

      var result = await _responseWaiter.Task.ConfigureAwait(false);
      _responseWaiter = null;
      return result;
    }

    private async Task ReceiveLoop()
    {
      byte[] buffer = new byte[8192];

      try
      {
        while (_client.State == WebSocketState.Open &&
               !_cancellationTokenSource.Token.IsCancellationRequested)
        {
          var result = await _client.ReceiveAsync(
              new ArraySegment<byte>(buffer),
              _cancellationTokenSource.Token
          ).ConfigureAwait(false);

          if (result.MessageType == WebSocketMessageType.Close)
          {
            await _client.CloseAsync(
                WebSocketCloseStatus.NormalClosure,
                "Server closed",
                CancellationToken.None
            ).ConfigureAwait(false);
            Disconnected?.Invoke(this, EventArgs.Empty);
            break;
          }

          if (result.MessageType == WebSocketMessageType.Text)
          {
            string message = Encoding.UTF8.GetString(buffer, 0, result.Count);
            ProcessIncomingMessage(message);
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
        if (_responseWaiter != null && !_responseWaiter.Task.IsCompleted)
        {
          // If it has "names" or "conID", it's a command response
          if (jsonObj.ContainsKey("names") || jsonObj.ContainsKey("conID"))
          {
            _responseWaiter.SetResult(message);
            return;
          }
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
    }
  }
}
