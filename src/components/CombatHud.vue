<script setup lang="ts">
import { useGameStore } from '../stores/gameStore'
import { useCombatStore } from '../stores/combatStore'
import EnemyCard from './EnemyCard.vue'
import BossHealthBar from './BossHealthBar.vue'

const gameStore = useGameStore()
const combatStore = useCombatStore()

function examine(name: string) {
  gameStore.handleCommand(`examine ${name}`)
}
</script>

<template>
  <div
    v-if="combatStore.inCombat"
    class="shrink-0 border border-moria-danger/50 rounded-lg bg-moria-danger/10 px-2 py-1.5 max-h-[26vh] overflow-y-auto"
  >
    <p class="text-moria-danger font-bold text-[11px] md:text-xs tracking-widest mb-0.5">⚔ COMBAT</p>
    <EnemyCard
      v-for="enemy in combatStore.combatEnemies.filter(e => e.hp > 0 && (!combatStore.isBossFight || e.id !== 'balrog'))"
      :key="enemy.instanceId"
      :enemy="enemy"
      @examine="examine"
    />
    <BossHealthBar />
  </div>
</template>
