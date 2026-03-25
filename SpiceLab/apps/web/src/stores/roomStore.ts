import { create } from 'zustand'
import type { Room, Player, GameState, WebSocketMessage } from '@/types'

type RoomStore = {
  room: Room | null
  currentPlayer: Player | null
  gameState: GameState | null
  isConnected: boolean
  
  setRoom: (room: Room | null) => void
  setCurrentPlayer: (player: Player | null) => void
  setGameState: (state: GameState | null) => void
  setConnected: (connected: boolean) => void
  
  handleWebSocketMessage: (message: WebSocketMessage) => void
  reset: () => void
}

export const useRoomStore = create<RoomStore>((set) => ({
  room: null,
  currentPlayer: null,
  gameState: null,
  isConnected: false,
  
  setRoom: (room) => set({ room }),
  setCurrentPlayer: (player) => set({ currentPlayer: player }),
  setGameState: (gameState) => set({ gameState }),
  setConnected: (isConnected) => set({ isConnected }),
  
  handleWebSocketMessage: (message) => {
    switch (message.type) {
      case 'room_update':
        set({ room: message.payload as Room })
        break
      case 'game_update':
        set({ gameState: message.payload as GameState })
        break
      case 'player_joined':
      case 'player_left':
        set({ room: message.payload as Room })
        break
      case 'error':
        console.error('WebSocket error:', message.payload)
        break
    }
  },
  
  reset: () => set({
    room: null,
    currentPlayer: null,
    gameState: null,
    isConnected: false,
  }),
}))
