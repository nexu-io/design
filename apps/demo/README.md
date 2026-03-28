# Nexu Demo

Nexu Tauri Demo — React + Tailwind 4 + Tauri 2。

## 三层架构

| 层级 | 内容 | 位置 |
|---|---|---|
| **Layer 1** — 组件库 | `@nexu-design/ui-web` 共享组件（Button, Dialog, Input, Select, Tabs 等） | `packages/ui-web` |
| **Layer 2** — 品牌皮肤 | CSS tokens + classes + Design Spec 注释 | [`src/index.css`](src/index.css) |
| **Layer 3** — 细节补充 | Tailwind inline utilities（布局、间距、响应式） | 各页面组件内 |

## 快速开始

```bash
pnpm install
pnpm dev:demo        # 启动 Tauri demo
pnpm dev:demo:web    # 仅启动 web 调试页
pnpm build:tauri     # 构建 Tauri 应用
```

如果你当前就在 `apps/demo` 目录，也可以直接使用：

```bash
pnpm dev
pnpm dev:web
pnpm tauri:build
```

Rust toolchain 由 `src-tauri/rust-toolchain.toml` 固定，不依赖全局默认版本。

## 如何使用设计系统

### 场景 1：完整使用（React + Tailwind 项目）

1. 安装 `@nexu-design/ui-web` 与 `@nexu-design/tokens`
2. 引入 tokens / 全局样式
3. 直接从 `@nexu-design/ui-web` 使用共享组件

### 场景 2：只用 Tokens 和 CSS Classes

只需要 [`src/index.css`](src/index.css)，可以直接使用：

- **颜色 tokens**：`var(--color-brand-primary)`, `var(--color-surface-0)`, `var(--color-text-primary)` 等
- **阴影 tokens**：`var(--shadow-rest)`, `var(--shadow-card)`, `var(--shadow-refine)` 等
- **字体 tokens**：`var(--font-sans)`, `var(--font-mono)`, `var(--font-heading)` 等
- **CSS classes**：`.card`, `.tag`, `.tag-highlight`, `.nav-item`, `.sidebar` 等

### 场景 3：参考规范

`src/index.css` 底部包含完整的 Design Spec 注释，记录了每个组件的设计参数：

- Home Page Layout Architecture
- Inline Model Selector
- Breathe Highlight Animation
- Interactive Element Color Rule
- Connection Status Pattern
- Card Static Modifier
- Modal Dialog / Skill Card / Deployments Table 等

搜索 `Design Spec` 或 `Design Rule` 即可找到所有规范。

## 核心设计规则

1. **颜色必须用 `var(--color-*)` tokens** — 不硬编码 `#xxx`，不用 Tailwind 调色板（emerald-500 等）
2. **可点击元素不用浅灰** — 最低用 `text-text-secondary`，`text-text-muted` 只给不可交互元素
3. **icon 容器**：40×40, `rounded-[12px]`, `bg-white`, `border border-border`
4. **字号范围**：body 9–14px，heading 22–26px，不用 15/16/18px
5. **阴影用 token** — `var(--shadow-rest)` 等，不 inline `rgba` shadows
6. **Connected 按钮** — 全局统一：显示 "Connected"，hover 变红可断开
7. **card-static** — 大模块加 `.card-static` 禁用 hover 浮动效果

## 文件结构

```
src/
├── index.css                 # Tokens + Classes + Design Specs
├── lib/utils.ts              # cn() 工具函数
├── components/               # demo 业务组件
└── pages/                    # 产品页面（使用设计系统的实例）
    ├── openclaw/             # Nexu 工作台
    └── nexu/                 # Nexu 产品页
```

## 技术栈

- React 19 + TypeScript
- Tailwind CSS 4
- Vite 7
- shadcn/ui
- Framer Motion
- Lucide Icons
