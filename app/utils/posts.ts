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
