import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'
import { contrastRatio, luminance } from '~/utils/contrast'

const read = (path: string) => readFileSync(resolve(import.meta.dirname, '../..', path), 'utf8')

// Tailwind 的 zinc 色阶与站点用到的背景色
const ZINC: Record<string, string> = {
  50: '#fafafa',
  100: '#f4f4f5',
  200: '#e4e4e7',
  300: '#d4d4d8',
  400: '#a1a1aa',
  500: '#71717a',
  600: '#52525b',
  700: '#3f3f46',
  800: '#27272a',
  900: '#18181b',
  950: '#09090b',
}
const WHITE = '#ffffff'

/** 把样式里的颜色解析成十六进制：直接写的原样返回，var(--…) 引用去 @theme 或 zinc 色阶里查 */
function resolveColor(value: string): string | undefined {
  if (value.startsWith('#'))
    return value
  const token = value.match(/^var\(--([\w-]+)\)$/)?.[1]
  if (!token)
    return undefined
  if (token.startsWith('color-zinc-'))
    return ZINC[token.replace('color-zinc-', '')]
  const theme = read('app/assets/css/main.css')
  return theme.match(new RegExp(`${token}:\\s*(#[0-9a-fA-F]{3,6})`))?.[1]
}

/** WCAG AA 对普通字号正文的要求 */
const AA_NORMAL_TEXT = 4.5

describe('contrastRatio', () => {
  it('黑底白字是 21，同色是 1，与前后顺序无关', () => {
    expect(contrastRatio('#000000', '#ffffff')).toBeCloseTo(21, 1)
    expect(contrastRatio('#ffffff', '#000000')).toBeCloseTo(21, 1)
    expect(contrastRatio('#ffffff', '#ffffff')).toBe(1)
  })

  it('#767676 配白底是众所周知的 4.54:1（刚好过 AA）', () => {
    expect(contrastRatio('#767676', '#ffffff')).toBeCloseTo(4.54, 2)
  })

  it('支持三位简写', () => {
    expect(contrastRatio('#000', '#fff')).toBeCloseTo(21, 1)
  })

  it('luminance：白色为 1，黑色为 0', () => {
    expect(luminance('#ffffff')).toBeCloseTo(1, 5)
    expect(luminance('#000000')).toBe(0)
  })
})

describe('小字元信息与说明文字', () => {
  const declaration = read('app/assets/css/main.css').match(/\.text-muted\s*\{([^}]*)\}/)?.[1] ?? ''

  /** 从 .text-muted 的声明里取出某个模式下用的 zinc 色阶 */
  const shadeUsed = (pattern: RegExp) => {
    const shade = declaration.match(pattern)?.[1]
    expect(shade, `.text-muted 需要用 ${pattern} 声明颜色`).toBeDefined()
    return ZINC[shade ?? '']!
  }

  it('浅色模式：对页面底色、卡片底色与代码块标题栏都达到 AA', () => {
    const light = shadeUsed(/(?<!dark:)text-zinc-(\d+)/)
    for (const [name, background] of [['页面', ZINC['50']!], ['卡片', WHITE], ['代码块标题栏', ZINC['100']!]])
      expect(contrastRatio(light, background), `对${name}底色`).toBeGreaterThanOrEqual(AA_NORMAL_TEXT)
  })

  it('暗色模式：对页面底色、卡片底色与代码块标题栏都达到 AA', () => {
    const dark = shadeUsed(/dark:text-zinc-(\d+)/)
    for (const [name, background] of [['页面', ZINC['950']!], ['卡片', ZINC['900']!], ['代码块标题栏', ZINC['800']!]])
      expect(contrastRatio(dark, background), `对${name}底色`).toBeGreaterThanOrEqual(AA_NORMAL_TEXT)
  })
})

describe('热读卡片里白字配彩色底', () => {
  const css = read('app/assets/css/daily-card.css')
  const declarationOf = (selector: string) =>
    css.match(new RegExp(`${selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s*\\{([^}]*)\\}`))?.[1] ?? ''
  const backgroundOf = (selector: string) => declarationOf(selector).match(/background:\s*([^;]+);/)?.[1]
  const colorOf = (selector: string) => declarationOf(selector).match(/(?:^|\n)\s*color:\s*([^;]+);/)?.[1]

  // 来源标签与「热门」评分都是 11–13px 的小字，白字必须达到 AA
  for (const selector of ['.chip-hn', '.chip-juejin', '.chip-qbitai', '.chip-bili', '.chip-other', '.daily-score.hot'])
    it(`${selector} 的底色配白字达到 AA`, () => {
      const background = backgroundOf(selector)
      expect(background, `${selector} 需要声明底色`).toBeDefined()
      expect(contrastRatio(WHITE, resolveColor(background!)!), selector).toBeGreaterThanOrEqual(AA_NORMAL_TEXT)
    })

  it('「热门」评分在暗色模式下也用达标的底色', () => {
    const dark = backgroundOf('html.dark .daily-score.hot')
    expect(dark, '需要为暗色模式单独声明，否则会被普通评分的暗色规则盖住').toBeDefined()
    expect(contrastRatio(WHITE, resolveColor(dark!)!)).toBeGreaterThanOrEqual(AA_NORMAL_TEXT)
  })

  it('普通评分的文字，在两种模式下都达到 AA', () => {
    for (const [name, selector] of [['浅色', '.daily-score'], ['暗色', 'html.dark .daily-score']]) {
      const color = resolveColor(colorOf(selector)!)
      const background = resolveColor(backgroundOf(selector)!)
      expect(color, name).toBeDefined()
      expect(background, name).toBeDefined()
      expect(contrastRatio(color!, background!), name).toBeGreaterThanOrEqual(AA_NORMAL_TEXT)
    }
  })
})
