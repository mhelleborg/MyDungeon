export type EncounterType = 'riddle' | 'merchant' | 'lore' | 'discovery' | 'skill-check'

export interface BaseEncounter {
  id: string
  type: EncounterType
  name: string
  description: string
  oneTime: boolean
  weight: number // for weighted random selection
}

export interface RiddleEncounter extends BaseEncounter {
  type: 'riddle'
  riddle: string
  answer: string
  rewardGold?: number
  rewardItemIds?: string[]
  rewardXp?: number
}

export interface MerchantOffer {
  itemId: string
  cost: number
}

export interface MerchantEncounter extends BaseEncounter {
  type: 'merchant'
  dialogue: string
  offers: MerchantOffer[]
}

export interface LoreEncounter extends BaseEncounter {
  type: 'lore'
  loreText: string
  rewardXp?: number
}

export interface DiscoveryEncounter extends BaseEncounter {
  type: 'discovery'
  discoveryText: string
  rewardItemIds?: string[]
  rewardGold?: number
  healHp?: number
}

export interface SkillCheckEncounter extends BaseEncounter {
  type: 'skill-check'
  ability: 'str' | 'dex' | 'int' | 'wis' | 'con' | 'cha'
  dc: number
  successText: string
  failureText: string
  rewardItemIds?: string[]
  rewardGold?: number
  failDamage?: number
}

export type Encounter = RiddleEncounter | MerchantEncounter | LoreEncounter | DiscoveryEncounter | SkillCheckEncounter

/** Runtime state for encounters that need player input (riddle, merchant). */
export interface ActiveEncounter {
  type: 'riddle' | 'merchant'
  encounterId: string
  /** For riddle: the riddle text. For merchant: dialogue. */
  prompt: string
  /** For merchant: list of available offers. */
  offers?: MerchantOffer[]
}
