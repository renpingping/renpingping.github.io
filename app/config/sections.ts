/**
 * 板块注册表：所有「文章类」内容的差异都描述在这里，页面与组件只负责按注册表渲染。
 * 新增一个板块只需三步：在 content/ 下建一级子目录放 Markdown、在这里加一条、建两个薄封装页面。
 */
/** 列表页默认每页条数 */
export const DEFAULT_PAGE_SIZE = 20

export interface Section {
  /** 目录名，同时是路由与路径前缀：content/<key>/a.md → /<key>/a */
  key: string
  /** 列表页标题，也是浏览器标签页标题 */
  title: string
  /** 顶部导航里的文案；不填则与 title 相同 */
  navLabel?: string
  /** 列表页副标题 */
  description: string
  /** 命中其中任一标签的文章隐藏侧栏目录并拉宽正文 */
  wideTags?: string[]
  /** 不论标签如何都拉宽正文、不显示目录 */
  wide?: boolean
  /** 列表页每页条数，不填用 DEFAULT_PAGE_SIZE */
  pageSize?: number
  /** 是否进入首页的「最新文章」 */
  homeFeed?: boolean
  /** 正文末尾是否显示上一篇 / 下一篇（同一板块内按日期相邻） */
  surround?: boolean
  /** 正文末尾是否显示返回列表的链接 */
  backLink?: boolean
}

export const sections: readonly Section[] = [
  {
    key: 'blog',
    title: '文章',
    description: '记录技术、工具与折腾的痕迹',
    // 每日技术热读是卡片列表，自带分类导航：不需要侧栏目录，正文拉宽后卡片更舒展
    wideTags: ['技术热读'],
    homeFeed: true,
    surround: true,
  },
  {
    key: 'weekly',
    title: 'GitHub 周报',
    navLabel: '周报',
    description: '每周五 14:30 自动更新 · GitHub Trending AI 项目 Top10 · GLM-5.3 深度分析',
    wide: true,
    backLink: true,
  },
]

const byKey = new Map(sections.map(section => [section.key, section]))

/** 一级目录 + 文件名，可带尾斜杠：/blog/day_2026-11-25 */
const ARTICLE_PATH = /^\/([^/]+)\/[^/]+\/?$/

export function pageSizeOf(section: Section): number {
  return section.pageSize ?? DEFAULT_PAGE_SIZE
}

export function navLabelOf(section: Section): string {
  return section.navLabel ?? section.title
}

/** 按 key 取板块；拼错 key 属于编程错误，直接抛出而不是静默降级 */
export function getSection(key: string): Section {
  const section = byKey.get(key)
  if (!section)
    throw new Error(`未注册的板块：${key}（注册表见 app/config/sections.ts）`)
  return section
}

/** 文章路径的一级目录对应的板块；列表页、根路径与未注册的目录返回 undefined */
export function sectionOf(path: string): Section | undefined {
  const key = ARTICLE_PATH.exec(path)?.[1]
  return key ? byKey.get(key) : undefined
}

/** 路径是否落在某个板块的目录之下 */
export function belongsSection(path: string, key: string): boolean {
  return path.startsWith(`/${key}/`)
}
