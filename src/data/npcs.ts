import type { NPC } from '../types/npc'

export const npcs: Record<string, NPC> = {
  'wounded-dwarf': {
    id: 'wounded-dwarf',
    name: 'Nori the Wounded Dwarf',
    description: 'A battered dwarf sits propped against the wall, clutching a bandaged arm. His eyes are sharp despite his injuries.',
    dialogue: [
      '"Hail, traveler. I am Nori, son of Bori. I came seeking the riches of Khazad-dum, but found only ruin."',
      '"The Balrog... it dwells at the bridge. Fire and shadow. No ordinary blade can fell such a thing — you must be clever, or very strong."',
      '"I have healing draughts, if you have coin. You\'ll need them before the end."',
    ],
    tradeOffers: [
      { itemId: 'healing-potion', cost: 15 },
      { itemId: 'greater-healing-potion', cost: 40 },
    ],
  },

  'trapped-elf': {
    id: 'trapped-elf',
    name: 'Elanor of Lothlórien',
    description: 'An elf sits in the darkness, pale and weary but unbroken. Her voice drifts from the shadows like a thread of starlight.',
    dialogue: [
      '"Thank the Valar — a living soul! I am Elanor of Lothlórien. I was separated from my company in the dark."',
      '"I have wandered these halls for days without light. The darkness here is not natural — it presses against the mind."',
      '"Take this, with my gratitude. And if you seek the east gate, beware the Second Hall. Something watches from the chasm."',
      '"There is a coat of mithril somewhere in these mines, worth more than all the gold in the Shire. The dwarves hid their greatest treasures well."',
    ],
    questReward: {
      itemId: 'healing-potion',
      message: 'Elanor presses a healing potion into your hand. "May it serve you well."',
    },
    detectableInDark: true,
    requiresLight: true,
  },
}

/** Map of room IDs to NPC IDs present in that room */
export const roomNPCs: Record<string, string[]> = {
  'endless-stair-base': ['wounded-dwarf'],
  'second-hall': ['trapped-elf'],
}
