import { rollDie } from './dice'

const globalEvents = [
  'You hear drums in the deep... doom, doom, doom.',
  'A cold draught blows from somewhere below, carrying the smell of ancient stone.',
  'Water drips steadily from the ceiling, each drop echoing in the silence.',
  'The shadows seem to shift and dance at the edge of your vision.',
  'A distant rumble vibrates through the stone beneath your feet.',
  'You hear the faint scrape of claws on rock somewhere far away.',
  'The air grows thick and stale. How deep into the mountain are you?',
  'A faint, mournful sound echoes through the halls — wind, or something else?',
  'Dust motes drift in whatever light you carry, ancient and undisturbed for ages.',
  'For a moment, you could swear you hear dwarven singing, faint and far away.',
]

const roomEvents: Record<string, string[]> = {
  'watcher-pool': [
    'Something stirs beneath the black water, sending ripples across the surface.',
    'A tentacle briefly breaches the surface before slithering back into the depths.',
    'The water has a faintly luminous quality, as if something glows far below.',
  ],
  'goblin-tunnels': [
    'Scratching sounds come from the walls — rats, or something worse.',
    'The drumming grows louder here. The goblins know you are coming.',
  ],
  'chamber-of-records': [
    'The pages of the Book of Mazarbul rustle in a breeze that should not exist.',
    'You feel the weight of dwarven sorrow pressing down on this place.',
    'A shaft of pale light falls on Balin\'s tomb from a crack high above.',
  ],
  'bridge-of-khazad-dum': [
    'Heat rises from the chasm below, carrying the stench of brimstone.',
    'The bridge trembles beneath your feet. Something stirs in the deeps.',
  ],
  'abandoned-forge': [
    'One of the cold forges emits a faint ping, as if the metal remembers its purpose.',
    'You notice dwarven maker\'s marks on the anvils — master craftsmen worked here.',
  ],
  'mining-shaft': [
    'A pebble drops from the edge and you never hear it land.',
    'The cold breeze from below carries a faint mineral tang.',
  ],
  'endless-stair-base': [
    'Looking upward, the stair spirals into darkness without end.',
    'Your footstep echoes up the stair and returns to you, changed and distant.',
  ],
  'second-hall': [
    'The columns here seem to hum with a deep, almost sub-audible frequency.',
    'Something watches from the darkness beyond the chasm. You feel it.',
  ],
  'troll-den': [
    'The stench here is almost unbearable — old meat and troll filth.',
    'Massive claw marks score the walls, as if the troll sharpened its nails on stone.',
  ],
}

export function rollAmbientEvent(roomId: string): string | null {
  // 30% chance of ambient event
  if (rollDie(10) > 3) return null

  // 50% chance of room-specific event if available
  const roomSpecific = roomEvents[roomId]
  if (roomSpecific && roomSpecific.length > 0 && rollDie(2) === 1) {
    return roomSpecific[rollDie(roomSpecific.length) - 1]!
  }

  return globalEvents[rollDie(globalEvents.length) - 1]!
}
