<script setup lang="ts">
import { computed, watch } from 'vue'
import { useGameStore } from '../stores/gameStore'
import { useCombatStore } from '../stores/combatStore'
import { useTypewriter } from '../composables/useTypewriter'

const gameStore = useGameStore()
const combatStore = useCombatStore()

const room = computed(() => gameStore.currentRoom)
const { displayText, isTyping, start, skip } = useTypewriter(3, 20)

// Type out description when room changes
watch(() => gameStore.currentRoomId, () => {
  if (room.value) {
    start(room.value.description)
  }
}, { immediate: true })

function move(direction: string) {
  gameStore.handleCommand(direction)
}

function examine(name: string) {
  gameStore.handleCommand(`examine ${name}`)
}
</script>

<template>
  <div class="flex-1 p-4 overflow-y-auto border border-moria-border rounded bg-moria-panel/50">
    <template v-if="room">
      <h2 class="text-xl font-bold text-moria-highlight mb-2">{{ room.name }}</h2>
      <p class="text-moria-text leading-relaxed mb-3 cursor-pointer" @click="skip">
        {{ displayText }}<span v-if="isTyping" class="animate-pulse">|</span>
      </p>
      <p class="text-moria-info text-sm">
        Exits: <span v-for="(exit, i) in room.exits" :key="exit.direction">
          <button
            @click="move(exit.direction)"
            :disabled="combatStore.inCombat"
            class="text-moria-highlight transition-colors"
            :class="combatStore.inCombat
              ? 'opacity-50 cursor-not-allowed'
              : 'hover:text-moria-success underline decoration-moria-highlight/40 hover:decoration-moria-success cursor-pointer'"
          >{{ exit.direction }}</button><span v-if="i < room.exits.length - 1">, </span>
        </span>
      </p>
      <div v-if="combatStore.inCombat" class="mt-3 p-2 border border-moria-danger/50 rounded bg-moria-danger/10">
        <p class="text-moria-danger font-bold text-sm mb-1">COMBAT</p>
        <div v-for="enemy in combatStore.livingEnemies" :key="enemy.instanceId" class="text-sm">
          <button
            @click="examine(enemy.name)"
            class="text-red-400 hover:text-red-300 underline decoration-red-400/40 hover:decoration-red-300 cursor-pointer transition-colors"
          >{{ enemy.name }}</button>
          <span class="text-moria-info ml-2">HP: {{ enemy.hp }}/{{ enemy.maxHp }}</span>
        </div>
      </div>
    </template>
  </div>
</template>
