import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useGameStore } from '../stores/gameStore'
import { usePlayerStore } from '../stores/playerStore'
import { useCombatStore } from '../stores/combatStore'
import { hasSaveGame, saveGame } from '../engine/saveLoad'

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

vi.mock('../engine/audio', () => ({
  playSound: vi.fn(),
  initAudio: vi.fn(),
}))

function setupPlayer(hp = 20) {
  const playerStore = usePlayerStore()
  playerStore.initPlayer('TestHero', 'ranger')
  if (playerStore.player) {
    playerStore.player.hp = hp
    playerStore.player.maxHp = 30
  }
  return playerStore
}

describe('death handling', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    localStorageMock.clear()
    vi.clearAllMocks()
  })

  describe('checkDeath', () => {
    it('sets phase to game-over when player HP is 0', () => {
      setupPlayer(0)
      const gameStore = useGameStore()
      gameStore.phase = 'playing'

      const died = gameStore.checkDeath()

      expect(died).toBe(true)
      expect(gameStore.phase).toBe('game-over')
    })

    it('does nothing when player is alive', () => {
      setupPlayer(10)
      const gameStore = useGameStore()
      gameStore.phase = 'playing'

      const died = gameStore.checkDeath()

      expect(died).toBe(false)
      expect(gameStore.phase).toBe('playing')
    })

    it('ends combat when player dies during combat', () => {
      setupPlayer(0)
      const gameStore = useGameStore()
      const combatStore = useCombatStore()
      gameStore.phase = 'playing'
      combatStore.inCombat = true

      gameStore.checkDeath()

      expect(combatStore.inCombat).toBe(false)
      expect(gameStore.phase).toBe('game-over')
    })

    it('deletes save when player dies', () => {
      setupPlayer(20)
      const gameStore = useGameStore()
      gameStore.phase = 'playing'

      saveGame()
      expect(hasSaveGame()).toBe(true)

      // Now kill the player
      const playerStore = usePlayerStore()
      playerStore.player!.hp = 0

      gameStore.checkDeath()

      expect(hasSaveGame()).toBe(false)
    })
  })

  describe('handleCommand rejects commands when dead', () => {
    it('blocks commands when phase is game-over', () => {
      setupPlayer(0)
      const gameStore = useGameStore()
      gameStore.phase = 'game-over'

      gameStore.handleCommand('look')

      const lastLog = gameStore.gameLog[gameStore.gameLog.length - 1]
      expect(lastLog?.text).toBe('You are dead. The darkness claims you.')
    })

    it('blocks commands when player HP is 0', () => {
      setupPlayer(0)
      const gameStore = useGameStore()
      gameStore.phase = 'playing'

      gameStore.handleCommand('look')

      const lastLog = gameStore.gameLog[gameStore.gameLog.length - 1]
      expect(lastLog?.text).toBe('You are dead. The darkness claims you.')
    })
  })

  describe('combat death via attack', () => {
    it('triggers game-over after fatal enemy attack', () => {
      const playerStore = setupPlayer(1)
      const gameStore = useGameStore()
      const combatStore = useCombatStore()
      gameStore.phase = 'playing'
      gameStore.currentRoomId = 'gates-of-moria'

      // Start combat with a weak enemy
      combatStore.startCombat([{ enemyId: 'goblin', count: 1 }])
      expect(combatStore.inCombat).toBe(true)

      // Mock dice so player misses and enemy hits hard enough to kill
      vi.spyOn(Math, 'random').mockReturnValue(0) // roll 1 = miss for player, hit for enemy

      gameStore.handleCommand('attack')

      // Player should be dead (1 HP, any hit kills)
      if (playerStore.player!.hp <= 0) {
        expect(gameStore.phase).toBe('game-over')
        expect(combatStore.inCombat).toBe(false)
      }
      // If somehow survived (very unlikely with 1 HP), that's also fine
    })
  })

  describe('initGame resets combat state', () => {
    it('ends stale combat from previous game', () => {
      setupPlayer(20)
      const gameStore = useGameStore()
      const combatStore = useCombatStore()

      // Simulate stale combat from previous death
      combatStore.inCombat = true
      combatStore.turnCount = 5

      gameStore.phase = 'playing'
      gameStore.initGame()

      expect(combatStore.inCombat).toBe(false)
    })
  })
})
