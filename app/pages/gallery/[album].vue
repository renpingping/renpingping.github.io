<script setup lang="ts">
const route = useRoute()

const { data: albums } = await useAsyncData('albums-all', () =>
  queryCollection('gallery').all(),
)

const album = computed(() =>
  (albums.value ?? []).find(a => a.stem.split('/').pop() === route.params.album),
)

if (!album.value) {
  throw createError({ statusCode: 404, statusMessage: '相册不存在' })
}

const lightboxIndex = ref<number | null>(null)
// v-model 需要一个数字，而 null 表示灯箱关闭
const lightboxCurrent = computed({
  get: () => lightboxIndex.value ?? 0,
  set: (value: number) => {
    lightboxIndex.value = value
  },
})

usePageSeo(() => ({
  title: album.value?.title,
  description: album.value?.description,
  path: `/gallery/${route.params.album}`,
}))
</script>

<template>
  <div v-if="album">
    <header class="mb-8">
      <NuxtLink
        to="/gallery"
        class="text-sm text-muted transition-colors hover:text-indigo-500"
      >
        ← 返回画廊
      </NuxtLink>
      <h1 class="mt-2 text-3xl font-bold text-zinc-900 dark:text-zinc-100">{{ album.title }}</h1>
      <p class="mt-2 text-sm text-muted">
        {{ album.description }} · {{ album.images.length }} 张 · {{ formatDate(album.date) }}
      </p>
    </header>

    <GalleryGrid
      :images="album.images"
      @open="i => (lightboxIndex = i)"
    />

    <Lightbox
      v-if="lightboxIndex !== null"
      v-model:index="lightboxCurrent"
      :images="album.images"
      @close="lightboxIndex = null"
    />
  </div>
</template>
