export type Direction = 'north' | 'south' | 'east' | 'west' | 'up' | 'down'

export interface Exit {
  direction: Direction
  targetRoomId: string
  locked?: boolean
  lockMessage?: string
  requiredItemId?: string
  requiredSkillCheck?: { ability: string; dc: number }
  hidden?: boolean
  /** How the exit is revealed: 'examine' (examine walls), 'light' (have light), 'puzzle' (solve puzzle) */
  revealMethod?: 'examine' | 'light' | 'puzzle'
}

export interface RoomEnemy {
  enemyId: string
  count: number
}

export interface Trap {
  description: string
  disarmAbility: 'str' | 'dex' | 'con' | 'int' | 'wis' | 'cha'
  disarmDC: number
  damage: string  // dice notation
}

export interface Room {
  id: string
  name: string
  description: string
  clearedDescription?: string
  /** Extra details revealed by looking around carefully. Shown one at a time on repeated looks. */
  lookDetails?: string[]
  exits: Exit[]
  enemies?: RoomEnemy[]
  items?: string[]  // item IDs
  onEnter?: string  // event key
  visited?: boolean
  dark?: boolean     // requires light source
  trap?: Trap
  gridX: number      // for minimap
  gridY: number
}
