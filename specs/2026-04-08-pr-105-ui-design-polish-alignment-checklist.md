# PR #105 Alignment Checklist — UI Design Polish (PR #560)

参考 PR：https://github.com/refly-ai/agent-digital-cowork/pull/105

源文档：`clone/artifacts/designs/ui-design-polish-2026-03.md`

## 目标

把 PR #105 里的设计规范和 polish 要点，拆成当前 `design` 仓库可执行的对齐清单。

## 适用范围说明

- `design` 仓库内可直接落地的内容：design tokens、`ui-web` primitives/patterns、Storybook 文档、demo pages 原型。
- 明显属于下游产品仓库的内容：桌面端 auto-update 交互、IPC、菜单栏逻辑、favicon / web metadata 等宿主应用集成项。
- 这份清单优先记录 **当前仓库应该补齐或确认的事项**，并把下游事项标成“下游同步”。

## 当前已观察到的基础对齐

- [x] 已存在 `--color-link` token：`packages/tokens/src/styles.css`
- [x] 已存在 focus ring 相关 token / 用法：`--shadow-focus`、`focus-visible:ring-ring`
- [x] `Button` 的 `ghost` hover 已使用 `hover:bg-surface-2`：`packages/ui-web/src/primitives/button.tsx`
- [x] `PageHeader` 已使用 `--color-link` 处理文内链接：`packages/ui-web/src/patterns/page-header.tsx`
- [x] Storybook 已有相关文档入口：`tokens.stories.tsx`、`button.stories.tsx`、`page-header.stories.tsx`

## Checklist

### 1. Design tokens / foundations

- [x] 补一条正式 spec：明确 `--color-link` 的语义、使用场景、hover/visited 规则，以及禁止直接写裸蓝色
- [x] 补一条正式 spec：明确 focus ring 使用 `--color-ring` / `focus-visible:ring-ring` 的统一规则
- [x] 检查 `packages/tokens/src/token-source.json` 是否也完整声明 link / ring 相关 token，避免只在生成后的 `styles.css` 可见
- [x] 为 `PageHeader` 补一个明确的 foundation 规范：是否需要官方 `.page-header` utility，还是以 React pattern 组件为唯一入口
- [x] 如果保留 utility class 方案，在 tokens 或 shared styles 中补 `.page-header` 的官方定义与文档
- [x] 在 `packages/ui-web/COMPONENT_REFERENCE.md` 或单独 docs 中补“链接颜色 / 焦点样式 / 页面标题间距”设计约束

### 2. Interactive typography floor（交互元素最小 12px）

- [x] 建立仓库级规范：所有 interactive surface 上的文本、badge、pill、segmented control、tab label 最小 12px
- [x] 审查 `packages/ui-web/src/primitives/tabs.tsx` 中 `text-[11px]` 的 trigger 文本，决定是否提升到 12px
- [x] 审查 `packages/ui-web/src/primitives/toggle.tsx` 中 `text-[11px]` 的 trigger 文本，决定是否提升到 12px
- [x] 审查 `packages/ui-web` 内其余交互性 primitive / pattern，清理 `text-[10px]`、`text-[11px]` 的可点击文本
- [x] 对 `packages/demo-pages/src/pages/openclaw/*` 做一次 typography audit，优先处理 clickable / selectable / dismissible 元素上的 10px/11px 文本
- [x] 对 `packages/demo-pages/src/pages/product/*` 做同类审计，区分“说明文字”与“交互文字”，只强制升级后者
- [x] 如有必要，新增 lint 规则、grep 脚本或 review checklist，阻止交互控件继续引入 `text-[10px]`
- [x] 在 Storybook 中新增或更新示例，展示 tabs / pills / filters / compact buttons 的最小字号基线

### 3. Link + external-link icon 统一

- [x] 在 `ui-web` 层明确规范：外链默认使用 `ArrowUpRight`，不再推荐 `ExternalLink`
- [x] 全仓 grep `ExternalLink`，整理替换清单并按 package 分批处理
- [x] 优先替换 `packages/demo-pages/src/pages/openclaw/*` 中仍在使用的 `ExternalLink`
- [x] 优先替换 `packages/demo-pages/src/pages/product/*` 与 `packages/demo-pages/src/pages/docs/*` 中仍在使用的 `ExternalLink`
- [x] 对替换后的外链组件统一 icon size / 对齐方式 / 间距规范
- [x] 在 `TextLink` / 文档示例中增加“外链写法”标准示例

### 4. Button / hover / focus 行为一致性

- [x] 确认 `Button` 的 `outline` hover 是否与 PR 文档目标完全一致，必要时补视觉回归说明
- [x] 审查其他近似按钮类组件（如 nav item、inline action、capsule button、demo 内自定义按钮）是否仍使用偏黑 hover
- [x] 将“ghost / outline hover 应偏 surface，而非偏 accent 黑底”写入组件设计规范
- [x] 为 `button.stories.tsx` 增加 ghost / outline / focus states 的对比示例
- [x] 必要时补测试，覆盖 `ghost` / `outline` className 的关键状态回归

### 5. Page header / heading polish

- [x] 确认 `PageHeader` 是否已经覆盖 PR 文档中“标题区间距统一”的需求
- [x] 若没有统一 spacing contract，为 `PageHeader` 补显式 props / 文档约束，避免页面自己写散落 margin
- [x] 审查 demo pages 中自定义 header 区块，尽量替换到 `PageHeader` / `SectionHeader` / 统一 pattern
- [x] 在 Storybook 中增加 page header 的长描述、带链接描述、带 actions 等规范示例
- [x] 决定 serif heading 的使用边界：仅 marketing / welcome 页面使用，还是 design system 层开放为通用 heading 选项

### 6. Provider settings card / 3-layer hierarchy

- [x] 在 `specs/` 中补一份独立规范，固化“Region > Auth tab > Inputs > Save”的 3 层层级
- [x] 盘点当前仓库是否已有可复用组合：`Card` + segmented control + `FormField` + trailing actions
- [x] 评估结论：暂不在 `packages/ui-web` 新增 provider settings card / auth switcher export；现有组合栈足够，待多个真实场景重复出现相同行为契约后再考虑抽象
- [x] 为“已保存 API key”场景定义统一模式：masked input + inline replace，而不是独立成功 banner
- [x] 为底部右对齐 Save CTA 定义统一布局约定，并写入相关 pattern docs
- [x] 在 Storybook 增加 provider settings / BYOK card 场景页，展示 Global/CN、OAuth/API Key、masked key、proxy URL、Save CTA
- [x] 对 `packages/demo-pages/src/pages/openclaw/OpenClawWorkspace.tsx` 中相关 provider 配置原型做一次对照审查

### 7. Status / sidebar / dense UI polish

- [x] 将“状态优先用 dot / badge，不重复用文本 pill”写入状态组件规范
- [x] 审查 `StatusDot`、`InteractiveRow`、sidebar 相关 story，确认是否能承接 PR 文档里的 sidebar polish 语言
- [x] 为 session list / sidebar item 补一个推荐 pattern，规范 title / subtitle / meta / status dot 的层级
- [x] 检查 demo 中是否仍有 `Live` 这类可替换成 dot 的文本状态标记

### 8. Model picker / dropdown readability

- [x] 审查 `Select` / `Combobox` / 相关 story，确认默认 item 字号、行高、图标尺寸是否足够可读
- [x] 若当前 primitives 过于通用，补一个“model picker / provider picker”场景 story 作为密集下拉菜单的基线
- [x] 为带 logo 的下拉项定义图标尺寸建议（例如 16px）和最小行高
- [x] 对 `packages/demo-pages/src/pages/openclaw/*` 中模型选择器做一次对齐检查

### 9. Skills / docs / help-link polish

- [x] 为 skills / marketplace 类型卡片建立统一 icon 映射策略，避免 generic 图标占位
- [x] 统一帮助链接风格：链接色使用 `--color-link`，外链图标使用 `ArrowUpRight`
- [x] 审查 channel setup / docs / community 等页面，移除无必要的装饰性帮助图标（已移除 `FaqPage` 头部 `HelpCircle`、`QuickStartPage` 的 `Key concepts` 装饰 `Info`；`ChannelsPage` / `CommunityPage` 未发现需要保留外的帮助图标）
- [x] 检查免责声明、辅助说明文案的标点和结尾风格是否统一

### 10. Storybook / docs 同步

- [x] 在 `packages/ui-web/COMPONENT_REFERENCE.md` 增补一节“UI polish conventions”
- [x] 在 `docs/` 或 `specs/` 中增加“interactive typography floor / link icon / provider settings hierarchy”三项常驻规范
- [x] 为 tokens、buttons、page headers、provider settings、status patterns 建立互相可跳转的文档索引
- [x] 在 Storybook 中增加一个“Design Polish Audit”或“Scenarios / UI Polish”页面，集中展示关键对齐点

### 11. 下游产品仓库同步（本仓库记录，不在此直接实现）

- [x] 把“Desktop Update Interaction Refactoring”拆成下游产品仓库 checklist：UpdateBanner、hook、IPC、menu sync、install CTA
  - [ ] `UpdateBanner`：统一 banner 的信息层级、按钮文案、关闭/稍后处理、下载中/已下载/待重启等状态映射，避免页面内散落多套 update UI
  - [ ] update hook：把“检查更新、下载进度、已就绪、失败、忽略/稍后”状态机集中到单一 hook 或 store，对外暴露稳定的 UI-facing contract
  - [ ] IPC contract：梳理 renderer ↔ main 的 update 事件、命令与 payload，补齐命名规范、错误态和幂等约束，避免 banner / setting / menu 各自直连不同 IPC 事件
  - [ ] menu sync：让应用菜单中的“检查更新 / 重启并更新”与页面 banner / settings 状态保持同一来源，避免菜单可点但页面状态滞后
  - [ ] install CTA：统一“Restart to update / Install update / Download update”触发入口与禁用规则，确保只保留一个主 CTA，并定义何时需要二次确认
- [x] 把 “Home page / Welcome page / Skills page / Session sidebar / model picker” 的具体页面改动同步到对应产品仓库或产品原型仓库
  - [ ] Home / landing page：同步页头层级、帮助链接样式、外链图标统一和首页技能入口的视觉权重，避免继续混用 serif heading、装饰性帮助图标或裸蓝色链接
  - [ ] Welcome page：同步 welcome / onboarding hero 的 heading 边界、说明文案标点风格，以及 provider setup / BYOK 区块的三层层级与右对齐 Save CTA
  - [ ] Skills page：同步 skills / marketplace 卡片的稳定 icon mapping、帮助链接写法和卡片辅助文案风格，避免 generic 图标占位或多套说明文案语气并存
  - [ ] Session sidebar：同步会话列表行模式（title + subtitle/meta + trailing status dot）、最小 12px 可点击文本和 ghost/outline 风格 hover，替换冗余的 `Live`/文本 pill 状态
  - [ ] Model picker：同步 dense picker 的基线（最小 12px、约 16px logo、最小行高、弱化 trailing meta），并以设计仓库的 dense model/provider picker story 作为验收参考
- [x] 把 favicon、`index.html` metadata、toast 文案更新列入下游宿主应用清单
  - [ ] favicon / app icon：在宿主应用统一浏览器 favicon、PWA/app icon、桌面壳 icon 的来源、尺寸裁切和品牌留白，避免继续沿用旧图标或出现不同入口图标不一致
  - [ ] `index.html` / metadata：统一 title template、description、Open Graph / Twitter metadata、theme-color、app name 等宿主级元信息，避免页面各自补丁式覆盖或继续暴露过时品牌文案
  - [ ] toast copy：统一成功 / 失败 / 进行中 toast 的语气、标点、动词时态和 CTA 写法，优先短句 + 明确结果，避免同类操作同时出现多套提示文案风格

## 建议执行顺序

- [x] 1. 先固化基础规范：link、focus ring、12px floor、external-link icon
- [ ] 2. 再修 `ui-web` primitives：tabs、toggle、button、text link、page header
- [ ] 3. 再补 Storybook 场景：button states、page header、provider settings、dense picker、status/sidebar
- [ ] 4. 再做 `demo-pages` 审计与替换：`ExternalLink`、10px/11px interactive text、自定义 header、自定义 provider settings
- [ ] 5. 最后把下游产品仓库事项单独分发

## 建议优先检查文件

- `packages/tokens/src/token-source.json`
- `packages/tokens/src/styles.css`
- `packages/ui-web/src/primitives/button.tsx`
- `packages/ui-web/src/primitives/tabs.tsx`
- `packages/ui-web/src/primitives/toggle.tsx`
- `packages/ui-web/src/primitives/text-link.tsx`
- `packages/ui-web/src/patterns/page-header.tsx`
- `packages/ui-web/COMPONENT_REFERENCE.md`
- `apps/storybook/src/stories/button.stories.tsx`
- `apps/storybook/src/stories/page-header.stories.tsx`
- `apps/storybook/src/stories/tokens.stories.tsx`
- `packages/demo-pages/src/pages/openclaw/OpenClawWorkspace.tsx`
- `packages/demo-pages/src/pages/openclaw/UsagePage.tsx`
- `packages/demo-pages/src/pages/openclaw/SkillDetailPage.tsx`
- `packages/demo-pages/src/pages/product/ChatCards.tsx`
