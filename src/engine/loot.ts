import type { Item } from '../types/item'
import { items } from '../data/items'
import { rollDie } from './dice'

export function rollLoot(lootTable: string[]): Item[] {
  const dropped: Item[] = []
  for (const itemId of lootTable) {
    // 50% chance to drop each item
    if (rollDie(2) === 1) {
      const item = items[itemId]
      if (item) dropped.push({ ...item })
    }
  }
  return dropped
}
