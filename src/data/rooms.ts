import type { Room } from '../types/room'

export const STARTING_ROOM = 'gates-of-moria'

export const rooms: Record<string, Room> = {
  'gates-of-moria': {
    id: 'gates-of-moria',
    name: 'The Doors of Durin',
    description: 'Before you rise the legendary Doors of Durin, carved into the sheer face of the Misty Mountains. Holly trees stand sentinel on either side of the smooth cliff-face, and in the moonlight the Elvish inscription glimmers faintly: "Speak, friend, and enter." The doors stand open — something has already forced its way through. The dark beyond is absolute.',
    exits: [
      { direction: 'east', targetRoomId: 'entrance-hall' },
    ],
    items: ['torch'],
    gridX: 0,
    gridY: 4,
  },

  'watcher-pool': {
    id: 'watcher-pool',
    name: 'The Watcher\'s Pool',
    description: 'A vast, black pool stretches before the gates of Moria, its surface utterly still and lightless. The water has a faintly oily quality and smells of deep, dead places. Pale things drift just beneath the surface. Something enormous stirs in the depths — the Watcher has noticed you.',
    exits: [
      { direction: 'south', targetRoomId: 'gates-of-moria' },
    ],
    enemies: [
      { enemyId: 'watcher-tentacle', count: 2 },
    ],
    gridX: 0,
    gridY: 3,
  },

  'entrance-hall': {
    id: 'entrance-hall',
    name: 'The Entrance Hall',
    description: 'A crumbling entrance hall stretches before you, the air thick with the smell of dust and old death. Fallen masonry litters the floor and the carved pillars lean at dangerous angles. Dwarvish runes are chiseled above the lintel — a greeting to those who would enter Khazad-dum in better days. The darkness ahead swallows your torchlight.',
    exits: [
      { direction: 'west', targetRoomId: 'gates-of-moria' },
      { direction: 'east', targetRoomId: 'first-hall' },
      { direction: 'north', targetRoomId: 'great-stairway' },
    ],
    gridX: 1,
    gridY: 4,
  },

  'great-stairway': {
    id: 'great-stairway',
    name: 'The Great Stairway',
    description: 'Massive steps of black stone descend and rise before you, carved from the living rock by dwarven hands of immense skill. Each step is a yard wide and perfectly level despite centuries of disuse. Gargoyles of dwarvish craft leer down from corbels overhead, their stone faces lit by the dancing shadows of your torch. The stair reaches up into darkness above and leads down into the deeper halls.',
    exits: [
      { direction: 'south', targetRoomId: 'entrance-hall' },
      { direction: 'north', targetRoomId: 'crossroads' },
      { direction: 'east', targetRoomId: 'abandoned-forge' },
    ],
    gridX: 1,
    gridY: 3,
  },

  'first-hall': {
    id: 'first-hall',
    name: 'The First Hall',
    description: 'A wide hall opens before you, its soaring ceiling lost in darkness above. Broken pillars line the walls, their carved surfaces defaced by orcish blades. The floor is strewn with bones — dwarven bones, old and brittle. A foul smell hangs in the air: the unmistakable reek of goblins. Small shapes skitter at the edges of your torchlight.',
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
    description: 'The wide dwarven passages give way here to a warren of narrow tunnels, crudely hacked from the rock by goblin hands. The ceilings are low and the walls reek of filth and smoke. Scratched orcish runes and crude drawings cover every surface. The tunnels twist and branch in confusing ways, and the sound of distant drumming echoes through the stone.',
    exits: [
      { direction: 'west', targetRoomId: 'first-hall' },
      { direction: 'north', targetRoomId: 'guard-room' },
    ],
    enemies: [
      { enemyId: 'goblin', count: 2 },
      { enemyId: 'goblin-archer', count: 1 },
    ],
    gridX: 3,
    gridY: 4,
  },

  'guard-room': {
    id: 'guard-room',
    name: 'The Guard Room',
    description: 'An old dwarf guard post, its purpose long since perverted by its orcish occupants. Iron brackets on the walls once held torches; now only their rusty ghosts remain. A stone table still stands in the center, scarred and hacked. Against the far wall, tucked behind a collapsed rack of weapons, a serviceable coat of chain mail lies half-buried under rubble — someone hid it here, long ago.',
    exits: [
      { direction: 'south', targetRoomId: 'goblin-tunnels' },
      { direction: 'north', targetRoomId: 'orc-lair' },
      { direction: 'west', targetRoomId: 'abandoned-forge' },
    ],
    items: ['chain-mail'],
    gridX: 3,
    gridY: 3,
  },

  'crossroads': {
    id: 'crossroads',
    name: 'The Crossroads',
    description: 'Four great passages meet here at a perfectly square intersection, each carved with the precision and artistry of master masons. Carvings of dwarvish history run the full height of the walls — scenes of mining and feasting and battle, now defaced with orcish scratchings. At the center of the floor, a great compass rose has been inlaid in contrasting stone. Four roads lead onward into the dark.',
    exits: [
      { direction: 'north', targetRoomId: 'chamber-of-records' },
      { direction: 'south', targetRoomId: 'great-stairway' },
      { direction: 'east', targetRoomId: 'orc-lair' },
      { direction: 'west', targetRoomId: 'mining-shaft' },
    ],
    gridX: 2,
    gridY: 2,
  },

  'mining-shaft': {
    id: 'mining-shaft',
    name: 'The Mining Shaft',
    description: 'The passage opens onto a breathtaking vertical shaft sunk deep into the mountain\'s heart. Iron rungs are bolted to the wall, leading down into absolute blackness. The sound of dripping water echoes from immeasurable depths below and a faint, cold breeze rises from the abyss. Near the edge, a pouch of gold coins rests where some unlucky dwarf dropped it — perhaps in the very last moments of Moria\'s fall.',
    exits: [
      { direction: 'east', targetRoomId: 'crossroads' },
    ],
    items: ['gold-coins'],
    gridX: 1,
    gridY: 2,
  },

  'orc-lair': {
    id: 'orc-lair',
    name: 'The Orc Lair',
    description: 'A foul-smelling cavern that serves as a camp for a sizeable warband of Moria\'s orc garrison. Bones and the refuse of many meals litter the floor. Crude weapons are stacked against the walls and a smoldering fire pit fills the air with acrid smoke. The orcs here are not mere craven goblins — they are soldiers, scarred and seasoned. They watch your approach with cold, predatory eyes.',
    exits: [
      { direction: 'west', targetRoomId: 'crossroads' },
      { direction: 'north', targetRoomId: 'troll-den' },
    ],
    enemies: [
      { enemyId: 'orc-warrior', count: 2 },
      { enemyId: 'orc-captain', count: 1 },
    ],
    gridX: 3,
    gridY: 2,
  },

  'chamber-of-records': {
    id: 'chamber-of-records',
    name: 'The Chamber of Records',
    description: 'You stand in the Chamber of Records — Balin\'s tomb. A great rectangular slab of stone dominates the center of the room, carved with dwarvish runes: "HERE LIES BALIN, SON OF FUNDIN, LORD OF MORIA." Upon the tomb rests a single weathered book, its cover stained and its pages filled with desperate writing. This is the Book of Mazarbul. The final entry reads: "They are coming." The chamber is not empty. They have come again.',
    exits: [
      { direction: 'south', targetRoomId: 'crossroads' },
      { direction: 'east', targetRoomId: 'troll-den' },
      { direction: 'north', targetRoomId: 'endless-stair-base' },
    ],
    items: ['balin-tome'],
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
    exits: [
      { direction: 'east', targetRoomId: 'chamber-of-records' },
    ],
    dark: true,
    gridX: 1,
    gridY: 1,
  },

  'troll-den': {
    id: 'troll-den',
    name: 'The Troll\'s Den',
    description: 'A stinking, low-ceilinged cavern that reeks of rot and old meat. Gnawed bones — some alarmingly large — are heaped against the walls, and the floor is slicked with filth. In the far corner, curled around a pile of broken stone like a dog in its bed, a cave troll stirs. It is enormous, its grey skin like weathered stone, its small eyes blinking with dim, terrible intelligence. Amid the carnage, a stoppered flask glints in the darkness — a greater healing potion, perhaps plundered from some earlier victim.',
    exits: [
      { direction: 'west', targetRoomId: 'chamber-of-records' },
      { direction: 'south', targetRoomId: 'orc-lair' },
    ],
    enemies: [
      { enemyId: 'cave-troll', count: 1 },
    ],
    items: ['greater-healing-potion'],
    gridX: 3,
    gridY: 1,
  },

  'endless-stair-base': {
    id: 'endless-stair-base',
    name: 'The Base of the Endless Stair',
    description: 'The legendary Endless Stair of Khazad-dum begins here, spiraling in a single unbroken helix from the very foundations of the mountain to its peak, Zirakzigil. It is said that no dwarf ever counted all its steps. The carved stone of the first landing is worn smooth by uncounted generations of feet. The stair rises vertiginously upward into the mountain\'s heart, and the way east leads toward the Bridge and freedom.',
    exits: [
      { direction: 'south', targetRoomId: 'chamber-of-records' },
      { direction: 'east', targetRoomId: 'bridge-of-khazad-dum' },
    ],
    gridX: 2,
    gridY: 0,
  },

  'dimrill-gate-path': {
    id: 'dimrill-gate-path',
    name: 'The Path to Dimrill Gate',
    description: 'A passage hewn long ago as a secondary route toward the eastern gate. The dwarves who carved it are long dead and the torches that once lined its walls have burned to stubs centuries past. The darkness here is complete and disorienting — the kind of dark that presses against the eyes. Somewhere ahead, you can feel rather than hear the faintest breath of cold outside air.',
    exits: [
      { direction: 'east', targetRoomId: 'endless-stair-base' },
    ],
    dark: true,
    gridX: 1,
    gridY: 0,
  },

  'bridge-of-khazad-dum': {
    id: 'bridge-of-khazad-dum',
    name: 'The Bridge of Khazad-dum',
    description: 'The Bridge of Khazad-dum spans a chasm of bottomless darkness, a narrow arch of stone no more than five feet wide stretching over an abyss that plunges to the very roots of the world. The far side — and freedom — is maddeningly close. But the bridge is not unguarded. From the deep passages below, fire blooms. Shadow rises. A shape of terrible ancient power ascends toward the bridge, its wings spreading to fill the vault, its whip of flame trailing sparks. Durin\'s Bane has found you. The darkness between you and the gate belongs to it.',
    exits: [
      { direction: 'west', targetRoomId: 'endless-stair-base' },
    ],
    enemies: [
      { enemyId: 'balrog', count: 1 },
    ],
    gridX: 3,
    gridY: 0,
  },

  'east-gate': {
    id: 'east-gate',
    name: 'The East Gate — Dimrill Dale',
    description: 'Sunlight. Real, warm, golden sunlight pours through the great eastern gate of Moria and falls upon your face. You stagger out onto the steps of Dimrill Dale, gasping clean mountain air after the suffocating dark. Below you the Mirrormere catches the sky and the peaks of the Misty Mountains blaze in the afternoon sun. You have traversed Khazad-dum. The Fellowship would be proud. Behind you, the dark of Moria recedes — but you do not look back.',
    exits: [],
    gridX: 4,
    gridY: 0,
  },
}

export function getRoom(id: string): Room | undefined {
  return rooms[id]
}
