import { describe, it, expect } from 'vitest'
import {
  listDiscoveredWaypoints,
  validateTravel,
  rollRoadEvent,
  describeJourney,
  type WaypointInfo,
} from '../engine/handlers/travelHandler'
import { parseCommand } from '../engine/commandParser'
import { world } from '../data/world'

const noBlockers = { inCombat: false, hostilesPresent: false, busy: false }

const waypoints: WaypointInfo[] = [
  { roomId: 'gates-of-moria', label: 'The Doors of Durin', regionId: 'moria', regionName: 'The Mines of Moria' },
  { roomId: 'east-gate', label: 'The East Gate', regionId: 'moria', regionName: 'The Mines of Moria' },
  { roomId: 'dimrill-dale', label: 'Dimrill Dale', regionId: 'lothlorien', regionName: 'Lothlórien' },
]

describe('parseCommand travel', () => {
  it('parses travel with a destination', () => {
    expect(parseCommand('travel east gate')).toEqual({ type: 'travel', target: 'east gate', raw: 'travel east gate' })
  })
  it('parses bare travel and journey alias', () => {
    expect(parseCommand('travel').type).toBe('travel')
    expect(parseCommand('journey dimrill').type).toBe('travel')
  })
})

describe('listDiscoveredWaypoints', () => {
  it('only lists waypoint rooms the player has visited', () => {
    const visited = new Set(['gates-of-moria', 'entrance-hall', 'dimrill-dale'])
    const found = listDiscoveredWaypoints(Object.values(world), visited)
    expect(found.map(w => w.roomId).sort()).toEqual(['dimrill-dale', 'gates-of-moria'])
  })

  it('carries region info and labels', () => {
    const found = listDiscoveredWaypoints(Object.values(world), new Set(['east-gate']))
    expect(found).toEqual([
      { roomId: 'east-gate', label: 'The East Gate', regionId: 'moria', regionName: 'The Mines of Moria' },
    ])
  })
})

describe('validateTravel', () => {
  it('blocks travel in combat', () => {
    const check = validateTravel('east gate', waypoints, 'gates-of-moria', { ...noBlockers, inCombat: true })
    expect(check.allowed).toBe(false)
    expect(check.logs[0]!.text).toContain('cannot travel')
  })

  it('blocks travel with hostiles present', () => {
    const check = validateTravel('east gate', waypoints, 'gates-of-moria', { ...noBlockers, hostilesPresent: true })
    expect(check.allowed).toBe(false)
    expect(check.logs[0]!.text).toContain('not safe')
  })

  it('blocks travel while busy with a choice or dialogue', () => {
    const check = validateTravel('east gate', waypoints, 'gates-of-moria', { ...noBlockers, busy: true })
    expect(check.allowed).toBe(false)
  })

  it('lists waypoints when no destination is given', () => {
    const check = validateTravel(undefined, waypoints, 'gates-of-moria', noBlockers)
    expect(check.allowed).toBe(false)
    const text = check.logs.map(l => l.text).join('\n')
    expect(text).toContain('The East Gate')
    expect(text).toContain('Dimrill Dale')
  })

  it('explains when no waypoints are known', () => {
    const check = validateTravel('east gate', [], 'gates-of-moria', noBlockers)
    expect(check.allowed).toBe(false)
    expect(check.logs[0]!.text).toContain('no waypoints')
  })

  it('matches waypoints by label, case-insensitive', () => {
    const check = validateTravel('east gate', waypoints, 'gates-of-moria', noBlockers)
    expect(check.allowed).toBe(true)
    expect(check.target?.roomId).toBe('east-gate')
  })

  it('matches by region name as a fallback', () => {
    const check = validateTravel('lothlorien', waypoints, 'gates-of-moria', noBlockers)
    expect(check.allowed).toBe(true)
    expect(check.target?.roomId).toBe('dimrill-dale')
  })

  it('rejects unknown destinations', () => {
    const check = validateTravel('mordor', waypoints, 'gates-of-moria', noBlockers)
    expect(check.allowed).toBe(false)
    expect(check.logs[0]!.text).toContain('no waypoint called')
  })

  it('rejects travelling to where you already are', () => {
    const check = validateTravel('doors of durin', waypoints, 'gates-of-moria', noBlockers)
    expect(check.allowed).toBe(false)
    expect(check.logs[0]!.text).toContain('already at')
  })
})

describe('rollRoadEvent', () => {
  it('rolls ambush, encounter and none by threshold', () => {
    expect(rollRoadEvent(() => 0.05)).toBe('ambush')
    expect(rollRoadEvent(() => 0.2)).toBe('encounter')
    expect(rollRoadEvent(() => 0.9)).toBe('none')
  })
})

describe('describeJourney', () => {
  it('narrates departure with destination flavor', () => {
    const logs = describeJourney(waypoints[2]!, world['lothlorien'], true, () => 0)
    expect(logs[0]!.text).toContain('You set out for Dimrill Dale')
    expect(logs[1]!.text).toBe(world['lothlorien']!.travelFlavor![0])
  })

  it('falls back to generic narration when the region has no flavor', () => {
    const bare = { ...world['moria']!, travelFlavor: undefined }
    const logs = describeJourney(waypoints[1]!, bare, true, () => 0)
    expect(logs).toHaveLength(2)
    expect(logs[1]!.text).toContain('road is long')
  })
})
