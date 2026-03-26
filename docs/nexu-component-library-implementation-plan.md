# Nexu 组件库实现规划

## 1. 背景

目标是在 `~/Projects/nexu-io/ui` 建立一套可持续演进的组件库，用来逐步承接 `~/Projects/nexu-io/nexu` 里的 UI 重构工作，减少：

- 裸用 `shadcn/ui`
- 页面内联 Tailwind 拼装
- 零散自定义 CSS
- 重复的 modal / card / form / layout 实现

当前 `nexu` 的问题大致是：

- `apps/web/src/components/ui/*` 已有一层 shadcn-style primitive，但实际使用率不高
- 大量页面仍直接写 `<button>` / `<input>` / 自定义 modal shell
- 通用视觉规则散落在 `apps/web/src/index.css`、页面样式和 feature 组件中
- `apps/desktop` 还有一套独立 UI，不适合立刻强行合并

因此，`ui` 仓库的职责不是“复制一份现有 UI”，而是提供一个新的、分层清晰的组件体系，作为后续迁移的目标平台。

---

## 2. 目标与非目标

### 目标

1. 提供 Nexu 的统一 design token 层
2. 提供一套可复用的 web 组件 primitive 层
3. 提供跨页面高频复用的 pattern 组件层
4. 为 `nexu/apps/web` 提供可渐进迁移的目标组件库
5. 让 `apps/desktop` 先共享 token，再决定是否逐步共享组件
6. 建立组件命名、分层、测试、文档和治理机制

### 非目标

1. 一次性重写 `nexu` 全部 UI
2. 一开始就要求 web / desktop 共用完整组件层
3. 把所有长得像的 UI 都抽成共享组件
4. 在共享组件里引入业务逻辑、路由、数据请求或埋点
5. 从零自研一套替代 Radix 的底层交互系统

---

## 3. 推荐目标架构

建议在 `ui` 仓库内部建立四层架构：

### Layer 1: Tokens

统一视觉变量，作为所有组件的基础。

包含：

- 颜色
- 字体
- 字号
- spacing
- radius
- shadow
- border
- z-index
- motion
- light / dark theme semantic mapping

### Layer 2: Primitives

基于 Radix / 原生元素的低层可访问组件。

例如：

- Button
- Input
- Textarea
- Select
- Checkbox
- RadioGroup
- Switch
- Dialog
- Sheet
- Tooltip
- Popover
- Card
- Badge
- Tabs
- Separator
- Skeleton

### Layer 3: Patterns

由多个 primitive 组合而成、跨页面复用的结构组件。

例如：

- FormField
- ConfirmDialog
- EmptyState
- PageHeader
- SectionHeader
- SettingsSection
- SecretField
- AuthLayout
- SearchBar
- FilterBar
- CenteredStatusCard

### Layer 4: Feature Adapters

不把业务组件放进 `ui` 仓库，但允许在文档层定义推荐接入方式。

例如：

- `ChannelConnectModal`
- `ImportSkillModal`
- `CommunitySkillCard`
- `ActivityFeed`

这些仍保留在 `nexu` 内部，只消费 `ui` 仓库输出的 tokens / primitives / patterns。

---

## 4. 仓库结构建议

建议 `ui` 仓库初始化为：

```text
ui/
  docs/
    nexu-component-library-implementation-plan.md
  packages/
    tokens/
      src/
        index.css
        colors.css
        typography.css
        spacing.css
        radius.css
        motion.css
    ui-web/
      src/
        primitives/
        patterns/
        hooks/
        lib/
        index.ts
  apps/
    storybook/
  tooling/
    eslint/
    typescript/
```

说明：

- `packages/tokens`：共享视觉基础
- `packages/ui-web`：Web 组件库主包
- `apps/storybook`：组件展示、可视回归、交互验证
- `tooling/*`：lint、TSConfig、共享构建配置

---

## 5. 组件分层边界

### 应进入 `ui` 仓库的内容

- design tokens
- 可访问基础控件
- 通用 layout shell
- 通用 empty/loading/error state
- 通用 form 结构
- 通用导航与页面结构组件

### 不应进入 `ui` 仓库的内容

- 带数据请求的组件
- 带路由语义的组件
- feature-specific 业务组件
- 强视觉定制且单次使用的页面片段
- 与 desktop 外壳强耦合的组件

### 提升为共享组件的标准

至少满足以下条件中的大部分：

1. 在 3 个以上独立场景重复出现
2. 交互语义稳定
3. 不依赖某个业务域模型
4. 可以在不引入大量 escape hatch 的情况下抽象

---

## 6. 设计 Token 规划

### 6.1 Token 原则

1. 使用 semantic token，而不是直接暴露品牌色常量驱动业务组件
2. token 先服务“意图”，再服务“视觉值”
3. shared component 禁止直接写 raw hex / arbitrary color
4. dark mode 通过 token 切换，不在组件里堆大量 `dark:*`

### 6.2 建议 token 分类

#### Surface

- `--background`
- `--foreground`
- `--card`
- `--card-foreground`
- `--popover`
- `--popover-foreground`

#### Action

- `--primary`
- `--primary-foreground`
- `--secondary`
- `--secondary-foreground`
- `--accent`
- `--accent-foreground`
- `--destructive`
- `--destructive-foreground`

#### Feedback

- `--success`
- `--warning`
- `--info`

#### Structure

- `--border`
- `--input`
- `--ring`

#### Radius / Shadow / Motion

- `--radius-xs`
- `--radius-sm`
- `--radius-md`
- `--radius-lg`
- `--shadow-xs`
- `--shadow-sm`
- `--shadow-md`
- `--duration-fast`
- `--duration-normal`
- `--ease-standard`

### 6.3 Token 来源

第一阶段以 `nexu/apps/web/src/index.css` 中现有的可复用 token 为输入，整理后迁移到 `ui/packages/tokens`。

迁移时要区分：

- **共享 token**：进入 `ui`
- **页面私有 utility class**：先留在 `nexu`

---

## 7. Primitive 组件规划

### 7.1 P0 必做组件

首批组件：

- Button
- IconButton
- Input
- Textarea
- Select
- Checkbox
- RadioGroup
- Switch
- Label
- Card
- Badge
- Dialog
- Sheet
- Tabs
- Tooltip
- Popover
- Separator
- Skeleton
- Spinner

### 7.2 Primitive API 原则

每个 primitive 必须具备：

1. 稳定 API
2. 明确的 variant / size 定义
3. 完整交互状态
4. 可访问性默认正确
5. 不耦合业务语义

例如 Button 建议至少支持：

- `variant`: `primary | secondary | outline | ghost | destructive | link`
- `size`: `sm | md | lg | icon`
- `loading`
- `disabled`

统一状态规范：

- default
- hover
- active
- focus-visible
- disabled
- loading
- invalid（适用时）

### 7.3 技术原则

1. 底层优先复用 Radix / shadcn 思路，不重复发明可访问性交互
2. 统一通过 `cva` 或等价方案管理变体
3. 统一 `cn()` 合并策略
4. 禁止页面直接在 primitive 外再套一层匿名“定制按钮组件”

---

## 8. Pattern 组件规划

### 8.1 首批 pattern 候选

基于 `nexu` 现状，建议优先落这些：

- FormField
- FieldGroup
- SecretField
- ConfirmDialog
- EmptyState
- PageHeader
- SectionHeader
- SettingsSection
- CenteredStatusCard
- AuthLayout
- SearchBar
- FilterBar

### 8.2 来源页面

这些 pattern 预计来自以下高重复区域：

- auth / invite / claim / bind 流程
- integrations / channels 配置流程
- sessions / workspace 面板
- models / settings 表单区块

### 8.3 提升规则

Pattern 不应该因为“看起来差不多”就抽。

只有在以下条件成立时再抽：

- 结构相同
- 交互相同
- 语义接近
- 变体数量可控

---

## 9. 文档与 Storybook 规划

`ui` 仓库需要把“组件代码”和“组件说明”一起建设。

### 9.1 Storybook 用途

用于：

- 展示 primitive / pattern
- 查看 light / dark theme
- 校验 responsive 行为
- 做 visual regression
- 给 `nexu` 业务接入方提供示例

### 9.2 每个组件文档至少包含

1. 用途
2. 何时使用 / 何时不要使用
3. Props/API
4. Variants
5. 可访问性要求
6. 示例代码
7. 与 `nexu` 现有页面的映射关系

---

## 10. 实施阶段规划

### Phase 0：初始化 `ui` 仓库基础设施

目标：把 `ui` 从空仓库搭成可开发状态。

任务：

1. 初始化 monorepo 基础结构
2. 建立 `packages/tokens`
3. 建立 `packages/ui-web`
4. 建立 Storybook app
5. 建立 eslint / tsconfig / build 配置
6. 定义 package export 规范

阶段产出：

- 可运行的组件库工程
- 可预览的 Storybook
- 基础 lint / typecheck / build pipeline

---

### Phase 1：抽取并稳定 Tokens

目标：先把共享视觉系统建立好。

任务：

1. 从 `nexu` 提取现有共享 token
2. 清理硬编码色值与不必要 utility 偏差
3. 建立 light / dark token 映射
4. 在 Storybook 中验证 token 表现

退出标准：

- `ui/packages/tokens` 成为唯一共享 token 来源
- `nexu` 可试接入 tokens

---

### Phase 2：构建 P0 Primitives

目标：建立第一批可投入使用的基础组件。

任务：

1. 对照 `nexu/apps/web/src/components/ui/*` 做 API 审核
2. 在 `ui/packages/ui-web` 重建统一 primitive
3. 为每个 primitive 编写文档和 stories
4. 为关键组件补测试

退出标准：

- Button/Input/Dialog/Card 等完成可用版本
- Storybook 中可完整演示
- 新页面接入成本可接受

---

### Phase 3：构建高频 Patterns

目标：解决跨页面重复结构问题。

任务：

1. 从 `nexu` 高重复区域提炼 pattern
2. 建立 pattern API
3. 验证 pattern 是否真能减少样板代码
4. 输出迁移示例

退出标准：

- 至少落地 5~8 个高价值 pattern
- auth / settings / integration 中有真实接入样例

---

### Phase 4：对接 `nexu` 迁移

目标：让 `ui` 仓库成为真实消费依赖，而不是孤立设计系统。

推荐迁移顺序：

1. auth / onboarding
2. integrations / channels
3. workspace / sessions
4. models / settings
5. 其他稳定页面

迁移原则：

- 不搞 big-bang rewrite
- 采用 boy-scout rule：页面被改动时顺手迁移附近重复 UI
- net-new UI 必须优先使用 `ui` 仓库输出

---

### Phase 5：治理与收口

目标：防止新体系继续退化。

任务：

1. 在 `nexu` 中弃用旧 UI 路径
2. 增加 lint 规则，阻止重复造 primitive
3. 限制共享层硬编码样式
4. 增加 CODEOWNERS
5. 建立组件变更评审机制

退出标准：

- 共享 UI 的新增都通过 `ui` 仓库发生
- `nexu` 内重复实现持续下降

---

## 11. 迁移策略（针对 nexu）

### 优先迁移区域

1. 表单与连接流程
2. 通用 Card / Section / Header
3. Empty State / Loading / Status
4. Modal / Confirm / Dialog
5. Sidebar / Workspace 基础结构

### 暂缓区域

1. 强营销视觉页面
2. 只有一个消费者的复杂业务组件
3. desktop 独占且强壳层耦合的交互组件

### 临时策略

在 `nexu` 接入时允许：

- 临时 re-export
- 临时 adapter wrapper
- 渐进式替换 `components/ui/*`

但不允许长期双轨维护同类 primitive。

---

## 12. 测试与质量保障

### 12.1 基础测试

- typecheck
- lint
- build
- Vitest + RTL

### 12.2 组件测试

- keyboard navigation
- focus management
- disabled / loading / error states
- axe 可访问性检查

### 12.3 可视回归

- Button
- Input
- Dialog
- Card
- Badge
- EmptyState
- SettingsSection

### 12.4 集成验证

在 `nexu` 中挑选一批真实页面作为迁移验证样板：

- auth flow
- channel connect
- integrations settings
- session/workspace surface

---

## 13. 治理机制

必须在 `ui` 仓库建立明确治理规则。

---

## 13A. 组件库与 Tailwind 的协作原则

组件库的目标不是替代 Tailwind，而是为 Tailwind 提供稳定、可复用、有语义的 UI 基座。

因此，推荐采用：

> **组件负责语义、结构、状态和一致性；页面继续使用 Tailwind 负责布局、编排、响应式和局部组合。**

### 13A.1 允许灵活结合 Tailwind

`ui` 仓库输出的 primitive 和 pattern 默认应支持：

- `className`
- 必要时的 slot class API，例如：
  - `headerClassName`
  - `contentClassName`
  - `footerClassName`
- 对需要语义透传的组件支持 `asChild`

这意味着业务侧可以继续这样写：

```tsx
<div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
  <PageHeader title="Integrations" />
  <Button size="sm">Add integration</Button>
</div>
```

或：

```tsx
<Card className="mt-6 w-full md:max-w-xl">
  <SettingsSection title="API Key" />
</Card>
```

### 13A.2 Tailwind 的推荐使用边界

推荐把 Tailwind 主要用在以下场景：

1. 页面布局
2. 容器间距
3. 栅格与 flex 编排
4. 响应式控制
5. 页面级显隐切换
6. 少量非语义的局部微调

例如：

- `flex`
- `grid`
- `gap-*`
- `px-*` / `py-*`
- `md:*` / `lg:*`
- `hidden` / `block`
- `w-full` / `max-w-*`

### 13A.3 优先使用组件 API，而不是用 Tailwind 覆盖语义样式

以下内容优先通过组件 API 表达：

- 颜色语义
- 尺寸语义
- 状态语义
- 风格变体

也就是说，优先写：

```tsx
<Button variant="destructive" size="sm" />
```

而不是长期依赖：

```tsx
<Button className="bg-red-500 px-2 text-xs" />
```

### 13A.4 允许覆盖，但不鼓励“改坏组件”

允许业务层使用 `className` 做轻量扩展，但不建议频繁覆盖以下内容：

- 主题色
- 圆角体系
- 交互状态
- 内部结构布局
- focus / disabled / loading 行为

如果某种覆盖开始在多个页面重复出现，应升级为：

1. 新 variant
2. 新 size
3. 新 slot API
4. 新 pattern

### 13A.5 Rule of Three for Tailwind overrides

如果同一组 Tailwind 覆盖在 3 个以上页面重复出现，不要继续复制，应做以下决策之一：

- 提升为 primitive variant
- 提升为 pattern component
- 补充 slot class 能力

### 13A.6 推荐的 API 设计约束

为兼顾一致性与灵活性，建议：

1. 所有 primitive 暴露 `className`
2. 复杂 pattern 暴露有限的 slot class API
3. 常用结构组件支持 `asChild` 或 slot 透传
4. 不提供完全 `unstyled` 模式作为默认用法

不推荐把组件库做成“无约束底座”，否则很快会退化成另一层散乱 Tailwind 包装。

### 13A.7 推荐与不推荐示例

推荐：

```tsx
<div className="flex items-center gap-3">
  <Input className="md:w-80" />
  <Button variant="primary">Save</Button>
</div>
```

推荐：

```tsx
<EmptyState className="py-10" title="No sessions yet" />
```

不推荐：

```tsx
<Button className="h-11 rounded-[18px] bg-[#151515] px-7 hover:bg-[#222]" />
```

不推荐：

```tsx
<Dialog className="[&>div>div]:p-0 [&_button]:text-red-500" />
```

### 13A.8 最终原则

最终采用以下协作模型：

- **组件库负责统一**：token、语义、状态、可访问性、基础结构
- **业务页面负责灵活**：布局、组合、响应式、局部编排
- **重复 Tailwind 组合必须回流组件库**：避免长期散落在页面层

### 13.1 评审规则

每个新增组件都要回答：

1. 它属于 primitive、pattern 还是 feature adapter？
2. 是否已有现成组件可以扩展？
3. 是否真的有 3 个以上复用场景？
4. 是否使用 semantic token？
5. 是否满足 accessibility 基线？

### 13.2 禁止项

- 在 shared component 里写业务请求
- 引入过多布尔 props 导致 API 爆炸
- 为单一页面需求创建通用组件
- 在 shared component 中写大量页面级样式 hack
- 在共享层硬编码颜色、尺寸、阴影

### 13.3 推荐规则

- tokens before components
- semantics before visuals
- composition before prop explosion
- extract after proof
- one canonical primitive per role

---

## 14. 成功指标

### 结构指标

- `nexu` 中 `% Button` 来自 `ui`
- `nexu` 中 `% Input` 来自 `ui`
- `nexu` 中 `% Dialog` 来自 `ui`
- `nexu` 中重复 modal shell 数量

### 质量指标

- shared UI a11y 问题数
- visual regression 失败率
- 迁移页面 UI 缺陷数

### 治理指标

- 新增硬编码 token 次数
- 新增重复 primitive 次数
- 未通过文档/测试的共享组件数量

---

## 15. 第一阶段落地清单

建议按以下顺序开工：

1. 初始化 `ui` monorepo
2. 建立 `packages/tokens`
3. 建立 `packages/ui-web`
4. 接入 Storybook
5. 落地首批 P0 primitive
6. 选 1~2 个 `nexu` 页面做迁移样板
7. 再回头抽第一批 pattern

---

## 16. 结论

`nexu-io/ui` 应该承载的是一套**渐进式可迁移的组件库平台**，而不是现有 `nexu` UI 的简单搬运。

推荐路线是：

**tokens → primitives → patterns → nexu 渐进迁移 → 治理收口**

这样可以在不阻断业务迭代的前提下，逐步把 `nexu` 从“裸 shadcn/ui + 自定义 CSS 拼装”演进为真正可维护的组件系统。
