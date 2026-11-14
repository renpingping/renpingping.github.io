<script setup lang="ts">
import type { NuxtError } from '#app'

const props = defineProps<{ error: NuxtError }>()

// 旧 Hexo 链接 → 新站路由映射（仅 2 篇文章）
const LEGACY_MAP: Record<string, string> = {
  '/2020/06/18/hello-world/': '/blog/hello-world',
  '/2020/06/21/hexo-emoji/': '/blog/hexo-emoji',
}

const redirected = ref(false)

onMounted(() => {
  const path = window.location.pathname.replace(/\/index\.html$/, '').replace(/^(.+?)\/?$/, '$1/')
  const target = LEGACY_MAP[path] ?? LEGACY_MAP[path.replace(/\/$/, '')]
  if (target) {
    redirected.value = true
    navigateTo(target, { replace: true })
  }
})

useHead({ title: props.error.statusCode === 404 ? '页面不存在' : '出错了' })

function goHome() {
  clearError({ redirect: '/' })
}
</script>

<template>
  <NuxtLayout>
    <div class="flex min-h-[60vh] flex-col items-center justify-center px-6 text-center">
      <p class="text-7xl font-black text-indigo-500/80">{{ error.statusCode }}</p>
      <h1 class="mt-4 text-xl font-semibold text-zinc-900 dark:text-zinc-100">
        {{ error.statusCode === 404 ? '页面不存在' : '出错了' }}
      </h1>
      <p v-if="error.statusCode === 404 && !redirected" class="mt-2 text-sm text-zinc-500">
        你访问的地址可能已迁移，试试从首页或博客列表找找。
      </p>
      <div class="mt-8 flex gap-3">
        <button
          class="rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-indigo-500"
          @click="goHome"
        >
          返回首页
        </button>
        <NuxtLink
          to="/blog"
          class="rounded-lg border border-zinc-300 px-5 py-2.5 text-sm font-medium text-zinc-700 transition-colors hover:border-zinc-400 dark:border-zinc-700 dark:text-zinc-300 dark:hover:border-zinc-500"
        >
          浏览博客
        </NuxtLink>
      </div>
    </div>
  </NuxtLayout>
</template>
