import type { AbilityScores } from '../../types/character'
import { getModifier } from '../../types/character'
import { rollDice, rollDie } from '../dice'
import { entry, type HandlerResult } from './types'

export interface RestValidation {
  allowed: boolean
  reason?: string
}

/**
 * Pure validation: can the player rest here?
 */
export function canRest(
  inCombat: boolean,
  hasEnemies: boolean,
  roomCleared: boolean,
  alreadyRested: boolean,
): RestValidation {
  if (inCombat) return { allowed: false, reason: 'You cannot rest while in combat!' }
  if (hasEnemies && !roomCleared) return { allowed: false, reason: 'This area is too dangerous to rest. Enemies lurk nearby.' }
  if (alreadyRested) return { allowed: false, reason: 'You have already rested here. You must find another place to camp.' }
  return { allowed: true }
}

export interface RestResult extends HandlerResult {
  hpHealed: number
  wanderingMonster: boolean
}

/**
 * Resolve a rest action. Pure except for dice.
 * Returns healing amount and whether a wandering monster appears.
 */
export function resolveRest(abilities: AbilityScores): RestResult {
  // 20% chance of wandering patrol
  const wanderingMonster = rollDie(5) === 1

  if (wanderingMonster) {
    return {
      hpHealed: 0,
      wanderingMonster: true,
      logs: [
        entry('You settle down to rest, but your sleep is interrupted...', 'narrative'),
        entry('A wandering goblin patrol has found you!', 'combat'),
      ],
    }
  }

  const conMod = getModifier(abilities.con)
  const heal = rollDice('2d4+0')
  const hpHealed = Math.max(1, heal.total + conMod)

  return {
    hpHealed,
    wanderingMonster: false,
    logs: [
      entry('You find a sheltered corner and rest for a while.', 'narrative'),
      entry(`You recover ${hpHealed} HP. (2d4${conMod >= 0 ? '+' : ''}${conMod} CON)`, 'info'),
    ],
  }
}
