import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { CombatEnemy } from '../types/character'
import type { GameLogEntry } from '../types/command'
import { enemies as enemyDb } from '../data/enemies'
import type { RoomEnemy } from '../types/room'
import { playerAttack, enemyAttack, castSpell, tickCooldowns } from '../engine/combat'
import { rollLoot } from '../engine/loot'
import { usePlayerStore } from './playerStore'
import { useGameStore } from './gameStore'

export const useCombatStore = defineStore('combat', () => {
  const inCombat = ref(false)
  const combatEnemies = ref<CombatEnemy[]>([])
  const turnCount = ref(0)

  const livingEnemies = computed(() => combatEnemies.value.filter(e => e.hp > 0))
  const combatOver = computed(() => inCombat.value && livingEnemies.value.length === 0)

  function startCombat(roomEnemies: RoomEnemy[]): GameLogEntry[] {
    const logs: GameLogEntry[] = []
    combatEnemies.value = []
    turnCount.value = 0

    for (const re of roomEnemies) {
      const template = enemyDb[re.enemyId]
      if (!template) continue
      for (let i = 0; i < re.count; i++) {
        combatEnemies.value.push({
          ...template,
          hp: template.maxHp,
          instanceId: `${re.enemyId}-${i}`,
        })
      }
    }

    inCombat.value = true
    if (combatEnemies.value.length === 1) {
      logs.push({ text: `A ${combatEnemies.value[0]!.name} bars your path!`, type: 'combat', timestamp: Date.now() })
    } else {
      const names = combatEnemies.value.map(e => e.name).join(', ')
      logs.push({ text: `Enemies appear: ${names}!`, type: 'combat', timestamp: Date.now() })
    }
    logs.push({ text: 'Roll for initiative! Type "attack" or "cast <spell>" to fight.', type: 'system', timestamp: Date.now() })
    return logs
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

    if (result.hit && target.hp <= 0) {
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

    if (target && target.hp <= 0) {
      const xpLogs = playerStore.addXp(target.xpReward)
      logs.push(...xpLogs)
    }

    if (livingEnemies.value.length === 0) {
      logs.push({ text: 'All enemies defeated!', type: 'combat', timestamp: Date.now() })
      endCombat()
      return logs
    }

    logs.push(...doEnemyTurns())
    turnCount.value++
    tickCooldowns(playerStore.player)

    return logs
  }

  function doEnemyTurns(): GameLogEntry[] {
    const playerStore = usePlayerStore()
    if (!playerStore.player) return []

    const logs: GameLogEntry[] = []
    for (const enemy of livingEnemies.value) {
      const result = enemyAttack(enemy, playerStore.player)
      logs.push(...result.logs)

      if (playerStore.player.hp <= 0) break
    }
    return logs
  }

  function endCombat() {
    inCombat.value = false
    combatEnemies.value = []
  }

  return {
    inCombat,
    combatEnemies,
    livingEnemies,
    combatOver,
    turnCount,
    startCombat,
    doPlayerAttack,
    doPlayerCast,
    endCombat,
  }
})
