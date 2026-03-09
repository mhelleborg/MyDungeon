import type { GameLogEntry } from '../types/command'
import type { StatusEffectId } from '../types/statusEffect'

function log(text: string, type: GameLogEntry['type'] = 'combat'): GameLogEntry {
  return { text, type, timestamp: Date.now() }
}

interface CriticalEffect {
  text: string
  bonusDamage: number
  statusEffect?: StatusEffectId
}

const playerCriticalEffects: CriticalEffect[] = [
  { text: 'A devastating blow! Your enemy staggers, dazed by the impact!', bonusDamage: 0, statusEffect: 'stunned' },
  { text: 'You find a gap in the enemy\'s defenses and strike true!', bonusDamage: 3 },
  { text: 'The spirit of Durin guides your hand! A masterful strike!', bonusDamage: 2 },
  { text: 'Your weapon sings through the air and bites deep!', bonusDamage: 4 },
]

const playerFumbleEffects = [
  { text: 'You stumble on the uneven stone and lose your footing!', selfDamage: 0, loseNextTurn: true },
  { text: 'Your weapon catches on the wall! You wrench it free but lose precious time.', selfDamage: 0, loseNextTurn: true },
  { text: 'You swing wide and the momentum throws you off balance!', selfDamage: 1, loseNextTurn: false },
  { text: 'A clumsy strike! The jarring impact sends pain up your arm.', selfDamage: 2, loseNextTurn: false },
]

const enemyCriticalEffects = [
  { text: 'A savage blow that catches you off guard!', bonusDamage: 2 },
  { text: 'The enemy strikes with terrible precision!', bonusDamage: 3 },
  { text: 'A thunderous hit that rattles your bones!', bonusDamage: 2, statusEffect: 'stunned' as StatusEffectId },
]

const enemyFumbleEffects = [
  { text: 'The enemy trips over its own feet!', bonusDamage: 0 },
  { text: 'A wild swing that throws the creature off balance!', bonusDamage: 0 },
  { text: 'The enemy\'s weapon slips from its grip momentarily!', bonusDamage: 0 },
]

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]!
}

/**
 * Roll a bonus effect for a player critical hit (natural 20).
 */
export function rollPlayerCritical(): {
  logs: GameLogEntry[]
  bonusDamage: number
  statusEffect?: StatusEffectId
} {
  const effect = pickRandom(playerCriticalEffects)
  return {
    logs: [log(effect.text)],
    bonusDamage: effect.bonusDamage,
    statusEffect: effect.statusEffect,
  }
}

/**
 * Roll a fumble effect for a player miss (natural 1).
 */
export function rollPlayerFumble(): {
  logs: GameLogEntry[]
  selfDamage: number
  loseNextTurn: boolean
} {
  const effect = pickRandom(playerFumbleEffects)
  const logs = [log(effect.text)]
  if (effect.selfDamage > 0) {
    logs.push(log(`You take ${effect.selfDamage} damage from the fumble!`))
  }
  if (effect.loseNextTurn) {
    logs.push(log('You are off balance and can\'t react to the counterattack!'))
  }
  return {
    logs,
    selfDamage: effect.selfDamage,
    loseNextTurn: effect.loseNextTurn,
  }
}

/**
 * Roll a bonus effect for an enemy critical hit.
 */
export function rollEnemyCritical(): {
  logs: GameLogEntry[]
  bonusDamage: number
  statusEffect?: StatusEffectId
} {
  const effect = pickRandom(enemyCriticalEffects)
  return {
    logs: [log(effect.text)],
    bonusDamage: effect.bonusDamage,
    statusEffect: effect.statusEffect,
  }
}

/**
 * Roll a fumble effect for an enemy miss (natural 1).
 */
export function rollEnemyFumble(): {
  logs: GameLogEntry[]
} {
  const effect = pickRandom(enemyFumbleEffects)
  return {
    logs: [log(effect.text)],
  }
}
