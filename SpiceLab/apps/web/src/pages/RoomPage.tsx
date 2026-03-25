import { useParams } from 'react-router-dom'

export default function RoomPage() {
  const { roomCode } = useParams<{ roomCode: string }>()
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            房间: {roomCode}
          </h1>
          <p className="text-gray-600">等待玩家加入...</p>
        </div>
        
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">玩家列表</h2>
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 font-semibold">
                你
              </div>
              <div>
                <div className="font-medium text-gray-800">等待中...</div>
                <div className="text-sm text-gray-500">主持人</div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex gap-3">
          <button className="flex-1 py-3 px-4 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors">
            复制链接
          </button>
          <button className="flex-1 py-3 px-4 bg-primary-500 text-white rounded-xl font-medium hover:bg-primary-600 transition-colors">
            开始游戏
          </button>
        </div>
      </div>
    </div>
  )
}
