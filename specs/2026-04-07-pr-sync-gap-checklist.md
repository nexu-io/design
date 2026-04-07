# PR Sync Gap Checklist

## PR #113 — Settings General Tab

参考 PR：https://github.com/refly-ai/agent-digital-cowork/pull/113

- [x] 将 Settings 从单一 `providers` tab 扩展为 `General / AI Model Providers`
- [x] 增加账户卡片：未登录态登录按钮
- [x] 增加账户卡片：登录态头像缩写 / 邮箱 / 退出登录
- [x] 增加应用行为开关：Launch at login
- [x] 增加应用行为开关：Show in Dock
- [x] 增加数据与隐私开关：Usage analytics
- [x] 增加数据与隐私开关：Crash reports
- [x] 增加关于/版本/检查更新的集中设置卡片

**参考当前文件**
- `apps/demo/src/pages/openclaw/OpenClawWorkspace.tsx:1733-1989`
- `apps/demo/src/pages/openclaw/OpenClawWorkspace.tsx:2485-2769`

## PR #114 — Pricing / Billing / Usage UX

参考 PR：https://github.com/refly-ai/agent-digital-cowork/pull/114

- [x] 将 Pricing 对齐为四档套餐：Free / Plus / Pro / Ultimate
- [x] 增加首月促销价 + 原价划线展示
- [x] 增加套餐内模型列表与可用性 badge
- [x] 在 Settings 中增加 `Usage` tab
- [x] 增加套餐信息卡 / 重置倒计时 / 升级 CTA / 权益列表
- [x] 增加奖励积分拆分区块
- [x] 增加“分享 nexu 获取额外积分”入口
- [x] 增加 Demo 控制面板：切换登录态 / 套餐 / 额度状态

**参考当前文件**
- `apps/demo/src/App.tsx:304-305`
- `apps/demo/src/pages/openclaw/BillingPage.tsx:149-340`
- `apps/demo/src/pages/openclaw/UsagePage.tsx:1-5`

## PR #117 — Budget Banner by Plan

参考 PR：https://github.com/refly-ai/agent-digital-cowork/pull/117

- [x] 在 Home 增加额度预警 banner
- [x] 支持 warning / depleted 两种状态
- [x] 按套餐区分 CTA：Free / Plus / Pro / Ultimate
- [x] Plus：主 CTA 为升级 Pro
- [x] Pro：主 CTA 为 credit packs
- [x] Free：展示 BYOK + 升级套餐
- [x] 增加 banner dismiss 逻辑

**参考当前文件**
- `apps/demo/src/pages/openclaw/OpenClawWorkspace.tsx`
- `apps/demo/src/pages/openclaw/BillingPage.tsx:261-284`

## PR #111 — Rewards / 用量侧栏交互

参考 PR：https://github.com/refly-ai/agent-digital-cowork/pull/111

- [x] 增加 Rewards 页面
- [x] 增加奖励任务列表
- [x] 增加每日 / 每周状态展示
- [x] 增加分享素材弹窗与确认流
- [x] 增加 `useBudget` 或等价状态管理
- [x] 增加小红书 / 即刻 / 飞书等分享链路素材支持
- [x] 增加 rewards 相关页面入口与数据结构

**参考当前文件**
- `packages/ui-web/src/primitives/interactive-row.tsx`
- `apps/demo/src/components/SectionHeader.tsx`
- `apps/demo/src/pages/openclaw/OpenClawWorkspace.tsx:1390-1419`

## PR #115 — 组件抽离 / CSS 重构

参考 PR：https://github.com/refly-ai/agent-digital-cowork/pull/115

- [ ] 评估是否补齐 `filter-pills` 组件或等价封装
- [ ] 评估是否补齐 `underline-tabs` 组件或等价封装
- [ ] 评估是否补齐 `nav-item` 组件或等价封装
- [ ] 将 `SectionHeader` 收敛进 `packages/ui-web`
- [ ] 评估 demo 中散落样式是否继续抽到组件库统一

**参考当前文件**
- `packages/ui-web/src/index.ts`
- `packages/ui-web/src/patterns/page-header.tsx`
- `packages/ui-web/src/primitives/status-dot.tsx`
- `packages/ui-web/src/primitives/interactive-row.tsx`

## PR #121 — design parity / 组件库对齐

参考 PR：https://github.com/refly-ai/agent-digital-cowork/pull/121

- [x] 将 `SectionHeader` 纳入 `ui-web` 正式导出
- [x] 评估并补齐 credits capsule 相关 UI
- [x] 评估并补齐 budget popover 相关 UI
- [x] 检查 demo 是否仍有本地实现可替换为 `ui-web` 组件

**参考当前文件**
- `packages/ui-web/src/primitives/tooltip.tsx`
- `packages/ui-web/src/primitives/button.tsx`
- `packages/ui-web/src/patterns/page-header.tsx`
- `apps/demo/src/components/SectionHeader.tsx`

## PR #124 — Windows 侧栏 / 头部适配

参考 PR：https://github.com/refly-ai/agent-digital-cowork/pull/124

- [ ] 调整 Windows 专属顶部间距
- [ ] 调整侧栏 toggle 为贴边跟随式表现
- [ ] 调整侧栏与主内容区的贴合样式
- [ ] 移除频道头冗余平台 icon
- [ ] 增加 `run-nexu-client.bat`

**参考当前文件**
- `apps/demo/src/pages/openclaw/OpenClawWorkspace.tsx:2368-2403`
- `apps/demo/src/pages/openclaw/ChannelDetailPage.tsx:166-173`

## 已基本同步

### PR #119 / #120 — Seedance 活动流

参考 PR：
- https://github.com/refly-ai/agent-digital-cowork/pull/119
- https://github.com/refly-ai/agent-digital-cowork/pull/120

- [x] Banner
- [x] Dismiss once
- [x] Modal 两步流
- [x] Key 文案
- [x] 飞书群 + 问卷
- [x] Dev reset
- [x] 2 天循环倒计时

**参考当前文件**
- `apps/demo/src/pages/openclaw/OpenClawWorkspace.tsx:498-525`
- `apps/demo/src/pages/openclaw/OpenClawWorkspace.tsx:594-779`
- `apps/demo/src/pages/openclaw/OpenClawWorkspace.tsx:980-1022`

## 建议顺序

- [x] 1. PR #113 — Settings General Tab
- [x] 2. PR #114 — Pricing / Usage UX
- [x] 3. PR #117 — Budget Banner
- [x] 4. PR #111 — Rewards
- [x] 5. PR #121 — 组件库收口
- [ ] 6. PR #124 — Windows polish
- [ ] 7. PR #115 — 命名 / 抽象统一

## 追加待办：统一落到 `apps/demo` 的云端 Web 原型

- [ ] 统一约定：云端 Web 原型优先放在 `apps/demo/src/pages/openclaw/` 下，避免继续分散到其他目录
- [ ] 梳理 `apps/demo` 下现有 openclaw 页面路由，标记哪些属于云端 Web、哪些属于桌面端工作台壳层
- [ ] 为云端 Web 原型补一份页面地图，明确保留页面、待新增页面、待废弃页面
- [x] 新增或整理云端定价页原型，统一落到 `apps/demo/src/pages/openclaw/` 下
- [x] 将 PR #114 的 Pricing 相关 UI 以 `apps/demo` 页面原型方式实现，不依赖旧 `design-system` 路径
- [x] 在 `apps/demo` 的 Settings 原型中增加 `Usage` tab，并与云端套餐/额度逻辑保持一致
- [x] 在 `apps/demo` 的 Home 原型中增加额度预警 Banner，并按云端套餐状态联动
- [x] 在 `apps/demo` 中补齐 Rewards 入口与页面原型，供云端用量激励链路串联
- [ ] 将左下角用量指示器改造成可跳转到云端 `Settings > Usage` 的入口
- [x] 评估并抽离云端 Web 原型共用组件，优先沉淀到 `packages/ui-web`，页面仍放在 `apps/demo`
- [ ] 避免把云端页面继续实现到仓库外部或旧目录，新增需求默认先落 `apps/demo`
- [ ] 为 `apps/demo` 的云端原型补充统一命名规范，避免同时出现 `PricingPage` / `NexuPricingPage` 这类重复概念
- [ ] 在 `apps/demo/src/App.tsx` 统一收口相关路由，保证云端原型入口清晰可发现
- [ ] 如有必要，新增一个明确的云端原型导航分组，和桌面端原型区分展示
