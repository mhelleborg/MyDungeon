import type { Player } from './character'
import type { Item } from './item'
import type { GameLogEntry } from './command'
import type { CombatEnemy } from './character'
import type { Companion } from './companion'
import type { GamePhase } from '../stores/gameStore'
import type { DifficultyLevel } from './difficulty'
import type { PlayerClass } from './character'
import type { BossPhase } from '../engine/handlers/bossHandler'
import type { ActiveEncounter } from './encounter'
import type { ActiveChoice } from './choice'

export const SAVE_VERSION = 2
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
  seenEncounters: string[]
  activeEncounter: ActiveEncounter | null
  activeChoice: ActiveChoice | null
  choicesMade: Record<string, string>
  choiceConsequences: Record<string, boolean>
  removedEnemies: Record<string, number>
  addedEnemies: Record<string, { enemyId: string; count: number }[]>

  // combatStore
  inCombat: boolean
  combatEnemies: CombatEnemy[]
  turnCount: number
  darkCombat: boolean
  bossPhase: BossPhase
  bossFallBack: boolean
  skipNextEnemyTurn: boolean

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
    choicesMadeCount: number
    mercyShown: boolean
  }
}
