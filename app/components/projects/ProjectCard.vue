<script setup lang="ts">
import type { ProjectsCollectionItem } from '@nuxt/content'
import { linkKind } from '~/utils/link'

defineProps<{ project: ProjectsCollectionItem }>()
</script>

<template>
  <div class="card-surface group flex flex-col overflow-hidden transition-all hover:-translate-y-0.5 hover:shadow-lg">
    <div class="aspect-[16/9] overflow-hidden bg-zinc-100 dark:bg-zinc-800">
      <img
        v-if="project.cover"
        :src="project.cover"
        :alt="project.title"
        loading="lazy"
        class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
      >
    </div>
    <div class="flex flex-1 flex-col p-5">
      <div class="flex items-start justify-between gap-2">
        <h2 class="font-semibold text-zinc-900 dark:text-zinc-100">{{ project.title }}</h2>
        <span
          v-if="project.featured"
          class="shrink-0 rounded-full bg-amber-500/15 px-2 py-0.5 text-xs font-medium text-amber-600 dark:text-amber-400"
        >精选</span>
      </div>
      <p class="mt-2 flex-1 text-sm text-muted">{{ project.description }}</p>
      <div class="mt-4 flex flex-wrap gap-1.5">
        <span
          v-for="t in project.tech"
          :key="t"
          class="rounded bg-zinc-100 px-2 py-0.5 text-xs text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400"
        >{{ t }}</span>
      </div>
      <div class="mt-4 flex items-center justify-between border-t border-zinc-100 pt-3 text-sm dark:border-zinc-800">
        <time class="text-xs text-muted">{{ formatDate(project.date) }}</time>
        <div class="flex gap-3">
          <a
            v-if="project.repo"
            :href="project.repo"
            target="_blank"
            rel="noopener"
            class="text-muted transition-colors hover:text-zinc-900 dark:hover:text-zinc-100"
          >源码</a>
          <!-- 站内路由用 NuxtLink；外链与 /ZONE 静态页需要整页跳转，用 a -->
          <NuxtLink
            v-if="project.link && linkKind(project.link) === 'spa'"
            :to="project.link"
            class="inline-flex items-center gap-1 font-medium text-indigo-600 transition-colors hover:text-indigo-500 dark:text-indigo-400"
          >
            查看演示
            <IconExternalLink class="h-3.5 w-3.5" />
          </NuxtLink>
          <a
            v-else-if="project.link"
            :href="project.link"
            :target="linkKind(project.link) === 'external' ? '_blank' : undefined"
            :rel="linkKind(project.link) === 'external' ? 'noopener' : undefined"
            class="inline-flex items-center gap-1 font-medium text-indigo-600 transition-colors hover:text-indigo-500 dark:text-indigo-400"
          >
            查看演示
            <IconExternalLink class="h-3.5 w-3.5" />
          </a>
        </div>
      </div>
    </div>
  </div>
</template>
