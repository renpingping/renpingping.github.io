<script setup lang="ts">
defineProps<{
  links: { id: string, depth: number, text: string }[]
}>()
</script>

<template>
  <nav class="sticky top-20 hidden max-h-[calc(100vh-6rem)] overflow-auto card-surface p-4 text-sm xl:block">
    <p class="mb-3 font-semibold text-zinc-900 dark:text-zinc-100">目录</p>
    <ul class="space-y-1.5 border-l border-zinc-200 dark:border-zinc-800">
      <li
        v-for="link in links"
        :key="link.id"
      >
        <a
          :href="`#${link.id}`"
          class="block text-zinc-500 transition-colors hover:text-indigo-600 dark:text-zinc-400 dark:hover:text-indigo-400"
          :style="{ paddingLeft: `${(link.depth - 2) * 12 + 12}px` }"
        >{{ link.text }}</a>
      </li>
    </ul>
  </nav>
</template>
