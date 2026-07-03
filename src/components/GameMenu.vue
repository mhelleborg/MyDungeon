<script setup lang="ts">
import { ref, computed } from 'vue'
import { useGameStore } from '../stores/gameStore'
import { saveGame, loadGame, hasSaveGame, getSaveTimestamp, deleteSave } from '../engine/saveLoad'
import { isSoundEnabled, setSoundEnabled } from '../engine/audio'
import type { DifficultyLevel } from '../types/difficulty'

const gameStore = useGameStore()

const feedback = ref('')
const confirmingRestart = ref(false)
const soundOn = ref(isSoundEnabled())
const saveAvailable = ref(hasSaveGame())

const difficulties: { id: DifficultyLevel; label: string }[] = [
  { id: 'easy', label: 'Easy' },
  { id: 'normal', label: 'Normal' },
  { id: 'hard', label: 'Hard' },
]

const saveTimestamp = computed(() => {
  const ts = getSaveTimestamp()
  return ts ? new Date(ts).toLocaleString() : null
})

function close() {
  gameStore.menuOpen = false
}

function doSave() {
  if (saveGame()) {
    saveAvailable.value = true
    feedback.value = 'Game saved.'
  } else {
    feedback.value = 'Failed to save the game.'
  }
  confirmingRestart.value = false
}

function doLoad() {
  if (loadGame()) {
    feedback.value = 'Game loaded.'
    gameStore.log('Game loaded.', 'system')
    close()
  } else {
    feedback.value = 'No save found, or the save could not be read.'
  }
  confirmingRestart.value = false
}

function toggleSound() {
  soundOn.value = !soundOn.value
  setSoundEnabled(soundOn.value)
}

function setDifficulty(level: DifficultyLevel) {
  if (gameStore.difficulty === level) return
  gameStore.difficulty = level
  gameStore.log(`Difficulty set to ${level}. It will apply to battles and rests ahead.`, 'system')
  feedback.value = `Difficulty set to ${level}.`
}

function quitToTitle() {
  saveGame()
  gameStore.menuOpen = false
  gameStore.phase = 'title'
}

function restart() {
  if (!confirmingRestart.value) {
    confirmingRestart.value = true
    return
  }
  deleteSave()
  gameStore.menuOpen = false
  gameStore.phase = 'title'
}
</script>

<template>
  <div class="fixed inset-0 bg-black/85 z-50 flex items-center justify-center p-4 overflow-y-auto" @click.self="close">
    <div class="w-full max-w-sm bg-moria-panel border border-moria-border rounded shadow-2xl my-auto">
      <!-- Header -->
      <div class="flex items-center justify-between px-4 py-2.5 border-b border-moria-border">
        <span class="text-moria-highlight font-bold tracking-[0.25em] text-sm">MENU</span>
        <button
          @click="close"
          class="text-moria-info hover:text-moria-highlight text-xl leading-none px-2 py-1 cursor-pointer"
          aria-label="Close menu"
        >✕</button>
      </div>

      <div class="p-4 flex flex-col gap-2">
        <button
          @click="close"
          class="w-full px-4 py-2.5 bg-moria-highlight text-moria-bg font-bold text-sm rounded hover:bg-moria-highlight/80 cursor-pointer tracking-wider"
        >RESUME</button>

        <button
          @click="doSave"
          class="w-full px-4 py-2.5 border border-moria-border text-moria-highlight text-sm rounded hover:border-moria-highlight hover:bg-moria-highlight/10 cursor-pointer tracking-wider"
        >SAVE GAME</button>

        <button
          @click="doLoad"
          :disabled="!saveAvailable"
          class="w-full px-4 py-2.5 border text-sm rounded tracking-wider"
          :class="saveAvailable
            ? 'border-moria-border text-moria-highlight hover:border-moria-highlight hover:bg-moria-highlight/10 cursor-pointer'
            : 'border-moria-border/50 text-moria-info opacity-50 cursor-default'"
        >LOAD LAST SAVE</button>
        <div v-if="saveTimestamp" class="text-moria-info text-[11px] -mt-1 text-center">
          Last save: {{ saveTimestamp }}
        </div>

        <!-- Settings -->
        <div class="border-t border-moria-border/50 mt-2 pt-3">
          <div class="text-moria-info text-xs font-bold mb-2">SETTINGS</div>

          <div class="flex items-center justify-between mb-3">
            <span class="text-moria-text text-sm">Sound</span>
            <button
              @click="toggleSound"
              class="px-3 py-1.5 border rounded text-xs cursor-pointer transition-colors"
              :class="soundOn
                ? 'border-moria-highlight/60 text-moria-highlight'
                : 'border-moria-border text-moria-info'"
            >{{ soundOn ? 'ON' : 'OFF' }}</button>
          </div>

          <div class="flex items-center justify-between gap-2">
            <span class="text-moria-text text-sm">Difficulty</span>
            <div class="flex gap-1">
              <button
                v-for="d in difficulties"
                :key="d.id"
                @click="setDifficulty(d.id)"
                class="px-2.5 py-1.5 border rounded text-xs cursor-pointer transition-colors"
                :class="gameStore.difficulty === d.id
                  ? 'border-moria-highlight bg-moria-highlight/15 text-moria-highlight'
                  : 'border-moria-border text-moria-info hover:text-moria-text'"
              >{{ d.label }}</button>
            </div>
          </div>
          <div class="text-moria-info/70 text-[11px] mt-1 text-right italic">applies to battles ahead</div>
        </div>

        <!-- Danger zone -->
        <div class="border-t border-moria-border/50 mt-2 pt-3 flex flex-col gap-2">
          <button
            @click="quitToTitle"
            class="w-full px-4 py-2.5 border border-moria-border text-moria-text text-sm rounded hover:border-moria-highlight/50 cursor-pointer tracking-wider"
          >QUIT TO TITLE <span class="text-moria-info text-xs">(saves first)</span></button>

          <button
            @click="restart"
            class="w-full px-4 py-2.5 border text-sm rounded cursor-pointer tracking-wider transition-colors"
            :class="confirmingRestart
              ? 'border-moria-danger bg-moria-danger/20 text-moria-danger font-bold'
              : 'border-moria-border text-moria-info hover:text-moria-danger hover:border-moria-danger/50'"
          >{{ confirmingRestart ? 'ARE YOU SURE? THIS ABANDONS YOUR JOURNEY' : 'RESTART GAME' }}</button>
        </div>

        <div v-if="feedback" class="text-moria-highlight text-xs text-center mt-1">{{ feedback }}</div>
      </div>
    </div>
  </div>
</template>
