package com.spicelab.backend.game;

import java.util.Map;

public class GameAction {
    
    private String type;
    private Map<String, Object> data;
    
    public GameAction() {}
    
    public GameAction(String type, Map<String, Object> data) {
        this.type = type;
        this.data = data;
    }
    
    public String getType() { return type; }
    public void setType(String type) { this.type = type; }
    
    public Map<String, Object> getData() { return data; }
    public void setData(Map<String, Object> data) { this.data = data; }
    
    public static GameAction of(String type) {
        return new GameAction(type, null);
    }
    
    public static GameAction of(String type, Map<String, Object> data) {
        return new GameAction(type, data);
    }
}
