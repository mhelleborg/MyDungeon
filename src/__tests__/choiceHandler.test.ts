import { describe, it, expect, vi, afterEach } from 'vitest'
import { presentChoice, resolveChoice } from '../engine/handlers/choiceHandler'
import { choices } from '../data/choices'
import { parseCommand } from '../engine/commandParser'
import { checkMidRunAchievements } from '../engine/achievements'
import type { Item } from '../types/item'
import type { Companion } from '../types/companion'

afterEach(() => vi.restoreAllMocks())

const makeItem = (overrides?: Partial<Item>): Item => ({
  id: 'healing-potion',
  name: 'Healing Potion',
  description: 'A red potion.',
  type: 'potion',
  value: 10,
  ...overrides,
})

const makeCompanion = (overrides?: Partial<Companion>): Companion => ({
  id: 'trapped-elf',
  name: 'Elanor',
  hp: 18,
  maxHp: 18,
  ac: 14,
  attackBonus: 4,
  damage: '1d6+2',
  roomComments: {},
  genericComments: ['A comment.'],
  deathMessage: 'Elanor has fallen.',
  ...overrides,
})

// ── presentChoice ──────────────────────────────────────────

describe('presentChoice', () => {
  it('returns narrative text and option descriptions', () => {
    const choice = choices['wounded-goblin']!
    const result = presentChoice(choice)

    expect(result.logs.length).toBeGreaterThanOrEqual(4) // system + narrative + 3 options + info prompt
    expect(result.logs[0]!.text).toContain('The Wounded Goblin')
    expect(result.logs[0]!.type).toBe('system')
    expect(result.logs[1]!.type).toBe('narrative')
    // Options presented as info logs
    const infoLogs = result.logs.filter(l => l.type === 'info')
    expect(infoLogs.length).toBeGreaterThanOrEqual(3) // 3 options + prompt
  })

  it('returns activeChoice with all options', () => {
    const choice = choices['wounded-goblin']!
    const result = presentChoice(choice)

    expect(result.activeChoice.choiceId).toBe('wounded-goblin')
    expect(result.activeChoice.options).toHaveLength(3)
    expect(result.activeChoice.options.map(o => o.id)).toEqual(['mercy', 'kill', 'ignore'])
  })

  it('generates dynamic description for bridge sacrifice with companion name', () => {
    const choice = choices['bridge-sacrifice']!
    const result = presentChoice(choice, 'Elanor')

    const narrativeLog = result.logs.find(l => l.type === 'narrative')
    expect(narrativeLog!.text).toContain('Elanor')
  })

  it('uses static description for non-bridge choices', () => {
    const choice = choices['oris-knowledge']!
    const result = presentChoice(choice)

    const narrativeLog = result.logs.find(l => l.type === 'narrative')
    expect(narrativeLog!.text).toContain('Ori')
  })
})

// ── Wounded Goblin ─────────────────────────────────────────

describe('resolveChoice — wounded goblin', () => {
  const ctx = (inventory: Item[]) => ({
    inventory,
    companions: [],
  })

  it('mercy with potion: returns XP, potion consumption, enemy removal', () => {
    const result = resolveChoice('wounded-goblin', 'mercy', ctx([makeItem()]))

    expect(result.optionId).toBe('mercy')
    expect(result.xp).toBe(15)
    expect(result.consumeHealingPotion).toBe(true)
    expect(result.removeEnemies).toEqual({
      roomId: 'orc-lair',
      enemyId: 'orc-warrior',
      count: 1,
    })
    expect(result.consequenceFlags?.['goblin-mercy']).toBe(true)
    expect(result.logs.some(l => l.text.includes('Grishnak'))).toBe(true)
  })

  it('mercy without potion: fails gracefully', () => {
    const result = resolveChoice('wounded-goblin', 'mercy', ctx([]))

    expect(result.optionId).toBe('') // empty = failed resolution
    expect(result.xp).toBeUndefined()
    expect(result.consumeHealingPotion).toBeUndefined()
    expect(result.logs.some(l => l.type === 'error')).toBe(true)
  })

  it('kill: returns XP and gold, no enemy removal', () => {
    const result = resolveChoice('wounded-goblin', 'kill', ctx([]))

    expect(result.optionId).toBe('kill')
    expect(result.xp).toBe(10)
    expect(result.gold).toBe(5)
    expect(result.removeEnemies).toBeUndefined()
    expect(result.logs.some(l => l.text.includes('swift strike'))).toBe(true)
  })

  it('ignore: returns narrative only, no rewards', () => {
    const result = resolveChoice('wounded-goblin', 'ignore', ctx([]))

    expect(result.optionId).toBe('ignore')
    expect(result.xp).toBeUndefined()
    expect(result.gold).toBeUndefined()
    expect(result.removeEnemies).toBeUndefined()
    expect(result.logs.some(l => l.text.includes('step over'))).toBe(true)
  })
})

// ── Ori's Knowledge ────────────────────────────────────────

describe("resolveChoice — Ori's Knowledge", () => {
  const ctx = { inventory: [] as Item[], companions: [] as Companion[] }

  it('accept: returns attack bonus + maxHp reduction', () => {
    const result = resolveChoice('oris-knowledge', 'accept', ctx)

    expect(result.optionId).toBe('accept')
    expect(result.attackBonus).toBe(2)
    expect(result.maxHpChange).toBe(-6)
    expect(result.consequenceFlags?.['oris-knowledge-accepted']).toBe(true)
    expect(result.logs.some(l => l.text.includes('battle-lore'))).toBe(true)
  })

  it('refuse: returns AC bonus, no HP loss', () => {
    const result = resolveChoice('oris-knowledge', 'refuse', ctx)

    expect(result.optionId).toBe('refuse')
    expect(result.acBonus).toBe(1)
    expect(result.maxHpChange).toBeUndefined()
    expect(result.attackBonus).toBeUndefined()
    expect(result.consequenceFlags?.['oris-blessing']).toBe(true)
    expect(result.logs.some(l => l.text.includes('wiser than we were'))).toBe(true)
  })
})

// ── Sealed Vault ───────────────────────────────────────────

describe('resolveChoice — sealed vault', () => {
  const ctx = { inventory: [] as Item[], companions: [] as Companion[] }

  it('open: returns miruvor item + enemy spawn', () => {
    const result = resolveChoice('sealed-vault', 'open', ctx)

    expect(result.optionId).toBe('open')
    expect(result.itemIds).toEqual(['miruvor'])
    expect(result.spawnEnemies).toEqual({
      roomId: 'chamber-of-records',
      enemyId: 'orc-warrior',
      count: 2,
    })
    expect(result.consequenceFlags?.['vault-opened']).toBe(true)
  })

  it('leave: returns narrative only, no items or spawns', () => {
    const result = resolveChoice('sealed-vault', 'leave', ctx)

    expect(result.optionId).toBe('leave')
    expect(result.itemIds).toBeUndefined()
    expect(result.spawnEnemies).toBeUndefined()
    expect(result.logs.some(l => l.text.includes('doors are best left closed'))).toBe(true)
  })
})

// ── Bridge Sacrifice ───────────────────────────────────────

describe('resolveChoice — bridge sacrifice', () => {
  it('sacrifice with companion: returns companion death + boss damage + skip turn', () => {
    // Mock dice for deterministic damage
    vi.spyOn(Math, 'random').mockReturnValue(0.5) // middling roll
    const companion = makeCompanion()
    const result = resolveChoice('bridge-sacrifice', 'sacrifice', {
      inventory: [],
      companions: [companion],
    })

    expect(result.optionId).toBe('sacrifice')
    expect(result.sacrificeCompanion).toBe(true)
    expect(result.bossDamage).toBeGreaterThan(0)
    expect(result.skipEnemyTurn).toBe(true)
    expect(result.consequenceFlags?.['companion-sacrificed']).toBe(true)
    expect(result.logs.some(l => l.text.includes('Elanor'))).toBe(true)
  })

  it('sacrifice without companion: fails', () => {
    const result = resolveChoice('bridge-sacrifice', 'sacrifice', {
      inventory: [],
      companions: [],
    })

    expect(result.optionId).toBe('') // failed
    expect(result.sacrificeCompanion).toBeUndefined()
    expect(result.logs.some(l => l.type === 'error')).toBe(true)
  })

  it('sacrifice with dead companion: fails', () => {
    const deadCompanion = makeCompanion({ hp: 0 })
    const result = resolveChoice('bridge-sacrifice', 'sacrifice', {
      inventory: [],
      companions: [deadCompanion],
    })

    expect(result.optionId).toBe('') // failed
  })

  it('refuse with companion: returns narrative, no death', () => {
    const companion = makeCompanion()
    const result = resolveChoice('bridge-sacrifice', 'refuse', {
      inventory: [],
      companions: [companion],
    })

    expect(result.optionId).toBe('refuse')
    expect(result.sacrificeCompanion).toBeUndefined()
    expect(result.bossDamage).toBeUndefined()
    expect(result.logs.some(l => l.text.includes('together we stand'))).toBe(true)
  })

  it('refuse without companion: still returns narrative', () => {
    const result = resolveChoice('bridge-sacrifice', 'refuse', {
      inventory: [],
      companions: [],
    })

    expect(result.optionId).toBe('refuse')
    expect(result.logs.some(l => l.text.includes('together'))).toBe(true)
  })
})

// ── Unknown choice ─────────────────────────────────────────

describe('resolveChoice — unknown', () => {
  it('returns error for unknown choice id', () => {
    const result = resolveChoice('nonexistent', 'whatever', {
      inventory: [],
      companions: [],
    })

    expect(result.logs.some(l => l.type === 'error')).toBe(true)
  })
})

// ── Choice data validation ─────────────────────────────────

describe('choices data', () => {
  it('all choices have valid structure', () => {
    for (const [id, choice] of Object.entries(choices)) {
      expect(choice.id).toBe(id)
      expect(choice.name).toBeTruthy()
      expect(choice.options.length).toBeGreaterThanOrEqual(2)
      expect(choice.roomId).toBeTruthy()

      for (const opt of choice.options) {
        expect(opt.id).toBeTruthy()
        expect(opt.label).toBeTruthy()
        expect(opt.description).toBeTruthy()
      }
    }
  })

  it('wounded-goblin has 3 options: mercy, kill, ignore', () => {
    const choice = choices['wounded-goblin']!
    expect(choice.options.map(o => o.id)).toEqual(['mercy', 'kill', 'ignore'])
  })

  it('oris-knowledge has 2 options: accept, refuse', () => {
    const choice = choices['oris-knowledge']!
    expect(choice.options.map(o => o.id)).toEqual(['accept', 'refuse'])
  })

  it('sealed-vault has 2 options: open, leave', () => {
    const choice = choices['sealed-vault']!
    expect(choice.options.map(o => o.id)).toEqual(['open', 'leave'])
  })

  it('bridge-sacrifice has 2 options: sacrifice, refuse', () => {
    const choice = choices['bridge-sacrifice']!
    expect(choice.options.map(o => o.id)).toEqual(['sacrifice', 'refuse'])
  })
})

// ── Command parser integration ─────────────────────────────

describe('choose command parsing', () => {
  it('parses "choose mercy" correctly', () => {
    const cmd = parseCommand('choose mercy')
    expect(cmd.type).toBe('choose')
    expect(cmd.target).toBe('mercy')
  })

  it('parses "choose accept" correctly', () => {
    const cmd = parseCommand('choose accept')
    expect(cmd.type).toBe('choose')
    expect(cmd.target).toBe('accept')
  })

  it('parses "decide refuse" correctly', () => {
    const cmd = parseCommand('decide refuse')
    expect(cmd.type).toBe('choose')
    expect(cmd.target).toBe('refuse')
  })

  it('parses "choose" without target', () => {
    const cmd = parseCommand('choose')
    expect(cmd.type).toBe('choose')
    expect(cmd.target).toBeUndefined()
  })
})

// ── Achievement integration ────────────────────────────────

describe('mercy achievement', () => {
  const baseStats = {
    roomsExplored: 5,
    totalRooms: 18,
    enemiesKilled: 3,
    damageDealt: 50,
    damageTaken: 20,
    itemsFound: 2,
    potionsUsed: 1,
    puzzlesSolved: 0,
    secretsFound: 0,
    sneakSuccesses: 0,
    fleeAttempts: 0,
    startTime: Date.now(),
    playerClass: 'ranger' as const,
    difficulty: 'normal' as const,
    balrogSlain: false,
    itemsCrafted: 0,
    choicesMadeCount: 0,
    mercyShown: false,
  }

  it('unlocks mercy achievement when mercyShown is true', () => {
    const stats = { ...baseStats, mercyShown: true, choicesMadeCount: 1 }
    const earned = checkMidRunAchievements(stats, [])
    expect(earned).toContain('mercy-of-the-valar')
  })

  it('does not unlock mercy achievement when mercyShown is false', () => {
    const earned = checkMidRunAchievements(baseStats, [])
    expect(earned).not.toContain('mercy-of-the-valar')
  })
})
