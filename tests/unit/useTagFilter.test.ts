import { ref } from 'vue'
import { describe, expect, it } from 'vitest'
import { useTagFilter } from '~/composables/useTagFilter'

const titles = (list: { title: string }[]) => list.map(item => item.title)

describe('useTagFilter', () => {
  it('选中标签后只剩匹配项，取消选择后恢复全部', () => {
    const items = ref([
      { title: 'a', tags: ['Vue'] },
      { title: 'b', tags: ['CSS'] },
    ])
    const { activeTag, filtered } = useTagFilter(items)

    expect(titles(filtered.value)).toEqual(['a', 'b'])
    activeTag.value = 'Vue'
    expect(titles(filtered.value)).toEqual(['a'])
    activeTag.value = null
    expect(titles(filtered.value)).toEqual(['a', 'b'])
  })

  it('数据源变化后，统计与筛选结果跟着更新', () => {
    const items = ref([{ title: 'a', tags: ['Vue'] }])
    const { allTags, filtered, activeTag } = useTagFilter(items)

    items.value = [
      { title: 'b', tags: ['CSS'] },
      { title: 'c', tags: ['CSS'] },
    ]
    expect(allTags.value).toEqual([['CSS', 2]])

    activeTag.value = 'CSS'
    expect(titles(filtered.value)).toEqual(['b', 'c'])
  })

  it('数据源尚未加载（null）时按空列表处理', () => {
    const items = ref<{ title: string, tags?: string[] }[] | null>(null)
    const { allTags, filtered } = useTagFilter(items)

    expect(allTags.value).toEqual([])
    expect(filtered.value).toEqual([])
  })
})
