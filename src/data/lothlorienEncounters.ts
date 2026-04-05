import type { Encounter } from '../types/encounter'

export const lothlorienEncounters: Encounter[] = [
  // ── Lore encounters ────────────────────────────────────────────
  {
    id: 'lore-nimrodel-tale',
    type: 'lore',
    name: 'The Tale of Nimrodel',
    description: 'A memory stirs as you walk beneath the mellyrn — something Elanor once told you, or something carried on the air of this place.',
    loreText:
      'Nimrodel was an Elven-maid who loved the stream that bore her name above all other things in the world. When the Balrog came to Moria and evil fell upon the valley, she fled south with her love Amroth, King of Lórien. They were separated. He sailed for Elvenhome calling her name and she was never seen again. The stream still carries the sound of her grief — if you listen when the wind drops, you can hear something like a voice among the falling notes of the water.',
    rewardXp: 25,
    oneTime: true,
    weight: 12,
  },
  {
    id: 'lore-mallorn-age',
    type: 'lore',
    name: 'The Age of the Mallorns',
    description: 'You pass your hand across the bark of a mallorn and something vast stirs — as if the tree itself is aware of you.',
    loreText:
      'The mallorn trees of Lothlórien were a gift of the Eldar in the Second Age, and they remember everything. Their leaves are gold even in summer and do not fall until spring, when new gold takes their place — there is no autumn here, no dying back. The oldest of them were already ancient when Sauron built Barad-dûr. They have seen the rise and fall of kingdoms, the death of stars. Next to them, even your grief feels appropriately sized.',
    rewardXp: 20,
    oneTime: true,
    weight: 8,
  },
  {
    id: 'lore-galadriel-ring',
    type: 'lore',
    name: 'The Ring of Adamant',
    description: 'You catch a glimpse of light on Galadriel\'s hand — three small stones in a silver band — and something Gandalf said comes back to you.',
    loreText:
      'Nenya, the Ring of Adamant — one of the Three Elven rings forged by Celebrimbor in the Second Age, never touched by Sauron\'s hand. The Elven rings preserve and protect. They do not grant dominion. Galadriel has wielded Nenya for three thousand years, and by its power Lothlórien has been kept fair and unchanging against the long decay of the world. But if the One Ring is destroyed, Nenya\'s power goes with it. The preservation of Lothlórien is, in the end, a borrowed grace.',
    rewardXp: 30,
    oneTime: true,
    weight: 6,
  },
  {
    id: 'lore-caras-galadhon',
    type: 'lore',
    name: 'The City in the Trees',
    description: 'Looking up through the canopy you see lights between the branches — and begin to understand that the "city" here is not built upon the ground at all.',
    loreText:
      'Caras Galadhon — the City of the Trees — is built entirely in the crowns of the great mallorns. Each talan (a platform, a flet) is a dwelling place, a hall, a watchtower. The Galadhrim move through the canopy as fish move through water; you would not know they were there unless they wished you to. The city is invisible from below unless you know what to look for: the soft lamplight filtering gold through the leaves, the faint sound of singing, the lack of birdsong, the uncanny stillness. All that is absent where others are present.',
    rewardXp: 20,
    oneTime: true,
    weight: 10,
  },

  // ── Discovery encounters ────────────────────────────────────────
  {
    id: 'discovery-healing-spring',
    type: 'discovery',
    name: 'A Hidden Spring',
    description: 'Between the roots of a great mallorn you find a clear spring, welling up from beneath the stone. The water is cold and clean.',
    discoveryText:
      'You cup the water in your hands and drink. It tastes like the first day of spring — something in it eases the deep weariness of Moria from your bones. A small kindness in a kind place.',
    healHp: 8,
    oneTime: true,
    weight: 10,
  },
  {
    id: 'discovery-song-fragment',
    type: 'discovery',
    name: 'Words on Bark',
    description: 'Someone has inscribed words on the smooth inner surface of a fallen mallorn leaf — in tiny, careful script.',
    discoveryText:
      'The inscription is in Sindarin but you can make out enough: a line of the old song of Nimrodel, different from the fragments you\'ve found. You copy it into your memory: "Her footsteps light as the silver rain still mark the hidden ways." A song fragment, found where least expected.',
    rewardItemIds: ['nimrodel-fragment-3'],
    oneTime: true,
    weight: 8,
  },
  {
    id: 'discovery-miruvor',
    type: 'discovery',
    name: 'A Warden\'s Gift',
    description: 'A Lórien warden steps from the shadows and presses something into your hand without explanation, then melts back into the trees.',
    discoveryText:
      '"The Lady sends you this," the warden says. Before you can respond, they are gone. In your hand is a small waybread wrapped in a leaf — lembas. A gift from Caras Galadhon, offered without ceremony.',
    rewardItemIds: ['lembas-bread'],
    oneTime: true,
    weight: 7,
  },

  // ── Skill-check encounters ─────────────────────────────────────
  {
    id: 'skill-elven-patrol',
    type: 'skill-check',
    name: 'Elven Patrol',
    description: 'Three Galadhrim wardens drop from the canopy without sound and regard you with measuring eyes. "Stranger. State your purpose in the wood."',
    ability: 'cha',
    dc: 12,
    successText:
      'You explain yourself with care — mentioning Haldir\'s passage, or Elanor\'s name, or simply speaking plainly with nothing hidden. The lead warden nods. "You may pass. Walk openly and mean no harm, and the wood will protect you." They vanish back into the branches.',
    failureText:
      'Your explanation falters. The wardens exchange glances. "We will escort you to Haldir," the lead one says, which is not the same as letting you go. The detour costs you time, and the sharp eyes on your back make you nervous.',
    rewardGold: 0,
    failDamage: 0,
    oneTime: false,
    weight: 9,
  },
  {
    id: 'skill-ancient-tree',
    type: 'skill-check',
    name: 'The Weight of Memory',
    description: 'You rest your hand on the trunk of an ancient mallorn and the silence deepens. There is something here — old and vast and not entirely comfortable with mortal attention.',
    ability: 'wis',
    dc: 13,
    successText:
      'You hold still and let the immensity wash over you — the years, the grief, the slow patience of something that has outlasted empires. When you lift your hand, you feel strangely steadied. Whatever comes next, you have touched something that has lasted. That helps.',
    failureText:
      'The weight of the years hits you like a physical thing — so much loss, so much that was beautiful and is now gone. You step back, heart hammering. The mallorns have stood through everything. You don\'t know whether that is comforting or terrible.',
    rewardGold: 0,
    failDamage: 3,
    rewardItemIds: [],
    oneTime: true,
    weight: 7,
  },

  // ── Riddle encounters ──────────────────────────────────────────
  {
    id: 'riddle-nimrodel-echo',
    type: 'riddle',
    name: 'An Echo in the Water',
    description: 'Near a stream, a ripple forms on still water without cause. A voice, barely audible, speaks — clear as a bell and gone before you can catch it.',
    riddle: '"The silver stream speaks in a tongue that carries no words. I am the sound between sounds, the message between messages, the language that needs no translation. What am I?"',
    answer: 'music',
    rewardXp: 30,
    rewardGold: 0,
    oneTime: true,
    weight: 9,
  },
  {
    id: 'riddle-galadhrim-wisdom',
    type: 'riddle',
    name: 'A Warden\'s Riddle',
    description: 'A young Galadhrim warden, braver or more curious than most, stops you at a fork in the path. "A riddle, if you\'ll have one, stranger. Answer it and I\'ll show you a shortcut."',
    riddle: '"I grow stronger the more I am given away. I cost nothing to carry and everything to hold back. A king has no more of me than a beggar, and a child has it in greater measure than the wisest sage. What am I?"',
    answer: 'trust',
    rewardXp: 25,
    rewardGold: 15,
    oneTime: true,
    weight: 10,
  },
]
