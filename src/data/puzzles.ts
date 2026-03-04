import type { Puzzle } from '../types/puzzle'

export const puzzles: Record<string, Puzzle> = {
  'speak-friend': {
    id: 'speak-friend',
    roomId: 'gates-of-moria',
    description: 'The inscription above the doors glimmers: "Speak, friend, and enter." Perhaps the answer is simpler than it seems.',
    type: 'keyword',
    solution: 'mellon',
    hint: 'The Elvish word for "friend" is "mellon." The doors respond to Elvish speech.',
    successMessage: 'As you speak the word, a hidden passage grinds open in the cliff face beside the doors, revealing a chamber beyond!',
    failureMessage: 'Nothing happens. The ancient stone does not respond to that word.',
    reward: {
      revealExit: { direction: 'west', targetRoomId: 'hidden-shrine' },
      message: 'A hidden passage has been revealed to the west!',
    },
  },

  'forge-levers': {
    id: 'forge-levers',
    roomId: 'abandoned-forge',
    description: 'Three iron levers protrude from the wall behind the largest forge. Dwarven runes are carved above each one.',
    type: 'lever',
    solution: 'left right middle',
    hint: 'The runes read: "First the flame, then the water, last the hammer." The levers are marked with matching symbols — flame on the left, water on the right, hammer in the middle.',
    successMessage: 'The levers click into place and a hidden compartment groans open in the wall, revealing a stash of dwarven craftsmanship!',
    failureMessage: 'The levers grind but nothing happens. The sequence must be wrong. Examine the runes for a hint.',
    reward: {
      itemIds: ['plate-armor'],
      message: 'You find a magnificent suit of plate armor hidden in the compartment!',
    },
  },

  'gargoyle-riddle': {
    id: 'gargoyle-riddle',
    roomId: 'great-stairway',
    description: 'One of the gargoyles on the corbel overhead has eyes of polished obsidian that seem to follow you. Carved beneath it in flowing Khuzdul: "I have cities but no houses, mountains but no trees, water but no fish. What am I?"',
    type: 'riddle',
    solution: 'map',
    hint: 'Think of something that represents the world without being the world itself. Something a traveler carries...',
    successMessage: 'The gargoyle\'s stone jaws grind open and a magnificent sword clatters to the floor, its blade glowing faintly blue!',
    failureMessage: 'The gargoyle\'s obsidian eyes flash dully. That is not the answer.',
    reward: {
      itemIds: ['glamdring'],
      message: 'Glamdring, the Foe-hammer, falls from the gargoyle\'s jaws and clatters to the ground!',
    },
  },

  'stair-descent': {
    id: 'stair-descent',
    roomId: 'endless-stair-base',
    description: 'A ledge juts over the stair shaft. Something glints far below on a narrow outcrop — a weapon of dwarven make. You\'d need rope to reach it.',
    type: 'keyword',
    solution: 'rope',
    hint: 'You need rope to descend to the outcrop. Elven rope would be ideal — light and strong.',
    successMessage: 'You secure the rope to the ledge and lower yourself to the outcrop. Your hand closes around the haft of a magnificent warhammer!',
    failureMessage: 'You can\'t reach the outcrop without rope.',
    reward: {
      itemIds: ['dwarven-warhammer'],
      message: 'You haul yourself back up with a Dwarven Warhammer in hand!',
    },
  },

  'records-ward': {
    id: 'records-ward',
    roomId: 'crossroads',
    description: 'Runes above the northern door glow faintly: "Speak the name of the father of all dwarves, and the way shall open."',
    type: 'keyword',
    solution: 'durin',
    hint: 'The father of all dwarves — the first to awake beneath the stars. His name echoes through all the ages of Middle-earth.',
    successMessage: 'The runes blaze with golden light and you hear a heavy click from behind the door. An iron key materializes from the stonework and falls to the floor!',
    failureMessage: 'The runes dim. That is not the name.',
    reward: {
      itemIds: ['door-key'],
      message: 'An Iron Key falls from the stonework — a spare key to the Chamber of Records!',
    },
  },
}

/** Map of room IDs to puzzle IDs */
export const roomPuzzles: Record<string, string[]> = {
  'gates-of-moria': ['speak-friend'],
  'abandoned-forge': ['forge-levers'],
  'great-stairway': ['gargoyle-riddle'],
  'endless-stair-base': ['stair-descent'],
  'crossroads': ['records-ward'],
}
