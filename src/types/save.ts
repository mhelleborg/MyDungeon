import type { Player } from './character'
import type { Item } from './item'
import type { GameLogEntry } from './command'
import type { CombatEnemy } from './character'
import type { Companion } from './companion'
import type { GamePhase } from '../stores/gameStore'
import type { DifficultyLevel } from './difficulty'
import type { PlayerClass } from './character'
import type { BossPhase } from '../engine/handlers/bossHandler'

export const SAVE_VERSION = 1
export const SAVE_KEY = 'moria-save'

export interface SaveData {
  version: number
  timestamp: number

  // playerStore
  player: Player | null
  inventory: Item[]

  // gameStore
  phase: GamePhase
  difficulty: DifficultyLevel
  currentRoomId: string
  gameLog: GameLogEntry[]
  visitedRooms: string[]
  clearedRooms: string[]
  roomItems: Record<string, string[]>
  disarmedTraps: string[]
  hasLight: boolean
  lightTurnsRemaining: number
  permanentLight: boolean
  previousRoomId: string | null
  restedRooms: string[]
  interactedNPCs: string[]
  solvedPuzzles: string[]
  revealedExits: string[]
  destroyedTraps: string[]
  searchedInteractions: string[]
  roomLookCounts: Record<string, number>
  companions: Companion[]
  recruitableNPCsOffered: string[]

  // combatStore
  inCombat: boolean
  combatEnemies: CombatEnemy[]
  turnCount: number
  darkCombat: boolean
  bossPhase: BossPhase
  bossFallBack: boolean

  // statsStore (per-run only; achievements self-persist)
  statsStore: {
    roomsExplored: number
    totalRooms: number
    enemiesKilled: number
    damageDealt: number
    damageTaken: number
    itemsFound: number
    potionsUsed: number
    puzzlesSolved: number
    secretsFound: number
    sneakSuccesses: number
    fleeAttempts: number
    startTime: number
    playerClass: PlayerClass
    difficulty: DifficultyLevel
    balrogSlain: boolean
    foundItems: string[]
  }
}
