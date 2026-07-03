import type { Room } from '../types/room'
import type { Enemy } from '../types/character'
import type { Item } from '../types/item'
import type { NPC } from '../types/npc'
import type { Quest } from '../types/quest'

/**
 * Fangorn Forest — a level 6–8 region south of Lothlórien.
 * The oldest forest of Middle-earth: dim aisles of huorn-dark trees,
 * Treebeard's home at Wellinghall, the Entmoot hollow of Derndingle —
 * and an orc warband fled from Isengard, cutting and burning at the
 * wood's edge, that the forest itself has begun to hate.
 */

export const fangornRooms: Record<string, Room> = {
  'fangorn-eaves': {
    id: 'fangorn-eaves',
    name: 'The Eaves of Fangorn',
    description: 'The golden light of Lórien fails behind you, and the forest of Fangorn rises ahead like a grey-green wall — trees older than memory, bearded with moss and lichen, their boughs knotted with the slow anger of ages. The air beneath the eaves is thick and still, and it seems to press upon your chest like held breath. Whatever walks here, walks slowly, and has been walking a very long time.',
    lookDetails: [
      'The outermost trees lean away from the wood, as if they had begun to stride out into the world long ago and then thought better of it. Their roots have humped the earth into steps.',
      'There is no birdsong beneath the eaves, only a deep creaking far off — not of wind in branches, for there is no wind.',
    ],
    exits: [
      { direction: 'north', targetRoomId: 'farewell-lawn' },
      { direction: 'south', targetRoomId: 'mossy-aisles' },
      { direction: 'east', targetRoomId: 'orc-cutting' },
    ],
    waypoint: true,
    waypointLabel: 'The Eaves of Fangorn',
    events: [
      {
        id: 'fangorn-first-steps',
        once: true,
        effect: {
          type: 'narration',
          lines: [
            { text: 'You have come to Fangorn, the oldest of forests. Tread softly, and cut no living wood — the trees here remember axes.', logType: 'system' },
            { text: 'Somewhere eastward, faint on the heavy air, you catch the smell of smoke.' },
          ],
        },
      },
    ],
    gridX: 1,
    gridY: 0,
  },

  'orc-cutting': {
    id: 'orc-cutting',
    name: 'The Orc-cutting',
    description: 'A wound in the forest\'s edge. Trees lie felled in windrows, hacked and half-burned, their stumps oozing sap like blood. Orcs move among the wreckage with axes and torches — a ragged warband bearing the White Hand of Isengard, fled north from some defeat and making war on the wood itself for spite and firewood. They see you, and their work turns gladly to murder.',
    clearedDescription: 'The cutting lies silent. The orc fires gutter out among the felled trunks, and already the forest seems to lean inward over the scar, patient and grim, beginning the long work of taking it back.',
    lookDetails: [
      'The felling was wasteful even by orc reckoning — trees cut and left to rot, burned where they lay. This was not harvest. It was hatred.',
      'Among the stumps you find a strange track: a single footprint, seven feet from heel to toe, pressed a hand\'s depth into the packed earth. Something very large has stood here, looking at the destruction.',
    ],
    exits: [
      { direction: 'west', targetRoomId: 'fangorn-eaves' },
      { direction: 'south', targetRoomId: 'charred-dell' },
    ],
    enemies: [
      { enemyId: 'orc-firebrand', count: 1 },
      { enemyId: 'orc-fugitive', count: 2 },
    ],
    gridX: 2,
    gridY: 0,
  },

  'charred-dell': {
    id: 'charred-dell',
    name: 'The Charred Dell',
    description: 'The orcs\' fires ran ahead of them here, down into a dell of ancient rowans, and the dell burned. Blackened trunks stand like broken pillars in a ruined hall, and ash lies ankle-deep, still warm in places. In the heart of the burn the warband has made a foul little bivouac of scorched logs and stolen gear, and its sentries are neither asleep nor friendly.',
    clearedDescription: 'The dell is quiet but for the tick of cooling embers. Green shoots will be slow to return here — yet at the burn\'s edge a single rowan sapling stands unscorched, which no fire seems to have dared.',
    lookDetails: [
      'Among the bivouac\'s litter lies a captain\'s satchel of black leather, stamped with a white hand — dispatches, half-burned but legible.',
      'The ash preserves the story of the burning: orc prints running everywhere in panic, and through them, unhurried, those same enormous seven-foot strides.',
    ],
    exits: [
      { direction: 'north', targetRoomId: 'orc-cutting' },
      { direction: 'west', targetRoomId: 'mossy-aisles' },
    ],
    enemies: [
      { enemyId: 'orc-fugitive', count: 1 },
      { enemyId: 'uruk-scout', count: 1 },
    ],
    items: ['white-hand-orders'],
    gridX: 2,
    gridY: 1,
  },

  'mossy-aisles': {
    id: 'mossy-aisles',
    name: 'The Mossy Aisles',
    description: 'The forest proper closes over you. Vast trunks rise in dim colonnades, hung with beards of grey lichen, and the light comes down green and heavy as water at the bottom of a pool. Moss muffles your footfalls utterly. The aisles run on southward in every shade of shadow, and you have the distinct feeling of walking through a hall in which the pillars are quietly aware of you.',
    lookDetails: [
      'When you look at any single tree it is only a tree. It is at the edge of sight that they seem to shift — a bough lowered that was raised, a gap closed that was open.',
      'The moss on the northern faces of the trunks is worn in long vertical tracks, as though great hands habitually trail along them in passing.',
    ],
    exits: [
      { direction: 'north', targetRoomId: 'fangorn-eaves' },
      { direction: 'east', targetRoomId: 'charred-dell' },
      { direction: 'west', targetRoomId: 'huorn-thicket' },
      { direction: 'south', targetRoomId: 'treebeard-hill' },
    ],
    gridX: 1,
    gridY: 1,
  },

  'huorn-thicket': {
    id: 'huorn-thicket',
    name: 'The Huorn Thicket',
    description: 'The trees crowd so close here that their boughs knit into a roof, and full night reigns at noonday. The dark is not empty. It creaks and shifts around you, and the path you came by is somehow no longer quite where you left it. These are huorns — trees gone treeish-wild or Ents gone tree-ish, hearts grown dark, and the smell of orc-fire on the wind has woken something in them that does not distinguish carefully between strangers.',
    clearedDescription: 'The thicket has gone still. The great shape that assailed you stands rooted once more, indistinguishable from its brothers — save for a long shudder that runs through its boughs when you pass, like a sigh going out of it.',
    lookDetails: [
      'Your light shows bark scored with old axe-scars, healed over into shapes uncomfortably like scowling faces.',
      'Deep in the thicket, pale things gleam in a ring of roots: the rusted helms and clean-picked bones of orcs who came this way before you, held fast until they stopped struggling.',
    ],
    exits: [
      { direction: 'east', targetRoomId: 'mossy-aisles' },
      { direction: 'south', targetRoomId: 'wellinghall' },
    ],
    enemies: [
      { enemyId: 'wild-huorn', count: 1 },
    ],
    dark: true,
    gridX: 0,
    gridY: 1,
  },

  'wellinghall': {
    id: 'wellinghall',
    name: 'Wellinghall',
    description: 'The forest opens into a great bay in the hillside, roofed by two mighty evergreens whose arms interlace overhead. A spring wells from the rock at the back and falls in a silver curtain across the entrance, filling the air with cool spray and a green, living light. A stone table stands within, and great jars along the wall glow faintly gold. This is Wellinghall, one of the ent-houses of Fangorn — and its master, fourteen feet of bark and limb and deep unhurried eyes, is at home.',
    lookDetails: [
      'The jars along the wall hold ent-draughts — the waters of the Entwash, worked by ent-craft. The golden light in them pulses slowly, like a heartbeat.',
      'There is no bed in Wellinghall. Its master sleeps standing, feet in the basins of the spring, as trees sleep.',
    ],
    exits: [
      { direction: 'north', targetRoomId: 'huorn-thicket' },
      { direction: 'east', targetRoomId: 'treebeard-hill' },
    ],
    items: ['ent-draught'],
    waypoint: true,
    waypointLabel: 'Wellinghall',
    gridX: 0,
    gridY: 2,
  },

  'treebeard-hill': {
    id: 'treebeard-hill',
    name: 'The Bare Hill',
    description: 'A steep knoll shoulders up out of the forest, its crown bare of trees and fringed with rowans. From the rock shelf at its top you can see out over Fangorn for the first time: a sea of grey-green crowns rolling away south and west, smudged at its far edge with a thin dirty pillar of smoke. Standing here is like standing on the back of some vast sleeping beast and feeling it breathe.',
    lookDetails: [
      'The rock shelf is worn smooth in two long hollows, side by side — as if something with very large feet has stood in exactly this spot, watching the horizon, for a few thousand years.',
      'Far to the south-west, beyond the forest\'s rim, a black needle pricks the sky. Orthanc. Even at this distance you do not like the look of it.',
    ],
    exits: [
      { direction: 'north', targetRoomId: 'mossy-aisles' },
      { direction: 'west', targetRoomId: 'wellinghall' },
      { direction: 'east', targetRoomId: 'entwash-springs' },
      { direction: 'south', targetRoomId: 'root-stair' },
    ],
    gridX: 1,
    gridY: 2,
  },

  'entwash-springs': {
    id: 'entwash-springs',
    name: 'The Springs of the Entwash',
    description: 'A young river is born here, welling up cold and bright among mossy boulders and sliding away eastward in a chain of pools. This is the Entwash, that waters all the wood and the wide grasslands beyond. The water has a taste you have no word for — like starlight, if starlight were a flavour — and the grass along its banks grows greener than any lawn of the Golden Wood.',
    lookDetails: [
      'The pools are lined with pale gravel laid in patterns too regular for chance. Even the riverbed here has been gardened.',
      'A stone jar stands in a niche by the largest pool, left as if for travellers. The custom of the house of Fangorn, it seems, extends to the whole forest.',
    ],
    exits: [
      { direction: 'west', targetRoomId: 'treebeard-hill' },
      { direction: 'south', targetRoomId: 'old-stump-grove' },
    ],
    items: ['ent-draught'],
    events: [
      {
        effect: {
          type: 'status-effect',
          effectId: 'blessed',
          message: 'You cup your hands and drink from the springs of the Entwash. Vigour runs through you from scalp to sole, and for a moment you would swear you have grown taller.',
        },
      },
    ],
    gridX: 2,
    gridY: 2,
  },

  'root-stair': {
    id: 'root-stair',
    name: 'The Root-stair',
    description: 'The land drops away southward in a long slope, and the trees have made a road of it: great roots lie across the descent in even steps, worn smooth by ages of enormous feet. The stair winds down through gathering gloom toward a wide hollow in the west, and the forest on either hand stands in ranks, solemn as pillars in a king\'s barrow. It is impossible to hurry here. The stair does not permit it.',
    lookDetails: [
      'The steps are spaced for strides half again as long as yours. This road was not made for the convenience of men.',
      'Scratched on a root-step near the bottom, small and crude: an orc-rune. Someone\'s scout came this far, and marked the road for those behind.',
    ],
    exits: [
      { direction: 'north', targetRoomId: 'treebeard-hill' },
      { direction: 'west', targetRoomId: 'derndingle' },
      { direction: 'east', targetRoomId: 'old-stump-grove' },
      { direction: 'south', targetRoomId: 'uruk-warcamp' },
    ],
    gridX: 1,
    gridY: 3,
  },

  'derndingle': {
    id: 'derndingle',
    name: 'Derndingle',
    description: 'A great bowl of a valley opens in the forest floor, ringed by a high hedge of dark evergreens and floored with soft grass, treeless and silent under the sky. This is Derndingle, where the Ents have held their moots since the world was young. The emptiness of it is enormous and expectant, like a hall with the chairs drawn up and the fire laid, waiting for a council that has not yet been called.',
    lookDetails: [
      'The grass of the bowl grows in wide flattened rings, one within another — the marks of centuries of moots, each ring a slow assembly of standing speakers.',
      'The hedge about the rim is no accident: it was planted, stem by stem, and it is trained inward, so that nothing outside may overlook what is said within.',
    ],
    exits: [
      { direction: 'east', targetRoomId: 'root-stair' },
      { direction: 'south', targetRoomId: 'skinbark-hollow' },
    ],
    waypoint: true,
    waypointLabel: 'Derndingle',
    events: [
      {
        id: 'derndingle-hush',
        once: true,
        effect: {
          type: 'narration',
          lines: [
            { text: 'You stand in the moot-ground of the Ents. The hush here is older than any kingdom of Elves or Men.', logType: 'system' },
            { text: 'If the wood ever rouses to war, the word will be spoken in this place first.' },
          ],
        },
      },
    ],
    gridX: 0,
    gridY: 3,
  },

  'skinbark-hollow': {
    id: 'skinbark-hollow',
    name: 'Skinbark\'s Hollow',
    description: 'A sheltered combe of rowan trees, silver-barked and heavy with red berries — the country of Skinbark\'s people, the rowan-ents of the western slopes. Many of the trees here bear axe-wounds bound up with moss and clay, tended like the hurts of soldiers in a field hospital. A younger Ent moves among them, tall and lithe, whispering to each in a voice like wind over water.',
    lookDetails: [
      'Skinbark himself is not here. He has gone up among the birches of the high slopes, they say, and will not come down — the orcs killed too many of his folk.',
      'The tended trees lean visibly toward their keeper as he passes, like patients turning toward a lamp.',
    ],
    exits: [
      { direction: 'north', targetRoomId: 'derndingle' },
      { direction: 'east', targetRoomId: 'uruk-warcamp' },
    ],
    gridX: 0,
    gridY: 4,
  },

  'old-stump-grove': {
    id: 'old-stump-grove',
    name: 'The Old Stump Grove',
    description: 'A grief lies on this place. Stumps of enormous girth stand in a wide ring — trees that would have been elder even in this forest, felled not this year but long ago, their tops carted off to feed some furnace in the south. The forest has never regrown here; it stands back from the ring as mourners stand back from graves. Uruk scouts of the warband have made a lookout among the stumps, proving that nothing is too sacred to be perched on.',
    clearedDescription: 'The uruks lie where they fell among the great stumps. The grove\'s silence closes back over the ring like water over a stone, and you find that you are walking softly without having decided to.',
    lookDetails: [
      'The growth-rings of the largest stump are beyond counting. Its heart-rings were laid down before the first ship of Men ever came east over the Sea.',
      'One uruk had begun cutting a leaning shield-board from a stump\'s slab-bark. The bark is iron-hard, and the work broke two of his axes first.',
    ],
    exits: [
      { direction: 'north', targetRoomId: 'entwash-springs' },
      { direction: 'west', targetRoomId: 'root-stair' },
    ],
    enemies: [
      { enemyId: 'uruk-scout', count: 2 },
    ],
    items: ['huorn-bark-shield'],
    gridX: 2,
    gridY: 3,
  },

  'uruk-warcamp': {
    id: 'uruk-warcamp',
    name: 'The Uruk Warcamp',
    description: 'The warband has dug in at the forest\'s southern throat: a stockade of sharpened, stolen timber, fires burning green and foul with sap, the white hand of Saruman daubed on shields and stakes. At the heart of the camp stands their captain — an uruk of the fighting breed, taller than a man, black-armoured, with a cleaver like a gate-hinge. A bound prisoner in the colours of Rohan slumps against the stockade. The uruk sees you and grins with every tooth it has.',
    clearedDescription: 'The warcamp is broken. The green fires die in their pits, the white-hand shields lie face-down in the mud, and through the shattered south stockade the land opens toward the grasslands of Rohan.',
    lookDetails: [
      'The stockade timber is ent-country wood, and it is not resting quietly: overnight, stakes have taken root and put out defiant little leaves among the sharpened points.',
      'The captain\'s standard is a pole crowned with a white-painted hand. Fresh sap has bled down the pole and over the fingers, so that the hand seems to be slowly closing.',
    ],
    exits: [
      { direction: 'north', targetRoomId: 'root-stair' },
      { direction: 'west', targetRoomId: 'skinbark-hollow' },
      {
        direction: 'south',
        targetRoomId: 'fangorn-southern-eaves',
        blockedUntilCleared: true,
        lockMessage: 'The uruk captain plants itself in the southern gap of the stockade, cleaver raised. You will not pass while it stands.',
      },
    ],
    enemies: [
      { enemyId: 'uruk-ravager', count: 1 },
      { enemyId: 'orc-fugitive', count: 1 },
    ],
    events: [
      {
        id: 'warcamp-broken',
        once: true,
        when: { roomCleared: true },
        effect: {
          type: 'narration',
          lines: [
            { text: 'With the captain fallen, the warband of the White Hand is finished. Fangorn is rid of its wasps.', logType: 'system' },
            { text: 'From the deep wood behind you comes a long groaning creak, like a vast door opening — or a forest, very slowly, beginning to smile.' },
          ],
        },
      },
    ],
    gridX: 1,
    gridY: 4,
  },

  'fangorn-southern-eaves': {
    id: 'fangorn-southern-eaves',
    name: 'The Southern Eaves',
    description: 'The forest thins, and light comes back into the world by degrees. Between the last mossy trunks you look out over an ocean of pale grass rolling away southward under an enormous sky — the Wold of Rohan, the country of the horse-lords. The wind off the plain smells of sun and distance. Behind you Fangorn stands like a green cliff; ahead, a rider\'s track bends away through the grass toward lands where things happen quickly.',
    lookDetails: [
      'Hoofprints mark the track southward in great numbers — shod horses, riding in ordered éoreds. The Riddermark patrols to the very eaves of the wood, though its riders do not enter.',
      'A boundary stone leans in the grass where forest meets plain, carved on one face with entish scroll-work and on the other with the running horse of Rohan. Two very different countries agree, at least, on where they end.',
    ],
    exits: [
      { direction: 'north', targetRoomId: 'uruk-warcamp' },
      { direction: 'south', targetRoomId: 'wold-road' },
    ],
    gridX: 1,
    gridY: 5,
  },
}

export const fangornEnemies: Record<string, Enemy> = {
  'orc-fugitive': {
    id: 'orc-fugitive',
    name: 'Orc Fugitive',
    description: 'A hard-bitten orc of Isengard\'s levies, fled north from some disaster with its kit and its grudges. Desertion has made it vicious — it has nothing left to lose and a forest it hates to lose it in.',
    hp: 24,
    maxHp: 24,
    ac: 14,
    abilities: { str: 15, dex: 13, con: 14, int: 8, wis: 8, cha: 6 },
    attackBonus: 6,
    damage: '1d8+3',
    xpReward: 90,
    lootTable: ['gold-coins'],
  },
  'orc-firebrand': {
    id: 'orc-firebrand',
    name: 'Orc Firebrand',
    description: 'An orc with a torch in one fist and a hooked blade in the other, reeking of pitch. Burning things is the only work it has ever loved.',
    hp: 20,
    maxHp: 20,
    ac: 13,
    abilities: { str: 13, dex: 15, con: 12, int: 8, wis: 7, cha: 6 },
    attackBonus: 5,
    damage: '1d6+3',
    xpReward: 80,
    lootTable: ['gold-coins'],
  },
  'uruk-scout': {
    id: 'uruk-scout',
    name: 'Uruk Scout',
    description: 'A soldier of the fighting Uruk-hai, man-high and heavy-boned, in black mail stamped with the White Hand. It does not fear the sun, and it has been taught not to fear much else.',
    hp: 34,
    maxHp: 34,
    ac: 15,
    abilities: { str: 17, dex: 12, con: 15, int: 9, wis: 9, cha: 7 },
    attackBonus: 7,
    damage: '1d10+3',
    xpReward: 140,
    lootTable: ['healing-potion'],
  },
  'wild-huorn': {
    id: 'wild-huorn',
    name: 'Wild Huorn',
    description: 'A tree that is no longer only a tree — a huorn gone dark of heart, quick and wrathful, its limbs creaking like a ship in a storm as it wrenches its roots from the earth. The orc-fires have woken it, and it is past telling friend from axe.',
    hp: 48,
    maxHp: 48,
    ac: 16,
    abilities: { str: 19, dex: 6, con: 18, int: 7, wis: 12, cha: 5 },
    attackBonus: 6,
    damage: '2d6+3',
    xpReward: 180,
    lootTable: ['huorn-heartwood'],
  },
  'uruk-ravager': {
    id: 'uruk-ravager',
    name: 'Uruk Ravager',
    description: 'The captain of the fugitive warband — a first-breed uruk of Isengard, black-armoured and scarred from crown to heel, carrying a cleaver that has felled trees and worse. Saruman\'s armies may have disowned it, but its appetite for ruin came with it intact.',
    hp: 78,
    maxHp: 78,
    ac: 16,
    abilities: { str: 19, dex: 12, con: 17, int: 10, wis: 9, cha: 9 },
    attackBonus: 8,
    damage: '2d8+4',
    xpReward: 320,
    lootTable: ['isengard-cleaver', 'greater-healing-potion'],
  },
}

export const fangornItems: Record<string, Item> = {
  'ent-draught': {
    id: 'ent-draught',
    name: 'Ent-draught',
    description: 'Water of the Entwash, worked by ent-craft in a stone jar — it glows faintly gold, and a swallow of it runs through the limbs like sap in spring. (Heals 3d8+6)',
    type: 'potion',
    healing: '3d8+6',
    consumable: true,
    value: 40,
  },
  'white-hand-orders': {
    id: 'white-hand-orders',
    name: 'White Hand Orders',
    description: 'Half-burned dispatches from a captain\'s satchel, stamped with the White Hand of Isengard. They order the warband to fall back north "through the tree-country, burning as you go." Proof, in Saruman\'s own inks, of who set fire to Fangorn.',
    type: 'quest',
    value: 0,
  },
  'isengard-cleaver': {
    id: 'isengard-cleaver',
    name: 'Isengard Cleaver',
    description: 'The uruk captain\'s great blade — half sword, half slaughterhouse tool, forge-marked with the wheel-and-hand of Orthanc. Crude to the eye and murderously well-balanced in the hand. (1d10+2, +1 to hit)',
    type: 'weapon',
    damage: '1d10+2',
    attackBonus: 1,
    value: 90,
  },
  'huorn-bark-shield': {
    id: 'huorn-bark-shield',
    name: 'Huorn-bark Shield',
    description: 'A shield-board of slab bark from an elder stump, iron-hard and lighter than it looks. Blades glance from its grain as from wet stone. (+2 AC)',
    type: 'armor',
    armorBonus: 2,
    value: 75,
  },
  'huorn-heartwood': {
    id: 'huorn-heartwood',
    name: 'Huorn Heartwood',
    description: 'A knot of heartwood from a fallen huorn, dense as bronze and faintly warm, with a grain that seems to move when you are not watching. Carvers and wandwrights would pay dearly for it.',
    type: 'misc',
    value: 70,
  },
}

export const fangornNPCs: Record<string, NPC> = {
  'treebeard': {
    id: 'treebeard',
    name: 'Treebeard',
    description: 'An Ent — fourteen feet of grey-green bark and limb, with a great sweeping beard of twigs and moss, and deep brown eyes filled with ages of slow, considering light. Fangorn, the eldest of his people, in whose name the whole forest is called.',
    dialogue: [
      '"Hoom, hroom... now, let us not be hasty. What are you, I wonder? You are not in the old lists I learned when I was young. Man? Elf-friend? Hm. You do not smell of axes, at any rate, and that is a beginning."',
      '"I am an Ent, or so you would say. Fangorn is my name according to some; Treebeard others make it. I am the shepherd of these trees, and I have watched this forest since before your oldest songs were seeds."',
      '"There are wasps in my wood — orcs out of Isengard, burárum, curse them root and branch! They cut and they burn at the southern eaves. Some of the trees they felled were my friends, creatures I had known from nut and acorn. If you have any fire of your own, spend it on driving them out."',
      '"And when the wasps are dealt with, carry word north to the Golden Wood. The Lady\'s folk keep the marches — Haldir and his wardens — and they should know that Saruman\'s arm now reaches even here. Ents are not swift messengers, hoom, but you have a quick look about you."',
    ],
    questReward: {
      itemId: 'ent-draught',
      message: 'Treebeard takes down a stone jar and fills a great bowl, and bids you drink. "Ent-draught. It will keep you green and growing for many a mile, hoom, hm."',
    },
  },
  'bregalad': {
    id: 'bregalad',
    name: 'Bregalad',
    description: 'A young Ent — a mere few centuries old — tall and lithe, with smooth rowan-silver bark and lips that seem always about to laugh or to grieve. He tends the wounded trees of the hollow like a healer walking his ward.',
    dialogue: [
      '"Bregalad, I am called — Quickbeam in your tongue, for I once answered an elder Ent before he had finished his question. Among Ents, that is reckless haste."',
      '"These rowans were my people\'s joy. The orcs cut them for sport and left them to lie. Skinbark, my elder, took a wound and has gone up among the birches, and will not come down. So I bind what can be bound, and I remember what cannot."',
      '"Travellers drop many things in a forest, hoom, and a forest forgets nothing. What the wood has gleaned I will trade — for gold, since your folk set such store by it. It only sits in the ground otherwise, and the trees have no use for it."',
    ],
    tradeOffers: [
      { itemId: 'ent-draught', cost: 35 },
      { itemId: 'healing-potion', cost: 12 },
      { itemId: 'greater-healing-potion', cost: 30 },
      { itemId: 'athelas', cost: 8 },
    ],
  },
  'leofwin': {
    id: 'leofwin',
    name: 'Léofwin of the Mark',
    description: 'A young Rider of Rohan, straw-haired and grim, rope-galled at the wrists — a scout of the Wold patrols, taken when the warband broke north across the grass. His sword is gone but his nerve, evidently, is not.',
    dialogue: [
      '"Water first, friend, and then my thanks. Léofwin, scout of the Wold-riders. I was watching this rabble\'s trail when their uruk got its hands on me — a mistake I mean to spend the rest of my life not repeating."',
      '"They fled Isengard\'s muster, if you can credit it — deserters even from that master. They struck for the forest because no rider will follow them under these trees. The trees, it turns out, required no help from us."',
      '"South of the eaves runs the Wold-road, and it will carry you to Edoras and the Golden Hall. If your road bends that way, tell them Léofwin lives — and speak my name at the gates. The Mark remembers its debts."',
    ],
  },
}

export const fangornRoomNPCs: Record<string, string[]> = {
  'wellinghall': ['treebeard'],
  'skinbark-hollow': ['bregalad'],
  'uruk-warcamp': ['leofwin'],
}

export const fangornQuests: Record<string, Quest> = {
  'the-oldest-forest': {
    id: 'the-oldest-forest',
    name: 'The Oldest Forest',
    description: 'Something walks in Fangorn that is neither man nor elf nor orc — the trees themselves have a shepherd. Follow the great footprints to their maker.',
    regionId: 'fangorn',
    giver: 'the forest itself',
    start: { type: 'enter-room', target: 'fangorn-eaves' },
    startLog: 'The forest of Fangorn closes around you, watchful and old beyond reckoning. Enormous footprints thread the moss westward — something walks here, and it is not hiding.',
    stages: [
      {
        objective: 'Find the ent-house of Wellinghall in the western forest',
        trigger: { type: 'enter-room', target: 'wellinghall' },
        completionLog: 'A curtain of springwater, a hall of living green — and its master at home. You have found Wellinghall.',
      },
      {
        objective: 'Speak with Treebeard, the shepherd of the trees',
        trigger: { type: 'talk-npc', target: 'treebeard' },
        completionLog: 'Hoom, hroom. You have spoken with the eldest living thing that walks beneath the sun, and it has decided — unhastily — that it likes you.',
      },
    ],
    rewards: { xp: 180 },
  },

  'axes-at-the-eaves': {
    id: 'axes-at-the-eaves',
    name: 'Axes at the Eaves',
    description: 'An orc warband fled from Isengard is cutting and burning at Fangorn\'s edge. Treebeard asks you to drive the intruders from the wood, break their warcamp — and then carry warning north to the wardens of Lothlórien.',
    regionId: 'fangorn',
    giver: 'Treebeard',
    start: { type: 'talk-npc', target: 'treebeard' },
    startLog: 'Treebeard\'s voice drops to a rumble you feel through your boot-soles: drive the orc wasps from the wood, break their nest at the southern throat, and carry word of Saruman\'s reach to the Galadhrim of the Golden Wood.',
    stages: [
      {
        objective: 'Drive the orc intruders from Fangorn (slay 4 orcs)',
        trigger: { type: 'kill-enemy', target: 'orc-*', count: 4 },
        completionLog: 'The orc stragglers are broken and scattered. What remains of the warband has drawn back to its stockade at the forest\'s southern throat.',
      },
      {
        objective: 'Break the uruk warcamp at the southern throat of the forest',
        trigger: { type: 'clear-room', target: 'uruk-warcamp' },
        completionLog: 'The warcamp of the White Hand lies in ruins. Fangorn is rid of its wasps — now the Golden Wood must be warned of the hand that sent them.',
      },
      {
        objective: 'Carry warning to Haldir, march-warden of Lothlórien',
        trigger: { type: 'talk-npc', target: 'haldir' },
        completionLog: 'Haldir hears your account in grim silence. "Isengard\'s arm grows long indeed. The northern marches will double their watch — Lórien thanks you, and so, I think, does the old forest."',
      },
    ],
    rewards: { xp: 350, gold: 60, itemIds: ['ent-draught'] },
  },

  'the-white-hand-burns': {
    id: 'the-white-hand-burns',
    name: 'The White Hand Burns',
    description: 'The burning of Fangorn\'s eaves was no orc whim — someone gave the order. Find proof of the hand behind the fires and bring it to Treebeard.',
    regionId: 'fangorn',
    giver: 'the smoking eaves',
    start: { type: 'enter-room', target: 'orc-cutting' },
    startLog: 'Trees felled for spite, fires set in living wood — this destruction has the smell of policy, not plunder. Somewhere in this warband\'s baggage there will be orders, and orders have authors.',
    stages: [
      {
        objective: 'Find the warband\'s orders in the burned dell',
        trigger: { type: 'take-item', target: 'white-hand-orders' },
        completionLog: 'The dispatches are stamped with the White Hand of Isengard: "fall back north through the tree-country, burning as you go." Saruman\'s malice, in his servants\' ink.',
      },
      {
        objective: 'Bring the White Hand orders to Treebeard',
        trigger: { type: 'talk-npc', target: 'treebeard' },
        completionLog: 'Treebeard holds the charred papers a long while, and his eyes go from deep brown to a slow, kindling green. "Saruman. A wizard should know better. Hoom. He will be spoken of — at the next Entmoot — and he will not enjoy the minutes."',
      },
    ],
    rewards: { xp: 220, gold: 40 },
  },

  'springs-of-the-entwash': {
    id: 'springs-of-the-entwash',
    name: 'The Springs of the Entwash',
    description: 'The great river of the horse-lands rises in Fangorn, and its source-water, jarred by ent-craft, is a draught worth more than gold to a traveller.',
    regionId: 'fangorn',
    start: { type: 'enter-room', target: 'entwash-springs' },
    startLog: 'The Entwash rises cold and bright among the mossy stones — and by the largest pool, a stone jar stands in a niche, left as if for travellers.',
    stages: [
      {
        objective: 'Take the jarred ent-draught from the springs',
        trigger: { type: 'take-item', target: 'ent-draught' },
        completionLog: 'The jar is cool in your hands, and the golden water within pulses faintly, like something alive. The custom of the house of Fangorn provides for its guests.',
      },
    ],
    rewards: { xp: 100 },
  },
}
