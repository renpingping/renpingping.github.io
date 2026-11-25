import type { Page } from '@playwright/test'
import { readdirSync, readFileSync, statSync } from 'node:fs'
import { join, resolve } from 'node:path'
import { parse } from 'devalue'
import { expect, test } from '@playwright/test'
import { DEFAULT_PAGE_SIZE, getSection, pageSizeOf, sections } from '../../app/config/sections'
import { SITE } from '../../shared/site'
import { toSiteUrl } from '../../shared/utils/site-url'
import { escapeXml } from '../../shared/utils/xml'

/**
 * 全站端到端测试，跑在 `nuxt generate` 的静态产物上。
 * 约定：定位只用 role、可见文本和 href，不用样式类名，这样重构样式不会让行为测试失效；
 * 条目数量一律从 content/ 目录实时推导，机器人每天新增文章也不需要改测试。
 */

const CONTENT = resolve(process.cwd(), 'content')

interface Post {
  path: string
  slug: string
  title: string
  date: string
  tags: string[]
  draft: boolean
  description?: string
}

function readPosts(section: 'blog' | 'weekly'): Post[] {
  const dir = join(CONTENT, section)
  return readdirSync(dir)
    .filter(file => file.endsWith('.md'))
    .map((file) => {
      const text = readFileSync(join(dir, file), 'utf8')
      const frontmatter = text.match(/^---\n([\s\S]*?)\n---/)?.[1] ?? ''
      const field = (key: string) => frontmatter.match(new RegExp(`^${key}:\\s*(.*)$`, 'm'))?.[1]?.trim().replace(/^["']|["']$/g, '')
      const tagsBlock = frontmatter.match(/^tags:\n((?:[ \t]+- .*\n?)+)/m)?.[1] ?? ''
      const slug = file.replace(/\.md$/, '')
      return {
        path: `/${section}/${slug}`,
        slug,
        title: field('title') ?? '',
        date: field('date') ?? '',
        tags: [...tagsBlock.matchAll(/^[ \t]+- (.*)$/gm)].map(m => m[1].trim()),
        draft: /^draft:\s*true\s*$/m.test(frontmatter),
        description: field('description'),
      }
    })
    .sort((a, b) => b.date.localeCompare(a.date))
}

const blog = readPosts('blog')
const weekly = readPosts('weekly')
const cardCount = (section: string, slug: string) =>
  readFileSync(join(CONTENT, section, `${slug}.md`), 'utf8').split('::daily-card').length - 1
const escapeRe = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

type NuxtRoot = HTMLElement & { __vue_app__?: unknown }

/**
 * 打开页面并等客户端完成水合：水合完成之前的点击不会触发事件处理器。
 * Vue 挂载时会在根容器上挂 __vue_app__；之后再等一帧，让依赖异步数据的页面组件也完成水合。
 */
async function open(page: Page, path: string) {
  await page.goto(path)
  await page.waitForFunction(() => !!(document.querySelector('#__nuxt') as NuxtRoot | null)?.__vue_app__)
  await page.evaluate(() => new Promise<void>(resolve => requestAnimationFrame(() => resolve())))
}

/** 收集页面脚本报错、控制台 error 与失败请求，供用例末尾断言为空 */
function trackErrors(page: Page) {
  const errors: string[] = []
  page.on('pageerror', err => errors.push(`pageerror: ${err.message}`))
  page.on('console', (msg) => {
    if (msg.type() === 'error')
      errors.push(`console: ${msg.text()}`)
  })
  page.on('requestfailed', (req) => {
    // 页面跳转时，上一页还没完成的请求会被浏览器中止，这不算错误
    if (req.failure()?.errorText !== 'net::ERR_ABORTED')
      errors.push(`requestfailed: ${req.url()}`)
  })
  return errors
}

test('首页：标题、三个内容区块与导航', async ({ page }) => {
  const errors = trackErrors(page)
  await open(page, '/')
  await expect(page).toHaveTitle('ther')
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('ther')
  for (const name of ['最新文章', '精选项目', '最近收藏'])
    await expect(page.getByRole('heading', { name })).toBeVisible()
  await expect(page.locator('main a[href^="/blog/"]')).toHaveCount(Math.min(4, blog.length))
  for (const label of ['首页', '文章', '周报', 'Demo', '画廊', '收藏', '关于']) {
    await expect(page.locator('header nav').getByRole('link', { name: label, exact: true })).toBeVisible()
  }
  expect(errors).toEqual([])
})

// 每页条数来自板块注册表；下面的用例对「只有一页」和「有很多页」都成立
const pageSize = (key: 'blog' | 'weekly') => pageSizeOf(getSection(key))
const TAG_PAGE_SIZE = DEFAULT_PAGE_SIZE

/** 从列表首页开始顺着「下一页」走，收集每一页上的文章链接 */
async function collectAcrossPages(page: Page, section: 'blog' | 'weekly') {
  await open(page, `/${section}`)
  const seen: string[] = []
  const cards = page.locator(`main a[href^="/${section}/"]:not([href^="/${section}/page/"])`)
  // 防止分页链接成环时无限循环
  for (let hops = 0; hops < 50; hops++) {
    seen.push(...(await cards.evaluateAll(links => links.map(link => link.getAttribute('href') ?? ''))))
    const next = page.getByRole('link', { name: '下一页' })
    if ((await next.count()) === 0)
      return seen
    const target = (await next.getAttribute('href')) ?? ''
    await next.click()
    await page.waitForURL(url => url.pathname === target)
  }
  return seen
}

test('文章列表：首页只显示第一页，顺着「下一页」能走遍全部文章', async ({ page }) => {
  const errors = trackErrors(page)
  const published = blog.filter(post => !post.draft).map(post => post.path)

  await open(page, '/blog')
  await expect(page).toHaveTitle(/文章/)
  const cards = page.locator('main a[href^="/blog/"]:not([href^="/blog/page/"])')
  await expect(cards).toHaveCount(Math.min(pageSize('blog'), published.length))
  // 超过一页时才出现「下一页」
  await expect(page.getByRole('link', { name: '下一页' })).toHaveCount(published.length > pageSize('blog') ? 1 : 0)

  expect(await collectAcrossPages(page, 'blog')).toEqual(published)
  expect(errors).toEqual([])
})

test('分页：后面几页的条数与当前页标记都正确', async ({ page }) => {
  const size = pageSize('blog')
  const published = blog.filter(post => !post.draft).map(post => post.path)
  const last = Math.ceil(published.length / size)
  test.skip(last < 2, '当前文章数不足两页，无法验证多页')
  const cards = page.locator('main a[href^="/blog/"]:not([href^="/blog/page/"])')
  const current = page.locator('nav[aria-label="分页"] [aria-current="page"]')

  // 最末一页只有剩余的那几篇，并且没有「下一页」
  await open(page, `/blog/page/${last}`)
  await expect(cards).toHaveCount(published.length - (last - 1) * size)
  await expect(current).toHaveText(String(last))
  await expect(page.getByRole('link', { name: '下一页' })).toHaveCount(0)

  if (last >= 3) {
    await page.getByRole('link', { name: '← 上一页' }).click()
    await page.waitForURL(url => url.pathname === `/blog/page/${last - 1}`)
    await expect(cards).toHaveCount(size)
    await expect(current).toHaveText(String(last - 1))
  }
})

test('标签页：按 ?page= 分页，越界的页码停在最后一页', async ({ page }) => {
  const errors = trackErrors(page)
  const tag = '技术热读'
  const expected = blog.filter(post => !post.draft && post.tags.includes(tag)).map(post => post.path)
  const lastPage = Math.max(1, Math.ceil(expected.length / TAG_PAGE_SIZE))
  const cards = page.locator('main a[href^="/blog/"]')

  await open(page, `/tags/${encodeURIComponent(tag)}?page=999`)
  await expect(cards).toHaveCount(expected.length - (lastPage - 1) * TAG_PAGE_SIZE)

  if (lastPage > 1) {
    await page.getByRole('link', { name: '← 上一页' }).click()
    await expect(page).toHaveURL(new RegExp(`page=${lastPage - 1}`))
    await expect(cards).toHaveCount(TAG_PAGE_SIZE)
  }
  expect(errors).toEqual([])
})

test('文章详情：上一篇/下一篇跳转后，标签页标题与正文一起更新', async ({ page }) => {
  const errors = trackErrors(page)
  const [latest, previous] = blog
  await open(page, `/blog/${previous.slug}`)
  await expect(page).toHaveTitle(new RegExp(escapeRe(previous.title)))
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(previous.title)
  await expect(page.locator('article a[target="_blank"]').first()).toBeVisible()
  // 每日技术热读不带侧栏目录
  await expect(page.locator('main aside')).toHaveCount(0)

  await page.getByRole('link', { name: /上一篇/ }).click()
  await expect(page).toHaveURL(new RegExp(`/blog/${latest.slug}`))
  await expect(page).toHaveTitle(new RegExp(escapeRe(latest.title)))
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(latest.title)
  // 最新一篇没有「上一篇」
  await expect(page.getByRole('link', { name: /上一篇/ })).toHaveCount(0)
  expect(errors).toEqual([])
})

test('周报：列表、详情与返回', async ({ page }) => {
  const errors = trackErrors(page)
  await open(page, '/weekly')
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('GitHub 周报')
  await expect(page.locator('main a[href^="/weekly/"]')).toHaveCount(weekly.length)

  const [latest] = weekly
  await page.locator(`main a[href="/weekly/${latest.slug}"]`).click()
  await expect(page).toHaveURL(new RegExp(`/weekly/${latest.slug}`))
  await expect(page).toHaveTitle(new RegExp(escapeRe(latest.title)))
  await expect(page.locator('article a[target="_blank"]')).toHaveCount(cardCount('weekly', latest.slug))

  await page.getByText('返回周报列表').click()
  await expect(page).toHaveURL(/\/weekly\/?$/)
  expect(errors).toEqual([])
})

test('标签页：同时包含文章与周报', async ({ page }) => {
  const errors = trackErrors(page)
  await open(page, '/tags')
  const tag = 'GitHub周报'
  await page.getByRole('link', { name: new RegExp(escapeRe(tag)) }).click()
  await expect(page).toHaveURL(new RegExp(`/tags/${encodeURIComponent(tag)}`))
  await expect(page).toHaveTitle(new RegExp(escapeRe(tag)))
  for (const post of weekly)
    await expect(page.locator(`main a[href="/weekly/${post.slug}"]`)).toHaveCount(1)
  expect(errors).toEqual([])
})

test('画廊：相册列表与灯箱的键盘操作', async ({ page }) => {
  const errors = trackErrors(page)
  await open(page, '/gallery')
  const albums = readdirSync(join(CONTENT, 'gallery'))
    .filter(file => file.endsWith('.yml'))
    .map(file => file.replace(/\.yml$/, ''))
  await expect(page.locator('main a[href^="/gallery/"]')).toHaveCount(albums.length)

  const album = albums[0]!
  const images = (readFileSync(join(CONTENT, 'gallery', `${album}.yml`), 'utf8').match(/^[ \t]*- src:/gm) ?? []).length
  await page.locator(`main a[href="/gallery/${album}"]`).click()
  const thumbs = page.locator('main button img')
  await expect(thumbs).toHaveCount(images)

  await thumbs.first().click()
  const close = page.getByRole('button', { name: '关闭' })
  await expect(close).toBeVisible()
  await expect(page.getByText(`1 / ${images}`, { exact: true })).toBeVisible()
  await page.keyboard.press('ArrowRight')
  await expect(page.getByText(`2 / ${images}`, { exact: true })).toBeVisible()
  await page.keyboard.press('ArrowLeft')
  await expect(page.getByText(`1 / ${images}`, { exact: true })).toBeVisible()
  await page.keyboard.press('Escape')
  await expect(close).toHaveCount(0)
  expect(errors).toEqual([])
})

test('Demo：每个带链接的项目都有入口，站内演示页可以玩', async ({ page }) => {
  const errors = trackErrors(page)
  const withLink = readdirSync(join(CONTENT, 'projects'))
    .filter(file => file.endsWith('.yml'))
    .filter(file => /^link:/m.test(readFileSync(join(CONTENT, 'projects', file), 'utf8')))
    .length
  await open(page, '/projects')
  await expect(page.locator('main').getByText('查看演示')).toHaveCount(withLink)

  await page.locator('main a[href="/demos/interactive-cards"]').click()
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('记忆翻牌')
  const faceDown = page.getByRole('button', { name: /？$/ })
  await expect(faceDown).toHaveCount(16)

  // 第一张翻开后就不再匹配 faceDown，所以第二次 nth(0) 点到的是另一张牌
  await faceDown.nth(0).click()
  await faceDown.nth(0).click()
  await expect(page.getByText('1 步')).toBeVisible()
  await page.getByRole('button', { name: '重新开始' }).click()
  await expect(page.getByText('0 步')).toBeVisible()
  await expect(faceDown).toHaveCount(16)
  expect(errors).toEqual([])
})

test('收藏：标签筛选后的条数与内容文件一致，并且可以还原', async ({ page }) => {
  const errors = trackErrors(page)
  const files = readdirSync(join(CONTENT, 'collections')).filter(file => file.endsWith('.yml'))
  const tagsOf = (file: string) =>
    (readFileSync(join(CONTENT, 'collections', file), 'utf8').match(/^tags:\s*\[(.*)\]/m)?.[1] ?? '')
      .split(',').map(tag => tag.trim()).filter(Boolean)
  const target = tagsOf(files[0]!)[0]!
  const expected = files.filter(file => tagsOf(file).includes(target)).length

  await open(page, '/collections')
  const items = page.locator('main a[target="_blank"]')
  await expect(items).toHaveCount(files.length)
  await page.locator('main').getByRole('button', { name: new RegExp(`^${escapeRe(target)} \\(\\d+\\)$`) }).click()
  await expect(items).toHaveCount(expected)
  await page.locator('main').getByRole('button', { name: '全部', exact: true }).click()
  await expect(items).toHaveCount(files.length)
  expect(errors).toEqual([])
})

test('关于：页面标题与技能条', async ({ page }) => {
  const errors = trackErrors(page)
  await open(page, '/about')
  await expect(page).toHaveTitle(/关于/)
  await expect(page.getByText(/^\d+%$/)).toHaveCount(6)
  expect(errors).toEqual([])
})

test('主题：切换后生效，刷新后保持', async ({ page }) => {
  await open(page, '/')
  const isDark = () => page.evaluate(() => document.documentElement.classList.contains('dark'))
  const before = await isDark()
  await page.getByRole('button', { name: '切换主题' }).first().click()
  await expect.poll(isDark).toBe(!before)
  await page.reload()
  expect(await isDark()).toBe(!before)
  // 还原，避免影响其它用例
  await page.getByRole('button', { name: '切换主题' }).first().click()
  await expect.poll(isDark).toBe(before)
})

test('404：错误页可以返回首页', async ({ page }) => {
  const response = await page.goto('/404.html')
  expect(response?.status()).toBe(200)
  await expect(page.getByText('页面不存在')).toBeVisible()
  await page.getByRole('button', { name: '返回首页' }).click()
  await expect(page).toHaveURL(/\/$/)
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('ther')
})

test('长页面：滚动后出现「回到顶部」，点击回到顶部', async ({ page }) => {
  test.setTimeout(30_000)
  await open(page, `/blog/${blog[0]!.slug}`)
  await page.evaluate(() => window.scrollTo(0, 3000))
  const button = page.getByRole('button', { name: '回到顶部' })
  await expect(button).toBeVisible()
  await button.click()
  await page.waitForFunction(() => window.scrollY < 50, undefined, { timeout: 10_000 })
})

test('ZONE：早期静态演示页原样可访问', async ({ page }) => {
  const response = await page.goto('/ZONE/bigdataNetwork3_demo/')
  expect(response?.status()).toBe(200)
  await expect(page).not.toHaveTitle('')
})

test('移动端：汉堡菜单可以展开并跳转', async ({ page }) => {
  const errors = trackErrors(page)
  await page.setViewportSize({ width: 390, height: 844 })
  await open(page, '/collections')
  const burger = page.getByRole('button', { name: '菜单' })
  await expect(burger).toBeVisible()
  await burger.click()
  const link = page.locator('header').getByRole('link', { name: '画廊', exact: true }).filter({ visible: true })
  await expect(link).toBeVisible()
  await link.click()
  await expect(page).toHaveURL(/\/gallery\/?$/)
  await expect(link).toHaveCount(0)
  expect(errors).toEqual([])
})

// Nuxt 序列化页面数据时用了响应式类型的还原器；这里只读取普通数据，原样返回即可
const identity = (value: unknown) => value
const payloadRevivers = {
  ShallowRef: identity,
  ShallowReactive: identity,
  Ref: identity,
  EmptyRef: identity,
  EmptyShallowRef: identity,
}

test('列表页数据：只带卡片需要的字段，不携带文章正文', async ({ request }) => {
  // 页面数据由 devalue 序列化。正文 AST 会让列表页数据随文章数线性膨胀（每篇约 11KB），
  // 而卡片只需要标题、日期、标签、摘要这几个字段。
  const pages: [string, string][] = [
    ['/', 'home-posts'],
    ['/blog', 'blog-list-1'],
    ['/weekly', 'weekly-list-1'],
    ['/tags', 'tags-all'],
    [`/tags/${encodeURIComponent('技术热读')}`, 'tag-技术热读'],
  ]
  for (const [path, key] of pages) {
    const response = await request.get(`${path === '/' ? '' : path}/_payload.json`)
    expect(response.status(), path).toBe(200)
    const payload = parse(await response.text(), payloadRevivers) as { data: Record<string, unknown> }
    const items = payload.data[key]
    expect(Array.isArray(items), key).toBe(true)
    for (const item of items as Record<string, unknown>[])
      expect(item, `${key} → ${String(item.path)}`).not.toHaveProperty('body')
  }
})

test('列表数据：每个列表恰好包含应有的已发布文章，草稿不会出现', async ({ request }) => {
  const published = (section: 'blog' | 'weekly') => readPosts(section).filter(post => !post.draft).map(post => post.path)
  const everything = [...readPosts('blog'), ...readPosts('weekly')]
    .filter(post => !post.draft)
    .sort((a, b) => b.date.localeCompare(a.date))
    .map(post => post.path)
  // 板块列表页在数据层分页：首页的数据只含第一页，所以条数不会超过每页条数
  const expected: [string, string, string[]][] = [
    ['/blog', 'blog-list-1', published('blog').slice(0, pageSize('blog'))],
    ['/weekly', 'weekly-list-1', published('weekly').slice(0, pageSize('weekly'))],
    ['/tags', 'tags-all', everything],
  ]
  for (const [path, key, paths] of expected) {
    const payload = parse(await (await request.get(`${path}/_payload.json`)).text(), payloadRevivers) as { data: Record<string, { path: string }[]> }
    expect(payload.data[key]?.map(item => item.path), key).toEqual(paths)
  }
})

test('构建产物：没有超过 500KB 的脚本块', async () => {
  // 500KB 是构建工具自身的告警线。曾经一个动画库打包后就有 1MB，而且被全站每个页面预取
  const dir = resolve(process.cwd(), '.output/public/_nuxt')
  const tooBig = readdirSync(dir)
    .filter(file => file.endsWith('.js'))
    .filter(file => statSync(join(dir, file)).size > 500 * 1024)
  expect(tooBig).toEqual([])
})

/** 背景画布是否在变化：间隔 700ms 对整幅画布采样两次，同时返回画面是否有内容 */
async function sampleBackground(page: Page) {
  return await page.evaluate(() => new Promise<{ painted: boolean, changed: boolean }>((resolve) => {
    const canvas = document.querySelector('canvas')
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx)
      return resolve({ painted: false, changed: false })
    const sum = () => {
      const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data
      let total = 0
      for (let i = 0; i < data.length; i += 4)
        total += data[i] + data[i + 3]
      return total
    }
    const first = sum()
    setTimeout(() => {
      const second = sum()
      resolve({ painted: first + second > 0, changed: second !== first })
    }, 700)
  }))
}

test.describe('系统开启「减少动态效果」时', () => {
  test.use({ reducedMotion: 'reduce' })

  test('文章页的流场背景只画一帧，保持静止', async ({ page }) => {
    await open(page, `/blog/${blog[0]!.slug}`)
    expect(await sampleBackground(page)).toEqual({ painted: true, changed: false })
  })

  test('首页的分支背景直接呈现最终画面，不播放生长动画', async ({ page }) => {
    await open(page, '/')
    expect(await sampleBackground(page)).toEqual({ painted: true, changed: false })
  })
})

test.describe('高分屏上', () => {
  test.use({ deviceScaleFactor: 3 })

  test('背景画布的像素比封顶为 2', async ({ page }) => {
    await open(page, `/blog/${blog[0]!.slug}`)
    const size = await page.evaluate(() => {
      const canvas = document.querySelector('canvas')
      return { buffer: canvas?.width ?? 0, viewport: window.innerWidth }
    })
    expect(size.buffer).toBe(size.viewport * 2)
  })
})

const publishedPosts = () =>
  [...blog, ...weekly].filter(post => !post.draft).sort((a, b) => b.date.localeCompare(a.date))

test('搜索引擎：文章页输出 canonical、描述与 Open Graph', async ({ page }) => {
  const latest = publishedPosts()[0]!
  await open(page, latest.path)
  const description = latest.description ?? SITE.description
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', toSiteUrl(latest.path))
  await expect(page.locator('head meta[name="description"]')).toHaveAttribute('content', description)
  const openGraph = (property: string) => page.locator(`head meta[property="${property}"]`)
  await expect(openGraph('og:title')).toHaveAttribute('content', latest.title)
  await expect(openGraph('og:description')).toHaveAttribute('content', description)
  await expect(openGraph('og:url')).toHaveAttribute('content', toSiteUrl(latest.path))
  await expect(openGraph('og:type')).toHaveAttribute('content', 'article')
  await expect(openGraph('og:site_name')).toHaveAttribute('content', SITE.name)
})

test('搜索引擎：首页、列表页与标签页都有指向规范地址的 canonical', async ({ page }) => {
  const pages: [string, string][] = [
    ['/', '/'],
    ['/blog', '/blog'],
    [`/tags/${encodeURIComponent('技术热读')}`, '/tags/技术热读'],
  ]
  for (const [url, path] of pages) {
    await open(page, url)
    await expect(page.locator('link[rel="canonical"]'), url).toHaveAttribute('href', toSiteUrl(path))
  }
})

test('站点地图：列出全部已发布文章的规范地址与主要页面，不含草稿', async ({ request }) => {
  const response = await request.get('/sitemap.xml')
  expect(response.status()).toBe(200)
  expect(response.headers()['content-type']).toContain('application/xml')
  const xml = await response.text()
  expect(xml).toContain('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">')

  const locations = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(match => match[1]!).sort()
  // /blog/ 与 /weekly/ 是列表页，不算文章地址
  const sectionRoots = sections.map(section => toSiteUrl(`/${section.key}`))
  const articleLocations = locations.filter(loc => /\/(blog|weekly)\//.test(loc) && !/\/page\//.test(loc) && !sectionRoots.includes(loc))
  expect(articleLocations).toEqual(publishedPosts().map(post => toSiteUrl(post.path)).sort())
  for (const path of ['/', '/blog/', '/weekly/', '/projects/', '/gallery/', '/collections/', '/tags/', '/about/'])
    expect(locations, path).toContain(SITE.url + path)

  // 站点地图里的每个地址都必须真的能打开，否则等于向搜索引擎提交了死链
  for (const location of locations) {
    const response = await request.get(location)
    expect(response.status(), location).toBe(200)
  }
})

test('RSS：按日期从新到旧输出最新文章', async ({ request }) => {
  const response = await request.get('/rss.xml')
  expect(response.status()).toBe(200)
  const xml = await response.text()
  expect(xml).toContain('<rss version="2.0"')

  const field = (name: string) => [...xml.matchAll(new RegExp(`<item>[\\s\\S]*?<${name}>([^<]*)</${name}>`, 'g'))].map(match => match[1]!)
  const latest = publishedPosts().slice(0, 20)
  expect(field('title')).toEqual(latest.map(post => escapeXml(post.title)))
  expect(field('link')).toEqual(latest.map(post => toSiteUrl(post.path)))
  expect(field('pubDate')[0]).toMatch(/GMT$/)

  // 自引用链接是文件地址，不能带尾斜杠
  expect(xml).toContain(`href="${SITE.url}/rss.xml"`)
})

test('robots.txt：允许抓取并指向站点地图', async ({ request }) => {
  const response = await request.get('/robots.txt')
  expect(response.status()).toBe(200)
  const text = await response.text()
  expect(text).toMatch(/^allow:\s*\/$/im)
  expect(text).toContain(`Sitemap: ${SITE.url}/sitemap.xml`)
})
