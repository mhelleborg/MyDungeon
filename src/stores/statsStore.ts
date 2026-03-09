import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { PlayerClass } from '../types/character'
import type { DifficultyLevel } from '../types/difficulty'
import type { RunStats } from '../engine/achievements'
import { checkMidRunAchievements as checkMidRun, checkEndOfRunAchievements, achievements } from '../engine/achievements'

const ACHIEVEMENTS_KEY = 'moria-achievements'

export const useStatsStore = defineStore('stats', () => {
  // ── Per-run stats ────────────────────────────────────────
  const roomsExplored = ref(0)
  const totalRooms = ref(0)
  const enemiesKilled = ref(0)
  const damageDealt = ref(0)
  const damageTaken = ref(0)
  const itemsFound = ref(0)
  const potionsUsed = ref(0)
  const puzzlesSolved = ref(0)
  const secretsFound = ref(0)
  const sneakSuccesses = ref(0)
  const fleeAttempts = ref(0)
  const startTime = ref(0)
  const playerClass = ref<PlayerClass>('ranger')
  const difficulty = ref<DifficultyLevel>('normal')
  const balrogSlain = ref(false)
  const foundItems = ref<string[]>([])
  const itemsCrafted = ref(0)

  // ── Persistent achievements ──────────────────────────────
  const unlockedAchievements = ref<Set<string>>(loadAchievements())
  const newlyUnlocked = ref<string[]>([])

  // ── Toast queue for mid-run achievements ───────────────
  interface AchievementToast {
    id: string
    name: string
    description: string
    icon: string
  }
  const toastQueue = ref<AchievementToast[]>([])

  function loadAchievements(): Set<string> {
    try {
      const stored = localStorage.getItem(ACHIEVEMENTS_KEY)
      if (stored) return new Set(JSON.parse(stored))
    } catch { /* ignore */ }
    return new Set()
  }

  function saveAchievements() {
    try {
      localStorage.setItem(ACHIEVEMENTS_KEY, JSON.stringify([...unlockedAchievements.value]))
    } catch { /* ignore */ }
  }

  // ── Init for new run ─────────────────────────────────────
  function initStats(cls: PlayerClass, diff: DifficultyLevel, roomCount: number) {
    roomsExplored.value = 0
    totalRooms.value = roomCount
    enemiesKilled.value = 0
    damageDealt.value = 0
    damageTaken.value = 0
    itemsFound.value = 0
    potionsUsed.value = 0
    puzzlesSolved.value = 0
    secretsFound.value = 0
    sneakSuccesses.value = 0
    fleeAttempts.value = 0
    startTime.value = Date.now()
    playerClass.value = cls
    difficulty.value = diff
    balrogSlain.value = false
    foundItems.value = []
    itemsCrafted.value = 0
    newlyUnlocked.value = []
  }

  // ── Stat recording (called by stores) ────────────────────
  function recordRoomExplored() { roomsExplored.value++ }
  function recordEnemyKilled() { enemiesKilled.value++ }
  function recordDamageDealt(amount: number) { damageDealt.value += amount }
  function recordDamageTaken(amount: number) { damageTaken.value += amount }
  function recordItemFound(itemId: string) {
    itemsFound.value++
    if (!foundItems.value.includes(itemId)) foundItems.value.push(itemId)
  }
  function recordPotionUsed() { potionsUsed.value++ }
  function recordPuzzleSolved() { puzzlesSolved.value++ }
  function recordSecretFound() { secretsFound.value++ }
  function recordSneakSuccess() { sneakSuccesses.value++ }
  function recordFleeAttempt() { fleeAttempts.value++ }
  function recordBalrogSlain() { balrogSlain.value = true }
  function recordItemCrafted() { itemsCrafted.value++ }

  function dismissToast(id: string) {
    toastQueue.value = toastQueue.value.filter(t => t.id !== id)
  }

  function buildRunStats(): RunStats {
    return {
      roomsExplored: roomsExplored.value,
      totalRooms: totalRooms.value,
      enemiesKilled: enemiesKilled.value,
      damageDealt: damageDealt.value,
      damageTaken: damageTaken.value,
      itemsFound: itemsFound.value,
      potionsUsed: potionsUsed.value,
      puzzlesSolved: puzzlesSolved.value,
      secretsFound: secretsFound.value,
      sneakSuccesses: sneakSuccesses.value,
      fleeAttempts: fleeAttempts.value,
      startTime: startTime.value,
      playerClass: playerClass.value,
      difficulty: difficulty.value,
      balrogSlain: balrogSlain.value,
      itemsCrafted: itemsCrafted.value,
    }
  }

  function unlockEarned(earned: string[]) {
    for (const id of earned) {
      if (!unlockedAchievements.value.has(id)) {
        unlockedAchievements.value.add(id)
        const ach = achievements[id]
        if (ach) {
          toastQueue.value.push({ id: ach.id, name: ach.name, description: ach.description, icon: ach.icon })
          setTimeout(() => dismissToast(ach.id), 5000)
        }
      }
    }
    saveAchievements()
  }

  function checkMidRunAchievements() {
    unlockEarned(checkMidRun(buildRunStats(), foundItems.value))
  }

  // ── End-of-run achievement check ─────────────────────────
  function checkEndOfRun(): string[] {
    const earned = checkEndOfRunAchievements(buildRunStats(), foundItems.value)
    const fresh = earned.filter(id => !unlockedAchievements.value.has(id))

    unlockEarned(earned)

    newlyUnlocked.value = fresh
    return fresh
  }

  const allAchievements = computed(() => {
    return Object.values(achievements).map(a => ({
      ...a,
      unlocked: unlockedAchievements.value.has(a.id),
    }))
  })

  return {
    // Per-run stats
    roomsExplored,
    totalRooms,
    enemiesKilled,
    damageDealt,
    damageTaken,
    itemsFound,
    potionsUsed,
    puzzlesSolved,
    secretsFound,
    sneakSuccesses,
    fleeAttempts,
    startTime,
    playerClass,
    difficulty,
    balrogSlain,
    foundItems,
    // Achievements
    unlockedAchievements,
    newlyUnlocked,
    allAchievements,
    toastQueue,
    // Actions
    initStats,
    dismissToast,
    checkMidRunAchievements,
    recordRoomExplored,
    recordEnemyKilled,
    recordDamageDealt,
    recordDamageTaken,
    recordItemFound,
    recordPotionUsed,
    recordPuzzleSolved,
    recordSecretFound,
    recordSneakSuccess,
    recordFleeAttempt,
    recordBalrogSlain,
    recordItemCrafted,
    checkEndOfRun,
  }
})
