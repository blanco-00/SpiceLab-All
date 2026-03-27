## 1. Backend Setup

- [x] 1.1 Create GameRecord entity with JPA annotations
- [x] 1.2 Create GameRecordRepository interface
- [x] 1.3 Create Question entity with seed data SQL

## 2. Backend API Implementation

- [x] 2.1 Create GameController with POST /api/games/start endpoint
- [x] 2.2 Create GameController with POST /api/games/{roomCode}/action endpoint
- [x] 2.3 Create GameController with GET /api/games/{roomCode}/state endpoint
- [x] 2.4 Create GameService with game state management logic
- [x] 2.5 Integrate TruthOrDareEngine into GameService

## 3. Frontend Integration

- [ ] 3.1 Update GamePage.tsx to fetch game state on load
- [ ] 3.2 Connect "开始游戏" button to POST /api/games/start
- [ ] 3.3 Add polling (3s interval) for game state updates
- [ ] 3.4 Connect TruthOrDareGame actions to POST /api/games/{roomCode}/action

## 4. Testing

- [ ] 4.1 Test create room and start game flow via browser
- [ ] 4.2 Test dice roll, truth/dare choice, complete turn flow
- [ ] 4.3 Verify game state persists correctly in database
