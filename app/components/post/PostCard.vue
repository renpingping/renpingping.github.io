<script setup lang="ts">
import type { PostSummary } from '~/types/post'

defineProps<{ post: PostSummary }>()
</script>

<template>
  <NuxtLink
    :to="post.path"
    class="group block overflow-hidden rounded-xl border border-zinc-200 bg-white transition-all hover:-translate-y-0.5 hover:border-zinc-300 hover:shadow-lg dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-700"
  >
    <div class="aspect-[2/1] overflow-hidden bg-zinc-100 dark:bg-zinc-800">
      <img
        v-if="post.cover"
        :src="post.cover"
        :alt="post.title"
        loading="lazy"
        class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
      >
    </div>
    <div class="p-5">
      <h2 class="font-semibold text-zinc-900 transition-colors group-hover:text-indigo-600 dark:text-zinc-100 dark:group-hover:text-indigo-400">
        {{ post.title }}
      </h2>
      <p
        v-if="post.description"
        class="mt-2 line-clamp-2 text-sm text-muted"
      >{{ post.description }}</p>
      <div class="mt-4 flex flex-wrap items-center gap-2">
        <time class="text-xs text-muted">{{ formatDate(post.date) }}</time>
        <TagChip
          v-for="t in post.tags"
          :key="t"
          :tag="t"
          :clickable="false"
        />
      </div>
    </div>
  </NuxtLink>
</template>
