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
    private Task _receiveTask;

    // Event for incoming messages - now just raw strings
    public event EventHandler<string> MessageReceived;
    public event EventHandler<string> ErrorOccurred;
    public event EventHandler Connected;
    public event EventHandler Disconnected;

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
        await _client.ConnectAsync(new Uri(url), _cancellationTokenSource.Token);
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

      string response = await SendRequestAsync(request);

      // Parse the response {"names":["app1","app2",...]}
      var jsonResponse = JObject.Parse(response);
      var names = jsonResponse["names"]?.ToObject<List<string>>() ?? new List<string>();

      return names;
    }

    /// <summary>
    /// Create a connection for a specific app
    /// Returns GUID for the created connection
    /// </summary>
    public async Task<Guid> CreateConnection(string appName)
    {
      EnsureConnected();

      var request = new
      {
        command = "CreateConnection",
        appName = appName
      };

      string response = await SendRequestAsync(request);

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
    /// Send an action message (as JSON string)
    /// </summary>
    public async Task SendActionMsg(string actionJson)
    {
      EnsureConnected();

      var request = new
      {
        command = "SendActionMsg",
        action = JObject.Parse(actionJson)
      };

      var jsonRequest = JsonConvert.SerializeObject(request);
      await SendMessageAsync(jsonRequest);
    }

    /// <summary>
    /// Send a raw JSON message directly
    /// </summary>
    public async Task SendMessage(string jsonMessage)
    {
      EnsureConnected();
      await SendMessageAsync(jsonMessage);
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
        );
      }

      _cancellationTokenSource.Cancel();

      if (_receiveTask != null)
      {
        await _receiveTask;
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

    private async Task<string> SendRequestAsync(object request, int timeoutMs = 5000)
    {
      var json = JsonConvert.SerializeObject(request);
      await SendMessageAsync(json);
      return await WaitForResponse(timeoutMs);
    }

    private async Task SendMessageAsync(string message)
    {
      byte[] messageBytes = Encoding.UTF8.GetBytes(message);
      await _client.SendAsync(
          new ArraySegment<byte>(messageBytes),
          WebSocketMessageType.Text,
          true,
          _cancellationTokenSource.Token
      );
    }

    private TaskCompletionSource<string> _responseWaiter;

    private async Task<string> WaitForResponse(int timeoutMs = 5000)
    {
      _responseWaiter = new TaskCompletionSource<string>();

      var timeoutTask = Task.Delay(timeoutMs);
      var completedTask = await Task.WhenAny(_responseWaiter.Task, timeoutTask);

      if (completedTask == timeoutTask)
      {
        _responseWaiter = null;
        throw new TimeoutException("Timeout waiting for server response");
      }

      var result = await _responseWaiter.Task;
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
          );

          if (result.MessageType == WebSocketMessageType.Close)
          {
            await _client.CloseAsync(
                WebSocketCloseStatus.NormalClosure,
                "Server closed",
                CancellationToken.None
            );
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
        // Check if this is a command response (for GetAppOptions, CreateConnection)
        if (_responseWaiter != null && !_responseWaiter.Task.IsCompleted)
        {
          var jsonObj = JObject.Parse(message);

          // If it has "names" or "conID", it's a command response
          if (jsonObj.ContainsKey("names") || jsonObj.ContainsKey("conID"))
          {
            _responseWaiter.SetResult(message);
            return;
          }
        }

        // All other messages go to the MessageReceived event as raw strings
        MessageReceived?.Invoke(this, message);
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
