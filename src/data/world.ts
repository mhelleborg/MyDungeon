import type { Region, RegionId } from '../types/region'
import type { Room } from '../types/room'
import { rooms as moriaRooms, STARTING_ROOM } from './rooms'
import { items as moriaItems } from './items'
import { enemies as moriaEnemies } from './enemies'
import { npcs as moriaNPCs, roomNPCs as moriaRoomNPCs } from './npcs'
import { choices as moriaChoices } from './choices'
import { puzzles as moriaPuzzles, roomPuzzles as moriaRoomPuzzles } from './puzzles'
import { encounters as moriaEncounters } from './encounters'
import { roomInteractions as moriaRoomInteractions } from './roomInteractions'
import { lothlorienRooms, lothlorienRoomInteractions } from './lothlorienRooms'
import { lothlorienItems } from './lothlorienItems'
import { lothlorienEnemies } from './lothlorienEnemies'
import { lothlorienNPCs, lothlorienRoomNPCs } from './lothlorienNPCs'
import { lothlorienChoices } from './lothlorienChoices'
import { lothlorienPuzzles, lothlorienRoomPuzzles } from './lothlorienPuzzles'
import { lothlorienEncounters } from './lothlorienEncounters'

export const DEFAULT_REGION: RegionId = 'moria'

export const world: Record<RegionId, Region> = {
  moria: {
    id: 'moria',
    name: 'The Mines of Moria',
    entryRoomId: STARTING_ROOM,
    startOption: { label: 'Mines of Moria (Act I)', desc: 'Begin at the West-gate. The full journey through the dark.' },
    rooms: moriaRooms,
    enemies: moriaEnemies,
    items: moriaItems,
    npcs: moriaNPCs,
    roomNPCs: moriaRoomNPCs,
    choices: moriaChoices,
    puzzles: moriaPuzzles,
    roomPuzzles: moriaRoomPuzzles,
    encounters: moriaEncounters,
    roomInteractions: moriaRoomInteractions,
  },
  lothlorien: {
    id: 'lothlorien',
    name: 'Lothlórien',
    entryRoomId: 'dimrill-dale',
    arrivalLogs: [
      { text: '— Lothlórien —', logType: 'system' },
      { text: 'You leave the darkness of Moria behind. The world opens before you in golden light.', logType: 'narrative' },
    ],
    startOption: { label: 'Lothlórien (Act II)', desc: 'Skip Moria. Start in Dimrill Dale, level-boosted with Moria\'s spoils.' },
    rooms: lothlorienRooms,
    enemies: lothlorienEnemies,
    items: lothlorienItems,
    npcs: lothlorienNPCs,
    roomNPCs: lothlorienRoomNPCs,
    choices: lothlorienChoices,
    puzzles: lothlorienPuzzles,
    roomPuzzles: lothlorienRoomPuzzles,
    encounters: lothlorienEncounters,
    roomInteractions: lothlorienRoomInteractions,
  },
}

// Room-id → region-id index; also enforces global room-id uniqueness.
const roomRegionIndex: Record<string, RegionId> = {}
for (const region of Object.values(world)) {
  for (const roomId of Object.keys(region.rooms)) {
    if (roomRegionIndex[roomId]) {
      throw new Error(`Duplicate room id "${roomId}" in regions "${roomRegionIndex[roomId]}" and "${region.id}"`)
    }
    roomRegionIndex[roomId] = region.id
  }
}

export function getRegion(id: RegionId): Region | undefined {
  return world[id]
}

export function regionOfRoom(roomId: string): RegionId | undefined {
  return roomRegionIndex[roomId]
}

export function findRoom(roomId: string): Room | undefined {
  const regionId = roomRegionIndex[roomId]
  return regionId ? world[regionId]!.rooms[roomId] : undefined
}

export function totalRoomCount(): number {
  return Object.keys(roomRegionIndex).length
}

// ── Aggregated lookups across all regions ────────────────────
function mergeRecords<T>(pick: (r: Region) => Record<string, T> | undefined): Record<string, T> {
  const out: Record<string, T> = {}
  for (const region of Object.values(world)) Object.assign(out, pick(region))
  return out
}

export const itemDb = mergeRecords(r => r.items)
export const enemyDb = mergeRecords(r => r.enemies)
export const allNPCs = mergeRecords(r => r.npcs)
export const allRoomNPCs = mergeRecords(r => r.roomNPCs)
export const allChoices = mergeRecords(r => r.choices)
export const allPuzzles = mergeRecords(r => r.puzzles)
export const allRoomPuzzles = mergeRecords(r => r.roomPuzzles)
export const allRoomInteractions = mergeRecords(r => r.roomInteractions)
export const encounterPool = Object.values(world).flatMap(r => r.encounters ?? [])
