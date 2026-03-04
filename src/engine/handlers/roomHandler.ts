import type { Room } from '../../types/room'
import { entry, type HandlerResult } from './types'

/**
 * Get the visible exits for a room, filtering out unrevealed hidden exits.
 */
export function getVisibleExits(room: Room, revealedExits: ReadonlySet<string>): string[] {
  return room.exits
    .filter(e => !e.hidden || revealedExits.has(`${room.id}-${e.direction}`))
    .map(e => e.direction)
}

/** Fallback observations when a room has no (more) hidden details to reveal. */
const LOOK_FALLBACKS: string[] = [
  'You scan the area once more, but nothing new catches your eye. The shadows keep their secrets.',
  'You peer into every corner. The silence of the mountain presses in around you.',
  'Your eyes trace the ancient stonework, but you find nothing you haven\'t already noticed.',
  'You look again. The darkness beyond your light seems to shift, but it is only your imagination.',
  'The cold air stirs faintly. You see nothing new, but the feeling of being watched persists.',
  'You study your surroundings with care. The dwarves built to last — every stone is where it should be.',
  'A drip of water echoes somewhere far off. Otherwise, nothing has changed here.',
]

/**
 * Pure function: build the logs for entering a room (with header).
 */
export function describeRoom(
  room: Room,
  isDark: boolean,
  isCleared: boolean,
  groundItemNames: string[],
  revealedExits: ReadonlySet<string> = new Set(),
): HandlerResult {
  const logs: HandlerResult['logs'] = []

  logs.push(entry(`--- ${room.name} ---`, 'system'))

  if (isDark) {
    logs.push(entry('The darkness is absolute. You can see nothing without a light source.', 'narrative'))
    return { logs }
  }

  const desc = (isCleared && room.clearedDescription) ? room.clearedDescription : room.description
  logs.push(entry(desc, 'narrative'))

  const exits = getVisibleExits(room, revealedExits).join(', ')
  logs.push(entry(`Exits: ${exits}`, 'info'))

  if (groundItemNames.length > 0) {
    logs.push(entry(`You see: ${groundItemNames.join(', ')}`, 'info'))
  }

  return { logs }
}

/**
 * Pure function: build the logs for "look" / "look around".
 * On first look, shows description + first hidden detail.
 * On subsequent looks, reveals the next unseen detail.
 * When all details exhausted (or none exist), shows a contextual fallback.
 *
 * Returns logs and the new lookCount to store.
 */
export function describeLook(
  room: Room,
  isDark: boolean,
  isCleared: boolean,
  groundItemNames: string[],
  revealedExits: ReadonlySet<string> = new Set(),
  lookCount: number = 0,
): HandlerResult & { newLookCount: number } {
  const logs: HandlerResult['logs'] = []

  if (isDark) {
    logs.push(entry('The darkness is absolute. You can see nothing without a light source.', 'narrative'))
    return { logs, newLookCount: lookCount }
  }

  const details = room.lookDetails ?? []

  if (lookCount === 0) {
    // First look: show full description
    const desc = (isCleared && room.clearedDescription) ? room.clearedDescription : room.description
    logs.push(entry(desc, 'narrative'))

    // Also reveal first hidden detail if available
    if (details.length > 0) {
      logs.push(entry(details[0]!, 'narrative'))
    }
  } else {
    // Subsequent looks: reveal next detail or show fallback
    if (lookCount < details.length) {
      logs.push(entry('You look more carefully...', 'narrative'))
      logs.push(entry(details[lookCount]!, 'narrative'))
    } else {
      // All details seen (or none exist) — random fallback
      const fallback = LOOK_FALLBACKS[Math.floor(Math.random() * LOOK_FALLBACKS.length)]!
      logs.push(entry(fallback, 'narrative'))
    }
  }

  const exits = getVisibleExits(room, revealedExits).join(', ')
  logs.push(entry(`Exits: ${exits}`, 'info'))

  if (groundItemNames.length > 0) {
    logs.push(entry(`You see: ${groundItemNames.join(', ')}`, 'info'))
  }

  return { logs, newLookCount: lookCount + 1 }
}
