<script setup lang="ts">
import { getSection } from '~/config/sections'

// 列表的第 2 页起：/<板块>/page/<页码>
const section = getSection('blog')
const page = Number.parseInt(String(useRoute().params.page ?? ''), 10)

usePageSeo(() => ({
  title: `第 ${page} 页 · ${section.title}`,
  description: section.description,
  path: `/${section.key}/page/${page}`,
}))

const { data: posts, totalPages } = await useSectionPage('blog')
</script>

<template>
  <PostList
    :section="section"
    :posts="posts ?? []"
    :page="page"
    :total-pages="totalPages"
  />
</template>
