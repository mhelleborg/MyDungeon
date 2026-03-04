import { describe, it, expect, vi, afterEach } from 'vitest'
import { triggerTrap, attemptDisarm } from '../engine/handlers/trapHandler'
import type { Trap } from '../types/room'
import type { AbilityScores } from '../types/character'

const dexTrap: Trap = {
  description: 'A goblin tripwire triggers rusty darts!',
  disarmAbility: 'dex',
  disarmDC: 10,
  damage: '1d4',
}

const abilities: AbilityScores = { str: 10, dex: 16, con: 10, int: 10, wis: 10, cha: 10 }

afterEach(() => vi.restoreAllMocks())

describe('triggerTrap', () => {
  it('deals damage and returns description', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.5) // 1d4 → 3
    const result = triggerTrap(dexTrap)
    expect(result.damage).toBe(3)
    expect(result.logs).toHaveLength(2)
    expect(result.logs[0]!.text).toContain('tripwire')
    expect(result.logs[1]!.text).toContain('3 damage')
  })
})

describe('attemptDisarm', () => {
  it('succeeds when roll + modifier >= DC', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.5) // roll = 11, +3 DEX = 14 vs DC 10
    const result = attemptDisarm(dexTrap, abilities)
    expect(result.success).toBe(true)
    expect(result.damage).toBe(0)
    expect(result.trapSpent).toBe(true)
    expect(result.logs[0]!.text).toContain('disarm')
  })

  it('fails and deals damage when roll is low', () => {
    // First call: skillCheck rollD20. Second call: rollDice for damage.
    let callCount = 0
    vi.spyOn(Math, 'random').mockImplementation(() => {
      callCount++
      return callCount === 1 ? 0 : 0.5 // roll 1 for check, 3 for damage
    })
    const result = attemptDisarm(dexTrap, abilities)
    expect(result.success).toBe(false)
    expect(result.damage).toBeGreaterThan(0)
    expect(result.trapSpent).toBe(true)
    expect(result.logs[0]!.text).toContain('fail')
  })
})
