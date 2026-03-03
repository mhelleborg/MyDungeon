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
}

/** Map of room IDs to puzzle IDs */
export const roomPuzzles: Record<string, string[]> = {
  'gates-of-moria': ['speak-friend'],
  'abandoned-forge': ['forge-levers'],
}
