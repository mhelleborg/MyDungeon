import type { PlayerClass } from '../types/character'
import type { DifficultyLevel } from '../types/difficulty'

export interface Achievement {
  id: string
  name: string
  description: string
  icon: string  // single character/emoji for display
}

export interface RunStats {
  roomsExplored: number
  totalRooms: number
  enemiesKilled: number
  damageDealt: number
  damageTaken: number
  itemsFound: number
  potionsUsed: number
  puzzlesSolved: number
  secretsFound: number
  sneakSuccesses: number
  fleeAttempts: number
  startTime: number
  playerClass: PlayerClass
  difficulty: DifficultyLevel
  balrogSlain: boolean
}

export const achievements: Record<string, Achievement> = {
  'shadow-of-the-past': {
    id: 'shadow-of-the-past',
    name: 'Shadow of the Past',
    description: 'Sneak past 3 or more encounters.',
    icon: 'S',
  },
  'iron-constitution': {
    id: 'iron-constitution',
    name: 'Iron Constitution',
    description: 'Win without using any potions.',
    icon: 'I',
  },
  'you-shall-not-pass': {
    id: 'you-shall-not-pass',
    name: 'You Shall Not Pass',
    description: 'Defeat the Balrog as a Wizard.',
    icon: 'W',
  },
  'kingly-gift': {
    id: 'kingly-gift',
    name: 'Kingly Gift',
    description: 'Find the Mithril Coat.',
    icon: 'M',
  },
  'lord-of-moria': {
    id: 'lord-of-moria',
    name: 'Lord of Moria',
    description: 'Explore every room in the mines.',
    icon: 'L',
  },
  'speed-runner': {
    id: 'speed-runner',
    name: 'Speed Runner',
    description: 'Complete the game in under 10 minutes.',
    icon: 'R',
  },
  'untouchable': {
    id: 'untouchable',
    name: 'Untouchable',
    description: 'Complete the game taking less than 50 damage.',
    icon: 'U',
  },
  'hard-mode': {
    id: 'hard-mode',
    name: 'Dark Souls',
    description: 'Complete the game on Hard difficulty.',
    icon: 'D',
  },
  'puzzle-master': {
    id: 'puzzle-master',
    name: 'Puzzle Master',
    description: 'Solve all puzzles in a single run.',
    icon: 'P',
  },
  'pacifist': {
    id: 'pacifist',
    name: 'Pacifist',
    description: 'Kill 3 or fewer enemies (excluding the Balrog).',
    icon: 'X',
  },
}

const TOTAL_PUZZLES = 5 // speak-friend, forge-levers, gargoyle-riddle, stair-descent, records-ward

/**
 * Pure function: check which achievements a completed run earns.
 * Does NOT touch localStorage — the store handles persistence.
 */
export function checkAchievements(stats: RunStats, foundItems: string[]): string[] {
  const earned: string[] = []

  if (stats.sneakSuccesses >= 3) {
    earned.push('shadow-of-the-past')
  }

  if (stats.potionsUsed === 0) {
    earned.push('iron-constitution')
  }

  if (stats.balrogSlain && stats.playerClass === 'wizard') {
    earned.push('you-shall-not-pass')
  }

  if (foundItems.includes('mithril-coat')) {
    earned.push('kingly-gift')
  }

  if (stats.roomsExplored >= stats.totalRooms) {
    earned.push('lord-of-moria')
  }

  const elapsed = Date.now() - stats.startTime
  if (elapsed < 10 * 60 * 1000) {
    earned.push('speed-runner')
  }

  if (stats.damageTaken < 50) {
    earned.push('untouchable')
  }

  if (stats.difficulty === 'hard') {
    earned.push('hard-mode')
  }

  if (stats.puzzlesSolved >= TOTAL_PUZZLES) {
    earned.push('puzzle-master')
  }

  // Pacifist: 3 or fewer non-Balrog kills. Balrog must be slain to win, so
  // we check total kills minus 1 if Balrog was killed.
  const nonBossKills = stats.balrogSlain ? stats.enemiesKilled - 1 : stats.enemiesKilled
  if (nonBossKills <= 3) {
    earned.push('pacifist')
  }

  return earned
}

/**
 * Format elapsed time as "Xm Ys"
 */
export function formatElapsed(startTime: number): string {
  const elapsed = Math.max(0, Date.now() - startTime)
  const totalSec = Math.floor(elapsed / 1000)
  const min = Math.floor(totalSec / 60)
  const sec = totalSec % 60
  return `${min}m ${sec}s`
}
