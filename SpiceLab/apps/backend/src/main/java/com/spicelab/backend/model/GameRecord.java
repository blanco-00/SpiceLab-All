package com.spicelab.backend.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "game_records")
public class GameRecord {
    
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;
    
    @Column(nullable = false)
    private String roomId;
    
    @Column(nullable = false, length = 20)
    private String gameType;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private GameStatus status;
    
    @Column(columnDefinition = "JSON")
    private String currentState;
    
    @Column(nullable = false)
    private LocalDateTime createdAt;
    
    private LocalDateTime finishedAt;
    
    public GameRecord() {}
    
    public GameRecord(String id, String roomId, String gameType, GameStatus status, String currentState, LocalDateTime createdAt, LocalDateTime finishedAt) {
        this.id = id;
        this.roomId = roomId;
        this.gameType = gameType;
        this.status = status;
        this.currentState = currentState;
        this.createdAt = createdAt;
        this.finishedAt = finishedAt;
    }
    
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    
    public String getRoomId() { return roomId; }
    public void setRoomId(String roomId) { this.roomId = roomId; }
    
    public String getGameType() { return gameType; }
    public void setGameType(String gameType) { this.gameType = gameType; }
    
    public GameStatus getStatus() { return status; }
    public void setStatus(GameStatus status) { this.status = status; }
    
    public String getCurrentState() { return currentState; }
    public void setCurrentState(String currentState) { this.currentState = currentState; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    
    public LocalDateTime getFinishedAt() { return finishedAt; }
    public void setFinishedAt(LocalDateTime finishedAt) { this.finishedAt = finishedAt; }
    
    @PrePersist
    protected void onCreate() {
        if (createdAt == null) {
            createdAt = LocalDateTime.now();
        }
        if (status == null) {
            status = GameStatus.PLAYING;
        }
    }
    
    public enum GameStatus {
        WAITING,
        PLAYING,
        FINISHED
    }
    
    public static GameRecordBuilder builder() { return new GameRecordBuilder(); }
    
    public static class GameRecordBuilder {
        private String id;
        private String roomId;
        private String gameType;
        private GameStatus status;
        private String currentState;
        private LocalDateTime createdAt;
        private LocalDateTime finishedAt;
        
        public GameRecordBuilder id(String id) { this.id = id; return this; }
        public GameRecordBuilder roomId(String roomId) { this.roomId = roomId; return this; }
        public GameRecordBuilder gameType(String gameType) { this.gameType = gameType; return this; }
        public GameRecordBuilder status(GameStatus status) { this.status = status; return this; }
        public GameRecordBuilder currentState(String currentState) { this.currentState = currentState; return this; }
        public GameRecordBuilder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }
        public GameRecordBuilder finishedAt(LocalDateTime finishedAt) { this.finishedAt = finishedAt; return this; }
        
        public GameRecord build() {
            return new GameRecord(id, roomId, gameType, status, currentState, createdAt, finishedAt);
        }
    }
}
