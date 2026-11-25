export type LinkKind = 'spa' | 'static' | 'external'

/**
 * 判断一个链接该怎么打开：
 * - spa：站内路由，用 NuxtLink
 * - static：public/ZONE 下原样发布的早期静态页，不是单页路由，需要整页跳转
 * - external：其它网站，新窗口打开
 */
export function linkKind(link: string): LinkKind {
  if (/^https?:\/\//i.test(link))
    return 'external'
  return /^\/ZONE(?:\/|$)/.test(link) ? 'static' : 'spa'
}
