<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import type { CombatEnemy } from '../types/character'

const props = defineProps<{
  enemy: CombatEnemy
}>()

const emit = defineEmits<{
  examine: [name: string]
}>()

const hpPercent = computed(() => Math.max(0, (props.enemy.hp / props.enemy.maxHp) * 100))

const barColor = computed(() => {
  if (hpPercent.value > 60) return 'bg-moria-success'
  if (hpPercent.value > 30) return 'bg-amber-500'
  return 'bg-moria-danger'
})

const pulsing = computed(() => hpPercent.value > 0 && hpPercent.value < 30)

// Threat tier based on maxHp
const threatClass = computed(() => {
  const hp = props.enemy.maxHp
  if (hp <= 10) return 'text-moria-info'
  if (hp <= 25) return 'text-moria-text'
  if (hp <= 60) return 'text-amber-400'
  return 'text-red-400'
})

const threatTag = computed(() => {
  if (props.enemy.maxHp > 60) return null // Boss uses BossHealthBar
  if (props.enemy.maxHp > 25) return 'ELITE'
  return null
})

// Hit animation
const isHit = ref(false)
watch(() => props.enemy.hp, (newHp, oldHp) => {
  if (oldHp !== undefined && newHp < oldHp && newHp > 0) {
    isHit.value = true
    setTimeout(() => { isHit.value = false }, 300)
  }
})

// Death animation
const isDying = computed(() => props.enemy.hp <= 0)
</script>

<template>
  <div
    class="py-1 px-2 rounded transition-all duration-200"
    :class="{
      'enemy-hit': isHit,
      'enemy-dying': isDying,
    }"
  >
    <div class="flex items-center gap-2 text-sm">
      <button
        @click="emit('examine', enemy.name)"
        class="underline decoration-current/40 hover:decoration-current cursor-pointer transition-colors font-bold"
        :class="threatClass"
      >{{ enemy.name }}</button>
      <span v-if="threatTag" class="text-[10px] font-bold px-1 rounded bg-amber-400/20 text-amber-400">{{ threatTag }}</span>
      <span class="text-moria-info text-xs ml-auto font-mono">{{ enemy.hp }}/{{ enemy.maxHp }}</span>
    </div>
    <div class="w-full h-1.5 bg-moria-bg rounded overflow-hidden mt-0.5">
      <div
        :class="[barColor, { 'animate-enemy-pulse': pulsing }]"
        class="h-full transition-all duration-300 rounded"
        :style="{ width: hpPercent + '%' }"
      ></div>
    </div>
    <div class="text-[10px] text-moria-info/60 mt-0.5">
      AC {{ enemy.ac }} | DMG {{ enemy.damage }}
    </div>
  </div>
</template>

<style scoped>
.enemy-hit {
  animation: enemy-hit-flash 0.3s ease-out;
}

.enemy-dying {
  animation: enemy-death 0.5s ease-out forwards;
}

@keyframes enemy-hit-flash {
  0% { background-color: rgba(192, 57, 43, 0.4); transform: translateX(-2px); }
  25% { transform: translateX(2px); }
  50% { transform: translateX(-1px); }
  75% { transform: translateX(1px); }
  100% { background-color: transparent; transform: translateX(0); }
}

@keyframes enemy-death {
  0% { opacity: 1; transform: translateY(0); }
  100% { opacity: 0; transform: translateY(8px); }
}

.animate-enemy-pulse {
  animation: enemy-bar-pulse 0.8s ease-in-out infinite alternate;
}

@keyframes enemy-bar-pulse {
  from { opacity: 0.6; }
  to { opacity: 1; }
}
</style>
