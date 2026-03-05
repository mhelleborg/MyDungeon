<script setup lang="ts">
import { computed, ref, watch, nextTick } from 'vue'
import { useGameStore } from '../stores/gameStore'

const gameStore = useGameStore()
const logEl = ref<HTMLDivElement>()

type LogFilter = 'all' | 'combat' | 'loot' | 'narrative'
const activeFilter = ref<LogFilter>('all')

const filterMap: Record<LogFilter, string[]> = {
  all: [],
  combat: ['combat', 'system', 'error'],
  loot: ['loot', 'info'],
  narrative: ['narrative'],
}

const filteredLog = computed(() => {
  if (activeFilter.value === 'all') return gameStore.gameLog
  const types = filterMap[activeFilter.value]
  return gameStore.gameLog.filter(e => types.includes(e.type))
})

watch(() => gameStore.gameLog.length, async () => {
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

const filters: { id: LogFilter; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'combat', label: 'Combat' },
  { id: 'loot', label: 'Loot' },
  { id: 'narrative', label: 'Story' },
]
</script>

<template>
  <div class="flex flex-col flex-1 min-h-0">
    <!-- Filter buttons -->
    <div class="flex gap-1 mb-1">
      <button
        v-for="f in filters"
        :key="f.id"
        @click="activeFilter = f.id"
        class="px-3 py-1.5 md:px-2 md:py-0.5 text-xs rounded transition-colors cursor-pointer"
        :class="activeFilter === f.id
          ? 'bg-moria-highlight/20 text-moria-highlight border border-moria-highlight/50'
          : 'text-moria-info border border-moria-border hover:border-moria-info'"
      >{{ f.label }}</button>
    </div>

    <!-- Log entries -->
    <div ref="logEl" class="flex-1 overflow-y-auto p-3 border border-moria-border rounded bg-moria-bg/80 font-mono text-xs leading-relaxed space-y-0.5 max-h-[30vh] md:max-h-none">
      <div v-for="(entry, i) in filteredLog" :key="i" :class="typeColor[entry.type] || 'text-moria-text'">
        {{ entry.text }}
      </div>
      <div v-if="filteredLog.length === 0" class="text-moria-border italic">
        {{ activeFilter === 'all' ? 'The darkness awaits...' : 'No entries for this filter.' }}
      </div>
    </div>
  </div>
</template>
