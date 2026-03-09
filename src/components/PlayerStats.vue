<script setup lang="ts">
import { computed } from 'vue'
import { usePlayerStore } from '../stores/playerStore'
import { getModifier } from '../types/character'

const playerStore = usePlayerStore()
const player = computed(() => playerStore.player)

const hpPercent = computed(() => {
  if (!player.value) return 0
  return Math.max(0, (player.value.hp / player.value.maxHp) * 100)
})

const hpColor = computed(() => {
  if (hpPercent.value > 60) return 'bg-moria-success'
  if (hpPercent.value > 30) return 'bg-amber-500'
  return 'bg-moria-danger'
})

function formatMod(score: number): string {
  const mod = getModifier(score)
  return mod >= 0 ? `+${mod}` : `${mod}`
}

const classLabel: Record<string, string> = {
  'ranger': 'Ranger',
  'wizard': 'Wizard',
  'dwarf-warrior': 'Dwarf Warrior',
}
</script>

<template>
  <div v-if="player" class="p-3 border border-moria-border rounded bg-moria-panel/50 space-y-3">
    <div>
      <div class="text-moria-highlight font-bold text-sm">{{ player.name }}</div>
      <div class="text-moria-info text-xs">{{ classLabel[player.class] }} &middot; Level {{ player.level }}</div>
    </div>

    <!-- HP Bar -->
    <div>
      <div class="flex justify-between text-xs mb-1">
        <span class="text-moria-info">HP</span>
        <span class="text-moria-text">{{ player.hp }}/{{ player.maxHp }}</span>
      </div>
      <div class="w-full h-2 bg-moria-bg rounded overflow-hidden">
        <div :class="hpColor" class="h-full transition-all duration-300 rounded" :style="{ width: hpPercent + '%' }"></div>
      </div>
    </div>

    <!-- AC, XP & Gold -->
    <div class="flex justify-between text-xs">
      <span><span class="text-moria-info">AC:</span> <span class="text-moria-highlight">{{ player.ac }}</span></span>
      <span><span class="text-moria-info">XP:</span> <span class="text-moria-text">{{ player.xp }}/{{ player.xpToNext }}</span></span>
    </div>
    <div class="text-xs">
      <span class="text-moria-info">Gold:</span> <span class="text-amber-400">{{ player.gold }}</span>
    </div>

    <!-- Ability Scores -->
    <div class="grid grid-cols-2 gap-x-3 gap-y-1 text-xs">
      <div><span class="text-moria-info">STR</span> <span class="text-moria-text">{{ player.abilities.str }}</span> <span class="text-moria-highlight">({{ formatMod(player.abilities.str) }})</span></div>
      <div><span class="text-moria-info">DEX</span> <span class="text-moria-text">{{ player.abilities.dex }}</span> <span class="text-moria-highlight">({{ formatMod(player.abilities.dex) }})</span></div>
      <div><span class="text-moria-info">CON</span> <span class="text-moria-text">{{ player.abilities.con }}</span> <span class="text-moria-highlight">({{ formatMod(player.abilities.con) }})</span></div>
      <div><span class="text-moria-info">INT</span> <span class="text-moria-text">{{ player.abilities.int }}</span> <span class="text-moria-highlight">({{ formatMod(player.abilities.int) }})</span></div>
      <div><span class="text-moria-info">WIS</span> <span class="text-moria-text">{{ player.abilities.wis }}</span> <span class="text-moria-highlight">({{ formatMod(player.abilities.wis) }})</span></div>
      <div><span class="text-moria-info">CHA</span> <span class="text-moria-text">{{ player.abilities.cha }}</span> <span class="text-moria-highlight">({{ formatMod(player.abilities.cha) }})</span></div>
    </div>

    <!-- Status Effects -->
    <div v-if="player.statusEffects && player.statusEffects.length > 0">
      <div class="text-moria-info text-xs font-bold mb-1">STATUS</div>
      <div v-for="effect in player.statusEffects" :key="effect.id" class="text-xs">
        <span :class="{
          'text-green-400': effect.id === 'blessed',
          'text-purple-400': effect.id === 'poisoned',
          'text-orange-400': effect.id === 'burning',
          'text-yellow-400': effect.id === 'stunned',
        }">{{ effect.name }}</span>
        <span class="text-moria-text ml-1">({{ effect.duration }} turns)</span>
      </div>
    </div>

    <!-- Spells -->
    <div v-if="player.spells.length > 0">
      <div class="text-moria-info text-xs font-bold mb-1">SPELLS</div>
      <div v-for="spell in player.spells" :key="spell.id" class="text-xs">
        <span class="text-moria-text">{{ spell.name }}</span>
        <span v-if="spell.currentCooldown > 0" class="text-moria-danger ml-1">({{ spell.currentCooldown }} turns)</span>
        <span v-else class="text-moria-success ml-1">ready</span>
      </div>
    </div>
  </div>
</template>
