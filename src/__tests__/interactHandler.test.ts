import { describe, it, expect, vi, afterEach } from 'vitest'
import { examineInteraction, resolveSearch } from '../engine/handlers/interactHandler'
import type { RoomInteraction } from '../data/roomInteractions'
import type { AbilityScores } from '../types/character'

const abilities: AbilityScores = { str: 10, dex: 10, con: 10, int: 16, wis: 10, cha: 10 }

const interactions: RoomInteraction[] = [
  {
    keywords: ['pillar', 'pillars'],
    examineText: 'Cracked pillars.',
  },
  {
    keywords: ['tripwire', 'wire'],
    examineText: 'Active tripwire.',
    disarmedExamineText: 'Slack wires.',
    destroyedExamineText: 'Destroyed wires.',
  },
  {
    keywords: ['bones', 'remains'],
    examineText: 'Old bones.',
    clearedExamineText: 'Bones among corpses.',
    action: {
      verb: 'search',
      successText: 'You find gold!',
      failText: 'You find nothing.',
      skillCheck: { ability: 'int', dc: 10 },
      rewardItems: ['gold-coins'],
      requiresCleared: true,
    },
  },
  {
    keywords: ['chest'],
    examineText: 'A chest.',
    action: {
      verb: 'search',
      successText: 'You find a potion!',
      rewardItems: ['healing-potion'],
    },
  },
]

afterEach(() => vi.restoreAllMocks())

describe('examineInteraction', () => {
  it('finds matching keyword', () => {
    const result = examineInteraction(interactions, 'pillar', false, false, false)
    expect(result.found).toBe(true)
    expect(result.logs[0]!.text).toBe('Cracked pillars.')
  })

  it('returns partial keyword match', () => {
    const result = examineInteraction(interactions, 'the pillars here', false, false, false)
    expect(result.found).toBe(true)
  })

  it('returns not found for unknown target', () => {
    const result = examineInteraction(interactions, 'ceiling', false, false, false)
    expect(result.found).toBe(false)
    expect(result.logs).toHaveLength(0)
  })

  it('uses cleared text when room is cleared', () => {
    const result = examineInteraction(interactions, 'bones', true, false, false)
    expect(result.logs[0]!.text).toBe('Bones among corpses.')
  })

  it('uses disarmed text when trap is disarmed', () => {
    const result = examineInteraction(interactions, 'tripwire', false, true, false)
    expect(result.logs[0]!.text).toBe('Slack wires.')
  })

  it('uses destroyed text when trap is destroyed', () => {
    const result = examineInteraction(interactions, 'wire', false, true, true)
    expect(result.logs[0]!.text).toBe('Destroyed wires.')
  })

  it('destroyed takes priority over disarmed', () => {
    const result = examineInteraction(interactions, 'tripwire', false, true, true)
    expect(result.logs[0]!.text).toBe('Destroyed wires.')
  })
})

describe('resolveSearch', () => {
  it('succeeds skill check and returns reward items', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.5) // roll 11 + 3 INT = 14 vs DC 10
    const result = resolveSearch(interactions[2]!, abilities)
    expect(result.success).toBe(true)
    expect(result.rewardItems).toEqual(['gold-coins'])
    expect(result.logs.some(l => l.text.includes('gold'))).toBe(true)
  })

  it('fails skill check and returns no reward', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0) // roll 1 + 3 = 4 vs DC 10
    const result = resolveSearch(interactions[2]!, abilities)
    expect(result.success).toBe(false)
    expect(result.rewardItems).toBeUndefined()
    expect(result.logs.some(l => l.text.includes('nothing'))).toBe(true)
  })

  it('auto-succeeds when no skill check required', () => {
    const result = resolveSearch(interactions[3]!, abilities)
    expect(result.success).toBe(true)
    expect(result.rewardItems).toEqual(['healing-potion'])
  })

  it('returns error for interaction without search action', () => {
    const result = resolveSearch(interactions[0]!, abilities)
    expect(result.success).toBe(false)
    expect(result.logs[0]!.type).toBe('error')
  })
})
