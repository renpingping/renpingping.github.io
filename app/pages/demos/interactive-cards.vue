<script setup lang="ts">
// Vue Demo 示例：记忆翻牌小游戏
// 访问地址 /demos/interactive-cards
interface Card {
  id: number
  emoji: string
  flipped: boolean
  matched: boolean
}

const EMOJIS = ['🚀', '🌊', '⚡', '🔥', '🎨', '🧩', '🌙', '⭐']

const cards = ref<Card[]>([])
const lock = ref(false)
const moves = ref(0)
const startedAt = ref<number | null>(null)
const elapsed = ref(0)

const done = computed(() => cards.value.length > 0 && cards.value.every(c => c.matched))

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function reset() {
  cards.value = shuffle([...EMOJIS, ...EMOJIS]).map((emoji, i) => ({
    id: i,
    emoji,
    flipped: false,
    matched: false,
  }))
  moves.value = 0
  startedAt.value = null
  elapsed.value = 0
}

let timer: ReturnType<typeof setInterval> | undefined

onMounted(() => {
  reset()
  timer = setInterval(() => {
    if (startedAt.value && !done.value)
      elapsed.value = Math.round((Date.now() - startedAt.value) / 1000)
  }, 500)
})

onBeforeUnmount(() => clearInterval(timer))

function flip(card: Card) {
  if (lock.value || card.flipped || card.matched)
    return
  if (!startedAt.value)
    startedAt.value = Date.now()
  card.flipped = true

  const open = cards.value.filter(c => c.flipped && !c.matched)
  if (open.length !== 2)
    return

  moves.value++
  lock.value = true
  if (open[0].emoji === open[1].emoji) {
    open.forEach((c) => {
      c.matched = true
      c.flipped = false
    })
    lock.value = false
  }
  else {
    setTimeout(() => {
      open.forEach(c => c.flipped = false)
      lock.value = false
    }, 700)
  }
}

useHead({ title: '记忆翻牌' })
</script>

<template>
  <div class="mx-auto max-w-2xl">
    <header class="mb-6 flex items-end justify-between">
      <div>
        <h1 class="text-2xl font-bold text-zinc-900 dark:text-zinc-100">记忆翻牌</h1>
        <p class="mt-1 text-sm text-zinc-500">Vue 3 响应式 + 组合式 API 小游戏</p>
      </div>
      <div class="flex items-center gap-4 text-sm text-zinc-500">
        <span>⏱ {{ elapsed }}s</span>
        <span>🎯 {{ moves }} 步</span>
      </div>
    </header>

    <div
      v-if="done"
      class="mb-6 rounded-xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-center text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950 dark:text-emerald-400"
    >
      🎉 全部配对成功！用了 {{ moves }} 步、{{ elapsed }} 秒
    </div>

    <div class="grid grid-cols-4 gap-3">
      <button
        v-for="c in cards"
        :key="c.id"
        class="relative aspect-square rounded-xl border transition-all duration-300"
        :class="c.flipped || c.matched
          ? 'border-indigo-300 bg-white dark:border-indigo-700 dark:bg-zinc-900'
          : 'border-zinc-200 bg-gradient-to-br from-indigo-400 to-violet-500 hover:-translate-y-0.5 hover:shadow-lg dark:border-zinc-800'"
        @click="flip(c)"
      >
        <span
          class="absolute inset-0 flex items-center justify-center text-3xl transition-opacity duration-300"
          :class="(c.flipped || c.matched) ? 'opacity-100' : 'opacity-0'"
        >{{ c.emoji }}</span>
        <span
          v-if="!c.flipped && !c.matched"
          class="absolute inset-0 flex items-center justify-center text-2xl text-white/80"
        >？</span>
      </button>
    </div>

    <div class="mt-6 text-center">
      <button
        class="rounded-full border border-zinc-300 px-6 py-2 text-sm font-medium text-zinc-600 transition-colors hover:border-indigo-400 hover:text-indigo-600 dark:border-zinc-700 dark:text-zinc-400 dark:hover:border-indigo-500 dark:hover:text-indigo-400"
        @click="reset"
      >重新开始</button>
    </div>
  </div>
</template>
