package com.spicelab.backend.controller;

import com.spicelab.backend.model.Room;
import com.spicelab.backend.repository.RoomRepository;
import com.spicelab.backend.service.RoomService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/rooms")
@CrossOrigin(origins = "*")
public class RoomController {

    private final RoomService roomService;
    private final RoomRepository roomRepository;

    public RoomController(RoomService roomService, RoomRepository roomRepository) {
        this.roomService = roomService;
        this.roomRepository = roomRepository;
    }

    @PostMapping
    public ResponseEntity<Map<String, Object>> createRoom(@RequestBody Map<String, String> request) {
        String nickname = request.get("nickname");
        if (nickname == null || nickname.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Nickname is required"));
        }
        
        Map<String, Object> result = roomService.createRoom(nickname.trim());
        return ResponseEntity.ok(result);
    }

    @PostMapping("/{roomCode}/join")
    public ResponseEntity<Map<String, Object>> joinRoom(
            @PathVariable String roomCode,
            @RequestBody Map<String, String> request) {
        
        String nickname = request.get("nickname");
        if (nickname == null || nickname.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Nickname is required"));
        }
        
        return roomRepository.findByCode(roomCode.toUpperCase())
                .<ResponseEntity<Map<String, Object>>>map(room -> {
                    if (room.getStatus() == Room.RoomStatus.FINISHED) {
                        return ResponseEntity.badRequest()
                                .body(Map.of("error", "Room has ended"));
                    }
                    Map<String, Object> result = roomService.joinRoom(room, nickname.trim());
                    return ResponseEntity.ok(result);
                })
                .orElse(ResponseEntity.badRequest()
                        .body(Map.of("error", "Room not found")));
    }

    @GetMapping("/{roomCode}")
    public ResponseEntity<Map<String, Object>> getRoom(@PathVariable String roomCode) {
        return roomRepository.findByCode(roomCode.toUpperCase())
                .map(room -> {
                    Map<String, Object> result = new HashMap<>();
                    result.put("room", room);
                    result.put("players", roomService.getPlayersInRoom(room.getId()));
                    return ResponseEntity.ok(result);
                })
                .orElse(ResponseEntity.badRequest()
                        .body(Map.of("error", "Room not found")));
    }
}
