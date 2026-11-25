<script setup lang="ts">
import type { Section } from '~/config/sections'
import { navLabelOf } from '~/config/sections'

const props = defineProps<{ section: Section }>()
const { post, newer, older } = await usePostPage(props.section)

// 卡片列表类的文章（如每日技术热读）自带分类导航：隐藏侧栏目录并拉宽正文
const isWide = computed(() =>
  props.section.wide === true
  || (post.value?.tags ?? []).some(tag => props.section.wideTags?.includes(tag)),
)

// 标题、描述与 canonical 跟着文章走：上一篇/下一篇是同一路由的参数变化，组件不会重新执行 setup
usePageSeo(() => ({
  title: post.value?.title,
  description: post.value?.description,
  path: post.value?.path,
  type: 'article',
}))
</script>

<template>
  <div
    v-if="post"
    :class="isWide
      ? 'grid grid-cols-1 gap-10'
      : 'grid grid-cols-1 gap-10 xl:grid-cols-[1fr_240px]'"
  >
    <article>
      <header class="mb-8">
        <h1 class="text-3xl font-bold leading-tight text-zinc-900 dark:text-zinc-100">
          {{ post.title }}
        </h1>
        <div class="mt-4 flex flex-wrap items-center gap-2 text-sm">
          <time class="text-zinc-400">{{ formatDate(post.date) }}</time>
          <TagChip
            v-for="tag in post.tags ?? []"
            :key="tag"
            :tag="tag"
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

      <nav
        v-if="section.surround"
        class="mt-12 grid gap-4 border-t border-zinc-200 pt-6 sm:grid-cols-2 dark:border-zinc-800"
      >
        <NuxtLink
          v-if="newer"
          :to="newer.path"
          class="group rounded-lg border border-zinc-200 p-4 transition-colors hover:border-indigo-300 dark:border-zinc-800 dark:hover:border-indigo-700"
        >
          <p class="text-xs text-zinc-400">
            上一篇
          </p>
          <p class="mt-1 font-medium text-zinc-800 group-hover:text-indigo-600 dark:text-zinc-200 dark:group-hover:text-indigo-400">
            {{ newer.title }}
          </p>
        </NuxtLink>
        <span
          v-else
          class="hidden sm:block"
        />
        <NuxtLink
          v-if="older"
          :to="older.path"
          class="group rounded-lg border border-zinc-200 p-4 text-right transition-colors hover:border-indigo-300 dark:border-zinc-800 dark:hover:border-indigo-700"
        >
          <p class="text-xs text-zinc-400">
            下一篇
          </p>
          <p class="mt-1 font-medium text-zinc-800 group-hover:text-indigo-600 dark:text-zinc-200 dark:group-hover:text-indigo-400">
            {{ older.title }}
          </p>
        </NuxtLink>
      </nav>

      <nav
        v-if="section.backLink"
        class="mt-12 border-t border-zinc-200 pt-6 dark:border-zinc-800"
      >
        <NuxtLink
          :to="`/${section.key}`"
          class="text-sm font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400"
        >
          ← 返回{{ navLabelOf(section) }}列表
        </NuxtLink>
      </nav>
    </article>

    <aside
      v-if="!isWide && post.body?.toc?.links?.length"
      class="self-start"
    >
      <Toc :links="post.body.toc.links" />
    </aside>
  </div>
</template>
