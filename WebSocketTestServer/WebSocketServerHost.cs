using System;
using System.Net;
using System.Net.Sockets;
using System.Net.WebSockets;
using System.Threading;
using System.Threading.Tasks;

namespace WebSocketTestServer
{
  /// <summary>
  /// Lightweight host wrapper so tests can start/stop the WebSocket server in-process.
  /// </summary>
  public sealed class WebSocketServerHost : IAsyncDisposable, IDisposable
  {
    private readonly HttpListener _listener = new();
    private readonly CancellationTokenSource _cts = new();
    private Task? _acceptLoop;

    public Uri WsUri { get; private set; } = null!;

    public async Task StartAsync()
    {
      int port = GetFreePort();
      string httpUrl = $"http://localhost:{port}/";
      WsUri = new Uri(httpUrl.Replace("http", "ws"));

      _listener.Prefixes.Add(httpUrl);
      _listener.Start();
      _acceptLoop = Task.Run(() => AcceptLoopAsync(_cts.Token), _cts.Token);

      await Task.CompletedTask;
    }

    private async Task AcceptLoopAsync(CancellationToken token)
    {
      try
      {
        while (!token.IsCancellationRequested)
        {
          var contextTask = _listener.GetContextAsync();
          var completed = await Task.WhenAny(contextTask, Task.Delay(Timeout.Infinite, token));
          if (completed != contextTask)
            break; // cancelled

          var context = contextTask.Result;
          if (context.Request.IsWebSocketRequest)
            Program.ProcessWebSocketRequest(context);
          else
          {
            context.Response.StatusCode = 400;
            context.Response.Close();
          }
        }
      }
      catch (HttpListenerException)
      {
        // Listener stopped; exit loop.
      }
    }

    public async ValueTask DisposeAsync()
    {
      _cts.Cancel();
      _listener.Stop();

      // Cancel all active connection state machines so their dispatcher tasks exit
      foreach (var conn in Program.GetActiveConnections())
        conn.StateMachine?.Cancel();

      if (_acceptLoop is not null)
        await _acceptLoop;
      _listener.Close();
      _cts.Dispose();
    }

    // Synchronous dispose for classic 'using' support.
    public void Dispose() => DisposeAsync().AsTask().GetAwaiter().GetResult();

    private static int GetFreePort()
    {
      var listener = new TcpListener(IPAddress.Loopback, 0);
      listener.Start();
      int port = ((IPEndPoint)listener.LocalEndpoint).Port;
      listener.Stop();
      return port;
    }
  }
}
