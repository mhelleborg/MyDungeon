import type { Player, CombatEnemy } from '../types/character'
import { getModifier } from '../types/character'
import { rollD20, rollDice } from './dice'
import type { GameLogEntry } from '../types/command'

export interface AttackResult {
  hit: boolean
  roll: number
  attackBonus: number
  total: number
  targetAc: number
  damage: number
  critical: boolean
  logs: GameLogEntry[]
}

function log(text: string, type: GameLogEntry['type'] = 'combat'): GameLogEntry {
  return { text, type, timestamp: Date.now() }
}

export function playerAttack(player: Player, enemy: CombatEnemy, weaponDamage: string, attackBonus: number): AttackResult {
  const roll = rollD20()
  const strMod = getModifier(player.abilities.str)
  const totalAttack = roll + attackBonus + strMod
  const critical = roll === 20
  const hit = critical || totalAttack >= enemy.ac

  const logs: GameLogEntry[] = []
  const result: AttackResult = {
    hit,
    roll,
    attackBonus: attackBonus + strMod,
    total: totalAttack,
    targetAc: enemy.ac,
    damage: 0,
    critical,
    logs,
  }

  if (hit) {
    const dmg = rollDice(weaponDamage)
    result.damage = dmg.total + strMod + (critical ? dmg.total : 0)
    result.damage = Math.max(1, result.damage)

    if (critical) {
      logs.push(log(`CRITICAL HIT! You strike ${enemy.name} for ${result.damage} damage! (rolled ${roll})`))
    } else {
      logs.push(log(`You hit ${enemy.name} for ${result.damage} damage. (rolled ${roll} + ${result.attackBonus} = ${totalAttack} vs AC ${enemy.ac})`))
    }

    enemy.hp -= result.damage
    if (enemy.hp <= 0) {
      enemy.hp = 0
      logs.push(log(`${enemy.name} has been slain!`))
      logs.push(log(`You gain ${enemy.xpReward} XP.`, 'loot'))
    }
  } else {
    logs.push(log(`Your attack misses ${enemy.name}. (rolled ${roll} + ${result.attackBonus} = ${totalAttack} vs AC ${enemy.ac})`))
  }

  return result
}

export function enemyAttack(enemy: CombatEnemy, player: Player, advantage = false): AttackResult {
  let roll = rollD20()
  if (advantage) {
    const roll2 = rollD20()
    roll = Math.max(roll, roll2)
  }
  const totalAttack = roll + enemy.attackBonus
  const critical = roll === 20
  const hit = critical || totalAttack >= player.ac

  const logs: GameLogEntry[] = []
  const result: AttackResult = {
    hit,
    roll,
    attackBonus: enemy.attackBonus,
    total: totalAttack,
    targetAc: player.ac,
    damage: 0,
    critical,
    logs,
  }

  if (hit) {
    const dmg = rollDice(enemy.damage)
    result.damage = dmg.total + (critical ? dmg.total : 0)
    result.damage = Math.max(1, result.damage)

    if (critical) {
      logs.push(log(`CRITICAL! ${enemy.name} deals ${result.damage} damage to you!`))
    } else {
      logs.push(log(`${enemy.name} hits you for ${result.damage} damage.`))
    }

    player.hp -= result.damage
    if (player.hp <= 0) {
      player.hp = 0
      logs.push(log(`You have fallen in the darkness of Moria...`, 'narrative'))
    }
  } else {
    logs.push(log(`${enemy.name} misses you.`))
  }

  return result
}

export function castSpell(
  player: Player,
  spellId: string,
  target?: CombatEnemy
): { logs: GameLogEntry[]; damage: number } {
  const spell = player.spells.find(s => s.id === spellId)
  const logs: GameLogEntry[] = []

  if (!spell) {
    logs.push(log('You do not know that spell.', 'error'))
    return { logs, damage: 0 }
  }

  if (spell.currentCooldown > 0) {
    logs.push(log(`${spell.name} is not ready yet (${spell.currentCooldown} turns remaining).`, 'error'))
    return { logs, damage: 0 }
  }

  let damage = 0

  if (spell.damage && target) {
    const dmg = rollDice(spell.damage)
    damage = dmg.total
    target.hp -= damage
    logs.push(log(`You cast ${spell.name} on ${target.name} for ${damage} damage!`))
    if (target.hp <= 0) {
      target.hp = 0
      logs.push(log(`${target.name} has been slain!`))
      logs.push(log(`You gain ${target.xpReward} XP.`, 'loot'))
    }
  } else if (spell.healing) {
    const heal = rollDice(spell.healing)
    player.hp = Math.min(player.maxHp, player.hp + heal.total)
    logs.push(log(`You cast ${spell.name} and recover ${heal.total} HP.`, 'info'))
  } else if (spell.effect) {
    logs.push(log(`You cast ${spell.name}. ${spell.effect}`, 'info'))
  } else {
    logs.push(log(`You cast ${spell.name}.`, 'info'))
  }

  spell.currentCooldown = spell.cooldown

  return { logs, damage }
}

export function tickCooldowns(player: Player): void {
  for (const spell of player.spells) {
    if (spell.currentCooldown > 0) {
      spell.currentCooldown--
    }
  }
}
