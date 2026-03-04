import type { Item } from '../types/item'

export const items: Record<string, Item> = {
  // --- Weapons ---
  'longsword': {
    id: 'longsword',
    name: 'Longsword',
    description: 'A well-balanced steel longsword, reliable in any warrior\'s hand.',
    type: 'weapon',
    damage: '1d8+2',
    attackBonus: 2,
    value: 15,
  },
  'battle-axe': {
    id: 'battle-axe',
    name: 'Battle Axe',
    description: 'A heavy double-bladed axe, favored by dwarven fighters of old.',
    type: 'weapon',
    damage: '1d10+3',
    attackBonus: 1,
    value: 18,
  },
  'staff': {
    id: 'staff',
    name: 'Wizard\'s Staff',
    description: 'A gnarled staff of yew wood, humming faintly with arcane energy.',
    type: 'weapon',
    damage: '1d6',
    attackBonus: 0,
    value: 10,
  },
  'elven-dagger': {
    id: 'elven-dagger',
    name: 'Elven Dagger',
    description: 'A slender blade of Elvish make, light as a feather and deadly quick. Its edge never dulls.',
    type: 'weapon',
    damage: '1d4+1',
    attackBonus: 3,
    value: 25,
  },
  'orcish-blade': {
    id: 'orcish-blade',
    name: 'Orcish Blade',
    description: 'A crude but effective scimitar stamped with the mark of Sauron. Still sharp enough to kill.',
    type: 'weapon',
    damage: '1d6+1',
    attackBonus: 1,
    value: 8,
  },

  // --- Armor ---
  'chain-mail': {
    id: 'chain-mail',
    name: 'Chain Mail',
    description: 'Interlocking rings of iron, offering solid protection without sacrificing too much mobility.',
    type: 'armor',
    armorBonus: 4,
    value: 30,
  },
  'plate-armor': {
    id: 'plate-armor',
    name: 'Plate Armor',
    description: 'Heavy steel plate, forged in the manner of the great smiths of Gondor. Formidable protection.',
    type: 'armor',
    armorBonus: 6,
    value: 75,
  },
  'leather-armor': {
    id: 'leather-armor',
    name: 'Leather Armor',
    description: 'Cured leather reinforced at the joints. Light enough for a ranger to move silently through the wild.',
    type: 'armor',
    armorBonus: 2,
    value: 10,
  },
  'mithril-coat': {
    id: 'mithril-coat',
    name: 'Mithril Coat',
    description: 'A kingly gift! A coat of mithril rings, light as a feather and harder than dragon-scales. Its worth is beyond reckoning.',
    type: 'armor',
    armorBonus: 7,
    value: 500,
  },

  // --- Potions ---
  'healing-potion': {
    id: 'healing-potion',
    name: 'Healing Potion',
    description: 'A small vial of rose-colored liquid. Warmth spreads through the body upon drinking, knitting wounds closed.',
    type: 'potion',
    healing: '2d4+2',
    consumable: true,
    value: 20,
  },
  'greater-healing-potion': {
    id: 'greater-healing-potion',
    name: 'Greater Healing Potion',
    description: 'A large flask of deep crimson liquid, potent enough to restore a warrior from the brink of death.',
    type: 'potion',
    healing: '4d4+4',
    consumable: true,
    value: 50,
  },

  // --- Quest Items ---
  'door-key': {
    id: 'door-key',
    name: 'Iron Key',
    description: 'A heavy iron key engraved with the runes of Khazad-dum. Key to the Chamber of Records.',
    type: 'quest',
    value: 0,
  },
  'torch': {
    id: 'torch',
    name: 'Torch',
    description: 'A pitch-soaked torch that lights dark rooms, casting flickering shadows on ancient stone walls.',
    type: 'misc',
    consumable: true,
    value: 1,
  },
  'balin-tome': {
    id: 'balin-tome',
    name: 'Book of Mazarbul',
    description: 'The Book of Mazarbul — Balin\'s chronicle of the doomed colony. Its final pages are stained with blood. "We cannot get out."',
    type: 'quest',
    value: 0,
  },

  // --- New Weapons ---
  'dwarven-warhammer': {
    id: 'dwarven-warhammer',
    name: 'Dwarven Warhammer',
    description: 'A mighty warhammer of dwarven steel, its head engraved with the sigil of Durin. It strikes with the weight of the mountain itself.',
    type: 'weapon',
    damage: '1d10+4',
    attackBonus: 2,
    value: 60,
  },
  'glamdring': {
    id: 'glamdring',
    name: 'Glamdring, Foe-hammer',
    description: 'The legendary sword of Turgon, King of Gondolin. Its blade glows blue in the presence of orcs. Gandalf himself once bore this weapon.',
    type: 'weapon',
    damage: '2d6+3',
    attackBonus: 3,
    value: 200,
  },

  // --- New Armor ---
  'dwarf-shield': {
    id: 'dwarf-shield',
    name: 'Dwarven Tower Shield',
    description: 'A massive shield of dwarven iron, reinforced with bands of steel. It bears the seven stars of Durin\'s House.',
    type: 'armor',
    armorBonus: 5,
    value: 50,
  },

  // --- New Potions ---
  'miruvor': {
    id: 'miruvor',
    name: 'Miruvor',
    description: 'The cordial of Imladris — a warm, fragrant draught that restores strength and hope. Even a sip brings renewed vigor.',
    type: 'potion',
    healing: '3d4+6',
    consumable: true,
    value: 75,
  },

  // --- New Quest Items ---
  'rope': {
    id: 'rope',
    name: 'Elven Rope',
    description: 'A coil of hithlain rope from Lothlórien, light and strong beyond belief. It seems to know the will of its bearer.',
    type: 'quest',
    value: 15,
  },

  // --- Misc ---
  'watcher-pearl': {
    id: 'watcher-pearl',
    name: 'Watcher\'s Pearl',
    description: 'A luminous pearl pried from the depths of the Watcher\'s pool. It pulses with a cold, deep-sea light.',
    type: 'misc',
    value: 50,
  },
  'gold-coins': {
    id: 'gold-coins',
    name: 'Gold Coins',
    description: 'A handful of dwarven gold coins, minted long ago in the kingdom of Khazad-dum.',
    type: 'misc',
    value: 10,
    quantity: 10,
  },
}

export function getItem(id: string): Item | undefined {
  return items[id]
}
