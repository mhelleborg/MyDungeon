import type { Room } from '../types/room'
import type { Enemy } from '../types/character'
import type { Item } from '../types/item'
import type { NPC } from '../types/npc'
import type { Quest } from '../types/quest'

/**
 * Rivendell & the Eriador Road — a level 1–3 prologue region.
 * A safe elven hub (shops, counsel, healing) and the wild road south
 * through the Trollshaws and Hollin to the West-gate of Moria.
 */

export const rivendellRooms: Record<string, Room> = {
  'rivendell-courtyard': {
    id: 'rivendell-courtyard',
    name: 'The Courtyard of Rivendell',
    description: 'You stand in the heart of Imladris, the Last Homely House east of the Sea. Waterfalls veil the valley walls in silver, and the air itself seems to hum with old songs. Elves pass quietly beneath carved archways, and lanterns glow among the trees though it is day. Here, for a while, there is peace.',
    lookDetails: [
      'The valley holds the light strangely — evening seems always golden here, and morning always fresh. Time runs differently in the house of Elrond.',
      'A carved stone bench by the fountain bears initials in Westron: "B.B." Some hobbit sat here once, writing.',
    ],
    exits: [
      { direction: 'north', targetRoomId: 'last-homely-house' },
      { direction: 'west', targetRoomId: 'rivendell-gardens' },
      { direction: 'east', targetRoomId: 'rivendell-forge' },
      { direction: 'south', targetRoomId: 'bruinen-ford' },
    ],
    waypoint: true,
    waypointLabel: 'Rivendell',
    gridX: 1,
    gridY: 1,
  },

  'last-homely-house': {
    id: 'last-homely-house',
    name: 'The Last Homely House',
    description: 'The great hall of Elrond Half-elven. Tall windows open onto the valley, and the walls are hung with tapestries older than kingdoms. Elrond himself stands by the hearth, grave and fair, his eyes grey as a clear evening. He regards you with the patience of one who has counselled ages of the world.',
    lookDetails: [
      'Above the hearth hangs a painting of a tall man fighting a great shadow — Isildur, perhaps, or Elendil. The shards of a broken sword rest on a shelf beneath it.',
      'The tapestries show the history of the Elder Days. In one corner, worked small, two trees shine silver and gold.',
    ],
    exits: [
      { direction: 'south', targetRoomId: 'rivendell-courtyard' },
      { direction: 'east', targetRoomId: 'hall-of-fire' },
      { direction: 'west', targetRoomId: 'elrond-library' },
    ],
    gridX: 1,
    gridY: 0,
  },

  'elrond-library': {
    id: 'elrond-library',
    name: 'The Library of Imladris',
    description: 'Shelves of ancient books and scrolls rise into shadow, smelling of vellum and cedar. Maps of lands that no longer exist are spread on reading tables. Erestor, chief of the counsellors of Elrond\'s house, looks up from a half-restored manuscript as you enter.',
    lookDetails: [
      'One open scroll shows the Walls of Moria drawn in silverpoint, with a note in Sindarin: "The Doors open only to the word of friendship."',
      'A locked glass case holds a single red book, its cover charred at one corner. You cannot read the title.',
    ],
    exits: [
      { direction: 'east', targetRoomId: 'last-homely-house' },
    ],
    gridX: 0,
    gridY: 0,
  },

  'hall-of-fire': {
    id: 'hall-of-fire',
    name: 'The Hall of Fire',
    description: 'A long hall where a great fire burns year-round in a carved hearth. There are no tables here, only benches and deep quiet. Elves sing softly in the shadows — songs of Eärendil, of stars, of the Sea. It is said those who linger here lose track of the hours, and do not mind.',
    lookDetails: [
      'The music never quite stops. When one singer falls silent, another takes up the thread, as if the song itself were older than any voice carrying it.',
      'By the fire, an ancient hobbit dozes in a chair too big for him, a notebook open on his knee. He mumbles a rhyme in his sleep and smiles.',
    ],
    exits: [
      { direction: 'west', targetRoomId: 'last-homely-house' },
    ],
    gridX: 2,
    gridY: 0,
  },

  'rivendell-gardens': {
    id: 'rivendell-gardens',
    name: 'The Gardens of Imladris',
    description: 'Terraced gardens descend toward the river in steps of green and silver. Athelas grows here in tended beds — kingsfoil, beloved of healers. The scent of it clears the mind like cold water.',
    lookDetails: [
      'The garden beds are laid out in the shapes of stars — the same seven-starred crown you will see again, though you do not know it yet, reflected in a dark mountain lake.',
      'A gardener\'s basket sits by the path, half-full of cuttings. The elves take only what the plants can spare.',
    ],
    exits: [
      { direction: 'east', targetRoomId: 'rivendell-courtyard' },
    ],
    items: ['athelas', 'athelas'],
    gridX: 0,
    gridY: 1,
  },

  'rivendell-forge': {
    id: 'rivendell-forge',
    name: 'The Forge of Rivendell',
    description: 'An open-sided smithy overlooking the falls, where the ring of hammers keeps time with the water. Camaen the smith works a blade over white coals — elven craft, patient and exact. Racks of finished work line the walls: swords, mail, tools of bright steel.',
    lookDetails: [
      'A sword lies on the central anvil in four pieces, ancient beyond guessing. It is laid out with reverence, like a body lying in state. The smiths do not touch it. Not yet.',
      'The quench-water is drawn from the Bruinen itself. Camaen claims the river remembers whose side it is on.',
    ],
    exits: [
      { direction: 'west', targetRoomId: 'rivendell-courtyard' },
    ],
    craftingStation: true,
    gridX: 2,
    gridY: 1,
  },

  'bruinen-ford': {
    id: 'bruinen-ford',
    name: 'The Ford of Bruinen',
    description: 'The river Bruinen runs swift and bright over the ford, the southern door of the hidden valley. Beyond the far bank the wild begins — the road climbs into the bare hills of the Trollshaws. The water seems to watch you as you cross.',
    lookDetails: [
      'Hoofprints are stamped deep in the bank mud — nine sets, inbound, ending at the water\'s edge. Nothing marks their leaving.',
      'When the light catches the rapids, the spray looks momentarily like white riders on white horses. A trick of the water. Probably.',
    ],
    exits: [
      { direction: 'north', targetRoomId: 'rivendell-courtyard' },
      { direction: 'south', targetRoomId: 'trollshaws-road' },
    ],
    gridX: 1,
    gridY: 2,
  },

  'trollshaws-road': {
    id: 'trollshaws-road',
    name: 'The Trollshaws',
    description: 'The road winds through bare, tumbled hills studded with gnarled trees and old crumbling towers. This is troll-country, and wolf-country too — their howls thread the wind. The bones of unlucky travellers lie in the bracken off the road.',
    clearedDescription: 'The road through the Trollshaws lies quiet. The wolves that hunted here will hunt no more, though the wind still carries distant howling from the high hills.',
    lookDetails: [
      'The ruined towers on the hilltops were built by men of a kingdom now forgotten — Rhudaur, the old maps call it. Nothing lives in them now but crows.',
      'Wolf tracks cross the road in numbers. They circle. Whatever the wolves fear at their backs, it keeps them close to the road.',
    ],
    exits: [
      { direction: 'north', targetRoomId: 'bruinen-ford' },
      { direction: 'west', targetRoomId: 'wolf-den' },
      { direction: 'east', targetRoomId: 'troll-clearing' },
      { direction: 'south', targetRoomId: 'weather-hills-road' },
    ],
    enemies: [
      { enemyId: 'wild-wolf', count: 2 },
    ],
    gridX: 1,
    gridY: 3,
  },

  'wolf-den': {
    id: 'wolf-den',
    name: 'The Wolf Den',
    description: 'A hollow beneath a fallen tower, rank with the smell of wet fur and old kills. Bones carpet the ground — deer, sheep, and worse. Yellow eyes gleam in the dark of the den, and a low growl rises from more than one throat.',
    clearedDescription: 'The den is silent now. Among the bones and refuse of the pack\'s kills, a few things of value glint — the belongings of travellers who did not reach Rivendell.',
    exits: [
      { direction: 'east', targetRoomId: 'trollshaws-road' },
    ],
    enemies: [
      { enemyId: 'wild-wolf', count: 2 },
      { enemyId: 'warg', count: 1 },
    ],
    items: ['wolf-pelt', 'healing-potion', 'gold-coins'],
    gridX: 0,
    gridY: 3,
  },

  'troll-clearing': {
    id: 'troll-clearing',
    name: 'The Stone Trolls',
    description: 'Three enormous trolls stand in a ring in the clearing — frozen mid-argument, stone from crown to heel, exactly as the sunrise caught them long ago. Birds nest in the crook of one\'s elbow. But the clearing is not empty: a living hill-troll, smaller and meaner than its petrified elders, roots through the old troll-hoard for anything its ancestors missed.',
    clearedDescription: 'The three stone trolls keep their eternal council, and now nothing living disputes the clearing with them. The scattered troll-hoard lies open for the taking.',
    lookDetails: [
      'Someone has carved initials and a date into the stooping troll\'s ankle, hobbit-high off the ground. The stone around the carving is worn smooth, as if often touched for luck.',
      'The old hoard was picked over long ago — a famous burglary, if the tales are true — but trolls bury deep, and not everything was found.',
    ],
    exits: [
      { direction: 'west', targetRoomId: 'trollshaws-road' },
    ],
    enemies: [
      { enemyId: 'hill-troll', count: 1 },
    ],
    items: ['trolls-purse', 'westernesse-dagger'],
    gridX: 2,
    gridY: 3,
  },

  'weather-hills-road': {
    id: 'weather-hills-road',
    name: 'The South Road',
    description: 'The road runs south along the feet of the Misty Mountains, through gorse and grey stone. The peaks stand at your left shoulder like a wall against the sky. Wargs hunt this stretch — the mountain goblins breed them, and they range far from their masters.',
    clearedDescription: 'The south road lies open, the warg-pack broken. The mountains keep their silent watch as you pass beneath them.',
    exits: [
      { direction: 'north', targetRoomId: 'trollshaws-road' },
      { direction: 'south', targetRoomId: 'eregion-ruins' },
    ],
    enemies: [
      { enemyId: 'warg', count: 1 },
      { enemyId: 'wild-wolf', count: 1 },
    ],
    gridX: 1,
    gridY: 4,
  },

  'eregion-ruins': {
    id: 'eregion-ruins',
    name: 'The Ruins of Eregion',
    description: 'Holly trees grow thick among tumbled walls of once-white stone — all that remains of Ost-in-Edhil, city of the elven-smiths, where the Rings of Power were forged and the world\'s ruin began. Goblin raiders from the mountains pick through the rubble, scattering when they think something watches, snarling when they think nothing does.',
    clearedDescription: 'The goblins lie still among the stones they defiled. The holly trees stir in the wind, and for a moment the ruins seem almost peaceful — a white city sleeping under green.',
    lookDetails: [
      'A doorstep of white stone bears a smith\'s mark: a star of many rays. The mark of the Gwaith-i-Mírdain, the People of the Jewel-smiths. Celebrimbor\'s folk worked here.',
      'Under a fallen lintel you find scorch marks older than the moss covering them. The city did not fall gently.',
    ],
    exits: [
      { direction: 'north', targetRoomId: 'weather-hills-road' },
      { direction: 'south', targetRoomId: 'sirannon-stream' },
    ],
    enemies: [
      { enemyId: 'goblin-raider', count: 2 },
    ],
    items: ['eregion-records'],
    gridX: 1,
    gridY: 5,
  },

  'sirannon-stream': {
    id: 'sirannon-stream',
    name: 'The Gate-stream',
    description: 'The old road follows the Sirannon, the Gate-stream — but the stream is nearly dry, a trickle in a stony bed where once a waterfall sang. Something has dammed the waters above. The silence where the falls should sound is unsettling, like a held breath.',
    lookDetails: [
      'The stream bed is choked with weed of a kind that should not grow in running water. Something changed this stream slowly, and on purpose.',
      'Old elf-runes on a waymarker point east: "To the Doors of Durin — speak, friends, and enter." Someone has scratched a newer warning beneath in Westron: "DON\'T TOUCH THE WATER."',
    ],
    exits: [
      { direction: 'north', targetRoomId: 'eregion-ruins' },
      { direction: 'east', targetRoomId: 'moria-west-approach' },
    ],
    gridX: 1,
    gridY: 6,
  },

  'moria-west-approach': {
    id: 'moria-west-approach',
    name: 'The Walls of Moria',
    description: 'The mountains close in, and a sheer cliff of grey stone rises before you — the Walls of Moria. Between two great holly trees, the cliff face is smooth and blank, waiting for moonlight to reveal what is written there. A dark, still lake has crept up over the old road, and nothing sings in it.',
    lookDetails: [
      'The lake was not on the old maps. The dammed Sirannon pooled here over long years, and the water is black as ink even at noon. Ripples cross it sometimes, against the wind.',
      'The holly trees are the sign of Eregion — planted to mark the border of the elf-country in the years of friendship between elves and dwarves. They alone remember it.',
    ],
    exits: [
      { direction: 'west', targetRoomId: 'sirannon-stream' },
      { direction: 'east', targetRoomId: 'gates-of-moria' },
    ],
    waypoint: true,
    waypointLabel: 'The Walls of Moria',
    events: [
      {
        id: 'reached-the-walls',
        once: true,
        effect: {
          type: 'narration',
          lines: [
            { text: 'You have reached the Walls of Moria. Beyond the Doors of Durin lies the long dark of Khazad-dûm.', logType: 'system' },
            { text: 'The still water of the lake lies between you and the doors. You do not like the look of it.' },
          ],
        },
      },
    ],
    gridX: 2,
    gridY: 6,
  },
}

export const rivendellEnemies: Record<string, Enemy> = {
  'wild-wolf': {
    id: 'wild-wolf',
    name: 'Wild Wolf',
    description: 'A lean grey wolf of the Trollshaws, ribs showing through winter fur. Hunger has made it bold.',
    hp: 8,
    maxHp: 8,
    ac: 12,
    abilities: { str: 12, dex: 15, con: 12, int: 3, wis: 12, cha: 6 },
    attackBonus: 3,
    damage: '1d6',
    xpReward: 20,
    lootTable: ['wolf-pelt'],
  },
  'warg': {
    id: 'warg',
    name: 'Warg',
    description: 'A great wolf of the mountains, goblin-bred for war — shoulders as high as a man\'s chest, and eyes with a wicked intelligence no natural wolf carries.',
    hp: 16,
    maxHp: 16,
    ac: 13,
    abilities: { str: 15, dex: 14, con: 14, int: 6, wis: 12, cha: 7 },
    attackBonus: 4,
    damage: '1d8+1',
    xpReward: 45,
    lootTable: ['wolf-pelt'],
  },
  'goblin-raider': {
    id: 'goblin-raider',
    name: 'Goblin Raider',
    description: 'A goblin of the Misty Mountains, far from its tunnels, jumpy in the open air. It carries a crude spear and a sack of stolen oddments.',
    hp: 9,
    maxHp: 9,
    ac: 12,
    abilities: { str: 10, dex: 14, con: 10, int: 8, wis: 8, cha: 6 },
    attackBonus: 3,
    damage: '1d6',
    xpReward: 25,
    lootTable: ['gold-coins'],
  },
  'hill-troll': {
    id: 'hill-troll',
    name: 'Hill-troll',
    description: 'A young hill-troll, grey-green and stinking, wise enough to fear the sun and stupid enough to be out this close to dawn. It hefts a club the size of a fence post.',
    hp: 40,
    maxHp: 40,
    ac: 14,
    abilities: { str: 18, dex: 8, con: 16, int: 5, wis: 7, cha: 5 },
    attackBonus: 5,
    damage: '1d10+3',
    xpReward: 180,
    lootTable: ['healing-potion'],
  },
}

export const rivendellItems: Record<string, Item> = {
  'athelas': {
    id: 'athelas',
    name: 'Athelas Leaf',
    description: 'Kingsfoil — a healing herb of the old kings. Crushed in the hand, its scent alone lifts the heart. (Heals 1d4+2)',
    type: 'potion',
    healing: '1d4+2',
    consumable: true,
    value: 8,
  },
  'wolf-pelt': {
    id: 'wolf-pelt',
    name: 'Wolf Pelt',
    description: 'A thick grey wolf pelt. Worth good coin to a trader — winters are long in Eriador.',
    type: 'misc',
    value: 12,
  },
  'trolls-purse': {
    id: 'trolls-purse',
    name: 'Troll\'s Purse',
    description: 'A rotting leather purse from the old troll-hoard, heavy with coins of forgotten kingdoms. Trolls\' purses are notorious — this one, mercifully, does not talk.',
    type: 'misc',
    value: 50,
  },
  'westernesse-dagger': {
    id: 'westernesse-dagger',
    name: 'Dagger of Westernesse',
    description: 'A long knife of the Dúnedain, wound with red and gold, its blade graven with serpent-runes. Forged in Arnor for the war against the Witch-king. (1d6+1, +1 to hit)',
    type: 'weapon',
    damage: '1d6+1',
    attackBonus: 1,
    value: 60,
  },
  'eregion-records': {
    id: 'eregion-records',
    name: 'Records of Eregion',
    description: 'A bundle of copper sheets etched with elvish script, recovered from the ruins of Ost-in-Edhil — smith-lore of the Gwaith-i-Mírdain, thought lost for an age.',
    type: 'quest',
    value: 0,
  },
}

export const rivendellNPCs: Record<string, NPC> = {
  'elrond': {
    id: 'elrond',
    name: 'Elrond Half-elven',
    description: 'Master of Rivendell, healer and loremaster, bearer of memories older than the kingdoms of men. His gaze weighs you kindly, and finds more than you show.',
    dialogue: [
      '"Welcome to Imladris, traveller. Few come to my house without need, and fewer still without a road waiting for them."',
      '"Your road runs south and east, through the Walls of Moria. I will not counsel that path lightly — the dwarves delved too deep, and woke what should have slept."',
      '"Take this. The road provides little, and the dark provides less. When your strength fails, remember that not all who wander are lost."',
      '"The Doors of Durin open to a single word. The inscription is a riddle, but a gentle one: speak, friend, and enter."',
    ],
    questReward: {
      itemId: 'miruvor',
      message: 'Elrond gives you a slim crystal flask. "Miruvor, the cordial of Imladris. Drink it when hope runs thin."',
    },
  },
  'erestor': {
    id: 'erestor',
    name: 'Erestor',
    description: 'Chief counsellor of the house of Elrond, a scholar with ink-stained fingers and the patience of centuries.',
    dialogue: [
      '"A traveller! Good. Books cannot carry themselves, and my knees are three thousand years old."',
      '"The records of Eregion — the smith-lore of Celebrimbor\'s people — were scattered when the city fell. Some sheets yet lie in the ruins south along your very road."',
      '"If your road takes you through Hollin, and you should find copper sheets among the stones... I would count their return a great service, and pay it as one."',
    ],
  },
  'camaen': {
    id: 'camaen',
    name: 'Camaen the Smith',
    description: 'An elven smith of Rivendell, sleeves rolled, forearms scarred with the small honest burns of the trade. His work is not showy. It simply does not fail.',
    dialogue: [
      '"Steel for the road? You\'ll want it. The Trollshaws have grown unfriendly, and Moria — well. Buy twice the potions you think you need."',
      '"Everything on these racks I made myself, and I\'ll stand behind every piece. Fair prices for those the Master welcomes."',
      '"I\'ll buy as well as sell — pelts, salvage, whatever the road yields. The valley trades little with the outside these days."',
    ],
    tradeOffers: [
      { itemId: 'longsword', cost: 18 },
      { itemId: 'leather-armor', cost: 15 },
      { itemId: 'chain-mail', cost: 35 },
      { itemId: 'healing-potion', cost: 12 },
      { itemId: 'athelas', cost: 8 },
      { itemId: 'torch', cost: 4 },
      { itemId: 'rope', cost: 20 },
    ],
  },
}

export const rivendellRoomNPCs: Record<string, string[]> = {
  'last-homely-house': ['elrond'],
  'elrond-library': ['erestor'],
  'rivendell-forge': ['camaen'],
}

export const rivendellQuests: Record<string, Quest> = {
  'road-to-moria': {
    id: 'road-to-moria',
    name: 'The Road to Moria',
    description: 'Your journey east must pass beneath the Misty Mountains, through the mines of Moria. Seek counsel in Rivendell, then take the old road south to the Walls.',
    regionId: 'rivendell',
    giver: 'the road itself',
    start: { type: 'enter-room', target: 'rivendell-courtyard' },
    startLog: 'Rivendell offers rest, but not for long — the mountains will not cross themselves. Seek the counsel of Master Elrond before you take the road.',
    stages: [
      {
        objective: 'Seek the counsel of Elrond in the Last Homely House',
        trigger: { type: 'talk-npc', target: 'elrond' },
        completionLog: 'Elrond\'s counsel settles over you like a cloak: the road is dark, but it is a road, and roads can be walked.',
      },
      {
        objective: 'Follow the old road south to the Walls of Moria',
        trigger: { type: 'enter-room', target: 'moria-west-approach' },
      },
      {
        objective: 'Enter Moria by the West-gate',
        trigger: { type: 'enter-room', target: 'gates-of-moria' },
        completionLog: 'The Doors of Durin close behind you. The road now runs through the dark.',
      },
    ],
    rewards: { xp: 150 },
  },

  'wolves-of-eriador': {
    id: 'wolves-of-eriador',
    name: 'Wolves of Eriador',
    description: 'The wolves of the Trollshaws have grown too bold, harrying travellers on the road to Rivendell. Thin the pack.',
    regionId: 'rivendell',
    giver: 'the wardens of the valley',
    start: { type: 'enter-room', target: 'trollshaws-road' },
    startLog: 'Wolf-sign is everywhere on the road — too much of it. The pack has stopped fearing travellers. It will have to be reminded.',
    stages: [
      {
        objective: 'Slay the wild wolves of the Trollshaws',
        trigger: { type: 'kill-enemy', target: 'wild-wolf', count: 4 },
        completionLog: 'The pack is broken. The survivors will keep to the high hills for a season or two.',
      },
    ],
    rewards: { xp: 120, gold: 25 },
  },

  'records-of-eregion': {
    id: 'records-of-eregion',
    name: 'The Records of Eregion',
    description: 'Erestor of Rivendell seeks the lost smith-lore of Ost-in-Edhil, scattered in the ruins of Hollin when the city fell.',
    regionId: 'rivendell',
    giver: 'Erestor',
    start: { type: 'talk-npc', target: 'erestor' },
    startLog: 'Erestor\'s request is simple enough: the ruins of Eregion lie on your road south. Bring back what lore the goblins have not yet melted down.',
    stages: [
      {
        objective: 'Recover the Records of Eregion from the ruins',
        trigger: { type: 'take-item', target: 'eregion-records' },
        completionLog: 'The copper sheets are heavier than they look — the weight of an age\'s lost craft.',
      },
      {
        objective: 'Return the records to Erestor in the library',
        trigger: { type: 'talk-npc', target: 'erestor' },
        completionLog: 'Erestor receives the sheets like a father receiving a lost child. "You have done the memory of Eregion a great service."',
      },
    ],
    rewards: { xp: 150, gold: 40 },
  },

  'the-long-road': {
    id: 'the-long-road',
    name: 'The Long Road',
    description: 'From the Last Homely House to the Golden Hall of Edoras — the whole breadth of the wild, under mountains and through forests. Few have walked it end to end.',
    regionId: 'rivendell',
    giver: 'the maps of Imladris',
    start: { type: 'enter-room', target: 'rivendell-courtyard' },
    stages: [
      {
        objective: 'Cross the Misty Mountains through Moria',
        trigger: { type: 'enter-room', target: 'east-gate' },
        completionLog: 'One mountain range lies behind you. The Long Road runs on.',
      },
      {
        objective: 'Reach Caras Galadhon in the Golden Wood',
        trigger: { type: 'enter-room', target: 'caras-galadhon-gate' },
        completionLog: 'The city of the Galadhrim glimmers above you. The Long Road runs on.',
      },
      {
        objective: 'Pass under the eaves of Fangorn Forest',
        trigger: { type: 'enter-room', target: 'fangorn-eaves' },
        completionLog: 'The oldest forest has let you through. The Long Road runs on.',
      },
      {
        objective: 'Come at last to the gates of Edoras',
        trigger: { type: 'enter-room', target: 'edoras-gates' },
        completionLog: 'The Golden Hall stands above you, and the road from Rivendell lies whole behind. Few living folk have walked its length — now you are one of them.',
      },
    ],
    rewards: { xp: 500, gold: 100 },
  },

  'hoard-of-the-trolls': {
    id: 'hoard-of-the-trolls',
    name: 'The Trolls\' Hoard',
    description: 'Three trolls turned to stone long ago in a clearing off the Trollshaws road — and trolls bury their gold deep. Not everything was found.',
    regionId: 'rivendell',
    start: { type: 'enter-room', target: 'troll-clearing' },
    stages: [
      {
        objective: 'Claim what remains of the troll-hoard',
        trigger: { type: 'take-item', target: 'trolls-purse' },
        completionLog: 'The purse is heavy with coins struck by kingdoms that no longer exist. Somewhere, an old burglar would approve.',
      },
    ],
    rewards: { xp: 80 },
  },
}
