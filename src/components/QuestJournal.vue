<script setup lang="ts">
import { computed } from 'vue'
import { useQuestStore } from '../stores/questStore'

const questStore = useQuestStore()

const entries = computed(() =>
  questStore.activeQuests.map(quest => {
    const prog = questStore.questProgress[quest.id]!
    const stage = quest.stages[prog.stageIndex]
    const needed = stage?.trigger.count ?? 1
    const tally = prog.killCounts[`${prog.stageIndex}`] ?? 0
    return {
      id: quest.id,
      name: quest.name,
      objective: stage?.objective ?? '',
      counter: needed > 1 ? `${tally}/${needed}` : null,
    }
  }),
)

const completedCount = computed(() => questStore.completedQuests.length)
</script>

<template>
  <div class="p-3 border border-moria-border rounded bg-moria-panel/50">
    <div class="text-moria-info text-xs font-bold mb-2">QUESTS</div>
    <div v-if="entries.length === 0" class="text-moria-info text-xs italic">
      No quests yet. Deeds await.
    </div>
    <div v-for="q in entries" :key="q.id" class="mb-2 last:mb-0">
      <div class="text-moria-highlight text-xs font-bold">{{ q.name }}</div>
      <div class="text-moria-text text-[11px] leading-snug">
        ▸ {{ q.objective }}
        <span v-if="q.counter" class="text-moria-info">({{ q.counter }})</span>
      </div>
    </div>
    <div v-if="completedCount > 0" class="text-moria-info text-[11px] mt-2 pt-2 border-t border-moria-border/50">
      ✓ {{ completedCount }} quest{{ completedCount > 1 ? 's' : '' }} completed
    </div>
  </div>
</template>
