package com.spicelab.backend.game.truthordare;

import com.spicelab.backend.game.GameEngine;
import com.spicelab.backend.game.GameAction;
import com.spicelab.backend.game.GameState;
import com.spicelab.backend.model.Question;
import com.spicelab.backend.repository.QuestionRepository;
import org.springframework.stereotype.Component;
import java.util.*;

@Component
public class TruthOrDareEngine implements GameEngine<TruthOrDareEngine.ToDGameState> {
    
    private final QuestionRepository questionRepository;
    
    public TruthOrDareEngine(QuestionRepository questionRepository) {
        this.questionRepository = questionRepository;
    }
    
    @Override
    public String getGameType() {
        return "TRUTH_OR_DARE";
    }
    
    @Override
    public ToDGameState initialize(List<String> playerIds, Map<String, Object> config) {
        Collections.shuffle(playerIds);
        return new ToDGameState(
            "TRUTH_OR_DARE",
            ToDGameState.Phase.WAITING,
            playerIds,
            playerIds.get(0),
            1,
            null,
            1
        );
    }
    
    @Override
    public ToDGameState processAction(ToDGameState state, String playerId, GameAction action) {
        if (!playerId.equals(state.getCurrentTurn())) {
            throw new IllegalArgumentException("Not your turn");
        }
        
        switch (action.getType()) {
            case "roll_dice":
                return handleRollDice(state);
            case "choose":
                return handleChoose(state, action.getData());
            case "complete":
                return handleComplete(state);
            default:
                throw new IllegalArgumentException("Unknown action: " + action.getType());
        }
    }
    
    private ToDGameState handleRollDice(ToDGameState state) {
        int diceValue = new Random().nextInt(6) + 1;
        return new ToDGameState(
            state.getGameType(),
            ToDGameState.Phase.SELECTING,
            state.getPlayerOrder(),
            state.getCurrentTurn(),
            diceValue,
            state.getCurrentQuestion(),
            state.getRoundNumber()
        );
    }
    
    private ToDGameState handleChoose(ToDGameState state, Map<String, Object> data) {
        String choice = (String) data.get("choice");
        if (choice == null) return state;
        
        Question.QuestionType type = "truth".equals(choice) 
            ? Question.QuestionType.TRUTH 
            : Question.QuestionType.DARE;
        
        int level = Math.min(6, Math.max(1, state.getCurrentDiceValue()));
        
        List<Question> questions = questionRepository.findAllByTypeAndLevel(type, level);
        Map<String, Object> questionData;
        if (!questions.isEmpty()) {
            Question q = questions.get(new java.util.Random().nextInt(questions.size()));
            questionData = Map.of(
                "id", q.getId(),
                "type", q.getType().name().toLowerCase(),
                "content", q.getContent(),
                "level", q.getLevel()
            );
        } else {
            questionData = Map.of("content", "默认问题: 你现在最想做什么？");
        }
        
        return new ToDGameState(
            state.getGameType(),
            ToDGameState.Phase.ANSWERING,
            state.getPlayerOrder(),
            state.getCurrentTurn(),
            state.getCurrentDiceValue(),
            questionData,
            state.getRoundNumber()
        );
    }
    
    private ToDGameState handleComplete(ToDGameState state) {
        int nextIndex = state.getPlayerOrder().indexOf(state.getCurrentTurn()) + 1;
        int nextRound = nextIndex >= state.getPlayerOrder().size() ? state.getRoundNumber() + 1 : state.getRoundNumber();
        String nextPlayer = state.getPlayerOrder().get(nextIndex % state.getPlayerOrder().size());
        
        return new ToDGameState(
            state.getGameType(),
            ToDGameState.Phase.WAITING,
            state.getPlayerOrder(),
            nextPlayer,
            0,
            null,
            nextRound
        );
    }
    
    @Override
    public boolean isFinished(ToDGameState state) {
        return state.getPhase() == ToDGameState.Phase.FINISHED;
    }
    
    @Override
    public String getWinner(ToDGameState state) {
        return null;
    }
    
    @Override
    public Map<String, Object> toClientState(ToDGameState state) {
        Map<String, Object> clientState = new HashMap<>();
        clientState.put("gameType", state.getGameType());
        clientState.put("phase", state.getPhase().name().toLowerCase());
        clientState.put("currentTurn", state.getCurrentTurn());
        clientState.put("playerOrder", state.getPlayerOrder());
        clientState.put("diceValue", state.getCurrentDiceValue());
        clientState.put("question", state.getCurrentQuestion());
        clientState.put("round", state.getRoundNumber());
        return clientState;
    }
    
    public static class ToDGameState implements GameState {
        private final String gameType;
        private final Phase phase;
        private final List<String> playerOrder;
        private final String currentTurn;
        private final int currentDiceValue;
        private final Map<String, Object> currentQuestion;
        private final int roundNumber;
        
        public ToDGameState(String gameType, Phase phase, List<String> playerOrder, 
                          String currentTurn, int currentDiceValue, 
                          Map<String, Object> currentQuestion, int roundNumber) {
            this.gameType = gameType;
            this.phase = phase;
            this.playerOrder = playerOrder;
            this.currentTurn = currentTurn;
            this.currentDiceValue = currentDiceValue;
            this.currentQuestion = currentQuestion;
            this.roundNumber = roundNumber;
        }
        
        public String getGameType() { return gameType; }
        public Phase getPhase() { return phase; }
        public List<String> getPlayerOrder() { return playerOrder; }
        public String getCurrentTurn() { return currentTurn; }
        public int getCurrentDiceValue() { return currentDiceValue; }
        public Map<String, Object> getCurrentQuestion() { return currentQuestion; }
        public int getRoundNumber() { return roundNumber; }
        
        @Override
        public String getCurrentPhase() { return phase != null ? phase.name() : null; }
        
        @Override
        public boolean isFinished() { return phase == Phase.FINISHED; }
        
        public enum Phase {
            WAITING, SELECTING, ANSWERING, FINISHED
        }
    }
}
