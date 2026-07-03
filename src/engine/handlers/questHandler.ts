import type { Quest, QuestEvent, QuestProgress, QuestTrigger } from '../../types/quest'
import { entry, type HandlerResult } from './types'

/** Does this event satisfy the trigger (ignoring counts)? */
function triggerMatches(trigger: QuestTrigger, event: QuestEvent): boolean {
  if (trigger.type !== event.type) return false
  if (trigger.target === '*') return true
  if (trigger.target.endsWith('*')) return event.target.startsWith(trigger.target.slice(0, -1))
  return trigger.target === event.target
}

export interface QuestEventResult {
  logs: HandlerResult['logs']
  /** Quests that just became active (initial progress entries) */
  started: QuestProgress[]
  /** questId → new stage index, for quests that advanced but are not done */
  advanced: Record<string, number>
  /** Kill-count bumps: questId → stage key → new tally */
  countBumps: Record<string, Record<string, number>>
  /** Quests that just finished (rewards should be granted) */
  completed: Quest[]
}

/**
 * Pure quest engine: given one game event, work out which quests start,
 * advance, or complete. The store applies the returned mutations.
 */
export function processQuestEvent(
  event: QuestEvent,
  quests: Quest[],
  progress: Readonly<Record<string, QuestProgress>>,
): QuestEventResult {
  const result: QuestEventResult = { logs: [], started: [], advanced: {}, countBumps: {}, completed: [] }

  for (const quest of quests) {
    const prog = progress[quest.id]

    // Not started yet — does this event begin it?
    if (!prog) {
      if (triggerMatches(quest.start, event)) {
        result.started.push({ questId: quest.id, stageIndex: 0, killCounts: {}, completed: false })
        result.logs.push(entry(`📜 New quest: ${quest.name}`, 'loot'))
        if (quest.startLog) result.logs.push(entry(quest.startLog, 'narrative'))
        const first = quest.stages[0]
        if (first) result.logs.push(entry(`   Objective: ${first.objective}`, 'system'))
      }
      continue
    }

    if (prog.completed) continue

    const stage = quest.stages[prog.stageIndex]
    if (!stage || !triggerMatches(stage.trigger, event)) continue

    // Kill objectives tally up before advancing
    const needed = stage.trigger.count ?? 1
    if (needed > 1) {
      const key = `${prog.stageIndex}`
      const tally = (prog.killCounts[key] ?? 0) + 1
      if (!result.countBumps[quest.id]) result.countBumps[quest.id] = {}
      result.countBumps[quest.id]![key] = tally
      if (tally < needed) {
        result.logs.push(entry(`${quest.name}: ${tally}/${needed} — ${stage.objective}`, 'system'))
        continue
      }
    }

    if (stage.completionLog) result.logs.push(entry(stage.completionLog, 'narrative'))

    const nextIndex = prog.stageIndex + 1
    const next = quest.stages[nextIndex]
    if (next) {
      result.advanced[quest.id] = nextIndex
      result.logs.push(entry(`📜 ${quest.name} — new objective: ${next.objective}`, 'loot'))
    } else {
      result.completed.push(quest)
      result.logs.push(entry(`📜 Quest complete: ${quest.name}!`, 'loot'))
    }
  }

  return result
}

/** Journal lines for the quests command. */
export function describeJournal(
  quests: Quest[],
  progress: Readonly<Record<string, QuestProgress>>,
): HandlerResult['logs'] {
  const active = quests.filter(q => progress[q.id] && !progress[q.id]!.completed)
  const done = quests.filter(q => progress[q.id]?.completed)
  const logs = [entry('--- Quest Journal ---', 'system')]
  if (active.length === 0 && done.length === 0) {
    logs.push(entry('Your journal is empty. Deeds await.', 'info'))
    return logs
  }
  for (const quest of active) {
    const prog = progress[quest.id]!
    const stage = quest.stages[prog.stageIndex]
    logs.push(entry(`${quest.name}${quest.giver ? ` (${quest.giver})` : ''}`, 'loot'))
    if (stage) {
      const needed = stage.trigger.count ?? 1
      const tally = prog.killCounts[`${prog.stageIndex}`] ?? 0
      const counter = needed > 1 ? ` (${tally}/${needed})` : ''
      logs.push(entry(`   ▸ ${stage.objective}${counter}`, 'info'))
    }
  }
  for (const quest of done) {
    logs.push(entry(`✓ ${quest.name} — complete`, 'system'))
  }
  return logs
}
