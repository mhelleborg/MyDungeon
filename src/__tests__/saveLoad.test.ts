import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useGameStore } from '../stores/gameStore'
import { usePlayerStore } from '../stores/playerStore'
import { useCombatStore } from '../stores/combatStore'
import { useStatsStore } from '../stores/statsStore'
import {
  serialize,
  deserialize,
  hasSaveGame,
  deleteSave,
  saveGame,
  loadGame,
  migrateSave,
  getSaveMetadata,
  listSaveSlots,
  getMostRecentSlot,
  firstEmptySlot,
  getActiveSlot,
  setActiveSlot,
} from '../engine/saveLoad'
import { LEGACY_SAVE_KEY, SAVE_VERSION, saveSlotKey } from '../types/save'

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {}
  return {
    getItem: vi.fn((key: string) => store[key] ?? null),
    setItem: vi.fn((key: string, value: string) => { store[key] = value }),
    removeItem: vi.fn((key: string) => { delete store[key] }),
    clear: vi.fn(() => { store = {} }),
  }
})()

Object.defineProperty(globalThis, 'localStorage', { value: localStorageMock })

// Mock audio to avoid errors
vi.mock('../engine/audio', () => ({
  playSound: vi.fn(),
  initAudio: vi.fn(),
}))

describe('saveLoad', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    localStorageMock.clear()
    vi.clearAllMocks()
  })

  describe('serialize / deserialize round-trip', () => {
    it('preserves gameStore state through round-trip', () => {
      const gameStore = useGameStore()
      gameStore.currentRoomId = 'second-hall'
      gameStore.visitedRooms = new Set(['gates-of-moria', 'second-hall'])
      gameStore.clearedRooms = new Set(['gates-of-moria'])
      gameStore.disarmedTraps = new Set(['entrance-hall'])
      gameStore.hasLight = true
      gameStore.lightTurnsRemaining = 5
      gameStore.roomLookCounts = { 'gates-of-moria': 2 }

      const data = serialize()

      // Reset
      setActivePinia(createPinia())
      const gameStore2 = useGameStore()

      deserialize(data)

      expect(gameStore2.currentRoomId).toBe('second-hall')
      expect(gameStore2.visitedRooms).toEqual(new Set(['gates-of-moria', 'second-hall']))
      expect(gameStore2.clearedRooms).toEqual(new Set(['gates-of-moria']))
      expect(gameStore2.disarmedTraps).toEqual(new Set(['entrance-hall']))
      expect(gameStore2.hasLight).toBe(true)
      expect(gameStore2.lightTurnsRemaining).toBe(5)
      expect(gameStore2.roomLookCounts).toEqual({ 'gates-of-moria': 2 })
    })

    it('preserves playerStore state through round-trip', () => {
      const playerStore = usePlayerStore()
      playerStore.initPlayer('Gandalf', 'wizard')

      const data = serialize()

      setActivePinia(createPinia())
      const playerStore2 = usePlayerStore()

      deserialize(data)

      expect(playerStore2.player?.name).toBe('Gandalf')
      expect(playerStore2.player?.class).toBe('wizard')
      expect(playerStore2.inventory.length).toBeGreaterThan(0)
    })

    it('preserves combatStore state through round-trip', () => {
      const combatStore = useCombatStore()
      combatStore.inCombat = true
      combatStore.turnCount = 3
      combatStore.darkCombat = true

      const data = serialize()

      setActivePinia(createPinia())
      const combatStore2 = useCombatStore()

      deserialize(data)

      expect(combatStore2.inCombat).toBe(true)
      expect(combatStore2.turnCount).toBe(3)
      expect(combatStore2.darkCombat).toBe(true)
    })

    it('preserves statsStore state through round-trip', () => {
      const statsStore = useStatsStore()
      statsStore.roomsExplored = 5
      statsStore.enemiesKilled = 10
      statsStore.balrogSlain = true

      const data = serialize()

      setActivePinia(createPinia())
      const statsStore2 = useStatsStore()

      deserialize(data)

      expect(statsStore2.roomsExplored).toBe(5)
      expect(statsStore2.enemiesKilled).toBe(10)
      expect(statsStore2.balrogSlain).toBe(true)
    })
  })

  describe('Set ↔ array conversion', () => {
    it('converts Sets to arrays in serialized data', () => {
      const gameStore = useGameStore()
      gameStore.visitedRooms = new Set(['a', 'b', 'c'])
      gameStore.solvedPuzzles = new Set(['p1'])

      const data = serialize()

      expect(Array.isArray(data.visitedRooms)).toBe(true)
      expect(data.visitedRooms).toContain('a')
      expect(data.visitedRooms).toContain('b')
      expect(data.visitedRooms).toContain('c')
      expect(Array.isArray(data.solvedPuzzles)).toBe(true)
      expect(data.solvedPuzzles).toContain('p1')
    })

    it('restores arrays back to Sets on deserialize', () => {
      const data = serialize()
      data.visitedRooms = ['x', 'y']
      data.clearedRooms = ['z']

      setActivePinia(createPinia())
      const gameStore = useGameStore()

      deserialize(data)

      expect(gameStore.visitedRooms).toBeInstanceOf(Set)
      expect(gameStore.visitedRooms.has('x')).toBe(true)
      expect(gameStore.visitedRooms.has('y')).toBe(true)
      expect(gameStore.clearedRooms).toBeInstanceOf(Set)
      expect(gameStore.clearedRooms.has('z')).toBe(true)
    })
  })

  describe('hasSaveGame', () => {
    it('returns false when no save exists', () => {
      expect(hasSaveGame()).toBe(false)
    })

    it('returns true after saving', () => {
      saveGame()
      expect(hasSaveGame()).toBe(true)
    })

    it('returns false for wrong version', () => {
      localStorage.setItem(saveSlotKey(1), JSON.stringify({ version: 999 }))
      expect(hasSaveGame()).toBe(false)
    })
  })

  describe('deleteSave', () => {
    it('removes the save from localStorage', () => {
      saveGame()
      expect(hasSaveGame()).toBe(true)
      deleteSave()
      expect(hasSaveGame()).toBe(false)
    })
  })

  describe('saveGame / loadGame', () => {
    it('round-trips through localStorage', () => {
      const gameStore = useGameStore()
      gameStore.currentRoomId = 'bridge-of-khazad-dum'
      gameStore.visitedRooms = new Set(['gates-of-moria', 'bridge-of-khazad-dum'])

      expect(saveGame()).toBe(true)

      setActivePinia(createPinia())
      const gameStore2 = useGameStore()

      expect(loadGame()).toBe(true)
      expect(gameStore2.currentRoomId).toBe('bridge-of-khazad-dum')
      expect(gameStore2.visitedRooms.has('bridge-of-khazad-dum')).toBe(true)
    })

    it('loadGame returns false when no save exists', () => {
      expect(loadGame()).toBe(false)
    })
  })

  describe('migrateSave', () => {
    it('returns current-version saves unchanged', () => {
      const data = serialize()
      expect(migrateSave(data as unknown as Record<string, unknown>)).toEqual(data)
    })

    it('migrates v3 saves: currentAct becomes currentRegionId', () => {
      const v3 = { ...serialize(), version: 3, currentAct: 'lothlorien' } as Record<string, unknown>
      delete v3.currentRegionId
      delete v3.firedRoomEvents

      const migrated = migrateSave(v3)
      expect(migrated).not.toBeNull()
      expect(migrated!.version).toBe(SAVE_VERSION)
      expect(migrated!.currentRegionId).toBe('lothlorien')
      expect((migrated as unknown as Record<string, unknown>).currentAct).toBeUndefined()
    })

    it('marks the Moria crossing as fired for v3 saves that reached the east-gate', () => {
      const v3 = { ...serialize(), version: 3, currentAct: 'moria', visitedRooms: ['gates-of-moria', 'east-gate'] } as Record<string, unknown>
      const migrated = migrateSave(v3)
      expect(migrated!.firedRoomEvents).toContain('moria-crossed')
    })

    it('rejects unknown versions', () => {
      expect(migrateSave({ version: 1 })).toBeNull()
      expect(migrateSave({ version: 999 })).toBeNull()
    })

    it('migrates v4 saves: adds quests, perks and last waypoint', () => {
      const playerStore = usePlayerStore()
      playerStore.initPlayer('Gimli', 'dwarf-warrior')
      playerStore.player!.level = 5
      const v4 = { ...serialize(), version: 4 } as Record<string, unknown>
      delete v4.questProgress
      delete v4.lastWaypointId
      ;(v4.player as { perks?: string[] }).perks = undefined

      const migrated = migrateSave(v4)!
      expect(migrated.version).toBe(SAVE_VERSION)
      expect(migrated.questProgress).toEqual({})
      expect(migrated.lastWaypointId).toBe('gates-of-moria')
      expect(migrated.player!.perks).toEqual(expect.arrayContaining(['stone-skin', 'battle-fury']))
    })

    it('loadGame accepts a v3 save via migration', () => {
      const gameStore = useGameStore()
      gameStore.currentRoomId = 'dimrill-dale'
      const v3 = { ...serialize(), version: 3, currentAct: 'lothlorien' } as Record<string, unknown>
      delete v3.currentRegionId
      localStorage.setItem(LEGACY_SAVE_KEY, JSON.stringify(v3))

      setActivePinia(createPinia())
      const gameStore2 = useGameStore()

      expect(loadGame()).toBe(true)
      expect(gameStore2.currentRegionId).toBe('lothlorien')
      expect(gameStore2.currentRoomId).toBe('dimrill-dale')
    })
  })

  describe('victory keeps the world open', () => {
    it('serializes a victory phase as playing so the run can continue', () => {
      const gameStore = useGameStore()
      gameStore.phase = 'victory'
      const data = serialize()
      expect(data.phase).toBe('playing')
    })
  })

  describe('gameLog truncation', () => {
    it('truncates gameLog to 200 entries on serialize', () => {
      const gameStore = useGameStore()
      for (let i = 0; i < 300; i++) {
        gameStore.gameLog.push({ text: `Log ${i}`, type: 'info', timestamp: i })
      }

      const data = serialize()
      expect(data.gameLog.length).toBe(200)
      // Should keep the last 200
      expect(data.gameLog[0]!.text).toBe('Log 100')
      expect(data.gameLog[199]!.text).toBe('Log 299')
    })
  })

  describe('save slots', () => {
    it('defaults to slot 1 as the active slot', () => {
      expect(getActiveSlot()).toBe(1)
    })

    it('keeps saves in different slots independent', () => {
      const gameStore = useGameStore()
      gameStore.currentRoomId = 'gates-of-moria'
      expect(saveGame(1)).toBe(true)

      gameStore.currentRoomId = 'second-hall'
      expect(saveGame(2)).toBe(true)

      setActivePinia(createPinia())
      expect(loadGame(1)).toBe(true)
      expect(useGameStore().currentRoomId).toBe('gates-of-moria')

      setActivePinia(createPinia())
      expect(loadGame(2)).toBe(true)
      expect(useGameStore().currentRoomId).toBe('second-hall')
    })

    it('tracks the active slot through save and load', () => {
      saveGame(2)
      expect(getActiveSlot()).toBe(2)

      saveGame(3)
      expect(getActiveSlot()).toBe(3)

      loadGame(2)
      expect(getActiveSlot()).toBe(2)
    })

    it('auto-saves land in the active slot', () => {
      setActiveSlot(3)
      expect(saveGame()).toBe(true)
      expect(localStorage.getItem(saveSlotKey(3))).not.toBeNull()
      expect(localStorage.getItem(saveSlotKey(1))).toBeNull()
    })

    it('rejects out-of-range slots', () => {
      expect(saveGame(0)).toBe(false)
      expect(saveGame(99)).toBe(false)
      expect(loadGame(99)).toBe(false)
      expect(hasSaveGame(99)).toBe(false)
    })

    it('deleteSave only clears the given slot', () => {
      saveGame(1)
      saveGame(2)
      deleteSave(1)
      expect(hasSaveGame(1)).toBe(false)
      expect(hasSaveGame(2)).toBe(true)
      expect(hasSaveGame()).toBe(true)
    })

    it('firstEmptySlot skips occupied slots', () => {
      expect(firstEmptySlot()).toBe(1)
      saveGame(1)
      expect(firstEmptySlot()).toBe(2)
      saveGame(2)
      saveGame(3)
      expect(firstEmptySlot()).toBeNull()
    })

    it('getMostRecentSlot picks the newest save', () => {
      saveGame(1)
      const raw = localStorage.getItem(saveSlotKey(1))!
      const newer = { ...JSON.parse(raw), timestamp: Date.now() + 60_000 }
      localStorage.setItem(saveSlotKey(3), JSON.stringify(newer))

      expect(getMostRecentSlot()).toBe(3)
    })

    it('getMostRecentSlot returns null with no saves', () => {
      expect(getMostRecentSlot()).toBeNull()
    })
  })

  describe('legacy save migration', () => {
    it('moves a pre-slot save into slot 1', () => {
      const data = serialize()
      localStorage.setItem(LEGACY_SAVE_KEY, JSON.stringify(data))

      expect(hasSaveGame(1)).toBe(true)
      expect(localStorage.getItem(LEGACY_SAVE_KEY)).toBeNull()
      expect(getActiveSlot()).toBe(1)
    })

    it('moves a pre-slot save into the first empty slot when slot 1 is taken', () => {
      saveGame(1)
      const legacy = { ...serialize(), timestamp: 12345 }
      localStorage.setItem(LEGACY_SAVE_KEY, JSON.stringify(legacy))

      expect(hasSaveGame(2)).toBe(true)
      expect(localStorage.getItem(LEGACY_SAVE_KEY)).toBeNull()
      const meta = getSaveMetadata(2)
      expect(meta!.timestamp).toBe(12345)
    })

    it('keeps the legacy save when all slots are full', () => {
      saveGame(1)
      saveGame(2)
      saveGame(3)
      localStorage.setItem(LEGACY_SAVE_KEY, JSON.stringify(serialize()))

      expect(hasSaveGame()).toBe(true)
      expect(localStorage.getItem(LEGACY_SAVE_KEY)).not.toBeNull()
    })
  })

  describe('save metadata', () => {
    it('returns null for empty slots', () => {
      expect(getSaveMetadata(1)).toBeNull()
    })

    it('exposes player and location metadata for a save', () => {
      const playerStore = usePlayerStore()
      playerStore.initPlayer('Aragorn', 'ranger')
      playerStore.player!.level = 4
      const gameStore = useGameStore()
      gameStore.currentRegionId = 'moria'
      gameStore.currentRoomId = 'second-hall'
      gameStore.difficulty = 'hard'
      const statsStore = useStatsStore()
      statsStore.roomsExplored = 7

      saveGame(2)
      const meta = getSaveMetadata(2)!

      expect(meta.slot).toBe(2)
      expect(meta.playerName).toBe('Aragorn')
      expect(meta.playerClass).toBe('ranger')
      expect(meta.level).toBe(4)
      expect(meta.hp).toBe(playerStore.player!.hp)
      expect(meta.maxHp).toBe(playerStore.player!.maxHp)
      expect(meta.regionName).toBe('The Mines of Moria')
      expect(meta.roomName).not.toBe('second-hall') // resolved to display name
      expect(meta.roomName.length).toBeGreaterThan(0)
      expect(meta.difficulty).toBe('hard')
      expect(meta.roomsExplored).toBe(7)
      expect(meta.timestamp).toBeGreaterThan(0)
    })

    it('derives metadata from migrated legacy saves', () => {
      const playerStore = usePlayerStore()
      playerStore.initPlayer('Gimli', 'dwarf-warrior')
      const v3 = { ...serialize(), version: 3, currentAct: 'moria' } as Record<string, unknown>
      delete v3.currentRegionId
      localStorage.setItem(LEGACY_SAVE_KEY, JSON.stringify(v3))

      const meta = getSaveMetadata(1)!
      expect(meta.playerName).toBe('Gimli')
      expect(meta.playerClass).toBe('dwarf-warrior')
      expect(meta.regionName).toBe('The Mines of Moria')
    })

    it('listSaveSlots reports every slot in order', () => {
      saveGame(2)
      const slots = listSaveSlots()
      expect(slots).toHaveLength(3)
      expect(slots[0]).toBeNull()
      expect(slots[1]).not.toBeNull()
      expect(slots[2]).toBeNull()
    })
  })
})
