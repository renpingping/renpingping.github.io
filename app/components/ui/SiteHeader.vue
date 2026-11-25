<script setup lang="ts">
const config = useAppConfig()
const open = ref(false)

const nav = [
  { label: '首页', to: '/' },
  { label: '文章', to: '/blog' },
  { label: '周报', to: '/weekly' },
  { label: 'Demo', to: '/projects' },
  { label: '画廊', to: '/gallery' },
  { label: '收藏', to: '/collections' },
  { label: '关于', to: '/about' },
]

const route = useRoute()
// 路由变化时收起移动端菜单
watch(() => route.path, () => {
  open.value = false
})
</script>

<template>
  <header class="sticky top-0 z-40 border-b border-zinc-200/70 bg-zinc-50/80 backdrop-blur dark:border-zinc-800/70 dark:bg-zinc-950/80">
    <div class="mx-auto flex h-14 max-w-5xl items-center justify-between px-4 sm:px-6">
      <NuxtLink
        to="/"
        class="flex items-center gap-2 font-bold text-zinc-900 dark:text-zinc-100"
      >
        <img
          src="/logo.png"
          alt="logo"
          class="h-7 w-7 rounded-md"
        >
        <span>{{ config.site.name }}</span>
      </NuxtLink>

      <nav class="hidden items-center gap-1 md:flex">
        <NuxtLink
          v-for="item in nav"
          :key="item.to"
          :to="item.to"
          class="rounded-md px-3 py-1.5 text-sm font-medium text-zinc-600 transition-colors hover:bg-zinc-200/60 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800/60 dark:hover:text-zinc-100"
        >
          {{ item.label }}
        </NuxtLink>
        <ThemeToggle />
      </nav>

      <div class="flex items-center gap-1 md:hidden">
        <ThemeToggle />
        <button
          class="rounded-md p-2 text-zinc-600 hover:bg-zinc-200/60 dark:text-zinc-400 dark:hover:bg-zinc-800/60"
          aria-label="菜单"
          @click="open = !open"
        >
          <svg
            v-if="!open"
            class="h-5 w-5"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            viewBox="0 0 24 24"
          ><path
            stroke-linecap="round"
            d="M4 6h16M4 12h16M4 18h16"
          /></svg>
          <svg
            v-else
            class="h-5 w-5"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            viewBox="0 0 24 24"
          ><path
            stroke-linecap="round"
            d="M6 6l12 12M18 6L6 18"
          /></svg>
        </button>
      </div>
    </div>

    <nav
      v-if="open"
      class="border-t border-zinc-200/70 px-4 py-2 md:hidden dark:border-zinc-800/70"
    >
      <NuxtLink
        v-for="item in nav"
        :key="item.to"
        :to="item.to"
        class="block rounded-md px-3 py-2 text-sm font-medium text-zinc-600 hover:bg-zinc-200/60 dark:text-zinc-400 dark:hover:bg-zinc-800/60"
      >
        {{ item.label }}
      </NuxtLink>
    </nav>
  </header>
</template>
