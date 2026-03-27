## Why

The SpiceLab MVP needs fully functional game pages. Currently, users can create/join rooms but cannot actually play any games. The frontend has game components (TruthOrDareGame, Dice, Wheel, LudoBoard) but they're not connected to the backend API. The game flow (start game → roll dice → choose truth/dare → show question) requires backend coordination.

## What Changes

- Add GameController and GameService for game lifecycle management
- Implement `POST /api/games/start` to initialize games
- Implement `POST /api/games/{roomCode}/action` for dice roll, truth/dare choice, completion
- Implement `GET /api/games/{roomCode}/state` to fetch current game state
- Connect GamePage.tsx to backend API
- Add WebSocket support for real-time game state sync
- Add QuestionRepository with seed data for MVP

## Capabilities

### New Capabilities

- `game-controller`: Backend API endpoints for starting games, performing actions, and getting game state
- `game-frontend-integration`: GamePage connects to backend, renders game components, handles user actions

### Modified Capabilities

- `room-system`: The "Host can start game" requirement requires the game API to exist and work
- `truth-or-dare`: Backend implementation of the spec requirements (currently only frontend mock exists)

## Impact

- Backend: New `GameController`, `GameService`, `QuestionRepository`
- Frontend: `GamePage.tsx` needs API integration
- Database: `game_records` table for game state persistence
- Network: WebSocket endpoint at `/ws` for real-time updates
