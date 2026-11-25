import { SITE } from '#shared/site'
import { toSiteUrl } from '#shared/utils/site-url'

interface PageSeo {
  /** 页面标题；不填则只用站点名（首页） */
  title?: string
  /** 分享与搜索结果里的描述，不填用站点描述 */
  description?: string
  /** 规范地址对应的站内路径，不填用当前路由 */
  path?: string
  type?: 'website' | 'article'
}

/**
 * 页面的标题、描述、canonical 与 Open Graph。
 * 传入 getter 以保持响应式：例如上一篇/下一篇切换后，标题要跟着文章变。
 */
export function usePageSeo(options: () => PageSeo) {
  const route = useRoute()
  const seo = computed<PageSeo>(() => ({
    description: SITE.description,
    type: 'website',
    path: route.fullPath,
    ...options(),
  }))
  const url = computed(() => toSiteUrl(seo.value.path ?? route.fullPath))

  useHead({
    title: () => seo.value.title,
    link: [{ rel: 'canonical', href: () => url.value }],
    meta: [
      { name: 'description', content: () => seo.value.description },
      { property: 'og:title', content: () => seo.value.title ?? SITE.name },
      { property: 'og:description', content: () => seo.value.description },
      { property: 'og:url', content: () => url.value },
      { property: 'og:type', content: () => seo.value.type },
    ],
  })
}
