<script setup lang="ts">
const { data: albums } = await useAsyncData('gallery-list', () =>
  queryCollection('gallery').order('date', 'DESC').all(),
)

useHead({ title: '画廊' })
</script>

<template>
  <div>
    <header class="mb-8">
      <h1 class="text-3xl font-bold text-zinc-900 dark:text-zinc-100">画廊</h1>
      <p class="mt-2 text-sm text-zinc-500">图片收集与瞬间</p>
    </header>
    <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      <AlbumCard v-for="album in albums ?? []" :key="album.stem" :album="album" />
    </div>
  </div>
</template>
