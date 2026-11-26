import { describe, expect, it } from 'vitest'
import { linkKind } from '~/utils/link'

describe('linkKind', () => {
  it('http(s) 开头的是外部链接，域名大小写不影响判断', () => {
    expect(linkKind('https://example.com')).toBe('external')
    expect(linkKind('http://example.com/a?b=1')).toBe('external')
    expect(linkKind('HTTPS://example.com')).toBe('external')
  })

  it('/ZONE 下是原样发布的静态页，需要整页跳转', () => {
    expect(linkKind('/ZONE/demo/')).toBe('static')
    expect(linkKind('/ZONE')).toBe('static')
  })

  it('其余站内路径走单页路由', () => {
    expect(linkKind('/demos/interactive-cards')).toBe('spa')
    expect(linkKind('/zones/demo')).toBe('spa')
    expect(linkKind('/blog')).toBe('spa')
  })
})
