<script setup lang="ts">
// 移植自 antfu 100/039「噪声流场圆点」效果，作为文章详情页背景
// https://github.com/antfu/100/blob/main/src/pages/039.vue
import type { P5I } from 'p5i'

const colorMode = useColorMode()
const el = ref<HTMLDivElement | null>(null)

const SCALE = 200 // 噪声场缩放：越大纹理越平缓
const LENGTH = 10 // 圆点偏移最大长度
const SPACING = 15 // 网格间距

let cleanup: (() => void) | null = null
let disposed = false

onMounted(async () => {
  // p5i 在模块加载期访问 window，必须动态导入以避免 SSR 报错
  const { p5i } = await import('p5i')
  const {
    mount,
    unmount,
    createCanvas,
    clear,
    noFill,
    stroke,
    noise,
    noiseSeed,
    resizeCanvas,
    cos,
    sin,
    TWO_PI,
  }: ReturnType<typeof p5i> = p5i()

  let w = window.innerWidth
  let h = window.innerHeight
  const points: { x: number, y: number, opacity: number }[] = []

  function addPoints() {
    points.length = 0
    for (let x = -SPACING / 2; x < w + SPACING; x += SPACING) {
      for (let y = -SPACING / 2; y < h + SPACING; y += SPACING) {
        points.push({ x, y, opacity: Math.random() * 0.5 + 0.5 })
      }
    }
  }

  function setup() {
    createCanvas(w, h)
    noFill()
    noiseSeed(+new Date())
    addPoints()
  }

  function draw({ circle }: P5I) {
    // 透明清屏，透出页面底色以适配暗色模式
    clear()
    const t = +new Date() / 10000
    const base = colorMode.value === 'dark' ? 200 : 180
    for (const p of points) {
      const { x, y } = p
      const rad = (noise(x / SCALE, y / SCALE, t) - 0.5) * 2 * TWO_PI
      const length = (noise(x / SCALE, y / SCALE, t * 2) + 0.5) * LENGTH
      const nx = x + cos(rad) * length
      const ny = y + sin(rad) * length
      stroke(base, base, base, (Math.abs(cos(rad)) * 0.5 + 0.5) * p.opacity * 255)
      circle(nx, ny, 1)
    }
  }

  mount(el.value!, { setup, draw })

  // 等待动态导入期间组件已被卸载：不再挂载，避免动画循环泄漏
  if (disposed) {
    unmount()
    return
  }

  const onResize = () => {
    w = window.innerWidth
    h = window.innerHeight
    resizeCanvas(w, h)
    addPoints()
  }
  window.addEventListener('resize', onResize)

  cleanup = () => {
    window.removeEventListener('resize', onResize)
    unmount()
  }
})

onBeforeUnmount(() => {
  disposed = true
  cleanup?.()
})
</script>

<template>
  <div
    ref="el"
    aria-hidden="true"
    class="pointer-events-none fixed inset-0"
    style="z-index: -1"
  />
</template>
