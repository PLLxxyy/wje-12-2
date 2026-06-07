import { create } from 'zustand'
import type { Position, Direction } from '@/types/game'
import { INITIAL_DIRECTION, HIGH_SCORE_KEY } from '@/utils/constants'
import { useSettingsStore } from '@/store/useSettingsStore'
import {
  getNextHeadPosition,
  checkWallCollision,
  checkSelfCollision,
  checkFoodCollision,
  isOppositeDirection,
  generateRandomFood,
  getInitialSnake,
} from '@/utils/gameUtils'

interface GameStore {
  snake: Position[]
  food: Position
  direction: Direction
  nextDirection: Direction
  score: number
  highScore: number
  isGameOver: boolean
  isPlaying: boolean
  setDirection: (dir: Direction) => void
  moveSnake: () => void
  startGame: () => void
  resetGame: () => void
  loadHighScore: () => void
  resetBoard: () => void
}

const loadHighScoreFromStorage = (): number => {
  if (typeof window === 'undefined') return 0
  const stored = localStorage.getItem(HIGH_SCORE_KEY)
  return stored ? parseInt(stored, 10) : 0
}

const getGridSize = () => useSettingsStore.getState().gridSize

export const useGameStore = create<GameStore>((set, get) => {
  const initialGridSize = getGridSize()
  const initialSnake = getInitialSnake(initialGridSize)

  return {
    snake: initialSnake,
    food: generateRandomFood(initialSnake, initialGridSize),
    direction: INITIAL_DIRECTION,
    nextDirection: INITIAL_DIRECTION,
    score: 0,
    highScore: 0,
    isGameOver: false,
    isPlaying: false,

    loadHighScore: () => {
      set({ highScore: loadHighScoreFromStorage() })
    },

    setDirection: (dir: Direction) => {
      const { direction, isGameOver, isPlaying } = get()
      if (isGameOver || !isPlaying) return
      if (isOppositeDirection(direction, dir)) return
      set({ nextDirection: dir })
    },

    moveSnake: () => {
      const state = get()
      if (state.isGameOver || !state.isPlaying) return

      const gridSize = getGridSize()
      const direction = state.nextDirection
      const head = state.snake[0]
      const newHead = getNextHeadPosition(head, direction)

      if (checkWallCollision(newHead, gridSize)) {
        const newHigh = Math.max(state.score, state.highScore)
        if (typeof window !== 'undefined') {
          localStorage.setItem(HIGH_SCORE_KEY, newHigh.toString())
        }
        set({
          isGameOver: true,
          isPlaying: false,
          highScore: newHigh,
        })
        return
      }

      const bodyWithoutTail = state.snake.slice(0, -1)
      if (checkSelfCollision(newHead, bodyWithoutTail)) {
        const newHigh = Math.max(state.score, state.highScore)
        if (typeof window !== 'undefined') {
          localStorage.setItem(HIGH_SCORE_KEY, newHigh.toString())
        }
        set({
          isGameOver: true,
          isPlaying: false,
          highScore: newHigh,
        })
        return
      }

      const ateFood = checkFoodCollision(newHead, state.food)
      const newSnake = ateFood
        ? [newHead, ...state.snake]
        : [newHead, ...state.snake.slice(0, -1)]

      const newScore = ateFood ? state.score + 1 : state.score
      const newFood = ateFood ? generateRandomFood(newSnake, gridSize) : state.food

      set({
        snake: newSnake,
        food: newFood,
        direction,
        score: newScore,
      })
    },

    startGame: () => {
      const state = get()
      if (state.isGameOver) return
      set({ isPlaying: true })
    },

    resetGame: () => {
      const gridSize = getGridSize()
      const newSnake = getInitialSnake(gridSize)
      set({
        snake: newSnake,
        food: generateRandomFood(newSnake, gridSize),
        direction: INITIAL_DIRECTION,
        nextDirection: INITIAL_DIRECTION,
        score: 0,
        isGameOver: false,
        isPlaying: true,
      })
    },

    resetBoard: () => {
      const gridSize = getGridSize()
      const newSnake = getInitialSnake(gridSize)
      set({
        snake: newSnake,
        food: generateRandomFood(newSnake, gridSize),
        direction: INITIAL_DIRECTION,
        nextDirection: INITIAL_DIRECTION,
        score: 0,
        isGameOver: false,
        isPlaying: false,
      })
    },
  }
})
