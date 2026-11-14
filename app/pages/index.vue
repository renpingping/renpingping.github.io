<script setup lang="ts">
const config = useAppConfig()

const { data: posts } = await useAsyncData('home-posts', () =>
  queryCollection('blog').order('date', 'DESC').limit(4).all(),
)
const { data: projects } = await useAsyncData('home-projects', () =>
  queryCollection('projects').order('date', 'DESC').all(),
)
const { data: collections } = await useAsyncData('home-collections', () =>
  queryCollection('collections').order('date', 'DESC').limit(3).all(),
)

const featured = computed(() => (projects.value ?? []).filter(p => p.featured).slice(0, 3))
const { format } = useFormatDate()
</script>

<template>
  <div>
    <!-- Hero -->
    <section class="flex flex-col items-center py-14 text-center sm:py-20">
      <img
        src="/images/avatar.jpg"
        alt="avatar"
        class="h-24 w-24 rounded-full ring-4 ring-indigo-500/20"
      >
      <h1 class="mt-6 text-4xl font-black tracking-tight text-zinc-900 dark:text-zinc-100">
        {{ config.site.name }}
      </h1>
      <p class="mt-3 max-w-md text-zinc-500">
        {{ config.site.description }} · 从来没有真正的绝境，只有心灵的迷途
      </p>
      <div class="mt-6">
        <SocialLinks />
      </div>
    </section>

    <!-- 最新文章 -->
    <section class="mb-14">
      <div class="mb-5 flex items-end justify-between">
        <h2 class="text-xl font-bold text-zinc-900 dark:text-zinc-100">最新文章</h2>
        <NuxtLink to="/blog" class="text-sm text-indigo-600 transition-colors hover:text-indigo-500 dark:text-indigo-400">
          查看全部 →
        </NuxtLink>
      </div>
      <div class="grid gap-6 sm:grid-cols-2">
        <PostCard v-for="post in posts ?? []" :key="post.path" :post="post" />
      </div>
    </section>

    <!-- 精选项目 -->
    <section v-if="featured.length" class="mb-14">
      <div class="mb-5 flex items-end justify-between">
        <h2 class="text-xl font-bold text-zinc-900 dark:text-zinc-100">精选项目</h2>
        <NuxtLink to="/projects" class="text-sm text-indigo-600 transition-colors hover:text-indigo-500 dark:text-indigo-400">
          全部作品 →
        </NuxtLink>
      </div>
      <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <ProjectCard v-for="p in featured" :key="p.stem" :project="p" />
      </div>
    </section>

    <!-- 收藏速览 -->
    <section v-if="collections?.length" class="mb-14">
      <div class="mb-5 flex items-end justify-between">
        <h2 class="text-xl font-bold text-zinc-900 dark:text-zinc-100">最近收藏</h2>
        <NuxtLink to="/collections" class="text-sm text-indigo-600 transition-colors hover:text-indigo-500 dark:text-indigo-400">
          全部收藏 →
        </NuxtLink>
      </div>
      <div class="grid gap-4">
        <CollectionCard v-for="item in collections" :key="item.stem" :item="item" />
      </div>
    </section>
  </div>
</template>
