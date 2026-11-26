import { defineContentConfig, defineCollection, z } from '@nuxt/content'

// 所有文章类内容共用一个 schema；板块之间的差异（标题、版式、是否进首页等）在 app/config/sections.ts 里描述。
// 注意：Nuxt Content 只用 schema 生成类型，不在构建时校验 frontmatter；
// 日期格式、封面文件、卡片链接等由 scripts/check-content.mjs 检查（npm test 的一部分，先于部署运行）。
const postSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
  // ISO 日期（YYYY-MM-DD）
  date: z.string().date(),
  tags: z.array(z.string()).default([]),
  cover: z.string().optional(),
  // 草稿不出现在任何列表里，直接访问也是 404
  draft: z.boolean().default(false),
})

export default defineContentConfig({
  collections: {
    // 一级子目录名即板块：content/blog/a.md → /blog/a，content/weekly/b.md → /weekly/b。
    // 新增板块不需要改这里，只要在 content/ 下建目录并在注册表里登记。
    posts: defineCollection({
      type: 'page',
      source: '*/*.md',
      schema: postSchema,
    }),

    projects: defineCollection({
      type: 'data',
      source: 'projects/*.yml',
      schema: z.object({
        title: z.string(),
        description: z.string(),
        tech: z.array(z.string()).default([]),
        link: z.string().optional(),
        repo: z.string().optional(),
        cover: z.string().optional(),
        date: z.string(),
        featured: z.boolean().default(false),
      }),
    }),

    gallery: defineCollection({
      type: 'data',
      source: 'gallery/*.yml',
      schema: z.object({
        title: z.string(),
        description: z.string().optional(),
        cover: z.string().optional(),
        date: z.string(),
        images: z.array(
          z.object({
            src: z.string(),
            alt: z.string().optional(),
          }),
        ),
      }),
    }),

    collections: defineCollection({
      type: 'data',
      source: 'collections/*.yml',
      schema: z.object({
        title: z.string(),
        url: z.string(),
        source: z.string().optional(),
        tags: z.array(z.string()).default([]),
        note: z.string().optional(),
        date: z.string(),
      }),
    }),
  },
})
