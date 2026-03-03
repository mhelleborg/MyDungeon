export function rollDie(sides: number): number {
  return Math.floor(Math.random() * sides) + 1
}

export function rollD20(): number {
  return rollDie(20)
}

export function rollD6(): number {
  return rollDie(6)
}

/** Parse dice notation like "2d6+3" and roll */
export function rollDice(notation: string): { total: number; rolls: number[]; modifier: number } {
  const match = notation.match(/^(\d+)d(\d+)([+-]\d+)?$/)
  if (!match) return { total: 0, rolls: [], modifier: 0 }

  const count = parseInt(match[1]!)
  const sides = parseInt(match[2]!)
  const modifier = match[3] ? parseInt(match[3]) : 0

  const rolls: number[] = []
  for (let i = 0; i < count; i++) {
    rolls.push(rollDie(sides))
  }

  const total = rolls.reduce((sum, r) => sum + r, 0) + modifier
  return { total: Math.max(0, total), rolls, modifier }
}
