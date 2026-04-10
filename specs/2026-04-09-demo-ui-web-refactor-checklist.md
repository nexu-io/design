# Demo 项目 ui-web 重构审视 Checklist

## 目标

全面审视当前 demo 项目中仍然使用 bespoke / native UI 的区域，整理出建议改为 `@nexu-design/ui-web` 组件库实现的地方，以降低视觉漂移，统一交互与信息层级。

## 审视范围

- `apps/demo/src/app/*`
- `apps/demo/src/pages/product/*`
- `apps/demo/src/pages/journey/*`
- `apps/demo/src/components/*`
- `apps/demo/src/index.css`

## 总体判断

- demo 已经部分接入 `@nexu-design/ui-web`，尤其在 `SessionsPage`、`AutomationPage`、`SkillsPage`、`TeamPage`、`JourneyPage` 等页面里已有不少基础设施。
- 但仍存在一批高影响的自定义 UI：modal / overlay、detail panel、sidebar/nav、card 容器、badge、form input、chat bubble、stepper、filter pills，以及 `index.css` 中一整套与组件库平行存在的样式语义。
- 优先级最高的是：**统一弹层体系**、**移除本地 Inspector/Panel 抽象**、**收敛 badge / card / input / nav 到 ui-web 组件**。

## Checklist

### 1. 高优先级：弹层 / 侧滑面板统一到 ui-web

- [x] `apps/demo/src/pages/product/SkillsPage.tsx:544` `ChatCreatorModal` 从手写 `fixed inset-0` overlay 改为 `Dialog` + `DialogContent` + `DialogHeader` + `DialogBody` + `DialogFooter`
- [x] `apps/demo/src/pages/product/SkillsPage.tsx:648` `WorkflowEditorModal` 从手写 modal 改为 `Dialog`，统一遮罩、关闭按钮、header/footer、focus trap
- [x] `apps/demo/src/pages/product/PricingModal.tsx:52` 从手写 overlay 改为 `Dialog`，避免继续维持独立的 modal 视觉规范
- [x] `apps/demo/src/pages/product/SkillsPage.tsx` `SkillDetailPanel` 从全屏 overlay + 本地 panel 改为 `Sheet` 或 `DetailPanel`
- [x] `apps/demo/src/pages/product/AutomationPage.tsx` `AutomationDetailPanel` 从 overlay + 本地 panel 改为 `Sheet` 或 `DetailPanel`

### 2. 高优先级：移除本地 inspector/panel 抽象

- [x] `apps/demo/src/pages/product/InspectorPanel.tsx` 评估删除，统一改用 `@nexu-design/ui-web` 的 `DetailPanel`
- [x] `SkillsPage` / `AutomationPage` / `TeamDetailPanels` 中所有依赖本地 `InspectorPanel` 的地方，收敛到同一套 panel header/body/footer 结构

### 3. 高优先级：侧边栏与导航不要继续手写

- [x] `apps/demo/src/app/design-system-shell.tsx` 当前 sidebar/nav/link/collapse button 需要评估迁移到 ui-web 的 `Sidebar` / `NavItem` / 相关 shell primitives
- [x] `design-system-shell.tsx:28` `NavSection` 中 active / hover / collapsed 态不要继续手写 class 组合，改为组件库导航语义，统一选中态与焦点态
- [x] `apps/demo/src/index.css` 中 `.nav-item` / `.nav-item-active` 样式语义应逐步废弃，避免与组件库 nav 样式并行演化

### 4. 中高优先级：页面头部统一到 `PageHeader`

- [x] `apps/demo/src/pages/product/SkillsPage.tsx` 顶部标题区改为 `PageHeader`
- [x] `apps/demo/src/pages/product/AutomationPage.tsx` 顶部标题区改为 `PageHeader`
- [x] `apps/demo/src/pages/product/CloneBuilderPage.tsx` 顶部标题区改为 `PageHeader`
- [x] `apps/demo/src/pages/product/TeamPage.tsx` 目前缺少明确 page header，建议补一个 `PageHeader`，避免首屏信息层级偏散

### 5. 中高优先级：卡片体系统一到 `Card` / `EntityCard` / `StatCard`

- [x] `apps/demo/src/pages/product/TeamPage.tsx:99` `CardWrapper` 不再维持本地卡片容器语义，改为 `Card` 或 `EntityCard`
- [x] `apps/demo/src/pages/product/TeamPage.tsx` 各类 IM / member / alignment / task 卡片统一 shadow、radius、selected、hover 行为到 ui-web card 体系
- [x] `apps/demo/src/pages/product/AutomationPage.tsx` automation card / template card 从手写 button-card 改为 `EntityCard`
- [ ] `apps/demo/src/pages/product/CloneBuilderPage.tsx` contacts / summary / stats 区块优先评估替换为 `StatCard` 或 `Card`
- [x] `apps/demo/src/index.css` 中 `.card` / `.card-static` 应逐步废弃，避免继续维护 demo 专属 card contract

### 6. 中高优先级：badge / pill / tag 统一到 `Badge` / `FilterPills` / `TagGroup`

- [x] `apps/demo/src/pages/product/TeamPage.tsx` 中 `BOT`、优先级、等级、count 等各种 `<span>` badge 改为 `Badge`
- [x] `apps/demo/src/pages/product/SessionsPage.tsx` 中 `FileOpBadge` 的 action label、会话状态标记（如“代问”“主动”）改为 `Badge`
- [x] `apps/demo/src/pages/product/AutomationPage.tsx` 中状态 / 类型 / detail pill 改为 `Badge`
- [ ] `apps/demo/src/pages/product/CloneBuilderPage.tsx` 中渠道与状态标签改为 `Badge`
- [x] `apps/demo/src/pages/product/SkillsPage.tsx` Explore 分类切换从手写 pills 改为 `FilterPills`
- [x] `apps/demo/src/pages/product/CloneBuilderPage.tsx` Memory 分类切换从手写 pills 改为 `FilterPills`
- [x] `apps/demo/src/index.css` 中 `.tag` / `.tag-highlight` 逐步由 `TagGroup` / `Badge` 替代

### 7. 中优先级：表单控件统一到 `Input` / `Textarea` / `FormField`

- [x] `apps/demo/src/pages/product/SkillsPage.tsx` Explore 搜索框从原生 `<input>` 改为 `Input`
- [x] `apps/demo/src/pages/product/SkillsPage.tsx:818` `WorkflowEditorModal` 右侧配置输入框改为 `FormField` + `Input`
- [x] `apps/demo/src/pages/product/SkillsPage.tsx:627` `ChatCreatorModal` 底部输入框从原生 `<textarea>` 改为 `Textarea`
- [x] `apps/demo/src/pages/product/SessionsPage.tsx` 聊天输入区原生 `<textarea>` 改为 `Textarea`
- [x] `apps/demo/src/pages/product/CloneBuilderPage.tsx` 中各类搜索 / quick chat / 配置输入尽量统一为 `Input` / `Textarea`
- [x] `apps/demo/src/pages/product/FileEditor.tsx` 若仍在使用原生编辑输入壳层，需评估是否至少把外围表单控件与工具栏按钮统一到 ui-web
- [x] `apps/demo/src/pages/product/OnboardingChat.tsx` 原生输入与发送区需要评估收敛到 `Textarea` + `Button`

### 8. 中优先级：按钮语义不要继续靠 className 手搓

- [x] `apps/demo/src/pages/product/TeamPage.tsx:131` `CardButton` 尽量删除，改为 `Button` 变体组合，而不是用 `size="inline" + 自定义 class` 维持另一套按钮系统
- [x] `apps/demo/src/pages/product/SessionsPage.tsx` 工具栏 icon button、发送按钮、创建会话按钮统一改为 `Button` 的 `ghost` / `outline` / `icon-sm` 语义
- [ ] `apps/demo/src/pages/product/SkillsPage.tsx` 中大面积 `Button size="inline" + 完全覆盖 className` 的写法需要收敛，避免名义上用 ui-web、实际上仍是自定义按钮
- [ ] `apps/demo/src/pages/product/CloneBuilderPage.tsx` “添加”类虚线按钮统一评估为 `Button variant="outline"` 或组件库 empty-state CTA
- [x] `apps/demo/src/app/design-system-shell.tsx` 折叠/展开 sidebar 的 icon button 也应统一到 `Button` 交互规范

### 9. 中优先级：tab / stepper / progress / status 等状态组件统一

- [x] `apps/demo/src/pages/product/SkillsPage.tsx` 顶部 tabs 从手写 underline button 改为 `ToggleGroup` / `Tabs` 组件体系
- [x] `apps/demo/src/pages/journey/JourneyPage.tsx:102` 顶部 stepper 从手写 dots + connectors 改为 `Stepper`
- [x] `apps/demo/src/pages/product/TeamPage.tsx:80` 本地 `ProgressBar` 改为 `Progress`
- [x] `apps/demo/src/pages/product/TeamPage.tsx` 成员在线状态圆点改为 `StatusDot`
- [x] `apps/demo/src/index.css` 中 `.status-dot` 相关样式逐步废弃，交给组件库承担

### 10. 中优先级：聊天 / 会话气泡统一到 conversation primitives

- [x] `apps/demo/src/pages/product/SessionsPage.tsx` 聊天气泡评估改为 `ConversationMessage`
- [x] `apps/demo/src/pages/product/SkillsPage.tsx` `ChatCreatorModal` 内消息气泡改为 `ConversationMessage`
- [x] `apps/demo/src/pages/LandingParts.tsx` 本地 `ChatMsg` 组件改为 `ConversationMessage`
- [x] `apps/demo/src/pages/product/TeamInsightsChat.tsx` 若仍手写消息列表与输入区，建议整体向 conversation primitives 靠拢
- [x] `apps/demo/src/pages/product/OnboardingChat.tsx` 同样评估改造为统一会话样式

### 11. 中优先级：表格、列表、滚动容器不要维持双轨体系

- [x] `apps/demo/src/index.css` 中 `.data-table*` 样式语义应逐步淘汰，优先统一到 `DataTable` / `Table`
- [ ] `apps/demo/src/pages/product/SessionsPage.tsx` 已经在使用 `DataTable`，剩余列表/详情区域风格也应向同一套表格与行容器靠拢
- [ ] `apps/demo/src/pages/product/TeamPage.tsx`、`CloneBuilderPage.tsx`、`AutomationPage.tsx` 中 raw `overflow-y-auto` 区域可评估换成 `ScrollArea`
- [ ] `apps/demo/src/pages/product/FileTree.tsx` 原生 tree/list 行容器应评估对齐 `InteractiveRow` 风格

### 12. 中优先级：全局 CSS 中与组件库平行的“原语规范”应清理

- [x] `apps/demo/src/index.css` 中 `.heading-page` / `.heading-page-desc` / `.heading-section` 不应继续作为主路径，页面标题与层级优先交给 `PageHeader` 与 token typography
- [x] `apps/demo/src/index.css` 中 modal / tabs / filter pills / sidebar / card / text-link 等“设计规范注释 + 自定义 class”需要逐步收敛，避免 demo 形成第二套 design system
- [ ] `apps/demo/src/index.css:42` demo 自己维护的 radius token（如 `--radius-4` 到 `--radius-32`）应评估收敛到 tokens 包里的 radius 体系
- [ ] `apps/demo/src/index.css:54` demo 自己维护的 shadow token（如 `--shadow-refine` / `--shadow-elevated`）应评估收敛到 tokens 包里的 shadow 体系
- [ ] `apps/demo/src/index.css:33` 对 `--color-border` 的覆盖需要复核，避免 demo 与 ui-web 在边框层级上持续漂移

### 13. 低优先级：Landing / Journey / 辅助组件也要纳入一致性治理

- [x] `apps/demo/src/pages/journey/StepSession.tsx` 仍有较多 native button / input，需要补入 ui-web 体系
- [ ] `apps/demo/src/pages/journey/StepOnboarding.tsx` / `StepClone.tsx` / `StepAutomation.tsx` / `StepTeam.tsx` / `StepUpgrade.tsx` 虽已部分接入 ui-web，但仍需检查是否存在大量 raw CTA / badge / input
- [x] `apps/demo/src/components/CommentSystem.tsx` overlay、输入区、控制按钮需要评估是否迁移到 `Dialog` / `Sheet` / `Textarea` / `Button`
- [x] `apps/demo/src/components/LanguageSwitcher.tsx` 如果仍是手写切换器，需评估是否可改为 `DropdownMenu` / `Select` / `ToggleGroup`

## 建议优先执行顺序

- [ ] 1. 先统一所有 modal / overlay / detail panel（影响最大，且最容易形成一致视觉）
- [ ] 2. 再清理 sidebar/nav、page header、card 容器三大结构层
- [ ] 3. 再批量收敛 badge / input / button / filter pills / progress / status dot
- [ ] 4. 最后处理 journey、landing、comment system 以及 `index.css` 中的平行原语

## 建议重点检查文件

- `apps/demo/src/app/design-system-shell.tsx`
- `apps/demo/src/pages/product/SkillsPage.tsx`
- `apps/demo/src/pages/product/PricingModal.tsx`
- `apps/demo/src/pages/product/InspectorPanel.tsx`
- `apps/demo/src/pages/product/AutomationPage.tsx`
- `apps/demo/src/pages/product/TeamPage.tsx`
- `apps/demo/src/pages/product/SessionsPage.tsx`
- `apps/demo/src/pages/product/CloneBuilderPage.tsx`
- `apps/demo/src/pages/product/FileTree.tsx`
- `apps/demo/src/pages/product/FileEditor.tsx`
- `apps/demo/src/pages/product/OnboardingChat.tsx`
- `apps/demo/src/pages/product/TeamInsightsChat.tsx`
- `apps/demo/src/pages/journey/JourneyPage.tsx`
- `apps/demo/src/pages/journey/StepSession.tsx`
- `apps/demo/src/pages/LandingParts.tsx`
- `apps/demo/src/components/CommentSystem.tsx`
- `apps/demo/src/components/LanguageSwitcher.tsx`
- `apps/demo/src/index.css`

## 结论

- demo 当前的主要问题不是“完全没用 ui-web”，而是**同时存在 ui-web 与一套 demo 自定义原语并行**。
- 如果只做零散修补，视觉一致性仍会继续漂移。
- 更合适的方向是：先把 **overlay / panel / nav / card / badge / input** 这些最常见且最能建立整体风格的部件统一掉，再逐步清理 `index.css` 中那套平行设计系统。
