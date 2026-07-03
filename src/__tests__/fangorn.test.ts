import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useGameStore } from '../stores/gameStore'
import { usePlayerStore } from '../stores/playerStore'
import { useCombatStore } from '../stores/combatStore'

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
vi.mock('../engine/audio', () => ({ playSound: vi.fn(), initAudio: vi.fn() }))

describe('Fangorn Forest region', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    localStorageMock.clear()
  })

  function startGame(region = 'lothlorien') {
    const playerStore = usePlayerStore()
    playerStore.initPlayer('Tester', 'dwarf-warrior', 0, region)
    const gameStore = useGameStore()
    gameStore.phase = 'playing'
    gameStore.initGame(region)
    return gameStore
  }

  /** Force-clear whatever combat the current room started. */
  function forceClear(gameStore: ReturnType<typeof useGameStore>) {
    const combatStore = useCombatStore()
    combatStore.combatEnemies.forEach(e => { e.hp = 0 })
    combatStore.inCombat = false
    gameStore.markRoomCleared()
  }

  it('walking south from the farewell lawn enters Fangorn with banner and waypoint', () => {
    const gameStore = startGame()
    gameStore.enterRoom('farewell-lawn')
    expect(gameStore.currentRegionId).toBe('lothlorien')

    gameStore.handleCommand('south')
    expect(gameStore.currentRoomId).toBe('fangorn-eaves')
    expect(gameStore.currentRegionId).toBe('fangorn')

    const log = gameStore.gameLog.map(l => l.text).join('\n')
    expect(log).toContain('— Fangorn Forest —')
    expect(log).toContain('The Eaves of Fangorn is now a waypoint')
    // the once-only entry narration fires
    expect(gameStore.firedRoomEvents.has('fangorn-first-steps')).toBe(true)
  })

  it('walking back north returns to Lothlórien without a duplicate banner', () => {
    const gameStore = startGame()
    gameStore.enterRoom('farewell-lawn')
    gameStore.handleCommand('south')
    expect(gameStore.currentRegionId).toBe('fangorn')

    const logCount = gameStore.gameLog.length
    gameStore.handleCommand('north')
    expect(gameStore.currentRoomId).toBe('farewell-lawn')
    expect(gameStore.currentRegionId).toBe('lothlorien')

    // and south again — arrival banner must not repeat
    gameStore.handleCommand('south')
    expect(gameStore.currentRoomId).toBe('fangorn-eaves')
    expect(gameStore.currentRegionId).toBe('fangorn')
    const newLogs = gameStore.gameLog.slice(logCount).map(l => l.text).join('\n')
    expect(newLogs).not.toContain('— Fangorn Forest —')
  })

  it('the orc-cutting starts combat with Fangorn enemies', () => {
    const gameStore = startGame()
    gameStore.enterRoom('orc-cutting')

    const combatStore = useCombatStore()
    expect(combatStore.inCombat).toBe(true)
    expect(combatStore.combatEnemies.length).toBe(3)
    const ids = combatStore.combatEnemies.map(e => e.id)
    expect(ids).toContain('orc-firebrand')
    expect(ids).toContain('orc-fugitive')

    forceClear(gameStore)
    expect(combatStore.inCombat).toBe(false)
    expect(gameStore.clearedRooms.has('orc-cutting')).toBe(true)
  })

  it('Treebeard\'s cross-region quest runs from Wellinghall to Haldir in Lothlórien', async () => {
    const { useQuestStore } = await import('../stores/questStore')
    const gameStore = startGame()
    const questStore = useQuestStore()
    const playerStore = usePlayerStore()

    expect(questStore.questProgress['axes-at-the-eaves']).toBeUndefined()

    // Meet Treebeard — the quest (and his ent-draught gift) begins
    gameStore.enterRoom('wellinghall')
    gameStore.handleCommand('talk treebeard')
    expect(questStore.questProgress['axes-at-the-eaves']).toBeDefined()
    expect(questStore.questProgress['axes-at-the-eaves']!.stageIndex).toBe(0)
    expect(gameStore.gameLog.map(l => l.text).join('\n')).toContain('New quest: Axes at the Eaves')
    expect(playerStore.inventory.some(i => i.id === 'ent-draught')).toBe(true)

    // Stage 1: drive out the orcs — 'orc-*' prefix tallies kills
    for (let i = 0; i < 3; i++) questStore.questEvent('kill-enemy', 'orc-fugitive')
    expect(questStore.questProgress['axes-at-the-eaves']!.stageIndex).toBe(0)
    questStore.questEvent('kill-enemy', 'orc-firebrand')
    expect(questStore.questProgress['axes-at-the-eaves']!.stageIndex).toBe(1)

    // Stage 2: break the uruk warcamp
    gameStore.enterRoom('uruk-warcamp')
    expect(useCombatStore().inCombat).toBe(true)
    forceClear(gameStore)
    expect(questStore.questProgress['axes-at-the-eaves']!.stageIndex).toBe(2)

    // Stage 3: cross back into Lothlórien and warn Haldir
    const goldBefore = playerStore.player!.gold
    gameStore.enterRoom('forest-edge')
    expect(gameStore.currentRegionId).toBe('lothlorien')
    gameStore.handleCommand('talk haldir')
    expect(questStore.questProgress['axes-at-the-eaves']!.completed).toBe(true)
    expect(playerStore.player!.gold).toBe(goldBefore + 60)
    expect(gameStore.gameLog.map(l => l.text).join('\n')).toContain('Quest complete: Axes at the Eaves')
  })

  it('the warcamp\'s south exit is blocked until the camp is cleared', () => {
    const gameStore = startGame()
    gameStore.currentRoomId = 'uruk-warcamp'
    useCombatStore().inCombat = false

    gameStore.handleCommand('south')
    expect(gameStore.currentRoomId).toBe('uruk-warcamp')
    expect(gameStore.gameLog.map(l => l.text).join('\n'))
      .toContain('You will not pass while it stands')

    gameStore.clearedRooms.add('uruk-warcamp')
    gameStore.handleCommand('south')
    expect(gameStore.currentRoomId).toBe('fangorn-southern-eaves')
    expect(gameStore.currentRegionId).toBe('fangorn')
  })
})
