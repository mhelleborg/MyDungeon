<script setup lang="ts">
import { ref } from 'vue'
import { useGameStore } from '../stores/gameStore'
import { saveGame, loadGame, hasSaveGame, deleteSave } from '../engine/saveLoad'
import { isSoundEnabled, setSoundEnabled } from '../engine/audio'
import type { DifficultyLevel } from '../types/difficulty'
import SaveSlotList from './SaveSlotList.vue'

const gameStore = useGameStore()

const feedback = ref('')
const confirmingRestart = ref(false)
const soundOn = ref(isSoundEnabled())
const saveAvailable = ref(hasSaveGame())
const slotView = ref<'save' | 'load' | null>(null)
const slotList = ref<InstanceType<typeof SaveSlotList> | null>(null)

const difficulties: { id: DifficultyLevel; label: string }[] = [
  { id: 'easy', label: 'Easy' },
  { id: 'normal', label: 'Normal' },
  { id: 'hard', label: 'Hard' },
]

function close() {
  gameStore.menuOpen = false
}

function openSlots(mode: 'save' | 'load') {
  slotView.value = mode
  feedback.value = ''
  confirmingRestart.value = false
}

function onSlotSelected(slot: number) {
  if (slotView.value === 'save') {
    if (saveGame(slot)) {
      saveAvailable.value = true
      feedback.value = `Game saved to slot ${slot}.`
      gameStore.log(`Game saved to slot ${slot}.`, 'system')
      slotList.value?.refresh()
    } else {
      feedback.value = 'Failed to save the game.'
    }
  } else {
    if (loadGame(slot)) {
      feedback.value = `Loaded slot ${slot}.`
      gameStore.log(`Game loaded from slot ${slot}.`, 'system')
      close()
    } else {
      feedback.value = 'That save could not be read.'
    }
  }
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

      <!-- Save/load slot sub-view -->
      <div v-if="slotView" class="p-4 flex flex-col gap-2">
        <div class="text-moria-info text-xs font-bold tracking-wider">
          {{ slotView === 'save' ? 'SAVE TO WHICH SLOT?' : 'LOAD WHICH SAVE?' }}
        </div>
        <SaveSlotList ref="slotList" :mode="slotView" @select="onSlotSelected" />
        <div v-if="feedback" class="text-moria-highlight text-xs text-center">{{ feedback }}</div>
        <button
          @click="slotView = null; feedback = ''"
          class="w-full px-4 py-2.5 border border-moria-border text-moria-text text-sm rounded hover:border-moria-highlight/50 cursor-pointer tracking-wider"
        >BACK</button>
      </div>

      <div v-else class="p-4 flex flex-col gap-2">
        <button
          @click="close"
          class="w-full px-4 py-2.5 bg-moria-highlight text-moria-bg font-bold text-sm rounded hover:bg-moria-highlight/80 cursor-pointer tracking-wider"
        >RESUME</button>

        <button
          @click="openSlots('save')"
          class="w-full px-4 py-2.5 border border-moria-border text-moria-highlight text-sm rounded hover:border-moria-highlight hover:bg-moria-highlight/10 cursor-pointer tracking-wider"
        >SAVE GAME</button>

        <button
          @click="openSlots('load')"
          :disabled="!saveAvailable"
          class="w-full px-4 py-2.5 border text-sm rounded tracking-wider"
          :class="saveAvailable
            ? 'border-moria-border text-moria-highlight hover:border-moria-highlight hover:bg-moria-highlight/10 cursor-pointer'
            : 'border-moria-border/50 text-moria-info opacity-50 cursor-default'"
        >LOAD GAME</button>

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
