export interface AbilityScores {
  str: number
  dex: number
  con: number
  int: number
  wis: number
  cha: number
}

export type PlayerClass = 'ranger' | 'wizard' | 'dwarf-warrior'

export interface Spell {
  id: string
  name: string
  description: string
  damage?: string        // dice notation like '2d6'
  healing?: string
  effect?: string
  cooldown: number       // turns
  currentCooldown: number
}

export interface Player {
  name: string
  class: PlayerClass
  level: number
  xp: number
  xpToNext: number
  hp: number
  maxHp: number
  ac: number
  abilities: AbilityScores
  equippedWeapon?: string   // item ID
  equippedArmor?: string    // item ID
  spells: Spell[]
  gold: number
}

export interface Enemy {
  id: string
  name: string
  description: string
  hp: number
  maxHp: number
  ac: number
  abilities: AbilityScores
  attackBonus: number
  damage: string          // dice notation
  xpReward: number
  lootTable?: string[]    // item IDs
}

export interface CombatEnemy extends Enemy {
  instanceId: string      // unique per combat instance
}

export function getModifier(score: number): number {
  return Math.floor((score - 10) / 2)
}
