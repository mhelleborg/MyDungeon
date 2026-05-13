import { ref } from 'vue'

export type FloaterKind = 'damage-out' | 'damage-in' | 'crit' | 'miss' | 'heal' | 'magic'

export interface Floater {
  id: number
  value: number | string
  kind: FloaterKind
  x: number
  y: number
  jitter: number
  reduced: boolean
}

interface SpawnOptions {
  value: number | string
  kind: FloaterKind
}

const floaters = ref<Floater[]>([])
const activeByAnchor = new Map<HTMLElement, number>()
let seq = 0

const ACTIVE_PER_ANCHOR_CAP = 6
const FLOATER_DURATION_MS = 800
const FLOATER_REDUCED_DURATION_MS = 250

function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined' || !window.matchMedia) return false
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

function spawn(target: HTMLElement | null | undefined, opts: SpawnOptions): void {
  if (!target) return
  const rect = target.getBoundingClientRect()
  if (rect.width === 0 && rect.height === 0) return

  const active = activeByAnchor.get(target) ?? 0
  if (active >= ACTIVE_PER_ANCHOR_CAP) return

  const reduced = prefersReducedMotion()
  const jitterIndex = active
  const jitterStep = 12
  const direction = jitterIndex % 2 === 0 ? 1 : -1
  const jitter = reduced ? 0 : direction * Math.ceil(jitterIndex / 2) * jitterStep

  const floater: Floater = {
    id: ++seq,
    value: opts.value,
    kind: opts.kind,
    x: rect.left + rect.width / 2,
    y: rect.top + rect.height / 2,
    jitter,
    reduced,
  }

  floaters.value.push(floater)
  activeByAnchor.set(target, active + 1)

  const duration = reduced ? FLOATER_REDUCED_DURATION_MS : FLOATER_DURATION_MS
  setTimeout(() => {
    const idx = floaters.value.findIndex(f => f.id === floater.id)
    if (idx !== -1) floaters.value.splice(idx, 1)
    const remaining = (activeByAnchor.get(target) ?? 1) - 1
    if (remaining <= 0) activeByAnchor.delete(target)
    else activeByAnchor.set(target, remaining)
  }, duration)
}

export function useFloaters() {
  return { floaters, spawn }
}
