import type {
  Encounter,
  RiddleEncounter,
  MerchantEncounter,
  SkillCheckEncounter,
  ActiveEncounter,
  MerchantOffer,
} from '../../types/encounter'
import type { AbilityScores } from '../../types/character'
import type { Item } from '../../types/item'
import { entry, type HandlerResult } from './types'
import { skillCheck } from '../skillChecks'

export interface EncounterTriggerResult extends HandlerResult {
  activeEncounter?: ActiveEncounter
  itemIds?: string[]
  gold?: number
  healHp?: number
  xp?: number
  damage?: number
}

/** Determine whether an encounter triggers this room entry. */
export function shouldTriggerEncounter(
  chance: number,
  inCombat: boolean,
  hasActiveEnemies: boolean,
): boolean {
  if (inCombat || hasActiveEnemies) return false
  return Math.random() < chance
}

/** Weighted random selection from encounter pool, filtering seen one-time encounters. */
export function selectEncounter(
  allEncounters: Encounter[],
  seenIds: Set<string>,
): Encounter | null {
  const available = allEncounters.filter(e => !(e.oneTime && seenIds.has(e.id)))
  if (available.length === 0) return null

  const totalWeight = available.reduce((sum, e) => sum + e.weight, 0)
  let roll = Math.random() * totalWeight
  for (const enc of available) {
    roll -= enc.weight
    if (roll <= 0) return enc
  }
  return available[available.length - 1]!
}

/** Resolve an encounter — dispatch by type. */
export function resolveEncounter(
  encounter: Encounter,
  abilities: AbilityScores,
): EncounterTriggerResult {
  switch (encounter.type) {
    case 'riddle': return resolveRiddleStart(encounter)
    case 'merchant': return resolveMerchantStart(encounter)
    case 'lore': return resolveLore(encounter)
    case 'discovery': return resolveDiscovery(encounter)
    case 'skill-check': return resolveSkillCheck(encounter, abilities)
  }
}

function resolveRiddleStart(enc: RiddleEncounter): EncounterTriggerResult {
  return {
    logs: [
      entry(enc.description, 'narrative'),
      entry(enc.riddle, 'narrative'),
      entry('(Type "say <answer>" to answer the riddle.)', 'info'),
    ],
    activeEncounter: {
      type: 'riddle',
      encounterId: enc.id,
      prompt: enc.riddle,
    },
  }
}

function resolveMerchantStart(enc: MerchantEncounter): EncounterTriggerResult {
  return {
    logs: [
      entry(enc.description, 'narrative'),
      entry(enc.dialogue, 'narrative'),
      entry('(Type "trade" to see their wares, or "buy <item>" to purchase.)', 'info'),
    ],
    activeEncounter: {
      type: 'merchant',
      encounterId: enc.id,
      prompt: enc.dialogue,
      offers: enc.offers,
    },
  }
}

function resolveLore(enc: { description: string; loreText: string; rewardXp?: number }): EncounterTriggerResult {
  return {
    logs: [
      entry(enc.description, 'narrative'),
      entry(enc.loreText, 'narrative'),
      ...(enc.rewardXp ? [entry(`(+${enc.rewardXp} XP)`, 'loot')] : []),
    ],
    xp: enc.rewardXp,
  }
}

function resolveDiscovery(enc: {
  description: string
  discoveryText: string
  rewardItemIds?: string[]
  rewardGold?: number
  healHp?: number
}): EncounterTriggerResult {
  const logs = [
    entry(enc.description, 'narrative'),
    entry(enc.discoveryText, 'narrative'),
  ]
  if (enc.healHp) logs.push(entry(`You recover ${enc.healHp} HP.`, 'loot'))
  if (enc.rewardGold) logs.push(entry(`You find ${enc.rewardGold} gold!`, 'loot'))
  if (enc.rewardItemIds?.length) logs.push(entry('You found items on the ground!', 'loot'))

  return {
    logs,
    itemIds: enc.rewardItemIds,
    gold: enc.rewardGold,
    healHp: enc.healHp,
  }
}

function resolveSkillCheck(
  enc: SkillCheckEncounter,
  abilities: AbilityScores,
): EncounterTriggerResult {
  const logs = [entry(enc.description, 'narrative')]
  const check = skillCheck(abilities, enc.ability, enc.dc)

  const abilityLabel = enc.ability.toUpperCase()
  logs.push(entry(`[${abilityLabel} check: rolled ${check.roll} + ${check.modifier} = ${check.total} vs DC ${enc.dc}]`, 'system'))

  if (check.success) {
    logs.push(entry(enc.successText, 'narrative'))
    if (enc.rewardGold) logs.push(entry(`You find ${enc.rewardGold} gold!`, 'loot'))
    if (enc.rewardItemIds?.length) logs.push(entry('You found items on the ground!', 'loot'))
    return {
      logs,
      gold: enc.rewardGold,
      itemIds: enc.rewardItemIds,
    }
  } else {
    logs.push(entry(enc.failureText, 'narrative'))
    if (enc.failDamage) logs.push(entry(`You take ${enc.failDamage} damage!`, 'combat'))
    return {
      logs,
      damage: enc.failDamage,
    }
  }
}

// ── Interactive encounter resolution ────────────────────────

export interface RiddleAnswerResult extends HandlerResult {
  correct: boolean
  gold?: number
  itemIds?: string[]
  xp?: number
}

/** Check a player's answer to a riddle encounter. */
export function answerRiddle(
  encounter: RiddleEncounter,
  answer: string,
): RiddleAnswerResult {
  const correct = answer.toLowerCase().trim() === encounter.answer.toLowerCase()

  if (correct) {
    const logs = [entry('Correct! The whisper fades with a sigh of satisfaction.', 'loot')]
    if (encounter.rewardGold) logs.push(entry(`You receive ${encounter.rewardGold} gold!`, 'loot'))
    if (encounter.rewardXp) logs.push(entry(`(+${encounter.rewardXp} XP)`, 'loot'))
    return {
      logs,
      correct: true,
      gold: encounter.rewardGold,
      itemIds: encounter.rewardItemIds,
      xp: encounter.rewardXp,
    }
  }

  return {
    logs: [entry(`"${answer}"... No, that is not the answer. Try again.`, 'narrative')],
    correct: false,
  }
}

export interface MerchantTradeResult extends HandlerResult {
  offers: { itemName: string; cost: number; itemId: string }[]
}

/** List what a wandering merchant has for sale. */
export function listMerchantOffers(
  name: string,
  offers: MerchantOffer[],
  itemLookup: (id: string) => Item | undefined,
): MerchantTradeResult {
  const logs = [entry(`--- ${name}'s Wares ---`, 'system')]
  const result: MerchantTradeResult['offers'] = []

  for (const offer of offers) {
    const item = itemLookup(offer.itemId)
    const itemName = item?.name || offer.itemId
    logs.push(entry(`  ${itemName} — ${offer.cost} gold`, 'info'))
    result.push({ itemName, cost: offer.cost, itemId: offer.itemId })
  }
  logs.push(entry('Type "buy <item>" to purchase.', 'info'))

  return { logs, offers: result }
}

export interface MerchantBuyResult extends HandlerResult {
  success: boolean
  itemId?: string
  cost?: number
}

/** Attempt to buy from a wandering merchant. */
export function buyFromMerchant(
  name: string,
  offers: MerchantOffer[],
  target: string,
  gold: number,
  itemLookup: (id: string) => Item | undefined,
): MerchantBuyResult {
  const offer = offers.find(o => {
    const item = itemLookup(o.itemId)
    return item && item.name.toLowerCase().includes(target.toLowerCase())
  })

  if (!offer) {
    return { success: false, logs: [entry(`They don't sell anything like "${target}".`, 'error')] }
  }

  const item = itemLookup(offer.itemId)
  if (!item) {
    return { success: false, logs: [entry('That item doesn\'t exist.', 'error')] }
  }

  if (gold < offer.cost) {
    return { success: false, logs: [entry(`You don't have enough gold. (Need ${offer.cost}, have ${gold})`, 'error')] }
  }

  return {
    success: true,
    itemId: offer.itemId,
    cost: offer.cost,
    logs: [entry(`You buy ${item.name} from ${name} for ${offer.cost} gold.`, 'loot')],
  }
}
