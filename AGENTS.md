# Rocket Web UI - Agent Instructions

This project is a React + TypeScript web UI for a rocket ground station telemetry system.

Codex must read and follow this file before making changes.

## Main Principle

This project must stay modular.

Business logic, realtime message handling, deserialization and mapping logic must not be placed inside React components.

React components should display already prepared UI state.

## Project Purpose

The UI connects to a WebSocket server, receives JSON telemetry envelopes, routes messages by `messageType`, maps payload message models to UI models, and displays them in dashboard/debug/command screens.

The UI can also send command messages to the backend service over WebSocket.

Commands are interpreted by the backend service using the pair:

```text
messageType + commandType
```

## Current Incoming Message Contract

Incoming realtime messages use this structure:

```json
{
  "id": "processor-1",
  "messageType": "RoketTelemetriPaket",
  "payload": {}
}
```

TypeScript contract:

```ts
export type RealtimeMessageEnvelope<TPayload = unknown> = {
  id: string;
  messageType: string;
  payload: TPayload;
};
```

Meaning:

- `id` is the source/route/processor identifier.
- `messageType` is the payload model name.
- `payload` contains the actual message data.

Do not add `timestamp`, `timestampUtc`, `messageId`, `source`, `targetId`, or similar fields unless the user explicitly asks.

## Current Command Contract

Outgoing commands use this structure:

```json
{
  "id": "processor-1",
  "messageType": "RoketTelemetriPaket",
  "commandType": "SoftReset",
  "payload": {}
}
```

TypeScript contract:

```ts
export type CommandEnvelope<TPayload = unknown> = {
  id: string;
  messageType: string;
  commandType: string;
  payload: TPayload;
};
```

Meaning:

- `id` is the target/route/processor identifier.
- `messageType` is the packet/model type that owns the command.
- `commandType` is the command name within that packet/model.
- `payload` contains command-specific parameters.

Do not add `CommandAck`, `commandId`, `senderId`, `targetId`, `timestamp`, or `timestampUtc` unless the user explicitly asks.

## Command Interpretation Rule

For outgoing commands:

```text
messageType = the packet/model type that owns the command
commandType = the command inside that packet/model
```

Example:

```json
{
  "id": "processor-1",
  "messageType": "RoketTelemetriPaket",
  "commandType": "SoftReset",
  "payload": {}
}
```

The backend service must interpret this as:

```text
Send the SoftReset command that belongs to RoketTelemetriPaket.
```

Do not assume that `commandType` alone is globally unique.

The same `commandType` may exist under different `messageType` values.

Example:

```text
RoketTelemetriPaket / SoftReset
GpsPaket / SoftReset
MotorKontrolPaket / SoftReset
```

These must be treated as different command meanings.

## Payload Rules

Commands may or may not have payload.

Payloadless command example:

```json
{
  "id": "processor-1",
  "messageType": "RoketTelemetriPaket",
  "commandType": "SoftReset",
  "payload": {}
}
```

Payload command example:

```json
{
  "id": "processor-1",
  "messageType": "RoketTelemetriPaket",
  "commandType": "SoftResetWithPayload",
  "payload": {
    "reason": "UserRequest",
    "delayMs": 1000
  }
}
```

For payload commands:

- UI input values should be read from controlled React state.
- The payload object should be passed to a command factory.
- The command factory should create the final `CommandEnvelope`.
- The command sender should only send the prepared envelope.
- React components should not manually duplicate protocol strings.

## Mandatory Rules

- Use React + TypeScript.
- Keep changes small and reviewable.
- Keep the project modular.
- Do not put deserialize logic inside React components.
- Do not put mapping logic inside React components.
- Use dispatcher/handler pattern for incoming realtime messages.
- Use mapper functions/classes to convert message models to UI models.
- Keep UI models inside the related feature module.
- Keep shared protocol contracts under `src/contracts`.
- Use Zustand for client state.
- Use constants from `messageTypes.ts` for message types.
- Command types must be packet/feature-specific.
- Do not use a single global command type list unless the command is truly global.
- Avoid hard-coded message type and command type strings.
- Meaningful changes must update `README.md`.
- Do not introduce unnecessary abstractions before they are needed.
- Do not change the current message/command envelope format without explicit user approval.

## UI Design Rules

The UI should follow a dark rocket mission-control dashboard style.

Visual direction:

- Dark navy/black background
- Thin blue panel borders
- Compact telemetry typography
- Mission-control style top bar
- Route-based page navigation
- Dashboard, Graphs, Commands & Sequence, and Debug sections
- Card/panel based layout
- Clear status indicators for connection, operation mode, alerts, and command state

Preferred colors:

```css
:root {
  --bg-main: #050b12;
  --bg-surface: #0b1628;
  --bg-panel: #101b2e;
  --border-panel: #244061;
  --text-main: #e6f1ff;
  --text-muted: #8ea3bd;
  --accent-blue: #38a3ff;
  --accent-green: #00d084;
  --accent-yellow: #f5c542;
  --accent-red: #ff4d4f;
}
```

UI architecture rules:

- `AppShell` owns the persistent top bar, route tabs, page outlet, and footer.
- `TopBar`, `PageTabs`, `Panel`, `MetricCard`, `StatusBadge`, and `JsonViewer` are the shared visual primitives.
- Route pages must stay thin and compose shared and feature components.
- Mission status colors must use the CSS variables in `src/index.css` consistently.
- Use reusable shared components for shell, top bar, navigation tabs, panels, metric cards, status badges, tables and JSON viewers.
- Page components should compose feature components and shared layout components.
- Do not put WebSocket parsing, payload mapping, or protocol command construction inside visual components.
- Command buttons must use command factories.
- Payload command forms must use controlled React inputs.
- Keep styling consistent across all pages.
- Avoid large monolithic components.
- Use `react-router-dom` for page navigation.
- Do not add unnecessary UI libraries unless explicitly requested.

## README Update Rule

Update `README.md` whenever a change affects:

- project structure
- setup instructions
- environment variables
- WebSocket message format
- command format
- command interpretation rules
- available features
- development workflow
- major architectural decisions

Do not update `README.md` for purely cosmetic changes unless the user asks.

## Folder Responsibilities

### `src/pages`

Route-level page components.

Allowed:

- page layout
- feature component composition
- route-specific page structure

Not allowed:

- WebSocket parsing logic
- payload deserialization
- message-to-UI mapping
- protocol command construction

### `src/contracts`

Shared frontend contracts for incoming/outgoing JSON envelopes.

Allowed:

- `RealtimeMessageEnvelope`
- `CommandEnvelope`
- `MessageTypes`

Not allowed:

- React components
- UI models
- Zustand stores
- feature-specific logic
- packet-specific command type lists

### `src/realtime`

WebSocket client, dispatcher, connection state and realtime handlers.

Allowed:

- WebSocket connection logic
- connection state
- realtime dispatcher
- handler registration
- incoming message routing

Not allowed:

- React UI rendering
- page-specific state
- CSS/styling logic
- UI models

### `src/features`

Feature modules.

Each feature may contain:

- `components`
- `models`
- `messages`
- `mappers`
- `store`
- `services`
- `commands`

Feature-specific UI models must stay inside the related feature module.

Packet/model-specific command constants and command factories must stay inside the related feature module.

Example:

```text
src/features/telemetry/commands/roketTelemetriCommands.ts
src/features/telemetry/commands/roketTelemetriCommandFactory.ts
```

### `src/features/commands`

General command infrastructure.

Allowed:

- command sender
- command store
- general command UI composition

Not allowed:

- packet-specific command constants
- packet-specific command factories
- duplicated protocol strings

### `src/shared`

Reusable UI components, utilities, and shared types that do not belong to one feature.

Allowed:

- reusable components
- general utility functions
- general shared types

Not allowed:

- rocket-specific message parsing
- feature-specific store
- feature-specific mapper
- packet-specific command factories

### `src/pages`

Page-level components that compose feature components.

Allowed:

- page layout
- feature component composition

Not allowed:

- WebSocket parsing logic
- payload deserialization
- message-to-UI mapping
- protocol command construction

## Data Flow

Incoming data flow:

```text
WebSocket JSON
  ↓
RealtimeMessageEnvelope
  ↓
RealtimeDispatcher
  ↓
Message Handler
  ↓
Message Model
  ↓
Mapper
  ↓
UI Model
  ↓
Zustand Store
  ↓
React Component
```

Outgoing command flow:

```text
Command Component
  ↓
Controlled input values
  ↓
Command Factory
  ↓
CommandEnvelope
  ↓
Command Sender
  ↓
WebSocket Send
  ↓
Backend Service
```

## Current Implemented Infrastructure

The project currently has:

- WebSocket connection service
- Connection status store
- Raw message debug store
- Realtime dispatcher skeleton
- Initial telemetry handler
- Dashboard telemetry summary cards
- Command sender infrastructure
- Packet/model-specific command structure
- `RoketTelemetriPaket / SoftReset` payloadless command example
- `RoketTelemetriPaket / SoftResetWithPayload` payload command example
- UI input values mapped into command payload
- Page-level separation for dashboard, command and debug sections

## First Milestone

Build a minimal working UI with:

- WebSocket connection service
- Connection status
- Raw message/debug panel
- Realtime message dispatcher
- One sample telemetry message handler
- One dashboard card group
- One command sender example
- One payloadless command example
- One payload command example
- README.md updated with every meaningful change

## Performance Rules

- High-frequency telemetry messages received over WebSocket must not trigger heavy React renders or chart redraws for every individual message.
- Debug and raw-message lists must remain bounded; do not retain an unlimited number of messages in client memory.
- Chart and telemetry history data must use a bounded buffer or ring-buffer strategy.
- UI updates should use an appropriate scheduling strategy such as throttle, debounce, or `requestAnimationFrame` when message frequency is higher than the required display refresh rate.
- Performance optimizations must not change the current protocol or envelope formats.
- Do not modify the WebSocket client, realtime dispatcher, or command sender files unless the active task explicitly requires changes to those files.

## Development Behavior

When making changes:

1. Read `README.md` and `AGENTS.md`.
2. Keep the change focused on the requested task.
3. Do not refactor unrelated files.
4. Do not change contracts unless explicitly requested.
5. Do not add `CommandAck`, `commandId`, `timestamp`, `senderId`, or `targetId` unless explicitly requested.
6. Run `npm run build` after meaningful code changes.
7. Update `README.md` when required.
8. Summarize changed files and any risks.
