<script setup lang="ts">
import { computed } from 'vue'
import { useGameStore } from '../stores/gameStore'
import { useCombatStore } from '../stores/combatStore'
import type { Direction } from '../types/room'

const gameStore = useGameStore()
const combatStore = useCombatStore()

const room = computed(() => gameStore.currentRoom)

const dirMeta: Record<Direction, { arrow: string; label: string }> = {
  north: { arrow: '↑', label: 'N' },
  south: { arrow: '↓', label: 'S' },
  east: { arrow: '→', label: 'E' },
  west: { arrow: '←', label: 'W' },
  up: { arrow: '▲', label: 'Up' },
  down: { arrow: '▼', label: 'Dn' },
}

// Visible exits only (hidden exits appear once revealed)
const exits = computed(() => {
  if (!room.value) return []
  return room.value.exits
    .filter(e => !e.hidden || gameStore.revealedExits.has(`${room.value!.id}-${e.direction}`))
    .map(e => e.direction)
})

const locked = computed(() => combatStore.inCombat)

function move(dir: Direction) {
  gameStore.handleCommand(dir)
}
</script>

<template>
  <div
    v-if="room"
    class="flex items-center gap-2 px-3 py-1.5 md:px-4 border-b border-moria-border bg-moria-panel/40 shrink-0"
  >
    <div class="min-w-0 flex-1">
      <div class="text-moria-highlight font-bold text-sm md:text-base leading-tight truncate">
        {{ room.name }}
      </div>
      <div class="text-moria-info text-[10px] md:text-xs truncate">
        {{ gameStore.currentRegion?.name }}
      </div>
    </div>
    <div class="flex gap-1 shrink-0" role="group" aria-label="Exits">
      <button
        v-for="dir in exits"
        :key="dir"
        @click="move(dir)"
        :disabled="locked"
        :aria-label="`Go ${dir}`"
        class="min-w-[44px] min-h-[44px] md:min-w-[40px] md:min-h-[40px] px-1.5 rounded-lg text-xs font-bold
               flex flex-col items-center justify-center leading-none gap-0.5 transition-colors"
        :class="locked
          ? 'bg-moria-bg text-moria-border cursor-not-allowed'
          : 'bg-moria-border/70 text-moria-highlight hover:bg-moria-highlight hover:text-moria-bg cursor-pointer'"
      >
        <span class="text-sm">{{ dirMeta[dir].arrow }}</span>
        <span>{{ dirMeta[dir].label }}</span>
      </button>
    </div>
  </div>
</template>
