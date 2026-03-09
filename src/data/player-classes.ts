import type { Player, PlayerClass, Spell } from '../types/character'

// ---------------------------------------------------------------------------
// Spell definitions
// ---------------------------------------------------------------------------

const spellFireBolt: Spell = {
  id: 'fire-bolt',
  name: 'Fire Bolt',
  description: 'You hurl a mote of fire at a creature. A reliable offensive cantrip that never leaves the Wizard\'s arsenal.',
  damage: '2d6',
  effect: 'fire',
  cooldown: 0,
  currentCooldown: 0,
}

const spellShield: Spell = {
  id: 'shield',
  name: 'Shield',
  description: 'An invisible barrier of magical force materialises around you, granting +5 to AC for one turn and deflecting incoming blows.',
  effect: 'shield:ac+5:turns1',
  cooldown: 3,
  currentCooldown: 0,
}

const spellLight: Spell = {
  id: 'light',
  name: 'Light',
  description: 'You cause your staff\'s tip to glow with a warm radiance, illuminating dark rooms and banishing the shadows of Moria.',
  effect: 'illuminate',
  cooldown: 0,
  currentCooldown: 0,
}

// ---------------------------------------------------------------------------
// Class templates
// ---------------------------------------------------------------------------

interface ClassTemplate {
  abilities: Player['abilities']
  hp: number
  ac: number
  equippedWeapon?: string
  equippedArmor?: string
  spells: Spell[]
  inventory: string[]
}

const classTemplates: Record<PlayerClass, ClassTemplate> = {
  'ranger': {
    abilities: {
      str: 14,
      dex: 16,
      con: 13,
      int: 12,
      wis: 14,
      cha: 10,
    },
    // d10 hit die + CON modifier (+1) at level 1 = 10 + 1 = 11 base, scaled to 28 at higher representation
    hp: 28,
    // 10 (base) + DEX modifier (+3) + leather armor bonus (+2) = 15
    ac: 15,
    equippedWeapon: 'longsword',
    equippedArmor: 'leather-armor',
    spells: [],
    inventory: ['longsword', 'leather-armor', 'healing-potion', 'healing-potion'],
  },

  'wizard': {
    abilities: {
      str: 8,
      dex: 14,
      con: 12,
      int: 18,
      wis: 16,
      cha: 11,
    },
    // d6 hit die + CON modifier (+1) at level 1 = 6 + 1 = 7 base, scaled to 18
    hp: 18,
    // 10 (base) + DEX modifier (+2) = 12 (no armor proficiency)
    ac: 12,
    equippedWeapon: 'staff',
    equippedArmor: undefined,
    spells: [spellFireBolt, spellShield, spellLight],
    inventory: ['staff', 'healing-potion'],
  },

  'dwarf-warrior': {
    abilities: {
      str: 18,
      dex: 10,
      con: 16,
      int: 10,
      wis: 12,
      cha: 8,
    },
    // d12 hit die + CON modifier (+3) at level 1 = 12 + 3 = 15 base, scaled to 36
    hp: 36,
    // 10 (base) + STR modifier (+0 for medium armor base) + chain-mail bonus (+4) = 14
    ac: 14,
    equippedWeapon: 'battle-axe',
    equippedArmor: 'chain-mail',
    spells: [],
    inventory: ['battle-axe', 'chain-mail', 'healing-potion'],
  },
}

// ---------------------------------------------------------------------------
// Factory function
// ---------------------------------------------------------------------------

export function createPlayer(name: string, playerClass: PlayerClass): Player {
  const template = classTemplates[playerClass]

  return {
    name,
    class: playerClass,
    level: 1,
    xp: 0,
    xpToNext: 100,
    hp: template.hp,
    maxHp: template.hp,
    ac: template.ac,
    abilities: { ...template.abilities },
    equippedWeapon: template.equippedWeapon,
    equippedArmor: template.equippedArmor,
    spells: template.spells.map(spell => ({ ...spell })),
    gold: 10,
    statusEffects: [],
    fumblePenalty: false,
  }
}
