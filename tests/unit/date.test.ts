import { describe, expect, it } from 'vitest'
import { formatDate } from '~/utils/date'

describe('formatDate', () => {
  it('把 ISO 日期写成中文日期，去掉月和日的前导零', () => {
    expect(formatDate('2026-11-05')).toBe('2026 年 11 月 5 日')
  })

  it('带时间的 ISO 字符串只取日期部分', () => {
    expect(formatDate('2026-02-09T01:02:03.000Z')).toBe('2026 年 2 月 9 日')
  })

  it('空值返回空字符串', () => {
    expect(formatDate('')).toBe('')
    expect(formatDate(undefined)).toBe('')
    expect(formatDate(null)).toBe('')
  })

  it('不是 YYYY-MM-DD 形式时原样返回，不抛错', () => {
    expect(formatDate('2026/11/05')).toBe('2026/11/05')
    expect(formatDate('上周')).toBe('上周')
  })
})
