<script setup lang="ts">
import { useGameStore } from './stores/gameStore'
import TitleScreen from './views/TitleScreen.vue'
import CharacterSelect from './views/CharacterSelect.vue'
import GameScreen from './views/GameScreen.vue'

const gameStore = useGameStore()
</script>

<template>
  <TitleScreen v-if="gameStore.phase === 'title'" />
  <CharacterSelect v-else-if="gameStore.phase === 'character-select'" />
  <GameScreen v-else />
</template>
