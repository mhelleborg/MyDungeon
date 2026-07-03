import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useGameStore } from '../stores/gameStore'
import { usePlayerStore } from '../stores/playerStore'
import { useCombatStore } from '../stores/combatStore'
import { SAVE_KEY } from '../types/save'

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

describe('open-world smoke test', () => {
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

  it('starts in Moria at the gates', () => {
    const gameStore = startGame()
    expect(gameStore.currentRoomId).toBe('gates-of-moria')
    expect(gameStore.currentRegionId).toBe('moria')
    expect(gameStore.currentRegion?.name).toBe('The Mines of Moria')
  })

  it('east-gate fires the crossing narration once and has a static exit south', () => {
    const gameStore = startGame()
    gameStore.enterRoom('east-gate')
    expect(gameStore.firedRoomEvents.has('moria-crossed')).toBe(true)
    const logText = gameStore.gameLog.map(l => l.text).join('\n')
    expect(logText).toContain('You have survived the crossing of Moria')
    expect(gameStore.currentRoom?.exits.some(e => e.targetRoomId === 'dimrill-dale')).toBe(true)

    // Re-entering must not re-fire the narration
    const logCount = gameStore.gameLog.length
    gameStore.enterRoom('first-hall')
    gameStore.enterRoom('east-gate')
    const newLogs = gameStore.gameLog.slice(logCount).map(l => l.text).join('\n')
    expect(newLogs).not.toContain('You have survived the crossing of Moria')
  })

  it('crossing into Lothlórien switches region and greets once; travel back works', () => {
    const gameStore = startGame()
    gameStore.enterRoom('east-gate')
    gameStore.enterRoom('dimrill-dale')
    expect(gameStore.currentRegionId).toBe('lothlorien')
    const logText = gameStore.gameLog.map(l => l.text).join('\n')
    expect(logText).toContain('— Lothlórien —')

    // Back north into Moria — open world travel
    const logCount = gameStore.gameLog.length
    gameStore.handleCommand('north')
    expect(gameStore.currentRoomId).toBe('east-gate')
    expect(gameStore.currentRegionId).toBe('moria')

    // And south again — no duplicate arrival banner
    gameStore.handleCommand('south')
    expect(gameStore.currentRoomId).toBe('dimrill-dale')
    expect(gameStore.currentRegionId).toBe('lothlorien')
    const newLogs = gameStore.gameLog.slice(logCount).map(l => l.text).join('\n')
    expect(newLogs).not.toContain('— Lothlórien —')
  })

  it('Lothlórien enemies start combat (enemyDb includes all regions)', () => {
    const gameStore = startGame('lothlorien')
    gameStore.enterRoom('orc-ambush-site')
    const combatStore = useCombatStore()
    expect(combatStore.inCombat).toBe(true)
    expect(combatStore.combatEnemies.length).toBeGreaterThan(0)
    expect(combatStore.combatEnemies[0]!.id).toBe('orc-scout')
  })

  it('hidden shrine applies the blessing via room event', () => {
    const gameStore = startGame()
    const playerStore = usePlayerStore()
    gameStore.enterRoom('hidden-shrine')
    expect(playerStore.player!.statusEffects.some(e => e.id === 'blessed')).toBe(true)
  })

  it('victory fires on the farewell lawn and keeps the save', () => {
    const gameStore = startGame('lothlorien')
    gameStore.choicesMade['farewell-path'] = 'boats'
    gameStore.enterRoom('farewell-lawn')
    expect(gameStore.phase).toBe('victory')

    // Save is kept — the world stays open
    gameStore.handleCommand('look') // triggers auto-save path guard; save should still exist from earlier commands
    expect(localStorageMock.getItem(SAVE_KEY)).not.toBeNull()

    // Continue exploring: re-entering must not re-trigger victory
    gameStore.phase = 'playing'
    gameStore.enterRoom('celeborn-hall')
    gameStore.enterRoom('farewell-lawn')
    expect(gameStore.phase).toBe('playing')
  })

  it('Balrog bridge blocks east until cleared', () => {
    const gameStore = startGame()
    gameStore.currentRoomId = 'bridge-of-khazad-dum'
    const combatStore = useCombatStore()
    combatStore.inCombat = false
    gameStore.handleCommand('east')
    expect(gameStore.currentRoomId).toBe('bridge-of-khazad-dum')
    expect(gameStore.gameLog.map(l => l.text).join('\n')).toContain('The Balrog blocks the way')

    gameStore.clearedRooms.add('bridge-of-khazad-dum')
    gameStore.handleCommand('east')
    expect(gameStore.currentRoomId).toBe('east-gate')
  })

  describe('fast travel', () => {
    it('announces waypoint discovery on first visit', () => {
      const gameStore = startGame()
      expect(gameStore.gameLog.map(l => l.text).join('\n')).toContain('The Doors of Durin is now a waypoint')
    })

    it('travels across regions from a safe room (no road event)', () => {
      const gameStore = startGame()
      gameStore.enterRoom('east-gate')
      gameStore.enterRoom('dimrill-dale')
      expect(gameStore.currentRegionId).toBe('lothlorien')

      const rand = vi.spyOn(Math, 'random').mockReturnValue(0.9)
      gameStore.handleCommand('travel doors of durin')
      rand.mockRestore()

      expect(gameStore.currentRoomId).toBe('gates-of-moria')
      expect(gameStore.currentRegionId).toBe('moria')
      const log = gameStore.gameLog.map(l => l.text).join('\n')
      expect(log).toContain('You set out for The Doors of Durin')
      expect(useCombatStore().inCombat).toBe(false)
    })

    it('a road ambush starts combat with the destination region ambushers', () => {
      const gameStore = startGame()
      gameStore.enterRoom('east-gate')

      const rand = vi.spyOn(Math, 'random').mockReturnValue(0.05)
      gameStore.handleCommand('travel doors of durin')
      rand.mockRestore()

      expect(gameStore.currentRoomId).toBe('gates-of-moria')
      const combatStore = useCombatStore()
      expect(combatStore.inCombat).toBe(true)
      expect(combatStore.combatEnemies[0]!.id).toBe('goblin')
    })

    it('refuses travel to undiscovered waypoints', () => {
      const gameStore = startGame()
      gameStore.handleCommand('travel dimrill dale')
      expect(gameStore.currentRoomId).toBe('gates-of-moria')
      expect(gameStore.gameLog[gameStore.gameLog.length - 1]!.text).toContain('no waypoint called')
    })

    it('refuses travel during combat', () => {
      const gameStore = startGame()
      gameStore.enterRoom('east-gate')
      const combatStore = useCombatStore()
      combatStore.inCombat = true
      gameStore.handleCommand('travel doors of durin')
      expect(gameStore.currentRoomId).toBe('east-gate')
      expect(gameStore.gameLog[gameStore.gameLog.length - 1]!.text).toContain('cannot travel')
      combatStore.inCombat = false
    })

    it('bare travel lists the places you know', () => {
      const gameStore = startGame()
      gameStore.enterRoom('east-gate')
      gameStore.handleCommand('travel')
      const log = gameStore.gameLog.map(l => l.text).join('\n')
      expect(log).toContain('The Doors of Durin — The Mines of Moria')
      expect(log).toContain('The East Gate — The Mines of Moria')
    })

    it('the map command opens the world map overlay', () => {
      const gameStore = startGame()
      expect(gameStore.worldMapOpen).toBe(false)
      gameStore.handleCommand('map')
      expect(gameStore.worldMapOpen).toBe(true)
    })
  })

  describe('quests', () => {
    it('the main quest starts at the gates and advances through Moria', async () => {
      const { useQuestStore } = await import('../stores/questStore')
      const gameStore = startGame()
      const questStore = useQuestStore()

      expect(questStore.questProgress['crossing-of-moria']).toBeDefined()
      expect(gameStore.gameLog.map(l => l.text).join('\n')).toContain('New quest: The Crossing of Moria')

      gameStore.enterRoom('bridge-of-khazad-dum') // starts balrog combat
      expect(questStore.questProgress['crossing-of-moria']!.stageIndex).toBe(1)

      // Simulate clearing the bridge
      const combatStore = useCombatStore()
      combatStore.combatEnemies.forEach(e => { e.hp = 0 })
      combatStore.inCombat = false
      gameStore.markRoomCleared()
      expect(questStore.questProgress['crossing-of-moria']!.stageIndex).toBe(2)

      gameStore.enterRoom('east-gate')
      expect(questStore.questProgress['crossing-of-moria']!.completed).toBe(true)
      expect(gameStore.gameLog.map(l => l.text).join('\n')).toContain('Quest complete: The Crossing of Moria')
    })

    it('the chronicle quest tracks taking the tome and leaving Moria', async () => {
      const { useQuestStore } = await import('../stores/questStore')
      const gameStore = startGame()
      const questStore = useQuestStore()
      const playerStore = usePlayerStore()

      gameStore.currentRoomId = 'chamber-of-records'
      gameStore.enterRoom('chamber-of-records')
      // room has enemies; force-clear for the test
      useCombatStore().combatEnemies.forEach(e => { e.hp = 0 })
      useCombatStore().inCombat = false
      expect(questStore.questProgress['balins-chronicle']).toBeDefined()

      gameStore.roomItems['chamber-of-records'] = ['balin-tome']
      gameStore.handleCommand('take book of mazarbul')
      expect(playerStore.inventory.some(i => i.id === 'balin-tome')).toBe(true)
      expect(questStore.questProgress['balins-chronicle']!.stageIndex).toBe(1)

      const goldBefore = playerStore.player!.gold
      gameStore.enterRoom('east-gate')
      expect(questStore.questProgress['balins-chronicle']!.completed).toBe(true)
      expect(playerStore.player!.gold).toBe(goldBefore + 25)
    })

    it('the journal command lists active quests', () => {
      const gameStore = startGame()
      gameStore.handleCommand('quests')
      const log = gameStore.gameLog.map(l => l.text).join('\n')
      expect(log).toContain('Quest Journal')
      expect(log).toContain('The Crossing of Moria')
    })
  })

  describe('economy', () => {
    it('sells loot to a trader for half value', () => {
      const gameStore = startGame()
      const playerStore = usePlayerStore()
      gameStore.enterRoom('abandoned-forge') // Bombur the Ironmonger trades here

      gameStore.handleCommand('take orcish blade')
      const goldBefore = playerStore.player!.gold
      gameStore.handleCommand('sell orcish blade')

      expect(playerStore.inventory.some(i => i.id === 'orcish-blade')).toBe(false)
      expect(playerStore.player!.gold).toBeGreaterThan(goldBefore)
    })

    it('refuses to sell equipped gear and to sell with no trader present', () => {
      const gameStore = startGame()
      gameStore.enterRoom('abandoned-forge')
      gameStore.handleCommand('sell battle axe')
      expect(gameStore.gameLog[gameStore.gameLog.length - 1]!.text).toContain('Unequip it first')

      gameStore.enterRoom('first-hall')
      useCombatStore().inCombat = false
      gameStore.handleCommand('sell healing potion')
      expect(gameStore.gameLog[gameStore.gameLog.length - 1]!.text).toContain('no one here to sell to')
    })
  })

  describe('Rivendell region', () => {
    it('starts a fresh journey in the courtyard with the main quest', async () => {
      const { useQuestStore } = await import('../stores/questStore')
      const gameStore = startGame('rivendell')
      expect(gameStore.currentRoomId).toBe('rivendell-courtyard')
      expect(gameStore.currentRegionId).toBe('rivendell')
      expect(useQuestStore().questProgress['road-to-moria']).toBeDefined()
      expect(gameStore.gameLog.map(l => l.text).join('\n')).toContain('Rivendell is now a waypoint')
    })

    it('Elrond gives counsel, a reward, and advances the main quest', async () => {
      const { useQuestStore } = await import('../stores/questStore')
      const gameStore = startGame('rivendell')
      const playerStore = usePlayerStore()

      gameStore.enterRoom('last-homely-house')
      gameStore.handleCommand('talk elrond')

      expect(useQuestStore().questProgress['road-to-moria']!.stageIndex).toBe(1)
      expect(playerStore.inventory.some(i => i.id === 'miruvor')).toBe(true)
    })

    it('walking the road into Moria completes the prologue and starts the crossing', async () => {
      const { useQuestStore } = await import('../stores/questStore')
      const gameStore = startGame('rivendell')
      const questStore = useQuestStore()

      gameStore.enterRoom('last-homely-house')
      gameStore.handleCommand('talk elrond')
      gameStore.enterRoom('moria-west-approach')
      expect(questStore.questProgress['road-to-moria']!.stageIndex).toBe(2)
      expect(gameStore.gameLog.map(l => l.text).join('\n')).toContain('You have reached the Walls of Moria')

      const logCount = gameStore.gameLog.length
      gameStore.handleCommand('east')
      expect(gameStore.currentRoomId).toBe('gates-of-moria')
      expect(gameStore.currentRegionId).toBe('moria')
      const newLogs = gameStore.gameLog.slice(logCount).map(l => l.text).join('\n')
      expect(newLogs).toContain('— The Mines of Moria —')
      expect(questStore.questProgress['road-to-moria']!.completed).toBe(true)
      expect(questStore.questProgress['crossing-of-moria']).toBeDefined()
    })

    it('Erestor\'s fetch quest completes on returning the records', async () => {
      const { useQuestStore } = await import('../stores/questStore')
      const gameStore = startGame('rivendell')
      const questStore = useQuestStore()
      const playerStore = usePlayerStore()

      gameStore.enterRoom('elrond-library')
      gameStore.handleCommand('talk erestor')
      expect(questStore.questProgress['records-of-eregion']).toBeDefined()

      gameStore.enterRoom('eregion-ruins') // goblin raiders attack
      useCombatStore().combatEnemies.forEach(e => { e.hp = 0 })
      useCombatStore().inCombat = false
      gameStore.handleCommand('take records')
      expect(questStore.questProgress['records-of-eregion']!.stageIndex).toBe(1)

      const goldBefore = playerStore.player!.gold
      gameStore.enterRoom('elrond-library')
      gameStore.handleCommand('talk erestor')
      expect(questStore.questProgress['records-of-eregion']!.completed).toBe(true)
      expect(playerStore.player!.gold).toBe(goldBefore + 40)
    })

    it('the smith buys and sells in the forge', () => {
      const gameStore = startGame('rivendell')
      const playerStore = usePlayerStore()
      gameStore.enterRoom('rivendell-forge')

      gameStore.handleCommand('buy torch')
      expect(playerStore.inventory.some(i => i.id === 'torch')).toBe(true)

      playerStore.addItem({ id: 'wolf-pelt', name: 'Wolf Pelt', description: '', type: 'misc', value: 12 })
      const goldBefore = playerStore.player!.gold
      gameStore.handleCommand('sell wolf pelt')
      expect(playerStore.player!.gold).toBe(goldBefore + 6)
    })
  })

  describe('leveling perks', () => {
    it('unlocks the level 3 class perk from quest XP', () => {
      const gameStore = startGame()
      const playerStore = usePlayerStore()
      playerStore.player!.xp = 0
      playerStore.player!.level = 2
      playerStore.player!.xpToNext = 10

      gameStore.pushLogs(playerStore.addXp(10))

      expect(playerStore.player!.level).toBe(3)
      expect(playerStore.player!.perks).toContain('stone-skin')
      expect(gameStore.gameLog.map(l => l.text).join('\n')).toContain('Perk unlocked: Stone Skin')
    })
  })
})
