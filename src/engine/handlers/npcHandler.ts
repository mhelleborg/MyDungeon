import type { NPC } from '../../types/npc'
import type { Item } from '../../types/item'
import { entry, type HandlerResult } from './types'

export interface TalkResult extends HandlerResult {
  /** If the NPC gives a quest reward on first meeting */
  questRewardItemId?: string
}

/**
 * Pure: generate dialogue logs for talking to an NPC.
 * Returns quest reward item ID if applicable (store handles adding to inventory).
 */
export function talkToNPC(
  npc: NPC,
  isDark: boolean,
  alreadyInteracted: boolean,
): TalkResult {
  const logs: HandlerResult['logs'] = []

  // Dark room restrictions
  if (isDark && npc.requiresLight) {
    if (npc.detectableInDark) {
      logs.push(entry(`A voice calls from the darkness: "${npc.dialogue[0]?.replace(/^"|"$/g, '') || 'Hello?'}"`, 'narrative'))
      logs.push(entry('You cannot see well enough to interact fully. You need a light source.', 'info'))
    } else {
      logs.push(entry('It is too dark to see anyone here.', 'error'))
    }
    return { logs }
  }

  logs.push(entry(`${npc.name}: ${npc.description}`, 'info'))
  for (const line of npc.dialogue) {
    logs.push(entry(line, 'narrative'))
  }

  // Quest reward (first interaction only)
  if (npc.questReward && !alreadyInteracted) {
    logs.push(entry(npc.questReward.message, 'loot'))
    return { logs, questRewardItemId: npc.questReward.itemId }
  }

  if (npc.tradeOffers && npc.tradeOffers.length > 0) {
    logs.push(entry('Type "trade" to see what they have for sale.', 'info'))
  }

  return { logs }
}

export interface TradeListResult extends HandlerResult {
  offers: { itemName: string; cost: number; itemId: string }[]
}

/**
 * Pure: list trade offers from an NPC.
 */
export function listTradeOffers(
  npc: NPC,
  itemLookup: (id: string) => Item | undefined,
): TradeListResult {
  const logs: HandlerResult['logs'] = []
  const offers: TradeListResult['offers'] = []

  if (!npc.tradeOffers || npc.tradeOffers.length === 0) {
    logs.push(entry(`${npc.name} has nothing to trade.`, 'info'))
    return { logs, offers }
  }

  logs.push(entry(`--- ${npc.name}'s Wares ---`, 'system'))
  for (const offer of npc.tradeOffers) {
    const item = itemLookup(offer.itemId)
    const name = item?.name || offer.itemId
    logs.push(entry(`  ${name} — ${offer.cost} gold`, 'info'))
    offers.push({ itemName: name, cost: offer.cost, itemId: offer.itemId })
  }
  logs.push(entry('Type "buy <item>" to purchase.', 'info'))
  return { logs, offers }
}

export interface BuyResult extends HandlerResult {
  success: boolean
  itemId?: string
  cost?: number
}

/**
 * Pure: attempt to buy an item from an NPC.
 */
export function buyFromNPC(
  npc: NPC,
  targetName: string,
  playerGold: number,
  itemLookup: (id: string) => Item | undefined,
): BuyResult {
  if (!npc.tradeOffers || npc.tradeOffers.length === 0) {
    return { success: false, logs: [entry(`${npc.name} has nothing to sell.`, 'error')] }
  }

  const offer = npc.tradeOffers.find(o => {
    const item = itemLookup(o.itemId)
    return item && item.name.toLowerCase().includes(targetName.toLowerCase())
  })

  if (!offer) {
    return { success: false, logs: [entry(`${npc.name} doesn't sell anything like "${targetName}".`, 'error')] }
  }

  const item = itemLookup(offer.itemId)
  if (!item) {
    return { success: false, logs: [entry('That item doesn\'t exist.', 'error')] }
  }

  if (playerGold < offer.cost) {
    return { success: false, logs: [entry(`You don't have enough gold. (Need ${offer.cost}, have ${playerGold})`, 'error')] }
  }

  return {
    success: true,
    itemId: offer.itemId,
    cost: offer.cost,
    logs: [entry(`You buy ${item.name} for ${offer.cost} gold.`, 'loot')],
  }
}
