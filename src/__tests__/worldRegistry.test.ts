import { describe, it, expect } from 'vitest'
import { world } from '../data/world'
import type { Region } from '../types/region'

/**
 * Regions are authored independently (sometimes in parallel), and the
 * registry merges their content with last-write-wins semantics for
 * everything except room ids. These tests make id collisions loud.
 */
function findDuplicates(pick: (r: Region) => Record<string, unknown> | undefined): string[] {
  const seen = new Map<string, string>()
  const dupes: string[] = []
  for (const region of Object.values(world)) {
    for (const id of Object.keys(pick(region) ?? {})) {
      const owner = seen.get(id)
      if (owner && owner !== region.id) dupes.push(`${id} (${owner} vs ${region.id})`)
      seen.set(id, region.id)
    }
  }
  return dupes
}

describe('world registry integrity', () => {
  it('has no duplicate enemy ids across regions', () => {
    expect(findDuplicates(r => r.enemies)).toEqual([])
  })

  it('has no duplicate item ids across regions', () => {
    expect(findDuplicates(r => r.items)).toEqual([])
  })

  it('has no duplicate NPC ids across regions', () => {
    expect(findDuplicates(r => r.npcs)).toEqual([])
  })

  it('has no duplicate quest ids across regions', () => {
    expect(findDuplicates(r => r.quests)).toEqual([])
  })

  it('every exit leads to a room that exists somewhere in the world', () => {
    const allRoomIds = new Set(
      Object.values(world).flatMap(r => Object.keys(r.rooms)),
    )
    const broken: string[] = []
    for (const region of Object.values(world)) {
      for (const room of Object.values(region.rooms)) {
        for (const exit of room.exits) {
          if (!allRoomIds.has(exit.targetRoomId)) {
            broken.push(`${room.id} → ${exit.direction} → ${exit.targetRoomId}`)
          }
        }
      }
    }
    expect(broken).toEqual([])
  })

  it('every quest trigger that targets a room points at a real room', () => {
    const allRoomIds = new Set(
      Object.values(world).flatMap(r => Object.keys(r.rooms)),
    )
    const broken: string[] = []
    for (const region of Object.values(world)) {
      for (const quest of Object.values(region.quests ?? {})) {
        const triggers = [quest.start, ...quest.stages.map(s => s.trigger)]
        for (const t of triggers) {
          if ((t.type === 'enter-room' || t.type === 'clear-room') && !allRoomIds.has(t.target)) {
            broken.push(`${quest.id}: ${t.type} → ${t.target}`)
          }
        }
      }
    }
    expect(broken).toEqual([])
  })

  it('every room enemy id resolves in some region enemy db', () => {
    const allEnemyIds = new Set(
      Object.values(world).flatMap(r => Object.keys(r.enemies ?? {})),
    )
    const broken: string[] = []
    for (const region of Object.values(world)) {
      for (const room of Object.values(region.rooms)) {
        for (const e of room.enemies ?? []) {
          if (!allEnemyIds.has(e.enemyId)) broken.push(`${room.id}: ${e.enemyId}`)
        }
      }
    }
    expect(broken).toEqual([])
  })
})
