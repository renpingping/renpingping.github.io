<script setup lang="ts">
import type { GalleryCollectionItem } from '@nuxt/content'

defineProps<{ album: GalleryCollectionItem }>()

const slug = (stem: string) => stem.split('/').pop()!
</script>

<template>
  <NuxtLink
    :to="`/gallery/${slug(album.stem)}`"
    class="group relative block overflow-hidden rounded-xl bg-zinc-100 dark:bg-zinc-800"
  >
    <img
      v-if="album.cover"
      :src="album.cover"
      :alt="album.title"
      loading="lazy"
      class="aspect-[4/3] w-full object-cover transition-transform duration-300 group-hover:scale-105"
    >
    <div class="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/70 via-black/20 to-transparent p-4">
      <h2 class="text-lg font-semibold text-white">{{ album.title }}</h2>
      <p class="mt-1 text-xs text-white/70">{{ album.images.length }} 张图片</p>
    </div>
  </NuxtLink>
</template>
