# apps/demo → ui-web → storybook 组件沉淀执行计划

## 扫描范围

- `apps/demo/src/**/*`
- `apps/demo/src-tauri/**/*`
- 对照 `packages/ui-web/src/index.ts` 的已导出组件

## 结论摘要

1. `apps/demo` 已经开始大量消费 `@nexu-design/ui-web`，不是“完全没接入”的状态。
2. 但在 demo 里，仍然残留了一批 **可复用 UI 代码还停留在页面/本地组件层**，尤其是桌面端（OpenClaw / Product workspace）相关壳层与面板型 UI。
3. `src-tauri` 本身几乎 **没有前端 UI**，主要是 Tauri 原生启动与窗口效果配置；真正的桌面端 UI 仍在 `apps/demo/src/pages/openclaw/*`。

---

## 已经沉淀到 ui-web 的部分

`apps/demo` 已明显在复用这些 ui-web 能力：

- 布局壳层：`ActivityBar`、`Sidebar`、`SplitView`、`DetailPanel`
- 表单/流程：`Button`、`Input`、`Label`、`Stepper`
- 数据展示：`Table`、`DataTable`、`StatCard`、`StatsBar`
- 实体/消息：`EntityCard`、`ConversationMessage`
- 其它：`PricingCard`、`Accordion`、`Badge`、`ToggleGroup`、`Combobox`

代表文件：

- `apps/demo/src/pages/product/ProductLayout.tsx`
- `apps/demo/src/pages/openclaw/OpenClawWorkspace.tsx`
- `apps/demo/src/pages/openclaw/OnboardingPage.tsx`
- `apps/demo/src/pages/product/SessionsPage.tsx`
- `apps/demo/src/pages/product/SkillsPage.tsx`
- `apps/demo/src/pages/nexu/*`

---

## 高优先级：明显还没抽出来的可复用 UI

### 1. Page/Section 壳层仍是 demo 本地实现

**文件**

- `apps/demo/src/components/Section.tsx`
- 使用方：`ColorsPage.tsx`、`TypographyPage.tsx`、`OverviewPage.tsx`、`ComponentsPage.tsx` 等

**发现**

- 本地有 `PageHeader` / `Section` / `PageShell`
- 其中 `PageHeader`、`Section` 与 ui-web 现有的 `page-header.tsx`、`section-header.tsx` 职责高度重叠
- `PageShell` 这类基础页面容器也还没进入 ui-web

**建议**

- 优先统一到 `ui-web/patterns`
- demo 中这批设计系统展示页可直接切换为 ui-web 版本

---

### 2. 桌面端文件工作区组件还在 demo 内

**文件**

- `apps/demo/src/pages/product/FileTree.tsx`
- `apps/demo/src/pages/product/FileEditor.tsx`
- `apps/demo/src/pages/product/ProductLayout.tsx`

**发现**

- `ui-web` 已有 `ActivityBar` / `Sidebar` / `SplitView` / `DetailPanel`
- 但“桌面工作区”最关键的上层组件仍是 demo 自己拼：
  - 文件树
  - 文件预览/编辑器
  - 路径 breadcrumb + preview/edit 切换 + footer 状态栏

**为什么值得抽**

- 这是最接近 Tauri 桌面端产品形态的一组 UI
- 后续 OpenClaw / Product / Nexu 类工作区都可能复用

**可考虑沉淀成**

- `FileTree` / `TreeView`
- `FilePanel` / `DocumentEditor`
- `WorkspaceShell`（在现有 layout primitives 之上再包一层 pattern）

---

### 3. DetailPanel 上层组合模式仍大量散落

**文件**

- `apps/demo/src/pages/product/TeamDetailPanels.tsx`
- `apps/demo/src/pages/product/AutomationPage.tsx`
- `apps/demo/src/pages/product/SkillsPage.tsx`

**发现**

- 虽然底层已用 `DetailPanel*` primitives
- 但上层仍反复出现同一类组合：
  - 面板头部图标 + 标题 + badge + close
  - 可滚动内容区
  - 底部操作栏
  - 面板内跟进输入框 / 追问输入框

**代表本地组件**

- `PanelShell` in `TeamDetailPanels.tsx`
- `FollowUpInput` in `TeamDetailPanels.tsx`
- `AutomationDetailPanel` / `SkillDetailPanel`

**建议**

- 继续往上抽一层 pattern，而不是每个业务页自己组装
- 可以考虑：
  - `InspectorPanel`
  - `PanelComposer`
  - `InlinePromptComposer`

---

### 4. 桌面端认证/欢迎壳层仍是本地专属

**文件**

- `apps/demo/src/pages/openclaw/AuthShell.tsx`
- `apps/demo/src/components/openclaw/OpenClawBrandRail.tsx`
- `apps/demo/src/pages/openclaw/AuthPage.tsx`
- `apps/demo/src/pages/openclaw/ClientWelcomePage.tsx`
- `apps/demo/src/pages/openclaw/PostAuthSetupPage.tsx`

**发现**

- 这批页面已经在复用 `Button` / `Input` / `Stepper` 等基础件
- 但“桌面端登录 / 首登 / 接入引导”整体壳层仍是 demo 本地实现：
  - 左侧品牌 rail
  - 动画进入壳
  - provider 选择卡片
  - Slack 接入流程页

**为什么值得抽**

- 它们不是单页业务内容，而是一整类 onboarding/auth desktop shell
- 很适合变成 ui-web patterns，供未来桌面端产品复用

---

### 5. Provider / Platform logo 组件重复实现

**文件样本**

- `apps/demo/src/pages/openclaw/OpenClawWorkspace.tsx` → `ProviderLogo`
- `apps/demo/src/pages/openclaw/ClientWelcomePage.tsx` → `ProviderLogo`
- `apps/demo/src/pages/openclaw/PostAuthSetupPage.tsx` → `SlackIcon`
- `apps/demo/src/pages/openclaw/ChannelDetailPage.tsx` → `SlackIcon` / `FeishuIcon` / `DiscordIcon`
- `apps/demo/src/pages/openclaw/SkillDetailPage.tsx` → `SlackIcon` / `DiscordIcon` / `TelegramIcon`
- `apps/demo/src/components/openclaw/OpenClawBrandRail.tsx` → `GitHubIcon` / `NexuLogoWhite`

**发现**

- 图标/Logo 资产在多个页面里重复内联 svg
- 同一 provider/platform 的视觉表达没有统一出口

**建议**

- 至少先抽出 `apps/demo/src/components/icons/*`
- 若这些 logo 是产品级通用资产，可再考虑进入 `ui-web`

---

## 中优先级：有抽象价值，但更像“上层 pattern”

### 6. Landing / FAQ / Chat 展示块

**文件**

- `apps/demo/src/pages/LandingParts.tsx`
- `apps/demo/src/pages/GrowthLanding.tsx`
- `apps/demo/src/pages/openclaw/OpenClawLanding.tsx`

**发现**

- 本地实现了 `ChatMsg`、`ChatWindow`、`ChatDivider`、`ScenarioSection`、`FAQItem`
- 其中 `FAQItem` 在多个页面重复出现
- `ChatMsg` / `ChatWindow` 与 ui-web 已有 `ConversationMessage` 有一定重叠，但仍是另一层 landing 展示样式

**建议**

- 更适合抽成 marketing/docs patterns，不一定要先进 ui-web primitives

---

### 7. Slack / IM mock UI 体系基本都还在 demo 内

**文件**

- `apps/demo/src/components/SlackDemo.tsx`
- `apps/demo/src/pages/openclaw/GroupGrowthDemo.tsx`
- `apps/demo/src/pages/openclaw/IMOAuthDemo.tsx`
- `apps/demo/src/pages/openclaw/SlackClawReplicaPage.tsx`

**发现**

- 这些页面里有大量 Slack 风格 sidebar、message row、input composer、attachment chip、result card
- 很多是 demo/mock 语义，不一定适合直接进 ui-web primitives

**建议**

- 如果未来还会频繁做 IM 风格演示，建议先在 demo 内抽出 `mock-im-kit`
- 等稳定后再决定是否进入 ui-web

---

### 8. 评论/批注系统是独立可复用组件，但尚未产品化

**文件**

- `apps/demo/src/components/CommentSystem.tsx`

**发现**

- 已具备 pin、card、reply、resolve、localStorage 持久化
- 这是完整交互组件，不只是页面碎片

**建议**

- 如果后续还会用于设计评审/演示反馈，可抽成独立 package 或 ui-web pattern
- 当前更像 demo tooling，而非设计系统基础件

---

### 9. docs 组件也还停留在 demo 层

**文件**

- `apps/demo/src/components/docs/CodeBlock.tsx`
- `apps/demo/src/components/docs/Callout.tsx`
- `apps/demo/src/components/docs/TableOfContents.tsx`
- `apps/demo/src/pages/docs/DocsLayout.tsx`

**建议**

- 如果 Storybook / 文档站也会用到，可考虑沉淀为 docs-only patterns
- 不一定要放进 ui-web 核心导出

---

## 低优先级：有重复，但未必值得进 ui-web

### 10. 单页里临时定义的小组件

**样本**

- `apps/demo/src/pages/ComponentsPage.tsx` 的本地 `Badge`
- `apps/demo/src/pages/openclaw/PrivacyPolicyPage.tsx` / `TermsOfServicePage.tsx` 的本地 `Section` / `Table`
- 各页面内大量 `FadeIn`、`ProgressBar`、`FeatureCard`、`StatBadge`

**判断**

- 这里有一部分确实重复
- 但多数还没形成稳定 API，先不建议直接放入 ui-web

---

## 特别关注：Tauri 桌面端相关结论

### 原生层

`apps/demo/src-tauri/src/lib.rs` 只有：

- Tauri app 启动
- `tauri_plugin_opener`
- macOS vibrancy

**结论**：`src-tauri` 不是 UI 代码仓库，暂无可抽到 `ui-web` 的前端组件。

### 真正的桌面端前端 UI 在这些文件

- `apps/demo/src/pages/openclaw/AuthShell.tsx`
- `apps/demo/src/pages/openclaw/AuthPage.tsx`
- `apps/demo/src/pages/openclaw/ClientWelcomePage.tsx`
- `apps/demo/src/pages/openclaw/PostAuthSetupPage.tsx`
- `apps/demo/src/pages/openclaw/OpenClawWorkspace.tsx`
- `apps/demo/src/pages/product/ProductLayout.tsx`
- `apps/demo/src/pages/product/FileTree.tsx`
- `apps/demo/src/pages/product/FileEditor.tsx`

### 桌面端最值得优先沉淀的 4 类组件

1. **Workspace shell**：文件树 / 侧栏 / inspector / 编辑器
2. **Auth & onboarding shell**：品牌 rail / 登录壳 / provider 选择 / 接入流程
3. **Panel patterns**：详情面板、底部操作栏、面板内输入器
4. **Icon/logo system**：provider、平台、品牌图标统一出口

---

## 建议的抽象优先级

### P0

- `components/Section.tsx` → 对齐/合并到 ui-web patterns
- `FileTree.tsx` / `FileEditor.tsx` → 桌面工作区组件化
- `TeamDetailPanels.tsx` 中的 `PanelShell` / `FollowUpInput` → 提升为通用 panel pattern

### P1

- `AuthShell` + `OpenClawBrandRail` + `ClientWelcomePage` 的共性壳层
- provider/platform/logo 资产统一
- landing/chat/faq 展示块统一

### P2

- Slack mock kit
- CommentSystem
- docs 组件

---

## 不建议直接抽到 ui-web 的部分

- 具体业务页面本身：`TeamPage`、`AutomationPage`、`OpenClawWorkspace` 的业务内容区
- 各种 demo 数据驱动的 mock 页面
- `src-tauri` 原生启动代码

这些更像“产品页面”或“演示实现”，不是设计系统层的公共组件。

---

## 收敛后的执行清单

> 目标：先抽“复用面最大、业务耦合最小、能直接反哺桌面端”的 UI。

### Phase 0：先统一已有重复壳层

- [ ] 把 `apps/demo/src/components/Section.tsx` 与 `ui-web` 的 `PageHeader` / `SectionHeader` 对齐
- [ ] 决定 `PageShell` 是否进入 `ui-web/patterns`，或仅保留在 demo
- [ ] 替换这些页面中的本地壳层用法：
  - [ ] `apps/demo/src/pages/ColorsPage.tsx`
  - [ ] `apps/demo/src/pages/TypographyPage.tsx`
  - [ ] `apps/demo/src/pages/OverviewPage.tsx`
  - [ ] `apps/demo/src/pages/ComponentsPage.tsx`
  - [ ] `apps/demo/src/pages/CopyPage.tsx`
  - [ ] `apps/demo/src/pages/ThemesPage.tsx`
  - [ ] `apps/demo/src/pages/MotionPage.tsx`
  - [ ] `apps/demo/src/pages/AvatarPage.tsx`

**完成标准**

- demo 不再维护单独的 `PageHeader` / `Section` 重复实现
- 页面级壳层 API 在 `ui-web` 内有统一出口

### Phase 1：抽桌面工作区组件

- [ ] 从 `apps/demo/src/pages/product/FileTree.tsx` 提炼 `FileTree` / `TreeView`
- [ ] 从 `apps/demo/src/pages/product/FileEditor.tsx` 提炼 `DocumentEditor` / `FilePanel`
- [ ] 评估 `ProductLayout.tsx` 与 `OpenClawWorkspace.tsx` 共性，定义 `WorkspaceShell` pattern
- [ ] 统一这些工作区组件与现有 primitives 的关系：
  - [ ] `ActivityBar`
  - [ ] `Sidebar`
  - [ ] `SplitView`
  - [ ] `DetailPanel`

**优先落地文件**

- `apps/demo/src/pages/product/FileTree.tsx`
- `apps/demo/src/pages/product/FileEditor.tsx`
- `apps/demo/src/pages/product/ProductLayout.tsx`
- `apps/demo/src/pages/openclaw/OpenClawWorkspace.tsx`

**完成标准**

- 文件树/编辑器不再是 demo 私有实现
- Product / OpenClaw 至少有两处能复用同一套工作区组件

### Phase 2：抽 DetailPanel 上层 pattern

- [ ] 从 `TeamDetailPanels.tsx` 提炼通用 `InspectorPanel` 壳
- [ ] 从 `TeamDetailPanels.tsx` 提炼 `InlinePromptComposer` / `FollowUpInput`
- [ ] 对齐 `AutomationPage.tsx` 与 `SkillsPage.tsx` 的 detail panel 头部/内容/底部结构
- [ ] 明确哪些能力留在 primitive，哪些进入 pattern

**优先落地文件**

- `apps/demo/src/pages/product/TeamDetailPanels.tsx`
- `apps/demo/src/pages/product/AutomationPage.tsx`
- `apps/demo/src/pages/product/SkillsPage.tsx`

**完成标准**

- DetailPanel 的常见组合方式在 `ui-web` 中有稳定 pattern
- 业务页面不再反复手写 panel header/footer/input 组合

### Phase 3：抽桌面端 auth / onboarding 壳层

- [ ] 提炼 `AuthShell` 的桌面双栏壳层
- [ ] 提炼 `OpenClawBrandRail` 为可复用品牌侧栏 pattern
- [ ] 收敛 `ClientWelcomePage` / `AuthPage` / `PostAuthSetupPage` 中共通的 auth/onboarding 结构
- [ ] 明确“业务文案/流程状态”与“通用 UI 壳层”的边界

**优先落地文件**

- `apps/demo/src/pages/openclaw/AuthShell.tsx`
- `apps/demo/src/components/openclaw/OpenClawBrandRail.tsx`
- `apps/demo/src/pages/openclaw/AuthPage.tsx`
- `apps/demo/src/pages/openclaw/ClientWelcomePage.tsx`
- `apps/demo/src/pages/openclaw/PostAuthSetupPage.tsx`

**完成标准**

- 桌面端 onboarding/auth 至少能由一套共用 shell 支撑
- 页面只保留流程状态与业务内容，不再承载大量壳层样式细节

### Phase 4：统一 provider / platform / brand 图标资产

- [ ] 盘点重复的 provider/platform/logo svg
- [ ] 先在 `apps/demo/src/components/icons/*` 建统一出口
- [ ] 再评估是否进入 `packages/ui-web`
- [ ] 替换这些重复实现：
  - [ ] `OpenClawWorkspace.tsx` 的 `ProviderLogo`
  - [ ] `ClientWelcomePage.tsx` 的 `ProviderLogo`
  - [ ] `PostAuthSetupPage.tsx` 的 `SlackIcon`
  - [ ] `ChannelDetailPage.tsx` 的平台图标
  - [ ] `SkillDetailPage.tsx` 的平台图标

**完成标准**

- 相同 provider/platform 不再在多个页面重复内联 svg
- 图标命名、尺寸、视觉风格有统一约束

---

## 推荐的实际开工顺序

1. `Section/PageHeader/PageShell`
2. `InspectorPanel` + `FollowUpInput`
3. `FileTree/FileEditor/WorkspaceShell`
4. `AuthShell/BrandRail/Auth onboarding shell`
5. `provider/platform/logo icons`

这个顺序的原因：

- 前两项最容易落地，风险最低
- 中间两项最能反哺桌面端核心体验
- 图标统一适合放在后面收口

---

## 建议暂缓的清单

- [ ] `SlackDemo.tsx` / `GroupGrowthDemo.tsx` / `IMOAuthDemo.tsx` 先不要直接进 ui-web
- [ ] `CommentSystem.tsx` 先不要塞进 design system 核心包
- [ ] docs 组件先留在 demo/docs 体系内，等复用面扩大后再抽

原因：这些更像演示层、工具层或内容层，还不是稳定的设计系统资产。

---

## 补充：从 demo 沉淀到 ui-web，再同步到 Storybook 的标准流程

> 目标：避免“只在 demo 里好用”，确保沉淀后的组件真正进入组件库契约。

### 标准迁移路径

1. **先在 demo 中识别稳定 UI**
   - 至少在 2 个页面/场景出现
   - 样式和交互已相对稳定
   - 能和业务数据、业务文案拆开

2. **从 demo 页面中剥离出最小公共 API**
   - 先抽结构和交互
   - 不把 demo 专属文案、mock 数据、路由逻辑直接带进 `ui-web`
   - 只保留可复用 props

3. **落到 `packages/ui-web`**
   - primitive：放 `packages/ui-web/src/primitives/*`
   - pattern：放 `packages/ui-web/src/patterns/*`
   - 更新 `packages/ui-web/src/index.ts` 导出

4. **补测试**
   - 为新组件补 Vitest / Testing Library 测试
   - 优先覆盖：渲染、交互、状态切换、可访问性基础行为

5. **同步 Storybook**
   - 新 public primitive 必须补 dedicated story
   - 若是 pattern / 组合型组件，补对应 story 或 scenario story
   - 若 demo 原本有业务场景价值，再加一个场景型 story，而不是只留 demo 页面

6. **回切 demo**
   - 让 `apps/demo` 改为消费 `@nexu-design/ui-web`
   - 删除 demo 内重复实现

7. **验证**
   - `pnpm --filter @nexu-design/ui-web typecheck`
   - `pnpm --filter @nexu-design/ui-web test`
   - `pnpm --filter @nexu-design/storybook typecheck`

---

## 针对本项目的补充清单

### 每一个准备沉淀的组件，都要补这 6 步

- [ ] 从 `apps/demo` 页面代码里抽出候选组件
- [ ] 明确 primitive / pattern 归属
- [ ] 放入 `packages/ui-web/src/*`
- [ ] 更新 `packages/ui-web/src/index.ts`
- [ ] 补对应测试文件
- [ ] 补对应 Storybook story / scenario

### Storybook 同步要求

#### 如果沉淀的是 public primitive

- [ ] 在 `apps/storybook/src/stories/` 下新增 dedicated story
- [ ] 命名遵循：`<primitive>.stories.tsx`
- [ ] story 覆盖至少这些状态：
  - [ ] 默认态
  - [ ] 交互态
  - [ ] disabled / empty / loading（如适用）
  - [ ] 关键变体

#### 如果沉淀的是 pattern / desktop shell

- [ ] 新增对应 story，展示标准用法
- [ ] 如果该组件主要用于组合场景，再补一个 `Scenarios/...` 类型 story
- [ ] 不把整页业务 demo 直接搬进 story，优先提炼成可复用场景

---

## 把这条流程映射回当前收敛清单

### 1. `Section/PageHeader/PageShell`

- [ ] 从 `apps/demo/src/components/Section.tsx` 提炼 API
- [ ] 合并到 `packages/ui-web/src/patterns/page-header.tsx` / `section-header.tsx`，或新增 `page-shell.tsx`
- [ ] 更新 `packages/ui-web/src/index.ts`
- [ ] 为 page shell / header 补测试
- [ ] 在 Storybook 补 page header / section header / page shell story
- [ ] demo 展示页全部改用 ui-web 版本

### 2. `InspectorPanel` / `FollowUpInput`

- [ ] 从 `TeamDetailPanels.tsx` 抽公共 API
- [ ] 落到 `packages/ui-web/src/patterns/*`
- [ ] 补 detail panel pattern 测试
- [ ] 在 Storybook 增加 inspector/panel 组合示例
- [ ] `AutomationPage` / `SkillsPage` / `TeamPage` 回切到 ui-web

### 3. `FileTree` / `FileEditor` / `WorkspaceShell`

- [ ] 从 Product/OpenClaw 的 workspace 代码中抽公共层
- [ ] 落到 `packages/ui-web/src/primitives/*` 或 `patterns/*`
- [ ] 先做最小交互 story，再补桌面工作区 scenario story
- [ ] `ProductLayout.tsx` / `OpenClawWorkspace.tsx` 改为消费 ui-web

### 4. `AuthShell` / `BrandRail` / onboarding shell

- [ ] 抽出与业务流程无关的壳层 API
- [ ] 落到 `packages/ui-web/src/patterns/*`
- [ ] 在 Storybook 中补 desktop auth / onboarding shell 示例
- [ ] demo 页面回切

### 5. provider / platform / logo icons

- [ ] 先统一图标组件出口
- [ ] 再决定进入 `ui-web` 还是仅作为 demo/shared assets
- [ ] 如果进入 `ui-web`，补 icon gallery / logo story

---

## 新增完成标准

只有同时满足下面 4 条，才算“从 demo 成功沉淀到组件库”：

- [ ] `apps/demo` 不再保留重复实现
- [ ] `packages/ui-web` 已有正式导出
- [ ] `apps/storybook` 已有对应 story
- [ ] 测试与 typecheck 通过

---

## 工程化拆分方式

为了降低迁移风险，建议同时按 3 个维度管理：

1. **按工作流拆分**：demo 提炼 → ui-web 落库 → storybook 同步 → demo 回切
2. **按代码目录拆分**：`apps/demo`、`packages/ui-web`、`apps/storybook`
3. **按 PR 切分**：每个 PR 只覆盖一组稳定组件，不混入无关页面重构

---

## 推荐目录落点

### demo 候选来源

- `apps/demo/src/components/*`
- `apps/demo/src/components/openclaw/*`
- `apps/demo/src/pages/openclaw/*`
- `apps/demo/src/pages/product/*`

### ui-web 目标目录

- primitives：`packages/ui-web/src/primitives/*`
- patterns：`packages/ui-web/src/patterns/*`
- tests：与组件同目录 colocated，命名 `*.test.tsx`
- barrel：`packages/ui-web/src/index.ts`

### storybook 目标目录

- dedicated primitive stories：`apps/storybook/src/stories/*.stories.tsx`
- 场景型 story：`apps/storybook/src/stories/Scenarios/*`

---

## 推荐 PR 切分

### PR-01：统一基础页面壳层

**范围**

- `Section`
- `PageHeader`
- `SectionHeader`
- `PageShell`（如果决定进入 ui-web）

**涉及目录**

- 来源：`apps/demo/src/components/Section.tsx`
- 目标：`packages/ui-web/src/patterns/*`
- Storybook：`apps/storybook/src/stories/*`

**PR 内容**

- [ ] 提炼公共 props
- [ ] 对齐现有 `page-header.tsx` / `section-header.tsx`
- [ ] 新增 `page-shell.tsx`（如需要）
- [ ] 更新 `packages/ui-web/src/index.ts`
- [ ] 补测试
- [ ] 补 dedicated story
- [ ] demo 页面回切

**验收**

- [ ] `apps/demo/src/components/Section.tsx` 删除或只保留极薄包装
- [ ] 设计系统展示页全部改为消费 ui-web

### PR-02：统一 Inspector / DetailPanel pattern

**范围**

- `PanelShell`
- `FollowUpInput`
- `InspectorPanel`
- DetailPanel header/content/footer 组合约定

**涉及目录**

- 来源：
  - `apps/demo/src/pages/product/TeamDetailPanels.tsx`
  - `apps/demo/src/pages/product/AutomationPage.tsx`
  - `apps/demo/src/pages/product/SkillsPage.tsx`
- 目标：`packages/ui-web/src/patterns/*`
- Storybook：
  - dedicated story（如果形成单独导出）
  - `Scenarios/*` 组合 story

**PR 内容**

- [ ] 定义 panel pattern API
- [ ] 统一 close button / footer / prompt composer 形态
- [ ] 补测试
- [ ] 补 Storybook 组合示例
- [ ] 三个页面回切到 ui-web

**验收**

- [ ] 业务页面不再手写同构 panel 结构
- [ ] ui-web 中形成稳定可复用 pattern

### PR-03：统一桌面工作区组件

**范围**

- `FileTree`
- `FileEditor`
- `WorkspaceShell`

**涉及目录**

- 来源：
  - `apps/demo/src/pages/product/FileTree.tsx`
  - `apps/demo/src/pages/product/FileEditor.tsx`
  - `apps/demo/src/pages/product/ProductLayout.tsx`
  - `apps/demo/src/pages/openclaw/OpenClawWorkspace.tsx`
- 目标：
  - `packages/ui-web/src/primitives/*`
  - `packages/ui-web/src/patterns/*`
- Storybook：
  - dedicated story for `file-tree` / `document-editor`（如公开）
  - `Scenarios/workspace-shell.stories.tsx`

**PR 内容**

- [ ] 抽离文件树节点 API
- [ ] 抽离编辑器 header/body/footer API
- [ ] 定义 workspace shell 组合边界
- [ ] 补测试
- [ ] 补 workspace scenario story
- [ ] Product / OpenClaw 回切

**验收**

- [ ] 至少 2 个 workspace 页面复用同一套组件
- [ ] 不再由 demo 页面自己维护文件树/编辑器公共层

### PR-04：统一桌面 auth / onboarding shell

**范围**

- `AuthShell`
- `BrandRail`
- onboarding/auth page shell

**涉及目录**

- 来源：
  - `apps/demo/src/pages/openclaw/AuthShell.tsx`
  - `apps/demo/src/components/openclaw/OpenClawBrandRail.tsx`
  - `apps/demo/src/pages/openclaw/AuthPage.tsx`
  - `apps/demo/src/pages/openclaw/ClientWelcomePage.tsx`
  - `apps/demo/src/pages/openclaw/PostAuthSetupPage.tsx`
- 目标：`packages/ui-web/src/patterns/*`
- Storybook：`Scenarios/auth-shell*.stories.tsx`

**PR 内容**

- [ ] 抽出双栏 desktop shell
- [ ] 抽出品牌 rail 与 content slot API
- [ ] 保留页面业务流程，迁移通用壳层
- [ ] 补测试
- [ ] 补 Storybook auth/onboarding scenario
- [ ] demo 回切

**验收**

- [ ] auth/onboarding 页面共享一套 shell
- [ ] demo 页面主要只保留业务流程状态

### PR-05：统一 icon / logo 资产

**范围**

- provider icons
- platform icons
- brand logos

**涉及目录**

- 第一阶段目标：`apps/demo/src/components/icons/*`
- 第二阶段候选：`packages/ui-web/src/primitives/*` 或 `packages/ui-web/src/lib/*`
- Storybook：`icons.stories.tsx` 或 `Scenarios/icon-gallery.stories.tsx`

**PR 内容**

- [ ] 统一命名与 props 约定（`size` / `className`）
- [ ] 替换重复 inline svg
- [ ] 评估哪些应成为 ui-web 公共资产
- [ ] 补 icon gallery story

**验收**

- [ ] 相同图标不再在多个页面重复定义
- [ ] 图标资产有单一出口

---

## 每个 PR 的固定交付物

每个 PR 都必须包含这 4 类文件变化：

1. **ui-web 代码**
   - 新组件或新 pattern
   - `packages/ui-web/src/index.ts` 导出更新

2. **测试**
   - `packages/ui-web/src/**/*.test.tsx`

3. **Storybook**
   - `apps/storybook/src/stories/*.stories.tsx`
   - 如有必要，再补 `Scenarios/*`

4. **demo 回切**
   - `apps/demo` 改为使用 `@nexu-design/ui-web`
   - 删除重复实现

---

## 每个组件的工程模板

### 1. 候选组件记录

- 来源文件：
- 复用页面：
- 建议归类：primitive / pattern / keep-in-demo
- 不应带入 ui-web 的业务逻辑：

### 2. ui-web 设计

- 文件名：
- 导出名：
- Props：
- Slots / 子组件：
- 状态：
- a11y 要点：

### 3. Storybook 设计

- dedicated story：
- scenario story：
- 要覆盖的状态：

### 4. demo 回切

- 替换页面：
- 可删除的旧实现：

---

## 分工建议

### Workstream A：ui-web primitives / patterns

负责：

- 组件 API 提炼
- 组件实现
- barrel 导出
- 测试

### Workstream B：storybook contract

负责：

- dedicated stories
- scenario stories
- 组件状态覆盖

### Workstream C：demo migration

负责：

- 页面回切
- 删除重复实现
- 观察是否还有 API 缺口

> 理想节奏：A 先出最小 API，B/C 同步跟进，不要等所有组件都抽完再统一补 story。

---

## 风险控制

### 风险 1：把业务页面直接搬进 ui-web

**避免方式**

- 只抽结构、交互、slots
- 文案、路由、mock 数据留在 demo

### 风险 2：只沉淀到 ui-web，不回切 demo

**避免方式**

- 每个 PR 强制包含 demo migration
- 没有回切，不算完成

### 风险 3：有组件导出，但没有 Storybook 契约

**避免方式**

- 每个新增 public primitive 必须有 dedicated story
- pattern 至少要有一个 story 或 scenario

### 风险 4：组件 API 一次抽太大

**避免方式**

- 先抽最小公共 API
- 先服务两个页面，再考虑泛化

---

## 执行节奏建议（两轮）

### Round 1：低风险收敛

- PR-01 `Section/PageHeader/PageShell`
- PR-02 `InspectorPanel/FollowUpInput`

**目标**

- 快速建立 demo → ui-web → storybook 的迁移闭环

### Round 2：桌面端核心沉淀

- PR-03 `FileTree/FileEditor/WorkspaceShell`
- PR-04 `AuthShell/BrandRail/Auth onboarding shell`
- PR-05 `icon/logo assets`

**目标**

- 把最关键的桌面端 UI 壳层沉淀为组件库资产

---

## 最终验收清单

- [ ] 候选组件已从 demo 提炼为稳定 API
- [ ] 组件已落到 `packages/ui-web/src/primitives/*` 或 `patterns/*`
- [ ] `packages/ui-web/src/index.ts` 已更新
- [ ] 组件测试已补齐
- [ ] Storybook dedicated story / scenario 已同步
- [ ] demo 页面已改为消费 ui-web
- [ ] demo 重复实现已删除
- [ ] `pnpm --filter @nexu-design/ui-web typecheck` 通过
- [ ] `pnpm --filter @nexu-design/ui-web test` 通过
- [ ] `pnpm --filter @nexu-design/storybook typecheck` 通过
