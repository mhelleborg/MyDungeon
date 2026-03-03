import type { GameLogEntry } from '../../types/command'

/** Standard result returned by all handler functions. */
export interface HandlerResult {
  logs: GameLogEntry[]
}

/** Shorthand to build a GameLogEntry. */
export function entry(text: string, type: GameLogEntry['type'] = 'narrative'): GameLogEntry {
  return { text, type, timestamp: Date.now() }
}
