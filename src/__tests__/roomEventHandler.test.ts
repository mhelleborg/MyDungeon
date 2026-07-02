import { describe, it, expect } from 'vitest'
import { eligibleRoomEvents, type RoomEventContext } from '../engine/handlers/roomEventHandler'
import type { Room } from '../types/room'

function makeRoom(events: Room['events']): Room {
  return {
    id: 'test-room',
    name: 'Test Room',
    description: 'A test room.',
    exits: [],
    events,
    gridX: 0,
    gridY: 0,
  }
}

function makeCtx(overrides: Partial<RoomEventContext> = {}): RoomEventContext {
  return {
    roomCleared: false,
    revealedExits: new Set(),
    choicesMade: {},
    firedRoomEvents: new Set(),
    ...overrides,
  }
}

describe('eligibleRoomEvents', () => {
  it('returns nothing for a room without events', () => {
    expect(eligibleRoomEvents(makeRoom(undefined), makeCtx())).toEqual([])
  })

  it('fires unconditional events', () => {
    const room = makeRoom([{ effect: { type: 'status-effect', effectId: 'blessed' } }])
    expect(eligibleRoomEvents(room, makeCtx())).toHaveLength(1)
  })

  it('respects roomCleared condition', () => {
    const room = makeRoom([{ when: { roomCleared: true }, effect: { type: 'choice', choiceId: 'c1' } }])
    expect(eligibleRoomEvents(room, makeCtx())).toHaveLength(0)
    expect(eligibleRoomEvents(room, makeCtx({ roomCleared: true }))).toHaveLength(1)
  })

  it('respects exitRevealed condition', () => {
    const room = makeRoom([{ when: { exitRevealed: 'west' }, effect: { type: 'choice', choiceId: 'c1' } }])
    expect(eligibleRoomEvents(room, makeCtx())).toHaveLength(0)
    expect(eligibleRoomEvents(room, makeCtx({ revealedExits: new Set(['test-room-west']) }))).toHaveLength(1)
  })

  it('respects choiceMade condition', () => {
    const room = makeRoom([{ when: { choiceMade: 'farewell-path' }, effect: { type: 'victory' } }])
    expect(eligibleRoomEvents(room, makeCtx())).toHaveLength(0)
    expect(eligibleRoomEvents(room, makeCtx({ choicesMade: { 'farewell-path': 'boats' } }))).toHaveLength(1)
  })

  it('never re-presents a choice that has been made', () => {
    const room = makeRoom([{ effect: { type: 'choice', choiceId: 'c1' } }])
    expect(eligibleRoomEvents(room, makeCtx({ choicesMade: { c1: 'a' } }))).toHaveLength(0)
  })

  it('fires once-only events a single time', () => {
    const room = makeRoom([
      { id: 'ev1', once: true, effect: { type: 'narration', lines: [{ text: 'Hello' }] } },
    ])
    expect(eligibleRoomEvents(room, makeCtx())).toHaveLength(1)
    expect(eligibleRoomEvents(room, makeCtx({ firedRoomEvents: new Set(['ev1']) }))).toHaveLength(0)
  })

  it('evaluates multiple events independently', () => {
    const room = makeRoom([
      { effect: { type: 'narration', lines: [{ text: 'Always' }] } },
      { when: { roomCleared: true }, effect: { type: 'choice', choiceId: 'c1' } },
    ])
    const fired = eligibleRoomEvents(room, makeCtx())
    expect(fired).toHaveLength(1)
    expect(fired[0]!.effect.type).toBe('narration')
  })
})
