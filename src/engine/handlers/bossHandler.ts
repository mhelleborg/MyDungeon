import type { AbilityScores, PlayerClass } from '../../types/character'
import { skillCheck } from '../skillChecks'
import { rollDice } from '../dice'
import { entry, type HandlerResult } from './types'

export type BossPhase = 0 | 1 | 2 | 3

/**
 * Determine the boss phase based on remaining HP percentage.
 * Phase 1: 100%-60%
 * Phase 2: 60%-30%
 * Phase 3: 30%-0%
 */
export function getBossPhase(currentHp: number, maxHp: number): BossPhase {
  if (currentHp <= 0) return 0
  const pct = currentHp / maxHp
  if (pct > 0.6) return 1
  if (pct > 0.3) return 2
  return 3
}

export interface PhaseTransitionResult extends HandlerResult {
  newPhase: BossPhase
  /** Fire damage applied to player each round in phases 2-3 */
  environmentalDamage: number
}

/**
 * Check for boss phase transition after the player attacks.
 * Returns narrative logs and the new phase.
 */
export function checkPhaseTransition(
  previousPhase: BossPhase,
  currentHp: number,
  maxHp: number,
): PhaseTransitionResult | null {
  const newPhase = getBossPhase(currentHp, maxHp)
  if (newPhase === previousPhase) return null

  if (newPhase === 2) {
    return {
      newPhase: 2,
      environmentalDamage: 0,
      logs: [
        entry('--- The bridge cracks beneath the Balrog\'s fury! ---', 'system'),
        entry('The Balrog roars in pain and rage. Cracks spider across the ancient bridge. Fire erupts from the chasm below, licking at the stonework.', 'narrative'),
        entry('You can "stand ground" and fight on, or "fall back" to reduce damage taken (and dealt).', 'info'),
      ],
    }
  }

  if (newPhase === 3) {
    return {
      newPhase: 3,
      environmentalDamage: 0,
      logs: [
        entry('--- "YOU SHALL NOT PASS!" ---', 'system'),
        entry('The Balrog stumbles, grievously wounded. The bridge is barely holding. This is your moment.', 'narrative'),
        entry('You can "break the bridge" (INT DC 14 for Wizard / STR DC 16 for others — massive damage to Balrog and some to you) or keep fighting normally.', 'info'),
      ],
    }
  }

  return null
}

export interface BossChoiceResult extends HandlerResult {
  /** Damage dealt to the boss */
  bossDamage: number
  /** Damage dealt to the player */
  playerDamage: number
  /** Whether the boss was slain */
  bossSlain: boolean
  /** If "fall back", reduce damage taken/dealt */
  fallBack?: boolean
}

/**
 * Resolve the "break the bridge" boss choice in Phase 3.
 */
export function resolveBreakBridge(
  abilities: AbilityScores,
  playerClass: PlayerClass,
  bossHp: number,
): BossChoiceResult {
  const dc = playerClass === 'wizard' ? 14 : 16
  const ability = playerClass === 'wizard' ? 'int' : 'str'
  const result = skillCheck(abilities, ability, dc)

  if (result.success) {
    const bossDmg = rollDice('4d10+0')
    const playerDmg = rollDice('2d6+0')
    const bossSlain = bossHp - bossDmg.total <= 0

    const logs = [
      entry(`You strike the bridge with all your might! (${ability.toUpperCase()} ${result.total} vs DC ${dc})`, 'combat'),
      entry('The bridge shatters! Stone and fire collapse into the abyss!', 'narrative'),
      entry(`The Balrog takes ${bossDmg.total} damage as the bridge crumbles beneath it!`, 'combat'),
      entry(`Falling debris strikes you for ${playerDmg.total} damage!`, 'combat'),
    ]

    if (bossSlain) {
      logs.push(entry('With a terrible cry, the Balrog plunges into the abyss, trailing flame and shadow. The darkness recedes.', 'narrative'))
    }

    return { bossDamage: bossDmg.total, playerDamage: playerDmg.total, bossSlain, logs }
  }

  return {
    bossDamage: 0,
    playerDamage: 0,
    bossSlain: false,
    logs: [
      entry(`You attempt to break the bridge but fail! (${ability.toUpperCase()} ${result.total} vs DC ${dc})`, 'combat'),
      entry('The bridge holds — for now. You must keep fighting!', 'narrative'),
    ],
  }
}

/**
 * Roll environmental fire damage for Phase 2+.
 */
export function rollFireDamage(): { damage: number; logs: HandlerResult['logs'] } {
  const dmg = rollDice('1d4+0')
  return {
    damage: dmg.total,
    logs: [entry(`Fire from the chasm scorches you for ${dmg.total} damage!`, 'combat')],
  }
}
