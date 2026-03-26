import { useState, useCallback } from 'react'
import LudoBoard from './LudoBoard'
import Dice from './Dice'

type Piece = {
  id: number
  position: number
  onBoard: boolean
  homeStretchPos: number
  finished: boolean
}

type LudoGameState = {
  phase: 'waiting' | 'selecting' | 'moving' | 'finished'
  currentTurn: string
  playerOrder: string[]
  playerColors: Record<string, string>
  lastDiceValue: number
  movablePieces: number[]
  pieces: Record<string, Piece[]>
  winner: string | null
}

type LudoGameProps = {
  gameState: LudoGameState
  currentPlayerId: string
  onAction: (type: string, data?: Record<string, unknown>) => void
}

const COLORS: Record<string, string> = {
  red: '红方',
  blue: '蓝方',
  yellow: '黄方',
  green: '绿方',
}

const COLOR_CLASSES: Record<string, string> = {
  red: 'bg-red-500 text-white',
  blue: 'bg-blue-500 text-white',
  yellow: 'bg-yellow-500 text-black',
  green: 'bg-green-500 text-white',
}

export default function LudoGame({ 
  gameState, 
  currentPlayerId, 
  onAction 
}: LudoGameProps) {
  const [rolling, setRolling] = useState(false)
  
  const isMyTurn = gameState.currentTurn === currentPlayerId
  const currentPhase = gameState.phase
  const myColor = gameState.playerColors[currentPlayerId]
  
  const handleRoll = useCallback(() => {
    if (!isMyTurn || currentPhase !== 'waiting') return
    setRolling(true)
    setTimeout(() => {
      onAction('roll_dice')
      setRolling(false)
    }, 800)
  }, [isMyTurn, currentPhase, onAction])
  
  const handleSelectPiece = useCallback((pieceId: number) => {
    if (!isMyTurn || currentPhase !== 'selecting') return
    onAction('move_piece', { pieceId })
  }, [isMyTurn, currentPhase, onAction])
  
  const handleSkip = useCallback(() => {
    if (!isMyTurn) return
    onAction('skip')
  }, [isMyTurn, onAction])
  
  const myPieces = gameState.pieces[currentPlayerId] || []
  const finishedCount = myPieces.filter(p => p.finished).length
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-4">
          <h1 className="text-2xl font-bold text-gray-800">飞行棋</h1>
          <p className="text-gray-600">
            你是 <span className={`px-2 py-0.5 rounded ${COLOR_CLASSES[myColor]}`}>
              {COLORS[myColor]}
            </span>
            {' '}· 已完成 {finishedCount}/4
          </p>
        </div>
        
        <div className="flex flex-col lg:flex-row gap-6 items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <LudoBoard
              pieces={gameState.pieces}
              playerColors={gameState.playerColors}
              movablePieces={gameState.movablePieces}
              onSelectPiece={handleSelectPiece}
              currentTurn={gameState.currentTurn}
            />
            
            {gameState.winner && (
              <div className="bg-yellow-100 border-2 border-yellow-400 rounded-xl p-4 text-center">
                <p className="text-xl font-bold text-yellow-800">
                  🎉 游戏结束！
                </p>
                <p className="text-yellow-700">
                  {COLORS[gameState.playerColors[gameState.winner]]} 获胜！
                </p>
              </div>
            )}
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-6 w-full lg:w-64">
            <div className="mb-4">
              <h3 className="font-semibold text-gray-700 mb-2">玩家顺序</h3>
              <div className="space-y-2">
                {gameState.playerOrder.map((playerId, idx) => {
                  const color = gameState.playerColors[playerId]
                  const isCurrent = playerId === gameState.currentTurn
                  const pieces = gameState.pieces[playerId] || []
                  const finished = pieces.filter(p => p.finished).length
                  
                  return (
                    <div
                      key={playerId}
                      className={`
                        flex items-center justify-between p-2 rounded-lg
                        ${isCurrent ? 'ring-2 ring-primary-400 bg-primary-50' : 'bg-gray-50'}
                      `}
                    >
                      <div className="flex items-center gap-2">
                        <span className={`w-3 h-3 rounded-full ${
                          color === 'red' ? 'bg-red-500' :
                          color === 'blue' ? 'bg-blue-500' :
                          color === 'yellow' ? 'bg-yellow-500' : 'bg-green-500'
                        }`} />
                        <span className="text-sm font-medium">
                          {playerId === currentPlayerId ? '你' : `玩家${idx + 1}`}
                        </span>
                      </div>
                      <span className="text-xs text-gray-500">{finished}/4</span>
                    </div>
                  )
                })}
              </div>
            </div>
            
            <div className="border-t pt-4">
              {currentPhase === 'waiting' && (
                <div className="text-center">
                  <p className="text-sm text-gray-600 mb-3">
                    {isMyTurn ? '轮到你了，掷骰子！' : '等待对方掷骰子...'}
                  </p>
                  <Dice
                    value={gameState.lastDiceValue || 1}
                    rolling={rolling}
                    onRoll={handleRoll}
                    disabled={!isMyTurn}
                  />
                </div>
              )}
              
              {currentPhase === 'selecting' && (
                <div className="text-center">
                  <p className="text-sm text-gray-600 mb-2">
                    骰子: <span className="text-xl font-bold">{gameState.lastDiceValue}</span>
                  </p>
                  {isMyTurn ? (
                    <>
                      <p className="text-sm text-gray-600 mb-3">
                        {gameState.movablePieces.length > 0 
                          ? '点击棋盘上闪烁的棋子移动'
                          : '没有可移动的棋子'}
                      </p>
                      {gameState.movablePieces.length === 0 && (
                        <button
                          onClick={handleSkip}
                          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                        >
                          跳过
                        </button>
                      )}
                    </>
                  ) : (
                    <p className="text-sm text-gray-500">等待对方选择...</p>
                  )}
                </div>
              )}
              
              {currentPhase === 'finished' && (
                <div className="text-center">
                  <p className="text-lg font-bold text-gray-800">游戏结束</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
