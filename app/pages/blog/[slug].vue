<script setup lang="ts">
const route = useRoute()

const { data: post } = await useAsyncData(route.path, () =>
  queryCollection('blog').path(route.path).first(),
)

if (!post.value) {
  throw createError({ statusCode: 404, statusMessage: '文章不存在' })
}

const { data: surround } = await useAsyncData(`${route.path}-surround`, () =>
  queryCollectionItemSurroundings('blog', route.path, ['title', 'description']).order('date', 'DESC'),
)

const prev = computed(() => surround.value?.[0]?.path ? surround.value[0] : null)
const next = computed(() => surround.value?.[1]?.path ? surround.value[1] : null)

// 每日技术热读：无侧栏目录，正文列拉宽（卡片可达 ~976px）
const isDaily = computed(() => (post.value?.tags ?? []).includes('技术热读'))

const { format } = useFormatDate()

// title/description 用 getter 保持响应式：上一篇/下一篇是同路由参数变化，
// 组件复用不重跑 setup，若取一次性字符串会导致标签页标题停留在旧文章
useHead({
  title: () => post.value?.title ?? '',
  meta: [{
    name: 'description',
    content: () => post.value?.description ?? '',
  }],
})
</script>

<template>
  <div v-if="post" :class="isDaily
    ? 'grid grid-cols-1 gap-10'
    : 'grid grid-cols-1 gap-10 xl:grid-cols-[1fr_240px]'">
    <article>
      <header class="mb-8">
        <h1 class="text-3xl font-bold leading-tight text-zinc-900 dark:text-zinc-100">
          {{ post.title }}
        </h1>
        <div class="mt-4 flex flex-wrap items-center gap-2 text-sm">
          <time class="text-zinc-400">{{ format(post.date) }}</time>
          <TagChip v-for="t in post.tags" :key="t" :tag="t" />
        </div>
      </header>

      <div v-if="post.cover" class="mb-8 overflow-hidden rounded-xl bg-zinc-100 dark:bg-zinc-800">
        <img :src="post.cover" :alt="post.title" class="aspect-[2/1] w-full object-cover">
      </div>

      <div class="prose-ther">
        <ContentRenderer :value="post" />
      </div>

      <nav class="mt-12 grid gap-4 border-t border-zinc-200 pt-6 sm:grid-cols-2 dark:border-zinc-800">
        <NuxtLink
          v-if="prev"
          :to="prev.path"
          class="group rounded-lg border border-zinc-200 p-4 transition-colors hover:border-indigo-300 dark:border-zinc-800 dark:hover:border-indigo-700"
        >
          <p class="text-xs text-zinc-400">上一篇</p>
          <p class="mt-1 font-medium text-zinc-800 group-hover:text-indigo-600 dark:text-zinc-200 dark:group-hover:text-indigo-400">
            {{ prev.title }}
          </p>
        </NuxtLink>
        <span v-else class="hidden sm:block" />
        <NuxtLink
          v-if="next"
          :to="next.path"
          class="group rounded-lg border border-zinc-200 p-4 text-right transition-colors hover:border-indigo-300 dark:border-zinc-800 dark:hover:border-indigo-700"
        >
          <p class="text-xs text-zinc-400">下一篇</p>
          <p class="mt-1 font-medium text-zinc-800 group-hover:text-indigo-600 dark:text-zinc-200 dark:group-hover:text-indigo-400">
            {{ next.title }}
          </p>
        </NuxtLink>
      </nav>
    </article>

    <aside v-if="!isDaily && post.body?.toc?.links?.length" class="self-start">
      <Toc :links="post.body.toc.links" />
    </aside>
  </div>
</template>
