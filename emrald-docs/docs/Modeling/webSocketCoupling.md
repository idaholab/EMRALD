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
5. **Timekeeping**  
   Keep `GlobalSimTime` accurate in the state machine so outbound events use EMRALD global time.
6. **Threading**  
   The sample processes a connection on a single logical loop. If you add background threads, funnel all outbound messages through the state machine to preserve ordering.

## Message flow reference
```
Client → {"command":"GetAppOptions"}
Server → {"names":["AppA","AppB", ...]}

Client → {"command":"CreateConnection","appName":"AppA","watchItems":["var1","var2"]}
Server → {"conID":"<guid>"}

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

