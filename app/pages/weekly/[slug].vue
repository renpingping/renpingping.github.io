<script setup lang="ts">
const route = useRoute()

const { data: post } = await useAsyncData(route.path, () =>
  queryCollection('weekly').path(route.path).first(),
)

if (!post.value) {
  throw createError({ statusCode: 404, statusMessage: '周报不存在' })
}

const { format } = useFormatDate()

// 与 blog/[slug].vue 保持一致：getter 保持响应式，避免同路由参数变化时标题不更新
useHead({
  title: () => post.value?.title ?? '',
  meta: [{
    name: 'description',
    content: () => post.value?.description ?? '',
  }],
})
</script>

<template>
  <article v-if="post">
    <header class="mb-8">
      <h1 class="text-3xl font-bold leading-tight text-zinc-900 dark:text-zinc-100">
        {{ post.title }}
      </h1>
      <div class="mt-4 flex flex-wrap items-center gap-2 text-sm">
        <time class="text-zinc-400">{{ format(post.date) }}</time>
        <TagChip
          v-for="t in post.tags"
          :key="t"
          :tag="t"
        />
      </div>
    </header>

    <div
      v-if="post.cover"
      class="mb-8 overflow-hidden rounded-xl bg-zinc-100 dark:bg-zinc-800"
    >
      <img
        :src="post.cover"
        :alt="post.title"
        class="aspect-[2/1] w-full object-cover"
      >
    </div>

    <div class="prose-ther">
      <ContentRenderer :value="post" />
    </div>

    <nav class="mt-12 border-t border-zinc-200 pt-6 dark:border-zinc-800">
      <NuxtLink
        to="/weekly"
        class="text-sm font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400"
      >
        ← 返回周报列表
      </NuxtLink>
    </nav>
  </article>
</template>
