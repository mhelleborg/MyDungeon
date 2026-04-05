import type { Room } from '../types/room'
import type { RoomInteraction } from './roomInteractions'

export const lothlorienRooms: Record<string, Room> = {
  'dimrill-dale': {
    id: 'dimrill-dale',
    name: 'Dimrill Dale',
    description:
      'Sunlight pours over the green slopes of Dimrill Dale. Below, the Mirrormere catches the sky like a silver shield. The air is sharp and clean after the suffocating dark of Moria. Behind you the East Gate yawns — you do not look back. To the south, the Silverlode winds toward distant golden trees.',
    lookDetails: [
      'In the Mirrormere below you catch a reflection that is not your own — the Crown of Durin, seven stars arranged in a ring, shimmering as Durin himself saw it at the beginning of days.',
      'Carved into the gate\'s outer frame: "Here ends the Long Dark. Step into the light and remember those who delved in joy."',
    ],
    exits: [
      { direction: 'south', targetRoomId: 'silver-river-ford' },
    ],
    items: ['moria-chronicle'],
    gridX: 4,
    gridY: 0,
  },

  'silver-river-ford': {
    id: 'silver-river-ford',
    name: 'The Ford of the Silverlode',
    description:
      'The Silverlode — Celebrant in the Elven tongue — runs bright and cold over a bed of pale stones. The ford is shallow here, the water rising no higher than your knees, and the current sings as it passes. Wildflowers grow thick on both banks. To the south, the sound of falling water draws you on.',
    lookDetails: [
      'The pale stones beneath the water are not natural — they were laid here by elven hands, a hidden road for those who know the crossing.',
      'A grey heron stands motionless on the far bank, regarding you with one golden eye. It does not flee as you approach. The wild things of this land know no fear of travelers.',
    ],
    exits: [
      { direction: 'north', targetRoomId: 'dimrill-dale' },
      { direction: 'south', targetRoomId: 'nimrodel-stream' },
    ],
    gridX: 4,
    gridY: 1,
  },

  'nimrodel-stream': {
    id: 'nimrodel-stream',
    name: 'The Stream of Nimrodel',
    description:
      'A clear stream tumbles over mossy stones, its voice carrying a melody that is almost — but not quite — a song. This is Nimrodel, named for the Elven-maid who loved it above all things. The water is cold as starlight and sweet as the first morning of spring. Golden leaves drift on its surface, carried from the great trees to the west.',
    lookDetails: [
      'You kneel and cup the water. It is impossibly cold and clear — you can see every grain of sand on the stream bed, twenty feet below what you thought was the bottom.',
      'Scratched into a stone at the water\'s edge, in faded Tengwar: the opening verse of Nimrodel\'s song. A fragment of something beautiful and lost.',
    ],
    exits: [
      { direction: 'north', targetRoomId: 'silver-river-ford' },
      { direction: 'west', targetRoomId: 'forest-edge' },
    ],
    items: ['nimrodel-fragment-1'],
    gridX: 4,
    gridY: 2,
  },

  'forest-edge': {
    id: 'forest-edge',
    name: 'The Edge of the Golden Wood',
    description:
      'The first mallorn trees rise before you — vast silver trunks crowned with gold, their leaves catching the light like ten thousand candle flames. The air is thick with the scent of living things: sap and earth and something sweeter, almost like memory. This is the border of Lothlórien. Beyond lies the heart of the Elven realm, guarded and ancient.',
    lookDetails: [
      'A rope ladder hangs from the nearest mallorn, leading to a wooden platform — a talan — fifty feet above. The Galadhrim watch from above, though you cannot see them.',
      'The bark of the mallorns is smooth and silver, warm to the touch. When you press your palm against it, you feel a faint pulse — the heartbeat of the forest itself.',
    ],
    exits: [
      { direction: 'east', targetRoomId: 'nimrodel-stream' },
      { direction: 'west', targetRoomId: 'outer-wood' },
      { direction: 'south', targetRoomId: 'orc-ambush-site' },
    ],
    gridX: 3,
    gridY: 2,
  },

  'orc-ambush-site': {
    id: 'orc-ambush-site',
    name: 'The Ambush Clearing',
    description:
      'A clearing among the mallorns, scarred by recent violence. Orc tracks score the earth — a pursuit party from Moria, following your trail through Dimrill Dale. Black-feathered arrows jut from the tree trunks. The scouts have found you.',
    clearedDescription:
      'The clearing is quiet now. Orc bodies lie among the golden leaves, already being reclaimed by the forest. The mallorns will heal what the orcs scarred.',
    lookDetails: [
      'The orc tracks come from the northeast — they skirted the Silverlode and came through the foothills. Disciplined, for orcs.',
      'Among the fallen, one orc still breathes. Its eyes track your movement with hate — but also fear.',
    ],
    exits: [
      { direction: 'north', targetRoomId: 'forest-edge' },
      { direction: 'south', targetRoomId: 'sentinel-tree' },
    ],
    enemies: [
      { enemyId: 'orc-scout', count: 2 },
    ],
    gridX: 3,
    gridY: 3,
  },

  'outer-wood': {
    id: 'outer-wood',
    name: 'The Outer Wood',
    description:
      'Deep among the mallorn trees, golden light filters through the canopy in shafts and columns. The silence here is not the silence of emptiness but of listening — the wood is aware of you. Leaves fall in slow spirals, catching the light, and do not decay where they land. Time moves differently beneath these boughs.',
    lookDetails: [
      'A pattern of lichen on a mallorn trunk resolves, as you look closer, into an elven face in profile — ancient art, grown into the living wood over centuries.',
      'The ground beneath your feet is soft with gold leaf but firm underneath. Elven paths wind between the trees, visible only to those who look with patience.',
    ],
    exits: [
      { direction: 'east', targetRoomId: 'forest-edge' },
      { direction: 'west', targetRoomId: 'inner-wood' },
      { direction: 'north', targetRoomId: 'spider-hollow' },
    ],
    gridX: 2,
    gridY: 2,
  },

  'spider-hollow': {
    id: 'spider-hollow',
    name: 'The Spider Hollow',
    description:
      'The golden light fails here. Dense webs hang between the trunks like grey curtains, and the air carries the sour smell of venom. A great spider of Mirkwood\'s darker reaches has nested in this hollow — black and bloated, its many eyes catching what little light remains. The mallorns nearby are withered, their bark scarred by the creature\'s acid.',
    clearedDescription:
      'The webs hang limp and empty. The great spider lies curled in death, its legs drawn inward. Already the mallorns seem to breathe easier, their leaves stirring in a wind that was not there before.',
    lookDetails: [
      'The webs are thick enough to walk on, if you dared. Cocooned shapes hang from the canopy — deer, perhaps, or something larger.',
    ],
    exits: [
      { direction: 'south', targetRoomId: 'outer-wood' },
    ],
    enemies: [
      { enemyId: 'mirkwood-spider', count: 1 },
    ],
    dark: true,
    gridX: 2,
    gridY: 1,
  },

  'inner-wood': {
    id: 'inner-wood',
    name: 'The Inner Wood',
    description:
      'The heart of Lothlórien\'s outer ring. The mallorns here are ancient beyond reckoning, their trunks wider than houses, their crowns lost in a golden haze far above. No sound of the outside world reaches here — not wind, not birdsong, not even your own footsteps on the soft golden carpet. The peace is absolute and a little unnerving.',
    lookDetails: [
      'Something glimmers in the canopy far above — lanterns? Stars? The light of Lothlórien plays tricks on mortal eyes.',
      'A carved stone bench sits between two mallorn roots, smooth and warm. It looks as though someone left it here yesterday, though it has weathered a thousand springs.',
    ],
    exits: [
      { direction: 'east', targetRoomId: 'outer-wood' },
      { direction: 'south', targetRoomId: 'nimrodel-falls' },
      { direction: 'west', targetRoomId: 'great-mallorn' },
    ],
    gridX: 1,
    gridY: 2,
  },

  'nimrodel-falls': {
    id: 'nimrodel-falls',
    name: 'The Falls of Nimrodel',
    description:
      'The stream cascades over a shelf of moss-covered stone into a clear pool, its voice rising and falling in cadences that mirror speech. Mist drifts through the clearing, catching the golden light and scattering it into tiny rainbows. This is where Nimrodel herself was said to bathe, in the years before the shadow fell on Moria. The place feels haunted — not by malice, but by grief.',
    lookDetails: [
      'Behind the falls, half-hidden by the curtain of water, you glimpse a shallow cave in the rock — and carved into its wall, another verse of the ancient song.',
      'The pool at the base of the falls is perfectly still where the current does not touch it. Your reflection stares back at you, but older, sadder, wiser.',
    ],
    exits: [
      { direction: 'north', targetRoomId: 'inner-wood' },
      { direction: 'south', targetRoomId: 'cerin-amroth' },
    ],
    items: ['nimrodel-fragment-2'],
    gridX: 1,
    gridY: 3,
  },

  'great-mallorn': {
    id: 'great-mallorn',
    name: 'The Great Mallorn',
    description:
      'The largest mallorn in the outer wood stands alone in a clearing, its trunk thirty feet across, its roots spreading like the fingers of an open hand across the forest floor. The tree is alive in a way that other trees are not — aware, watchful, patient. Its bark is warm silver, its leaves catch the light and hold it, and in the silence you hear something that might be breathing.',
    lookDetails: [
      'Carved into the bark at eye level, in a script that is part Khuzdul and part Tengwar: a single word. The writing is ancient, from a time when Elves and Dwarves were friends.',
      'High in the canopy, a great eagle\'s nest sits in the fork of two massive branches. The nest is empty, but recently used — a single bronze feather lies on the ground below.',
    ],
    exits: [
      { direction: 'east', targetRoomId: 'inner-wood' },
      { direction: 'south', targetRoomId: 'north-stair' },
    ],
    gridX: 0,
    gridY: 2,
  },

  'north-stair': {
    id: 'north-stair',
    name: 'The North Stair',
    description:
      'Wooden stairs spiral upward around a great mallorn trunk, their treads worn smooth by elven feet. Rope rails of grey hithlain are strung between carved posts. The stairs lead up to a broad talan — an elven platform — where lamplight glows warm and golden. Below, the forest floor is carpeted in gold.',
    lookDetails: [
      'The craftsmanship of the stairs is exquisite — no nails, no joints, just wood shaped to fit wood so perfectly that it might have grown this way.',
      'From the talan above you hear the sound of someone working — the rhythmic tap of a small hammer on metal, and the faint hiss of quenching.',
    ],
    exits: [
      { direction: 'north', targetRoomId: 'great-mallorn' },
      { direction: 'south', targetRoomId: 'caras-galadhon-gate' },
    ],
    gridX: 0,
    gridY: 3,
  },

  'caras-galadhon-gate': {
    id: 'caras-galadhon-gate',
    name: 'The Gates of Caras Galadhon',
    description:
      'Two great mallorns stand as living gateposts, their branches woven overhead into an arch of golden leaves. Between them, a gate of silver-grey wood stands open — but guarded. A Galadhrim warden stands at the post, bow across his back, eyes measuring. Beyond the gate, lamplight gleams through the canopy, and you hear distant singing.',
    lookDetails: [
      'The gate is carved with images of the Two Trees of Valinor — Telperion and Laurelin — their branches intertwined. Silver and gold, woven together.',
      'The warden wears a brooch of green and silver at his throat — a leaf of the mallorn. You notice other wardens in the canopy above, perfectly still.',
    ],
    exits: [
      { direction: 'north', targetRoomId: 'north-stair' },
      { direction: 'west', targetRoomId: 'cerin-amroth' },
    ],
    gridX: 0,
    gridY: 4,
  },

  'cerin-amroth': {
    id: 'cerin-amroth',
    name: 'Cerin Amroth',
    description:
      'You stand upon the mound of Cerin Amroth, the heart of the ancient realm. A double ring of trees encircles the hill — silver-barked niphredil within, and golden elanor without. The grass beneath your feet is green even in winter, starred with small flowers of white and gold. The light here is that of a summer evening that never fades.',
    lookDetails: [
      'At the crown of the mound, a single great mallorn rises — taller and more stately than any other. It was here that Amroth, King of Lórien, last looked upon Nimrodel before they were parted forever.',
      'The flowers at your feet — elanor and niphredil — bloom here and nowhere else in Middle-earth. They glow faintly in the twilight, as if remembering the light of the Two Trees.',
    ],
    exits: [
      { direction: 'north', targetRoomId: 'nimrodel-falls' },
      { direction: 'east', targetRoomId: 'sentinel-tree' },
      { direction: 'west', targetRoomId: 'caras-galadhon-gate' },
      { direction: 'south', targetRoomId: 'celeborn-hall' },
    ],
    items: ['nimrodel-fragment-3'],
    gridX: 1,
    gridY: 4,
  },

  'sentinel-tree': {
    id: 'sentinel-tree',
    name: 'The Sentinel Tree',
    description:
      'A great mallorn stands on a hill at the eastern border of the inner wood, its talan serving as a watchtower. From the platform high above, the wardens of Lórien keep vigil over the approaches from Moria and the Brown Lands. The view from below is breathtaking — you can see the Misty Mountains blue and distant to the east.',
    lookDetails: [
      'Signal flags hang from the talan rails — a system of colored pennants for communicating across the forest canopy. The Galadhrim have their own semaphore.',
      'Notched into the trunk at shoulder height: tally marks in groups of five. A warden\'s count of orc incursions. There are many hundreds.',
    ],
    exits: [
      { direction: 'north', targetRoomId: 'orc-ambush-site' },
      { direction: 'west', targetRoomId: 'cerin-amroth' },
    ],
    gridX: 2,
    gridY: 4,
  },

  'celeborn-hall': {
    id: 'celeborn-hall',
    name: 'The Hall of Celeborn',
    description:
      'A great flet built high in the crown of the mightiest mallorn of Caras Galadhon. The floor is of smooth grey wood, the walls are open to the sky, and silver lamps hang from the branches overhead. Lord Celeborn\'s seat stands at the far end — a chair of living wood that has grown from the tree itself. The hall is both grand and intimate, as elven spaces always are.',
    lookDetails: [
      'The silver lamps burn with no flame — each holds a captured star-glimmer, cold and bright and eternal. The light they cast has no shadow.',
      'Maps and scrolls are arrayed on a great table nearby — the defense of Lothlórien against the growing shadow. Pins mark orc movements, patrol routes, the position of every warden.',
    ],
    exits: [
      { direction: 'north', targetRoomId: 'cerin-amroth' },
      { direction: 'east', targetRoomId: 'galadriel-bower' },
      { direction: 'west', targetRoomId: 'mirror-room' },
      { direction: 'south', targetRoomId: 'farewell-lawn' },
    ],
    gridX: 1,
    gridY: 5,
  },

  'galadriel-bower': {
    id: 'galadriel-bower',
    name: "Galadriel's Bower",
    description:
      'A private garden on a flet woven from living branches, open to the stars. White flowers bloom here that bloom nowhere else — and the air carries a fragrance that makes you think of home, though you cannot say why. A single chair of white wood faces east, toward Mordor. The Lady of Light sits here in the watches of the night and looks upon the shadow.',
    lookDetails: [
      'On a small table beside the chair, a ring of mithril set with a white stone catches the lamplight. Nenya, the Ring of Adamant — one of the Three.',
      'The flowers in Galadriel\'s bower are simbelmynë — "evermind" — the same white blooms that grow on the graves of the Kings of Rohan. Here they grow in life, not death.',
    ],
    exits: [
      { direction: 'west', targetRoomId: 'celeborn-hall' },
    ],
    gridX: 2,
    gridY: 5,
  },

  'mirror-room': {
    id: 'mirror-room',
    name: 'The Mirror of Galadriel',
    description:
      'A low garden enclosed by living hedges, lit by silver lamps. At its center stands a pedestal of carved stone, and upon it a wide, shallow basin of silver. A ewer of water sits beside it. This is the Mirror of Galadriel — it shows things that were, things that are, and some things that have not yet come to pass.',
    lookDetails: [
      'The basin is empty until filled. The water in the ewer catches the lamplight and throws strange reflections on the hedges — shapes that move when you are still.',
      'You notice that the hedges are not trimmed but shaped by years of patient tending. Each leaf has been guided into place. The patience required is almost incomprehensible.',
    ],
    exits: [
      { direction: 'east', targetRoomId: 'celeborn-hall' },
    ],
    gridX: 0,
    gridY: 5,
  },

  'farewell-lawn': {
    id: 'farewell-lawn',
    name: 'The Farewell Lawn',
    description:
      'A wide green lawn beside the Silverlode, where the Company rests before the road ahead. Grey boats of elven make are drawn up on the bank, their keels shaped like leaves. Bundles of provisions are stacked neatly on the grass — lembas bread, elven rope, cloaks of the Galadhrim. The time of departure has come. The golden wood will not hold you forever.',
    lookDetails: [
      'The boats are of light grey wood, smooth as glass and light as cork. They are shaped without nails or rivets — elven craft beyond the skill of mortal shipwrights.',
      'Galadriel stands at the water\'s edge, her silver hair unbound. She does not speak, but her eyes hold the weight of all the ages she has lived. She is saying goodbye to more than you.',
    ],
    exits: [
      { direction: 'north', targetRoomId: 'celeborn-hall' },
    ],
    gridX: 1,
    gridY: 6,
  },
}

/** Room interactions for Lothlórien rooms */
export const lothlorienRoomInteractions: Record<string, RoomInteraction[]> = {}
