export const DEFAULT_GRID_SIZE = 20
export const DEFAULT_CELL_SIZE = 24
export const DEFAULT_MOVE_INTERVAL = 120

export const MIN_GRID_SIZE = 10
export const MAX_GRID_SIZE = 30
export const MIN_MOVE_INTERVAL = 50
export const MAX_MOVE_INTERVAL = 300

export const GRID_SIZE = DEFAULT_GRID_SIZE
export const CELL_SIZE = DEFAULT_CELL_SIZE
export const MOVE_INTERVAL = DEFAULT_MOVE_INTERVAL

export const INITIAL_SNAKE = [
  { x: 10, y: 10 },
  { x: 9, y: 10 },
  { x: 8, y: 10 },
]

export const INITIAL_DIRECTION = 'RIGHT' as const

export const HIGH_SCORE_KEY = 'snake_high_score'
export const SETTINGS_KEY = 'snake_game_settings'
