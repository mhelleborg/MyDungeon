import { describe, it, expect } from 'vitest'
import { lightTorch, castLightSpell, tickLight } from '../engine/handlers/lightHandler'

describe('lightTorch', () => {
  it('returns lit state with 50 turns', () => {
    const state = lightTorch()
    expect(state.hasLight).toBe(true)
    expect(state.turnsRemaining).toBe(50)
    expect(state.permanent).toBe(false)
  })
})

describe('castLightSpell', () => {
  it('returns permanent light', () => {
    const state = castLightSpell()
    expect(state.hasLight).toBe(true)
    expect(state.permanent).toBe(true)
  })
})

describe('tickLight', () => {
  it('decrements turns remaining', () => {
    const result = tickLight({ hasLight: true, turnsRemaining: 20, permanent: false })
    expect(result.newState.turnsRemaining).toBe(19)
    expect(result.newState.hasLight).toBe(true)
    expect(result.logs).toHaveLength(0)
  })

  it('warns when reaching 10 turns', () => {
    const result = tickLight({ hasLight: true, turnsRemaining: 11, permanent: false })
    expect(result.newState.turnsRemaining).toBe(10)
    expect(result.logs).toHaveLength(1)
    expect(result.logs[0]!.text).toContain('flickers')
  })

  it('extinguishes at 1 turn remaining', () => {
    const result = tickLight({ hasLight: true, turnsRemaining: 1, permanent: false })
    expect(result.newState.hasLight).toBe(false)
    expect(result.newState.turnsRemaining).toBe(0)
    expect(result.logs).toHaveLength(1)
    expect(result.logs[0]!.text).toContain('dies')
  })

  it('does nothing when already dark', () => {
    const result = tickLight({ hasLight: false, turnsRemaining: 0, permanent: false })
    expect(result.newState.hasLight).toBe(false)
    expect(result.logs).toHaveLength(0)
  })

  it('skips decrement for permanent light', () => {
    const result = tickLight({ hasLight: true, turnsRemaining: 0, permanent: true })
    expect(result.newState.permanent).toBe(true)
    expect(result.newState.hasLight).toBe(true)
    expect(result.logs).toHaveLength(0)
  })
})
