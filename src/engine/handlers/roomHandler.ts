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

/**
 * Pure function: build the logs for displaying a room.
 * Handles darkness, cleared state, exits (filtering hidden), and ground items.
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
 * Same as describeRoom but without the header — used by `look`.
 */
export function describeLook(
  room: Room,
  isDark: boolean,
  isCleared: boolean,
  groundItemNames: string[],
  revealedExits: ReadonlySet<string> = new Set(),
): HandlerResult {
  const logs: HandlerResult['logs'] = []

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
