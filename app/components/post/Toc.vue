<script setup lang="ts">
import type { TocLink } from '~/utils/toc'
import { flattenToc } from '~/utils/toc'

const props = defineProps<{
  /** 文章的标题树；子标题会按文档顺序摊平后一起列出 */
  links: readonly TocLink[]
}>()

const entries = computed(() => flattenToc(props.links))
</script>

<template>
  <nav
    class="card-surface sticky top-20 hidden max-h-[calc(100vh-6rem)] overflow-auto p-4 text-sm xl:block"
    aria-label="目录"
  >
    <p class="mb-3 font-semibold text-zinc-900 dark:text-zinc-100">
      目录
    </p>
    <ul class="space-y-1.5 border-l border-zinc-200 dark:border-zinc-800">
      <!-- 二级标题缩进 12px，每深一级再加 12px -->
      <li
        v-for="link in entries"
        :key="link.id"
      >
        <a
          :href="`#${link.id}`"
          class="block text-muted transition-colors hover:text-indigo-600 dark:hover:text-indigo-400"
          :style="{ paddingLeft: `${(link.depth - 2) * 12 + 12}px` }"
        >{{ link.text }}</a>
      </li>
    </ul>
  </nav>
</template>
