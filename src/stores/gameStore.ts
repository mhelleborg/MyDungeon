import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { GameLogEntry, ParsedCommand } from '../types/command'
import { rooms, getRoom, STARTING_ROOM } from '../data/rooms'
import { items as itemDb } from '../data/items'
import { parseCommand } from '../engine/commandParser'
import { rollAmbientEvent } from '../engine/ambientEvents'
import { validateMove } from '../engine/handlers/moveHandler'
import { describeRoom, describeLook } from '../engine/handlers/roomHandler'
import { triggerTrap, attemptDisarm } from '../engine/handlers/trapHandler'
import { tickLight as tickLightPure, lightTorch, castLightSpell, type LightState } from '../engine/handlers/lightHandler'
import { attemptFlee, attemptStealth } from '../engine/handlers/fleeHandler'
import { canRest, resolveRest } from '../engine/handlers/restHandler'
import { talkToNPC, listTradeOffers, buyFromNPC } from '../engine/handlers/npcHandler'
import { attemptPuzzle, getPuzzleHint } from '../engine/handlers/puzzleHandler'
import { roomInteractions, trapDestroyText } from '../data/roomInteractions'
import { examineInteraction, resolveSearch } from '../engine/handlers/interactHandler'
import { npcs, roomNPCs } from '../data/npcs'
import { puzzles, roomPuzzles } from '../data/puzzles'
import type { DifficultyLevel } from '../types/difficulty'
import { difficultySettings } from '../types/difficulty'
import { playSound } from '../engine/audio'
import { usePlayerStore } from './playerStore'
import { useCombatStore } from './combatStore'
import { useStatsStore } from './statsStore'

export type GamePhase = 'title' | 'character-select' | 'playing' | 'game-over' | 'victory'

export const useGameStore = defineStore('game', () => {
  // ── State ──────────────────────────────────────────────────
  const phase = ref<GamePhase>('title')
  const difficulty = ref<DifficultyLevel>('normal')
  const currentRoomId = ref(STARTING_ROOM)
  const gameLog = ref<GameLogEntry[]>([])
  const visitedRooms = ref<Set<string>>(new Set())
  const clearedRooms = ref<Set<string>>(new Set())
  const roomItems = ref<Record<string, string[]>>({})
  const disarmedTraps = ref<Set<string>>(new Set())
  const hasLight = ref(false)
  const lightTurnsRemaining = ref(0)
  const permanentLight = ref(false)
  const previousRoomId = ref<string | null>(null)
  const restedRooms = ref<Set<string>>(new Set())
  const interactedNPCs = ref<Set<string>>(new Set())
  const solvedPuzzles = ref<Set<string>>(new Set())
  const revealedExits = ref<Set<string>>(new Set())
  const destroyedTraps = ref<Set<string>>(new Set())
  const searchedInteractions = ref<Set<string>>(new Set())

  const currentRoom = computed(() => getRoom(currentRoomId.value))

  // ── Helpers ────────────────────────────────────────────────
  function log(text: string, type: GameLogEntry['type'] = 'narrative') {
    gameLog.value.push({ text, type, timestamp: Date.now() })
  }

  function pushLogs(logs: GameLogEntry[]) {
    for (const l of logs) gameLog.value.push(l)
  }

  function groundItemNames(roomId: string): string[] {
    const ids = roomItems.value[roomId]
    if (!ids || ids.length === 0) return []
    return ids.map(id => itemDb[id]?.name || id)
  }

  function isDark(roomId?: string): boolean {
    const room = getRoom(roomId ?? currentRoomId.value)
    return !!room?.dark && !hasLight.value
  }

  function getDifficultyMultipliers() {
    return difficultySettings[difficulty.value]
  }

  function applyLightState(state: LightState) {
    hasLight.value = state.hasLight
    lightTurnsRemaining.value = state.turnsRemaining
    permanentLight.value = state.permanent
  }

  function checkDeath(): boolean {
    const playerStore = usePlayerStore()
    if (!playerStore.isAlive) {
      playSound('death')
      phase.value = 'game-over'
      return true
    }
    return false
  }

  function markRoomCleared() {
    const combatStore = useCombatStore()
    if (!combatStore.inCombat) {
      clearedRooms.value.add(currentRoomId.value)
      useStatsStore().checkMidRunAchievements()
    }
  }

  // ── Init ───────────────────────────────────────────────────
  function initGame() {
    gameLog.value = []
    visitedRooms.value = new Set()
    clearedRooms.value = new Set()
    disarmedTraps.value = new Set()
    currentRoomId.value = STARTING_ROOM
    previousRoomId.value = null
    restedRooms.value = new Set()
    interactedNPCs.value = new Set()
    solvedPuzzles.value = new Set()
    revealedExits.value = new Set()
    destroyedTraps.value = new Set()
    searchedInteractions.value = new Set()
    applyLightState({ hasLight: false, turnsRemaining: 0, permanent: false })

    roomItems.value = {}
    for (const [id, room] of Object.entries(rooms)) {
      if (room.items && room.items.length > 0) {
        roomItems.value[id] = [...room.items]
      }
    }

    // Init stats for this run
    const playerStore = usePlayerStore()
    const statsStore = useStatsStore()
    statsStore.initStats(
      playerStore.player!.class,
      difficulty.value,
      Object.keys(rooms).length,
    )

    enterRoom(STARTING_ROOM)
  }

  // ── Room entry ─────────────────────────────────────────────
  function enterRoom(roomId: string) {
    const room = getRoom(roomId)
    if (!room) {
      log('You cannot go that way.', 'error')
      return
    }

    if (currentRoomId.value !== roomId) {
      previousRoomId.value = currentRoomId.value
    }
    currentRoomId.value = roomId
    const wasNew = !visitedRooms.value.has(roomId)
    visitedRooms.value.add(roomId)
    if (wasNew) {
      useStatsStore().recordRoomExplored()
    }

    // Describe room (pure handler)
    const dark = isDark(roomId)
    const cleared = clearedRooms.value.has(roomId)
    const desc = describeRoom(room, dark, cleared, groundItemNames(roomId), revealedExits.value)
    pushLogs(desc.logs)

    // Reveal light-gated hidden exits
    if (!dark) {
      for (const exit of room.exits) {
        if (exit.hidden && exit.revealMethod === 'light') {
          const key = `${roomId}-${exit.direction}`
          if (!revealedExits.value.has(key)) {
            revealedExits.value.add(key)
            useStatsStore().recordSecretFound()
            log(`The light reveals a hidden passage to the ${exit.direction}!`, 'loot')
          }
        }
      }
    }

    // Ambient event
    const ambientEvent = rollAmbientEvent(roomId)
    if (ambientEvent) {
      log(ambientEvent, 'narrative')
    }

    // NPCs
    const npcIds = roomNPCs[roomId]
    if (npcIds) {
      for (const npcId of npcIds) {
        const npc = npcs[npcId]
        if (npc) {
          if (dark && npc.detectableInDark) {
            log(`You hear a voice in the darkness: "${npc.name} calls out to you."`, 'narrative')
          } else if (!dark) {
            log(`${npc.name} is here.`, 'info')
          }
        }
      }
    }

    // Trap (pure handler)
    if (room.trap && !disarmedTraps.value.has(roomId)) {
      const playerStore = usePlayerStore()
      if (playerStore.player) {
        const trapResult = triggerTrap(room.trap)
        pushLogs(trapResult.logs)
        playerStore.player.hp -= trapResult.damage
        if (trapResult.damage > 0) useStatsStore().recordDamageTaken(trapResult.damage)
        if (playerStore.player.hp <= 0) {
          playerStore.player.hp = 0
          log('You have fallen in the darkness of Moria...', 'narrative')
          phase.value = 'game-over'
          return
        }
      }
    }

    // Combat
    if (room.enemies && room.enemies.length > 0 && !clearedRooms.value.has(roomId)) {
      const combatStore = useCombatStore()
      pushLogs(combatStore.startCombat(room.enemies, dark))
    }

    // Mid-run achievements
    useStatsStore().checkMidRunAchievements()

    // Victory
    if (roomId === 'east-gate') {
      log('You emerge from the darkness into blinding sunlight. The Mines of Moria lie behind you.', 'narrative')
      log('You have survived the crossing of Moria!', 'system')
      useStatsStore().checkEndOfRun()
      phase.value = 'victory'
    }
  }

  // ── Command routing ────────────────────────────────────────
  function handleCommand(input: string) {
    const playerStore = usePlayerStore()
    const cmd = parseCommand(input)

    log(`> ${input}`, 'system')

    if (!playerStore.isAlive) {
      log('You are dead. The darkness claims you.', 'error')
      return
    }

    switch (cmd.type) {
      case 'move':    handleMove(cmd); break
      case 'look':    handleLook(); break
      case 'examine': handleExamine(cmd); break
      case 'attack':  handleAttack(cmd); break
      case 'cast':    handleCast(cmd); break
      case 'take':    handleTake(cmd); break
      case 'drop':    handleDrop(cmd); break
      case 'use':     handleUse(cmd); break
      case 'equip':   handleEquip(cmd); break
      case 'search':  handleSearch(cmd); break
      case 'destroy': handleDestroy(); break
      case 'disarm':  handleDisarm(); break
      case 'flee':    handleFlee(); break
      case 'sneak':   handleSneak(cmd); break
      case 'rest':    handleRest(); break
      case 'talk':    handleTalk(cmd); break
      case 'trade':   handleTrade(cmd); break
      case 'say':     handleSay(cmd); break
      case 'solve':   handleSolve(cmd); break
      case 'inventory': handleInventory(); break
      case 'stats':   handleStats(); break
      case 'help':    handleHelp(); break
      case 'map':     log('Check the minimap on the right side of your screen.', 'info'); break
      case 'unknown': {
        // Check for boss fight special commands
        const combatStore2 = useCombatStore()
        if (combatStore2.isBossFight) {
          const lower = input.toLowerCase()
          if (lower.includes('stand') || lower.includes('fall back') || lower.includes('break')) {
            const bossLogs = combatStore2.handleBossChoice(input)
            pushLogs(bossLogs)
            markRoomCleared()
            checkDeath()
            break
          }
        }
        log(`I don't understand "${input}". Type "help" for available commands.`, 'error')
        break
      }
    }

    // Tick light (skip info-only commands)
    if (!['help', 'stats', 'inventory', 'map'].includes(cmd.type)) {
      const result = tickLightPure({
        hasLight: hasLight.value,
        turnsRemaining: lightTurnsRemaining.value,
        permanent: permanentLight.value,
      })
      pushLogs(result.logs)
      applyLightState(result.newState)
    }
  }

  // ── Move ───────────────────────────────────────────────────
  function handleMove(cmd: ParsedCommand) {
    const combatStore = useCombatStore()
    if (combatStore.inCombat) {
      log('You cannot move while in combat! Try "flee" to escape.', 'error')
      return
    }

    const room = currentRoom.value
    if (!room || !cmd.target) return

    const playerStore = usePlayerStore()
    const check = validateMove(
      room,
      cmd.target,
      playerStore.inventory,
      clearedRooms.value,
      playerStore.player?.abilities,
      revealedExits.value,
    )
    pushLogs(check.logs)

    if (check.allowed && check.exit) {
      playSound('door')
      enterRoom(check.exit.targetRoomId)
    }
  }

  // ── Look ───────────────────────────────────────────────────
  function handleLook() {
    const room = currentRoom.value
    if (!room) return
    const result = describeLook(room, isDark(), clearedRooms.value.has(currentRoomId.value), groundItemNames(currentRoomId.value), revealedExits.value)
    pushLogs(result.logs)
  }

  // ── Examine ────────────────────────────────────────────────
  function handleExamine(cmd: ParsedCommand) {
    if (!cmd.target) { handleLook(); return }

    const playerStore = usePlayerStore()
    const item = playerStore.inventory.find(i =>
      i.name.toLowerCase().includes(cmd.target!.toLowerCase())
    )
    if (item) { log(`${item.name}: ${item.description}`, 'info'); return }

    const combatStore = useCombatStore()
    const enemy = combatStore.livingEnemies.find(e =>
      e.name.toLowerCase().includes(cmd.target!.toLowerCase())
    )
    if (enemy) {
      log(`${enemy.name}: ${enemy.description} (HP: ${enemy.hp}/${enemy.maxHp}, AC: ${enemy.ac})`, 'info')
      return
    }

    // Check for puzzle hints (examine runes, levers, inscription, doors, etc.)
    const puzzleIds = roomPuzzles[currentRoomId.value]
    if (puzzleIds) {
      const examineTerms = ['rune', 'lever', 'inscription', 'door', 'forge', 'wall', 'symbol', 'carving', 'gargoyle', 'ledge', 'stair', 'shaft']
      const target = cmd.target!.toLowerCase()
      if (examineTerms.some(t => target.includes(t))) {
        for (const pid of puzzleIds) {
          const puzzle = puzzles[pid]
          if (puzzle) {
            const hintResult = getPuzzleHint(puzzle)
            pushLogs(hintResult.logs)
            return
          }
        }
      }
    }

    // Check room interactions (data-driven examine responses)
    const interactions = roomInteractions[currentRoomId.value]
    if (interactions) {
      const result = examineInteraction(
        interactions,
        cmd.target!,
        clearedRooms.value.has(currentRoomId.value),
        disarmedTraps.value.has(currentRoomId.value),
        destroyedTraps.value.has(currentRoomId.value),
      )
      if (result.found) { pushLogs(result.logs); return }
    }

    // Check for hidden exits revealed by examining (walls, floor, etc.)
    const examTarget = cmd.target!.toLowerCase()
    if (['wall', 'walls', 'floor', 'stone', 'passage', 'crack'].some(t => examTarget.includes(t))) {
      const room = currentRoom.value
      if (room) {
        for (const exit of room.exits) {
          if (exit.hidden && exit.revealMethod === 'examine') {
            const key = `${currentRoomId.value}-${exit.direction}`
            if (!revealedExits.value.has(key)) {
              revealedExits.value.add(key)
              useStatsStore().recordSecretFound()
              log(`You discover a hidden passage to the ${exit.direction}!`, 'loot')
              return
            }
          }
        }
      }
    }

    // Check for NPC examine
    const npcIds = roomNPCs[currentRoomId.value]
    if (npcIds) {
      const npc = npcIds.map(id => npcs[id]).find(n => n && n.name.toLowerCase().includes(cmd.target!.toLowerCase()))
      if (npc) {
        log(`${npc.name}: ${npc.description}`, 'info')
        return
      }
    }

    // Dynamic examine: floor/ground/items
    if (['floor', 'ground', 'items'].some(t => examTarget.includes(t))) {
      const groundItems = roomItems.value[currentRoomId.value]
      if (groundItems && groundItems.length > 0) {
        const names = groundItems.map(id => itemDb[id]?.name || id).join(', ')
        log(`On the ground you see: ${names}.`, 'info')
      } else if (clearedRooms.value.has(currentRoomId.value)) {
        log('The floor is littered with the aftermath of battle, but nothing of value remains.', 'info')
      } else {
        log('The ancient stone floor stretches before you, worn smooth by ages of use.', 'info')
      }
      return
    }

    // Dynamic examine: body/corpse/bones
    if (['body', 'corpse', 'bones'].some(t => examTarget.includes(t))) {
      const combatStore = useCombatStore()
      if (combatStore.inCombat) {
        log('The enemies are still very much alive!', 'info')
      } else if (clearedRooms.value.has(currentRoomId.value)) {
        log('The bodies of the fallen lie where they dropped. Their fighting days are over.', 'info')
      } else {
        log('You see old bones scattered about — remnants of those who came before you.', 'info')
      }
      return
    }

    // Dynamic examine: room/area/surroundings → delegate to look
    if (['room', 'area', 'surroundings', 'around'].some(t => examTarget.includes(t))) {
      handleLook()
      return
    }

    // Examine ground items by name
    const groundItems = roomItems.value[currentRoomId.value]
    if (groundItems) {
      const groundItem = groundItems.map(id => itemDb[id]).find(i => i && i.name.toLowerCase().includes(cmd.target!.toLowerCase()))
      if (groundItem) {
        log(`${groundItem.name}: ${groundItem.description}`, 'info')
        return
      }
    }

    log(`You see nothing special about "${cmd.target}".`, 'info')
  }

  // ── Attack ─────────────────────────────────────────────────
  function handleAttack(cmd: ParsedCommand) {
    const combatStore = useCombatStore()
    if (!combatStore.inCombat) { log('There is nothing to attack here.', 'error'); return }

    pushLogs(combatStore.doPlayerAttack(cmd.target))
    markRoomCleared()
    checkDeath()
  }

  // ── Cast ───────────────────────────────────────────────────
  function handleCast(cmd: ParsedCommand) {
    const playerStore = usePlayerStore()
    if (!playerStore.player) return
    if (!cmd.target) { log('Cast what spell? Usage: cast <spell name>', 'error'); return }

    // Light spell — works outside combat
    if (cmd.target.toLowerCase() === 'light') {
      const spell = playerStore.player.spells.find(s => s.id === 'light')
      if (spell) {
        applyLightState(castLightSpell())
        log('A warm light emanates from your staff, illuminating the darkness with magical radiance.', 'info')
        if (currentRoom.value?.dark) handleLook()
        return
      }
    }

    const combatStore = useCombatStore()
    if (!combatStore.inCombat) { log('You can only cast combat spells during battle.', 'error'); return }

    pushLogs(combatStore.doPlayerCast(cmd.target))
    markRoomCleared()
    checkDeath()
  }

  // ── Take ───────────────────────────────────────────────────
  function handleTake(cmd: ParsedCommand) {
    const combatStore = useCombatStore()
    if (combatStore.inCombat) { log('You\'re in combat! Focus on the fight!', 'error'); return }
    if (!cmd.target) { log('Take what?', 'error'); return }

    const groundItems = roomItems.value[currentRoomId.value]
    if (!groundItems || groundItems.length === 0) { log('There is nothing here to take.', 'error'); return }

    const idx = groundItems.findIndex(id => {
      const item = itemDb[id]
      return item && item.name.toLowerCase().includes(cmd.target!.toLowerCase())
    })
    if (idx === -1) { log(`You don't see any "${cmd.target}" here.`, 'error'); return }

    const itemId = groundItems[idx]!
    const item = itemDb[itemId]
    if (!item) return

    groundItems.splice(idx, 1)
    const playerStore = usePlayerStore()

    // Gold goes directly to gold count, not inventory
    if (itemId === 'gold-coins') {
      const amount = item.quantity || item.value || 10
      if (playerStore.player) {
        playerStore.player.gold += amount
        log(`Picked up ${amount} gold coins. (Total: ${playerStore.player.gold}g)`, 'loot')
      }
      useStatsStore().recordItemFound(item.id)
      return
    }

    pushLogs(playerStore.addItem(item))
    useStatsStore().recordItemFound(item.id)
  }

  // ── Drop ───────────────────────────────────────────────────
  function handleDrop(cmd: ParsedCommand) {
    if (!cmd.target) { log('Drop what?', 'error'); return }
    const playerStore = usePlayerStore()
    const item = playerStore.inventory.find(i =>
      i.name.toLowerCase().includes(cmd.target!.toLowerCase())
    )
    if (!item) { log(`You don't have any "${cmd.target}".`, 'error'); return }
    playerStore.removeItem(item.id)
    if (!roomItems.value[currentRoomId.value]) roomItems.value[currentRoomId.value] = []
    roomItems.value[currentRoomId.value]!.push(item.id)
    log(`You drop the ${item.name}.`, 'info')
  }

  // ── Use ────────────────────────────────────────────────────
  function handleUse(cmd: ParsedCommand) {
    if (!cmd.target) { log('Use what?', 'error'); return }
    const playerStore = usePlayerStore()
    const item = playerStore.inventory.find(i =>
      i.name.toLowerCase().includes(cmd.target!.toLowerCase())
    )
    if (!item) {
      // Check for room use-actions (e.g. fire pit)
      const roomInts = roomInteractions[currentRoomId.value]
      if (roomInts) {
        const target = cmd.target!.toLowerCase()
        const match = roomInts.find(i =>
          i.action?.verb === 'use' && i.keywords.some(k => target.includes(k))
        )
        if (match?.action) {
          if (match.action.requiresCleared && !clearedRooms.value.has(currentRoomId.value)) {
            log('It\'s too dangerous to do that while enemies are nearby!', 'error')
            return
          }
          log(match.action.successText, 'info')
          if (match.action.grantsLight) {
            applyLightState(lightTorch())
            if (currentRoom.value?.dark) handleLook()
          }
          return
        }
      }
      log(`You don't have any "${cmd.target}".`, 'error')
      return
    }

    if (item.id === 'torch') {
      applyLightState(lightTorch())
      playerStore.removeItem('torch')
      log('You light the torch. Flickering shadows dance on the ancient stone walls.', 'info')
      if (currentRoom.value?.dark) handleLook()
      return
    }

    if (item.type === 'potion') {
      useStatsStore().recordPotionUsed()
      playSound('potion')
    }
    pushLogs(playerStore.useItem(item.id, getDifficultyMultipliers().healing))
  }

  // ── Equip ──────────────────────────────────────────────────
  function handleEquip(cmd: ParsedCommand) {
    if (!cmd.target) { log('Equip what?', 'error'); return }
    const playerStore = usePlayerStore()
    const item = playerStore.inventory.find(i =>
      i.name.toLowerCase().includes(cmd.target!.toLowerCase())
    )
    if (!item) { log(`You don't have any "${cmd.target}".`, 'error'); return }
    pushLogs(playerStore.equipItem(item.id))
  }

  // ── Search ───────────────────────────────────────────────────
  function handleSearch(cmd: ParsedCommand) {
    const combatStore = useCombatStore()
    if (combatStore.inCombat) { log('You can\'t search while in combat!', 'error'); return }
    if (!cmd.target) { log('Search what? Usage: search <target>', 'error'); return }

    const interactions = roomInteractions[currentRoomId.value]
    if (!interactions) { log('There is nothing worth searching here.', 'info'); return }

    const target = cmd.target.toLowerCase()
    const match = interactions.find(i =>
      i.action?.verb === 'search' && i.keywords.some(k => target.includes(k))
    )
    if (!match?.action) { log(`You don't see anything to search matching "${cmd.target}".`, 'info'); return }

    const searchKey = `${currentRoomId.value}:${match.keywords[0]}`
    if (searchedInteractions.value.has(searchKey)) {
      log('You have already searched here thoroughly. There is nothing more to find.', 'info')
      return
    }

    if (match.action.requiresCleared && !clearedRooms.value.has(currentRoomId.value)) {
      log('It\'s too dangerous to search here while enemies lurk nearby!', 'error')
      return
    }

    const playerStore = usePlayerStore()
    if (!playerStore.player) return

    const result = resolveSearch(match, playerStore.player.abilities)
    pushLogs(result.logs)
    searchedInteractions.value.add(searchKey)

    if (result.success && result.rewardItems) {
      for (const itemId of result.rewardItems) {
        if (!roomItems.value[currentRoomId.value]) roomItems.value[currentRoomId.value] = []
        roomItems.value[currentRoomId.value]!.push(itemId)
      }
    }
  }

  // ── Destroy ─────────────────────────────────────────────────
  function handleDestroy() {
    const combatStore = useCombatStore()
    if (combatStore.inCombat) { log('You can\'t do that while in combat!', 'error'); return }

    const room = currentRoom.value
    if (!room) return

    if (!room.trap) { log('There is nothing to destroy here.', 'error'); return }

    if (destroyedTraps.value.has(currentRoomId.value)) {
      log('The trap here has already been destroyed.', 'info')
      return
    }

    if (!disarmedTraps.value.has(currentRoomId.value)) {
      log('The trap is still armed! You should disarm it first before trying to destroy it.', 'error')
      return
    }

    destroyedTraps.value.add(currentRoomId.value)
    const destroyText = trapDestroyText[currentRoomId.value]
    if (destroyText) {
      log(destroyText, 'info')
    } else {
      log('You destroy the trap mechanism. It will trouble no one else.', 'info')
    }
  }

  // ── Disarm ─────────────────────────────────────────────────
  function handleDisarm() {
    const room = currentRoom.value
    if (!room) return
    if (!room.trap) { log('There is nothing to disarm here.', 'error'); return }
    if (disarmedTraps.value.has(currentRoomId.value)) { log('The trap here has already been disarmed.', 'info'); return }

    const playerStore = usePlayerStore()
    if (!playerStore.player) return

    const result = attemptDisarm(room.trap, playerStore.player.abilities)
    pushLogs(result.logs)

    if (result.trapSpent) disarmedTraps.value.add(currentRoomId.value)
    if (result.damage > 0) {
      playerStore.player.hp -= result.damage
      if (playerStore.player.hp <= 0) {
        playerStore.player.hp = 0
        log('You have fallen in the darkness of Moria...', 'narrative')
        phase.value = 'game-over'
      }
    }
  }

  // ── Flee ────────────────────────────────────────────────────
  function handleFlee() {
    const combatStore = useCombatStore()
    if (!combatStore.inCombat) { log('There is nothing to flee from.', 'error'); return }

    const playerStore = usePlayerStore()
    if (!playerStore.player) return

    useStatsStore().recordFleeAttempt()
    const result = attemptFlee(playerStore.player.abilities)
    pushLogs(result.logs)

    if (result.escaped) {
      combatStore.endCombat()
      // Room NOT marked as cleared
      const dest = previousRoomId.value
      if (dest) {
        enterRoom(dest)
      }
    } else {
      // Enemies get a free attack round
      pushLogs(combatStore.doEnemyTurns())
      checkDeath()
    }
  }

  // ── Sneak ──────────────────────────────────────────────────
  function handleSneak(cmd: ParsedCommand) {
    const combatStore = useCombatStore()
    if (combatStore.inCombat) { log('You can\'t sneak while in combat!', 'error'); return }
    if (!cmd.target) { log('Sneak which direction? Usage: sneak <direction>', 'error'); return }

    const room = currentRoom.value
    if (!room) return

    const playerStore = usePlayerStore()
    if (!playerStore.player) return

    // First validate movement is possible
    const moveCheck = validateMove(room, cmd.target, playerStore.inventory, clearedRooms.value, playerStore.player.abilities, revealedExits.value)
    if (!moveCheck.allowed || !moveCheck.exit) {
      pushLogs(moveCheck.logs)
      return
    }

    const targetRoom = getRoom(moveCheck.exit.targetRoomId)
    if (!targetRoom) return

    // If no enemies or already cleared, just move normally
    if (!targetRoom.enemies || targetRoom.enemies.length === 0 || clearedRooms.value.has(targetRoom.id)) {
      pushLogs(moveCheck.logs)
      enterRoom(moveCheck.exit.targetRoomId)
      return
    }

    // Attempt stealth
    const enemyIds = targetRoom.enemies.map(e => e.enemyId)
    const stealthResult = attemptStealth(playerStore.player.abilities, enemyIds)
    pushLogs(stealthResult.logs)

    if (stealthResult.success) {
      useStatsStore().recordSneakSuccess()
      // Enter without triggering combat
      previousRoomId.value = currentRoomId.value
      currentRoomId.value = moveCheck.exit.targetRoomId
      visitedRooms.value.add(moveCheck.exit.targetRoomId)

      const dark = isDark(moveCheck.exit.targetRoomId)
      const desc = describeRoom(targetRoom, dark, false, groundItemNames(moveCheck.exit.targetRoomId), revealedExits.value)
      pushLogs(desc.logs)

      const ambientEvent = rollAmbientEvent(moveCheck.exit.targetRoomId)
      if (ambientEvent) log(ambientEvent, 'narrative')

      // Trap still triggers even when sneaking
      if (targetRoom.trap && !disarmedTraps.value.has(targetRoom.id)) {
        const trapResult = triggerTrap(targetRoom.trap)
        pushLogs(trapResult.logs)
        playerStore.player.hp -= trapResult.damage
        if (playerStore.player.hp <= 0) {
          playerStore.player.hp = 0
          log('You have fallen in the darkness of Moria...', 'narrative')
          phase.value = 'game-over'
        }
      }
    } else {
      // Enter room with surprise round for enemies
      previousRoomId.value = currentRoomId.value
      currentRoomId.value = moveCheck.exit.targetRoomId
      visitedRooms.value.add(moveCheck.exit.targetRoomId)

      const dark = isDark(moveCheck.exit.targetRoomId)
      const desc = describeRoom(targetRoom, dark, false, groundItemNames(moveCheck.exit.targetRoomId), revealedExits.value)
      pushLogs(desc.logs)

      if (targetRoom.trap && !disarmedTraps.value.has(targetRoom.id)) {
        const trapResult = triggerTrap(targetRoom.trap)
        pushLogs(trapResult.logs)
        playerStore.player.hp -= trapResult.damage
        if (playerStore.player.hp <= 0) {
          playerStore.player.hp = 0
          log('You have fallen in the darkness of Moria...', 'narrative')
          phase.value = 'game-over'
          return
        }
      }

      pushLogs(combatStore.startCombatWithSurprise(targetRoom.enemies!, dark))
      checkDeath()
    }
  }

  // ── NPC Talk/Trade ──────────────────────────────────────────
  function findNPCInRoom(target?: string) {
    const npcIds = roomNPCs[currentRoomId.value]
    if (!npcIds || npcIds.length === 0) return undefined
    if (target) {
      return npcIds
        .map(id => npcs[id])
        .find(n => n && n.name.toLowerCase().includes(target.toLowerCase()))
    }
    return npcs[npcIds[0]!]
  }

  function handleTalk(cmd: ParsedCommand) {
    const npc = findNPCInRoom(cmd.target)
    if (!npc) { log('There is no one here to talk to.', 'error'); return }

    const playerStore = usePlayerStore()
    const result = talkToNPC(npc, isDark(), interactedNPCs.value.has(npc.id))
    pushLogs(result.logs)

    if (result.questRewardItemId) {
      const item = itemDb[result.questRewardItemId]
      if (item && playerStore.player) {
        pushLogs(playerStore.addItem(item))
        interactedNPCs.value.add(npc.id)
      }
    }
  }

  function handleTrade(cmd: ParsedCommand) {
    const npc = findNPCInRoom()
    if (!npc) { log('There is no one here to trade with.', 'error'); return }

    if (isDark() && npc.requiresLight) {
      log('It is too dark to trade here.', 'error')
      return
    }

    const playerStore = usePlayerStore()
    if (!playerStore.player) return

    // If no target, list offers
    if (!cmd.target) {
      const result = listTradeOffers(npc, (id) => itemDb[id])
      pushLogs(result.logs)
      return
    }

    // Attempt purchase
    const result = buyFromNPC(npc, cmd.target, playerStore.player.gold, (id) => itemDb[id])
    pushLogs(result.logs)

    if (result.success && result.itemId && result.cost !== undefined) {
      const item = itemDb[result.itemId]
      if (item) {
        playerStore.player.gold -= result.cost
        pushLogs(playerStore.addItem(item))
      }
    }
  }

  // ── Puzzles ─────────────────────────────────────────────────
  function findPuzzleInRoom(): typeof puzzles[string] | undefined {
    const puzzleIds = roomPuzzles[currentRoomId.value]
    if (!puzzleIds || puzzleIds.length === 0) return undefined
    // Return first unsolved puzzle, or first puzzle
    return puzzleIds.map(id => puzzles[id]).find(p => p && !solvedPuzzles.value.has(p.id)) || puzzles[puzzleIds[0]!]
  }

  function handleSay(cmd: ParsedCommand) {
    if (!cmd.target) { log('Say what?', 'error'); return }

    const puzzle = findPuzzleInRoom()
    if (puzzle && puzzle.type === 'keyword') {
      // Stair-descent requires rope in inventory
      if (puzzle.id === 'stair-descent' && cmd.target.toLowerCase() === puzzle.solution) {
        const playerStore = usePlayerStore()
        const hasRope = playerStore.inventory.some(i => i.id === 'rope')
        if (!hasRope) {
          log('You don\'t have any rope. You\'d need something to lower yourself down.', 'error')
          return
        }
      }

      const result = attemptPuzzle(puzzle, cmd.target, solvedPuzzles.value.has(puzzle.id))
      pushLogs(result.logs)
      if (result.solved) {
        solvedPuzzles.value.add(puzzle.id)
        useStatsStore().recordPuzzleSolved()
        applyPuzzleReward(result)

        // Consume rope for stair-descent
        if (puzzle.id === 'stair-descent') {
          const playerStore = usePlayerStore()
          playerStore.removeItem('rope')
          log('The elven rope unties itself and coils back into your hand — but it frays and breaks from the strain.', 'narrative')
        }
      }
      return
    }

    log(`You say "${cmd.target}" aloud. Nothing happens.`, 'info')
  }

  function handleSolve(cmd: ParsedCommand) {
    const puzzle = findPuzzleInRoom()
    if (!puzzle) { log('There is nothing to solve here.', 'error'); return }
    if (!cmd.target) {
      log(puzzle.description, 'narrative')
      return
    }

    // Stair-descent requires rope
    if (puzzle.id === 'stair-descent' && cmd.target.toLowerCase() === puzzle.solution) {
      const playerStore = usePlayerStore()
      const hasRope = playerStore.inventory.some(i => i.id === 'rope')
      if (!hasRope) {
        log('You don\'t have any rope. You\'d need something to lower yourself down.', 'error')
        return
      }
    }

    const result = attemptPuzzle(puzzle, cmd.target, solvedPuzzles.value.has(puzzle.id))
    pushLogs(result.logs)
    if (result.solved) {
      solvedPuzzles.value.add(puzzle.id)
      useStatsStore().recordPuzzleSolved()
      applyPuzzleReward(result)

      // Consume rope for stair-descent
      if (puzzle.id === 'stair-descent') {
        const playerStore = usePlayerStore()
        playerStore.removeItem('rope')
        log('The elven rope unties itself and coils back into your hand — but it frays and breaks from the strain.', 'narrative')
      }
    }
  }

  function applyPuzzleReward(result: { rewardItemIds?: string[]; revealExit?: { direction: string; targetRoomId: string } }) {
    if (result.rewardItemIds) {
      for (const itemId of result.rewardItemIds) {
        const item = itemDb[itemId]
        if (item) {
          // Add to room ground items
          if (!roomItems.value[currentRoomId.value]) roomItems.value[currentRoomId.value] = []
          roomItems.value[currentRoomId.value]!.push(itemId)
        }
      }
    }
    if (result.revealExit) {
      const key = `${currentRoomId.value}-${result.revealExit.direction}`
      revealedExits.value.add(key)
    }
  }

  // ── Rest ────────────────────────────────────────────────────
  function handleRest() {
    const combatStore = useCombatStore()
    const room = currentRoom.value
    if (!room) return

    const hasEnemies = !!(room.enemies && room.enemies.length > 0)
    const roomCleared = clearedRooms.value.has(currentRoomId.value)
    const alreadyRested = restedRooms.value.has(currentRoomId.value)

    const validation = canRest(combatStore.inCombat, hasEnemies, roomCleared, alreadyRested)
    if (!validation.allowed) {
      log(validation.reason!, 'error')
      return
    }

    const playerStore = usePlayerStore()
    if (!playerStore.player) return

    const result = resolveRest(playerStore.player.abilities)
    pushLogs(result.logs)
    restedRooms.value.add(currentRoomId.value)

    if (result.wanderingMonster) {
      // Spawn a small goblin patrol
      const patrol = [{ enemyId: 'goblin' as string, count: 1 + (Math.random() < 0.5 ? 1 : 0) }]
      pushLogs(combatStore.startCombat(patrol, isDark()))
    } else {
      const scaledHeal = Math.max(1, Math.floor(result.hpHealed * getDifficultyMultipliers().healing))
      playerStore.player.hp = Math.min(playerStore.player.maxHp, playerStore.player.hp + scaledHeal)
    }
  }

  // ── Info commands ──────────────────────────────────────────
  function handleInventory() {
    const playerStore = usePlayerStore()
    if (playerStore.inventory.length === 0) { log('Your pack is empty.', 'info'); return }
    log('--- Inventory ---', 'system')
    for (const item of playerStore.inventory) {
      const equipped = (item.id === playerStore.player?.equippedWeapon || item.id === playerStore.player?.equippedArmor) ? ' (equipped)' : ''
      const qty = item.quantity && item.quantity > 1 ? ` x${item.quantity}` : ''
      log(`  ${item.name}${qty}${equipped}`, 'info')
    }
  }

  function handleStats() {
    const playerStore = usePlayerStore()
    const p = playerStore.player
    if (!p) return
    log('--- Character ---', 'system')
    log(`${p.name} the ${p.class} (Level ${p.level})`, 'info')
    log(`HP: ${p.hp}/${p.maxHp}  AC: ${p.ac}  XP: ${p.xp}/${p.xpToNext}`, 'info')
    log(`STR ${p.abilities.str}  DEX ${p.abilities.dex}  CON ${p.abilities.con}`, 'info')
    log(`INT ${p.abilities.int}  WIS ${p.abilities.wis}  CHA ${p.abilities.cha}`, 'info')
  }

  function handleHelp() {
    log('--- Commands ---', 'system')
    log('Movement: north/south/east/west (or n/s/e/w)', 'info')
    log('look - Examine your surroundings', 'info')
    log('examine <target> - Look closely at something', 'info')
    log('take <item> - Pick up an item', 'info')
    log('use <item> - Use an item (drink potion, etc)', 'info')
    log('equip <item> - Equip a weapon or armor', 'info')
    log('drop <item> - Drop an item', 'info')
    log('attack [target] - Attack in combat', 'info')
    log('cast <spell> - Cast a spell', 'info')
    log('flee - Attempt to escape combat (DEX check)', 'info')
    log('sneak <direction> - Sneak into a room (DEX check)', 'info')
    log('rest - Rest and recover HP (once per room)', 'info')
    log('talk [name] - Talk to an NPC', 'info')
    log('trade/buy [item] - Trade with an NPC', 'info')
    log('say <word> - Speak a word aloud (for puzzles)', 'info')
    log('solve/pull <answer> - Attempt to solve a puzzle', 'info')
    log('search <target> - Search an object for loot', 'info')
    log('destroy - Destroy a disarmed trap', 'info')
    log('disarm - Attempt to disarm a trap', 'info')
    log('inventory - View your items', 'info')
    log('stats - View your character', 'info')
    log('--- Keyboard Shortcuts ---', 'system')
    log('Arrow keys - Move (when not in combat)', 'info')
    log('L - Look, I - Inventory, H - Help', 'info')
    log('A - Attack (combat), F - Flee (combat)', 'info')
    log('/ - Focus command input', 'info')
  }

  // ── Public API ─────────────────────────────────────────────
  return {
    phase,
    currentRoomId,
    currentRoom,
    gameLog,
    visitedRooms,
    clearedRooms,
    roomItems,
    disarmedTraps,
    destroyedTraps,
    searchedInteractions,
    hasLight,
    lightTurnsRemaining,
    permanentLight,
    previousRoomId,
    restedRooms,
    interactedNPCs,
    solvedPuzzles,
    revealedExits,
    difficulty,
    getDifficultyMultipliers,
    initGame,
    handleCommand,
    enterRoom,
    handleLook,
    log,
    pushLogs,
    isDark,
    markRoomCleared,
    checkDeath,
    groundItemNames,
  }
})
