<script setup lang="ts">
import RoomDescription from '../components/RoomDescription.vue'
import ActionBar from '../components/ActionBar.vue'
import DirectionControls from '../components/DirectionControls.vue'
import CommandInput from '../components/CommandInput.vue'
import PlayerStats from '../components/PlayerStats.vue'
import InventoryPanel from '../components/InventoryPanel.vue'
import CombatLog from '../components/CombatLog.vue'
import MiniMap from '../components/MiniMap.vue'
import { useGameStore } from '../stores/gameStore'
import { usePlayerStore } from '../stores/playerStore'
import { computed } from 'vue'

const gameStore = useGameStore()
const playerStore = usePlayerStore()

const hpPercent = computed(() => {
  const p = playerStore.player
  if (!p) return 0
  return Math.max(0, Math.round((p.hp / p.maxHp) * 100))
})

const hpBarColor = computed(() => {
  if (hpPercent.value > 60) return 'bg-moria-success'
  if (hpPercent.value > 30) return 'bg-amber-500'
  return 'bg-moria-danger'
})
</script>

<template>
  <div class="h-screen flex flex-col bg-moria-bg">
    <!-- Header -->
    <header class="flex items-center justify-between px-4 py-2 border-b border-moria-border bg-moria-panel/50">
      <h1 class="text-lg font-bold text-moria-highlight tracking-wider">MINES OF MORIA</h1>
      <div v-if="playerStore.player" class="flex items-center gap-3">
        <span class="text-moria-info text-xs">HP</span>
        <div class="w-32 h-2 bg-moria-bg rounded overflow-hidden">
          <div :class="hpBarColor" class="h-full transition-all duration-300" :style="{ width: hpPercent + '%' }"></div>
        </div>
        <span class="text-moria-text text-xs font-mono">{{ playerStore.player.hp }}/{{ playerStore.player.maxHp }}</span>
      </div>
    </header>

    <!-- Main content -->
    <div class="flex-1 flex overflow-hidden">
      <!-- Left column: room + controls + log + input -->
      <div class="flex-1 flex flex-col p-3 gap-3 min-w-0">
        <RoomDescription />

        <ActionBar />

        <div class="flex gap-3">
          <DirectionControls />
          <div class="flex-1"></div>
        </div>

        <CombatLog />
        <CommandInput />
      </div>

      <!-- Right sidebar -->
      <div class="w-64 flex flex-col gap-3 p-3 border-l border-moria-border overflow-y-auto">
        <PlayerStats />
        <InventoryPanel />
        <MiniMap />
      </div>
    </div>

    <!-- Game Over overlay -->
    <div v-if="gameStore.phase === 'game-over'" class="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
      <div class="text-center p-8">
        <h2 class="text-4xl font-bold text-moria-danger mb-4">YOU HAVE FALLEN</h2>
        <p class="text-moria-text mb-6">The darkness of Moria claims another soul...</p>
        <button
          @click="gameStore.phase = 'title'"
          class="px-6 py-2 bg-moria-border text-moria-highlight rounded hover:bg-moria-highlight hover:text-moria-bg cursor-pointer"
        >TRY AGAIN</button>
      </div>
    </div>

    <!-- Victory overlay -->
    <div v-if="gameStore.phase === 'victory'" class="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
      <div class="text-center p-8">
        <h2 class="text-4xl font-bold text-moria-highlight mb-4">VICTORY!</h2>
        <p class="text-moria-text mb-2">You have crossed the Mines of Moria!</p>
        <p class="text-moria-info mb-6">The light of day greets you once more.</p>
        <button
          @click="gameStore.phase = 'title'"
          class="px-6 py-2 bg-moria-border text-moria-highlight rounded hover:bg-moria-highlight hover:text-moria-bg cursor-pointer"
        >PLAY AGAIN</button>
      </div>
    </div>
  </div>
</template>
