import type { Choice, ActiveChoice } from '../../types/choice'
import type { Companion } from '../../types/companion'
import type { Item } from '../../types/item'
import { entry, type HandlerResult } from './types'
import { rollDice } from '../dice'

export interface ChoicePresentResult extends HandlerResult {
  activeChoice: ActiveChoice
}

/** Present a choice to the player with narrative and option descriptions. */
export function presentChoice(choice: Choice, companionName?: string): ChoicePresentResult {
  const description =
    choice.id === 'bridge-sacrifice' && companionName
      ? `${companionName} steps forward, eyes blazing with desperate courage. "You cannot defeat this thing alone — not like this. Let me buy you time. I will charge the Balrog and give you an opening. I... I will not survive. But you might. Let me do this."`
      : choice.description

  const logs = [
    entry(`--- ${choice.name} ---`, 'system'),
    entry(description, 'narrative'),
  ]

  for (const opt of choice.options) {
    logs.push(entry(`${opt.label}: ${opt.description}`, 'info'))
  }

  logs.push(entry('(Type "choose <option>" to decide.)', 'info'))

  return {
    logs,
    activeChoice: {
      choiceId: choice.id,
      options: choice.options,
    },
  }
}

// ── Resolution results ─────────────────────────────────────

export interface ChoiceResolutionResult extends HandlerResult {
  choiceId: string
  optionId: string
  /** XP to award */
  xp?: number
  /** Gold to award */
  gold?: number
  /** Item IDs to drop on the ground */
  itemIds?: string[]
  /** Remove a healing potion from inventory */
  consumeHealingPotion?: boolean
  /** Permanent max HP change (negative = loss) */
  maxHpChange?: number
  /** Permanent attack bonus to grant */
  attackBonus?: number
  /** Permanent AC bonus to grant */
  acBonus?: number
  /** Enemies to remove from a room: { roomId, enemyId, count } */
  removeEnemies?: { roomId: string; enemyId: string; count: number }
  /** Enemies to spawn in a room */
  spawnEnemies?: { roomId: string; enemyId: string; count: number }
  /** Kill the first companion (sacrifice) */
  sacrificeCompanion?: boolean
  /** Damage to deal to the boss */
  bossDamage?: number
  /** Skip enemy turn this round */
  skipEnemyTurn?: boolean
  /** Flag to record in choiceConsequences */
  consequenceFlags?: Record<string, boolean>
}

/** Resolve the player's choice. Returns descriptors of side-effects for the store to apply. */
export function resolveChoice(
  choiceId: string,
  optionId: string,
  context: {
    inventory: Item[]
    companions: Companion[]
  },
): ChoiceResolutionResult {
  switch (choiceId) {
    case 'wounded-goblin': return resolveWoundedGoblin(optionId, context.inventory)
    case 'oris-knowledge': return resolveOrisKnowledge(optionId)
    case 'sealed-vault':   return resolveSealedVault(optionId)
    case 'bridge-sacrifice': return resolveBridgeSacrifice(optionId, context.companions)
    default:
      return {
        choiceId,
        optionId,
        logs: [entry(`Unknown choice "${choiceId}".`, 'error')],
      }
  }
}

// ── Individual choice resolvers ────────────────────────────

function resolveWoundedGoblin(optionId: string, inventory: Item[]): ChoiceResolutionResult {
  const choiceId = 'wounded-goblin'

  if (optionId === 'mercy') {
    const hasPotion = inventory.some(i => i.id === 'healing-potion')
    if (!hasPotion) {
      return {
        choiceId,
        optionId: '',
        logs: [entry('You reach for a healing potion, but you don\'t have one. The goblin whimpers.', 'error')],
      }
    }

    return {
      choiceId,
      optionId,
      consumeHealingPotion: true,
      xp: 15,
      removeEnemies: { roomId: 'orc-lair', enemyId: 'orc-warrior', count: 1 },
      consequenceFlags: { 'goblin-mercy': true },
      logs: [
        entry('You kneel and pour the healing potion over the goblin\'s shattered leg. Grishnak\'s eyes widen with disbelief — then something like gratitude.', 'narrative'),
        entry('"Tall-one is... kind. Grishnak not forget. Grishnak tells big-orcs: leave this one alone. Grishnak promises on his teeth!"', 'narrative'),
        entry('The goblin scuttles away into the darkness. You feel a strange warmth — perhaps mercy has its own rewards.', 'narrative'),
        entry('(+15 XP. The orcs ahead have been warned — some will stand down.)', 'loot'),
      ],
    }
  }

  if (optionId === 'kill') {
    return {
      choiceId,
      optionId,
      xp: 10,
      gold: 5,
      consequenceFlags: {},
      logs: [
        entry('You end the goblin\'s suffering with a swift strike. It is a mercy of a different kind.', 'narrative'),
        entry('Among its rags you find a few coins.', 'narrative'),
        entry('(+10 XP, +5 gold)', 'loot'),
      ],
    }
  }

  // ignore
  return {
    choiceId,
    optionId: 'ignore',
    consequenceFlags: {},
    logs: [
      entry('You step over the wounded goblin and press on. It watches you go with glittering, unreadable eyes.', 'narrative'),
    ],
  }
}

function resolveOrisKnowledge(optionId: string): ChoiceResolutionResult {
  const choiceId = 'oris-knowledge'

  if (optionId === 'accept') {
    return {
      choiceId,
      optionId,
      attackBonus: 2,
      maxHpChange: -6,
      consequenceFlags: { 'oris-knowledge-accepted': true },
      logs: [
        entry('Ori\'s shade reaches out and touches your forehead. A searing flood of battle-lore pours into your mind — centuries of dwarven combat against nameless terrors in the deep.', 'narrative'),
        entry('You see through Ori\'s eyes: the last stand at Balin\'s tomb, the desperate fighting retreats, the terrible things that crawled up from below. You learn to fight as the dwarves fought — savagely, precisely, without mercy.', 'narrative'),
        entry('But the knowledge burns. You feel something vital drain away, like warmth leaving your body on a winter night.', 'narrative'),
        entry('(+2 permanent attack bonus. -6 maximum HP. The knowledge is a blade with no hilt.)', 'loot'),
      ],
    }
  }

  // refuse
  return {
    choiceId,
    optionId: 'refuse',
    acBonus: 1,
    consequenceFlags: { 'oris-blessing': true },
    logs: [
      entry('"No," you say quietly. "I will face what comes with my own strength."', 'narrative'),
      entry('Ori\'s shade regards you with something like respect — or perhaps relief. "Then you are wiser than we were. We reached for power in the dark, and the dark reached back."', 'narrative'),
      entry('The ghost raises a translucent hand in blessing. A faint warmth settles over you like a cloak.', 'narrative'),
      entry('(+1 permanent AC. Ori\'s blessing guards you.)', 'loot'),
    ],
  }
}

function resolveSealedVault(optionId: string): ChoiceResolutionResult {
  const choiceId = 'sealed-vault'

  if (optionId === 'open') {
    return {
      choiceId,
      optionId,
      itemIds: ['miruvor'],
      spawnEnemies: { roomId: 'chamber-of-records', enemyId: 'orc-warrior', count: 2 },
      consequenceFlags: { 'vault-opened': true },
      logs: [
        entry('You put your shoulder to the ancient seal and heave. Stone grinds against stone, and the vault door swings inward with a groan that echoes through the mines.', 'narrative'),
        entry('Inside, untouched for an age, rests a crystal flask of Miruvor — the cordial of Imladris, still potent after all these years.', 'narrative'),
        entry('But the sound carries. Far off, you hear guttural voices raised in alarm. Something has heard you. The Chamber of Records may no longer be safe.', 'narrative'),
        entry('(Found Miruvor! But orc warriors have been alerted to the Chamber of Records.)', 'loot'),
      ],
    }
  }

  // leave
  return {
    choiceId,
    optionId: 'leave',
    consequenceFlags: {},
    logs: [
      entry('You trace the warning runes with your fingertips and step back. The dwarves knew what they were doing when they sealed this place. Some doors are best left closed.', 'narrative'),
      entry('"Not all treasure is worth the finding," you murmur — words Gandalf might have spoken.', 'narrative'),
    ],
  }
}

function resolveBridgeSacrifice(optionId: string, companions: Companion[]): ChoiceResolutionResult {
  const choiceId = 'bridge-sacrifice'
  const livingCompanion = companions.find(c => c.hp > 0)

  if (optionId === 'sacrifice') {
    if (!livingCompanion) {
      return {
        choiceId,
        optionId: '',
        logs: [entry('You have no companion to make this sacrifice.', 'error')],
      }
    }

    const dmg = rollDice('3d10+0')

    return {
      choiceId,
      optionId,
      sacrificeCompanion: true,
      bossDamage: dmg.total,
      skipEnemyTurn: true,
      consequenceFlags: { 'companion-sacrificed': true },
      logs: [
        entry(`${livingCompanion.name} charges the Balrog with a desperate cry!`, 'combat'),
        entry(`Blade flashing, ${livingCompanion.name} strikes the Balrog again and again, driving it back from the bridge. Fire licks at their cloak, their hair, their skin — but they do not falter.`, 'narrative'),
        entry(`The Balrog takes ${dmg.total} damage from ${livingCompanion.name}'s assault!`, 'combat'),
        entry(`With a final, terrible blow, the Balrog swats ${livingCompanion.name} into the abyss. They fall without a sound, swallowed by the darkness below. They are gone.`, 'narrative'),
        entry(`But they bought you time. The Balrog staggers, momentarily stunned by the ferocity of the attack. You have one free round to act.`, 'info'),
      ],
    }
  }

  // refuse
  const companionName = livingCompanion?.name ?? 'Your companion'
  return {
    choiceId,
    optionId: 'refuse',
    consequenceFlags: {},
    logs: [
      entry(`"No," you say firmly. "We fight together, or not at all."`, 'narrative'),
      entry(`${companionName}'s eyes shine with unshed tears. "Then together we stand, against fire and shadow. To whatever end."`, 'narrative'),
      entry('The battle continues.', 'info'),
    ],
  }
}
