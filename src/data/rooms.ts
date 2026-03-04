import type { Room } from '../types/room'

export const STARTING_ROOM = 'gates-of-moria'

export const rooms: Record<string, Room> = {
  'gates-of-moria': {
    id: 'gates-of-moria',
    name: 'The Doors of Durin',
    description: 'Before you rise the legendary Doors of Durin, carved into the sheer face of the Misty Mountains. Holly trees stand sentinel on either side of the smooth cliff-face, and in the moonlight the Elvish inscription glimmers faintly: "Speak, friend, and enter." The doors stand open — something has already forced its way through. The dark beyond is absolute.',
    lookDetails: [
      'Looking more closely at the doors, you notice deep gouges in the mithril inlay — claw marks from something enormous. Whatever forced its way in did so with terrible strength.',
      'Among the roots of the holly trees, you spot the remains of a campfire, cold and old. Someone camped here not long ago. A scrap of elvish cloth clings to a branch.',
      'The Elvish inscription shimmers when you look at it from a certain angle. The word "mellon" — friend — seems to glow brighter than the rest, as if the doors remember their password.',
    ],
    exits: [
      { direction: 'east', targetRoomId: 'entrance-hall' },
      { direction: 'west', targetRoomId: 'hidden-shrine', hidden: true, revealMethod: 'puzzle' },
    ],
    items: ['torch'],
    gridX: 0,
    gridY: 4,
  },

  'watcher-pool': {
    id: 'watcher-pool',
    name: 'The Watcher\'s Pool',
    description: 'A vast, black pool stretches before the gates of Moria, its surface utterly still and lightless. The water has a faintly oily quality and smells of deep, dead places. Pale things drift just beneath the surface. Something enormous stirs in the depths — the Watcher has noticed you.',
    clearedDescription: 'The pool lies still now, its surface glassy and dark. Severed tentacles float limply on the water. Whatever lurks in the depths has retreated — for now.',
    lookDetails: [
      'The water near the shore is shallower than you thought. You can make out stones on the bottom — and among them, what appears to be a dwarven skeleton, still clutching a rusted axe.',
      'Ripples appear on the far side of the pool with no visible cause. Something very large is moving slowly beneath the surface, circling. You count at least six tentacle shapes.',
    ],
    exits: [
      { direction: 'south', targetRoomId: 'gates-of-moria' },
    ],
    enemies: [
      { enemyId: 'watcher-tentacle', count: 2 },
    ],
    items: ['watcher-pearl'],
    gridX: 0,
    gridY: 3,
  },

  'entrance-hall': {
    id: 'entrance-hall',
    name: 'The Entrance Hall',
    description: 'A crumbling entrance hall stretches before you, the air thick with the smell of dust and old death. Fallen masonry litters the floor and the carved pillars lean at dangerous angles. Dwarvish runes are chiseled above the lintel — a greeting to those who would enter Khazad-dum in better days. The darkness ahead swallows your torchlight. You notice thin tripwires strung across the passage.',
    lookDetails: [
      'The Dwarvish runes above the lintel read: "Khazad-dum welcomes the children of Durin. May the stone shelter you and the forges warm you." Someone has scratched crude orcish over part of the inscription.',
      'Behind one of the leaning pillars, you find scratches in the stone — tally marks. Someone was counting days here. There are forty-seven marks, then nothing.',
      'The dart holes in the walls are crudely bored — definitely goblin work, not dwarvish engineering. The tripwire is made of gut, recently replaced.',
    ],
    exits: [
      { direction: 'west', targetRoomId: 'gates-of-moria' },
      { direction: 'east', targetRoomId: 'first-hall' },
      { direction: 'north', targetRoomId: 'great-stairway' },
    ],
    trap: {
      description: 'A crude goblin tripwire triggers a volley of rusty darts from the walls!',
      disarmAbility: 'dex',
      disarmDC: 10,
      damage: '1d4',
    },
    gridX: 1,
    gridY: 4,
  },

  'great-stairway': {
    id: 'great-stairway',
    name: 'The Great Stairway',
    description: 'Massive steps of black stone descend and rise before you, carved from the living rock by dwarven hands of immense skill. Each step is a yard wide and perfectly level despite centuries of disuse. Gargoyles of dwarvish craft leer down from corbels overhead, their stone faces lit by the dancing shadows of your torch. The stair reaches up into darkness above and leads down into the deeper halls. An orc warrior and two goblin archers lurk in the shadows, and a cloaked figure watches from behind a pillar.',
    clearedDescription: 'The great stairway is silent now. The gargoyles leer down at the bodies of the orcs and goblins sprawled across the ancient steps. A cloaked figure stands behind a pillar, watching.',
    lookDetails: [
      'One of the gargoyles is different from the others — its face is not dwarven but elvish, with delicate features and almond eyes. A secret tribute, perhaps, from some dwarf who loved an elf.',
      'Halfway up the stair, a step has been worn to a slight depression. Generations of dwarven boots marched this path daily. You can almost hear the echo of their footsteps.',
    ],
    exits: [
      { direction: 'south', targetRoomId: 'entrance-hall' },
      { direction: 'north', targetRoomId: 'crossroads' },
      { direction: 'east', targetRoomId: 'abandoned-forge' },
    ],
    enemies: [
      { enemyId: 'orc-warrior', count: 1 },
      { enemyId: 'goblin-archer', count: 2 },
    ],
    gridX: 1,
    gridY: 3,
  },

  'first-hall': {
    id: 'first-hall',
    name: 'The First Hall',
    description: 'A wide hall opens before you, its soaring ceiling lost in darkness above. Broken pillars line the walls, their carved surfaces defaced by orcish blades. The floor is strewn with bones — dwarven bones, old and brittle. A foul smell hangs in the air: the unmistakable reek of goblins. Small shapes skitter at the edges of your torchlight.',
    clearedDescription: 'The hall is quiet now. Goblin corpses litter the floor among the old dwarven bones. The foul reek lingers, but nothing stirs in the shadows.',
    lookDetails: [
      'Among the dwarven bones, you notice one skeleton still wearing a tarnished silver circlet. This was someone of rank — a lord or captain who fell defending this hall.',
      'The defaced carvings on the pillars once depicted the Seven Fathers of the Dwarves. Only Durin\'s face remains intact, as if even the orcs feared to deface it.',
    ],
    exits: [
      { direction: 'west', targetRoomId: 'entrance-hall' },
      { direction: 'east', targetRoomId: 'goblin-tunnels' },
      { direction: 'north', targetRoomId: 'abandoned-forge' },
    ],
    enemies: [
      { enemyId: 'goblin', count: 3 },
    ],
    gridX: 2,
    gridY: 4,
  },

  'abandoned-forge': {
    id: 'abandoned-forge',
    name: 'The Abandoned Forge',
    description: 'Cold forges line the walls of this vaulted chamber, their hearths dark and ash-choked. Broken bellows hang from iron brackets and the anvils are spotted with rust. Yet the tools here speak of legendary craftsmanship — here the Dwarves of Durin worked metals that no smith alive can match. Amid the debris, a crude orcish blade has been left behind by some squatting raider.',
    lookDetails: [
      'You peer into the nearest forge hearth and find it still contains half-smelted mithril ore. The dwarves abandoned their work mid-pour — whatever drove them out came suddenly.',
      'One anvil bears a maker\'s mark you recognize from legend: the hammer-and-star of Telchar of Nogrod, greatest smith of the First Age. This forge was ancient even by dwarven standards.',
      'The bellows, though broken, are a marvel of engineering — geared mechanisms that could have been worked by a single dwarf to heat the forge white-hot. Nothing like this exists in the world above.',
    ],
    exits: [
      { direction: 'west', targetRoomId: 'great-stairway' },
      { direction: 'south', targetRoomId: 'first-hall' },
    ],
    items: ['orcish-blade'],
    gridX: 2,
    gridY: 3,
  },

  'goblin-tunnels': {
    id: 'goblin-tunnels',
    name: 'The Goblin Tunnels',
    description: 'The wide dwarven passages give way here to a warren of narrow tunnels, crudely hacked from the rock by goblin hands. The ceilings are low and the walls reek of filth and smoke. Scratched orcish runes and crude drawings cover every surface. The tunnels twist and branch in confusing ways, and the sound of distant drumming echoes through the stone. The floor ahead looks suspiciously uneven.',
    clearedDescription: 'The goblin tunnels are silent now, their former occupants slain. The crude drawings on the walls seem almost pitiful without their makers. The drumming has stopped.',
    lookDetails: [
      'The crude drawings tell a story if you look carefully: goblins fleeing a great shadow of flame, then returning after the shadow descended deeper. They feared the Balrog even more than you do.',
      'In a nook behind a collapsed timber, you find a goblin\'s nest — rags, stolen trinkets, and a crude doll made of wire and bone. Even goblins, it seems, have some semblance of a life.',
    ],
    exits: [
      { direction: 'west', targetRoomId: 'first-hall' },
      { direction: 'north', targetRoomId: 'guard-room' },
    ],
    enemies: [
      { enemyId: 'goblin', count: 2 },
      { enemyId: 'goblin-archer', count: 1 },
    ],
    trap: {
      description: 'The floor collapses beneath your feet into a shallow pit lined with sharpened stakes!',
      disarmAbility: 'dex',
      disarmDC: 12,
      damage: '1d6',
    },
    dark: true,
    gridX: 3,
    gridY: 4,
  },

  'guard-room': {
    id: 'guard-room',
    name: 'The Guard Room',
    description: 'An old dwarf guard post, its purpose long since perverted by its orcish occupants. Iron brackets on the walls once held torches; now only their rusty ghosts remain. A stone table still stands in the center, scarred and hacked. Against the far wall, tucked behind a collapsed rack of weapons, a serviceable coat of chain mail lies half-buried under rubble — someone hid it here, long ago. A heavy iron key hangs on a hook near the door.',
    lookDetails: [
      'Scratched into the underside of the stone table, you find a dwarven message: "If the guard falls, lock the north door. The key stays here. Do not let them reach the Records." A final order, faithfully carried out.',
      'The weapon rack wasn\'t collapsed by age — it was deliberately toppled to hide the chain mail beneath. Someone planned for a future defender to find it.',
    ],
    exits: [
      { direction: 'south', targetRoomId: 'goblin-tunnels' },
      { direction: 'north', targetRoomId: 'orc-lair' },
      { direction: 'west', targetRoomId: 'abandoned-forge' },
    ],
    items: ['chain-mail', 'door-key'],
    gridX: 3,
    gridY: 3,
  },

  'crossroads': {
    id: 'crossroads',
    name: 'The Crossroads',
    description: 'Four great passages meet here at a perfectly square intersection, each carved with the precision and artistry of master masons. Carvings of dwarvish history run the full height of the walls — scenes of mining and feasting and battle, now defaced with orcish scratchings. At the center of the floor, a great compass rose has been inlaid in contrasting stone. A hulking orc berserker paces the intersection, guarding the ways. Runes above the northern door catch your eye.',
    clearedDescription: 'The crossroads intersection lies quiet, the orc berserker\'s body slumped against the compass rose. The four passages stretch into darkness, and runes above the northern door catch your eye.',
    lookDetails: [
      'The compass rose on the floor is not merely decorative — it is a precise astronomical instrument. Tiny mithril inlays mark the positions of stars, visible through shafts in the mountain\'s peak. The dwarves navigated underground by the heavens.',
      'The carvings show Moria\'s entire history: the Awakening of Durin, the delving of the great halls, the discovery of mithril, and — ominously — the final panel depicts dwarves fleeing from a shapeless darkness rising from below.',
    ],
    exits: [
      { direction: 'north', targetRoomId: 'chamber-of-records', locked: true, requiredItemId: 'door-key', lockMessage: 'The heavy iron door is locked. You need a key.' },
      { direction: 'south', targetRoomId: 'great-stairway' },
      { direction: 'east', targetRoomId: 'orc-lair' },
      { direction: 'west', targetRoomId: 'mining-shaft' },
    ],
    enemies: [
      { enemyId: 'orc-berserker', count: 1 },
    ],
    items: ['healing-potion'],
    gridX: 2,
    gridY: 2,
  },

  'mining-shaft': {
    id: 'mining-shaft',
    name: 'The Mining Shaft',
    description: 'The passage opens onto a breathtaking vertical shaft sunk deep into the mountain\'s heart. Iron rungs are bolted to the wall, leading down into absolute blackness. The sound of dripping water echoes from immeasurable depths below and a faint, cold breeze rises from the abyss. Near the edge, a pouch of gold coins rests where some unlucky dwarf dropped it — perhaps in the very last moments of Moria\'s fall. The western wall looks oddly irregular.',
    lookDetails: [
      'You drop a pebble into the shaft and count. One... two... three... four... five... six... You never hear it land. The shaft must descend thousands of feet into the roots of the mountain.',
      'The iron rungs are spaced for dwarven reach — uncomfortably close together for taller folk. The lowest visible rung, some thirty feet down, has been bent outward by something climbing up from below. Something much larger than a dwarf.',
    ],
    exits: [
      { direction: 'east', targetRoomId: 'crossroads' },
      { direction: 'west', targetRoomId: 'secret-armory', hidden: true, revealMethod: 'examine' },
    ],
    items: ['gold-coins'],
    dark: true,
    gridX: 1,
    gridY: 2,
  },

  'orc-lair': {
    id: 'orc-lair',
    name: 'The Orc Lair',
    description: 'A foul-smelling cavern that serves as a camp for a sizeable warband of Moria\'s orc garrison. Bones and the refuse of many meals litter the floor. Crude weapons are stacked against the walls and a smoldering fire pit fills the air with acrid smoke. The orcs here are not mere craven goblins — they are soldiers, scarred and seasoned. They watch your approach with cold, predatory eyes.',
    clearedDescription: 'The orc lair has fallen silent. The fire pit smolders unattended and the bodies of the warband lie where they fell. Their crude weapons will menace no one else.',
    lookDetails: [
      'Near the fire pit, you find a crude map scratched into a flat stone — it shows the layout of Moria\'s upper levels with troop positions marked. The orcs were methodical about their occupation.',
      'Among the refuse you spot something unexpected: a dwarven child\'s toy, a carved stone bear worn smooth by small hands. The orcs kept it as a trophy. Your grip tightens on your weapon.',
    ],
    exits: [
      { direction: 'west', targetRoomId: 'crossroads' },
      { direction: 'north', targetRoomId: 'troll-den' },
    ],
    enemies: [
      { enemyId: 'orc-warrior', count: 2 },
      { enemyId: 'orc-captain', count: 1 },
    ],
    items: ['gold-coins'],
    gridX: 3,
    gridY: 2,
  },

  'chamber-of-records': {
    id: 'chamber-of-records',
    name: 'The Chamber of Records',
    description: 'You stand in the Chamber of Records — Balin\'s tomb. A great rectangular slab of stone dominates the center of the room, carved with dwarvish runes: "HERE LIES BALIN, SON OF FUNDIN, LORD OF MORIA." Upon the tomb rests a single weathered book, its cover stained and its pages filled with desperate writing. This is the Book of Mazarbul. The final entry reads: "They are coming." The chamber is not empty. They have come again.',
    clearedDescription: 'The Chamber of Records is silent once more. Balin\'s tomb stands undisturbed at the center, the Book of Mazarbul resting upon it. The goblins and orcs that desecrated this place have been dealt with. Perhaps now Balin can rest in peace.',
    lookDetails: [
      'Flipping through the Book of Mazarbul, earlier entries speak of hope: "We have reclaimed the Twenty-first Hall. The mithril veins run rich. Balin is named Lord of Moria." The optimism makes the final pages all the more harrowing.',
      'Behind Balin\'s tomb, almost hidden in shadow, you find a small personal chest. Inside: a portrait of a dwarven woman, a lock of auburn hair, and a letter in Khuzdul that begins "My dearest Balin..." He was loved, and he is mourned.',
    ],
    exits: [
      { direction: 'south', targetRoomId: 'crossroads' },
      { direction: 'east', targetRoomId: 'troll-den' },
      { direction: 'north', targetRoomId: 'endless-stair-base' },
    ],
    items: ['balin-tome', 'gold-coins'],
    enemies: [
      { enemyId: 'goblin', count: 4 },
      { enemyId: 'orc-warrior', count: 1 },
    ],
    gridX: 2,
    gridY: 1,
  },

  'second-hall': {
    id: 'second-hall',
    name: 'The Second Hall',
    description: 'A grand hall of breathtaking proportions, its vaulted ceiling rising forty feet overhead and supported by columns of such perfection that no joint or seam can be found. But the floor has cracked, and where once there was stone there is now a yawning chasm of unknown depth. A single narrow bridge of natural rock spans the gap, no more than a foot wide. The darkness beyond is total and oppressive. This place feels watched.',
    lookDetails: [
      'The columns are carved with an optical illusion — from one angle they appear as trees, from another as dwarven warriors standing at attention. The craftsmanship is staggering.',
      'Far across the chasm, on a ledge you cannot reach, you spot the glint of mithril. An entire vein of it, exposed by the cracking of the floor. The wealth of Moria lies tantalizingly out of reach.',
    ],
    exits: [
      { direction: 'east', targetRoomId: 'chamber-of-records' },
    ],
    items: ['plate-armor'],
    dark: true,
    gridX: 1,
    gridY: 1,
  },

  'troll-den': {
    id: 'troll-den',
    name: 'The Troll\'s Den',
    description: 'A stinking, low-ceilinged cavern that reeks of rot and old meat. Gnawed bones — some alarmingly large — are heaped against the walls, and the floor is slicked with filth. In the far corner, curled around a pile of broken stone like a dog in its bed, a cave troll stirs. It is enormous, its grey skin like weathered stone, its small eyes blinking with dim, terrible intelligence. Amid the carnage, a stoppered flask glints in the darkness — a greater healing potion, perhaps plundered from some earlier victim.',
    clearedDescription: 'The troll\'s den reeks worse in death than in life, if that were possible. The massive grey corpse of the cave troll lies slumped in its corner, already stiffening. The bone heaps remain as grim testament to its appetites.',
    lookDetails: [
      'Among the bone heap, you identify the remains of at least three orc warriors in addition to dwarven bones. The troll was not particular about its diet — it ate its own allies when hungry.',
      'Scratched into the wall behind the troll\'s sleeping spot, in shaky dwarven script: "Náin son of Grór held here 3 days. The beast sleeps at midday. If anyone reads this, tell my family I tried." There is no more writing.',
    ],
    exits: [
      { direction: 'west', targetRoomId: 'chamber-of-records' },
      { direction: 'south', targetRoomId: 'orc-lair' },
    ],
    enemies: [
      { enemyId: 'cave-troll', count: 1 },
      { enemyId: 'orc-berserker', count: 1 },
    ],
    items: ['greater-healing-potion'],
    gridX: 3,
    gridY: 1,
  },

  'endless-stair-base': {
    id: 'endless-stair-base',
    name: 'The Base of the Endless Stair',
    description: 'The legendary Endless Stair of Khazad-dum begins here, spiraling in a single unbroken helix from the very foundations of the mountain to its peak, Zirakzigil. It is said that no dwarf ever counted all its steps. The carved stone of the first landing is worn smooth by uncounted generations of feet. A ledge juts over the stair shaft — something glints far below. The way east leads toward the Bridge and freedom.',
    lookDetails: [
      'Looking up into the stair shaft, you catch a glimpse of pale sky impossibly far above — a pinprick of light at the summit of Zirakzigil. The entire mountain is hollow around this stair.',
      'The first step bears an inscription in ancient Khuzdul: "Ten thousand and one steps to the crown of the world. Durin climbed them all and looked upon the stars." You wonder if anyone will ever climb them again.',
    ],
    exits: [
      { direction: 'south', targetRoomId: 'chamber-of-records' },
      { direction: 'east', targetRoomId: 'bridge-of-khazad-dum' },
    ],
    items: ['rope'],
    gridX: 2,
    gridY: 0,
  },

  'dimrill-gate-path': {
    id: 'dimrill-gate-path',
    name: 'The Path to Dimrill Gate',
    description: 'A passage hewn long ago as a secondary route toward the eastern gate. The dwarves who carved it are long dead and the torches that once lined its walls have burned to stubs centuries past. The darkness here is complete and disorienting — the kind of dark that presses against the eyes. Somewhere ahead, you can feel rather than hear the faintest breath of cold outside air.',
    lookDetails: [
      'The walls here are covered in a thin layer of luminescent lichen — too faint to see by, but enough to trace the passage with your fingertips. The dwarves may have cultivated it as an emergency guide.',
      'You find a small alcove carved into the wall at waist height, containing a stone cup and a dry water channel. A rest station for weary travelers, its spring long since run dry.',
    ],
    exits: [
      { direction: 'east', targetRoomId: 'endless-stair-base' },
    ],
    items: ['elven-dagger'],
    dark: true,
    gridX: 1,
    gridY: 0,
  },

  'bridge-of-khazad-dum': {
    id: 'bridge-of-khazad-dum',
    name: 'The Bridge of Khazad-dum',
    description: 'The Bridge of Khazad-dum spans a chasm of bottomless darkness, a narrow arch of stone no more than five feet wide stretching over an abyss that plunges to the very roots of the world. The far side — and freedom — is maddeningly close. But the bridge is not unguarded. From the deep passages below, fire blooms. Shadow rises. A shape of terrible ancient power ascends toward the bridge, its wings spreading to fill the vault, its whip of flame trailing sparks. Durin\'s Bane has found you. The darkness between you and the gate belongs to it.',
    clearedDescription: 'The Bridge of Khazad-dum stretches over the abyss, scorched and cracked from the battle with Durin\'s Bane. The fire and shadow have receded. The way east to Dimrill Dale lies open at last.',
    lookDetails: [
      'The bridge itself is cracked in places — not from age, but from heat. The Balrog has crossed here before, and the stone remembers. Dark scorch marks radiate from the center like the petals of some terrible flower.',
      'Deep in the abyss below, far beneath the Balrog\'s fire, you catch a glimpse of water — an underground lake or river, impossibly far down. If you fell, you would have a long time to regret it.',
    ],
    exits: [
      { direction: 'west', targetRoomId: 'endless-stair-base' },
      { direction: 'east', targetRoomId: 'east-gate', locked: true, lockMessage: 'The Balrog blocks the way! You must defeat it first.' },
    ],
    enemies: [
      { enemyId: 'balrog', count: 1 },
    ],
    gridX: 3,
    gridY: 0,
  },

  'secret-armory': {
    id: 'secret-armory',
    name: 'The Secret Armory',
    description: 'Behind the false wall lies a small, pristine chamber that the orcs never found. Dwarvish weapon racks line the walls, most empty, but treasures remain: a healing potion in a crystal vial, a mighty warhammer mounted on the wall, and a great tower shield bearing the sigil of Durin. The dwarves hid this well.',
    lookDetails: [
      'The empty weapon racks have name plates beneath each slot, engraved in Khuzdul. These weapons had names and histories. Whoever emptied this armory took them to war — and never returned.',
      'The crystal vial holding the potion is itself a work of art, faceted to catch and multiply any light. The dwarves made even their medicine beautiful.',
    ],
    exits: [
      { direction: 'east', targetRoomId: 'mining-shaft' },
    ],
    items: ['healing-potion', 'dwarven-warhammer', 'dwarf-shield'],
    gridX: 0,
    gridY: 2,
  },

  'hidden-shrine': {
    id: 'hidden-shrine',
    name: 'The Hidden Shrine of Durin',
    description: 'A small, perfectly preserved shrine carved from luminous white stone. A statue of Durin the Deathless stands at its center, one hand raised in blessing. The walls are covered in flowing Khuzdul script — prayers and histories of the First Age. At the statue\'s feet rests a flask of greater healing potion, its contents still vibrant after countless years. The air here feels sacred and peaceful.',
    lookDetails: [
      'The white stone of the shrine glows faintly with its own light — not torchlight, not magic, but something older. The stone itself remembers the light of the Two Trees, brought here by Durin\'s folk in the Elder Days.',
      'Durin\'s stone face bears an expression not of severity but of gentle wisdom. His raised hand holds a carved star — the Crown of Durin, which he saw reflected in the Mirrormere at the dawn of the world.',
    ],
    exits: [
      { direction: 'east', targetRoomId: 'gates-of-moria' },
    ],
    items: ['greater-healing-potion'],
    gridX: -1,
    gridY: 4,
  },

  'east-gate': {
    id: 'east-gate',
    name: 'The East Gate — Dimrill Dale',
    description: 'Sunlight. Real, warm, golden sunlight pours through the great eastern gate of Moria and falls upon your face. You stagger out onto the steps of Dimrill Dale, gasping clean mountain air after the suffocating dark. Below you the Mirrormere catches the sky and the peaks of the Misty Mountains blaze in the afternoon sun. You have traversed Khazad-dum. The Fellowship would be proud. Behind you, the dark of Moria recedes — but you do not look back.',
    lookDetails: [
      'In the Mirrormere below, you catch a reflection that is not your own — the Crown of Durin, seven stars arranged in a ring, shimmering in the still water just as Durin himself saw it at the beginning of days.',
      'Carved into the gate\'s outer frame, facing the sunlight, are words in both Khuzdul and Sindarin: "Here ends the Long Dark. Step into the light and remember those who delved in joy." Your eyes sting, and not from the brightness.',
    ],
    exits: [],
    gridX: 4,
    gridY: 0,
  },
}

export function getRoom(id: string): Room | undefined {
  return rooms[id]
}
