<script setup lang="ts">
const show = ref(false)

const onScroll = () => {
  show.value = window.scrollY > window.innerHeight
}

onMounted(() => {
  onScroll()
  window.addEventListener('scroll', onScroll, { passive: true })
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', onScroll)
})

const toTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}
</script>

<template>
  <Transition name="btt">
    <button
      v-show="show"
      class="fixed bottom-8 right-7 z-50 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-transparent bg-transparent text-zinc-600 transition-colors duration-200 hover:border-zinc-300 hover:bg-zinc-100 hover:text-indigo-600 dark:text-zinc-400 dark:hover:border-zinc-600 dark:hover:bg-zinc-800 dark:hover:text-indigo-400"
      aria-label="回到顶部"
      @click="toTop"
    >
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2.2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <path d="M12 19V5" />
        <path d="m5 12 7-7 7 7" />
      </svg>
    </button>
  </Transition>
</template>

<style scoped>
/* 进出动画的类名作用在本组件的根元素上，用 scoped 即可，不再向外暴露全局样式 */
.btt-enter-active,
.btt-leave-active {
  transition:
    opacity 0.25s ease,
    transform 0.25s ease;
}
.btt-enter-from,
.btt-leave-to {
  opacity: 0;
  transform: translateY(8px);
}
</style>
