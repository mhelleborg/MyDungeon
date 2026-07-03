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

describe('death handling (rise at last waypoint)', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    localStorageMock.clear()
    vi.clearAllMocks()
  })

  describe('checkDeath', () => {
    it('revives the player at the last waypoint at half HP', () => {
      const playerStore = setupPlayer(0)
      const gameStore = useGameStore()
      gameStore.phase = 'playing'
      gameStore.lastWaypointId = 'gates-of-moria'
      gameStore.currentRoomId = 'goblin-tunnels'

      const died = gameStore.checkDeath()

      expect(died).toBe(true)
      expect(gameStore.phase).toBe('playing')
      expect(gameStore.currentRoomId).toBe('gates-of-moria')
      expect(playerStore.player!.hp).toBe(Math.ceil(playerStore.player!.maxHp / 2))
    })

    it('takes a fifth of the player\'s gold', () => {
      const playerStore = setupPlayer(0)
      playerStore.player!.gold = 100
      const gameStore = useGameStore()
      gameStore.phase = 'playing'
      gameStore.lastWaypointId = 'gates-of-moria'

      gameStore.checkDeath()

      expect(playerStore.player!.gold).toBe(80)
    })

    it('does nothing when player is alive', () => {
      setupPlayer(10)
      const gameStore = useGameStore()
      gameStore.phase = 'playing'

      const died = gameStore.checkDeath()

      expect(died).toBe(false)
      expect(gameStore.phase).toBe('playing')
    })

    it('ends combat when the player falls', () => {
      setupPlayer(0)
      const gameStore = useGameStore()
      const combatStore = useCombatStore()
      gameStore.phase = 'playing'
      gameStore.lastWaypointId = 'gates-of-moria'
      combatStore.inCombat = true

      gameStore.checkDeath()

      expect(combatStore.inCombat).toBe(false)
      expect(gameStore.phase).toBe('playing')
    })

    it('keeps the save when the player falls', () => {
      setupPlayer(20)
      const gameStore = useGameStore()
      gameStore.phase = 'playing'
      gameStore.lastWaypointId = 'gates-of-moria'

      saveGame()
      expect(hasSaveGame()).toBe(true)

      const playerStore = usePlayerStore()
      playerStore.player!.hp = 0
      gameStore.checkDeath()

      expect(hasSaveGame()).toBe(true)
    })

    it('falls back to the region entry room with no waypoint visited', () => {
      setupPlayer(0)
      const gameStore = useGameStore()
      gameStore.phase = 'playing'
      gameStore.lastWaypointId = ''
      gameStore.currentRoomId = 'goblin-tunnels'

      gameStore.checkDeath()

      expect(gameStore.currentRoomId).toBe('gates-of-moria')
    })
  })

  describe('combat death via attack', () => {
    it('revives after a fatal enemy attack', () => {
      const playerStore = setupPlayer(1)
      const gameStore = useGameStore()
      const combatStore = useCombatStore()
      gameStore.phase = 'playing'
      gameStore.currentRoomId = 'goblin-tunnels'
      gameStore.lastWaypointId = 'gates-of-moria'

      combatStore.startCombat([{ enemyId: 'goblin', count: 1 }])
      expect(combatStore.inCombat).toBe(true)

      // Mock dice so player misses and enemy hits hard enough to kill
      vi.spyOn(Math, 'random').mockReturnValue(0) // roll 1 = miss for player, hit for enemy

      gameStore.handleCommand('attack')

      // If the enemy killed the player, they should have risen at the waypoint
      if (playerStore.player!.hp <= 0) {
        throw new Error('player should have been revived')
      }
      expect(gameStore.phase).toBe('playing')
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
