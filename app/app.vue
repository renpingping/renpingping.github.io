<script setup lang="ts">
const config = useAppConfig()
useHead({
  titleTemplate: (title?: string) => (title ? `${title} · ${config.site.name}` : config.site.name),
  // 全站共用的社交分享信息；各页面自己的标题、描述与 canonical 见 usePageSeo
  meta: [
    { property: 'og:site_name', content: config.site.name },
    { property: 'og:locale', content: 'zh_CN' },
    { name: 'twitter:card', content: 'summary' },
  ],
})
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
