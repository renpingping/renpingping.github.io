import type { BlogCollectionItem } from '@nuxt/content'

/**
 * 文章在列表、卡片、标签页里需要的字段。
 * 与正文 AST 分离，列表查询用 `.select()` 只取这些字段，避免把每篇文章的正文都塞进页面数据。
 */
export type PostSummary = Pick<
  BlogCollectionItem,
  'path' | 'title' | 'description' | 'date' | 'tags' | 'cover'
>
