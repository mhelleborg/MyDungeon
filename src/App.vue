<script setup lang="ts">
import { onMounted } from 'vue'
import { useGameStore } from './stores/gameStore'
import { hasSaveGame, loadGame } from './engine/saveLoad'
import TitleScreen from './views/TitleScreen.vue'
import CharacterSelect from './views/CharacterSelect.vue'
import GameScreen from './views/GameScreen.vue'

const gameStore = useGameStore()

onMounted(() => {
  if (hasSaveGame()) {
    loadGame()
  }
})
</script>

<template>
  <TitleScreen v-if="gameStore.phase === 'title'" />
  <CharacterSelect v-else-if="gameStore.phase === 'character-select'" />
  <GameScreen v-else />
</template>
