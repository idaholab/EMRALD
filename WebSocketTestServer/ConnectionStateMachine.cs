// How to adapt this file for your simulation + EMRALD coupling:
// 1) Swap in your simulation type for ExampleSim and expose the properties needed by states (start/pause/resume, time, watched values).
// 2) If you support multiple apps, extend AvailableApp and use _selectedApp to choose variants of your sim loader.
// 3) Map EMRALD metadata: ModelPath, ConfigData, Seed, MaxSimulationTime are supplied on OpenSim; use them when you load.
// 4) Add any connection-scoped data you need here; keep per-state logic in ConnectionStates.cs.
// 5) Keep state transitions funneled through RequestTransitionAsync; this ensures ordered, single-threaded state changes.
// 6) Program.cs already routes incoming actions to HandleActionAsync and sends JSON via SendMessage; change only if your transport differs.

using System;
using System.Net.WebSockets;
using System.Threading.Tasks;
using System.Collections.Concurrent;
using System.Threading;
using System.Threading.Tasks.Sources;
using MessageDefLib;
using Newtonsoft.Json;

namespace WebSocketTestServer
{
    /// <summary>
    /// List of example applications that can be reported to clients.
    /// Extend this enum to surface additional app names.
    /// </summary>
    internal enum AvailableApp
    {
        App1,
        App2,
        MooseEMRALDTranslation
    }

    /// <summary>
    /// States that drive the lifecycle of the simulated run exposed over WebSocket.
    /// </summary>
    internal enum SimulationState
    {
        NotRunning,
        Idle,
        Loading,
        Waiting,
        Running,
        Done,
        Error
    }

    /// <summary>
    /// Minimal connection state machine that holds common data and delegates to states.
    /// </summary>
    internal class ConnectionStateMachine
    {
        // the connection metadata stored for the client, including what items to send back notifications on when changed.
        private readonly ConnectionInfo _connection;
        // Which app is this connection is doing if implementing more than one app with the same state machine.
        private readonly AvailableApp? _selectedApp;
        // Current state of the state machine
        private ConnectionState _currentState;
        // Work dispatching
        private readonly ConcurrentQueue<Func<Task>> _priorityWork = new();
        private readonly ConcurrentQueue<Func<Task>> _normalWork = new();
        private readonly SemaphoreSlim _workSignal = new(0);
        private readonly CancellationTokenSource _dispatcherCts = new();
        private readonly Task _dispatcher;
        private static readonly AsyncLocal<bool> _onDispatcher = new();
        
        // Flag to indicate terminated.
        private bool _terminated;

        internal SimInfo? simInfo { get; private set; }

        // The time difference between the global simulation time and this one. When sending the time make sure to add the current sim time to this offset.
        internal TimeSpan LocalTimeOffset {get; private set;} = TimeSpan.Zero;
        //the global simulation time is the local plus the offset
        internal TimeSpan GlobalSimTime => Simulation.simTime + LocalTimeOffset;
        //Maximum simulation time this can run in GlobalSimTime provided on setup from the EMRALD model
        internal TimeSpan? MaxSimulationTime => simInfo?.endTime;
        //Path to a model or data needed by this simulation, if needed, provided by the EMRALD model
        internal string? ModelPath => simInfo?.model;
        // User defined configureation data from the EMRALD model. Whatever extra data is needed to run. This is probably JSON
        internal string? ConfigData => simInfo?.configData;
        // Seed to use for the run provided by the EMRALD model to reproduce execution.
        internal int? Seed => simInfo?.seed;
        // Total number of runs that are expected to be executed, probably can be ignored.
        internal int? NumberOfRuns => simInfo?.numRuns;
        // The simulation time for the next event on the EMRALD side that this simulation must do a callback.
        internal TimeSpan? NextCallbackTime { get; private set; }
        // Data specified from EMRALD when assigning the next time to callback for an EMRALD event.
        internal ItemData? PendingCallbackItem { get; private set; }
        internal SimulationState CurrentStateKind => _currentState?.Kind ?? SimulationState.Idle;

        //Has the model been loaded
        internal bool Loaded = false;

        //The last error, to be sent back when going into Error State
        internal string LastError = "";
        // Instance of the simulation tool used by this connection.
        public ExampleSim Simulation { get; } = new ExampleSim();


        /// <summary>
        /// Initialize the state machine for a specific client connection and seed it with the Idle state.
        /// Also attempts to parse the requested app name from the incoming connection info.
        /// </summary>
        /// <param name="connection">Connection metadata including socket and optional app name.</param>
        internal ConnectionStateMachine(ConnectionInfo connection)
        {
            _connection = connection ?? throw new ArgumentNullException(nameof(connection));

            if (!string.IsNullOrWhiteSpace(connection.AppName) &&
                Enum.TryParse(connection.AppName, ignoreCase: true, out AvailableApp parsed))
            {
                _selectedApp = parsed;
            }

            _currentState = CreateState(SimulationState.Idle);
            _ = _currentState.EnterAsync();
            _ = SendStatusAsync(MapStatus(SimulationState.Idle), $"State: {SimulationState.Idle}");
            _dispatcher = RunDispatcherAsync(_dispatcherCts.Token);
        }

        /// <summary>
        /// Route a client action to the active state; refuses processing once the machine is terminated.
        /// </summary>
        /// <param name="action">Client-requested simulation action.</param>
        /// <returns>Task that completes when the state finishes handling.</returns>
        /// <summary>
        /// Cancel the dispatcher and stop processing, used during shutdown.
        /// </summary>
        internal void Cancel()
        {
            _dispatcherCts.Cancel();
        }

        internal Task HandleActionAsync(SimAction action)
        {
            if (action == null)
                return Task.CompletedTask;

            return EnqueueWorkAsync(async () =>
            {
                if (_terminated)
                {
                    await SendStatusAsync(StatusType.stError, "State machine is terminated; invalid connection ID.");
                    return;
                }

                await _currentState.HandleAsync(action);
            });
        }

        /// <summary>
        /// Reset all simulation metadata and timers to defaults.
        /// </summary>
        internal void ClearData()
        {
            LocalTimeOffset = TimeSpan.Zero;
            simInfo = null;
            NextCallbackTime = null;
            PendingCallbackItem = null;
            Simulation.Reset();
        }

        internal void SetLocalTimeOffset(TimeSpan offset)
        {
            LocalTimeOffset = offset;
        }

        /// <summary>
        /// Record metadata about the model/config being executed.
        /// </summary>
        /// <param name="simInfo">information for seeting up the simulation to run.</param>
        internal void SetSimMetadata(SimInfo simInfo)
        {
            this.simInfo = simInfo;
        }

        /// <summary>
        /// Mark when the next callback should be emitted to the client.
        /// </summary>
        /// <param name="callbackTime">Sim time of next callback, or null to clear.</param>
        internal void SetNextCallback(TimeSpan? callbackTime) => NextCallbackTime = callbackTime;

        /// <summary>
        /// Cache the payload that will be sent with the next callback event.
        /// </summary>
        /// <param name="itemData">Optional item to include in the next event.</param>
        internal void SetPendingCallbackItem(ItemData? itemData) => PendingCallbackItem = itemData;

        /// <summary>
        /// Request a state transition with an option to run immediately (before queued work) or after queued work drains.
        /// </summary>
        /// <param name="next">Target state.</param>
        /// <param name="requireDrain">If true, enqueue at the tail; if false, enqueue with priority.</param>
        internal Task RequestTransitionAsync(SimulationState next, bool requireDrain)
        {
            return EnqueueWorkAsync(() => SetStateAsync(next), priority: !requireDrain);
        }

        /// <summary>
        /// Transition to a new simulation state, invoking exit/enter hooks and broadcasting status.
        /// </summary>
        /// <param name="next">The target state to enter.</param>
        private async Task SetStateAsync(SimulationState next)
        {
            var newState = CreateState(next);
            if (newState == null)
                return;

            if (_currentState != null)
            {
                await _currentState.ExitAsync();
            }

            _currentState = newState;
            var statusDescription = next == SimulationState.Error && !string.IsNullOrWhiteSpace(LastError)
                ? LastError
                : $"State: {next}";
            await SendStatusAsync(MapStatus(next), statusDescription);
            await _currentState.EnterAsync();

            if (next == SimulationState.NotRunning)
            {
                _terminated = true;
            }
        }

        /// <summary>
        /// Factory for state implementations corresponding to the given state enum.
        /// Defaults to Idle if an unexpected value is provided.
        /// </summary>
        /// <param name="kind">Requested state type.</param>
        /// <returns>Concrete ConnectionState instance.</returns>
        private ConnectionState CreateState(SimulationState kind) =>
            kind switch
            {
                SimulationState.NotRunning => new NotRunningState(this),
                SimulationState.Idle => new IdleState(this),
                SimulationState.Loading => new LoadingState(this),
                SimulationState.Waiting => new WaitingState(this),
                SimulationState.Running => new RunningState(this),
                SimulationState.Done => new DoneState(this),
                SimulationState.Error => new ErrorState(this),
                _ => new IdleState(this)
            };

        /// <summary>
        /// Create a message wrapper pre-populated with connection context and current time.
        /// </summary>
        /// <param name="displayName">Human-readable label for diagnostics.</param>
        /// <returns>Wrapper ready to be filled with events.</returns>
        internal TMsgWrapper CreateWrapper(string displayName) =>
            new TMsgWrapper(MessageType.mtSimEvent, displayName, GlobalSimTime);

        /// <summary>
        /// Send a simulation event to the client, optionally including item data.
        /// </summary>
        /// <param name="eventType">Type of event being raised.</param>
        /// <param name="itemData">Optional data associated with the event.</param>
        /// <param name="displayName">Friendly display name; defaults to the event type.</param>
        internal Task SendEventAsync(SimEventType eventType, ItemData itemData = null!, string displayName = null!)
        {
            var wrapper = CreateWrapper(displayName ?? $"Event: {eventType}");
            var simEvent = new SimEvent(eventType, GlobalSimTime)
            {
                status = MapStatus(CurrentStateKind)
            };
            if (itemData != null)
            {
                simEvent.itemData = itemData;
            }

            wrapper.simEvents.Add(simEvent);
            return SendWrapperAsync(wrapper);
        }

        /// <summary>
        /// Emit a status update event to the client describing current simulation state.
        /// </summary>
        /// <param name="status">Status flag to transmit.</param>
        /// <param name="displayName">Friendly display name; defaults to the status text.</param>
        internal Task SendStatusAsync(StatusType status, string displayName = null!)
        {
            var wrapper = CreateWrapper(displayName ?? $"Status: {status}");
            var statusEvent = new SimEvent(SimEventType.etStatus, GlobalSimTime)
            {
                status = status
            };

            wrapper.simEvents.Add(statusEvent);
            return SendWrapperAsync(wrapper);
        }

        /// <summary>
        /// Serialize and send a populated message wrapper over the client's WebSocket.
        /// </summary>
        /// <param name="wrapper">Message envelope containing events and metadata.</param>
        internal async Task SendWrapperAsync(TMsgWrapper wrapper)
        {
            var response = new
            {
                conID = _connection.ConID,
                message = wrapper
            };

            string json = JsonConvert.SerializeObject(response);
            await Program.SendMessage(_connection.Socket, json);
        }

        /// <summary>
        /// Attempt to gracefully close the underlying WebSocket connection.
        /// </summary>
        internal async Task CloseConnectionAsync()
        {
            try
            {
                if (_connection.Socket != null && _connection.Socket.State == WebSocketState.Open)
                {
                    await _connection.Socket.CloseAsync(WebSocketCloseStatus.NormalClosure, "Terminated", System.Threading.CancellationToken.None);
                }
            }
            catch
            {
                // ignore close failures
            }
        }

        /// <summary>
        /// Map internal simulation state to the outward-facing status enum used by clients.
        /// </summary>
        /// <param name="state">Simulation state being translated.</param>
        /// <returns>Corresponding status value.</returns>
        private static StatusType MapStatus(SimulationState state) =>
            state switch
            {
                SimulationState.Idle => StatusType.stIdle,
                SimulationState.Loading => StatusType.stLoading,
                SimulationState.Waiting => StatusType.stWaiting,
                SimulationState.Running => StatusType.stRunning,
                SimulationState.Done => StatusType.stDone,
                SimulationState.Error => StatusType.stError,
                _ => throw new ArgumentOutOfRangeException(nameof(state), state, "Unexpected simulation state")
            };

        private Task EnqueueWorkAsync(Func<Task> work, bool priority = false)
        {
            var tcs = new TaskCompletionSource(TaskCreationOptions.RunContinuationsAsynchronously);
            Func<Task> wrapped = async () =>
            {
                try
                {
                    await work();
                    tcs.TrySetResult();
                }
                catch (OperationCanceledException)
                {
                    tcs.TrySetCanceled();
                }
                catch (Exception ex)
                {
                    tcs.TrySetException(ex);
                }
            };

            // Avoid deadlock if enqueued from within dispatcher work.
            if (_onDispatcher.Value)
            {
                if (priority)
                {
                    // Immediate work: run inline to honor priority.
                    _ = wrapped();
                    return tcs.Task;
                }

                // Drain-after-current: queue it but don't block the dispatcher.
                _normalWork.Enqueue(wrapped);
                _workSignal.Release();
                return Task.CompletedTask;
            }

            if (priority)
                _priorityWork.Enqueue(wrapped);
            else
                _normalWork.Enqueue(wrapped);

            _workSignal.Release();
            return tcs.Task;
        }

        private async Task RunDispatcherAsync(CancellationToken token)
        {
            try
            {
                while (true)
                {
                    await _workSignal.WaitAsync(token);

                    while (_priorityWork.TryDequeue(out var pWork))
                    {
                        _onDispatcher.Value = true;
                        await pWork();
                        _onDispatcher.Value = false;
                    }

                    while (_normalWork.TryDequeue(out var work))
                    {
                        _onDispatcher.Value = true;
                        await work();
                        _onDispatcher.Value = false;
                    }
                }
            }
            catch (OperationCanceledException)
            {
                // shutdown
            }
        }
    }
}
