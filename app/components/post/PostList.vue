<script setup lang="ts">
import type { Section } from '~/config/sections'
import { navLabelOf } from '~/config/sections'
import type { PostSummary } from '~/types/post'

defineProps<{
  section: Section
  posts: readonly PostSummary[]
  page: number
  totalPages: number
}>()
</script>

<template>
  <div>
    <header class="mb-8">
      <h1 class="text-3xl font-bold text-zinc-900 dark:text-zinc-100">
        {{ section.title }}
      </h1>
      <p class="mt-2 text-sm text-muted">
        {{ section.description }}
      </p>
    </header>

    <PostGrid
      :posts="posts"
      :empty-text="`暂无${navLabelOf(section)}`"
    />

    <Pagination
      :page="page"
      :total-pages="totalPages"
      :href="(n: number) => (n === 1 ? `/${section.key}` : `/${section.key}/page/${n}`)"
    />
  </div>
</template>
