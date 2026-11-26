<script setup lang="ts">
// 移植自 antfu 100/013「分支生长」效果，改编为全站背景
// https://github.com/antfu/100/blob/main/src/pages/013.vue
const colorMode = useColorMode()
const { canvas, fit, getContext } = useCanvasSurface({ onResize: start })

const { random } = Math
const r90 = Math.PI / 2
const r180 = Math.PI
const r15 = Math.PI / 12

const INIT = 5 // 前几次迭代 100% 分叉，保证初期生长
const LEN = 5 // 每段分支最大长度
const STEP_INTERVAL = 60 // 每次生长的间隔 ms，越大越慢

let ctx: CanvasRenderingContext2D | null = null
let width = 0
let height = 0
let steps: (() => void)[] = []
let prevSteps: (() => void)[] = []
let iterations = 0
let raf = 0
let paused = true

function polar2cart(x: number, y: number, r: number, theta: number): [number, number] {
  const dx = r * Math.cos(theta)
  const dy = r * Math.sin(theta)
  return [x + dx, y + dy]
}

function step(x: number, y: number, rad: number) {
  const length = random() * LEN
  const [nx, ny] = polar2cart(x, y, length, rad)
  ctx!.beginPath()
  ctx!.moveTo(x, y)
  ctx!.lineTo(nx, ny)
  ctx!.stroke()
  const rad1 = rad + random() * r15
  const rad2 = rad - random() * r15
  const pad = 50
  if (nx < -pad || nx > width + pad || ny < -pad || ny > height + pad)
    return
  if (iterations <= INIT || random() > 0.5)
    steps.push(() => step(nx, ny, rad1))
  if (iterations <= INIT || random() > 0.5)
    steps.push(() => step(nx, ny, rad2))
}

function frame() {
  iterations += 1
  prevSteps = steps
  steps = []
  if (!prevSteps.length) {
    pause() // 只在打开时播放一次，画完即停
    return false
  }
  prevSteps.forEach(i => i())
  return true
}

let lastStepTime = 0

function loop(now: number) {
  if (paused)
    return
  if (now - lastStepTime >= STEP_INTERVAL) {
    lastStepTime = now
    frame()
  }
  raf = requestAnimationFrame(loop)
}

function pause() {
  paused = true
  cancelAnimationFrame(raf)
}

function start() {
  pause()
  ;({ width, height } = fit())
  ctx = getContext()
  if (!ctx)
    return
  iterations = 0
  lastStepTime = 0
  ctx.clearRect(0, 0, width, height)
  ctx.lineWidth = 1
  ctx.strokeStyle = colorMode.value === 'dark' ? '#ffffff1c' : '#0000001e'
  prevSteps = []
  // 起点密度随屏幕宽度增加，大屏不至于太稀疏
  const n = Math.min(5, Math.max(1, Math.round(width / 700)))
  steps = []
  if (random() < 0.5) {
    for (let i = 0; i < n; i++) {
      steps.push(() => step(0, random() * height, 0))
      steps.push(() => step(width, random() * height, r180))
    }
  }
  else {
    for (let i = 0; i < n; i++) {
      steps.push(() => step(random() * width, 0, r90))
      steps.push(() => step(random() * width, height, -r90))
    }
  }

  if (prefersReducedMotion()) {
    // 系统要求减少动态效果：不播放生长过程，直接画出最终画面
    while (frame());
    return
  }
  paused = false
  raf = requestAnimationFrame(loop)
}

watch(() => colorMode.value, () => start())
</script>

<template>
  <canvas
    ref="canvas"
    aria-hidden="true"
    class="pointer-events-none fixed inset-0"
    style="z-index: -1"
  />
</template>
