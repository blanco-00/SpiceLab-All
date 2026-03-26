import { useCallback } from 'react'

  
type DiceProps = {
  value: number
  rolling: boolean
  onRoll: () => void
  disabled?: boolean
}

export default function Dice({ value, rolling, onRoll, disabled }: DiceProps) {
  const handleRoll = useCallback(() => {
    if (disabled || rolling) return
    onRoll()
  }, [disabled, rolling, onRoll])
  
  const getDiceFace = (num: number) => {
    const positions: Record<number, string> = {
      1: 'grid place-items-center',
      2: 'grid grid-cols-2 p-2',
      3: 'grid grid-cols-2 p-2',
      4: 'grid grid-cols-2 gap-2 p-2',
      5: 'grid grid-cols-2 gap-2 p-2',
      6: 'grid grid-cols-3 gap-1 p-2',
    }
    return positions[num] || positions[1]
  }
  
  const Dot = () => (
    <div className="w-3 h-3 bg-gray-800 rounded-full" />
  )
  
  const renderDots = (num: number) => {
    switch (num) {
      case 1:
        return (
          <div className="w-full h-full flex items-center justify-center">
            <Dot />
          </div>
        )
      case 2:
        return (
          <>
            <div className="flex justify-start items-start"><Dot /></div>
            <div className="flex justify-end items-end"><Dot /></div>
          </>
        )
      case 3:
        return (
          <>
            <div className="flex justify-start items-start"><Dot /></div>
            <div className="flex items-center justify-center"><Dot /></div>
            <div className="col-span-2 flex justify-end items-end"><Dot /></div>
          </>
        )
      case 4:
        return (
          <>
            <div className="flex justify-center items-center"><Dot /></div>
            <div className="flex justify-center items-center"><Dot /></div>
            <div className="flex justify-center items-center"><Dot /></div>
            <div className="flex justify-center items-center"><Dot /></div>
          </>
        )
      case 5:
        return (
          <>
            <div className="flex justify-center items-center"><Dot /></div>
            <div className="flex justify-center items-center"><Dot /></div>
            <div className="col-span-2 flex justify-center items-center"><Dot /></div>
            <div className="flex justify-center items-center"><Dot /></div>
            <div className="flex justify-center items-center"><Dot /></div>
          </>
        )
      case 6:
        return (
          <>
            <div className="flex justify-center items-center"><Dot /></div>
            <div className="flex justify-center items-center"><Dot /></div>
            <div className="flex justify-center items-center"><Dot /></div>
            <div className="flex justify-center items-center"><Dot /></div>
            <div className="flex justify-center items-center"><Dot /></div>
            <div className="flex justify-center items-center"><Dot /></div>
          </>
        )
      default:
        return <Dot />
    }
  }
  
  return (
    <div className="flex flex-col items-center gap-4">
      <button
        onClick={handleRoll}
        disabled={disabled || rolling}
        className={`
          w-24 h-24 bg-white rounded-xl shadow-lg
          ${getDiceFace(rolling ? displayValue : value)}
          transform transition-all duration-200
          ${rolling ? 'animate-bounce' : 'hover:scale-105'}
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
          border-2 border-gray-200
        `}
      >
        {renderDots(rolling ? displayValue : value)}
      </button>
      
      {!disabled && (
        <button
          onClick={handleRoll}
          disabled={rolling}
          className="px-6 py-2 bg-primary-500 text-white rounded-lg font-medium hover:bg-primary-600 disabled:opacity-50 transition-colors"
        >
          {rolling ? '掷骰中...' : '掷骰子'}
        </button>
      )}
    </div>
  )
}
