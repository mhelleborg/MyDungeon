import { describe, it, expect } from 'vitest'
import { validateMove } from '../engine/handlers/moveHandler'
import type { Room } from '../types/room'

const baseRoom: Room = {
  id: 'test-room',
  name: 'Test Room',
  description: 'A test room.',
  exits: [
    { direction: 'north', targetRoomId: 'north-room' },
    { direction: 'east', targetRoomId: 'east-room', locked: true, requiredItemId: 'key', lockMessage: 'Locked!' },
    { direction: 'south', targetRoomId: 'south-room', hidden: true, revealMethod: 'examine' },
  ],
  gridX: 0,
  gridY: 0,
}

describe('validateMove', () => {
  it('allows movement to a valid exit', () => {
    const result = validateMove(baseRoom, 'north', [], new Set())
    expect(result.allowed).toBe(true)
    expect(result.exit?.targetRoomId).toBe('north-room')
  })

  it('blocks movement to nonexistent direction', () => {
    const result = validateMove(baseRoom, 'west', [], new Set())
    expect(result.allowed).toBe(false)
    expect(result.logs[0]!.text).toContain('no passage')
  })

  it('blocks locked door without key', () => {
    const result = validateMove(baseRoom, 'east', [], new Set())
    expect(result.allowed).toBe(false)
    expect(result.logs[0]!.text).toBe('Locked!')
  })

  it('unlocks door when player has key', () => {
    const inventory = [{ id: 'key', name: 'Key', description: 'A key', type: 'misc' as const, value: 0 }]
    const result = validateMove(baseRoom, 'east', inventory, new Set())
    expect(result.allowed).toBe(true)
    expect(result.logs[0]!.text).toContain('use the Key')
  })

  it('blocks unrevealed hidden exits', () => {
    const result = validateMove(baseRoom, 'south', [], new Set(), undefined, new Set())
    expect(result.allowed).toBe(false)
    expect(result.logs[0]!.text).toContain('no passage')
  })

  it('allows revealed hidden exits', () => {
    const revealed = new Set(['test-room-south'])
    const result = validateMove(baseRoom, 'south', [], new Set(), undefined, revealed)
    expect(result.allowed).toBe(true)
  })
})
