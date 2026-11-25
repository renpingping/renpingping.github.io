#!/usr/bin/env node
// 内容校验：文章与数据文件的结构、引用的图片是否存在、链接是否合法。有错误时退出码为 1。
// 规则在 ./lib/content-rules.mjs。
import { fileURLToPath } from 'node:url'
import { checkRepo } from './lib/content-rules.mjs'

const result = checkRepo(fileURLToPath(new URL('..', import.meta.url)))
console.log(`内容校验：${result.posts} 篇文章、${result.dataFiles} 个数据文件，${result.errors.length} 个错误，${result.warnings.length} 个提醒`)

for (const message of result.errors)
  console.error(`  错误  ${message}`)
for (const message of result.warnings)
  console.warn(`  提醒  ${message}`)

process.exit(result.errors.length > 0 ? 1 : 0)
