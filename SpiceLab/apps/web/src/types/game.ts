export type Player = {
  id: string
  nickname: string
  isHost: boolean
  joinedAt: Date
}

export type Room = {
  id: string
  code: string
  hostId: string
  players: Player[]
  status: 'waiting' | 'playing' | 'finished'
  gameType: GameType | null
  createdAt: Date
}

export type GameType = 'truth-or-dare' | 'ludo' | 'wheel'

export type Question = {
  id: string
  type: 'truth' | 'dare'
  content: string
  level: 1 | 2 | 3 | 4 | 5 | 6
}

export type GameState = {
  type: GameType
  currentTurn: string
  phase: GamePhase
  data: Record<string, unknown>
}

export type GamePhase = 
  | 'waiting'
  | 'rolling'
  | 'selecting'
  | 'answering'
  | 'moving'
  | 'finished'

export type WebSocketMessage = {
  type: 'room_update' | 'game_update' | 'player_joined' | 'player_left' | 'error'
  payload: unknown
}
