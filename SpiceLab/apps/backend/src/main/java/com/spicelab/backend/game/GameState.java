package com.spicelab.backend.game;

import java.util.List;

public interface GameState {
    
    String getGameType();
    
    String getCurrentPhase();
    
    String getCurrentTurn();
    
    List<String> getPlayerOrder();
    
    boolean isFinished();
}
