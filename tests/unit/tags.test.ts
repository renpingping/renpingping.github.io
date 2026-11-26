import { describe, expect, it } from 'vitest'
import { countTags, filterByTag } from '~/utils/tags'

interface Item {
  title: string
  tags?: string[]
}

const items: Item[] = [
  { title: 'a', tags: ['Vue', 'Nuxt'] },
  { title: 'b', tags: ['Nuxt'] },
  { title: 'c', tags: ['CSS', 'Vue'] },
  { title: 'd' },
  { title: 'e', tags: [] },
]

describe('countTags', () => {
  it('按出现次数降序，次数相同的保持首次出现的顺序', () => {
    expect(countTags(items)).toEqual([
      ['Vue', 2],
      ['Nuxt', 2],
      ['CSS', 1],
    ])
  })

  it('同一项里重复出现的标签按出现次数计', () => {
    expect(countTags([{ title: 'x', tags: ['Vue', 'Vue'] }])).toEqual([['Vue', 2]])
  })

  it('列表为空或都没有标签时得到空结果', () => {
    expect(countTags([])).toEqual([])
    expect(countTags([{ title: 'd' }, { title: 'e', tags: [] }])).toEqual([])
  })
})

describe('filterByTag', () => {
  it('只保留带选中标签的项，并保持原有顺序', () => {
    expect(filterByTag(items, 'Vue').map(item => item.title)).toEqual(['a', 'c'])
  })

  it('标签按原样精确匹配，不忽略大小写或首尾空白', () => {
    expect(filterByTag(items, 'vue')).toEqual([])
    expect(filterByTag(items, ' Vue')).toEqual([])
  })

  it('没有选中标签时返回原列表', () => {
    expect(filterByTag(items, null)).toBe(items)
  })

  it('没有项带该标签时返回空数组', () => {
    expect(filterByTag(items, 'React')).toEqual([])
  })
})
