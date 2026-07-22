<script setup lang="ts">
import StoryFeed from '../components/StoryFeed.vue'
import RoomContextBar from '../components/RoomContextBar.vue'
import ActionChips from '../components/ActionChips.vue'
import CombatHud from '../components/CombatHud.vue'
import CommandInput from '../components/CommandInput.vue'
import BottomSheet from '../components/BottomSheet.vue'
import PlayerStats from '../components/PlayerStats.vue'
import InventoryPanel from '../components/InventoryPanel.vue'
import MiniMap from '../components/MiniMap.vue'
import WorldMap from '../components/WorldMap.vue'
import QuestJournal from '../components/QuestJournal.vue'
import GameMenu from '../components/GameMenu.vue'
import AchievementToast from '../components/AchievementToast.vue'
import FloaterLayer from '../components/FloaterLayer.vue'
import { useGameStore } from '../stores/gameStore'
import { useCombatStore } from '../stores/combatStore'
import { usePlayerStore } from '../stores/playerStore'
import { useStatsStore } from '../stores/statsStore'
import { formatElapsed } from '../engine/achievements'
import { isSoundEnabled, setSoundEnabled } from '../engine/audio'
import { useKeyboardShortcuts } from '../composables/useKeyboardShortcuts'
import { useFloaters } from '../composables/useFloaters'
import { useQuestStore } from '../stores/questStore'
import { computed, nextTick, ref, watch } from 'vue'

const gameStore = useGameStore()
const combatStore = useCombatStore()
const playerStore = usePlayerStore()
const statsStore = useStatsStore()
const questStore = useQuestStore()

useKeyboardShortcuts()

// Screen effects
const screenEffect = ref('')
let effectTimer: ReturnType<typeof setTimeout> | null = null

function triggerEffect(effect: string) {
  if (effectTimer) clearTimeout(effectTimer)
  screenEffect.value = effect
  effectTimer = setTimeout(() => { screenEffect.value = '' }, 500)
}

// Watch for damage taken to trigger screen effects
watch(() => playerStore.player?.hp, (newHp, oldHp) => {
  if (newHp !== undefined && oldHp !== undefined && newHp < oldHp) {
    const dmg = oldHp - newHp
    triggerEffect(dmg >= 10 ? 'screen-shake screen-flash-red' : 'screen-flash-red')
  }
})

// Watch for level up
watch(() => playerStore.player?.level, (newLvl, oldLvl) => {
  if (newLvl !== undefined && oldLvl !== undefined && newLvl > oldLvl) {
    triggerEffect('screen-flash-gold')
  }
})

// Combat start flash
watch(() => combatStore.inCombat, (now, prev) => {
  if (now && !prev) triggerEffect('screen-flash-combat-start')
})

// Critical hit flash
watch(() => combatStore.lastCritical, (val) => {
  if (val) {
    triggerEffect('screen-crit-hit')
    combatStore.lastCritical = false
  }
})

// Low HP blood vignette
const lowHpIntensity = computed(() => {
  const p = playerStore.player
  if (!p) return 0
  const ratio = p.hp / p.maxHp
  if (ratio >= 0.3) return 0
  return Math.min(1, (0.3 - ratio) / 0.3)
})

// Sound toggle
const soundOn = ref(isSoundEnabled())
function toggleSound() {
  soundOn.value = !soundOn.value
  setSoundEnabled(soundOn.value)
}

const hpPercent = computed(() => {
  const p = playerStore.player
  if (!p) return 0
  return Math.max(0, Math.round((p.hp / p.maxHp) * 100))
})

const hpBarColor = computed(() => {
  if (hpPercent.value > 60) return 'bg-moria-success'
  if (hpPercent.value > 30) return 'bg-amber-500'
  return 'bg-moria-danger'
})

// ── Bottom sheets (mobile) ─────────────────────────────────
type SheetId = 'map' | 'hero' | 'pack' | 'quests'
const activeSheet = ref<SheetId | null>(null)
const sheetTitle: Record<SheetId, string> = {
  map: 'MAP', hero: 'HERO', pack: 'PACK', quests: 'QUESTS',
}
function toggleSheet(id: SheetId) {
  activeSheet.value = activeSheet.value === id ? null : id
}

const questCount = computed(() => questStore.activeQuests.length)

// ── Command input ──────────────────────────────────────────
// Always visible on desktop; opened on demand on mobile.
const mobileInputOpen = ref(false)
const mobileInput = ref<InstanceType<typeof CommandInput> | null>(null)
const desktopInput = ref<InstanceType<typeof CommandInput> | null>(null)

async function openCommandInput() {
  activeSheet.value = null
  mobileInputOpen.value = true
  await nextTick()
  mobileInput.value?.focus()
  desktopInput.value?.focus()
}

// Floating numbers anchored to the header HP bar
const playerHpAnchor = ref<HTMLElement | null>(null)
const { spawn: spawnFloater } = useFloaters()
let lastSeenHitIndex = combatStore.hitEvents.length

watch(
  () => combatStore.hitEvents.length,
  (len) => {
    if (len < lastSeenHitIndex) lastSeenHitIndex = 0
    const events = combatStore.hitEvents.slice(lastSeenHitIndex)
    lastSeenHitIndex = len
    for (const ev of events) {
      if (ev.targetId !== 'player') continue
      spawnFloater(playerHpAnchor.value, { value: ev.value, kind: ev.kind })
    }
  },
)
</script>

<template>
  <div class="h-[100dvh] flex flex-col bg-moria-bg" :class="screenEffect">
    <!-- Header: identity + vitals + menu -->
    <header class="flex items-center px-3 py-1.5 md:px-4 md:py-2 gap-2.5 border-b border-moria-border bg-moria-panel/50 shrink-0">
      <h1 class="text-sm md:text-lg font-bold text-moria-highlight tracking-wider whitespace-nowrap">MORIA</h1>
      <div v-if="playerStore.player" ref="playerHpAnchor" class="flex items-center gap-1.5 flex-1 min-w-0">
        <span class="text-moria-info text-[10px] md:text-xs">HP</span>
        <div class="flex-1 max-w-36 h-2.5 bg-moria-bg rounded overflow-hidden">
          <div :class="hpBarColor" class="h-full transition-all duration-300" :style="{ width: hpPercent + '%' }"></div>
        </div>
        <span class="text-moria-text text-[11px] md:text-xs font-mono whitespace-nowrap">{{ playerStore.player.hp }}/{{ playerStore.player.maxHp }}</span>
        <span class="hidden sm:inline text-moria-info text-[10px] md:text-xs whitespace-nowrap ml-1">
          Lv {{ playerStore.player.level }} · <span class="text-amber-400">{{ playerStore.player.gold }}g</span>
        </span>
      </div>
      <div v-if="playerStore.player" class="flex items-center gap-1.5 shrink-0">
        <a
          href="https://github.com/mhelleborg/MyDungeon/issues/new"
          target="_blank"
          rel="noopener"
          class="hidden md:inline-block text-xs px-2 py-1 border border-moria-border text-moria-info rounded hover:text-moria-highlight hover:border-moria-highlight/50 transition-colors"
          title="Send feedback or ideas"
        >FEEDBACK</a>
        <button
          @click="toggleSound"
          class="text-[10px] md:text-xs px-2 py-1.5 md:py-1 border rounded transition-colors cursor-pointer"
          :class="soundOn
            ? 'border-moria-highlight/50 text-moria-highlight'
            : 'border-moria-border text-moria-info'"
          :title="soundOn ? 'Sound On' : 'Sound Off'"
        >{{ soundOn ? 'SND' : 'MUTE' }}</button>
        <button
          @click="gameStore.menuOpen = true"
          class="text-[10px] md:text-xs px-2 py-1.5 md:py-1 border border-moria-border text-moria-info rounded
                 hover:text-moria-highlight hover:border-moria-highlight/50 transition-colors cursor-pointer"
          title="Menu (Esc)"
        >☰ MENU</button>
      </div>
    </header>

    <!-- Where am I + exits -->
    <RoomContextBar />

    <!-- Main content -->
    <div class="flex-1 flex overflow-hidden min-h-0">
      <!-- Center column: the story + the dock -->
      <div class="flex-1 flex flex-col min-w-0 min-h-0">
        <StoryFeed />

        <!-- Action dock -->
        <div class="shrink-0 border-t border-moria-border bg-moria-panel/60 px-2 pt-2 md:px-3 space-y-2
                    pb-[max(0.5rem,env(safe-area-inset-bottom))] md:pb-3">
          <CombatHud />
          <div class="max-h-[30vh] overflow-y-auto">
            <ActionChips @request-input="openCommandInput" />
          </div>

          <!-- Command input: on-demand on mobile, persistent on desktop -->
          <div v-if="mobileInputOpen" class="md:hidden flex items-center gap-1.5">
            <CommandInput ref="mobileInput" class="flex-1" />
            <button
              @click="mobileInputOpen = false"
              class="min-w-[44px] min-h-[44px] rounded border border-moria-border text-moria-info cursor-pointer"
              aria-label="Hide command input"
            >✕</button>
          </div>
          <div class="hidden md:block">
            <CommandInput ref="desktopInput" autofocus />
          </div>
        </div>

        <!-- Mobile nav -->
        <nav class="md:hidden flex border-t border-moria-border bg-moria-panel/80 shrink-0
                    pb-[env(safe-area-inset-bottom)]">
          <button
            v-for="id in (['map', 'hero', 'pack', 'quests'] as const)"
            :key="id"
            @click="toggleSheet(id)"
            class="flex-1 min-h-[48px] text-[11px] font-bold tracking-wider text-center transition-colors cursor-pointer"
            :class="activeSheet === id ? 'text-moria-highlight bg-moria-highlight/10' : 'text-moria-info'"
          >
            {{ sheetTitle[id] }}<span v-if="id === 'quests' && questCount > 0" class="text-moria-highlight ml-0.5">•</span>
          </button>
          <button
            @click="mobileInputOpen ? mobileInputOpen = false : openCommandInput()"
            class="flex-1 min-h-[48px] text-sm font-bold text-center transition-colors cursor-pointer"
            :class="mobileInputOpen ? 'text-moria-highlight bg-moria-highlight/10' : 'text-moria-info'"
            aria-label="Toggle command input"
          >⌨</button>
        </nav>
      </div>

      <!-- Desktop sidebar -->
      <aside class="hidden md:flex w-72 flex-col gap-3 p-3 border-l border-moria-border overflow-y-auto shrink-0">
        <PlayerStats />
        <InventoryPanel />
        <QuestJournal />
        <MiniMap />
        <button
          @click="gameStore.worldMapOpen = true"
          class="w-full px-3 py-2 border border-moria-border rounded text-moria-highlight text-xs font-bold tracking-wider
                 hover:border-moria-highlight hover:bg-moria-highlight/10 transition-colors cursor-pointer"
        >🗺 WORLD MAP <span class="text-moria-info font-normal">(M)</span></button>
      </aside>
    </div>

    <!-- Mobile bottom sheets -->
    <BottomSheet v-if="activeSheet" :title="sheetTitle[activeSheet]" @close="activeSheet = null">
      <PlayerStats v-if="activeSheet === 'hero'" />
      <InventoryPanel v-if="activeSheet === 'pack'" />
      <QuestJournal v-if="activeSheet === 'quests'" />
      <template v-if="activeSheet === 'map'">
        <MiniMap />
        <button
          @click="gameStore.worldMapOpen = true; activeSheet = null"
          class="w-full mt-2 px-3 py-2.5 min-h-[44px] border border-moria-border rounded text-moria-highlight text-xs font-bold tracking-wider
                 hover:border-moria-highlight transition-colors cursor-pointer"
        >🗺 WORLD MAP</button>
      </template>
    </BottomSheet>

    <!-- Low HP blood vignette -->
    <div
      v-if="lowHpIntensity > 0"
      class="fixed inset-0 pointer-events-none z-40"
      :class="{ 'animate-blood-pulse': lowHpIntensity > 0.5 }"
      :style="{
        boxShadow: `inset 0 0 ${60 + lowHpIntensity * 80}px rgba(192, 57, 43, ${0.2 + lowHpIntensity * 0.5})`
      }"
    ></div>

    <AchievementToast />
    <FloaterLayer />

    <!-- World map overlay -->
    <WorldMap v-if="gameStore.worldMapOpen" />

    <!-- Game menu overlay -->
    <GameMenu v-if="gameStore.menuOpen" />

    <!-- Game Over overlay -->
    <div v-if="gameStore.phase === 'game-over'" class="fixed inset-0 bg-black/80 flex items-center justify-center z-50 overflow-y-auto p-4">
      <div class="text-center p-6 sm:p-8 max-w-md w-full">
        <h2 class="text-2xl sm:text-4xl font-bold text-moria-danger mb-3 sm:mb-4">YOU HAVE FALLEN</h2>
        <p class="text-moria-text text-sm sm:text-base mb-4 sm:mb-6">The darkness of Moria claims another soul...</p>

        <!-- Run Stats -->
        <div class="bg-moria-panel/50 border border-moria-border rounded p-3 sm:p-4 mb-4 sm:mb-6 text-left">
          <h3 class="text-moria-highlight font-bold text-xs sm:text-sm mb-2 text-center">RUN STATS</h3>
          <div class="grid grid-cols-2 gap-1 text-[11px] sm:text-xs font-mono">
            <span class="text-moria-info">Rooms explored</span>
            <span class="text-moria-text text-right">{{ statsStore.roomsExplored }} / {{ statsStore.totalRooms }}</span>
            <span class="text-moria-info">Enemies slain</span>
            <span class="text-moria-text text-right">{{ statsStore.enemiesKilled }}</span>
            <span class="text-moria-info">Damage dealt</span>
            <span class="text-moria-text text-right">{{ statsStore.damageDealt }}</span>
            <span class="text-moria-info">Damage taken</span>
            <span class="text-moria-text text-right">{{ statsStore.damageTaken }}</span>
            <span class="text-moria-info">Items found</span>
            <span class="text-moria-text text-right">{{ statsStore.itemsFound }}</span>
            <span class="text-moria-info">Potions used</span>
            <span class="text-moria-text text-right">{{ statsStore.potionsUsed }}</span>
            <span class="text-moria-info">Time</span>
            <span class="text-moria-text text-right">{{ formatElapsed(statsStore.startTime) }}</span>
          </div>
        </div>

        <button
          @click="gameStore.phase = 'title'"
          class="w-full sm:w-auto px-6 py-2.5 bg-moria-border text-moria-highlight rounded hover:bg-moria-highlight hover:text-moria-bg cursor-pointer min-h-[44px]"
        >TRY AGAIN</button>
      </div>
    </div>

    <!-- Victory overlay -->
    <div v-if="gameStore.phase === 'victory'" class="fixed inset-0 bg-black/80 flex items-center justify-center z-50 overflow-y-auto p-4">
      <div class="text-center p-6 sm:p-8 max-w-md w-full">
        <h2 class="text-2xl sm:text-4xl font-bold text-moria-highlight mb-3 sm:mb-4">VICTORY!</h2>
        <p class="text-moria-text text-sm sm:text-base mb-2">You have crossed the Mines of Moria!</p>
        <p class="text-moria-info text-sm mb-3 sm:mb-4">The light of day greets you once more.</p>

        <!-- Run Stats -->
        <div class="bg-moria-panel/50 border border-moria-border rounded p-3 sm:p-4 mb-3 sm:mb-4 text-left">
          <h3 class="text-moria-highlight font-bold text-xs sm:text-sm mb-2 text-center">RUN STATS</h3>
          <div class="grid grid-cols-2 gap-1 text-[11px] sm:text-xs font-mono">
            <span class="text-moria-info">Rooms explored</span>
            <span class="text-moria-text text-right">{{ statsStore.roomsExplored }} / {{ statsStore.totalRooms }}</span>
            <span class="text-moria-info">Enemies slain</span>
            <span class="text-moria-text text-right">{{ statsStore.enemiesKilled }}</span>
            <span class="text-moria-info">Damage dealt</span>
            <span class="text-moria-text text-right">{{ statsStore.damageDealt }}</span>
            <span class="text-moria-info">Damage taken</span>
            <span class="text-moria-text text-right">{{ statsStore.damageTaken }}</span>
            <span class="text-moria-info">Items found</span>
            <span class="text-moria-text text-right">{{ statsStore.itemsFound }}</span>
            <span class="text-moria-info">Potions used</span>
            <span class="text-moria-text text-right">{{ statsStore.potionsUsed }}</span>
            <span class="text-moria-info">Puzzles solved</span>
            <span class="text-moria-text text-right">{{ statsStore.puzzlesSolved }}</span>
            <span class="text-moria-info">Secrets found</span>
            <span class="text-moria-text text-right">{{ statsStore.secretsFound }}</span>
            <span class="text-moria-info">Time</span>
            <span class="text-moria-text text-right">{{ formatElapsed(statsStore.startTime) }}</span>
          </div>
        </div>

        <!-- New Achievements -->
        <div v-if="statsStore.newlyUnlocked.length > 0" class="bg-moria-panel/50 border border-moria-highlight/50 rounded p-3 sm:p-4 mb-3 sm:mb-4">
          <h3 class="text-moria-highlight font-bold text-xs sm:text-sm mb-2">NEW ACHIEVEMENTS</h3>
          <div v-for="id in statsStore.newlyUnlocked" :key="id" class="flex items-center gap-2 text-left mb-1">
            <span class="text-moria-highlight font-bold text-xs w-5 text-center">{{ statsStore.allAchievements.find(a => a.id === id)?.icon }}</span>
            <div>
              <span class="text-moria-text text-xs font-bold">{{ statsStore.allAchievements.find(a => a.id === id)?.name }}</span>
              <span class="text-moria-info text-xs ml-2">{{ statsStore.allAchievements.find(a => a.id === id)?.description }}</span>
            </div>
          </div>
        </div>

        <!-- All Achievements -->
        <div class="bg-moria-panel/50 border border-moria-border rounded p-3 sm:p-4 mb-4 sm:mb-6">
          <h3 class="text-moria-highlight font-bold text-xs sm:text-sm mb-2">ACHIEVEMENTS ({{ statsStore.allAchievements.filter(a => a.unlocked).length }}/{{ statsStore.allAchievements.length }})</h3>
          <div class="grid grid-cols-2 gap-1 text-left">
            <div v-for="a in statsStore.allAchievements" :key="a.id" class="flex items-center gap-1" :class="a.unlocked ? '' : 'opacity-40'">
              <span class="text-xs font-bold w-4 text-center" :class="a.unlocked ? 'text-moria-highlight' : 'text-moria-border'">{{ a.icon }}</span>
              <span class="text-xs" :class="a.unlocked ? 'text-moria-text' : 'text-moria-border'">{{ a.name }}</span>
            </div>
          </div>
        </div>

        <div class="flex flex-col sm:flex-row gap-2 justify-center">
          <button
            @click="gameStore.phase = 'playing'"
            class="w-full sm:w-auto px-6 py-2.5 bg-moria-highlight text-moria-bg font-bold rounded hover:bg-moria-highlight/80 cursor-pointer min-h-[44px]"
          >CONTINUE EXPLORING</button>
          <button
            @click="gameStore.phase = 'title'"
            class="w-full sm:w-auto px-6 py-2.5 bg-moria-border text-moria-highlight rounded hover:bg-moria-highlight hover:text-moria-bg cursor-pointer min-h-[44px]"
          >PLAY AGAIN</button>
        </div>
      </div>
    </div>
  </div>
</template>
