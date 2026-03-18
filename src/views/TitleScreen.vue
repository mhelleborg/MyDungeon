<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useGameStore } from '../stores/gameStore'
import { hasSaveGame, loadGame, getSaveTimestamp } from '../engine/saveLoad'

const gameStore = useGameStore()
const showContinue = ref(false)
const saveTimestamp = ref<string | null>(null)
const visible = ref(false)

onMounted(() => {
  showContinue.value = hasSaveGame()
  if (showContinue.value) {
    const ts = getSaveTimestamp()
    if (ts) {
      saveTimestamp.value = new Date(ts).toLocaleString()
    }
  }
  setTimeout(() => { visible.value = true }, 100)
})

function continueGame() {
  if (loadGame()) {
    gameStore.phase = 'playing'
  }
}

function startGame() {
  gameStore.phase = 'character-select'
}
</script>

<template>
  <div class="min-h-[100dvh] flex flex-col items-center justify-center bg-moria-bg px-4 py-8 relative overflow-hidden">

    <!-- Floating ember particles -->
    <div class="ember-container" aria-hidden="true">
      <div v-for="i in 14" :key="i" :class="`ember ember-${i}`"></div>
    </div>

    <!-- Radial vignette overlay -->
    <div
      class="absolute inset-0 pointer-events-none"
      style="background: radial-gradient(ellipse at center, transparent 35%, rgba(0,0,0,0.65) 100%)"
    ></div>

    <div class="text-center max-w-xl relative z-10" :class="{ 'content-visible': visible }">

      <!-- Title -->
      <div class="fade-in-item" style="--delay: 0.15s">
        <h1 class="title-glow text-3xl sm:text-5xl font-bold text-moria-highlight mb-2 tracking-widest">
          MINES OF MORIA
        </h1>
        <div class="subtitle-breathe text-moria-border text-xs sm:text-sm tracking-[0.3em] mb-8">
          A DUNGEON OF MIDDLE-EARTH
        </div>
      </div>

      <!-- Doors of Durin ASCII art -->
      <div class="fade-in-item mb-7 relative" style="--delay: 0.45s">
        <div class="border border-moria-highlight/20 rounded-lg bg-moria-panel/50 px-4 py-5 sm:px-8 sm:py-6 relative overflow-hidden door-panel">
          <div class="door-inner-glow absolute inset-0 rounded-lg pointer-events-none"></div>
          <div class="rune-sweep absolute inset-0 rounded-lg pointer-events-none" aria-hidden="true"></div>
          <pre class="text-moria-highlight/75 text-[9px] sm:text-[11px] font-mono leading-snug select-none relative z-10">        *       *       *
     *     *   *   *     *
   *                         *

    .========================.
   /  *  *  *  *  *  *  *    \
  / *                       * \
 |   .-----.       .-----.    |
 |   | * * |       | * * |    |
 |   |*   *|       |*   *|    |
 |   |* @ *|       |* @ *|    |
 |   |*   *|       |*   *|    |
 |   | * * |       | * * |    |
 |   '-----'       '-----'    |
 |                             |
 |  ~SPEAK FRIEND AND ENTER~  |
 |                             |
  \___________________________/
    ||   ||   ||   ||   ||
    ||   ||   ||   ||   ||</pre>
        </div>
      </div>

      <!-- Quote -->
      <div class="fade-in-item text-moria-text/60 text-xs sm:text-sm leading-relaxed mb-8 italic px-2" style="--delay: 0.75s">
        "The Dwarves dug too greedily and too deep. You know what they awoke
        in the darkness of Khazad-dûm&hellip; shadow and flame."
      </div>

      <!-- Buttons -->
      <div class="fade-in-item flex flex-col items-center gap-3" style="--delay: 1.05s">
        <button
          v-if="showContinue"
          @click="continueGame"
          class="btn-continue w-full sm:w-auto px-10 py-3 bg-moria-highlight text-moria-bg font-bold text-base sm:text-lg rounded
                 cursor-pointer tracking-wider min-h-[48px]"
        >
          &#9876; CONTINUE
        </button>
        <div v-if="showContinue && saveTimestamp" class="text-moria-border text-xs -mt-1 mb-1">
          Last saved: {{ saveTimestamp }}
        </div>

        <button
          @click="startGame"
          class="btn-enter w-full sm:w-auto px-10 py-3 font-bold text-base sm:text-lg rounded
                 cursor-pointer tracking-wider min-h-[48px]"
          :class="showContinue
            ? 'bg-transparent border border-moria-highlight/50 text-moria-highlight'
            : 'bg-moria-highlight text-moria-bg'"
        >
          {{ showContinue ? 'NEW GAME' : '&#9876; ENTER MORIA' }}
        </button>
      </div>

      <!-- Footer -->
      <div class="fade-in-item mt-8 space-y-2" style="--delay: 1.3s">
        <div class="text-moria-border text-xs tracking-wide">
          A text adventure &mdash; simplified D&amp;D rules
        </div>
        <a
          href="https://github.com/mhelleborg/MyDungeon/issues/new"
          target="_blank"
          rel="noopener"
          class="inline-block text-moria-info text-xs hover:text-moria-highlight transition-colors underline decoration-moria-info/40"
        >Ideas or feedback?</a>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* ── Cascade fade-in ─────────────────────────────────────── */
.fade-in-item {
  opacity: 0;
  transform: translateY(14px);
  transition: opacity 0.9s ease, transform 0.9s ease;
  transition-delay: var(--delay, 0s);
}
.content-visible .fade-in-item {
  opacity: 1;
  transform: translateY(0);
}

/* ── Torch-glow title ────────────────────────────────────── */
@keyframes torch-glow {
  0%, 100% {
    text-shadow:
      0 0 8px  rgba(212, 168, 67, 0.7),
      0 0 20px rgba(212, 168, 67, 0.35),
      0 0 45px rgba(212, 168, 67, 0.15);
  }
  30% {
    text-shadow:
      0 0 14px rgba(212, 168, 67, 1),
      0 0 35px rgba(212, 168, 67, 0.6),
      0 0 70px rgba(200, 120, 20, 0.3);
  }
  70% {
    text-shadow:
      0 0 6px  rgba(212, 168, 67, 0.6),
      0 0 15px rgba(212, 168, 67, 0.25),
      0 0 30px rgba(212, 168, 67, 0.1);
  }
}
.title-glow {
  animation: torch-glow 3.5s ease-in-out infinite;
}

/* ── Door panel glow ─────────────────────────────────────── */
@keyframes door-pulse {
  0%, 100% {
    box-shadow:
      0 0 12px rgba(212, 168, 67, 0.08),
      inset 0 0 24px rgba(212, 168, 67, 0.04);
  }
  50% {
    box-shadow:
      0 0 24px rgba(212, 168, 67, 0.18),
      inset 0 0 40px rgba(212, 168, 67, 0.09);
  }
}
.door-panel {
  animation: door-pulse 5s ease-in-out infinite;
}

@keyframes inner-glow-pulse {
  0%, 100% { background: radial-gradient(ellipse at center, rgba(212,168,67,0.03) 0%, transparent 70%); }
  50%       { background: radial-gradient(ellipse at center, rgba(212,168,67,0.08) 0%, transparent 70%); }
}
.door-inner-glow {
  animation: inner-glow-pulse 5s ease-in-out infinite;
}

/* ── Buttons ─────────────────────────────────────────────── */
.btn-continue {
  transition: background-color 0.2s ease, box-shadow 0.2s ease, transform 0.1s ease;
  box-shadow: 0 0 14px rgba(212, 168, 67, 0.3);
}
.btn-continue:hover {
  background-color: #e8be5a;
  box-shadow: 0 0 24px rgba(212, 168, 67, 0.55);
  transform: translateY(-1px);
}
.btn-continue:active { transform: translateY(0); }

.btn-enter {
  transition: background-color 0.2s ease, border-color 0.2s ease, color 0.2s ease,
              box-shadow 0.2s ease, transform 0.1s ease;
}
.btn-enter:hover {
  background-color: #d4a843 !important;
  border-color: transparent !important;
  color: #0a0908 !important;
  box-shadow: 0 0 24px rgba(212, 168, 67, 0.5);
  transform: translateY(-1px);
}
.btn-enter:active { transform: translateY(0); }

/* ── Ember particles ─────────────────────────────────────── */
.ember-container {
  position: absolute;
  inset: 0;
  pointer-events: none;
  overflow: hidden;
}

.ember {
  position: absolute;
  border-radius: 50%;
  background: rgba(212, 168, 67, 0.75);
  animation: float-up var(--dur, 9s) var(--del, 0s) infinite ease-in;
}

@keyframes float-up {
  0%   { opacity: 0;   transform: translateY(105vh) translateX(0)                          scale(0.5); }
  10%  { opacity: 0.9; }
  50%  {               transform: translateY(50vh)  translateX(var(--drift,  20px))         scale(1);   opacity: 0.6; }
  90%  { opacity: 0.15; }
  100% { opacity: 0;   transform: translateY(-20px) translateX(calc(var(--drift, 20px)*1.8)) scale(0.3); }
}

.ember-1  { left:  8%; width: 2px; height: 2px; --dur: 7s;  --del: 0s;    --drift:  15px; }
.ember-2  { left: 18%; width: 3px; height: 3px; --dur: 10s; --del: 1.5s;  --drift: -22px; background: rgba(255, 140, 0, 0.65); }
.ember-3  { left: 28%; width: 2px; height: 2px; --dur: 6.5s;--del: 3.2s;  --drift:  28px; }
.ember-4  { left: 38%; width: 4px; height: 4px; --dur: 12s; --del: 0.4s;  --drift: -18px; background: rgba(255, 200, 50, 0.5); }
.ember-5  { left: 48%; width: 2px; height: 2px; --dur: 8.5s;--del: 2.1s;  --drift:  32px; }
.ember-6  { left: 57%; width: 3px; height: 3px; --dur: 9.5s;--del: 4.3s;  --drift: -26px; background: rgba(255, 120, 0, 0.7); }
.ember-7  { left: 66%; width: 2px; height: 2px; --dur: 7.5s;--del: 1.1s;  --drift:  12px; }
.ember-8  { left: 74%; width: 3px; height: 3px; --dur: 11s; --del: 3.7s;  --drift: -30px; }
.ember-9  { left: 82%; width: 2px; height: 2px; --dur: 6s;  --del: 5.2s;  --drift:  20px; background: rgba(212, 168, 67, 0.55); }
.ember-10 { left: 90%; width: 3px; height: 3px; --dur: 9s;  --del: 2.6s;  --drift: -14px; }
.ember-11 { left: 12%; width: 2px; height: 2px; --dur: 13s; --del: 6.0s;  --drift:  18px; background: rgba(255, 160, 0, 0.6); }
.ember-12 { left: 43%; width: 3px; height: 3px; --dur: 8s;  --del: 0.9s;  --drift: -20px; }
.ember-13 { left: 55%; width: 2px; height: 2px; --dur: 10s; --del: 7.0s;  --drift:  25px; background: rgba(255, 200, 50, 0.45); }
.ember-14 { left: 77%; width: 4px; height: 4px; --dur: 11.5s;--del:4.8s;  --drift: -10px; background: rgba(212, 168, 67, 0.5); }

/* ── Rune sweep ──────────────────────────────────────────── */
@keyframes rune-sweep {
  0%,  51%, 100% { transform: translateX(-120%) skewX(-15deg); opacity: 0; }
  4%             { opacity: 1; }
  46%            { opacity: 0.7; }
  50%            { transform: translateX(300%) skewX(-15deg); opacity: 0; }
}
.rune-sweep::before {
  content: '';
  position: absolute;
  inset-block: 0;
  left: 0;
  width: 35%;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(212, 168, 67, 0.06) 25%,
    rgba(212, 168, 67, 0.15) 50%,
    rgba(212, 168, 67, 0.06) 75%,
    transparent
  );
  animation: rune-sweep 11s ease-in-out 4s infinite;
  border-radius: inherit;
}

/* ── Title entrance flare ────────────────────────────────── */
@keyframes title-entrance-flare {
  0%   { filter: brightness(0.2) blur(4px); }
  35%  { filter: brightness(3)   blur(0px); }
  65%  { filter: brightness(1.4) blur(0px); }
  100% { filter: brightness(1)   blur(0px); }
}
.content-visible .title-glow {
  animation:
    torch-glow 3.5s ease-in-out infinite,
    title-entrance-flare 2s ease-out 0.15s both;
}

/* ── Subtitle breathe ────────────────────────────────────── */
@keyframes subtitle-breathe {
  0%, 100% {
    opacity: 0.65;
    text-shadow: none;
  }
  50% {
    opacity: 0.9;
    text-shadow: 0 0 12px rgba(212, 168, 67, 0.35);
  }
}
.subtitle-breathe {
  animation: subtitle-breathe 6s ease-in-out 2s infinite;
}
</style>
