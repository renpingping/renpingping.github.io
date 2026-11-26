<script setup lang="ts">
const colorMode = useColorMode()

function toggle() {
  colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'
}
</script>

<template>
  <button
    class="rounded-md p-2 text-zinc-600 transition-colors hover:bg-zinc-200/60 dark:text-zinc-400 dark:hover:bg-zinc-800/60"
    aria-label="切换主题"
    @click="toggle"
  >
    <svg
      v-if="colorMode.value === 'dark'"
      class="h-5 w-5"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      viewBox="0 0 24 24"
    ><circle
      cx="12"
      cy="12"
      r="4"
    /><path
      stroke-linecap="round"
      d="M12 2v2m0 16v2M4.9 4.9l1.4 1.4m11.4 11.4 1.4 1.4M2 12h2m16 0h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"
    /></svg>
    <svg
      v-else
      class="h-5 w-5"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      viewBox="0 0 24 24"
    ><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" /></svg>
  </button>
</template>
