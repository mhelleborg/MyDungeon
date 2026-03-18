export type CommandType =
  | 'move'
  | 'look'
  | 'examine'
  | 'attack'
  | 'cast'
  | 'take'
  | 'drop'
  | 'use'
  | 'equip'
  | 'disarm'
  | 'flee'
  | 'sneak'
  | 'rest'
  | 'talk'
  | 'trade'
  | 'say'
  | 'solve'
  | 'search'
  | 'destroy'
  | 'craft'
  | 'choose'
  | 'inventory'
  | 'stats'
  | 'help'
  | 'map'
  | 'save'
  | 'load'
  | 'unknown'

export interface ParsedCommand {
  type: CommandType
  target?: string        // direction, item name, enemy name, spell name
  raw: string           // original input
}

export interface GameLogEntry {
  text: string
  type: 'narrative' | 'combat' | 'system' | 'error' | 'loot' | 'info'
  timestamp: number
}
