import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
  modules: ['@nuxt/content', '@nuxtjs/color-mode', '@nuxt/eslint'],

  components: [{ path: '~/components', pathPrefix: false }],

  app: {
    head: {
      htmlAttrs: { lang: 'zh-CN' },
      meta: [
        { name: 'description', content: 'renpingping 的个人博客与作品展示' },
        { name: 'author', content: 'renpingping' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      ],
      link: [{ rel: 'icon', type: 'image/png', href: '/favicon.png' }],
    },
  },
  css: ['~/assets/css/main.css', '~/assets/css/daily-card.css'],

  colorMode: {
    classSuffix: '',
    preference: 'system',
    fallback: 'light',
  },

  content: {
    build: {
      markdown: {
        highlight: {
          theme: {
            default: 'github-light',
            dark: 'github-dark',
          },
          langs: ['bash', 'sh', 'json', 'js', 'ts', 'html', 'css', 'vue', 'md', 'yaml', 'diff'],
        },
      },
    },
    // 用 Node 内置的 node:sqlite 读写内容数据库（需 Node ≥ 22.5），不再依赖需要编译的 better-sqlite3
    experimental: {
      sqliteConnector: 'native',
    },
  },
  compatibilityDate: '2026-11-01',

  nitro: {
    prerender: {
      crawlLinks: true,
      routes: ['/'],
      failOnError: true,
      ignore: ['/ZONE'],
    },
  },

  vite: {
    plugins: [tailwindcss()],
  },
  // stylistic: true 启用 ESLint Stylistic，统一缩进、引号、分号等格式；项目不另装 Prettier
  eslint: {
    config: {
      stylistic: true,
    },
  },
})
