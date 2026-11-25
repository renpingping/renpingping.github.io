// @ts-check
import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt(
  // 放在最前面：被忽略的目录不参与 lint 与格式化
  {
    ignores: [
      'public/**', // 原样发布的静态资源（含 ZONE 早期作品里的旧版第三方库）
      'content/**', // 文章里的 MDC 由 Nuxt Content 解析，不是可 lint 的源码
      '.nuxt/**',
      '.output/**',
      '.worktrees/**',
      'dist/**',
      'test-results/**',
      'playwright-report/**',
      '.superpowers/**',
    ],
  },
  {
    rules: {
      // 属性按官方风格指南换行（vue/max-attributes-per-line 保持默认），
      // 但不强制把 <h2>标题</h2> 这类短元素的内容拆成三行，避免模板被无谓地拉长
      'vue/singleline-html-element-content-newline': 'off',
      'vue/multiline-html-element-content-newline': 'off',
      // 只有确有需要的键才加引号（如 'update:index'），不要求同一对象里的其它键跟着加引号
      '@stylistic/quote-props': ['error', 'as-needed'],
    },
  },
)
