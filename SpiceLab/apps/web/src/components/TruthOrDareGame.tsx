import { useCallback, useMemo } from 'react'

interface GameState {
  gameType: string
  phase: 'waiting' | 'selecting' | 'answering' | 'finished' | 'rolling'
  currentTurn: string
  playerOrder: string[]
  diceValue: number
  otherDiceValue?: number
  playerDice?: Record<string, number>
  question: {
    id: string
    type: 'truth' | 'dare'
    content: string
    level: number
  } | null
  round: number
}

interface TruthOrDareGameProps {
  gameState: GameState
  currentPlayerId: string
  playerNames: string[]
  onAction: (action: string, data?: Record<string, unknown>) => void
}

export default function TruthOrDareGame({
  gameState,
  currentPlayerId,
  playerNames,
  onAction
}: TruthOrDareGameProps) {
  const { phase, playerOrder, playerDice } = gameState

  const isMyTurn = useMemo(() => {
    return gameState.currentTurn === currentPlayerId
  }, [gameState.currentTurn, currentPlayerId])

  const myIndex = useMemo(() => {
    return playerOrder.indexOf(currentPlayerId)
  }, [playerOrder, currentPlayerId])

  const otherIndex = useMemo(() => {
    return myIndex === 0 ? 1 : 0
  }, [myIndex])

  const myDiceValue = useMemo(() => {
    if (playerDice && playerDice[currentPlayerId]) {
      return playerDice[currentPlayerId]
    }
    if (phase === 'selecting' && isMyTurn) {
      return gameState.diceValue
    }
    return null
  }, [playerDice, currentPlayerId, phase, isMyTurn, gameState.diceValue])

  const otherDiceValue = useMemo(() => {
    if (playerDice) {
      const otherPlayerId = playerOrder[otherIndex]
      if (playerDice[otherPlayerId]) {
        return playerDice[otherPlayerId]
      }
    }
    if (phase === 'selecting' && !isMyTurn) {
      return gameState.otherDiceValue || gameState.diceValue
    }
    return null
  }, [playerDice, playerOrder, otherIndex, phase, isMyTurn, gameState.otherDiceValue, gameState.diceValue])

  const allRolled = useMemo(() => {
    if (!playerDice) return false
    return playerOrder.every(pid => playerDice[pid] != null)
  }, [playerDice, playerOrder])

  const handleRoll = useCallback(() => {
    onAction('roll')
  }, [onAction])

  const handleChoose = useCallback((choice: 'truth' | 'dare') => {
    onAction('choose', { choice })
  }, [onAction])

  const handleComplete = useCallback(() => {
    onAction('complete')
  }, [onAction])

  const renderDiceAnimation = (value: number | null, label: string, isMe: boolean) => {
    if (value === null) {
      return (
        <div className={`flex flex-col items-center p-4 rounded-xl ${isMe ? 'bg-blue-50 border-2 border-blue-300' : 'bg-gray-50 border-2 border-gray-200'}`}>
          <div className="text-4xl mb-2">🎲</div>
          <div className="text-sm text-gray-500">{label}</div>
          <div className="text-gray-400 text-xs mt-1">等待掷骰...</div>
        </div>
      )
    }

    const emoji = value === 6 ? '💯' : value >= 4 ? '🎉' : value >= 2 ? '👌' : '😅'

    return (
      <div className={`flex flex-col items-center p-4 rounded-xl ${isMe ? 'bg-blue-100 border-2 border-blue-500' : 'bg-gray-100 border-2 border-gray-400'}`}>
        <div className="text-6xl mb-2">{emoji}</div>
        <div className="text-4xl font-bold text-gray-800">{value}</div>
        <div className="text-sm text-gray-500">{label}</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-br from-pink-100 to-purple-100">
      <div className="w-full max-w-lg">
        <div className="text-center mb-6">
          <div className="text-sm text-gray-500 mb-1">第 {gameState.round} 轮</div>
          <h1 className="text-2xl font-bold text-gray-800">真心话大冒险</h1>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            {playerOrder.map((pid, idx) => (
              <div key={pid} className="text-center">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold ${pid === currentPlayerId ? 'bg-blue-500' : 'bg-gray-400'}`}>
                  {playerNames[idx]?.[0] || `P${idx + 1}`}
                </div>
                <div className="text-xs mt-1 text-gray-600">
                  {playerNames[idx] || `玩家${idx + 1}`}
                  {pid === currentPlayerId && ' (你)'}
                </div>
              </div>
            ))}
          </div>

          {phase === 'rolling' && (
            <div className="text-center">
              <div className="mb-4">
                <div className="text-lg font-semibold text-gray-700 mb-4">🎲 同时掷骰子比大小！</div>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  {renderDiceAnimation(myDiceValue, playerNames[myIndex] || '你', true)}
                  {renderDiceAnimation(otherDiceValue, playerNames[otherIndex] || '对手', false)}
                </div>
              </div>
              {myDiceValue === null ? (
                <div className="space-y-3">
                  <button
                    onClick={handleRoll}
                    className="w-full py-4 px-8 rounded-xl text-xl font-bold shadow-lg transition-all bg-gradient-to-r from-orange-500 to-red-500 text-white hover:from-orange-600 hover:to-red-600 hover:scale-105"
                  >
                    🎲 掷骰子
                  </button>
                  {otherDiceValue === null && (
                    <p className="text-gray-500 text-sm">等待对方掷骰...</p>
                  )}
                </div>
              ) : (
                <div className="animate-pulse">
                  <div className="text-lg text-gray-600">等待其他玩家...</div>
                </div>
              )}
            </div>
          )}

          {phase === 'selecting' && allRolled && (
            <div className="text-center">
              <div className="mb-4">
                <div className="text-lg font-semibold text-gray-700 mb-2">
                  {isMyTurn ? '🎯 你的点数更高！请选择' : '😅 对手点数更高'}
                </div>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  {renderDiceAnimation(myDiceValue, playerNames[myIndex] || '你', true)}
                  {renderDiceAnimation(otherDiceValue, playerNames[otherIndex] || '对手', false)}
                </div>
              </div>
              {isMyTurn ? (
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
              ) : (
                <div className="text-gray-500">等待 {playerNames[myIndex]} 选择...</div>
              )}
            </div>
          )}

          {phase === 'answering' && gameState.question && (
            <div className="text-center">
              <div className={`
                inline-block px-4 py-2 rounded-full text-sm font-medium mb-4
                ${gameState.question.type === 'truth' ? 'bg-blue-100 text-blue-700' : 'bg-red-100 text-red-700'}
              `}>
                {gameState.question.type === 'truth' ? '💬 真心话' : '🔥 大冒险'}
                <span className="ml-2 opacity-70">等级 {gameState.question.level}</span>
              </div>
              <p className="text-xl text-gray-800 mb-6 leading-relaxed p-4 bg-gray-50 rounded-xl">
                {gameState.question.content}
              </p>
              {isMyTurn && (
                <button
                  onClick={handleComplete}
                  className="px-8 py-3 bg-green-500 text-white rounded-xl font-semibold hover:bg-green-600 transition-colors shadow-lg"
                >
                  ✓ 完成了
                </button>
              )}
              {!isMyTurn && (
                <div className="text-gray-500">等待 {playerNames[myIndex]} 回答...</div>
              )}
            </div>
          )}

          {phase === 'waiting' && (
            <div className="text-center">
              <div className="text-lg text-gray-600 mb-4">等待开始下一轮...</div>
              {isMyTurn && (
                <button
                  onClick={handleRoll}
                  className="px-8 py-4 bg-green-500 text-white rounded-xl font-bold text-lg hover:bg-green-600 transition-colors shadow-lg"
                >
                  🎲 掷骰子
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
