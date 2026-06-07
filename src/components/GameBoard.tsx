import { useGameStore } from '@/store/useGameStore'
import { useSettingsStore } from '@/store/useSettingsStore'

export function GameBoard() {
  const snake = useGameStore((state) => state.snake)
  const food = useGameStore((state) => state.food)
  const gridSize = useSettingsStore((state) => state.gridSize)
  const cellSize = useSettingsStore((state) => state.cellSize)

  const boardSize = gridSize * cellSize

  return (
    <div
      className="relative bg-snake-darker border-4 border-snake-body rounded-xl shadow-glow-green bg-grid-pattern"
      style={{
        width: boardSize,
        height: boardSize,
        backgroundSize: `${cellSize}px ${cellSize}px`,
      }}
    >
      {snake.map((segment, index) => {
        const isHead = index === 0
        const isTail = index === snake.length - 1
        let bgColor = 'bg-snake-body'
        if (isHead) bgColor = 'bg-snake-head shadow-glow-green'
        else if (isTail) bgColor = 'bg-snake-tail'

        return (
          <div
            key={`snake-${index}`}
            className={`absolute ${bgColor} rounded-md transition-all duration-75`}
            style={{
              width: cellSize - 2,
              height: cellSize - 2,
              left: segment.x * cellSize + 1,
              top: segment.y * cellSize + 1,
              opacity: isHead ? 1 : 1 - index * 0.02,
            }}
          >
            {isHead && (
              <div className="w-full h-full flex items-center justify-center gap-1">
                <div className="w-1.5 h-1.5 rounded-full bg-snake-darker" />
                <div className="w-1.5 h-1.5 rounded-full bg-snake-darker" />
              </div>
            )}
          </div>
        )
      })}

      <div
        className="absolute bg-snake-food rounded-full shadow-glow-red animate-pulse-fast"
        style={{
          width: cellSize - 6,
          height: cellSize - 6,
          left: food.x * cellSize + 3,
          top: food.y * cellSize + 3,
        }}
      >
        <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-green-700 rounded-full" />
      </div>
    </div>
  )
}
