<script setup lang="ts">
/**
 * 标签筛选条：「全部」加各个标签（带数量），点击后把选中的标签同步给父组件（v-model:active）。
 */
defineProps<{
  tags: readonly (readonly [string, number])[]
}>()

const active = defineModel<string | null>('active', { default: null })

const chip = 'rounded-full px-3 py-1 text-sm font-medium transition-colors'
const idle = 'bg-zinc-200/60 text-zinc-600 hover:bg-zinc-300/60 dark:bg-zinc-800 dark:text-zinc-400'
const selected = 'bg-indigo-600 text-white'
</script>

<template>
  <div
    v-if="tags.length"
    class="mb-8 flex flex-wrap items-center gap-2"
  >
    <button
      :class="[chip, active === null ? selected : idle]"
      @click="active = null"
    >
      全部
    </button>
    <button
      v-for="[tag, count] in tags"
      :key="tag"
      :class="[chip, active === tag ? selected : idle]"
      @click="active = tag"
    >
      {{ tag }} ({{ count }})
    </button>
  </div>
</template>
