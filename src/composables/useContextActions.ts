import { computed } from 'vue'
import { useGameStore } from '../stores/gameStore'
import { usePlayerStore } from '../stores/playerStore'
import { useCombatStore } from '../stores/combatStore'
import { itemDb, allNPCs, allRoomNPCs } from '../data/world'
import { canRest } from '../engine/handlers/restHandler'

/** Chip color families, mapped to classes in ActionChips.vue */
export type ActionVariant = 'choice' | 'danger' | 'arcane' | 'loot' | 'neutral'

export interface ContextAction {
  key: string
  label: string
  /** Secondary text rendered dimmer after the label (e.g. "x2", cooldown) */
  sub?: string
  /** Command sent to the game engine, or FOCUS_INPUT to open the command input */
  command: string
  variant: ActionVariant
  disabled?: boolean
}

/** Sentinel command: open/focus the free-text command input instead. */
export const FOCUS_INPUT = '__focus-input__'

interface DedupedItem {
  id: string
  name: string
  type: string
  count: number
}

function dedup(items: { id: string; name: string; type: string }[]): DedupedItem[] {
  const map = new Map<string, DedupedItem>()
  for (const item of items) {
    const existing = map.get(item.id)
    if (existing) existing.count++
    else map.set(item.id, { id: item.id, name: item.name, type: item.type, count: 1 })
  }
  return Array.from(map.values())
}

/**
 * The single source of truth for "what can the player do right now",
 * rendered as tappable chips on every screen size.
 */
export function useContextActions() {
  const gameStore = useGameStore()
  const playerStore = usePlayerStore()
  const combatStore = useCombatStore()

  const actions = computed<ContextAction[]>(() => {
    const player = playerStore.player
    if (!player || gameStore.phase !== 'playing') return []

    // ── Dialogue in progress: options replace everything else ──
    const dialogue = gameStore.activeDialogue
    if (dialogue) {
      return dialogue.availableOptions.map((opt, i) => {
        const letter = String.fromCharCode(65 + i)
        return {
          key: `dlg-${opt.id}`,
          label: `${letter}. ${opt.label}`,
          command: `choose ${letter.toLowerCase()}`,
          variant: 'choice' as const,
        }
      })
    }

    // ── Story choice in progress: options replace everything else ──
    const choice = gameStore.activeChoice
    if (choice) {
      return choice.options.map(opt => ({
        key: `choice-${opt.id}`,
        label: opt.label,
        command: `choose ${opt.id}`,
        variant: 'choice' as const,
      }))
    }

    const result: ContextAction[] = []

    // ── Combat ──
    if (combatStore.inCombat) {
      for (const enemy of combatStore.livingEnemies) {
        result.push({
          key: `atk-${enemy.instanceId}`,
          label: `⚔ ${enemy.name}`,
          command: `attack ${enemy.name}`,
          variant: 'danger',
        })
      }
      for (const spell of player.spells.filter(s => s.id !== 'light')) {
        const onCooldown = spell.currentCooldown > 0
        result.push({
          key: `spell-${spell.id}`,
          label: `✦ ${spell.name}`,
          sub: onCooldown ? `(${spell.currentCooldown})` : undefined,
          command: `cast ${spell.name}`,
          variant: 'arcane',
          disabled: onCooldown,
        })
      }
      for (const item of dedup(playerStore.inventory.filter(i => i.type === 'potion'))) {
        result.push({
          key: `use-${item.id}`,
          label: `Use ${item.name}`,
          sub: item.count > 1 ? `x${item.count}` : undefined,
          command: `use ${item.name}`,
          variant: 'loot',
        })
      }
      result.push({ key: 'flee', label: 'Flee', command: 'flee', variant: 'neutral' })
      return result
    }

    // ── Exploration ──
    // Active encounter prompts
    const enc = gameStore.activeEncounter
    if (enc?.type === 'riddle') {
      result.push({ key: 'riddle', label: '❝ Answer the riddle…', command: FOCUS_INPUT, variant: 'choice' })
    } else if (enc?.type === 'merchant') {
      result.push({ key: 'trade', label: 'Trade', command: 'trade', variant: 'loot' })
    }

    // Loot on the ground
    const groundIds = gameStore.roomItems[gameStore.currentRoomId] || []
    const groundItems = groundIds.map(id => itemDb[id]).filter((i): i is NonNullable<typeof i> => !!i)
    for (const item of dedup(groundItems)) {
      result.push({
        key: `take-${item.id}`,
        label: `Take ${item.name}`,
        sub: item.count > 1 ? `x${item.count}` : undefined,
        command: `take ${item.name}`,
        variant: 'loot',
      })
    }

    // NPCs to talk to (in darkness only those the player can sense)
    const dark = gameStore.isDark()
    for (const npcId of allRoomNPCs[gameStore.currentRoomId] ?? []) {
      const npc = allNPCs[npcId]
      if (!npc) continue
      if (dark && !npc.detectableInDark) continue
      result.push({
        key: `talk-${npc.id}`,
        label: `Talk to ${npc.name}`,
        command: `talk ${npc.name}`,
        variant: 'neutral',
      })
    }

    // Usable / equippable inventory
    const usable = playerStore.inventory.filter(item => {
      if (item.type === 'potion') return true
      if (item.type === 'weapon' && item.id !== player.equippedWeapon) return true
      if (item.type === 'armor' && item.id !== player.equippedArmor) return true
      return false
    })
    for (const item of dedup(usable)) {
      const isGear = item.type === 'weapon' || item.type === 'armor'
      result.push({
        key: `inv-${item.id}`,
        label: `${isGear ? 'Equip' : 'Use'} ${item.name}`,
        sub: item.count > 1 ? `x${item.count}` : undefined,
        command: `${isGear ? 'equip' : 'use'} ${item.name}`,
        variant: isGear ? 'arcane' : 'loot',
      })
    }

    // Forge
    if (gameStore.currentRoom?.craftingStation) {
      result.push({ key: 'craft', label: '🔥 Forge Item', command: 'craft', variant: 'danger' })
    }

    // Rest — only when the engine would allow it
    const room = gameStore.currentRoom
    if (room) {
      const hasEnemies = !!(room.enemies && room.enemies.length > 0)
      const restCheck = canRest(
        false,
        hasEnemies,
        gameStore.clearedRooms.has(room.id),
        gameStore.restedRooms.has(room.id),
      )
      if (restCheck.allowed) {
        result.push({ key: 'rest', label: 'Rest', command: 'rest', variant: 'neutral' })
      }
    }

    result.push({ key: 'look', label: 'Look', command: 'look', variant: 'neutral' })
    return result
  })

  return { actions }
}
