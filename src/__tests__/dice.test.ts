import { describe, it, expect, vi, afterEach } from 'vitest'
import { rollDie, rollD20, rollD6, rollDice } from '../engine/dice'

describe('rollDie', () => {
  afterEach(() => vi.restoreAllMocks())

  it('returns 1 when Math.random returns 0', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0)
    expect(rollDie(6)).toBe(1)
  })

  it('returns max when Math.random returns 0.999', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.999)
    expect(rollDie(6)).toBe(6)
    expect(rollDie(20)).toBe(20)
  })

  it('returns values in [1, sides] range', () => {
    for (let i = 0; i < 100; i++) {
      const val = rollDie(20)
      expect(val).toBeGreaterThanOrEqual(1)
      expect(val).toBeLessThanOrEqual(20)
    }
  })
})

describe('rollD20', () => {
  it('returns a value between 1 and 20', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.5)
    expect(rollD20()).toBe(11)
    vi.restoreAllMocks()
  })
})

describe('rollD6', () => {
  it('returns a value between 1 and 6', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.5)
    expect(rollD6()).toBe(4)
    vi.restoreAllMocks()
  })
})

describe('rollDice', () => {
  afterEach(() => vi.restoreAllMocks())

  it('parses "2d6+3" correctly', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.5) // each die = 4
    const result = rollDice('2d6+3')
    expect(result.rolls).toEqual([4, 4])
    expect(result.modifier).toBe(3)
    expect(result.total).toBe(11) // 4+4+3
  })

  it('parses "1d8" with no modifier', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.999)
    const result = rollDice('1d8')
    expect(result.rolls).toEqual([8])
    expect(result.modifier).toBe(0)
    expect(result.total).toBe(8)
  })

  it('handles negative modifiers', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0) // each die = 1
    const result = rollDice('1d4-2')
    expect(result.modifier).toBe(-2)
    expect(result.total).toBe(0) // clamped to 0 via Math.max
  })

  it('returns zeroed result for invalid notation', () => {
    const result = rollDice('invalid')
    expect(result.total).toBe(0)
    expect(result.rolls).toEqual([])
    expect(result.modifier).toBe(0)
  })
})
