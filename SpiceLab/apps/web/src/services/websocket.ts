import { useRoomStore } from '@/stores'

const WS_URL = import.meta.env.VITE_WS_URL || 'ws://localhost:5168/ws'

type WebSocketService = {
  connect: (roomId: string, playerId: string) => void
  disconnect: () => void
  send: (type: string, payload: unknown) => void
}

let ws: WebSocket | null = null

export const wsService: WebSocketService = {
  connect: (roomId: string, playerId: string) => {
    if (ws?.readyState === WebSocket.OPEN) {
      return
    }
    
    const url = `${WS_URL}?roomId=${roomId}&playerId=${playerId}`
    ws = new WebSocket(url)
    
    ws.onopen = () => {
      useRoomStore.getState().setConnected(true)
    }
    
    ws.onclose = () => {
      useRoomStore.getState().setConnected(false)
    }
    
    ws.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data)
        useRoomStore.getState().handleWebSocketMessage(message)
      } catch (e) {
        console.error('Failed to parse WebSocket message:', e)
      }
    }
    
    ws.onerror = (error) => {
      console.error('WebSocket error:', error)
    }
  },
  
  disconnect: () => {
    if (ws) {
      ws.close()
      ws = null
    }
    useRoomStore.getState().setConnected(false)
  },
  
  send: (type: string, payload: unknown) => {
    if (ws?.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({ type, payload }))
    }
  },
}
