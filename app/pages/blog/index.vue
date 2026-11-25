<script setup lang="ts">
import { getSection } from '~/config/sections'

const section = getSection('blog')
const { data: posts, totalPages } = await useSectionFirstPage('blog')

useHead({ title: section.title })
</script>

<template>
  <PostList
    :section="section"
    :posts="posts ?? []"
    :page="1"
    :total-pages="totalPages"
  />
</template>
