import { useState, useCallback } from 'react'
import Dice from '@/components/Dice'

type ToDGameState = {
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

type TruthOrDareGameProps = {
  gameState: ToDGameState
  currentPlayerId: string
  onAction: (type: string, data?: Record<string, unknown>) => void
}

export default function TruthOrDareGame({ 
  gameState, 
  currentPlayerId, 
  onAction 
}: TruthOrDareGameProps) {
  const [rolling, setRolling] = useState(false)
  
  const isMyTurn = gameState.currentTurn === currentPlayerId
  const currentPhase = gameState.phase
  
  const handleRoll = useCallback(() => {
    if (!isMyTurn || currentPhase !== 'waiting') return
    setRolling(true)
    setTimeout(() => {
      onAction('roll_dice')
      setRolling(false)
    }, 1000)
  }, [isMyTurn, currentPhase, onAction])
  
  const handleChoose = useCallback((choice: 'truth' | 'dare') => {
    if (!isMyTurn || currentPhase !== 'selecting') return
    onAction('choose', { choice })
  }, [isMyTurn, currentPhase, onAction])
  
  const handleComplete = useCallback(() => {
    if (!isMyTurn || currentPhase !== 'answering') return
    onAction('complete')
  }, [isMyTurn, currentPhase, onAction])
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-br from-pink-100 to-purple-100">
      <div className="w-full max-w-lg">
        <div className="text-center mb-6">
          <div className="text-sm text-gray-500 mb-1">第 {gameState.round} 轮</div>
          <h1 className="text-2xl font-bold text-gray-800">真心话大冒险</h1>
        </div>
        
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-4">
          <div className="flex justify-center gap-2 mb-6">
            {gameState.playerOrder.map((playerId, index) => (
              <div
                key={playerId}
                className={`
                  w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium
                  ${playerId === gameState.currentTurn 
                    ? 'bg-primary-500 text-white ring-4 ring-primary-200' 
                    : 'bg-gray-100 text-gray-600'}
                `}
              >
                {index + 1}
              </div>
            ))}
          </div>
          
          {currentPhase === 'waiting' && (
            <div className="text-center">
              <p className="text-gray-600 mb-4">
                {isMyTurn ? '轮到你了！点击掷骰子' : `等待玩家 ${gameState.currentTurn.slice(0, 8)}... 掷骰子`}
              </p>
              <Dice
                value={gameState.diceValue || 1}
                rolling={rolling}
                onRoll={handleRoll}
                disabled={!isMyTurn}
              />
            </div>
          )}
          
          {currentPhase === 'selecting' && (
            <div className="text-center">
              <p className="text-gray-600 mb-2">骰子点数: {gameState.diceValue}</p>
              <p className="text-gray-600 mb-6">
                {isMyTurn ? '选择真心话还是大冒险？' : '等待选择...'}
              </p>
              {isMyTurn && (
                <div className="flex gap-4 justify-center">
                  <button
                    onClick={() => handleChoose('truth')}
                    className="px-8 py-4 bg-blue-500 text-white rounded-xl font-semibold text-lg hover:bg-blue-600 transition-colors shadow-lg"
                  >
                    💬 真心话
                  </button>
                  <button
                    onClick={() => handleChoose('dare')}
                    className="px-8 py-4 bg-red-500 text-white rounded-xl font-semibold text-lg hover:bg-red-600 transition-colors shadow-lg"
                  >
                    🔥 大冒险
                  </button>
                </div>
              )}
            </div>
          )}
          
          {currentPhase === 'answering' && gameState.question && (
            <div className="text-center">
              <div className={`
                inline-block px-4 py-1 rounded-full text-sm font-medium mb-4
                ${gameState.question.type === 'truth' ? 'bg-blue-100 text-blue-700' : 'bg-red-100 text-red-700'}
              `}>
                {gameState.question.type === 'truth' ? '💬 真心话' : '🔥 大冒险'}
                <span className="ml-2 opacity-70">等级 {gameState.question.level}</span>
              </div>
              <p className="text-xl text-gray-800 mb-6 leading-relaxed">
                {gameState.question.content}
              </p>
              {isMyTurn && (
                <button
                  onClick={handleComplete}
                  className="px-8 py-3 bg-green-500 text-white rounded-xl font-semibold hover:bg-green-600 transition-colors"
                >
                  ✓ 完成了
                </button>
              )}
            </div>
          )}
          
          {currentPhase === 'finished' && (
            <div className="text-center">
              <p className="text-xl text-gray-800">游戏结束！</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
