import type { Room } from '../types/room'
import type { Enemy } from '../types/character'
import type { Item } from '../types/item'
import type { NPC } from '../types/npc'
import type { Quest } from '../types/quest'

/**
 * Rohan & Edoras — a level 8–10 region.
 * The open grasslands of the Riddermark, harried by warg-riders, Dunlending
 * raiders and the uruk scouts of the White Hand — and at the road's end,
 * the hill-city of Edoras and Meduseld the Golden Hall, a safe hub with
 * a king's counsel, high-tier trade, and rest.
 */

export const rohanRooms: Record<string, Room> = {
  'wold-road': {
    id: 'wold-road',
    name: 'The Wold',
    description: 'The trees fall away behind you and the world becomes grass — a rolling green sea running south to the very feet of the White Mountains, their peaks bright with snow even in summer. This is the Wold, the north-march of Rohan, where the wind never rests and a rider can be seen from three leagues off. The road south is little more than a ribbon of beaten earth through the waving green.',
    lookDetails: [
      'Hoofprints mark the road in great numbers, all shod in the fashion of the Mark — but they are days old, and no fresh patrol has passed. The éoreds ride elsewhere, or ride no more.',
      'Far to the south, a thin smudge of smoke stands against the mountains. Grass fires burn out quickly in the Riddermark. That smoke has not.',
    ],
    exits: [
      { direction: 'north', targetRoomId: 'fangorn-southern-eaves' },
      { direction: 'south', targetRoomId: 'eastemnet-plains' },
    ],
    waypoint: true,
    waypointLabel: 'The Wold',
    events: [
      {
        id: 'entering-the-mark',
        once: true,
        effect: {
          type: 'narration',
          lines: [
            { text: 'You have come to the Riddermark — the land of the Horse-lords. Wide is the Mark, and empty of friends until Edoras.', logType: 'system' },
            { text: 'The wind combs the grass in long silver waves, and carries, faint and far, something that might be horns — or wolves.' },
          ],
        },
      },
    ],
    gridX: 1,
    gridY: 0,
  },

  'eastemnet-plains': {
    id: 'eastemnet-plains',
    name: 'The Eastemnet',
    description: 'The plains open on every side, grass to the horizon, the sky enormous overhead. Herds once grazed here in their thousands, but the land lies empty now, and the emptiness has teeth: grey shapes lope through the grass on your flank, and on their backs ride goblin-shapes with crooked spears. Warg-riders of Isengard, hunting far from their master\'s tower.',
    clearedDescription: 'The wargs lie still in the trampled grass, their riders sprawled beside them. The plain breathes easier — but the grass whispers that these were only outriders, and their pack-mates range elsewhere on the Mark.',
    lookDetails: [
      'The warg-tracks run in a long deliberate arc — not hunting game, but sweeping the plain. Someone has sent these riders to see how much of the Mark stands unguarded.',
      'A cast horseshoe lies in the grass, thrown at a gallop. Whoever rode this way was riding for his life.',
    ],
    exits: [
      { direction: 'north', targetRoomId: 'wold-road' },
      { direction: 'east', targetRoomId: 'herdsmans-camp' },
      { direction: 'south', targetRoomId: 'entwade-ford' },
    ],
    enemies: [
      { enemyId: 'warg-rider', count: 2 },
    ],
    gridX: 1,
    gridY: 1,
  },

  'herdsmans-camp': {
    id: 'herdsmans-camp',
    name: 'The Herdsman\'s Camp',
    description: 'A ring of turf shelters stands in the lee of a low hill, where the herdsmen of the Eastemnet summered with their horses. The camp is deserted — not ruined, but abandoned in haste: a cook-pot still hangs over cold ashes, and a child\'s carved wooden horse lies on its side by a doorway. The herds and their keepers fled south, and did not stop to pack.',
    lookDetails: [
      'The ashes in the fire-ring are days old, but the pot above them still holds its stew, gone to mould. They left between one hour and the next.',
      'Scratched on the door-post in the runes of the Mark: "TO EDORAS. THE WHITE HAND RIDES BY NIGHT."',
    ],
    exits: [
      { direction: 'west', targetRoomId: 'eastemnet-plains' },
    ],
    items: ['warg-pelt', 'mead-of-the-mark'],
    gridX: 2,
    gridY: 1,
  },

  'entwade-ford': {
    id: 'entwade-ford',
    name: 'The Entwade',
    description: 'The Entwash runs broad and shallow here over gravel banks — the Entwade, the great crossing of the East-mark, where the herds have forded since Eorl was young. Willows lean over the water, and the river talks quietly to itself as it goes. It is a peaceful place, and the peace feels borrowed.',
    lookDetails: [
      'The far bank is churned with crossing-tracks: horses southward in great numbers, and after them, days later, the splayed prints of wargs following at leisure.',
      'A rider\'s green cloak-pin lies in the shallows, bright among the stones. The riders of the Mark do not shed their gear willingly.',
    ],
    exits: [
      { direction: 'north', targetRoomId: 'eastemnet-plains' },
      { direction: 'west', targetRoomId: 'burned-homestead' },
      { direction: 'south', targetRoomId: 'westemnet-plains' },
    ],
    waypoint: true,
    waypointLabel: 'The Entwade',
    gridX: 1,
    gridY: 2,
  },

  'burned-homestead': {
    id: 'burned-homestead',
    name: 'The Burned Homestead',
    description: 'A farmstead of the Mark stands in ruin — barn and hall and byre all burned to black bones, the thatch gone, the paddock fences pulled down. The fire is days old but the smell of it still hangs bitter over the yard. Wild-haired men in hides pick through the wreckage for anything the flames spared: Dunlendings, come down from their hills to loot behind Saruman\'s wolves.',
    clearedDescription: 'The raiders lie among the ruin they came to strip. The burned hall keeps its silence, and crows settle back onto the blackened roof-beams, grumbling.',
    lookDetails: [
      'The door of the hall bears a mark daubed in white clay: a hand, five-fingered, palm out. This was not a raid for plunder. It was a message.',
      'The folk who lived here got out — the paddock gate stands open and the horse-tracks run south, ahead of the fire. Small mercy, but mercy.',
    ],
    exits: [
      { direction: 'east', targetRoomId: 'entwade-ford' },
    ],
    enemies: [
      { enemyId: 'dunlending-raider', count: 2 },
    ],
    items: ['mead-of-the-mark', 'gold-coins'],
    gridX: 0,
    gridY: 2,
  },

  'westemnet-plains': {
    id: 'westemnet-plains',
    name: 'The Westemnet',
    description: 'The grass runs on toward the White Mountains, so near now that you can see the green skirts of their foothills and the dark clefts between. But the plain here is scarred — wheeling tracks, trampled circles, a broken spear upright in the turf like a grave-mark. Skirmishes have been fought on this ground, and the Mark did not win all of them.',
    clearedDescription: 'The skirmishers of the White Hand trouble this stretch of the Westemnet no longer. The broken spear still stands in the turf, but now it reads less like a warning and more like a promise kept.',
    lookDetails: [
      'The dead were carried off the field, but the turf remembers: dark stains, a shattered shield-boss painted green and white, a warg\'s carcass the crows have nearly finished.',
      'From the top of the next rise you catch it at last — far south, a golden spark against the mountain-shadow. The sun on a roof of gold. Meduseld.',
    ],
    exits: [
      { direction: 'north', targetRoomId: 'entwade-ford' },
      { direction: 'east', targetRoomId: 'uruk-trail' },
      { direction: 'south', targetRoomId: 'snowbourn-crossing' },
    ],
    enemies: [
      { enemyId: 'warg-rider', count: 1 },
      { enemyId: 'dunlending-raider', count: 1 },
    ],
    gridX: 1,
    gridY: 3,
  },

  'uruk-trail': {
    id: 'uruk-trail',
    name: 'The Uruk Trail',
    description: 'A broad track of ruin cuts east across the grass — turf ripped by iron-shod feet marching in step, no horse among them. Orcs do not march in daylight and in ranks; these did. Ahead, where the trail fords a gully, great shapes in black mail move against the grass with the arrogance of soldiers in conquered country. Uruks of the White Hand, scouting the Mark for their master.',
    clearedDescription: 'The uruk scouts lie where they fell, the white hands on their shields turned up to the sky. Their trail runs back west toward Isengard — and someone there will mark that this patrol does not return.',
    lookDetails: [
      'The uruks\' gear is new-forged, unweathered — mail, blades, marching-boots, all out of the same furnaces within the year. Isengard is not raiding. Isengard is arming.',
      'Each black shield bears the same device, painted fresh: a white hand, open, palm outward. The badge of Saruman.',
    ],
    exits: [
      { direction: 'west', targetRoomId: 'westemnet-plains' },
    ],
    enemies: [
      { enemyId: 'uruk-scout', count: 2 },
    ],
    items: ['white-hand-orders'],
    gridX: 2,
    gridY: 3,
  },

  'snowbourn-crossing': {
    id: 'snowbourn-crossing',
    name: 'The Snowbourn Crossing',
    description: 'The mountain-cold Snowbourn comes down white from the vale of Harrowdale, and the Edoras road fords it here — or would, if the ford were open. A burned wain has been dragged across the crossing as a barricade, and behind it stands a towering uruk in black plate, a white hand painted across his iron mask: a war-captain of Isengard, holding the door to Edoras with a picked guard. He sees you, and hefts a blade like a slab of night.',
    clearedDescription: 'The war-captain of the White Hand lies broken beside his barricade, and the Snowbourn runs on past him, unimpressed, toward gentler country. The road to Edoras stands open.',
    lookDetails: [
      'The captain\'s barricade was built to stop riders, not to hide behind. He was not afraid of being found. He was the trap.',
      'Among the guard\'s baggage: rope, irons, and an empty grain-cart. They were not sent to burn Edoras. They were sent to starve it — and to take prisoners.',
    ],
    exits: [
      { direction: 'north', targetRoomId: 'westemnet-plains' },
      {
        direction: 'south',
        targetRoomId: 'edoras-road',
        blockedUntilCleared: true,
        lockMessage: 'The uruk war-captain bars the ford, his guard at his shoulder. The road to Edoras will not open while he stands.',
      },
    ],
    enemies: [
      { enemyId: 'uruk-war-captain', count: 1 },
      { enemyId: 'uruk-pikeman', count: 1 },
    ],
    items: ['horn-of-the-mark', 'gold-coins'],
    gridX: 1,
    gridY: 4,
  },

  'edoras-road': {
    id: 'edoras-road',
    name: 'The Barrowfield Road',
    description: 'The road climbs toward Edoras between two long lines of green mounds, each crowned white with small starred flowers — the barrows of the kings of the Mark, nine on the west side and seven on the east. The flowers are simbelmynë, evermind, that blooms in all seasons where dead men rest. The wind moves down the lines of mounds like a slow procession.',
    lookDetails: [
      'Sixteen mounds for sixteen kings, from Eorl the Young to the father of the king that now sits in Meduseld. The grass on the newest is not yet thick.',
      'The simbelmynë grows nowhere else on the plain — only on the barrows, white as snow, white as memory. No hand plants it. It simply knows.',
    ],
    exits: [
      { direction: 'north', targetRoomId: 'snowbourn-crossing' },
      { direction: 'south', targetRoomId: 'edoras-gates' },
    ],
    events: [
      {
        id: 'simbelmyne-barrows',
        once: true,
        effect: {
          type: 'narration',
          lines: [
            { text: 'You walk between the barrows of the kings, where simbelmynë blooms thick as snowfall. Even the wind seems to lower its voice here.' },
          ],
        },
      },
    ],
    gridX: 1,
    gridY: 5,
  },

  'edoras-gates': {
    id: 'edoras-gates',
    name: 'The Gates of Edoras',
    description: 'Edoras rises before you on its lonely green hill, ringed by a dike and a wall of timber, the Snowbourn curling about its feet. The great gates stand shut and watched — spears glint on the wall, and hard eyes follow you up the road. Above the whole hill, high at its crown, a roof of gold catches the sun: Meduseld, the hall of the kings of the Mark.',
    lookDetails: [
      'The gate-wardens are too few for a wall this long, and too young or too grey. The strength of Edoras is stretched thin across a burning Mark.',
      'Carved into the gate-posts, worn by generations of hands: rearing horses, manes flying, and runes that read "WESTU HÁL" — be thou well.',
    ],
    exits: [
      { direction: 'north', targetRoomId: 'edoras-road' },
      { direction: 'south', targetRoomId: 'winding-street' },
    ],
    waypoint: true,
    waypointLabel: 'Edoras',
    gridX: 1,
    gridY: 6,
  },

  'winding-street': {
    id: 'winding-street',
    name: 'The Winding Street',
    description: 'A paved way climbs the hill of Edoras in long switchbacks, past houses of dark timber with carved horse-head gables. A clear stream runs chattering down a stone channel beside the street, crossed by little bridges at every turn. Women watch from doorways and children stare from behind rain-barrels; strangers are rare in the Mark now, and rarely good news.',
    lookDetails: [
      'The channel-stream is the Snowbourn\'s child, led down from a spring above the hall. In siege, Edoras would not thirst — and the folk here speak of siege as "when", not "if".',
      'Every third house stands shuttered, its folk fled in from the burned westfold farms and packed in with kin. Edoras is fuller than it looks, and hungrier.',
    ],
    exits: [
      { direction: 'north', targetRoomId: 'edoras-gates' },
      { direction: 'west', targetRoomId: 'edoras-smithy' },
      { direction: 'south', targetRoomId: 'meduseld' },
    ],
    gridX: 1,
    gridY: 7,
  },

  'edoras-smithy': {
    id: 'edoras-smithy',
    name: 'The Smithy of Edoras',
    description: 'A long open forge-house rings with hammer-blows halfway up the hill, its eaves hung with bridle-bits, spearheads, and rings of mail like iron fish-scale. Eadric the smith works bare-armed at the anvil, grey-bearded and broad as a door, drawing out a sword-blade with strokes that fall as steady as a walking horse. The work of the Mark is in everything here: horse and rider, made one in steel.',
    lookDetails: [
      'A rack by the door holds finished swords, each hilt wound with green leather and stamped with a running horse. Riders\' blades, waiting for riders who have not come back to claim them.',
      'The forge burns day and night now, by the king\'s word. Eadric\'s two apprentices sleep in shifts beside the bellows.',
    ],
    exits: [
      { direction: 'east', targetRoomId: 'winding-street' },
    ],
    craftingStation: true,
    gridX: 0,
    gridY: 7,
  },

  'meduseld': {
    id: 'meduseld',
    name: 'Meduseld, the Golden Hall',
    description: 'The Golden Hall stands at the hill\'s crown, its pillars carved and gilded, its roof of gold bright even under cloud. Within, the floor is paved in many-coloured stone and the walls hung with woven histories of the Mark — Eorl on white Felaróf, riding out of the North to the Field of Celebrant. On the dais at the hall\'s end sits Theoden King, white-haired but straight-backed, a drawn sword across his knees. Here, behind the last wall of the Mark, there is warmth, and rest, and counsel.',
    lookDetails: [
      'The greatest tapestry shows a young man on a white horse, blowing a great horn as he rides — Eorl the Young, coming to Gondor\'s aid unlooked-for. The hall was built on that one ride, and on the oath that followed it.',
      'The hearth in the hall\'s heart is never allowed to die. An old custom: while the fire of Meduseld burns, the Mark endures. Someone tends it every hour, war or peace.',
    ],
    exits: [
      { direction: 'north', targetRoomId: 'winding-street' },
      { direction: 'east', targetRoomId: 'golden-hall-terrace' },
    ],
    events: [
      {
        id: 'the-kings-peace',
        once: true,
        effect: {
          type: 'status-effect',
          effectId: 'blessed',
          message: 'The warmth of the Golden Hall settles into your bones — the fire, the mead, the woven histories of a people who do not yield. You feel your heart lifted and your hand steadied.',
        },
      },
    ],
    gridX: 1,
    gridY: 8,
  },

  'golden-hall-terrace': {
    id: 'golden-hall-terrace',
    name: 'The Terrace of Meduseld',
    description: 'A broad stone terrace runs along the eastern face of the Golden Hall, and from its parapet all the Mark lies open — the Snowbourn silver below, the plains running north and east to the edge of sight, and westward, under a smear of distant smoke, the road to Isengard. The kings of Rohan have stood here for five hundred years and watched their land. The watching is heavier now.',
    lookDetails: [
      'From here the burned farms of the Westemnet show as small black scars on the green — a dozen at least, in a rough line pointing at Edoras like an arrow drawn on a map.',
      'A weathered stone seat stands at the parapet\'s end, its arms carved as horse-heads bowed to drink. The Doorward says no one sits in it but the king; the king, he says, has not sat in it since the burnings began.',
    ],
    exits: [
      { direction: 'west', targetRoomId: 'meduseld' },
    ],
    gridX: 2,
    gridY: 8,
  },
}

export const rohanEnemies: Record<string, Enemy> = {
  'warg-rider': {
    id: 'warg-rider',
    name: 'Warg-rider',
    description: 'A goblin of Isengard mounted on a great grey warg, wolf and rider moving as one beast with two sets of teeth. It circles at a lope, spear couched, looking for your back.',
    hp: 35,
    maxHp: 35,
    ac: 15,
    abilities: { str: 15, dex: 16, con: 14, int: 8, wis: 11, cha: 7 },
    attackBonus: 6,
    damage: '1d10+3',
    xpReward: 150,
    lootTable: ['warg-pelt'],
  },
  'dunlending-raider': {
    id: 'dunlending-raider',
    name: 'Dunlending Raider',
    description: 'A wild hillman of Dunland in hides and stolen mail, a long axe in his fists and five hundred years of grudge behind it. Saruman\'s whispers have given the old hatred a new master.',
    hp: 30,
    maxHp: 30,
    ac: 14,
    abilities: { str: 16, dex: 12, con: 15, int: 10, wis: 9, cha: 8 },
    attackBonus: 5,
    damage: '1d8+2',
    xpReward: 120,
    lootTable: ['gold-coins'],
  },
  'uruk-scout': {
    id: 'uruk-scout',
    name: 'Uruk Scout',
    description: 'A great orc-soldier of Isengard, man-high and heavy-boned, in black mail with a white hand painted on the shield. It does not cringe from the daylight as lesser orcs do. It marches in it.',
    hp: 38,
    maxHp: 38,
    ac: 16,
    abilities: { str: 17, dex: 13, con: 16, int: 10, wis: 10, cha: 7 },
    attackBonus: 6,
    damage: '1d10+2',
    xpReward: 160,
    lootTable: ['mead-of-the-mark'],
  },
  'uruk-pikeman': {
    id: 'uruk-pikeman',
    name: 'Uruk Pikeman',
    description: 'A veteran uruk of the White Hand behind a pike twice its own height, planted and level. It holds its ground with the patience of a wall, and strikes with the reach of a lance.',
    hp: 48,
    maxHp: 48,
    ac: 17,
    abilities: { str: 18, dex: 11, con: 17, int: 9, wis: 11, cha: 6 },
    attackBonus: 7,
    damage: '1d12+3',
    xpReward: 250,
    lootTable: ['healing-potion'],
  },
  'uruk-war-captain': {
    id: 'uruk-war-captain',
    name: 'Uruk War-captain of the White Hand',
    description: 'A captain of Isengard\'s new breed, towering in black plate, its iron mask painted with a white hand. It fights like a siege-engine given hate: unhurried, unstoppable, certain. Saruman made this thing to break kingdoms.',
    hp: 90,
    maxHp: 90,
    ac: 17,
    abilities: { str: 19, dex: 12, con: 18, int: 12, wis: 11, cha: 10 },
    attackBonus: 8,
    damage: '2d8+4',
    xpReward: 850,
    lootTable: ['greater-healing-potion'],
  },
}

export const rohanItems: Record<string, Item> = {
  'rohirric-longsword': {
    id: 'rohirric-longsword',
    name: 'Rohirric Longsword',
    description: 'A long straight sword of the Mark, hilt wound in green leather and pommel stamped with a running horse. Forged for a rider\'s reach and a rider\'s arm; on foot, it is simply a great deal of very good sword. (2d6+2, +1 to hit)',
    type: 'weapon',
    damage: '2d6+2',
    attackBonus: 1,
    value: 120,
  },
  'rider-mail': {
    id: 'rider-mail',
    name: 'Rider\'s Mail of the Mark',
    description: 'A knee-length hauberk of riveted rings in the fashion of the Riddermark, light enough to ride in and proof against worse than it looks. The smiths of Edoras have made these for twenty generations of riders. (+5 AC)',
    type: 'armor',
    armorBonus: 5,
    value: 140,
  },
  'horn-of-the-mark': {
    id: 'horn-of-the-mark',
    name: 'Horn of the Mark',
    description: 'A great horn of silver-bound ox-horn, graven with riders at full gallop — the signal-horn of an éored of the Westemnet, taken as a trophy by the White Hand. Its voice belongs on the wind of the Mark, not in an uruk\'s baggage.',
    type: 'quest',
    value: 0,
  },
  'mead-of-the-mark': {
    id: 'mead-of-the-mark',
    name: 'Mead of the Mark',
    description: 'A stoppered flask of golden mead from the king\'s own benches, honey-strong and warming as a hearth. The riders drink it before a charge, and after the ones they survive. (Heals 2d4+2)',
    type: 'potion',
    healing: '2d4+2',
    consumable: true,
    value: 15,
  },
  'warg-pelt': {
    id: 'warg-pelt',
    name: 'Warg Pelt',
    description: 'The grey-black pelt of an Isengard warg, coarse and heavy as a winter blanket. Ill-omened, but the furriers of Edoras pay well for proof of a dead warg.',
    type: 'misc',
    value: 25,
  },
  'white-hand-orders': {
    id: 'white-hand-orders',
    name: 'Orders of the White Hand',
    description: 'A packet of orders in a crabbed black script, sealed with a white hand pressed in wax, taken from an uruk scout. What little you can read is enough: numbers, musters, and the names of lands far north of Rohan. Isengard\'s war is wider than the Mark.',
    type: 'quest',
    value: 0,
  },
}

export const rohanNPCs: Record<string, NPC> = {
  'hama': {
    id: 'hama',
    name: 'Hama the Doorward',
    description: 'Doorward of Theoden King, tall and grave in the green and white of the royal guard, his spear held with the ease of long years. His eyes have counted every stranger on the road since the burnings began.',
    dialogue: [
      '"Stay, stranger! None pass the gates of Edoras unquestioned in these days — the Mark is burning, and not every traveller on the king\'s road wishes the king well."',
      '"Yet you come up the north road alive, and that road has eaten better-armed folk than you this season. Warg-riders on the Eastemnet, hillmen at the farms, and worse at the Snowbourn ford."',
      '"If you have done the Mark a service, go up and tell it to the king himself. Theoden King sits in Meduseld at the hill\'s crown. Speak truth in that hall — the walls are old, and they know the sound of lies."',
    ],
  },
  'theoden': {
    id: 'theoden',
    name: 'Theoden, King of the Mark',
    description: 'Theoden son of Thengel, Lord of the Riddermark, white-haired in a great carved chair with a drawn sword across his knees. Age sits on him, but so does steel; his eyes are the eyes of a man watching his house burn slowly, and refusing to look away.',
    dialogue: [
      '"Westu hál, stranger. You find the Golden Hall in a grey season. Saruman the White — Saruman, whom we counted a friend — sends wolves and wild men and his new-bred orcs against my people, and my riders are too few to be everywhere the Mark bleeds."',
      '"You have seen it yourself: the burned steadings, the White Hand daubed on my folk\'s doors. He tests us. He counts our spears. And when he has counted, he will come in earnest."',
      '"Hear my counsel, if you will carry nothing else from this hall: Isengard\'s ambition does not end at the Mark. The Wise must be told what wakes in the west — the elven lords still keep counsel in the north, in Imladris. Word must reach them, by a messenger wolves cannot catch."',
      '"Rest by my fire. Eat from my board. The Mark has little enough to give in these days, but what Meduseld has is yours — that custom, at least, no wizard shall burn."',
    ],
    questReward: {
      itemId: 'mead-of-the-mark',
      message: 'Theoden signs to a hall-servant, who brings you a flask of golden mead. "The king\'s cup, for the road. Drink it in a dark hour, and remember the Mark."',
    },
  },
  'eadric': {
    id: 'eadric',
    name: 'Eadric the Smith',
    description: 'Master smith of Edoras, grey-bearded, broad as a barn door, forearms like rolled mail. He sizes you up the way he would a bar of iron: what it is, and what it could be made into.',
    dialogue: [
      '"A sword-bearer, and not one of ours. Well, the forge doesn\'t care where you were foaled — steel\'s steel, and the Mark needs every blade that points the right way."',
      '"The king has me working day and night, and still I can\'t arm them fast enough. Rider\'s mail, blades of the Mark — the best work south of the dwarf-roads, and I\'ll hear no argument on it."',
      '"I\'ll buy as well: pelts, salvage, orc-iron for the scrap-heap. And if you\'ve coin, buy the good mail. The wargs out there don\'t care how brave you are, only how thick your rings run."',
    ],
    tradeOffers: [
      { itemId: 'rohirric-longsword', cost: 120 },
      { itemId: 'rider-mail', cost: 140 },
      { itemId: 'mead-of-the-mark', cost: 15 },
      { itemId: 'healing-potion', cost: 12 },
      { itemId: 'greater-healing-potion', cost: 30 },
    ],
  },
}

export const rohanRoomNPCs: Record<string, string[]> = {
  'edoras-gates': ['hama'],
  'meduseld': ['theoden'],
  'edoras-smithy': ['eadric'],
}

export const rohanQuests: Record<string, Quest> = {
  'riders-of-the-mark': {
    id: 'riders-of-the-mark',
    name: 'Riders of the Mark',
    description: 'The Riddermark burns behind you and empties ahead. Ride the north road south to Edoras, win past the doorward, and bring what you have seen to Theoden King in the Golden Hall.',
    regionId: 'rohan',
    giver: 'the road south',
    start: { type: 'enter-room', target: 'wold-road' },
    startLog: 'The Mark lies open before you, wide and unquiet. Whatever burns on this land, the answer to it sits under a golden roof at Edoras. Ride south.',
    stages: [
      {
        objective: 'Cross the Riddermark to the gates of Edoras',
        trigger: { type: 'enter-room', target: 'edoras-gates' },
        completionLog: 'Edoras at last — timber walls, watchful spears, and above it all the golden roof of Meduseld. But the gates of the Mark do not open to strangers unquestioned.',
      },
      {
        objective: 'Answer Hama the Doorward at the gates',
        trigger: { type: 'talk-npc', target: 'hama' },
        completionLog: 'The Doorward hears you out, and at last stands aside. "Go up, then. The king should hear this from the mouth that saw it."',
      },
      {
        objective: 'Seek the counsel of Theoden King in Meduseld',
        trigger: { type: 'talk-npc', target: 'theoden' },
        completionLog: 'The king hears your tale to its end, and the hall is very quiet. "So it begins," he says softly. "Westu hál, stranger. The Mark counts you a friend this day."',
      },
    ],
    rewards: { xp: 400, gold: 50 },
  },

  'wolves-of-isengard': {
    id: 'wolves-of-isengard',
    name: 'Wolves of Isengard',
    description: 'Warg-riders of the White Hand range the Eastemnet unchallenged, running off the herds and hunting the herdsmen. The Mark\'s riders are stretched too thin to answer. You are not.',
    regionId: 'rohan',
    giver: 'the empty plains',
    start: { type: 'enter-room', target: 'eastemnet-plains' },
    startLog: 'Warg-sign is thick on the Eastemnet, and the herds and herdsmen are gone or fled. Isengard\'s wolves hunt the Mark as if it were already theirs. Teach them otherwise.',
    stages: [
      {
        objective: 'Slay the warg-riders that hunt the Riddermark',
        trigger: { type: 'kill-enemy', target: 'warg-rider', count: 3 },
        completionLog: 'The last warg falls and its rider with it. The plains lie quiet — and somewhere in Isengard, a patrol will be marked missing on a wizard\'s ledger.',
      },
    ],
    rewards: { xp: 300, gold: 40 },
  },

  'shadow-of-the-white-hand': {
    id: 'shadow-of-the-white-hand',
    name: 'The Shadow of the White Hand',
    description: 'Saruman\'s hand is open upon Rohan — burned steadings, uruk scouts marching by daylight, a war-captain squatting on the Edoras road. Break the White Hand\'s grip on the Mark, then carry warning north: the Wise must know that Isengard has turned, and Elrond of Rivendell keeps the oldest counsel of all.',
    regionId: 'rohan',
    giver: 'a white hand on a burned door',
    start: { type: 'enter-room', target: 'burned-homestead' },
    startLog: 'The white hand daubed on the burned hall-door is no raider\'s whim — it is a signature. Saruman of Isengard makes open war on Rohan, and the world beyond the Mark does not yet know it.',
    stages: [
      {
        objective: 'Slay the uruk war-captain and break the White Hand\'s hold on the Snowbourn crossing',
        trigger: { type: 'clear-room', target: 'snowbourn-crossing' },
        completionLog: 'The war-captain of the White Hand lies broken at the ford. But Isengard breeds more where it came from — and the Wise beyond the Mark still count Saruman a friend. That must end. Carry word north to Elrond in Rivendell.',
      },
      {
        objective: 'Carry warning of Isengard\'s treachery to Elrond in Rivendell',
        trigger: { type: 'talk-npc', target: 'elrond' },
        completionLog: 'Elrond hears your tidings in silence, and for a long moment his grey eyes look at something very far away. "Saruman. That is heavy news, and I fear it is true news. You have done a greater service than you know, carrying it — the White Council must be summoned, and swiftly."',
      },
    ],
    rewards: { xp: 600, gold: 75 },
  },

  'the-lost-horn': {
    id: 'the-lost-horn',
    name: 'The Horn of the Westemnet',
    description: 'Among the war-captain\'s plunder at the Snowbourn lies a silver-bound signal-horn of the Mark — the horn of a fallen éored, carried off as a trophy. Such a thing belongs in the king\'s hall, not in orc-baggage.',
    regionId: 'rohan',
    start: { type: 'take-item', target: 'horn-of-the-mark' },
    startLog: 'The great horn is heavier than it looks, and colder — the horn of an éored that will not muster again. Theoden King should have it, and the names of the men who bore it.',
    stages: [
      {
        objective: 'Bear the Horn of the Mark to Theoden King in Meduseld',
        trigger: { type: 'talk-npc', target: 'theoden' },
        completionLog: 'Theoden takes the horn in both hands and is silent a long while. "The third éored of the Westemnet," he says at last. "It will hang in Meduseld, and its name will be remembered. The Mark does not forget its debts — nor its friends."',
      },
    ],
    rewards: { xp: 250, gold: 60 },
  },
}
