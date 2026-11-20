import { defineContentConfig, defineCollection, z } from '@nuxt/content'

export default defineContentConfig({
  collections: {
    blog: defineCollection({
      type: 'page',
      source: 'blog/*.md',
      schema: z.object({
        title: z.string(),
        description: z.string().optional(),
        date: z.string(),
        tags: z.array(z.string()).default([]),
        cover: z.string().optional(),
      }),
    }),

    weekly: defineCollection({
      type: 'page',
      source: 'weekly/*.md',
      schema: z.object({
        title: z.string(),
        description: z.string().optional(),
        date: z.string(),
        tags: z.array(z.string()).default([]),
        cover: z.string().optional(),
      }),
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
