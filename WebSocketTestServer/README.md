# WebSocketTestServer

Minimal example of an EMRALD-coupled WebSocket server with a pluggable simulation. It accepts JSON actions from a controller, drives a per-connection state machine, and emits status / timer / value events back to the client.

## Quick Start
- Requirements: .NET 9 SDK, MessageDefLib (shared contract assembly) reachable at build time.
- Build: `dotnet build` (ensure the `ProjectReference` to CouplingWebSocket/MessageDefLib points to a writable local path).
- Run: `dotnet run` (listens on `http://localhost:8465/`).
- Connect: open a WebSocket to that URL and send JSON commands (see `Program.cs` for expected shapes).

## Project Layout
- `Program.cs` – WebSocket listener; dispatches incoming messages to connection state machines.
- `ConnectionStateMachine.cs` – shared connection data, timekeeping, dispatcher, and state transition API.
- `ConnectionStates.cs` – concrete states (Idle, Loading, Waiting, Running, Done, Error, NotRunning) implementing EMRALD-style behavior.
- `ExampleSim.cs` – stub simulator; replace with your real simulation implementation.
- `MsgWrapper.cs` – message contracts (pulled from MessageDefLib at runtime/build; local copy excluded to avoid conflicts).

## Adapting to Your Simulation
1) Replace `ExampleSim` with your simulator (load/start/pause/resume/time-step callback, watched variables).
2) In `ConnectionStateMachine`, map EMRALD metadata to your loader (model path, config JSON, seed, max time) and keep `GlobalSimTime` accurate for outbound events.
3) In `ConnectionStates`:
   - `Idle` handles `atOpenSim`; stash metadata and time offset.
   - `Loading.EnterAsync` loads your model/config and sends `etSimLoaded`.
   - `Waiting` applies `atCompModify`, sets timers via `atTimer`, and accepts `atContinue` / `atCancelSim`.
   - `Running.EnterAsync` hooks your time-step callback; `HandleTimeStepAsync` emits value changes (`etCompEv`) and timer callbacks (`etTimer`) then pauses to Waiting.
   - `Done` sends final values; only allows Continue (to Idle) or Terminate.
4) Keep all state changes going through `RequestTransitionAsync` to preserve ordering and single-threaded state mutations.

## Message Flow (simplified)
1) Client sends `GetAppOptions` → server returns available app names.
2) Client sends a `CreateConnection` command with the target `appName` and a `watchItems` array of `WatchItem` objects:

   ```json
   {
     "command": "CreateConnection",
     "appName": "App1",
     "watchItems": [
       { "name": "T_FW", "type": "double" },
       { "name": "valve_12", "type": "double", "WatchEventCriteria": "(valve_12 > 5) & (valve_12 < 10)" }
     ]
   }
   ```

   Each element of `watchItems` is a `MessageDefLib.WatchItem` carrying the EMRALD variable `name`, its `type`, and an optional `WatchEventCriteria` fParser boolean expression. When the expression is present, the server only sends callbacks while it evaluates to true; without it, callbacks are sent on every value change.
3) Client sends `SendActionMsg` with `simAction` (e.g., `atOpenSim`, `atTimer`, `atCompModify`, `atContinue`, `atCancelSim`, `atTerminate`).
4) Server responds with `mtSimEvent` wrappers containing status (`etStatus`), timer callbacks (`etTimer`), value changes (`etCompEv`), and load completion (`etSimLoaded`).

## Common Gotchas
- Ensure `MessageDefLib` and any referenced projects are on a writable path; the sample csproj points to `..\..\VS_Projects\EMRALD\CouplingWebSocket\...`.
- Reset simulation state between runs: `ClearData` calls `Simulation.Reset()`; adapt `Reset` in your sim to clear time and internal variables.
- Timer due checks happen before resuming from Waiting and inside the Running time-step handler to avoid missing callbacks when values change mid-step.

## License
Sample code provided as-is for integration experiments; add your own license as needed.
