<script setup lang="ts">
import { computed } from 'vue'
import { useCombatStore } from '../stores/combatStore'

const combatStore = useCombatStore()

const balrog = computed(() => combatStore.livingEnemies.find(e => e.id === 'balrog'))

const hpPercent = computed(() => {
  if (!balrog.value) return 0
  return Math.max(0, (balrog.value.hp / balrog.value.maxHp) * 100)
})

const phaseName = computed(() => {
  switch (combatStore.bossPhase) {
    case 1: return 'SHADOW AND FLAME'
    case 2: return 'THE BRIDGE CRACKS'
    case 3: return 'YOU SHALL NOT PASS'
    default: return ''
  }
})

const barClass = computed(() => {
  switch (combatStore.bossPhase) {
    case 1: return 'boss-bar-phase1'
    case 2: return 'boss-bar-phase2'
    case 3: return 'boss-bar-phase3'
    default: return 'boss-bar-phase1'
  }
})
</script>

<template>
  <div v-if="combatStore.isBossFight && balrog" class="mt-3 p-3 border border-red-500/60 rounded bg-red-900/20">
    <div class="flex justify-between items-center mb-1">
      <span class="text-red-400 font-bold text-sm tracking-wider">{{ phaseName }}</span>
      <span class="text-moria-text text-xs font-mono">{{ balrog.hp }}/{{ balrog.maxHp }}</span>
    </div>
    <div class="w-full h-3 bg-moria-bg rounded overflow-hidden">
      <div
        :class="barClass"
        class="h-full transition-all duration-500 rounded"
        :style="{ width: hpPercent + '%' }"
      ></div>
    </div>
    <div class="text-center text-red-400/70 text-xs mt-1 font-bold">DURIN'S BANE</div>
  </div>
</template>

<style scoped>
.boss-bar-phase1 {
  background: linear-gradient(90deg, #dc2626, #f97316);
}
.boss-bar-phase2 {
  background: linear-gradient(90deg, #f97316, #eab308);
}
.boss-bar-phase3 {
  background: linear-gradient(90deg, #dc2626, #f97316);
  animation: boss-pulse 0.8s ease-in-out infinite alternate;
}
@keyframes boss-pulse {
  from { opacity: 0.7; }
  to { opacity: 1; }
}
</style>
