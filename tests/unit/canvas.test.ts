import { describe, expect, it } from 'vitest'
import { fitCanvas } from '~/utils/canvas'

interface Context {
  setTransform: (a: number, b: number, c: number, d: number, e: number, f: number) => void
}

function fakeCanvas() {
  const calls: number[][] = []
  const context: Context = {
    setTransform: (...args) => {
      calls.push(args)
    },
  }
  const canvas = {
    width: 0,
    height: 0,
    style: { width: '', height: '' } as Record<string, string>,
    getContext: () => context,
  }
  return { canvas, calls }
}

const viewport = { width: 1440, height: 900 }

describe('fitCanvas', () => {
  it('像素缓冲按设备像素比放大，样式尺寸保持 CSS 像素，绘图坐标仍以 CSS 像素为单位', () => {
    const { canvas, calls } = fakeCanvas()
    expect(fitCanvas(canvas, { ...viewport, dpr: 2 })).toBe(2)
    expect(canvas.width).toBe(2880)
    expect(canvas.height).toBe(1800)
    expect(canvas.style.width).toBe('1440px')
    expect(canvas.style.height).toBe('900px')
    expect(calls).toEqual([[2, 0, 0, 2, 0, 0]])
  })

  it('设备像素比封顶为 2，高分屏不至于让像素缓冲过大', () => {
    const { canvas, calls } = fakeCanvas()
    expect(fitCanvas(canvas, { ...viewport, dpr: 3 }, 2)).toBe(2)
    expect(canvas.width).toBe(2880)
    expect(calls[0]?.[0]).toBe(2)
  })

  it('设备像素比是小数时按实际倍数处理', () => {
    const { canvas } = fakeCanvas()
    expect(fitCanvas(canvas, { ...viewport, dpr: 1.5 })).toBe(1.5)
    expect(canvas.width).toBe(2160)
    expect(canvas.height).toBe(1350)
  })

  it('设备像素比为 0 或不合法时按 1 处理', () => {
    for (const dpr of [0, Number.NaN]) {
      const { canvas, calls } = fakeCanvas()
      expect(fitCanvas(canvas, { ...viewport, dpr })).toBe(1)
      expect(canvas.width).toBe(1440)
      expect(calls[0]?.[0]).toBe(1)
    }
  })
})
