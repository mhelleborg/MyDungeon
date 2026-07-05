import type { SaveData, SaveMetadata } from '../types/save'
import { SAVE_VERSION, LEGACY_SAVE_KEY, ACTIVE_SLOT_KEY, SAVE_SLOT_COUNT, saveSlotKey } from '../types/save'
import { useGameStore } from '../stores/gameStore'
import { usePlayerStore } from '../stores/playerStore'
import { useCombatStore } from '../stores/combatStore'
import { useStatsStore } from '../stores/statsStore'
import { useQuestStore } from '../stores/questStore'
import { allRoomNPCs, getRegion, findRoom } from '../data/world'
import { unlockPerksAtLevel } from './perks'
import type { Player } from '../types/character'
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
    // A finished run stays playable — the world remains open after victory
    phase: gameStore.phase === 'victory' ? 'playing' : gameStore.phase,
    currentRegionId: gameStore.currentRegionId,
    difficulty: gameStore.difficulty,
    currentRoomId: gameStore.currentRoomId,
    gameLog: gameStore.gameLog.slice(-MAX_LOG_ENTRIES),
    visitedRooms: setToArray(gameStore.visitedRooms),
    recentPath: [...gameStore.recentPath],
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
    firedRoomEvents: setToArray(gameStore.firedRoomEvents),
    lastWaypointId: gameStore.lastWaypointId,
    choicesMade: { ...gameStore.choicesMade },

    // questStore
    questProgress: JSON.parse(JSON.stringify(useQuestStore().questProgress)),
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
  gameStore.currentRegionId = data.currentRegionId ?? 'moria'
  gameStore.difficulty = data.difficulty
  gameStore.currentRoomId = data.currentRoomId
  gameStore.gameLog = data.gameLog
  gameStore.visitedRooms = arrayToSet(data.visitedRooms)
  gameStore.recentPath = data.recentPath ?? []
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
  gameStore.firedRoomEvents = new Set(data.firedRoomEvents ?? [])
  gameStore.lastWaypointId = data.lastWaypointId ?? ''
  gameStore.choicesMade = data.choicesMade ?? {}

  // questStore
  useQuestStore().questProgress = data.questProgress ?? {}
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

  // Re-splice recruited companions out of room NPC lists
  for (const comp of data.companions) {
    for (const [, npcIds] of Object.entries(allRoomNPCs)) {
      const idx = npcIds.indexOf(comp.id)
      if (idx !== -1) {
        npcIds.splice(idx, 1)
      }
    }
  }
}

/**
 * Migrate an older save to the current SAVE_VERSION, one version step at
 * a time. Returns null when the save is too old (or too new) to migrate.
 */
export function migrateSave(data: Record<string, unknown>): SaveData | null {
  if (typeof data.version !== 'number' || data.version < 3 || data.version > SAVE_VERSION) return null
  const migrated = { ...data }

  if (migrated.version === 3) {
    // v3 → v4: acts became regions; once-only room events are now tracked
    const firedRoomEvents: string[] = []
    if (Array.isArray(migrated.visitedRooms) && migrated.visitedRooms.includes('east-gate')) {
      firedRoomEvents.push('moria-crossed')
    }
    migrated.currentRegionId = (migrated.currentAct as string) ?? 'moria'
    migrated.firedRoomEvents = firedRoomEvents
    delete migrated.currentAct
    migrated.version = 4
  }

  if (migrated.version === 4) {
    // v4 → v5: quests, class perks, and the last-waypoint refuge
    migrated.questProgress = {}
    migrated.lastWaypointId = migrated.currentRegionId === 'lothlorien' ? 'dimrill-dale' : 'gates-of-moria'
    const player = migrated.player as Player | null
    if (player) {
      player.perks = player.perks ?? []
      for (let lvl = 1; lvl <= player.level; lvl++) {
        unlockPerksAtLevel(player, lvl)
      }
    }
    migrated.version = 5
  }

  return migrated as unknown as SaveData
}

/**
 * Move a pre-slot save (single `moria-save` key) into the first empty slot.
 * The legacy key is only removed once the copy has landed, so a failure
 * here can never lose the save.
 */
function migrateLegacySave(): void {
  try {
    const raw = localStorage.getItem(LEGACY_SAVE_KEY)
    if (!raw) return
    for (let slot = 1; slot <= SAVE_SLOT_COUNT; slot++) {
      if (!localStorage.getItem(saveSlotKey(slot))) {
        localStorage.setItem(saveSlotKey(slot), raw)
        if (!localStorage.getItem(ACTIVE_SLOT_KEY)) setActiveSlot(slot)
        localStorage.removeItem(LEGACY_SAVE_KEY)
        return
      }
    }
  } catch {
    // Leave the legacy save in place for a later attempt
  }
}

function isValidSlot(slot: number): boolean {
  return Number.isInteger(slot) && slot >= 1 && slot <= SAVE_SLOT_COUNT
}

/** The slot the running game reads and (auto-)saves to */
export function getActiveSlot(): number {
  try {
    const slot = Number(localStorage.getItem(ACTIVE_SLOT_KEY))
    return isValidSlot(slot) ? slot : 1
  } catch {
    return 1
  }
}

export function setActiveSlot(slot: number): void {
  if (!isValidSlot(slot)) return
  try {
    localStorage.setItem(ACTIVE_SLOT_KEY, String(slot))
  } catch {
    // Non-fatal: the game falls back to slot 1
  }
}

function readSlot(slot: number): string | null {
  migrateLegacySave()
  if (!isValidSlot(slot)) return null
  return localStorage.getItem(saveSlotKey(slot))
}

export function saveGame(slot: number = getActiveSlot()): boolean {
  if (!isValidSlot(slot)) return false
  try {
    migrateLegacySave()
    const data = serialize()
    localStorage.setItem(saveSlotKey(slot), JSON.stringify(data))
    setActiveSlot(slot)
    return true
  } catch {
    return false
  }
}

export function loadGame(slot: number = getActiveSlot()): boolean {
  try {
    const raw = readSlot(slot)
    if (!raw) return false
    const data = migrateSave(JSON.parse(raw))
    if (!data) return false
    deserialize(data)
    setActiveSlot(slot)
    return true
  } catch {
    return false
  }
}

/** With a slot: does that slot hold a loadable save? Without: does any? */
export function hasSaveGame(slot?: number): boolean {
  if (slot !== undefined) {
    try {
      const raw = readSlot(slot)
      if (!raw) return false
      return migrateSave(JSON.parse(raw)) !== null
    } catch {
      return false
    }
  }
  for (let s = 1; s <= SAVE_SLOT_COUNT; s++) {
    if (hasSaveGame(s)) return true
  }
  return false
}

/**
 * Summarize the save in a slot for display: who the player is, where they
 * are, and when it was saved. Returns null for empty or unreadable slots.
 */
export function getSaveMetadata(slot: number): SaveMetadata | null {
  try {
    const raw = readSlot(slot)
    if (!raw) return null
    const data = migrateSave(JSON.parse(raw))
    if (!data) return null
    const region = getRegion(data.currentRegionId)
    const room = findRoom(data.currentRoomId)
    return {
      slot,
      timestamp: data.timestamp ?? 0,
      playerName: data.player?.name ?? 'Unknown adventurer',
      playerClass: data.player?.class ?? null,
      level: data.player?.level ?? 1,
      hp: data.player?.hp ?? 0,
      maxHp: data.player?.maxHp ?? 0,
      regionName: region?.name ?? data.currentRegionId,
      roomName: room?.name ?? data.currentRoomId,
      difficulty: data.difficulty,
      roomsExplored: data.statsStore?.roomsExplored ?? 0,
      totalRooms: data.statsStore?.totalRooms ?? 0,
    }
  } catch {
    return null
  }
}

/** Metadata for every slot, index 0 = slot 1; null where empty/unreadable */
export function listSaveSlots(): (SaveMetadata | null)[] {
  return Array.from({ length: SAVE_SLOT_COUNT }, (_, i) => getSaveMetadata(i + 1))
}

/** The slot with the newest save, or null when there are no saves at all */
export function getMostRecentSlot(): number | null {
  let best: number | null = null
  let bestTime = -1
  for (const meta of listSaveSlots()) {
    if (meta && meta.timestamp > bestTime) {
      best = meta.slot
      bestTime = meta.timestamp
    }
  }
  return best
}

/** First empty slot, or null when all slots are occupied */
export function firstEmptySlot(): number | null {
  const slots = listSaveSlots()
  const idx = slots.findIndex(meta => meta === null)
  return idx === -1 ? null : idx + 1
}

export function deleteSave(slot: number = getActiveSlot()): void {
  if (!isValidSlot(slot)) return
  localStorage.removeItem(saveSlotKey(slot))
}
