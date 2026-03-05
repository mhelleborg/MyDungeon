<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useGameStore } from '../stores/gameStore'
import { hasSaveGame, loadGame, getSaveTimestamp } from '../engine/saveLoad'

const gameStore = useGameStore()
const showContinue = ref(false)
const saveTimestamp = ref<string | null>(null)

onMounted(() => {
  showContinue.value = hasSaveGame()
  if (showContinue.value) {
    const ts = getSaveTimestamp()
    if (ts) {
      saveTimestamp.value = new Date(ts).toLocaleString()
    }
  }
})

function continueGame() {
  if (loadGame()) {
    gameStore.phase = 'playing'
  }
}

function startGame() {
  gameStore.phase = 'character-select'
}
</script>

<template>
  <div class="min-h-screen flex flex-col items-center justify-center bg-moria-bg px-4">
    <div class="text-center max-w-lg">
      <h1 class="text-5xl font-bold text-moria-highlight mb-2 tracking-wider">MINES OF MORIA</h1>
      <div class="text-moria-border text-sm mb-8 tracking-widest">A DUNGEON OF MIDDLE-EARTH</div>

      <div class="text-moria-text/70 text-sm leading-relaxed mb-10 italic">
        "The Dwarves dug too greedily and too deep. You know what they awoke in the darkness of Khazad-dum...
        shadow and flame."
      </div>

      <div class="border border-moria-border p-6 rounded bg-moria-panel/30 mb-8">
        <pre class="text-moria-highlight/60 text-xs font-mono leading-tight">
     ___________
    /           \
   /  SPEAK     \
  |   FRIEND    |
  |   AND       |
  |   ENTER     |
   \           /
    \_________/
    |  |   |  |
    |  |   |  |
        </pre>
      </div>

      <div class="flex flex-col items-center gap-3">
        <button
          v-if="showContinue"
          @click="continueGame"
          class="px-8 py-3 bg-moria-highlight text-moria-bg font-bold text-lg rounded
                 hover:bg-moria-highlight/80 transition-colors cursor-pointer
                 tracking-wider"
        >
          CONTINUE
        </button>
        <div v-if="showContinue && saveTimestamp" class="text-moria-border text-xs -mt-1 mb-1">
          Saved: {{ saveTimestamp }}
        </div>

        <button
          @click="startGame"
          class="px-8 py-3 bg-moria-border text-moria-highlight font-bold text-lg rounded
                 hover:bg-moria-highlight hover:text-moria-bg transition-colors cursor-pointer
                 tracking-wider"
        >
          ENTER MORIA
        </button>
      </div>

      <div class="mt-6 text-moria-border text-xs">
        A text adventure using simplified D&D rules
      </div>
      <a
        href="https://github.com/mhelleborg/MyDungeon/issues/new"
        target="_blank"
        rel="noopener"
        class="mt-3 inline-block text-moria-info text-xs hover:text-moria-highlight transition-colors underline decoration-moria-info/40"
      >Ideas or feedback?</a>
    </div>
  </div>
</template>
