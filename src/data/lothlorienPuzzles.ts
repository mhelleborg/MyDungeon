import type { Puzzle } from '../types/puzzle'

export const lothlorienPuzzles: Record<string, Puzzle> = {
  'nimrodel-song': {
    id: 'nimrodel-song',
    roomId: 'nimrodel-falls',
    description:
      'The falls of Nimrodel cascade over mossy stone into a clear pool. You sense that if the fragments of her song were sung together here, at the very place she once loved, something would answer.',
    type: 'keyword',
    solution: 'nimrodel',
    hint:
      'Three fragments of the ancient lay are known to those who listen in this wood — seek Rúmil in the talan, the vision in the grove, and the song carried on the river. When you have all three, speak her name here.',
    successMessage:
      'The words rise in your throat unbidden — all three verses, woven together. The pool stirs. The mist parts. A path you did not see before opens through the undergrowth to the east, winding deep into the oldest part of the wood.',
    failureMessage:
      'You speak the name quietly, but nothing answers. You feel the fragments you carry are incomplete — or perhaps this is not the right word.',
    reward: {
      revealExit: { direction: 'east', targetRoomId: 'hidden-path' },
      message: 'A hidden path has opened to the east!',
    },
  },

  'mellyrn-runes': {
    id: 'mellyrn-runes',
    roomId: 'mellyrn-grove',
    description:
      'Carved into the bark of the oldest mallorn — a tree fifteen hundred years old if the grain can be believed — are runes in a script you almost recognise. Part Khuzdul, part Tengwar, part something older. It looks like a door-sign. Or a question.',
    type: 'keyword',
    solution: 'friend',
    hint:
      'Halbarad studied these marks and said: "Old Khuzdul, I think — dwarves and elves were close here once, before Celebrimbor\'s betrayal." Rúmil told you: "It is the oldest word in the covenant between our peoples." Dwarves carved it so that an elf would always find it — or an elf so a dwarf would. The word is the same in either tongue.',
    successMessage:
      'You speak the word and the oldest mallorn shivers from root to crown, leaves raining gold. A section of bark rotates inward, revealing a gap behind the tree just wide enough to pass through. The secret archive of the wood lies beyond.',
    failureMessage:
      'The tree does not respond. The word was not right, or not spoken with the right intent.',
    reward: {
      revealExit: { direction: 'east', targetRoomId: 'secret-archive' },
      message: 'The ancient mallorn reveals a hidden passage to the east — the secret archive!',
    },
  },

  'caras-gate-pass': {
    id: 'caras-gate-pass',
    roomId: 'caras-gates',
    description:
      'The gates of Caras Galadhon are carved from living mallorn wood and banded in mithril. A warden stands at the post, neither hostile nor welcoming. "I must ask the password of all who enter Caras Galadhon, stranger. Without it, you may not pass."',
    type: 'keyword',
    solution: 'lothlórien',
    hint:
      'Haldir gave you counsel before you parted: "In Caras Galadhon the gates answer to the name of the city itself — spoken not as a stranger but as one who belongs here. Say it as though you have always lived beneath the mallorns." Rúmil added: "Say it in Sindarin, as we do."',
    successMessage:
      'The warden studies you for a long moment, then steps aside. "Well spoken. Enter, guest of Caras Galadhon." The great gates swing inward on silent hinges.',
    failureMessage:
      'The warden shakes his head. "That is not the word. I cannot let you pass without it."',
    reward: {
      revealExit: { direction: 'south', targetRoomId: 'celeborn-hall' },
      message: 'The gates of Caras Galadhon open before you.',
    },
  },

  'celebrant-riddle': {
    id: 'celebrant-riddle',
    roomId: 'eithel-celebrant',
    description:
      'At the source of the Celebrant a flat stone rises from the water, and on it is inscribed a riddle in three languages — Khuzdul, Sindarin, and Westron. The Westron reads: "I am the maker of all maps and the breaker of all bridges. I wear a thousand faces and remember none of them. Kings crown themselves in me, but I give no crowns. What am I?"',
    type: 'riddle',
    solution: 'water',
    hint:
      'The Celebrant begins here as a trickle from the rock face — clean and cold. Maps of rivers are drawn upon me. Bridges span me. Kings see themselves when they look into me. What carries a reflection but holds no shape of its own?',
    successMessage:
      'The stone sinks into the pool and comes up again — on its underside is a recess holding a fragment of an ancient song. You tuck it carefully away. The water is grateful, somehow.',
    failureMessage:
      'The inscribed stone floats immovable. The Celebrant does not yield its secrets to that answer.',
    reward: {
      itemIds: ['nimrodel-fragment-2'],
      message: 'A Song Fragment (Middle) — hidden beneath the stone at the source of the Celebrant.',
    },
  },
}

/** Map of room IDs to puzzle IDs */
export const lothlorienRoomPuzzles: Record<string, string[]> = {
  'nimrodel-falls': ['nimrodel-song'],
  'mellyrn-grove': ['mellyrn-runes'],
  'caras-gates': ['caras-gate-pass'],
  'eithel-celebrant': ['celebrant-riddle'],
}
