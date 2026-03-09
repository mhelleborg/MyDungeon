import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { CombatEnemy } from '../types/character'
import type { GameLogEntry } from '../types/command'
import { enemies as enemyDb } from '../data/enemies'
import type { RoomEnemy } from '../types/room'
import { rollD20, rollDice } from '../engine/dice'
import { playerAttack, enemyAttack, castSpell, tickCooldowns } from '../engine/combat'
import { rollLoot } from '../engine/loot'
import { checkPhaseTransition, rollFireDamage, resolveBreakBridge, type BossPhase } from '../engine/handlers/bossHandler'
import { companionAttack, companionTakeDamage } from '../engine/handlers/companionHandler'
import { playSound } from '../engine/audio'
import { usePlayerStore } from './playerStore'
import { useStatsStore } from './statsStore'
import { getDifficultyMultipliers, companions, dropItemToGround } from './gameContext'
import { tickStatusEffects, cleanupExpiredEffects, getStatusAttackBonus, getStatusAcBonus, applyStatusEffect } from '../engine/statusEffects'
import { rollPlayerCritical, rollPlayerFumble, rollEnemyCritical, rollEnemyFumble } from '../engine/criticalEffects'

export const useCombatStore = defineStore('combat', () => {
  const inCombat = ref(false)
  const combatEnemies = ref<CombatEnemy[]>([])
  const turnCount = ref(0)
  const darkCombat = ref(false)
  const bossPhase = ref<BossPhase>(0)
  const bossFallBack = ref(false)
  const lastCritical = ref(false)

  const livingEnemies = computed(() => combatEnemies.value.filter(e => e.hp > 0))
  const combatOver = computed(() => inCombat.value && livingEnemies.value.length === 0)
  const isBossFight = computed(() => inCombat.value && combatEnemies.value.some(e => e.id === 'balrog'))

  function startCombat(roomEnemies: RoomEnemy[], isDark = false): GameLogEntry[] {
    const logs: GameLogEntry[] = []
    combatEnemies.value = []
    turnCount.value = 0
    darkCombat.value = isDark
    bossPhase.value = 0
    bossFallBack.value = false

    const multipliers = getDifficultyMultipliers()

    for (const re of roomEnemies) {
      const template = enemyDb[re.enemyId]
      if (!template) continue
      for (let i = 0; i < re.count; i++) {
        const scaledHp = Math.max(1, Math.floor(template.maxHp * multipliers.enemyHp))
        combatEnemies.value.push({
          ...template,
          name: re.count > 1 ? `${template.name} ${i + 1}` : template.name,
          hp: scaledHp,
          maxHp: scaledHp,
          instanceId: `${re.enemyId}-${i}`,
        })
      }
    }

    inCombat.value = true

    // Initialize boss phase if Balrog
    const balrog = combatEnemies.value.find(e => e.id === 'balrog')
    if (balrog) {
      bossPhase.value = 1
      logs.push({ text: 'Durin\'s Bane rises before you, a terror of shadow and flame!', type: 'combat', timestamp: Date.now() })
      logs.push({ text: 'The Balrog\'s whip of fire cracks across the bridge!', type: 'narrative', timestamp: Date.now() })
    } else if (combatEnemies.value.length === 1) {
      logs.push({ text: `A ${combatEnemies.value[0]!.name} bars your path!`, type: 'combat', timestamp: Date.now() })
    } else {
      const names = combatEnemies.value.map(e => e.name).join(', ')
      logs.push({ text: `Enemies appear: ${names}!`, type: 'combat', timestamp: Date.now() })
    }
    // Companion readiness
    for (const comp of companions.value) {
      if (comp.hp > 0) {
        logs.push({ text: `${comp.name} readies their weapon at your side!`, type: 'combat', timestamp: Date.now() })
      }
    }

    logs.push({ text: 'Roll for initiative! Type "attack" or "cast <spell>" to fight.', type: 'system', timestamp: Date.now() })
    return logs
  }

  function processBossPhase(logs: GameLogEntry[]) {
    if (!isBossFight.value) return
    const balrog = livingEnemies.value.find(e => e.id === 'balrog')
    if (!balrog) return

    const maxHp = enemyDb['balrog']?.maxHp || 100
    const transition = checkPhaseTransition(bossPhase.value, balrog.hp, maxHp)
    if (transition) {
      logs.push(...transition.logs)
      bossPhase.value = transition.newPhase
    }

    // Environmental fire damage in phases 2+
    if (bossPhase.value >= 2) {
      const playerStore = usePlayerStore()
      if (playerStore.player) {
        const fire = rollFireDamage()
        logs.push(...fire.logs)
        playerStore.player.hp -= fire.damage
        if (playerStore.player.hp <= 0) {
          playerStore.player.hp = 0
          logs.push({ text: 'You have fallen in the darkness of Moria...', type: 'narrative', timestamp: Date.now() })
        }
      }
    }
  }

  function processPlayerStatusEffects(logs: GameLogEntry[]): boolean {
    const playerStore = usePlayerStore()
    if (!playerStore.player) return false

    // Tick status effects (DoT, stun check)
    const effectResult = tickStatusEffects(playerStore.player.statusEffects)
    logs.push(...effectResult.logs)
    if (effectResult.damage > 0) {
      playerStore.player.hp -= effectResult.damage
      useStatsStore().recordDamageTaken(effectResult.damage)
      if (playerStore.player.hp <= 0) {
        playerStore.player.hp = 0
        logs.push({ text: 'You have fallen in the darkness of Moria...', type: 'narrative', timestamp: Date.now() })
        return true // player died
      }
    }

    // Clean up expired effects
    const cleanup = cleanupExpiredEffects(playerStore.player.statusEffects)
    logs.push(...cleanup.logs)
    playerStore.player.statusEffects = cleanup.remaining

    return effectResult.stunned
  }

  function doPlayerAttack(targetName?: string): GameLogEntry[] {
    const playerStore = usePlayerStore()
    if (!playerStore.player || !inCombat.value) return []

    const logs: GameLogEntry[] = []

    // Check fumble penalty from last turn
    if (playerStore.player.fumblePenalty) {
      playerStore.player.fumblePenalty = false
      logs.push({ text: 'You recover your balance from last turn\'s fumble!', type: 'combat', timestamp: Date.now() })
      // Skip to enemy turns
      logs.push(...doCompanionTurns())
      if (livingEnemies.value.length === 0) {
        logs.push({ text: 'All enemies defeated! The way is clear.', type: 'combat', timestamp: Date.now() })
        endCombat()
        return logs
      }
      processBossPhase(logs)
      if (!playerStore.isAlive) return logs
      logs.push(...doEnemyTurns())
      turnCount.value++
      tickCooldowns(playerStore.player)
      return logs
    }

    // Process status effects at start of turn
    const stunned = processPlayerStatusEffects(logs)
    if (!playerStore.isAlive) return logs
    if (stunned) {
      // Skip player action, go to companion/enemy turns
      logs.push(...doCompanionTurns())
      if (livingEnemies.value.length === 0) {
        logs.push({ text: 'All enemies defeated! The way is clear.', type: 'combat', timestamp: Date.now() })
        endCombat()
        return logs
      }
      processBossPhase(logs)
      if (!playerStore.isAlive) return logs
      logs.push(...doEnemyTurns())
      turnCount.value++
      tickCooldowns(playerStore.player)
      return logs
    }

    // Find target
    let target: CombatEnemy | undefined
    if (targetName) {
      target = livingEnemies.value.find(e =>
        e.name.toLowerCase().includes(targetName.toLowerCase()) ||
        e.id.toLowerCase().includes(targetName.toLowerCase())
      )
    }
    if (!target) target = livingEnemies.value[0]

    if (!target) {
      logs.push({ text: 'No enemies to attack.', type: 'error', timestamp: Date.now() })
      return logs
    }

    // Get weapon info with status effect bonuses
    const weapon = playerStore.getEquippedWeapon()
    const weaponDamage = weapon?.damage || '1d4+0'
    const statusBonus = getStatusAttackBonus(playerStore.player.statusEffects)
    const attackBonus = (weapon?.attackBonus || 0) + statusBonus

    // Player attacks
    const result = playerAttack(playerStore.player, target, weaponDamage, attackBonus)
    logs.push(...result.logs)

    const statsStore = useStatsStore()
    lastCritical.value = result.hit && result.critical

    // Critical hit bonus effects
    if (result.hit && result.critical) {
      const critEffect = rollPlayerCritical()
      logs.push(...critEffect.logs)
      if (critEffect.bonusDamage > 0) {
        target.hp -= critEffect.bonusDamage
        statsStore.recordDamageDealt(critEffect.bonusDamage)
        logs.push({ text: `(+${critEffect.bonusDamage} bonus damage!)`, type: 'combat', timestamp: Date.now() })
      }
      if (critEffect.statusEffect === 'stunned' && target.hp > 0) {
        logs.push({ text: `${target.name} is dazed by the blow!`, type: 'combat', timestamp: Date.now() })
        // Enemy stun — skip their next attack (handled via reduced enemy turn)
      }
    }

    // Fumble effects on natural 1
    if (!result.hit && result.roll === 1) {
      const fumble = rollPlayerFumble()
      logs.push(...fumble.logs)
      if (fumble.selfDamage > 0) {
        playerStore.player.hp -= fumble.selfDamage
        statsStore.recordDamageTaken(fumble.selfDamage)
      }
      if (fumble.loseNextTurn) {
        playerStore.player.fumblePenalty = true
      }
    }

    if (result.hit) {
      statsStore.recordDamageDealt(result.damage)
      playSound(result.critical ? 'crit' : 'hit')
    } else {
      playSound('miss')
    }

    if (result.hit && target.hp <= 0) {
      statsStore.recordEnemyKilled()
      if (target.id === 'balrog') statsStore.recordBalrogSlain()
      const xpLogs = playerStore.addXp(target.xpReward)
      logs.push(...xpLogs)

      // Loot drops to the ground
      if (target.lootTable) {
        const loot = rollLoot(target.lootTable)
        for (const item of loot) {
          dropItemToGround(item.id)
          logs.push({ text: `${target.name} dropped ${item.name}.`, type: 'loot', timestamp: Date.now() })
        }
      }
    }

    // Check if combat is over
    if (livingEnemies.value.length === 0) {
      logs.push({ text: 'All enemies defeated! The way is clear.', type: 'combat', timestamp: Date.now() })
      endCombat()
      return logs
    }

    // Companion turns
    logs.push(...doCompanionTurns())
    if (livingEnemies.value.length === 0) {
      logs.push({ text: 'All enemies defeated! The way is clear.', type: 'combat', timestamp: Date.now() })
      endCombat()
      return logs
    }

    // Boss phase transitions
    processBossPhase(logs)
    if (!playerStore.isAlive) return logs

    // Enemy turns
    logs.push(...doEnemyTurns())

    turnCount.value++
    tickCooldowns(playerStore.player)

    return logs
  }

  function doPlayerCast(spellName: string): GameLogEntry[] {
    const playerStore = usePlayerStore()
    if (!playerStore.player || !inCombat.value) return []

    const logs: GameLogEntry[] = []
    const spell = playerStore.player.spells.find(s =>
      s.name.toLowerCase().includes(spellName.toLowerCase()) ||
      s.id.toLowerCase().includes(spellName.toLowerCase())
    )

    if (!spell) {
      logs.push({ text: `You don't know a spell called "${spellName}".`, type: 'error', timestamp: Date.now() })
      return logs
    }

    const target = livingEnemies.value[0]
    const result = castSpell(playerStore.player, spell.id, target)
    logs.push(...result.logs)

    const statsStore = useStatsStore()
    if (result.damage > 0) {
      statsStore.recordDamageDealt(result.damage)
      playSound('crit')
    }

    if (target && target.hp <= 0) {
      statsStore.recordEnemyKilled()
      if (target.id === 'balrog') statsStore.recordBalrogSlain()
      const xpLogs = playerStore.addXp(target.xpReward)
      logs.push(...xpLogs)
    }

    if (livingEnemies.value.length === 0) {
      logs.push({ text: 'All enemies defeated!', type: 'combat', timestamp: Date.now() })
      endCombat()
      return logs
    }

    // Companion turns
    logs.push(...doCompanionTurns())
    if (livingEnemies.value.length === 0) {
      logs.push({ text: 'All enemies defeated!', type: 'combat', timestamp: Date.now() })
      endCombat()
      return logs
    }

    // Boss phase transitions
    processBossPhase(logs)
    if (!playerStore.isAlive) return logs

    logs.push(...doEnemyTurns())
    turnCount.value++
    tickCooldowns(playerStore.player)

    return logs
  }

  function doCompanionTurns(): GameLogEntry[] {
    const logs: GameLogEntry[] = []
    const statsStore = useStatsStore()
    const playerStore = usePlayerStore()

    for (const comp of companions.value) {
      if (comp.hp <= 0) continue
      const target = livingEnemies.value[Math.floor(Math.random() * livingEnemies.value.length)]
      if (!target) break

      const result = companionAttack(comp, target)
      logs.push(...result.logs)

      if (result.targetDead) {
        statsStore.recordEnemyKilled()
        if (target.id === 'balrog') statsStore.recordBalrogSlain()
        const xpLogs = playerStore.addXp(target.xpReward)
        logs.push(...xpLogs)

        if (target.lootTable) {
          const loot = rollLoot(target.lootTable)
          for (const item of loot) {
            dropItemToGround(item.id)
            logs.push({ text: `${target.name} dropped ${item.name}.`, type: 'loot', timestamp: Date.now() })
          }
        }
      }
    }
    return logs
  }

  function doEnemyTurns(): GameLogEntry[] {
    const playerStore = usePlayerStore()
    if (!playerStore.player) return []

    const dmgMult = getDifficultyMultipliers().enemyDamage
    const livingCompanions = companions.value.filter(c => c.hp > 0)
    // AC bonus from status effects (e.g. blessed)
    const statusAcBonus = getStatusAcBonus(playerStore.player.statusEffects)

    const statsStore = useStatsStore()
    const logs: GameLogEntry[] = []
    for (const enemy of livingEnemies.value) {
      // ~30% chance to target a companion if any alive
      if (livingCompanions.length > 0 && Math.random() < 0.3) {
        const target = livingCompanions[Math.floor(Math.random() * livingCompanions.length)]!
        const roll = rollD20()
        const total = roll + enemy.attackBonus
        const hit = roll === 20 || total >= target.ac

        if (hit) {
          const dmg = rollDice(enemy.damage)
          let damage = dmg.total + (roll === 20 ? dmg.total : 0)
          damage = Math.max(1, damage)
          if (dmgMult !== 1.0) damage = Math.max(1, Math.floor(damage * dmgMult))

          const dmgResult = companionTakeDamage(target, damage)
          logs.push(...dmgResult.logs)
          if (dmgResult.dead) {
            const idx = livingCompanions.indexOf(target)
            if (idx !== -1) livingCompanions.splice(idx, 1)
          }
        } else {
          // Enemy fumble on nat 1
          if (roll === 1) {
            const fumble = rollEnemyFumble()
            logs.push(...fumble.logs)
          } else {
            logs.push({ text: `${enemy.name} attacks ${target.name} but misses.`, type: 'combat', timestamp: Date.now() })
          }
        }
        continue
      }

      // Temporarily apply status AC bonus
      const originalAc = playerStore.player.ac
      playerStore.player.ac += statusAcBonus
      const result = enemyAttack(enemy, playerStore.player, darkCombat.value)
      playerStore.player.ac = originalAc

      // Apply difficulty scaling to damage
      if (dmgMult !== 1.0 && result.hit) {
        const originalDmg = result.damage
        result.damage = Math.max(1, Math.floor(originalDmg * dmgMult))
        // Adjust HP delta
        const diff = originalDmg - result.damage
        playerStore.player.hp += diff
      }

      // Fall back reduces damage taken (and dealt) by half
      if (bossFallBack.value && enemy.id === 'balrog') {
        const reduced = Math.floor(result.damage * 0.5)
        const diff = result.damage - reduced
        playerStore.player.hp += diff
        result.damage = reduced
      }

      if (result.hit) {
        statsStore.recordDamageTaken(result.damage)

        // Enemy critical hit bonus effects
        if (result.critical) {
          const critEffect = rollEnemyCritical()
          logs.push(...critEffect.logs)
          if (critEffect.bonusDamage > 0) {
            playerStore.player.hp -= critEffect.bonusDamage
            statsStore.recordDamageTaken(critEffect.bonusDamage)
          }
          if (critEffect.statusEffect) {
            const applied = applyStatusEffect(playerStore.player.statusEffects, critEffect.statusEffect)
            playerStore.player.statusEffects = applied.effects
            logs.push(...applied.logs)
          }
        }

        // Orc captains can poison (20% chance on hit)
        if ((enemy.id === 'orc-captain' || enemy.id === 'orc-berserker') && Math.random() < 0.2) {
          const applied = applyStatusEffect(playerStore.player.statusEffects, 'poisoned')
          playerStore.player.statusEffects = applied.effects
          logs.push(...applied.logs)
        }

        // Balrog inflicts burning (30% chance on hit)
        if (enemy.id === 'balrog' && Math.random() < 0.3) {
          const applied = applyStatusEffect(playerStore.player.statusEffects, 'burning')
          playerStore.player.statusEffects = applied.effects
          logs.push(...applied.logs)
        }

        // Cave troll can stun (15% chance on hit)
        if (enemy.id === 'cave-troll' && Math.random() < 0.15) {
          const applied = applyStatusEffect(playerStore.player.statusEffects, 'stunned')
          playerStore.player.statusEffects = applied.effects
          logs.push(...applied.logs)
        }
      } else if (result.roll === 1) {
        // Enemy fumble on nat 1
        const fumble = rollEnemyFumble()
        logs.push(...fumble.logs)
      }

      logs.push(...result.logs)
      if (playerStore.player.hp <= 0) break
    }
    return logs
  }

  /**
   * Handle boss-specific commands: "stand ground", "fall back", "break the bridge"
   */
  function handleBossChoice(choice: string): GameLogEntry[] {
    const logs: GameLogEntry[] = []
    const lowerChoice = choice.toLowerCase()

    if (lowerChoice.includes('stand ground') || lowerChoice.includes('stand')) {
      bossFallBack.value = false
      logs.push({ text: 'You stand your ground against the Balrog, trading blow for blow!', type: 'combat', timestamp: Date.now() })
      return logs
    }

    if (lowerChoice.includes('fall back') || lowerChoice.includes('back')) {
      bossFallBack.value = true
      logs.push({ text: 'You fall back from the Balrog\'s fury, fighting defensively. Your attacks deal less damage, but you take less in return.', type: 'combat', timestamp: Date.now() })
      return logs
    }

    if (lowerChoice.includes('break') && lowerChoice.includes('bridge')) {
      if (bossPhase.value < 3) {
        logs.push({ text: 'The bridge is not yet weakened enough. Keep fighting!', type: 'error', timestamp: Date.now() })
        return logs
      }

      const playerStore = usePlayerStore()
      if (!playerStore.player) return logs

      const balrog = livingEnemies.value.find(e => e.id === 'balrog')
      if (!balrog) return logs

      const result = resolveBreakBridge(playerStore.player.abilities, playerStore.player.class, balrog.hp)
      logs.push(...result.logs)

      if (result.bossDamage > 0) {
        balrog.hp -= result.bossDamage
        if (balrog.hp <= 0) balrog.hp = 0
      }
      if (result.playerDamage > 0) {
        playerStore.player.hp -= result.playerDamage
      }

      if (balrog.hp <= 0) {
        const bStats = useStatsStore()
        bStats.recordEnemyKilled()
        bStats.recordBalrogSlain()
        const xpLogs = playerStore.addXp(balrog.xpReward)
        logs.push(...xpLogs)

        const loot = rollLoot(balrog.lootTable || [])
        for (const item of loot) {
          dropItemToGround(item.id)
          logs.push({ text: `${balrog.name} dropped ${item.name}.`, type: 'loot', timestamp: Date.now() })
        }

        logs.push({ text: 'All enemies defeated! The way is clear.', type: 'combat', timestamp: Date.now() })
        endCombat()
      }

      return logs
    }

    return logs
  }

  function startCombatWithSurprise(roomEnemies: RoomEnemy[], isDark = false): GameLogEntry[] {
    const logs = startCombat(roomEnemies, isDark)
    logs.push({ text: 'The enemies attack before you can react!', type: 'combat', timestamp: Date.now() })
    logs.push(...doEnemyTurns())
    return logs
  }

  function endCombat() {
    inCombat.value = false
    combatEnemies.value = []
    bossPhase.value = 0
    bossFallBack.value = false

    // Clear combat-only status effects (keep blessed)
    const playerStore = usePlayerStore()
    if (playerStore.player) {
      playerStore.player.statusEffects = playerStore.player.statusEffects.filter(e => e.id === 'blessed')
      playerStore.player.fumblePenalty = false
    }
  }

  return {
    inCombat,
    combatEnemies,
    livingEnemies,
    combatOver,
    turnCount,
    darkCombat,
    bossPhase,
    bossFallBack,
    isBossFight,
    lastCritical,
    startCombat,
    doPlayerAttack,
    doPlayerCast,
    doEnemyTurns,
    startCombatWithSurprise,
    handleBossChoice,
    endCombat,
  }
})
