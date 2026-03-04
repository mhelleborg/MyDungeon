import type { HandlerResult } from './types'
import { entry } from './types'
import type { RoomInteraction } from '../../data/roomInteractions'
import type { AbilityScores } from '../../types/character'
import { skillCheck } from '../skillChecks'

export interface ExamineResult extends HandlerResult {
  found: boolean
}

export interface SearchResult extends HandlerResult {
  success: boolean
  rewardItems?: string[]
}

export function examineInteraction(
  interactions: RoomInteraction[],
  target: string,
  isCleared: boolean,
  isDisarmed: boolean,
  isDestroyed: boolean,
): ExamineResult {
  const lower = target.toLowerCase()
  const match = interactions.find(i => i.keywords.some(k => lower.includes(k)))
  if (!match) return { found: false, logs: [] }

  let text = match.examineText
  if (isDestroyed && match.destroyedExamineText) text = match.destroyedExamineText
  else if (isDisarmed && match.disarmedExamineText) text = match.disarmedExamineText
  else if (isCleared && match.clearedExamineText) text = match.clearedExamineText

  return { found: true, logs: [entry(text, 'info')] }
}

export function resolveSearch(
  interaction: RoomInteraction,
  abilities: AbilityScores,
): SearchResult {
  const action = interaction.action
  if (!action || action.verb !== 'search') {
    return { success: false, logs: [entry('There is nothing to search here.', 'error')] }
  }

  if (action.skillCheck) {
    const result = skillCheck(abilities, action.skillCheck.ability, action.skillCheck.dc)
    const logs = [
      entry(`${action.skillCheck.ability.toUpperCase()} check: rolled ${result.roll} + ${result.modifier} = ${result.total} vs DC ${result.dc}`, 'system'),
    ]

    if (result.success) {
      logs.push(entry(action.successText, 'loot'))
      return { success: true, rewardItems: action.rewardItems, logs }
    } else {
      logs.push(entry(action.failText || 'You find nothing of value.', 'info'))
      return { success: false, logs }
    }
  }

  // No skill check — auto-succeed
  return {
    success: true,
    rewardItems: action.rewardItems,
    logs: [entry(action.successText, 'loot')],
  }
}
