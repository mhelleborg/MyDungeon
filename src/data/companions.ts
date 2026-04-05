import type { Companion } from '../types/companion'

export const companionData: Record<string, Companion> = {
  'trapped-elf': {
    id: 'trapped-elf',
    name: 'Elanor',
    hp: 18,
    maxHp: 18,
    ac: 14,
    attackBonus: 4,
    damage: '1d6+2',
    roomComments: {
      'gates-of-moria': 'Elanor traces the carvings on the gate. "Ithildin... moonlight reveals what was hidden. The craft of Celebrimbor himself."',
      'entrance-hall': 'Elanor\'s eyes narrow. "This darkness is unnatural. Something feeds it — something deep below."',
      'great-hall': 'Elanor looks up at the vast pillars. "The Naugrim built well, I will grant them that. Even in ruin, it takes the breath away."',
      'bridge-of-khazad-dum': 'Elanor stops short, her face pale. "I feel it — fire and shadow. The Balrog stirs beyond this bridge."',
      'chamber-of-records': 'Elanor kneels beside the tomb. "Balin, son of Fundin. He dreamed of reclaiming this place. The mountain had other plans."',
      'goblin-tunnels': 'Elanor wrinkles her nose. "Goblins. Their stench lingers long after they are gone."',
      'endless-stair-base': 'Elanor gazes upward into the darkness. "The Endless Stair... it climbs to Durin\'s Tower at the peak of Zirakzigil."',
      'second-hall': 'Elanor touches the wall softly. "I remember this place. I was lost here for days before you found me."',
      'east-gate': 'Elanor smiles as sunlight touches her face. "I had forgotten how warm the sun could be."',
      // ── Act 2: Lothlórien ───────────────────────────────────────
      'dimrill-dale': 'Elanor fills her lungs with mountain air. "I know this valley. We are close — a day\'s walk south. The wood will find us."',
      'silver-river-ford': 'Elanor steps into the Silverlode and stops. Her eyes close. Something passes across her face — relief, or recognition. "We are home."',
      'eithel-celebrant': 'Elanor kneels at the source of the river, cupping water in both hands. "I used to come here as a child. The water was always cold."',
      'nimrodel-falls': 'Elanor is very still beside the falls. "She was here before us. Before the city, before Galadriel came. She loved this stream more than any of us."',
      'haldir-post': 'Elanor steps forward. "Haldir — it is me. Elanor. I have returned." She glances at you. "He will listen now."',
      'talan-flet': 'Elanor leans against the railing of the flet and looks out through the gold-lit canopy. "I slept in this exact spot once," she says quietly. "A long time ago."',
      'mellyrn-grove': 'Elanor runs her hand across the bark of the tallest mallorn. "Fifteen hundred years, at least. They remember everything."',
      'galdriel-bower': 'Elanor bows deeply. "My Lady." She does not speak again. Some things need no words.',
      'mirror-room': 'Elanor stays back from the Mirror. "I looked once. When I was young. I will not look again." She watches your face instead.',
      'telain-galadhon': 'Elanor stands at the railing of the highest flet, looking out at the whole of Lothlórien. "Whatever happens next," she says, "I am glad you came through the dark with me."',
      'garden-of-healing': 'Elanor helps Malbeth without being asked, knowing exactly which herbs to reach for.',
      'lothlorien-edge': 'Elanor stops at the edge of the forest. Her hand rests against the last mallorn. "The road calls you," she says. "I know. Go well."',
    },
    genericComments: [
      'Elanor hums a soft elvish melody under her breath.',
      'Elanor whispers, "Stay close. I sense movement in the shadows."',
      'Elanor runs her fingers along the wall. "Such sorrow these stones have witnessed."',
      'Elanor glances back the way you came. "We are not alone in these mines."',
      'Elanor\'s keen eyes scan the darkness ahead. "Be wary."',
    ],
    deathMessage: 'Elanor crumples to the ground, the light fading from her eyes. "Tell them... tell Lothlórien I tried to come home..." Her voice trails into silence. The starlight in her gaze goes dark.',
  },

  'shadow-ranger': {
    id: 'shadow-ranger',
    name: 'Halbarad',
    hp: 22,
    maxHp: 22,
    ac: 15,
    attackBonus: 5,
    damage: '1d8+2',
    roomComments: {
      'gates-of-moria': 'Halbarad examines the ground near the gate. "Many tracks here — orc boots, mostly. Some fresher than others."',
      'entrance-hall': 'Halbarad crouches low, studying the floor. "Ambush ground. Stay near the walls."',
      'great-hall': 'Halbarad surveys the vast chamber. "A thousand orcs could hide in these shadows. We move quickly, or not at all."',
      'bridge-of-khazad-dum': 'Halbarad draws his blade. "The bridge is narrow. If we must fight here, use the terrain. Nothing can flank us."',
      'chamber-of-records': 'Halbarad reads the runes on the tomb. "Balin\'s company held this place for five years before the end. Brave folk."',
      'mining-shaft': 'Halbarad tests the air. "Fresh air from below — there may be another way out, deeper in."',
      'great-stairway': 'Halbarad nods at the familiar surroundings. "I held this position for two days before you arrived. The orcs kept coming."',
      'abandoned-forge': 'Halbarad checks the forge. "Still warm. Someone — or something — was here recently."',
      'east-gate': 'Halbarad breathes deep. "Daylight. I had begun to doubt we would see it again."',
      // ── Act 2: Lothlórien ───────────────────────────────────────
      'dimrill-dale': 'Halbarad scans the valley carefully. "Orcs behind, and more ahead, likely. But the air — it\'s different here. Something is watching over this land."',
      'silver-river-ford': 'Halbarad pauses at the river\'s edge, hand on his sword. Then slowly, he sheathes it. "Whatever is in that forest... it isn\'t the enemy."',
      'haldir-post': 'Halbarad meets Haldir\'s gaze steadily. He doesn\'t reach for his weapons. "My name is Halbarad. I am of the Dúnedain. I carry no ill will toward your Lady\'s wood."',
      'talan-flet': 'Halbarad sits on the edge of the flet, legs dangling over nothing, completely at ease. "Rangers learn to sleep in trees young," he says. "Better sightlines."',
      'mellyrn-grove': 'Halbarad studies the runes on the mallorn. His lips move slightly — he can read some of them. "Old Khuzdul," he says, surprised. "The dwarves and elves were close, once."',
      'celeborn-hall': 'Halbarad stands straighter than usual. He is aware he is being assessed by one of the oldest living minds in the world.',
      'galdriel-bower': 'Halbarad goes very still when Galadriel looks at him. Something passes between them — she says something very quietly that you cannot hear. He nods once.',
      'garden-of-healing': 'Halbarad finally lets the healer tend a wound he\'d been ignoring since the Balrog fight. "It\'s nothing," he says. Malbeth disagrees, firmly.',
      'mirror-room': 'Halbarad does not look at the Mirror. He faces outward, watching the approach. "Someone needs to keep watch," he says. "It might as well be me."',
      'telain-galadhon': 'Halbarad looks north for a long time before speaking. "The Grey Company will be looking for me. I have stayed longer than I planned." He doesn\'t sound regretful.',
      'lothlorien-edge': 'Halbarad checks his kit with the practiced efficiency of a man who has left many places. "Ready when you are."',
    },
    genericComments: [
      'Halbarad marks the passage wall with his knife. "In case we need to retrace our steps."',
      'Halbarad listens intently. "Footsteps — distant, but many."',
      'Halbarad checks his bowstring. "Still taut. Good."',
      'Halbarad mutters, "The Dúnedain have long memories. We will not forget what happened in Khazad-dûm."',
      'Halbarad scans the room with practiced eyes. "Clear — for now."',
    ],
    deathMessage: 'Halbarad staggers, his hand pressed to a mortal wound. "Carry on, friend. The Dúnedain do not fear death..." He sinks to his knees, then falls still. A Ranger of the North — fallen in the deep places of the world.',
  },
}

/** Map of NPC ID → companion ID (same keys, used for lookup) */
export const npcToCompanion: Record<string, string> = {
  'trapped-elf': 'trapped-elf',
  'shadow-ranger': 'shadow-ranger',
}

/** Check whether an NPC's recruitment prerequisite is met */
export const recruitmentConditions: Record<string, (interactedNPCs: Set<string>) => boolean> = {
  'trapped-elf': (interacted) => interacted.has('trapped-elf'),
  'shadow-ranger': (interacted) => interacted.has('shadow-ranger'),
}
