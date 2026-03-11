// Minimal stub simulation used by the state machine; replace with your real simulator.
// Implement load/start/pause/time-step semantics and expose watched variables (e.g., epsilon3, T_FW, simTime).
using System;
using System.Text.Json.Nodes;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.VisualBasic;

namespace WebSocketTestServer
{
    /// <summary>
    /// Simple stub simulation used by the state machine for testing.
    /// epsilon3: leak flow rate in gallons per minute.
    /// T_FW: placeholder variable that can be read/assigned.
    /// </summary>
    internal class ExampleSim
    {
        private readonly object _lock = new object();
        private double _totalVolume; // gallons
        //private double _totalTritium; // arbitrary units based on release rate
        private readonly ManualResetEventSlim _resumeEvent = new ManualResetEventSlim(true);
        private Task? _runTask;
        private CancellationTokenSource? _cts;
        private Action<double>? _onTimeStep;

        public TimeSpan simTimeStep = TimeSpan.FromSeconds(1); // each iteration represents one second of sim time


        private TimeSpan _simTime;


        public double epsilon3 { get; set; } // gallons per minute
        public double T_FW { get; set; } = 0;
        public TimeSpan simTime {get {return _simTime;}}

        public double TotalVolume
        {
            get { lock (_lock) { return _totalVolume; } }
        }

        public double TotalTritium
        {
            get { lock (_lock) { return T_FW; } }
        }

        public bool HasStarted => _runTask != null;

        public ExampleSim()
        {
            epsilon3 = 0; // starts at 0; will be set via incoming messages.
        }

        public void Start(Action<double>? onTimeStep = null)
        {
            if (_runTask != null)
                return;

            // Preserve any previously registered callback unless a new one is provided.
            if (onTimeStep != null)
            {
                _onTimeStep = onTimeStep;
            }
            _cts = new CancellationTokenSource();
            _runTask = Task.Run(() => Run(_cts.Token));
        }

        public void SetOnTimeStep(Action<double>? onTimeStep)
        {
            _onTimeStep = onTimeStep;
        }

        public void Reset()
        {
            // Stop any running loop
            var cts = _cts;
            var runTask = _runTask;
            if (cts != null)
            {
                try { cts.Cancel(); } catch { /* ignore */ }
            }

            if (runTask != null)
            {
                try { runTask.Wait(200); } catch { /* ignore */ }
            }

            _runTask = null;
            _cts = null;
            _onTimeStep = null;
            _resumeEvent.Set(); // allow next Start to run immediately

            lock (_lock)
            {
                _simTime = TimeSpan.Zero;
                _totalVolume = 0;
                T_FW = 0;
                epsilon3 = 0;
            }
        }

        public void Load(string modelLoc, int? seed, JsonObject configStuff )
        {
            // do setup here using seed, modelLoc json info (timestep or such) as needed
            
        }

        private void Run(CancellationToken token)
        {
            double timeSeconds = 0;
            const double secondsPerMinute = 60.0;
            const double tritiumPerGallon = 250.0;

            try
            {
                while (true)
                {
                    token.ThrowIfCancellationRequested();
                    _resumeEvent.Wait(token); // block when paused

                    timeSeconds += simTimeStep.TotalSeconds;
                    _simTime = TimeSpan.FromSeconds(timeSeconds);

                    lock (_lock)
                    {
                        // accumulate leak volume for this step (gallons)
                        var leakThisStep = epsilon3 * (simTimeStep.TotalSeconds / secondsPerMinute);
                        _totalVolume += leakThisStep;

                        // compute tritium release based on leaked volume
                        T_FW += leakThisStep * tritiumPerGallon;
                    }

                    var callback = _onTimeStep;
                    callback?.Invoke(timeSeconds);

                    // small real delay to approximate simulated calculation time
                    Thread.Sleep(10); // 0.01s per simulated second
                }
            }
            catch (OperationCanceledException)
            {
                // expected on reset/shutdown
            }
        }

        public void Pause() => _resumeEvent.Reset();

        public void Resume() => _resumeEvent.Set();
    }
}
