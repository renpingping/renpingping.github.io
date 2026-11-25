import { devices, defineConfig } from '@playwright/test'

const PORT = 4173
const baseURL = `http://localhost:${PORT}`

export default defineConfig({
  testDir: 'tests/e2e',
  fullyParallel: false,
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI ? [['github'], ['html', { open: 'never' }]] : 'list',
  use: {
    baseURL,
    trace: 'retain-on-failure',
    expect: { timeout: 10_000 },
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],

  // 每次都先重新生成静态产物，保证测的是当前代码；serve 提供与 GitHub Pages 一致的目录式 URL。
  // 本地若已有服务占用该端口则直接复用，CI 上一定新起一个。
  webServer: {
    command: `npm run generate && npx serve -l ${PORT} -n .output/public`,
    url: `${baseURL}/`,
    reuseExistingServer: !process.env.CI,
    timeout: 180_000,
  },
})
