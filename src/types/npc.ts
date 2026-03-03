export interface TradeOffer {
  itemId: string
  cost: number
}

export interface NPC {
  id: string
  name: string
  description: string
  dialogue: string[]
  tradeOffers?: TradeOffer[]
  questReward?: {
    itemId: string
    message: string
  }
  /** If true, NPC can be detected even in dark rooms (e.g. calls out) */
  detectableInDark?: boolean
  /** If true, full interaction requires light */
  requiresLight?: boolean
}
