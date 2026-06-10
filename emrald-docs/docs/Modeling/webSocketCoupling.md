# Building a WebSocket Coupling (template)

Use this guide to turn the `CouplingWebSocket` library and `WebSocketTestServer` sample into a coupling for your own external tool. It mirrors the XMPP message schema, but uses a lightweight WebSocket transport.

## When to choose WebSocket
- XMPP ports/brokers aren’t available or are blocked by firewalls.
- You want a small, dependency-light host you can bundle with your simulation.
- You need to run on the same machine as EMRALD with minimal setup.

## Project pieces
- **CouplingWebSocket/WebApiCoupling.cs** – EMRALD-side client helper implementing `ISimMessaging`. Handles connect, app discovery, connection GUIDs, and action/event send/receive.
- **CouplingWebSocket/WebSocketClient.cs** – raw WebSocket transport: `GetAppOptions`, `CreateConnection`, `SendActionMsg`, and event dispatch.
- **WebSocketTestServer** – reference host you can copy:
  - `Program.cs` – listener, command dispatch (`GetAppOptions`, `CreateConnection`, `SendActionMsg`).
  - `ConnectionStateMachine.cs` + `ConnectionStates.cs` – EMRALD-style state flow (Idle → Loading → Waiting → Running → Done/Error) that interprets action messages and emits events.
  - `ExampleSim.cs` – stub simulation you replace with your solver.

## Quick start (using the sample)
1. Build and run `WebSocketTestServer` (`dotnet run`). Default endpoint: `ws://localhost:8465/`.
2. In EMRALD, set the external sim’s coupling type to **WebSocket** and point the URL at the server.
3. Run a model that sends external sim messages; watch events flow back in the UI (same as XMPP workflow).

## Adapting to your tool
1. **Replace the simulator**  
   Swap `ExampleSim` with your API wrapper. Expose methods for load/start/step/pause/stop and any watched variables.
2. **Map EMRALD actions** (see comments in `ConnectionStates.cs`):
   - `atOpenSim` → load model/config, return `etSimLoaded`.
   - `atTimer` → schedule a callback; emit `etTimer` when reached.
   - `atCompModify` → apply parameter/variable changes.
   - `atContinue` / `atCancelSim` / `atTerminate` → control run/stop/cleanup.
3. **Emit events** from your sim via the state machine:
   - Value changes → `etCompEv` with name/value/time.
   - Timer reached → `etTimer`.
   - Done → `etEndSim`.
   - Status/health → `etStatus` / `etPing`.
4. **Watch variables**  
   Honor `watchItems` passed in `CreateConnection`; send only the requested variables to cut chatter.
   Each watch item is an object `{ "name", "type", "WatchEventCriteria" }` where `type` is the
   variable's EMRALD type and `WatchEventCriteria` is an optional fParser boolean expression string
   (e.g. `"(valve_12 > 5) & (valve_12 < 10)"`). When `WatchEventCriteria` is present, only call back
   while the expression evaluates true; when it is omitted, report on every change. See
   `WatchEventCriteriaEvaluator.cs` in the sample for a reference expression evaluator.
5. **Timekeeping**  
   Two times travel in each message and they are **not** the same: the wrapper's `globalRunTime` is
   global (this sim's start time + its local elapsed time) and EMRALD uses it to detect stale/out-of-order
   messages, while each `SimEvent.time` is the sim's **local** elapsed time (no offset). EMRALD adds the
   sim's start time to localize `SimEvent.time` back to global, so stamping a `SimEvent` with global time
   double-counts the offset and pushes EMRALD's clock ahead (its messages then look perpetually stale).
   In the sample, `GlobalSimTime` feeds the wrapper and `LocalSimTime` feeds each `SimEvent`.
6. **Threading**  
   The sample processes a connection on a single logical loop. If you add background threads, funnel all outbound messages through the state machine to preserve ordering.

## Message flow reference
```
Client → {"command":"GetAppOptions"}
Server → {"names":["AppA","AppB", ...]}

Client → {"command":"CreateConnection","appName":"AppA","watchItems":[
           {"name":"var1","type":"double"},
           {"name":"valve_12","type":"double","WatchEventCriteria":"(valve_12 > 5) & (valve_12 < 10)"}
         ]}
Server → {"conID":"<guid>"}
         // watchItems are objects: name, EMRALD type, and an optional WatchEventCriteria fParser
         // expression string. With an expression, the server only calls back while it evaluates
         // true; without one, it reports on every change.

Client → {"command":"SendActionMsg","conID":"<guid>","action":<TMsgWrapper JSON>}
Server → {"conID":"<guid>","message":<TMsgWrapper JSON>}   // events: etSimLoaded, etCompEv, etTimer, etEndSim, etStatus, etc.
```

## Configuration in EMRALD
- External simulation: set **Coupling Type** = WebSocket.
- Coupling URL: `ws://host:port/` of your server.
- Optional: coupling password (if your host enforces one) is passed through `WebApiCoupling.connectionPassword`.

## Testing checklist
- Start server; verify `GetAppOptions` returns your app name.
- `atOpenSim` loads and replies `etSimLoaded`.
- `atTimer` triggers `etTimer` at the right global time.
- `atCompModify` changes are reflected in subsequent `etCompEv`.
- `atCancelSim` stops cleanly; `atTerminate` disposes resources.

## Where to look in code (quick map)
- Transport & handshake: `CouplingWebSocket/WebSocketClient.cs`
- EMRALD client adapter: `CouplingWebSocket/WebApiCoupling.cs`
- Host entry point: `WebSocketTestServer/Program.cs`
- State logic: `WebSocketTestServer/ConnectionStateMachine.cs`, `ConnectionStates.cs`
- Simulation stub: `WebSocketTestServer/ExampleSim.cs`

