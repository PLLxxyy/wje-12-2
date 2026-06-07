import { create } from 'zustand'
import {
  DEFAULT_GRID_SIZE,
  DEFAULT_CELL_SIZE,
  DEFAULT_MOVE_INTERVAL,
  MIN_GRID_SIZE,
  MAX_GRID_SIZE,
  MIN_MOVE_INTERVAL,
  MAX_MOVE_INTERVAL,
  SETTINGS_KEY,
} from '@/utils/constants'

interface Settings {
  gridSize: number
  cellSize: number
  moveInterval: number
}

interface SettingsStore extends Settings {
  loadSettings: () => void
  setGridSize: (size: number) => void
  setMoveInterval: (interval: number) => void
  resetSettings: () => void
}

const loadSettingsFromStorage = (): Settings => {
  if (typeof window === 'undefined') {
    return {
      gridSize: DEFAULT_GRID_SIZE,
      cellSize: DEFAULT_CELL_SIZE,
      moveInterval: DEFAULT_MOVE_INTERVAL,
    }
  }
  const stored = localStorage.getItem(SETTINGS_KEY)
  if (stored) {
    try {
      const parsed = JSON.parse(stored)
      return {
        gridSize: Math.min(MAX_GRID_SIZE, Math.max(MIN_GRID_SIZE, parsed.gridSize ?? DEFAULT_GRID_SIZE)),
        cellSize: DEFAULT_CELL_SIZE,
        moveInterval: Math.min(MAX_MOVE_INTERVAL, Math.max(MIN_MOVE_INTERVAL, parsed.moveInterval ?? DEFAULT_MOVE_INTERVAL)),
      }
    } catch {
      // fallback to defaults
    }
  }
  return {
    gridSize: DEFAULT_GRID_SIZE,
    cellSize: DEFAULT_CELL_SIZE,
    moveInterval: DEFAULT_MOVE_INTERVAL,
  }
}

const saveSettingsToStorage = (settings: Settings) => {
  if (typeof window === 'undefined') return
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings))
}

const initialSettings = loadSettingsFromStorage()

export const useSettingsStore = create<SettingsStore>((set, get) => ({
  gridSize: initialSettings.gridSize,
  cellSize: initialSettings.cellSize,
  moveInterval: initialSettings.moveInterval,

  loadSettings: () => {
    const settings = loadSettingsFromStorage()
    set(settings)
  },

  setGridSize: (size: number) => {
    const clamped = Math.min(MAX_GRID_SIZE, Math.max(MIN_GRID_SIZE, size))
    const state = get()
    const newSettings = {
      gridSize: clamped,
      cellSize: state.cellSize,
      moveInterval: state.moveInterval,
    }
    saveSettingsToStorage(newSettings)
    set(newSettings)
  },

  setMoveInterval: (interval: number) => {
    const clamped = Math.min(MAX_MOVE_INTERVAL, Math.max(MIN_MOVE_INTERVAL, interval))
    const state = get()
    const newSettings = {
      gridSize: state.gridSize,
      cellSize: state.cellSize,
      moveInterval: clamped,
    }
    saveSettingsToStorage(newSettings)
    set(newSettings)
  },

  resetSettings: () => {
    const defaultSettings = {
      gridSize: DEFAULT_GRID_SIZE,
      cellSize: DEFAULT_CELL_SIZE,
      moveInterval: DEFAULT_MOVE_INTERVAL,
    }
    saveSettingsToStorage(defaultSettings)
    set(defaultSettings)
  },
}))
