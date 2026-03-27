package com.spicelab.backend.service;

import com.spicelab.backend.model.Player;
import com.spicelab.backend.model.Room;
import com.spicelab.backend.repository.PlayerRepository;
import com.spicelab.backend.repository.RoomRepository;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class RoomService {

    private static final String CHARACTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    private static final int CODE_LENGTH = 6;
    
    private final RoomRepository roomRepository;
    private final PlayerRepository playerRepository;
    private final SimpMessagingTemplate messagingTemplate;
    private final SecureRandom random = new SecureRandom();

    public RoomService(RoomRepository roomRepository, 
                       PlayerRepository playerRepository,
                       SimpMessagingTemplate messagingTemplate) {
        this.roomRepository = roomRepository;
        this.playerRepository = playerRepository;
        this.messagingTemplate = messagingTemplate;
    }

    @Transactional
    public Map<String, Object> createRoom(String nickname) {
        String code = generateUniqueCode();
        
        Room room = Room.builder()
                .code(code)
                .status(Room.RoomStatus.WAITING)
                .expiresAt(LocalDateTime.now().plusHours(24))
                .build();
        room = roomRepository.save(room);
        
        Player host = Player.builder()
                .roomId(room.getId())
                .nickname(nickname)
                .isHost(true)
                .build();
        host = playerRepository.save(host);
        
        room.setHostId(host.getId());
        roomRepository.save(room);
        
        Map<String, Object> result = new HashMap<>();
        result.put("room", room);
        result.put("player", host);
        return result;
    }

    @Transactional
    public Map<String, Object> joinRoom(Room room, String nickname) {
        long playerCount = playerRepository.countByRoomIdAndLeftAtIsNull(room.getId());
        if (playerCount >= 4) {
            throw new IllegalStateException("Room is full");
        }
        
        Player player = Player.builder()
                .roomId(room.getId())
                .nickname(nickname)
                .isHost(false)
                .build();
        player = playerRepository.save(player);
        
        broadcastRoomUpdate(room.getId());
        
        Map<String, Object> result = new HashMap<>();
        result.put("room", room);
        result.put("player", player);
        return result;
    }

    public List<Player> getPlayersInRoom(String roomId) {
        return playerRepository.findByRoomIdAndLeftAtIsNull(roomId);
    }

    private String generateUniqueCode() {
        String code;
        do {
            code = generateCode();
        } while (roomRepository.existsByCode(code));
        return code;
    }

    private String generateCode() {
        StringBuilder sb = new StringBuilder(CODE_LENGTH);
        for (int i = 0; i < CODE_LENGTH; i++) {
            sb.append(CHARACTERS.charAt(random.nextInt(CHARACTERS.length())));
        }
        return sb.toString();
    }

    private void broadcastRoomUpdate(String roomId) {
        Map<String, Object> update = new HashMap<>();
        update.put("type", "room_update");
        update.put("players", getPlayersInRoom(roomId));
        messagingTemplate.convertAndSend("/topic/room/" + roomId, update);
    }
}
