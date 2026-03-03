<script setup lang="ts">
import { computed, ref, watch, nextTick } from 'vue'
import { useGameStore } from '../stores/gameStore'

const gameStore = useGameStore()
const logEl = ref<HTMLDivElement>()

const log = computed(() => gameStore.gameLog)

watch(() => log.value.length, async () => {
  await nextTick()
  if (logEl.value) {
    logEl.value.scrollTop = logEl.value.scrollHeight
  }
})

const typeColor: Record<string, string> = {
  narrative: 'text-moria-text',
  combat: 'text-red-400',
  system: 'text-moria-highlight',
  error: 'text-moria-danger',
  loot: 'text-green-400',
  info: 'text-moria-info',
}
</script>

<template>
  <div ref="logEl" class="flex-1 overflow-y-auto p-3 border border-moria-border rounded bg-moria-bg/80 font-mono text-xs leading-relaxed space-y-0.5">
    <div v-for="(entry, i) in log" :key="i" :class="typeColor[entry.type] || 'text-moria-text'">
      {{ entry.text }}
    </div>
    <div v-if="log.length === 0" class="text-moria-border italic">
      The darkness awaits...
    </div>
  </div>
</template>
