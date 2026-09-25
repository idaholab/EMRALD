using System;
using System.Net;
using System.Threading.Tasks;

namespace WebSocketTestServer
{
    // This is an AI generated Minimal WebSocket server for EMRALD-style coupling. The connection handling lives in
    // CouplingServer, which supports many sockets at once so EMRALD can run coupled sims on multiple threads.
    //
    // To customize for your coupling server:
    // - Adjust the listening URL/port in Main (`url` variable).
    // - See CouplingServer and ConnectionStateMachine for the per-connection handling.
    public class Program
    {
        // Set to false to suppress console logging even in debug builds (e.g. during tests)
        public static bool LogMessages { get; set; } = true;

        // Entry point: starts the HTTP listener and hands off WebSocket requests.
        static async Task Main(string[] args)
        {
            // Customize: change URL/port to your desired endpoint.
            string url = "http://localhost:8465/";
            HttpListener listener = new HttpListener();
            listener.Prefixes.Add(url);
            listener.Start();
            var server = new CouplingServer();

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
                    // Each socket is processed on its own task so many clients can be served at once.
                    server.AcceptWebSocket(context);
                }
                else
                {
                    context.Response.StatusCode = 400;
                    context.Response.Close();
                }
            }
        }
    }
}
