# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What is EMRALD

EMRALD (Event Modeling Risk Assessment using Linked Diagrams) is a dynamic Probabilistic Risk Assessment (PRA) tool developed at Idaho National Laboratory. Users design failure models as state diagrams in a React UI, then run Monte Carlo simulations via a separate .NET engine.

## Commands

### Frontend (run from `Emrald-UI/`)

```bash
npm run dev        # Dev server on :3000
npm run build      # Production build
npm run lint       # ESLint (max-warnings=0)
npm run format     # Prettier
npm run test       # Vitest (50s timeout)
npm run coverage   # Vitest with v8 coverage
```

Run a single test file:
```bash
npx vitest run src/tests/official/forms/TemplateForm/TemplateForm.test.tsx
```

Run tests matching a name pattern:
```bash
npx vitest run -t "TemplateForm"
```

### Desktop App (run from repo root)

```bash
npm run dev        # Hot-reload desktop app (Tauri dev mode)
npm run build      # Build Tauri desktop executable
```

### Backend (.NET — open `EMRALD.sln` in Visual Studio or run `dotnet build`)

The simulator (`EMRALD_Sim`) and engine (`SimulationEngine`) are .NET 10.0 projects. Build via VS or `dotnet build EMRALD.sln`.

## Architecture

The project has three independently runnable layers:

```
Emrald-UI (React 19)       ← model designer, runs in browser or Tauri
      ↓ JSON files
SimulationEngine (.NET)    ← loads JSON model, runs Monte Carlo simulation
      ↕ WebSocket
External simulators        ← physics codes coupled via CouplingWebSocket/XMPP
```

### Frontend Structure (`Emrald-UI/src/`)

- **State management:** Preact Signals (`@preact/signals-react`) hold the global model in `appData`. Domain-specific operations (CRUD for states, events, actions, etc.) live in 12 React contexts under `contexts/`.
- **UI layout:** Three-pane — `Header`, collapsible `Sidebar` (palette of model elements), `MainCanvas` (ReactFlow diagram editor).
- **Forms:** Editing a model element opens a form component under `components/forms/`. Each feature type (State, Event, Action, Diagram, Variable…) has its own form directory.
- **Model types:** Defined in `src/types/EMRALD_Model.ts`, which re-exports from `src/utils/Upgrades/v3_2/AllModelInterfacesV3_2.ts`. Current schema version is **3.2**.
- **Model mutations:** Go through `src/utils/UpdateModel.ts`. Cross-element references are tracked in `src/utils/ModelReferences.ts`.

### Model Versioning (`src/utils/Upgrades/`)

Old models are auto-upgraded on load. The upgrade chain runs: v1.x → v2.4 → v3.0 → v3.1 → v3.2. Each version subdirectory contains interfaces and an `Upgrade*.ts` class. UUIDs are assigned the first time an old model is loaded.

### Simulation Layer

- `SimulationEngine/` — core logic; `StateTracker.cs` drives state transitions, `ProcessSimBatch.cs` handles batch Monte Carlo runs.
- `SimulationDAL/` — JSON deserialization (Newtonsoft.Json), AJV-style schema validation, and ClearScript V8 for evaluating user-defined code snippets at runtime.
- `MessageDefLib/` — shared protocol types for WebSocket coupling.

### Testing

Tests live in `src/tests/official/`. Each test directory mirrors the component under test and typically includes:
- A `.test.tsx` file
- `expectedOutputs/` JSON fixtures for snapshot-style assertions
- `src/tests/test-utils.tsx` provides custom render helpers that wrap providers

Vitest uses `jsdom` and global test APIs (`describe`, `it`, `expect` without imports). The `@/` alias maps to `src/`.

## Key Patterns

- **`@/` path alias** is configured in both `vite.config.ts` and `vitest.config.js`. Use it for all internal imports.
- **Prettier config** (`.prettierrc`): single quotes, trailing commas, avoid arrow parens.
- **ESLint** enforces zero warnings — lint failures will block CI.
- **Tauri IPC** is used when the app runs as a desktop app; the UI degrades gracefully in plain browser mode.
