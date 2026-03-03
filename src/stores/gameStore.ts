import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { GameLogEntry } from '../types/command'
import type { ParsedCommand } from '../types/command'
import { rooms, getRoom, STARTING_ROOM } from '../data/rooms'
import { items as itemDb } from '../data/items'
import { parseCommand } from '../engine/commandParser'
import { usePlayerStore } from './playerStore'
import { useCombatStore } from './combatStore'

export type GamePhase = 'title' | 'character-select' | 'playing' | 'game-over' | 'victory'

export const useGameStore = defineStore('game', () => {
  const phase = ref<GamePhase>('title')
  const currentRoomId = ref(STARTING_ROOM)
  const gameLog = ref<GameLogEntry[]>([])
  const visitedRooms = ref<Set<string>>(new Set())
  const clearedRooms = ref<Set<string>>(new Set())
  const roomItems = ref<Record<string, string[]>>({})

  const currentRoom = computed(() => getRoom(currentRoomId.value))

  function log(text: string, type: GameLogEntry['type'] = 'narrative') {
    gameLog.value.push({ text, type, timestamp: Date.now() })
  }

  function initGame() {
    gameLog.value = []
    visitedRooms.value = new Set()
    clearedRooms.value = new Set()
    currentRoomId.value = STARTING_ROOM

    // Initialize room items from room data
    roomItems.value = {}
    for (const [id, room] of Object.entries(rooms)) {
      if (room.items && room.items.length > 0) {
        roomItems.value[id] = [...room.items]
      }
    }

    enterRoom(STARTING_ROOM)
  }

  function enterRoom(roomId: string) {
    const room = getRoom(roomId)
    if (!room) {
      log('You cannot go that way.', 'error')
      return
    }

    currentRoomId.value = roomId
    visitedRooms.value.add(roomId)

    log(`--- ${room.name} ---`, 'system')
    log(room.description, 'narrative')

    // Show exits
    const exits = room.exits.map(e => e.direction).join(', ')
    log(`Exits: ${exits}`, 'info')

    // Show items on ground
    const groundItems = roomItems.value[roomId]
    if (groundItems && groundItems.length > 0) {
      const names = groundItems.map(id => itemDb[id]?.name || id).join(', ')
      log(`You see: ${names}`, 'info')
    }

    // Trigger combat if enemies present and room not cleared
    if (room.enemies && room.enemies.length > 0 && !clearedRooms.value.has(roomId)) {
      const combatStore = useCombatStore()
      const combatLogs = combatStore.startCombat(room.enemies)
      for (const cl of combatLogs) {
        gameLog.value.push(cl)
      }
    }

    // Victory check
    if (roomId === 'east-gate') {
      log('You emerge from the darkness into blinding sunlight. The Mines of Moria lie behind you.', 'narrative')
      log('You have survived the crossing of Moria!', 'system')
      phase.value = 'victory'
    }
  }

  function handleCommand(input: string) {
    const playerStore = usePlayerStore()
    const cmd = parseCommand(input)

    log(`> ${input}`, 'system')

    // If dead, reject everything
    if (!playerStore.isAlive) {
      log('You are dead. The darkness claims you.', 'error')
      return
    }

    // Route command
    switch (cmd.type) {
      case 'move':
        handleMove(cmd)
        break
      case 'look':
        handleLook()
        break
      case 'examine':
        handleExamine(cmd)
        break
      case 'attack':
        handleAttack(cmd)
        break
      case 'cast':
        handleCast(cmd)
        break
      case 'take':
        handleTake(cmd)
        break
      case 'drop':
        handleDrop(cmd)
        break
      case 'use':
        handleUse(cmd)
        break
      case 'equip':
        handleEquip(cmd)
        break
      case 'inventory':
        handleInventory()
        break
      case 'stats':
        handleStats()
        break
      case 'help':
        handleHelp()
        break
      case 'map':
        log('Check the minimap on the right side of your screen.', 'info')
        break
      case 'unknown':
        log(`I don't understand "${input}". Type "help" for available commands.`, 'error')
        break
    }
  }

  function handleMove(cmd: ParsedCommand) {
    const combatStore = useCombatStore()
    if (combatStore.inCombat) {
      log('You cannot flee! You must fight or die.', 'error')
      return
    }

    const room = currentRoom.value
    if (!room || !cmd.target) return

    const exit = room.exits.find(e => e.direction === cmd.target)
    if (!exit) {
      log(`There is no passage to the ${cmd.target}.`, 'error')
      return
    }

    if (exit.locked) {
      const playerStore = usePlayerStore()
      if (exit.requiredItemId) {
        const hasKey = playerStore.inventory.find(i => i.id === exit.requiredItemId)
        if (!hasKey) {
          log(exit.lockMessage || 'The way is blocked.', 'error')
          return
        }
        log(`You use the ${hasKey.name} to open the way.`, 'info')
      }
    }

    enterRoom(exit.targetRoomId)
  }

  function handleLook() {
    const room = currentRoom.value
    if (!room) return
    log(room.description, 'narrative')
    const exits = room.exits.map(e => e.direction).join(', ')
    log(`Exits: ${exits}`, 'info')
    const groundItems = roomItems.value[currentRoomId.value]
    if (groundItems && groundItems.length > 0) {
      const names = groundItems.map(id => itemDb[id]?.name || id).join(', ')
      log(`You see: ${names}`, 'info')
    }
  }

  function handleExamine(cmd: ParsedCommand) {
    if (!cmd.target) {
      handleLook()
      return
    }
    const playerStore = usePlayerStore()
    const item = playerStore.inventory.find(i =>
      i.name.toLowerCase().includes(cmd.target!.toLowerCase())
    )
    if (item) {
      log(`${item.name}: ${item.description}`, 'info')
      return
    }
    const combatStore = useCombatStore()
    const enemy = combatStore.livingEnemies.find(e =>
      e.name.toLowerCase().includes(cmd.target!.toLowerCase())
    )
    if (enemy) {
      log(`${enemy.name}: ${enemy.description} (HP: ${enemy.hp}/${enemy.maxHp}, AC: ${enemy.ac})`, 'info')
      return
    }
    log(`You see nothing special about "${cmd.target}".`, 'info')
  }

  function handleAttack(cmd: ParsedCommand) {
    const combatStore = useCombatStore()
    if (!combatStore.inCombat) {
      log('There is nothing to attack here.', 'error')
      return
    }
    const logs = combatStore.doPlayerAttack(cmd.target)
    for (const l of logs) gameLog.value.push(l)

    // Check if room is now cleared
    if (!combatStore.inCombat) {
      clearedRooms.value.add(currentRoomId.value)
    }

    const playerStore = usePlayerStore()
    if (!playerStore.isAlive) {
      phase.value = 'game-over'
    }
  }

  function handleCast(cmd: ParsedCommand) {
    const playerStore = usePlayerStore()
    if (!playerStore.player) return

    if (!cmd.target) {
      log('Cast what spell? Usage: cast <spell name>', 'error')
      return
    }

    // Light spell works outside combat
    if (cmd.target.toLowerCase() === 'light') {
      const spell = playerStore.player.spells.find(s => s.id === 'light')
      if (spell) {
        log('A warm light emanates from your staff, illuminating the darkness.', 'info')
        return
      }
    }

    const combatStore = useCombatStore()
    if (!combatStore.inCombat) {
      log('You can only cast combat spells during battle.', 'error')
      return
    }

    const logs = combatStore.doPlayerCast(cmd.target)
    for (const l of logs) gameLog.value.push(l)

    if (!combatStore.inCombat) {
      clearedRooms.value.add(currentRoomId.value)
    }

    if (!playerStore.isAlive) {
      phase.value = 'game-over'
    }
  }

  function handleTake(cmd: ParsedCommand) {
    const combatStore = useCombatStore()
    if (combatStore.inCombat) {
      log('You\'re in combat! Focus on the fight!', 'error')
      return
    }

    if (!cmd.target) {
      log('Take what?', 'error')
      return
    }

    const groundItems = roomItems.value[currentRoomId.value]
    if (!groundItems || groundItems.length === 0) {
      log('There is nothing here to take.', 'error')
      return
    }

    const idx = groundItems.findIndex(id => {
      const item = itemDb[id]
      return item && item.name.toLowerCase().includes(cmd.target!.toLowerCase())
    })

    if (idx === -1) {
      log(`You don't see any "${cmd.target}" here.`, 'error')
      return
    }

    const itemId = groundItems[idx]!
    const item = itemDb[itemId]
    if (!item) return

    groundItems.splice(idx, 1)
    const playerStore = usePlayerStore()
    const logs = playerStore.addItem(item)
    for (const l of logs) gameLog.value.push(l)
  }

  function handleDrop(cmd: ParsedCommand) {
    if (!cmd.target) {
      log('Drop what?', 'error')
      return
    }
    const playerStore = usePlayerStore()
    const item = playerStore.inventory.find(i =>
      i.name.toLowerCase().includes(cmd.target!.toLowerCase())
    )
    if (!item) {
      log(`You don't have any "${cmd.target}".`, 'error')
      return
    }
    playerStore.removeItem(item.id)
    if (!roomItems.value[currentRoomId.value]) {
      roomItems.value[currentRoomId.value] = []
    }
    roomItems.value[currentRoomId.value]!.push(item.id)
    log(`You drop the ${item.name}.`, 'info')
  }

  function handleUse(cmd: ParsedCommand) {
    if (!cmd.target) {
      log('Use what?', 'error')
      return
    }
    const playerStore = usePlayerStore()
    const item = playerStore.inventory.find(i =>
      i.name.toLowerCase().includes(cmd.target!.toLowerCase())
    )
    if (!item) {
      log(`You don't have any "${cmd.target}".`, 'error')
      return
    }
    const logs = playerStore.useItem(item.id)
    for (const l of logs) gameLog.value.push(l)
  }

  function handleEquip(cmd: ParsedCommand) {
    if (!cmd.target) {
      log('Equip what?', 'error')
      return
    }
    const playerStore = usePlayerStore()
    const item = playerStore.inventory.find(i =>
      i.name.toLowerCase().includes(cmd.target!.toLowerCase())
    )
    if (!item) {
      log(`You don't have any "${cmd.target}".`, 'error')
      return
    }
    const logs = playerStore.equipItem(item.id)
    for (const l of logs) gameLog.value.push(l)
  }

  function handleInventory() {
    const playerStore = usePlayerStore()
    if (playerStore.inventory.length === 0) {
      log('Your pack is empty.', 'info')
      return
    }
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
    log('inventory - View your items', 'info')
    log('stats - View your character', 'info')
  }

  return {
    phase,
    currentRoomId,
    currentRoom,
    gameLog,
    visitedRooms,
    clearedRooms,
    roomItems,
    initGame,
    handleCommand,
    enterRoom,
    log,
  }
})
