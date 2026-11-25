<script setup lang="ts">
const { data: posts } = await useAllPosts('tags-all')

const { allTags: tags } = useTagFilter(posts)

usePageSeo(() => ({ title: '标签', description: '文章与收藏的标签索引' }))
</script>

<template>
  <div>
    <PageHeader title="标签" />
    <div class="flex flex-wrap gap-3">
      <NuxtLink
        v-for="[tag, count] in tags"
        :key="tag"
        :to="`/tags/${encodeURIComponent(tag)}`"
        class="rounded-full border border-zinc-300 px-4 py-1.5 text-sm text-zinc-600 transition-colors hover:border-indigo-400 hover:text-indigo-600 dark:border-zinc-700 dark:text-zinc-400 dark:hover:border-indigo-500 dark:hover:text-indigo-400"
      >{{ tag }} <span class="text-xs text-muted">{{ count }}</span></NuxtLink>
    </div>
  </div>
</template>
