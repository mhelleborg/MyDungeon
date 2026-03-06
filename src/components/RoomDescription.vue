<script setup lang="ts">
import { computed, watch } from 'vue'
import { useGameStore } from '../stores/gameStore'
import { useCombatStore } from '../stores/combatStore'
import { useTypewriter } from '../composables/useTypewriter'
import BossHealthBar from './BossHealthBar.vue'
import EnemyCard from './EnemyCard.vue'

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
  <div class="p-3 md:p-4 overflow-y-auto border border-moria-border rounded bg-moria-panel/50 shrink min-h-0 max-h-[35vh] md:max-h-none md:flex-1">
    <template v-if="room">
      <h2 class="text-base md:text-xl font-bold text-moria-highlight mb-1 md:mb-2">{{ room.name }}</h2>
      <p class="text-moria-text text-sm md:text-base leading-relaxed mb-2 md:mb-3 cursor-pointer" @click="skip">
        {{ displayText }}<span v-if="isTyping" class="animate-pulse">|</span>
      </p>
      <p class="text-moria-info text-xs md:text-sm">
        Exits: <span v-for="(exit, i) in room.exits" :key="exit.direction">
          <button
            @click="move(exit.direction)"
            :disabled="combatStore.inCombat"
            class="text-moria-highlight transition-colors py-1 md:py-0 inline-flex items-center"
            :class="combatStore.inCombat
              ? 'opacity-50 cursor-not-allowed'
              : 'hover:text-moria-success underline decoration-moria-highlight/40 hover:decoration-moria-success cursor-pointer'"
          >{{ exit.direction }}</button><span v-if="i < room.exits.length - 1">, </span>
        </span>
      </p>
      <div v-if="combatStore.inCombat" class="mt-2 md:mt-3 p-2 border border-moria-danger/50 rounded bg-moria-danger/10">
        <p class="text-moria-danger font-bold text-xs md:text-sm mb-1">COMBAT</p>
        <EnemyCard
          v-for="enemy in combatStore.combatEnemies.filter(e => !combatStore.isBossFight || e.id !== 'balrog')"
          :key="enemy.instanceId"
          :enemy="enemy"
          @examine="examine"
        />
      </div>
      <BossHealthBar />
    </template>
  </div>
</template>
