package com.spicelab.backend.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "players")
public class Player {
    
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;
    
    @Column(nullable = false)
    private String roomId;
    
    @Column(nullable = false, length = 50)
    private String nickname;
    
    @Column(nullable = false)
    private boolean isHost;
    
    @Column(nullable = false)
    private LocalDateTime joinedAt;
    
    private LocalDateTime leftAt;
    
    public Player() {}
    
    public Player(String id, String roomId, String nickname, boolean isHost, LocalDateTime joinedAt, LocalDateTime leftAt) {
        this.id = id;
        this.roomId = roomId;
        this.nickname = nickname;
        this.isHost = isHost;
        this.joinedAt = joinedAt;
        this.leftAt = leftAt;
    }
    
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    
    public String getRoomId() { return roomId; }
    public void setRoomId(String roomId) { this.roomId = roomId; }
    
    public String getNickname() { return nickname; }
    public void setNickname(String nickname) { this.nickname = nickname; }
    
    public boolean isHost() { return isHost; }
    public void setHost(boolean host) { isHost = host; }
    
    public LocalDateTime getJoinedAt() { return joinedAt; }
    public void setJoinedAt(LocalDateTime joinedAt) { this.joinedAt = joinedAt; }
    
    public LocalDateTime getLeftAt() { return leftAt; }
    public void setLeftAt(LocalDateTime leftAt) { this.leftAt = leftAt; }
    
    @PrePersist
    protected void onCreate() {
        if (joinedAt == null) {
            joinedAt = LocalDateTime.now();
        }
    }
    
    public static PlayerBuilder builder() { return new PlayerBuilder(); }
    
    public static class PlayerBuilder {
        private String id;
        private String roomId;
        private String nickname;
        private boolean isHost;
        private LocalDateTime joinedAt;
        private LocalDateTime leftAt;
        
        public PlayerBuilder id(String id) { this.id = id; return this; }
        public PlayerBuilder roomId(String roomId) { this.roomId = roomId; return this; }
        public PlayerBuilder nickname(String nickname) { this.nickname = nickname; return this; }
        public PlayerBuilder isHost(boolean isHost) { this.isHost = isHost; return this; }
        public PlayerBuilder joinedAt(LocalDateTime joinedAt) { this.joinedAt = joinedAt; return this; }
        public PlayerBuilder leftAt(LocalDateTime leftAt) { this.leftAt = leftAt; return this; }
        
        public Player build() { return new Player(id, roomId, nickname, isHost, joinedAt, leftAt); }
    }
}
