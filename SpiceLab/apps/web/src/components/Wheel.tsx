import { useState, useCallback } from 'react'

type WheelProps = {
  options: string[]
  onSpinEnd?: (result: string) => void
  disabled?: boolean
}

const COLORS = [
  '#ef4444', '#f97316', '#eab308', '#22c55e', 
  '#3b82f6', '#8b5cf6', '#ec4899', '#06b6d4'
]

export default function Wheel({ options, onSpinEnd, disabled }: WheelProps) {
  const [rotation, setRotation] = useState(0)
  const [spinning, setSpinning] = useState(false)
  const [result, setResult] = useState<string | null>(null)
  
  const handleSpin = useCallback(() => {
    if (disabled || spinning || options.length === 0) return
    
    setSpinning(true)
    setResult(null)
    
    const randomIndex = Math.floor(Math.random() * options.length)
    const segmentAngle = 360 / options.length
    const targetAngle = 360 - (randomIndex * segmentAngle + segmentAngle / 2)
    const totalRotation = rotation + 360 * 5 + targetAngle - (rotation % 360)
    
    setRotation(totalRotation)
    
    setTimeout(() => {
      setSpinning(false)
      const selectedOption = options[randomIndex]
      setResult(selectedOption)
      onSpinEnd?.(selectedOption)
    }, 4000)
  }, [disabled, spinning, options, rotation, onSpinEnd])
  
  const radius = 100
  const center = radius
  const segmentAngle = 360 / options.length
  
  const createArcPath = (startAngle: number, endAngle: number) => {
    const startRad = (startAngle - 90) * Math.PI / 180
    const endRad = (endAngle - 90) * Math.PI / 180
    
    const x1 = center + radius * Math.cos(startRad)
    const y1 = center + radius * Math.sin(startRad)
    const x2 = center + radius * Math.cos(endRad)
    const y2 = center + radius * Math.sin(endRad)
    
    const largeArc = endAngle - startAngle > 180 ? 1 : 0
    
    return `M ${center} ${center} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} Z`
  }
  
  const getTextPosition = (index: number) => {
    const angle = (index * segmentAngle + segmentAngle / 2 - 90) * Math.PI / 180
    const textRadius = radius * 0.65
    return {
      x: center + textRadius * Math.cos(angle),
      y: center + textRadius * Math.sin(angle),
    }
  }
  
  return (
    <div className="flex flex-col items-center gap-6">
      <div className="relative">
        <div className="absolute -top-2 left-1/2 -translate-x-1/2 z-10">
          <div className="w-0 h-0 border-l-8 border-r-8 border-t-12 border-l-transparent border-r-transparent border-t-gray-800" />
        </div>
        
        <svg 
          width={radius * 2 + 10} 
          height={radius * 2 + 10}
          className="transform origin-center"
          style={{
            transform: `rotate(${rotation}deg)`,
            transition: spinning ? 'transform 4s cubic-bezier(0.17, 0.67, 0.12, 0.99)' : 'none',
          }}
        >
          <g transform={`translate(5, 5)`}>
            {options.map((option, index) => {
              const startAngle = index * segmentAngle
              const endAngle = startAngle + segmentAngle
              const textPos = getTextPosition(index)
              
              return (
                <g key={index}>
                  <path
                    d={createArcPath(startAngle, endAngle)}
                    fill={COLORS[index % COLORS.length]}
                    stroke="white"
                    strokeWidth="2"
                  />
                  <text
                    x={textPos.x}
                    y={textPos.y}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fill="white"
                    fontSize="10"
                    fontWeight="bold"
                    transform={`rotate(${startAngle + segmentAngle / 2}, ${textPos.x}, ${textPos.y})`}
                    style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.5)' }}
                  >
                    {option.length > 6 ? option.slice(0, 6) + '...' : option}
                  </text>
                </g>
              )
            })}
            <circle
              cx={center}
              cy={center}
              r="20"
              fill="white"
              stroke="#374151"
              strokeWidth="3"
            />
          </g>
        </svg>
      </div>
      
      <button
        onClick={handleSpin}
        disabled={disabled || spinning}
        className={`
          px-8 py-3 rounded-full font-bold text-lg shadow-lg
          transition-all duration-200
          ${disabled || spinning
            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
            : 'bg-gradient-to-r from-pink-500 to-purple-500 text-white hover:scale-105 hover:shadow-xl'
          }
        `}
      >
        {spinning ? '转动中...' : '开始!'}
      </button>
      
      {result && !spinning && (
        <div className="bg-gradient-to-r from-pink-100 to-purple-100 rounded-xl p-4 text-center shadow-md">
          <p className="text-sm text-gray-600 mb-1">结果</p>
          <p className="text-xl font-bold text-purple-700">{result}</p>
        </div>
      )}
    </div>
  )
}
