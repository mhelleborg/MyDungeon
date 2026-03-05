<script setup lang="ts">
import { computed } from 'vue'
import { useGameStore } from '../stores/gameStore'
import { useCombatStore } from '../stores/combatStore'
import type { Direction } from '../types/room'

const gameStore = useGameStore()
const combatStore = useCombatStore()

const room = computed(() => gameStore.currentRoom)
const availableExits = computed(() => {
  if (!room.value) return new Set<Direction>()
  return new Set(room.value.exits.map(e => e.direction))
})

function move(dir: Direction) {
  gameStore.handleCommand(dir)
}
</script>

<template>
  <div class="p-3 border border-moria-border rounded bg-moria-panel/50">
    <div class="grid grid-cols-3 gap-1 w-fit mx-auto">
      <!-- Row 1: North -->
      <div></div>
      <button
        @click="move('north')"
        :disabled="!availableExits.has('north') || combatStore.inCombat"
        class="px-3 py-2 text-sm font-bold rounded transition-colors min-w-[44px] min-h-[44px]"
        :class="availableExits.has('north') && !combatStore.inCombat
          ? 'bg-moria-border text-moria-highlight hover:bg-moria-highlight hover:text-moria-bg cursor-pointer'
          : 'bg-moria-bg text-moria-border cursor-not-allowed'"
      >N</button>
      <div></div>

      <!-- Row 2: West + compass + East -->
      <button
        @click="move('west')"
        :disabled="!availableExits.has('west') || combatStore.inCombat"
        class="px-3 py-2 text-sm font-bold rounded transition-colors min-w-[44px] min-h-[44px]"
        :class="availableExits.has('west') && !combatStore.inCombat
          ? 'bg-moria-border text-moria-highlight hover:bg-moria-highlight hover:text-moria-bg cursor-pointer'
          : 'bg-moria-bg text-moria-border cursor-not-allowed'"
      >W</button>
      <div class="flex items-center justify-center text-moria-border text-lg">+</div>
      <button
        @click="move('east')"
        :disabled="!availableExits.has('east') || combatStore.inCombat"
        class="px-3 py-2 text-sm font-bold rounded transition-colors min-w-[44px] min-h-[44px]"
        :class="availableExits.has('east') && !combatStore.inCombat
          ? 'bg-moria-border text-moria-highlight hover:bg-moria-highlight hover:text-moria-bg cursor-pointer'
          : 'bg-moria-bg text-moria-border cursor-not-allowed'"
      >E</button>

      <!-- Row 3: South -->
      <div></div>
      <button
        @click="move('south')"
        :disabled="!availableExits.has('south') || combatStore.inCombat"
        class="px-3 py-2 text-sm font-bold rounded transition-colors min-w-[44px] min-h-[44px]"
        :class="availableExits.has('south') && !combatStore.inCombat
          ? 'bg-moria-border text-moria-highlight hover:bg-moria-highlight hover:text-moria-bg cursor-pointer'
          : 'bg-moria-bg text-moria-border cursor-not-allowed'"
      >S</button>
      <div></div>
    </div>

    <!-- Up/Down if available -->
    <div v-if="availableExits.has('up') || availableExits.has('down')" class="flex justify-center gap-2 mt-2">
      <button
        v-if="availableExits.has('up')"
        @click="move('up')"
        :disabled="combatStore.inCombat"
        class="px-3 py-1 text-xs font-bold rounded bg-moria-border text-moria-highlight hover:bg-moria-highlight hover:text-moria-bg"
      >UP</button>
      <button
        v-if="availableExits.has('down')"
        @click="move('down')"
        :disabled="combatStore.inCombat"
        class="px-3 py-1 text-xs font-bold rounded bg-moria-border text-moria-highlight hover:bg-moria-highlight hover:text-moria-bg"
      >DOWN</button>
    </div>
  </div>
</template>
