# ther-blog

个人博客与作品展示站：文章、周报、Demo、画廊、收藏一体化，由 Nuxt 4 + Nuxt Content v3 驱动，静态生成后部署在 GitHub Pages。

- **线上地址**：<https://renpingping.github.io/>
- **源码仓库**：<https://github.com/renpingping/renpingping.github.io>（`source` 为默认分支与开发分支，`master` 是构建产物）
- **部署方式**：推送或合并到 `source` → GitHub Actions 先跑全部检查 → 通过后 `nuxt generate` → 发布到 `master` → GitHub Pages 生效

本 README 说明项目是什么、怎么跑、怎么改。协作流程见 [CONTRIBUTING.md](CONTRIBUTING.md)，关键取舍的来龙去脉见 [docs/decisions.md](docs/decisions.md)。

## 快速开始

需要 Node.js 26（根目录的 `.nvmrc` 固定了主版本，CI 通过 `node-version-file` 读取同一个文件）。

```bash
nvm use            # 切到 .nvmrc 指定的 Node 版本（不使用 nvm 可跳过）
npm ci             # 安装依赖；postinstall 会生成 Nuxt 的类型
npm run dev        # 本地开发，默认 http://localhost:3000

npm run lint       # ESLint（含格式规则）；加 --fix 自动修复：npm run lint:fix
npm run typecheck  # vue-tsc 类型检查
npm test           # 单元测试 + 内容校验 + 依赖审计门禁
npm run test:e2e   # 端到端测试：先 nuxt generate，再在静态产物上跑 Playwright
npm run generate   # 静态生成到 .output/public（dist 是它的软链接）
```

提交前把 `lint`、`typecheck`、`test`、`test:e2e` 都跑一遍——这正是 PR 上 CI 会检查的内容。

`npm run build` / `npm run preview`（SSR 模式）是 Nuxt 自带的命令，本项目没有服务端运行时逻辑，线上只使用 `generate` 的静态产物。

## 项目结构

```text
ther-blog/
├── app/                          # 应用代码（Nuxt 4 的源码目录）
│   ├── app.config.ts             # 站点展示信息：标语、社交链接、关于页文案
│   ├── config/sections.ts        # 板块注册表：文章类内容的全部差异都在这里
│   ├── composables/
│   │   ├── usePosts.ts           #   文章取数：列表（数据层分页）、详情、上一篇/下一篇、首页、标签
│   │   ├── usePageSeo.ts         #   页面的标题、描述、canonical 与 Open Graph
│   │   ├── useTagFilter.ts       #   标签统计与筛选（响应式部分）
│   │   └── useCanvasSurface.ts   #   全屏背景画布的公共逻辑
│   ├── utils/                    # 纯函数：标签、日期、分页、链接类型、目录、对比度、噪声……
│   ├── types/post.ts             # 列表卡片需要的文章字段（POST_SUMMARY_FIELDS）
│   ├── pages/                    # 路由。文章类页面都是薄封装，逻辑在组件与 composable 里
│   │   ├── blog/ weekly/         #   <板块>/ 列表首页、page/[页码]、[slug] 详情
│   │   ├── tags/                 #   标签云、标签下的文章（?page= 分页）
│   │   └── …                     #   首页、Demo、画廊、收藏、关于、demos
│   ├── components/
│   │   ├── post/                 #   文章详情页、列表页、卡片网格、卡片、目录
│   │   ├── content/              #   Markdown 里用的组件：DailyCard（::daily-card）、代码块
│   │   ├── ui/                   #   页头、导航、页脚、分页、灯箱外的通用界面、两个背景动画
│   │   └── gallery/ projects/ collections/
│   └── assets/css/               # main.css（主题令牌、排版）、daily-card.css
├── content/                      # 内容源：blog/ weekly/ 是文章，projects/ gallery/ collections/ 是数据
├── content.config.ts             # 内容集合与 frontmatter 类型定义
├── shared/                       # 应用、服务端、nuxt.config 共用的代码：站点信息、地址与 XML 工具
├── server/routes/                # sitemap.xml、rss.xml（构建时预渲染成静态文件）
├── scripts/                      # 内容校验、依赖审计门禁
├── tests/
│   ├── unit/                     # vitest：纯函数、校验规则，以及对仓库自身的守卫
│   └── e2e/                      # Playwright：跑在 nuxt generate 的静态产物上
├── public/                       # 原样发布的静态资源（图片、字体、robots.txt、ZONE 早期作品）
├── .github/workflows/            # ci.yml（检查）、deploy.yml（先复用 ci.yml，再部署）
└── audit-allowlist.json          # 依赖审计的放行名单（每条都有理由与到期日）
```

## 架构说明

**内容 → 页面。** 所有文章类内容放在同一个 `posts` 集合里，一级子目录名就是板块（`content/blog/a.md` → `/blog/a`）。板块之间的差异——标题、副标题、每页条数、是否进首页、是否显示上一篇/下一篇、是否拉宽正文——全部描述在 `app/config/sections.ts`。导航、首页信息流、标签页、详情页版式、页面背景都由这份注册表驱动。

**页面很薄。** 页面文件只做三件事：取板块、取数据、交给共享组件。详情页是 `PostPage`，列表页是 `PostList`。页面通过 `definePageMeta({ background: 'flow' })` 声明自己用哪种背景。

**取数集中在 `usePosts`。** 列表在数据层分页（`skip` / `limit` 加总数），只取卡片需要的字段（不含正文）；`draft: true` 的文章在所有查询里都被排除。

**搜索引擎。** 每个页面用 `usePageSeo` 输出标题、描述、canonical 与 Open Graph；`/sitemap.xml` 与 `/rss.xml` 在构建时生成。站内地址一律带尾斜杠，与 GitHub Pages 实际提供的地址一致。

**两条要记住的 Nuxt 约定。** composable 里所有依赖 Nuxt 上下文的调用必须放在第一个 `await` 之前；服务端路由里查询内容要写成 `queryCollection(event, 'posts')`，并从 `@nuxt/content/server` 显式导入。

## 实际访问地址

### 线上（GitHub Pages）

| 页面 | 地址 |
| --- | --- |
| 首页 | <https://renpingping.github.io/> |
| 文章列表 | <https://renpingping.github.io/blog> |
| 文章详情（示例：每日技术热读） | <https://renpingping.github.io/blog/day_2026-11-16> |
| 周报列表 | <https://renpingping.github.io/weekly> |
| 周报详情（示例：GitHub AI 趋势周报） | <https://renpingping.github.io/weekly/2026-11-20> |
| Demo 列表 | <https://renpingping.github.io/projects> |
| 画廊 | <https://renpingping.github.io/gallery> |
| 相册：站点横幅图集 | <https://renpingping.github.io/gallery/banners> |
| 相册：特色图库 | <https://renpingping.github.io/gallery/featureimages> |
| 收藏 | <https://renpingping.github.io/collections> |
| 标签 | <https://renpingping.github.io/tags> |
| 标签页（示例：技术热读） | <https://renpingping.github.io/tags/技术热读> |
| 标签页（示例：GitHub周报） | <https://renpingping.github.io/tags/GitHub周报> |
| 关于 | <https://renpingping.github.io/about> |
| 站点地图 | <https://renpingping.github.io/sitemap.xml> |
| RSS 订阅 | <https://renpingping.github.io/rss.xml> |

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
- 周报详情：<http://localhost:3000/weekly/2026-11-20>
- 记忆翻牌：<http://localhost:3000/demos/interactive-cards>
- 大屏演示：<http://localhost:3000/ZONE/bigdataNetwork3_demo/>

## 内容管理

### 文章与周报 `content/<板块>/*.md`

两个板块共用同一套 frontmatter：

```markdown
---
title: 文章标题
description: 摘要。用于卡片与搜索结果，建议写成完整的句子，不超过 78 个字
date: 2026-11-16
tags: [Nuxt, Vue]
cover: /images/featureimages/0.jpg   # 可选；留空则不显示封面
draft: true                          # 可选；草稿不出现在任何列表里，直接访问也是 404
---

正文（Markdown）……
```

- 文件名即路由：`content/blog/day_2026-11-16.md` → `/blog/day_2026-11-16`。
- `date` 必须是 `YYYY-MM-DD`；文件名里带日期的（如 `day_2026-11-16`），必须与 `date` 一致。
- 列表每页 20 条，可在注册表里按板块调整；第 2 页起的地址是 `/<板块>/page/<页码>`。
- 正文里可以用卡片组件：

  ```markdown
  ::daily-card
  ---
  title: "1. 条目标题"
  url: "https://example.com"
  chip: "Hacker News"            # 可选，来源标签
  chipClass: "chip-hn"           # 配合 chip：chip-hn / chip-juejin / chip-qbitai / chip-bili / chip-other
  metric: "339 赞 · 113 评论"     # 可选
  score: "95"                    # 可选，推荐分
  hot: true                      # 可选；为 true 时显示为「热门」
  ---
  一句话摘要
  ::
  ```

  每日文章和周报都由仓库外的脚本自动生成（见 CONTRIBUTING 的「内容契约」一节）。

### 新增一个文章类板块（三步）

1. 在 `content/` 下建一个一级目录，放入 Markdown。
2. 在 `app/config/sections.ts` 加一条登记。
3. 照着 `app/pages/blog/` 建三个薄封装页面：`index.vue`、`page/[page].vue`、`[slug].vue`（把 `getSection('blog')` 换成新的 key）。

导航、标签页与站点地图会自动包含新板块；是否进入首页的「最新文章」由登记项里的 `homeFeed` 决定。

### 其它内容

- **Demo** `content/projects/*.yml`：`title`、`description`、`tech`、`link`（站内路径或完整网址）、`repo`、`cover`、`date`、`featured`（`true` 时进入首页「精选项目」）。
- **相册** `content/gallery/*.yml`：`title`、`description`、`cover`、`date`、`images`（`src` / `alt`）。文件名即相册 slug。
- **收藏** `content/collections/*.yml`：`title`、`url`、`source`、`tags`、`note`、`date`。

改完内容跑一下 `npm run check:content`：它会检查必填字段、日期格式、引用的图片是否存在、卡片链接是否合法。有错误时退出码为 1，所以它也在 `npm test` 和 CI 里。

## 质量保障

| 检查 | 命令 | 覆盖什么 |
| --- | --- | --- |
| 代码规范与格式 | `npm run lint` | ESLint + ESLint Stylistic，替代 Prettier |
| 类型 | `npm run typecheck` | vue-tsc；组件 props 直接用 Nuxt Content 生成的集合类型 |
| 单元测试 | `npm run test:unit` | 纯函数与校验规则；另有几条直接读取仓库文件的守卫（见下） |
| 内容校验 | `npm run check:content` | 全部内容文件的结构与引用 |
| 依赖审计 | `npm run audit` | 出现白名单之外的公告、或白名单条目到期时失败 |
| 端到端 | `npm run test:e2e` | 在 `nuxt generate` 的产物上走一遍主要页面与交互 |

**守卫测试**（`tests/unit/` 里直接读取仓库文件的几条）：

- `content-repo.test.ts`：仓库里现有的全部内容必须通过校验——保证校验规则不会误伤机器人的正常产出。
- `contrast.test.ts`：读取样式文件里的颜色，按 WCAG 公式校验小字文字的对比度不低于 4.5:1。
- `workflows.test.ts`：工作流里的第三方 Action 必须固定到提交哈希。

**依赖审计白名单。** `audit-allowlist.json` 里的每一条都要写明理由和到期日；到期后审计会重新失败，逼着人重新评估。目前只放行了一条（zod 的内存耗尽公告：只在构建期解析本地内容，上游没有修复版）。

**端到端测试写法上的两个要点。** 客户端交互之前要等水合完成（用例里的 `open()` 会等根容器上出现 `__vue_app__`）；断言滚动或动画之后的位置之前要先等状态停稳。

## 主题与样式

- 字体：全站使用自制手写字体 **MyHand**（`public/fonts/MyHand-Regular.woff2` 自托管，中文回退到系统中文字体）。
- 暗色模式基于 `html.dark` 类；代码高亮通过 `html.dark .shiki` 切换 Shiki 双主题。
- 颜色统一引用主题变量，不直接写十六进制值：
  - `.text-muted`：日期、数量、副标题、摘要等小字（浅色 `zinc-600`、暗色 `zinc-400`）。
  - `.card-surface`：卡片与面板的外壳。
  - `--color-chip-*`：热读卡片来源标签的品牌色（`@theme` 里定义，白字对比度不低于 4.8:1）。
- 背景动效是原生 Canvas 实现：全站「分支生长」，长文详情页「噪声流场」。系统开启「减少动态效果」时只呈现静止画面。画布的公共逻辑在 `useCanvasSurface`。
- 背景组件名与 `pathPrefix: false` 的组件命名方式**不要改**：Markdown 里的 `::daily-card` 标签依赖 `DailyCard` 这个组件名。

## 部署与发布

`.github/workflows/deploy.yml`：

1. 推送或合并到 `source` 时触发（也可手动触发）；
2. `validate` 任务复用 `ci.yml`：lint 与类型检查、单元测试、内容校验、依赖审计、构建与端到端测试、提交信息规范；
3. 全部通过后 `deploy` 任务执行 `nuxt generate`，发布到 `master`，GitHub Pages 自动更新；
4. 同一时刻只运行一个部署，新的推送会取消进行中的旧部署。

**PR 流程。** 从 `source` 拉分支开发，提 PR 到 `source`。PR 上会跑同一套检查。具体约定见 [CONTRIBUTING.md](CONTRIBUTING.md)。

**文章机器人。** 每日文章和周报由仓库外的脚本直接向 `source` 提交，它们产出的内容上线前唯一的一道检查就是上面的 `validate` 任务。发布失败时脚本会发 macOS 通知。

**部署失败了从哪里看。** 仓库的 Actions 页面 → 最近一次 "Build and Deploy" → 看是 `validate` 的哪一步：内容问题看「内容校验」的输出，依赖问题看「依赖审计」的输出，页面问题看端到端测试留下的报告（失败时作为附件上传）。

### 本地预览线上效果

静态产物用任意静态服务器预览即可，例如：

```bash
npm run generate && npx serve dist
```

## 已知约定与遗留

- `dist` 是指向 `.output/public` 的软链接，仅用于本地预览，已被 `.gitignore` 忽略。
- `public/ZONE` 内是早期静态作品（jQuery 时代），作为冻结归档保留用于展示：不参与预渲染爬取、不经过构建与 lint，也不会再更新。
  - `bigdataNetwork3_demo/`（大数据可视化大屏）：jQuery 1.8.3、jQuery 1.10.2（与 jQuery UI 打包在同一文件）
  - `bigdatalogin/`（大屏登录页）：jQuery 1.8.0
  - `testHTML/`（前端试验田）：无第三方库

  这些版本的 jQuery 存在公开已知漏洞（XSS、原型污染）。页面是纯展示、不处理用户输入，实际风险低；请不要在其中加入处理用户数据的逻辑，需要新做演示时写在 `app/pages/demos/` 下。
- GitHub Pages 会把不带尾斜杠的地址 301 到带尾斜杠的地址；canonical 与站点地图统一使用带尾斜杠的形式。
- **尚未处理的事项**（原因见 [docs/decisions.md](docs/decisions.md)）：
  - 部署仍走「推送到 `master` 分支」的方式，没有改为 GitHub Actions 直接发布产物；
  - 仓库没有 LICENSE 文件，许可证需要作者本人决定；
  - 标签页是一次取回全部文章摘要后在浏览器里分页，文章数量很大时需要改成数据层分页；
  - 浅色模式下顶部 logo 几乎看不见（logo 本身是浅色的）；
  - 仓库里目前没有带草稿标记的文章，也没有超过一页的板块，所以「草稿不可见」和「列表翻多页」这两个行为只在人工演练中验证过，常驻的端到端用例在数据不足时会跳过。
