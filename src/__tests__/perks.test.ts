import { describe, it, expect } from 'vitest'
import { unlockPerksAtLevel, getPerkAttackBonus, getPerkAcBonus, classPerks } from '../engine/perks'
import { createPlayer } from '../data/player-classes'

describe('perks', () => {
  it('every class has a perk at levels 3, 5, 7 and 9', () => {
    for (const perks of Object.values(classPerks)) {
      expect(perks.map(p => p.level).sort()).toEqual([3, 5, 7, 9])
    }
  })

  it('unlocks the dwarf AC perk at level 3 and applies it immediately', () => {
    const player = createPlayer('Gimli', 'dwarf-warrior')
    const acBefore = player.ac
    const logs = unlockPerksAtLevel(player, 3)
    expect(player.perks).toContain('stone-skin')
    expect(player.ac).toBe(acBefore + 1)
    expect(getPerkAcBonus(player)).toBe(1)
    expect(logs[0]!.text).toContain('Stone Skin')
  })

  it('attack perks add up across levels', () => {
    const player = createPlayer('Aragorn', 'ranger')
    unlockPerksAtLevel(player, 3)
    unlockPerksAtLevel(player, 7)
    expect(getPerkAttackBonus(player)).toBe(2)
  })

  it('wizard perks grant new spells without duplicating them', () => {
    const player = createPlayer('Gandalf', 'wizard')
    unlockPerksAtLevel(player, 3)
    expect(player.spells.some(s => s.id === 'frost-ray')).toBe(true)
    unlockPerksAtLevel(player, 3)
    expect(player.spells.filter(s => s.id === 'frost-ray')).toHaveLength(1)
    expect(player.perks.filter(p => p === 'frost-ray')).toHaveLength(1)
  })

  it('max HP perks raise current HP as well', () => {
    const player = createPlayer('Gimli', 'dwarf-warrior')
    const before = player.maxHp
    unlockPerksAtLevel(player, 7)
    expect(player.maxHp).toBe(before + 15)
    expect(player.hp).toBe(player.maxHp)
  })
})
