<script setup lang="ts">
defineProps<{
  title: string
  /** 标题下的说明；不填则不显示 */
  description?: string
}>()
</script>

<template>
  <header class="mb-8">
    <h1 class="text-3xl font-bold text-zinc-900 dark:text-zinc-100">{{ title }}</h1>
    <p
      v-if="description"
      class="mt-2 text-sm text-muted"
    >
      {{ description }}
    </p>
  </header>
</template>
