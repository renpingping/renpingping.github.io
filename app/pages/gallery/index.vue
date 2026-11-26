<script setup lang="ts">
const { data: albums } = await useAsyncData('gallery-list', () =>
  queryCollection('gallery').order('date', 'DESC').all(),
)

usePageSeo(() => ({ title: '画廊', description: '图片收集与瞬间' }))
</script>

<template>
  <div>
    <PageHeader
      title="画廊"
      description="图片收集与瞬间"
    />
    <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      <AlbumCard
        v-for="album in albums ?? []"
        :key="album.stem"
        :album="album"
      />
    </div>
  </div>
</template>
