/**
 * Procedural sound effects using Web Audio API.
 * No audio files needed — all sounds are synthesized.
 */

let ctx: AudioContext | null = null
let soundEnabled = true
let volume = 0.3

const SETTINGS_KEY = 'moria-sound'

function getContext(): AudioContext {
  if (!ctx) {
    ctx = new AudioContext()
  }
  return ctx
}

function loadSettings() {
  try {
    const stored = localStorage.getItem(SETTINGS_KEY)
    if (stored) {
      const s = JSON.parse(stored)
      soundEnabled = s.enabled ?? true
      volume = s.volume ?? 0.3
    }
  } catch { /* ignore */ }
}

function saveSettings() {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify({ enabled: soundEnabled, volume }))
  } catch { /* ignore */ }
}

loadSettings()

export function isSoundEnabled(): boolean { return soundEnabled }
export function getVolume(): number { return volume }

export function setSoundEnabled(enabled: boolean) {
  soundEnabled = enabled
  saveSettings()
}

export function setVolume(v: number) {
  volume = Math.max(0, Math.min(1, v))
  saveSettings()
}

function gain(ac: AudioContext, val: number): GainNode {
  const g = ac.createGain()
  g.gain.value = val * volume
  g.connect(ac.destination)
  return g
}

export type SoundType = 'hit' | 'crit' | 'miss' | 'door' | 'drip' | 'potion' | 'levelup' | 'death'

export function playSound(type: SoundType) {
  if (!soundEnabled) return

  // Ensure context is resumed (browsers require user gesture)
  const ac = getContext()
  if (ac.state === 'suspended') {
    ac.resume().catch(() => {})
  }

  try {
    switch (type) {
      case 'hit': playHit(ac); break
      case 'crit': playCrit(ac); break
      case 'miss': playMiss(ac); break
      case 'door': playDoor(ac); break
      case 'drip': playDrip(ac); break
      case 'potion': playPotion(ac); break
      case 'levelup': playLevelUp(ac); break
      case 'death': playDeath(ac); break
    }
  } catch { /* ignore audio errors */ }
}

// Short noise burst — sword impact
function playHit(ac: AudioContext) {
  const t = ac.currentTime
  const buf = ac.createBuffer(1, ac.sampleRate * 0.08, ac.sampleRate)
  const data = buf.getChannelData(0)
  for (let i = 0; i < data.length; i++) {
    data[i] = (Math.random() * 2 - 1) * (1 - i / data.length)
  }
  const src = ac.createBufferSource()
  src.buffer = buf
  const g = gain(ac, 0.4)
  const filter = ac.createBiquadFilter()
  filter.type = 'bandpass'
  filter.frequency.value = 800
  filter.Q.value = 2
  src.connect(filter)
  filter.connect(g)
  src.start(t)
}

// Rising tone + noise burst
function playCrit(ac: AudioContext) {
  const t = ac.currentTime
  const osc = ac.createOscillator()
  osc.type = 'sawtooth'
  osc.frequency.setValueAtTime(300, t)
  osc.frequency.linearRampToValueAtTime(800, t + 0.15)
  const g = gain(ac, 0.3)
  g.gain.linearRampToValueAtTime(0, t + 0.2)
  osc.connect(g)
  osc.start(t)
  osc.stop(t + 0.2)

  // Plus noise
  playHit(ac)
}

// Soft whoosh
function playMiss(ac: AudioContext) {
  const t = ac.currentTime
  const buf = ac.createBuffer(1, ac.sampleRate * 0.15, ac.sampleRate)
  const data = buf.getChannelData(0)
  for (let i = 0; i < data.length; i++) {
    const env = Math.sin((i / data.length) * Math.PI)
    data[i] = (Math.random() * 2 - 1) * env * 0.3
  }
  const src = ac.createBufferSource()
  src.buffer = buf
  const filter = ac.createBiquadFilter()
  filter.type = 'highpass'
  filter.frequency.value = 2000
  const g = gain(ac, 0.2)
  src.connect(filter)
  filter.connect(g)
  src.start(t)
}

// Low creak
function playDoor(ac: AudioContext) {
  const t = ac.currentTime
  const osc = ac.createOscillator()
  osc.type = 'sine'
  osc.frequency.setValueAtTime(80, t)
  osc.frequency.linearRampToValueAtTime(120, t + 0.3)
  osc.frequency.linearRampToValueAtTime(60, t + 0.6)
  const g = gain(ac, 0.25)
  g.gain.linearRampToValueAtTime(0, t + 0.6)
  osc.connect(g)
  osc.start(t)
  osc.stop(t + 0.6)
}

// High ping with reverb
function playDrip(ac: AudioContext) {
  const t = ac.currentTime
  const osc = ac.createOscillator()
  osc.type = 'sine'
  osc.frequency.setValueAtTime(1200, t)
  osc.frequency.exponentialRampToValueAtTime(800, t + 0.3)
  const g = gain(ac, 0.15)
  g.gain.exponentialRampToValueAtTime(0.001, t + 0.4)
  osc.connect(g)
  osc.start(t)
  osc.stop(t + 0.4)
}

// Bubbling
function playPotion(ac: AudioContext) {
  const t = ac.currentTime
  for (let i = 0; i < 4; i++) {
    const osc = ac.createOscillator()
    osc.type = 'sine'
    const freq = 400 + Math.random() * 300
    const start = t + i * 0.08
    osc.frequency.setValueAtTime(freq, start)
    osc.frequency.exponentialRampToValueAtTime(freq * 1.5, start + 0.06)
    const g = gain(ac, 0.12)
    g.gain.linearRampToValueAtTime(0, start + 0.08)
    osc.connect(g)
    osc.start(start)
    osc.stop(start + 0.08)
  }
}

// Ascending arpeggio
function playLevelUp(ac: AudioContext) {
  const t = ac.currentTime
  const notes = [262, 330, 392, 523] // C4, E4, G4, C5
  notes.forEach((freq, i) => {
    const osc = ac.createOscillator()
    osc.type = 'triangle'
    osc.frequency.value = freq
    const start = t + i * 0.12
    const g = gain(ac, 0.2)
    g.gain.linearRampToValueAtTime(0, start + 0.2)
    osc.connect(g)
    osc.start(start)
    osc.stop(start + 0.2)
  })
}

// Descending tone
function playDeath(ac: AudioContext) {
  const t = ac.currentTime
  const osc = ac.createOscillator()
  osc.type = 'sawtooth'
  osc.frequency.setValueAtTime(400, t)
  osc.frequency.exponentialRampToValueAtTime(50, t + 1.5)
  const g = gain(ac, 0.25)
  g.gain.linearRampToValueAtTime(0, t + 1.5)
  osc.connect(g)
  osc.start(t)
  osc.stop(t + 1.5)
}
