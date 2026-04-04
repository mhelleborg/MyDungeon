/**
 * Dialogue tree handler — navigates DialogueTree nodes, evaluates conditions,
 * and dispatches dialogue effects.
 *
 * This module is pure (no store imports). The store passes state in as context
 * and applies returned results.
 */

import type {
  DialogueNode,
  DialogueOption,
  DialogueCondition,
  DialogueEffect,
  ActiveDialogue,
} from '../../types/dialogue'
import type { NPC } from '../../types/npc'
import type { Item } from '../../types/item'
import type { Companion } from '../../types/companion'
import { entry, type HandlerResult } from './types'
import { skillCheck } from '../skillChecks'

// ── Context passed in from the store ───────────────────────────────────────

export interface DialogueContext {
  inventory: Item[]
  companions: Companion[]
  choicesMade: Record<string, string>
  choiceConsequences: Record<string, boolean>
  interactedNPCs: Set<string>
  /** ID of the NPC currently being talked to — used for alreadyInteracted check */
  npcId: string
  playerClass: string
  playerAbilities: { str: number; dex: number; con: number; int: number; wis: number; cha: number }
  /** IDs of fragments of Nimrodel's song already collected */
  nimrodelFragments: Set<string>
}

// ── Condition evaluation ───────────────────────────────────────────────────

export function evaluateCondition(cond: DialogueCondition, ctx: DialogueContext): boolean {
  switch (cond.type) {
    case 'hasItem':
      return !!cond.itemId && ctx.inventory.some(i => i.id === cond.itemId)
    case 'choiceMade':
      if (!cond.choiceId) return false
      if (cond.optionId) return ctx.choicesMade[cond.choiceId] === cond.optionId
      return !!ctx.choicesMade[cond.choiceId]
    case 'choiceNotMade':
      if (!cond.choiceId) return true
      return !ctx.choicesMade[cond.choiceId]
    case 'companionAlive':
      return ctx.companions.some(c => (!cond.companionId || c.id === cond.companionId) && c.hp > 0)
    case 'companionDead':
      if (!cond.companionId) return ctx.companions.some(c => c.hp <= 0)
      return ctx.companions.some(c => c.id === cond.companionId && c.hp <= 0)
    case 'hasCompanion':
      return ctx.companions.some(c => (!cond.companionId || c.id === cond.companionId) && c.hp > 0)
    case 'noCompanion':
      return !ctx.companions.some(c => c.hp > 0)
    case 'flag':
      return !!cond.flag && !!ctx.choiceConsequences[cond.flag]
    case 'flagAbsent':
      return !cond.flag || !ctx.choiceConsequences[cond.flag]
    case 'alreadyInteracted':
      return ctx.interactedNPCs.has(ctx.npcId)
    case 'statCheck': {
      if (!cond.ability || !cond.dc) return true
      const result = skillCheck(ctx.playerAbilities, cond.ability, cond.dc)
      return result.success
    }
    case 'hasClass':
      return !!cond.playerClass && ctx.playerClass === cond.playerClass
    default:
      return true
  }
}

export function allConditionsPass(conditions: DialogueCondition[] | undefined, ctx: DialogueContext): boolean {
  if (!conditions || conditions.length === 0) return true
  return conditions.every(c => evaluateCondition(c, ctx))
}

// ── Dialogue result types ───────────────────────────────────────────────────

export interface DialogueStartResult extends HandlerResult {
  activeDialogue: ActiveDialogue | null
}

export interface DialogueAdvanceResult extends HandlerResult {
  activeDialogue: ActiveDialogue | null
  /** Ended — no more nodes */
  ended: boolean
  /** Effects that the store must apply */
  effects: DialogueEffect[]
  /** Items to give player (store handles adding to inventory) */
  giveItemIds: string[]
  /** Items to take from player */
  takeItemIds: string[]
  xp: number
  gold: number
  flags: Record<string, boolean>
  /** Heal player to full */
  healFull: boolean
  /** Present a narrative choice */
  presentChoiceId?: string
  /** Unlock a room exit */
  unlockRoomId?: string
  /** Nimrodel song fragment gained */
  nimrodelFragment?: string
  /** Victory triggered */
  triggerVictory?: boolean
}

// ── Node text resolution ───────────────────────────────────────────────────

function resolveNodeText(node: DialogueNode, ctx: DialogueContext): string {
  if (node.npcTextVariants) {
    for (const variant of node.npcTextVariants) {
      if (evaluateCondition(variant.condition, ctx)) {
        return variant.text
      }
    }
  }
  return node.npcText
}

// ── Available options filtering ────────────────────────────────────────────

function filterOptions(options: DialogueOption[] | undefined, ctx: DialogueContext): DialogueOption[] {
  if (!options) return []
  return options.filter(opt => allConditionsPass(opt.conditions, ctx))
}

// ── Effect collection (pure — store applies them) ──────────────────────────

function collectEffects(effects: DialogueEffect[] | undefined): Pick<DialogueAdvanceResult, 'giveItemIds' | 'takeItemIds' | 'xp' | 'gold' | 'flags' | 'healFull' | 'presentChoiceId' | 'unlockRoomId' | 'nimrodelFragment' | 'triggerVictory'> {
  const result = {
    giveItemIds: [] as string[],
    takeItemIds: [] as string[],
    xp: 0,
    gold: 0,
    flags: {} as Record<string, boolean>,
    healFull: false,
    presentChoiceId: undefined as string | undefined,
    unlockRoomId: undefined as string | undefined,
    nimrodelFragment: undefined as string | undefined,
    triggerVictory: undefined as boolean | undefined,
  }
  if (!effects) return result
  for (const eff of effects) {
    switch (eff.type) {
      case 'giveItem':
        if (eff.itemId) result.giveItemIds.push(eff.itemId)
        break
      case 'takeItem':
        if (eff.itemId) result.takeItemIds.push(eff.itemId)
        break
      case 'setFlag':
        if (eff.flag) result.flags[eff.flag] = true
        break
      case 'giveXP':
        result.xp += eff.xp ?? 0
        break
      case 'giveGold':
        result.gold += eff.gold ?? 0
        break
      case 'healPlayer':
        result.healFull = true
        break
      case 'presentChoice':
        if (eff.choiceId) result.presentChoiceId = eff.choiceId
        break
      case 'unlockRoom':
        if (eff.roomId) result.unlockRoomId = eff.roomId
        break
      case 'giveNimrodelFragment':
        if (eff.fragmentId) result.nimrodelFragment = eff.fragmentId
        break
      case 'triggerVictory':
        result.triggerVictory = true
        break
    }
  }
  return result
}

// ── Render helpers ─────────────────────────────────────────────────────────

const OPTION_LABELS = ['A', 'B', 'C', 'D']

function renderNode(npcName: string, nodeText: string, availableOptions: DialogueOption[]): HandlerResult['logs'] {
  const logs: HandlerResult['logs'] = []
  logs.push(entry(`${npcName}: "${nodeText}"`, 'narrative'))
  if (availableOptions.length > 0) {
    logs.push(entry('', 'info'))
    availableOptions.forEach((opt, i) => {
      logs.push(entry(`  [${OPTION_LABELS[i]}] ${opt.label}`, 'info'))
    })
    logs.push(entry('(Type "choose A", "choose B", etc. to respond)', 'system'))
  } else {
    logs.push(entry('(The conversation ends.)', 'system'))
  }
  return logs
}

// ── Start dialogue ─────────────────────────────────────────────────────────

export function startDialogue(
  npc: NPC,
  ctx: DialogueContext,
): DialogueStartResult {
  const tree = npc.dialogueTree
  if (!tree) {
    return { logs: [], activeDialogue: null }
  }

  const rootNode = tree.nodes[tree.rootNodeId]
  if (!rootNode) {
    return { logs: [entry('The conversation goes nowhere.', 'error')], activeDialogue: null }
  }

  const logs: HandlerResult['logs'] = []
  logs.push(entry(`${npc.name}: ${npc.description}`, 'info'))

  // Collect onEnter effects from root (applied by store)
  const nodeText = resolveNodeText(rootNode, ctx)
  const availableOptions = filterOptions(rootNode.playerOptions, ctx)

  logs.push(...renderNode(npc.name, nodeText, availableOptions))

  return {
    logs,
    activeDialogue: {
      npcId: npc.id,
      currentNodeId: rootNode.id,
      availableOptions,
    },
  }
}

// ── Advance dialogue ───────────────────────────────────────────────────────

export function advanceDialogue(
  npc: NPC,
  activeDialogue: ActiveDialogue,
  optionLetter: string, // 'a' | 'b' | 'c' | 'd'
  ctx: DialogueContext,
): DialogueAdvanceResult {
  const emptyResult: DialogueAdvanceResult = {
    logs: [],
    activeDialogue: null,
    ended: true,
    effects: [],
    giveItemIds: [],
    takeItemIds: [],
    xp: 0,
    gold: 0,
    flags: {},
    healFull: false,
  }

  const tree = npc.dialogueTree
  if (!tree) return emptyResult

  const idx = OPTION_LABELS.indexOf(optionLetter.toUpperCase())
  if (idx === -1 || idx >= activeDialogue.availableOptions.length) {
    const valid = OPTION_LABELS.slice(0, activeDialogue.availableOptions.length).join(', ')
    return {
      ...emptyResult,
      ended: false,
      activeDialogue,
      logs: [entry(`Invalid choice. Valid options: ${valid}`, 'error')],
    }
  }

  const chosen = activeDialogue.availableOptions[idx]!
  const logs: HandlerResult['logs'] = []

  // Collect option effects
  const optEffects = collectEffects(chosen.effects)

  // Navigate to next node
  const nextNode = tree.nodes[chosen.nextNodeId]
  if (!nextNode) {
    return {
      ...emptyResult,
      ...optEffects,
      logs: [entry(`${npc.name} turns away.`, 'narrative')],
    }
  }

  // Collect onEnter effects
  const enterEffects = collectEffects(nextNode.onEnter)

  // Merge effects (option → enter)
  const merged = {
    giveItemIds: [...optEffects.giveItemIds, ...enterEffects.giveItemIds],
    takeItemIds: [...optEffects.takeItemIds, ...enterEffects.takeItemIds],
    xp: optEffects.xp + enterEffects.xp,
    gold: optEffects.gold + enterEffects.gold,
    flags: { ...optEffects.flags, ...enterEffects.flags },
    healFull: optEffects.healFull || enterEffects.healFull,
    presentChoiceId: optEffects.presentChoiceId ?? enterEffects.presentChoiceId,
    unlockRoomId: optEffects.unlockRoomId ?? enterEffects.unlockRoomId,
    nimrodelFragment: optEffects.nimrodelFragment ?? enterEffects.nimrodelFragment,
    triggerVictory: optEffects.triggerVictory || enterEffects.triggerVictory,
  }

  // Handle autoAdvance (NPC monologue chain — keep going to next node)
  let currentNode = nextNode
  while (currentNode.autoAdvance) {
    const nodeText = resolveNodeText(currentNode, ctx)
    logs.push(entry(`${npc.name}: "${nodeText}"`, 'narrative'))
    const next = tree.nodes[currentNode.autoAdvance]
    if (!next) break
    currentNode = next
    const autoEffects = collectEffects(currentNode.onEnter)
    merged.giveItemIds.push(...autoEffects.giveItemIds)
    merged.xp += autoEffects.xp
    merged.gold += autoEffects.gold
    Object.assign(merged.flags, autoEffects.flags)
    if (autoEffects.healFull) merged.healFull = true
    if (autoEffects.presentChoiceId) merged.presentChoiceId = autoEffects.presentChoiceId
    if (autoEffects.unlockRoomId) merged.unlockRoomId = autoEffects.unlockRoomId
  }

  const finalText = resolveNodeText(currentNode, ctx)
  const availableOptions = filterOptions(currentNode.playerOptions, ctx)
  logs.push(...renderNode(npc.name, finalText, availableOptions))

  const ended = availableOptions.length === 0
  return {
    logs,
    activeDialogue: ended ? null : {
      npcId: npc.id,
      currentNodeId: currentNode.id,
      availableOptions,
    },
    ended,
    effects: [],
    ...merged,
  }
}

// ── Re-enter dialogue at root (re-talk) ────────────────────────────────────

export function reopenDialogue(
  npc: NPC,
  ctx: DialogueContext,
): DialogueStartResult {
  return startDialogue(npc, ctx)
}
