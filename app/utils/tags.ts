/**
 * 统计各项标签的出现次数，按次数降序；次数相同的保持首次出现的顺序。
 * 供文章、收藏等带标签的列表页生成筛选条。
 */
export function countTags<T extends { tags?: string[] }>(items: readonly T[]): [string, number][] {
  const counter = new Map<string, number>()
  for (const item of items) {
    for (const tag of item.tags ?? [])
      counter.set(tag, (counter.get(tag) ?? 0) + 1)
  }
  return [...counter.entries()].sort((a, b) => b[1] - a[1])
}

/**
 * 只保留带选中标签的项；没有选中标签（null）时原样返回。
 * 标签按原样精确匹配，不忽略大小写或首尾空白——标签是作者手写的，写法不同就该视为不同标签。
 */
export function filterByTag<T extends { tags?: string[] }>(items: readonly T[], tag: string | null): readonly T[] {
  return tag ? items.filter(item => item.tags?.includes(tag)) : items
}
