# Slark UI → ui-web 迁移执行清单

> 原始方案：`spec.md`

## 使用规则

- 只迁移 **ui-web 已有明确对应物** 的 UI
- 如果 `ui-web` **没有对应组件 / 行为不匹配 / 迁移风险过高**，先跳过并记录 gap
- 每一阶段完成后都要做最小 smoke test，再进入下一阶段

---

## Phase 0 — Workspace 接入

### 0.1 依赖接入决策
- [x] 确认 `apps/slark` 是否纳入 pnpm workspace 管理
- [x] 确认 `apps/slark` 后续使用 `pnpm` 而不是独立 `npm`
- [x] 确认 `@nexu-design/ui-web` / `@nexu-design/tokens` 的接入方式

### 0.2 workspace 改造
- [x] 删除 `apps/slark/package-lock.json`
- [x] 在 `apps/slark/package.json` 中添加 workspace 依赖：
  - [x] `@nexu-design/ui-web`
  - [x] `@nexu-design/tokens`
- [x] 运行安装命令并确认 lockfile / workspace 状态正常

### 0.3 阶段验收
- [x] `apps/slark` 可正常安装依赖
- [x] `apps/slark` 可正常启动或构建

---

## Phase 1 — Token / Theme / 基础工具基线

### 1.1 token 统一
- [ ] 在 Slark renderer 样式入口引入 `@nexu-design/tokens/styles.css`
- [ ] 删除 `globals.css` 中通用 `@theme` token 定义
- [ ] 删除 `globals.css` 中 `.dark { ... }` 通用颜色 token 定义
- [ ] 仅保留 `globals.css` 中必要内容：
  - [ ] `@import "tailwindcss"`
  - [ ] ui-web / tokens 样式导入
  - [ ] scrollbar 样式
  - [ ] `.drag-region`
  - [ ] `.no-drag`
  - [ ] `.message-textarea` 等行为样式
  - [ ] `--color-slark-*` 业务语义 token

### 1.2 token 差异检查
- [ ] 核对以下 token 语义差异：
  - [ ] `--color-accent`
  - [ ] `--color-ring`
  - [ ] `--color-destructive-foreground`
  - [ ] `--color-muted-foreground`
  - [ ] `--color-background`
  - [ ] `--color-foreground`
- [ ] 记录哪些现有 utility class 可以继续使用
- [ ] 记录哪些现有 utility class 需要改写

### 1.3 ThemeRoot 接入
- [ ] 在 app root 用 `ThemeRoot` 包裹 `App`
- [ ] 保留当前 document-level theme init
- [ ] 确认 `ThemeRoot` 额外包裹层没有破坏根布局
- [ ] 验证 light / dark / system 三种主题切换正常

### 1.4 基础工具统一
- [ ] 搜索 Slark 本地 `cn()` 的定义与使用
- [ ] 改为统一使用 `@nexu-design/ui-web` 导出的 `cn`
- [ ] 删除重复的本地 `cn()` 实现

### 1.5 阶段验收
- [ ] app 构建通过
- [ ] 主题切换正常
- [ ] 基础页面无明显 token 冲突

---

## Phase 2 — 基础可迁移 primitive 批量替换

### 2.1 全局替换目标
- [ ] 原生主/次按钮 → `Button`
- [ ] 原生 `input` → `Input`
- [ ] 原生 `textarea` → `Textarea` / `FormField + Textarea`
- [ ] 自定义 label + help + error → `FormField`
- [ ] 自定义 badge/status pill → `Badge` / `StatusDot`
- [ ] 自定义 menu → `DropdownMenu`
- [ ] 自定义 modal → `Dialog` / `ConfirmDialog`
- [ ] Radix / 原生 tabs → `Tabs` / `UnderlineTabs`
- [ ] 手写空状态 → `EmptyState`
- [ ] 手写 row item → `InteractiveRow`

### 2.2 不在本阶段强迁移的内容
- [ ] message body（先不动，等待 compatibility check）
- [ ] chat composer（先不动）
- [ ] 任何 ui-web 没有明确对应物的复杂控件

### 2.3 阶段验收
- [ ] 新增/替换的 primitive 都来自 ui-web
- [ ] 未出现为了替换而新写一套本地 primitive

---

## Phase 3 — Settings 页面迁移

目标文件：`apps/slark/src/renderer/src/components/settings/SettingsView.tsx`

### 3.1 页面壳层
- [ ] 使用统一 outer scroll 容器
- [ ] 使用统一 inner content width / padding
- [ ] 顶部改为 `PageHeader density="shell"`
- [ ] section 间距统一

### 3.2 Workspace 区块
- [ ] workspace name 改为 `FormField + Input`
- [ ] invite members 改为 `FormField + Input + Button`
- [ ] pending invites 改为 `Card` / `InteractiveRow`
- [ ] members list 改为 `InteractiveRow` / `Card` + `Badge`
- [ ] role/status 改为 `Badge` / `StatusDot`

### 3.3 Appearance 区块
- [ ] theme 选择改为 `RadioGroup` 或 `Tabs` 风格
- [ ] 与主题 store / `ThemeRoot` 联动

### 3.4 Repositories 区块
- [ ] repo 输入区改为 `FormField + Input + Button`
- [ ] repo 列表改为 `Card` / `InteractiveRow`
- [ ] 外链操作改为 `Button`
- [ ] 删除操作改为 `Button`
- [ ] 空状态改为 `EmptyState`

### 3.5 Profile 区块
- [ ] avatar 行改为 `Avatar + Button`
- [ ] name / email 改为 `FormField + Input`

### 3.6 Danger Zone
- [ ] 删除手写 fixed overlay dialog
- [ ] 改为 `ConfirmDialog` 或 `Dialog`
- [ ] destructive action 改为 `Button variant="destructive"`

### 3.7 阶段验收
- [ ] settings 页面视觉结构与 ui-web 规范一致
- [ ] invite member 可用
- [ ] theme 切换可用
- [ ] add/remove repository 可用
- [ ] delete workspace dialog 打开/关闭正常

---

## Phase 4 — Agents 页面迁移

目标文件：

- `components/agents/AgentDetail.tsx`
- `components/agents/CreateAgentDialog.tsx`
- `components/agents/RuntimePicker.tsx`
- 其余 agent 列表/侧边栏相关文件

### 4.1 AgentDetail
- [ ] 顶部 action 按钮改为 `Button`
- [ ] more 菜单改为 `DropdownMenu`
- [ ] tabs 改为 `Tabs`
- [ ] instructions 编辑区改为 `FormField + Textarea`
- [ ] skills 区改为 `Card` / `InteractiveRow` / `EmptyState`
- [ ] settings 表单改为 ui-web 表单组件

### 4.2 RuntimePicker
- [ ] 评估 `Select` 是否足够
- [ ] 如需要搜索，评估 `Combobox`
- [ ] 若两者都不合适，先保留现有实现并记录 gap

### 4.3 CreateAgentDialog
- [ ] 改为 `Dialog`
- [ ] 使用 `DialogHeader`
- [ ] 使用 `DialogBody`
- [ ] 使用 `DialogFooter`

### 4.4 阶段验收
- [ ] agent detail 打开正常
- [ ] tab 切换正常
- [ ] create agent 可用
- [ ] delete agent 可用
- [ ] runtime picker 行为正常

---

## Phase 5 — Shell 迁移

目标文件：

- `components/layout/AppLayout.tsx`
- `components/layout/ActivityBar.tsx`
- `components/layout/Sidebar.tsx`
- `components/layout/DevPanel.tsx`

### 5.1 ActivityBar / 主导航
- [ ] 主导航按钮改为 `ActivityBar` / `NavItem`
- [ ] active / hover / icon 尺寸对齐 ui-web 规范
- [ ] settings 入口改为 design-system 风格

### 5.2 Workspace Switcher
- [ ] 菜单改为 `DropdownMenu`
- [ ] 保留 workspace avatar / 当前 workspace 展示逻辑
- [ ] 保留 logout 等动作

### 5.3 Section Sidebar
- [ ] chat / agents / runtimes / settings sidebar 导航项改为 `Sidebar` + `InteractiveRow` / `NavItem`
- [ ] 统一 section 标题、scroll 区域、row hover 样式

### 5.4 Electron 适配
- [ ] 新增 `SlarkWindowChrome`（如需要）
- [ ] 确认 `drag-region` / `no-drag` 工作正常

### 5.5 DevPanel
- [ ] 能迁移到 ui-web 的按钮/面板先迁移
- [ ] 没有对应物的调试 UI 保留现状

### 5.6 阶段验收
- [ ] shell 布局未被破坏
- [ ] workspace switcher 正常
- [ ] sidebar 导航正常
- [ ] Electron drag 区正常

---

## Phase 6 — Onboarding / Invite 迁移

目标文件：

- `components/onboarding/*`
- `components/invite/*`

### 6.1 可迁移部分
- [x] 外层欢迎/认证框架改为 `AuthShell` + `BrandRail`
- [x] 按钮改为 `Button`
- [x] 表单改为 `FormField + Input`
- [x] 错误提示改为 `Alert` / `FormField.error`
- [x] 内容容器改为 `Card`

### 6.2 保留项
- [x] 验证码 6 格输入先保留现有实现

### 6.3 Stepper 评估
- [x] 评估 `ui-web` `Stepper` 是否适合 route-driven onboarding
- [x] 如果适合，则迁移 step indicator
- [x] 结论：`Stepper` 可承接当前 route-driven onboarding；保留 route 切换逻辑，仅替换步骤指示 UI

### 6.4 Invite 页面
- [x] 对齐同一套 shell 和卡片语言
- [x] 不再使用独立手写按钮/输入视觉

### 6.5 阶段验收
- [x] WelcomePage 正常打开
- [x] 输入与前进/返回正常
- [x] invite 页面正常打开

---

## Phase 7 — Runtimes / 简单页面迁移

目标文件：

- `components/runtimes/*`
- `components/invite/InviteEmailPreview.tsx`
- `components/layout/DevPanel.tsx`（未完成部分）

### 7.1 Runtimes
- [ ] 能映射到 `Card` / `StatCard` / `DetailPanel` / `InteractiveRow` 的部分先迁移
- [ ] 无对应物的复杂 runtime 视图保留

### 7.2 其他简单页面
- [ ] `InviteEmailPreview` 中可映射的按钮/卡片/文本容器先迁移
- [ ] 无对应物部分保留

### 7.3 阶段验收
- [ ] runtimes 页面打开正常
- [ ] 列表/详情结构正常

---

## Phase 8 — Chat 迁移（仅限明确匹配部分）

目标文件：

- `components/chat/*`

### 8.1 先做 compatibility check
- [x] 检查 `ConversationMessage` 是否支持：
  - [x] avatar
  - [ ] mentions
  - [ ] reactions
  - [ ] streaming
  - [ ] content blocks
  - [ ] overlay entry
- [x] 输出结论：可迁移 / 不可迁移
  - 结论：仅基础 avatar / bubble 可迁移；message body 整体暂不可迁移，保留 Slark 原实现并记录 gap

### 8.2 本次确定可迁移的内容
- [x] chat sidebar 改为 `Sidebar` / `InteractiveRow` / `ScrollArea`
- [x] header 中可迁移按钮/徽标改为 `Button` / `Badge`
- [x] `CreateChannelDialog` 改为 `Dialog`
- [x] `InvitePeopleDialog` 改为 `Dialog`
- [x] `ContentDetailOverlay` 如 `Sheet` / `Dialog` 能承接则迁移，否则保留

### 8.3 MessageList
- [ ] 若 `ConversationMessage` 能承接，则迁移普通消息 UI
- [x] 若不能承接，则保留 Slark 原实现并记录 gap

### 8.4 MessageInput / Composer
- [x] 不强制改造成 ui-web composer
- [ ] 可迁移部分向 ui-web 靠拢：
  - [x] 发送按钮
  - [x] mention popover
  - [x] token / focus / spacing
- [x] 保留 autosize / enter-send / mention insertion 逻辑
- [ ] 如需要，新增 `SlarkComposer`

### 8.5 阶段验收
- [ ] chat 页面可正常打开
- [ ] 切换频道正常
- [ ] 发送消息正常
- [ ] mention 正常
- [ ] agent reply 正常

---

## Phase 9 — 依赖清理与收尾

### 9.1 清理重复实现
- [ ] 删除不再使用的本地 primitive / overlay 代码
- [ ] 删除不再使用的 className 片段和样式逻辑

### 9.2 清理依赖
- [ ] 搜索 `@radix-ui/*` 直接使用点
- [ ] 删除已不再被 Slark 直接使用的 Radix 依赖
- [ ] 确认 `cn()` 只有一套来源

### 9.3 gap 记录
- [ ] 汇总所有“ui-web 无对应物，暂不迁移”的区域
- [ ] 标记哪些是未来可能沉淀到 ui-web 的候选能力

### 9.4 最终验收
- [ ] onboarding 正常
- [ ] invite 正常
- [ ] chat 正常
- [ ] agents 正常
- [ ] runtimes 正常
- [ ] settings 正常
- [ ] workspace switcher 正常
- [ ] theme 切换正常
- [ ] 构建通过

---

## wrapper 白名单

- [ ] `SlarkWindowChrome`
- [ ] `SlarkWorkspaceSwitcher`
- [ ] `SlarkSectionSidebar`
- [ ] `SlarkComposer`
- [ ] `SlarkSettingsSection`（仅在其确实组合多个 ui-web 组件时）

### 禁止新增
- [ ] `SlarkSectionHeader`
- [ ] `SlarkListRow`
- [ ] 任何纯透传 ui-web props 的 wrapper

---

## gap 记录模板

对每个未迁移项，记录：

- [ ] 文件路径
- [ ] 当前能力
- [ ] 为什么 ui-web 不能承接
- [ ] 本次保留策略
- [ ] 是否值得后续沉淀到 ui-web
