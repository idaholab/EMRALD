# WebSocketTestServer

Minimal example of an EMRALD-coupled WebSocket server with a pluggable simulation. It accepts JSON actions from a controller, drives a per-connection state machine, and emits status / timer / value events back to the client.

## Quick Start
- Requirements: .NET 9 SDK, MessageDefLib (shared contract assembly) reachable at build time.
- Build: `dotnet build` (ensure the `ProjectReference` to CouplingWebSocket/MessageDefLib points to a writable local path).
- Run: `dotnet run` (listens on `http://localhost:8465/`).
- Connect: open a WebSocket to that URL and send JSON commands (see `CouplingServer.cs` for expected shapes).

## Project Layout
- `Program.cs` – entry point; starts the HTTP listener and hands WebSocket requests to a `CouplingServer`.
- `CouplingServer.cs` – serves many sockets at once; dispatches incoming commands to connection state machines. Each socket has a `SocketContext` that serializes its sends.
- `WebSocketServerHost.cs` – in-process host for tests (free port, `WsUri`, `Ledger`).
- `TrafficLedger.cs` – records what each connection received and sent, so tests can check that each EMRALD thread used only its own connection.
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
2) Client sends `CreateConnection` → server creates a `ConnectionStateMachine` for that socket and returns `conID`.
3) Client sends `SendActionMsg` with `simAction` (e.g., `atOpenSim`, `atTimer`, `atCompModify`, `atContinue`, `atCancelSim`, `atTerminate`).
4) Server responds with `mtSimEvent` wrappers containing status (`etStatus`), timer callbacks (`etTimer`), value changes (`etCompEv`), and load completion (`etSimLoaded`).

If a command includes a `requestId`, the response (including an `{error}` response) echoes it so the client can match the response to its request. Clients that do not send one still work.

## Multithreaded EMRALD Runs
With WebSocket coupling and `threads` > 1, EMRALD opens one socket per simulation thread and creates its own connections on it. Each connection has its own state machine and `ExampleSim`, so threads never share simulation state. A socket is closed on `atTerminate` only once no other connection is using it.

## Common Gotchas
- Ensure `MessageDefLib` and any referenced projects are on a writable path; the sample csproj points to `..\..\VS_Projects\EMRALD\CouplingWebSocket\...`.
- Reset simulation state between runs: `ClearData` calls `Simulation.Reset()`; adapt `Reset` in your sim to clear time and internal variables.
- Timer due checks happen before resuming from Waiting and inside the Running time-step handler to avoid missing callbacks when values change mid-step.

## License
Sample code provided as-is for integration experiments; add your own license as needed.
