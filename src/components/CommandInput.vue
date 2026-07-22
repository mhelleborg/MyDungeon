<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useGameStore } from '../stores/gameStore'

const props = defineProps<{
  /** Focus the input as soon as it mounts (desktop / opened-on-demand). */
  autofocus?: boolean
}>()

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

onMounted(() => {
  if (props.autofocus) inputEl.value?.focus()
})

defineExpose({ focus: () => inputEl.value?.focus() })
</script>

<template>
  <div class="flex items-center gap-2 px-2 py-1.5 md:p-2 border border-moria-border rounded bg-moria-panel/50">
    <span class="text-moria-highlight font-mono text-sm md:text-base">&gt;</span>
    <input
      ref="inputEl"
      v-model="input"
      @keydown.enter="submit"
      @keydown="handleKeydown"
      type="text"
      placeholder="Enter command..."
      data-command-input
      autocapitalize="off"
      autocorrect="off"
      autocomplete="off"
      spellcheck="false"
      enterkeyhint="send"
      class="flex-1 bg-transparent text-moria-text font-mono outline-none placeholder-moria-border"
    />
  </div>
</template>
