<script setup lang="ts">
const show = ref(false)

const onScroll = () => {
  show.value = window.scrollY > window.innerHeight
}

onMounted(() => {
  onScroll()
  window.addEventListener('scroll', onScroll, { passive: true })
})

onUnmounted(() => {
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
      class="back-to-top"
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

<style>
.back-to-top {
  position: fixed;
  right: 28px;
  bottom: 32px;
  z-index: 50;
  width: 40px;
  height: 40px;
  border-radius: 9999px;
  border: 1px solid transparent;
  background: transparent;
  color: #6b7280;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background-color 0.2s ease, color 0.2s ease, border-color 0.2s ease;
}
.back-to-top:hover {
  background: #eef2f6;
  border-color: #b1bdd0;
  color: #0969da;
}
html.dark .back-to-top {
  color: #9198a1;
}
html.dark .back-to-top:hover {
  background: #1f2630;
  border-color: #3d444d;
  color: #58a6ff;
}
.btt-enter-active,
.btt-leave-active {
  transition: opacity 0.25s ease, transform 0.25s ease;
}
.btt-enter-from,
.btt-leave-to {
  opacity: 0;
  transform: translateY(8px);
}
</style>
