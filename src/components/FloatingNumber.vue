<script setup lang="ts">
import { computed } from 'vue'
import type { Floater } from '../composables/useFloaters'

const props = defineProps<{ floater: Floater }>()

const variantClass = computed(() => {
  switch (props.floater.kind) {
    case 'damage-out': return 'floater-damage-out text-amber-300 text-base font-bold'
    case 'crit': return 'floater-crit text-amber-400 text-2xl font-black'
    case 'miss': return 'floater-miss text-moria-info/70 text-xs italic'
    case 'damage-in': return 'floater-damage-in text-moria-danger text-lg font-bold'
    case 'heal': return 'floater-heal text-moria-success text-base font-bold'
    case 'magic': return 'floater-magic text-violet-300 text-base font-bold'
    default: return 'text-moria-text text-base'
  }
})

const displayValue = computed(() => {
  if (props.floater.kind === 'miss') return 'miss'
  if (props.floater.kind === 'heal') return `+${props.floater.value}`
  return String(props.floater.value)
})

const styleVars = computed(() => ({
  left: `${props.floater.x + props.floater.jitter}px`,
  top: `${props.floater.y}px`,
}))
</script>

<template>
  <div
    class="floater font-fantasy select-none"
    :class="[variantClass, { 'floater-reduced': floater.reduced }]"
    :style="styleVars"
    aria-hidden="true"
  >{{ displayValue }}</div>
</template>

<style scoped>
.floater {
  position: fixed;
  transform: translate(-50%, -50%);
  pointer-events: none;
  white-space: nowrap;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.85), 0 0 4px rgba(0, 0, 0, 0.6);
  will-change: transform, opacity;
}

.floater-damage-out {
  animation: floater-rise 0.8s ease-out forwards;
}

.floater-crit {
  animation: floater-crit-pop 0.8s ease-out forwards;
}

.floater-miss {
  animation: floater-rise 0.8s ease-out forwards;
}

.floater-damage-in {
  animation: floater-fall 0.8s ease-out forwards;
}

.floater-heal {
  animation: floater-rise 0.8s ease-out forwards;
}

.floater-magic {
  animation: floater-rise 0.8s ease-out forwards;
}

@keyframes floater-rise {
  0% { transform: translate(-50%, -50%) translateY(0); opacity: 0; }
  15% { opacity: 1; }
  100% { transform: translate(-50%, -50%) translateY(-40px); opacity: 0; }
}

@keyframes floater-fall {
  0% { transform: translate(-50%, -50%) translateY(0); opacity: 0; }
  15% { opacity: 1; }
  100% { transform: translate(-50%, -50%) translateY(40px); opacity: 0; }
}

@keyframes floater-crit-pop {
  0% { transform: translate(-50%, -50%) scale(0.6); opacity: 0; }
  20% { transform: translate(-50%, -50%) scale(1.2); opacity: 1; }
  60% { transform: translate(-50%, -50%) scale(1) translateY(-20px); opacity: 1; }
  100% { transform: translate(-50%, -50%) scale(1) translateY(-40px); opacity: 0; }
}

@keyframes floater-fade {
  0% { opacity: 0; }
  20% { opacity: 1; }
  100% { opacity: 0; }
}

.floater-reduced.floater-damage-out,
.floater-reduced.floater-crit,
.floater-reduced.floater-miss,
.floater-reduced.floater-damage-in,
.floater-reduced.floater-heal,
.floater-reduced.floater-magic {
  animation: floater-fade 0.25s ease-out forwards;
}

@media (prefers-reduced-motion: reduce) {
  .floater-damage-out,
  .floater-crit,
  .floater-miss,
  .floater-damage-in,
  .floater-heal,
  .floater-magic {
    animation: floater-fade 0.25s ease-out forwards;
  }
}
</style>
