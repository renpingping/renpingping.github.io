<script setup lang="ts">
withDefaults(defineProps<{ tag: string; clickable?: boolean }>(), { clickable: true })
</script>

<template>
  <NuxtLink
    v-if="clickable"
    :to="`/tags/${encodeURIComponent(tag)}`"
    class="inline-flex items-center rounded-full bg-indigo-500/10 px-2.5 py-0.5 text-xs font-medium text-indigo-700 transition-colors hover:bg-indigo-500/20 dark:text-indigo-300"
  >
    {{ tag }}
  </NuxtLink>
  <span
    v-else
    class="inline-flex items-center rounded-full bg-indigo-500/10 px-2.5 py-0.5 text-xs font-medium text-indigo-700 dark:text-indigo-300"
  >{{ tag }}</span>
</template>
