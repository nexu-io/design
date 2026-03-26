# Nexu 核心组件 API 草案

## 1. 文档目标

本文档定义 `nexu-io/ui` 首批核心组件的 API 草案，作为：

- `packages/ui-web` 实现输入
- Storybook stories 设计依据
- `nexu` 迁移接入参考
- 后续 API review 基线

当前先覆盖 5 个高优先级组件：

1. `Button`
2. `Input`
3. `Dialog`
4. `Card`
5. `FormField`

这些组件的设计需满足：

- 与 Tailwind 灵活协作
- 语义清晰
- 不做业务耦合
- 受控扩展，不走 prop 爆炸

---

## 2. 通用约束

以下约束适用于本文所有组件：

### 2.1 通用能力

- 支持 `className`
- 支持 `data-*` / `aria-*`
- 能透传 `ref` 的组件默认透传
- 交互型 trigger 组件优先支持 `asChild`

### 2.2 样式协作边界

允许业务使用 Tailwind 做：

- 页面布局
- 容器宽高调整
- 响应式控制
- 外层 spacing

不鼓励业务长期通过 `className` 改写：

- 视觉语义
- 组件状态
- 内部结构

### 2.3 变体策略

优先使用：

- `variant`
- `size`
- `tone`

不引入大量布尔型视觉开关。

---

## 3. Button

### 3.1 组件定位

统一 Nexu 的操作入口组件，用于承接：

- 页面主操作
- 次要操作
- ghost/link 级操作
- destructive 操作
- icon-only 操作

### 3.2 API 草案

```ts
type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'outline'
  | 'ghost'
  | 'destructive'
  | 'link'

type ButtonSize = 'sm' | 'md' | 'lg' | 'icon'

type ButtonProps = {
  variant?: ButtonVariant
  size?: ButtonSize
  loading?: boolean
  disabled?: boolean
  asChild?: boolean
  leadingIcon?: React.ReactNode
  trailingIcon?: React.ReactNode
  children?: React.ReactNode
  className?: string
} & React.ButtonHTMLAttributes<HTMLButtonElement>
```

### 3.3 行为约束

- `loading=true` 时默认表现为不可重复触发
- `loading=true` 时应自动禁用点击
- `size='icon'` 时必须支持 icon-only 语义
- icon-only button 必须可传 `aria-label`
- `asChild` 模式下保留 variant / size / state 样式能力

### 3.4 推荐用法

```tsx
<Button variant="primary">Save</Button>

<Button variant="outline" size="sm">Cancel</Button>

<Button variant="ghost" size="icon" aria-label="Open settings">
  <SettingsIcon />
</Button>
```

### 3.5 与 Tailwind 协作示例

```tsx
<Button className="w-full md:w-auto" variant="primary">
  Connect
</Button>
```

### 3.6 暂不支持

- `fullWidth` prop（可先用 `className="w-full"`）
- `isRounded` / `isDark` / `isCompact` 这类布尔样式 props
- 页面语义 prop，如 `isSidebarButton`

---

## 4. Input

### 4.1 组件定位

统一文本输入类基础组件，服务于：

- 普通文本输入
- 密钥/凭证输入
- 搜索输入
- 表单基础字段输入

### 4.2 API 草案

```ts
type InputSize = 'sm' | 'md' | 'lg'

type InputProps = {
  size?: InputSize
  invalid?: boolean
  leadingIcon?: React.ReactNode
  trailingIcon?: React.ReactNode
  inputClassName?: string
  className?: string
} & React.InputHTMLAttributes<HTMLInputElement>
```

### 4.3 设计说明

建议把 `Input` 做成“外层容器 + 内部 input”结构，以便支持：

- icon
- clear button
- password toggle
- 状态边框统一控制

其中：

- `className` 控制外层容器
- `inputClassName` 控制实际 input 元素

### 4.4 行为约束

- `invalid` 只表达视觉和可访问性状态，不承载校验逻辑
- `disabled` / `readOnly` 行为遵循原生 input
- 若有 icon，不应破坏输入焦点和光标体验
- 搜索、密码、token 等更强语义场景，优先在 pattern 层封装，而非直接在 primitive 塞过多 props

### 4.5 推荐用法

```tsx
<Input placeholder="Enter API key" />

<Input invalid aria-invalid="true" />

<Input leadingIcon={<SearchIcon />} className="md:w-80" />
```

### 4.6 暂不支持

- `label` prop
- `errorMessage` prop
- `helpText` prop

这些应交由 `FormField` 承担。

---

## 5. Dialog

### 5.1 组件定位

统一 Nexu 的弹窗/确认/配置类对话框基础设施。

### 5.2 组件结构建议

建议导出组合式 API：

```tsx
<Dialog>
  <DialogTrigger />
  <DialogContent>
    <DialogHeader>
      <DialogTitle />
      <DialogDescription />
    </DialogHeader>
    <DialogFooter />
  </DialogContent>
</Dialog>
```

### 5.3 API 草案

```ts
type DialogProps = {
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  modal?: boolean
  children?: React.ReactNode
}

type DialogContentProps = {
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
  closeOnOverlayClick?: boolean
  className?: string
  children?: React.ReactNode
}
```

### 5.4 行为约束

- 支持受控和非受控模式
- 默认 trap focus
- 默认支持 `Esc` 关闭
- 默认支持 overlay click 关闭，但应可配置
- `DialogContent` 的 size 负责常见宽度语义，不要求页面反复写 `max-w-*`
- 页面仍可通过 `className` 做宽度与布局微调

### 5.5 推荐用法

```tsx
<Dialog open={open} onOpenChange={setOpen}>
  <DialogContent size="md">
    <DialogHeader>
      <DialogTitle>Connect channel</DialogTitle>
      <DialogDescription>
        Add credentials and finish channel setup.
      </DialogDescription>
    </DialogHeader>
  </DialogContent>
</Dialog>
```

### 5.6 不推荐

- 把表单字段直接塞到 `Dialog` 根组件 props 里
- 增加 `type="confirm" | "form" | "wizard"` 这类过重语义
- 暴露过多内部 class hooks

更强语义的确认弹窗应在 pattern 层做 `ConfirmDialog`。

---

## 6. Card

### 6.1 组件定位

统一承载信息块、设置块、摘要块和列表项容器。

### 6.2 组件结构建议

优先使用组合式子组件：

```tsx
<Card>
  <CardHeader />
  <CardContent />
  <CardFooter />
</Card>
```

### 6.3 API 草案

```ts
type CardProps = {
  variant?: 'default' | 'outline' | 'muted' | 'interactive'
  padding?: 'none' | 'sm' | 'md' | 'lg'
  className?: string
  children?: React.ReactNode
}

type CardSectionProps = {
  className?: string
  children?: React.ReactNode
}
```

### 6.4 行为约束

- `Card` 是结构容器，不承担路由、数据请求或业务事件
- `interactive` variant 仅表达交互式 surface 样式，不等于可点击业务卡片逻辑
- 若卡片整体可点击，优先通过 `asChild` 或外部链接/按钮组合处理
- 不用 `title` / `description` / `footer` 一类 props 替代组合结构

### 6.5 推荐用法

```tsx
<Card variant="default" padding="md">
  <CardHeader>
    <SectionHeader title="Slack" />
  </CardHeader>
  <CardContent>
    <p>Connect your Slack workspace.</p>
  </CardContent>
  <CardFooter>
    <Button size="sm">Connect</Button>
  </CardFooter>
</Card>
```

### 6.6 与 Tailwind 协作示例

```tsx
<Card className="grid gap-4 md:grid-cols-[1fr_auto]">
  ...
</Card>
```

### 6.7 暂不支持

- `clickable` prop
- `selected` prop
- `href` prop

这些语义在不同业务中差异很大，先由业务或 pattern 层处理。

---

## 7. FormField

### 7.1 组件定位

作为 pattern 组件，统一封装表单字段的：

- label
- description
- control slot
- error message
- required / invalid 状态展示

### 7.2 组件结构建议

推荐组合式 API：

```tsx
<FormField>
  <FormFieldLabel />
  <FormFieldControl>
    <Input />
  </FormFieldControl>
  <FormFieldDescription />
  <FormFieldError />
</FormField>
```

同时可以提供一个轻量快捷 API，适用于简单场景。

### 7.3 API 草案

```ts
type FormFieldProps = {
  label?: React.ReactNode
  description?: React.ReactNode
  error?: React.ReactNode
  required?: boolean
  invalid?: boolean
  orientation?: 'vertical' | 'horizontal'
  className?: string
  children: React.ReactNode
}

type FormFieldControlProps = {
  className?: string
  children: React.ReactNode
}
```

### 7.4 行为约束

- `FormField` 负责字段结构和可访问性关联
- 不负责表单状态管理
- 不耦合任何 form library
- 能兼容 React Hook Form、Formik 或纯手写状态
- `invalid` 与 `error` 状态应自动映射到相应 `aria-*` 关系

### 7.5 推荐用法

```tsx
<FormField
  label="API Key"
  description="Stored locally on your machine."
  error={errorMessage}
  invalid={Boolean(errorMessage)}
>
  <Input placeholder="sk-..." />
</FormField>
```

### 7.6 扩展建议

后续可在 pattern 层继续派生：

- `SecretField`
- `SearchField`
- `CredentialsFieldGroup`

而不是把所有特殊能力都堆回 `Input`。

---

## 8. 组件间协作关系

建议的依赖方向：

```text
Button/Input/Dialog/Card  -> primitive
FormField                 -> pattern（依赖 Input/Label/Description/Error）
ConfirmDialog             -> pattern（依赖 Dialog + Button）
SettingsSection           -> pattern（依赖 Card + SectionHeader + FormField）
```

约束：

- primitive 不能依赖 pattern
- pattern 可以依赖 primitive
- feature 组件可以依赖两者

---

## 9. 第一阶段实现优先级

建议落地顺序：

1. `Button`
2. `Input`
3. `Card`
4. `Dialog`
5. `FormField`

原因：

- `Button` / `Input` 替换面最大
- `Card` / `Dialog` 能迅速消灭高频重复结构
- `FormField` 能减少大量表单拼装代码

---

## 10. 验收标准

每个核心组件至少满足：

### Button

- 有完整 variant / size stories
- 支持 loading / disabled / icon-only
- a11y 行为正确

### Input

- 支持 invalid 状态
- 支持 icon 场景
- 焦点/边框状态稳定

### Dialog

- 支持 controlled / uncontrolled
- 焦点锁定与关闭行为正确
- 尺寸语义明确

### Card

- 子结构清晰
- 支持基础 padding / variant
- 能与页面 Tailwind 布局自然配合

### FormField

- label / description / error 关联正确
- 可适配 Input / Select / Textarea / Switch
- 不耦合表单库

---

## 11. 结论

首批核心组件的 API 设计应遵循一个统一方向：

- primitive 保持短小、稳定、可组合
- pattern 负责结构复用，不负责业务逻辑
- Tailwind 负责页面布局与局部编排
- 重复出现的页面级覆盖，要及时回流为 variant、slot API 或 pattern

这 5 个组件一旦稳定，`nexu` 中的大部分基础 UI 重构就可以开始有节奏地推进。
