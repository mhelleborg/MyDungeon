<script setup lang="ts">
import { ref } from 'vue'
import { useGameStore } from '../stores/gameStore'

const gameStore = useGameStore()
const input = ref('')
const inputEl = ref<HTMLInputElement>()
const history = ref<string[]>([])
const historyIndex = ref(-1)

function submit() {
  const cmd = input.value.trim()
  if (!cmd) return
  history.value.unshift(cmd)
  historyIndex.value = -1
  gameStore.handleCommand(cmd)
  input.value = ''
}

function handleKeydown(e: KeyboardEvent) {
  if (e.key === 'ArrowUp') {
    e.preventDefault()
    if (historyIndex.value < history.value.length - 1) {
      historyIndex.value++
      input.value = history.value[historyIndex.value] ?? ''
    }
  } else if (e.key === 'ArrowDown') {
    e.preventDefault()
    if (historyIndex.value > 0) {
      historyIndex.value--
      input.value = history.value[historyIndex.value] ?? ''
    } else {
      historyIndex.value = -1
      input.value = ''
    }
  }
}

defineExpose({ focus: () => inputEl.value?.focus() })
</script>

<template>
  <div class="flex items-center gap-2 p-2 border border-moria-border rounded bg-moria-panel/50">
    <span class="text-moria-highlight font-mono">&gt;</span>
    <input
      ref="inputEl"
      v-model="input"
      @keydown.enter="submit"
      @keydown="handleKeydown"
      type="text"
      placeholder="Enter command..."
      data-command-input
      class="flex-1 bg-transparent text-moria-text font-mono text-sm outline-none placeholder-moria-border"
      autofocus
    />
  </div>
</template>
