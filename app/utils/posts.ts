import { belongsSection } from '~/config/sections'

/** 去掉路径末尾的斜杠（根路径除外）。
 * GitHub Pages 的规范地址带尾斜杠，路由给出的路径会保留它；与文章路径、预渲染的数据键比较前要先统一。 */
export function normalizePath(path: string): string {
  if (path.length > 1)
    return path.replace(/\/+$/, '')
  return path
}

/** 详情页能否展示这篇文章：必须是该板块下的已发布文章。草稿与别的板块的文章都按不存在处理 */
export function canShowPost(
  post: { path: string, draft?: boolean } | null | undefined,
  sectionKey: string,
): boolean {
  return !!post && post.draft !== true && belongsSection(post.path, sectionKey)
}

/**
 * 在按日期从新到旧排列的文章列表里，找出某篇两侧的篇目：newer 是更新的一篇，older 是更旧的一篇。
 * 路径不在列表里时（例如跨板块访问）两侧都为空。
 */
export function surroundOf<T extends { path: string }>(
  posts: readonly T[],
  path: string,
): { newer: T | null, older: T | null } {
  const index = posts.findIndex(post => post.path === path)
  if (index === -1)
    return { newer: null, older: null }
  return { newer: posts[index - 1] ?? null, older: posts[index + 1] ?? null }
}
