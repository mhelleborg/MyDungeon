import type { Room } from './room'
import type { Item } from './item'
import type { Enemy } from './character'
import type { NPC } from './npc'
import type { Choice } from './choice'
import type { Puzzle } from './puzzle'
import type { Encounter } from './encounter'
import type { RoomInteraction } from '../data/roomInteractions'
import type { GameLogEntry } from './command'

export type RegionId = string

/**
 * A self-contained area of the world — a dungeon, a forest, a settlement.
 * Regions bundle their rooms and all content keyed to them. Room ids must be
 * globally unique across regions; exits may point at rooms in other regions.
 */
export interface Region {
  id: RegionId
  name: string
  /** Room the player arrives in when starting in this region */
  entryRoomId: string
  /** Logged once, the first time the player sets foot in the region */
  arrivalLogs?: { text: string; logType: GameLogEntry['type'] }[]
  /** When set, the region is offered as a starting point on character select */
  startOption?: { label: string; desc: string }
  rooms: Record<string, Room>
  enemies?: Record<string, Enemy>
  items?: Record<string, Item>
  npcs?: Record<string, NPC>
  roomNPCs?: Record<string, string[]>
  choices?: Record<string, Choice>
  puzzles?: Record<string, Puzzle>
  roomPuzzles?: Record<string, string[]>
  encounters?: Encounter[]
  roomInteractions?: Record<string, RoomInteraction[]>
}
