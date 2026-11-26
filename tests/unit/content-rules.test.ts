import { describe, expect, it } from 'vitest'
import { checkData, checkPost, parseCards, parseFrontmatter } from '../../scripts/lib/content-rules.mjs'

const exists = (path: string) => path === '/images/ok.jpg'

function post(frontmatter: string, body = '', slug = 'day_2026-11-25') {
  return { slug, text: `---\n${frontmatter}\n---\n${body}`, coverExists: exists }
}

describe('parseFrontmatter', () => {
  it('拆出 frontmatter 数据与正文', () => {
    const parsed = parseFrontmatter('---\ntitle: 标题\ndate: 2026-11-25\n---\n正文')
    expect(parsed).toEqual({ data: { title: '标题', date: '2026-11-25' }, body: '正文' })
  })

  it('文件不是以 frontmatter 开头时返回 null', () => {
    expect(parseFrontmatter('# 没有 frontmatter')).toBeNull()
  })
})

describe('parseCards', () => {
  it('解析每个 daily-card 的属性，属性值里的引号与转义保持原样', () => {
    const body = [
      '前言',
      '::daily-card',
      '---',
      'title: "1. 标题"',
      'url: "https://example.com/a"',
      'score: "95"',
      '---',
      '摘要',
      '::',
      '结尾',
    ].join('\n')
    expect(parseCards(body)).toEqual([
      { title: '1. 标题', url: 'https://example.com/a', score: '95' },
    ])
  })

  it('正文里没有卡片时得到空数组', () => {
    expect(parseCards('只有文字')).toEqual([])
  })
})

describe('checkPost', () => {
  it('字段齐全、封面存在、链接合法的文章没有问题', () => {
    expect(checkPost(post([
      'title: 每日技术热读',
      'description: 今日看点：模型发布。',
      'date: 2026-11-25',
      'tags:\n  - 技术热读',
      'cover: /images/ok.jpg',
    ].join('\n'), '::daily-card\n---\ntitle: "a"\nurl: "https://a.com"\n---\n摘要\n::'))).toEqual({ errors: [], warnings: [] })
  })

  it('没有 frontmatter、缺少必填字段都算错误', () => {
    expect(checkPost({ slug: 'day_2026-11-25', text: '# 没有元数据', coverExists: exists }).errors).toEqual([
      '缺少 frontmatter',
    ])
    expect(checkPost(post('title: 只有标题')).errors).toEqual([
      '缺少必填字段 date',
      '缺少必填字段 tags',
    ])
  })

  it('日期必须是真实存在的 YYYY-MM-DD', () => {
    // 文件名不带日期，隔离出「日期格式」这一条规则
    const bad = (date: string) => checkPost(post(`title: t\ndate: ${date}\ntags: []`, '', 'notes')).errors
    expect(bad('2026-02-30')).toEqual(['date「2026-02-30」不是有效的 YYYY-MM-DD 日期'])
    expect(bad('2026/11/25')).toEqual(['date「2026/11/25」不是有效的 YYYY-MM-DD 日期'])
  })

  it('文件名里的日期与 frontmatter 的 date 不一致时算错误', () => {
    const result = checkPost({ ...post('title: t\ndate: 2026-11-24\ntags: []'), slug: 'day_2026-11-25' })
    expect(result.errors).toEqual(['文件名里的日期 2026-11-25 与 date「2026-11-24」不一致'])
  })

  it('封面或卡片链接指向不存在的资源时算错误', () => {
    expect(checkPost(post('title: t\ndate: 2026-11-25\ntags: []\ncover: /images/missing.jpg')).errors).toEqual([
      'cover「/images/missing.jpg」在 public/ 下不存在',
    ])
  })

  it('卡片缺少标题或链接、链接不是 http(s) 时算错误', () => {
    const body = [
      '::daily-card',
      '---',
      'url: "https://a.com"',
      '---',
      'x',
      '::',
      '::daily-card',
      '---',
      'title: "b"',
      'url: "ftp://b.com"',
      '---',
      'y',
      '::',
    ].join('\n')
    expect(checkPost(post('title: t\ndate: 2026-11-25\ntags: []', body)).errors).toEqual([
      '第 1 张卡片缺少 title',
      '第 2 张卡片的 url「ftp://b.com」不是 http(s) 链接',
    ])
  })

  it('描述恰好 78 个字且没有句末标点，提示可能被硬截（只是提醒）', () => {
    const description = '甲'.repeat(77) + '乙'
    const result = checkPost(post(`title: t\ndescription: ${description}\ndate: 2026-11-25\ntags: []`))
    expect(result.errors).toEqual([])
    expect(result.warnings).toEqual(['description 恰好 78 个字且没有句末标点，可能是在句子中间被硬截的'])
  })

  it('按句读截断后的描述不带句末标点，长度也不是 78，不算问题', () => {
    const description = '今日看点：模型正式发布，开发者社区反响热烈，多家公司宣布跟进支持，生态持续壮大'
    expect(description.length).not.toBe(78) // 前提：不是硬截的长度
    const result = checkPost(post(`title: t\ndescription: ${description}\ndate: 2026-11-25\ntags: []`))
    expect(result).toEqual({ errors: [], warnings: [] })
  })

  it('带句末标点的描述不论多长都不算问题', () => {
    const description = '甲'.repeat(77) + '。'
    const result = checkPost(post(`title: t\ndescription: ${description}\ndate: 2026-11-25\ntags: []`))
    expect(result).toEqual({ errors: [], warnings: [] })
  })

  it('较短的结构化描述没有句末标点不算问题', () => {
    const description = '本周Top1：dream-num/univer +7,248⭐；Top10 合计 +43,289⭐ · GLM-5.3 AI 深度分析'
    const result = checkPost(post(`title: t\ndescription: ${description}\ndate: 2026-11-25\ntags: []`))
    expect(result).toEqual({ errors: [], warnings: [] })
  })
})

describe('checkData', () => {
  it('项目：字段、链接与封面', () => {
    expect(checkData('projects', { title: '大屏', description: '介绍', tech: ['Vue'], date: '2026-06-01', link: '/ZONE/demo/', cover: '/images/ok.jpg' }, { assetExists: exists })).toEqual({ errors: [], warnings: [] })
    expect(checkData('projects', { title: '大屏', description: '介绍', tech: [], date: '2026-06-01', link: 'demo', cover: '/images/missing.jpg' }, { assetExists: exists }).errors).toEqual([
      'link「demo」既不是站内路径也不是 http(s) 链接',
      'cover「/images/missing.jpg」在 public/ 下不存在',
    ])
  })

  it('相册：至少一张图，且每张图都存在', () => {
    expect(checkData('gallery', { title: '横幅', date: '2020-06-18', images: [{ src: '/images/ok.jpg' }] }, { assetExists: exists })).toEqual({ errors: [], warnings: [] })
    expect(checkData('gallery', { title: '横幅', date: '2020-06-18', images: [{ src: '/images/gone.jpg' }] }, { assetExists: exists }).errors).toEqual([
      '第 1 张图片「/images/gone.jpg」在 public/ 下不存在',
    ])
    expect(checkData('gallery', { title: '横幅', date: '2020-06-18', images: [] }, { assetExists: exists }).errors).toEqual(['images 不能为空'])
  })

  it('收藏：链接必须是合法的 http(s) 地址', () => {
    expect(checkData('collections', { title: '文档', url: 'https://nuxt.com/docs', date: '2026-11-01' }, { assetExists: exists })).toEqual({ errors: [], warnings: [] })
    expect(checkData('collections', { title: '文档', url: 'nuxt.com', date: '2026-11-01' }, { assetExists: exists }).errors).toEqual([
      'url「nuxt.com」不是 http(s) 链接',
    ])
  })

  it('各集合都要求有标题和有效日期', () => {
    // 传入一条几乎空白的记录：前两条错误一定是标题与日期，其后才是各集合自己的必填项
    for (const kind of ['projects', 'gallery', 'collections'] as const) {
      expect(checkData(kind, { date: '2026-13-01' }, { assetExists: exists }).errors.slice(0, 2)).toEqual([
        '缺少必填字段 title',
        'date「2026-13-01」不是有效的 YYYY-MM-DD 日期',
      ])
    }
  })

  it('项目必须有简介', () => {
    expect(checkData('projects', { title: '大屏', date: '2026-06-01' }, { assetExists: exists }).errors).toEqual([
      '缺少必填字段 description',
    ])
  })
})
