// 站点地图：构建时预渲染为 /sitemap.xml。地址一律带尾斜杠，与 GitHub Pages 实际提供的地址一致。
import { queryCollection } from '@nuxt/content/server'

import { belongsSection, pageSizeOf, sections } from '../../app/config/sections'
import { pageCount } from '../../app/utils/pagination'
import { toSiteUrl } from '../../shared/utils/site-url'
import { escapeXml } from '../../shared/utils/xml'

/** 不随内容变化、始终存在的页面 */
const STATIC_PATHS = [
  '/',
  '/blog/',
  '/weekly/',
  '/projects/',
  '/gallery/',
  '/collections/',
  '/tags/',
  '/about/',
  '/demos/interactive-cards/',
]

export default defineEventHandler(async (event) => {
  const posts = (await queryCollection(event, 'posts').select('path', 'date', 'draft', 'tags').all())
    .filter(post => post.draft !== true)
  const albums = await queryCollection(event, 'gallery').select('stem').all()
  const tags = new Set<string>()
  for (const post of posts) {
    for (const tag of post.tags ?? [])
      tags.add(tag)
  }
  // 标签页只展示文章，所以这里只收文章上的标签；收藏的标签没有对应页面，不能列进来

  const paths = [...STATIC_PATHS]
  for (const section of sections) {
    const total = posts.filter(post => belongsSection(post.path, section.key)).length
    for (let page = 2; page <= pageCount(total, pageSizeOf(section)); page++)
      paths.push(`/${section.key}/page/${page}`)
  }
  for (const album of albums)
    paths.push(`/gallery/${album.stem.split('/').pop()}`)
  for (const tag of tags)
    paths.push(`/tags/${encodeURIComponent(tag)}`)
  paths.push(...posts.map(post => post.path))

  const publishedOn = new Map(posts.map(post => [post.path, post.date]))
  setHeader(event, 'content-type', 'application/xml; charset=utf-8')
  const entries = paths
    .map((path) => {
      const date = publishedOn.get(path)
      return `<url><loc>${escapeXml(toSiteUrl(path))}</loc>${date ? `<lastmod>${escapeXml(date)}</lastmod>` : ''}</url>`
    })
    .join('\n')
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries}\n</urlset>\n`
})
