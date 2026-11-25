<script setup lang="ts">
const config = useAppConfig()

usePageSeo(() => ({ title: '关于' }))
</script>

<template>
  <div class="mx-auto max-w-2xl">
    <section class="flex flex-col items-center py-10 text-center">
      <img
        src="/images/avatar.jpg"
        alt="avatar"
        class="h-24 w-24 rounded-full ring-4 ring-indigo-500/20"
      >
      <h1 class="mt-5 text-3xl font-bold text-zinc-900 dark:text-zinc-100">{{ config.site.author }}</h1>
      <p class="mt-2 text-sm text-muted">{{ config.about.role }}</p>
      <p class="mt-6 leading-relaxed text-zinc-600 dark:text-zinc-400">
        {{ config.about.intro }}
      </p>
      <div class="mt-6">
        <SocialLinks />
      </div>
    </section>

    <section class="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
      <h2 class="mb-5 font-semibold text-zinc-900 dark:text-zinc-100">技能</h2>
      <div class="space-y-4">
        <div
          v-for="s in config.about.skills"
          :key="s.name"
        >
          <div class="mb-1 flex justify-between text-sm">
            <span class="text-zinc-700 dark:text-zinc-300">{{ s.name }}</span>
            <span class="text-muted">{{ s.percent }}%</span>
          </div>
          <div class="h-1.5 overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800">
            <div
              class="h-full rounded-full bg-gradient-to-r from-indigo-500 to-violet-500"
              :style="{ width: `${s.percent}%` }"
            />
          </div>
        </div>
      </div>
    </section>

    <section class="mt-8 rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
      <h2 class="mb-3 font-semibold text-zinc-900 dark:text-zinc-100">本站</h2>
      <p class="text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
        由 <a
          href="https://nuxt.com"
          target="_blank"
          rel="noopener"
          class="text-indigo-600 hover:underline dark:text-indigo-400"
        >Nuxt</a>
        + <a
          href="https://content.nuxt.com"
          target="_blank"
          rel="noopener"
          class="text-indigo-600 hover:underline dark:text-indigo-400"
        >Nuxt Content</a>
        构建，源码托管在
        <a
          :href="config.site.repo"
          target="_blank"
          rel="noopener"
          class="text-indigo-600 hover:underline dark:text-indigo-400"
        >GitHub</a>，
        通过 GitHub Actions 自动部署。
      </p>
    </section>
  </div>
</template>
