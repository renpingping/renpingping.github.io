export interface CanvasLike {
  width: number
  height: number
  style: { width: string, height: string }
  getContext: (id: '2d') => { setTransform: (a: number, b: number, c: number, d: number, e: number, f: number) => void } | null
}

/**
 * 让全屏 canvas 的像素缓冲等于「CSS 尺寸 × 设备像素比」，同时把坐标系缩放回 CSS 像素，
 * 调用方按视口的 CSS 像素绘图即可。
 * 设备像素比封顶为 maxDpr：背景动效不需要在高分屏上成倍增加像素量。返回实际采用的倍数。
 */
export function fitCanvas(
  canvas: CanvasLike,
  viewport: { width: number, height: number, dpr: number },
  maxDpr = 2,
): number {
  const ratio = Math.min(Math.max(viewport.dpr || 1, 1), maxDpr)
  canvas.style.width = `${viewport.width}px`
  canvas.style.height = `${viewport.height}px`
  canvas.width = Math.round(viewport.width * ratio)
  canvas.height = Math.round(viewport.height * ratio)
  canvas.getContext('2d')?.setTransform(ratio, 0, 0, ratio, 0, 0)
  return ratio
}

/** 系统是否开启了「减少动态效果」 */
export function prefersReducedMotion(): boolean {
  return typeof window !== 'undefined' && !!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
}
