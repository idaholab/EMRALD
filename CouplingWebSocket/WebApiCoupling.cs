using System;
using System.Collections;
using System.Collections.Generic;
using System.ComponentModel;
using System.Threading.Tasks;
using CouplingWebSocket;
using MessageDefLib;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

namespace CouplingWebSocket
{
  public class WebApiCoupling : ISimMessaging, IDisposable
  {
    private WebSocketClient _client;
    private TEventCallBack _evCallBackFunc = null;
    private IMessageDispHandling _form = null;
    private List<string> _resourceOptions = new List<string>();
    private Dictionary<Guid, string> _connectedApps = new Dictionary<Guid, string>(); //connectionID to current connected app name in EMRALD
    private Dictionary<string, Guid> _connectedIDs = new Dictionary<string, Guid>(); //current connected app names in EMRALD to connectionID
    private string _serverUrl;
    private bool _isConnected;
    private string _connectionPassword;
    private int _frameRate;

    // Interface property implementations
    public string connectionPassword
    {
      get { return _connectionPassword; }
      set { _connectionPassword = value; }
    }

    public int simFrameRate
    {
      get { return _frameRate; }
      set { _frameRate = value; }
    }


    /// <summary>
    /// Create a new WebApiCoupling instance
    /// </summary>
    /// <param name="serverUrl">WebSocket server URL</param>
    /// <param name="clientName">Name of this client</param>
    public WebApiCoupling(string serverUrl)
    {
      _serverUrl = serverUrl;
      _client = new WebSocketClient();

      // Subscribe to client events
      _client.MessageReceived += OnMessageReceived;
      _client.ErrorOccurred += OnErrorOccurred;
      _client.Connected += OnConnected;
      _client.Disconnected += OnDisconnected;

      try
      {
        // Block until connection completes
        _client.ConnectAsync(_serverUrl)
               .GetAwaiter()
               .GetResult();

        // Block until app options come back
        _resourceOptions = _client.GetAppOptions()
                                  .GetAwaiter()
                                  .GetResult();

        _isConnected = true;
      }
      catch (Exception ex)
      {
        _isConnected = false;
        throw new InvalidOperationException(
            $"Failed to initialize WebApiCoupling: {ex.Message}", ex);
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
    /// Start up a specific application by name
    /// </summary>
    /// <param name="appName">Name of the application to start</param>
    /// <returns>GUID of the created connection</returns>
    public async Task<Guid> StartupApp(string appName, List<string> watchItems)
    {
      Guid retGuid;

      // Create connection with the app name
      if (_resourceOptions.Contains(appName))
      {
        retGuid = await _client.CreateConnection(appName, watchItems);
        _connectedApps.Add(retGuid, appName);
        _connectedIDs.Add(appName, retGuid);
        _isConnected = true;
        return retGuid;
      }
      else
      {
        throw new Exception("Invalid app name or unavailable to couple with");
      }
    }

    /// <summary>
    /// Send a message to a specific resource and client
    /// </summary>
    public bool SendMessage(TMsgWrapper msg, string appInfo)
    {
      if (!_isConnected)
      {
        return false;
      }

      try
      {
        // Serialize the message to JSON
        string jsonMessage = JsonConvert.SerializeObject(msg);

        //if it is a atOpenSim message then do a CreateConnection 

        // Send the message asynchronously
        Task.Run(async () =>
        {
          await _client.SendActionMsg(_connectedIDs[appInfo], jsonMessage);
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
      return _resourceOptions?.Count ?? 0;
    }

    /// <summary>
    /// Get the list of available resources
    /// </summary>
    public List<string> GetResources()
    {
      return new List<string>(_resourceOptions);
    }

    /// <summary>
    /// Check if a specific resource exists
    /// </summary>
    public bool HasResource(string name)
    {
      if (_resourceOptions == null || string.IsNullOrEmpty(name))
      {
        return false;
      }

      return _resourceOptions.Contains(name);
    }

    /// <summary>
    /// Set the message form for UI updates
    /// </summary>
    public void SetUICallbacks(IMessageDispHandling form)
    {
      _form = form;
    }

    /// <summary>
    /// Handle incoming raw messages and deserialize
    /// </summary>
    private async void OnMessageReceived(object sender, (Guid conID, string message) e)
    {
      // Wait for the connection to be registered in _connectedApps
      const int maxWaitMs = 5000; // 5 second timeout
      const int checkIntervalMs = 50; // Check every 50ms
      int elapsedMs = 0;

      while (!_connectedApps.ContainsKey(e.conID) && elapsedMs < maxWaitMs)
      {
        await Task.Delay(checkIntervalMs);
        elapsedMs += checkIntervalMs;
      }

      // If still not found, handle the error
      if (!_connectedApps.ContainsKey(e.conID))
      {
        string errorMsg = $"Connection ID {e.conID} not found after {maxWaitMs}ms timeout";
        if (_form != null)
        {
          _form.IncomingOtherMsg("", $"Error: {errorMsg}");
        }
        return; // Exit early
      }

      try
      {
        // First parse the wrapper that contains conID and message
        var jsonObj = JObject.Parse(e.message);
        Console.WriteLine("Recieved : " + e.message);

        // Extract just the "message" property which contains the TMsgWrapper
        var messageJson = jsonObj["message"]?.ToString();

        if (messageJson != null)
        {
          // Now deserialize the actual TMsgWrapper
          var msg = JsonConvert.DeserializeObject<TMsgWrapper>(messageJson);

          if (msg != null)
          {
            // Successfully deserialized - call the event callback
            if (_evCallBackFunc != null)
            {
              _evCallBackFunc(_connectedApps[e.conID], msg);
            }
            // Call the form's incoming EMERALD message handler if set
            if (_form != null)
            {
              _form.IncomingEMRALDMsg(_connectedApps[e.conID], msg);
            }
          }
        }
        else
        {
          // No "message" property found - treat as other message
          if (_form != null)
          {
            _form.IncomingOtherMsg(_connectedApps[e.conID], e.message);
          }
        }
      }
      catch (JsonException)
      {
        // Failed to deserialize as TMsgWrapper
        // Call the form's incoming other message handler if set
        if (_form != null)
        {
          _form.IncomingOtherMsg(_connectedApps[e.conID], e.message);
        }
      }
      catch (Exception ex)
      {
        // Other errors
        if (_form != null)
        {
          _form.IncomingOtherMsg(_connectedApps[e.conID], $"Error processing message: {ex.Message}");
        }
      }
    }

    private void OnErrorOccurred(object sender, string error)
    {
      // Notify form of errors if set
      if (_form != null)
      {
        _form.IncomingOtherMsg("", $"Error: {error}");
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