import type { Position, Direction } from '@/types/game'
import { DEFAULT_GRID_SIZE } from './constants'

export function getNextHeadPosition(head: Position, direction: Direction): Position {
  const moves: Record<Direction, Position> = {
    UP: { x: head.x, y: head.y - 1 },
    DOWN: { x: head.x, y: head.y + 1 },
    LEFT: { x: head.x - 1, y: head.y },
    RIGHT: { x: head.x + 1, y: head.y },
  }
  return moves[direction]
}

export function checkWallCollision(position: Position, gridSize: number = DEFAULT_GRID_SIZE): boolean {
  return (
    position.x < 0 ||
    position.x >= gridSize ||
    position.y < 0 ||
    position.y >= gridSize
  )
}

export function checkSelfCollision(head: Position, snakeBody: Position[]): boolean {
  return snakeBody.some((segment) => segment.x === head.x && segment.y === head.y)
}

export function checkFoodCollision(head: Position, food: Position): boolean {
  return head.x === food.x && head.y === food.y
}

export function isOppositeDirection(current: Direction, next: Direction): boolean {
  const opposites: Record<Direction, Direction> = {
    UP: 'DOWN',
    DOWN: 'UP',
    LEFT: 'RIGHT',
    RIGHT: 'LEFT',
  }
  return opposites[current] === next
}

export function generateRandomFood(snake: Position[], gridSize: number = DEFAULT_GRID_SIZE): Position {
  const occupied = new Set(snake.map((seg) => `${seg.x},${seg.y}`))
  const emptySpots: Position[] = []

  for (let x = 0; x < gridSize; x++) {
    for (let y = 0; y < gridSize; y++) {
      if (!occupied.has(`${x},${y}`)) {
        emptySpots.push({ x, y })
      }
    }
  }

  if (emptySpots.length === 0) {
    return { x: 0, y: 0 }
  }

  return emptySpots[Math.floor(Math.random() * emptySpots.length)]
}

export function getInitialSnake(gridSize: number = DEFAULT_GRID_SIZE): Position[] {
  const center = Math.floor(gridSize / 2)
  return [
    { x: center, y: center },
    { x: center - 1, y: center },
    { x: center - 2, y: center },
  ]
}
