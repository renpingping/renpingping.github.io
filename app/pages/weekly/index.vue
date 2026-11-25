<script setup lang="ts">
import { getSection } from '~/config/sections'

const section = getSection('weekly')
const { data: posts, totalPages } = await useSectionFirstPage('weekly')

usePageSeo(() => ({ title: section.title, description: section.description, path: `/${section.key}` }))
</script>

<template>
  <PostList
    :section="section"
    :posts="posts ?? []"
    :page="1"
    :total-pages="totalPages"
  />
</template>
