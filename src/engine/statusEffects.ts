import type { StatusEffect, StatusEffectId } from '../types/statusEffect'
import type { GameLogEntry } from '../types/command'

function log(text: string, type: GameLogEntry['type'] = 'combat'): GameLogEntry {
  return { text, type, timestamp: Date.now() }
}

export function createStatusEffect(id: StatusEffectId): StatusEffect {
  switch (id) {
    case 'poisoned':
      return {
        id: 'poisoned',
        name: 'Poisoned',
        description: 'Orcish poison courses through your veins.',
        duration: 3,
        damagePerTurn: 2,
      }
    case 'burning':
      return {
        id: 'burning',
        name: 'Burning',
        description: 'Balrog-fire clings to you, searing your flesh.',
        duration: 2,
        damagePerTurn: 3,
      }
    case 'stunned':
      return {
        id: 'stunned',
        name: 'Stunned',
        description: 'A mighty blow has left you dazed.',
        duration: 1,
      }
    case 'blessed':
      return {
        id: 'blessed',
        name: 'Blessed',
        description: 'Durin\'s blessing guides your strikes.',
        duration: 5,
        attackBonus: 2,
        acBonus: 1,
      }
  }
}

/**
 * Process status effects at the start of the player's turn.
 * Returns logs and total damage dealt, plus whether the player is stunned.
 */
export function tickStatusEffects(effects: StatusEffect[]): {
  logs: GameLogEntry[]
  damage: number
  stunned: boolean
} {
  const logs: GameLogEntry[] = []
  let damage = 0
  let stunned = false

  for (const effect of effects) {
    if (effect.id === 'stunned') {
      stunned = true
      logs.push(log('You are stunned and cannot act this turn!'))
    }

    if (effect.damagePerTurn) {
      damage += effect.damagePerTurn
      if (effect.id === 'poisoned') {
        logs.push(log(`Poison deals ${effect.damagePerTurn} damage. (${effect.duration - 1} turns remaining)`))
      } else if (effect.id === 'burning') {
        logs.push(log(`Flames sear you for ${effect.damagePerTurn} damage! (${effect.duration - 1} turns remaining)`))
      }
    }

    effect.duration--
  }

  return { logs, damage, stunned }
}

/**
 * Remove expired effects and return logs for effects wearing off.
 */
export function cleanupExpiredEffects(effects: StatusEffect[]): {
  remaining: StatusEffect[]
  logs: GameLogEntry[]
} {
  const remaining: StatusEffect[] = []
  const logs: GameLogEntry[] = []

  for (const effect of effects) {
    if (effect.duration <= 0) {
      logs.push(log(`${effect.name} has worn off.`, 'info'))
    } else {
      remaining.push(effect)
    }
  }

  return { remaining, logs }
}

/**
 * Get total attack bonus from active status effects.
 */
export function getStatusAttackBonus(effects: StatusEffect[]): number {
  return effects.reduce((sum, e) => sum + (e.attackBonus || 0), 0)
}

/**
 * Get total AC bonus from active status effects.
 */
export function getStatusAcBonus(effects: StatusEffect[]): number {
  return effects.reduce((sum, e) => sum + (e.acBonus || 0), 0)
}

/**
 * Check if player has a specific status effect.
 */
export function hasStatusEffect(effects: StatusEffect[], id: StatusEffectId): boolean {
  return effects.some(e => e.id === id)
}

/**
 * Add a status effect, refreshing duration if already present.
 */
export function applyStatusEffect(effects: StatusEffect[], id: StatusEffectId): {
  effects: StatusEffect[]
  logs: GameLogEntry[]
} {
  const logs: GameLogEntry[] = []
  const existing = effects.find(e => e.id === id)

  if (existing) {
    const fresh = createStatusEffect(id)
    existing.duration = fresh.duration
    logs.push(log(`${existing.name} refreshed.`, 'combat'))
  } else {
    const effect = createStatusEffect(id)
    effects.push(effect)
    logs.push(log(`You are now ${effect.name.toLowerCase()}! ${effect.description}`, 'combat'))
  }

  return { effects, logs }
}
