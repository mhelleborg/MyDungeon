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
      { itemId: 'torch', cost: 5 },
      { itemId: 'dwarf-shield', cost: 45 },
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
    recruitableCompanionId: 'trapped-elf',
  },

  'old-bombur': {
    id: 'old-bombur',
    name: 'Bombur the Ironmonger',
    description: 'A stout, soot-blackened dwarf tends to a small portable forge, hammering at something with practiced strokes. His beard is singed at the tips but his eyes are merry.',
    dialogue: [
      '"Well met, well met! I am Bombur, son of Bofur. I came down here to reclaim my grandfather\'s forge, but the orcs had other ideas."',
      '"Those levers on the wall — I\'ve been trying to crack the sequence for weeks. Something about flame, water, and hammer... if only I could read the old runes properly."',
      '"I\'ve got goods if you\'ve got gold. A smith never travels without his wares!"',
    ],
    tradeOffers: [
      { itemId: 'longsword', cost: 20 },
      { itemId: 'chain-mail', cost: 35 },
      { itemId: 'healing-potion', cost: 15 },
      { itemId: 'torch', cost: 5 },
    ],
  },

  'shadow-ranger': {
    id: 'shadow-ranger',
    name: 'Halbarad the Ranger',
    description: 'A tall, grim-faced man in a weathered cloak leans against the wall, his grey eyes watchful. A star gleams faintly on his breast — a Ranger of the North.',
    dialogue: [
      '"Stay your blade — I am a friend. Halbarad, of the Dúnedain. I tracked an orc raiding party into these accursed mines."',
      '"There is a secret armory hidden behind the western wall of the mining shaft. The dwarves concealed it well — look for irregularities in the stonework."',
      '"The Balrog cannot be fought with strength alone. When the bridge cracks beneath its weight, seize the moment. Break what is already broken."',
      '"Take this cordial — Miruvor, from the stores of Rivendell. You will need its warmth before the end."',
    ],
    questReward: {
      itemId: 'miruvor',
      message: 'Halbarad uncorks a crystal flask and hands it to you. "Miruvor — the cordial of Imladris. Drink when hope seems lost."',
    },
    recruitableCompanionId: 'shadow-ranger',
  },

  'ghost-of-ori': {
    id: 'ghost-of-ori',
    name: 'Shade of Ori',
    description: 'A translucent figure in dwarven armor hovers near the tomb, its face etched with sorrow. The ghost of Ori, companion of Balin, keeper of the Book of Mazarbul.',
    dialogue: [
      '"Do not fear me, living one. I am Ori, last chronicler of Balin\'s colony. I linger here to warn those who come after."',
      '"We delved too deep. The Balrog slumbered in the deeps of the world, and our picks and our greed woke it. Fire and shadow consumed us."',
      '"If you would read the Book of Mazarbul, know this: our final entry was penned in haste. \'They are coming.\' And they did."',
      '"Seek the armory the orcs never found. The western mines hold secrets even Sauron\'s servants overlooked."',
    ],
    detectableInDark: true,
  },

  'merchant-goblin': {
    id: 'merchant-goblin',
    name: 'Snaga the Goblin Peddler',
    description: 'A scrawny goblin crouches behind a makeshift stall of planks and barrels, grinning with too many teeth. Unlike its kin, it seems more interested in commerce than combat.',
    dialogue: [
      '"No kill! No kill! Snaga is friend! Snaga sells things, yes yes!"',
      '"Other goblins stupid. Fight, die, fight, die. Snaga smart — Snaga sells to anyone! Even tall-folk!"',
      '"You want potions? Blades? Snaga has! Cheap prices, good quality... mostly."',
    ],
    tradeOffers: [
      { itemId: 'healing-potion', cost: 8 },
      { itemId: 'torch', cost: 2 },
      { itemId: 'orcish-blade', cost: 5 },
      { itemId: 'elven-dagger', cost: 18 },
      { itemId: 'greater-healing-potion', cost: 30 },
    ],
  },
}

/** Map of room IDs to NPC IDs present in that room */
export const roomNPCs: Record<string, string[]> = {
  'endless-stair-base': ['wounded-dwarf'],
  'second-hall': ['trapped-elf'],
  'abandoned-forge': ['old-bombur'],
  'great-stairway': ['shadow-ranger'],
  'chamber-of-records': ['ghost-of-ori'],
  'goblin-tunnels': ['merchant-goblin'],
}
