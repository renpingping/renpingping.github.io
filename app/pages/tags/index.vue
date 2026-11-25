<script setup lang="ts">
const { data: posts } = await useAllPosts('tags-all')

const { allTags: tags } = useTagFilter(posts)

useHead({ title: '标签' })
</script>

<template>
  <div>
    <header class="mb-8">
      <h1 class="text-3xl font-bold text-zinc-900 dark:text-zinc-100">标签</h1>
    </header>
    <div class="flex flex-wrap gap-3">
      <NuxtLink
        v-for="[tag, count] in tags"
        :key="tag"
        :to="`/tags/${encodeURIComponent(tag)}`"
        class="rounded-full border border-zinc-300 px-4 py-1.5 text-sm text-zinc-600 transition-colors hover:border-indigo-400 hover:text-indigo-600 dark:border-zinc-700 dark:text-zinc-400 dark:hover:border-indigo-500 dark:hover:text-indigo-400"
      >{{ tag }} <span class="text-xs text-zinc-400">{{ count }}</span></NuxtLink>
    </div>
  </div>
</template>
