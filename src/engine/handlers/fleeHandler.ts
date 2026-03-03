import type { AbilityScores } from '../../types/character'
import { skillCheck } from '../skillChecks'
import { entry, type HandlerResult } from './types'

export interface FleeResult extends HandlerResult {
  escaped: boolean
}

const FLEE_DC = 12

/**
 * Attempt to flee from combat.
 * Pure: takes player DEX, returns success/failure + logs.
 * On success the store should end combat (room NOT cleared) and move to previousRoom.
 * On failure the store should let enemies take a free attack round.
 */
export function attemptFlee(abilities: AbilityScores): FleeResult {
  const result = skillCheck(abilities, 'dex', FLEE_DC)

  if (result.success) {
    return {
      escaped: true,
      logs: [
        entry(`You disengage and flee! (DEX ${result.total} vs DC ${FLEE_DC})`, 'combat'),
        entry('You scramble back the way you came!', 'narrative'),
      ],
    }
  }

  return {
    escaped: false,
    logs: [
      entry(`You fail to escape! (DEX ${result.total} vs DC ${FLEE_DC})`, 'combat'),
      entry('The enemies strike as you stumble!', 'combat'),
    ],
  }
}

export interface StealthResult extends HandlerResult {
  success: boolean
}

const STEALTH_DC = 14
const BALROG_STEALTH_DC = 25

/**
 * Attempt to sneak into a room without triggering combat.
 * Pure: takes player DEX and target room enemy IDs, returns success/failure.
 * On success: enter room, no combat.
 * On failure: enter room, enemies get surprise round (attack first).
 */
export function attemptStealth(
  abilities: AbilityScores,
  enemyIds: string[],
): StealthResult {
  const hasBalrog = enemyIds.includes('balrog')
  const dc = hasBalrog ? BALROG_STEALTH_DC : STEALTH_DC
  const result = skillCheck(abilities, 'dex', dc)

  if (result.success) {
    return {
      success: true,
      logs: [
        entry(`You creep past unnoticed. (DEX ${result.total} vs DC ${dc})`, 'info'),
      ],
    }
  }

  return {
    success: false,
    logs: [
      entry(`You are spotted! The enemies react before you can ready yourself! (DEX ${result.total} vs DC ${dc})`, 'combat'),
    ],
  }
}
