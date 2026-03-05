import { describe, it, expect, vi, afterEach } from 'vitest'
import {
  shouldTriggerEncounter,
  selectEncounter,
  resolveEncounter,
  answerRiddle,
  listMerchantOffers,
  buyFromMerchant,
} from '../engine/handlers/encounterHandler'
import type { Encounter, RiddleEncounter, MerchantOffer } from '../types/encounter'
import type { AbilityScores } from '../types/character'

const abilities: AbilityScores = { str: 14, dex: 16, con: 12, int: 10, wis: 10, cha: 10 }

afterEach(() => vi.restoreAllMocks())

// ── shouldTriggerEncounter ─────────────────────────────────
describe('shouldTriggerEncounter', () => {
  it('returns false when in combat', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0) // would trigger
    expect(shouldTriggerEncounter(0.18, true, false)).toBe(false)
  })

  it('returns false when room has active enemies', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0)
    expect(shouldTriggerEncounter(0.18, false, true)).toBe(false)
  })

  it('triggers when random < chance', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.10) // 0.10 < 0.18
    expect(shouldTriggerEncounter(0.18, false, false)).toBe(true)
  })

  it('does not trigger when random >= chance', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.50)
    expect(shouldTriggerEncounter(0.18, false, false)).toBe(false)
  })
})

// ── selectEncounter ────────────────────────────────────────
describe('selectEncounter', () => {
  const pool: Encounter[] = [
    {
      id: 'a', type: 'lore', name: 'A', description: '', loreText: '', oneTime: true, weight: 10, rewardXp: 5,
    },
    {
      id: 'b', type: 'lore', name: 'B', description: '', loreText: '', oneTime: false, weight: 10, rewardXp: 5,
    },
  ]

  it('filters out seen one-time encounters', () => {
    const seen = new Set(['a'])
    vi.spyOn(Math, 'random').mockReturnValue(0)
    const result = selectEncounter(pool, seen)
    expect(result?.id).toBe('b')
  })

  it('returns null when all one-time are seen and no repeatable', () => {
    const oneTimeOnly: Encounter[] = [pool[0]!]
    const seen = new Set(['a'])
    const result = selectEncounter(oneTimeOnly, seen)
    expect(result).toBeNull()
  })

  it('uses weighted selection', () => {
    const seen = new Set<string>()
    // total weight = 20, roll = 0 -> picks first (a)
    vi.spyOn(Math, 'random').mockReturnValue(0)
    expect(selectEncounter(pool, seen)?.id).toBe('a')
  })
})

// ── resolveEncounter ───────────────────────────────────────
describe('resolveEncounter', () => {
  it('resolves lore encounter with XP', () => {
    const lore: Encounter = {
      id: 'lore-1', type: 'lore', name: 'Test', description: 'Desc', loreText: 'Some lore',
      oneTime: true, weight: 10, rewardXp: 15,
    }
    const result = resolveEncounter(lore, abilities)
    expect(result.xp).toBe(15)
    expect(result.logs.length).toBeGreaterThanOrEqual(2)
  })

  it('resolves discovery with healing', () => {
    const disc: Encounter = {
      id: 'disc-1', type: 'discovery', name: 'Spring', description: 'Desc', discoveryText: 'Water',
      oneTime: true, weight: 10, healHp: 8,
    }
    const result = resolveEncounter(disc, abilities)
    expect(result.healHp).toBe(8)
  })

  it('resolves skill check success', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.95) // roll = 20
    const enc: Encounter = {
      id: 'sk-1', type: 'skill-check', name: 'Test', description: 'Desc',
      ability: 'dex', dc: 13, successText: 'OK', failureText: 'Fail',
      rewardGold: 15, failDamage: 4, oneTime: true, weight: 10,
    }
    const result = resolveEncounter(enc, abilities)
    expect(result.gold).toBe(15)
    expect(result.damage).toBeUndefined()
  })

  it('resolves skill check failure with damage', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0) // roll = 1
    const enc: Encounter = {
      id: 'sk-2', type: 'skill-check', name: 'Test', description: 'Desc',
      ability: 'str', dc: 20, successText: 'OK', failureText: 'Fail',
      failDamage: 6, oneTime: true, weight: 10,
    }
    const result = resolveEncounter(enc, abilities)
    expect(result.damage).toBe(6)
    expect(result.gold).toBeUndefined()
  })

  it('resolves riddle start with activeEncounter', () => {
    const riddle: Encounter = {
      id: 'r-1', type: 'riddle', name: 'Test', description: 'Desc',
      riddle: 'What?', answer: 'time', rewardGold: 10,
      oneTime: true, weight: 10,
    }
    const result = resolveEncounter(riddle, abilities)
    expect(result.activeEncounter).toBeDefined()
    expect(result.activeEncounter?.type).toBe('riddle')
  })

  it('resolves merchant start with activeEncounter', () => {
    const merchant: Encounter = {
      id: 'm-1', type: 'merchant', name: 'Trader', description: 'Desc',
      dialogue: 'Hello', offers: [{ itemId: 'healing-potion', cost: 10 }],
      oneTime: false, weight: 10,
    }
    const result = resolveEncounter(merchant, abilities)
    expect(result.activeEncounter).toBeDefined()
    expect(result.activeEncounter?.type).toBe('merchant')
    expect(result.activeEncounter?.offers).toHaveLength(1)
  })
})

// ── answerRiddle ───────────────────────────────────────────
describe('answerRiddle', () => {
  const riddle: RiddleEncounter = {
    id: 'r-1', type: 'riddle', name: 'Test', description: '',
    riddle: 'What?', answer: 'time',
    rewardGold: 15, rewardXp: 20, oneTime: true, weight: 10,
  }

  it('correct answer gives rewards', () => {
    const result = answerRiddle(riddle, 'time')
    expect(result.correct).toBe(true)
    expect(result.gold).toBe(15)
    expect(result.xp).toBe(20)
  })

  it('case-insensitive', () => {
    expect(answerRiddle(riddle, 'TIME').correct).toBe(true)
    expect(answerRiddle(riddle, ' Time ').correct).toBe(true)
  })

  it('wrong answer returns no rewards', () => {
    const result = answerRiddle(riddle, 'water')
    expect(result.correct).toBe(false)
    expect(result.gold).toBeUndefined()
  })
})

// ── merchant functions ─────────────────────────────────────
describe('listMerchantOffers', () => {
  it('lists offers', () => {
    const offers: MerchantOffer[] = [{ itemId: 'healing-potion', cost: 10 }]
    const lookup = (id: string) => id === 'healing-potion' ? { id, name: 'Healing Potion', description: '', type: 'potion' as const, value: 10 } : undefined
    const result = listMerchantOffers('Trader', offers, lookup)
    expect(result.offers).toHaveLength(1)
    expect(result.offers[0]!.itemName).toBe('Healing Potion')
  })
})

describe('buyFromMerchant', () => {
  const offers: MerchantOffer[] = [{ itemId: 'healing-potion', cost: 10 }]
  const lookup = (id: string) => id === 'healing-potion' ? { id, name: 'Healing Potion', description: '', type: 'potion' as const, value: 10 } : undefined

  it('succeeds with enough gold', () => {
    const result = buyFromMerchant('Trader', offers, 'healing', 50, lookup)
    expect(result.success).toBe(true)
    expect(result.cost).toBe(10)
  })

  it('fails with not enough gold', () => {
    const result = buyFromMerchant('Trader', offers, 'healing', 5, lookup)
    expect(result.success).toBe(false)
  })

  it('fails with unknown item', () => {
    const result = buyFromMerchant('Trader', offers, 'sword', 50, lookup)
    expect(result.success).toBe(false)
  })
})
