<script setup lang="ts">
const { data: posts } = await useAsyncData('blog-list', () =>
  queryCollection('blog').order('date', 'DESC').all(),
)

const activeTag = ref<string | null>(null)

const allTags = computed(() => {
  const counter = new Map<string, number>()
  for (const p of posts.value ?? []) {
    for (const t of p.tags ?? []) counter.set(t, (counter.get(t) ?? 0) + 1)
  }
  return [...counter.entries()].sort((a, b) => b[1] - a[1])
})

const filtered = computed(() =>
  activeTag.value
    ? (posts.value ?? []).filter(p => p.tags?.includes(activeTag.value!))
    : posts.value ?? [],
)

useHead({ title: '文章' })
</script>

<template>
  <div>
    <header class="mb-8">
      <h1 class="text-3xl font-bold text-zinc-900 dark:text-zinc-100">文章</h1>
      <p class="mt-2 text-sm text-zinc-500">记录技术、工具与折腾的痕迹</p>
    </header>

    <div v-if="allTags.length" class="mb-8 flex flex-wrap items-center gap-2">
      <button
        class="rounded-full px-3 py-1 text-sm font-medium transition-colors"
        :class="activeTag === null
          ? 'bg-indigo-600 text-white'
          : 'bg-zinc-200/60 text-zinc-600 hover:bg-zinc-300/60 dark:bg-zinc-800 dark:text-zinc-400'"
        @click="activeTag = null"
      >全部</button>
      <button
        v-for="[tag, count] in allTags"
        :key="tag"
        class="rounded-full px-3 py-1 text-sm font-medium transition-colors"
        :class="activeTag === tag
          ? 'bg-indigo-600 text-white'
          : 'bg-zinc-200/60 text-zinc-600 hover:bg-zinc-300/60 dark:bg-zinc-800 dark:text-zinc-400'"
        @click="activeTag = tag"
      >{{ tag }} ({{ count }})</button>
    </div>

    <div class="grid gap-6 sm:grid-cols-2">
      <PostCard v-for="post in filtered" :key="post.path" :post="post" />
    </div>

    <p v-if="!filtered.length" class="py-16 text-center text-sm text-zinc-400">暂无文章</p>
  </div>
</template>
