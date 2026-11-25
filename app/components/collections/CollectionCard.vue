<script setup lang="ts">
import type { CollectionsCollectionItem } from '@nuxt/content'

defineProps<{ item: CollectionsCollectionItem }>()

const { format } = useFormatDate()
</script>

<template>
  <a
    :href="item.url"
    target="_blank"
    rel="noopener"
    class="group block rounded-xl border border-zinc-200 bg-white p-5 transition-all hover:-translate-y-0.5 hover:border-indigo-300 hover:shadow-lg dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-indigo-700"
  >
    <div class="flex items-start justify-between gap-4">
      <h2 class="font-medium text-zinc-900 transition-colors group-hover:text-indigo-600 dark:text-zinc-100 dark:group-hover:text-indigo-400">
        {{ item.title }}
      </h2>
      <svg class="mt-1 h-4 w-4 shrink-0 text-zinc-400 transition-transform group-hover:translate-x-0.5 group-hover:text-indigo-500" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M7 17 17 7M8 7h9v9" /></svg>
    </div>
    <p v-if="item.note" class="mt-2 text-sm text-zinc-500">{{ item.note }}</p>
    <div class="mt-3 flex flex-wrap items-center gap-2">
      <span v-if="item.source" class="text-xs text-zinc-400">{{ item.source }}</span>
      <span class="text-xs text-zinc-300 dark:text-zinc-600">·</span>
      <time class="text-xs text-zinc-400">{{ format(item.date) }}</time>
      <TagChip v-for="t in item.tags" :key="t" :tag="t" :clickable="false" />
    </div>
  </a>
</template>
