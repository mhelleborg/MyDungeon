import type { Choice } from '../types/choice'

export const choices: Record<string, Choice> = {
  'wounded-goblin': {
    id: 'wounded-goblin',
    name: 'The Wounded Goblin',
    description:
      'Among the fallen goblins, one still lives. It drags itself toward you, whimpering, one leg bent at a terrible angle. It raises a clawed hand — not to strike, but to plead. "No kill! No kill! Grishnak knows things... Grishnak can help tall-one. Give Grishnak medicine, and Grishnak tells big-orcs to leave tall-one alone. Grishnak promises!"',
    options: [
      {
        id: 'mercy',
        label: 'Show Mercy',
        description:
          'Give Grishnak a healing potion. He will warn the orcs in the lair ahead to stand down. (Costs 1 Healing Potion)',
      },
      {
        id: 'kill',
        label: 'End Its Suffering',
        description:
          'A quick death is more than most goblins would grant you. Put the creature out of its misery.',
      },
      {
        id: 'ignore',
        label: 'Walk Away',
        description:
          'This is not your concern. Leave the goblin to its fate and press on.',
      },
    ],
    roomId: 'goblin-tunnels',
  },

  'oris-knowledge': {
    id: 'oris-knowledge',
    name: "Ori's Forbidden Knowledge",
    description:
      'The shade of Ori flickers and grows brighter. "There is... one more thing I can offer you, living one. The knowledge of the deep places — battle-lore the dwarves learned fighting nameless things in the dark. It will make you deadly. But such knowledge was never meant for mortal minds. It will consume part of you — your vitality, your very life-force. The choice is yours."',
    options: [
      {
        id: 'accept',
        label: 'Accept the Knowledge',
        description:
          'Gain Ori\'s battle-lore: +2 attack bonus permanently. But the forbidden knowledge burns away part of your life force — lose 6 maximum HP.',
      },
      {
        id: 'refuse',
        label: 'Decline Respectfully',
        description:
          'Refuse the dark knowledge. Ori respects your wisdom and grants a blessing of protection instead: +1 AC permanently.',
      },
    ],
    roomId: 'chamber-of-records',
  },

  'sealed-vault': {
    id: 'sealed-vault',
    name: 'The Sealed Vault',
    description:
      'Behind the irregular stonework in the mining shaft, your fingers find a hidden seam — a sealed vault door, dwarven-made, with runes of warning etched around its frame. Through a crack you glimpse something glinting within: a crystal flask of Miruvor, the cordial of Imladris. But the warning runes are clear: "SEALED BY ORDER OF DURIN. WHAT SLEEPS BEYOND, LET NONE WAKE." Opening this vault may disturb things best left undisturbed.',
    options: [
      {
        id: 'open',
        label: 'Break the Seal',
        description:
          'Force the vault open and claim the Miruvor. But the noise and released energy may alert enemies deeper in the mines.',
      },
      {
        id: 'leave',
        label: 'Heed the Warning',
        description:
          'The dwarves sealed this for a reason. Leave it be and trust their wisdom.',
      },
    ],
    roomId: 'mining-shaft',
  },

  'bridge-sacrifice': {
    id: 'bridge-sacrifice',
    name: 'The Bridge Sacrifice',
    description: '', // Set dynamically based on companion name
    options: [
      {
        id: 'sacrifice',
        label: 'Accept Their Sacrifice',
        description:
          'Your companion will charge the Balrog, buying you precious time — but they will not survive.',
      },
      {
        id: 'refuse',
        label: 'Refuse — Fight Together',
        description:
          'You will not let another die for you. Stand together against the darkness.',
      },
    ],
    roomId: 'bridge-of-khazad-dum',
  },
}
