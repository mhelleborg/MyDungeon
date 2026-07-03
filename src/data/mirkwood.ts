import type { Room } from '../types/room'
import type { Enemy } from '../types/character'
import type { Item } from '../types/item'
import type { NPC } from '../types/npc'
import type { Quest } from '../types/quest'

/**
 * Mirkwood — a level 7–9 region east of the Anduin.
 * The crossing of the Great River, the Old Forest Road under the black
 * boughs, the Enchanted Stream, the spider-haunted aisles, and the halls
 * of the Elvenking — a safe hub of feasting and trade in the dark.
 */

export const mirkwoodRooms: Record<string, Room> = {
  'anduin-crossing': {
    id: 'anduin-crossing',
    name: 'The Anduin Crossing',
    description: 'The Great River runs broad and brown between you and the wall of trees on the eastern shore. A raft of grey wood, elven-made and older than it looks, is tethered to a mooring-stone carved with both leaves and runes. Behind you lie the golden eaves of Lórien; ahead, Mirkwood rises like a bank of standing night, and even the river seems to quicken its pace to be past it.',
    lookDetails: [
      'The mooring-stone bears two marks side by side: the mallorn-leaf of Lórien and the beech-leaf of the Woodland Realm. There was traffic between the two kingdoms once. The moss says it was long ago.',
      'Driftwood lies heaped on the eastern shingle — and among it, half-buried, the ribs of an older raft, charred at one end. Not every crossing has gone well.',
    ],
    exits: [
      { direction: 'west', targetRoomId: 'silver-river-ford' },
      { direction: 'east', targetRoomId: 'western-eaves' },
    ],
    waypoint: true,
    waypointLabel: 'The Anduin Crossing',
    events: [
      {
        id: 'mirkwood-threshold',
        once: true,
        effect: {
          type: 'narration',
          lines: [
            { text: 'You have crossed the Great River. The lands of the Elvenking lie ahead — and between you and his halls, the darkness under the trees.', logType: 'system' },
            { text: 'The wind off the water dies at the treeline, as if the forest declines to breathe it.' },
          ],
        },
      },
    ],
    gridX: 0,
    gridY: 2,
  },

  'western-eaves': {
    id: 'western-eaves',
    name: 'The Western Eaves',
    description: 'The first trees of Mirkwood stand over you — oaks and beeches of enormous girth, their trunks green-bearded with moss, their crowns knotted together into a roof that the sun only pierces in thin coins of light. The air is still and heavy, thick with the smell of leaf-mould and slow rot. Somewhere deeper in, something drops from branch to branch and goes quiet.',
    lookDetails: [
      'The trees at the forest\'s edge lean outward, toward the light, like prisoners at a grating. Those further in have given up leaning.',
      'A waymarker of pale stone stands beside the path, carved with a beech-leaf and an arrow pointing east. Beneath it someone has added, in Westron, three words: STAY ON IT.',
    ],
    exits: [
      { direction: 'west', targetRoomId: 'anduin-crossing' },
      { direction: 'east', targetRoomId: 'forest-gate' },
      { direction: 'south', targetRoomId: 'blackened-dell' },
    ],
    gridX: 1,
    gridY: 2,
  },

  'blackened-dell': {
    id: 'blackened-dell',
    name: 'The Blackened Dell',
    description: 'The path falls away into a dell where every tree is dead or dying, their bark split and weeping a dark resin that smells of iron. At the hollow\'s heart one great tree still moves — though there is no wind — its roots flexing in the earth like fingers, its split trunk groaning with something that is almost a voice. The shadow that lies on this forest has gone into the wood itself here, and the wood has learned to hate.',
    clearedDescription: 'The great huorn lies broken at last, its roots curled inward like a dead spider\'s legs. The dell is silent, but it is an easier silence — the sick trees around the hollow seem already less bowed, as if a hand has been lifted from them.',
    lookDetails: [
      'Bones lie among the roots of the great tree — deer, boar, and one skeleton in the rags of a hunter\'s garb, an unstrung bow fallen just beyond the reach of its hand.',
      'The dark resin bleeding from the trees traces the same shape on every trunk: branching, patient lines, like a map of the forest\'s veins. Whatever poisons Mirkwood flows through all of it.',
    ],
    exits: [
      { direction: 'north', targetRoomId: 'western-eaves' },
    ],
    enemies: [
      { enemyId: 'blackheart-huorn', count: 1 },
    ],
    items: ['mirkwood-longbow'],
    dark: true,
    gridX: 1,
    gridY: 3,
  },

  'forest-gate': {
    id: 'forest-gate',
    name: 'The Forest Gate',
    description: 'Two vast oaks lean together over the path, their branches woven by old craft into an arch — the Forest Gate, western door of the Old Forest Road. Beyond it the track runs east into gloom, straight and stubborn, the last work of a friendlier age. A wood-elf in grey and green stands beneath the arch with an arrow nocked but not drawn, watching you come with eyes that miss nothing.',
    lookDetails: [
      'The arch of the two oaks was shaped by elven hands and dwarven cunning together, in the years when the Road carried trade from the mountains to the river. The carving is worn, but you can still make out hammers and leaves entwined.',
      'Nailed to the gatepost, a weathered board bears warnings in three tongues. The Westron reads: "Do not leave the road. Do not drink of the enchanted stream. Do not answer the lights."',
    ],
    exits: [
      { direction: 'west', targetRoomId: 'western-eaves' },
      { direction: 'east', targetRoomId: 'old-forest-road' },
      { direction: 'north', targetRoomId: 'enchanted-stream' },
      { direction: 'south', targetRoomId: 'webbed-aisles' },
    ],
    waypoint: true,
    waypointLabel: 'The Forest Gate',
    gridX: 2,
    gridY: 2,
  },

  'old-forest-road': {
    id: 'old-forest-road',
    name: 'The Old Forest Road',
    description: 'The ancient dwarf-road runs east under a ceiling of black leaves, its stones heaved and split by roots but its line still true. No sunlight reaches the ground here; the darkness is soft, breathing, and full of small sounds — a click, a rustle, the leathery beat of wings overhead. Eyes gleam and vanish between the trees on either side, keeping pace with you.',
    clearedDescription: 'The road runs quiet under the black canopy. The bats that haunted this stretch lie broken among the old stones, and the watching eyes between the trees keep a more respectful distance.',
    lookDetails: [
      'The road-stones were laid by the dwarves of Erebor in the days of trade. Every tenth stone bears a mason\'s mark, still crisp beneath the moss — dwarf-work does not forget itself.',
      'The darkness overhead is not empty. When you stand still, you can hear it: a soft, constant creaking, like rigging in wind. Whatever moves through the canopy moves in numbers.',
    ],
    exits: [
      { direction: 'west', targetRoomId: 'forest-gate' },
      { direction: 'north', targetRoomId: 'elf-path' },
      { direction: 'south', targetRoomId: 'hanging-gallery' },
    ],
    enemies: [
      { enemyId: 'mirkwood-bat', count: 2 },
    ],
    dark: true,
    gridX: 3,
    gridY: 2,
  },

  'enchanted-stream': {
    id: 'enchanted-stream',
    name: 'The Enchanted Stream',
    description: 'A stream crosses the path, black and swift, running from no spring you can guess at toward no sea you can name. It makes no sound at all — the water folds over the stones without a whisper, and the silence of it is worse than any roar. Stepping-stones cross it, slick and dark, and the mist that hangs over the water reaches for your face as you pass.',
    lookDetails: [
      'A boat of stretched hide lies rotting on the far bank beside a heap of small bones — some traveller who drank, and dreamed, and did not wake to eat.',
      'Where the mist touches your skin it leaves a drowsiness behind, sweet and heavy, like the smell of poppies. The elves say the Enchanted River rises in the Mountains of Mirkwood, where the Necromancer\'s shadow lies thickest.',
    ],
    exits: [
      { direction: 'south', targetRoomId: 'forest-gate' },
      { direction: 'east', targetRoomId: 'elf-path' },
      { direction: 'north', targetRoomId: 'elvenking-gate' },
    ],
    events: [
      {
        id: 'enchanted-stream-warning',
        once: true,
        effect: {
          type: 'narration',
          lines: [
            { text: 'The marchwardens\' warning comes back to you: do not drink of the enchanted stream, nor bathe in it, nor let it touch your skin if you can help it.', logType: 'system' },
            { text: 'The black water slides past without a sound, patient as sleep.' },
          ],
        },
      },
      {
        effect: {
          type: 'status-effect',
          effectId: 'stunned',
          message: 'Spray from the stepping-stones touches your skin, and the world goes soft and grey at the edges. For a moment you are dreaming on your feet — of feasting, of firelight, of sleep under the trees.',
        },
      },
    ],
    gridX: 2,
    gridY: 1,
  },

  'elf-path': {
    id: 'elf-path',
    name: 'The Elf-path',
    description: 'A narrow track leaves the old road and winds north between the trees — the elf-path, kept open by the folk of the Woodland Realm. The darkness thins here to a deep green twilight; the trees stand straighter, and here and there a white flower glimmers at the path\'s edge like a held breath. Far off to the north comes a sound you had almost forgotten: singing.',
    lookDetails: [
      'The path is swept clean of webs. Strands of grey silk lie cut and curling at its edges — the wood-elves patrol this way with knives, and often.',
      'A lamp of pale glass hangs from a bough overhead, unlit by day. Its like are strung north along the path at long intervals, the Elvenking\'s answer to the dark: small, stubborn stars.',
    ],
    exits: [
      { direction: 'west', targetRoomId: 'enchanted-stream' },
      { direction: 'south', targetRoomId: 'old-forest-road' },
      { direction: 'north', targetRoomId: 'elvenking-halls' },
    ],
    gridX: 3,
    gridY: 1,
  },

  'elvenking-gate': {
    id: 'elvenking-gate',
    name: 'The Gates of the Elvenking',
    description: 'The forest opens onto the bank of a swift river, and beyond it a sheer hillside rises, pierced by great doors of stone. A bridge of a single arch springs the water, and torchlight spills warm and gold from the gateway — the first honest firelight you have seen since the Anduin. The doors stand open, but the shadows of the gatehouse hold archers, and their attention is a pressure you can feel from across the bridge.',
    lookDetails: [
      'The stone doors are carved with beech trees in leaf, so cunningly that in the torchlight they seem to stir. It is said they were raised with the aid of dwarves, in an older and warmer age, and that they will shut of themselves at the King\'s word.',
      'Barrels bob in an eddy below the bridge, roped in a patient line — empty casks bound downriver for Esgaroth. The wine trade goes on, whatever walks in the woods.',
    ],
    exits: [
      { direction: 'south', targetRoomId: 'enchanted-stream' },
      { direction: 'east', targetRoomId: 'elvenking-halls' },
    ],
    gridX: 2,
    gridY: 0,
  },

  'elvenking-halls': {
    id: 'elvenking-halls',
    name: 'The Halls of the Elvenking',
    description: 'Pillars hewn from the living rock rise into torchlit heights, twisted like the boles of great trees, and the air moves with harp-song and the green smell of growing things brought in against the dark. Wood-elves pass on soft feet between the columns, and the weight of the forest\'s menace lifts from your shoulders — here, at least, the shadow does not reach. On a dais of carved wood a throne stands beneath antlered branches, though the King himself is elsewhere.',
    lookDetails: [
      'The pillars are carved with a history you can walk past: the wide green wood of old, the coming of the shadow to Dol Guldur in the south, the slow retreat of the Kingdom north, hall by hall, to this last delved fastness.',
      'On a table near the dais lies a letter of heavy cream vellum, sealed with green wax and the imprint of a beech leaf — addressed, in a flowing hand, to Master Erestor of Imladris.',
    ],
    exits: [
      { direction: 'west', targetRoomId: 'elvenking-gate' },
      { direction: 'east', targetRoomId: 'elven-feast-hall' },
      { direction: 'south', targetRoomId: 'elf-path' },
    ],
    items: ['thranduil-letter'],
    waypoint: true,
    waypointLabel: 'The Elvenking\'s Halls',
    gridX: 3,
    gridY: 0,
  },

  'elven-feast-hall': {
    id: 'elven-feast-hall',
    name: 'The Feast Hall',
    description: 'Long tables of polished oak run the length of a firelit cavern, laden with bread and roast venison, river-fish and honeycomb, and flagons of wine the colour of garnets. Wood-elves feast here in shifts as the watches change, and their laughter rings off the stone with a defiance you come to understand: every lit fire in Mirkwood is an argument against the dark. A broad-girthed elf with a steward\'s chain and a ladle presides over all of it like a general.',
    lookDetails: [
      'The wine in the flagons is Dorwinion, carried up the Forest River in barrels from the South — heady stuff, twice the strength of lesser vintages. Even the King\'s butler has been known to misjudge it.',
      'Above the hearth hangs a great pair of antlers, twelve points, from a hart of the old wood. Beneath them, carved in the mantel: "While this fire burns, the wood is not conquered."',
    ],
    exits: [
      { direction: 'west', targetRoomId: 'elvenking-halls' },
      { direction: 'south', targetRoomId: 'wine-cellars' },
    ],
    gridX: 4,
    gridY: 0,
  },

  'wine-cellars': {
    id: 'wine-cellars',
    name: 'The Wine Cellars',
    description: 'Stairs wind down to cellars cut deep beneath the halls, where barrels of Dorwinion lie ranked in the cool dark like sleeping soldiers. A stream runs through a channel in the floor to a water-gate in the far wall — the road the empty casks take down to Esgaroth. The air is sweet with wine and river-damp, and the torch flames bend toward the water-gate\'s draught.',
    lookDetails: [
      'The trapdoors above the water-gate open to drop barrels into the stream below. A stack of empties waits by the hatch. A person could fit inside one, at need. It has, the cellar-hands mutter, been done.',
      'One rack is chalked in a tidy steward\'s hand: FOR THE KING\'S TABLE — AND GALION KEEP THY LADLE OUT.',
    ],
    exits: [
      { direction: 'north', targetRoomId: 'elven-feast-hall' },
    ],
    items: ['dorwinion-wine', 'dorwinion-wine'],
    gridX: 4,
    gridY: 1,
  },

  'webbed-aisles': {
    id: 'webbed-aisles',
    name: 'The Webbed Aisles',
    description: 'South of the road the trees stand in long dim aisles, and every aisle is hung with webs — grey sheets of it, thick as sailcloth, strung trunk to trunk in tented galleries. The strands nearest the path are old and dust-clogged, but deeper in they are white, and new, and trembling with the weight of something moving. The forest\'s small sounds have stopped altogether here.',
    clearedDescription: 'The nearest webs hang torn and unravelling, their weavers dead among the roots. The aisles are still choked with grey silk, but nothing stirs it now, and somewhere — cautiously — a bird has started up again.',
    lookDetails: [
      'The webs are woven in ordered courses, warp and weft, more loom-work than snare. Whatever spins them has been at the craft for a very long time.',
      'Scraps of the world hang snagged in the outer sheets: leaves, wings, a rotted hood, a dwarf-mail glove. The aisles keep a little of everything that has tried to pass.',
    ],
    exits: [
      { direction: 'north', targetRoomId: 'forest-gate' },
      { direction: 'east', targetRoomId: 'hanging-gallery' },
    ],
    enemies: [
      { enemyId: 'spider-lurker', count: 1 },
      { enemyId: 'mirkwood-spider', count: 1 },
    ],
    items: ['spider-silk'],
    gridX: 2,
    gridY: 3,
  },

  'hanging-gallery': {
    id: 'hanging-gallery',
    name: 'The Hanging Gallery',
    description: 'The webs close overhead into a roof, and the darkness becomes total. From that ceiling of silk hang bundles — dozens of them, swaying gently though the air is dead still, each one wrapped tight and neat as a chrysalis. Some are deer. Some are the wrong shape for deer. High above, spread-legged shadows move along the strands with a horrible unhurried patience, tending the larder.',
    clearedDescription: 'The weavers of the gallery lie curled and still. The hanging bundles turn slowly overhead in the darkness — past saving, all of them — but nothing tends the larder now, and the strands hang slack.',
    lookDetails: [
      'One of the lower bundles is old enough that the silk has gone to grey rags. Within, a skeleton in the remains of woodman\'s leathers hangs folded, an axe still rusted to its belt.',
      'The strands here are guy-lines as thick as your wrist, thrumming faintly under the traffic above. All of them run east, toward some centre of the web.',
    ],
    exits: [
      { direction: 'west', targetRoomId: 'webbed-aisles' },
      { direction: 'north', targetRoomId: 'old-forest-road' },
      { direction: 'east', targetRoomId: 'broodmother-lair' },
    ],
    enemies: [
      { enemyId: 'spider-weaver', count: 2 },
    ],
    items: ['spider-silk'],
    dark: true,
    gridX: 3,
    gridY: 3,
  },

  'broodmother-lair': {
    id: 'broodmother-lair',
    name: 'The Broodmother\'s Hollow',
    description: 'Every strand in the southern wood ends here: a vast hollow tented over with silk laid down in layers over long years, deep and dark as a closed fist. Egg-sacs the size of haycocks line the walls, pulsing faintly, and the floor is soft with the shed skins of generations. At the hollow\'s heart she waits — old beyond the count of the wood-elves, vast and black, a daughter of Shelob out of the mountains long ago — and her many eyes hold the small red patience of a banked fire.',
    clearedDescription: 'The broodmother lies in the ruin of her own web, legs folded against her bulk, the red patience of her eyes gone out at last. The egg-sacs hang dark and still. To the north, beyond the torn silk, you can hear water — the Forest River, and the open air.',
    lookDetails: [
      'The egg-sacs shift when you pass them, the silk dimpling from within. Whatever hatches here would have poured north along the guy-lines, toward the road, the path, the halls.',
      'Among the litter of skins and bones lie the leavings of a hundred years of ambushes — rusted mail, a splintered wheel, and a sword in a scabbard of black leather that the silk never quite swallowed.',
    ],
    exits: [
      { direction: 'west', targetRoomId: 'hanging-gallery' },
      {
        direction: 'north',
        targetRoomId: 'forest-river-bank',
        blockedUntilCleared: true,
        lockMessage: 'The way north is walled with web laid thick as ship\'s cable, and the broodmother stands astride it. Nothing leaves her hollow while she lives.',
      },
    ],
    enemies: [
      { enemyId: 'spider-broodmother', count: 1 },
      { enemyId: 'spider-weaver', count: 1 },
    ],
    dark: true,
    gridX: 4,
    gridY: 3,
  },

  'forest-river-bank': {
    id: 'forest-river-bank',
    name: 'The Banks of the Forest River',
    description: 'You come out of the webs and the dark onto the southern bank of the Forest River, and the sky — the actual sky, grey and enormous — opens overhead like a door. The river runs quick and cold toward the distant Long Lake, and the air off the water tastes of rain and rushes instead of rot. Behind you the forest stands silent; whatever it thinks of your passage, it keeps to itself.',
    lookDetails: [
      'The wreck of an old cargo raft lies half in the reeds, its ropes gnawed. Cargo meant for the halls was dragged from here into the webs — some of it may just have come out again on your back.',
      'Downriver, far off, a smudge of woodsmoke stands against the grey: Esgaroth upon the Long Lake, where men still trade under the shadow of the mountain. The world goes on beyond the wood.',
    ],
    exits: [
      { direction: 'south', targetRoomId: 'broodmother-lair' },
    ],
    items: ['mirkwood-blade', 'spider-silk', 'greater-healing-potion'],
    events: [
      {
        id: 'beyond-the-webs',
        once: true,
        effect: {
          type: 'narration',
          lines: [
            { text: 'You have cut your way through the spider-dark of Mirkwood and come out alive on the far side.', logType: 'system' },
            { text: 'Among the plunder dragged from the webs over long years, a few things of worth glint in the river-light.' },
          ],
        },
      },
    ],
    gridX: 4,
    gridY: 2,
  },
}

export const mirkwoodEnemies: Record<string, Enemy> = {
  'mirkwood-bat': {
    id: 'mirkwood-bat',
    name: 'Bat of Mirkwood',
    description: 'A black bat broad as an eagle, bred in the caverns under the Mountains of Mirkwood. It hunts by the sound of breathing, and it is never alone.',
    hp: 14,
    maxHp: 14,
    ac: 14,
    abilities: { str: 6, dex: 17, con: 10, int: 2, wis: 12, cha: 4 },
    attackBonus: 5,
    damage: '1d4+2',
    xpReward: 45,
    lootTable: [],
  },
  'spider-lurker': {
    id: 'spider-lurker',
    name: 'Spider Lurker',
    description: 'A great spider that hunts away from the web — long-legged, dust-grey, and utterly silent. It waits beside paths for whatever the aisles have tired out.',
    hp: 32,
    maxHp: 32,
    ac: 15,
    abilities: { str: 15, dex: 16, con: 14, int: 5, wis: 12, cha: 4 },
    attackBonus: 6,
    damage: '1d8+2',
    xpReward: 130,
    lootTable: ['spider-silk'],
  },
  'spider-weaver': {
    id: 'spider-weaver',
    name: 'Spider Weaver',
    description: 'A tender of the great webs, smaller than the lurkers but quicker, its forelegs ending in blades of chitin that cut and spin silk with equal ease. It defends the larder with a shrieking fury.',
    hp: 26,
    maxHp: 26,
    ac: 16,
    abilities: { str: 13, dex: 18, con: 12, int: 6, wis: 12, cha: 5 },
    attackBonus: 7,
    damage: '1d6+3',
    xpReward: 120,
    lootTable: ['spider-silk'],
  },
  'blackheart-huorn': {
    id: 'blackheart-huorn',
    name: 'Blackheart Huorn',
    description: 'A tree gone wrong — ancient, half-awake, and rotted through with the shadow of Dol Guldur. Its roots move like slow serpents, and its groaning voice hates everything that walks.',
    hp: 55,
    maxHp: 55,
    ac: 14,
    abilities: { str: 19, dex: 6, con: 18, int: 7, wis: 14, cha: 5 },
    attackBonus: 6,
    damage: '1d10+3',
    xpReward: 220,
    lootTable: ['healing-potion'],
  },
  'spider-broodmother': {
    id: 'spider-broodmother',
    name: 'The Broodmother',
    description: 'The mother of the southern webs — a monster out of the mountains in the elder days, of the brood of Shelob herself. Vast, black, and patient, she has fed on the Old Forest Road for a hundred years, and her hollow is floored with the proof.',
    hp: 85,
    maxHp: 85,
    ac: 16,
    abilities: { str: 18, dex: 14, con: 16, int: 8, wis: 12, cha: 6 },
    attackBonus: 8,
    damage: '2d6+2',
    xpReward: 600,
    lootTable: ['greater-healing-potion'],
  },
}

export const mirkwoodItems: Record<string, Item> = {
  'mirkwood-longbow': {
    id: 'mirkwood-longbow',
    name: 'Bow of the Woodland Realm',
    description: 'A longbow of black yew, horn-nocked and strung with silk, in the fashion of the Elvenking\'s marchwardens. Light in the hand and vicious at range — the wood-elves learn its use before they learn their letters. (1d8+2, +2 to hit)',
    type: 'weapon',
    damage: '1d8+2',
    attackBonus: 2,
    value: 90,
  },
  'mirkwood-blade': {
    id: 'mirkwood-blade',
    name: 'Mirkwood Blade',
    description: 'A long knife of the Woodland Realm — a sword, by the measure of mortals — its blade leaf-shaped and graven with beech-runes. Dragged into the webs on some dead warden\'s hip, and none the duller for the years in the dark. (1d10+2, +2 to hit)',
    type: 'weapon',
    damage: '1d10+2',
    attackBonus: 2,
    value: 110,
  },
  'dorwinion-wine': {
    id: 'dorwinion-wine',
    name: 'Dorwinion Wine',
    description: 'A flask of the heady vintage of Dorwinion, carried up the Forest River for the King\'s table. It warms the blood, closes wounds, and — taken carelessly — has put stouter heads than yours to sleep. (Heals 3d4+4)',
    type: 'potion',
    healing: '3d4+4',
    consumable: true,
    value: 25,
  },
  'spider-silk': {
    id: 'spider-silk',
    name: 'Spider-silk Hank',
    description: 'A hank of grey silk cut from the great webs, stronger than rope and lighter than wool. The weavers of Esgaroth and the Woodland Realm pay handsomely for it — gathering it is the expensive part.',
    type: 'misc',
    value: 35,
  },
  'thranduil-letter': {
    id: 'thranduil-letter',
    name: 'Sealed Letter of the Elvenking',
    description: 'A letter of heavy vellum under green wax, sealed with the beech-leaf of the Woodland Realm and addressed to Master Erestor of Imladris. Counsel of kings passes within it — the shadow in the south concerns more realms than one.',
    type: 'quest',
    value: 0,
  },
}

export const mirkwoodNPCs: Record<string, NPC> = {
  'faelwen': {
    id: 'faelwen',
    name: 'Faelwen the Marchwarden',
    description: 'A wood-elf of the western marches, grey-cloaked and green-hooded, with a bow across her back and the stillness of someone who has spent a century listening to the forest breathe.',
    dialogue: [
      '"A traveller out of the Golden Wood — you were watched from the river, friend. Everything on this road is watched, though not everything watching is ours."',
      '"Keep to the path, whatever you see and whatever you hear. Do not drink of the black stream north of the gate — its water is dream and forgetting, and the forest eats those who sleep in it."',
      '"The spiders hold the aisles south of the road, and they grow bold. Their dam nests in a hollow east of the hanging larders — while she lives, her brood will never stop coming. If your blade is equal to your look, the marches would not mourn her."',
    ],
  },
  'erynion': {
    id: 'erynion',
    name: 'Erynion, Counsellor of the King',
    description: 'A tall wood-elf in robes the colour of beech-mast, with ink on his fingers and the measuring gaze of one who has drafted three centuries of the King\'s correspondence.',
    dialogue: [
      '"Be welcome in the Halls, traveller. Few come to us by the western road these years, and fewer still arrive with all their blood on the inside. You are noted."',
      '"You cross wide lands, and that is a fortune I would borrow. The King\'s letter to Master Erestor of Imladris has waited a season for a courier — the shadow in the south grows, and the wise must share what they learn of it, or learn it separately and too late."',
      '"The letter lies sealed on the table there. Carry it to Erestor in the library of Rivendell, and name your kindness to him — the counsellors of the Wise settle their debts."',
    ],
  },
  'galion': {
    id: 'galion',
    name: 'Galion the Feast-master',
    description: 'The King\'s butler and master of the feast — broad for an elf, chain of office slightly askew, ladle wielded like a sceptre. His cellar-count is flawless and his opinion of his own palate higher still.',
    dialogue: [
      '"Sit, eat! You have the look of the western road about you, which is to say the look of an unburied corpse. We keep the table loaded in these halls — it is our answer to the dark, and a better one than brooding."',
      '"The Dorwinion is the good barrel, mind — none of your riverside vinegar. It mends flesh and spirit both, though I\'ll thank you to drink it sitting down. I speak from a certain professional experience."',
      '"Coin is welcome too; the barrels come up the river but they are not filled with wishes. Potions, provisions, and a bow of the King\'s own pattern, if your arm is worth the string."',
    ],
    tradeOffers: [
      { itemId: 'healing-potion', cost: 12 },
      { itemId: 'greater-healing-potion', cost: 45 },
      { itemId: 'dorwinion-wine', cost: 25 },
      { itemId: 'lembas-bread', cost: 30 },
      { itemId: 'mirkwood-longbow', cost: 90 },
      { itemId: 'torch', cost: 4 },
    ],
  },
}

export const mirkwoodRoomNPCs: Record<string, string[]> = {
  'forest-gate': ['faelwen'],
  'elvenking-halls': ['erynion'],
  'elven-feast-hall': ['galion'],
}

export const mirkwoodQuests: Record<string, Quest> = {
  'road-through-mirkwood': {
    id: 'road-through-mirkwood',
    name: 'The Road Through the Dark',
    description: 'Beyond the Anduin the darkness of Mirkwood waits. Find the Forest Gate, keep to the path, and win through to the halls of the Elvenking.',
    regionId: 'mirkwood',
    giver: 'the old forest road',
    start: { type: 'enter-room', target: 'anduin-crossing' },
    startLog: 'Mirkwood stands before you like a held breath. Somewhere beyond its darkness are the halls of the Elvenking — firelight, feasting, and news of the road ahead. Keep to the path.',
    stages: [
      {
        objective: 'Reach the Forest Gate at the head of the Old Forest Road',
        trigger: { type: 'enter-room', target: 'forest-gate' },
        completionLog: 'The Forest Gate rises over the path — the last work of a friendlier age. From here the road runs into the dark.',
      },
      {
        objective: 'Win through the forest to the Halls of the Elvenking',
        trigger: { type: 'enter-room', target: 'elvenking-halls' },
        completionLog: 'Torchlight, harp-song, and stone overhead that owes nothing to spiders: you have reached the halls of the Woodland Realm.',
      },
    ],
    rewards: { xp: 200, gold: 30 },
  },

  'webs-of-the-forest': {
    id: 'webs-of-the-forest',
    name: 'Webs Across the Road',
    description: 'The great spiders have webbed the aisles south of the Old Forest Road, and their snares creep closer to the path each season. Cut the brood back.',
    regionId: 'mirkwood',
    giver: 'the wardens of the western marches',
    start: { type: 'enter-room', target: 'webbed-aisles' },
    startLog: 'The webs are new-spun and trembling, and the aisles have gone silent around you. The brood is here, and it is hungry. Steel will have to argue the right of way.',
    stages: [
      {
        objective: 'Slay the great spiders of the southern aisles',
        trigger: { type: 'kill-enemy', target: 'spider-*', count: 4 },
        completionLog: 'Grey legs curl and still among the torn silk. The aisles are not clean — Mirkwood is never clean — but the brood will spin warily for a season.',
      },
    ],
    rewards: { xp: 250, gold: 40 },
  },

  'the-broodmother': {
    id: 'the-broodmother',
    name: 'The Broodmother of the Aisles',
    description: 'Faelwen the marchwarden named the source of the webs: an ancient brood-dam of Shelob\'s line, nested in a hollow east of the hanging larders. While she lives, her children will never stop coming.',
    regionId: 'mirkwood',
    giver: 'Faelwen the Marchwarden',
    start: { type: 'talk-npc', target: 'faelwen' },
    startLog: 'Faelwen\'s directions are precise and her tone is not hopeful: east through the webbed aisles, past the hanging larders, to the hollow where the broodmother waits. No warden patrol has gone that deep and returned.',
    stages: [
      {
        objective: 'Find the broodmother\'s hollow beyond the hanging gallery',
        trigger: { type: 'enter-room', target: 'broodmother-lair' },
        completionLog: 'Every strand of the southern webs ends here — and at their centre, vast and patient, she is waiting for you.',
      },
      {
        objective: 'Slay the broodmother and her guard',
        trigger: { type: 'clear-room', target: 'broodmother-lair' },
        completionLog: 'The mother of the webs lies broken in her own hollow. The marches of the Woodland Realm will breathe easier for a generation — and the way north to the Forest River stands open.',
      },
    ],
    rewards: { xp: 450, gold: 60 },
  },

  'letter-for-rivendell': {
    id: 'letter-for-rivendell',
    name: 'A Letter for Rivendell',
    description: 'Erynion, counsellor of the Elvenking, asks you to carry a sealed letter across the wide lands to Master Erestor in the library of Rivendell. The Wise must share what they learn of the shadow — or learn it separately, and too late.',
    regionId: 'mirkwood',
    giver: 'Erynion, Counsellor of the King',
    start: { type: 'enter-room', target: 'elvenking-halls' },
    startLog: 'A counsellor in beech-brown robes marks your arrival with open interest. A traveller who crosses whole lands is a courier the Woodland Realm has lacked all season — and a sealed letter for Rivendell lies waiting on the table.',
    stages: [
      {
        objective: 'Take the Elvenking\'s sealed letter from the table in the halls',
        trigger: { type: 'take-item', target: 'thranduil-letter' },
        completionLog: 'The letter is heavier than vellum has any right to be — the counsel of kings, riding in your pack. Erestor keeps the library of Imladris, far to the west over mountain and river.',
      },
      {
        objective: 'Deliver the letter to Erestor in the library of Rivendell',
        trigger: { type: 'talk-npc', target: 'erestor' },
        completionLog: 'Erestor breaks the green seal and reads in silence, and his face grows graver by the line. "So the Wood confirms what the White Council feared. You have done the Wise a service beyond your knowing, courier."',
      },
    ],
    rewards: { xp: 350, gold: 75 },
  },
}
