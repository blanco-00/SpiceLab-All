import { useMemo } from 'react'

type Piece = {
  id: number
  position: number
  onBoard: boolean
  homeStretchPos: number
  finished: boolean
}

type LudoBoardProps = {
  pieces: Record<string, Piece[]>
  playerColors: Record<string, string>
  movablePieces: number[]
  onSelectPiece: (pieceId: number) => void
  currentTurn: string
}

const COLORS = {
  red: '#ef4444',
  blue: '#3b82f6', 
  yellow: '#eab308',
  green: '#22c55e',
}

const BOARD_POSITIONS = [
  [null, null, null, 0, 1, 2, null, null, null, null, null, null, 12, 11, 10, null, null, null],
  [null, null, null, null, null, 3, null, null, null, null, null, null, null, null, 9, null, null, null],
  [null, null, null, null, null, 4, null, null, null, null, null, null, null, null, 8, null, null, null],
  [51, null, null, null, null, 5, 6, 7, 8, 9, 10, 11, null, null, 7, 6, 5, null],
  [50, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, 4, null],
  [49, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, 3, null],
  [null, 48, 47, 46, 45, null, null, null, null, null, null, null, null, null, null, null, 2, null],
  [null, null, null, null, 44, null, null, null, null, null, null, null, null, null, null, null, 1, null],
  [null, null, null, null, 43, null, null, null, null, null, null, null, null, null, null, null, 0, null],
  [null, null, null, null, 42, null, null, null, null, null, null, null, null, null, null, null, null, null],
  [null, null, null, null, 41, null, null, null, null, null, null, null, null, null, null, null, null, null],
  [null, null, null, null, 40, null, null, null, null, null, null, null, null, null, null, null, null, null],
  [35, 36, 37, 38, 39, null, null, null, null, null, null, null, 14, 15, 16, 17, 18, 19],
  [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, 20],
  [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, 21],
  [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, 22],
  [30, 31, 32, 33, 34, null, null, null, null, null, null, null, 26, 25, 24, 23, null, null],
]

export default function LudoBoard({ 
  pieces, 
  playerColors, 
  movablePieces, 
  onSelectPiece, 
  currentTurn 
}: LudoBoardProps) {
  const piecePositions = useMemo(() => {
    const positions: Record<number, { playerId: string; piece: Piece }[]> = {}
    
    Object.entries(pieces).forEach(([playerId, playerPieces]) => {
      playerPieces.forEach(piece => {
        if (piece.onBoard && !piece.finished) {
          const pos = piece.position
          if (!positions[pos]) positions[pos] = []
          positions[pos].push({ playerId, piece })
        }
      })
    })
    
    return positions
  }, [pieces])
  
  const renderCell = (rowIdx: number, colIdx: number, position: number | null) => {
    const isCenter = rowIdx >= 6 && rowIdx <= 10 && colIdx >= 6 && colIdx <= 10
    
    if (isCenter) {
      return (
        <div 
          key={`${rowIdx}-${colIdx}`}
          className="w-8 h-8 bg-gradient-to-br from-red-200 via-blue-200 to-green-200"
        />
      )
    }
    
    if (position === null) {
      const baseColors = [
        [[0,0], [0,1], [0,2], [1,0], [1,1], [1,2], [2,0], [2,1], [2,2]],
        [[0,15], [0,16], [0,17], [1,15], [1,16], [1,17], [2,15], [2,16], [2,17]],
        [[15,0], [15,1], [15,2], [16,0], [16,1], [16,2], [17,0], [17,1], [17,2]],
        [[15,15], [15,16], [15,17], [16,15], [16,16], [16,17], [17,15], [17,16], [17,17]],
      ]
      
      let bgColor = 'bg-gray-100'
      for (let i = 0; i < baseColors.length; i++) {
        if (baseColors[i].some(([r, c]) => r === rowIdx && c === colIdx)) {
          bgColor = ['bg-red-100', 'bg-blue-100', 'bg-green-100', 'bg-yellow-100'][i]
          break
        }
      }
      
      return <div key={`${rowIdx}-${colIdx}`} className={`w-8 h-8 ${bgColor}`} />
    }
    
    const piecesAtPosition = piecePositions[position] || []
    
    return (
      <div 
        key={`${rowIdx}-${colIdx}`}
        className="w-8 h-8 bg-white border border-gray-200 flex items-center justify-center relative"
      >
        {piecesAtPosition.map(({ playerId, piece }, idx) => {
          const color = COLORS[playerColors[playerId] as keyof typeof COLORS]
          const isMovable = movablePieces.includes(piece.id) && playerId === currentTurn
          
          return (
            <button
              key={piece.id}
              onClick={() => isMovable && onSelectPiece(piece.id)}
              disabled={!isMovable}
              className={`
                absolute w-5 h-5 rounded-full border-2 border-white shadow-md
                ${isMovable ? 'cursor-pointer ring-2 ring-yellow-400 animate-pulse' : ''}
              `}
              style={{ 
                backgroundColor: color,
                transform: `translate(${idx * 4}px, ${idx * 4}px)`,
                zIndex: idx + 1,
              }}
            />
          )
        })}
      </div>
    )
  }
  
  return (
    <div className="inline-block border-4 border-gray-800 rounded-lg overflow-hidden shadow-xl">
      <div className="grid gap-0" style={{ gridTemplateColumns: 'repeat(18, 2rem)' }}>
        {BOARD_POSITIONS.map((row, rowIdx) => 
          row.map((position, colIdx) => renderCell(rowIdx, colIdx, position))
        )}
      </div>
    </div>
  )
}
