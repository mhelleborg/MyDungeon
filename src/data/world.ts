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
import { moriaQuests, lothlorienQuests } from './quests'
import {
  rivendellRooms,
  rivendellEnemies,
  rivendellItems,
  rivendellNPCs,
  rivendellRoomNPCs,
  rivendellQuests,
} from './rivendell'
import {
  fangornRooms,
  fangornEnemies,
  fangornItems,
  fangornNPCs,
  fangornRoomNPCs,
  fangornQuests,
} from './fangorn'
import {
  rohanRooms,
  rohanEnemies,
  rohanItems,
  rohanNPCs,
  rohanRoomNPCs,
  rohanQuests,
} from './rohan'
import {
  mirkwoodRooms,
  mirkwoodEnemies,
  mirkwoodItems,
  mirkwoodNPCs,
  mirkwoodRoomNPCs,
  mirkwoodQuests,
} from './mirkwood'

export const DEFAULT_REGION: RegionId = 'moria'

export const world: Record<RegionId, Region> = {
  rivendell: {
    id: 'rivendell',
    name: 'Rivendell & Eriador',
    entryRoomId: 'rivendell-courtyard',
    arrivalLogs: [
      { text: '— Rivendell —', logType: 'system' },
      { text: 'The hidden valley opens below you, loud with waterfalls and quiet with peace. You have reached Imladris, the Last Homely House east of the Sea.', logType: 'narrative' },
    ],
    startOption: { label: 'Rivendell (Prologue)', desc: 'Begin in the Last Homely House. Gear up, take counsel, and walk the wild road to Moria\'s West-gate.' },
    mapPosition: { x: 300, y: 120 },
    travelFlavor: [
      'You take the old road through the Trollshaws, keeping to the daylight and the high ground.',
      'The known paths of Eriador carry you swiftly, the Misty Mountains standing sentinel at your shoulder.',
    ],
    roadAmbush: [
      { enemyId: 'wild-wolf', count: 2 },
    ],
    rooms: rivendellRooms,
    enemies: rivendellEnemies,
    items: rivendellItems,
    npcs: rivendellNPCs,
    roomNPCs: rivendellRoomNPCs,
    quests: rivendellQuests,
  },
  moria: {
    id: 'moria',
    name: 'The Mines of Moria',
    entryRoomId: STARTING_ROOM,
    arrivalLogs: [
      { text: '— The Mines of Moria —', logType: 'system' },
      { text: 'The long dark of Khazad-dûm swallows the daylight behind you. Somewhere far below, something is aware that the doors have opened.', logType: 'narrative' },
    ],
    startOption: { label: 'Mines of Moria (Act I)', desc: 'Begin at the West-gate. The full journey through the dark.' },
    mapPosition: { x: 390, y: 300 },
    travelFlavor: [
      'You pass once more into the silence of Khazad-dûm, keeping to halls and stairways you have learned to trust.',
      'Your footsteps echo in the great dark, but the ways are known to you now, and the shadows hold fewer surprises.',
    ],
    roadAmbush: [
      { enemyId: 'goblin', count: 2 },
    ],
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
    quests: moriaQuests,
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
    mapPosition: { x: 585, y: 390 },
    travelFlavor: [
      'You follow the Silverlode beneath the golden eaves, along elven paths that open before those who have walked them.',
      'Mallorn leaves drift down around you as you travel the known roads of the Golden Wood.',
    ],
    roadAmbush: [
      { enemyId: 'orc-scout', count: 2 },
    ],
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
    quests: lothlorienQuests,
  },
  fangorn: {
    id: 'fangorn',
    name: 'Fangorn Forest',
    entryRoomId: 'fangorn-eaves',
    arrivalLogs: [
      { text: '— Fangorn Forest —', logType: 'system' },
      { text: 'The oldest forest of Middle-earth closes over you, dim and watchful. The trees here remember axes — tread softly, and cut no living wood.', logType: 'narrative' },
    ],
    mapPosition: { x: 500, y: 520 },
    travelFlavor: [
      'You keep to the mossy aisles beneath the huorn-dark trees, walking softly, and the forest — grudgingly — lets you pass.',
      'The great root-roads of Fangorn carry you on your way, and unseen boughs creak overhead like a slow conversation about you.',
    ],
    roadAmbush: [
      { enemyId: 'orc-fugitive', count: 2 },
    ],
    rooms: fangornRooms,
    enemies: fangornEnemies,
    items: fangornItems,
    npcs: fangornNPCs,
    roomNPCs: fangornRoomNPCs,
    quests: fangornQuests,
  },
  rohan: {
    id: 'rohan',
    name: 'Rohan & Edoras',
    entryRoomId: 'wold-road',
    arrivalLogs: [
      { text: '— Rohan, the Riddermark —', logType: 'system' },
      { text: 'The land of the Horse-lords opens before you, grass to the horizon under an enormous sky. Far south, beneath the White Mountains, a roof of gold catches the sun.', logType: 'narrative' },
    ],
    mapPosition: { x: 380, y: 590 },
    travelFlavor: [
      'You ride the green leagues of the Riddermark, keeping to the beaten road and the open ground where nothing can come at you unseen.',
      'The wind of the Mark is at your back, and the grass bows in long waves before you as you go.',
    ],
    roadAmbush: [
      { enemyId: 'warg-rider', count: 1 },
    ],
    rooms: rohanRooms,
    enemies: rohanEnemies,
    items: rohanItems,
    npcs: rohanNPCs,
    roomNPCs: rohanRoomNPCs,
    quests: rohanQuests,
  },
  mirkwood: {
    id: 'mirkwood',
    name: 'Mirkwood',
    entryRoomId: 'anduin-crossing',
    arrivalLogs: [
      { text: '— Mirkwood —', logType: 'system' },
      { text: 'The Great River lies behind you, and before you the eaves of Mirkwood rise like a wall of standing night. The trees lean close, and listen. Keep to the path.', logType: 'narrative' },
    ],
    mapPosition: { x: 760, y: 150 },
    travelFlavor: [
      'You keep to the elf-path beneath the black boughs, and do not stray, and do not drink of the stream.',
      'The darkness of the forest presses close on either hand, but the old road holds true beneath your feet.',
    ],
    roadAmbush: [
      { enemyId: 'spider-lurker', count: 2 },
    ],
    rooms: mirkwoodRooms,
    enemies: mirkwoodEnemies,
    items: mirkwoodItems,
    npcs: mirkwoodNPCs,
    roomNPCs: mirkwoodRoomNPCs,
    quests: mirkwoodQuests,
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
export const allQuests = mergeRecords(r => r.quests)
export const encounterPool = Object.values(world).flatMap(r => r.encounters ?? [])
