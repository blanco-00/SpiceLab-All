import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5168'

export default function JoinPage() {
  const { roomCode } = useParams<{ roomCode: string }>()
  const navigate = useNavigate()
  const [nickname, setNickname] = useState('')
  const [error, setError] = useState('')
  const [isJoining, setIsJoining] = useState(false)

  const handleJoin = async () => {
    if (!nickname.trim()) return
    setIsJoining(true)
    setError('')
    
    try {
      const res = await fetch(`${API_BASE}/api/rooms/${roomCode}/join`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nickname: nickname.trim() }),
      })
      
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || '加入房间失败')
      }
      
      const data = await res.json()
      sessionStorage.setItem('playerId', data.player.id)
      sessionStorage.setItem('playerNickname', data.player.nickname)
      sessionStorage.setItem('isHost', 'false')
      navigate(`/room/${roomCode}`)
    } catch (e: any) {
      setError(e.message)
      setIsJoining(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-br from-pink-100 to-purple-100">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="text-4xl mb-4">🎮</div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            加入房间
          </h1>
          <p className="text-gray-600">
            房间号: <span className="font-bold text-purple-600">{roomCode}</span>
          </p>
        </div>
        
        <div className="bg-white rounded-2xl shadow-xl p-6">
          <input
            type="text"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            placeholder="输入你的昵称"
            maxLength={20}
            onKeyDown={(e) => e.key === 'Enter' && handleJoin()}
            className="w-full py-4 px-6 border-2 border-gray-200 rounded-xl text-lg text-center tracking-wider focus:border-purple-500 focus:outline-none mb-4"
          />
          
          {error && (
            <div className="text-red-500 text-center text-sm mb-4">{error}</div>
          )}
          
          <button
            onClick={handleJoin}
            disabled={!nickname.trim() || isJoining}
            className="w-full py-4 px-6 bg-green-600 text-white rounded-xl text-lg font-bold hover:bg-green-700 transition-colors shadow-lg disabled:opacity-50"
          >
            {isJoining ? '加入中...' : '✓ 加入房间'}
          </button>
        </div>
        
        <div className="text-center mt-6">
          <button 
            onClick={() => navigate('/')}
            className="text-gray-500 hover:text-gray-700"
          >
            ← 返回首页
          </button>
        </div>
      </div>
    </div>
  )
}
