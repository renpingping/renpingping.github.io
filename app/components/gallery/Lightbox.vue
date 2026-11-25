<script setup lang="ts">
const props = defineProps<{
  images: { src: string, alt?: string }[]
  index: number
}>()

const emit = defineEmits<{
  close: []
  'update:index': [index: number]
}>()

// 下标越界时不渲染图片，而不是让模板里的 images[index] 直接抛错
const current = computed(() => props.images[props.index])

function prev() {
  if (props.index > 0) emit('update:index', props.index - 1)
}

function next() {
  if (props.index < props.images.length - 1) emit('update:index', props.index + 1)
}

function onKey(e: KeyboardEvent) {
  if (e.key === 'Escape') emit('close')
  else if (e.key === 'ArrowLeft') prev()
  else if (e.key === 'ArrowRight') next()
}

onMounted(() => window.addEventListener('keydown', onKey))
onBeforeUnmount(() => window.removeEventListener('keydown', onKey))
</script>

<template>
  <Teleport to="body">
    <div
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
      @click.self="emit('close')"
    >
      <button
        class="absolute right-4 top-4 rounded-full p-2 text-white/70 transition-colors hover:bg-white/10 hover:text-white"
        aria-label="关闭"
        @click="emit('close')"
      >
        <svg
          class="h-6 w-6"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          viewBox="0 0 24 24"
        ><path
          stroke-linecap="round"
          d="M6 6l12 12M18 6L6 18"
        /></svg>
      </button>

      <button
        v-if="index > 0"
        class="absolute left-2 rounded-full p-3 text-white/70 transition-colors hover:bg-white/10 hover:text-white"
        aria-label="上一张"
        @click.stop="prev"
      >
        <svg
          class="h-6 w-6"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          viewBox="0 0 24 24"
        ><path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="m15 18-6-6 6-6"
        /></svg>
      </button>

      <img
        v-if="current"
        :src="current.src"
        :alt="current.alt ?? ''"
        class="max-h-[85vh] max-w-full rounded-lg object-contain"
      >

      <button
        v-if="index < images.length - 1"
        class="absolute right-2 rounded-full p-3 text-white/70 transition-colors hover:bg-white/10 hover:text-white"
        aria-label="下一张"
        @click.stop="next"
      >
        <svg
          class="h-6 w-6"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          viewBox="0 0 24 24"
        ><path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="m9 18 6-6-6-6"
        /></svg>
      </button>

      <p class="absolute bottom-4 text-sm text-white/60">{{ index + 1 }} / {{ images.length }}</p>
    </div>
  </Teleport>
</template>
