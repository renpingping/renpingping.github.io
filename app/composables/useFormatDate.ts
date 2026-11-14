export function useFormatDate() {
  function format(date?: string | null): string {
    if (!date) return ''
    const [y, m, d] = date.slice(0, 10).split('-')
    if (!y || !m || !d) return date
    return `${y} 年 ${Number(m)} 月 ${Number(d)} 日`
  }
  return { format }
}
