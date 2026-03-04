import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useGameStore } from '../stores/gameStore'
import { usePlayerStore } from '../stores/playerStore'
import { useCombatStore } from '../stores/combatStore'
import { useStatsStore } from '../stores/statsStore'
import { serialize, deserialize, hasSaveGame, deleteSave, saveGame, loadGame } from '../engine/saveLoad'
import { SAVE_KEY, SAVE_VERSION } from '../types/save'

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
      localStorage.setItem(SAVE_KEY, JSON.stringify({ version: 999 }))
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
})
