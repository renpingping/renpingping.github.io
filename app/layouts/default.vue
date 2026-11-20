<script setup lang="ts">
const route = useRoute()
// 长文阅读页（/blog/xxx、/weekly/xxx）用 039 流场背景，其余页面用 013 分支背景
const isArticleDetail = computed(() => /^\/(blog|weekly)\/.+/.test(route.path))
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
