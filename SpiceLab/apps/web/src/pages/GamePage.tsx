import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import TruthOrDareGame from '@/components/TruthOrDareGame'

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5168'

interface GameState {
  gameType: string
  phase: 'waiting' | 'selecting' | 'answering' | 'finished'
  currentTurn: string
  playerOrder: string[]
  diceValue: number
  question: {
    id: string
    type: 'truth' | 'dare'
    content: string
    level: number
  } | null
  round: number
}

export default function GamePage() {
  const { roomCode } = useParams<{ roomCode: string }>()
  const navigate = useNavigate()
  const [gameState, setGameState] = useState<GameState | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const playerId = sessionStorage.getItem('playerId')

  const fetchGameState = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/games/${roomCode}/state`)
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || '获取游戏状态失败')
      }
      const data = await res.json()
      setGameState(data.gameState)
      setError('')
    } catch (e: any) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!playerId) {
      navigate('/')
      return
    }
    fetchGameState()
    const interval = setInterval(fetchGameState, 3000)
    return () => clearInterval(interval)
  }, [roomCode])

  const handleAction = async (action: string, data?: Record<string, unknown>) => {
    try {
      const body: Record<string, unknown> = { action, playerId }
      if (data) {
        Object.assign(body, data)
      }
      const res = await fetch(`${API_BASE}/api/games/${roomCode}/action`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      if (!res.ok) {
        const result = await res.json()
        throw new Error(result.error || '操作失败')
      }
      const result = await res.json()
      setGameState(result.gameState)
    } catch (e: any) {
      alert(e.message)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-600">加载中...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <div className="text-red-500 mb-4">{error}</div>
        <button onClick={() => navigate(`/room/${roomCode}`)} className="text-primary-500">
          返回房间
        </button>
      </div>
    )
  }

  if (!gameState) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <div className="text-gray-600 mb-4">游戏状态加载中...</div>
        <button onClick={() => navigate(`/room/${roomCode}`)} className="text-primary-500">
          返回房间
        </button>
      </div>
    )
  }

  if (gameState.gameType === 'TRUTH_OR_DARE' || gameState.gameType === 'truth-or-dare') {
    return (
      <TruthOrDareGame
        gameState={gameState}
        currentPlayerId={playerId || ''}
        onAction={handleAction}
      />
    )
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          游戏: {gameState.gameType}
        </h1>
        <p className="text-gray-600">房间: {roomCode}</p>
        <p className="text-gray-500 mt-4">游戏组件加载中...</p>
      </div>
    </div>
  )
}
