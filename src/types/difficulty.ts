export type DifficultyLevel = 'easy' | 'normal' | 'hard'

export interface DifficultyMultipliers {
  enemyHp: number
  enemyDamage: number
  lootDrop: number
  healing: number
  skillDcMod: number
  extraPotions: number
}

export const difficultySettings: Record<DifficultyLevel, DifficultyMultipliers> = {
  easy: {
    enemyHp: 0.75,
    enemyDamage: 0.75,
    lootDrop: 1.5,
    healing: 1.25,
    skillDcMod: -2,
    extraPotions: 2,
  },
  normal: {
    enemyHp: 1.0,
    enemyDamage: 1.0,
    lootDrop: 1.0,
    healing: 1.0,
    skillDcMod: 0,
    extraPotions: 0,
  },
  hard: {
    enemyHp: 1.5,
    enemyDamage: 1.25,
    lootDrop: 0.75,
    healing: 0.75,
    skillDcMod: 2,
    extraPotions: -1,
  },
}
