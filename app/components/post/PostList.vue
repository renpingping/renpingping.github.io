<script setup lang="ts">
import type { Section } from '~/config/sections'
import type { PostSummary } from '~/types/post'

defineProps<{
  section: Section
  posts: readonly PostSummary[]
}>()
</script>

<template>
  <div>
    <header class="mb-8">
      <h1 class="text-3xl font-bold text-zinc-900 dark:text-zinc-100">
        {{ section.title }}
      </h1>
      <p class="mt-2 text-sm text-zinc-500">
        {{ section.description }}
      </p>
    </header>

    <PostGrid
      :posts="posts"
      :filterable="section.tagFilter === true"
      :empty-text="`暂无${section.navLabel ?? section.title}`"
    />
  </div>
</template>
