/**
 * 把 YYYY-MM-DD（或带时间的 ISO 字符串）写成「2026 年 11 月 5 日」。
 * 无法识别成日期的字符串原样返回，不抛错——内容来自 frontmatter，渲染阶段不应该因为一个写错的日期让整页失败。
 */
export function formatDate(date?: string | null): string {
  if (!date)
    return ''
  const [y, m, d] = date.slice(0, 10).split('-')
  if (!y || !m || !d)
    return date
  return `${y} 年 ${Number(m)} 月 ${Number(d)} 日`
}
