<script setup lang="ts">
import { useStatsStore } from '../stores/statsStore'

const statsStore = useStatsStore()
</script>

<template>
  <div class="fixed top-4 right-4 z-50 flex flex-col gap-2">
    <div
      v-for="toast in statsStore.toastQueue"
      :key="toast.id"
      class="achievement-toast bg-moria-panel border border-moria-highlight/60 rounded-lg p-3 shadow-lg cursor-pointer min-w-[250px]"
      @click="statsStore.dismissToast(toast.id)"
    >
      <div class="flex items-center gap-2">
        <span class="text-moria-highlight font-bold text-lg w-7 text-center">{{ toast.icon }}</span>
        <div>
          <div class="text-moria-highlight text-xs font-bold tracking-wider">ACHIEVEMENT UNLOCKED</div>
          <div class="text-moria-text text-sm font-bold">{{ toast.name }}</div>
          <div class="text-moria-info text-xs">{{ toast.description }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.achievement-toast {
  animation: toast-slide-in 0.4s ease-out;
}

@keyframes toast-slide-in {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}
</style>
