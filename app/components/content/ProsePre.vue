<script setup lang="ts">
const props = defineProps<{
  code?: string
  language?: string
  filename?: string
  highlights?: number[]
}>()

const copied = ref(false)

async function copy() {
  try {
    await navigator.clipboard.writeText(props.code ?? '')
    copied.value = true
    setTimeout(() => (copied.value = false), 1500)
  } catch { /* 剪贴板不可用时静默 */ }
}
</script>

<template>
  <div class="group relative my-6 overflow-hidden rounded-lg border border-zinc-200 dark:border-zinc-800">
    <div class="flex items-center justify-between border-b border-zinc-200 bg-zinc-100 px-4 py-1.5 text-xs dark:border-zinc-800 dark:bg-zinc-900">
      <span class="font-mono text-zinc-500">{{ filename ?? language ?? 'text' }}</span>
      <button
        class="inline-flex items-center gap-1 text-zinc-500 transition-colors hover:text-zinc-800 dark:hover:text-zinc-200"
        @click="copy"
      >
        <svg v-if="!copied" class="h-3.5 w-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><rect x="9" y="9" width="13" height="13" rx="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" /></svg>
        <svg v-else class="h-3.5 w-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="m5 13 4 4L19 7" /></svg>
        {{ copied ? '已复制' : '复制' }}
      </button>
    </div>
    <slot />
  </div>
</template>
