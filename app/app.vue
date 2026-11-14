<script setup lang="ts">
const config = useAppConfig()
useHead({
  titleTemplate: (title?: string) => (title ? `${title} · ${config.site.name}` : config.site.name),
})
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
