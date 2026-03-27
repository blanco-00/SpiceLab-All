package com.spicelab.backend.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.spicelab.backend.game.GameAction;
import com.spicelab.backend.game.GameEngine;
import com.spicelab.backend.game.GameEngineRegistry;
import com.spicelab.backend.model.GameRecord;
import com.spicelab.backend.model.Player;
import com.spicelab.backend.model.Question;
import com.spicelab.backend.model.Room;
import com.spicelab.backend.repository.GameRecordRepository;
import com.spicelab.backend.repository.PlayerRepository;
import com.spicelab.backend.repository.QuestionRepository;
import com.spicelab.backend.repository.RoomRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@SuppressWarnings({"rawtypes", "unchecked"})
public class GameService {

    private final GameEngineRegistry engineRegistry;
    private final GameRecordRepository gameRecordRepository;
    private final RoomRepository roomRepository;
    private final PlayerRepository playerRepository;
    private final QuestionRepository questionRepository;
    private final ObjectMapper objectMapper;

    public GameService(GameEngineRegistry engineRegistry,
                      GameRecordRepository gameRecordRepository,
                      RoomRepository roomRepository,
                      PlayerRepository playerRepository,
                      QuestionRepository questionRepository,
                      ObjectMapper objectMapper) {
        this.engineRegistry = engineRegistry;
        this.gameRecordRepository = gameRecordRepository;
        this.roomRepository = roomRepository;
        this.playerRepository = playerRepository;
        this.questionRepository = questionRepository;
        this.objectMapper = objectMapper;
    }

    @Transactional
    public Map<String, Object> startGame(String roomCode, String gameType) {
        Room room = roomRepository.findByCode(roomCode.toUpperCase())
                .orElseThrow(() -> new IllegalArgumentException("Room not found"));

        if (room.getStatus() != Room.RoomStatus.WAITING) {
            throw new IllegalStateException("Game already started or finished");
        }

        List<Player> players = playerRepository.findByRoomIdAndLeftAtIsNull(room.getId());
        if (players.size() < 2) {
            throw new IllegalStateException("Need at least 2 players to start");
        }

        GameEngine engine = (GameEngine) engineRegistry.getEngine(gameType);
        if (engine == null) {
            throw new IllegalArgumentException("Unknown game type: " + gameType);
        }

        List<String> playerIds = new ArrayList<>(players.stream()
                .map(Player::getId)
                .toList());

        Object initialState = engine.initialize(playerIds, null);
        Map<String, Object> clientState = engine.toClientState((com.spicelab.backend.game.GameState) initialState);

        GameRecord record = GameRecord.builder()
                .roomId(room.getId())
                .gameType(gameType)
                .status(GameRecord.GameStatus.PLAYING)
                .currentState(toJson(clientState))
                .build();
        record = gameRecordRepository.save(record);

        room.setStatus(Room.RoomStatus.PLAYING);
        room.setGameType(gameType);
        roomRepository.save(room);

        Map<String, Object> result = new HashMap<>();
        result.put("gameRecordId", record.getId());
        result.put("gameState", clientState);
        return result;
    }

    @Transactional
    public Map<String, Object> performAction(String roomCode, String actionType, String playerId, Map<String, Object> actionData) {
        Room room = roomRepository.findByCode(roomCode.toUpperCase())
                .orElseThrow(() -> new IllegalArgumentException("Room not found"));

        GameRecord record = gameRecordRepository.findByRoomId(room.getId())
                .orElseThrow(() -> new IllegalStateException("Game not found"));

        if (record.getStatus() == GameRecord.GameStatus.FINISHED) {
            throw new IllegalStateException("Game already finished");
        }

        GameEngine engine = (GameEngine) engineRegistry.getEngine(record.getGameType());
        if (engine == null) {
            throw new IllegalArgumentException("Unknown game type: " + record.getGameType());
        }

        Map<String, Object> currentState = fromJson(record.getCurrentState());
        GameAction action = GameAction.of(actionType, actionData);
        
        Map<String, Object> newState = processEngineAction(engine, currentState, playerId, action);

        record.setCurrentState(toJson(newState));
        String phase = (String) newState.get("phase");
        if ("finished".equalsIgnoreCase(phase)) {
            record.setStatus(GameRecord.GameStatus.FINISHED);
            room.setStatus(Room.RoomStatus.FINISHED);
            roomRepository.save(room);
        }
        gameRecordRepository.save(record);

        Map<String, Object> result = new HashMap<>();
        result.put("gameState", newState);
        return result;
    }

    private Map<String, Object> processEngineAction(GameEngine engine, Map<String, Object> state, String playerId, GameAction action) {
        String gameType = engine.getGameType();
        switch (gameType) {
            case "TRUTH_OR_DARE":
                return processTruthOrDareAction(state, playerId, action);
            default:
                throw new IllegalArgumentException("Unsupported game type: " + gameType);
        }
    }

    private Map<String, Object> processTruthOrDareAction(Map<String, Object> state, String playerId, GameAction action) {
        try {
            String phase = (String) state.get("phase");
            switch (action.getType()) {
                case "roll":
                case "roll_dice":
                    int diceValue = new java.util.Random().nextInt(6) + 1;
                    
                    @SuppressWarnings("unchecked")
                    Map<String, Integer> playerDice = (Map<String, Integer>) state.getOrDefault("playerDice", new HashMap<>());
                    playerDice.put(playerId, diceValue);
                    state.put("playerDice", playerDice);
                    
                    List<?> playerOrder = (List<?>) state.get("playerOrder");
                    if (playerDice.size() >= playerOrder.size()) {
                        int first = 0, second = 0;
                        String firstId = "", secondId = "";
                        for (String pid : playerDice.keySet()) {
                            int val = playerDice.get(pid);
                            if (val >= first) {
                                second = first;
                                secondId = firstId;
                                first = val;
                                firstId = pid;
                            } else if (val >= second) {
                                second = val;
                                secondId = pid;
                            }
                        }
                        state.put("phase", "selecting");
                        state.put("currentTurn", firstId);
                        state.put("diceValue", first);
                        state.put("otherDiceValue", second);
                    } else {
                        state.put("phase", "rolling");
                    }
                    return state;
                case "choose":
                    Map<String, Object> data = action.getData();
                    if (data != null && data.containsKey("choice")) {
                        String choice = (String) data.get("choice");
                        Question.QuestionType type = "truth".equals(choice) 
                            ? Question.QuestionType.TRUTH 
                            : Question.QuestionType.DARE;
                        int currentDice = (int) state.getOrDefault("diceValue", 1);
                        int level = Math.min(3, Math.max(1, currentDice));
                        
                        List<Question> questions = questionRepository.findAllByTypeAndLevel(type, level);
                        if (!questions.isEmpty()) {
                            Question question = questions.get(new java.util.Random().nextInt(questions.size()));
                            state.put("phase", "answering");
                            state.put("selectedChoice", choice);
                            state.put("question", Map.of(
                                "id", question.getId(),
                                "type", question.getType().name().toLowerCase(),
                                "content", question.getContent(),
                                "level", question.getLevel()
                            ));
                        } else {
                            state.put("phase", "answering");
                            state.put("selectedChoice", choice);
                            state.put("question", Map.of(
                                "content", "默认问题: 你现在最想做什么？"
                            ));
                        }
                    }
                    return state;
                case "complete":
                    List<?> playerOrderComplete = (List<?>) state.get("playerOrder");
                    String currentTurnComplete = (String) state.get("currentTurn");
                    int currentIndex = playerOrderComplete.indexOf(currentTurnComplete);
                    int nextIndex = (currentIndex + 1) % playerOrderComplete.size();
                    
                    // If we're wrapping back to the first player, increment round
                    int currentRound = (int) state.getOrDefault("round", 1);
                    if (nextIndex == 0) {
                        state.put("round", currentRound + 1);
                    }
                    
                    state.put("currentTurn", playerOrderComplete.get(nextIndex));
                    state.put("phase", "rolling");
                    state.put("playerDice", new HashMap<>());
                    state.put("diceValue", 0);
                    state.put("otherDiceValue", 0);
                    state.put("question", null);
                    state.put("selectedChoice", null);
                    return state;
                default:
                    return state;
            }
        } catch (Exception e) {
            throw new RuntimeException("Error processing action", e);
        }
    }

    public Map<String, Object> getGameState(String roomCode) {
        Room room = roomRepository.findByCode(roomCode.toUpperCase())
                .orElseThrow(() -> new IllegalArgumentException("Room not found"));

        GameRecord record = gameRecordRepository.findByRoomId(room.getId())
                .orElseThrow(() -> new IllegalStateException("Game not found"));

        Map<String, Object> clientState = fromJson(record.getCurrentState());

        Map<String, Object> result = new HashMap<>();
        result.put("gameRecordId", record.getId());
        result.put("gameState", clientState);
        result.put("gameType", record.getGameType());
        result.put("status", record.getStatus().name());
        return result;
    }

    private String toJson(Map<String, Object> state) {
        try {
            return objectMapper.writeValueAsString(state);
        } catch (JsonProcessingException e) {
            throw new RuntimeException("Failed to serialize game state", e);
        }
    }

    @SuppressWarnings("unchecked")
    private Map<String, Object> fromJson(String json) {
        try {
            return objectMapper.readValue(json, Map.class);
        } catch (JsonProcessingException e) {
            throw new RuntimeException("Failed to deserialize game state", e);
        }
    }
}
