<script setup lang="ts">
const config = useAppConfig()
</script>

<template>
  <div class="flex flex-wrap items-center justify-center gap-2">
    <a
      v-for="s in config.site.socials"
      :key="s.label"
      :href="s.url"
      target="_blank"
      rel="noopener"
      class="rounded-full border border-zinc-300 px-4 py-1.5 text-sm font-medium text-zinc-600 transition-all hover:border-indigo-400 hover:text-indigo-600 dark:border-zinc-700 dark:text-zinc-400 dark:hover:border-indigo-500 dark:hover:text-indigo-400"
    >{{ s.label }}</a>
  </div>
</template>
