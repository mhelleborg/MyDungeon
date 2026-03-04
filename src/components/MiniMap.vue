<script setup lang="ts">
import { computed } from 'vue'
import { useGameStore } from '../stores/gameStore'
import { rooms } from '../data/rooms'

const gameStore = useGameStore()

// Compute grid bounds
const allRooms = Object.values(rooms)
const minX = Math.min(...allRooms.map(r => r.gridX))
const maxX = Math.max(...allRooms.map(r => r.gridX))
const minY = Math.min(...allRooms.map(r => r.gridY))
const maxY = Math.max(...allRooms.map(r => r.gridY))

const grid = computed(() => {
  const rows: { x: number; y: number; roomId: string | null; visited: boolean; current: boolean }[][] = []

  for (let y = minY; y <= maxY; y++) {
    const row: typeof rows[0] = []
    for (let x = minX; x <= maxX; x++) {
      const room = allRooms.find(r => r.gridX === x && r.gridY === y)
      row.push({
        x, y,
        roomId: room?.id || null,
        visited: room ? gameStore.visitedRooms.has(room.id) : false,
        current: room?.id === gameStore.currentRoomId,
      })
    }
    rows.push(row)
  }

  // Low gridY = north = top of map display
  return rows
})
</script>

<template>
  <div class="p-3 border border-moria-border rounded bg-moria-panel/50">
    <div class="text-moria-info text-xs font-bold mb-2">MAP</div>
    <div class="flex flex-col gap-0.5">
      <div v-for="(row, ri) in grid" :key="ri" class="flex gap-0.5">
        <div
          v-for="cell in row"
          :key="`${cell.x}-${cell.y}`"
          class="w-5 h-5 flex items-center justify-center text-[10px] rounded-sm"
          :class="{
            'bg-moria-highlight text-moria-bg font-bold': cell.current,
            'bg-moria-border/50 text-moria-text': cell.visited && !cell.current,
            'bg-transparent': !cell.roomId || (!cell.visited && !cell.current),
          }"
        >
          <span v-if="cell.current">@</span>
          <span v-else-if="cell.visited">·</span>
        </div>
      </div>
    </div>
  </div>
</template>
