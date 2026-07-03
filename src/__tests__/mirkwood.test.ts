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

describe('Mirkwood region', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    localStorageMock.clear()
  })

  function startGame(region = 'mirkwood') {
    const playerStore = usePlayerStore()
    playerStore.initPlayer('Tester', 'dwarf-warrior', 0, region)
    const gameStore = useGameStore()
    gameStore.phase = 'playing'
    gameStore.initGame(region)
    return gameStore
  }

  it('walking east from the Silverlode ford crosses the Anduin into Mirkwood', () => {
    const gameStore = startGame('lothlorien')
    gameStore.enterRoom('silver-river-ford')
    expect(gameStore.currentRegionId).toBe('lothlorien')

    gameStore.handleCommand('east')
    expect(gameStore.currentRoomId).toBe('anduin-crossing')
    expect(gameStore.currentRegionId).toBe('mirkwood')

    const log = gameStore.gameLog.map(l => l.text).join('\n')
    expect(log).toContain('— Mirkwood —')
    expect(log).toContain('The Anduin Crossing is now a waypoint')
  })

  it('walking back west returns to Lothlórien without repeating the banner', () => {
    const gameStore = startGame('lothlorien')
    gameStore.enterRoom('silver-river-ford')
    gameStore.handleCommand('east')
    expect(gameStore.currentRegionId).toBe('mirkwood')

    const logCount = gameStore.gameLog.length
    gameStore.handleCommand('west')
    expect(gameStore.currentRoomId).toBe('silver-river-ford')
    expect(gameStore.currentRegionId).toBe('lothlorien')

    // Crossing back east again must not re-fire the arrival banner
    gameStore.handleCommand('east')
    expect(gameStore.currentRoomId).toBe('anduin-crossing')
    const newLogs = gameStore.gameLog.slice(logCount).map(l => l.text).join('\n')
    expect(newLogs).not.toContain('— Mirkwood —')
  })

  it('the webbed aisles start combat with the spider brood', () => {
    const gameStore = startGame()
    gameStore.enterRoom('webbed-aisles')

    const combatStore = useCombatStore()
    expect(combatStore.inCombat).toBe(true)
    const ids = combatStore.combatEnemies.map(e => e.id)
    expect(ids).toContain('spider-lurker')
    expect(ids).toContain('mirkwood-spider')

    // Force-clear the room
    combatStore.combatEnemies.forEach(e => { e.hp = 0 })
    combatStore.inCombat = false
    gameStore.markRoomCleared()
    expect(gameStore.clearedRooms.has('webbed-aisles')).toBe(true)
  })

  it('the spider cull quest counts kills across the spider-* prefix', async () => {
    const { useQuestStore } = await import('../stores/questStore')
    const gameStore = startGame()
    const questStore = useQuestStore()

    gameStore.enterRoom('webbed-aisles')
    useCombatStore().combatEnemies.forEach(e => { e.hp = 0 })
    useCombatStore().inCombat = false
    expect(questStore.questProgress['webs-of-the-forest']).toBeDefined()

    questStore.questEvent('kill-enemy', 'spider-lurker')
    questStore.questEvent('kill-enemy', 'spider-weaver')
    questStore.questEvent('kill-enemy', 'spider-weaver')
    expect(questStore.questProgress['webs-of-the-forest']!.completed).toBe(false)
    questStore.questEvent('kill-enemy', 'spider-broodmother')
    expect(questStore.questProgress['webs-of-the-forest']!.completed).toBe(true)
  })

  it('carries the Elvenking\'s letter across the world to Erestor in Rivendell', async () => {
    const { useQuestStore } = await import('../stores/questStore')
    const gameStore = startGame()
    const questStore = useQuestStore()
    const playerStore = usePlayerStore()

    gameStore.enterRoom('elvenking-halls')
    expect(questStore.questProgress['letter-for-rivendell']).toBeDefined()
    expect(gameStore.gameLog.map(l => l.text).join('\n')).toContain('New quest: A Letter for Rivendell')

    gameStore.handleCommand('take letter')
    expect(playerStore.inventory.some(i => i.id === 'thranduil-letter')).toBe(true)
    expect(questStore.questProgress['letter-for-rivendell']!.stageIndex).toBe(1)

    // Cross the whole map: quest triggers are global across regions
    const goldBefore = playerStore.player!.gold
    gameStore.enterRoom('elrond-library')
    expect(gameStore.currentRegionId).toBe('rivendell')
    gameStore.handleCommand('talk erestor')

    expect(questStore.questProgress['letter-for-rivendell']!.completed).toBe(true)
    expect(playerStore.player!.gold).toBe(goldBefore + 75)
    expect(gameStore.gameLog.map(l => l.text).join('\n')).toContain('Quest complete: A Letter for Rivendell')
  })

  it('the enchanted stream leaves the player dazed with dream', () => {
    const gameStore = startGame()
    const playerStore = usePlayerStore()

    gameStore.enterRoom('enchanted-stream')
    expect(playerStore.player!.statusEffects.some(e => e.id === 'stunned')).toBe(true)
    const log = gameStore.gameLog.map(l => l.text).join('\n')
    expect(log).toContain('do not drink of the enchanted stream')
  })

  it('the broodmother blocks the way north until her hollow is cleared', () => {
    const gameStore = startGame()
    gameStore.currentRoomId = 'broodmother-lair'
    const combatStore = useCombatStore()
    combatStore.inCombat = false

    gameStore.handleCommand('north')
    expect(gameStore.currentRoomId).toBe('broodmother-lair')
    expect(gameStore.gameLog.map(l => l.text).join('\n')).toContain('Nothing leaves her hollow while she lives')

    gameStore.clearedRooms.add('broodmother-lair')
    gameStore.handleCommand('north')
    expect(gameStore.currentRoomId).toBe('forest-river-bank')
  })

  it('Galion trades potions and a woodland bow in the feast hall', () => {
    const gameStore = startGame()
    const playerStore = usePlayerStore()
    gameStore.enterRoom('elven-feast-hall')

    playerStore.player!.gold += 100
    gameStore.handleCommand('buy dorwinion')
    expect(playerStore.inventory.some(i => i.id === 'dorwinion-wine')).toBe(true)

    playerStore.addItem({ id: 'spider-silk', name: 'Spider-silk Hank', description: '', type: 'misc', value: 35 })
    const goldBefore = playerStore.player!.gold
    gameStore.handleCommand('sell spider-silk')
    expect(playerStore.player!.gold).toBe(goldBefore + 17)
  })
})
