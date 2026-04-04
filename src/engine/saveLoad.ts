import type { SaveData } from '../types/save'
import { SAVE_VERSION, SAVE_KEY } from '../types/save'
import { useGameStore } from '../stores/gameStore'
import { usePlayerStore } from '../stores/playerStore'
import { useCombatStore } from '../stores/combatStore'
import { useStatsStore } from '../stores/statsStore'
import { roomNPCs } from '../data/npcs'
import type { BossPhase } from './handlers/bossHandler'

const MAX_LOG_ENTRIES = 200

function setToArray(s: Set<string>): string[] {
  return [...s]
}

function arrayToSet(a: string[]): Set<string> {
  return new Set(a)
}

export function serialize(): SaveData {
  const gameStore = useGameStore()
  const playerStore = usePlayerStore()
  const combatStore = useCombatStore()
  const statsStore = useStatsStore()

  return {
    version: SAVE_VERSION,
    timestamp: Date.now(),

    // playerStore
    player: playerStore.player ? JSON.parse(JSON.stringify(playerStore.player)) : null,
    inventory: JSON.parse(JSON.stringify(playerStore.inventory)),

    // gameStore
    phase: gameStore.phase,
    currentAct: gameStore.currentAct,
    difficulty: gameStore.difficulty,
    currentRoomId: gameStore.currentRoomId,
    gameLog: gameStore.gameLog.slice(-MAX_LOG_ENTRIES),
    visitedRooms: setToArray(gameStore.visitedRooms),
    clearedRooms: setToArray(gameStore.clearedRooms),
    roomItems: JSON.parse(JSON.stringify(gameStore.roomItems)),
    disarmedTraps: setToArray(gameStore.disarmedTraps),
    hasLight: gameStore.hasLight,
    lightTurnsRemaining: gameStore.lightTurnsRemaining,
    permanentLight: gameStore.permanentLight,
    previousRoomId: gameStore.previousRoomId,
    restedRooms: setToArray(gameStore.restedRooms),
    interactedNPCs: setToArray(gameStore.interactedNPCs),
    solvedPuzzles: setToArray(gameStore.solvedPuzzles),
    revealedExits: setToArray(gameStore.revealedExits),
    destroyedTraps: setToArray(gameStore.destroyedTraps),
    searchedInteractions: setToArray(gameStore.searchedInteractions),
    roomLookCounts: { ...gameStore.roomLookCounts },
    companions: JSON.parse(JSON.stringify(gameStore.companions)),
    recruitableNPCsOffered: setToArray(gameStore.recruitableNPCsOffered),
    seenEncounters: setToArray(gameStore.seenEncounters),
    activeEncounter: gameStore.activeEncounter ? JSON.parse(JSON.stringify(gameStore.activeEncounter)) : null,
    activeChoice: gameStore.activeChoice ? JSON.parse(JSON.stringify(gameStore.activeChoice)) : null,
    activeDialogue: gameStore.activeDialogue ? JSON.parse(JSON.stringify(gameStore.activeDialogue)) : null,
    nimrodelFragments: [...gameStore.nimrodelFragments],
    choicesMade: { ...gameStore.choicesMade },
    choiceConsequences: { ...gameStore.choiceConsequences },
    removedEnemies: { ...gameStore.removedEnemies },
    addedEnemies: JSON.parse(JSON.stringify(gameStore.addedEnemies)),

    // combatStore
    inCombat: combatStore.inCombat,
    combatEnemies: JSON.parse(JSON.stringify(combatStore.combatEnemies)),
    turnCount: combatStore.turnCount,
    darkCombat: combatStore.darkCombat,
    bossPhase: combatStore.bossPhase,
    bossFallBack: combatStore.bossFallBack,
    skipNextEnemyTurn: combatStore.skipNextEnemyTurn,

    // statsStore
    statsStore: {
      roomsExplored: statsStore.roomsExplored,
      totalRooms: statsStore.totalRooms,
      enemiesKilled: statsStore.enemiesKilled,
      damageDealt: statsStore.damageDealt,
      damageTaken: statsStore.damageTaken,
      itemsFound: statsStore.itemsFound,
      potionsUsed: statsStore.potionsUsed,
      puzzlesSolved: statsStore.puzzlesSolved,
      secretsFound: statsStore.secretsFound,
      sneakSuccesses: statsStore.sneakSuccesses,
      fleeAttempts: statsStore.fleeAttempts,
      startTime: statsStore.startTime,
      playerClass: statsStore.playerClass,
      difficulty: statsStore.difficulty,
      balrogSlain: statsStore.balrogSlain,
      foundItems: [...statsStore.foundItems],
      choicesMadeCount: statsStore.choicesMadeCount,
      mercyShown: statsStore.mercyShown,
    },
  }
}

export function deserialize(data: SaveData): void {
  const gameStore = useGameStore()
  const playerStore = usePlayerStore()
  const combatStore = useCombatStore()
  const statsStore = useStatsStore()

  // playerStore
  playerStore.player = data.player
  playerStore.inventory = data.inventory

  // gameStore
  gameStore.phase = data.phase
  gameStore.currentAct = data.currentAct ?? 'moria'
  gameStore.difficulty = data.difficulty
  gameStore.currentRoomId = data.currentRoomId
  gameStore.gameLog = data.gameLog
  gameStore.visitedRooms = arrayToSet(data.visitedRooms)
  gameStore.clearedRooms = arrayToSet(data.clearedRooms)
  gameStore.roomItems = data.roomItems
  gameStore.disarmedTraps = arrayToSet(data.disarmedTraps)
  gameStore.hasLight = data.hasLight
  gameStore.lightTurnsRemaining = data.lightTurnsRemaining
  gameStore.permanentLight = data.permanentLight
  gameStore.previousRoomId = data.previousRoomId
  gameStore.restedRooms = arrayToSet(data.restedRooms)
  gameStore.interactedNPCs = arrayToSet(data.interactedNPCs)
  gameStore.solvedPuzzles = arrayToSet(data.solvedPuzzles)
  gameStore.revealedExits = arrayToSet(data.revealedExits)
  gameStore.destroyedTraps = arrayToSet(data.destroyedTraps)
  gameStore.searchedInteractions = arrayToSet(data.searchedInteractions)
  gameStore.roomLookCounts = data.roomLookCounts
  gameStore.companions = data.companions
  gameStore.recruitableNPCsOffered = arrayToSet(data.recruitableNPCsOffered)
  gameStore.seenEncounters = arrayToSet(data.seenEncounters ?? [])
  gameStore.activeEncounter = data.activeEncounter ?? null
  gameStore.activeChoice = data.activeChoice ?? null
  gameStore.activeDialogue = data.activeDialogue ?? null
  gameStore.nimrodelFragments = new Set(data.nimrodelFragments ?? [])
  gameStore.choicesMade = data.choicesMade ?? {}
  gameStore.choiceConsequences = data.choiceConsequences ?? {}
  gameStore.removedEnemies = data.removedEnemies ?? {}
  gameStore.addedEnemies = data.addedEnemies ?? {}

  // combatStore
  combatStore.inCombat = data.inCombat
  combatStore.combatEnemies = data.combatEnemies
  combatStore.turnCount = data.turnCount
  combatStore.darkCombat = data.darkCombat
  combatStore.bossPhase = data.bossPhase as BossPhase
  combatStore.bossFallBack = data.bossFallBack
  combatStore.skipNextEnemyTurn = data.skipNextEnemyTurn ?? false

  // statsStore
  const ss = data.statsStore
  statsStore.roomsExplored = ss.roomsExplored
  statsStore.totalRooms = ss.totalRooms
  statsStore.enemiesKilled = ss.enemiesKilled
  statsStore.damageDealt = ss.damageDealt
  statsStore.damageTaken = ss.damageTaken
  statsStore.itemsFound = ss.itemsFound
  statsStore.potionsUsed = ss.potionsUsed
  statsStore.puzzlesSolved = ss.puzzlesSolved
  statsStore.secretsFound = ss.secretsFound
  statsStore.sneakSuccesses = ss.sneakSuccesses
  statsStore.fleeAttempts = ss.fleeAttempts
  statsStore.startTime = ss.startTime
  statsStore.playerClass = ss.playerClass
  statsStore.difficulty = ss.difficulty
  statsStore.balrogSlain = ss.balrogSlain
  statsStore.foundItems = ss.foundItems
  statsStore.choicesMadeCount = ss.choicesMadeCount ?? 0
  statsStore.mercyShown = ss.mercyShown ?? false

  // Re-splice recruited companions out of roomNPCs
  for (const comp of data.companions) {
    for (const [, npcIds] of Object.entries(roomNPCs)) {
      const idx = npcIds.indexOf(comp.id)
      if (idx !== -1) {
        npcIds.splice(idx, 1)
      }
    }
  }
}

export function saveGame(): boolean {
  try {
    const data = serialize()
    localStorage.setItem(SAVE_KEY, JSON.stringify(data))
    return true
  } catch {
    return false
  }
}

export function loadGame(): boolean {
  try {
    const raw = localStorage.getItem(SAVE_KEY)
    if (!raw) return false
    const data: SaveData = JSON.parse(raw)
    if (data.version !== SAVE_VERSION) return false
    deserialize(data)
    return true
  } catch {
    return false
  }
}

export function hasSaveGame(): boolean {
  try {
    const raw = localStorage.getItem(SAVE_KEY)
    if (!raw) return false
    const data = JSON.parse(raw)
    return data?.version === SAVE_VERSION
  } catch {
    return false
  }
}

export function getSaveTimestamp(): number | null {
  try {
    const raw = localStorage.getItem(SAVE_KEY)
    if (!raw) return null
    const data = JSON.parse(raw)
    return data?.timestamp ?? null
  } catch {
    return null
  }
}

export function deleteSave(): void {
  localStorage.removeItem(SAVE_KEY)
}
