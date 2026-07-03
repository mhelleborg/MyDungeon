import type { Quest } from '../types/quest'

export const moriaQuests: Record<string, Quest> = {
  'crossing-of-moria': {
    id: 'crossing-of-moria',
    name: 'The Crossing of Moria',
    description: 'Pass through the ancient halls of Khazad-dûm and reach the East Gate alive.',
    regionId: 'moria',
    start: { type: 'enter-room', target: 'gates-of-moria' },
    startLog: 'The Doors of Durin stand open behind you. The only way out is through — east, across the whole of Khazad-dûm.',
    stages: [
      {
        objective: 'Reach the Bridge of Khazad-dûm',
        trigger: { type: 'enter-room', target: 'bridge-of-khazad-dum' },
        completionLog: 'The bridge. A single narrow span over the abyss — and something ancient stirring in the deep.',
      },
      {
        objective: 'Face Durin\'s Bane',
        trigger: { type: 'clear-room', target: 'bridge-of-khazad-dum' },
        completionLog: 'The way east lies open. The shadow and flame trouble this crossing no more.',
      },
      {
        objective: 'Escape through the East Gate',
        trigger: { type: 'enter-room', target: 'east-gate' },
      },
    ],
    rewards: { xp: 300, gold: 50 },
  },

  'balins-chronicle': {
    id: 'balins-chronicle',
    name: 'The Chronicle of Balin',
    description: 'The fate of Balin\'s colony is written somewhere in the Chamber of Records. Carry the tale out of the dark.',
    regionId: 'moria',
    giver: 'the silent tomb',
    start: { type: 'enter-room', target: 'chamber-of-records' },
    startLog: 'Among the dead lies a battered book — the chronicle of Balin\'s folk. Someone should carry their story into the light.',
    stages: [
      {
        objective: 'Take the Chronicle of Balin',
        trigger: { type: 'take-item', target: 'balin-tome' },
        completionLog: 'The tome is heavy with the weight of its last words: "They are coming."',
      },
      {
        objective: 'Carry the chronicle out of Moria',
        trigger: { type: 'enter-room', target: 'east-gate' },
        completionLog: 'The chronicle has left the darkness. Balin\'s story will be told.',
      },
    ],
    rewards: { xp: 150, gold: 25 },
  },

  'lost-armory': {
    id: 'lost-armory',
    name: 'The Lost Armory',
    description: 'The dwarves hid an armory that the orcs never found. The western wall of the mining shaft looks oddly irregular.',
    regionId: 'moria',
    start: { type: 'enter-room', target: 'mining-shaft' },
    stages: [
      {
        objective: 'Find the hidden armory',
        trigger: { type: 'enter-room', target: 'secret-armory' },
        completionLog: 'The false wall swings aside. Whatever the dwarves hid here, the orcs never touched it.',
      },
    ],
    rewards: { xp: 100 },
  },

  'the-reforging': {
    id: 'the-reforging',
    name: 'The Reforging',
    description: 'The forges of Khazad-dûm are cold, but not dead. A skilled hand might yet craft something worthy here.',
    regionId: 'moria',
    giver: 'the Abandoned Forge',
    start: { type: 'enter-room', target: 'abandoned-forge' },
    stages: [
      {
        objective: 'Forge an item at the Abandoned Forge',
        trigger: { type: 'craft-item', target: '*' },
        completionLog: 'The old anvils ring once more. Telchar himself might have nodded at the work.',
      },
    ],
    rewards: { xp: 150 },
  },
}

export const lothlorienQuests: Record<string, Quest> = {
  'song-of-nimrodel': {
    id: 'song-of-nimrodel',
    name: 'The Song of Nimrodel',
    description: 'Fragments of an ancient lay linger in the Golden Wood. Gather all three and the song will be whole again.',
    regionId: 'lothlorien',
    giver: 'the singing stream',
    start: { type: 'enter-room', target: 'nimrodel-stream' },
    startLog: 'The stream sings a melody older than the wood itself — but the song is broken, its verses scattered among the elves.',
    stages: [
      {
        objective: 'Recover all three fragments of Nimrodel\'s song',
        trigger: { type: 'take-item', target: 'nimrodel-song' },
        completionLog: 'The three verses weave together. The Song of Nimrodel is whole once more.',
      },
    ],
    rewards: { xp: 200, gold: 30 },
  },

  'wrath-of-the-wood': {
    id: 'wrath-of-the-wood',
    name: 'Wrath of the Golden Wood',
    description: 'Orcs from Moria have crossed the Silverlode in pursuit. The Galadhrim would see the wood cleansed.',
    regionId: 'lothlorien',
    giver: 'the wardens of Lórien',
    start: { type: 'enter-room', target: 'orc-ambush-site' },
    startLog: 'Orc tracks scar the earth of the Golden Wood. The pursuit from Moria has found you — hunt them down before they defile this place further.',
    stages: [
      {
        objective: 'Slay the orc pursuers in Lothlórien',
        trigger: { type: 'kill-enemy', target: 'orc-*', count: 4 },
        completionLog: 'The last pursuer falls among the mallorn roots. The Golden Wood is quiet again.',
      },
    ],
    rewards: { xp: 250, gold: 40 },
  },

  'the-farewell': {
    id: 'the-farewell',
    name: 'The Road Ahead',
    description: 'Your time in Lothlórien cannot last forever. Seek the counsel of the Lord and Lady, then choose your road.',
    regionId: 'lothlorien',
    start: { type: 'enter-room', target: 'caras-galadhon-gate' },
    startLog: 'The gates of Caras Galadhon open before you. Somewhere above, the Lord and Lady are waiting.',
    stages: [
      {
        objective: 'Choose your path onward from Lothlórien',
        trigger: { type: 'choice-made', target: 'farewell-path' },
        completionLog: 'The choice is made. The road ahead is yours.',
      },
      {
        objective: 'Depart from the Farewell Lawn',
        trigger: { type: 'enter-room', target: 'farewell-lawn' },
      },
    ],
    rewards: { xp: 300 },
  },
}
