<script setup lang="ts">
import { onMounted } from 'vue'
import { useGameStore } from './stores/gameStore'
import { getMostRecentSlot, loadGame } from './engine/saveLoad'
import TitleScreen from './views/TitleScreen.vue'
import CharacterSelect from './views/CharacterSelect.vue'
import GameScreen from './views/GameScreen.vue'

const gameStore = useGameStore()

onMounted(() => {
  const slot = getMostRecentSlot()
  if (slot !== null) {
    loadGame(slot)
  }
})
</script>

<template>
  <TitleScreen v-if="gameStore.phase === 'title'" />
  <CharacterSelect v-else-if="gameStore.phase === 'character-select'" />
  <GameScreen v-else />
</template>
