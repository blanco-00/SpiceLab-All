package com.spicelab.backend.game.ludo;

import com.spicelab.backend.game.GameEngine;
import com.spicelab.backend.game.GameAction;
import com.spicelab.backend.game.GameState;
import org.springframework.stereotype.Component;
import java.util.*;

@Component
public class LudoEngine implements GameEngine<LudoEngine.LudoGameState> {
    
    public static final String GAME_TYPE = "ludo";
    private static final int BOARD_SIZE = 52;
    private static final int HOME_STRETCH_SIZE = 6;
    private static final int PIECES_PER_PLAYER = 4;
    private static final int TAKEOFF_ROLL = 6;
    
    private static final Map<String, Integer> START_POSITIONS = Map.of(
        "red", 0, "blue", 13, "yellow", 26, "green", 39
    );
    
    private static final Map<String, Integer> HOME_ENTRY = Map.of(
        "red", 50, "blue", 11, "yellow", 24, "green", 37
    );
    
    @Override
    public String getGameType() { return GAME_TYPE; }
    
    @Override
    public LudoGameState initialize(List<String> playerIds, Map<String, Object> config) {
        if (playerIds.size() < 2 || playerIds.size() > 4) {
            throw new IllegalArgumentException("Ludo requires 2-4 players");
        }
        
        List<String> colors = new ArrayList<>(Arrays.asList("red", "blue", "yellow", "green"));
        Collections.shuffle(colors);
        
        Map<String, String> playerColors = new HashMap<>();
        Map<String, List<Piece>> pieces = new HashMap<>();
        List<String> playerOrder = new ArrayList<>();
        
        for (int i = 0; i < playerIds.size(); i++) {
            String playerId = playerIds.get(i);
            String color = colors.get(i);
            playerColors.put(playerId, color);
            playerOrder.add(playerId);
            
            List<Piece> playerPieces = new ArrayList<>();
            for (int j = 0; j < PIECES_PER_PLAYER; j++) {
                playerPieces.add(new Piece(j, -1, false, -1, false));
            }
            pieces.put(playerId, playerPieces);
        }
        
        return new LudoGameState(GAME_TYPE, Phase.WAITING, playerOrder, playerColors, 
            pieces, playerOrder.get(0), 0, 0, Collections.emptyList(), null);
    }
    
    @Override
    public LudoGameState processAction(LudoGameState state, String playerId, GameAction action) {
        if (!playerId.equals(state.getCurrentTurn())) {
            throw new IllegalStateException("Not your turn");
        }
        
        switch (action.getType()) {
            case "roll_dice": return handleRollDice(state);
            case "move_piece": return handleMovePiece(state, action.getData());
            case "skip": return handleSkip(state);
            default: throw new IllegalArgumentException("Unknown action: " + action.getType());
        }
    }
    
    private LudoGameState handleRollDice(LudoGameState state) {
        int diceValue = new Random().nextInt(6) + 1;
        int newConsecutiveSixes = diceValue == 6 ? state.getConsecutiveSixes() + 1 : 0;
        
        if (newConsecutiveSixes >= 3) {
            return switchToNextPlayer(new LudoGameState(
                state.getGameType(), Phase.WAITING, state.getPlayerOrder(),
                state.getPlayerColors(), state.getPieces(), state.getCurrentTurn(),
                diceValue, 0, Collections.emptyList(), null));
        }
        
        List<Integer> movablePieces = getMovablePieces(state, diceValue);
        Phase newPhase = movablePieces.isEmpty() ? Phase.WAITING : Phase.SELECTING;
        
        return new LudoGameState(state.getGameType(), newPhase, state.getPlayerOrder(),
            state.getPlayerColors(), state.getPieces(), state.getCurrentTurn(),
            diceValue, newConsecutiveSixes, movablePieces, null);
    }
    
    private List<Integer> getMovablePieces(LudoGameState state, int diceValue) {
        List<Integer> movable = new ArrayList<>();
        List<Piece> playerPieces = state.getPieces().get(state.getCurrentTurn());
        
        for (Piece piece : playerPieces) {
            if (canMove(piece, diceValue)) {
                movable.add(piece.getId());
            }
        }
        return movable;
    }
    
    private boolean canMove(Piece piece, int diceValue) {
        if (piece.isFinished()) return false;
        if (!piece.isOnBoard()) return diceValue == TAKEOFF_ROLL;
        return true;
    }
    
    private LudoGameState handleMovePiece(LudoGameState state, Map<String, Object> data) {
        int pieceId = ((Number) data.get("pieceId")).intValue();
        int diceValue = state.getLastDiceValue();
        
        List<Piece> playerPieces = new ArrayList<>(state.getPieces().get(state.getCurrentTurn()));
        Piece piece = playerPieces.stream()
            .filter(p -> p.getId() == pieceId)
            .findFirst()
            .orElseThrow(() -> new IllegalArgumentException("Piece not found"));
        
        String color = state.getPlayerColors().get(state.getCurrentTurn());
        Piece newPiece;
        
        if (!piece.isOnBoard()) {
            newPiece = new Piece(piece.getId(), START_POSITIONS.get(color), true, -1, false);
        } else if (piece.getHomeStretchPos() >= 0) {
            int newHomePos = piece.getHomeStretchPos() + diceValue;
            if (newHomePos >= HOME_STRETCH_SIZE) {
                newPiece = new Piece(piece.getId(), piece.getPosition(), true, newHomePos, true);
            } else {
                newPiece = new Piece(piece.getId(), piece.getPosition(), true, newHomePos, false);
            }
        } else {
            int newPos = (piece.getPosition() + diceValue) % BOARD_SIZE;
            if (newPos == HOME_ENTRY.get(color)) {
                newPiece = new Piece(piece.getId(), piece.getPosition(), true, 0, false);
            } else {
                newPiece = new Piece(piece.getId(), newPos, true, -1, false);
            }
        }
        
        playerPieces.set(pieceId, newPiece);
        
        Map<String, List<Piece>> newPieces = new HashMap<>(state.getPieces());
        newPieces.put(state.getCurrentTurn(), playerPieces);
        
        newPieces = checkCaptures(state.getCurrentTurn(), newPiece, newPieces);
        
        LudoGameState newState = new LudoGameState(state.getGameType(), Phase.WAITING,
            state.getPlayerOrder(), state.getPlayerColors(), newPieces,
            state.getCurrentTurn(), state.getLastDiceValue(), state.getConsecutiveSixes(),
            Collections.emptyList(), null);
        
        if (checkWin(playerPieces)) {
            return new LudoGameState(state.getGameType(), Phase.FINISHED,
                state.getPlayerOrder(), state.getPlayerColors(), newPieces,
                state.getCurrentTurn(), state.getLastDiceValue(), state.getConsecutiveSixes(),
                Collections.emptyList(), state.getCurrentTurn());
        }
        
        if (diceValue == TAKEOFF_ROLL) {
            return new LudoGameState(state.getGameType(), Phase.WAITING,
                state.getPlayerOrder(), state.getPlayerColors(), newPieces,
                state.getCurrentTurn(), state.getLastDiceValue(), state.getConsecutiveSixes(),
                Collections.emptyList(), null);
        }
        
        return switchToNextPlayer(newState);
    }
    
    private Map<String, List<Piece>> checkCaptures(String currentPlayer, Piece movedPiece,
                                                    Map<String, List<Piece>> pieces) {
        if (movedPiece.getHomeStretchPos() >= 0 || !movedPiece.isOnBoard()) {
            return pieces;
        }
        
        int movedPos = movedPiece.getPosition();
        Map<String, List<Piece>> newPieces = new HashMap<>(pieces);
        
        for (Map.Entry<String, List<Piece>> entry : pieces.entrySet()) {
            if (entry.getKey().equals(currentPlayer)) continue;
            
            List<Piece> opponentPieces = new ArrayList<>(entry.getValue());
            for (int i = 0; i < opponentPieces.size(); i++) {
                Piece p = opponentPieces.get(i);
                if (p.isOnBoard() && p.getPosition() == movedPos && p.getHomeStretchPos() < 0) {
                    opponentPieces.set(i, new Piece(p.getId(), -1, false, -1, false));
                }
            }
            newPieces.put(entry.getKey(), opponentPieces);
        }
        return newPieces;
    }
    
    private boolean checkWin(List<Piece> pieces) {
        return pieces.stream().allMatch(Piece::isFinished);
    }
    
    private LudoGameState handleSkip(LudoGameState state) {
        return switchToNextPlayer(new LudoGameState(state.getGameType(), Phase.WAITING,
            state.getPlayerOrder(), state.getPlayerColors(), state.getPieces(),
            state.getCurrentTurn(), state.getLastDiceValue(), state.getConsecutiveSixes(),
            Collections.emptyList(), null));
    }
    
    private LudoGameState switchToNextPlayer(LudoGameState state) {
        int currentIndex = state.getPlayerOrder().indexOf(state.getCurrentTurn());
        int nextIndex = (currentIndex + 1) % state.getPlayerOrder().size();
        String nextPlayer = state.getPlayerOrder().get(nextIndex);
        
        return new LudoGameState(state.getGameType(), Phase.WAITING,
            state.getPlayerOrder(), state.getPlayerColors(), state.getPieces(),
            nextPlayer, 0, 0, Collections.emptyList(), null);
    }
    
    @Override
    public boolean isFinished(LudoGameState state) {
        return state.getPhase() == Phase.FINISHED;
    }
    
    @Override
    public String getWinner(LudoGameState state) { return state.getWinner(); }
    
    @Override
    public Map<String, Object> toClientState(LudoGameState state) {
        Map<String, Object> clientState = new HashMap<>();
        clientState.put("gameType", state.getGameType());
        clientState.put("phase", state.getPhase().name().toLowerCase());
        clientState.put("currentTurn", state.getCurrentTurn());
        clientState.put("playerOrder", state.getPlayerOrder());
        clientState.put("playerColors", state.getPlayerColors());
        clientState.put("lastDiceValue", state.getLastDiceValue());
        clientState.put("movablePieces", state.getMovablePieces());
        
        Map<String, List<Map<String, Object>>> piecesData = new HashMap<>();
        state.getPieces().forEach((playerId, pieces) -> {
            List<Map<String, Object>> playerPieces = new ArrayList<>();
            for (Piece p : pieces) {
                Map<String, Object> pieceData = new HashMap<>();
                pieceData.put("id", p.getId());
                pieceData.put("position", p.getPosition());
                pieceData.put("onBoard", p.isOnBoard());
                pieceData.put("homeStretchPos", p.getHomeStretchPos());
                pieceData.put("finished", p.isFinished());
                playerPieces.add(pieceData);
            }
            piecesData.put(playerId, playerPieces);
        });
        clientState.put("pieces", piecesData);
        
        if (state.getWinner() != null) {
            clientState.put("winner", state.getWinner());
        }
        return clientState;
    }
    
    public enum Phase { WAITING, SELECTING, MOVING, FINISHED }
    
    public static class Piece {
        private final int id;
        private final int position;
        private final boolean onBoard;
        private final int homeStretchPos;
        private final boolean finished;
        
        public Piece(int id, int position, boolean onBoard, int homeStretchPos, boolean finished) {
            this.id = id;
            this.position = position;
            this.onBoard = onBoard;
            this.homeStretchPos = homeStretchPos;
            this.finished = finished;
        }
        
        public int getId() { return id; }
        public int getPosition() { return position; }
        public boolean isOnBoard() { return onBoard; }
        public int getHomeStretchPos() { return homeStretchPos; }
        public boolean isFinished() { return finished; }
    }
    
    public static class LudoGameState implements GameState {
        private final String gameType;
        private final Phase phase;
        private final List<String> playerOrder;
        private final Map<String, String> playerColors;
        private final Map<String, List<Piece>> pieces;
        private final String currentTurn;
        private final int lastDiceValue;
        private final int consecutiveSixes;
        private final List<Integer> movablePieces;
        private final String winner;
        
        public LudoGameState(String gameType, Phase phase, List<String> playerOrder,
                           Map<String, String> playerColors, Map<String, List<Piece>> pieces,
                           String currentTurn, int lastDiceValue, int consecutiveSixes,
                           List<Integer> movablePieces, String winner) {
            this.gameType = gameType;
            this.phase = phase;
            this.playerOrder = playerOrder;
            this.playerColors = playerColors;
            this.pieces = pieces;
            this.currentTurn = currentTurn;
            this.lastDiceValue = lastDiceValue;
            this.consecutiveSixes = consecutiveSixes;
            this.movablePieces = movablePieces;
            this.winner = winner;
        }
        
        public String getGameType() { return gameType; }
        public Phase getPhase() { return phase; }
        public List<String> getPlayerOrder() { return playerOrder; }
        public Map<String, String> getPlayerColors() { return playerColors; }
        public Map<String, List<Piece>> getPieces() { return pieces; }
        public String getCurrentTurn() { return currentTurn; }
        public int getLastDiceValue() { return lastDiceValue; }
        public int getConsecutiveSixes() { return consecutiveSixes; }
        public List<Integer> getMovablePieces() { return movablePieces; }
        public String getWinner() { return winner; }
        
        @Override
        public String getCurrentPhase() { return phase != null ? phase.name() : null; }
        
        @Override
        public boolean isFinished() { return phase == Phase.FINISHED; }
    }
}
