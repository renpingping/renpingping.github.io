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
    <PageHeader
      :title="section.title"
      :description="section.description"
    />

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
