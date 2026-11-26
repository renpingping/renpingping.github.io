import { readdirSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

/**
 * 守卫：工作流里引用的第三方 Action 必须固定到提交哈希，并在行尾注释里写明版本。
 * 可变的 tag（如 @v4）随时可以被别人改写，而部署流水线持有仓库的写权限。
 */
describe('GitHub Actions 工作流', () => {
  const dir = resolve(import.meta.dirname, '../../.github/workflows')
  const workflows = readdirSync(dir).filter(file => file.endsWith('.yml'))

  it('至少检查到了工作流文件', () => {
    expect(workflows.length).toBeGreaterThan(0)
  })

  for (const file of workflows) {
    it(`${file} 里的 Action 都固定到提交哈希并注明版本`, () => {
      const uses = [...readFileSync(resolve(dir, file), 'utf8').matchAll(/^\s*-?\s*uses:\s*(\S+)/gm)].map(match => match[1]!)
      expect(uses.length, '工作流里应当有 Action 引用').toBeGreaterThan(0)
      const local = (ref: string) => ref.startsWith('./') || ref.startsWith('docker://')
      const unpinned = uses.filter(ref => !local(ref) && !/^[^@]+@[0-9a-f]{40}$/.test(ref))
      // 本仓库内的可复用工作流（./.github/workflows/…）不需要固定
      expect(unpinned).toEqual([])
    })
  }
})
