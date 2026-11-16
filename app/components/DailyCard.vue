<script setup lang="ts">
defineProps({
  title: { type: String, required: true },
  url: { type: String, required: true },
  chip: { type: String, default: '' },
  chipClass: { type: String, default: 'chip-other' },
  metric: { type: String, default: '' },
  score: { type: [String, Number], default: '' },
  hot: { type: Boolean, default: false },
})
</script>

<template>
  <div class="daily-card">
    <div class="daily-title">
      <a :href="url" target="_blank" rel="noopener">{{ title }}</a>
    </div>
    <div class="daily-meta">
      <span v-if="chip" class="daily-chip" :class="chipClass">{{ chip }}</span>
      <span v-if="metric" class="daily-metric">{{ metric }}</span>
      <span class="daily-score" :class="{ hot }">{{ hot ? `⭐ ${score}` : `${score}分` }}</span>
    </div>
    <div class="daily-summary">
      <slot />
    </div>
  </div>
</template>
