package com.spicelab.backend.controller;

import com.spicelab.backend.model.Player;
import com.spicelab.backend.repository.PlayerRepository;
import com.spicelab.backend.service.GameService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/games")
@CrossOrigin(origins = "*")
public class GameController {

    private final GameService gameService;
    private final PlayerRepository playerRepository;

    public GameController(GameService gameService, PlayerRepository playerRepository) {
        this.gameService = gameService;
        this.playerRepository = playerRepository;
    }

    @PostMapping("/start")
    public ResponseEntity<Map<String, Object>> startGame(@RequestBody Map<String, String> request) {
        String roomCode = request.get("roomCode");
        String gameType = request.get("gameType");
        
        if (roomCode == null || roomCode.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "roomCode is required"));
        }
        if (gameType == null || gameType.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "gameType is required"));
        }
        
        try {
            Map<String, Object> result = gameService.startGame(roomCode.trim(), gameType.trim().toUpperCase());
            return ResponseEntity.ok(result);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        } catch (IllegalStateException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/{roomCode}/action")
    public ResponseEntity<Map<String, Object>> performAction(
            @PathVariable String roomCode,
            @RequestBody Map<String, Object> request) {
        
        String actionType = (String) request.get("action");
        Object playerIdObj = request.get("playerId");
        Object choiceObj = request.get("choice");
        
        if (actionType == null || actionType.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "action is required"));
        }
        if (playerIdObj == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "playerId is required"));
        }
        
        String playerId = playerIdObj.toString();
        
        Map<String, Object> actionData = new HashMap<>();
        if (choiceObj != null) {
            actionData.put("choice", choiceObj.toString());
        }
        
        try {
            Map<String, Object> result = gameService.performAction(
                roomCode.toUpperCase(), 
                actionType.trim(), 
                playerId, 
                actionData.isEmpty() ? null : actionData
            );
            return ResponseEntity.ok(result);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        } catch (IllegalStateException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/{roomCode}/state")
    public ResponseEntity<Map<String, Object>> getGameState(@PathVariable String roomCode) {
        try {
            Map<String, Object> result = gameService.getGameState(roomCode.toUpperCase());
            return ResponseEntity.ok(result);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        } catch (IllegalStateException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}
