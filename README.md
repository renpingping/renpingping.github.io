# ther-blog

个人博客与作品展示站：文章、Demo、画廊、收藏一体化，由 Nuxt 4 + Nuxt Content v3 驱动，静态生成后部署在 GitHub Pages。

- **线上地址**：<https://renpingping.github.io/>
- **源码仓库**：<https://github.com/renpingping/renpingping.github.io/tree/source>（`source` 分支为开发分支，`master` 分支为构建产物）
- **部署方式**：推送 `source` 分支 → GitHub Actions 自动 `nuxt generate` → 发布到 `master` 分支 → GitHub Pages 生效

## 技术栈

| 类别 | 选型 |
| --- | --- |
| 框架 | Nuxt 4（静态生成 `nuxt generate`） |
| 内容层 | Nuxt Content v3（Markdown + YAML collections） |
| 样式 | Tailwind CSS v4（CSS-first，`@theme` / `@custom-variant`） |
| 主题 | `@nuxtjs/color-mode`（亮 / 暗 / 跟随系统，`html.dark`） |
| 代码高亮 | Shiki 双主题（github-light / github-dark） |
| 背景动效 | 原生 Canvas 分支生长（全站）+ p5i 噪声流场（文章详情页），均移植自 [antfu/100](https://github.com/antfu/100) |

## 快速开始

```bash
npm install          # 安装依赖（postinstall 会自动 nuxt prepare）
npm run dev          # 本地开发，默认 http://localhost:3000
npm run generate     # 静态生成到 .output/public（dist 为其软链）
npm run build        # SSR 构建
npm run preview      # 预览构建产物（nitro server）
```

> 需要 Node.js ≥ 22（与 CI 保持一致）。
>
> 本地想预览「Pages 上真实部署的效果」，推荐生成后用任意静态服务器预览产物：
>
> ```bash
> npm run generate && npx serve dist
> ```

## 实际访问地址

### 线上（GitHub Pages）

| 页面 | 地址 |
| --- | --- |
| 首页 | <https://renpingping.github.io/> |
| 文章列表 | <https://renpingping.github.io/blog> |
| 文章详情（示例：每日技术热读） | <https://renpingping.github.io/blog/day_2026-11-16> |
| Demo 列表 | <https://renpingping.github.io/projects> |
| 画廊 | <https://renpingping.github.io/gallery> |
| 相册：站点横幅图集 | <https://renpingping.github.io/gallery/banners> |
| 相册：特色图库 | <https://renpingping.github.io/gallery/featureimages> |
| 收藏 | <https://renpingping.github.io/collections> |
| 标签 | <https://renpingping.github.io/tags> |
| 标签页（示例：技术热读） | <https://renpingping.github.io/tags/技术热读> |
| 关于 | <https://renpingping.github.io/about> |

#### 站内 Demo（Vue 实现）

| Demo | 地址 |
| --- | --- |
| 记忆翻牌小游戏（Vue 3 组合式 API） | <https://renpingping.github.io/demos/interactive-cards> |

#### 静态演示页（`public/ZONE`，早期作品，构建时原样拷贝）

| 演示 | 地址 |
| --- | --- |
| 大数据可视化大屏 | <https://renpingping.github.io/ZONE/bigdataNetwork3_demo/> |
| 大屏系统登录页 | <https://renpingping.github.io/ZONE/bigdatalogin/> |
| 前端试验田 | <https://renpingping.github.io/ZONE/testHTML/> |

### 本地开发

开发服务器（`npm run dev`）把上面的域名换成 `http://localhost:3000` 即可，例如：

- 首页：<http://localhost:3000/>
- 文章详情：<http://localhost:3000/blog/day_2026-11-16>
- 记忆翻牌：<http://localhost:3000/demos/interactive-cards>
- 大屏演示：<http://localhost:3000/ZONE/bigdataNetwork3_demo/>

## 目录结构

```text
ther-blog/
├── app/                        # 应用代码（Nuxt 4 srcDir）
│   ├── app.config.ts           # 站点配置：名称、作者、仓库、社交链接
│   ├── app.vue                 # 根组件（titleTemplate 在此定义）
│   ├── error.vue               # 404 / 错误页
│   ├── layouts/default.vue     # 全站布局（按路由切换背景动效）
│   ├── pages/                  # 文件路由
│   │   ├── index.vue           # 首页：最新文章 + 精选项目 + 最近收藏
│   │   ├── blog/               # 文章列表 / [slug] 详情（含目录、上下篇）
│   │   ├── projects/           # Demo 列表
│   │   ├── gallery/            # 画廊列表 / [album] 相册（灯箱）
│   │   ├── collections/        # 收藏列表（标签筛选）
│   │   ├── tags/               # 标签云 / [tag] 标签下的文章
│   │   └── demos/              # 站内 Vue Demo（记忆翻牌）
│   ├── components/
│   │   ├── blog/ gallery/ projects/ collections/   # 领域卡片组件
│   │   ├── ui/                 # 头部、底部、主题切换、回到顶部、背景动效等
│   │   ├── content/ProsePre.vue                    # 代码块（带复制按钮）
│   │   └── DailyCard.vue       # 每日技术热读 MDC 卡片（md 中 ::daily-card 使用）
│   ├── composables/            # useFormatDate / useTagFilter
│   └── assets/css/             # main.css（Tailwind + 排版）/ daily-card.css
├── content/                    # 内容源（见下节）
├── content.config.ts           # collections 与 frontmatter schema 定义
├── nuxt.config.ts              # 模块、高亮、SEO、预渲染配置
├── public/                     # 原样拷贝的静态资源（图片、字体、ZONE 演示）
└── .github/workflows/deploy.yml# 构建部署流水线
```

## 内容管理

内容全部放在 `content/` 下，schema 定义在 `content.config.ts`，修改后无需改代码。

### 新增文章 `content/blog/*.md`

```markdown
---
title: 文章标题
description: 摘要（列表页与 meta description 使用）
date: 2026-11-16
tags: [Nuxt, Vue]
cover: /images/featureimages/0.jpg
---

正文（Markdown）...
```

- 文件名即路由 slug：`day_2026-11-16.md` → `/blog/day_2026-11-16`
- `cover` 留空则列表页不渲染封面图
- 文章正文里可用 MDC 组件卡片，例如每日技术热读：

  ```markdown
  ::daily-card
  ---
  title: "1. 条目标题"
  url: "https://example.com"
  chip: "Hacker News"      # 配合 chipClass: chip-hn / chip-juejin / chip-qbitai / chip-bili / chip-other
  metric: "339 赞 · 113 评论"
  score: "95"
  hot: true
  ---
  一句话摘要
  ::
  ```

- 带「技术热读」标签的文章详情页会自动隐藏侧栏目录并拉宽正文列。

### 新增 Demo `content/projects/*.yml`

```yaml
title: 项目名
description: 一句话介绍
tech: [Vue 3, TypeScript]
link: /demos/xxx        # 站内页面写相对路径；外链写完整 http(s)
repo: https://github.com/...   # 可选
cover: /images/demos/xxx.jpg   # 可选
date: "2026-11-16"
featured: false         # true 时首页「精选项目」展示
```

### 新增相册 `content/gallery/*.yml`

```yaml
title: 相册名
description: 相册介绍        # 可选
cover: /images/banner/12.jpg
date: "2026-11-18"
images:
  - src: /images/banner/12.jpg
    alt: 横幅 12            # 可选
```

文件名即相册 slug：`banners.yml` → `/gallery/banners`。

### 新增收藏 `content/collections/*.yml`

```yaml
title: 标题
url: https://example.com
source: example.com         # 可选，来源站点
tags: [前端, 工具]
note: 一句话推荐语           # 可选
date: "2026-11-18"
```

## 主题与样式约定

- 全站正文字体为自制手写字体 **MyHand**（`public/fonts/MyHand-Regular.woff2` 自托管，`@theme` 中回退到 PingFang SC 等系统中文字体）。
- 暗色模式基于 `html.dark` 类；Tailwind v4 通过 `@custom-variant dark` 适配，代码高亮通过 `html.dark .shiki` 切换 Shiki 双主题变量。
- 正文排版集中在 `app/assets/css/main.css` 的 `.prose-ther`；每日热读卡片样式在 `daily-card.css`。
- 全站背景为 Canvas「分支生长」（进入页面播放一次），文章详情页切换为 p5i「噪声流场」，见 `app/components/ui/`。

## 部署

`.github/workflows/deploy.yml`：

1. 监听 `source` 分支 push（或手动触发 `workflow_dispatch`）；
2. `npm ci` + `npm run generate` 静态化全站（从 `/` 开始爬取链接预渲染，忽略 `/ZONE`）；
3. 产物写入 `.output/public` 并加 `.nojekyll`；
4. 通过 peaceiris/actions-gh-pages 推送到 `master` 分支，GitHub Pages 自动发布。

本地提交只需推 `source` 分支：`git push origin source`。

## 已知约定

- `dist` 是指向 `.output/public` 的软链接，便于本地静态预览，已被 `.gitignore` 忽略。
- `public/ZONE` 内是 2016 年前后的早期静态作品（jQuery 时代），保留用于展示，不参与预渲染爬取。
- 旧 Hexo 博客的外链已随文章迁移处理；若后续需要重定向旧地址，可在 `app/error.vue` 中按路径映射。
