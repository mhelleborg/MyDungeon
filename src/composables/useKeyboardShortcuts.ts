import { onMounted, onUnmounted } from 'vue'
import { useGameStore } from '../stores/gameStore'
import { useCombatStore } from '../stores/combatStore'

export function useKeyboardShortcuts() {
  const gameStore = useGameStore()
  const combatStore = useCombatStore()

  function isInputFocused(): boolean {
    const tag = document.activeElement?.tagName
    return tag === 'INPUT' || tag === 'TEXTAREA'
  }

  function handleKeydown(e: KeyboardEvent) {
    if (gameStore.phase !== 'playing') return
    if (isInputFocused()) return

    // Focus command input
    if (e.key === '/') {
      e.preventDefault()
      const input = document.querySelector<HTMLInputElement>('[data-command-input]')
      input?.focus()
      return
    }

    // Arrow keys → movement (not in combat)
    if (!combatStore.inCombat) {
      const dirMap: Record<string, string> = {
        'ArrowUp': 'north',
        'ArrowDown': 'south',
        'ArrowRight': 'east',
        'ArrowLeft': 'west',
      }
      const dir = dirMap[e.key]
      if (dir) {
        e.preventDefault()
        gameStore.handleCommand(dir)
        return
      }
    }

    const key = e.key.toLowerCase()

    // General shortcuts
    if (key === 'l') { gameStore.handleCommand('look'); return }
    if (key === 'i') { gameStore.handleCommand('inventory'); return }
    if (key === 'h') { gameStore.handleCommand('help'); return }

    // Combat shortcuts
    if (combatStore.inCombat) {
      if (key === 'a') { gameStore.handleCommand('attack'); return }
      if (key === 'f') { gameStore.handleCommand('flee'); return }
    }
  }

  onMounted(() => window.addEventListener('keydown', handleKeydown))
  onUnmounted(() => window.removeEventListener('keydown', handleKeydown))
}
