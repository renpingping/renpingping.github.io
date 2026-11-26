<script setup lang="ts">
// 移植自 antfu 100/039「噪声流场圆点」效果，作为长文详情页背景
// https://github.com/antfu/100/blob/main/src/pages/039.vue
// 原先用 p5i 实现：它打包后超过 1MB 且被全站预取，而这里只用到噪声和画圆两种能力，所以改为原生 Canvas。
import { createNoise3D, createPermutation } from '~/utils/perlin'

const colorMode = useColorMode()
const { canvas, fit, getContext } = useCanvasSurface({ maxDpr: 2, onResize: restart })

const SCALE = 200 // 噪声场缩放：越大纹理越平缓
const LENGTH = 10 // 圆点偏移长度
const SPACING = 15 // 网格间距
const FPS = 30 // 漂移非常慢，30 帧与 60 帧看不出区别，而主线程开销减半
const ALPHA_BUCKETS = 16 // 透明度分桶：同一桶的点合并成一次描边，代替逐点设置颜色

const noise = createNoise3D(createPermutation(Date.now()))

// 每个点占三个数：x、y、基础透明度
let points = new Float32Array(0)
let width = 0
let height = 0
let pending = 0
let lastTime = 0
let animating = false

function buildPoints() {
  const list: number[] = []
  for (let x = -SPACING / 2; x < width + SPACING; x += SPACING) {
    for (let y = -SPACING / 2; y < height + SPACING; y += SPACING)
      list.push(x, y, Math.random() * 0.5 + 0.5)
  }
  points = Float32Array.from(list)
}

function draw(time: number) {
  const ctx = getContext()
  if (!ctx)
    return

  // 透明清屏，透出页面底色以适配暗色模式
  ctx.clearRect(0, 0, width, height)
  const t = time / 10000
  const base = colorMode.value === 'dark' ? 200 : 180
  ctx.strokeStyle = `rgb(${base}, ${base}, ${base})`
  ctx.lineWidth = 1

  const buckets: number[][] = Array.from({ length: ALPHA_BUCKETS }, () => [])
  for (let i = 0; i < points.length; i += 3) {
    const x = points[i]!
    const y = points[i + 1]!
    const rad = (noise(x / SCALE, y / SCALE, t) - 0.5) * 4 * Math.PI
    const length = (noise(x / SCALE, y / SCALE, t * 2) + 0.5) * LENGTH
    const cos = Math.cos(rad)
    const sin = Math.sin(rad)
    const alpha = (Math.abs(cos) * 0.5 + 0.5) * points[i + 2]!
    const bucket = Math.min(ALPHA_BUCKETS - 1, Math.round(alpha * (ALPHA_BUCKETS - 1)))
    buckets[bucket]!.push(x + cos * length, y + sin * length)
  }

  for (let bucket = 0; bucket < ALPHA_BUCKETS; bucket++) {
    const list = buckets[bucket]!
    if (!list.length)
      continue
    ctx.globalAlpha = bucket / (ALPHA_BUCKETS - 1)
    ctx.beginPath()
    for (let i = 0; i < list.length; i += 2) {
      // 直径 1 的圆配 1 像素描边，与原先 p5 的 circle(x, y, 1) 几何一致
      ctx.moveTo(list[i]! + 0.5, list[i + 1]!)
      ctx.arc(list[i]!, list[i + 1]!, 0.5, 0, 2 * Math.PI)
    }
    ctx.stroke()
  }
}

function loop(time: number) {
  if (!animating)
    return
  pending = requestAnimationFrame(loop)
  if (time - lastTime < 1000 / FPS)
    return
  lastTime = time
  draw(time)
}

function restart() {
  ;({ width, height } = fit())
  buildPoints()
  cancelAnimationFrame(pending)
  if (prefersReducedMotion()) {
    // 系统要求减少动态效果：只画一帧静止的背景
    animating = false
    draw(0)
    return
  }
  animating = true
  lastTime = 0
  pending = requestAnimationFrame(loop)
}

// 静止状态下切换主题时需要重画一次（颜色在 draw 里读取）
watch(() => colorMode.value, () => {
  if (!animating)
    draw(0)
})

onBeforeUnmount(() => {
  animating = false
  cancelAnimationFrame(pending)
})
</script>

<template>
  <canvas
    ref="canvas"
    aria-hidden="true"
    class="pointer-events-none fixed inset-0"
    style="z-index: -1"
  />
</template>
