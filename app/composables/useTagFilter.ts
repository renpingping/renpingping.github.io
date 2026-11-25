import type { Ref } from 'vue'
import { computed, ref } from 'vue'
import { countTags, filterByTag } from '~/utils/tags'

/**
 * 标签统计与筛选：统计 items 中各标签出现次数（按次数降序），
 * 并按当前选中标签过滤列表。用于文章、收藏等带 tags 的列表页。
 * 纯逻辑在 ~/utils/tags 里，这里只负责把结果变成响应式的。
 */
export function useTagFilter<T extends { tags?: string[] }>(items: Ref<readonly T[] | null | undefined>) {
  const activeTag = ref<string | null>(null)

  const allTags = computed(() => countTags(items.value ?? []))

  const filtered = computed(() =>
    activeTag.value ? filterByTag(items.value ?? [], activeTag.value) : items.value ?? [],
  )

  return { activeTag, allTags, filtered }
}
