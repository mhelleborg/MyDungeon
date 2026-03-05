<script setup lang="ts">
import { ref } from 'vue'
import type { PlayerClass } from '../types/character'
import type { DifficultyLevel } from '../types/difficulty'
import { difficultySettings } from '../types/difficulty'
import { useGameStore } from '../stores/gameStore'
import { usePlayerStore } from '../stores/playerStore'

const gameStore = useGameStore()
const playerStore = usePlayerStore()

const name = ref('')
const selectedClass = ref<PlayerClass>('ranger')
const selectedDifficulty = ref<DifficultyLevel>('normal')

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
  playerStore.initPlayer(playerName, selectedClass.value, multipliers.extraPotions)
  gameStore.phase = 'playing'
  gameStore.initGame()
}
</script>

<template>
  <div class="min-h-screen flex flex-col items-center justify-center bg-moria-bg px-4">
    <div class="max-w-xl w-full">
      <h2 class="text-3xl font-bold text-moria-highlight mb-6 text-center tracking-wider">CHOOSE YOUR PATH</h2>

      <!-- Name input -->
      <div class="mb-6">
        <label class="text-moria-info text-xs block mb-1">YOUR NAME</label>
        <input
          v-model="name"
          type="text"
          placeholder="Enter your name..."
          class="w-full px-4 py-2 bg-moria-panel border border-moria-border rounded text-moria-text font-mono outline-none
                 focus:border-moria-highlight placeholder-moria-border"
        />
      </div>

      <!-- Class selection -->
      <div class="space-y-3 mb-8">
        <button
          v-for="cls in classes"
          :key="cls.id"
          @click="selectedClass = cls.id"
          class="w-full text-left p-4 border rounded transition-colors cursor-pointer"
          :class="selectedClass === cls.id
            ? 'border-moria-highlight bg-moria-highlight/10'
            : 'border-moria-border bg-moria-panel/30 hover:border-moria-border/80'"
        >
          <div class="flex items-baseline gap-2 mb-1">
            <span class="text-moria-highlight font-bold">{{ cls.label }}</span>
            <span class="text-moria-info text-xs">({{ cls.subtitle }})</span>
          </div>
          <p class="text-moria-text text-sm mb-1">{{ cls.desc }}</p>
          <p class="text-moria-info text-xs font-mono">{{ cls.stats }}</p>
        </button>
      </div>

      <!-- Difficulty selection -->
      <div class="mb-8">
        <label class="text-moria-info text-xs block mb-2">DIFFICULTY</label>
        <div class="flex flex-col sm:flex-row gap-2">
          <button
            v-for="diff in difficulties"
            :key="diff.id"
            @click="selectedDifficulty = diff.id"
            class="flex-1 p-3 border rounded transition-colors cursor-pointer text-center"
            :class="selectedDifficulty === diff.id
              ? 'border-moria-highlight bg-moria-highlight/10'
              : 'border-moria-border bg-moria-panel/30 hover:border-moria-border/80'"
          >
            <span class="text-moria-highlight font-bold text-sm">{{ diff.label }}</span>
            <p class="text-moria-info text-xs mt-1">{{ diff.desc }}</p>
          </button>
        </div>
      </div>

      <button
        @click="startAdventure"
        class="w-full px-6 py-3 bg-moria-border text-moria-highlight font-bold text-lg rounded
               hover:bg-moria-highlight hover:text-moria-bg transition-colors cursor-pointer tracking-wider"
      >
        BEGIN JOURNEY
      </button>
    </div>
  </div>
</template>
