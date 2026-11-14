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

const { format } = useFormatDate()

useHead({ title: album.value.title })
</script>

<template>
  <div v-if="album">
    <header class="mb-8">
      <NuxtLink to="/gallery" class="text-sm text-zinc-400 transition-colors hover:text-indigo-500">
        ← 返回画廊
      </NuxtLink>
      <h1 class="mt-2 text-3xl font-bold text-zinc-900 dark:text-zinc-100">{{ album.title }}</h1>
      <p class="mt-2 text-sm text-zinc-500">
        {{ album.description }} · {{ album.images.length }} 张 · {{ format(album.date) }}
      </p>
    </header>

    <GalleryGrid :images="album.images" @open="i => (lightboxIndex = i)" />

    <Lightbox
      v-if="lightboxIndex !== null"
      :images="album.images"
      :index="lightboxIndex"
      @update:index="i => (lightboxIndex = i)"
      @close="lightboxIndex = null"
    />
  </div>
</template>
