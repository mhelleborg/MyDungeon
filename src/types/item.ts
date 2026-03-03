export type ItemType = 'weapon' | 'armor' | 'potion' | 'quest' | 'misc'

export interface Item {
  id: string
  name: string
  description: string
  type: ItemType
  damage?: string        // for weapons, dice notation
  attackBonus?: number   // for weapons
  armorBonus?: number    // for armor
  healing?: string       // for potions, dice notation
  consumable?: boolean
  value: number          // gold value
  quantity?: number
}
