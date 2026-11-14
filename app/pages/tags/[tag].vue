<script setup lang="ts">
const route = useRoute()
const tag = computed(() => decodeURIComponent(route.params.tag as string))

const { data: posts } = await useAsyncData(`tag-${tag.value}`, () =>
  queryCollection('blog').order('date', 'DESC').all(),
)

const matched = computed(() =>
  (posts.value ?? []).filter(p => p.tags?.includes(tag.value)),
)

if (!matched.value.length) {
  throw createError({ statusCode: 404, statusMessage: '标签不存在' })
}

useHead({ title: `标签：${tag.value}` })
</script>

<template>
  <div>
    <header class="mb-8">
      <p class="text-sm text-zinc-400">标签</p>
      <h1 class="mt-1 text-3xl font-bold text-zinc-900 dark:text-zinc-100"># {{ tag }}</h1>
    </header>
    <div class="grid gap-6 sm:grid-cols-2">
      <PostCard v-for="post in matched" :key="post.path" :post="post" />
    </div>
  </div>
</template>
