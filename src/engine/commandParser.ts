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

  // Disarm
  if (verb === 'disarm') {
    return { type: 'disarm', target: rest || undefined, raw }
  }

  // Flee
  if (verb === 'flee' || verb === 'run' || verb === 'escape') {
    return { type: 'flee', raw }
  }

  // Sneak
  if (verb === 'sneak' || verb === 'stealth') {
    const dir = DIRECTION_ALIASES[rest]
    if (dir) return { type: 'sneak', target: dir, raw }
    return { type: 'sneak', target: rest || undefined, raw }
  }

  // Rest
  if (verb === 'rest' || verb === 'sleep' || verb === 'camp') {
    return { type: 'rest', raw }
  }

  // NPC interaction
  if (verb === 'talk' || verb === 'speak') {
    return { type: 'talk', target: rest || undefined, raw }
  }
  if (verb === 'trade' || verb === 'buy' || verb === 'shop') {
    return { type: 'trade', target: rest || undefined, raw }
  }

  // Puzzles
  if (verb === 'say' || verb === 'answer') {
    return { type: 'say', target: rest, raw }
  }
  if (verb === 'solve' || verb === 'pull') {
    return { type: 'solve', target: rest || undefined, raw }
  }

  // Search
  if (verb === 'search' || verb === 'loot' || verb === 'rummage') {
    return { type: 'search', target: rest || undefined, raw }
  }

  // Destroy
  if (verb === 'destroy' || verb === 'smash' || verb === 'break') {
    return { type: 'destroy', target: rest || undefined, raw }
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
