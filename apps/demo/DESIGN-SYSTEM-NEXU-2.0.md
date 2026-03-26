# Nexu 设计系统 2.0 (Refined Edition)

CSS 实现：src/index.css（本文档的 token 值已 1:1 同步到该文件）

> **核心理念**：人文科技 (Humanist Tech)、极致克制、专业生产力。  
> **审美红线**：宁可显得冷淡，不可显得廉价。优先使用间距 (Spacing) 而非色彩来区分层级。

---

## 1. 视觉准则 (Visual Principles)

| # | 准则 | 执行细节 |
|---|------|------|
| 1 | **10% 品牌色原则** | 品牌色 (Brand Teal) 仅限 Logo、主按钮、激活态下划线。禁止大面积铺设背景或装饰。 |
| 2 | **方圆结合** | 大容器（卡片/弹窗）用圆角体现友好；小组件（Tab/Tag/Button）缩紧圆角体现专业感。 |
| 3 | **呼吸感优先** | 标题紧凑（字距收紧），正文舒展（行高放开，增加行间距）。 |
| 4 | **全白 + 分割线层级** | 侧栏与主内容区均为 `surface-1`（纯白），靠极细分割线 `border-subtle` 区分区域。禁止用背景色差做层级。卡片默认带微阴影 `shadow-rest`，hover 升起 `shadow-refine`。 |

---

## 1.5 Logo 规范

> 直接使用图标本身颜色，**不能改色**。

| 文件 | 内容 | 用途 |
|------|------|------|
| `nexu logo-black1.svg` | 图标（深色 ■ #2D2D2D） | 亮色背景：favicon、极小空间 |
| `nexu logo-white1.svg` | 图标（白色） | 暗色背景：favicon、极小空间 |
| `nexu logo-black4.svg` | 横版：图标左 + nexu 文字右（深色） | **亮色背景：侧栏顶部、导航栏、页脚、邮件签名** |
| `nexu logo-white4.svg` | 横版：图标左 + nexu 文字右（白色） | **暗色背景：全局顶栏、Auth 左面板** |
| `nexu logo-black2.svg` / `white3.svg` | 纯文字标 | 空间不足时仅显示文字 |

**绝对禁止**：
- **禁止拉伸**：Logo 必须保持原始比例，不允许任何方向的非等比缩放。
- **禁止旋转**：Logo 始终保持水平正向，不允许倾斜或旋转。
- **禁止加投影**：Logo 不允许添加 drop-shadow、box-shadow 或任何阴影效果。
- **禁止改色**：直接使用 SVG 原始颜色。不允许填充品牌色、渐变或任何自定义颜色。
- **禁止用字体模拟文字标**："nexu" 文字必须使用 SVG 文字标文件（`nexu logo-black.svg` 等），不允许用 Manrope 或任何字体手写拼出。侧栏 Logo 区域应使用「图标 + nexu 文字标」SVG。

**推荐高度**（横版 Logo SVG 已裁掉内边距，`height` 即实际内容高度）：

| 场景 | 推荐高度 | 说明 |
|------|---------|------|
| 侧栏顶部 | 24px | 与 13px 导航文字视觉平衡 |
| 全局顶栏（48px 高） | 20px | 顶栏留足上下呼吸感 |
| 页脚 / 邮件签名 | 20–28px | 按版面灵活调节 |
| 纯图标（favicon 等） | 16–24px | 按容器大小适配 |

> 以上为推荐值，可在 ±4px 范围内微调。关键原则：Logo 不应比相邻文字大过多，也不应小到看不清文字标。

**安全间距**：Logo 四周保留至少 **图标高度 × 0.5** 的留白，确保呼吸感。

**最小尺寸**：纯图标最小 16×16px；横版 Logo 最小高度 16px。

---

## 2. 色彩系统 (Color)

### 2.1 品牌色 (Brand Teal)

| Token | 色值 | 用途 |
|-------|------|------|
| `brand-primary` | #3DB9CE | 仅限：Logo、主按钮、激活态图标/下划线、Focus Ring。**禁止用于分割线、边框、背景。** |
| `brand-subtle` | rgba(61, 185, 206, 0.08) | 仅限：Focus Ring 辅助。侧栏选中项**不使用**品牌色背景。 |

### 2.2 背景与表面 (Surface) — 严禁偏色

| Token | 色值 | 用途 |
|-------|------|------|
| `surface-0` | #FAFAFA | 页面底色。禁止带任何青色/蓝色调。 |
| `surface-1` | #FFFFFF | 内容卡片、弹窗背景。 |
| `surface-2` | #F5F5F5 | Hover 态背景、次级列表项背景。 |
| `surface-3` | #EEEEEE | 输入框背景、分割线、Tag 背景。 |

### 2.3 透明度边框 (Alpha Border)

> **高级感核心**：使用透明度让边框自然融入背景。

| Token | 值 | 用途 |
|-------|----|------|
| `border-subtle` | 1px solid rgba(0,0,0,0.06) | 默认边框（卡片、侧栏分割线、区域分隔）。 |
| `border-strong` | 1px solid rgba(0,0,0,0.12) | 关键分割、输入框外框。 |
| `shadow-rest` | 0 1px 3px rgba(0,0,0,0.04) | **卡片默认态**，创造"纸张浮在桌面"的微浮起感。 |
| `shadow-refine` | 0 10px 20px -5px rgba(0,0,0,0.06) | 卡片 Hover 态、弹出层。 |

### 2.4 功能色 (Functional Colors)

> **使用原则**：仅用于明确语义，不用于装饰。

| Token | 色值 | 用途 |
|-------|------|------|
| `error` | #F8672F | 错误状态、表单校验 |
| `error-subtle` | rgba(248,103,47,0.08) | 错误背景 |
| `success` | #346E58 | 成功状态、完成标识 |
| `success-subtle` | rgba(52,110,88,0.08) | 成功背景 |
| `warning` | #EDC337 | 警示状态、待处理 |
| `warning-subtle` | rgba(237,195,55,0.08) | 警示背景 |
| `danger` | #f93920 | 破坏性操作（删除、移除） |
| `danger-subtle` | rgba(249,57,32,0.08) | 危险操作背景 |
| `link` | #2657BB | 链接文字 |
| `info` | #2657BB | 信息提示（与 link 共用） |
| `info-subtle` | rgba(38,87,187,0.08) | 信息背景 |
| `pink` | #D999F7 | 辅助标识（Custom 等，慎用，每屏≤1 处） |

**标签 Tag / Chip**：
| 类型 | 背景 | 文字 | 用途 |
|------|------|------|------|
| 分类标签 | surface-3 | text-tertiary | 分类、Channel 类型、来源 |
| 状态标签 | *-subtle | error / success / warning | Live、Building、Failed、待授权 |
| 强调标签 | surface-3 | text-primary | 平台名、Authorize 等 |
| 辅助标识 | pink/10 | pink | Custom、用户自定义（慎用） |

**禁止**：同一列表内混用多种功能色做分类；非状态不用 success/warning/error。

---

## 3. 文字系统 (Typography)

### 3.1 文字色阶 (Text Color) — 未选中 ≠ 禁用

> **核心区分**：`text-tertiary` 不应用于导航文字。文字色沿用现有中性色或透明度，严禁偏蓝（slate 系）。

| Token | 色值 | 用途 |
|-------|------|------|
| `text-primary` | #1C1F23 | 标题、选中态。保持不变。 |
| `text-secondary` | #545659 (neutral-700) | **未选中导航**、可交互的次要文案。从中性色选更深一层，保持后退感且可读。 |
| `text-tertiary` | #787c80 (neutral-500) | 仅时间戳、极其次要的辅助信息。**禁止用于导航。** |
| `text-disabled` | rgba(28,31,35,0.38) | 真正的禁用态，用透明度保证中性无偏色。 |

### 3.2 字重 (Font Weight) — 严禁混用

- **Semi-bold (600)**: 仅限页面主标题 (H1/H2)、主按钮文字。
- **Medium (500)**: 仅限区块标题 (H3)、导航选中态、表单 Label。
- **Regular (400)**: 绝大多数正文、描述、辅助说明。

### 3.3 字号与排版节奏

| 级别 | 字号 | 字重 | 行高 | 字间距 |
|------|------|------|------|--------|
| **H1/H2 标题** | 18px - 24px | 600 | 1.2 | -0.02em |
| **H3 区块标题** | 14px - 16px | 500 | 1.3 | -0.01em |
| **Body 正文** | 14px | 400 | **1.6** | 0 |
| **Caption 辅助** | 12px | 400 | 1.4 | 0.01em |

---

## 4. 圆角与间距 (Radius & Spacing)

### 4.1 圆角梯队 (Radius)

- **Large (16px)**: 卡片、面板、弹窗容器。（参考 YouMind 更柔和的圆角）
- **Small (6px)**: 按钮、输入框、标签 (Tag)、Tab 项。
- **Full (50%)**: 头像、开关、Pill 按钮。

### 4.2 核心间距 (Spacing)

统一以 **4px** 为步进，禁止使用非倍数数值：

- `spacing-4 / 8 / 12 / 16 / 24 / 32`

---

## 5. 组件精细化规则

### 5.1 按钮 (Button)

- **Primary**: 背景 `text-primary` (#1C1F23), 文字白色, 字重 600。
- **Secondary**: 边框 `border-subtle`, 文字 `text-primary`, 字重 400。
- **Interaction**: 悬浮时位移 `translate-y: -1px` 并触发 `shadow-refine`。

### 5.2 输入框 (Input)

- **精细化效果**: 增加内阴影 `inset 0 1px 2px rgba(0,0,0,0.02)` 以增加下沉质感。
- **状态**: Focus 时边框变为 `brand-primary` 且带 `shadow-focus`。

### 5.3 侧边栏 (Sidebar)

> **核心策略**（参考 YouMind）：侧栏背景 `surface-1`（纯白），与主内容同色，靠 `border-subtle` 分割线区分。选中态仅靠字重变化，不用背景色、不用品牌色指示线。

**侧栏容器**：
- 背景：`surface-1`（纯白）。
- 右边框：`border-subtle`（rgba(0,0,0,0.06)）。

**未选中态 (Inactive)**：
- 文字：`text-secondary` (neutral-700 #545659)，字重 400 (Regular)。
- 图标：`opacity: 0.6`，保留轮廓锐度。

**选中态 (Active)**：
- 文字：`text-primary` (#1C1F23)，字重 500 (Medium)。
- 背景：无。不使用 `surface-2`、`brand-subtle` 或任何背景色。
- 指示线：无。不使用 `brand-primary` 左侧指示线。
- **仅靠字重 400→500 + 颜色 secondary→primary 的微妙变化表达选中。**

**Hover 态**：
- 背景：`surface-2` (#F5F5F5)。仅 hover 时出现。

**侧栏结构顺序**（自上而下）：
1. Logo 区域（图标 + nexu 文字标 SVG）
2. **Navigation**（Dashboard、Skills、Channels 等固定导航）— 始终可见
3. **Conversations**（频道/DM 列表）— 可滚动，放在导航下方

> Navigation 必须在 Conversations 上方。对话列表可能很长，如果放在上面会把导航推到视口之外。

---

## 6. AI 审美检查清单 (Cursor Checklist)

1. **去色彩化**: 检查页面。如果看起来太蓝，请移除背景中的品牌色，改为 `surface-0/1`。
2. **功能色**: success/warning/error/danger 仅用于明确语义，不用于装饰。同一列表不混用多种功能色做分类。
3. **文字色阶**: 未选中导航用 `text-secondary`，禁用态用 `text-disabled`。禁止用 `text-tertiary` 作导航默认色。
4. **字重对比**: 确保描述文案绝对没有被加粗。
5. **呼吸感**: 检查标题和正文的行高。标题必须紧凑，正文必须舒展（1.6x）。
6. **边缘处理**: 检查子元素圆角。确保其小于父容器圆角，符合物理逻辑。


---

## Related

- [DESIGN-SYSTEM-NEXU.md](DESIGN-SYSTEM-NEXU.md) — 1.0 详细版
- [index.css](src/index.css) — 基础 theme 变量
- [Figma Nexu-2026](https://www.figma.com/design/Y0W1pnjNtN5RmNusdU1Add/Nexu-2026?node-id=0-1) — 设计原子
