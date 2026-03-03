import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Player, PlayerClass } from '../types/character'
import { getModifier } from '../types/character'
import type { Item } from '../types/item'
import { items as itemDb } from '../data/items'
import { createPlayer } from '../data/player-classes'
import { rollDice } from '../engine/dice'
import type { GameLogEntry } from '../types/command'
import { playSound } from '../engine/audio'

export const usePlayerStore = defineStore('player', () => {
  const player = ref<Player | null>(null)
  const inventory = ref<Item[]>([])

  const isAlive = computed(() => player.value !== null && player.value.hp > 0)

  function initPlayer(name: string, playerClass: PlayerClass, extraPotions = 0) {
    player.value = createPlayer(name, playerClass)
    inventory.value = []

    // Add starting items to inventory based on class
    const startingItems: Record<PlayerClass, string[]> = {
      'ranger': ['longsword', 'leather-armor', 'healing-potion', 'healing-potion'],
      'wizard': ['staff', 'healing-potion'],
      'dwarf-warrior': ['battle-axe', 'chain-mail', 'healing-potion'],
    }

    for (const itemId of startingItems[playerClass]) {
      const item = itemDb[itemId]
      if (item) inventory.value.push({ ...item })
    }

    // Extra potions from difficulty
    if (extraPotions > 0) {
      for (let i = 0; i < extraPotions; i++) {
        const potion = itemDb['healing-potion']
        if (potion) addItem(potion)
      }
    } else if (extraPotions < 0) {
      // Remove potions on hard difficulty
      for (let i = 0; i < Math.abs(extraPotions); i++) {
        removeItem('healing-potion')
      }
    }
  }

  function addItem(item: Item): GameLogEntry[] {
    const logs: GameLogEntry[] = []
    const existing = inventory.value.find(i => i.id === item.id && i.consumable)
    if (existing && existing.quantity !== undefined) {
      existing.quantity = (existing.quantity || 1) + 1
      logs.push({ text: `Picked up ${item.name}.`, type: 'loot', timestamp: Date.now() })
    } else {
      inventory.value.push({ ...item, quantity: item.consumable ? 1 : undefined })
      logs.push({ text: `Picked up ${item.name}.`, type: 'loot', timestamp: Date.now() })
    }
    return logs
  }

  function removeItem(itemId: string): boolean {
    const idx = inventory.value.findIndex(i => i.id === itemId)
    if (idx === -1) return false

    const item = inventory.value[idx]!
    if (item.consumable && item.quantity && item.quantity > 1) {
      item.quantity--
    } else {
      inventory.value.splice(idx, 1)
    }
    return true
  }

  function equipItem(itemId: string): GameLogEntry[] {
    if (!player.value) return []
    const logs: GameLogEntry[] = []
    const item = inventory.value.find(i => i.id === itemId)
    if (!item) {
      logs.push({ text: 'You don\'t have that item.', type: 'error', timestamp: Date.now() })
      return logs
    }
    if (item.type === 'weapon') {
      player.value.equippedWeapon = itemId
      logs.push({ text: `You wield the ${item.name}.`, type: 'info', timestamp: Date.now() })
    } else if (item.type === 'armor') {
      player.value.equippedArmor = itemId
      player.value.ac = 10 + getModifier(player.value.abilities.dex) + (item.armorBonus || 0)
      logs.push({ text: `You don the ${item.name}. (AC: ${player.value.ac})`, type: 'info', timestamp: Date.now() })
    } else {
      logs.push({ text: 'You can\'t equip that.', type: 'error', timestamp: Date.now() })
    }
    return logs
  }

  function useItem(itemId: string, healingMultiplier = 1.0): GameLogEntry[] {
    if (!player.value) return []
    const logs: GameLogEntry[] = []
    const item = inventory.value.find(i => i.id === itemId)
    if (!item) {
      logs.push({ text: 'You don\'t have that item.', type: 'error', timestamp: Date.now() })
      return logs
    }

    if (item.type === 'potion' && item.healing) {
      const heal = rollDice(item.healing)
      const scaledHeal = Math.max(1, Math.floor(heal.total * healingMultiplier))
      const oldHp = player.value.hp
      player.value.hp = Math.min(player.value.maxHp, player.value.hp + scaledHeal)
      const healed = player.value.hp - oldHp
      logs.push({ text: `You drink the ${item.name} and recover ${healed} HP. (${player.value.hp}/${player.value.maxHp})`, type: 'info', timestamp: Date.now() })
      removeItem(itemId)
    } else {
      logs.push({ text: `You can't use ${item.name} that way.`, type: 'error', timestamp: Date.now() })
    }
    return logs
  }

  function addXp(amount: number): GameLogEntry[] {
    if (!player.value) return []
    const logs: GameLogEntry[] = []
    player.value.xp += amount
    if (player.value.xp >= player.value.xpToNext) {
      player.value.level++
      playSound('levelup')
      player.value.xp -= player.value.xpToNext
      player.value.xpToNext = Math.floor(player.value.xpToNext * 1.5)
      const hpGain = Math.max(1, rollDice('1d8+0').total + getModifier(player.value.abilities.con))
      player.value.maxHp += hpGain
      player.value.hp = player.value.maxHp
      logs.push({ text: `LEVEL UP! You are now level ${player.value.level}! (+${hpGain} HP)`, type: 'system', timestamp: Date.now() })
    }
    return logs
  }

  function getEquippedWeapon(): Item | undefined {
    if (!player.value?.equippedWeapon) return undefined
    return inventory.value.find(i => i.id === player.value!.equippedWeapon)
  }

  return {
    player,
    inventory,
    isAlive,
    initPlayer,
    addItem,
    removeItem,
    equipItem,
    useItem,
    addXp,
    getEquippedWeapon,
  }
})
