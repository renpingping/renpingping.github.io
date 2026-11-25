<script setup lang="ts">
import { paginationItems } from '~/utils/pagination'

const props = defineProps<{
  page: number
  totalPages: number
  /** 某一页的链接地址 */
  href: (page: number) => string | { query: Record<string, string | undefined> }
}>()

const items = computed(() => paginationItems(props.page, props.totalPages))

const link = 'rounded-md px-3 py-1.5 text-zinc-600 transition-colors hover:bg-zinc-200/60 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100'
const disabled = 'px-3 py-1.5 text-zinc-300 dark:text-zinc-700'
</script>

<template>
  <!-- 只有一页时不显示任何分页控件 -->
  <nav
    v-if="totalPages > 1"
    class="mt-10 flex flex-wrap items-center justify-center gap-1 text-sm"
    aria-label="分页"
  >
    <NuxtLink
      v-if="page > 1"
      :to="href(page - 1)"
      :class="link"
      rel="prev"
    >
      ← 上一页
    </NuxtLink>
    <span
      v-else
      :class="disabled"
      aria-hidden="true"
    >← 上一页</span>

    <template
      v-for="(item, index) in items"
      :key="index"
    >
      <span
        v-if="item === 'gap'"
        class="px-1 text-zinc-400"
        aria-hidden="true"
      >…</span>
      <NuxtLink
        v-else-if="item !== page"
        :to="href(item)"
        :class="link"
        :aria-label="`第 ${item} 页`"
      >
        {{ item }}
      </NuxtLink>
      <span
        v-else
        class="rounded-md bg-indigo-600 px-3 py-1.5 font-medium text-white"
        aria-current="page"
      >{{ item }}</span>
    </template>

    <NuxtLink
      v-if="page < totalPages"
      :to="href(page + 1)"
      :class="link"
      rel="next"
    >
      下一页 →
    </NuxtLink>
    <span
      v-else
      :class="disabled"
      aria-hidden="true"
    >下一页 →</span>
  </nav>
</template>
