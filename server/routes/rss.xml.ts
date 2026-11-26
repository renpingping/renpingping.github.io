// RSS 订阅：构建时预渲染为 /rss.xml，输出最新的若干篇已发布文章。
import { queryCollection } from '@nuxt/content/server'

import { SITE } from '../../shared/site'
import { toRfc822Date, toSiteUrl } from '../../shared/utils/site-url'
import { escapeXml } from '../../shared/utils/xml'

const FEED_ITEMS = 20

export default defineEventHandler(async (event) => {
  const posts = (await queryCollection(event, 'posts').select('path', 'title', 'description', 'date', 'draft').all())
    .filter(post => post.draft !== true)
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, FEED_ITEMS)

  const items = posts
    .map((post) => {
      const url = escapeXml(toSiteUrl(post.path))
      return [
        '    <item>',
        `      <title>${escapeXml(post.title)}</title>`,
        `      <link>${url}</link>`,
        `      <guid>${url}</guid>`,
        `      <pubDate>${escapeXml(toRfc822Date(post.date))}</pubDate>`,
        ...(post.description ? [`      <description>${escapeXml(post.description)}</description>`] : []),
        '    </item>',
      ].join('\n')
    })
    .join('\n')

  setHeader(event, 'content-type', 'application/xml; charset=utf-8')
  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(SITE.name)}</title>
    <link>${escapeXml(toSiteUrl('/'))}</link>
    <description>${escapeXml(SITE.description)}</description>
    <language>${SITE.language}</language>
    <atom:link href="${SITE.url}/rss.xml" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>
`
})
