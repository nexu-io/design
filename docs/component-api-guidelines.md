# Nexu 组件 API 约束规范

## 1. 文档目标

本文档定义 `nexu-io/design` 组件库的 API 设计约束，用于确保：

- 组件 API 一致
- 组件可组合但不过度自由
- 能与 Tailwind 灵活配合
- 不因短期需求导致 prop 膨胀
- 迁移 `nexu` 现有 UI 时有统一判断标准

适用范围：

- `packages/ui-web` 下所有 primitive
- `packages/ui-web` 下所有 pattern
- 后续新增共享组件

---

## 2. 总体原则

组件 API 设计遵循以下原则：

1. **语义优先于样式**
2. **组合优先于 prop 爆炸**
3. **一致性优先于局部方便**
4. **默认可用，按需扩展**
5. **页面灵活性通过 Tailwind 与组合实现，不通过无限制 props 实现**
6. **重复 3 次以上的页面级覆盖，应回流组件库**

---

## 3. 组件分级与 API 稳定性

### 3.1 Primitive

例如：`Button`、`Input`、`Dialog`、`Card`

要求：

- API 尽量稳定
- 可作为其他 pattern 的基础
- 不携带业务语义
- 变体必须受控

### 3.2 Pattern

例如：`FormField`、`SettingsSection`、`EmptyState`

要求：

- 语义比 primitive 更强
- 可封装多元素结构
- 只暴露必要扩展点
- 不承载具体业务请求或路由逻辑

### 3.3 Feature 组件

例如：`ChannelConnectModal`

要求：

- 不纳入共享 API 规范范围
- 可以消费 shared component
- 不应反向定义 shared primitive 的 API

---

## 4. 统一 Props 规范

### 4.1 所有共享组件默认支持的通用 props

除非明确不适用，共享组件应优先支持以下通用能力：

- `className`
- `children`
- `data-*`
- `aria-*`
- `asChild`（适用于按钮、链接触发器、交互容器等）

说明：

- `className` 用于外层布局与轻量扩展
- `asChild` 用于与语义元素或路由组件组合
- 不要求所有组件都支持 `asChild`，但能从中受益的组件应支持

### 4.2 `ref` 透传

Primitive 默认应使用 `forwardRef` 或等价能力透传底层 ref。

适用组件：

- Button
- Input
- Textarea
- Select trigger
- Dialog trigger
- Tabs trigger

### 4.3 `className` 的使用边界

`className` 允许用于：

- 外层布局
- 宽高微调
- 响应式控制
- 间距调整
- 页面级组合

`className` 不应成为以下能力的主要实现方式：

- 新视觉 variant
- 新尺寸语义
- 新状态语义
- 大规模内部结构覆盖

如果某个 `className` 覆盖重复出现，应提升为：

- `variant`
- `size`
- slot class API
- 新 pattern

---

## 5. 命名约束

### 5.1 组件名

Primitive 使用通用名词：

- `Button`
- `Input`
- `Dialog`
- `Card`

Pattern 使用结构/意图命名：

- `EmptyState`
- `SectionHeader`
- `SettingsSection`

禁止：

- `CommonButton`
- `BaseCard2`
- `CustomDialog`
- `FancyInput`

### 5.2 Props 命名

优先使用行业常见命名：

- `variant`
- `size`
- `tone`
- `disabled`
- `loading`
- `open`
- `defaultOpen`
- `onOpenChange`

避免：

- `typeStyle`
- `modeType`
- `big`
- `smallMode`
- `isRed`
- `isPrimaryStyle`

---

## 6. 变体设计规范

### 6.1 允许的核心维度

共享组件的视觉变化优先收敛为以下维度：

- `variant`
- `size`
- `tone`
- `orientation`
- `placement`（仅确有必要时）

### 6.2 不推荐的维度

避免增加大量布尔型样式开关：

- `isCompact`
- `isRounded`
- `isDark`
- `isDangerStyle`
- `withShadow`
- `isMarketing`

如果多个布尔组合表达的是一组固定样式，应改为单一枚举型 prop。

例如：

```tsx
// 不推荐
<Button isRounded isCompact isDangerStyle />

// 推荐
<Button variant="destructive" size="sm" />
```

### 6.3 何时新增 variant

只有满足以下条件时才新增 variant：

1. 出现于 3 个以上真实场景
2. 有清晰语义，不只是临时视觉差异
3. 不会破坏现有变体体系
4. 不是页面局部 hack

---

## 7. 状态设计规范

共享组件必须优先定义语义状态，而不是让页面自行拼接状态样式。

常见状态包括：

- default
- hover
- active
- focus-visible
- disabled
- loading
- selected
- invalid

约束：

1. 状态行为必须可预测
2. 状态切换不依赖页面额外 class hack
3. loading 与 disabled 的行为关系要一致
4. focus-visible 必须统一

---

## 8. 受控与非受控 API 规范

所有交互型共享组件应优先采用常见 React 模式。

### 8.1 受控/非受控双模式

适用于：

- Dialog
- Sheet
- Tabs
- Accordion
- Select（视实现而定）

优先模式：

- `open` + `onOpenChange`
- `value` + `onValueChange`
- `defaultOpen`
- `defaultValue`

### 8.2 命名一致性

禁止在不同组件中发明不同但本质相同的命名，例如：

- 一个组件用 `visible`
- 一个组件用 `isOpen`
- 一个组件用 `show`

应统一到：

- `open`
- `onOpenChange`

---

## 9. Slot 与组合规范

### 9.1 优先组合，不优先配置

如果一个组件可以通过组合实现，就不要优先增加大量 props。

例如：

```tsx
<Card>
  <CardHeader />
  <CardContent />
  <CardFooter />
</Card>
```

优于：

```tsx
<Card
  title="..."
  description="..."
  footer="..."
  showDivider
  noPadding
/>
```

### 9.2 何时暴露 slot class API

仅当组件内部存在稳定结构层，并且业务确实需要有限定制时，允许增加：

- `headerClassName`
- `contentClassName`
- `footerClassName`

禁止：

- 为每个内部元素都暴露 className
- 暴露过深结构的选择器入口

### 9.3 不推荐 `unstyled` 作为默认逃生口

共享组件的职责是提供一致性。

除非是极少数组件，不建议提供：

- `unstyled`
- `bare`
- `raw`

否则组件库会退化成一层无意义包装。

---

## 10. 与 Tailwind 的协作约束

组件库允许并鼓励与 Tailwind 结合，但边界必须明确。

### 推荐

- 用组件表达语义和交互
- 用 Tailwind 处理页面布局和响应式
- 用 `className` 做轻量外层调整

例如：

```tsx
<div className="flex items-center gap-3 md:gap-4">
  <Input className="md:w-80" />
  <Button variant="primary">Save</Button>
</div>
```

### 不推荐

- 用大量 Tailwind 覆盖组件的主题语义
- 用选择器 hack 改内部 slot
- 反复复制同一组 className 覆盖

例如：

```tsx
<Button className="rounded-[18px] bg-[#151515] px-7 hover:bg-[#222]" />
```

如果上述覆盖重复出现，应回流组件库。

---

## 11. 可访问性 API 约束

共享组件的 API 不能破坏基础可访问性。

要求：

1. icon-only button 必须支持 `aria-label`
2. 表单组件必须能与 label / description / error message 正确关联
3. dialog / popover / menu 组件不得破坏键盘导航
4. 禁止通过 API 让业务层轻易绕过 focus-visible 或 disabled 语义

---

## 12. 事件 API 约束

事件命名应遵循 React 与业界约定。

推荐：

- `onClick`
- `onValueChange`
- `onOpenChange`
- `onSelect`
- `onCheckedChange`

避免：

- `onBtnClick`
- `handleChange`
- `whenOpenChanged`
- `clickHandler`

组件导出的 API 应描述“事件契约”，不是内部实现。

---

## 13. 不允许的 API 反模式

以下情况默认不允许进入 shared component：

### 13.1 Prop 爆炸

```tsx
<Button
  primary
  rounded
  withShadow
  compact
  darkModeStyle
  danger
/>
```

### 13.2 业务耦合 prop

```tsx
<Dialog trackEvent="channel_connect_modal_open" apiEndpoint="/api/connect" />
```

### 13.3 页面语义 prop

```tsx
<Card isHomepageHero isBillingCard isSlackVariant />
```

### 13.4 结构泄漏

```tsx
<Dialog bodyWrapperClassName="..." innerContentClassName="..." closeIconWrapperClassName="..." />
```

如果需要暴露这么多结构入口，通常说明组件抽象层级错了。

---

## 14. 新组件提案检查清单

新增共享组件前，必须先回答：

1. 它是 primitive 还是 pattern？
2. 是否已有组件可以扩展？
3. 是否已有 3 个以上复用场景？
4. 是否能用组合替代新增 props？
5. 是否会引入业务耦合？
6. 是否支持 Tailwind 外层布局协作？
7. 是否满足可访问性基线？
8. 是否有 story 和基础测试？

---

## 15. 推荐 API 示例

### Button

```ts
type ButtonProps = {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive' | 'link'
  size?: 'sm' | 'md' | 'lg' | 'icon'
  loading?: boolean
  disabled?: boolean
  asChild?: boolean
  className?: string
}
```

### Dialog

```ts
type DialogProps = {
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  children?: React.ReactNode
}
```

### EmptyState

```ts
type EmptyStateProps = {
  title: string
  description?: string
  action?: React.ReactNode
  icon?: React.ReactNode
  className?: string
}
```

这些示例体现的方向是：

- API 短
- 语义清楚
- 扩展点有限
- 与 Tailwind 可协作

---

## 16. 结论

Nexu 组件库的 API 设计应保持在一个平衡点：

- 不能僵硬到无法结合 Tailwind 使用
- 也不能自由到退化成“带默认样式的 div 集合”

最终原则是：

> **共享组件提供稳定语义、状态和结构；页面通过组合与 Tailwind 获得灵活性；重复的页面级覆盖必须回流组件库。**
