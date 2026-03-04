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
