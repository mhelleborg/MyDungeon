import type { Region, RegionId } from '../../types/region'
import { entry, type HandlerResult } from './types'

/** A fast-travel destination the player has discovered. */
export interface WaypointInfo {
  roomId: string
  label: string
  regionId: RegionId
  regionName: string
}

/** All waypoints the player has discovered, in world order. */
export function listDiscoveredWaypoints(
  regions: Region[],
  visitedRooms: ReadonlySet<string>,
): WaypointInfo[] {
  const result: WaypointInfo[] = []
  for (const region of regions) {
    for (const room of Object.values(region.rooms)) {
      if (room.waypoint && visitedRooms.has(room.id)) {
        result.push({
          roomId: room.id,
          label: room.waypointLabel ?? room.name,
          regionId: region.id,
          regionName: region.name,
        })
      }
    }
  }
  return result
}

export interface TravelCheck {
  allowed: boolean
  target?: WaypointInfo
  logs: HandlerResult['logs']
}

/**
 * Pure validation: can the player fast-travel, and to where?
 * Matches the query against waypoint labels, room ids, then region names
 * (a region match resolves to its first discovered waypoint).
 */
export function validateTravel(
  query: string | undefined,
  waypoints: WaypointInfo[],
  currentRoomId: string,
  blockers: { inCombat: boolean; hostilesPresent: boolean; busy: boolean },
): TravelCheck {
  if (blockers.inCombat) {
    return { allowed: false, logs: [entry('You cannot travel while enemies are upon you!', 'error')] }
  }
  if (blockers.hostilesPresent) {
    return { allowed: false, logs: [entry('It is not safe to set out from here — enemies lurk nearby.', 'error')] }
  }
  if (blockers.busy) {
    return { allowed: false, logs: [entry('Finish what is before you first.', 'error')] }
  }
  if (waypoints.length === 0) {
    return { allowed: false, logs: [entry('You know no waypoints yet. Landmarks you discover become places you can travel to.', 'info')] }
  }
  if (!query) {
    const list = waypoints.map(w => `  ${w.label} — ${w.regionName}`)
    return {
      allowed: false,
      logs: [
        entry('Where to? Type "travel <place>" or open the world map. Known waypoints:', 'system'),
        ...list.map(l => entry(l, 'info')),
      ],
    }
  }

  const q = query.toLowerCase()
  const target =
    waypoints.find(w => w.label.toLowerCase().includes(q)) ??
    waypoints.find(w => w.roomId.includes(q)) ??
    waypoints.find(w => w.regionName.toLowerCase().includes(q) || w.regionId.includes(q))

  if (!target) {
    return { allowed: false, logs: [entry(`You know no waypoint called "${query}". Type "travel" to list the places you know.`, 'error')] }
  }
  if (target.roomId === currentRoomId) {
    return { allowed: false, logs: [entry(`You are already at ${target.label}.`, 'info')] }
  }
  return { allowed: true, target, logs: [] }
}

export type RoadEventKind = 'ambush' | 'encounter' | 'none'

const ROAD_AMBUSH_CHANCE = 0.12
const ROAD_ENCOUNTER_CHANCE = 0.25

/** Roll what happens on the road. `random` is injectable for tests. */
export function rollRoadEvent(random: () => number = Math.random): RoadEventKind {
  const roll = random()
  if (roll < ROAD_AMBUSH_CHANCE) return 'ambush'
  if (roll < ROAD_AMBUSH_CHANCE + ROAD_ENCOUNTER_CHANCE) return 'encounter'
  return 'none'
}

/** Narrate the departure and the road, drawing flavor from the destination region. */
export function describeJourney(
  target: WaypointInfo,
  destinationRegion: Region | undefined,
  crossingRegions: boolean,
  random: () => number = Math.random,
): HandlerResult['logs'] {
  const logs = [entry(`You set out for ${target.label}...`, 'system')]
  const flavor = destinationRegion?.travelFlavor
  if (flavor && flavor.length > 0) {
    logs.push(entry(flavor[Math.floor(random() * flavor.length)]!, 'narrative'))
  } else if (crossingRegions) {
    logs.push(entry('The road is long, but your feet know the way.', 'narrative'))
  }
  return logs
}
