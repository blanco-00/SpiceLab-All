import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5168'

interface Player {
  id: string
  nickname: string
  isHost: boolean
  joinedAt: string
}

interface Room {
  id: string
  code: string
  status: 'WAITING' | 'PLAYING' | 'FINISHED'
  hostId: string
}

export default function RoomPage() {
  const { roomCode } = useParams<{ roomCode: string }>()
  const navigate = useNavigate()
  const [room, setRoom] = useState<Room | null>(null)
  const [players, setPlayers] = useState<Player[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const playerId = sessionStorage.getItem('playerId')
  const isHost = sessionStorage.getItem('isHost') === 'true'

  const fetchRoom = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/rooms/${roomCode}`)
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || '获取房间信息失败')
      }
      const data = await res.json()
      setRoom(data.room)
      setPlayers(data.players || [])
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
    fetchRoom()
    const interval = setInterval(fetchRoom, 5000)
    return () => clearInterval(interval)
  }, [roomCode])

  const handleStartGame = async () => {
    if (!room || !isHost) return
    
    try {
      const res = await fetch(`${API_BASE}/api/games/start`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ roomCode: room.code, gameType: 'TRUTH_OR_DARE' }),
      })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || '开始游戏失败')
      }
      navigate(`/game/${room.code}`)
    } catch (e: any) {
      alert(e.message)
    }
  }

  const handleCopyLink = () => {
    const link = `${window.location.origin}/room/${roomCode}`
    navigator.clipboard.writeText(link)
    alert('链接已复制!')
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
        <button onClick={() => navigate('/')} className="text-primary-500">
          返回首页
        </button>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            房间: {roomCode}
          </h1>
          <p className="text-gray-600">
            {room?.status === 'WAITING' ? '等待玩家加入...' : '游戏进行中'}
          </p>
        </div>
        
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">玩家列表</h2>
          <div className="space-y-3">
            {players.map((player) => (
              <div key={player.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 font-semibold">
                  {player.nickname.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div className="font-medium text-gray-800">
                    {player.nickname}
                    {player.id === playerId && ' (你)'}
                  </div>
                  <div className="text-sm text-gray-500">
                    {player.isHost ? '主持人' : '玩家'}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="flex gap-3">
          <button 
            onClick={handleCopyLink}
            className="flex-1 py-3 px-4 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors"
          >
            复制链接
          </button>
          {isHost && (
            <button 
              onClick={handleStartGame}
              className="flex-1 py-3 px-4 bg-primary-500 text-white rounded-xl font-medium hover:bg-primary-600 transition-colors"
            >
              开始游戏
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
