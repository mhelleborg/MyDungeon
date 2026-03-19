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

      <!-- Doors of Moria — bespoke SVG animation -->
      <div class="fade-in-item mb-7 relative" style="--delay: 0.45s">
        <div class="border border-moria-highlight/20 rounded-lg bg-moria-panel/50 p-4 sm:p-5 relative overflow-hidden door-panel">
          <div class="door-inner-glow absolute inset-0 rounded-lg pointer-events-none"></div>
          <div class="rune-sweep absolute inset-0 rounded-lg pointer-events-none" aria-hidden="true"></div>
          <svg
            class="moria-gate-svg select-none relative z-10 w-full"
            viewBox="0 0 280 185"
            xmlns="http://www.w3.org/2000/svg"
            aria-label="Gandalf stands before the West-gate of Moria"
          >
            <defs>
              <linearGradient id="moria-sky-grad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%"   stop-color="rgba(8,7,12,1)"/>
                <stop offset="55%"  stop-color="rgba(12,10,8,1)"/>
                <stop offset="100%" stop-color="rgba(6,5,4,1)"/>
              </linearGradient>
              <radialGradient id="moria-moon-halo" cx="50%" cy="50%" r="50%">
                <stop offset="0%"   stop-color="rgba(220,210,180,0.18)"/>
                <stop offset="60%"  stop-color="rgba(200,185,140,0.07)"/>
                <stop offset="100%" stop-color="rgba(180,160,100,0)"/>
              </radialGradient>
              <radialGradient id="moria-gate-reflect" cx="50%" cy="50%" r="50%">
                <stop offset="0%"   stop-color="rgba(212,168,67,0.09)"/>
                <stop offset="100%" stop-color="rgba(212,168,67,0)"/>
              </radialGradient>
            </defs>

            <!-- ── Layer 1: Sky ──────────────────────────────── -->
            <rect x="0" y="0" width="280" height="185" fill="url(#moria-sky-grad)"/>

            <!-- ── Layer 2: Stars ───────────────────────────── -->
            <circle class="sky-star ss-1" cx="18"  cy="14" r="0.9" fill="rgba(220,210,190,0.8)"/>
            <circle class="sky-star ss-2" cx="42"  cy="28" r="0.7" fill="rgba(212,200,175,0.7)"/>
            <circle class="sky-star ss-3" cx="65"  cy="9"  r="1.0" fill="rgba(225,215,195,0.85)"/>
            <circle class="sky-star ss-4" cx="88"  cy="38" r="0.7" fill="rgba(210,200,180,0.7)"/>
            <circle class="sky-star ss-5" cx="122" cy="18" r="0.8" fill="rgba(220,210,185,0.75)"/>
            <circle class="sky-star ss-6" cx="148" cy="8"  r="0.9" fill="rgba(218,208,182,0.8)"/>
            <circle class="sky-star ss-7" cx="160" cy="34" r="0.7" fill="rgba(215,205,180,0.7)"/>
            <circle class="sky-star ss-8" cx="178" cy="22" r="0.8" fill="rgba(220,212,188,0.75)"/>

            <!-- ── Layer 3: Moon ─────────────────────────────── -->
            <circle class="moon-halo-circle" cx="238" cy="26" r="14" fill="url(#moria-moon-halo)"/>
            <circle cx="238" cy="26" r="7"  fill="rgba(195,183,148,0.22)" stroke="rgba(210,195,155,0.12)" stroke-width="0.5"/>
            <circle cx="242" cy="24" r="6"  fill="rgba(10,9,8,0.82)"/>

            <!-- ── Layer 4: Far mountains ─────────────────────── -->
            <polygon
              points="0,90 18,72 35,82 52,58 68,74 82,48 98,65 114,52 130,68 145,55 158,70 172,45 185,62 198,50 212,68 228,54 242,72 258,60 272,78 280,68 280,185 0,185"
              fill="rgba(20,16,12,0.85)"
            />

            <!-- ── Layer 5: Near mountain face (Moria cliff) ─── -->
            <polygon
              points="0,115 22,105 40,95 58,108 72,100 88,88 102,97 115,85 128,95 138,105 148,100 162,88 170,92 175,115 185,108 195,90 205,88 215,92 222,100 230,108 240,100 255,90 270,98 280,88 280,185 0,185"
              fill="rgba(6,5,4,1)"
            />

            <!-- ── Layer 6: West-gate arch ────────────────────── -->
            <g class="gate-group">
              <path
                class="gate-arch-outer"
                d="M 170,115 Q 200,60 230,115"
                fill="none"
                stroke="rgba(212,168,67,1)"
                stroke-width="1.4"
                stroke-opacity="0.3"
                stroke-linecap="round"
              />
              <path
                class="gate-arch-inner"
                d="M 175,115 Q 200,66 225,115"
                fill="none"
                stroke="rgba(212,168,67,1)"
                stroke-width="0.7"
                stroke-opacity="0.14"
                stroke-linecap="round"
              />
              <line
                x1="200" y1="95" x2="200" y2="115"
                stroke="rgba(212,168,67,0.18)"
                stroke-width="0.7"
                stroke-dasharray="2.5,3"
              />
            </g>

            <!-- ── Layer 7: Gate reflection smear ────────────── -->
            <ellipse cx="200" cy="148" rx="28" ry="5" fill="url(#moria-gate-reflect)"/>

            <!-- ── Layer 8: Lake / Mirrormere ────────────────── -->
            <rect x="0" y="140" width="280" height="30" fill="rgba(8,7,10,0.7)"/>
            <line class="water-line wl-1" x1="0" y1="145" x2="280" y2="145"
              stroke="rgba(180,150,60,0.10)" stroke-width="0.8"/>
            <line class="water-line wl-2" x1="0" y1="152" x2="280" y2="152"
              stroke="rgba(180,150,60,0.08)" stroke-width="0.6"/>
            <line class="water-line wl-3" x1="0" y1="160" x2="280" y2="160"
              stroke="rgba(180,150,60,0.07)" stroke-width="0.5"/>

            <!-- ── Layer 9: Ground / shore ─────────────────────── -->
            <rect x="0" y="170" width="280" height="15" fill="rgba(14,12,10,1)"/>

            <!-- ── Layer 10: Light cone ────────────────────────── -->
            <polygon
              class="light-cone"
              points="112,82 175,112 230,108"
              fill="rgba(240,220,150,1)"
              opacity="0"
            />

            <!-- ── Layer 11: Gandalf silhouette ───────────────── -->
            <g class="gandalf-group">
              <!-- Hat: tall pointed wizard hat -->
              <polygon points="90,80 81,103 72,105 104,105 97,103" fill="rgba(6,5,4,1)"/>
              <!-- Head oval -->
              <ellipse cx="91" cy="108" rx="5" ry="6" fill="rgba(6,5,4,1)"/>
              <!-- Beard -->
              <polygon points="87,113 95,113 97,124 93,128 88,126 85,120" fill="rgba(6,5,4,1)"/>
              <!-- Robes: wide trapezoid widening at hem -->
              <polygon points="84,122 98,122 108,165 72,165" fill="rgba(6,5,4,1)"/>
              <!-- Staff line -->
              <line x1="96" y1="130" x2="112" y2="82"
                    stroke="rgba(35,28,18,0.9)" stroke-width="1.2" stroke-linecap="round"/>
              <!-- Staff orb — primary light source -->
              <circle class="staff-orb" cx="112" cy="82" r="2.5" fill="rgba(255,252,230,0.95)"/>
            </g>
          </svg>
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

/* ── Moria Gate SVG ──────────────────────────────────────── */
.moria-gate-svg {
  max-width: 420px;
  display: block;
  margin: 0 auto;
}

/* Staff orb — white-gold breathing glow */
@keyframes staff-orb-pulse {
  0%, 100% {
    filter: drop-shadow(0 0 3px rgba(255,252,230,0.65))
            drop-shadow(0 0 8px rgba(240,210,120,0.4));
    transform: scale(1);
  }
  50% {
    filter: drop-shadow(0 0 10px rgba(255,255,220,1))
            drop-shadow(0 0 22px rgba(220,190,80,0.75))
            drop-shadow(0 0 38px rgba(212,168,67,0.4));
    transform: scale(1.25);
  }
}
.staff-orb {
  animation: staff-orb-pulse 2.5s ease-in-out infinite;
  transform-box: fill-box;
  transform-origin: center;
}

/* Gate arch — brightens ~0.4s after staff pulse peaks */
@keyframes gate-respond {
  0%, 100% { stroke-opacity: 0.3; }
  50% {
    stroke-opacity: 0.85;
    filter: drop-shadow(0 0 5px rgba(212,168,67,0.6));
  }
}
.gate-arch-outer { animation: gate-respond 2.5s ease-in-out 0.4s infinite; }
.gate-arch-inner { animation: gate-respond 2.5s ease-in-out 0.5s infinite; }

/* Light cone — faint triangular beam from staff tip to gate */
@keyframes light-cone-pulse {
  0%, 100% { opacity: 0;    }
  50%       { opacity: 0.12; }
}
.light-cone { animation: light-cone-pulse 2.5s ease-in-out infinite; }

/* Sky stars — staggered twinkle */
@keyframes star-twinkle {
  0%, 100% { opacity: 0.25; }
  50%       { opacity: 1;   filter: drop-shadow(0 0 2px rgba(220,210,180,0.8)); }
}
.sky-star { animation: star-twinkle 2.8s ease-in-out infinite; }
.ss-1 { animation-duration: 2.1s; animation-delay: 0.0s; }
.ss-2 { animation-duration: 3.2s; animation-delay: 0.6s; }
.ss-3 { animation-duration: 1.8s; animation-delay: 1.1s; }
.ss-4 { animation-duration: 2.7s; animation-delay: 1.8s; }
.ss-5 { animation-duration: 3.5s; animation-delay: 0.3s; }
.ss-6 { animation-duration: 2.4s; animation-delay: 1.4s; }
.ss-7 { animation-duration: 1.9s; animation-delay: 0.9s; }
.ss-8 { animation-duration: 3.0s; animation-delay: 2.0s; }

/* Moon halo — soft outer glow breathes */
@keyframes moon-halo {
  0%, 100% { opacity: 0.6;  transform: scale(1);    }
  50%       { opacity: 1.0; transform: scale(1.28); }
}
.moon-halo-circle {
  animation: moon-halo 7s ease-in-out infinite;
  transform-box: fill-box;
  transform-origin: center;
}

/* Water shimmer — 3 lake lines pulse in staggered waves */
@keyframes water-shimmer {
  0%, 100% { opacity: 0.5; }
  50%       { opacity: 1.0; }
}
.water-line { animation: water-shimmer 4s ease-in-out infinite; }
.wl-1 { animation-delay: 0.0s; }
.wl-2 { animation-delay: 1.3s; }
.wl-3 { animation-delay: 2.6s; }

/* Cloak drift — gentle ±1.5° sway around Gandalf's feet */
@keyframes cloak-drift {
  0%, 100% { transform: rotate(-1.5deg); }
  50%       { transform: rotate(1.5deg);  }
}
.gandalf-group {
  animation: cloak-drift 7s ease-in-out infinite;
  transform-box: fill-box;
  transform-origin: 50% 100%;
}

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
