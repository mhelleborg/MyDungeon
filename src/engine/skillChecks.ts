import type { AbilityScores } from '../types/character'
import { getModifier } from '../types/character'
import { rollD20 } from './dice'

export type Ability = keyof AbilityScores

export interface SkillCheckResult {
  success: boolean
  roll: number
  modifier: number
  total: number
  dc: number
}

export function skillCheck(abilities: AbilityScores, ability: Ability, dc: number): SkillCheckResult {
  const roll = rollD20()
  const modifier = getModifier(abilities[ability])
  const total = roll + modifier

  return {
    success: total >= dc,
    roll,
    modifier,
    total,
    dc,
  }
}
