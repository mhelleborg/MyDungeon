<script setup lang="ts">
import { computed, ref, watch, nextTick } from 'vue'
import { useGameStore } from '../stores/gameStore'
import type { GameLogEntry } from '../types/command'

const gameStore = useGameStore()
const feedEl = ref<HTMLDivElement>()

/** Cap rendered entries so a long session never bogs down the DOM. */
const MAX_RENDERED = 250

type LogFilter = 'all' | 'combat' | 'loot' | 'narrative'
const activeFilter = ref<LogFilter>('all')

const filterMap: Record<LogFilter, string[]> = {
  all: [],
  combat: ['combat', 'system', 'error'],
  loot: ['loot', 'info'],
  narrative: ['narrative'],
}

const filters: { id: LogFilter; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'combat', label: 'Combat' },
  { id: 'loot', label: 'Loot' },
  { id: 'narrative', label: 'Story' },
]

const entries = computed(() => {
  const log = gameStore.gameLog
  const filtered = activeFilter.value === 'all'
    ? log
    : log.filter(e => filterMap[activeFilter.value].includes(e.type))
  return filtered.slice(-MAX_RENDERED)
})

function isCommandEcho(entry: GameLogEntry): boolean {
  return entry.type === 'system' && entry.text.startsWith('> ')
}

/** Auto-follow the feed unless the reader has scrolled up to re-read. */
const pinnedToBottom = ref(true)

function onScroll() {
  const el = feedEl.value
  if (!el) return
  pinnedToBottom.value = el.scrollHeight - el.scrollTop - el.clientHeight < 40
}

function scrollToBottom(smooth = false) {
  const el = feedEl.value
  if (!el) return
  el.scrollTo({ top: el.scrollHeight, behavior: smooth ? 'smooth' : 'auto' })
  pinnedToBottom.value = true
}

watch(() => gameStore.gameLog.length, async () => {
  if (!pinnedToBottom.value) return
  await nextTick()
  scrollToBottom()
}, { flush: 'post' })

watch(activeFilter, async () => {
  await nextTick()
  scrollToBottom()
})

const typeClass: Record<string, string> = {
  narrative: 'text-moria-text font-fantasy text-[15px] md:text-base leading-relaxed',
  combat: 'text-red-400 font-mono text-xs md:text-sm',
  system: 'text-moria-highlight font-mono text-xs md:text-sm',
  error: 'text-moria-danger font-mono text-xs md:text-sm',
  loot: 'text-green-400 font-mono text-xs md:text-sm',
  info: 'text-moria-info font-fantasy text-sm md:text-base',
}
</script>

<template>
  <div class="relative flex flex-col flex-1 min-h-0">
    <!-- Filters -->
    <div class="flex gap-1 px-3 py-1.5 shrink-0 border-b border-moria-border/40">
      <button
        v-for="f in filters"
        :key="f.id"
        @click="activeFilter = f.id"
        class="px-2.5 py-1 text-[11px] md:text-xs rounded-full transition-colors cursor-pointer"
        :class="activeFilter === f.id
          ? 'bg-moria-highlight/20 text-moria-highlight border border-moria-highlight/50'
          : 'text-moria-info border border-transparent hover:border-moria-border'"
      >{{ f.label }}</button>
    </div>

    <!-- Feed -->
    <div
      ref="feedEl"
      @scroll.passive="onScroll"
      class="flex-1 overflow-y-auto overscroll-contain px-3 py-2 md:px-4 md:py-3 space-y-1.5"
      aria-live="polite"
    >
      <div
        v-for="(entry, i) in entries"
        :key="`${entry.timestamp}-${i}`"
        class="feed-entry"
        :class="isCommandEcho(entry)
          ? 'text-moria-info/60 font-mono text-[11px] md:text-xs pt-1.5'
          : typeClass[entry.type] || 'text-moria-text'"
      >{{ entry.text }}</div>
      <div v-if="entries.length === 0" class="text-moria-border italic text-sm">
        {{ activeFilter === 'all' ? 'The darkness awaits...' : 'No entries for this filter.' }}
      </div>
    </div>

    <!-- Jump to latest -->
    <button
      v-if="!pinnedToBottom"
      @click="scrollToBottom(true)"
      class="absolute bottom-3 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full text-xs font-bold
             bg-moria-highlight text-moria-bg shadow-lg cursor-pointer"
    >↓ Latest</button>
  </div>
</template>
