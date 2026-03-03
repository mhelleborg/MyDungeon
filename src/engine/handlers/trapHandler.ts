import type { Trap } from '../../types/room'
import type { AbilityScores } from '../../types/character'
import { skillCheck, type Ability } from '../skillChecks'
import { rollDice } from '../dice'
import { entry, type HandlerResult } from './types'

export interface TrapTriggerResult extends HandlerResult {
  damage: number
}

/**
 * Resolve a trap triggering on room entry.
 * Pure: takes trap data, returns damage dealt + logs.
 */
export function triggerTrap(trap: Trap): TrapTriggerResult {
  const dmg = rollDice(trap.damage)
  return {
    damage: dmg.total,
    logs: [
      entry(trap.description, 'combat'),
      entry(`You take ${dmg.total} damage!`, 'combat'),
    ],
  }
}

export interface DisarmResult extends HandlerResult {
  success: boolean
  damage: number       // 0 on success, trap damage on failure
  trapSpent: boolean   // true = trap is now used up (success or triggered)
}

/**
 * Attempt to disarm a trap.
 * Pure: takes trap + player abilities, returns outcome.
 */
export function attemptDisarm(trap: Trap, abilities: AbilityScores): DisarmResult {
  const result = skillCheck(abilities, trap.disarmAbility as Ability, trap.disarmDC)

  if (result.success) {
    return {
      success: true,
      damage: 0,
      trapSpent: true,
      logs: [entry(`You carefully disarm the trap. (Rolled ${result.total} vs DC ${result.dc})`, 'info')],
    }
  }

  const dmg = rollDice(trap.damage)
  return {
    success: false,
    damage: dmg.total,
    trapSpent: true,
    logs: [
      entry(`You fail to disarm the trap and trigger it! (Rolled ${result.total} vs DC ${result.dc})`, 'combat'),
      entry(`You take ${dmg.total} damage!`, 'combat'),
    ],
  }
}
