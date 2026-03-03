import type { ParsedCommand, CommandType } from '../types/command'
import type { Direction } from '../types/room'

const DIRECTION_ALIASES: Record<string, Direction> = {
  n: 'north', north: 'north',
  s: 'south', south: 'south',
  e: 'east', east: 'east',
  w: 'west', west: 'west',
  u: 'up', up: 'up',
  d: 'down', down: 'down',
}

export function parseCommand(input: string): ParsedCommand {
  const raw = input.trim()
  const lower = raw.toLowerCase()
  const parts = lower.split(/\s+/)
  const verb = parts[0] ?? ''
  const rest = parts.slice(1).join(' ')

  if (!verb) return { type: 'unknown', raw }

  // Direct direction shortcuts
  if (verb in DIRECTION_ALIASES) {
    return { type: 'move', target: DIRECTION_ALIASES[verb], raw }
  }

  // Movement commands
  if (verb === 'go' || verb === 'move' || verb === 'walk') {
    const dir = DIRECTION_ALIASES[rest]
    if (dir) return { type: 'move', target: dir, raw }
    return { type: 'move', target: rest, raw }
  }

  // Look / examine
  if (verb === 'look' || verb === 'l') {
    return { type: rest ? 'examine' : 'look', target: rest || undefined, raw }
  }
  if (verb === 'examine' || verb === 'inspect' || verb === 'check') {
    return { type: 'examine', target: rest, raw }
  }

  // Combat
  if (verb === 'attack' || verb === 'hit' || verb === 'strike' || verb === 'fight') {
    return { type: 'attack', target: rest || undefined, raw }
  }
  if (verb === 'cast') {
    return { type: 'cast', target: rest, raw }
  }

  // Items
  if (verb === 'take' || verb === 'get' || verb === 'grab' || verb === 'pickup') {
    return { type: 'take', target: rest, raw }
  }
  if (verb === 'drop' || verb === 'discard') {
    return { type: 'drop', target: rest, raw }
  }
  if (verb === 'use' || verb === 'drink' || verb === 'consume') {
    return { type: 'use', target: rest, raw }
  }
  if (verb === 'equip' || verb === 'wear' || verb === 'wield') {
    return { type: 'equip', target: rest, raw }
  }

  // Info commands
  const infoCommands: Record<string, CommandType> = {
    inventory: 'inventory', inv: 'inventory', i: 'inventory', bag: 'inventory',
    stats: 'stats', status: 'stats', character: 'stats', char: 'stats',
    help: 'help', '?': 'help',
    map: 'map', m: 'map',
  }
  if (verb in infoCommands) {
    return { type: infoCommands[verb]!, raw }
  }

  return { type: 'unknown', raw }
}
