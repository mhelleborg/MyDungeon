import { describe, it, expect } from 'vitest'
import { describeRoom, describeLook, getVisibleExits } from '../engine/handlers/roomHandler'
import type { Room } from '../types/room'

const room: Room = {
  id: 'test-room',
  name: 'Test Room',
  description: 'A well-lit room.',
  clearedDescription: 'A room with bodies.',
  exits: [
    { direction: 'north', targetRoomId: 'a' },
    { direction: 'east', targetRoomId: 'b', hidden: true, revealMethod: 'examine' },
  ],
  dark: true,
  gridX: 0,
  gridY: 0,
}

describe('getVisibleExits', () => {
  it('filters out unrevealed hidden exits', () => {
    const exits = getVisibleExits(room, new Set())
    expect(exits).toEqual(['north'])
  })

  it('includes revealed hidden exits', () => {
    const exits = getVisibleExits(room, new Set(['test-room-east']))
    expect(exits).toEqual(['north', 'east'])
  })
})

describe('describeRoom', () => {
  it('shows darkness message when dark', () => {
    const result = describeRoom(room, true, false, [])
    expect(result.logs).toHaveLength(2) // header + darkness
    expect(result.logs[1]!.text).toContain('darkness')
  })

  it('shows room description when lit', () => {
    const result = describeRoom(room, false, false, [])
    expect(result.logs[0]!.text).toContain('Test Room')
    expect(result.logs[1]!.text).toBe('A well-lit room.')
  })

  it('shows cleared description when cleared', () => {
    const result = describeRoom(room, false, true, [])
    expect(result.logs[1]!.text).toBe('A room with bodies.')
  })

  it('lists exits', () => {
    const result = describeRoom(room, false, false, [])
    const exitLog = result.logs.find(l => l.text.startsWith('Exits:'))
    expect(exitLog).toBeDefined()
    expect(exitLog!.text).toContain('north')
  })

  it('lists ground items', () => {
    const result = describeRoom(room, false, false, ['Sword', 'Potion'])
    const itemLog = result.logs.find(l => l.text.startsWith('You see:'))
    expect(itemLog).toBeDefined()
    expect(itemLog!.text).toContain('Sword')
    expect(itemLog!.text).toContain('Potion')
  })

  it('omits item line when no items', () => {
    const result = describeRoom(room, false, false, [])
    const itemLog = result.logs.find(l => l.text.startsWith('You see:'))
    expect(itemLog).toBeUndefined()
  })
})

describe('describeLook', () => {
  it('shows darkness message when dark', () => {
    const result = describeLook(room, true, false, [])
    expect(result.logs).toHaveLength(1)
    expect(result.logs[0]!.text).toContain('darkness')
  })

  it('shows description without header', () => {
    const result = describeLook(room, false, false, [])
    expect(result.logs[0]!.text).toBe('A well-lit room.')
    expect(result.logs.some(l => l.text.includes('---'))).toBe(false)
  })

  it('lists exits and items', () => {
    const result = describeLook(room, false, false, ['Key'])
    expect(result.logs.some(l => l.text.startsWith('Exits:'))).toBe(true)
    expect(result.logs.some(l => l.text.includes('Key'))).toBe(true)
  })
})
