import type { StatusEffectId } from './statusEffect'
import type { GameLogEntry } from './command'

export type Direction = 'north' | 'south' | 'east' | 'west' | 'up' | 'down'

export interface Exit {
  direction: Direction
  targetRoomId: string
  locked?: boolean
  lockMessage?: string
  requiredItemId?: string
  requiredSkillCheck?: { ability: string; dc: number }
  /** Exit stays blocked (with lockMessage) until this room's enemies are cleared */
  blockedUntilCleared?: boolean
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

/** Conditions that must all hold for a room event to fire */
export interface RoomEventCondition {
  /** Room must (true) or must not (false) be cleared of enemies */
  roomCleared?: boolean
  /** An exit of this room in this direction must have been revealed */
  exitRevealed?: Direction
  /** This choice must already have been made */
  choiceMade?: string
}

export type RoomEventEffect =
  /** Present a choice to the player (never re-fires once the choice is made) */
  | { type: 'choice'; choiceId: string }
  /** Apply a status effect to the player */
  | { type: 'status-effect'; effectId: StatusEffectId; message?: string }
  /** Log narrative/system lines */
  | { type: 'narration'; lines: { text: string; logType?: GameLogEntry['type'] }[] }
  /** End the game victoriously */
  | { type: 'victory'; message?: string }

/** A declarative event that fires when the player enters the room */
export interface RoomEvent {
  /** Unique id — required when `once`, tracked across the save */
  id?: string
  /** Fire at most one time ever (requires `id`) */
  once?: boolean
  when?: RoomEventCondition
  effect: RoomEventEffect
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
  /** Declarative events evaluated on room entry */
  events?: RoomEvent[]
  /** Crafting is available here (the `craft` command and forge UI) */
  craftingStation?: boolean
  visited?: boolean
  dark?: boolean     // requires light source
  trap?: Trap
  gridX: number      // for minimap
  gridY: number
}
