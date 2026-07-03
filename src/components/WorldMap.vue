<script setup lang="ts">
import { computed, ref } from 'vue'
import { useGameStore } from '../stores/gameStore'
import { world } from '../data/world'
import { futureRegions, mapRoutes } from '../data/worldMap'
import { listDiscoveredWaypoints } from '../engine/handlers/travelHandler'
import type { RegionId } from '../types/region'

const gameStore = useGameStore()

const discoveredRegions = computed(() =>
  Object.values(world).filter(r =>
    [...gameStore.visitedRooms].some(roomId => r.rooms[roomId]),
  ),
)

const waypoints = computed(() =>
  listDiscoveredWaypoints(Object.values(world), gameStore.visitedRooms as Set<string>),
)

const selectedRegionId = ref<RegionId>(gameStore.currentRegionId)
const selectedRegion = computed(() => world[selectedRegionId.value])
const selectedWaypoints = computed(() =>
  waypoints.value.filter(w => w.regionId === selectedRegionId.value),
)

function exploredCount(regionId: RegionId): { visited: number; total: number } {
  const region = world[regionId]
  if (!region) return { visited: 0, total: 0 }
  const roomIds = Object.keys(region.rooms)
  return {
    visited: roomIds.filter(id => gameStore.visitedRooms.has(id)).length,
    total: roomIds.length,
  }
}

// Node position lookup across real and future regions
function nodePos(id: string): { x: number; y: number } | null {
  const region = world[id]
  if (region?.mapPosition) return region.mapPosition
  const future = futureRegions.find(f => f.id === id)
  return future ? future.mapPosition : null
}

const routes = computed(() =>
  mapRoutes
    .map(r => {
      const from = nodePos(r.from)
      const to = nodePos(r.to)
      if (!from || !to) return null
      // Future routes only show once their real endpoint is discovered
      const anchored = discoveredRegions.value.some(reg => reg.id === r.from || reg.id === r.to)
      if (!anchored) return null
      return { ...r, x1: from.x, y1: from.y, x2: to.x, y2: to.y }
    })
    .filter((r): r is NonNullable<typeof r> => r !== null),
)

const visibleRegionNodes = computed(() =>
  discoveredRegions.value
    .filter(r => r.mapPosition)
    .map(r => ({
      id: r.id,
      name: r.name,
      x: r.mapPosition!.x,
      y: r.mapPosition!.y,
      current: r.id === gameStore.currentRegionId,
      explored: exploredCount(r.id),
    })),
)

// Real regions the player has not yet set foot in — shown as mysteries
const undiscoveredRegionNodes = computed(() =>
  Object.values(world)
    .filter(r => r.mapPosition && !discoveredRegions.value.some(d => d.id === r.id))
    .map(r => ({ id: r.id, x: r.mapPosition!.x, y: r.mapPosition!.y })),
)

function selectRegion(id: RegionId) {
  selectedRegionId.value = id
}

function travelTo(label: string) {
  gameStore.worldMapOpen = false
  gameStore.handleCommand(`travel ${label}`)
}

function close() {
  gameStore.worldMapOpen = false
}
</script>

<template>
  <div class="fixed inset-0 bg-black/85 z-50 flex items-center justify-center p-2 sm:p-6 overflow-y-auto" @click.self="close">
    <div class="w-full max-w-4xl bg-moria-panel border border-moria-border rounded shadow-2xl my-auto">
      <!-- Header -->
      <div class="flex items-center justify-between px-4 py-2.5 border-b border-moria-border">
        <div>
          <span class="text-moria-highlight font-bold tracking-[0.25em] text-sm sm:text-base">MIDDLE-EARTH</span>
          <span class="text-moria-info text-xs ml-3 hidden sm:inline">The world so far</span>
        </div>
        <button
          @click="close"
          class="text-moria-info hover:text-moria-highlight text-xl leading-none px-2 py-1 cursor-pointer"
          aria-label="Close map"
        >✕</button>
      </div>

      <!-- Map -->
      <svg viewBox="0 0 1000 640" class="w-full block select-none" role="img" aria-label="World map">
        <!-- Parchment vignette -->
        <defs>
          <radialGradient id="wm-vignette" cx="50%" cy="45%" r="75%">
            <stop offset="0%" stop-color="#171208" />
            <stop offset="100%" stop-color="#0a0908" />
          </radialGradient>
        </defs>
        <rect x="0" y="0" width="1000" height="640" fill="url(#wm-vignette)" />

        <!-- Terrain: the Misty Mountains -->
        <g stroke="#3d3528" stroke-width="2" fill="none" opacity="0.7">
          <path v-for="i in 9" :key="`mt-${i}`"
            :d="`M ${398 + (i % 3) * 26} ${50 + i * 52} l 14 -18 l 14 18`" />
        </g>
        <!-- Terrain: the Anduin river -->
        <path
          d="M 660 0 C 650 120, 690 220, 665 320 C 640 420, 680 540, 660 640"
          stroke="#2b3a3d" stroke-width="4" fill="none" opacity="0.8"
        />
        <!-- Terrain: forests -->
        <g fill="#22301f" opacity="0.8">
          <circle v-for="(c, i) in [[600,370],[620,395],[585,405],[540,530],[515,545],[560,545],[790,150],[770,180],[815,175],[795,205]]"
            :key="`f-${i}`" :cx="c[0]" :cy="c[1]" r="11" />
        </g>

        <!-- Routes -->
        <line
          v-for="(r, i) in routes" :key="`r-${i}`"
          :x1="r.x1" :y1="r.y1" :x2="r.x2" :y2="r.y2"
          :stroke="r.future ? '#3d3528' : '#d4a843'"
          :stroke-dasharray="r.future ? '3 9' : '7 7'"
          :opacity="r.future ? 0.6 : 0.75"
          stroke-width="2.5"
        />

        <!-- Future region teasers -->
        <g v-for="f in futureRegions" :key="f.id" opacity="0.55">
          <circle :cx="f.mapPosition.x" :cy="f.mapPosition.y" r="9" fill="#141210" stroke="#3d3528" stroke-width="2" />
          <text :x="f.mapPosition.x" :y="f.mapPosition.y - 18" text-anchor="middle" fill="#7f8c8d" font-size="17" class="wm-name">{{ f.name }}</text>
          <text :x="f.mapPosition.x" :y="f.mapPosition.y + 28" text-anchor="middle" fill="#5a5347" font-size="12" font-style="italic">the road is not yet open</text>
        </g>

        <!-- Real but undiscovered regions: the road leads somewhere... -->
        <g v-for="u in undiscoveredRegionNodes" :key="u.id" opacity="0.7">
          <circle :cx="u.x" :cy="u.y" r="12" fill="#141210" stroke="#d4a843" stroke-width="1.5" stroke-dasharray="3 3" />
          <text :x="u.x" :y="u.y + 6" text-anchor="middle" fill="#d4a843" font-size="16" font-weight="bold">?</text>
          <text :x="u.x" :y="u.y + 32" text-anchor="middle" fill="#7f8c8d" font-size="12" font-style="italic">the road leads on</text>
        </g>

        <!-- Discovered regions -->
        <g
          v-for="n in visibleRegionNodes" :key="n.id"
          class="cursor-pointer"
          role="button"
          :aria-label="`Select ${n.name}`"
          @click="selectRegion(n.id)"
        >
          <circle v-if="n.current" :cx="n.x" :cy="n.y" r="24" fill="none" stroke="#d4a843" stroke-width="2" class="wm-pulse" />
          <circle
            :cx="n.x" :cy="n.y" r="14"
            :fill="selectedRegionId === n.id ? '#d4a843' : '#1a1510'"
            stroke="#d4a843" stroke-width="2.5"
          />
          <text :x="n.x" :y="n.y - 26" text-anchor="middle" fill="#d4a843" font-size="21" font-weight="bold" class="wm-name">{{ n.name }}</text>
          <text :x="n.x" :y="n.y + 36" text-anchor="middle" fill="#c4b89a" font-size="13">{{ n.explored.visited }}/{{ n.explored.total }} explored</text>
          <text v-if="n.current" :x="n.x" :y="n.y + 54" text-anchor="middle" fill="#d4a843" font-size="13" font-style="italic">— you are here —</text>
        </g>
      </svg>

      <!-- Waypoint panel -->
      <div class="border-t border-moria-border px-4 py-3">
        <div class="text-moria-info text-xs mb-2">
          <span class="text-moria-highlight font-bold">{{ selectedRegion?.name ?? 'Unknown lands' }}</span>
          — travel to a known waypoint:
        </div>
        <div class="flex flex-wrap gap-2">
          <button
            v-for="w in selectedWaypoints"
            :key="w.roomId"
            :disabled="w.roomId === gameStore.currentRoomId"
            @click="travelTo(w.label)"
            class="px-3 py-2 border rounded text-xs sm:text-sm min-h-[40px] transition-colors"
            :class="w.roomId === gameStore.currentRoomId
              ? 'border-moria-border text-moria-info cursor-default opacity-60'
              : 'border-moria-highlight/60 text-moria-highlight hover:bg-moria-highlight hover:text-moria-bg cursor-pointer'"
          >
            {{ w.label }}<span v-if="w.roomId === gameStore.currentRoomId" class="ml-1">(here)</span>
          </button>
          <span v-if="selectedWaypoints.length === 0" class="text-moria-info text-xs italic py-2">
            No waypoints discovered in this land yet — landmarks reveal themselves to those who walk there.
          </span>
        </div>
        <div class="text-moria-info/70 text-[11px] mt-3 italic">
          Travel is possible from any safe place — but the roads of Middle-earth are seldom empty.
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.wm-name {
  font-family: 'Courier New', monospace;
  letter-spacing: 0.08em;
}
.wm-pulse {
  animation: wm-pulse 2s ease-in-out infinite;
  transform-origin: center;
}
@keyframes wm-pulse {
  0%, 100% { opacity: 0.25; }
  50% { opacity: 0.9; }
}
@media (prefers-reduced-motion: reduce) {
  .wm-pulse { animation: none; }
}
</style>
