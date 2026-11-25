import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'
import { checkRepo } from '../../scripts/lib/content-rules.mjs'

/**
 * 回归样本：仓库里现有的全部内容必须零错误。
 * 校验规则由人工编写，机器人每天自动产出文章——这条测试保证规则不会误伤它的正常产出。
 */
describe('仓库现有内容', () => {
  const result = checkRepo(resolve(import.meta.dirname, '../..'))

  it('至少检查到了文章与数据文件', () => {
    expect(result.posts).toBeGreaterThan(0)
    expect(result.dataFiles).toBeGreaterThan(0)
  })

  it('全部通过校验，没有错误', () => {
    expect(result.errors).toEqual([])
  })
})
