# 贡献指南

面向在这个仓库里写代码或改内容的人（也包括替作者干活的自动化工具）。项目是什么、怎么跑见 [README.md](README.md)。

## 开发环境

```bash
nvm use
npm ci
npm run dev
```

**不要直接在文章机器人的主检出目录里切分支或留未提交的改动。** 两个机器人（每日文章、周报）直接在作者机器上的主检出目录（`/Users/renpingping/Code/ther-blog`）里执行 `git commit` 与 `git push origin source`，并且要求这个目录停在 `source` 分支上。需要并行工作时用独立的工作目录：

```bash
git -C <主检出目录> worktree add .worktrees/<名字> -b <分支名> origin/source
```

（`.worktrees/` 已被忽略；用完 `git worktree remove` 掉。）

## 分支与提交

- 从 `source` 拉分支，完成后提 PR 合回 `source`。不直接往 `source` 推送——唯一例外是文章机器人。
- 提交信息遵循 Conventional Commits：`type(scope): subject`。CI 会用 commitlint 检查 PR 里的每一个提交。
  - 常用类型：`feat`、`fix`、`docs`、`style`、`refactor`、`perf`、`test`、`build`、`ci`、`chore`、`revert`。
  - 内容改动用 `content(<板块>)`，例如 `content(blog): 修正被截断的描述`。
  - `post` 与 `weekly` 是机器人沿用的类型，保留给它们。
- 一个提交只做一件事。纯格式化与功能改动分开提交。
- 主题可以用中文；不强制大小写。

## PR 流程

1. PR 模板里有四项：改了什么、为什么改、怎么验证的、需要留意。按实际情况填写，验证那一栏不要不打勾就提交。
2. CI 会跑三个任务，全部通过才能合并：
   - **Lint 与类型检查**
   - **单元测试、依赖审计与端到端测试**（其中包含内容校验）
   - **提交信息规范**
3. 端到端测试失败时会附带一份报告（`playwright-report`），在运行详情页底部的 Artifacts 里下载。
4. 合并后不需要手动构建：合并到 `source` 会触发部署流水线，它先跑同一套检查再发布。仓库 Actions 页面里 "Build and Deploy" 变绿即已上线。

合并之后，本机的主检出目录会在下一次机器人运行时自动快进到最新的 `source`；也可以手动在主检出目录里执行 `git pull --ff-only`。

## 改动清单

改一处东西时，顺带检查这些地方有没有要跟着改：

| 改了什么 | 顺带检查 |
| --- | --- |
| 文章的 frontmatter 字段 | `content.config.ts` 的 schema、`scripts/lib/content-rules.mjs` 的校验规则、`tests/e2e/site.spec.ts` 里读取 frontmatter 的 `readPosts()`、README 的内容管理一节 |
| 板块的行为 | 只改 `app/config/sections.ts`；导航、首页、标签页、详情页版式会自动跟随 |
| 新增板块 | 见 README「新增一个文章类板块」；端到端用例里的导航项列表要加上新的入口 |
| 页面的标题或描述 | 用 `usePageSeo`，不要直接写 `useHead`，否则会漏掉 canonical 与 Open Graph |
| 颜色 | 引用主题变量；新增的小字颜色组合加进 `tests/unit/contrast.test.ts` |
| 工作流里的 Action | 固定到提交哈希并在行尾注明版本；`tests/unit/workflows.test.ts` 会检查 |
| 依赖公告需要放行 | 在 `audit-allowlist.json` 里加一条，写明理由与到期日 |

## Nuxt 使用上的两个坑

这两处都实际出过问题，写在这里免得再踩：

- **composable 里，依赖 Nuxt 上下文的调用必须放在第一个 `await` 之前。** 普通 `async` 函数一旦 `await`，当前实例的上下文就没了（运行时报 `NUXT_E1001`）。只有页面的 `<script setup>` 会在每个 `await` 后自动恢复。需要先发请求再等待时，把两个 `useAsyncData` 都先同步调用，再一起 `await`。
- **服务端路由里查询内容要传请求事件**：`queryCollection(event, 'posts')`，并从 `@nuxt/content/server` 显式导入。不显式导入的话，类型会被解析成客户端的一参签名，运行时却需要两个参数。

另外，Nuxt Content 只用 zod schema 生成类型，**不会在构建时校验 frontmatter**。格式、日期、图片路径这些由内容校验脚本负责。

## 内容契约（给文章机器人）

每日文章与周报由仓库外的脚本生成并直接推送到 `source`：

- 脚本：`Work/AI folder/tech-daily/fetch_daily.py`（每天 09:00）、`Work/AI folder/github-trending-reports/fetch_trending_ai.py`（每周五 14:30），由 launchd 触发。
- 它们的发布逻辑有单元测试：`cd "Work/AI folder" && python3 -m unittest discover -s tests`。改脚本后先跑一遍。
- 发布前脚本会先 `git pull --ff-only origin source`；出现分叉时不自动合并，而是放弃发布并通知。

站点这边对它们的产出有如下约定，**任何一项改动都要先确认脚本能配合**：

| 约定 | 说明 |
| --- | --- |
| 目录 | 文章放 `content/blog/day_<日期>.md`，周报放 `content/weekly/<日期>.md` |
| frontmatter | `title`、`description`、`date`（`YYYY-MM-DD`）、`tags`、`cover` |
| 卡片标签 | 正文里用 `::daily-card`，属性为 `title`、`url`、`chip`、`chipClass`、`metric`、`score`、`hot` |
| 组件名 | `::daily-card` 依赖 `components/content/DailyCard.vue` 这个文件名；Nuxt 的 `pathPrefix: false` 也不能改，否则标签名会变 |
| 来源标签的样式类 | `chip-hn`、`chip-juejin`、`chip-qbitai`、`chip-bili`、`chip-other`，定义在 `app/assets/css/daily-card.css` |
| 提交信息 | `post: …` 与 `weekly: …`，commitlint 配置里放行了这两个类型 |

机器人的产出与手写内容走同一条校验路线：内容校验规则由 `tests/unit/content-repo.test.ts` 保证不会误伤仓库里现有的全部文章，所以新增或收紧规则时，这个测试会告诉你有没有把机器人的正常产出判成错误。

## 排查

| 现象 | 先看哪里 |
| --- | --- |
| 部署流水线的 `validate` 失败 | Actions 里该次运行的失败步骤：内容问题看「内容校验」，依赖问题看「依赖审计」，页面问题看端到端测试的报告 |
| 机器人通知「发布失败」 | `Work/AI folder/tech-daily/launchd.log`（周报在 `github-trending-reports/launchd.log`）。常见原因是主检出目录不在 `source` 分支，或与远端分叉。修好后设 `FORCE=1` 重跑脚本 |
| 本地端到端测试起不来 | 确认 `.output/public` 是新生成的（用例会自动先跑 `nuxt generate`），且 4173 端口没有被别的服务占用 |
| 类型检查报「找不到集合类型」 | 先 `npx nuxt prepare` 重新生成类型 |
