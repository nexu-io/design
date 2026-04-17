# Slark UI → ui-web 迁移 Spec

## 背景

`apps/slark` 当前 UI 主要由以下方式拼装：

- 自定义 Tailwind v4 class
- 直接使用 Radix primitives
- 局部手写 dialog / tabs / menu / form / shell
- 自定义主题变量（`globals.css` 中的 shadcn 风格 token + `--color-slark-*`）

仓库内已有成熟的 `@nexu-design/ui-web` 组件库，覆盖 shell、导航、表单、对话框、列表、设置页、消息展示等大量 UI 能力。本次目标是：**只迁移 ui-web 已经具备对应能力的 UI**；如果 `ui-web` 当前没有对应组件或能力不够承接，则先保留 Slark 现有实现，不在这次 spec 中强行迁移。

---

## 目标

1. `apps/slark` 中已有明确 ui-web 对应物的 UI，迁移到 `@nexu-design/ui-web`。
2. 清理 Slark 内部重复 UI，尤其是按钮、输入框、弹窗、tabs、menu、settings row、列表行。
3. 让 Slark 主题体系对齐 `ui-web` 的 `ThemeRoot` + token 体系。
4. 保留 Electron 桌面特性：`drag-region` / `no-drag`、窗口顶部留白、桌面布局密度。
5. 降低 `apps/slark` 对 Radix 和自定义 primitive 的直接依赖。

## 非目标

1. 不重做业务逻辑、store 结构、mock 数据模型。
2. 不要求第一阶段视觉 100% 原样复刻；优先完成 design-system 对齐。
3. 如果 `ui-web` 没有对应组件，**先不迁移**，保留现状并记录为 gap。
4. 不在本次迁移中为了 Slark 单独发明新的通用 primitive。

---

## 决策原则

### 1. 仅迁移有明确 ui-web 对应物的 UI

执行规则：

- **能直接映射到 ui-web** → 迁移
- **能通过少量组合 ui-web 完成** → 迁移
- **ui-web 没有对应组件 / 语义不匹配 / 行为复杂度过高** → 本次先不迁移，保留 Slark 实现

本次禁止为了“全量替换”而：

- 在 Slark 里重写一套新 primitive
- 把复杂业务组件硬套进不合适的 ui-web 组件
- 先补 ui-web 再迁移 Slark（除非后续单独立项）

### 2. 先解决基础设施，再改页面

先统一 workspace 接入、主题、token、`cn()`、shell 基线，再做页面迁移。

### 3. wrapper 只用于真正的适配层

允许新增本地 wrapper，但仅限：

- Electron 适配
- 2 个以上 ui-web 组件的稳定组合
- Slark 独有但仍建立在 ui-web 之上的组合层

不允许新增纯透传 wrapper，例如仅包一层 `PageHeader` 或 `InteractiveRow`。

---

## 现状摘要

### 入口与主要界面

- Router: `apps/slark/src/renderer/src/app/App.tsx`
- Shell: `components/layout/AppLayout.tsx`, `ActivityBar.tsx`, `Sidebar.tsx`, `DevPanel.tsx`
- Onboarding: `components/onboarding/*`
- Invite: `components/invite/*`
- Chat: `components/chat/*`
- Agents: `components/agents/*`
- Runtimes: `components/runtimes/*`
- Settings: `components/settings/SettingsView.tsx`

### 当前技术特征

- React 19 + React Router 7
- Tailwind v4
- `apps/slark` 当前是独立 npm app，存在 `package-lock.json`
- 直接依赖部分 `@radix-ui/*`
- 自己的 `cn()` 与局部组件样式体系
- `globals.css` 当前有一套与 `ui-web` 冲突的 `@theme` token 定义

### ui-web 已知可直接利用能力

- Shell / 导航：`PageShell`, `AuthShell`, `BrandRail`, `ActivityBar`, `Sidebar`, `NavItem`, `PageHeader`, `SplitView`, `PanelFooter`
- 表单：`FormField`, `Input`, `Textarea`, `Select`, `Combobox`, `Checkbox`, `Switch`, `RadioGroup`, `Label`, `Button`
- Overlay：`Dialog`, `ConfirmDialog`, `DropdownMenu`, `Popover`, `Tooltip`, `Sheet`
- 内容与列表：`Card`, `InteractiveRow`, `DetailPanel`, `EmptyState`, `Badge`, `Alert`, `StatusDot`
- 反馈与状态：`Spinner`, `Skeleton`, `Sonner`
- 主题：`ThemeRoot`

### 本次需谨慎评估、不能默认迁移的区域

- `ConversationMessage` 是否真能承接 Slark 消息模型
- chat composer / mention picker / content blocks
- onboarding stepper 是否适合当前 route-driven flow
- 任何 ui-web 中没有稳定对应物的 dense picker / custom inspector / domain-specific overlay

---

## 核心风险

### 风险 1：Tailwind v4 token 冲突

这是本次迁移最大的技术风险。

`apps/slark/src/renderer/src/app/globals.css` 当前使用 Tailwind v4 `@theme` 定义 `--color-background` / `--color-foreground` / `--color-accent` 等 token；`@nexu-design/tokens/styles.css` 也会定义同名 token。两者不能并存，否则会出现 utility 语义冲突、生成结果不稳定、样式被导入顺序悄悄覆盖等问题。

**结论：本次迁移必须以 ui-web/tokens 为唯一通用 token 来源。**

### 风险 2：Slark 不是 pnpm workspace 成员

仓库规则偏向 `pnpm`，但 `apps/slark` 当前是独立 npm app。接入 `@nexu-design/ui-web` 前，必须先确定依赖接入方式。

### 风险 3：`ThemeRoot` 不是 document-level theme init 的完全替代

`ThemeRoot` 是 React wrapper；而 Slark 当前主题逻辑会影响 document 级别 class。Electron 下 scrollbar / 原生元素 / 全局 dark class 可能受影响。

### 风险 4：复杂交互区域硬迁移会退化体验

尤其是 chat message/composer/content overlay。如果 ui-web 没有足够匹配能力，本次不迁移。

---

## Phase 0 — Workspace 接入决策

在任何 UI 迁移之前，先完成依赖接入方案确认。

### 0.1 推荐方案：把 Slark 纳入 pnpm workspace

建议动作：

1. 确认 `apps/slark` 被纳入 workspace 管理
2. 删除 `apps/slark/package-lock.json`
3. 在 `apps/slark/package.json` 中使用 workspace dependency：
   - `@nexu-design/ui-web: workspace:*`
   - `@nexu-design/tokens: workspace:*`
4. 后续统一通过 `pnpm` 安装和构建

### 0.2 如果暂时不能接入 workspace

则本 spec 暂停执行，不进入页面迁移阶段。因为一旦依赖接入方式不稳定，后续所有 import / build / style pipeline 都会反复返工。

---

## Phase 1 — Token / Theme / 基础工具基线

这是实施前提，不是可选优化。

### 1.1 Token 统一策略

以 `@nexu-design/tokens/styles.css` 作为唯一通用 token 来源。

具体要求：

1. 删除 `apps/slark/src/renderer/src/app/globals.css` 中整块通用 `@theme` 定义
2. 删除 `globals.css` 中 `.dark { ... }` 的通用颜色 token 定义
3. 保留且仅保留以下内容：
   - `@import "tailwindcss"`
   - ui-web / tokens 所需样式导入
   - scrollbar 样式
   - `.drag-region`
   - `.no-drag`
   - `.message-textarea` 等纯行为样式
   - `--color-slark-*` 这类业务语义 token（以最小补充方式保留）

### 1.2 Token 语义差异检查

在真正动页面前，先对以下 token 做语义差异核对：

- `--color-accent`
- `--color-ring`
- `--color-destructive-foreground`
- `--color-muted-foreground`
- `--color-background`
- `--color-foreground`

输出一个简短 diff 结论，确认哪些 utility 可以继续沿用，哪些必须改写。

### 1.3 `ThemeRoot` 接入策略

推荐做法：

1. 在 app root 用 `ThemeRoot theme={theme}` 包裹 `App`
2. 保留当前 document-level theme init 逻辑，确保 `html.dark` / scrollbar / 全局样式继续生效
3. 等确认没有 document-level 依赖后，再考虑是否移除原始 theme init

注意：`ThemeRoot` 会引入额外 DOM 包裹层，需要确保根布局仍然保持 `h-screen/w-screen` 与 flex 行为不变。

### 1.4 基础工具统一

1. 删除 Slark 本地 `cn()` 重复实现
2. 改为统一 import `@nexu-design/ui-web` 导出的 `cn`

---

## Phase 2 — 可迁移组件基线

目标：只处理全项目重复最多、且 ui-web 已明确具备对应能力的 primitive。

### 2.1 全局替换清单

| 当前模式 | 目标组件 | 本次是否迁移 |
|---|---|---|
| 原生 `button` 主/次按钮 | `Button` | 是 |
| 原生 `input` | `Input` | 是 |
| 原生 `textarea` | `Textarea` / `FormField + Textarea` | 是 |
| 自定义 label + help + error | `FormField` | 是 |
| 自定义 badge/status pill | `Badge` / `StatusDot` | 是 |
| 自定义 menu | `DropdownMenu` | 是 |
| 自定义 modal | `Dialog` / `ConfirmDialog` | 是 |
| Radix tabs / 原生 tabs | `Tabs` / `UnderlineTabs` | 是 |
| 手写空状态 | `EmptyState` | 是 |
| 手写 row list item | `InteractiveRow` | 是 |
| 自定义消息体组件 | `ConversationMessage` | 待评估 |
| 自定义 composer | 无稳定对应物 | 否，先保留 |

### 2.2 页面优先级

按收益排序：

1. `SettingsView.tsx`
2. `AgentDetail.tsx`
3. shell (`ActivityBar`, `Sidebar`)
4. onboarding / invite
5. runtimes / 其他简单页面
6. chat（最后；仅迁移有明确对应物的部分）

---

## Phase 3 — Shell 迁移

涉及文件：

- `components/layout/AppLayout.tsx`
- `components/layout/ActivityBar.tsx`
- `components/layout/Sidebar.tsx`
- `components/layout/DevPanel.tsx`

### 3.1 目标

将以下部分迁移到 ui-web：

- 主导航按钮 → `ActivityBar` / `NavItem`
- workspace switcher 菜单 → `DropdownMenu`
- section sidebar 导航项 → `Sidebar` + `InteractiveRow` / `NavItem`
- 主内容区滚动容器 → `ScrollArea` / 统一内容 wrapper

### 3.2 可保留项

以下属于 Electron / app-shell 特定能力，可本次保留局部自定义：

- `drag-region` 顶部占位
- workspace avatar 的 domain-specific 展示逻辑
- DevPanel 中如无 ui-web 对应物的调试 UI

### 3.3 允许新增的本地 wrapper

- `SlarkWindowChrome`
  - 理由：封装 Electron `drag-region` / `no-drag`
- `SlarkWorkspaceSwitcher`
  - 理由：组合 `DropdownMenu` + workspace avatar/name/current state
- `SlarkSectionSidebar`
  - 理由：组合 sidebar 标题、scroll container、nav rows

禁止新增：

- 仅包一层 `PageHeader` 的 wrapper
- 仅包一层 `InteractiveRow` 的 wrapper

---

## Phase 4 — Settings 迁移（最高优先级页面）

涉及文件：`components/settings/SettingsView.tsx`

这是第一优先级最高的页面，因为 ui-web 已有大量现成对应物，迁移收益最大。

### 4.1 页面结构目标

- outer: `h-full overflow-y-auto`
- inner: `max-w-[800px] mx-auto px-4 sm:px-6 pt-2 pb-6 sm:pb-8`
- 顶部使用 `PageHeader density="shell"`
- 内容区 section 统一 `space-y-8`

### 4.2 子模块映射

#### Workspace

- workspace name → `FormField + Input`
- invite members → `FormField + Input + Button`
- pending invites → `Card` / `InteractiveRow`
- members list → `InteractiveRow` / `Card` + `Badge`
- role status → `Badge` / `StatusDot`
- danger zone → `Alert` + `ConfirmDialog`

#### Appearance

- theme 选择 → `RadioGroup` 或 `Tabs` 风格选择器
- 与 `ThemeRoot` / theme store 直接联动

#### Repositories

- 表单区域 → `FormField + Input + Button`
- repo 列表 → `Card` / `InteractiveRow`
- 外链/删除动作 → `Button variant="ghost" | "outline"`
- 空状态 → `EmptyState`

#### Profile

- avatar 行 → `Avatar` + `Button`
- name/email → `FormField + Input`

### 4.3 删除确认弹窗

`DeleteConfirmDialog` 改为 `ConfirmDialog` 或 `Dialog` 组合。

要求：

- 不再手写 fixed overlay
- footer 使用 design-system 默认右对齐
- destructive CTA 使用 `Button variant="destructive"`

---

## Phase 5 — Agents 迁移

涉及文件：

- `components/agents/AgentsView.tsx`
- `components/agents/AgentsSidebar.tsx`
- `components/agents/AgentDetail.tsx`
- `components/agents/AgentsPanel.tsx`
- `components/agents/AgentDetailPanel.tsx`
- `components/agents/CreateAgentDialog.tsx`
- `components/agents/RuntimePicker.tsx`

### 5.1 AgentDetail 映射

| 当前能力 | 目标组件 | 本次是否迁移 |
|---|---|---|
| 顶部 action | `Button` / 轻量 header 组合 | 是 |
| More 菜单 | `DropdownMenu` | 是 |
| Tabs | `Tabs` | 是 |
| Instructions textarea | `FormField + Textarea` | 是 |
| Skills list | `Card` / `InteractiveRow` / `EmptyState` | 是 |
| Settings 表单 | `FormField`, `Input`, `Textarea`, `Select/Combobox`, `Button` | 是 |

### 5.2 RuntimePicker

- runtime 数量小 → `Select`
- 需要搜索/更多 meta → `Combobox`

如果现有交互超出这两者能力，先保留，不强迁。

### 5.3 CreateAgentDialog

统一改为 `Dialog` + `DialogHeader` + `DialogBody` + `DialogFooter`。

---

## Phase 6 — Onboarding / Invite 迁移

涉及文件：

- `components/onboarding/WelcomePage.tsx`
- `components/onboarding/OnboardingFlow.tsx`
- `components/onboarding/CreateWorkspaceStep.tsx`
- `components/onboarding/InviteTeamStep.tsx`
- `components/onboarding/ConnectRuntimeStep.tsx`
- `components/onboarding/CreateAgentStep.tsx`
- `components/invite/InviteLandingPage.tsx`

### 6.1 可迁移部分

| 页面能力 | 目标组件 | 本次是否迁移 |
|---|---|---|
| 整体欢迎/认证 shell | `AuthShell` + `BrandRail` | 是 |
| 邮箱/密码输入 | `FormField` + `Input` | 是 |
| CTA / 返回按钮 | `Button` | 是 |
| 错误提示 | `Alert` / `FormField.error` | 是 |
| 卡片容器 | `Card` | 是 |
| 验证码 6 格输入 | 无稳定对应物 | 否，保留自定义 |
| route-driven 多步骤流程 | `Stepper` | 待评估 |

### 6.2 Stepper 使用条件

只有在 `ui-web` `Stepper` 能与当前 route-driven flow 自然结合时才迁移。

如果只能把它当纯装饰且会增加实现复杂度，则本次保留现有步骤流，仅迁移外层 shell、卡片、按钮、表单。

---

## Phase 7 — Runtimes / 简单页面迁移

涉及文件：

- `components/runtimes/RuntimesView.tsx`
- `components/runtimes/RuntimesSidebar.tsx`
- `components/invite/InviteEmailPreview.tsx`
- `components/layout/DevPanel.tsx`

### 7.1 迁移范围

- runtime 列表/详情优先使用 `Card`, `StatCard`, `DetailPanel`, `InteractiveRow`
- sidebar 统一沿用 shell phase 的 section sidebar 模式
- 如 `InviteEmailPreview` / `DevPanel` 中存在 ui-web 无法覆盖的部分，则保留现有实现

### 7.2 当前保留的 ui-web gap / 复杂视图说明

- `components/runtimes/RuntimesView.tsx`
  - 详情页的整体 shell、详情卡片、linked agents、周期切换、基础 stats 已迁到 `PageHeader` / `Card` / `InteractiveRow` / `StatCard`
  - **保留本地实现**：donut chart、activity heatmap、per-model analytics table
  - 原因：`ui-web` 目前没有可直接承接的 dashboard / heatmap / chart primitives
- `components/invite/InviteEmailPreview.tsx`
  - 保持独立 email-safe markup
  - 原因：邮件预览需要内联样式和脱离应用壳的渲染约束，不适合直接套用 app-level ui-web primitives

---

## Phase 8 — Chat 迁移（仅迁移明确匹配的部分）

涉及文件：

- `components/chat/ChatView.tsx`
- `components/chat/ChatSidebar.tsx`
- `components/chat/MessageList.tsx`
- `components/chat/MessageInput.tsx`
- `components/chat/ContentBlocks.tsx`
- `components/chat/ContentDetailOverlay.tsx`
- `components/chat/CreateChannelDialog.tsx`
- `components/chat/InvitePeopleDialog.tsx`
- `components/chat/MentionPicker.tsx`

Chat 是最后处理的区域，而且不是全量迁移目标。

### 8.1 本次确定迁移的部分

- 频道头部可迁移部分 → `Button` / `Badge` / 统一 header spacing
- chat sidebar → `Sidebar` / `InteractiveRow` / `ScrollArea`
- `CreateChannelDialog` → `Dialog`
- `InvitePeopleDialog` → `Dialog`
- `ContentDetailOverlay` → 若 `Sheet`/`Dialog` 可以承接，则迁移；否则保留

### 8.2 本次必须先做 compatibility check 的部分

在动 `MessageList` 前，先检查 `ConversationMessage` 对以下能力的覆盖度：

- agent / user avatar 展示
- mentions
- reactions
- streaming state
- rich content blocks
- overlay entry points

若覆盖不足，则：

- 本次不迁移 message body
- 保留 Slark 原实现
- 记录为 ui-web gap

### 8.3 Composer 策略

`MessageInput.tsx` 当前包含：

- autosize
- enter 发送
- mention 触发与插入
- focus ring 过渡

ui-web 当前没有明确等价的 chat composer 组件，因此本次：

- **不强制迁移为 ui-web composer**
- 可以仅把发送按钮、popover、局部输入样式向 ui-web 靠拢
- 核心行为逻辑保持现状

允许新增：

- `SlarkComposer`
  - 理由：这是复杂业务交互组件，ui-web 无稳定对应物；该 wrapper 负责保留业务行为，同时尽可能复用 `Button` / `Popover` / token

### 8.4 本轮 review 结论 / 当前保留 gap

- `components/chat/ChatSidebar.tsx`
  - 已将列表区域继续统一到 `ScrollArea` + `InteractiveRow` + `NavigationMenu`，并把删除确认迁到 `Dialog`
  - **保留本地实现**：右键 pin menu
  - 原因：当前是基于指针位置的轻量上下文菜单，`ui-web` 里没有等价的 context-menu primitive
- `components/chat/CreateChannelDialog.tsx`
  - 已迁到 `Dialog` + `FormField` + `Input` + `Button`
- `components/chat/InvitePeopleDialog.tsx`
  - 已继续沿用 `Dialog` 方案，无需额外本地 overlay
- `components/chat/ChatView.tsx`
  - 头部状态徽标统一到 `Badge`
- `components/chat/MentionPicker.tsx`
  - 已将候选列表统一到 `Card` + `ScrollArea` + `InteractiveRow`
  - **保留本地实现**：基于 textarea 光标触发的展示/插入逻辑
  - 原因：`ui-web` 有 popover/list primitives，但没有可直接承接 mention 查询、插入与 selection 管理的现成 composer pattern
- `components/chat/MessageInput.tsx`
  - 已把发送按钮和 token 对齐到 `ui-web Button`
  - **保留本地实现**：autosize textarea、enter-send、draft injection、mention state machine
  - 原因：`FollowUpInput` / `Textarea` 只能覆盖基础输入外观，无法完整承接 Slark composer 行为
- `components/chat/MessageList.tsx`
  - **本次保留原实现**：普通消息气泡、streaming cursor、reactions、时间分组逻辑
  - 原因：`ConversationMessage` 只适合基础 bubble；当前列表还耦合 rich content blocks、agent badge、连续消息布局与 reaction rendering
- `components/chat/ContentBlocks.tsx`
  - **本次保留原实现**：code/file/diff/action/tool-result/approval 等 rich blocks
  - 原因：`ui-web` 暂无可覆盖这组消息级富内容的 primitives / patterns
- `components/chat/ContentDetailOverlay.tsx`
  - **本次保留原实现**：image lightbox、code viewer、diff viewer
  - 原因：虽然有 `Dialog` / `Sheet`，但缺少承接代码查看器、diff viewer 与大图灯箱内容的完整视图 primitives

---

## 本地 wrapper 白名单

仅允许以下 wrapper：

- `SlarkWindowChrome`
- `SlarkWorkspaceSwitcher`
- `SlarkSectionSidebar`
- `SlarkComposer`
- `SlarkSettingsSection`（仅在它真的组合 section title + description + divided rows + actions 时）

不建议新增：

- `SlarkSectionHeader`
- `SlarkListRow`
- 任何仅透传 ui-web props 的 wrapper

路径建议：

- `apps/slark/src/renderer/src/components/slark-ui/*`

---

## 依赖与清理策略

### 目标状态

- 业务层尽量只 import `@nexu-design/ui-web`
- 若 `ui-web` 已封装 Radix，则 Slark 不再直接使用对应 `@radix-ui/*`
- 删除本地重复 `cn()`

### 清理顺序

1. 完成某一页面/区域迁移
2. 搜索该区域是否还直接使用 `@radix-ui/*`
3. 若该依赖在 Slark 中已无直接使用，再从 `apps/slark/package.json` 删除
4. 删除不再使用的本地 primitive / overlay 实现

---

## 建议执行顺序

1. **Workspace 接入**
   - 统一为 pnpm workspace 依赖方式
2. **Token / Theme 基线**
   - 导入 tokens
   - 清理 `globals.css`
   - 接入 `ThemeRoot`
   - 保留 document-level theme init
3. **基础组件替换基线**
   - `Button` / `Input` / `Dialog` / `Tabs` / `FormField` / `DropdownMenu`
4. **Settings**
5. **Agents**
6. **Shell**
7. **Onboarding / Invite**
8. **Runtimes / 简单页面**
9. **Chat（只迁移明确匹配部分）**
10. **依赖清理与 polish**

---

## 每阶段验证要求

### 基础验证

每阶段至少执行：

- 该 app 的安装/构建命令
- 关键页面手动 smoke test

### 最低 smoke test 矩阵

1. onboarding 首屏打开、输入、前进/返回
2. invite 页面打开
3. chat 页面切换频道、发送消息、mention、agent reply
4. agents 页面打开、切 tab、创建 agent、删除 agent
5. runtimes 页面打开
6. settings 页面：
   - invite member
   - 切换 theme
   - add/remove repository
   - delete workspace dialog 打开/关闭
7. workspace switcher 打开/切换

### 视觉回归建议

至少对以下页面做迁移前后截图对比：

- WelcomePage
- SettingsView
- AgentDetail
- ChatView
- ActivityBar + Sidebar shell

---

## 验收标准

### 功能层

1. Slark 主页面仍可正常导航：
   - onboarding
   - invite
   - chat
   - agents
   - runtimes
   - settings
2. 关键交互不中断：
   - workspace switch
   - invite member
   - add/remove repository
   - create/delete agent
   - chat send / mention / agent reply
   - theme switch

### UI 架构层

1. 所有已有 ui-web 对应物的重复 primitive 已迁移。
2. `apps/slark/src/renderer/src` 的 UI 代码主要消费 `@nexu-design/ui-web`。
3. 直接使用 Radix 的场景显著减少。
4. token 来源统一到 ui-web/tokens。
5. 对于 ui-web 没有对应物的复杂区域，已明确保留现状并记录 gap，而不是硬迁移。

### 代码层

1. wrapper 数量可控，且都有明确适配理由。
2. 删除未使用的旧 class / 旧依赖 / 旧自定义 overlay 实现。
3. 没有新增另一套 Slark 本地 primitive 系统。

---

## 结论

这次迁移不是“把所有 Slark UI 强行替换成 ui-web”，而是：

1. 先统一 workspace 接入、token、theme、基础工具
2. 只迁移 ui-web 已有明确对应物的 UI
3. 对复杂但无对应物的部分先保留，不硬迁移
4. 通过分阶段迁移，把 Slark 逐步变成建立在 `ui-web` 之上的产品应用

这样既能减少重复 UI，又能避免为了追求“全量替换”而引入新的风险和重复抽象。
