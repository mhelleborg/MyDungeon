<script setup lang="ts">
import { useGameStore } from '../stores/gameStore'
import { useContextActions, FOCUS_INPUT, type ActionVariant } from '../composables/useContextActions'

const emit = defineEmits<{
  requestInput: []
}>()

const gameStore = useGameStore()
const { actions } = useContextActions()

const variantClass: Record<ActionVariant, string> = {
  choice: 'border-purple-500/60 bg-purple-500/15 text-purple-300 hover:bg-purple-500/30',
  danger: 'border-moria-danger/60 bg-moria-danger/15 text-red-400 hover:bg-moria-danger/30',
  arcane: 'border-moria-info/60 bg-moria-info/15 text-sky-200/80 hover:bg-moria-info/30',
  loot: 'border-amber-500/60 bg-amber-500/15 text-amber-400 hover:bg-amber-500/30',
  neutral: 'border-moria-border bg-moria-panel/40 text-moria-text hover:bg-moria-border/40',
}

function run(command: string) {
  if (command === FOCUS_INPUT) {
    emit('requestInput')
    return
  }
  gameStore.handleCommand(command)
}
</script>

<template>
  <div v-if="actions.length > 0" class="flex flex-wrap gap-1.5 content-start">
    <button
      v-for="action in actions"
      :key="action.key"
      :disabled="action.disabled"
      @click="run(action.command)"
      class="px-3 min-h-[44px] md:min-h-[36px] md:py-1.5 text-[13px] md:text-xs leading-tight rounded-lg border transition-colors"
      :class="action.disabled
        ? 'border-moria-border/40 bg-moria-panel/30 text-moria-border cursor-not-allowed'
        : variantClass[action.variant] + ' cursor-pointer'"
    >
      {{ action.label }}<span v-if="action.sub" class="opacity-60 ml-1">{{ action.sub }}</span>
    </button>
  </div>
</template>
