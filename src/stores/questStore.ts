import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { GameLogEntry } from '../types/command'
import type { QuestProgress, QuestTriggerType } from '../types/quest'
import { allQuests } from '../data/world'
import { processQuestEvent, describeJournal } from '../engine/handlers/questHandler'
import { usePlayerStore } from './playerStore'
import { dropItemToGround } from './gameContext'

export const useQuestStore = defineStore('quest', () => {
  /** Progress per quest id — presence means the quest has started */
  const questProgress = ref<Record<string, QuestProgress>>({})

  const questList = computed(() => Object.values(allQuests))
  const activeQuests = computed(() =>
    questList.value.filter(q => questProgress.value[q.id] && !questProgress.value[q.id]!.completed),
  )
  const completedQuests = computed(() =>
    questList.value.filter(q => questProgress.value[q.id]?.completed),
  )

  function reset() {
    questProgress.value = {}
  }

  /**
   * Feed a game event to the quest engine. Returns the logs to display;
   * quest starts/advances/completions and rewards are applied here.
   */
  function questEvent(type: QuestTriggerType, target: string): GameLogEntry[] {
    const result = processQuestEvent({ type, target }, questList.value, questProgress.value)
    const logs = [...result.logs]

    for (const started of result.started) {
      questProgress.value[started.questId] = started
    }
    for (const [questId, bumps] of Object.entries(result.countBumps)) {
      const prog = questProgress.value[questId]
      if (prog) Object.assign(prog.killCounts, bumps)
    }
    for (const [questId, stageIndex] of Object.entries(result.advanced)) {
      const prog = questProgress.value[questId]
      if (prog) prog.stageIndex = stageIndex
    }

    const playerStore = usePlayerStore()
    for (const quest of result.completed) {
      const prog = questProgress.value[quest.id]
      if (prog) prog.completed = true
      if (!quest.rewards || !playerStore.player) continue
      if (quest.rewards.gold) {
        playerStore.player.gold += quest.rewards.gold
        logs.push({ text: `   Reward: ${quest.rewards.gold} gold`, type: 'loot', timestamp: Date.now() })
      }
      if (quest.rewards.xp) {
        logs.push(...playerStore.addXp(quest.rewards.xp))
      }
      if (quest.rewards.itemIds) {
        for (const itemId of quest.rewards.itemIds) dropItemToGround(itemId)
      }
    }

    return logs
  }

  function journalLogs(): GameLogEntry[] {
    return describeJournal(questList.value, questProgress.value)
  }

  return {
    questProgress,
    activeQuests,
    completedQuests,
    reset,
    questEvent,
    journalLogs,
  }
})
