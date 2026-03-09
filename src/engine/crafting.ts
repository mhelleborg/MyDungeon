import type { Item } from '../types/item'
import type { GameLogEntry } from '../types/command'
import { items as itemDb } from '../data/items'

function log(text: string, type: GameLogEntry['type'] = 'info'): GameLogEntry {
  return { text, type, timestamp: Date.now() }
}

export interface CraftingRecipe {
  id: string
  name: string
  description: string
  ingredients: string[]   // item IDs
  result: string          // item ID
  goldCost: number
}

export const recipes: CraftingRecipe[] = [
  {
    id: 'reforged-blade',
    name: 'Reforged Blade',
    description: 'Reforge an orcish blade into a proper weapon on the dwarven anvils.',
    ingredients: ['orcish-blade'],
    result: 'reforged-blade',
    goldCost: 15,
  },
  {
    id: 'greater-healing',
    name: 'Concentrated Potion',
    description: 'Combine two healing potions into a single greater healing potion.',
    ingredients: ['healing-potion', 'healing-potion'],
    result: 'greater-healing-potion',
    goldCost: 0,
  },
  {
    id: 'forge-glamdring',
    name: 'Awaken Glamdring',
    description: 'Use the ancient forge to awaken the dormant power of Glamdring.',
    ingredients: ['glamdring'],
    result: 'glamdring-awakened',
    goldCost: 50,
  },
]

// Items only created through crafting
export const craftedItems: Record<string, Item> = {
  'reforged-blade': {
    id: 'reforged-blade',
    name: 'Reforged Dwarven Blade',
    description: 'An orcish blade reforged on the ancient anvils of Khazad-dum. Dwarven craft has transformed crude iron into keen steel.',
    type: 'weapon',
    damage: '1d8+3',
    attackBonus: 2,
    value: 35,
  },
  'glamdring-awakened': {
    id: 'glamdring-awakened',
    name: 'Glamdring, Flame of the West',
    description: 'The forge of Khazad-dum has rekindled Glamdring\'s ancient fire. The blade blazes with white light, and orcs flee before it.',
    type: 'weapon',
    damage: '2d8+4',
    attackBonus: 4,
    value: 400,
  },
}

/**
 * List available recipes the player can craft with their current inventory.
 */
export function listRecipes(inventoryItems: Item[], gold: number): {
  logs: GameLogEntry[]
  available: CraftingRecipe[]
  unavailable: CraftingRecipe[]
} {
  const logs: GameLogEntry[] = []
  const available: CraftingRecipe[] = []
  const unavailable: CraftingRecipe[] = []

  logs.push(log('--- Forge Recipes ---', 'system'))

  for (const recipe of recipes) {
    const canAfford = gold >= recipe.goldCost
    const hasIngredients = checkIngredients(inventoryItems, recipe.ingredients)

    const resultItem = craftedItems[recipe.result] || itemDb[recipe.result]
    const resultName = resultItem?.name || recipe.name

    const ingredientNames = recipe.ingredients.map(id => {
      const item = itemDb[id] || craftedItems[id]
      return item?.name || id
    }).join(' + ')

    const costStr = recipe.goldCost > 0 ? ` + ${recipe.goldCost}g` : ''

    if (canAfford && hasIngredients) {
      logs.push(log(`  [READY] ${ingredientNames}${costStr} -> ${resultName}`, 'loot'))
      logs.push(log(`    "${recipe.description}"`, 'info'))
      available.push(recipe)
    } else {
      const missing: string[] = []
      if (!hasIngredients) missing.push('missing materials')
      if (!canAfford) missing.push(`need ${recipe.goldCost}g`)
      logs.push(log(`  [${missing.join(', ')}] ${ingredientNames}${costStr} -> ${resultName}`, 'info'))
      unavailable.push(recipe)
    }
  }

  if (available.length > 0) {
    logs.push(log('Type "craft <name>" to forge an item.', 'system'))
  } else {
    logs.push(log('You don\'t have the materials for any recipes right now.', 'info'))
  }

  return { logs, available, unavailable }
}

function checkIngredients(inventory: Item[], ingredients: string[]): boolean {
  // Count required items
  const needed = new Map<string, number>()
  for (const id of ingredients) {
    needed.set(id, (needed.get(id) || 0) + 1)
  }

  // Count available items
  for (const [id, count] of needed) {
    const items = inventory.filter(i => i.id === id)
    let total = 0
    for (const item of items) {
      total += item.quantity || 1
    }
    if (total < count) return false
  }

  return true
}

/**
 * Attempt to craft a recipe.
 */
export function tryCraft(
  recipeName: string,
  inventoryItems: Item[],
  gold: number,
): {
  logs: GameLogEntry[]
  success: boolean
  recipe?: CraftingRecipe
  resultItem?: Item
} {
  const logs: GameLogEntry[] = []

  // Find matching recipe
  const recipe = recipes.find(r =>
    r.name.toLowerCase().includes(recipeName.toLowerCase()) ||
    r.id.toLowerCase().includes(recipeName.toLowerCase())
  )

  if (!recipe) {
    logs.push(log(`No recipe found for "${recipeName}". Type "craft" to see available recipes.`, 'error'))
    return { logs, success: false }
  }

  if (gold < recipe.goldCost) {
    logs.push(log(`Not enough gold. You need ${recipe.goldCost}g but only have ${gold}g.`, 'error'))
    return { logs, success: false }
  }

  if (!checkIngredients(inventoryItems, recipe.ingredients)) {
    const needed = recipe.ingredients.map(id => {
      const item = itemDb[id] || craftedItems[id]
      return item?.name || id
    }).join(', ')
    logs.push(log(`Missing ingredients: ${needed}`, 'error'))
    return { logs, success: false }
  }

  const resultItem = craftedItems[recipe.result] || itemDb[recipe.result]
  if (!resultItem) {
    logs.push(log('Something went wrong with this recipe.', 'error'))
    return { logs, success: false }
  }

  logs.push(log('The ancient forge roars to life, its embers rekindled by your efforts...', 'narrative'))
  logs.push(log(`You craft ${resultItem.name}!`, 'loot'))
  if (recipe.goldCost > 0) {
    logs.push(log(`(Spent ${recipe.goldCost} gold)`, 'info'))
  }

  return { logs, success: true, recipe, resultItem }
}
