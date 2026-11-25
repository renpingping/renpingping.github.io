<script setup lang="ts">
const route = useRoute()
// 背景由页面自己声明：长文阅读页在 definePageMeta 里写 { background: 'flow' } 用流场，其余页面用分支生长
const isArticleDetail = computed(() => route.meta.background === 'flow')
</script>

<template>
  <div class="flex min-h-screen flex-col">
    <FlowFieldBackground v-if="isArticleDetail" />
    <BranchBackground v-else />
    <SiteHeader />
    <main class="mx-auto w-full max-w-5xl flex-1 px-4 py-10 sm:px-6">
      <slot />
    </main>
    <SiteFooter />
    <BackToTop />
  </div>
</template>
