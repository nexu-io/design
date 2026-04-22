# ui-web 预编译发布样式方案（方案 C）

## 背景

当前 `@nexu-design/ui-web` 的发布方式是：

- TypeScript 构建输出 `dist/**/*.js` / `dist/**/*.d.ts`
- `src/styles.css` 被原样复制到 `dist/styles.css`
- 发布包只包含 `dist/` 和 `README.md`

而 `packages/ui-web/src/styles.css` 当前内容为：

```css
@import "tailwindcss";
@import "@nexu-design/tokens/styles.css";
@source "./**/*.{ts,tsx}";
```

这意味着当前 npm 包对外暴露的 `dist/styles.css` 仍然包含 Tailwind v4 的源码扫描声明，但发布包并不包含 `src/**/*.ts(x)`。结果是：

1. 消费方如果把 `@nexu-design/ui-web/styles.css` 交给 Tailwind 处理，`@source` 会扫不到真实组件源文件。
2. 真实 utility class 实际存在于发布后的 `dist/**/*.js` 中，但当前 `@source` 并未指向这些文件。
3. 很多组件内部依赖 utility class 的样式无法稳定生成，出现“结构正常但细节样式丢失”的风险。

这不是单个组件实现问题，而是 **`ui-web` 的发布契约与样式生成责任分配错误**。

---

## 目标

1. `@nexu-design/ui-web/styles.css` 成为 **发布时已编译完成** 的稳定 CSS 产物。
2. 消费方不需要再依赖 Tailwind 去二次扫描 `ui-web` 组件实现。
3. 保持现有公开导出路径不变：`@nexu-design/ui-web/styles.css`。
4. 让 Storybook / 本地验证 / npm 包发布拿到的是同一份样式契约。
5. 在 release check 中加入防回归校验，避免再次发布带 `@source` 的原始入口 CSS。

## 非目标

1. 不重写 `ui-web` 组件实现为 CSS Modules、vanilla-extract 或其他样式方案。
2. 不要求消费方改造为特定框架或特定打包器。
3. 不在本次方案里设计“按组件拆分 CSS 包”或“按需 CSS tree-shaking”。
4. 不把 `@nexu-design/tokens` 的发布策略一起重做；仅在 `ui-web` 消费契约层收口。

---

## 成功标准

满足以下条件才算方案 C 完整落地：

1. `packages/ui-web/dist/styles.css` 为构建产物，而不是 `src/styles.css` 的原样拷贝。
2. 发布包内的 `dist/styles.css` **不再包含**：
   - `@source`
   - `@import "tailwindcss"`
3. 发布包内的 `dist/styles.css` **已经包含组件所需的 utility 规则**。
4. 消费方只需 `import '@nexu-design/ui-web/styles.css'` 即可获得组件正常样式。
5. `package.json` 的 `exports["./styles.css"]` 路径保持不变。
6. `pack:check` 或 release check 会在发布前阻止“再次发出原始 Tailwind 入口 CSS”。
7. 文档明确说明新的消费方式和兼容性边界。

---

## 总体决策

### 决策 1：样式生成责任留在组件库自身

`ui-web` 必须在构建阶段就完成 Tailwind 编译，输出稳定 CSS。

**不再依赖消费方：**

- 配置 Tailwind v4
- 扫描 `node_modules`
- 理解 `@source`
- 参与 `ui-web` 内部 utility class 的生成

### 决策 2：保留对外路径，不改变消费者 import 方式

对外继续使用：

```ts
import '@nexu-design/ui-web/styles.css'
```

也即：

- `exports["./styles.css"]` 保持不变
- 文档从“复制 CSS 入口”改为“提供预编译样式产物”

### 决策 3：把当前 `src/styles.css` 视为**构建输入**，不再视为可直接发布文件

`src/styles.css` 可以继续保留 Tailwind 指令与 `@source`，但它的角色改为：

- 只用于库内部构建
- 不直接发布
- 最终发布的必须是 Tailwind 处理后的 `dist/styles.css`

### 决策 4：`ui-web/styles.css` 需要成为单一推荐入口

消费者使用 `ui-web` 组件时，默认应只引入：

```ts
import '@nexu-design/ui-web/styles.css'
```

如果最终实现中仍依赖额外导入 `@nexu-design/tokens/styles.css`，则说明方案还没有完全达到“单入口”目标；应继续收敛，直到 `ui-web/styles.css` 自身足以支撑组件显示。

---

## 方案设计

## Phase 1 — 调整 `ui-web` 构建链路

### 目标

把 `dist/styles.css` 从“复制产物”改成“编译产物”。

### 具体改动

#### 1. 为 `packages/ui-web` 引入 Tailwind v4 CLI

在 `packages/ui-web/package.json` 中新增 devDependency：

- `@tailwindcss/cli`

原因：Tailwind v4 的 CLI 已独立为 `@tailwindcss/cli`，需要显式安装，不能再依赖当前仅有的 `tailwindcss` 包完成发布期 CSS 编译。

#### 2. 将 `build` 拆为类型构建 + CSS 构建

建议脚本结构：

```json
{
  "scripts": {
    "build:types": "tsc -p tsconfig.build.json",
    "build:css": "tailwindcss -i ./src/styles.css -o ./dist/styles.css",
    "check:dist-css": "node ../../scripts/assert-ui-web-dist-css.mjs",
    "build": "pnpm run build:types && pnpm run build:css && pnpm run check:dist-css"
  }
}
```

说明：

- 首版不要启用 `--minify`，优先保证可读性与发布排查能力。
- 如后续确认调试价值不再重要，可在稳定后再评估是否加 `--minify`。

#### 3. 删除原来的复制逻辑

必须移除：

```json
"build": "tsc -p tsconfig.build.json && cp src/styles.css dist/styles.css"
```

因为这正是本次问题的根因。

---

## Phase 2 — 明确 `src/styles.css` 的输入职责

### 目标

让 `src/styles.css` 成为“只供构建消费的 Tailwind 输入文件”。

### 具体要求

`packages/ui-web/src/styles.css` 可以继续保留如下结构或等价语义：

```css
@import "tailwindcss";
@import "@nexu-design/tokens/styles.css";
@source "./**/*.{ts,tsx}";
```

但需要满足以下约束：

1. 该文件只作为 Tailwind CLI 的输入。
2. 发布包不再直接暴露这份原始内容。
3. 构建后的 `dist/styles.css` 中不允许残留 `@source` / `@import "tailwindcss"`。

### 关于 tokens 的约束

方案 C 的最终契约是：

- `@nexu-design/ui-web/styles.css` 应足以驱动 `ui-web` 组件正常显示。

优先级：

1. **优先方案：** 构建输出的 `dist/styles.css` 为自包含产物，包含 tokens 所需变量/规则。
2. **可接受过渡：** 如工具链在第一步暂时保留对 `@nexu-design/tokens/styles.css` 的可解析 import，则必须验证消费端只导入 `ui-web/styles.css` 仍能生效，并在后续继续收敛为单入口。

如果 Tailwind CLI 实际执行后未能把 tokens 相关内容并入最终产物，则应补一个 CSS bundling / import resolution 步骤，**不要把“还需要再导入 tokens”作为最终方案出口**。

---

## Phase 3 — 增加发布前防回归校验

### 目标

确保未来任何一次发布都不会再次把 Tailwind 原始入口 CSS 发到 npm。

### 新增校验脚本

新增脚本：

- `scripts/assert-ui-web-dist-css.mjs`

脚本职责：

1. 读取 `packages/ui-web/dist/styles.css`
2. 断言文件存在且非空
3. 断言文件中 **不包含**：
   - `@source`
   - `@import "tailwindcss"`
4. 断言文件中 **包含至少若干已知 utility selector 或规则片段**

建议至少覆盖以下与当前问题直接相关的类：

- `.relative`
- `.absolute`
- `.right-2`
- `focus:bg-surface-2` 对应的转义选择器片段

### 接入点

至少接入到：

- `packages/ui-web/package.json` 的 `build`
- `packages/ui-web/package.json` 的 `pack:check`

可选再接入到：

- 根目录 `release:check`

目标是让下面两类错误在本地/CI 即失败：

1. `dist/styles.css` 又变回原始入口 CSS
2. CSS 构建成功但没有实际 utility 输出

---

## Phase 4 — 增加“发布形态”验证，而不是只验证 workspace 形态

### 问题

当前 Storybook / workspace 开发链路大多直接消费源码，因此不能覆盖 npm 发布形态的风险。

### 新增验证要求

至少新增一项“发布产物视角”的验证：

#### 方案 A（首选，成本较低）

在 `pack:check` 后增加脚本校验 tarball 或 `dist/styles.css` 内容，验证它已经是稳定 CSS。

#### 方案 B（推荐后续补齐）

新增一个最小 consumer smoke test，使用 `file:` 或 `npm pack` 产物安装 `@nexu-design/ui-web`，仅导入：

```ts
import '@nexu-design/ui-web/styles.css'
```

渲染一个带明显 utility 依赖的组件（例如 `SelectItem`），确认：

- 定位样式存在
- 选中图标位置正确
- focus 状态类未丢失

### 本方案要求

本次落地至少完成方案 A；方案 B 作为紧随其后的增强项进入 backlog，不应长期缺失。

---

## Phase 5 — 文档与对外契约更新

### 目标

让发布策略、消费方式、回归检查与此次修复保持一致。

### 必改文档

#### 1. `docs/package-publishing-and-consumption.md`

需要更新以下内容：

- 当前 package strategy 不再是“CSS copied to dist/styles.css”
- 改为“`ui-web` 在发布期输出预编译 `dist/styles.css`”
- 明确消费者默认只需导入 `@nexu-design/ui-web/styles.css`
- 说明这份 CSS 不再依赖消费方的 Tailwind `@source` / content 扫描
- 说明若消费方同时单独导入 `@nexu-design/tokens/styles.css`，需注意重复全局样式风险（若最终产物为自包含）

#### 2. `docs/release-flow.md`

补充一条与 `ui-web` 相关的发布检查说明：

- 发布前必须确认 `dist/styles.css` 是已编译产物，而不是原始 Tailwind 入口

#### 3. 变更说明 / changeset

这是明确的 consumer-visible 修复，必须新增 changeset。

建议语义：

- `fix(ui-web): ship fully compiled styles.css for published consumers`

发布说明要强调：

- 修复 npm 消费场景下组件 utility 样式可能丢失的问题
- 不改变 `@nexu-design/ui-web/styles.css` 的导入路径

---

## 具体文件清单

本方案预计至少涉及：

- `packages/ui-web/package.json`
- `packages/ui-web/src/styles.css`
- `scripts/assert-ui-web-dist-css.mjs`（新增）
- `docs/package-publishing-and-consumption.md`
- `docs/release-flow.md`
- `.changeset/*.md`（新增）

如需要补充 smoke test，则可能新增：

- `apps/*` 下的最小消费验证夹具，或
- `scripts/*` 下的 tarball 验证脚本

---

## 验收清单

### 构建层

- [ ] `pnpm --filter @nexu-design/ui-web build` 成功
- [ ] `packages/ui-web/dist/styles.css` 存在
- [ ] `dist/styles.css` 不包含 `@source`
- [ ] `dist/styles.css` 不包含 `@import "tailwindcss"`
- [ ] `dist/styles.css` 包含已编译 utility 规则

### 打包层

- [ ] `pnpm --filter @nexu-design/ui-web pack:check` 成功
- [ ] tarball 中的 `dist/styles.css` 为编译结果而非原始入口
- [ ] tarball 仍只发布预期产物，不额外泄漏 `src/**/*.ts(x)`

### 消费层

- [ ] 消费方只导入 `@nexu-design/ui-web/styles.css` 时组件可正常显示
- [ ] 不要求消费方额外配置 Tailwind 扫描 `ui-web`
- [ ] 对现有 `import '@nexu-design/ui-web/styles.css'` 使用者无导入路径破坏

### 文档与发布层

- [ ] package publishing 文档已更新
- [ ] release flow 文档已更新
- [ ] changeset 已添加

---

## 风险与处理

### 风险 1：CLI 编译后 tokens 未被真正并入最终 CSS

处理：

- 先验证编译输出是否已能独立驱动组件显示
- 若不能，补充 CSS import bundling 步骤
- 不接受“让消费者再额外手动导 tokens”作为最终完成态

### 风险 2：编译 CSS 体积增大

处理：

- 这是方案 C 可接受成本
- 首先保证发布正确性，其次再讨论最小化和按需优化
- 可在稳定后评估 `--minify`

### 风险 3：workspace 内验证仍掩盖发布问题

处理：

- 必须把“发布形态校验”加入 `pack:check` / release check
- 后续补 smoke test

### 风险 4：消费者原本同时导入 tokens 和 ui-web styles

处理：

- 文档中明确推荐入口
- 若最终 `ui-web/styles.css` 已自包含，则需要提示避免重复导入造成冗余或重复 reset

---

## 实施顺序建议

1. 改 `packages/ui-web/package.json`，接入 `@tailwindcss/cli` 与 `build:css`
2. 保持 `src/styles.css` 作为构建输入，先跑通 CSS 编译
3. 新增 `scripts/assert-ui-web-dist-css.mjs`
4. 让 `build` / `pack:check` 接入新校验
5. 更新 `docs/package-publishing-and-consumption.md`
6. 更新 `docs/release-flow.md`
7. 新增 changeset
8. 跑 `pnpm release:check:ui-web` 与必要的全量验证

---

## 最终结论

这次修复不应停留在“把 `@source` 改到 `dist/**/*.js`”这种临时止血层面，而应把 `ui-web` 的样式发布契约改正为：

> **组件库在发布阶段生成并发布稳定 CSS，消费方只消费产物，不承担组件库内部 utility class 的生成责任。**

只有这样，`@nexu-design/ui-web` 才能在 npm、`file:`、workspace 外消费、不同打包器环境下保持一致行为。
