package com.spicelab.backend.controller;

import com.spicelab.backend.service.GameService;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import java.util.Map;

@Controller
public class GameEventController {

    private final GameService gameService;
    private final SimpMessagingTemplate messagingTemplate;

    public GameEventController(GameService gameService, SimpMessagingTemplate messagingTemplate) {
        this.gameService = gameService;
        this.messagingTemplate = messagingTemplate;
    }

    /**
     * Handle game action and broadcast updated state to all players in the room
     */
    @MessageMapping("/game/{roomCode}/action")
    public Map<String, Object> handleAction(
            @DestinationVariable String roomCode,
            Map<String, Object> request) {
        
        String actionType = (String) request.get("action");
        String playerId = (String) request.get("playerId");
        @SuppressWarnings("unchecked")
        Map<String, Object> actionData = (Map<String, Object>) request.get("data");
        
        // Process the action
        Map<String, Object> result = gameService.performAction(
                roomCode.toUpperCase(),
                actionType,
                playerId,
                actionData
        );
        
        // Broadcast updated state to all players in the room
        Map<String, Object> gameState = (Map<String, Object>) result.get("gameState");
        messagingTemplate.convertAndSend("/topic/game/" + roomCode.toUpperCase(), gameState);
        
        return result;
    }

    /**
     * Broadcast game state to a specific room
     */
    public void broadcastGameState(String roomCode, Map<String, Object> gameState) {
        messagingTemplate.convertAndSend("/topic/game/" + roomCode.toUpperCase(), gameState);
    }
}
