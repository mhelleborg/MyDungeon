import type { RegionId } from '../types/region'

/**
 * World-map presentation data: where regions sit on the map of Middle-earth,
 * which roads connect them, and which lands are shown as not-yet-open teasers.
 * Coordinates live in the WorldMap.vue SVG space (0–1000 × 0–640).
 */

/** A region that does not exist yet — shown greyed out to hint at the road ahead. */
export interface FutureRegion {
  id: string
  name: string
  mapPosition: { x: number; y: number }
  hint: string
}

export const futureRegions: FutureRegion[] = [
  { id: 'isengard', name: 'Isengard', mapPosition: { x: 240, y: 500 }, hint: 'A tower of black stone, and a wizard within' },
]

/** Roads drawn on the world map. `future` routes lead to lands not yet open. */
export interface MapRoute {
  from: RegionId
  to: string
  future?: boolean
}

export const mapRoutes: MapRoute[] = [
  { from: 'rivendell', to: 'moria' },
  { from: 'moria', to: 'lothlorien' },
  { from: 'lothlorien', to: 'mirkwood' },
  { from: 'lothlorien', to: 'fangorn' },
  { from: 'fangorn', to: 'rohan' },
  { from: 'isengard', to: 'fangorn', future: true },
]
