import { describe, it, expect, vi, afterEach } from 'vitest'
import { skillCheck } from '../engine/skillChecks'
import type { AbilityScores } from '../types/character'

const abilities: AbilityScores = { str: 16, dex: 14, con: 12, int: 10, wis: 8, cha: 6 }
// Modifiers: STR +3, DEX +2, CON +1, INT 0, WIS -1, CHA -2

afterEach(() => vi.restoreAllMocks())

describe('skillCheck', () => {
  it('succeeds when roll + modifier >= DC', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.5) // roll = 11
    const result = skillCheck(abilities, 'str', 12)
    expect(result.roll).toBe(11)
    expect(result.modifier).toBe(3)
    expect(result.total).toBe(14)
    expect(result.dc).toBe(12)
    expect(result.success).toBe(true)
  })

  it('fails when roll + modifier < DC', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0) // roll = 1
    const result = skillCheck(abilities, 'cha', 10)
    expect(result.roll).toBe(1)
    expect(result.modifier).toBe(-2)
    expect(result.total).toBe(-1)
    expect(result.success).toBe(false)
  })

  it('succeeds on exact DC match', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.5) // roll = 11
    const result = skillCheck(abilities, 'int', 11)
    expect(result.total).toBe(11) // 11 + 0
    expect(result.success).toBe(true)
  })

  it('uses correct modifier for each ability', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.5) // roll = 11
    expect(skillCheck(abilities, 'dex', 1).modifier).toBe(2)
    expect(skillCheck(abilities, 'con', 1).modifier).toBe(1)
    expect(skillCheck(abilities, 'wis', 1).modifier).toBe(-1)
  })
})
