export type Direction = 'north' | 'south' | 'east' | 'west' | 'up' | 'down'

export interface Exit {
  direction: Direction
  targetRoomId: string
  locked?: boolean
  lockMessage?: string
  requiredItemId?: string
  requiredSkillCheck?: { ability: string; dc: number }
}

export interface RoomEnemy {
  enemyId: string
  count: number
}

export interface Room {
  id: string
  name: string
  description: string
  exits: Exit[]
  enemies?: RoomEnemy[]
  items?: string[]  // item IDs
  onEnter?: string  // event key
  visited?: boolean
  dark?: boolean     // requires light source
  gridX: number      // for minimap
  gridY: number
}
