import type { Ability } from '../engine/skillChecks'

export interface RoomInteractionAction {
  verb: 'search' | 'use'
  successText: string
  failText?: string
  skillCheck?: { ability: Ability; dc: number }
  rewardItems?: string[]
  grantsLight?: boolean
  requiresCleared?: boolean
}

export interface RoomInteraction {
  keywords: string[]
  examineText: string
  clearedExamineText?: string
  disarmedExamineText?: string
  destroyedExamineText?: string
  action?: RoomInteractionAction
}

export interface TrapDestroyText {
  text: string
}

export const roomInteractions: Record<string, RoomInteraction[]> = {
  'gates-of-moria': [
    {
      keywords: ['inscription', 'doors', 'door', 'elvish', 'letters'],
      examineText: 'The Elvish inscription reads: "The Doors of Durin, Lord of Moria. Speak, friend, and enter." The letters are wrought of ithildin, which mirrors only starlight and moonlight. Even now they shimmer faintly with a cold, silver light.',
    },
    {
      keywords: ['holly', 'trees', 'tree'],
      examineText: 'Two ancient holly trees flank the doors, their roots gripping the cliff-face with gnarled tenacity. They are immensely old — perhaps planted by the Elves of Hollin in the days when Eregion and Moria were allies. Their leaves are dark and glossy even in the faint light.',
    },
  ],

  'entrance-hall': [
    {
      keywords: ['pillar', 'pillars'],
      examineText: 'The pillars are cracked and leaning, their once-intricate carvings of geometric patterns and mining scenes now barely legible under centuries of grime. One has collapsed entirely, its broken stump jutting from the floor like a rotten tooth.',
    },
    {
      keywords: ['runes', 'lintel', 'greeting'],
      examineText: 'The Dwarvish runes read: "Welcome to the Mansions of the Dwarrowdelf, the glory of Durin\'s Folk. May the stone be strong beneath your feet." A greeting from a kingdom that no longer exists.',
    },
    {
      keywords: ['tripwire', 'wire', 'darts', 'trap'],
      examineText: 'Thin copper wires are strung ankle-height across the passage, connected to crude mechanisms in the walls. You can see the dark slots where poisoned darts wait to fly. Goblin handiwork — crude but deadly.',
      disarmedExamineText: 'The tripwires hang slack and harmless, their mechanisms jammed. The dart slots in the walls are dark and silent.',
      destroyedExamineText: 'Torn wires and smashed dart mechanisms litter the passage floor. The trap has been thoroughly destroyed.',
    },
  ],

  'watcher-pool': [
    {
      keywords: ['pool', 'water', 'surface'],
      examineText: 'The water is black and utterly still, like a pool of ink. Pale shapes drift just beneath the surface — things best not examined too closely. The water has a faintly oily sheen and smells of deep, dead places. Something vast moves in the depths below.',
      clearedExamineText: 'The water is calmer now, though still black and foreboding. Severed tentacles float on the surface, slowly sinking. The depths are quiet — for the moment.',
    },
  ],

  'first-hall': [
    {
      keywords: ['bones', 'remains', 'skeleton'],
      examineText: 'Old dwarven bones lie scattered across the floor, brittle and yellowed with age. Small scraps of rusted mail still cling to some. These were the last defenders of Moria, overwhelmed by the goblin horde centuries ago.',
      clearedExamineText: 'The old dwarven bones lie among fresh goblin corpses now. Amid the ancient remains, something catches your eye — perhaps worth searching through.',
      action: {
        verb: 'search',
        successText: 'You carefully sift through the remains and find a leather purse, still heavy with gold coins. The dwarves died wealthy, if nothing else.',
        failText: 'You search through the bones but find nothing of value — whatever these dwarves carried has long since been looted by goblins.',
        skillCheck: { ability: 'int', dc: 10 },
        rewardItems: ['gold-coins'],
        requiresCleared: true,
      },
    },
    {
      keywords: ['pillar', 'pillars', 'carvings'],
      examineText: 'The pillars were once carved with scenes of daily dwarven life — smithing, mining, feasting, singing. Orcish blades have defaced most of the images, leaving only crude gouges. Here and there a face or a raised hammer survives, a ghost of the civilization that built this place.',
    },
  ],

  'abandoned-forge': [
    {
      keywords: ['forge', 'hearth', 'forges'],
      examineText: 'The forges are built of massive fire-bricks, each hearth large enough to stand in. Centuries-old ash fills them like grey snow. The iron grates are rusted but intact — dwarven ironwork endures. You can almost feel the ghost of heat that once filled this room.',
    },
    {
      keywords: ['anvil', 'anvils', 'tools'],
      examineText: 'The anvils are made of star-iron, dark and impossibly heavy. Their surfaces are pitted but not rusted — this metal does not corrode. Here the smiths of Durin forged weapons and armor of legendary quality. No living smith could match their work.',
    },
    {
      keywords: ['bellows'],
      examineText: 'Great leather bellows hang from iron brackets, their hides cracked and dried to brittleness. In their day they would have been worked by teams of apprentice smiths, feeding the forge-fires to white heat. Now they are silent relics.',
    },
  ],

  'goblin-tunnels': [
    {
      keywords: ['runes', 'drawings', 'orcish', 'pictograms'],
      examineText: 'Crude pictograms cover the walls — stick figures fighting, feasting, and what appears to be worship. One recurring image stands out: a towering shape wreathed in flame, with all the stick figures cowering before it. Even the goblins fear the Balrog.',
    },
    {
      keywords: ['drumming', 'drums', 'drum'],
      examineText: '"Doom, doom, doom." The sound pulses through the stone itself, felt as much as heard. It comes from far below, deep in the roots of the mountain where no sane creature goes. The goblins use the drums to communicate — or perhaps something else beats them.',
    },
    {
      keywords: ['pit', 'trap', 'floor', 'stakes'],
      examineText: 'The floor ahead has been crudely undermined. Beneath a thin layer of stone and dirt, sharpened wooden stakes wait for the unwary. Goblin engineering at its finest.',
      disarmedExamineText: 'The pit trap gapes open, its sharpened stakes visible below. At least you can see it now.',
      destroyedExamineText: 'The pit has been filled with rubble and loose stone. It is safe to walk across now.',
    },
  ],

  'guard-room': [
    {
      keywords: ['table', 'stone table'],
      examineText: 'A heavy stone table, scarred by countless blades and stained by centuries of use. Once a place where guards took their meals and played dice between watches. Deep gouges from orcish cleavers have been added to the older, finer scratches of dwarven knife-work.',
    },
    {
      keywords: ['rack', 'weapons', 'rubble', 'weapon rack'],
      examineText: 'A collapsed weapon rack, its wooden frame long since rotted away. Whatever arms it held have been looted many times over. Only splinters and rust remain among the rubble.',
    },
  ],

  'crossroads': [
    {
      keywords: ['compass', 'compass rose', 'rose', 'inlaid'],
      examineText: 'A magnificent compass rose inlaid in the floor, wrought from contrasting white marble and dark basalt. Each cardinal direction is marked with a dwarvish rune and a tiny gemstone — emerald for north, ruby for south, sapphire for east, topaz for west. The craftsmanship is breathtaking.',
    },
    {
      keywords: ['carvings', 'history', 'scenes'],
      examineText: 'The wall carvings depict Durin\'s folk at their height — vast underground cities lit by crystal lamps, rivers of molten gold flowing through channels of carved stone, armies marching in perfect formation. It is a civilization of staggering ambition and beauty, now reduced to darkness and goblins.',
    },
  ],

  'mining-shaft': [
    {
      keywords: ['rungs', 'ladder', 'iron rungs'],
      examineText: 'Iron rungs bolted to the shaft wall, descending into absolute blackness. They are rusted but still solid — dwarven iron. Each rung is spaced precisely one foot apart. How far down they go is anyone\'s guess.',
    },
    {
      keywords: ['shaft', 'abyss', 'depths', 'hole'],
      examineText: 'You drop a loose stone into the shaft and listen. One second. Two. Five. Ten. After what feels like an eternity, a faint click echoes up from immeasurable depths. This shaft plunges to the very roots of the mountain.',
    },
  ],

  'orc-lair': [
    {
      keywords: ['fire', 'fire pit', 'embers', 'pit'],
      examineText: 'A crude fire pit dug into the stone floor, ringed with blackened rocks. The embers still smolder, casting a faint ruddy glow. Orc-fat and bone splinters serve as fuel. It stinks, but fire is fire.',
      clearedExamineText: 'The fire pit smolders unattended now. The embers are still hot — you could light a torch or brand from them.',
      action: {
        verb: 'use',
        successText: 'You thrust a makeshift brand into the embers. It catches with a smoky, sputtering flame — not elegant, but it will serve. The fire pit grants you light.',
        requiresCleared: true,
        grantsLight: true,
      },
    },
    {
      keywords: ['weapons', 'crude weapons', 'scimitars', 'blades'],
      examineText: 'Crude scimitars of inferior Mordor make, their edges already chipped and pitted. The orcs of Moria are poorly supplied — these blades are barely better than sharpened iron bars. No wonder they covet dwarven steel.',
    },
  ],

  'troll-den': [
    {
      keywords: ['bones', 'bone pile', 'heap', 'bone heap'],
      examineText: 'A massive pile of gnawed bones — some from animals, some from orcs, and some disturbingly humanoid. The troll\'s larder. The smell is indescribable.',
      clearedExamineText: 'The bone pile is as grim as ever, but with the troll dead, you could search through it without fear of becoming the next addition.',
      action: {
        verb: 'search',
        successText: 'Steeling yourself against the stench, you dig through the bones and find a stoppered flask wedged between two ribcages. A healing potion — some earlier victim\'s last hope, never used.',
        failText: 'You rummage through the foul bone pile but find nothing except gnawed remains and regret.',
        skillCheck: { ability: 'int', dc: 8 },
        rewardItems: ['healing-potion'],
        requiresCleared: true,
      },
    },
  ],

  'chamber-of-records': [
    {
      keywords: ['tomb', 'slab', 'balin'],
      examineText: 'A great rectangular slab of white stone, its surface carved with flowing dwarvish runes: "HERE LIES BALIN, SON OF FUNDIN, LORD OF MORIA." Small remembrance stones have been placed upon it by his companions — river pebbles and chips of crystal, each a wordless farewell. The tomb is cracked but unbroken.',
    },
    {
      keywords: ['book', 'mazarbul', 'writing', 'pages'],
      examineText: 'The Book of Mazarbul — the chronicle of Balin\'s colony. The early pages are hopeful, full of discovery and reclamation. Then the tone shifts: "Orcs in the east-hall." "We cannot get out." "The drums, the drums in the deep." The final entry, in a shaking hand: "They are coming." The ink is brown with age. Or perhaps it is blood.',
    },
  ],

  'second-hall': [
    {
      keywords: ['chasm', 'gap', 'crack'],
      examineText: 'A raw wound in the floor of the hall, as though the mountain itself has been torn apart. The chasm is perhaps thirty feet wide and of unknowable depth. Hot air rises from below, carrying the faint scent of brimstone. This crack may be the Balrog\'s doing — or perhaps it is far older.',
    },
    {
      keywords: ['bridge', 'rock bridge', 'natural bridge'],
      examineText: 'A natural formation of stone no more than a foot wide, spanning the chasm in a gentle arch. It is solid rock, not masonry — the mountain itself provides this crossing. One misstep and you fall into darkness. The dwarves clearly had surer feet than Men.',
    },
  ],

  'bridge-of-khazad-dum': [
    {
      keywords: ['bridge', 'arch'],
      examineText: 'The Bridge of Khazad-dum — a razor-thin arch of stone spanning the abyss, built as a deliberate defensive chokepoint. It is barely five feet wide, with no railing and no mercy. One defender could hold this bridge against an army. The dwarves were nothing if not practical about their architecture.',
    },
    {
      keywords: ['chasm', 'abyss', 'depths', 'fire'],
      examineText: 'The abyss beneath the bridge is beyond measurement. Far, far below, a dull red glow pulses — fires that have burned since the shaping of Middle-earth, perhaps since before the sun and moon were made. The heat rising from below makes the air shimmer.',
    },
  ],

  'endless-stair-base': [
    {
      keywords: ['stair', 'stairs', 'steps', 'helix'],
      examineText: 'The Endless Stair spirals upward in a single unbroken helix, carved from the living rock of the mountain. Each step is a yard wide and perfectly level. The stair rises from the deepest foundations to the peak of Zirakzigil — a climb of miles, entirely underground. It is perhaps the greatest single feat of dwarven engineering in all of Middle-earth.',
    },
  ],

  'dimrill-gate-path': [
    {
      keywords: ['torch', 'torches', 'stubs', 'brackets'],
      examineText: 'Iron brackets line the walls at regular intervals, each holding the charred stub of a torch long since burned out. The dwarves kept these passages well-lit in their day. Now only darkness remains, pressing in from all sides like a physical weight.',
    },
  ],
}

export const trapDestroyText: Record<string, string> = {
  'entrance-hall': 'You rip the tripwires free and stamp the dart mechanisms flat. Broken copper wire and crushed iron tubes scatter across the floor. The trap is destroyed.',
  'goblin-tunnels': 'You kick rubble and loose stone into the pit until the stakes are buried and the surface is level enough to cross safely. The trap is destroyed.',
}
