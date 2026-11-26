import { describe, expect, it } from 'vitest'
import { flattenToc } from '~/utils/toc'

describe('flattenToc', () => {
  it('把嵌套的标题按文档顺序摊平，并保留各自的层级', () => {
    const links = [
      { id: 'a', depth: 2, text: 'A', children: [{ id: 'a1', depth: 3, text: 'A1', children: [{ id: 'a1x', depth: 4, text: 'A1x' }] }] },
      { id: 'b', depth: 2, text: 'B' },
      { id: 'c', depth: 2, text: 'C', children: [{ id: 'c1', depth: 3, text: 'C1' }] },
    ]
    expect(flattenToc(links)).toEqual([
      { id: 'a', depth: 2, text: 'A' },
      { id: 'a1', depth: 3, text: 'A1' },
      { id: 'a1x', depth: 4, text: 'A1x' },
      { id: 'b', depth: 2, text: 'B' },
      { id: 'c', depth: 2, text: 'C' },
      { id: 'c1', depth: 3, text: 'C1' },
    ])
  })

  it('没有子标题或输入为空时原样返回', () => {
    expect(flattenToc([])).toEqual([])
    expect(flattenToc([{ id: 'a', depth: 2, text: 'A' }])).toEqual([{ id: 'a', depth: 2, text: 'A' }])
  })
})
