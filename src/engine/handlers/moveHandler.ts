import type { Room, Exit } from '../../types/room'
import type { Item } from '../../types/item'
import type { AbilityScores } from '../../types/character'
import { skillCheck, type Ability } from '../skillChecks'
import { entry, type HandlerResult } from './types'

export interface MoveCheck {
  allowed: boolean
  exit?: Exit
  logs: HandlerResult['logs']
}

/**
 * Pure validation: can the player move in this direction?
 * Returns allowed/blocked + explanation logs.
 * Does NOT enter the room — the store does that.
 */
export function validateMove(
  room: Room,
  direction: string,
  inventory: Item[],
  clearedRooms: ReadonlySet<string>,
  abilities?: AbilityScores,
  revealedExits?: ReadonlySet<string>,
): MoveCheck {
  const exit = room.exits.find(e => e.direction === direction)
  if (!exit) {
    return { allowed: false, logs: [entry(`There is no passage to the ${direction}.`, 'error')] }
  }

  // Block unrevealed hidden exits
  if (exit.hidden && revealedExits && !revealedExits.has(`${room.id}-${exit.direction}`)) {
    return { allowed: false, logs: [entry(`There is no passage to the ${direction}.`, 'error')] }
  }

  // Bridge gate: Balrog must be dead
  if (room.id === 'bridge-of-khazad-dum' && exit.direction === 'east' && !clearedRooms.has('bridge-of-khazad-dum')) {
    return { allowed: false, exit, logs: [entry('The Balrog blocks the way! You must defeat it first.', 'error')] }
  }

  // Key-locked exits (skip bridge east — already handled above)
  if (exit.locked && !(room.id === 'bridge-of-khazad-dum' && exit.direction === 'east')) {
    if (exit.requiredItemId) {
      const key = inventory.find(i => i.id === exit.requiredItemId)
      if (!key) {
        return { allowed: false, exit, logs: [entry(exit.lockMessage || 'The way is blocked.', 'error')] }
      }
      // Key found — allow with message
      return checkSkillGate(exit, abilities, [entry(`You use the ${key.name} to open the way.`, 'info')])
    }
  }

  return checkSkillGate(exit, abilities, [])
}

function checkSkillGate(exit: Exit, abilities: AbilityScores | undefined, preLogs: HandlerResult['logs']): MoveCheck {
  if (exit.requiredSkillCheck && abilities) {
    const result = skillCheck(
      abilities,
      exit.requiredSkillCheck.ability as Ability,
      exit.requiredSkillCheck.dc,
    )
    if (!result.success) {
      return {
        allowed: false,
        exit,
        logs: [...preLogs, entry(`You attempt to force the passage but fail. (Rolled ${result.total} vs DC ${result.dc})`, 'error')],
      }
    }
    return {
      allowed: true,
      exit,
      logs: [...preLogs, entry(`You force your way through! (Rolled ${result.total} vs DC ${result.dc})`, 'info')],
    }
  }

  return { allowed: true, exit, logs: preLogs }
}
