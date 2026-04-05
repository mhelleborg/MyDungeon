import type { Ability } from '../engine/skillChecks'

// ── Conditions ─────────────────────────────────────────────────────────────

export type DialogueConditionType =
  | 'hasItem'
  | 'choiceMade'
  | 'choiceNotMade'
  | 'companionAlive'
  | 'companionDead'
  | 'hasCompanion'
  | 'noCompanion'
  | 'flag'
  | 'flagAbsent'
  | 'actCompleted'
  | 'statCheck'
  | 'alreadyInteracted'
  | 'hasClass'

export interface DialogueCondition {
  type: DialogueConditionType
  /** Item ID for hasItem */
  itemId?: string
  /** Choice ID for choiceMade / choiceNotMade */
  choiceId?: string
  /** Option ID for choiceMade (optional — just checks if ANY option was chosen if absent) */
  optionId?: string
  /** Companion ID for companionAlive / companionDead / hasCompanion */
  companionId?: string
  /** Flag key in choiceConsequences for flag / flagAbsent */
  flag?: string
  /** Ability and DC for statCheck */
  ability?: Ability
  dc?: number
  /** Player class for hasClass */
  playerClass?: 'ranger' | 'wizard' | 'dwarf-warrior'
}

// ── Effects ────────────────────────────────────────────────────────────────

export type DialogueEffectType =
  | 'giveItem'
  | 'takeItem'
  | 'setFlag'
  | 'giveXP'
  | 'giveGold'
  | 'presentChoice'
  | 'unlockRoom'
  | 'modifyMaxHp'
  | 'giveAttackBonus'
  | 'giveAcBonus'
  | 'recruitCompanion'
  | 'healPlayer'
  | 'giveNimrodelFragment'
  | 'triggerVictory'

export interface DialogueEffect {
  type: DialogueEffectType
  itemId?: string
  flag?: string
  xp?: number
  gold?: number
  choiceId?: string
  roomId?: string
  value?: number
  companionId?: string
  fragmentId?: string
}

// ── Nodes ──────────────────────────────────────────────────────────────────

export interface DialogueOption {
  id: string
  /** Text shown to player as [A] / [B] / etc. */
  label: string
  /** Next node to navigate to */
  nextNodeId: string
  /** Only show this option if ALL conditions pass */
  conditions?: DialogueCondition[]
  /** Side-effects triggered when player picks this option */
  effects?: DialogueEffect[]
}

export interface DialogueNode {
  id: string
  /** What the NPC says. May reference flags with conditional variants via npcTextVariants */
  npcText: string
  /** Alternative texts keyed by condition — first matching variant wins */
  npcTextVariants?: {
    condition: DialogueCondition
    text: string
  }[]
  /** Player options. Absent or empty → end of conversation */
  playerOptions?: DialogueOption[]
  /** Auto-advance to another node without player input (NPC monologue chain) */
  autoAdvance?: string
  /** Side-effects triggered when this node is entered */
  onEnter?: DialogueEffect[]
}

export interface DialogueTree {
  rootNodeId: string
  nodes: Record<string, DialogueNode>
}

// ── Active dialogue state ───────────────────────────────────────────────────

export interface ActiveDialogue {
  npcId: string
  currentNodeId: string
  /** Options currently available (filtered by conditions) */
  availableOptions: DialogueOption[]
}
