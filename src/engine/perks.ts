import type { Player, PlayerClass, Spell } from '../types/character'
import type { GameLogEntry } from '../types/command'

export interface Perk {
  id: string
  name: string
  description: string
  level: number
  attackBonus?: number
  acBonus?: number
  maxHpBonus?: number
  grantSpell?: Spell
}

export const classPerks: Record<PlayerClass, Perk[]> = {
  'ranger': [
    { id: 'keen-eye', name: 'Keen Eye', level: 3, attackBonus: 1, description: 'Your blade finds the gaps in any armor. (+1 to attack)' },
    { id: 'fleet-foot', name: 'Fleet Foot', level: 5, acBonus: 1, description: 'You move like wind over grass. (+1 AC)' },
    { id: 'master-tracker', name: 'Master Tracker', level: 7, attackBonus: 1, description: 'No prey escapes you twice. (+1 to attack)' },
    { id: 'dunedain-endurance', name: 'Endurance of the Dúnedain', level: 9, maxHpBonus: 12, description: 'The blood of Númenor runs strong in you. (+12 max HP)' },
  ],
  'wizard': [
    {
      id: 'frost-ray', name: 'Frost Ray', level: 3,
      grantSpell: { id: 'frost-ray', name: 'Frost Ray', description: 'A lance of biting cold. (2d8 damage)', damage: '2d8', cooldown: 1, currentCooldown: 0 },
      description: 'You have mastered the cold fire of the North. (New spell: Frost Ray)',
    },
    { id: 'arcane-vigor', name: 'Arcane Vigor', level: 5, maxHpBonus: 8, description: 'Your body hardens to carry greater power. (+8 max HP)' },
    {
      id: 'chain-lightning', name: 'Chain Lightning', level: 7,
      grantSpell: { id: 'chain-lightning', name: 'Chain Lightning', description: 'Forked lightning leaps from your staff. (3d8 damage)', damage: '3d8', cooldown: 3, currentCooldown: 0 },
      description: 'The storm answers your call. (New spell: Chain Lightning)',
    },
    { id: 'staff-mastery', name: 'Staff Mastery', level: 9, attackBonus: 2, description: 'Staff and spell move as one. (+2 to attack)' },
  ],
  'dwarf-warrior': [
    { id: 'stone-skin', name: 'Stone Skin', level: 3, acBonus: 1, description: 'Your hide is as tough as mountain rock. (+1 AC)' },
    { id: 'battle-fury', name: 'Battle Fury', level: 5, attackBonus: 1, description: 'Baruk Khazâd! Your axe sings for blood. (+1 to attack)' },
    { id: 'dwarven-toughness', name: 'Dwarven Toughness', level: 7, maxHpBonus: 15, description: 'Dwarves endure where others fall. (+15 max HP)' },
    { id: 'mountains-wrath', name: "Mountain's Wrath", level: 9, attackBonus: 2, description: 'You strike with the weight of the mountain itself. (+2 to attack)' },
  ],
}

function perkById(playerClass: PlayerClass, id: string): Perk | undefined {
  return classPerks[playerClass].find(p => p.id === id)
}

/** Sum of attack bonuses from the player's unlocked perks. */
export function getPerkAttackBonus(player: Player): number {
  return (player.perks ?? []).reduce((sum, id) => sum + (perkById(player.class, id)?.attackBonus ?? 0), 0)
}

/** Sum of AC bonuses from the player's unlocked perks (used when recomputing AC). */
export function getPerkAcBonus(player: Player): number {
  return (player.perks ?? []).reduce((sum, id) => sum + (perkById(player.class, id)?.acBonus ?? 0), 0)
}

/** Display names of the player's unlocked perks. */
export function listPerkNames(player: Player): string[] {
  return (player.perks ?? []).map(id => perkById(player.class, id)?.name ?? id)
}

/**
 * Unlock any perks the player has earned at `level`, applying immediate
 * effects (max HP, AC, spells) and returning announcement logs.
 */
export function unlockPerksAtLevel(player: Player, level: number): GameLogEntry[] {
  const logs: GameLogEntry[] = []
  for (const perk of classPerks[player.class]) {
    if (perk.level !== level) continue
    if (!player.perks) player.perks = []
    if (player.perks.includes(perk.id)) continue
    player.perks.push(perk.id)
    if (perk.maxHpBonus) {
      player.maxHp += perk.maxHpBonus
      player.hp = Math.min(player.maxHp, player.hp + perk.maxHpBonus)
    }
    if (perk.acBonus) player.ac += perk.acBonus
    if (perk.grantSpell && !player.spells.some(s => s.id === perk.grantSpell!.id)) {
      player.spells.push({ ...perk.grantSpell })
    }
    logs.push({ text: `★ Perk unlocked: ${perk.name} — ${perk.description}`, type: 'loot', timestamp: Date.now() })
  }
  return logs
}
