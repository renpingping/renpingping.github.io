/**
 * 内容校验规则。规则本身是纯函数；checkRepo 负责遍历仓库内容并套用规则。
 * 命令行入口见 scripts/check-content.mjs，测试见 tests/unit/content-rules.test.ts。
 */
import { existsSync, readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { parse } from 'yaml'
import { sections } from '../../app/config/sections.ts'

/** 数据类集合（YAML），其余含 Markdown 的一级目录都是文章类板块 */
export const DATA_KINDS = ['projects', 'gallery', 'collections']

/**
 * 文章机器人历史上把导语硬截成 78 个字（现为按句读截断，结果最多 77 个字）。
 * 恰好 78 个字且没有句末标点的描述，多半就是被硬截的。
 */
const HARD_TRUNCATION_LENGTH = 78
const TERMINAL_PUNCTUATION = /[。！？；;…．.!?）)”」』]$/

const isFilledString = value => typeof value === 'string' && value.trim() !== ''
const isPlainObject = value => typeof value === 'object' && value !== null && !Array.isArray(value)

function isIsoDate(value) {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value))
    return false
  const time = Date.parse(value)
  return !Number.isNaN(time) && new Date(time).toISOString().startsWith(value)
}

function isHttpUrl(value) {
  try {
    const { protocol } = new URL(String(value))
    return protocol === 'http:' || protocol === 'https:'
  }
  catch {
    return false
  }
}

/** 拆出 frontmatter（YAML）与正文；文件不是以 frontmatter 开头时返回 null */
export function parseFrontmatter(text) {
  const match = text.match(/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)([\s\S]*)$/)
  if (!match)
    return null
  try {
    const data = parse(match[1])
    return { data: isPlainObject(data) ? data : {}, body: match[2], error: undefined }
  }
  catch (error) {
    return { data: {}, body: '', error: `frontmatter 无法解析：${error.message}` }
  }
}

/** 解析正文里每个 `::daily-card` 块的属性；解析失败的卡片带 __error 字段 */
export function parseCards(body) {
  const cards = []
  for (const match of body.matchAll(/^::daily-card\r?\n---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/gm)) {
    try {
      cards.push(parse(match[1]))
    }
    catch (error) {
      cards.push({ __error: error.message })
    }
  }
  return cards
}

function checkDate(date, errors) {
  if (!isIsoDate(date))
    errors.push(`date「${String(date)}」不是有效的 YYYY-MM-DD 日期`)
}

function checkAsset(path, field, errors, assetExists) {
  if (path !== undefined && !assetExists(path))
    errors.push(`${field}「${String(path)}」在 public/ 下不存在`)
}

/**
 * 校验一篇 Markdown 文章。
 * @param {{ slug: string, text: string, coverExists: (path: string) => boolean }} post
 */
export function checkPost({ slug, text, coverExists }) {
  const errors = []
  const warnings = []

  const parsed = parseFrontmatter(text)
  if (!parsed)
    return { errors: ['缺少 frontmatter'], warnings }
  if (parsed.error)
    errors.push(parsed.error)

  const data = parsed.data
  if (!isFilledString(data.title))
    errors.push('缺少必填字段 title')
  if (data.date === undefined)
    errors.push('缺少必填字段 date')
  else
    checkDate(data.date, errors)
  if (!Array.isArray(data.tags))
    errors.push('缺少必填字段 tags')

  // 文件名里带日期的（如 day_2026-11-25 或周报的 2026-11-20），必须与 frontmatter 的日期一致
  const slugDate = slug.match(/^(?:day_)?(\d{4}-\d{2}-\d{2})$/)?.[1]
  if (slugDate && typeof data.date === 'string' && data.date !== slugDate)
    errors.push(`文件名里的日期 ${slugDate} 与 date「${data.date}」不一致`)

  checkAsset(data.cover, 'cover', errors, coverExists)

  if (isFilledString(data.description)
    && data.description.length === HARD_TRUNCATION_LENGTH
    && !TERMINAL_PUNCTUATION.test(data.description.trim())) {
    warnings.push(`description 恰好 ${HARD_TRUNCATION_LENGTH} 个字且没有句末标点，可能是在句子中间被硬截的`)
  }

  parseCards(parsed.body).forEach((card, index) => {
    const label = `第 ${index + 1} 张卡片`
    if (card.__error) {
      errors.push(`${label}的属性无法解析：${card.__error}`)
      return
    }
    if (!isFilledString(card.title))
      errors.push(`${label}缺少 title`)
    if (card.url === undefined)
      errors.push(`${label}缺少 url`)
    else if (!isHttpUrl(card.url))
      errors.push(`${label}的 url「${String(card.url)}」不是 http(s) 链接`)
  })

  return { errors, warnings }
}

/**
 * 校验一条数据集合记录（projects / gallery / collections 的一个 YAML 文件）。
 * @param {'projects' | 'gallery' | 'collections'} kind
 */
export function checkData(kind, item, { assetExists }) {
  const errors = []
  const warnings = []
  const data = isPlainObject(item) ? item : {}

  if (!isFilledString(data.title))
    errors.push('缺少必填字段 title')
  checkDate(data.date, errors)

  if (kind === 'projects') {
    if (!isFilledString(data.description))
      errors.push('缺少必填字段 description')
    for (const field of ['link', 'repo']) {
      if (data[field] === undefined)
        continue
      const value = String(data[field])
      const valid = field === 'link' ? value.startsWith('/') || isHttpUrl(value) : isHttpUrl(value)
      if (!valid)
        errors.push(`${field}「${value}」${field === 'link' ? '既不是站内路径也不是' : '不是'} http(s) 链接`)
    }
    checkAsset(data.cover, 'cover', errors, assetExists)
  }
  else if (kind === 'gallery') {
    if (!Array.isArray(data.images) || data.images.length === 0) {
      errors.push('images 不能为空')
    }
    else {
      data.images.forEach((image, index) => {
        const src = isPlainObject(image) ? image.src : undefined
        if (src === undefined)
          errors.push(`第 ${index + 1} 张图片缺少 src`)
        else
          checkAsset(src, `第 ${index + 1} 张图片`, errors, assetExists)
      })
    }
    checkAsset(data.cover, 'cover', errors, assetExists)
  }
  else if (!isHttpUrl(data.url)) {
    errors.push(`url「${String(data.url)}」不是 http(s) 链接`)
  }

  return { errors, warnings }
}

/**
 * 遍历仓库的 content/ 目录并校验全部内容。
 * @returns {{ errors: string[], warnings: string[], posts: number, dataFiles: number }}
 */
export function checkRepo(root) {
  const contentDir = join(root, 'content')
  const publicDir = join(root, 'public')
  const assetExists = path => typeof path === 'string' && path.startsWith('/') && existsSync(join(publicDir, path))

  const sectionKeys = new Set(sections.map(section => section.key))
  const errors = []
  const warnings = []
  let posts = 0
  let dataFiles = 0

  for (const entry of readdirSync(contentDir, { withFileTypes: true })) {
    if (!entry.isDirectory())
      continue
    const dir = join(contentDir, entry.name)
    const files = readdirSync(dir)
    const markdown = files.filter(file => file.endsWith('.md'))

    if (markdown.length > 0 && !sectionKeys.has(entry.name))
      errors.push(`${entry.name}/：不是已注册的板块目录（注册表见 app/config/sections.ts）`)

    for (const file of markdown) {
      posts += 1
      const result = checkPost({
        slug: file.slice(0, -3),
        text: readFileSync(join(dir, file), 'utf8'),
        coverExists: assetExists,
      })
      for (const message of result.errors)
        errors.push(`${entry.name}/${file}：${message}`)
      for (const message of result.warnings)
        warnings.push(`${entry.name}/${file}：${message}`)
    }

    for (const file of files.filter(name => name.endsWith('.yml'))) {
      if (!DATA_KINDS.includes(entry.name)) {
        errors.push(`${entry.name}/${file}：不是已注册的数据集合目录`)
        continue
      }
      dataFiles += 1
      let item
      try {
        item = parse(readFileSync(join(dir, file), 'utf8'))
      }
      catch (error) {
        errors.push(`${entry.name}/${file}：YAML 无法解析（${error.message}）`)
        continue
      }
      for (const message of checkData(entry.name, item, { assetExists }).errors)
        errors.push(`${entry.name}/${file}：${message}`)
    }
  }

  return { errors, warnings, posts, dataFiles }
}
