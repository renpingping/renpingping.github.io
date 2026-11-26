<script setup lang="ts">
import type { PostSummary } from '~/types/post'

defineProps<{
  posts: readonly PostSummary[]
  /** 列表为空时的提示；不填则不显示 */
  emptyText?: string
}>()
</script>

<template>
  <div class="grid gap-6 sm:grid-cols-2">
    <PostCard
      v-for="post in posts"
      :key="post.path"
      :post="post"
    />
  </div>

  <p
    v-if="emptyText && !posts.length"
    class="py-16 text-center text-sm text-muted"
  >
    {{ emptyText }}
  </p>
</template>
