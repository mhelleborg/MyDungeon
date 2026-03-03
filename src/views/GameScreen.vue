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
import { useStatsStore } from '../stores/statsStore'
import { formatElapsed } from '../engine/achievements'
import { isSoundEnabled, setSoundEnabled } from '../engine/audio'
import { computed, ref, watch } from 'vue'

const gameStore = useGameStore()
const playerStore = usePlayerStore()
const statsStore = useStatsStore()

// Screen effects
const screenEffect = ref('')
let effectTimer: ReturnType<typeof setTimeout> | null = null

function triggerEffect(effect: string) {
  if (effectTimer) clearTimeout(effectTimer)
  screenEffect.value = effect
  effectTimer = setTimeout(() => { screenEffect.value = '' }, 500)
}

// Watch for damage taken to trigger screen effects
watch(() => playerStore.player?.hp, (newHp, oldHp) => {
  if (newHp !== undefined && oldHp !== undefined && newHp < oldHp) {
    const dmg = oldHp - newHp
    triggerEffect(dmg >= 10 ? 'screen-shake screen-flash-red' : 'screen-flash-red')
  }
})

// Watch for level up
watch(() => playerStore.player?.level, (newLvl, oldLvl) => {
  if (newLvl !== undefined && oldLvl !== undefined && newLvl > oldLvl) {
    triggerEffect('screen-flash-gold')
  }
})

// Sound toggle
const soundOn = ref(isSoundEnabled())
function toggleSound() {
  soundOn.value = !soundOn.value
  setSoundEnabled(soundOn.value)
}

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
  <div class="h-screen flex flex-col bg-moria-bg" :class="screenEffect">
    <!-- Header -->
    <header class="flex items-center justify-between px-4 py-2 border-b border-moria-border bg-moria-panel/50">
      <h1 class="text-lg font-bold text-moria-highlight tracking-wider">MINES OF MORIA</h1>
      <div v-if="playerStore.player" class="flex items-center gap-3">
        <button
          @click="toggleSound"
          class="text-xs px-2 py-1 border rounded transition-colors cursor-pointer"
          :class="soundOn
            ? 'border-moria-highlight/50 text-moria-highlight'
            : 'border-moria-border text-moria-info'"
          :title="soundOn ? 'Sound On' : 'Sound Off'"
        >{{ soundOn ? 'SND' : 'MUTE' }}</button>
      </div>
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
    <div v-if="gameStore.phase === 'game-over'" class="fixed inset-0 bg-black/80 flex items-center justify-center z-50 overflow-y-auto">
      <div class="text-center p-8 max-w-md w-full">
        <h2 class="text-4xl font-bold text-moria-danger mb-4">YOU HAVE FALLEN</h2>
        <p class="text-moria-text mb-6">The darkness of Moria claims another soul...</p>

        <!-- Run Stats -->
        <div class="bg-moria-panel/50 border border-moria-border rounded p-4 mb-6 text-left">
          <h3 class="text-moria-highlight font-bold text-sm mb-2 text-center">RUN STATS</h3>
          <div class="grid grid-cols-2 gap-1 text-xs font-mono">
            <span class="text-moria-info">Rooms explored</span>
            <span class="text-moria-text text-right">{{ statsStore.roomsExplored }} / {{ statsStore.totalRooms }}</span>
            <span class="text-moria-info">Enemies slain</span>
            <span class="text-moria-text text-right">{{ statsStore.enemiesKilled }}</span>
            <span class="text-moria-info">Damage dealt</span>
            <span class="text-moria-text text-right">{{ statsStore.damageDealt }}</span>
            <span class="text-moria-info">Damage taken</span>
            <span class="text-moria-text text-right">{{ statsStore.damageTaken }}</span>
            <span class="text-moria-info">Items found</span>
            <span class="text-moria-text text-right">{{ statsStore.itemsFound }}</span>
            <span class="text-moria-info">Potions used</span>
            <span class="text-moria-text text-right">{{ statsStore.potionsUsed }}</span>
            <span class="text-moria-info">Time</span>
            <span class="text-moria-text text-right">{{ formatElapsed(statsStore.startTime) }}</span>
          </div>
        </div>

        <button
          @click="gameStore.phase = 'title'"
          class="px-6 py-2 bg-moria-border text-moria-highlight rounded hover:bg-moria-highlight hover:text-moria-bg cursor-pointer"
        >TRY AGAIN</button>
      </div>
    </div>

    <!-- Victory overlay -->
    <div v-if="gameStore.phase === 'victory'" class="fixed inset-0 bg-black/80 flex items-center justify-center z-50 overflow-y-auto">
      <div class="text-center p-8 max-w-md w-full">
        <h2 class="text-4xl font-bold text-moria-highlight mb-4">VICTORY!</h2>
        <p class="text-moria-text mb-2">You have crossed the Mines of Moria!</p>
        <p class="text-moria-info mb-4">The light of day greets you once more.</p>

        <!-- Run Stats -->
        <div class="bg-moria-panel/50 border border-moria-border rounded p-4 mb-4 text-left">
          <h3 class="text-moria-highlight font-bold text-sm mb-2 text-center">RUN STATS</h3>
          <div class="grid grid-cols-2 gap-1 text-xs font-mono">
            <span class="text-moria-info">Rooms explored</span>
            <span class="text-moria-text text-right">{{ statsStore.roomsExplored }} / {{ statsStore.totalRooms }}</span>
            <span class="text-moria-info">Enemies slain</span>
            <span class="text-moria-text text-right">{{ statsStore.enemiesKilled }}</span>
            <span class="text-moria-info">Damage dealt</span>
            <span class="text-moria-text text-right">{{ statsStore.damageDealt }}</span>
            <span class="text-moria-info">Damage taken</span>
            <span class="text-moria-text text-right">{{ statsStore.damageTaken }}</span>
            <span class="text-moria-info">Items found</span>
            <span class="text-moria-text text-right">{{ statsStore.itemsFound }}</span>
            <span class="text-moria-info">Potions used</span>
            <span class="text-moria-text text-right">{{ statsStore.potionsUsed }}</span>
            <span class="text-moria-info">Puzzles solved</span>
            <span class="text-moria-text text-right">{{ statsStore.puzzlesSolved }}</span>
            <span class="text-moria-info">Secrets found</span>
            <span class="text-moria-text text-right">{{ statsStore.secretsFound }}</span>
            <span class="text-moria-info">Time</span>
            <span class="text-moria-text text-right">{{ formatElapsed(statsStore.startTime) }}</span>
          </div>
        </div>

        <!-- New Achievements -->
        <div v-if="statsStore.newlyUnlocked.length > 0" class="bg-moria-panel/50 border border-moria-highlight/50 rounded p-4 mb-4">
          <h3 class="text-moria-highlight font-bold text-sm mb-2">NEW ACHIEVEMENTS</h3>
          <div v-for="id in statsStore.newlyUnlocked" :key="id" class="flex items-center gap-2 text-left mb-1">
            <span class="text-moria-highlight font-bold text-xs w-5 text-center">{{ statsStore.allAchievements.find(a => a.id === id)?.icon }}</span>
            <div>
              <span class="text-moria-text text-xs font-bold">{{ statsStore.allAchievements.find(a => a.id === id)?.name }}</span>
              <span class="text-moria-info text-xs ml-2">{{ statsStore.allAchievements.find(a => a.id === id)?.description }}</span>
            </div>
          </div>
        </div>

        <!-- All Achievements -->
        <div class="bg-moria-panel/50 border border-moria-border rounded p-4 mb-6">
          <h3 class="text-moria-highlight font-bold text-sm mb-2">ACHIEVEMENTS ({{ statsStore.allAchievements.filter(a => a.unlocked).length }}/{{ statsStore.allAchievements.length }})</h3>
          <div class="grid grid-cols-2 gap-1 text-left">
            <div v-for="a in statsStore.allAchievements" :key="a.id" class="flex items-center gap-1" :class="a.unlocked ? '' : 'opacity-40'">
              <span class="text-xs font-bold w-4 text-center" :class="a.unlocked ? 'text-moria-highlight' : 'text-moria-border'">{{ a.icon }}</span>
              <span class="text-xs" :class="a.unlocked ? 'text-moria-text' : 'text-moria-border'">{{ a.name }}</span>
            </div>
          </div>
        </div>

        <button
          @click="gameStore.phase = 'title'"
          class="px-6 py-2 bg-moria-border text-moria-highlight rounded hover:bg-moria-highlight hover:text-moria-bg cursor-pointer"
        >PLAY AGAIN</button>
      </div>
    </div>
  </div>
</template>
