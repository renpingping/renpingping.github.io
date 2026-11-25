<script setup lang="ts">
import { getSection } from '~/config/sections'

const section = getSection('weekly')
const { data: posts, totalPages } = await useSectionFirstPage('weekly')

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
