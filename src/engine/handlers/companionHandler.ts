import type { Companion } from '../../types/companion'
import type { CombatEnemy } from '../../types/character'
import type { HandlerResult } from './types'
import { entry } from './types'
import { rollD20, rollDice } from '../dice'
import { companionData, recruitmentConditions } from '../../data/companions'

export interface CompanionAttackResult extends HandlerResult {
  hit: boolean
  damage: number
  targetDead: boolean
}

export interface CompanionDamageResult extends HandlerResult {
  dead: boolean
}

export interface RecruitmentCheck {
  canRecruit: boolean
  companion?: Companion
  reason?: string
}

export function companionAttack(companion: Companion, target: CombatEnemy): CompanionAttackResult {
  const roll = rollD20()
  const total = roll + companion.attackBonus
  const critical = roll === 20
  const hit = critical || total >= target.ac

  const logs = []
  let damage = 0
  let targetDead = false

  if (hit) {
    const dmg = rollDice(companion.damage)
    damage = dmg.total + (critical ? dmg.total : 0)
    damage = Math.max(1, damage)

    if (critical) {
      logs.push(entry(`CRITICAL! ${companion.name} strikes ${target.name} for ${damage} damage!`, 'combat'))
    } else {
      logs.push(entry(`${companion.name} hits ${target.name} for ${damage} damage.`, 'combat'))
    }

    target.hp -= damage
    if (target.hp <= 0) {
      target.hp = 0
      targetDead = true
      logs.push(entry(`${companion.name} has slain ${target.name}!`, 'combat'))
    }
  } else {
    logs.push(entry(`${companion.name}'s attack misses ${target.name}.`, 'combat'))
  }

  return { logs, hit, damage, targetDead }
}

export function companionTakeDamage(companion: Companion, damage: number): CompanionDamageResult {
  companion.hp -= damage
  const logs = []

  if (companion.hp <= 0) {
    companion.hp = 0
    logs.push(entry(`${companion.name} takes ${damage} damage and falls!`, 'error'))
    logs.push(entry(companion.deathMessage, 'error'))
    return { logs, dead: true }
  }

  logs.push(entry(`${companion.name} takes ${damage} damage. (${companion.hp}/${companion.maxHp} HP)`, 'combat'))
  return { logs, dead: false }
}

export function rollCompanionComment(companion: Companion, roomId: string): string | null {
  // ~40% chance to comment
  if (Math.random() > 0.4) return null

  const specific = companion.roomComments[roomId]
  if (specific) return specific

  const pool = companion.genericComments
  if (pool.length === 0) return null
  return pool[Math.floor(Math.random() * pool.length)]!
}

export function checkRecruitment(npcId: string, interactedNPCs: Set<string>): RecruitmentCheck {
  const condition = recruitmentConditions[npcId]
  if (!condition) {
    return { canRecruit: false, reason: 'This person cannot join you.' }
  }

  if (!condition(interactedNPCs)) {
    return { canRecruit: false, reason: 'You must complete their quest first.' }
  }

  const data = companionData[npcId]
  if (!data) {
    return { canRecruit: false, reason: 'This person cannot join you.' }
  }

  // Return a fresh copy so each recruitment gets independent HP etc.
  const companion: Companion = { ...data, roomComments: { ...data.roomComments }, genericComments: [...data.genericComments] }
  return { canRecruit: true, companion }
}
