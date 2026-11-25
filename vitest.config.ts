import { resolve } from 'node:path'
import { defineConfig } from 'vitest/config'

// 单元测试只跑纯逻辑（app/utils 与不依赖 Nuxt 运行时的 composable）；
// 需要构建产物的页面行为由 tests/e2e 下的 Playwright 用例覆盖。
export default defineConfig({
  resolve: {
    alias: {
      '~': resolve(import.meta.dirname, 'app'),
    },
  },
  test: {
    environment: 'node',
    include: ['tests/unit/**/*.test.ts'],
  },
})
