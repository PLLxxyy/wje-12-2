import { X, RotateCcw, Grid3X3, Gauge } from 'lucide-react'
import { useSettingsStore } from '@/store/useSettingsStore'
import { useGameStore } from '@/store/useGameStore'
import {
  MIN_GRID_SIZE,
  MAX_GRID_SIZE,
  MIN_MOVE_INTERVAL,
  MAX_MOVE_INTERVAL,
  DEFAULT_GRID_SIZE,
  DEFAULT_MOVE_INTERVAL,
} from '@/utils/constants'

interface SettingsPanelProps {
  isOpen: boolean
  onClose: () => void
}

export function SettingsPanel({ isOpen, onClose }: SettingsPanelProps) {
  const gridSize = useSettingsStore((state) => state.gridSize)
  const moveInterval = useSettingsStore((state) => state.moveInterval)
  const setGridSize = useSettingsStore((state) => state.setGridSize)
  const setMoveInterval = useSettingsStore((state) => state.setMoveInterval)
  const resetSettings = useSettingsStore((state) => state.resetSettings)
  const resetBoard = useGameStore((state) => state.resetBoard)

  if (!isOpen) return null

  const speedLabel = (interval: number) => {
    if (interval <= 70) return '极快'
    if (interval <= 100) return '快'
    if (interval <= 150) return '正常'
    if (interval <= 200) return '慢'
    return '极慢'
  }

  const handleGridSizeChange = (value: number) => {
    setGridSize(value)
    resetBoard()
  }

  const handleMoveIntervalChange = (value: number) => {
    setMoveInterval(value)
  }

  const handleReset = () => {
    resetSettings()
    resetBoard()
  }

  return (
    <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/60 backdrop-blur-md rounded-xl">
      <div className="bg-snake-darker border-2 border-snake-body rounded-xl p-6 w-full max-w-sm shadow-glow-green">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-pixel text-snake-head">游戏设置</h2>
          <button
            onClick={onClose}
            className="p-2 text-snake-body/60 hover:text-snake-head transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="space-y-6">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-snake-body">
              <Grid3X3 size={18} />
              <label className="font-mono text-sm">网格大小</label>
              <span className="ml-auto font-pixel text-snake-head">{gridSize} × {gridSize}</span>
            </div>
            <input
              type="range"
              min={MIN_GRID_SIZE}
              max={MAX_GRID_SIZE}
              value={gridSize}
              onChange={(e) => handleGridSizeChange(Number(e.target.value))}
              className="w-full h-2 bg-snake-body/20 rounded-lg appearance-none cursor-pointer accent-snake-head"
            />
            <div className="flex justify-between text-xs font-mono text-snake-body/40">
              <span>{MIN_GRID_SIZE} (小)</span>
              <span>{DEFAULT_GRID_SIZE} (默认)</span>
              <span>{MAX_GRID_SIZE} (大)</span>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-2 text-snake-body">
              <Gauge size={18} />
              <label className="font-mono text-sm">移动速度</label>
              <span className="ml-auto font-pixel text-snake-head">{speedLabel(moveInterval)}</span>
            </div>
            <input
              type="range"
              min={MIN_MOVE_INTERVAL}
              max={MAX_MOVE_INTERVAL}
              step={10}
              value={moveInterval}
              onChange={(e) => handleMoveIntervalChange(Number(e.target.value))}
              className="w-full h-2 bg-snake-body/20 rounded-lg appearance-none cursor-pointer accent-snake-head"
            />
            <div className="flex justify-between text-xs font-mono text-snake-body/40">
              <span>快</span>
              <span>{speedLabel(DEFAULT_MOVE_INTERVAL)} (默认)</span>
              <span>慢</span>
            </div>
          </div>

          <div className="pt-4 border-t border-snake-body/20">
            <button
              onClick={handleReset}
              className="w-full py-3 px-4 bg-snake-body/10 hover:bg-snake-body/20 text-snake-body font-mono text-sm rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <RotateCcw size={16} />
              恢复默认设置
            </button>
          </div>
        </div>

        <p className="mt-4 text-xs font-mono text-snake-body/40 text-center">
          设置自动保存到浏览器
        </p>
      </div>
    </div>
  )
}
