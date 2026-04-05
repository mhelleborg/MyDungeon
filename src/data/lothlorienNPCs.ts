import type { NPC } from '../types/npc'
import type { DialogueTree } from '../types/dialogue'

// ── Haldir ──────────────────────────────────────────────────────────────────

const haldirTree: DialogueTree = {
  rootNodeId: 'haldir-greeting',
  nodes: {
    'haldir-greeting': {
      id: 'haldir-greeting',
      npcText: 'Halt. I am Haldir of Lórien. You come from the East Gate — we have watched your approach. Few emerge from Moria alive. Speak your purpose.',
      playerOptions: [
        {
          id: 'ask-lorien',
          label: 'Tell me about this forest.',
          nextNodeId: 'haldir-lorien',
        },
        {
          id: 'ask-enemy',
          label: 'What news of the Enemy?',
          nextNodeId: 'haldir-enemy',
        },
        {
          id: 'ask-caras',
          label: 'How do I reach Caras Galadhon?',
          nextNodeId: 'haldir-caras',
        },
        {
          id: 'moria-report',
          label: 'I carry word from the mines of Moria.',
          nextNodeId: 'haldir-moria',
          conditions: [{ type: 'hasItem', itemId: 'balin-tome' }],
        },
      ],
    },
    'haldir-lorien': {
      id: 'haldir-lorien',
      npcText: 'This is Lothlórien, the Golden Wood. It is guarded by the Lady Galadriel and the Lord Celeborn. No evil thing enters here that is not seen and challenged. The mallorns grow nowhere else in Middle-earth. Under their boughs, time moves differently — slower, gentler, kinder to those who walk here.',
      playerOptions: [
        { id: 'back-h1', label: 'It is beautiful.', nextNodeId: 'haldir-greeting' },
      ],
    },
    'haldir-enemy': {
      id: 'haldir-enemy',
      npcText: 'Orc raids from Moria grow bolder. Spiders from Mirkwood test the eastern border. And in the south, Dol Guldur stirs again — a darkness that has not yet declared itself but presses against the edges of the wood. The Lady holds, but the shadow lengthens.',
      npcTextVariants: [
        {
          condition: { type: 'flag', flag: 'oris-knowledge-accepted' },
          text: 'I sense something upon you — a shadow that is not your own. You carry knowledge from the deep places. Be cautious. The Lady will see it, and she will ask you about it.',
        },
      ],
      playerOptions: [
        { id: 'back-h2', label: 'I will be on my guard.', nextNodeId: 'haldir-greeting' },
      ],
    },
    'haldir-caras': {
      id: 'haldir-caras',
      npcText: 'Follow the paths south and west. Cerin Amroth lies at the heart of the wood — from there, the way to Caras Galadhon is clear. But you will need a token of trust to pass the inner gates. Speak with Lord Celeborn and earn his trust.',
      playerOptions: [
        { id: 'back-h3', label: 'Thank you, Haldir.', nextNodeId: 'haldir-farewell' },
      ],
    },
    'haldir-moria': {
      id: 'haldir-moria',
      npcText: 'You carry the Book of Mazarbul? Then the rumours are true — Balin\'s colony has fallen. This is ill news... but it is news the Lord and Lady must hear. Take this brooch — it marks you as a guest of the wood. Show it at the gates of Caras Galadhon.',
      onEnter: [{ type: 'giveItem', itemId: 'leaf-brooch' }, { type: 'setFlag', flag: 'haldir-trusted' }, { type: 'giveXP', xp: 30 }],
      playerOptions: [
        { id: 'back-hm', label: 'I will deliver my report.', nextNodeId: 'haldir-farewell' },
      ],
    },
    'haldir-farewell': {
      id: 'haldir-farewell',
      npcText: 'Walk well beneath the mallorns, traveler. And keep your eyes open — the wood has more than one kind of watcher.',
      playerOptions: [],
    },
  },
}

// ── Rúmil ──────────────────────────────────────────────────────────────────

const rumilTree: DialogueTree = {
  rootNodeId: 'rumil-greeting',
  nodes: {
    'rumil-greeting': {
      id: 'rumil-greeting',
      npcText: 'Well met, stranger. I am Rúmil, brother of Haldir. I keep the southern watch — and in quieter hours, I collect the old tales. You have the look of someone with a story.',
      playerOptions: [
        {
          id: 'ask-nimrodel',
          label: 'Tell me the tale of Nimrodel.',
          nextNodeId: 'rumil-nimrodel',
        },
        {
          id: 'ask-forest',
          label: 'What should I know about the forest?',
          nextNodeId: 'rumil-forest',
        },
        {
          id: 'ask-war',
          label: 'Is war coming to Lothlórien?',
          nextNodeId: 'rumil-war',
        },
      ],
    },
    'rumil-nimrodel': {
      id: 'rumil-nimrodel',
      npcText: 'Nimrodel was an Elven-maid who loved the stream above all things. When the Balrog woke in Moria, evil fell upon the valley. She fled south with Amroth, her love and king. They were separated. He sailed for the Undying Lands calling her name, and she was never seen again. Her song survives in three fragments — one by the stream, one at the falls, one upon Cerin Amroth. If you gather them all, sing them at the falls. Something may answer.',
      onEnter: [{ type: 'giveXP', xp: 20 }],
      playerOptions: [
        { id: 'back-r1', label: 'A sad tale. Thank you.', nextNodeId: 'rumil-greeting' },
      ],
    },
    'rumil-forest': {
      id: 'rumil-forest',
      npcText: 'The wood is safe within its borders, but the borders themselves are contested. Watch for spiders in the north hollow — a Mirkwood brood has nested there. And the trees themselves... they are not entirely dormant. Treat them with respect and they will shelter you.',
      npcTextVariants: [
        {
          condition: { type: 'flag', flag: 'goblin-mercy' },
          text: 'You showed mercy to a goblin in the mines — I heard. That is unusual for one who fights orcs. In Lothlórien we believe that mercy has its own strength. The trees remember kindness.',
        },
      ],
      playerOptions: [
        { id: 'back-r2', label: 'I will remember.', nextNodeId: 'rumil-greeting' },
      ],
    },
    'rumil-war': {
      id: 'rumil-war',
      npcText: 'War has always been at our borders. It is only a question of when it enters the wood. The Lady prepares. Celeborn musters what allies remain. But the Elven rings cannot hold forever — if the One Ring is found, all our defences fall. We fight for time, traveler. And time is the one thing we cannot make more of.',
      playerOptions: [
        { id: 'back-r3', label: 'Then we must use it well.', nextNodeId: 'rumil-farewell' },
      ],
    },
    'rumil-farewell': {
      id: 'rumil-farewell',
      npcText: 'Indeed. Walk well, friend. And if you find yourself at the falls of Nimrodel — listen. The water remembers her voice.',
      playerOptions: [],
    },
  },
}

// ── Celeborn ───────────────────────────────────────────────────────────────

const celebornTree: DialogueTree = {
  rootNodeId: 'celeborn-greeting',
  nodes: {
    'celeborn-greeting': {
      id: 'celeborn-greeting',
      npcText: 'Welcome to Caras Galadhon, traveler. I am Celeborn, lord of the Golden Wood. You come from the darkness of Khazad-dûm — I would hear your account.',
      playerOptions: [
        {
          id: 'report-moria',
          label: 'I will tell you what I found in Moria.',
          nextNodeId: 'celeborn-report',
        },
        {
          id: 'ask-defense',
          label: 'How stands Lothlórien\'s defense?',
          nextNodeId: 'celeborn-defense',
        },
        {
          id: 'ask-road',
          label: 'What lies ahead for me?',
          nextNodeId: 'celeborn-road',
        },
        {
          id: 'give-tome',
          label: 'I carry Balin\'s Book of Mazarbul.',
          nextNodeId: 'celeborn-tome',
          conditions: [{ type: 'hasItem', itemId: 'balin-tome' }],
        },
      ],
    },
    'celeborn-report': {
      id: 'celeborn-report',
      npcText: 'The colony has fallen, then. We feared as much. The Balrog... we hoped it was merely legend, whispered by frightened dwarves. But you have seen it and lived. That alone speaks to your quality.',
      npcTextVariants: [
        {
          condition: { type: 'companionDead' },
          text: 'The colony has fallen. And you did not come through unscathed — I see the shadow of loss upon you. Those who gave their lives in the crossing of Moria will not be forgotten. Not here, where memory is the longest.',
        },
      ],
      onEnter: [{ type: 'giveXP', xp: 25 }, { type: 'setFlag', flag: 'celeborn-audience' }],
      playerOptions: [
        { id: 'back-c1', label: 'The cost was high.', nextNodeId: 'celeborn-brooch' },
      ],
    },
    'celeborn-brooch': {
      id: 'celeborn-brooch',
      npcText: 'You have earned the trust of Lothlórien. Take this leaf-brooch — it marks you as a friend of the Galadhrim. All doors in Caras Galadhon are open to you.',
      onEnter: [{ type: 'giveItem', itemId: 'leaf-brooch' }],
      playerOptions: [
        { id: 'back-cb', label: 'Thank you, Lord Celeborn.', nextNodeId: 'celeborn-farewell' },
      ],
    },
    'celeborn-defense': {
      id: 'celeborn-defense',
      npcText: 'We hold the borders. Haldir\'s wardens are the finest archers in Middle-earth. But numbers press against us — orcs from Moria, the growing threat from Dol Guldur in the south. The Lady\'s ring preserves what is within, but the world outside darkens. We cannot hold forever.',
      playerOptions: [
        { id: 'back-c2', label: 'I understand.', nextNodeId: 'celeborn-greeting' },
      ],
    },
    'celeborn-road': {
      id: 'celeborn-road',
      npcText: 'The Great River flows south to the sea. All roads now lead into shadow — but some pass through it and emerge into the light beyond. When you are ready to depart, go to the farewell lawn by the Silverlode. The Lady and I will give you what aid we can.',
      playerOptions: [
        { id: 'back-c3', label: 'I will prepare.', nextNodeId: 'celeborn-farewell' },
      ],
    },
    'celeborn-tome': {
      id: 'celeborn-tome',
      npcText: 'The Book of Mazarbul... the chronicle of Balin\'s last days. To hold this is to hold the weight of a people\'s grief. I will have a memorial stone carved in Balin\'s name. The dwarves were our allies once — and may be again.',
      onEnter: [{ type: 'giveItem', itemId: 'balin-memorial' }, { type: 'giveXP', xp: 40 }, { type: 'setFlag', flag: 'celeborn-audience' }],
      playerOptions: [
        { id: 'back-ct', label: 'He deserves to be remembered.', nextNodeId: 'celeborn-brooch' },
      ],
    },
    'celeborn-farewell': {
      id: 'celeborn-farewell',
      npcText: 'May the stars watch over you. The Golden Wood will remember your name.',
      playerOptions: [],
    },
  },
}

// ── Galadriel ──────────────────────────────────────────────────────────────

const galadrielTree: DialogueTree = {
  rootNodeId: 'galadriel-greeting',
  nodes: {
    'galadriel-greeting': {
      id: 'galadriel-greeting',
      npcText: 'Welcome, traveler. I have been expecting you. I am Galadriel.',
      npcTextVariants: [
        {
          condition: { type: 'flag', flag: 'oris-knowledge-accepted' },
          text: 'Welcome, traveler. I have been expecting you. I see the shadow of Moria\'s deep-lore upon your spirit. We shall speak of that presently. I am Galadriel.',
        },
      ],
      playerOptions: [
        {
          id: 'ask-shadow',
          label: 'Can you help me with the shadow I carry?',
          nextNodeId: 'galadriel-shadow',
          conditions: [{ type: 'flag', flag: 'oris-knowledge-accepted' }],
        },
        {
          id: 'ask-mirror',
          label: 'What does your Mirror show?',
          nextNodeId: 'galadriel-mirror',
        },
        {
          id: 'ask-gift',
          label: 'I was told you offer gifts to those who pass through.',
          nextNodeId: 'galadriel-gift',
        },
        {
          id: 'goodbye-g',
          label: 'I should go.',
          nextNodeId: 'galadriel-farewell',
        },
      ],
    },
    'galadriel-shadow': {
      id: 'galadriel-shadow',
      npcText: 'Ori\'s gift burns in you — deep-lore of nameless wars. It has made you deadly, but it consumes your life-force. I can draw it out, if you wish. You will lose the battle-knowledge, but your vitality will be restored. Or you may keep it, and bear the cost. The choice is yours.',
      onEnter: [{ type: 'presentChoice', choiceId: 'shadow-cleansing' }],
      playerOptions: [],
    },
    'galadriel-mirror': {
      id: 'galadriel-mirror',
      npcText: 'The Mirror stands in the garden to the west. It shows things that were, things that are, and things that yet may be. I will not counsel you to look or to refrain — the choice must be your own. Go to the mirror-room when you are ready.',
      playerOptions: [
        { id: 'back-g2', label: 'I will consider it.', nextNodeId: 'galadriel-greeting' },
      ],
    },
    'galadriel-gift': {
      id: 'galadriel-gift',
      npcText: 'I have something for you — a light for dark places. The Phial of Galadriel contains the light of Eärendil\'s star. May it guide you when all other lights go out.',
      onEnter: [{ type: 'giveItem', itemId: 'phial-of-galadriel' }, { type: 'setFlag', flag: 'galadriel-met' }, { type: 'giveXP', xp: 50 }],
      playerOptions: [
        { id: 'back-g3', label: 'I will treasure it.', nextNodeId: 'galadriel-farewell' },
      ],
    },
    'galadriel-farewell': {
      id: 'galadriel-farewell',
      npcText: 'Go well. The road ahead is long and uncertain, but you have proven your worth in the deeps of Khazad-dûm. That will not be forgotten.',
      npcTextVariants: [
        {
          condition: { type: 'companionDead' },
          text: 'Go well. You carry the grief of loss — I feel it. Those who fell beside you in Moria walk now in the halls beyond this world. They do not regret their sacrifice. Neither should you.',
        },
      ],
      playerOptions: [],
    },
  },
}

// ── Nimrodel's Spirit ──────────────────────────────────────────────────────

const nimrodelSpiritTree: DialogueTree = {
  rootNodeId: 'nimrodel-greeting',
  nodes: {
    'nimrodel-greeting': {
      id: 'nimrodel-greeting',
      npcText: '...the water remembers... I was here once... the falls knew my name...',
      npcTextVariants: [
        {
          condition: { type: 'hasItem', itemId: 'nimrodel-fragment-1' },
          text: '...you carry a fragment of my song... the words stir in the water... find the rest... bring them here...',
        },
      ],
      playerOptions: [
        {
          id: 'sing',
          label: 'Sing the complete song.',
          nextNodeId: 'nimrodel-song-complete',
          conditions: [
            { type: 'hasItem', itemId: 'nimrodel-fragment-1' },
            { type: 'hasItem', itemId: 'nimrodel-fragment-2' },
            { type: 'hasItem', itemId: 'nimrodel-fragment-3' },
          ],
        },
        {
          id: 'ask-who',
          label: 'Who are you?',
          nextNodeId: 'nimrodel-who',
        },
        {
          id: 'ask-fragments',
          label: 'Where can I find the fragments of your song?',
          nextNodeId: 'nimrodel-fragments',
        },
      ],
    },
    'nimrodel-who': {
      id: 'nimrodel-who',
      npcText: '...I am... I was... Nimrodel. The stream remembers what I have forgotten. I loved the water and the water loved me. Then the shadow came from the mountain and I fled... fled... and was lost...',
      playerOptions: [
        { id: 'back-n1', label: 'I am sorry for your loss.', nextNodeId: 'nimrodel-greeting' },
      ],
    },
    'nimrodel-fragments': {
      id: 'nimrodel-fragments',
      npcText: '...the stream carries one verse... the falls hide another... and the mound of Amroth, where he wept for me, holds the last. Find them... bring them to the water... let me hear my own song one final time...',
      onEnter: [{ type: 'giveXP', xp: 10 }],
      playerOptions: [
        { id: 'back-n2', label: 'I will find them for you.', nextNodeId: 'nimrodel-farewell' },
      ],
    },
    'nimrodel-song-complete': {
      id: 'nimrodel-song-complete',
      npcText: '...yes... YES. That is my song. All three verses, woven together as they were meant to be. The water sings with you... I remember now. I remember everything. Thank you, mortal one. You have given me back something I thought was lost forever. Take this — the song is yours now, complete and whole. Carry it into the world. Do not let it be forgotten.',
      onEnter: [
        { type: 'giveItem', itemId: 'nimrodel-song' },
        { type: 'giveXP', xp: 50 },
        { type: 'setFlag', flag: 'nimrodel-song-complete' },
      ],
      playerOptions: [
        { id: 'back-ns', label: 'I will not forget.', nextNodeId: 'nimrodel-farewell' },
      ],
    },
    'nimrodel-farewell': {
      id: 'nimrodel-farewell',
      npcText: '...the water flows on... and so do I...',
      playerOptions: [],
    },
  },
}

// ── Orophin ────────────────────────────────────────────────────────────────

const orophinTree: DialogueTree = {
  rootNodeId: 'orophin-greeting',
  nodes: {
    'orophin-greeting': {
      id: 'orophin-greeting',
      npcText: 'Welcome to my workshop, traveler. I am Orophin, brother of Haldir — though I confess I am more comfortable with a loom and a forge than a bow. What can I craft for you today?',
      playerOptions: [
        {
          id: 'ask-craft',
          label: 'Tell me about elven craftsmanship.',
          nextNodeId: 'orophin-craft',
        },
        {
          id: 'ask-cloak',
          label: 'What are these cloaks you weave?',
          nextNodeId: 'orophin-cloak',
        },
        {
          id: 'trade-o',
          label: 'Show me your wares.',
          nextNodeId: 'orophin-trade',
        },
      ],
    },
    'orophin-craft': {
      id: 'orophin-craft',
      npcText: 'The Galadhrim do not separate beauty from function. A rope is a rope — but it can also be a work of art, light as spider-silk and stronger than iron chain. Our bows are grown, not carved — shaped over decades in the living wood. Nothing we make is merely useful.',
      playerOptions: [
        { id: 'back-o1', label: 'Remarkable.', nextNodeId: 'orophin-greeting' },
      ],
    },
    'orophin-cloak': {
      id: 'orophin-cloak',
      npcText: 'The cloaks of Lórien are woven with the hues of the forest in every season — they shift with the light and the land. Those who wear them seem to fade into the background. Not true invisibility, but the next best thing. The Lady herself blesses the thread.',
      playerOptions: [
        { id: 'back-o2', label: 'I would like one.', nextNodeId: 'orophin-trade' },
      ],
    },
    'orophin-trade': {
      id: 'orophin-trade',
      npcText: 'Browse freely. Type "trade" to see what I have. Fair prices for fair goods.',
      playerOptions: [
        { id: 'back-o3', label: 'Thank you, Orophin.', nextNodeId: 'orophin-farewell' },
      ],
    },
    'orophin-farewell': {
      id: 'orophin-farewell',
      npcText: 'May what I have made serve you well on the road ahead.',
      playerOptions: [],
    },
  },
}

// ── NPC definitions ────────────────────────────────────────────────────────

export const lothlorienNPCs: Record<string, NPC> = {
  'haldir': {
    id: 'haldir',
    name: 'Haldir of Lórien',
    description: 'A tall, silver-haired Elf in grey and green, a great bow across his back. His eyes are keen and watchful — the March-warden of the northern border.',
    dialogue: [
      '"Halt. I am Haldir of Lórien."',
      '"You come from the East Gate — few emerge from Moria alive."',
      '"Follow the paths south and west to reach Caras Galadhon."',
    ],
    dialogueTree: haldirTree,
    tradeOffers: [
      { itemId: 'lembas-bread', cost: 15 },
      { itemId: 'healing-potion', cost: 10 },
    ],
  },

  'rumil': {
    id: 'rumil',
    name: 'Rúmil of Lórien',
    description: 'A younger elf with curious eyes and ink-stained fingers. Unlike his brother Haldir, he has the look of a scholar rather than a soldier.',
    dialogue: [
      '"Well met, stranger. I am Rúmil, brother of Haldir."',
      '"I keep the old tales. The song of Nimrodel survives in three fragments."',
      '"The trees of Lothlórien remember everything."',
    ],
    dialogueTree: rumilTree,
  },

  'celeborn': {
    id: 'celeborn',
    name: 'Lord Celeborn',
    description: 'The Lord of Lothlórien sits in his chair of living wood, silver-haired and ageless, his eyes holding the wisdom and sorrow of three ages of the world.',
    dialogue: [
      '"Welcome to Caras Galadhon. I am Celeborn."',
      '"You come from the darkness of Khazad-dûm — I would hear your account."',
      '"May the stars watch over you."',
    ],
    dialogueTree: celebornTree,
  },

  'galadriel': {
    id: 'galadriel',
    name: 'Lady Galadriel',
    description: 'The Lady of Light stands among white flowers, tall and fair, clothed in white. Her eyes are deep as wells of clear water, and in them is a light like the light of stars.',
    dialogue: [
      '"Welcome, traveler. I have been expecting you."',
      '"I see the road that has brought you here, and the roads that lie ahead."',
      '"A light for dark places — may it guide you when all other lights go out."',
    ],
    dialogueTree: galadrielTree,
  },

  'nimrodel-spirit': {
    id: 'nimrodel-spirit',
    name: 'The Spirit of Nimrodel',
    description: 'A shimmer in the mist above the falls — the shape of an Elven-maid, beautiful and sorrowful, her form wavering like a reflection in disturbed water.',
    dialogue: [
      '"...the water remembers... I was here once..."',
      '"...find the fragments of my song..."',
      '"...do not let it be forgotten..."',
    ],
    dialogueTree: nimrodelSpiritTree,
    detectableInDark: true,
  },

  'orophin': {
    id: 'orophin',
    name: 'Orophin the Craftsman',
    description: 'A broad-shouldered elf with calloused hands works at a portable forge on the talan. His craft is evident in every object around him — tools of exquisite precision, cloth of impossible fineness.',
    dialogue: [
      '"Welcome to my workshop. I am Orophin, brother of Haldir."',
      '"The Galadhrim do not separate beauty from function."',
      '"Fair prices for fair goods."',
    ],
    dialogueTree: orophinTree,
    tradeOffers: [
      { itemId: 'elven-cloak', cost: 60 },
      { itemId: 'galadhrim-bow', cost: 100 },
      { itemId: 'elven-rope', cost: 25 },
      { itemId: 'lembas-bread', cost: 15 },
      { itemId: 'healing-potion', cost: 10 },
      { itemId: 'greater-healing-potion', cost: 30 },
    ],
  },
}

/** Map of room IDs to NPC IDs present in that room */
export const lothlorienRoomNPCs: Record<string, string[]> = {
  'forest-edge': ['haldir'],
  'sentinel-tree': ['rumil'],
  'celeborn-hall': ['celeborn'],
  'galadriel-bower': ['galadriel'],
  'nimrodel-falls': ['nimrodel-spirit'],
  'north-stair': ['orophin'],
}
