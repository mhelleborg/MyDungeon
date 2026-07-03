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

describe('Rohan & Edoras region', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    localStorageMock.clear()
  })

  function startGame(region = 'moria') {
    const playerStore = usePlayerStore()
    playerStore.initPlayer('Tester', 'dwarf-warrior', 0, region)
    const gameStore = useGameStore()
    gameStore.phase = 'playing'
    gameStore.initGame(region)
    return gameStore
  }

  /** Force-clear the current combat so the room counts as cleared. */
  function forceClearCombat(gameStore: ReturnType<typeof useGameStore>) {
    const combatStore = useCombatStore()
    combatStore.combatEnemies.forEach(e => { e.hp = 0 })
    combatStore.inCombat = false
    gameStore.markRoomCleared()
  }

  it('entering the Wold switches region, greets once, and discovers the waypoint', () => {
    const gameStore = startGame()
    gameStore.enterRoom('wold-road')

    expect(gameStore.currentRegionId).toBe('rohan')
    expect(gameStore.currentRegion?.name).toBe('Rohan & Edoras')
    const logText = gameStore.gameLog.map(l => l.text).join('\n')
    expect(logText).toContain('— Rohan, the Riddermark —')
    expect(logText).toContain('The Wold is now a waypoint')
    expect(gameStore.firedRoomEvents.has('entering-the-mark')).toBe(true)

    // Re-entering must not re-fire the arrival banner
    const logCount = gameStore.gameLog.length
    gameStore.enterRoom('eastemnet-plains')
    forceClearCombat(gameStore)
    gameStore.enterRoom('wold-road')
    const newLogs = gameStore.gameLog.slice(logCount).map(l => l.text).join('\n')
    expect(newLogs).not.toContain('— Rohan, the Riddermark —')
  })

  it('the Eastemnet ambush starts combat with warg-riders', () => {
    const gameStore = startGame()
    gameStore.enterRoom('wold-road')
    gameStore.enterRoom('eastemnet-plains')

    const combatStore = useCombatStore()
    expect(combatStore.inCombat).toBe(true)
    expect(combatStore.combatEnemies.length).toBe(2)
    expect(combatStore.combatEnemies[0]!.id).toBe('warg-rider')

    forceClearCombat(gameStore)
    expect(gameStore.clearedRooms.has('eastemnet-plains')).toBe(true)
  })

  it('the ride to Edoras advances through the doorward to the king\'s counsel', async () => {
    const { useQuestStore } = await import('../stores/questStore')
    const gameStore = startGame()
    const questStore = useQuestStore()
    const playerStore = usePlayerStore()

    gameStore.enterRoom('wold-road')
    expect(questStore.questProgress['riders-of-the-mark']).toBeDefined()
    expect(gameStore.gameLog.map(l => l.text).join('\n')).toContain('New quest: Riders of the Mark')

    gameStore.enterRoom('edoras-gates')
    expect(questStore.questProgress['riders-of-the-mark']!.stageIndex).toBe(1)

    gameStore.handleCommand('talk hama')
    expect(questStore.questProgress['riders-of-the-mark']!.stageIndex).toBe(2)

    const goldBefore = playerStore.player!.gold
    gameStore.enterRoom('winding-street')
    gameStore.enterRoom('meduseld')
    gameStore.handleCommand('talk theoden')

    expect(questStore.questProgress['riders-of-the-mark']!.completed).toBe(true)
    expect(playerStore.player!.gold).toBe(goldBefore + 50)
    // The king's gift on first counsel
    expect(playerStore.inventory.some(i => i.id === 'mead-of-the-mark')).toBe(true)
    // The Golden Hall's peace settles on the traveller
    expect(playerStore.player!.statusEffects.some(e => e.id === 'blessed')).toBe(true)
  })

  it('the cross-region warning quest completes by carrying word to Elrond in Rivendell', async () => {
    const { useQuestStore } = await import('../stores/questStore')
    const gameStore = startGame()
    const questStore = useQuestStore()
    const playerStore = usePlayerStore()

    gameStore.enterRoom('wold-road')
    gameStore.enterRoom('burned-homestead') // Dunlending raiders attack
    expect(questStore.questProgress['shadow-of-the-white-hand']).toBeDefined()
    forceClearCombat(gameStore)
    expect(questStore.questProgress['shadow-of-the-white-hand']!.stageIndex).toBe(0)

    gameStore.enterRoom('snowbourn-crossing') // the war-captain's guard attacks
    expect(useCombatStore().inCombat).toBe(true)
    expect(useCombatStore().combatEnemies.some(e => e.id === 'uruk-war-captain')).toBe(true)
    forceClearCombat(gameStore)
    expect(questStore.questProgress['shadow-of-the-white-hand']!.stageIndex).toBe(1)

    // Carry the warning north — quest triggers are global across regions
    const goldBefore = playerStore.player!.gold
    gameStore.enterRoom('last-homely-house')
    expect(gameStore.currentRegionId).toBe('rivendell')
    gameStore.handleCommand('talk elrond')

    expect(questStore.questProgress['shadow-of-the-white-hand']!.completed).toBe(true)
    expect(gameStore.gameLog.map(l => l.text).join('\n')).toContain('Quest complete: The Shadow of the White Hand')
    expect(playerStore.player!.gold).toBe(goldBefore + 75)
  })

  it('the fallen horn is borne back to the king', async () => {
    const { useQuestStore } = await import('../stores/questStore')
    const gameStore = startGame()
    const questStore = useQuestStore()
    const playerStore = usePlayerStore()

    gameStore.enterRoom('snowbourn-crossing')
    forceClearCombat(gameStore)
    gameStore.handleCommand('take horn')
    expect(playerStore.inventory.some(i => i.id === 'horn-of-the-mark')).toBe(true)
    expect(questStore.questProgress['the-lost-horn']).toBeDefined()

    gameStore.enterRoom('meduseld')
    gameStore.handleCommand('talk theoden')
    expect(questStore.questProgress['the-lost-horn']!.completed).toBe(true)
  })

  it('the war-captain blocks the road south until the crossing is cleared', () => {
    const gameStore = startGame()
    gameStore.currentRoomId = 'snowbourn-crossing'
    const combatStore = useCombatStore()
    combatStore.inCombat = false

    gameStore.handleCommand('south')
    expect(gameStore.currentRoomId).toBe('snowbourn-crossing')
    expect(gameStore.gameLog.map(l => l.text).join('\n')).toContain('The uruk war-captain bars the ford')

    gameStore.clearedRooms.add('snowbourn-crossing')
    gameStore.handleCommand('south')
    expect(gameStore.currentRoomId).toBe('edoras-road')
  })

  it('Eadric the smith sells the high-tier gear and buys salvage', () => {
    const gameStore = startGame()
    const playerStore = usePlayerStore()
    gameStore.enterRoom('edoras-smithy')

    playerStore.player!.gold = 300
    gameStore.handleCommand('buy rider')
    expect(playerStore.inventory.some(i => i.id === 'rider-mail')).toBe(true)
    expect(playerStore.player!.gold).toBe(160)

    gameStore.handleCommand('buy rohirric')
    expect(playerStore.inventory.some(i => i.id === 'rohirric-longsword')).toBe(true)
    expect(playerStore.player!.gold).toBe(40)

    playerStore.addItem({ id: 'warg-pelt', name: 'Warg Pelt', description: '', type: 'misc', value: 25 })
    gameStore.handleCommand('sell warg pelt')
    expect(playerStore.inventory.some(i => i.id === 'warg-pelt')).toBe(false)
    expect(playerStore.player!.gold).toBe(52)
  })
})
