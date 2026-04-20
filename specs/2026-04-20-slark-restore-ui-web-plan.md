# Slark 恢复 ui-web 计划

## 背景

PR #28 将 `apps/slark` 从 `main` 上已接入 `@nexu-design/ui-web` / `@nexu-design/tokens` 的状态，覆盖回了本地 pre-ui-web 版本。当前结果是：

- `apps/slark/package.json` 不再依赖 `@nexu-design/ui-web` / `@nexu-design/tokens`
- `apps/slark/tsconfig.web.json` 删除了 workspace path 映射与源码 include
- 多个页面与弹层从 `ui-web` 组合式实现退回为本地手写 `div/button/input` + Radix
- `WindowChrome.tsx`、`slark-auth-frame.tsx` 等 ui-web 适配层被删除

本计划目标是：**把 Slark 恢复到以 `ui-web` 为唯一通用组件层、以 `tokens` 为唯一通用 token 来源的状态。**

---

## 目标

1. 恢复 `apps/slark` 对 `@nexu-design/ui-web` 和 `@nexu-design/tokens` 的 workspace 接入。
2. 恢复被 PR #28 覆盖掉的 ui-web 页面/组件用法。
3. 清理 Slark 内部重复 primitive，避免继续维护本地 button / input / dialog / tabs / row / shell。
4. 保留 Electron 特有行为：`drag-region`、`no-drag`、窗口顶部占位、桌面布局密度。
5. 最终让 Slark 的 UI 基础层重新收口到 `packages/ui-web`。

## 非目标

1. 不重写业务 store、mock 数据、路由结构。
2. 不在本阶段设计新的 Slark 专属视觉语言。
3. 不优先追求“和 PR #28 完全逐行逆向一致”；优先恢复组件库接入和通用 UI 抽象。
4. 不把聊天消息体、mention/composer 等复杂业务区强行塞进不合适的 ui-web 组件。

---

## 恢复范围

### 配置与基础设施

- `apps/slark/package.json`
- `apps/slark/tsconfig.web.json`
- `apps/slark/src/renderer/src/main.tsx`
- `apps/slark/src/renderer/src/app/globals.css`
- `apps/slark/src/renderer/src/lib/utils.ts`

### 明确受 PR #28 覆盖影响的核心 UI 文件

- `apps/slark/src/renderer/src/components/settings/SettingsView.tsx`
- `apps/slark/src/renderer/src/components/chat/CreateChannelDialog.tsx`
- `apps/slark/src/renderer/src/components/agents/AgentDetail.tsx`
- `apps/slark/src/renderer/src/components/agents/CreateAgentDialog.tsx`
- `apps/slark/src/renderer/src/components/layout/AppLayout.tsx`
- `apps/slark/src/renderer/src/components/layout/ActivityBar.tsx`
- `apps/slark/src/renderer/src/components/layout/Sidebar.tsx`
- `apps/slark/src/renderer/src/components/onboarding/*`
- `apps/slark/src/renderer/src/components/invite/*`

### 需要恢复或重建的 ui-web 适配层

- `apps/slark/src/renderer/src/components/layout/WindowChrome.tsx`
- `apps/slark/src/renderer/src/components/onboarding/slark-auth-frame.tsx`

---

## 执行原则

### 1. 先恢复接线，再恢复页面

先把依赖、路径映射、tokens、ThemeRoot、`cn` 统一好，再处理页面级 diff。

### 2. 优先恢复“通用 UI 骨架”

优先恢复这些能力：

- `Button`
- `Input` / `Textarea`
- `FormField`
- `Dialog` / `ConfirmDialog`
- `Tabs`
- `Card`
- `Badge` / `StatusDot`
- `InteractiveRow`
- `PageHeader`
- `ActivityBar` / `Sidebar`
- `AuthShell`

### 3. 能直接用 `main` 历史实现就不要重造

对明显是 PR #28 覆盖掉的 ui-web 文件，优先参考 `main` 在被覆盖前的实现思路恢复，而不是重新发明一套新中间层。

### 4. 保留复杂业务区的本地实现边界

以下区域允许先保留业务层实现，只恢复外壳/基础控件：

- chat message list / content blocks
- mention picker
- message composer
- runtimes dashboard 图表

---

## 分阶段计划

## Phase 0 — 清理恢复前障碍

### 目标

把当前分支切到一个“可继续开发”的状态，避免在未解决冲突上推进迁移。

### 动作

- 解决当前 `pnpm-lock.yaml` 冲突
- 确认 `apps/slark/package.json` 当前改动是保留还是回退
- 跑一次 `git status`，确保后续恢复工作在可控状态下进行

### 验收

- 工作区不再有 unmerged files

---

## Phase 1 — 恢复 workspace 接入

### 目标

让 Slark 重新能直接使用 workspace 内的 `ui-web` / `tokens`。

### 动作

- 在 `apps/slark/package.json` 恢复：
  - `@nexu-design/ui-web: workspace:*`
  - `@nexu-design/tokens: workspace:*`
- 移除仅为本地拼 UI 引入的重复依赖（如 Slark 不再直接需要的 Radix primitive / `clsx` / `tailwind-merge`）
- 在 `apps/slark/tsconfig.web.json` 恢复：
  - `@nexu-design/ui-web` path
  - `@nexu-design/tokens` path
  - 对 `packages/ui-web` / `packages/tokens` 的 include
- 确认 `pnpm-workspace.yaml` 与安装链路能覆盖 `apps/slark`

### 验收

- Slark 能解析 `@nexu-design/ui-web`
- Slark 能解析 `@nexu-design/tokens`

---

## Phase 2 — 恢复 token / theme / 基础工具

### 目标

把视觉基础层重新对齐到 `tokens + ThemeRoot + ui-web cn`。

### 动作

- 在 renderer 样式入口恢复 `@nexu-design/tokens/styles.css`
- 清理 `globals.css` 中与 tokens 冲突的通用主题变量
- 恢复 app root 的 `ThemeRoot`
- 删除 Slark 本地 `cn()` 实现，统一改回 `@nexu-design/ui-web` 导出的 `cn`
- 恢复 `WindowChrome.tsx` 这种 Electron 适配层，避免页面自行散落 `drag-region` 实现

### 验收

- 主题切换正常
- 基础 token 无明显冲突
- 根布局未被 `ThemeRoot` 额外包裹层破坏

---

## Phase 3 — 优先恢复被整块覆盖的 ui-web 页面

### 目标

先恢复 PR #28 里最典型、最明确从 ui-web 退回手写实现的页面。

### 优先文件

1. `components/settings/SettingsView.tsx`
2. `components/chat/CreateChannelDialog.tsx`
3. `components/agents/CreateAgentDialog.tsx`
4. `components/agents/AgentDetail.tsx`

### 恢复要求

#### SettingsView
- 恢复 `PageHeader`
- 恢复 `Card` / `CardHeader` / `CardContent`
- 恢复 `FormField + Input`
- 恢复 `Button`
- 恢复 `Dialog` / `ConfirmDialog`

#### CreateChannelDialog / CreateAgentDialog
- 恢复 `Dialog`
- 恢复 `DialogHeader` / `DialogBody` / `DialogFooter`
- 恢复 `FormField + Input`
- 恢复 `Button`

#### AgentDetail
- 恢复 `Tabs`
- 恢复 `Button`
- 恢复 `DropdownMenu`
- 恢复 `Textarea` / `FormField`
- 恢复 `EmptyState` / `Card` / `InteractiveRow` 可承接的区块

### 验收

- settings 打开正常
- 两个 dialog 正常打开/关闭
- agent detail 的 tab / action 正常

---

## Phase 4 — 恢复壳层与认证框架

### 目标

把导航壳层和 onboarding / invite 外层重新收口到 ui-web。

### 动作

- 恢复 `ActivityBar` / `Sidebar` 的 ui-web 组合用法
- 统一 nav item / hover / active / spacing 语义
- 恢复 `slark-auth-frame.tsx`
- onboarding / invite 页面外层恢复为 `AuthShell` + 必要的 Electron drag 适配

### 验收

- 壳层布局恢复稳定
- onboarding / invite 入口正常
- 顶部 drag 区仍工作正常

---

## Phase 5 — 批量替换剩余基础控件

### 目标

把剩余“局部手写 primitive”继续换回 ui-web。

### 替换清单

- 原生 `button` → `Button`
- 原生 `input` → `Input`
- 原生 `textarea` → `Textarea`
- 手写 label/help/error → `FormField`
- 手写 modal shell → `Dialog`
- 手写 confirm overlay → `ConfirmDialog`
- Radix tabs 直用 → `Tabs`
- 手写 row item → `InteractiveRow`
- 手写 badge/status → `Badge` / `StatusDot`
- 手写 empty block → `EmptyState`

### 暂缓项

- chat composer
- mention picker
- message blocks
- runtimes dashboard 图表

### 验收

- 搜索 `apps/slark` 内手写通用 primitive 的数量显著下降
- 主要通用 UI 来自 `@nexu-design/ui-web`

---

## Phase 6 — 收尾与一致性检查

### 目标

确认 Slark 已恢复“组件库优先”的状态，而不是留下两套并行实现。

### 动作

- 搜索 `apps/slark` 中所有 `@nexu-design/ui-web` 使用情况
- 搜索是否仍有本地重复 primitive 文件
- 删除不再需要的 Slark 本地 UI helper / wrapper
- 检查是否仍有 PR #28 引入的 pre-ui-web 残留

### 验收标准

- Slark 的通用 UI 来源明确收口到 `ui-web`
- `tokens` 成为唯一通用 token 来源
- 仅保留业务区和 Electron 适配层的必要本地实现

---

## 验证清单

- `pnpm install`
- `pnpm --filter slark build` 或等价构建命令
- `pnpm --filter slark dev` 启动 renderer
- 手动检查：
  - settings
  - create channel dialog
  - create agent dialog
  - agent detail
  - onboarding
  - invite
  - shell 导航
  - theme 切换

---

## 建议执行顺序

1. 先解决当前冲突和脏工作区
2. 恢复 `package.json` / `tsconfig.web.json`
3. 恢复 `tokens` / `ThemeRoot` / `cn`
4. 恢复 `SettingsView`
5. 恢复 dialogs（`CreateChannelDialog` / `CreateAgentDialog`）
6. 恢复 `AgentDetail`
7. 恢复 shell / auth frame
8. 再做剩余批量替换和清理

---

## 备注

- 本计划默认以 **恢复 `main` 上原先的 ui-web 接入方向** 为主，而不是保留 PR #28 的 pre-ui-web 架构。
- 如恢复过程中发现 `main` 当时实现本身也有问题，允许在保持 `ui-web` 收口方向不变的前提下做局部重构。
- 当前分支创建自带未完成工作区状态；执行 Phase 0 前不要直接开始大规模迁移。
