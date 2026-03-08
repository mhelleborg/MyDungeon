/**
 * gameContext – shared reactive state used by both gameStore and combatStore.
 *
 * This is a plain Vue reactive module (NOT a Pinia store).  Extracting these
 * refs here breaks the circular dependency that previously existed between
 * gameStore ↔ combatStore: both stores import from this module, but never
 * from each other.
 */
import { ref } from 'vue'
import type { DifficultyLevel, DifficultyMultipliers } from '../types/difficulty'
import { difficultySettings } from '../types/difficulty'
import type { Companion } from '../types/companion'
import { STARTING_ROOM } from '../data/rooms'

// ── Shared reactive state ────────────────────────────────────
export const difficulty = ref<DifficultyLevel>('normal')
export const currentRoomId = ref(STARTING_ROOM)
export const roomItems = ref<Record<string, string[]>>({})
export const companions = ref<Companion[]>([])

// ── Helpers ──────────────────────────────────────────────────
export function getDifficultyMultipliers(): DifficultyMultipliers {
  return difficultySettings[difficulty.value]
}

export function dropItemToGround(itemId: string) {
  if (!roomItems.value[currentRoomId.value]) {
    roomItems.value[currentRoomId.value] = []
  }
  roomItems.value[currentRoomId.value]!.push(itemId)
}
