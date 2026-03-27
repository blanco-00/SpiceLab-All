import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5168'

export default function HomePage() {
  const navigate = useNavigate()
  const [roomCode, setRoomCode] = useState('')
  const [nickname, setNickname] = useState('')
  const [isCreating, setIsCreating] = useState(false)
  const [error, setError] = useState('')
  
  const handleCreateRoom = async () => {
    const name = nickname.trim() || 'Player'
    setIsCreating(true)
    setError('')
    try {
      const res = await fetch(`${API_BASE}/api/rooms`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nickname: name }),
      })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || '创建房间失败')
      }
      const data = await res.json()
      sessionStorage.setItem('playerId', data.player.id)
      sessionStorage.setItem('playerNickname', data.player.nickname)
      sessionStorage.setItem('isHost', 'true')
      navigate(`/room/${data.room.code}`)
    } catch (e: any) {
      setError(e.message)
    } finally {
      setIsCreating(false)
    }
  }
  
  const handleJoinRoom = async () => {
    if (!roomCode.trim()) return
    const name = nickname.trim() || 'Player'
    setError('')
    try {
      const res = await fetch(`${API_BASE}/api/rooms/${roomCode.trim().toUpperCase()}/join`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nickname: name }),
      })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || '加入房间失败')
      }
      const data = await res.json()
      sessionStorage.setItem('playerId', data.player.id)
      sessionStorage.setItem('playerNickname', data.player.nickname)
      sessionStorage.setItem('isHost', 'false')
      navigate(`/room/${roomCode.trim().toUpperCase()}`)
    } catch (e: any) {
      setError(e.message)
    }
  }
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="text-center mb-12">
        <h1 className="text-5xl font-bold text-gray-800 mb-4">
          暧昧实验室
        </h1>
        <p className="text-xl text-gray-600">
          私密情侣互动游戏平台
        </p>
      </div>
      
      <div className="w-full max-w-md space-y-4">
        <input
          type="text"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          placeholder="输入你的昵称"
          maxLength={20}
          className="w-full py-4 px-6 border-2 border-gray-200 rounded-xl text-lg text-center tracking-wider focus:border-primary-500 focus:outline-none"
        />
        
        <button
          onClick={handleCreateRoom}
          disabled={isCreating}
          className="w-full py-4 px-6 bg-primary-500 text-white rounded-xl text-lg font-semibold hover:bg-primary-600 transition-colors shadow-lg disabled:opacity-50"
        >
          {isCreating ? '创建中...' : '创建房间'}
        </button>
        
        {error && (
          <div className="text-red-500 text-center text-sm">{error}</div>
        )}
        
        <div className="flex gap-2">
          <input
            type="text"
            value={roomCode}
            onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
            placeholder="输入房间码"
            maxLength={6}
            className="flex-1 py-4 px-6 border-2 border-gray-200 rounded-xl text-lg text-center tracking-wider focus:border-primary-500 focus:outline-none"
          />
          <button
            onClick={handleJoinRoom}
            disabled={!roomCode.trim()}
            className="py-4 px-6 bg-gray-800 text-white rounded-xl text-lg font-semibold hover:bg-gray-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            加入
          </button>
        </div>
        
        <div className="pt-8">
          <h2 className="text-lg font-semibold text-gray-700 mb-4 text-center">
            选择游戏
          </h2>
          <div className="grid grid-cols-3 gap-4">
            <div className="p-4 bg-white rounded-xl shadow-md text-center cursor-pointer hover:shadow-lg transition-shadow">
              <div className="text-3xl mb-2">🎲</div>
              <div className="text-sm font-medium text-gray-700">真心话大冒险</div>
            </div>
            <div className="p-4 bg-white rounded-xl shadow-md text-center cursor-pointer hover:shadow-lg transition-shadow">
              <div className="text-3xl mb-2">✈️</div>
              <div className="text-sm font-medium text-gray-700">飞行棋</div>
            </div>
            <div className="p-4 bg-white rounded-xl shadow-md text-center cursor-pointer hover:shadow-lg transition-shadow">
              <div className="text-3xl mb-2">🎡</div>
              <div className="text-sm font-medium text-gray-700">大转盘</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
