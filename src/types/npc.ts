import type { DialogueTree } from './dialogue'

export interface TradeOffer {
  itemId: string
  cost: number
}

export interface NPC {
  id: string
  name: string
  description: string
  /** Legacy flat dialogue — used when dialogueTree is absent */
  dialogue: string[]
  /** Branching dialogue tree — takes precedence over flat dialogue when present */
  dialogueTree?: DialogueTree
  tradeOffers?: TradeOffer[]
  questReward?: {
    itemId: string
    message: string
  }
  /** If true, NPC can be detected even in dark rooms (e.g. calls out) */
  detectableInDark?: boolean
  /** If true, full interaction requires light */
  requiresLight?: boolean
  /** If set, this NPC can be recruited as a companion after quest completion */
  recruitableCompanionId?: string
}
