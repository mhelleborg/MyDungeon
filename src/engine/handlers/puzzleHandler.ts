import type { Puzzle } from '../../types/puzzle'
import { entry, type HandlerResult } from './types'

export interface PuzzleAttemptResult extends HandlerResult {
  solved: boolean
  rewardItemIds?: string[]
  revealExit?: { direction: string; targetRoomId: string }
}

/**
 * Pure: attempt to solve a puzzle with the given answer.
 */
export function attemptPuzzle(
  puzzle: Puzzle,
  answer: string,
  alreadySolved: boolean,
): PuzzleAttemptResult {
  if (alreadySolved) {
    return {
      solved: false,
      logs: [entry('You have already solved this puzzle.', 'info')],
    }
  }

  const normalizedAnswer = answer.toLowerCase().trim()
  const normalizedSolution = puzzle.solution.toLowerCase().trim()

  if (normalizedAnswer === normalizedSolution) {
    const logs: HandlerResult['logs'] = [
      entry(puzzle.successMessage, 'narrative'),
    ]
    if (puzzle.reward) {
      logs.push(entry(puzzle.reward.message, 'loot'))
    }
    return {
      solved: true,
      rewardItemIds: puzzle.reward?.itemIds,
      revealExit: puzzle.reward?.revealExit,
      logs,
    }
  }

  return {
    solved: false,
    logs: [entry(puzzle.failureMessage, 'info')],
  }
}

/**
 * Pure: get the hint text for a puzzle when the player examines it.
 */
export function getPuzzleHint(puzzle: Puzzle): HandlerResult {
  return {
    logs: [
      entry(puzzle.description, 'narrative'),
      entry(puzzle.hint, 'info'),
    ],
  }
}
