export type StatusEffectId = 'poisoned' | 'burning' | 'stunned' | 'blessed'

export interface StatusEffect {
  id: StatusEffectId
  name: string
  description: string
  duration: number        // turns remaining
  damagePerTurn?: number  // DoT damage
  attackBonus?: number    // bonus to attack rolls
  acBonus?: number        // bonus to AC
}
