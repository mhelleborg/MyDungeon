<script setup lang="ts">
defineProps<{
  title: string
}>()

const emit = defineEmits<{
  close: []
}>()
</script>

<template>
  <div class="fixed inset-0 z-50 flex flex-col justify-end" role="dialog" aria-modal="true" :aria-label="title">
    <div class="absolute inset-0 bg-black/60" @click="emit('close')"></div>
    <div
      class="relative bg-moria-panel border-t border-moria-border rounded-t-2xl shadow-2xl
             max-h-[72dvh] flex flex-col animate-sheet-up pb-[env(safe-area-inset-bottom)]"
    >
      <div class="flex items-center justify-between px-4 pt-2 pb-1.5 shrink-0">
        <div class="absolute left-1/2 -translate-x-1/2 top-1.5 w-9 h-1 rounded-full bg-moria-border"></div>
        <span class="text-moria-highlight font-bold tracking-widest text-xs mt-2">{{ title }}</span>
        <button
          @click="emit('close')"
          class="text-moria-info hover:text-moria-highlight text-lg leading-none min-w-[44px] min-h-[44px] -mr-2 cursor-pointer"
          aria-label="Close"
        >✕</button>
      </div>
      <div class="overflow-y-auto overscroll-contain px-3 pb-3">
        <slot />
      </div>
    </div>
  </div>
</template>
