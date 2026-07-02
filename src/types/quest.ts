import type { RegionId } from './region'

export type QuestTriggerType =
  | 'enter-room'    // target: room id
  | 'clear-room'    // target: room id
  | 'kill-enemy'    // target: enemy id ('orc-*' matches by prefix, '*' matches any); count for N kills
  | 'take-item'     // target: item id
  | 'talk-npc'      // target: npc id
  | 'choice-made'   // target: choice id
  | 'flag-set'      // target: choiceConsequences flag
  | 'craft-item'    // target: item id or '*' for any

export interface QuestTrigger {
  type: QuestTriggerType
  target: string
  /** For kill-enemy: how many kills are needed (default 1) */
  count?: number
}

export interface QuestStage {
  /** Objective line shown in the journal */
  objective: string
  trigger: QuestTrigger
  /** Logged when the stage completes */
  completionLog?: string
}

export interface Quest {
  id: string
  name: string
  description: string
  regionId: RegionId
  /** Who or what sets the quest in motion — journal flavor only */
  giver?: string
  /** The quest activates when this fires (and it is not yet started) */
  start: QuestTrigger
  /** Logged when the quest begins */
  startLog?: string
  stages: QuestStage[]
  rewards?: { xp?: number; gold?: number; itemIds?: string[] }
}

/** A single quest event fed to the quest engine */
export interface QuestEvent {
  type: QuestTriggerType
  target: string
}

export interface QuestProgress {
  questId: string
  /** Index of the stage currently in progress */
  stageIndex: number
  /** Kill tallies per stage, keyed `${stageIndex}` */
  killCounts: Record<string, number>
  completed: boolean
}
