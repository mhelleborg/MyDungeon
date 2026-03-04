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
import { useGameStore } from './gameStore'
import { useStatsStore } from './statsStore'

export const useCombatStore = defineStore('combat', () => {
  const inCombat = ref(false)
  const combatEnemies = ref<CombatEnemy[]>([])
  const turnCount = ref(0)
  const darkCombat = ref(false)
  const bossPhase = ref<BossPhase>(0)
  const bossFallBack = ref(false)

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

    const gameStore = useGameStore()
    const multipliers = gameStore.getDifficultyMultipliers()

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
    const gameStore2 = useGameStore()
    for (const comp of gameStore2.companions) {
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

  function doPlayerAttack(targetName?: string): GameLogEntry[] {
    const playerStore = usePlayerStore()
    if (!playerStore.player || !inCombat.value) return []

    const logs: GameLogEntry[] = []

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

    // Get weapon info
    const weapon = playerStore.getEquippedWeapon()
    const weaponDamage = weapon?.damage || '1d4+0'
    const attackBonus = weapon?.attackBonus || 0

    // Player attacks
    const result = playerAttack(playerStore.player, target, weaponDamage, attackBonus)
    logs.push(...result.logs)

    const statsStore = useStatsStore()
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
        const gameStore = useGameStore()
        const loot = rollLoot(target.lootTable)
        for (const item of loot) {
          if (!gameStore.roomItems[gameStore.currentRoomId]) {
            gameStore.roomItems[gameStore.currentRoomId] = []
          }
          gameStore.roomItems[gameStore.currentRoomId]!.push(item.id)
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
    const gameStore = useGameStore()
    const logs: GameLogEntry[] = []
    const statsStore = useStatsStore()
    const playerStore = usePlayerStore()

    for (const comp of gameStore.companions) {
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
            if (!gameStore.roomItems[gameStore.currentRoomId]) {
              gameStore.roomItems[gameStore.currentRoomId] = []
            }
            gameStore.roomItems[gameStore.currentRoomId]!.push(item.id)
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

    const gameStore = useGameStore()
    const dmgMult = gameStore.getDifficultyMultipliers().enemyDamage
    const livingCompanions = gameStore.companions.filter(c => c.hp > 0)

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
          logs.push({ text: `${enemy.name} attacks ${target.name} but misses.`, type: 'combat', timestamp: Date.now() })
        }
        continue
      }

      const result = enemyAttack(enemy, playerStore.player, darkCombat.value)

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

      if (result.hit) statsStore.recordDamageTaken(result.damage)
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

        const gameStore = useGameStore()
        const loot = rollLoot(balrog.lootTable || [])
        for (const item of loot) {
          if (!gameStore.roomItems[gameStore.currentRoomId]) {
            gameStore.roomItems[gameStore.currentRoomId] = []
          }
          gameStore.roomItems[gameStore.currentRoomId]!.push(item.id)
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
    startCombat,
    doPlayerAttack,
    doPlayerCast,
    doEnemyTurns,
    startCombatWithSurprise,
    handleBossChoice,
    endCombat,
  }
})
