import { describe, expect, it } from 'vitest'
import { belongsSection, navLabelOf, sectionOf, sections } from '~/config/sections'
import { canShowPost, normalizePath, surroundOf } from '~/utils/posts'

describe('板块注册表', () => {
  it('每个板块的 key 互不重复，且都是可以直接当路径段使用的字符串', () => {
    const keys = sections.map(section => section.key)
    expect(new Set(keys).size).toBe(keys.length)
    for (const key of keys)
      expect(key, key).toMatch(/^[a-z0-9-]+$/)
  })

  it('导航文案互不相同，不会出现两个同名入口', () => {
    const labels = sections.map(section => navLabelOf(section))
    expect(new Set(labels).size).toBe(labels.length)
  })
})

describe('sectionOf', () => {
  it('从文章路径里取出一级目录对应的板块', () => {
    expect(sectionOf('/blog/day_2026-11-25')?.key).toBe('blog')
    expect(sectionOf('/weekly/2026-11-20')?.key).toBe('weekly')
    expect(sectionOf('/weekly/2026-11-20/')?.key).toBe('weekly')
  })

  it('列表页、根路径以及不属于任何板块的路径没有对应板块', () => {
    for (const path of ['/', '', '/blog', '/weekly/', '/tags/技术热读', '/about', '/blogx/a', '/unknown/a', '/blog/a/b'])
      expect(sectionOf(path), path).toBeUndefined()
  })
})

describe('belongsSection', () => {
  it('只有路径落在该板块目录之下才算属于它', () => {
    expect(belongsSection('/blog/day_2026-11-25', 'blog')).toBe(true)
    expect(belongsSection('/weekly/2026-11-20', 'blog')).toBe(false)
    expect(belongsSection('/blogx/a', 'blog')).toBe(false)
    expect(belongsSection('/blog', 'blog')).toBe(false)
  })
})

describe('surroundOf', () => {
  // 列表按日期从新到旧
  const list = ['a', 'b', 'c', 'd'].map(path => ({ path }))

  it('最新一篇没有更新的篇目，只有更旧的一篇', () => {
    expect(surroundOf(list, 'a')).toEqual({ newer: null, older: { path: 'b' } })
  })

  it('最旧一篇只有更新的一篇', () => {
    expect(surroundOf(list, 'd')).toEqual({ newer: { path: 'c' }, older: null })
  })

  it('中间的篇目两侧各有一篇，newer 是日期更新的那篇', () => {
    expect(surroundOf(list, 'c')).toEqual({ newer: { path: 'b' }, older: { path: 'd' } })
  })

  it('路径不在列表里时（例如跨板块访问）两侧都为空', () => {
    expect(surroundOf(list, 'not-in-list')).toEqual({ newer: null, older: null })
    expect(surroundOf([], 'a')).toEqual({ newer: null, older: null })
  })
})

describe('normalizePath', () => {
  it('去掉路径末尾的斜杠，根路径保持不变', () => {
    expect(normalizePath('/blog/day_2026-11-24/')).toBe('/blog/day_2026-11-24')
    expect(normalizePath('/blog/day_2026-11-24')).toBe('/blog/day_2026-11-24')
    expect(normalizePath('/a/b///')).toBe('/a/b')
    expect(normalizePath('/')).toBe('/')
  })
})

describe('canShowPost', () => {
  // 合并集合后文章路径全局唯一，但页面只能展示自己板块下的文章
  const post = { path: '/blog/day_2026-11-24', draft: false }

  it('属于该板块的已发布文章可以展示', () => {
    expect(canShowPost(post, 'blog')).toBe(true)
    expect(canShowPost({ path: '/weekly/2026-11-20' }, 'weekly')).toBe(true)
    // 没写 draft 字段视为已发布
    expect(canShowPost({ path: '/blog/day_2026-11-24' }, 'blog')).toBe(true)
  })

  it('别的板块的文章、草稿、不存在的文章都不能展示', () => {
    expect(canShowPost(post, 'weekly')).toBe(false)
    expect(canShowPost({ path: '/weekly/2026-11-20' }, 'blog')).toBe(false)
    expect(canShowPost({ ...post, draft: true }, 'blog')).toBe(false)
    expect(canShowPost(null, 'blog')).toBe(false)
  })
})
