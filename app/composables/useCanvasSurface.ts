import type { Ref } from 'vue'
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { fitCanvas } from '~/utils/canvas'

/**
 * 全屏背景画布的公共部分：模板引用、按视口与设备像素比调整尺寸、去抖的 resize 监听与清理。
 * 绘制逻辑由各个背景组件自己负责。
 */
export function useCanvasSurface(options: { maxDpr?: number, onResize?: () => void } = {}) {
  const canvas: Ref<HTMLCanvasElement | null> = ref(null)
  let context: CanvasRenderingContext2D | null = null
  let resizeTimer: ReturnType<typeof setTimeout> | undefined

  /** 把画布调整为当前视口大小（CSS 像素），返回宽高 */
  function fit(): { width: number, height: number } {
    const viewport = { width: window.innerWidth, height: window.innerHeight }
    if (canvas.value)
      fitCanvas(canvas.value, { ...viewport, dpr: window.devicePixelRatio }, options.maxDpr)
    return viewport
  }

  function getContext(): CanvasRenderingContext2D | null {
    context ??= canvas.value?.getContext('2d') ?? null
    return context
  }

  const onResize = () => {
    clearTimeout(resizeTimer)
    resizeTimer = setTimeout(() => options.onResize?.(), 200)
  }

  onMounted(() => {
    options.onResize?.()
    window.addEventListener('resize', onResize)
  })

  onBeforeUnmount(() => {
    clearTimeout(resizeTimer)
    window.removeEventListener('resize', onResize)
  })

  return { canvas, fit, getContext }
}
