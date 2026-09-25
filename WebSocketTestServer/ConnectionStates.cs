// How to adapt these states for your simulation:
// - Idle: parse OpenSim, stash metadata, set any time offset from action.time; branch if you have multiple apps.
// - Loading.EnterAsync: actually load your model/config/seed into the sim; send etSimLoaded when ready; on failure set LastError and go Error.
// - Waiting: apply atCompModify to your sim, capture atTimer by setting NextCallbackTime/PendingCallbackItem, handle cancel/continue.
// - Running.EnterAsync: wire the sim’s timestep callback to HandleTimeStepAsync, start or resume the sim.
// - Running.HandleTimeStepAsync: watched for value changes requested by EMRALD and send etCompEv as shown; if timer due, send etTimer and goto Waiting.
// - Done: emit any final values; only allow Continue (back to Idle) or Terminate.
// - Error/NotRunning: keep minimal handling; extend if you need custom recovery.
// Keep business logic per state; shared data lives on ConnectionStateMachine.

using System.Threading.Tasks;
using MessageDefLib;
using System.Text.Json.Nodes;

namespace WebSocketTestServer
{
    /// <summary>
    /// Base state for connection handling. Derived states override HandleAsync.
    /// </summary>
    internal abstract class ConnectionState
    {
        protected ConnectionState(ConnectionStateMachine machine, SimulationState kind)
        {
            Machine = machine;
            Kind = kind;
        }

        protected ConnectionStateMachine Machine { get; }
        internal SimulationState Kind { get; }

        internal virtual Task EnterAsync() => Task.CompletedTask;
        internal virtual Task ExitAsync() => Task.CompletedTask;
        internal abstract Task HandleAsync(SimAction action);

        protected Task SendEventAsync(SimEventType type, ItemData data = null!, string displayName = null!) =>
            Machine.SendEventAsync(type, data, displayName);

        protected Task SendStatusAsync(StatusType status, string displayName = null!) =>
            Machine.SendStatusAsync(status, displayName);
    }

    internal sealed class IdleState : ConnectionState
    {
        // Waiting for an OpenSim/connect-style message to start a run; no active simulation context yet.
        public IdleState(ConnectionStateMachine machine) : base(machine, SimulationState.Idle) { }

        internal override async Task HandleAsync(SimAction action)
        {
            switch (action.actType)
            {
                case SimActionType.atOpenSim:
                    Machine.ClearData(); // stub: clear any old data/context
                    
                    //could do optimization here if Machine.Simulation has already been loaded then 
                    //reset or clear instead of creating again.
                    Machine.SetSimMetadata(action.simInfo);
                    if (action.time.HasValue)
                    {
                        Machine.SetLocalTimeOffset(action.time.Value);
                    }

                    await Machine.RequestTransitionAsync(SimulationState.Loading, requireDrain: true);
                    break;

                case SimActionType.atTerminate:
                    Machine.ClearData();
                    await Machine.RequestTransitionAsync(SimulationState.NotRunning, requireDrain: true);
                    break;

                default:
                    await SendStatusAsync(StatusType.stError, $"Invalid action {action.actType} in Idle state");
                    break;
            }
        }
    }

    internal sealed class LoadingState : ConnectionState
    {
        // Performing any startup/loading work before the simulation can accept runtime actions.
        public LoadingState(ConnectionStateMachine machine) : base(machine, SimulationState.Loading) { }

        internal override async Task EnterAsync()
        {
            Machine.Loaded = false;
            try
            {
                // TODO: load the model here using available data:
                // - Machine.ModelPath
                // - Machine.ConfigData
                // - Machine.Seed
                // - Machine.MaxSimulationTime

                // Config data is optional; parse to an object if provided, otherwise fall back to an empty object.
                JsonObject configJson = new JsonObject();
                if (!string.IsNullOrWhiteSpace(Machine.ConfigData))
                {
                    var parsed = JsonNode.Parse(Machine.ConfigData!);
                    if (parsed is JsonObject obj)
                    {
                        configJson = obj;
                    }
                    else
                    {
                        await SendStatusAsync(StatusType.stError, "ConfigData must be a JSON object; using empty object instead");
                    }
                }

                // Initialize the simulation with model path and seed; time step defaults internally.
                Machine.Simulation.Load(Machine.ModelPath ?? string.Empty, Machine.Seed, configJson);
                Machine.Loaded = true;

                // Signal load completion; But continue to Waiting state.
                await SendEventAsync(SimEventType.etSimLoaded, displayName: "Sim loaded");
                await Machine.RequestTransitionAsync(SimulationState.Waiting, requireDrain: false);
            }
            catch 
            {
                //write the error
                Machine.LastError = "Failed to Load model."; 
                await Machine.RequestTransitionAsync(SimulationState.Error, requireDrain: false);
            }

        }

        internal override async Task HandleAsync(SimAction action)
        {
            await SendStatusAsync(StatusType.stError, $"Action {action.actType} not allowed in Loading state");
        }
    }

    internal sealed class WaitingState : ConnectionState
    {
        // Paused/idle between run steps, waiting for continue/timer/component updates.
        public WaitingState(ConnectionStateMachine machine) : base(machine, SimulationState.Waiting) { }

        internal override async Task HandleAsync(SimAction action)
        {
            switch (action.actType)
            {
                case SimActionType.atCompModify:
                    try
                    {
                        // TODO: apply the component modification to the simulation model using action.itemData.
                        switch (action.itemData.nameId)
                        {
                            case "epsilon3":
                                Machine.Simulation.epsilon3 = double.Parse(action.itemData.value); 
                                break;
                            case "T_FW":
                                Machine.Simulation.T_FW = double.Parse(action.itemData.value); 
                                break;
                            default:
                                await SendStatusAsync(StatusType.stError, $"Invalid compModify, {action.itemData.nameId} not a valid name");
                                break;
                        }                                               
                    }
                    catch
                    {
                        Machine.LastError = "atCompModify, Failed to assign - " + action.itemData.nameId;
                        await Machine.RequestTransitionAsync(SimulationState.Error, requireDrain: false);
                    }
                    break;

                case SimActionType.atTimer:
                    // Set the next callback time and store itemData for the callback.
                    Machine.SetNextCallback(action.time);
                    Machine.SetPendingCallbackItem(action.itemData);
                    break;

                case SimActionType.atCancelSim:
                    // EMRALD sent a message to cancel the simulation
                    // TODO: save any progress or results if desired, stop the simulation, and clean up.
                    await SendEventAsync(SimEventType.etEndSim, displayName: "Simulation cancelled (stub)");
                    await Machine.RequestTransitionAsync(SimulationState.Done, requireDrain: false);
                    break;

                case SimActionType.atContinue:
                    // Before resuming, honor any callback that is already due at the current sim time.
                    // This covers the case where a variable change and a timer align in the same timestep.
                    var simTime = Machine.GlobalSimTime;
                    var next = Machine.NextCallbackTime;                   

                    // If the next callback time has arrived, emit it and stay in Waiting.
                    if (next.HasValue && simTime >= next.Value)
                    {
                        var pending = Machine.PendingCallbackItem;
                        Machine.Simulation.Pause();
                        await SendEventAsync(SimEventType.etTimer, pending!, "Timer callback");
                        Machine.SetNextCallback(null);
                        Machine.SetPendingCallbackItem(null);
                        return; // already in Waiting; no transition needed
                    }
                    else
                    {
                        // Otherwise proceed to Running so the sim can advance time.
                        await Machine.RequestTransitionAsync(SimulationState.Running, requireDrain: true);                        
                    }
                    break;

                default:
                    await SendStatusAsync(StatusType.stError, $"Action {action.actType} not allowed in Waiting state");
                    break;
            }
        }
    }

    internal sealed class RunningState : ConnectionState
    {
        // Active simulation execution; may emit status/events and advance time.
        public RunningState(ConnectionStateMachine machine) : base(machine, SimulationState.Running) { }

        private double _lastTFW;

        internal override Task EnterAsync()
        {
            Machine.Simulation.SetOnTimeStep(time => _ = HandleTimeStepAsync(time));
            _lastTFW = Machine.Simulation.T_FW;

            if (!Machine.Simulation.HasStarted)
            {
                Machine.Simulation.Start();
            }
            else
            {
                Machine.Simulation.Resume();
            }
            return Task.CompletedTask;
        }

        internal override Task ExitAsync()
        {
            Machine.Simulation.Pause();
            return Task.CompletedTask;
        }

        internal override async Task HandleAsync(SimAction action)
        {
            if (action.actType == SimActionType.atContinue)
                return; // ignore continue while already running

            if (action.actType == SimActionType.atCancelSim)
            {
                // Mirror Waiting state's cancel behavior.
                Machine.Simulation.Pause();
                await SendEventAsync(SimEventType.etEndSim, displayName: "Simulation cancelled (stub)");
                await Machine.RequestTransitionAsync(SimulationState.Done, requireDrain: true);
                return;
            }

            if (action.actType == SimActionType.atTerminate)
            {
                Machine.Simulation.Pause();
                await Machine.RequestTransitionAsync(SimulationState.NotRunning, requireDrain: true);
                return;
            }

            // TODO: implement simulation runtime loop/processing here.
            await SendStatusAsync(StatusType.stError, $"Action {action.actType} not allowed in Running state");
        }

        private async Task HandleTimeStepAsync(double simSeconds)
        {
            var simTime = Machine.GlobalSimTime;
            var next = Machine.NextCallbackTime;

            // Detect changes to T_FW and send event when it changes - but only call back if the
            // watch item's WatchEventCriteria rule (if any) is satisfied. When EMRALD attaches no rule this
            // reports on every change as before; a rule lets the sim keep running silently until it
            // becomes true, reducing callback chatter.
            var sim = Machine.Simulation;
            if (sim.T_FW != _lastTFW)
            {
                _lastTFW = sim.T_FW;
                if (Machine.ShouldReport("T_FW"))
                {
                    await SendEventAsync(SimEventType.etCompEv, new ItemData("T_FW", sim.T_FW.ToString()), "T_FW Changed");
                    await Machine.RequestTransitionAsync(SimulationState.Waiting, requireDrain: false);
                    return; // pause on value change; timer will be evaluated on the next pass
                }
                // rule not satisfied - keep running without notifying EMRALD
            }

            // If we've reached or will pass the next EMRALD callback time, emit the timer event and pause.
            
            if (next.HasValue && simTime >= next.Value)
            {
                var pending = Machine.PendingCallbackItem;
                Machine.Simulation.Pause();
                await SendEventAsync(SimEventType.etTimer, pending!, "Timer callback");
                Machine.SetNextCallback(null);
                Machine.SetPendingCallbackItem(null);
                await Machine.RequestTransitionAsync(SimulationState.Waiting, requireDrain: false);
            }            
        }
    }

    internal sealed class DoneState : ConnectionState
    {
        // Simulation completed normally; only limited commands (status/terminate/restart) should be accepted.
        public DoneState(ConnectionStateMachine machine) : base(machine, SimulationState.Done) { }

        internal override async Task EnterAsync()
        {
            // TODO: send final variable values back to the client (e.g., totals and last-known values).
            var sim = Machine.Simulation;
            //await SendEventAsync(SimEventType.etCompEv, new ItemData("epsilon3", sim.epsilon3.ToString()), "Final epsilon3");
            //await SendEventAsync(SimEventType.etCompEv, new ItemData("T_FW", sim.T_FW.ToString()), "Final T_FW");
        }

        internal override async Task HandleAsync(SimAction action)
        {
            switch (action.actType)
            {
                case SimActionType.atContinue:
                    await Machine.RequestTransitionAsync(SimulationState.Idle, requireDrain: true);
                    break;

                case SimActionType.atTerminate:
                    await Machine.RequestTransitionAsync(SimulationState.NotRunning, requireDrain: true);
                    break;

                default:
                    await SendStatusAsync(StatusType.stError, $"Action {action.actType} not allowed in Done state");
                    break;
            }
        }
    }

    internal sealed class ErrorState : ConnectionState
    {
        // Terminal error condition; typically only status/terminate handling remains.
        public ErrorState(ConnectionStateMachine machine) : base(machine, SimulationState.Error) { }

        internal override async Task HandleAsync(SimAction action)
        {
            if (action.actType == SimActionType.atTerminate)
            {
                await Machine.RequestTransitionAsync(SimulationState.NotRunning, requireDrain: true);
                return;
            }
            if (action.actType == SimActionType.atContinue)
            {
                await Machine.RequestTransitionAsync(SimulationState.Idle, requireDrain: true);
                return;
            }

            await SendStatusAsync(StatusType.stError, $"Action {action.actType} not allowed in Error state");
        }
    }

    internal sealed class NotRunningState : ConnectionState
    {
        // Fully stopped state after termination; must re-open to proceed.
        public NotRunningState(ConnectionStateMachine machine) : base(machine, SimulationState.NotRunning) { }

        internal override async Task EnterAsync()
        {
            // Close the connection and clear any held data.
            await Machine.CloseConnectionAsync();
            Machine.ClearData();
        }

        internal override Task HandleAsync(SimAction action) =>
            SendStatusAsync(StatusType.stError, "State machine is terminated; invalid connection ID.");
    }
}
