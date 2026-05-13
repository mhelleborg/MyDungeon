<script setup lang="ts">
import FloatingNumber from './FloatingNumber.vue'
import { useFloaters } from '../composables/useFloaters'

const { floaters } = useFloaters()
</script>

<template>
  <div class="fixed inset-0 pointer-events-none z-50 overflow-hidden" aria-hidden="true">
    <FloatingNumber v-for="f in floaters" :key="f.id" :floater="f" />
  </div>
</template>
