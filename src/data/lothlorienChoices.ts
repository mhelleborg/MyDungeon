import type { Choice } from '../types/choice'

export const lothlorienChoices: Record<string, Choice> = {
  'haldir-blindfold': {
    id: 'haldir-blindfold',
    name: 'Haldir\'s Condition',
    description:
      'Haldir of Lórien steps from the shadows of the mellyrn, bow drawn. Behind him, two others materialize from the branches above — you never saw them. "You have trespassed upon the borders of Lothlórien. Only one path leads you forward, and it has a price." He produces a grey cloth. "You will be blindfolded before we lead you to Caras Galadhon. This is the law of the Lady — no stranger learns the paths through the heart of the wood unbidden. Will you accept?"',
    options: [
      {
        id: 'accept',
        label: 'Accept the Blindfold',
        description:
          'Lower your head and accept the cloth. Haldir\'s respect is plain, however unexpressed. You will be led safely through the forest to Caras Galadhon.',
      },
      {
        id: 'invoke-elanor',
        label: 'Invoke Elanor\'s Name',
        description:
          'Speak the name of Elanor of Lothlórien and ask her to vouch for you. (Only available if Elanor is in your company.)',
      },
      {
        id: 'refuse',
        label: 'Refuse the Blindfold',
        description:
          'Stand your ground. You are no prisoner. Haldir\'s eyes harden — he cannot let you pass, but he will not attack unless provoked.',
      },
    ],
    roomId: 'haldir-post',
  },

  'celeborn-dilemma': {
    id: 'celeborn-dilemma',
    name: 'Celeborn\'s Question',
    description:
      'Lord Celeborn regards you across the great hall of Caras Galadhon, silver-haired and ancient, his eyes older than the trees outside. "You have come from Moria. You have seen what we have not — what Balin\'s colony found, what the dark holds now." He leans forward. "The world will ask what you know. Sauron\'s servants will seek out this knowledge. The dwarven clans will hunger for it. What will you tell them, when you emerge from the Golden Wood?"',
    options: [
      {
        id: 'truth',
        label: 'Tell the Truth',
        description:
          'You will report what you found honestly: the colony failed, the Balrog woke, Moria cannot be reclaimed — not yet. Better the world mourn with open eyes than be lured to its death.',
      },
      {
        id: 'silence',
        label: 'Keep Silence',
        description:
          'Say nothing of what you found. The knowledge of Moria\'s state is too dangerous. Some truths are better buried in the dark with those who died there.',
      },
      {
        id: 'hope',
        label: 'Speak of Hope',
        description:
          'Tell the dwarven clans that Moria can be reclaimed — but not yet, not alone. Plant a seed of hope rather than despair. Perhaps, with the right alliance, one day...',
      },
    ],
    roomId: 'celeborn-hall',
  },

  'mirror-choice': {
    id: 'mirror-choice',
    name: 'The Mirror of Galadriel',
    description:
      'The basin of silver water lies still before you, catching starlight and the gleam of Galadriel\'s ring. Her voice is soft: "Many things I can show you: things that were, and things that are, and things that yet may be. But the Mirror shows not what will be, only what might. Even the wisest cannot always tell." She watches you. "The question is not what you will see — but what you will do with the seeing. Look, if you dare. Or step back. The choice is yours."',
    options: [
      {
        id: 'look-companions',
        label: 'Look for Your Companions',
        description:
          'Ask the Mirror to show you those you have lost — those who fell in the dark of Moria. What became of them matters to you more than any prophecy.',
      },
      {
        id: 'look-future',
        label: 'Look to the Future',
        description:
          'Ask to see what lies ahead — the war, the Ring, the fate of Middle-earth. You entered this wood seeking answers. The Mirror may provide them.',
      },
      {
        id: 'step-back',
        label: 'Step Back from the Mirror',
        description:
          '"I have seen enough darkness," you say. "I will face what comes without the Mirror\'s counsel." Galadriel\'s eyes soften. Perhaps this is wisdom. Perhaps it is fear. Perhaps the difference does not matter.',
      },
    ],
    roomId: 'mirror-room',
  },

  'galadriel-ring': {
    id: 'galadriel-ring',
    name: 'Galadriel\'s Offer',
    description:
      'In the deep silence of the bower, Galadriel turns to face you fully. Nenya glints on her finger — three gemstones catching light that has no source. Her voice is very quiet: "There is a war coming, and I cannot face it alone. Every ally matters. Will you stand with me against the Dark Lord? I cannot promise you victory — only purpose, and the knowledge that you chose the harder path." A pause. "There is another way, if you refuse. Leave Lothlórien with the gifts I have prepared. Go where the road takes you. Live your life. That is no small thing."',
    options: [
      {
        id: 'pledge',
        label: 'Pledge Your Aid',
        description:
          'You have come through Moria. You have faced the Balrog. You know what darkness looks like, and you know it must be fought. You pledge yourself to Galadriel\'s cause.',
      },
      {
        id: 'return-home',
        label: 'Choose Your Own Path',
        description:
          'This is not your war to choose — or perhaps it is, but not from Lothlórien. You will take the gifts Galadriel offers and go where your feet lead you. The road is long and the world is wide.',
      },
    ],
    roomId: 'galdriel-bower',
  },
}
