# PR #107 Demo Project Patch Checklist

参考 PR：https://github.com/refly-ai/agent-digital-cowork/pull/107/changes

## 目标

把 PR #107 里的 BYOK settings / Skills / update-card polish，拆成当前 `design` 仓库里 demo project 可执行的补丁清单。

## 适用范围说明

- 本次优先落地到 demo surface：`packages/demo-pages/src/pages/openclaw/OpenClawWorkspace.tsx`。
- `apps/demo/src/pages/product/SkillsPage.tsx` 作为次要对齐面，承接 tab 宽度稳定、Refresh 样式统一等 polish。
- PR 中真实产品仓库的 `apps/web` / `apps/desktop` 根布局改动，不直接照搬；这里只记录 demo 内可模拟或可验证的 UI contract。

## 当前已观察到的部分对齐

- [x] `OpenClawWorkspace.tsx` 已有独立 provider settings 区与 model selector。
- [x] demo workspace 已有右下角浮动 update card 雏形，而不是放在 sidebar 内。
- [x] `SkillsPage.tsx` 已有 tabs、count、Refresh 按钮与 inline search，可直接做稳定性 polish。
- [x] provider list、settings panel、model list 都集中在 `OpenClawWorkspace.tsx`，适合一次性整理信息层级。

## Checklist

### 1. Provider settings card hierarchy（主改动）

- [ ] 将非 `nexu` provider 的配置区重构为单一卡片容器，明确与下方 model list 分层，而不是散落在 detail pane 中
- [ ] 把 Region 切换提升到 provider header 行，右对齐放在 provider name 同一层，不再放进配置区正文
- [ ] 在配置卡顶部增加 auth method segmented control，形成 `Region → Auth tab → Inputs` 的 3 层层级
- [ ] 对多 auth provider 统一 tab 文案，优先使用更短的 `OAuth`，避免 `OAuth Login` 过抢视觉权重
- [ ] 统一 auth tab 为 12px pill-style/segmented 视觉，弱于输入标签而不是强于表单正文
- [ ] 校正多 auth provider 的默认 tab 选择逻辑：默认进入 OAuth，而不是受“是否已有 API key”干扰
- [ ] 修正 OAuth tab 激活时的条件渲染，确保 API Key 区块对所有 multi-auth provider 都正确隐藏

### 2. API key saved state / form actions

- [ ] 把当前保存成功 banner 模式改成“masked API key input + inline Edit/Replace action”，避免只为“已保存”占一整条提示
- [ ] 让 API key、proxy URL、OAuth/coding plan 等输入都收敛在 card body，而不是分散成松散段落
- [ ] 将描述性辅助文案尽量并入 placeholder 或更轻量的 hint，降低正文密度噪音
- [ ] 把 Save 按钮改为卡片底部右对齐的独立主 CTA，不再依赖当前较弱的行尾布局
- [ ] 统一 Test connection / Save 的优先级：主操作只保留一个显著 CTA，次级操作弱化为文字或 outline
- [ ] 对 OAuth provider 的登录按钮统一为 full-width，避免不同 provider 出现 inline / block 两套按钮密度

### 3. Current model indicator / provider detail polish

- [ ] 将当前“Nexu Bot model selector”整理为更紧凑的 current model indicator，保证选中模型信息始终可见
- [ ] 让 current model indicator 与 provider 配置区形成更清晰的上下关系，避免与 provider settings card 抢主层级
- [ ] 审查 provider sidebar button 的 focus 样式：去掉浏览器默认突兀 outline，但保留统一的 `focus-visible` 可访问反馈
- [ ] 统一 provider 内 Refresh / secondary action 的字号、icon size、文案（`Refresh`）与 hover 风格

### 4. Skills page width stability / dense UI polish

- [ ] 为 `apps/demo/src/pages/product/SkillsPage.tsx` 的 tabs 增加最小宽度，避免切换 active state 时按钮宽度跳动
- [ ] 保持 count badge 在 active / inactive 两种状态下都占位显示，避免 Installed / Explore 切换时文本抖动
- [ ] 把 Refresh 按钮对齐到 PR #107 的 compact pattern：12px icon + 更稳定的 hit area + 统一文案
- [ ] 审查 search trigger / dropdown 的字号基线，避免继续使用过小的 11px 交互文本

### 5. Update card alignment（demo 内做验收，不必完全照搬产品实现）

- [ ] 复核 `OpenClawWorkspace.tsx` 右下角 update card 的定位、阴影、backdrop blur、宽度是否与 PR 目标一致
- [ ] 对齐 update card 的三种主要状态：available / ready / error，尽量让 ready 与 error 卡片高度一致
- [ ] 如果 error state 仍有多余描述文案，收敛为标题 + Retry / Changelog 两个动作，保持紧凑高度
- [ ] 验证 update card 在 sidebar 展开/收起、窄宽度、滚动场景下不遮挡主要会话内容

### 6. 文案与状态逻辑同步

- [ ] 同步 demo 内相关文案：`OAuth`、`Refresh`、`Edit` / `Replace`，避免一个页面内出现多套命名
- [ ] 检查 provider 切换、保存成功、切换 auth tab 后的 state persistence，避免 tab 切换导致输入值丢失
- [ ] 检查保存成功后自动选中模型的逻辑是否仍合理；若保留，需保证不会打断用户正在浏览的 provider

### 7. 验收与回归

- [ ] 手动走查 `OpenClawWorkspace`：provider 切换、OAuth/API Key 切换、保存、错误态、model 选择、update card
- [ ] 手动走查 `SkillsPage`：tab 切换、count badge、Refresh、search combobox 宽度与对齐
- [ ] 如有必要，为复杂状态切换拆小型本地 mock/state helper，避免 JSX 中继续堆叠条件分支

## 建议执行顺序

- [ ] 1. 先改 `OpenClawWorkspace.tsx` 的 provider settings hierarchy 和 saved-state 表达
- [ ] 2. 再补 current model indicator、Refresh 样式、provider sidebar focus-visible polish
- [ ] 3. 再修 `apps/demo/src/pages/product/SkillsPage.tsx` 的 tab width / count badge / search baseline
- [ ] 4. 最后统一 update card 与文案、做手动验收

## 建议优先检查文件

- `packages/demo-pages/src/pages/openclaw/OpenClawWorkspace.tsx`
- `packages/demo-pages/src/pages/openclaw/data.ts`
- `packages/demo-pages/src/app/routes/cloud-routes.tsx`
- `apps/demo/src/pages/product/SkillsPage.tsx`
- `apps/demo/src/pages/product/ProductLayout.tsx`
