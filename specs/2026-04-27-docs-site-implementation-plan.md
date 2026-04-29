# Nexu Design docs 站实现方案

## 背景

当前仓库已经具备完整的组件库与 Storybook 基础：

- `packages/tokens`：设计 token 与 CSS 入口。
- `packages/ui-web`：React/TypeScript 组件库，按 `primitives` / `patterns` 分层导出。
- `apps/storybook`：组件 playground、状态展示与本地文档。
- `docs/`：设计系统规则、组件 API 规范、发布与消费说明。

但 Storybook 当前承担了过多“文档站”职责：组件展示、设计说明、使用指南、状态矩阵、开发调试都混在一起。结果是：

1. 使用者进入后难以快速完成安装、理解 token、查找组件 API。
2. 组件文档缺少产品级导航、搜索、代码示例、主题切换和阅读体验。
3. Storybook 的 UI 品牌化与内容组织能力有限，继续深度魔改成本高。
4. 设计系统的“使用入口”和“维护入口”没有分离。

用户希望参考 HeroUI docs 的体验建设一个更好看的文档站。本次方案不以照搬 HeroUI 品牌为目标，而是借鉴其信息架构、组件页模板、代码示例体验、搜索、主题切换与 API reference 组织方式。

> 调研备注：本地路径 `~/Project/heroui/apps/docs` 当前未找到，因此本方案基于 HeroUI docs 的产品体验模式和当前仓库实际结构制定；真正实施前可以在拿到正确路径后补一次源码级 spike。

---

## 目标

1. 新增独立 `apps/docs`，作为面向组件消费者的主文档门户。
2. 保留 `apps/storybook`，重新定位为内部组件实验室、QA 工作台和状态矩阵。
3. 文档站直接消费 `@nexu-design/ui-web` 与 `@nexu-design/tokens`，展示真实组件与真实 token。
4. 为组件提供统一文档结构：概览、安装、导入、示例、变体、可访问性、Props API、Storybook 链接。
5. 让示例代码可 typecheck，避免文档示例与组件 API 漂移。
6. 让 token、主题、发布、消费、可访问性、组件 API 规范从 Markdown 文档升级为可导航、可搜索、可视化的产品级内容。
7. 为后续自动生成 Props 表、token 页面和 changelog 页面预留扩展点。

## 非目标

1. 不删除 Storybook。
2. 不把 Storybook 魔改为主文档站。
3. 不为了文档站重写 `ui-web` 组件 API。
4. 不照搬 HeroUI 的视觉品牌、渐变、动效或文案结构。
5. MVP 阶段不做多语言、多版本文档、复杂在线编辑器或完整设计资源门户。
6. MVP 阶段不要求所有组件一次性完成高质量文档，但必须建立可复制模板。
7. 不引入与现有 pnpm workspace、strict TypeScript、Biome 格式规则冲突的工具链。

---

## 总体决策

### 决策 1：新增 `apps/docs`，Storybook 与 docs 并存

职责划分：

```txt
apps/docs       = 面向使用者的设计系统文档门户
apps/storybook  = 面向维护者的组件实验室 / QA / 状态矩阵 / 视觉回归资产
```

`apps/docs` 负责：

- 首页与设计系统介绍
- 安装、样式引入、主题、dark mode
- 组件使用文档
- 示例代码与 Preview/Code 切换
- token 可视化
- Props API
- 可访问性说明
- 发布、消费与 changelog
- 搜索、TOC、移动端导航

`apps/storybook` 负责：

- 组件隔离开发
- variants / sizes / states 矩阵
- edge cases
- 设计走查
- a11y 场景验证
- visual regression 场景
- docs 页反向链接

### 决策 2：文档站应“dogfood” 自己的设计系统

文档站本身优先使用：

```ts
import '@nexu-design/ui-web/styles.css'
import { Button, Card, Tabs } from '@nexu-design/ui-web'
```

并直接读取或消费 `@nexu-design/tokens` 的 token 数据，避免文档站变成与组件库脱节的单独产品。

### 决策 3：首选 Next.js + Fumadocs + MDX

推荐技术栈：

- Next.js App Router
- Fumadocs / Fumadocs MDX
- MDX 内容
- Shiki 代码高亮
- 本地搜索，后续可升级 Algolia DocSearch
- `@nexu-design/ui-web` 与 `@nexu-design/tokens` workspace 依赖
- 示例代码以真实 `.tsx` 文件维护
- Props 表后续用 `react-docgen-typescript` 或 `ts-morph` 生成

选择理由：

1. 比 Storybook Docs 更适合完整文档站。
2. 比完全自研成本低，已有导航、TOC、搜索、代码块、主题能力。
3. 比 Docusaurus 更贴近当前 React/Next 生态与组件预览需求。
4. 比 Nextra 更适合深度定制组件文档体验。

Phase 0 必须先验证 Next.js / Fumadocs 与当前 workspace 的兼容性，尤其是：

- React 版本兼容性。
- pnpm workspace package import。
- `@nexu-design/ui-web` 与 `@nexu-design/tokens` 在 clean repo 下是否需要先 build。
- `next.config.ts` 是否需要 `transpilePackages` 或 alias。
- `@nexu-design/ui-web/styles.css` 在 dev/build 中是否能稳定解析。
- docs dev 是消费源码、消费 dist，还是采用“源码开发 + 发布前构建验证”的混合策略。

在该 spike 完成前，不应大规模迁移内容。

#### Phase 0 compatibility verification — 2026-04-27

本仓库验证结论如下，后续 `apps/docs` 按此策略实现：

1. **版本组合**：Fumadocs 当前主线以 Next.js 16 + React 19.2 为目标；`fumadocs-core@16.8.5`
   与 `fumadocs-ui@16.8.5` peer 依赖 `next: 16.x.x`、`react/react-dom: ^19.2.0`，
   `fumadocs-mdx@14.3.2` 支持 `next: ^15.3.0 || ^16.0.0` 且同样要求 React 19.2。
   当前 Storybook 使用 React 19.1.1，`@nexu-design/ui-web` peer 为 `^19.0.0`，因此 docs app
   应直接采用 `next@^16`、`react@^19.2.0`、`react-dom@^19.2.0`，不会违反 ui-web peer
   范围。
2. **Fumadocs 包**：Phase 0 使用 `fumadocs-core`、`fumadocs-ui`、`fumadocs-mdx`、`@types/mdx`，
   并按 Fumadocs App Router 模式接入 `fumadocs-mdx/next` 与 `fumadocs-ui/provider/next`。
3. **clean repo workspace import 策略**：不能依赖 `@nexu-design/ui-web` 或
   `@nexu-design/tokens` 的 package exports 在 docs dev 中直接指向 `dist`。本地 clean repo
   默认没有 `packages/*/dist`，且 `@nexu-design/ui-web` 的 `dist/index.js` 当前保留 extensionless
   ESM re-export，Node 原生导入会解析失败。docs dev 应采用“源码开发 + 发布前构建验证”的混合策略。
4. **Next workspace resolution**：`apps/docs/next.config` 需要同时配置源码 alias 与
   `transpilePackages`。alias 用于把 `@nexu-design/ui-web`、`@nexu-design/tokens` 和
   `@nexu-design/tokens/styles.css` 指向 `packages/*/src`；`transpilePackages` 用于确保 Next
   编译本地 workspace 源码及其 CSS 依赖。发布前仍通过 `pnpm build:packages` 验证 dist artifact。
5. **CSS 策略**：docs 全局 CSS 导入 Fumadocs/Tailwind CSS 后，再导入
   `@nexu-design/ui-web/styles.css`。该 import 在 dev 中通过 alias 指向
   `packages/ui-web/src/styles.css`，而 ui-web CSS 内部的 `@import "@nexu-design/tokens/styles.css"`
   再通过 alias 指向 token source CSS。token CSS 已包含 `.dark` 变量，docs dark mode 应复用该
   class 约定。
6. **已跑验证**：`pnpm --filter @nexu-design/ui-web typecheck`、
   `pnpm --filter @nexu-design/tokens typecheck`、`pnpm build:packages` 均通过；当前环境 Node
   为 `v24.13.0`，根 `engines.node` 要求 `24.15.0`，pnpm 会给出 engine warning，但不影响上述验证。

### 决策 4：文档内容和可运行示例分离

MDX 负责叙述，示例代码放真实 `.tsx` 文件：

```txt
apps/docs/content/components/button.mdx
apps/docs/examples/components/button/basic.tsx
apps/docs/examples/components/button/variants.tsx
apps/docs/examples/components/button/loading.tsx
```

页面中引用：

```mdx
<ComponentPreview name="button/basic" />
```

这样可以：

- 对示例做 TypeScript 校验。
- 复用示例到 playground 或 Storybook。
- 避免 MDX 中复制不可验证代码。
- 后续可接 Sandpack 或 live editor。

实现上必须建立 typed examples registry，让 preview 渲染与 source code 展示来自同一个示例 id：

```ts
export const examples = {
  'button/basic': {
    component: ButtonBasicExample,
    source: buttonBasicSource,
    title: 'Basic usage',
  },
}
```

不要让 `ComponentPreview` 渲染一份组件、代码块再手写另一份代码。

### 决策 5：自动化优先解决“漂移”问题

MVP 可以先使用 curated metadata 与手写 Props 表雏形，但最终必须自动化或半自动化：

- Props API 从 `packages/ui-web/src/**/*.tsx` 生成。
- tokens 页面从 `packages/tokens/src/token-data.ts` 或 tokens dist 元数据生成。
- changelog 从 Changesets / release notes 生成或同步。
- docs build/typecheck 纳入验证脚本。

Props generation 应视为辅助 metadata，不是唯一真相。对于 `forwardRef`、`VariantProps<typeof ...>`、Radix wrapper、DOM attribute inheritance 等复杂组件，curated prop descriptions 可以继续作为权威描述，docgen 用于防漂移校验。

### 决策 6：先建立 curated public API inventory

`packages/ui-web/src/index.ts` 是 public export 入口，但不等同于“需要组件文档的组件列表”。它可能包含 primitives、patterns、utilities、样式工具或非组件导出。

需要先建立 curated public API inventory，并从 `src/index.ts` 派生或校验：

```ts
type PublicApiKind = 'primitive' | 'pattern' | 'utility'
type PublicApiStatus = 'stable' | 'experimental' | 'internal'

interface PublicApiInventoryItem {
  id: string
  name: string
  kind: PublicApiKind
  status: PublicApiStatus
  package: '@nexu-design/ui-web' | '@nexu-design/tokens'
  importSnippet?: string
  docsSlug?: string
  storybookId?: string
  examples?: string[]
  documentable: boolean
}
```

后续 docs coverage、Storybook coverage、`/api/components.json`、`llms.txt` 都应基于这份 inventory，而不是直接把所有 barrel export 当组件处理。

### 决策 7：采用根级文档 URL

推荐使用根级文档 URL：

```txt
/                         # docs home
/guide/installation
/foundations/colors
/components/button
/patterns/forms
/scenarios/provider-settings
/reference/components
/changelog
```

不要混用 `/docs/components/button` 与 `/components/button`。如未来需要将 docs 部署到子路径，应通过 hosting/basePath 处理，而不是改变内容 URL 结构。

路由规范：

| 路由类型 | 规范 | 示例 | 说明 |
| --- | --- | --- | --- |
| 首页 | `/` | `/` | 设计系统入口，包含安装、组件、Foundations、Storybook 的入口卡片。 |
| Guide | `/guide/[slug]` | `/guide/installation` | 安装、样式引入、主题、dark mode、可访问性、发布与本地消费等教程。 |
| Foundations | `/foundations/[slug]` | `/foundations/colors` | token 与视觉基础说明；Phase 1 先手工整理，Phase 2 接 metadata。 |
| Components | `/components/[id]` | `/components/button` | 单组件使用文档；`id` 应与 public API inventory 中的组件 id 一致。 |
| Patterns | `/patterns/[slug]` | `/patterns/forms` | 组合模式文档，不复制单组件状态矩阵。 |
| Scenarios | `/scenarios/[slug]` | `/scenarios/provider-settings` | 产品场景示例与跨组件组合说明。 |
| Reference | `/reference/[slug]` | `/reference/components` | API reference、组件作者规范、token reference 等。 |
| Changelog | `/changelog` | `/changelog` | 发布摘要入口，后续可接 Changesets/release notes。 |
| AI static context | `/llms.txt`、`/llms-full.txt` | `/llms.txt` | `/llms.txt` Phase 1.5 最小可用；`/llms-full.txt` Phase 2 从 metadata 生成。 |
| AI metadata API | `/api/*.json` | `/api/manifest.json` | JSON-only machine-readable endpoints；Phase 1.5 先做 manifest，Phase 2 扩展完整 API。 |
| Well-known aliases | `/.well-known/*` | `/.well-known/llms.txt` | 只做 redirect 或标准发现入口，不作为 canonical docs URL。 |

首批必须固定的 canonical routes：

```txt
/
/guide/introduction
/guide/installation
/guide/styling
/guide/theming
/guide/dark-mode
/guide/accessibility
/guide/copy-and-localization
/guide/release-and-versioning
/guide/local-package-consumption
/foundations/colors
/foundations/typography
/foundations/spacing
/foundations/radius
/foundations/shadow
/foundations/motion
/components/button
/patterns/forms
/reference/components
/reference/tokens
/changelog
/llms.txt
/api/manifest.json
```

Phase 2 再补齐的 generated routes：

```txt
/api/components.json
/api/components/[id].json
/api/tokens.json
/api/examples.json
/api/examples/[id].json
/llms-full.txt
```

部署目标：

1. **首选部署到 Vercel，绑定 `design.nexu.io`。** 该选择与 Next.js App Router、Fumadocs、route handlers、preview deployments 和 pnpm workspace 支持最匹配，Phase 0 不引入额外 adapter。
2. **生产 canonical origin 是 `https://design.nexu.io`。** `apps/docs` 内部 route helper、metadata `docsUrl`、`/api/manifest.json` 示例和 `llms.txt` 链接都应从该 origin 或环境变量派生，不在页面中散落硬编码完整 URL。
3. **本地开发固定使用根路径。** `pnpm docs:dev` 默认服务于 `http://localhost:3000` 的 `/components/button`、`/guide/installation` 等根级路径，不使用 `/docs` 前缀。
4. **预览环境保留同一 pathname。** Vercel preview 只改变 origin，不改变 pathname；这能避免 Storybook link map、搜索索引、metadata API 和 copyable docs URL 在不同环境下分叉。
5. **子路径部署不是 MVP 目标。** 如果未来必须部署到例如 `/design`，只允许通过 Next.js `basePath`/hosting rewrite 作为部署层适配，并需要统一 route helper 输出；内容文件、MDX slug、inventory `docsSlug` 仍保持根级 canonical pathname。
6. **静态导出不是 Phase 0 目标。** `/api/*.json`、`/llms.txt` 和后续 metadata 生成优先使用 Next.js route handlers；如未来需要纯静态托管，应在 Phase 2 后通过生成静态文件实现，而不是改变 URL 规范。

---

## 推荐目录结构

```txt
apps/docs/
  app/
    layout.tsx
    page.tsx
    (docs)/[[...slug]]/page.tsx
    globals.css
  components/
    code-block.tsx
    component-preview.tsx
    component-link-card.tsx
    docs-page-header.tsx
    props-table.tsx
    token-swatch.tsx
    token-scale.tsx
    storybook-link.tsx
  content/
    index.mdx
    guide/
      introduction.mdx
      installation.mdx
      styling.mdx
      theming.mdx
      dark-mode.mdx
      accessibility.mdx
      release-and-versioning.mdx
    foundations/
      colors.mdx
      typography.mdx
      spacing.mdx
      radius.mdx
      shadow.mdx
      motion.mdx
    components/
      button.mdx
      badge.mdx
      card.mdx
      input.mdx
      select.mdx
      dialog.mdx
      tabs.mdx
      tooltip.mdx
    patterns/
      forms.mdx
      page-shell.mdx
      empty-states.mdx
    scenarios/
      provider-settings.mdx
      dashboard.mdx
    reference/
      components.mdx
      tokens.mdx
    changelog.mdx
  examples/
    components/
      button/
        basic.tsx
        variants.tsx
        loading.tsx
      input/
        basic.tsx
        validation.tsx
  generated/
    public-api-inventory.json
    examples.json
    props/
      button.json
    tokens/
      tokens.json
  lib/
    source.ts
    routes.ts
    examples.ts
    public-api-inventory.ts
    storybook.ts
  package.json
  tsconfig.json
  next.config.ts
```

根目录新增或调整：

```txt
scripts/
  generate-docs-props.ts
  generate-docs-tokens.ts
```

---

## 信息架构

### 主导航

```txt
Home
Guide
Foundations
Components
Patterns
Scenarios
API Reference
Changelog
```

### Guide

用于解决“如何开始使用”：

- Introduction
- Installation
- Styling
- ThemeRoot / ThemeProvider
- Dark mode
- Accessibility
- Copy & localization
- Release & versioning
- Local package consumption

这些内容可从以下现有文档迁移或摘要：

- `docs/design-system-guidelines.md`
- `docs/component-api-guidelines.md`
- `docs/copy-and-localization.md`
- `docs/package-publishing-and-consumption.md`
- `docs/release-flow.md`

### Foundations

用于展示 token 与基础视觉规则：

- Colors：semantic colors、surface、border、text、state colors。
- Typography：font family、size、line-height、weight。
- Spacing：spacing scale，可复制 CSS variable。
- Radius：radius scale，可视化圆角。
- Shadow：elevation 与 usage。
- Motion：duration、easing、何时使用动效。

### Components

面向实际开发者，按 public primitives 与 patterns 组织。组件列表应以 `packages/ui-web/src/index.ts` 的公开导出为准。

优先级：

1. 高频基础组件：Button、Badge、Card、Input、Checkbox、Switch、Select。
2. 交互组件：Dialog、Popover、Tooltip、Tabs、DropdownMenu。
3. 反馈组件：Alert、Spinner、Skeleton、Toast 如存在。
4. 复杂组件或 patterns：FormField、PageHeader、Provider settings 等。

### Patterns

用于讲“组合方式”，不要和单组件页面重复：

- Forms
- Page shell
- Settings layout
- Empty states
- Error states
- Dense picker / filter patterns

### Scenarios

用于展示真实页面片段，承接 `apps/storybook/src/stories` 中已有 `Scenarios/...` 资产：

- Provider settings
- Dashboard layout
- Auth shell
- Data table / list management

### API Reference

提供偏机器与查表的入口：

- Components props index
- Tokens index
- Utilities
- CSS imports
- Package exports

---

## 组件文档页模板

每个组件页保持统一结构，降低维护成本：

```txt
# Button

Overview
Import
Basic usage
Variants
Sizes
States
Composition / asChild
Accessibility
Props
Related components
Open in Storybook
```

### 示例：Button 页面

```mdx
---
title: Button
description: Trigger an action or submit a form.
storybook: /?path=/docs/primitives-button--docs
package: '@nexu-design/ui-web'
---

## Import

```tsx
import { Button } from '@nexu-design/ui-web'
```

## Basic usage

<ComponentPreview name="components/button/basic" />

## Variants

<ComponentPreview name="components/button/variants" />

## Accessibility

- Renders a native `button` by default.
- Supports disabled and loading states.
- Use accessible labels for icon-only buttons.

## Props

<PropsTable component="Button" />

<StorybookLink component="button" />
```

### 组件页验收标准

MVP 组件页必须包含：

1. 清晰用途说明。
2. `import` 示例。
3. 至少 1 个 basic preview。
4. 关键 variants / states 示例。
5. Accessibility 注意事项。
6. Props 表，MVP 可手写，Phase 2 自动生成。
7. Storybook 链接。

---

## 视觉与交互方向

### 应借鉴 HeroUI docs 的模式

1. 左侧稳定 sidebar，按 Guide / Components / Foundations 分组。
2. 右侧 On this page 目录。
3. Preview / Code 切换。
4. Copy code。
5. 全局搜索。
6. Dark mode。
7. 示例卡片有明确边界、背景、标题和描述。
8. 组件页结构稳定，减少每页重新设计。
9. 首页展示组件库价值、安装命令、核心组件入口。

### 不应照搬的内容

1. 不照搬 HeroUI 色彩、渐变、品牌风格。
2. 不照搬过重的 marketing 动效。
3. 不照搬与 HeroUI slot API 强绑定的文档叙事。
4. 不把组件页做得过于花哨，优先保证可读、可复制、可验证。

### Nexu docs 的视觉原则

1. 使用 `@nexu-design/tokens` 中的真实语义色。
2. 示例区域应像产品 UI，而不是孤立截图。
3. 首页可以更精致，但组件页应克制、稳定、信息密度适中。
4. 所有交互控件优先使用 `@nexu-design/ui-web`。
5. 移动端必须可阅读：sidebar 收起、TOC 可访问、代码块可横向滚动。

---

## Storybook 联动方案

### Docs 到 Storybook

每个组件页添加：

- “Open in Storybook”
- “View state matrix”
- “Report docs issue” 如后续接 GitHub

Storybook URL 可集中维护：

```ts
export const storybookLinks = {
  button: '/?path=/docs/primitives-button--docs',
  input: '/?path=/docs/primitives-input--docs',
}
```

### Storybook 到 Docs

每个 dedicated primitive story 的 docs 描述中添加完整文档链接：

```txt
Full documentation: /components/button
```

Storybook 页面应减少长篇说明，保留：

- Controls
- All variants
- All sizes
- Disabled/loading/error states
- Dark mode
- Edge cases
- a11y scenarios

### 保持现有仓库规则

继续遵守：

- public primitive 必须有 dedicated Storybook story。
- 新增或修改 primitive 时，同时评估 docs 与 Storybook 是否都需要更新。
- Storybook 仍是组件库契约的一部分，不因为 docs app 存在而废弃。

---

## 自动化与防漂移设计

### 示例代码校验

示例放在 `apps/docs/examples/**/*.tsx`，纳入 docs TypeScript 编译。

目标：

```bash
pnpm --filter @nexu-design/docs typecheck
```

能发现：

- 示例 import 错误
- props 已变更但示例未更新
- 类型不兼容

### Props 表生成

Phase 2 增加脚本：

```bash
pnpm docs:generate-props
```

输入：

```txt
packages/ui-web/src/primitives/*.tsx
packages/ui-web/src/patterns/*.tsx
```

输出：

```txt
apps/docs/generated/props/*.json
```

Props 表展示字段：

- prop name
- type
- default
- required
- description

注意事项：

1. `VariantProps<typeof ...>` 类型可能需要额外解析或手写描述补充。
2. 继承自 DOM attributes 的 props 不应完整展开成噪音；只展示组件自定义 props，并链接到 native attributes。
3. 对 public API 友好的描述应靠 JSDoc 或补充 metadata 维护。

### Token 页面生成

Phase 2 增加脚本：

```bash
pnpm docs:generate-tokens
```

输入：

- `packages/tokens/src/token-data.ts`
- 或 tokens package 的构建产物

输出：

```txt
apps/docs/generated/tokens/tokens.json
```

页面能力：

- 分类展示 colors / typography / spacing / radius / shadow。
- 显示 token 名称、值、用途说明。
- 一键复制 CSS variable。
- 支持主题切换后预览变化。

### Docs 覆盖率检查

后续可增加脚本：

```bash
pnpm docs:check-coverage
```

检查：

1. curated public API inventory 中 `documentable: true` 的 primitive / pattern 是否有 docs 页面。
2. public primitive 是否有 dedicated Storybook story。
3. docs 页面是否配置了 Storybook link。
4. examples 是否存在于 typed examples registry 并被 typecheck 覆盖。
5. `packages/ui-web/src/index.ts` 与 public API inventory 是否存在未分类的新导出。

---

## AI / Agent-Friendly Documentation Strategy

### 目标

AI / Agent-friendly 能力应作为 docs 站架构的一部分提前规划，但不应在 MVP 阶段一次性完整实现 MCP、Skills 和 IDE 集成。

目标是：

1. 让 Nexu Design 同时可被人类开发者和 coding agents 理解与消费。
2. 提供静态、结构化、动态三层访问方式。
3. 避免 `llms.txt`、MCP、Skills、组件文档各自维护一套内容。
4. 将组件、tokens、examples、props 等信息沉淀为统一 metadata。
5. 让后续 MCP server、Skills、agent prompts 都消费同一份数据底座。

### 能力分层

```txt
Static context layer
├─ /llms.txt
└─ /llms-full.txt

Structured metadata layer
├─ /api/manifest.json
├─ /api/components.json
├─ /api/components/[id].json
├─ /api/tokens.json
└─ /api/examples.json

Dynamic agent integration layer
└─ @nexu-design/mcp

Behavioral guidance layer
├─ docs guide: /guide/ai-agents
└─ optional .agents/skills
```

### `llms.txt` 与 `llms-full.txt`

`llms.txt` 是轻量索引，面向任意 LLM、RAG、web fetch、Cursor、Claude、ChatGPT 等工具。

内容应包括：

- Nexu Design 简介。
- 安装与样式入口。
- 组件分类与组件列表。
- 每个组件的一句话说明、import 路径、docs URL、Storybook URL。
- tokens 与主题文档入口。
- 关键使用约束和反模式摘要。
- 指向 `/llms-full.txt` 与 `/api/manifest.json` 的链接。

`llms-full.txt` 是完整上下文聚合，适合被 agent 一次性加载或索引。

内容应包括：

- Getting started。
- Design principles。
- Component usage。
- Examples。
- Tokens。
- Accessibility。
- Copy/localization policy。
- Component API guidelines。
- Anti-patterns。

要求：

1. 不手写长期维护的 `llms-full.txt`。
2. 应从 docs content、component metadata、token metadata 生成。
3. 输出应稳定、无交互依赖、无客户端 JS 依赖。

### 结构化 metadata API

AI 能力的核心不是 MCP 本身，而是稳定的机器可读数据源。

推荐公开路由：

```txt
/api/manifest.json
/api/components.json
/api/components/[id].json
/api/tokens.json
/api/examples.json
/api/examples/[id].json
```

`/api/manifest.json` 示例结构：

```json
{
  "name": "Nexu Design",
  "package": "@nexu-design/ui-web",
  "docsUrl": "https://design.nexu.io",
  "endpoints": {
    "llms": "/llms.txt",
    "llmsFull": "/llms-full.txt",
    "components": "/api/components.json",
    "tokens": "/api/tokens.json",
    "examples": "/api/examples.json"
  },
  "mcp": {
    "package": "@nexu-design/mcp",
    "command": "npx -y @nexu-design/mcp"
  }
}
```

`/api/components.json` 建议字段：

```json
{
  "components": [
    {
      "name": "Button",
      "id": "button",
      "status": "stable",
      "category": "primitives",
      "package": "@nexu-design/ui-web",
      "import": "import { Button } from '@nexu-design/ui-web'",
      "description": "Trigger an action or submit a form.",
      "docsUrl": "/components/button",
      "storybookUrl": "/?path=/docs/primitives-button--docs",
      "examples": ["button-basic", "button-variants"],
      "props": []
    }
  ]
}
```

`/api/tokens.json` 应从 `packages/tokens/src/token-data.ts` 或 tokens 构建产物生成，字段包括：

- token name
- category
- CSS variable
- value
- description
- usage guidance
- theme-specific values，如适用

`/api/examples.json` 应索引真实 `.tsx` 示例文件，字段包括：

- example id
- component id
- title
- description
- tags
- source code
- dependencies
- docs URL

### 推荐 docs app 路由与文件结构

```txt
apps/docs/
  app/
    llms.txt/route.ts
    llms-full.txt/route.ts
    api/
      manifest.json/route.ts
      components.json/route.ts
      components/[id].json/route.ts
      tokens.json/route.ts
      examples.json/route.ts
      examples/[id].json/route.ts
    .well-known/
      llms.txt/route.ts
      mcp.json/route.ts
  content/
    guide/
      ai-agents.mdx
      llms.mdx
      mcp.mdx
  generated/
    public-api-inventory.json
    components.json
    tokens.json
    examples.json
    llms-full.md
  lib/
    agent-data/
      public-api-inventory.ts
      components.ts
      tokens.ts
      examples.ts
      serializers/
        llms-txt.ts
        llms-full-txt.ts
        component-json.ts
```

`/.well-known/llms.txt` 可以 redirect 到 `/llms.txt`。

`/.well-known/mcp.json` 在 Phase 1 可以先提供占位信息或 404；等 MCP package 稳定后再填正式声明。

### MCP server 策略

MCP 不应内置在 docs app 第一版中。推荐后续单独新增：

```txt
packages/mcp-server
```

并发布为：

```txt
@nexu-design/mcp
```

运行方式：

```bash
npx -y @nexu-design/mcp
```

原因：

1. MCP 本地 IDE 集成通常优先使用 stdio transport。
2. Next.js docs app 是 HTTP 应用，不适合作为 stdio MCP server。
3. 独立 package 更便于版本管理与分发。
4. 避免 docs app 依赖和运行时复杂化。
5. MCP 可以读取内置 JSON，也可以 fetch docs API。

第一版 MCP 只做只读检索型能力。

推荐 tools：

```txt
search_components(query)
get_component(name)
get_component_props(name)
get_example(component, example?)
search_tokens(query)
get_token(name)
```

推荐 resources：

```txt
nexu://components
nexu://components/{name}
nexu://tokens
nexu://examples/{id}
nexu://guides/{slug}
```

Phase 3 可选 prompts：

```txt
compose_form
build_settings_page
migrate_to_nexu_design
use_tokens_correctly
```

MCP 第一版不做：

- 写文件。
- 修改项目。
- 自动安装依赖。
- 运行 Storybook。
- 渲染 React preview。
- 访问私有设计资产。
- 需要登录鉴权的能力。

### Skills 策略

Skills 属于行为规范层，不应复制组件 API、props 表或 token 表。

短期先在 docs 中新增：

```txt
apps/docs/content/guide/ai-agents.mdx
```

内容包括：

- 如何使用 `/llms.txt`。
- 如何使用 `/llms-full.txt`。
- 如何使用 JSON metadata API。
- Cursor / Claude / Copilot 等 coding agent 的推荐上下文配置。
- Nexu Design 编码约定摘要。
- 后续 MCP 安装方式。

等组件文档、metadata 和 MCP 稳定后，再考虑在仓库内提供：

```txt
.agents/skills/
  using-nexu-design/
    SKILL.md
  composing-forms/
    SKILL.md
  tokens-and-theming/
    SKILL.md
```

Skills 应描述：

- 什么时候使用哪个组件。
- 如何组合 form、dialog、settings page 等模式。
- 如何使用 design tokens。
- 不要创建平行组件或本地 variant。
- 可访问性和 copy 约定。

Skills 不应描述：

- 完整组件列表。
- 完整 props 表。
- 完整 token 值表。
- 与 `/api/*.json` 重复的结构化数据。

### Agent-friendly 分阶段计划

#### Phase 1.5 — Minimal static agent surface

目标：在不引入完整 metadata 自动化的前提下，让任意 LLM 有一个稳定入口，并验证 agent-facing 路由设计。

交付：

- `/llms.txt`
- `/api/manifest.json`
- `/guide/ai-agents`

这些输出应从 Phase 1 的 curated public API inventory 生成；不要手写一份与 docs 不同源的索引。

验收标准：

1. `/llms.txt` 可访问。
2. `/llms.txt` 包含核心组件索引、安装入口、docs URL、Storybook URL 和 metadata 入口。
3. `/api/manifest.json` 可访问并声明后续 endpoints。
4. `/guide/ai-agents` 说明当前支持范围与后续 MCP 计划。
5. 所有输出来自 curated public API inventory，不手写重复内容。
6. docs build/typecheck 通过。

#### Phase 2 — Metadata automation

目标：把 agent-friendly 数据变成组件库文档基础设施。

交付：

- component metadata 生成。
- props schema 提取或 curated metadata。
- examples index 自动生成。
- token metadata 自动生成。
- `/api/components.json`、`/api/tokens.json`、`/api/examples.json`。
- `/llms-full.txt`。
- `packages/ui-web/COMPONENT_REFERENCE.md` 可由 metadata 生成或校验。
- docs coverage 检查。

验收标准：

1. public API inventory 中 documentable export 缺 docs 或 metadata 时验证失败。
2. docs 页面、JSON API、`llms-full.txt` 共用同一份数据。
3. token 更新后 agent-facing token 输出自动更新。
4. 示例代码变更能被 typecheck 捕获。

#### Phase 3 — MCP and Skills

目标：让本地 coding agents 可以按需查询 Nexu Design。

交付：

- `packages/mcp-server`
- `@nexu-design/mcp`
- `/.well-known/mcp.json`
- MCP tools / resources
- 可选 `.agents/skills`

验收标准：

1. `npx -y @nexu-design/mcp` 可启动。
2. Claude Desktop / Cursor 可配置使用。
3. `search_components("button")` 返回正确组件数据。
4. MCP 返回数据与 `/api/*.json` 一致。
5. Skills 只描述使用策略，不重复 API 表。

### Agent-friendly 非目标

1. MVP 不做 docs 站内 AI chatbot。
2. MVP 不做 vector database 或 embedding pipeline。
3. MCP 第一版不提供写操作。
4. MCP 第一版不做需要 auth 的能力。
5. 不手写和 docs 不同源的 `llms-full.txt`。
6. 不维护多套互相重复的 component reference。
7. 不把 Skills 当作组件 API 文档。

---

## package 与脚本方案

### 新增 workspace package

`apps/docs/package.json`：

```json
{
  "name": "@nexu-design/docs",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "typecheck": "tsc --noEmit",
    "lint": "biome check ."
  },
  "dependencies": {
    "@nexu-design/tokens": "workspace:*",
    "@nexu-design/ui-web": "workspace:*"
  }
}
```

实际依赖版本在实施时根据最新官方文档确认，至少包括：

- `next`
- `react`
- `react-dom`
- `fumadocs-ui`
- `fumadocs-mdx`
- 代码高亮相关包

### 根脚本

`package.json` 建议新增：

```json
{
  "scripts": {
    "docs:dev": "pnpm --filter @nexu-design/docs dev",
    "docs:build": "pnpm --filter @nexu-design/docs build",
    "docs:typecheck": "pnpm --filter @nexu-design/docs typecheck",
    "docs:lint": "pnpm --filter @nexu-design/docs lint"
  }
}
```

如果引入生成脚本，再增加：

```json
{
  "scripts": {
    "docs:generate": "pnpm docs:generate-props && pnpm docs:generate-tokens",
    "docs:generate-props": "tsx scripts/generate-docs-props.ts",
    "docs:generate-tokens": "tsx scripts/generate-docs-tokens.ts"
  }
}
```

---

## 分阶段计划

## Phase 0 — 技术 spike

### 目标

验证 `apps/docs` 技术路线可行，不追求内容完整。

### 具体改动

1. 确认根级 URL 策略与部署模型：`/components/button`、`/guide/installation`、`/api/*`、`/llms.txt`。
2. 验证 Next.js / Fumadocs / React / pnpm workspace 兼容性。
3. 验证 docs dev 在 clean repo 下如何消费 `@nexu-design/ui-web` 与 `@nexu-design/tokens`：源码 alias、`transpilePackages`、dist build 依赖或混合策略。
4. 新增 `apps/docs` workspace package。
5. 接入 Next.js + Fumadocs + MDX。
6. 引入 `@nexu-design/ui-web/styles.css`。
7. 搭建基础布局：header、sidebar、TOC、content area。
8. 建立 typed examples registry 雏形。
9. 建立首页与 Button 文档页。
10. 建立 `ComponentPreview` 雏形，支持通过 registry 渲染一个真实 `.tsx` 示例并显示同源 source code。
11. Button 页面添加集中维护的 Storybook 链接。
12. 验证 dark mode 与 tokens CSS 是否正常。

### 验收标准

1. `pnpm docs:dev` 可运行。
2. `pnpm docs:build` 可通过。
3. `pnpm docs:typecheck` 可通过。
4. clean repo 下 docs dev 的 package consumption 策略明确且可复现。
5. Button 页面展示真实 `Button` 组件。
6. Button 示例 preview 与 copyable source 来自同一个 example id。
7. Storybook 链接可跳转到对应 story。

### 预计时间

0.5-1 周。

---

## Phase 1 — MVP 文档站

### 目标

让 docs app 成为可被团队实际使用的主文档入口。

### 内容范围

Guide：

- Introduction
- Installation
- Styling
- Theming
- Dark mode
- Accessibility
- Release & versioning

Foundations：

- Colors
- Typography
- Spacing
- Radius

Components：

- Button
- Badge
- Card
- Alert
- Input
- Select
- Checkbox
- Switch
- Dialog
- Tabs
- Tooltip
- Popover
- DropdownMenu
- Spinner / Skeleton 如已公开

### 具体改动

1. 定义组件页 MDX frontmatter 规范。
2. 建立组件页模板。
3. 建立 curated public API inventory，区分 primitive、pattern、utility、status、docs slug、Storybook id、coverage 状态。
4. 建立 `ComponentPreview`、`PropsTable`、`StorybookLink`、`TokenSwatch` 基础组件。
5. 从现有 `docs/*.md` 迁移或摘要 Guide 内容，并标注原始来源。
6. 将 `apps/storybook/src/stories/tokens.stories.tsx` 中 token 展示经验迁移为 Foundations 页面；完整 token metadata 自动化后置到 Phase 2。
7. 添加移动端 sidebar 与搜索。
8. Storybook 首页或 manager docs 增加 docs app 链接。
9. 覆盖第一批 MVP 组件：Button、Input、Card、Badge、Checkbox、Switch、Select、Dialog。
10. 视进度覆盖第二批 MVP 组件：Tabs、Tooltip、Popover、DropdownMenu、Alert、Spinner、Skeleton 如已公开。

### 验收标准

1. 新人只看 docs 可以完成安装、样式引入和 Button/Input 等基础使用。
2. 第一批 MVP 组件页都有 Import、Basic usage、Examples、Accessibility、provisional Props、Storybook link。
3. 搜索可用。
4. 移动端可阅读。
5. public API inventory 可以解释 `packages/ui-web/src/index.ts` 中已有公开导出，不把 utilities 误判为组件。
6. `pnpm docs:build`、`pnpm docs:typecheck` 通过。
7. `pnpm --filter @nexu-design/storybook typecheck` 仍通过。

### 预计时间

2-3 周。

---

## Phase 2 — 覆盖率与自动化

### 目标

减少人工维护成本，降低 docs / Storybook / source 之间漂移。

### 具体改动

1. 为所有 public primitives 创建 docs 页面。
2. 为 public patterns 创建 docs 或 patterns 页面。
3. 实现或半自动化 Props metadata，docgen 用于提取与 drift detection，复杂描述仍允许 curated metadata。
4. 实现 tokens 页面自动生成。
5. 实现 `/api/components.json`、`/api/tokens.json`、`/api/examples.json` 与 `/llms-full.txt`。
6. 增加 docs 覆盖率检查脚本。
7. 将 changelog 页面接入 Changesets 或 release notes。
8. 为 Storybook stories 批量补充 docs 链接。
9. 让 docs examples 纳入 typecheck。

### 验收标准

1. public API inventory 中 documentable primitive / pattern 都有文档入口。
2. Props 表不再靠长期手写维护；复杂组件至少有 curated metadata 与 docgen drift detection。
3. token 更新后 docs 页面能自动反映。
4. 新增 public primitive 时，缺 docs 或 story 能被检查发现。
5. docs 与 Storybook 互相可跳转。
6. JSON API 与 `llms-full.txt` 从 shared metadata 生成，不手写重复内容。

### 预计时间

3-4 周。

---

## Phase 3 — 设计系统门户增强

### 目标

让 docs 从“组件说明站”升级为“设计系统门户”。

### 可选能力

1. Algolia DocSearch。
2. Figma 链接与设计资源页面。
3. 多版本文档。
4. Starter templates。
5. 更强的 live playground。
6. Usage analytics。
7. 发布版本自动生成 release notes 页面。
8. 更完整的 MCP prompts / Skills templates。

### 进入条件

只有在 Phase 1/2 稳定后再做，避免过早复杂化。

---

## 风险与缓解

### 风险 1：docs 与 Storybook 重复维护

缓解：

- docs 讲使用与 API。
- Storybook 讲状态矩阵与 QA。
- 双向链接，但不复制全部内容。

### 风险 2：示例代码过期

缓解：

- 示例使用真实 `.tsx` 文件。
- 纳入 `@nexu-design/docs` typecheck。
- 不在 MDX 中长期维护不可验证代码。

### 风险 3：Props 表过期

缓解：

- Phase 2 引入自动生成。
- 组件 props 添加 JSDoc 或 metadata。
- DOM props 不全量展开，避免噪音。
- 对复杂组件允许 curated metadata 作为权威描述，docgen 先用于 drift detection。

### 风险 4：token 文档过期

缓解：

- token 页面从 `packages/tokens/src/token-data.ts` 或构建产物生成。
- 不手写 token 表。

### 风险 5：文档站引入过重依赖

缓解：

- Phase 0 先 spike。
- MVP 不做 Sandpack 等复杂能力。
- 先用静态 preview + code copy。

### 风险 6：文档站样式与组件库风格不一致

缓解：

- 文档站直接使用 `ui-web` 与 `tokens`。
- 新增 docs 专用组件也应遵守 `docs/design-system-guidelines.md`。
- 不为 docs app 创建平行设计语言。

### 风险 7：AI/API 输出先于 metadata 成熟导致返工

缓解：

- Phase 1.5 只做 `/llms.txt` 与 `/api/manifest.json`。
- 完整 `/api/*.json` 与 `/llms-full.txt` 放到 Phase 2。
- 所有 agent-facing 输出都必须从 curated public API inventory 或 generated metadata 派生。

### 风险 8：URL 与部署路径混乱

缓解：

- 采用根级 URL：`/components/button`、`/guide/installation` 等。
- 子路径部署通过 hosting/basePath 解决，不改变内容 URL 规范。
- Storybook link map、metadata docsUrl、搜索索引使用同一份 route helper。

---

## 迁移策略

### 现有 `docs/*.md`

MVP 阶段，现有 `docs/*.md` 继续作为内部 policy/source-of-truth；`apps/docs/content/guide` 只做消费者友好的摘要与导航，并应标注或链接原始来源：

- `design-system-guidelines.md` → Guide / Foundations / Accessibility。
- `component-api-guidelines.md` → API Reference / Component authoring。
- `copy-and-localization.md` → Guide / Copy & localization。
- `package-publishing-and-consumption.md` → Guide / Installation、Release & versioning。
- `release-flow.md` → Changelog / Release process。

后续可以决定：

1. `docs/*.md` 继续作为内部规范源，docs app 引用摘要。
2. 或将规范迁入 docs app，`docs/*.md` 只保留索引和维护说明。

在正式迁移决策前，如果 `docs/*.md` 与 docs app 内容冲突，以 `docs/*.md` 为准。

### 现有 Storybook stories

保留所有 dedicated story，不迁移删除。

迁移方式：

1. 先在 docs 页面链接到现有 stories。
2. 再将部分 story 示例抽成 `apps/docs/examples` 可复用代码。
3. 最后让 Storybook 与 docs 共享一部分 example fixture，如成本合理。

---

## 验证命令

文档站相关变更完成后至少运行：

```bash
pnpm docs:typecheck
pnpm docs:build
pnpm format:check
pnpm biome:check
```

如果同步改动 Storybook：

```bash
pnpm --filter @nexu-design/storybook typecheck
```

如果同步改动 `packages/ui-web`：

```bash
pnpm --filter @nexu-design/ui-web typecheck
pnpm --filter @nexu-design/ui-web test
```

---

## 首批任务清单

### Phase 0 checklist

- [x] 确认 Fumadocs / Next.js 版本与当前 React 版本兼容。
- [ ] 确认根级 URL 策略与部署模型。
- [x] 验证 clean repo 下 docs dev 的 workspace package consumption 策略。
- [ ] 新增 `apps/docs/package.json`。
- [ ] 新增 `apps/docs/tsconfig.json` 与 `next.config.ts` workspace resolution 配置。
- [ ] 新增 `apps/docs/app` 基础路由。
- [ ] 新增 MDX source 配置。
- [ ] 引入 `@nexu-design/ui-web/styles.css`。
- [ ] 建立 docs 首页。
- [ ] 建立 typed examples registry。
- [ ] 建立 Button 文档页。
- [ ] 建立 `ComponentPreview` 雏形。
- [ ] 建立 `StorybookLink`。
- [ ] 新增根脚本 `docs:dev`、`docs:build`、`docs:typecheck`。
- [ ] 跑通 docs dev/build/typecheck。

### Phase 1 checklist

- [x] 定义 frontmatter schema。
- [x] 定义组件页模板。
- [ ] 建立 curated public API inventory。
- [x] 明确 `docs/*.md` 作为 MVP source-of-truth 的引用策略。
- [ ] 建立 Guide 页面。
- [ ] 建立 Foundations 页面。
- [ ] 覆盖第一批 MVP 组件：Button、Input、Card、Badge、Checkbox、Switch、Select、Dialog。
- [ ] 视进度覆盖第二批 MVP 组件：Tabs、Tooltip、Popover、DropdownMenu、Alert、Spinner、Skeleton。
- [ ] 增加搜索。
- [ ] 增加移动端导航。
- [ ] Storybook 增加 docs 入口链接。
- [ ] MVP 组件 stories 增加 docs link。
- [ ] Phase 1.5 生成最小 `/llms.txt` 与 `/api/manifest.json`。
- [ ] Phase 1.5 新增 AI agents guide。

### Phase 2 checklist

- [ ] 生成或半自动维护 Props metadata。
- [ ] 生成 Token JSON。
- [ ] 生成 Examples JSON。
- [ ] 生成 `/api/components.json`、`/api/tokens.json`、`/api/examples.json`。
- [ ] 生成 `/llms-full.txt`。
- [ ] 覆盖所有 public primitives。
- [ ] 覆盖 public patterns。
- [ ] 增加 docs coverage 检查。
- [ ] 检查 `src/index.ts` 与 public API inventory 的导出分类一致性。
- [ ] 接入 changelog。
- [ ] docs examples 纳入 typecheck。

---

## 最终成功标准

1. `apps/docs` 成为团队推荐的设计系统主入口。
2. Storybook 仍然作为组件实验室稳定运行。
3. public API inventory 中每个 documentable component 都能从 docs 查到用法、示例、Props、可访问性说明和 Storybook 链接。
4. token 页面能直观展示并复制 CSS variable。
5. 示例代码、docs build、docs typecheck 进入常规验证。
6. 新增 public component 时，docs、Storybook、metadata 覆盖不再依赖口头约定。
7. 文档站视觉使用 Nexu 自己的 token 与组件，而不是复制外部品牌。
