<script setup lang="ts">
import { ref } from 'vue'
import type { PlayerClass } from '../types/character'
import { playerClassNames } from '../types/character'
import type { DifficultyLevel } from '../types/difficulty'
import { difficultySettings } from '../types/difficulty'
import { useGameStore } from '../stores/gameStore'
import { usePlayerStore } from '../stores/playerStore'
import type { RegionId } from '../types/region'
import { world, DEFAULT_REGION } from '../data/world'
import { SAVE_SLOT_COUNT } from '../types/save'
import { listSaveSlots, firstEmptySlot, setActiveSlot, saveGame } from '../engine/saveLoad'

const gameStore = useGameStore()
const playerStore = usePlayerStore()

const name = ref('')
const selectedClass = ref<PlayerClass>('ranger')
const selectedDifficulty = ref<DifficultyLevel>('normal')
const selectedAct = ref<RegionId>(DEFAULT_REGION)

const slotMetas = listSaveSlots()
const selectedSlot = ref(firstEmptySlot() ?? 1)

function slotSummary(slot: number): string {
  const meta = slotMetas[slot - 1]
  if (!meta) return 'Empty'
  const cls = meta.playerClass ? playerClassNames[meta.playerClass] : 'Adventurer'
  return `${meta.playerName} — Lv ${meta.level} ${cls}, ${meta.regionName}`
}

const acts: { id: RegionId; label: string; desc: string }[] = Object.values(world)
  .filter(region => region.startOption)
  .map(region => ({ id: region.id, label: region.startOption!.label, desc: region.startOption!.desc }))

const difficulties = [
  { id: 'easy' as DifficultyLevel, label: 'Easy', desc: 'Weaker enemies, more loot, bonus healing. For those who want to enjoy the story.' },
  { id: 'normal' as DifficultyLevel, label: 'Normal', desc: 'Standard challenge. A fair fight through the Mines of Moria.' },
  { id: 'hard' as DifficultyLevel, label: 'Hard', desc: 'Tougher enemies, scarcer supplies, harder skill checks. For seasoned adventurers.' },
]

const classes = [
  {
    id: 'ranger' as PlayerClass,
    label: 'Ranger',
    subtitle: 'Aragorn-type',
    desc: 'A skilled tracker and swordsman. Balanced stats, good perception, deadly with a blade.',
    stats: 'STR 14 | DEX 16 | CON 13 | HP 28 | AC 15',
  },
  {
    id: 'wizard' as PlayerClass,
    label: 'Wizard',
    subtitle: 'Gandalf-type',
    desc: 'A wielder of arcane power. Lower HP but devastating spells - fire bolt, shield, and light.',
    stats: 'STR 8 | DEX 14 | INT 18 | HP 18 | AC 12',
  },
  {
    id: 'dwarf-warrior' as PlayerClass,
    label: 'Dwarf Warrior',
    subtitle: 'Gimli-type',
    desc: 'A stout warrior of Erebor. Highest HP and STR, heavy armor, devastating axe attacks.',
    stats: 'STR 18 | DEX 10 | CON 16 | HP 36 | AC 14',
  },
]

function startAdventure() {
  const playerName = name.value.trim() || 'Adventurer'
  gameStore.difficulty = selectedDifficulty.value
  const multipliers = difficultySettings[selectedDifficulty.value]
  setActiveSlot(selectedSlot.value)
  playerStore.initPlayer(playerName, selectedClass.value, multipliers.extraPotions, selectedAct.value)
  gameStore.phase = 'playing'
  gameStore.initGame(selectedAct.value)
  saveGame(selectedSlot.value)
}
</script>

<template>
  <div class="min-h-[100dvh] flex flex-col items-center bg-moria-bg px-4 py-6 sm:justify-center overflow-y-auto">
    <div class="max-w-xl w-full">
      <h2 class="text-2xl sm:text-3xl font-bold text-moria-highlight mb-4 sm:mb-6 text-center tracking-wider">CHOOSE YOUR PATH</h2>

      <!-- Name input -->
      <div class="mb-4 sm:mb-6">
        <label class="text-moria-info text-xs block mb-1">YOUR NAME</label>
        <input
          v-model="name"
          type="text"
          placeholder="Enter your name..."
          class="w-full px-4 py-2.5 bg-moria-panel border border-moria-border rounded text-moria-text font-mono outline-none
                 focus:border-moria-highlight placeholder-moria-border"
        />
      </div>

      <!-- Class selection -->
      <div class="space-y-2 sm:space-y-3 mb-6 sm:mb-8">
        <button
          v-for="cls in classes"
          :key="cls.id"
          @click="selectedClass = cls.id"
          class="w-full text-left p-3 sm:p-4 border rounded transition-colors cursor-pointer"
          :class="selectedClass === cls.id
            ? 'border-moria-highlight bg-moria-highlight/10'
            : 'border-moria-border bg-moria-panel/30 hover:border-moria-border/80'"
        >
          <div class="flex items-baseline gap-2 mb-1">
            <span class="text-moria-highlight font-bold text-sm sm:text-base">{{ cls.label }}</span>
            <span class="text-moria-info text-xs">({{ cls.subtitle }})</span>
          </div>
          <p class="text-moria-text text-xs sm:text-sm mb-1">{{ cls.desc }}</p>
          <p class="text-moria-info text-[10px] sm:text-xs font-mono">{{ cls.stats }}</p>
        </button>
      </div>

      <!-- Starting act selection -->
      <div class="mb-6 sm:mb-8">
        <label class="text-moria-info text-xs block mb-2">STARTING POINT</label>
        <div class="flex flex-col sm:flex-row gap-2">
          <button
            v-for="act in acts"
            :key="act.id"
            @click="selectedAct = act.id"
            class="flex-1 p-2.5 sm:p-3 border rounded transition-colors cursor-pointer text-center"
            :class="selectedAct === act.id
              ? 'border-moria-highlight bg-moria-highlight/10'
              : 'border-moria-border bg-moria-panel/30 hover:border-moria-border/80'"
          >
            <span class="text-moria-highlight font-bold text-sm">{{ act.label }}</span>
            <p class="text-moria-info text-xs mt-1">{{ act.desc }}</p>
          </button>
        </div>
      </div>

      <!-- Difficulty selection -->
      <div class="mb-6 sm:mb-8">
        <label class="text-moria-info text-xs block mb-2">DIFFICULTY</label>
        <div class="flex flex-col sm:flex-row gap-2">
          <button
            v-for="diff in difficulties"
            :key="diff.id"
            @click="selectedDifficulty = diff.id"
            class="flex-1 p-2.5 sm:p-3 border rounded transition-colors cursor-pointer text-center"
            :class="selectedDifficulty === diff.id
              ? 'border-moria-highlight bg-moria-highlight/10'
              : 'border-moria-border bg-moria-panel/30 hover:border-moria-border/80'"
          >
            <span class="text-moria-highlight font-bold text-sm">{{ diff.label }}</span>
            <p class="text-moria-info text-xs mt-1">{{ diff.desc }}</p>
          </button>
        </div>
      </div>

      <!-- Save slot selection -->
      <div class="mb-6 sm:mb-8">
        <label class="text-moria-info text-xs block mb-2">SAVE SLOT</label>
        <div class="flex flex-col sm:flex-row gap-2">
          <button
            v-for="slot in SAVE_SLOT_COUNT"
            :key="slot"
            @click="selectedSlot = slot"
            class="flex-1 p-2.5 sm:p-3 border rounded transition-colors cursor-pointer text-center"
            :class="selectedSlot === slot
              ? 'border-moria-highlight bg-moria-highlight/10'
              : 'border-moria-border bg-moria-panel/30 hover:border-moria-border/80'"
          >
            <span class="text-moria-highlight font-bold text-sm">SLOT {{ slot }}</span>
            <p class="text-xs mt-1" :class="slotMetas[slot - 1] ? 'text-moria-text' : 'text-moria-info italic'">
              {{ slotSummary(slot) }}
            </p>
          </button>
        </div>
        <p v-if="slotMetas[selectedSlot - 1]" class="text-moria-danger text-xs mt-2 text-center">
          Starting here will overwrite the save in slot {{ selectedSlot }}.
        </p>
      </div>

      <button
        @click="startAdventure"
        class="w-full px-6 py-3 bg-moria-border text-moria-highlight font-bold text-base sm:text-lg rounded
               hover:bg-moria-highlight hover:text-moria-bg transition-colors cursor-pointer tracking-wider min-h-[48px]"
      >
        BEGIN JOURNEY
      </button>
    </div>
  </div>
</template>
