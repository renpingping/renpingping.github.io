/**
 * WCAG 对比度计算。测试用它直接读取样式文件里的颜色值做校验，保证小字文字达到 AA（4.5:1）。
 */

/** 相对亮度，白色为 1、黑色为 0。支持 #rgb 与 #rrggbb */
export function luminance(hex: string): number {
  const value = hex.replace('#', '')
  const full = value.length === 3 ? [...value].map(char => char + char).join('') : value
  const [r, g, b] = [0, 2, 4].map(offset => Number.parseInt(full.slice(offset, offset + 2), 16) / 255)
  const linear = (channel: number) =>
    channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4
  return 0.2126 * linear(r!) + 0.7152 * linear(g!) + 0.0722 * linear(b!)
}

/** WCAG 对比度：黑底白字为 21，同色为 1，与两个参数的顺序无关 */
export function contrastRatio(first: string, second: string): number {
  const a = luminance(first)
  const b = luminance(second)
  return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05)
}
