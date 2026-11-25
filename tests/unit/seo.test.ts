import { describe, expect, it } from 'vitest'
import { toRfc822Date, toSiteUrl } from '../../shared/utils/site-url'
import { escapeXml } from '../../shared/utils/xml'

describe('escapeXml', () => {
  it('转义 XML 里的五个特殊字符', () => {
    expect(escapeXml(`<a href="x">A & B</a>`)).toBe('&lt;a href=&quot;x&quot;&gt;A &amp; B&lt;/a&gt;')
    expect(escapeXml(`It's`)).toBe('It&apos;s')
  })

  it('普通文本原样返回', () => {
    expect(escapeXml('每日技术热读 2026-11-25')).toBe('每日技术热读 2026-11-25')
  })

  it('非字符串按字符串处理，不会抛错', () => {
    expect(escapeXml(42)).toBe('42')
  })
})

describe('toSiteUrl', () => {
  it('根路径', () => {
    expect(toSiteUrl('/')).toBe('https://renpingping.github.io/')
  })

  it('其余路径补上尾斜杠——GitHub Pages 实际提供的地址带尾斜杠，不带的那种会被 301 过去', () => {
    expect(toSiteUrl('/blog')).toBe('https://renpingping.github.io/blog/')
    expect(toSiteUrl('/blog/day_2026-11-25/')).toBe('https://renpingping.github.io/blog/day_2026-11-25/')
  })

  it('中文等非 ASCII 字符按地址栏的形式编码', () => {
    expect(toSiteUrl('/tags/GitHub周报')).toBe('https://renpingping.github.io/tags/GitHub%E5%91%A8%E6%8A%A5/')
  })

  it('路由给出的路径可能已经编码过：结果与未编码的输入一致，不会重复编码', () => {
    const expected = 'https://renpingping.github.io/tags/GitHub%E5%91%A8%E6%8A%A5/'
    expect(toSiteUrl('/tags/GitHub%E5%91%A8%E6%8A%A5')).toBe(expected)
    expect(toSiteUrl('/tags/GitHub周报')).toBe(expected)
  })

  it('标签里含 + / # & 这类地址保留字符时不会重复编码', () => {
    // 路由给出的路径里它们是编码过的（%2B、%2F…），decodeURI 不会解码它们，必须逐段用 decodeURIComponent
    expect(toSiteUrl('/tags/C%2B%2B')).toBe('https://renpingping.github.io/tags/C%2B%2B/')
    expect(toSiteUrl('/tags/C++')).toBe('https://renpingping.github.io/tags/C%2B%2B/')
    expect(toSiteUrl('/tags/a%2Fb')).toBe('https://renpingping.github.io/tags/a%2Fb/')
    expect(toSiteUrl('/tags/%E8%AE%BE%E8%AE%A1%26%E5%BC%80%E5%8F%91')).toBe('https://renpingping.github.io/tags/%E8%AE%BE%E8%AE%A1%26%E5%BC%80%E5%8F%91/')
  })

  it('路径里有不成对的 % 时不抛错', () => {
    expect(toSiteUrl('/tags/100%')).toBe('https://renpingping.github.io/tags/100%25/')
  })

  it('保留查询参数', () => {
    expect(toSiteUrl('/tags/Vue?page=2')).toBe('https://renpingping.github.io/tags/Vue/?page=2')
  })
})

describe('toRfc822Date', () => {
  it('ISO 日期按 GMT 零点输出，供 RSS 使用', () => {
    expect(toRfc822Date('2026-11-25')).toBe('Wed, 25 Nov 2026 00:00:00 GMT')
  })

  it('带时区的时间换算到 GMT', () => {
    expect(toRfc822Date('2026-11-25T09:00:00+08:00')).toBe('Wed, 25 Nov 2026 01:00:00 GMT')
  })

  it('无法识别的日期返回空字符串，不抛错', () => {
    expect(toRfc822Date('上周')).toBe('')
    expect(toRfc822Date(undefined)).toBe('')
  })
})
