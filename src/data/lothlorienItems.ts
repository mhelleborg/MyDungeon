import type { Item } from '../types/item'

export const lothlorienItems: Record<string, Item> = {
  // ── Galadriel's Gifts ───────────────────────────────────────
  'phial-of-galadriel': {
    id: 'phial-of-galadriel',
    name: 'Phial of Galadriel',
    description: 'A small crystal phial that holds the light of Eärendil\'s star, captured in the Mirror of Galadriel. It glows with a cold silver light that never dims. "May it be a light to you in dark places, when all other lights go out."',
    type: 'misc',
    value: 500,
  },
  'lembas-bread': {
    id: 'lembas-bread',
    name: 'Lembas Bread',
    description: 'Waybread of the Eldar, wrapped in a leaf of Lórien. One small bite is enough to fill the stomach of a grown man for a day. It heals the body and steadies the spirit.',
    type: 'potion',
    healing: '3d6+3',
    consumable: true,
    value: 30,
  },
  'elven-rope': {
    id: 'elven-rope',
    name: 'Rope of the Galadhrim',
    description: 'A coil of slender grey rope, woven by the Elves of Lórien. It is lighter than you\'d expect and stronger than steel. It seems almost to respond to your intentions.',
    type: 'quest',
    value: 40,
  },
  'elven-cloak': {
    id: 'elven-cloak',
    name: 'Elven Cloak',
    description: 'A hooded cloak woven in the fashion of the Galadrhim, patterned with the hues of the forest floor in autumn. Those who wear it seem to fade into the background, hard to mark even in open land.',
    type: 'armor',
    armorBonus: 1,
    value: 80,
  },
  'galadhrim-bow': {
    id: 'galadhrim-bow',
    name: 'Galadhrim Bow',
    description: 'A great bow of the Galadhrim, strung with elf-hair. Longer and stouter than the bow of Mirkwood. In trained hands it strikes with uncanny precision.',
    type: 'weapon',
    damage: '1d8+3',
    attackBonus: 3,
    value: 120,
  },

  // ── Quest and Lore Items ─────────────────────────────────────
  'leaf-brooch': {
    id: 'leaf-brooch',
    name: 'Leaf of Lórien',
    description: 'A clasp shaped like a green leaf, the vein-lines picked out in silver. The brooch of Celeborn — a sign of the Lord\'s trust. Doors that would be barred to a stranger open for those who wear it.',
    type: 'quest',
    value: 50,
  },
  'nimrodel-song': {
    id: 'nimrodel-song',
    name: 'Song of Nimrodel',
    description: 'Three fragments of the ancient lay of Nimrodel, committed to memory. The words feel half-remembered, like a dream — but when you try to sing them, the forest itself seems to lean in to listen.',
    type: 'quest',
    value: 0,
  },
  'nimrodel-fragment-1': {
    id: 'nimrodel-fragment-1',
    name: 'Song Fragment (Opening)',
    description: '"An Elvish maid there was of old, A shining star by day..."',
    type: 'quest',
    value: 0,
  },
  'nimrodel-fragment-2': {
    id: 'nimrodel-fragment-2',
    name: 'Song Fragment (Middle)',
    description: '"She wandered in the winter cold far from the mountain high..."',
    type: 'quest',
    value: 0,
  },
  'nimrodel-fragment-3': {
    id: 'nimrodel-fragment-3',
    name: 'Song Fragment (Ending)',
    description: '"Her footsteps light as the silver rain still mark the hidden ways..."',
    type: 'quest',
    value: 0,
  },
  'balin-memorial': {
    id: 'balin-memorial',
    name: 'Stone of Remembrance',
    description: 'A smooth stone engraved by Celeborn\'s own hand with the name BALIN SON OF FUNDIN, LORD OF MORIA, and beneath it a single line in Khuzdul — the dwarven tongue. A small stone to hold so much grief.',
    type: 'quest',
    value: 0,
  },
  'moria-chronicle': {
    id: 'moria-chronicle',
    name: 'Chronicle of Moria',
    description: 'A careful account you have written of what you found in Khazad-dûm — Balin\'s colony, the Book of Mazarbul, the Balrog. The truth of what happened there, set down for those who would know.',
    type: 'quest',
    value: 0,
  },
  'mirror-vision': {
    id: 'mirror-vision',
    name: 'Memory of the Mirror',
    description: 'Something Galadriel\'s Mirror showed you. The image will not leave your mind: a hand reaching for a ring of gold in a place of shadow. The sight troubles your sleep.',
    type: 'quest',
    value: 0,
  },
}
