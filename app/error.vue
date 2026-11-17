<script setup lang="ts">
import type { NuxtError } from '#app'

const props = defineProps<{ error: NuxtError }>()

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
      <p v-if="error.statusCode === 404" class="mt-2 text-sm text-zinc-500">
        你访问的地址可能已迁移，试试从首页或文章列表找找。
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
          浏览文章
        </NuxtLink>
      </div>
    </div>
  </NuxtLayout>
</template>
