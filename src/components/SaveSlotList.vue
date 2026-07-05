<script setup lang="ts">
import { ref, computed } from 'vue'
import type { SaveMetadata } from '../types/save'
import { SAVE_SLOT_COUNT } from '../types/save'
import { listSaveSlots, getActiveSlot } from '../engine/saveLoad'
import { playerClassNames } from '../types/character'

const props = defineProps<{
  /** 'load' disables empty slots; 'save' asks before overwriting a used one */
  mode: 'save' | 'load'
}>()

const emit = defineEmits<{
  (e: 'select', slot: number): void
}>()

const refreshKey = ref(0)
const slots = computed<(SaveMetadata | null)[]>(() => {
  void refreshKey.value
  return listSaveSlots()
})
const activeSlot = computed(() => {
  void refreshKey.value
  return getActiveSlot()
})
const confirmingSlot = ref<number | null>(null)

function refresh() {
  refreshKey.value++
  confirmingSlot.value = null
}

defineExpose({ refresh })

function classLabel(meta: SaveMetadata): string {
  return meta.playerClass ? playerClassNames[meta.playerClass] : 'Adventurer'
}

function formatDate(ts: number): string {
  return ts ? new Date(ts).toLocaleString() : ''
}

function pick(slot: number) {
  const meta = slots.value[slot - 1]
  if (props.mode === 'load') {
    if (!meta) return
    emit('select', slot)
    return
  }
  // Save mode: overwriting an existing save takes a second click
  if (meta && confirmingSlot.value !== slot) {
    confirmingSlot.value = slot
    return
  }
  confirmingSlot.value = null
  emit('select', slot)
}
</script>

<template>
  <div class="flex flex-col gap-2">
    <button
      v-for="slot in SAVE_SLOT_COUNT"
      :key="slot"
      @click="pick(slot)"
      :disabled="mode === 'load' && !slots[slot - 1]"
      class="w-full text-left border rounded px-3 py-2 transition-colors"
      :class="[
        mode === 'load' && !slots[slot - 1]
          ? 'border-moria-border/40 opacity-50 cursor-default'
          : 'cursor-pointer hover:border-moria-highlight hover:bg-moria-highlight/10',
        confirmingSlot === slot
          ? 'border-moria-danger bg-moria-danger/15'
          : 'border-moria-border',
      ]"
    >
      <div class="flex items-center justify-between mb-0.5">
        <span class="text-moria-info text-[10px] font-bold tracking-[0.2em]">
          SLOT {{ slot }}
          <span v-if="slots[slot - 1] && activeSlot === slot" class="text-moria-highlight/80 ml-1">&#9679; ACTIVE</span>
        </span>
        <span v-if="slots[slot - 1]" class="text-moria-info text-[10px]">{{ formatDate(slots[slot - 1]!.timestamp) }}</span>
      </div>

      <template v-if="slots[slot - 1]">
        <div class="text-moria-highlight text-sm font-bold">
          {{ slots[slot - 1]!.playerName }}
          <span class="text-moria-text font-normal">
            &mdash; Level {{ slots[slot - 1]!.level }} {{ classLabel(slots[slot - 1]!) }}
          </span>
        </div>
        <div class="text-moria-text text-xs mt-0.5">
          {{ slots[slot - 1]!.regionName }} &mdash; {{ slots[slot - 1]!.roomName }}
        </div>
        <div class="text-moria-info text-[11px] mt-0.5">
          HP {{ slots[slot - 1]!.hp }}/{{ slots[slot - 1]!.maxHp }}
          &middot; {{ slots[slot - 1]!.roomsExplored }}/{{ slots[slot - 1]!.totalRooms }} rooms
          &middot; {{ slots[slot - 1]!.difficulty }}
        </div>
        <div v-if="confirmingSlot === slot" class="text-moria-danger text-[11px] font-bold mt-1">
          OVERWRITE THIS SAVE? CLICK AGAIN TO CONFIRM
        </div>
      </template>
      <div v-else class="text-moria-info text-sm italic">
        {{ mode === 'save' ? 'Empty slot — save here' : 'Empty slot' }}
      </div>
    </button>
  </div>
</template>
