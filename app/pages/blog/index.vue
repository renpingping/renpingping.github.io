<script setup lang="ts">
import { getSection } from '~/config/sections'

const section = getSection('blog')
const { data: posts } = await useSectionPosts(section)

useHead({ title: section.title })
</script>

<template>
  <PostList
    :section="section"
    :posts="posts ?? []"
  />
</template>
