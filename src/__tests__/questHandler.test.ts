import { describe, it, expect } from 'vitest'
import { processQuestEvent, describeJournal } from '../engine/handlers/questHandler'
import type { Quest, QuestProgress } from '../types/quest'

const hunt: Quest = {
  id: 'hunt',
  name: 'The Hunt',
  description: 'Slay the wolves.',
  regionId: 'moria',
  start: { type: 'enter-room', target: 'den' },
  stages: [
    { objective: 'Slay 3 wolves', trigger: { type: 'kill-enemy', target: 'wolf-*', count: 3 } },
    { objective: 'Return to the den', trigger: { type: 'enter-room', target: 'den' } },
  ],
  rewards: { xp: 100 },
}

function progress(overrides: Partial<QuestProgress> = {}): QuestProgress {
  return { questId: 'hunt', stageIndex: 0, killCounts: {}, completed: false, ...overrides }
}

describe('processQuestEvent', () => {
  it('starts a quest when its start trigger fires', () => {
    const result = processQuestEvent({ type: 'enter-room', target: 'den' }, [hunt], {})
    expect(result.started).toHaveLength(1)
    expect(result.started[0]!.questId).toBe('hunt')
    expect(result.logs.map(l => l.text).join('\n')).toContain('New quest: The Hunt')
  })

  it('does not restart an active or completed quest', () => {
    const active = processQuestEvent({ type: 'enter-room', target: 'den' }, [hunt], { hunt: progress() })
    expect(active.started).toHaveLength(0)
    const done = processQuestEvent({ type: 'enter-room', target: 'den' }, [hunt], { hunt: progress({ stageIndex: 1, completed: true }) })
    expect(done.started).toHaveLength(0)
    expect(done.completed).toHaveLength(0)
  })

  it('tallies counted kill objectives with wildcard matching', () => {
    const result = processQuestEvent({ type: 'kill-enemy', target: 'wolf-grey' }, [hunt], { hunt: progress() })
    expect(result.countBumps['hunt']).toEqual({ '0': 1 })
    expect(result.advanced['hunt']).toBeUndefined()
  })

  it('ignores non-matching kills', () => {
    const result = processQuestEvent({ type: 'kill-enemy', target: 'goblin' }, [hunt], { hunt: progress() })
    expect(result.countBumps['hunt']).toBeUndefined()
  })

  it('advances the stage when the tally reaches the count', () => {
    const prog = progress({ killCounts: { '0': 2 } })
    const result = processQuestEvent({ type: 'kill-enemy', target: 'wolf-white' }, [hunt], { hunt: prog })
    expect(result.advanced['hunt']).toBe(1)
    expect(result.logs.map(l => l.text).join('\n')).toContain('new objective: Return to the den')
  })

  it('completes the quest on the final stage', () => {
    const prog = progress({ stageIndex: 1 })
    const result = processQuestEvent({ type: 'enter-room', target: 'den' }, [hunt], { hunt: prog })
    expect(result.completed.map(q => q.id)).toEqual(['hunt'])
    expect(result.logs.map(l => l.text).join('\n')).toContain('Quest complete: The Hunt')
  })

  it('a single event can start one quest and advance another', () => {
    const second: Quest = {
      ...hunt,
      id: 'second',
      name: 'Second',
      start: { type: 'enter-room', target: 'elsewhere' },
      stages: [{ objective: 'Visit the den', trigger: { type: 'enter-room', target: 'den' } }],
    }
    const result = processQuestEvent(
      { type: 'enter-room', target: 'den' },
      [hunt, second],
      { second: { questId: 'second', stageIndex: 0, killCounts: {}, completed: false } },
    )
    expect(result.started.map(p => p.questId)).toEqual(['hunt'])
    expect(result.completed.map(q => q.id)).toEqual(['second'])
  })
})

describe('describeJournal', () => {
  it('shows active objectives with kill tallies and completed quests', () => {
    const text = describeJournal([hunt], { hunt: progress({ killCounts: { '0': 2 } }) })
      .map(l => l.text).join('\n')
    expect(text).toContain('The Hunt')
    expect(text).toContain('Slay 3 wolves (2/3)')

    const doneText = describeJournal([hunt], { hunt: progress({ completed: true }) })
      .map(l => l.text).join('\n')
    expect(doneText).toContain('✓ The Hunt — complete')
  })

  it('reports an empty journal', () => {
    const text = describeJournal([hunt], {}).map(l => l.text).join('\n')
    expect(text).toContain('journal is empty')
  })
})
