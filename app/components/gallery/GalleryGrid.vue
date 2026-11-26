<script setup lang="ts">
import type { GalleryCollectionItem } from '@nuxt/content'

defineProps<{ images: GalleryCollectionItem['images'] }>()

const emit = defineEmits<{ open: [index: number] }>()
</script>

<template>
  <div class="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
    <button
      v-for="(img, i) in images"
      :key="img.src"
      class="group aspect-square overflow-hidden rounded-lg bg-zinc-100 dark:bg-zinc-800"
      @click="emit('open', i)"
    >
      <img
        :src="img.src"
        :alt="img.alt ?? ''"
        loading="lazy"
        class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
      >
    </button>
  </div>
</template>
