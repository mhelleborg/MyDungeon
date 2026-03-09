<script setup lang="ts">
import { computed } from 'vue'
import { useGameStore } from '../stores/gameStore'
import { usePlayerStore } from '../stores/playerStore'
import { useCombatStore } from '../stores/combatStore'
import { items as itemDb } from '../data/items'

const gameStore = useGameStore()
const playerStore = usePlayerStore()
const combatStore = useCombatStore()

const player = computed(() => playerStore.player)
const inCombat = computed(() => combatStore.inCombat)
const atForge = computed(() => gameStore.currentRoomId === 'abandoned-forge' && !inCombat.value)

interface ActionItem {
  id: string
  name: string
  type: string
  count: number
  quantity?: number
}

function dedup(items: { id: string; name: string; type: string; quantity?: number }[]): ActionItem[] {
  const map = new Map<string, ActionItem>()
  for (const item of items) {
    const existing = map.get(item.id)
    if (existing) {
      existing.count++
    } else {
      map.set(item.id, { ...item, count: 1 })
    }
  }
  return Array.from(map.values())
}

// Ground items in current room
const groundItems = computed(() => {
  const ids = gameStore.roomItems[gameStore.currentRoomId] || []
  const items = ids.map(id => itemDb[id]).filter((item): item is NonNullable<typeof item> => !!item)
  return dedup(items)
})

// Inventory items with context-appropriate actions
const usableItems = computed(() => {
  if (!player.value) return []
  const items = playerStore.inventory.filter(item => {
    if (inCombat.value) {
      // Only potions during combat
      return item.type === 'potion'
    }
    // Outside combat: potions and unequipped weapons/armor
    if (item.type === 'potion') return true
    if (item.type === 'weapon' && item.id !== player.value!.equippedWeapon) return true
    if (item.type === 'armor' && item.id !== player.value!.equippedArmor) return true
    return false
  })
  return dedup(items)
})

// Spells (combat only)
const spells = computed(() => {
  if (!player.value || !inCombat.value) return []
  return player.value.spells.filter(s => s.id !== 'light')
})

function cmd(command: string) {
  gameStore.handleCommand(command)
}

function itemAction(item: { id: string; name: string; type: string }) {
  if (item.type === 'potion') return `use ${item.name}`
  if (item.type === 'weapon' || item.type === 'armor') return `equip ${item.name}`
  return `examine ${item.name}`
}

function itemActionLabel(item: { id: string; name: string; type: string }) {
  if (item.type === 'potion') return 'Use'
  if (item.type === 'weapon' || item.type === 'armor') return 'Equip'
  return 'Examine'
}
</script>

<template>
  <div v-if="player && gameStore.phase === 'playing'" class="flex flex-wrap gap-1.5 md:gap-2 px-1 shrink-0">
    <!-- Combat Mode -->
    <template v-if="inCombat">
      <!-- Attack buttons -->
      <button
        v-for="enemy in combatStore.livingEnemies"
        :key="enemy.instanceId"
        @click="cmd(`attack ${enemy.name}`)"
        class="px-2.5 py-1.5 md:px-2 md:py-1 text-[11px] md:text-xs rounded border border-moria-danger/60 bg-moria-danger/15 text-red-400 hover:bg-moria-danger/30 cursor-pointer transition-colors"
      >Attack {{ enemy.name }}</button>

      <!-- Spell buttons -->
      <button
        v-for="spell in spells"
        :key="spell.id"
        :disabled="spell.currentCooldown > 0"
        @click="cmd(`cast ${spell.name}`)"
        class="px-2.5 py-1.5 md:px-2 md:py-1 text-[11px] md:text-xs rounded border transition-colors"
        :class="spell.currentCooldown > 0
          ? 'border-moria-border/40 bg-moria-panel/30 text-moria-border cursor-not-allowed'
          : 'border-moria-info/60 bg-moria-info/15 text-moria-info hover:bg-moria-info/30 cursor-pointer'"
      >
        Cast {{ spell.name }}
        <span v-if="spell.currentCooldown > 0" class="opacity-60">({{ spell.currentCooldown }})</span>
      </button>

      <!-- Combat consumables -->
      <button
        v-for="item in usableItems"
        :key="item.id"
        @click="cmd(`use ${item.name}`)"
        class="px-2.5 py-1.5 md:px-2 md:py-1 text-[11px] md:text-xs rounded border border-amber-500/60 bg-amber-500/15 text-amber-400 hover:bg-amber-500/30 cursor-pointer transition-colors"
      >Use {{ item.name }}<span v-if="item.count > 1" class="opacity-60 ml-1">x{{ item.count }}</span></button>
    </template>

    <!-- Exploration Mode -->
    <template v-else>
      <!-- Ground items -->
      <button
        v-for="item in groundItems"
        :key="item.id"
        @click="cmd(`take ${item.name}`)"
        class="px-2.5 py-1.5 md:px-2 md:py-1 text-[11px] md:text-xs rounded border border-amber-500/60 bg-amber-500/15 text-amber-400 hover:bg-amber-500/30 cursor-pointer transition-colors"
      >Take {{ item.name }}<span v-if="item.count > 1" class="opacity-60 ml-1">x{{ item.count }}</span></button>

      <!-- Usable/equippable inventory items -->
      <button
        v-for="item in usableItems"
        :key="item.id"
        @click="cmd(itemAction(item))"
        class="px-2.5 py-1.5 md:px-2 md:py-1 text-[11px] md:text-xs rounded border border-moria-info/60 bg-moria-info/15 text-moria-info hover:bg-moria-info/30 cursor-pointer transition-colors"
      >{{ itemActionLabel(item) }} {{ item.name }}<span v-if="item.count > 1" class="opacity-60 ml-1">x{{ item.count }}</span></button>

      <!-- Forge crafting -->
      <button
        v-if="atForge"
        @click="cmd('craft')"
        class="px-2.5 py-1.5 md:px-2 md:py-1 text-[11px] md:text-xs rounded border border-orange-500/60 bg-orange-500/15 text-orange-400 hover:bg-orange-500/30 cursor-pointer transition-colors"
      >Forge Item</button>

      <!-- Room actions -->
      <button
        @click="cmd('look')"
        class="px-2.5 py-1.5 md:px-2 md:py-1 text-[11px] md:text-xs rounded border border-moria-border/60 bg-moria-panel/30 text-moria-text hover:bg-moria-border/30 cursor-pointer transition-colors"
      >Look</button>
      <button
        @click="cmd('inventory')"
        class="px-2.5 py-1.5 md:px-2 md:py-1 text-[11px] md:text-xs rounded border border-moria-border/60 bg-moria-panel/30 text-moria-text hover:bg-moria-border/30 cursor-pointer transition-colors"
      >Inventory</button>
      <button
        @click="cmd('stats')"
        class="px-2.5 py-1.5 md:px-2 md:py-1 text-[11px] md:text-xs rounded border border-moria-border/60 bg-moria-panel/30 text-moria-text hover:bg-moria-border/30 cursor-pointer transition-colors"
      >Stats</button>
    </template>
  </div>
</template>
