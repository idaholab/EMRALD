using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using CouplingWebSocket;
using MessageDefLib;
using Newtonsoft.Json;

namespace CouplingWebSocket
{
  public class WebApiCoupling : ISimMessaging, IDisposable
  {
    private WebSocketClient _client;
    private TEventCallBack _evCallBackFunc = null;
    private IMessageForm _form = null;
    private List<string> _resourceNames = new List<string>();
    private string _serverUrl;
    private string _clientName;
    private Guid _connectionId;
    private bool _isConnected = false;

    /// <summary>
    /// Create a new WebApiCoupling instance
    /// </summary>
    /// <param name="serverUrl">WebSocket server URL</param>
    /// <param name="clientName">Name of this client</param>
    public WebApiCoupling(string serverUrl, string clientName)
    {
      _serverUrl = serverUrl;
      _clientName = clientName;
      _client = new WebSocketClient();

      // Subscribe to client events
      _client.MessageReceived += OnMessageReceived;
      _client.ErrorOccurred += OnErrorOccurred;
      _client.Connected += OnConnected;
      _client.Disconnected += OnDisconnected;
    }

    /// <summary>
    /// Initialize the connection and get resources
    /// </summary>
    public async Task InitializeAsync()
    {
      try
      {
        // Connect to server
        await _client.ConnectAsync(_serverUrl);

        // Get resources (app options)
        _resourceNames = await _client.GetAppOptions();

        // Create connection with the client name
        if (_resourceNames.Count > 0)
        {
          _connectionId = await _client.CreateConnection(_clientName);
          _isConnected = true;
        }
      }
      catch (Exception ex)
      {
        _isConnected = false;
        throw new InvalidOperationException($"Failed to initialize WebApiCoupling: {ex.Message}", ex);
      }
    }

    /// <summary>
    /// Set the event callback function
    /// </summary>
    public TEventCallBack evCallBackFunc
    {
      set { _evCallBackFunc = value; }
    }

    /// <summary>
    /// Send a message to a specific resource and client
    /// </summary>
    public bool SendMessage(TMsgWrapper msg, string resAndClient)
    {
      if (!_isConnected)
      {
        return false;
      }

      try
      {
        // Serialize the message to JSON
        string jsonMessage = JsonConvert.SerializeObject(msg);

        // Send the message asynchronously
        Task.Run(async () =>
        {
          await _client.SendActionMsg(jsonMessage);
        }).Wait();

        return true;
      }
      catch (Exception)
      {
        return false;
      }
    }

    /// <summary>
    /// Get the count of available resources
    /// </summary>
    public int ResourceCnt()
    {
      return _resourceNames?.Count ?? 0;
    }

    /// <summary>
    /// Get the list of available resources
    /// </summary>
    public List<string> GetResources()
    {
      return new List<string>(_resourceNames);
    }

    /// <summary>
    /// Check if a specific resource exists
    /// </summary>
    public bool HasResource(string name)
    {
      if (_resourceNames == null || string.IsNullOrEmpty(name))
      {
        return false;
      }

      return _resourceNames.Contains(name);
    }

    /// <summary>
    /// Set the message form for UI updates
    /// </summary>
    public void SetForm(IMessageForm form)
    {
      _form = form;
    }

    /// <summary>
    /// Handle incoming raw messages and deserialize
    /// </summary>
    private void OnMessageReceived(object sender, string rawMessage)
    {
      try
      {
        // Try to deserialize as TMsgWrapper
        var msg = JsonConvert.DeserializeObject<TMsgWrapper>(rawMessage);

        if (msg != null)
        {
          // Successfully deserialized - call the event callback
          if (_evCallBackFunc != null)
          {
            _evCallBackFunc(_clientName, msg);
          }

          // Call the form's incoming EMERALD message handler if set
          if (_form != null)
          {
            _form.IncomingEMRALDMsg(_clientName, msg);
          }
        }
      }
      catch (JsonException)
      {
        // Failed to deserialize as TMsgWrapper
        // Call the form's incoming other message handler if set
        if (_form != null)
        {
          _form.IncomingOtherMsg(_clientName, rawMessage);
        }
      }
      catch (Exception ex)
      {
        // Other errors
        if (_form != null)
        {
          _form.IncomingOtherMsg(_clientName, $"Error processing message: {ex.Message}");
        }
      }
    }

    private void OnErrorOccurred(object sender, string error)
    {
      // Notify form of errors if set
      if (_form != null)
      {
        _form.IncomingOtherMsg(_clientName, $"Error: {error}");
      }
    }

    private void OnConnected(object sender, EventArgs e)
    {
      _isConnected = true;

      if (_form != null)
      {
        _form.OnConnectCng();
      }
    }

    private void OnDisconnected(object sender, EventArgs e)
    {
      _isConnected = false;

      if (_form != null)
      {
        _form.OnConnectCng();
      }
    }

    /// <summary>
    /// Disconnect and cleanup
    /// </summary>
    public async Task DisconnectAsync()
    {
      if (_client != null && _isConnected)
      {
        await _client.DisconnectAsync();
      }
      _isConnected = false;
    }

    public void Dispose()
    {
      if (_isConnected)
      {
        Task.Run(async () => await DisconnectAsync()).Wait();
      }

      _client?.Dispose();
    }
  }
}