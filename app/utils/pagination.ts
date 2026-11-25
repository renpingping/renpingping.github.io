/** 一共多少页；没有内容时也按 1 页算，保证「第 1 页」始终有效 */
export function pageCount(total: number, pageSize: number): number {
  return Math.max(1, Math.ceil(total / pageSize))
}

/**
 * 分页控件要显示的项：页码或 'gap'（省略号）。
 * 页数不多时列出全部；页数很多时保留首页、末页、当前页及其相邻页，其余用省略号代替。结果升序且不重复。
 * 如果两个页码之间只少了一页，就直接显示那一页——省略号至少要省掉两页才有意义。
 */
export function paginationItems(page: number, totalPages: number): (number | 'gap')[] {
  if (totalPages <= 1)
    return []

  const wanted = new Set([1, totalPages])
  for (const nearby of [page - 1, page, page + 1]) {
    if (nearby >= 1 && nearby <= totalPages)
      wanted.add(nearby)
  }

  const pages = [...wanted].sort((a, b) => a - b)
  const items: (number | 'gap')[] = []
  pages.forEach((current, index) => {
    const previous = pages[index - 1]
    if (previous === undefined) {
      // 第一项
    }
    else if (current - previous === 2) {
      items.push(current - 1)
    }
    else if (current - previous > 2) {
      items.push('gap')
    }
    items.push(current)
  })
  return items
}

/** 从地址栏的 ?page= 取页码：缺省或非法值按第 1 页，超出范围停在最后一页 */
export function pageFromQuery(value: unknown, totalPages: number): number {
  const parsed = Number.parseInt(String(value ?? ''), 10)
  if (!Number.isInteger(parsed) || parsed < 1)
    return 1
  return Math.min(parsed, Math.max(1, totalPages))
}
