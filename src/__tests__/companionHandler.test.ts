import { describe, it, expect, vi, afterEach } from 'vitest'
import { companionAttack, companionTakeDamage, rollCompanionComment, checkRecruitment } from '../engine/handlers/companionHandler'
import type { Companion } from '../types/companion'
import type { CombatEnemy } from '../types/character'

const makeCompanion = (overrides?: Partial<Companion>): Companion => ({
  id: 'trapped-elf',
  name: 'Elanor',
  hp: 18,
  maxHp: 18,
  ac: 14,
  attackBonus: 4,
  damage: '1d6+2',
  roomComments: { 'great-hall': 'A specific comment about the hall.' },
  genericComments: ['A generic comment.'],
  deathMessage: 'Elanor has fallen.',
  ...overrides,
})

const makeEnemy = (overrides?: Partial<CombatEnemy>): CombatEnemy => ({
  id: 'goblin',
  name: 'Goblin',
  description: 'A goblin',
  hp: 10,
  maxHp: 10,
  ac: 12,
  abilities: { str: 10, dex: 10, con: 10, int: 10, wis: 10, cha: 10 },
  attackBonus: 3,
  damage: '1d6+1',
  xpReward: 25,
  instanceId: 'goblin-0',
  ...overrides,
})

afterEach(() => vi.restoreAllMocks())

// ── companionAttack ────────────────────────────────────────

describe('companionAttack', () => {
  it('hits when roll + bonus >= target AC', () => {
    // roll 15 + 4 bonus = 19 vs AC 12 → hit. Damage: 1d6→4, +2 = 6
    let callCount = 0
    vi.spyOn(Math, 'random').mockImplementation(() => {
      callCount++
      return callCount === 1 ? 0.7 : 0.5 // d20→15, d6→4
    })

    const companion = makeCompanion()
    const enemy = makeEnemy()
    const result = companionAttack(companion, enemy)

    expect(result.hit).toBe(true)
    expect(result.damage).toBeGreaterThan(0)
    expect(enemy.hp).toBeLessThan(10)
    expect(result.logs[0]!.text).toContain('Elanor')
    expect(result.logs[0]!.text).toContain('hits')
  })

  it('misses when roll + bonus < target AC', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0) // roll 1 + 4 = 5 vs AC 12
    const companion = makeCompanion()
    const enemy = makeEnemy()
    const result = companionAttack(companion, enemy)

    expect(result.hit).toBe(false)
    expect(result.damage).toBe(0)
    expect(enemy.hp).toBe(10)
    expect(result.logs[0]!.text).toContain('misses')
  })

  it('critical hit on natural 20 always hits', () => {
    // roll 20 (random ~0.95) → crit; damage doubled
    let callCount = 0
    vi.spyOn(Math, 'random').mockImplementation(() => {
      callCount++
      return callCount === 1 ? 0.95 : 0.5 // d20→20, d6→4
    })
    const companion = makeCompanion()
    const enemy = makeEnemy({ ac: 99 }) // impossibly high AC
    const result = companionAttack(companion, enemy)

    expect(result.hit).toBe(true)
    expect(result.logs[0]!.text).toContain('CRITICAL')
  })

  it('reports targetDead when enemy HP reaches 0', () => {
    let callCount = 0
    vi.spyOn(Math, 'random').mockImplementation(() => {
      callCount++
      return callCount === 1 ? 0.7 : 0.9 // d20→15, d6→6
    })
    const companion = makeCompanion()
    const enemy = makeEnemy({ hp: 1, maxHp: 1 })
    const result = companionAttack(companion, enemy)

    expect(result.hit).toBe(true)
    expect(result.targetDead).toBe(true)
    expect(enemy.hp).toBe(0)
    expect(result.logs.some(l => l.text.includes('slain'))).toBe(true)
  })
})

// ── companionTakeDamage ────────────────────────────────────

describe('companionTakeDamage', () => {
  it('reduces HP and logs damage when companion survives', () => {
    const companion = makeCompanion({ hp: 18 })
    const result = companionTakeDamage(companion, 5)

    expect(companion.hp).toBe(13)
    expect(result.dead).toBe(false)
    expect(result.logs[0]!.text).toContain('5 damage')
    expect(result.logs[0]!.text).toContain('13/18')
  })

  it('kills companion when damage exceeds HP', () => {
    const companion = makeCompanion({ hp: 3 })
    const result = companionTakeDamage(companion, 10)

    expect(companion.hp).toBe(0)
    expect(result.dead).toBe(true)
    expect(result.logs.length).toBe(2)
    expect(result.logs[0]!.type).toBe('error')
    expect(result.logs[1]!.text).toContain('Elanor has fallen.')
  })

  it('kills companion when damage exactly equals HP', () => {
    const companion = makeCompanion({ hp: 5 })
    const result = companionTakeDamage(companion, 5)

    expect(companion.hp).toBe(0)
    expect(result.dead).toBe(true)
  })
})

// ── rollCompanionComment ───────────────────────────────────

describe('rollCompanionComment', () => {
  it('returns room-specific comment when available and roll triggers', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.1) // 0.1 < 0.4 → triggers
    const companion = makeCompanion()
    const comment = rollCompanionComment(companion, 'great-hall')

    expect(comment).toBe('A specific comment about the hall.')
  })

  it('returns generic comment for rooms without specific comments', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.1) // triggers, then picks from pool
    const companion = makeCompanion()
    const comment = rollCompanionComment(companion, 'unknown-room')

    expect(comment).toBe('A generic comment.')
  })

  it('returns null when random roll exceeds 0.4 threshold', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.8) // 0.8 > 0.4 → no comment
    const companion = makeCompanion()
    const comment = rollCompanionComment(companion, 'great-hall')

    expect(comment).toBeNull()
  })

  it('returns null when no generic comments and room not matched', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.1)
    const companion = makeCompanion({ roomComments: {}, genericComments: [] })
    const comment = rollCompanionComment(companion, 'unknown-room')

    expect(comment).toBeNull()
  })
})

// ── checkRecruitment ───────────────────────────────────────

describe('checkRecruitment', () => {
  it('allows recruitment for trapped-elf when quest completed', () => {
    const interacted = new Set(['trapped-elf'])
    const result = checkRecruitment('trapped-elf', interacted)

    expect(result.canRecruit).toBe(true)
    expect(result.companion).toBeDefined()
    expect(result.companion!.name).toBe('Elanor')
    expect(result.companion!.hp).toBe(18)
  })

  it('allows recruitment for shadow-ranger when quest completed', () => {
    const interacted = new Set(['shadow-ranger'])
    const result = checkRecruitment('shadow-ranger', interacted)

    expect(result.canRecruit).toBe(true)
    expect(result.companion).toBeDefined()
    expect(result.companion!.name).toBe('Halbarad')
    expect(result.companion!.hp).toBe(22)
  })

  it('denies recruitment when quest not completed', () => {
    const interacted = new Set<string>()
    const result = checkRecruitment('trapped-elf', interacted)

    expect(result.canRecruit).toBe(false)
    expect(result.companion).toBeUndefined()
  })

  it('denies recruitment for unknown NPC', () => {
    const interacted = new Set(['wounded-dwarf'])
    const result = checkRecruitment('wounded-dwarf', interacted)

    expect(result.canRecruit).toBe(false)
  })

  it('returns independent companion copies (no shared state)', () => {
    const interacted = new Set(['trapped-elf'])
    const r1 = checkRecruitment('trapped-elf', interacted)
    const r2 = checkRecruitment('trapped-elf', interacted)

    expect(r1.companion).not.toBe(r2.companion)
    r1.companion!.hp = 0
    expect(r2.companion!.hp).toBe(18)
  })
})
