<script setup lang="ts">
import { computed, reactive, watch } from 'vue'
import { useGameStore } from '../stores/gameStore'
import { world } from '../data/world'

const gameStore = useGameStore()

// Rooms of the current region only — each region has its own grid coordinate space
const regionRooms = computed(() => Object.values(world[gameStore.currentRegionId]?.rooms ?? {}))
const regionName = computed(() => world[gameStore.currentRegionId]?.name ?? 'MAP')

// Compute grid bounds for the current region
const bounds = computed(() => {
  const rooms = regionRooms.value
  return {
    minX: Math.min(...rooms.map(r => r.gridX)),
    maxX: Math.max(...rooms.map(r => r.gridX)),
    minY: Math.min(...rooms.map(r => r.gridY)),
    maxY: Math.max(...rooms.map(r => r.gridY)),
  }
})

// Track newly-discovered rooms for one-shot flash animation
const discoveredFlash = reactive<Set<string>>(new Set())
const prevVisited = new Set<string>(gameStore.visitedRooms)

watch(
  () => gameStore.visitedRooms.size,
  () => {
    for (const id of gameStore.visitedRooms) {
      if (!prevVisited.has(id)) {
        prevVisited.add(id)
        discoveredFlash.add(id)
        setTimeout(() => discoveredFlash.delete(id), 600)
      }
    }
  },
)

// Map roomId → trail opacity (most recent path entry gets highest opacity)
const trailOpacity = computed<Record<string, number>>(() => {
  const path = gameStore.recentPath
  const opacities = [0.3, 0.5, 0.7]
  const result: Record<string, number> = {}
  // Align so the tail (most recent) gets the highest opacity (0.7)
  const start = opacities.length - path.length
  for (let i = 0; i < path.length; i++) {
    const id = path[i]
    if (!id || id === gameStore.currentRoomId) continue
    const op = opacities[start + i]
    if (op !== undefined) result[id] = op
  }
  return result
})

const grid = computed(() => {
  const rows: {
    x: number
    y: number
    roomId: string | null
    visited: boolean
    current: boolean
    discovered: boolean
    trailOpacity: number | null
  }[][] = []

  const { minX, maxX, minY, maxY } = bounds.value
  for (let y = minY; y <= maxY; y++) {
    const row: typeof rows[0] = []
    for (let x = minX; x <= maxX; x++) {
      const room = regionRooms.value.find(r => r.gridX === x && r.gridY === y)
      const id = room?.id ?? null
      const trail = id != null ? trailOpacity.value[id] : undefined
      row.push({
        x, y,
        roomId: id,
        visited: id ? gameStore.visitedRooms.has(id) : false,
        current: id === gameStore.currentRoomId,
        discovered: id ? discoveredFlash.has(id) : false,
        trailOpacity: trail !== undefined ? trail : null,
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
    <div class="text-moria-info text-xs font-bold mb-2 uppercase">{{ regionName }}</div>
    <div class="flex flex-col gap-0.5">
      <div v-for="(row, ri) in grid" :key="ri" class="flex gap-0.5">
        <div
          v-for="cell in row"
          :key="`${cell.x}-${cell.y}`"
          class="w-5 h-5 flex items-center justify-center text-[10px] rounded-sm transition-opacity duration-300"
          :class="{
            'bg-moria-highlight text-moria-bg font-bold animate-map-current-pulse': cell.current,
            'bg-moria-highlight/30 text-moria-text': cell.trailOpacity !== null && !cell.current,
            'bg-moria-border/50 text-moria-text': cell.visited && !cell.current && cell.trailOpacity === null,
            'bg-transparent': !cell.roomId || (!cell.visited && !cell.current),
            'animate-map-discover': cell.discovered,
          }"
          :style="cell.trailOpacity !== null && !cell.current ? `opacity: ${cell.trailOpacity}` : ''"
        >
          <span v-if="cell.current">@</span>
          <span v-else-if="cell.visited">·</span>
        </div>
      </div>
    </div>
  </div>
</template>
