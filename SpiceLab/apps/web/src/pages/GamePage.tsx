import { useParams } from 'react-router-dom'

export default function GamePage() {
  const { roomCode } = useParams<{ roomCode: string }>()
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          游戏进行中
        </h1>
        <p className="text-gray-600">房间: {roomCode}</p>
        <p className="text-gray-500 mt-4">游戏组件将在这里渲染...</p>
      </div>
    </div>
  )
}
