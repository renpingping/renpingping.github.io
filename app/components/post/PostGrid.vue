<script setup lang="ts">
import type { PostSummary } from '~/types/post'

const props = defineProps<{
  posts: readonly PostSummary[]
  /** 是否显示标签筛选条 */
  filterable?: boolean
  /** 列表为空时的提示；不填则不显示 */
  emptyText?: string
}>()

const { activeTag, allTags, filtered } = useTagFilter(toRef(props, 'posts'))
</script>

<template>
  <!-- TODO(M5): 筛选条抽成独立组件 TagFilter，文章与收藏页共用 -->
  <div
    v-if="filterable && allTags.length"
    class="mb-8 flex flex-wrap items-center gap-2"
  >
    <button
      class="rounded-full px-3 py-1 text-sm font-medium transition-colors"
      :class="activeTag === null
        ? 'bg-indigo-600 text-white'
        : 'bg-zinc-200/60 text-zinc-600 hover:bg-zinc-300/60 dark:bg-zinc-800 dark:text-zinc-400'"
      @click="activeTag = null"
    >
      全部
    </button>
    <button
      v-for="[tag, count] in allTags"
      :key="tag"
      class="rounded-full px-3 py-1 text-sm font-medium transition-colors"
      :class="activeTag === tag
        ? 'bg-indigo-600 text-white'
        : 'bg-zinc-200/60 text-zinc-600 hover:bg-zinc-300/60 dark:bg-zinc-800 dark:text-zinc-400'"
      @click="activeTag = tag"
    >
      {{ tag }} ({{ count }})
    </button>
  </div>

  <div class="grid gap-6 sm:grid-cols-2">
    <PostCard
      v-for="post in filtered"
      :key="post.path"
      :post="post"
    />
  </div>

  <p
    v-if="emptyText && !filtered.length"
    class="py-16 text-center text-sm text-zinc-400"
  >
    {{ emptyText }}
  </p>
</template>
