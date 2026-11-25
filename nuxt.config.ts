import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
  compatibilityDate: '2026-11-01',
  modules: ['@nuxt/content', '@nuxtjs/color-mode'],
  css: ['~/assets/css/main.css', '~/assets/css/daily-card.css'],

  components: [{ path: '~/components', pathPrefix: false }],

  vite: {
    plugins: [tailwindcss()],
  },

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

  nitro: {
    prerender: {
      crawlLinks: true,
      routes: ['/'],
      failOnError: true,
      ignore: ['/ZONE'],
    },
  },
})
