import { describe, expect, it } from 'vitest'
import { pageCount, pageFromQuery, paginationItems } from '~/utils/pagination'

describe('pageCount', () => {
  it('不足一页或刚好一页都算 1 页', () => {
    expect(pageCount(0, 20)).toBe(1)
    expect(pageCount(19, 20)).toBe(1)
    expect(pageCount(20, 20)).toBe(1)
  })

  it('多出一篇就多一页', () => {
    expect(pageCount(21, 20)).toBe(2)
    expect(pageCount(40, 20)).toBe(2)
    expect(pageCount(41, 20)).toBe(3)
  })
})

describe('paginationItems', () => {
  it('只有一页时不需要任何页码', () => {
    expect(paginationItems(1, 1)).toEqual([])
  })

  it('页数不多时列出全部页码', () => {
    expect(paginationItems(1, 3)).toEqual([1, 2, 3])
    expect(paginationItems(3, 5)).toEqual([1, 2, 3, 4, 5])
  })

  it('页数很多时保留首页、末页、当前页及其相邻页，其余用省略号代替', () => {
    expect(paginationItems(1, 12)).toEqual([1, 2, 'gap', 12])
    expect(paginationItems(3, 10)).toEqual([1, 2, 3, 4, 'gap', 10])
    expect(paginationItems(5, 12)).toEqual([1, 'gap', 4, 5, 6, 'gap', 12])
    expect(paginationItems(7, 10)).toEqual([1, 'gap', 6, 7, 8, 9, 10])
    expect(paginationItems(12, 12)).toEqual([1, 'gap', 11, 12])
  })
})

describe('pageFromQuery', () => {
  it('缺省、不是数字或小于 1 时按第 1 页处理', () => {
    expect(pageFromQuery(undefined, 5)).toBe(1)
    expect(pageFromQuery('', 5)).toBe(1)
    expect(pageFromQuery('abc', 5)).toBe(1)
    expect(pageFromQuery('0', 5)).toBe(1)
    expect(pageFromQuery('-3', 5)).toBe(1)
    expect(pageFromQuery('2.7', 5)).toBe(2)
  })

  it('超出最后一页时停在最后一页', () => {
    expect(pageFromQuery('99', 5)).toBe(5)
    expect(pageFromQuery('6', 5)).toBe(5)
  })

  it('范围内的页码原样返回', () => {
    expect(pageFromQuery('3', 5)).toBe(3)
    expect(pageFromQuery(4, 5)).toBe(4)
  })
})
