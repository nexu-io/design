# Icon Library — 设计系统图标来源

## Figma 设计稿图标库（唯一权威来源）

设计稿中使用的图标来自 Figma Community 免费库：

| 项目 | 说明 |
|------|------|
| **名称** | ✕ Untitled UI Icons – 1-100 essential (Figma icons, Community) |
| **链接** | [Figma: Untitled UI Icons 1-100 essential](https://www.figma.com/design/nVKpObpC2UXEaXHCfdeKIk/%E2%9D%96-Untitled-UI-Icons-%E2%80%93-1-100--essential-Figma-icons--Community-?node-id=181-128951&t=6oiFqgbkpteDwoQZ-1) |
| **类型** | Community 免费库 |
| **用途** | 设计稿、原型、与开发对齐的图标语义与风格 |

- 设计侧：在 Figma 中直接使用该库中的图标，保证与本文档链接一致、版本可追溯。
- 开发侧：代码中可使用 Lucide / Heroicons 等实现同语义图标，风格上尽量与 Untitled UI（简洁线型/面型）保持一致。

## 使用规范

### 尺寸
- **导航/列表**：16×16 px（1x），或 24×24 用于强调。
- **按钮内图标**：16×16 或 20×20。
- **空状态/插画位**：24×24 或 32×32。

### 颜色（与设计系统 token 对齐）
- 默认：`text-text-secondary` 或 `text-text-primary`。
- 悬停：`text-text-primary` 或 `text-accent`。
- 禁用：`text-text-muted`。
- 强调/主操作：`text-accent` 或 `text-clone`（按场景选用）。

### 风格
- 线型（outline）与面型（solid）二选一或按组件规范统一；同一层级内保持一致。
- 线宽：1.5px 或 2px，与 Figma 库内设定保持一致便于还原。

## 与代码实现的对应

| 场景 | Figma | 代码（建议） |
|------|--------|--------------|
| 设计稿 | Untitled UI Icons（本库） | Lucide React / Heroicons |
| 一致性 | 以 Figma 图标语义与布局为准 | 选同语义图标，尺寸/颜色用设计系统 token |

新增图标时，优先在 Figma 本库中选用并注明名称/节点，开发时对齐语义与尺寸。

## Related

- [Icons Page](../src/pages/IconsPage.tsx) — 设计系统内 Icons 页（链接与使用规范）
- [Colors](../src/index.css) — 色板与 token
- [Components](../src/pages/ComponentsPage.tsx) — 按钮、Badge 等组件中的图标用法
- [Design System Overview](../src/pages/OverviewPage.tsx)
