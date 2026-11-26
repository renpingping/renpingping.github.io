/**
 * 站点的全局信息。应用代码、服务端路由与 nuxt.config.ts 共用这一份，避免同一个值写在三处。
 * 应用与服务端代码用 `#shared/site` 引入；nuxt.config.ts 用相对路径引入。
 */
export const SITE = {
  /** 线上地址，不带尾斜杠 */
  url: 'https://renpingping.github.io',
  name: 'ther',
  author: 'renpingping',
  description: 'renpingping 的个人博客与作品展示',
  language: 'zh-CN',
} as const
