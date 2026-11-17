import type { Ref } from 'vue'

/**
 * 标签统计与筛选：统计 items 中各标签出现次数（按次数降序），
 * 并按当前选中标签过滤列表。用于文章、收藏等带 tags 的列表页。
 */
export function useTagFilter<T extends { tags?: string[] }>(items: Ref<T[] | null | undefined>) {
  const activeTag = ref<string | null>(null)

  const allTags = computed(() => {
    const counter = new Map<string, number>()
    for (const it of items.value ?? []) {
      for (const t of it.tags ?? []) counter.set(t, (counter.get(t) ?? 0) + 1)
    }
    return [...counter.entries()].sort((a, b) => b[1] - a[1])
  })

  const filtered = computed(() =>
    activeTag.value
      ? (items.value ?? []).filter(it => it.tags?.includes(activeTag.value!))
      : items.value ?? [],
  )

  return { activeTag, allTags, filtered }
}
