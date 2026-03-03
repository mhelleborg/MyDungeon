<script setup lang="ts">
import { computed } from 'vue'
import { usePlayerStore } from '../stores/playerStore'
import { useGameStore } from '../stores/gameStore'

const playerStore = usePlayerStore()
const gameStore = useGameStore()
const player = computed(() => playerStore.player)
const inventory = computed(() => playerStore.inventory)

function isEquipped(itemId: string): boolean {
  if (!player.value) return false
  return player.value.equippedWeapon === itemId || player.value.equippedArmor === itemId
}

function clickItem(item: { id: string; name: string; type: string }) {
  if (item.type === 'potion') {
    gameStore.handleCommand(`use ${item.name}`)
  } else if ((item.type === 'weapon' || item.type === 'armor') && !isEquipped(item.id)) {
    gameStore.handleCommand(`equip ${item.name}`)
  } else {
    gameStore.handleCommand(`examine ${item.name}`)
  }
}

function actionHint(item: { id: string; name: string; type: string }): string {
  if (item.type === 'potion') return 'Click to use'
  if ((item.type === 'weapon' || item.type === 'armor') && !isEquipped(item.id)) return 'Click to equip'
  return 'Click to examine'
}

const typeIcon: Record<string, string> = {
  weapon: '⚔',
  armor: '🛡',
  potion: '🧪',
  quest: '★',
  misc: '•',
}
</script>

<template>
  <div class="p-3 border border-moria-border rounded bg-moria-panel/50">
    <div class="text-moria-info text-xs font-bold mb-2">INVENTORY</div>
    <div v-if="inventory.length === 0" class="text-moria-border text-xs italic">Empty</div>
    <div v-for="item in inventory" :key="item.id" class="text-xs flex items-center gap-1 py-0.5">
      <span class="text-moria-border">{{ typeIcon[item.type] || '•' }}</span>
      <button
        @click="clickItem(item)"
        :title="actionHint(item)"
        class="text-moria-text hover:text-moria-highlight cursor-pointer transition-colors text-left"
      >{{ item.name }}</button>
      <span v-if="item.quantity && item.quantity > 1" class="text-moria-info">x{{ item.quantity }}</span>
      <span v-if="isEquipped(item.id)" class="text-moria-highlight text-[10px]">(eq)</span>
    </div>
    <div v-if="player" class="mt-2 text-xs text-moria-info">
      Gold: <span class="text-moria-highlight">{{ player.gold }}</span>
    </div>
  </div>
</template>
