<script setup lang="ts">
import { POST_SUMMARY_FIELDS } from '~/types/post'

const { data: posts } = await useAsyncData('weekly-list', () =>
  queryCollection('weekly').select(...POST_SUMMARY_FIELDS).order('date', 'DESC').all(),
)

useHead({ title: 'GitHub 周报' })
</script>

<template>
  <div>
    <header class="mb-8">
      <h1 class="text-3xl font-bold text-zinc-900 dark:text-zinc-100">GitHub 周报</h1>
      <p class="mt-2 text-sm text-zinc-500">每周五 14:30 自动更新 · GitHub Trending AI 项目 Top10 · GLM-5.3 深度分析</p>
    </header>

    <div class="grid gap-6 sm:grid-cols-2">
      <PostCard
        v-for="post in posts"
        :key="post.path"
        :post="post"
      />
    </div>

    <p
      v-if="!posts?.length"
      class="py-16 text-center text-sm text-zinc-400"
    >暂无周报</p>
  </div>
</template>
