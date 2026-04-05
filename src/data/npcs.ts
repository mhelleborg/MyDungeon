import type { NPC } from '../types/npc'
import type { DialogueTree } from '../types/dialogue'

// ── Dialogue trees for Act 1 NPCs ─────────────────────────────────────────

const noriTree: DialogueTree = {
  rootNodeId: 'nori-greeting',
  nodes: {
    'nori-greeting': {
      id: 'nori-greeting',
      npcText: 'Hail, traveler. I am Nori, son of Bori. I came seeking the riches of Khazad-dûm, but found only ruin. I have healing draughts, if you have coin — you\'ll need them before the end.',
      playerOptions: [
        {
          id: 'ask-balrog',
          label: 'Tell me about the Balrog.',
          nextNodeId: 'nori-balrog',
        },
        {
          id: 'ask-balin',
          label: 'What do you know of Balin\'s colony?',
          nextNodeId: 'nori-balin',
        },
        {
          id: 'trade',
          label: 'Let me see what you have for sale.',
          nextNodeId: 'nori-trade',
        },
        {
          id: 'goodbye',
          label: 'Safe travels, Nori.',
          nextNodeId: 'nori-farewell',
        },
      ],
    },
    'nori-balrog': {
      id: 'nori-balrog',
      npcText: 'The Balrog... it dwells at the bridge. Fire and shadow — a creature of the First Age, older than the mountains. No ordinary blade can fell such a thing. You must be clever, or very strong. And the bridge itself — if you can break it, you end the fight. Halbarad the Ranger told me that much.',
      playerOptions: [
        {
          id: 'ask-bridge',
          label: 'Break the bridge — how?',
          nextNodeId: 'nori-bridge',
        },
        {
          id: 'back',
          label: 'I\'ve heard enough. Thank you.',
          nextNodeId: 'nori-farewell',
        },
      ],
    },
    'nori-bridge': {
      id: 'nori-bridge',
      npcText: 'The bridge is cracked already — ancient stress, the weight of ages. If you can drive the Balrog to the centre of the span, then apply force at the right moment... pure strength, or magical focus. The Ranger said "break what is already broken." It\'s your best chance.',
      playerOptions: [
        {
          id: 'back2',
          label: 'Thank you, Nori.',
          nextNodeId: 'nori-farewell',
        },
      ],
    },
    'nori-balin': {
      id: 'nori-balin',
      npcText: 'Balin — aye, a great dwarf. He came with sixty brave souls to reclaim the mines five years past. We heard only silence after. The Chamber of Records holds the truth of what became of them. The Book of Mazarbul... do not read the last pages alone.',
      playerOptions: [
        {
          id: 'back3',
          label: 'I\'ll be careful.',
          nextNodeId: 'nori-farewell',
        },
      ],
    },
    'nori-trade': {
      id: 'nori-trade',
      npcText: 'Trade is always open. Type "trade" to see my wares.',
      playerOptions: [
        {
          id: 'back4',
          label: 'Perhaps later.',
          nextNodeId: 'nori-farewell',
        },
      ],
    },
    'nori-farewell': {
      id: 'nori-farewell',
      npcText: 'Mind your step, traveler. And if you reach the other side — tell them Nori of Erebor sent you.',
      playerOptions: [],
    },
  },
}

const elanorTree: DialogueTree = {
  rootNodeId: 'elanor-greeting',
  nodes: {
    'elanor-greeting': {
      id: 'elanor-greeting',
      npcText: 'Thank the Valar — a living soul! I am Elanor of Lothlórien. I was separated from my company days ago. The darkness here is not natural — it presses against the mind.',
      onEnter: [],
      playerOptions: [
        {
          id: 'ask-lorien',
          label: 'Tell me about Lothlórien.',
          nextNodeId: 'elanor-lorien',
        },
        {
          id: 'ask-darkness',
          label: 'What do you mean, the darkness presses?',
          nextNodeId: 'elanor-darkness',
        },
        {
          id: 'ask-mithril',
          label: 'Is there treasure worth finding here?',
          nextNodeId: 'elanor-mithril',
        },
        {
          id: 'travel',
          label: 'Will you travel with me?',
          nextNodeId: 'elanor-recruit',
          conditions: [{ type: 'alreadyInteracted' }],
        },
      ],
    },
    'elanor-lorien': {
      id: 'elanor-lorien',
      npcText: 'The Golden Wood... it is more than a forest. It lives, breathes, thinks. Galadriel guards it — and she sees more than mortal eyes ever could. If you reach the East Gate, go south and west. Follow the Silverlode. Lórien will find you, if you are worthy of finding.',
      playerOptions: [
        {
          id: 'back-e1',
          label: 'That sounds like somewhere worth reaching.',
          nextNodeId: 'elanor-greeting',
        },
      ],
    },
    'elanor-darkness': {
      id: 'elanor-darkness',
      npcText: 'There is a presence here — ancient, immense, filled with hatred. Not the goblins or orcs. Something deeper. My people feel such things more keenly than mortals. It is aware of us. It has been aware of me this whole time.',
      playerOptions: [
        {
          id: 'back-e2',
          label: 'Stay close to me, then.',
          nextNodeId: 'elanor-greeting',
        },
      ],
    },
    'elanor-mithril': {
      id: 'elanor-mithril',
      npcText: 'There is a coat of mithril somewhere in these mines, worth more than all the gold in the Shire. The dwarves hid their greatest treasures well. And if you have a blade from the old wars — Glamdring, perhaps — this place may yet wake it.',
      playerOptions: [
        {
          id: 'back-e3',
          label: 'I\'ll keep my eyes open.',
          nextNodeId: 'elanor-greeting',
        },
      ],
    },
    'elanor-recruit': {
      id: 'elanor-recruit',
      npcText: 'Two sets of eyes in this darkness... yes. I would rather face the shadow alongside someone than alone. Take this, with my gratitude. And I will walk with you.',
      playerOptions: [],
    },
  },
}

const bomburTree: DialogueTree = {
  rootNodeId: 'bombur-greeting',
  nodes: {
    'bombur-greeting': {
      id: 'bombur-greeting',
      npcText: 'Well met, well met! I am Bombur, son of Bofur. I came down here to reclaim my grandfather\'s forge, but the orcs had other ideas. Still — a smith never travels without his wares!',
      playerOptions: [
        {
          id: 'ask-forge',
          label: 'Tell me about the forge.',
          nextNodeId: 'bombur-forge',
        },
        {
          id: 'ask-levers',
          label: 'Do you know about the levers in the forge room?',
          nextNodeId: 'bombur-levers',
        },
        {
          id: 'trade-b',
          label: 'What do you have for sale?',
          nextNodeId: 'bombur-trade',
        },
        {
          id: 'goodbye-b',
          label: 'Good luck with your forge, Bombur.',
          nextNodeId: 'bombur-farewell',
        },
      ],
    },
    'bombur-forge': {
      id: 'bombur-forge',
      npcText: 'My grandfather Bifur worked the Abandoned Forge in his youth. Finest ironwork in the Misty Mountains, back in the day. The forge\'s fire still burns — it\'s enchanted, old dwarven-craft. But the locking mechanism on the ore channel is still coded to the old sequences.',
      playerOptions: [
        {
          id: 'back-b1',
          label: 'Fascinating. Thank you.',
          nextNodeId: 'bombur-greeting',
        },
      ],
    },
    'bombur-levers': {
      id: 'bombur-levers',
      npcText: 'Those levers on the wall — I\'ve been trying to crack the sequence for weeks. Something about flame, water, and hammer... if only I could read the old runes properly. The inscription above them says the sequence "controls the flow" — if you figure it out, give it a try.',
      playerOptions: [
        {
          id: 'back-b2',
          label: 'Flame, water, hammer. Got it.',
          nextNodeId: 'bombur-farewell',
        },
      ],
    },
    'bombur-trade': {
      id: 'bombur-trade',
      npcText: 'Aye, I\'ve got goods if you\'ve got gold. Type "trade" to see what I have.',
      playerOptions: [
        {
          id: 'back-b3',
          label: 'I\'ll think about it.',
          nextNodeId: 'bombur-farewell',
        },
      ],
    },
    'bombur-farewell': {
      id: 'bombur-farewell',
      npcText: 'Safe passage to you! Don\'t let the goblins have the last word!',
      playerOptions: [],
    },
  },
}

const halbaradTree: DialogueTree = {
  rootNodeId: 'halbarad-greeting',
  nodes: {
    'halbarad-greeting': {
      id: 'halbarad-greeting',
      npcText: 'Stay your blade — I am a friend. Halbarad, of the Dúnedain. I tracked an orc raiding party into these accursed mines.',
      playerOptions: [
        {
          id: 'ask-dunedain',
          label: 'The Dúnedain? Rangers of the North?',
          nextNodeId: 'halbarad-dunedain',
        },
        {
          id: 'ask-bridge',
          label: 'Do you know the way to the East Gate?',
          nextNodeId: 'halbarad-bridge',
        },
        {
          id: 'ask-secret',
          label: 'You mentioned a secret armory?',
          nextNodeId: 'halbarad-armory',
        },
        {
          id: 'ask-travel',
          label: 'Come with me. I could use a scout.',
          nextNodeId: 'halbarad-recruit',
          conditions: [{ type: 'alreadyInteracted' }],
        },
      ],
    },
    'halbarad-dunedain': {
      id: 'halbarad-dunedain',
      npcText: 'Aye. We are the heirs of Isildur, diminished and scattered but not yet broken. We guard the North from threats most folk never hear of. These orc raiders — they\'re organised. Someone coordinates them. It worries me greatly.',
      playerOptions: [
        {
          id: 'back-h1',
          label: 'That is troubling news.',
          nextNodeId: 'halbarad-greeting',
        },
      ],
    },
    'halbarad-bridge': {
      id: 'halbarad-bridge',
      npcText: 'The East Gate lies beyond the Bridge of Khazad-dûm. But the bridge is not unguarded — nothing in Moria is. The Balrog waits there. I\'ve studied the architecture. When the bridge cracks beneath its weight, seize the moment. Break what is already broken.',
      playerOptions: [
        {
          id: 'back-h2',
          label: 'I\'ll remember that.',
          nextNodeId: 'halbarad-greeting',
        },
      ],
    },
    'halbarad-armory': {
      id: 'halbarad-armory',
      npcText: 'There is a hidden chamber behind the western wall of the mining shaft. The dwarves concealed it well — look for irregularities in the stonework. The orcs never found it. Their loss is your gain.',
      playerOptions: [
        {
          id: 'back-h3',
          label: 'I\'ll look for it.',
          nextNodeId: 'halbarad-greeting',
        },
      ],
    },
    'halbarad-recruit': {
      id: 'halbarad-recruit',
      npcText: 'A ranger travels alone by custom, but custom bends in places like this. Aye — I\'ll walk with you to the East Gate. Take this Miruvor. You may need it before the bridge.',
      playerOptions: [],
    },
  },
}

const oriTree: DialogueTree = {
  rootNodeId: 'ori-greeting',
  nodes: {
    'ori-greeting': {
      id: 'ori-greeting',
      npcText: 'Do not fear me, living one. I am Ori, last chronicler of Balin\'s colony. I linger here to warn those who come after.',
      playerOptions: [
        {
          id: 'ask-colony',
          label: 'What happened to Balin\'s colony?',
          nextNodeId: 'ori-colony',
        },
        {
          id: 'ask-book',
          label: 'I found the Book of Mazarbul.',
          nextNodeId: 'ori-book',
        },
        {
          id: 'ask-deep',
          label: 'What lurks in the deep places?',
          nextNodeId: 'ori-deep',
        },
        {
          id: 'ask-knowledge',
          label: 'Is there anything else you can offer me?',
          nextNodeId: 'ori-knowledge-offer',
          conditions: [{ type: 'choiceNotMade', choiceId: 'oris-knowledge' }],
        },
      ],
    },
    'ori-colony': {
      id: 'ori-colony',
      npcText: 'We delved too deep. The Balrog slumbered in the uttermost depths, and our picks and our greed woke it. Fire and shadow consumed us. Balin fell first, by arrow — then the rest of us fell in the defence of his tomb. I wrote the last pages in the dark.',
      playerOptions: [
        {
          id: 'back-o1',
          label: 'I am sorry, Ori. It should not have ended so.',
          nextNodeId: 'ori-grief',
        },
        {
          id: 'back-o2',
          label: 'Where is the armory the orcs never found?',
          nextNodeId: 'ori-armory',
        },
      ],
    },
    'ori-grief': {
      id: 'ori-grief',
      npcText: 'No. It should not have. We were proud and we paid for it. Carry that lesson with you, traveler. The world beyond needs wiser heads than we had.',
      playerOptions: [
        { id: 'back-og', label: 'I will.', nextNodeId: 'ori-greeting' },
      ],
    },
    'ori-armory': {
      id: 'ori-armory',
      npcText: 'The western mines. Behind the false stone in the mining shaft. We stored things there the orcs were not meant to find — and they never did.',
      playerOptions: [
        { id: 'back-oa', label: 'Thank you, Ori.', nextNodeId: 'ori-greeting' },
      ],
    },
    'ori-book': {
      id: 'ori-book',
      npcText: 'Then you know all of it. The hope, the fall, the last entry. "They are coming" — I wrote those words with shaking hands. I did not know whether anyone would ever read them. I am... glad someone did.',
      playerOptions: [
        { id: 'back-ob', label: 'Your words were not wasted.', nextNodeId: 'ori-greeting' },
      ],
    },
    'ori-deep': {
      id: 'ori-deep',
      npcText: 'The Balrog is the worst of what we found. But the deep places hold older things still — nameless, shapeless, things that moved in the dark before even Durin\'s folk came. I do not know what they are. I pray you never find out.',
      playerOptions: [
        { id: 'back-od', label: 'Duly noted.', nextNodeId: 'ori-greeting' },
      ],
    },
    'ori-knowledge-offer': {
      id: 'ori-knowledge-offer',
      npcText: 'There is... one more thing I can offer. The knowledge of the deep places — battle-lore the dwarves learned fighting nameless things. It will make you deadly. But such knowledge burns. It will cost you part of your vitality — your very life-force. The choice is yours.',
      playerOptions: [],
      onEnter: [{ type: 'presentChoice', choiceId: 'oris-knowledge' }],
    },
  },
}

const snagaTree: DialogueTree = {
  rootNodeId: 'snaga-greeting',
  nodes: {
    'snaga-greeting': {
      id: 'snaga-greeting',
      npcText: 'No kill! No kill! Snaga is friend! Other goblins stupid — fight, die, fight, die. Snaga smart. Snaga sells to anyone! Even tall-folk! You want things, yes?',
      playerOptions: [
        {
          id: 'ask-why',
          label: 'Why are you helping us?',
          nextNodeId: 'snaga-why',
        },
        {
          id: 'trade-s',
          label: 'Show me what you have.',
          nextNodeId: 'snaga-trade',
        },
        {
          id: 'goodbye-s',
          label: 'Farewell, Snaga.',
          nextNodeId: 'snaga-farewell',
        },
      ],
    },
    'snaga-why': {
      id: 'snaga-why',
      npcText: 'Gold is gold! Big bosses want everything — Snaga keeps nothing. Better to sell to tall-folk than give it all to Bolg-captain. Bolg is mean. Snaga not like mean. Gold buys Snaga freedom someday, yes yes.',
      playerOptions: [
        {
          id: 'back-s1',
          label: 'Fair enough, Snaga.',
          nextNodeId: 'snaga-greeting',
        },
        {
          id: 'mercy-s',
          label: 'I\'ll say a word for you, if I make it out.',
          nextNodeId: 'snaga-touched',
          conditions: [{ type: 'flag', flag: 'goblin-mercy' }],
        },
      ],
    },
    'snaga-touched': {
      id: 'snaga-touched',
      npcText: 'Tall-one... is kind to goblin-kind? This is... strange. Good strange. Snaga not forget. Here — take this. No charge. Snaga owes you now.',
      onEnter: [{ type: 'giveItem', itemId: 'healing-potion' }],
      playerOptions: [
        { id: 'back-st', label: 'Thank you, Snaga.', nextNodeId: 'snaga-farewell' },
      ],
    },
    'snaga-trade': {
      id: 'snaga-trade',
      npcText: 'Cheap prices, good quality... mostly! Type "trade" to see Snaga\'s wares.',
      playerOptions: [
        { id: 'back-str', label: 'I\'ll take a look.', nextNodeId: 'snaga-farewell' },
      ],
    },
    'snaga-farewell': {
      id: 'snaga-farewell',
      npcText: 'Come back if you need more! Snaga always here!',
      playerOptions: [],
    },
  },
}

// ── NPC definitions ────────────────────────────────────────────────────────

export const npcs: Record<string, NPC> = {
  'wounded-dwarf': {
    id: 'wounded-dwarf',
    name: 'Nori the Wounded Dwarf',
    description: 'A battered dwarf propped against the wall, clutching a bandaged arm. His eyes are sharp despite his injuries.',
    dialogue: [
      '"Hail, traveler. I am Nori, son of Bori. I came seeking the riches of Khazad-dum, but found only ruin."',
      '"The Balrog... fire and shadow. No ordinary blade can fell such a thing — you must be clever, or very strong."',
      '"I have healing draughts, if you have coin. You\'ll need them before the end."',
    ],
    dialogueTree: noriTree,
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
      '"The darkness here is not natural — it presses against the mind."',
      '"Take this, with my gratitude. And if you seek the east gate, beware the Second Hall."',
      '"There is a coat of mithril somewhere in these mines, worth more than all the gold in the Shire."',
    ],
    dialogueTree: elanorTree,
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
    description: 'A stout, soot-blackened dwarf tends a small portable forge, hammering with practiced strokes. His beard is singed at the tips but his eyes are merry.',
    dialogue: [
      '"Well met! I am Bombur, son of Bofur. I came to reclaim my grandfather\'s forge, but the orcs had other ideas."',
      '"Those levers on the wall — flame, water, and hammer. I\'ve been trying to crack the sequence for weeks."',
      '"I\'ve got goods if you\'ve got gold. A smith never travels without his wares!"',
    ],
    dialogueTree: bomburTree,
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
    description: 'A tall, grim-faced man in a weathered cloak leans against the wall, grey eyes watchful. A star gleams faintly on his breast — a Ranger of the North.',
    dialogue: [
      '"Stay your blade — I am a friend. Halbarad, of the Dúnedain."',
      '"There is a secret armory behind the western wall of the mining shaft."',
      '"The Balrog: when the bridge cracks, seize the moment. Break what is already broken."',
      '"Take this Miruvor. You will need its warmth before the end."',
    ],
    dialogueTree: halbaradTree,
    questReward: {
      itemId: 'miruvor',
      message: 'Halbarad uncorks a crystal flask and hands it to you. "Miruvor — the cordial of Imladris. Drink when hope seems lost."',
    },
    recruitableCompanionId: 'shadow-ranger',
  },

  'ghost-of-ori': {
    id: 'ghost-of-ori',
    name: 'Shade of Ori',
    description: 'A translucent figure in dwarven armor hovers near the tomb, face etched with sorrow. The ghost of Ori, companion of Balin, keeper of the Book of Mazarbul.',
    dialogue: [
      '"Do not fear me, living one. I am Ori, last chronicler of Balin\'s colony."',
      '"We delved too deep. The Balrog woke. Fire and shadow consumed us."',
      '"If you read the Book of Mazarbul — our final entry was penned in haste. They came."',
      '"Seek the armory the orcs never found. The western mines hold secrets."',
    ],
    dialogueTree: oriTree,
    detectableInDark: true,
  },

  'merchant-goblin': {
    id: 'merchant-goblin',
    name: 'Snaga the Goblin Peddler',
    description: 'A scrawny goblin crouches behind a makeshift stall, grinning with too many teeth. Unlike its kin, it seems more interested in commerce than combat.',
    dialogue: [
      '"No kill! No kill! Snaga is friend! Snaga sells things, yes yes!"',
      '"Other goblins stupid. Fight, die, fight, die. Snaga smart — Snaga sells to anyone!"',
      '"You want potions? Blades? Snaga has! Cheap prices, good quality... mostly."',
    ],
    dialogueTree: snagaTree,
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
