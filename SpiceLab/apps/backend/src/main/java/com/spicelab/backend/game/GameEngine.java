package com.spicelab.backend.game;

import java.util.List;
import java.util.Map;

public interface GameEngine<S extends GameState> {
    
    String getGameType();
    
    S initialize(List<String> playerIds, Map<String, Object> config);
    
    S processAction(S state, String playerId, GameAction action);
    
    boolean isFinished(S state);
    
    String getWinner(S state);
    
    Map<String, Object> toClientState(S state);
}
