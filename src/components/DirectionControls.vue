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

const allDirs = computed<Direction[]>(() => {
  const dirs: Direction[] = ['north', 'south', 'east', 'west']
  if (availableExits.value.has('up')) dirs.push('up')
  if (availableExits.value.has('down')) dirs.push('down')
  return dirs
})

const dirLabel: Record<string, string> = {
  north: 'N', south: 'S', east: 'E', west: 'W', up: 'UP', down: 'DN',
}

function move(dir: Direction) {
  gameStore.handleCommand(dir)
}
</script>

<template>
  <!-- Mobile: inline horizontal buttons -->
  <div class="md:hidden flex flex-wrap gap-1 p-1.5 border border-moria-border rounded bg-moria-panel/50">
    <button
      v-for="dir in allDirs"
      :key="dir"
      @click="move(dir)"
      :disabled="!availableExits.has(dir) || combatStore.inCombat"
      class="px-3 py-1.5 text-xs font-bold rounded transition-colors min-h-[36px]"
      :class="availableExits.has(dir) && !combatStore.inCombat
        ? 'bg-moria-border text-moria-highlight hover:bg-moria-highlight hover:text-moria-bg cursor-pointer'
        : 'bg-moria-bg text-moria-border cursor-not-allowed'"
    >{{ dirLabel[dir] }}</button>
  </div>

  <!-- Desktop: compass grid -->
  <div class="hidden md:block p-3 border border-moria-border rounded bg-moria-panel/50">
    <div class="grid grid-cols-3 gap-1 w-fit mx-auto">
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

    <div v-if="availableExits.has('up') || availableExits.has('down')" class="flex justify-center gap-2 mt-2">
      <button
        v-if="availableExits.has('up')"
        @click="move('up')"
        :disabled="combatStore.inCombat"
        class="px-3 py-1 text-xs font-bold rounded bg-moria-border text-moria-highlight hover:bg-moria-highlight hover:text-moria-bg cursor-pointer"
      >UP</button>
      <button
        v-if="availableExits.has('down')"
        @click="move('down')"
        :disabled="combatStore.inCombat"
        class="px-3 py-1 text-xs font-bold rounded bg-moria-border text-moria-highlight hover:bg-moria-highlight hover:text-moria-bg cursor-pointer"
      >DOWN</button>
    </div>
  </div>
</template>
