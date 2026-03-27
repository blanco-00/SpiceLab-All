package com.spicelab.backend.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "rooms")
public class Room {
    
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;
    
    @Column(unique = true, nullable = false, length = 6)
    private String code;
    
    @Column
    private String hostId;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private RoomStatus status;
    
    @Column(length = 50)
    private String gameType;
    
    @Column(nullable = false)
    private LocalDateTime createdAt;
    
    private LocalDateTime expiresAt;
    
    public Room() {}
    
    public Room(String id, String code, String hostId, RoomStatus status, String gameType, LocalDateTime createdAt, LocalDateTime expiresAt) {
        this.id = id;
        this.code = code;
        this.hostId = hostId;
        this.status = status;
        this.gameType = gameType;
        this.createdAt = createdAt;
        this.expiresAt = expiresAt;
    }
    
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    
    public String getCode() { return code; }
    public void setCode(String code) { this.code = code; }
    
    public String getHostId() { return hostId; }
    public void setHostId(String hostId) { this.hostId = hostId; }
    
    public RoomStatus getStatus() { return status; }
    public void setStatus(RoomStatus status) { this.status = status; }
    
    public String getGameType() { return gameType; }
    public void setGameType(String gameType) { this.gameType = gameType; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    
    public LocalDateTime getExpiresAt() { return expiresAt; }
    public void setExpiresAt(LocalDateTime expiresAt) { this.expiresAt = expiresAt; }
    
    @PrePersist
    protected void onCreate() {
        if (createdAt == null) {
            createdAt = LocalDateTime.now();
        }
        if (status == null) {
            status = RoomStatus.WAITING;
        }
    }
    
    public static RoomBuilder builder() { return new RoomBuilder(); }
    
    public static class RoomBuilder {
        private String id;
        private String code;
        private String hostId;
        private RoomStatus status;
        private String gameType;
        private LocalDateTime createdAt;
        private LocalDateTime expiresAt;
        
        public RoomBuilder id(String id) { this.id = id; return this; }
        public RoomBuilder code(String code) { this.code = code; return this; }
        public RoomBuilder hostId(String hostId) { this.hostId = hostId; return this; }
        public RoomBuilder status(RoomStatus status) { this.status = status; return this; }
        public RoomBuilder gameType(String gameType) { this.gameType = gameType; return this; }
        public RoomBuilder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }
        public RoomBuilder expiresAt(LocalDateTime expiresAt) { this.expiresAt = expiresAt; return this; }
        
        public Room build() {
            return new Room(id, code, hostId, status, gameType, createdAt, expiresAt);
        }
    }
    
    public enum RoomStatus {
        WAITING,
        PLAYING,
        FINISHED
    }
}
