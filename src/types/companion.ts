export interface Companion {
  id: string           // matches NPC id
  name: string
  hp: number
  maxHp: number
  ac: number
  attackBonus: number
  damage: string       // dice notation
  roomComments: Record<string, string>  // roomId → specific comment
  genericComments: string[]             // fallback pool
  deathMessage: string
}
