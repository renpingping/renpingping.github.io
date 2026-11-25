import type { BlogCollectionItem } from '@nuxt/content'

/**
 * 卡片需要的文章字段。列表类查询用 `.select(...POST_SUMMARY_FIELDS)` 只取这些字段，
 * 否则每篇文章的正文 AST 都会进入页面数据（每篇约 11KB），随文章数线性膨胀。
 */
export const POST_SUMMARY_FIELDS = ['path', 'title', 'description', 'date', 'tags', 'cover'] as const

export type PostSummary = Pick<BlogCollectionItem, (typeof POST_SUMMARY_FIELDS)[number]>
