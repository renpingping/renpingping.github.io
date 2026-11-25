<script setup lang="ts">
import type { GalleryCollectionItem } from '@nuxt/content'

const props = defineProps<{ images: GalleryCollectionItem['images'] }>()

/** 当前查看第几张，父组件用 v-model:index 绑定 */
const index = defineModel<number>('index', { required: true })
const emit = defineEmits<{ close: [] }>()

const dialog = ref<HTMLElement | null>(null)
let previouslyFocused: HTMLElement | null = null
let previousOverflow = ''

// 下标越界时不渲染图片，而不是让模板里的 images[index] 直接抛错
const current = computed(() => props.images[index.value])

function step(delta: number) {
  index.value = Math.min(props.images.length - 1, Math.max(0, index.value + delta))
}

/** 把焦点留在对话框里：焦点在首个按钮上按 Shift+Tab、或在末个按钮上按 Tab 时，绕到另一端 */
function trapFocus(event: KeyboardEvent) {
  const focusable = Array.from(dialog.value?.querySelectorAll<HTMLElement>('button:not(:disabled)') ?? [])
  const first = focusable[0]
  const last = focusable[focusable.length - 1]
  if (!first || !last)
    return
  const active = document.activeElement
  const outside = !(dialog.value?.contains(active) ?? false)
  if (event.shiftKey && (active === first || outside)) {
    event.preventDefault()
    last.focus()
  }
  else if (!event.shiftKey && (active === last || outside)) {
    event.preventDefault()
    first.focus()
  }
}

function onKey(event: KeyboardEvent) {
  if (event.key === 'Escape')
    emit('close')
  else if (event.key === 'ArrowLeft')
    step(-1)
  else if (event.key === 'ArrowRight')
    step(1)
  else if (event.key === 'Tab')
    trapFocus(event)
}

// 翻到头或尾时，原来聚焦的「上一张 / 下一张」会变成禁用；此时把焦点收回对话框，避免落到背景里
watch(index, async () => {
  await nextTick()
  if (!dialog.value?.contains(document.activeElement))
    dialog.value?.focus()
})

onMounted(() => {
  previouslyFocused = document.activeElement as HTMLElement | null
  // 打开期间背景不可滚动；记下原来的值，关闭时还原
  previousOverflow = document.body.style.overflow
  document.body.style.overflow = 'hidden'
  window.addEventListener('keydown', onKey)
  dialog.value?.focus()
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', onKey)
  document.body.style.overflow = previousOverflow
  previouslyFocused?.focus()
})
</script>

<template>
  <Teleport to="body">
    <div
      ref="dialog"
      role="dialog"
      aria-modal="true"
      aria-label="图片查看器"
      tabindex="-1"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 outline-none"
      @click.self="emit('close')"
    >
      <button
        type="button"
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
        type="button"
        :disabled="index === 0"
        class="absolute left-2 rounded-full p-3 text-white/70 transition-colors hover:bg-white/10 hover:text-white disabled:cursor-default disabled:text-white/25 disabled:hover:bg-transparent"
        aria-label="上一张"
        @click="step(-1)"
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
        type="button"
        :disabled="index === images.length - 1"
        class="absolute right-2 rounded-full p-3 text-white/70 transition-colors hover:bg-white/10 hover:text-white disabled:cursor-default disabled:text-white/25 disabled:hover:bg-transparent"
        aria-label="下一张"
        @click="step(1)"
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

      <p
        class="absolute bottom-4 text-sm text-white/60"
        aria-live="polite"
      >
        {{ index + 1 }} / {{ images.length }}
      </p>
    </div>
  </Teleport>
</template>
