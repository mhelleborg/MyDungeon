export interface Puzzle {
  id: string
  roomId: string
  description: string
  type: 'riddle' | 'lever' | 'keyword'
  /** What the player must type to solve it (matched case-insensitively) */
  solution: string
  /** Hint revealed by examining something in the room */
  hint: string
  /** What to tell the player on success */
  successMessage: string
  /** What to tell the player on wrong answer */
  failureMessage: string
  reward?: {
    itemIds?: string[]
    revealExit?: { direction: string; targetRoomId: string }
    message: string
  }
}
