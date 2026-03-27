## Context

SpiceLab is a private couple interaction game platform with games: Truth or Dare, Ludo, and Wheel. Currently:
- Room creation/joining works (backend + frontend)
- Frontend has game components but not connected to backend
- Backend has TruthOrDareEngine but no API to drive it

## Goals / Non-Goals

**Goals:**
- Implement GameController/GameService for game lifecycle
- Connect GamePage to backend API
- Enable real Truth or Dare gameplay through the full cycle
- Seed question data for MVP demo

**Non-Goals:**
- Full WebSocket implementation (use polling for MVP)
- Ludo and Wheel implementation (Truth or Dare first)
- Premium question system (all free for MVP)
- User authentication (uses room-based session)

## Decisions

### Decision: REST API over WebSocket for MVP

**Choice**: Use REST polling instead of WebSocket for initial implementation.

**Rationale**: WebSocket complexity is high for MVP. Polling every 2-3 seconds provides acceptable UX for turn-based games.

**Alternatives**:
- WebSocket: Better real-time sync, higher complexity
- Server-Sent Events: One-way streaming, mid complexity

### Decision: Game State in Memory, Persisted on Update

**Choice**: Keep game state in backend memory, persist to DB on significant actions.

**Rationale**: Frequent state changes (dice roll animation) don't each need DB write. Only completed turns are persisted.

### Decision: Frontend Uses sessionStorage for Player ID

**Choice**: Player ID stored in sessionStorage when joining room.

**Rationale**: No login system. Player identity persists within browser session only.

## Risks / Trade-offs

[Risk] Game state lost on server restart → [Mitigation] Persist game state to DB on each action completion

[Risk] Multiple browser tabs could cause race conditions → [Mitigation] Each player has one active session; server validates playerId on each action

[Trade-off] Polling vs WebSocket → Accept 2-3s latency for simpler implementation

## API Design

```
POST /api/games/start
  Request: { roomCode: string, gameType: "TRUTH_OR_DARE" }
  Response: { gameState: GameState }

POST /api/games/{roomCode}/action
  Request: { action: "roll" | "choose" | "complete", playerId: string, choice?: "truth" | "dare" }
  Response: { gameState: GameState }

GET /api/games/{roomCode}/state
  Response: { gameState: GameState }
```

## Data Model

```java
// GameRecord entity
@Entity
class GameRecord {
  String id;          // UUID
  String roomId;      // FK to Room
  String gameType;    // TRUTH_OR_DARE, LUDO, WHEEL
  String status;      // WAITING, PLAYING, FINISHED
  String currentState; // JSON serialized game state
}
```
