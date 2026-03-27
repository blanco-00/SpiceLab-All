package com.spicelab.backend.game;

import org.springframework.stereotype.Component;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Component
public class GameEngineRegistry {
    
    private final Map<String, GameEngine<?>> engines = new HashMap<>();
    
    public GameEngineRegistry(List<GameEngine<?>> engineList) {
        for (GameEngine<?> engine : engineList) {
            engines.put(engine.getGameType(), engine);
        }
    }
    
    @SuppressWarnings("unchecked")
    public <S extends GameState> GameEngine<S> getEngine(String gameType) {
        return (GameEngine<S>) engines.get(gameType);
    }
    
    public boolean hasEngine(String gameType) {
        return engines.containsKey(gameType);
    }
}
