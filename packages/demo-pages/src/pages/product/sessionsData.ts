import { BarChart3, Clock, GitBranch, Globe, type LucideIcon, Palette, Shield } from "lucide-react";

export type FileOpAction = "read" | "write" | "create" | "delete" | "execute" | "install";

export interface FileOp {
  action: FileOpAction;
  path: string;
}

export type FileType =
  | "markdown"
  | "yaml"
  | "code"
  | "jsonl"
  | "contact"
  | "skill"
  | "config"
  | "pdf"
  | "docx"
  | "xlsx"
  | "csv"
  | "pptx"
  | "image"
  | "video"
  | "audio"
  | "figma"
  | "svg"
  | "html"
  | "sql"
  | "archive"
  | "other";

export interface SessionFileOp {
  action: FileOpAction;
  path: string;
  fileType: FileType;
  size?: string;
  time: string;
  preview?: string;
  diff?: { added: number; removed: number };
}

export type AttachmentType =
  | "image"
  | "pdf"
  | "document"
  | "spreadsheet"
  | "audio"
  | "video"
  | "code"
  | "archive"
  | "other";

export interface Attachment {
  name: string;
  type: AttachmentType;
  size: string;
  thumbnail?: string;
}

export type CardType = "file" | "memory" | "skill" | "automation" | "collaboration" | "upgrade";
export type CardStatus = "success" | "running" | "warning" | "info" | "locked";

export interface ChatCard {
  type: CardType;
  title: string;
  status: CardStatus;
  body: string;
  path?: string;
  diff?: { added: number; removed: number };
  actions?: { label: string; primary?: boolean }[];
  viralCta?: string;
  meta?: string;
}

export interface Message {
  from: "user" | "clone";
  content: string;
  fileOps?: FileOp[];
  tool?: { name: string; icon: LucideIcon; status: string };
  attachments?: Attachment[];
  cards?: ChatCard[];
}

export interface SessionData {
  messages: Message[];
  fileOps: SessionFileOp[];
}

export interface SessionMeta {
  id: number;
  title: string;
  time: string;
  emoji: string;
  unread: boolean;
  channel: string;
  fileOps: number;
  contacts: number;
  isProactive?: boolean;
  isProxy?: boolean;
  proxyTarget?: string;
}

export const SESSIONS: SessionMeta[] = [
  {
    id: 1,
    title: "注册流程优化方案",
    time: "刚刚",
    emoji: "📄",
    unread: false,
    channel: "web",
    fileOps: 10,
    contacts: 3,
  },
  {
    id: 9,
    title: "查询李四 Gateway 进度",
    time: "30 分钟前",
    emoji: "🤝",
    unread: true,
    channel: "feishu",
    fileOps: 2,
    contacts: 1,
    isProxy: true,
    proxyTarget: "李四",
  },
  {
    id: 6,
    title: "今日战况复盘",
    time: "22:00",
    emoji: "📡",
    unread: true,
    channel: "feishu",
    fileOps: 7,
    contacts: 0,
    isProactive: true,
  },
  {
    id: 7,
    title: "联系人关系分析",
    time: "1 小时前",
    emoji: "👥",
    unread: true,
    channel: "web",
    fileOps: 8,
    contacts: 6,
  },
  {
    id: 8,
    title: "产品会 Action Items",
    time: "3 小时前",
    emoji: "📋",
    unread: false,
    channel: "feishu",
    fileOps: 6,
    contacts: 4,
  },
  {
    id: 2,
    title: "竞品分析报告",
    time: "2 小时前",
    emoji: "🔍",
    unread: true,
    channel: "feishu",
    fileOps: 9,
    contacts: 1,
  },
  {
    id: 3,
    title: "数据库迁移计划",
    time: "昨天",
    emoji: "💾",
    unread: false,
    channel: "slack",
    fileOps: 11,
    contacts: 2,
  },
  {
    id: 4,
    title: "本周 Sprint 回顾",
    time: "2 天前",
    emoji: "📊",
    unread: false,
    channel: "feishu",
    fileOps: 8,
    contacts: 5,
  },
  {
    id: 5,
    title: "Landing Page 文案",
    time: "3 天前",
    emoji: "✍️",
    unread: false,
    channel: "whatsapp",
    fileOps: 10,
    contacts: 0,
  },
];

// ─── Session 1: PRD + Research ───────────────────────────────

const SESSION_1_MESSAGES: Message[] = [
  {
    from: "user",
    content: '帮我做一个注册流程优化方案，参考之前我说的"注册要尽量简单"，这是老版注册流程',
    attachments: [
      { name: "当前注册流程.pdf", type: "pdf", size: "560 KB" },
      { name: "注册页截图.png", type: "image", size: "180 KB" },
    ],
  },
  {
    from: "clone",
    content: "收到。让我先查一下你的记忆...",
    cards: [
      {
        type: "memory",
        title: "检索到 3 条相关记忆",
        status: "success",
        body: "偏好 OAuth 减少表单 · 已决定 Google 登录优先 · 注册加谷歌登录灵感",
        path: "memory/",
        meta: "记忆检索 · 匹配度 92%",
        actions: [{ label: "查看详情" }],
      },
    ],
    fileOps: [
      { action: "read", path: "memory/preferences/tech-stack.md" },
      { action: "read", path: "memory/decisions/2026-02-21-auth-oauth.md" },
      { action: "read", path: "memory/ideas/google-login-onboarding.md" },
    ],
  },
  {
    from: "clone",
    content: "另外，王浩（前端）上周在群里提过飞书扫码的技术方案，我一起参考。",
    cards: [
      {
        type: "collaboration",
        title: "关联联系人：王浩",
        status: "info",
        body: "前端工程师 · 有飞书扫码集成经验\n上周在产品群提过技术方案",
        path: "contacts/王浩-前端.md",
        actions: [{ label: "查看联系人" }],
      },
    ],
    fileOps: [{ action: "read", path: "contacts/王浩-前端.md" }],
  },
  {
    from: "clone",
    content: "",
    cards: [
      {
        type: "skill",
        title: "搜索竞品注册流程",
        status: "success",
        body: "✓ 搜索了 5 个竞品注册流程\n✓ 对比 Notion / Linear / Figma",
        path: "skills/web-research/SKILL.md",
        meta: "web-research · 耗时 12s",
        actions: [{ label: "查看日志" }, { label: "重试" }],
      },
    ],
    tool: { name: "搜索竞品注册流程", icon: Globe, status: "done" },
  },
  {
    from: "clone",
    content: "方案已生成：",
    cards: [
      {
        type: "file",
        title: "注册流程优化 PRD",
        status: "success",
        body: "方案 A（推荐）：Google OAuth + 飞书扫码\n预计注册转化率提升 40%",
        path: "artifacts/prds/注册流程优化.md",
        diff: { added: 48, removed: 0 },
        actions: [{ label: "打开编辑", primary: true }, { label: "分享" }],
      },
      {
        type: "file",
        title: "竞品注册流程对比",
        status: "success",
        body: "对比 Notion / Linear / Figma 注册方式\n含 20 家 SaaS 转化率数据",
        path: "artifacts/research/竞品注册流程对比.md",
        diff: { added: 72, removed: 0 },
        actions: [{ label: "打开编辑", primary: true }],
      },
    ],
    fileOps: [
      { action: "create", path: "artifacts/research/竞品注册流程对比.md" },
      { action: "create", path: "artifacts/prds/注册流程优化.md" },
    ],
  },
  {
    from: "clone",
    content:
      "推荐方案 A：Google OAuth + 飞书扫码（基于你的偏好 + 王浩的技术调研）\n\n需要我帮你拆成开发任务吗？我可以直接分配给王浩和陈杰。",
    cards: [
      {
        type: "memory",
        title: "决策已记录",
        status: "success",
        body: "Auth 方案确认：Google OAuth + 飞书扫码双通道",
        path: "memory/decisions/2026-02-21-auth-oauth.md",
        diff: { added: 12, removed: 3 },
        meta: "决策记录 · 自动关联",
        actions: [{ label: "查看决策" }, { label: "修正" }],
      },
      {
        type: "automation",
        title: "Sprint 自动更新",
        status: "success",
        body: "新增任务：注册流程优化（OAuth 方案）\n已分配：王浩 → Google OAuth · 陈杰 → 服务端集成",
        path: "memory/context/current-sprint.md",
        diff: { added: 5, removed: 2 },
        meta: "Sprint W9 · 自动同步",
      },
    ],
    fileOps: [
      { action: "write", path: "memory/decisions/2026-02-21-auth-oauth.md" },
      { action: "write", path: "memory/context/current-sprint.md" },
      { action: "write", path: "contacts/李薇-PM.md" },
    ],
  },
];

const SESSION_1_FILE_OPS: SessionFileOp[] = [
  {
    action: "create",
    path: "artifacts/prds/注册流程优化.md",
    fileType: "markdown",
    size: "2.1 KB",
    time: "18:32",
    diff: { added: 48, removed: 0 },
    preview:
      "# 注册流程优化 PRD\n\n## 背景\n基于用户历史偏好和竞品调研，优化注册流程以降低用户进入门槛。\n\n## 方案 A（推荐）：OAuth 优先\n- **Google OAuth** — 一键登录，零表单\n- **飞书扫码** — 面向国内企业用户\n- 预计注册转化率提升 40%",
  },
  {
    action: "create",
    path: "artifacts/prds/onboarding-flowchart.svg",
    fileType: "svg",
    size: "12 KB",
    time: "18:32",
    preview: "[SVG 流程图] 注册 → OAuth 验证 → 角色选择 → 上岗完成",
  },
  {
    action: "create",
    path: "artifacts/research/竞品注册流程对比.md",
    fileType: "markdown",
    size: "3.4 KB",
    time: "18:31",
    diff: { added: 72, removed: 0 },
    preview:
      "# 竞品注册流程对比\n\n| 产品 | 注册方式 | 步骤数 | 转化率 |\n|------|---------|--------|--------|\n| Notion | Google OAuth | 1 | ~85% |\n| Linear | Google/GitHub | 1 | ~82% |\n| Figma | Google/SSO | 2 | ~78% |",
  },
  {
    action: "create",
    path: "artifacts/research/市场调研数据.xlsx",
    fileType: "xlsx",
    size: "156 KB",
    time: "18:31",
    preview:
      "[Excel 表格] 20 家 SaaS 产品注册转化率数据\n\n含 4 个 sheet: 概览, 详情, 趋势图, 原始数据",
  },
  {
    action: "write",
    path: "memory/decisions/auth-oauth.md",
    fileType: "markdown",
    size: "0.8 KB",
    time: "18:33",
    diff: { added: 12, removed: 3 },
    preview:
      "# Auth Decision: OAuth 优先\n\n**更新**: 2026-02-21\n**状态**: 已确认\n\n基于竞品调研和用户偏好，决定采用 Google OAuth + 飞书扫码的双通道方案。",
  },
  {
    action: "write",
    path: "memory/context/current-sprint.md",
    fileType: "markdown",
    size: "1.2 KB",
    time: "18:33",
    diff: { added: 5, removed: 2 },
    preview:
      "# Current Sprint — W9\n\n## 新增任务\n- [ ] 注册流程优化（OAuth 方案）\n- [ ] 王浩：Google OAuth 回调页面\n- [ ] 陈杰：OAuth 服务端集成",
  },
  {
    action: "write",
    path: "contacts/李薇-PM.md",
    fileType: "contact",
    size: "0.6 KB",
    time: "18:34",
    diff: { added: 3, removed: 0 },
    preview:
      "# 李薇\n\n**角色**: PM\n**最近交互**: 注册流程优化 PRD 评审\n**待办**: 评审注册流程 PRD",
  },
  {
    action: "read",
    path: "memory/preferences/tech-stack.md",
    fileType: "markdown",
    size: "0.5 KB",
    time: "18:30",
    preview:
      "# Tech Stack Preferences\n\n- **Auth**: OAuth 优先，减少表单\n- **Frontend**: React + Tailwind\n- **Backend**: NestJS + PostgreSQL",
  },
  {
    action: "read",
    path: "memory/ideas/google-login-onboarding.md",
    fileType: "markdown",
    size: "0.3 KB",
    time: "18:30",
    preview:
      "# 灵感：Google Login + Onboarding\n\n2026-02-15 记录\n\n注册加谷歌登录，减少用户注册摩擦。参考 Linear 的做法。",
  },
  {
    action: "read",
    path: "contacts/王浩-前端.md",
    fileType: "contact",
    size: "0.7 KB",
    time: "18:31",
    preview:
      "# 王浩\n\n**角色**: 前端工程师\n**专长**: React, 飞书 SDK\n**备注**: 有飞书扫码集成经验",
  },
  {
    action: "execute",
    path: "skills/web-research/SKILL.md",
    fileType: "skill",
    size: "—",
    time: "18:31",
    preview:
      '# Web Research\n\ntriggers: ["搜索", "调研", "竞品"]\ntools: [web_search, markdown_write]\n\n## 执行结果\n✓ 搜索了 5 个竞品的注册流程\n✓ 生成了对比报告',
  },
  {
    action: "install",
    path: "skills/prd-generator/SKILL.md",
    fileType: "skill",
    size: "1.1 KB",
    time: "18:29",
    preview:
      '# PRD Generator\n\ntriggers: ["PRD", "需求文档", "产品方案"]\ntools: [markdown_write, memory_search]\n\n## Instructions\n生成产品需求文档，自动关联记忆和联系人。',
  },
];

// ─── Session 2: Proactive Daily Digest (Automation) ───────────

const SESSION_2_MESSAGES: Message[] = [
  {
    from: "clone",
    content: "",
    cards: [
      {
        type: "automation",
        title: "🔔 今日战况复盘",
        status: "running",
        body: "分身主动触发 · automation/daily-digest.yaml\n正在扫描今日 3 个活跃 Session...",
        path: "automation/daily-digest.yaml",
        meta: "cron: 每天 22:00 · 飞书群推送",
        actions: [{ label: "暂停规则" }, { label: "修改配置" }],
      },
    ],
  },
  {
    from: "clone",
    content: "",
    cards: [
      {
        type: "skill",
        title: "Daily Digest Automation",
        status: "success",
        body: "✓ 扫描 3 个活跃 Session\n✓ 检测 5 个新文件变更\n✓ 关联 3 位联系人",
        path: "automation/daily-digest.yaml",
        meta: "耗时 8s · 自动执行",
      },
    ],
    tool: { name: "执行 Daily Digest Automation", icon: Clock, status: "done" },
  },
  {
    from: "clone",
    content: "",
    cards: [
      {
        type: "file",
        title: "今日战况复盘 — 2026-02-21",
        status: "success",
        body: "✅ 完成：注册流程优化 PRD、竞品调研\n🔄 进行中：OAuth 集成（王浩）、数据库 Schema（陈杰）\n⚠️ 风险：Google OAuth 密钥未配置\n\n📈 产出：新增 5 文件 · 更新 3 条记忆",
        path: "artifacts/reports/daily-digest-0221.md",
        diff: { added: 35, removed: 0 },
        actions: [{ label: "打开报告", primary: true }, { label: "发到飞书群" }],
        viralCta: "让同事的分身也加入日报？邀请 →",
      },
      {
        type: "collaboration",
        title: "已推送到飞书「产品团队」群",
        status: "success",
        body: "@张明 @李薇 @王浩 已通知\n卡片已发送至群聊",
        meta: "feishu-push · 3 人已读",
        viralCta: "群成员也想要自己的分身？",
      },
    ],
    fileOps: [
      { action: "create", path: "artifacts/reports/daily-digest-0221.md" },
      { action: "write", path: "memory/context/current-sprint.md" },
    ],
  },
  { from: "user", content: "帮我把这个 digest 的频率改成每天 21:00，不要 22:00" },
  {
    from: "clone",
    content: "",
    cards: [
      {
        type: "automation",
        title: "Automation 配置已更新",
        status: "success",
        body: "⏰ cron: 0 22 * * * → 0 21 * * *\n每天 21:00 自动执行战况复盘",
        path: "automation/daily-digest.yaml",
        diff: { added: 1, removed: 1 },
        meta: "下次触发：明天 21:00",
        actions: [{ label: "查看规则" }, { label: "测试执行" }],
      },
    ],
    fileOps: [{ action: "write", path: "automation/daily-digest.yaml" }],
  },
];

const SESSION_2_FILE_OPS: SessionFileOp[] = [
  {
    action: "create",
    path: "artifacts/reports/daily-digest-0221.md",
    fileType: "markdown",
    size: "1.8 KB",
    time: "22:00",
    diff: { added: 35, removed: 0 },
    preview:
      "# 今日战况复盘 — 2026-02-21\n\n## 完成\n- ✅ 注册流程优化 PRD\n- ✅ 竞品注册流程调研\n\n## 进行中\n- 🔄 OAuth 集成（王浩）\n- 🔄 数据库 Schema 设计（陈杰）\n\n## 风险\n- ⚠️ Google OAuth 密钥未配置\n\n## 产出\n- 新增 5 个文件\n- 更新 3 条记忆\n- 涉及 3 位联系人",
  },
  {
    action: "write",
    path: "automation/daily-digest.yaml",
    fileType: "yaml",
    size: "0.4 KB",
    time: "22:05",
    diff: { added: 1, removed: 1 },
    preview:
      '# Daily Digest Automation\n\nname: 今日战况复盘\ncron: "0 21 * * *"\nchannel: feishu\n\nsteps:\n  - scan_sessions\n  - scan_memory_changes\n  - generate_report\n  - push_to_feishu',
  },
  {
    action: "write",
    path: "memory/context/current-sprint.md",
    fileType: "markdown",
    size: "1.2 KB",
    time: "22:01",
    diff: { added: 8, removed: 2 },
    preview:
      "# Current Sprint — W9\n\n## 今日进展（自动更新）\n- 注册优化 PRD 已完成\n- 竞品分析已生成\n- OAuth 集成进行中",
  },
  {
    action: "read",
    path: "sessions/2026-02-21-注册优化/thread.jsonl",
    fileType: "jsonl",
    size: "4.2 KB",
    time: "22:00",
    preview: "(会话日志 — 28 条消息)\n\n扫描今日所有会话，提取关键产出和决策...",
  },
  {
    action: "read",
    path: "memory/context/current-sprint.md",
    fileType: "markdown",
    size: "1.0 KB",
    time: "22:00",
    preview: "# Current Sprint — W9\n\n读取当前 sprint 状态以生成日报...",
  },
  {
    action: "execute",
    path: "automation/daily-digest.yaml",
    fileType: "yaml",
    size: "—",
    time: "22:00",
    preview:
      "# Daily Digest Automation\n\n## 执行结果\n✓ 扫描 3 个活跃 session\n✓ 检测到 5 个新文件变更\n✓ 生成战况报告\n✓ 推送到飞书群",
  },
  {
    action: "execute",
    path: "skills/feishu-push/SKILL.md",
    fileType: "skill",
    size: "—",
    time: "22:01",
    preview:
      '# Feishu Push\n\ntriggers: ["推送", "飞书", "通知"]\ntools: [feishu_api, markdown_read]\n\n## 执行结果\n✓ 推送到「产品团队」群\n✓ @了张明、李薇、王浩',
  },
];

// ─── Session 3: Deep Research + Context Upload ───────────────

const SESSION_3_MESSAGES: Message[] = [
  {
    from: "user",
    content: "帮我做一份深度竞品分析报告，这是我收集的资料",
    attachments: [
      { name: "linear-pricing.png", type: "image", size: "240 KB" },
      { name: "notion-ai-features.png", type: "image", size: "185 KB" },
      { name: "cursor-agent-mode.png", type: "image", size: "320 KB" },
      { name: "AI Agent 市场格局报告.pdf", type: "pdf", size: "2.3 MB" },
    ],
  },
  {
    from: "clone",
    content: "收到 4 份资料（3 张截图 + 1 份 PDF 报告）。让我先整理上传的 context...",
    fileOps: [
      { action: "create", path: "knowledge/references/competitor-linear-pricing.png" },
      { action: "create", path: "knowledge/references/competitor-linear.md" },
      { action: "create", path: "knowledge/references/competitor-notion.md" },
      { action: "create", path: "knowledge/references/competitor-cursor.md" },
      { action: "create", path: "knowledge/references/ai-agent-landscape.pdf" },
    ],
  },
  {
    from: "clone",
    content: "",
    tool: { name: "Deep Research — 联网搜索竞品信息", icon: Globe, status: "done" },
  },
  {
    from: "clone",
    content: "",
    tool: { name: "Deep Research — 分析产品定价策略", icon: BarChart3, status: "done" },
  },
  {
    from: "clone",
    content: "",
    fileOps: [
      { action: "read", path: "memory/facts/project-refly.md" },
      { action: "read", path: "knowledge/architecture.md" },
    ],
  },
  {
    from: "clone",
    content:
      "深度分析完成。结合你上传的资料 + 联网搜索 + 你的项目上下文，生成了完整报告：\n\n📄 artifacts/research/竞品深度分析.md\n\n关键发现：\n1. Linear 的 AI-first 策略正在吃掉 Jira 份额\n2. Notion AI 月付费转化率仅 12%\n3. Cursor 的 agent 模式是我们最直接的参考\n\n建议 nexu 差异化方向：记忆 + 文件系统 + 多渠道。",
    fileOps: [
      { action: "create", path: "artifacts/research/竞品深度分析.md" },
      { action: "write", path: "memory/decisions/competitive-positioning.md" },
    ],
  },
];

const SESSION_3_FILE_OPS: SessionFileOp[] = [
  {
    action: "create",
    path: "artifacts/research/竞品深度分析.md",
    fileType: "markdown",
    size: "5.8 KB",
    time: "16:45",
    diff: { added: 128, removed: 0 },
    preview:
      "# 竞品深度分析报告\n\n## Linear\n- AI-first 项目管理\n- 月活 200K+，ARR $50M\n- 强项：速度、设计、AI triage\n\n## Notion\n- AI 助手 + 知识库\n- Notion AI 付费转化率 ~12%\n- 弱项：agent 能力有限\n\n## Cursor\n- AI-native IDE\n- Agent mode 是关键差异化\n- 参考：filesystem + agent 交互模式",
  },
  {
    action: "create",
    path: "artifacts/research/竞品对比数据.xlsx",
    fileType: "xlsx",
    size: "89 KB",
    time: "16:44",
    preview:
      "[Excel] 3 个竞品的功能矩阵对比\n\nSheet 1: 功能对比 (34 维度)\nSheet 2: 定价对比\nSheet 3: 技术栈分析",
  },
  {
    action: "create",
    path: "knowledge/references/competitor-linear-pricing.png",
    fileType: "image",
    size: "240 KB",
    time: "16:30",
    preview: "[截图] Linear 定价页面截图 — $8/user/mo, 3 tier 结构",
  },
  {
    action: "create",
    path: "knowledge/references/competitor-linear.md",
    fileType: "markdown",
    size: "1.2 KB",
    time: "16:30",
    diff: { added: 24, removed: 0 },
    preview:
      "# Linear — 竞品资料\n\n**来源**: 用户上传截图 + 联网搜索\n**定价**: $8/user/mo\n**特点**: AI triage, cycles, projects",
  },
  {
    action: "create",
    path: "knowledge/references/competitor-notion.md",
    fileType: "markdown",
    size: "1.0 KB",
    time: "16:30",
    diff: { added: 20, removed: 0 },
    preview:
      "# Notion — 竞品资料\n\n**来源**: 用户上传截图 + 联网搜索\n**定价**: $10/user/mo (AI add-on)\n**特点**: 知识库, wiki, AI Q&A",
  },
  {
    action: "create",
    path: "knowledge/references/competitor-cursor.md",
    fileType: "markdown",
    size: "1.1 KB",
    time: "16:30",
    diff: { added: 22, removed: 0 },
    preview:
      "# Cursor — 竞品资料\n\n**来源**: 用户上传截图 + 联网搜索\n**定价**: $20/mo Pro\n**特点**: Agent mode, codebase-aware, tab completion",
  },
  {
    action: "create",
    path: "knowledge/references/ai-agent-landscape.pdf",
    fileType: "pdf",
    size: "2.3 MB",
    time: "16:28",
    preview:
      "[PDF] AI Agent 2026 市场格局报告\n\n来源: a16z Research, 45 pages\n用户上传的参考文献，OCR 提取关键数据用于分析",
  },
  {
    action: "write",
    path: "memory/decisions/competitive-positioning.md",
    fileType: "markdown",
    size: "0.9 KB",
    time: "16:46",
    diff: { added: 18, removed: 0 },
    preview:
      "# Competitive Positioning\n\n**决策**: nexu 差异化方向\n- 记忆系统（vs Notion 的无状态 AI）\n- 文件系统范式（vs Linear 的 SaaS 范式）\n- 多渠道集成（vs Cursor 的 IDE-only）",
  },
  {
    action: "read",
    path: "memory/facts/project-refly.md",
    fileType: "markdown",
    size: "0.8 KB",
    time: "16:35",
    preview: "# Project Refly\n\n核心产品信息，用于对比竞品时理解自身定位...",
  },
  {
    action: "read",
    path: "knowledge/architecture.md",
    fileType: "markdown",
    size: "1.5 KB",
    time: "16:35",
    preview: "# Architecture\n\n技术架构文档，用于评估竞品技术方案可行性...",
  },
  {
    action: "execute",
    path: "skills/web-research/SKILL.md",
    fileType: "skill",
    size: "—",
    time: "16:32",
    preview:
      "# Web Research\n\n## 执行结果\n✓ 搜索 Linear, Notion, Cursor 最新动态\n✓ 抓取定价页面和 changelog\n✓ 分析 ProductHunt 评论",
  },
  {
    action: "execute",
    path: "skills/deep-analysis/SKILL.md",
    fileType: "skill",
    size: "—",
    time: "16:40",
    preview:
      '# Deep Analysis\n\ntriggers: ["分析", "对比", "研究"]\ntools: [web_search, markdown_write, memory_read]\n\n## 执行结果\n✓ 交叉对比 3 个竞品\n✓ SWOT 分析完成\n✓ 生成定位建议',
  },
];

// ─── Session 4: Linear + Code + Deploy ───────────────────────

const SESSION_4_MESSAGES: Message[] = [
  {
    from: "user",
    content: "帮我拉一下 Linear 上这周的需求，然后写数据库迁移的代码",
    attachments: [
      { name: "db-schema-v2.sql", type: "code", size: "3.4 KB" },
      { name: "migration-guide.md", type: "document", size: "1.8 KB" },
    ],
  },
  {
    from: "clone",
    content: "正在连接 Linear...",
    tool: { name: "拉取 Linear Issues — Sprint W9", icon: GitBranch, status: "done" },
  },
  {
    from: "clone",
    content: "",
    fileOps: [
      { action: "read", path: "knowledge/architecture.md" },
      { action: "read", path: "memory/preferences/tech-stack.md" },
    ],
  },
  {
    from: "clone",
    content:
      "从 Linear 拉取了 4 个 Issue：\n\n1. NEX-42: 用户表增加 OAuth 字段\n2. NEX-43: 创建 sessions 表\n3. NEX-44: 添加 memory 索引\n4. NEX-45: 联系人关联表\n\n基于你的技术栈偏好（PostgreSQL + TypeORM），我来生成迁移代码。",
  },
  {
    from: "clone",
    content: "",
    fileOps: [
      { action: "create", path: "artifacts/code/migration-001-oauth.sql" },
      { action: "create", path: "artifacts/code/migration-002-sessions.sql" },
      { action: "create", path: "artifacts/code/migration-003-memory-index.sql" },
    ],
  },
  {
    from: "clone",
    content: "",
    tool: { name: "Code Review — 检查 SQL 语法", icon: Shield, status: "done" },
  },
  {
    from: "clone",
    content:
      "3 个迁移文件已生成：\n\n```\nmigration-001-oauth.sql      — 用户表 OAuth 字段\nmigration-002-sessions.sql   — sessions 表\nmigration-003-memory-index.sql — memory 全文索引\n```\n\n代码已通过 lint 检查。要我帮你创建 PR 吗？",
    fileOps: [
      { action: "write", path: "memory/context/current-sprint.md" },
      { action: "write", path: "contacts/陈杰-后端.md" },
    ],
  },
  { from: "user", content: "创建 PR 吧，分配给陈杰 review" },
  {
    from: "clone",
    content: "",
    tool: { name: "创建 GitHub PR #127", icon: GitBranch, status: "done" },
  },
  {
    from: "clone",
    content:
      "PR 已创建：\n\n🔗 PR #127: feat: database migrations for OAuth, sessions, memory\n📋 Reviewer: 陈杰\n🏷️ Labels: database, migration\n\nLinear issues 状态已更新为 In Review。",
    fileOps: [{ action: "write", path: "contacts/陈杰-后端.md" }],
  },
];

const SESSION_4_FILE_OPS: SessionFileOp[] = [
  {
    action: "create",
    path: "artifacts/code/migration-001-oauth.sql",
    fileType: "code",
    size: "0.9 KB",
    time: "14:20",
    diff: { added: 24, removed: 0 },
    preview:
      "-- Migration 001: OAuth Fields\n\nALTER TABLE users\n  ADD COLUMN google_id VARCHAR(255),\n  ADD COLUMN avatar_url TEXT,\n  ADD COLUMN auth_provider VARCHAR(50) DEFAULT 'email',\n  ADD COLUMN last_login_at TIMESTAMP;\n\nCREATE INDEX idx_users_google_id ON users(google_id);",
  },
  {
    action: "create",
    path: "artifacts/code/migration-002-sessions.sql",
    fileType: "code",
    size: "1.2 KB",
    time: "14:21",
    diff: { added: 32, removed: 0 },
    preview:
      "-- Migration 002: Sessions Table\n\nCREATE TABLE sessions (\n  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),\n  user_id UUID REFERENCES users(id),\n  title VARCHAR(255),\n  channel VARCHAR(50),\n  created_at TIMESTAMP DEFAULT now(),\n  updated_at TIMESTAMP DEFAULT now()\n);",
  },
  {
    action: "create",
    path: "artifacts/code/migration-003-memory-index.sql",
    fileType: "code",
    size: "0.6 KB",
    time: "14:22",
    diff: { added: 16, removed: 0 },
    preview:
      "-- Migration 003: Memory Full-Text Index\n\nCREATE EXTENSION IF NOT EXISTS pg_trgm;\n\nCREATE INDEX idx_memory_content_trgm\n  ON memories USING gin(content gin_trgm_ops);\n\nCREATE INDEX idx_memory_tags\n  ON memories USING gin(tags);",
  },
  {
    action: "write",
    path: "memory/context/current-sprint.md",
    fileType: "markdown",
    size: "1.4 KB",
    time: "14:25",
    diff: { added: 6, removed: 1 },
    preview:
      "# Current Sprint — W9\n\n## 更新\n- NEX-42~45 迁移代码已完成\n- PR #127 已创建，等待陈杰 review",
  },
  {
    action: "write",
    path: "contacts/陈杰-后端.md",
    fileType: "contact",
    size: "0.8 KB",
    time: "14:26",
    diff: { added: 4, removed: 0 },
    preview:
      "# 陈杰\n\n**角色**: 后端工程师\n**最近交互**: 数据库迁移 PR review\n**待办**: Review PR #127\n**专长**: PostgreSQL, TypeORM, NestJS",
  },
  {
    action: "read",
    path: "knowledge/architecture.md",
    fileType: "markdown",
    size: "1.5 KB",
    time: "14:18",
    preview: "# Architecture\n\n读取架构文档以理解数据库 schema 设计...",
  },
  {
    action: "read",
    path: "memory/preferences/tech-stack.md",
    fileType: "markdown",
    size: "0.5 KB",
    time: "14:18",
    preview: "# Tech Stack Preferences\n\n读取技术栈偏好以选择正确的迁移方案...",
  },
  {
    action: "execute",
    path: "skills/linear-sync/SKILL.md",
    fileType: "skill",
    size: "—",
    time: "14:15",
    preview:
      '# Linear Sync\n\ntriggers: ["linear", "需求", "issue"]\ntools: [linear_api, markdown_write]\nauth: linear_oauth (✓ 已授权)\n\n## 执行结果\n✓ 拉取 Sprint W9 的 4 个 issue\n✓ 状态同步完成',
  },
  {
    action: "execute",
    path: "skills/code-automation/SKILL.md",
    fileType: "skill",
    size: "—",
    time: "14:20",
    preview:
      '# Code Automation\n\ntriggers: ["写代码", "迁移", "PR"]\ntools: [code_write, github_api, lint]\n\n## 执行结果\n✓ 生成 3 个 SQL 迁移文件\n✓ 通过 SQL lint 检查\n✓ 创建 PR #127',
  },
  {
    action: "execute",
    path: "skills/github-pr/SKILL.md",
    fileType: "skill",
    size: "—",
    time: "14:25",
    preview:
      '# GitHub PR\n\ntriggers: ["PR", "review", "合并"]\ntools: [github_api]\nauth: github_oauth (✓ 已授权)\n\n## 执行结果\n✓ 创建 PR #127\n✓ 分配 reviewer: 陈杰\n✓ 添加 labels: database, migration',
  },
  {
    action: "write",
    path: "contacts/陈杰-后端.md",
    fileType: "contact",
    size: "0.8 KB",
    time: "14:28",
    diff: { added: 2, removed: 0 },
    preview: "# 陈杰\n\n**待办更新**: Review PR #127",
  },
];

// ─── Session 5: Create Skills + Automation ───────────────────

const SESSION_5_MESSAGES: Message[] = [
  {
    from: "user",
    content: "帮我创建一个新 skill：每周 Sprint 回顾自动化。还需要配一个 automation 定时触发",
  },
  {
    from: "clone",
    content: "好的，我来帮你搭建这个 skill + automation 组合。\n\n先看看现有的 sprint 数据结构...",
    fileOps: [
      { action: "read", path: "memory/context/current-sprint.md" },
      { action: "read", path: "automation/daily-digest.yaml" },
    ],
  },
  {
    from: "clone",
    content: "",
    fileOps: [
      { action: "create", path: "skills/sprint-review/SKILL.md" },
      { action: "create", path: "skills/sprint-review/config.yaml" },
    ],
  },
  {
    from: "clone",
    content:
      "Skill 已创建：\n\n📦 skills/sprint-review/\n├── SKILL.md — skill 定义和 triggers\n└── config.yaml — 工具和权限配置\n\n这个 skill 需要用到 Linear API，我检测到你还没有授权。需要我帮你配置吗？",
  },
  { from: "user", content: "好的，帮我授权 Linear，然后配 automation" },
  {
    from: "clone",
    content: "",
    tool: { name: "配置 Linear OAuth 授权", icon: Shield, status: "done" },
  },
  {
    from: "clone",
    content: "",
    fileOps: [
      { action: "install", path: "skills/sprint-review/SKILL.md" },
      { action: "create", path: "automation/weekly-sprint-review.yaml" },
    ],
  },
  {
    from: "clone",
    content:
      "全部配置完成：\n\n✅ Linear OAuth 已授权\n✅ sprint-review skill 已安装并激活\n✅ automation 已创建：每周五 18:00 自动执行\n\n流程：Linear Issues → 分析完成度 → 生成回顾报告 → 推送飞书\n\n下周五 18:00 会自动执行第一次。你也可以手动触发测试。",
    fileOps: [{ action: "write", path: "memory/decisions/sprint-review-automation.md" }],
  },
];

const SESSION_5_FILE_OPS: SessionFileOp[] = [
  {
    action: "create",
    path: "skills/sprint-review/SKILL.md",
    fileType: "skill",
    size: "1.4 KB",
    time: "10:15",
    diff: { added: 35, removed: 0 },
    preview:
      '# Sprint Review\n\ntriggers: ["sprint", "回顾", "复盘", "周报"]\ntools: [linear_api, markdown_write, feishu_push]\nauth: [linear_oauth]\n\n## Instructions\n1. 从 Linear 拉取当前 sprint 所有 issues\n2. 统计完成率、velocity\n3. 生成 sprint 回顾报告\n4. 推送到飞书',
  },
  {
    action: "create",
    path: "skills/sprint-review/config.yaml",
    fileType: "yaml",
    size: "0.5 KB",
    time: "10:16",
    diff: { added: 15, removed: 0 },
    preview:
      "# Sprint Review Config\n\nname: sprint-review\nversion: 1.0.0\n\ntools:\n  - linear_api\n  - markdown_write\n  - feishu_push\n\nauth:\n  linear:\n    type: oauth\n    status: authorized",
  },
  {
    action: "create",
    path: "automation/weekly-sprint-review.yaml",
    fileType: "yaml",
    size: "0.4 KB",
    time: "10:20",
    diff: { added: 12, removed: 0 },
    preview:
      '# Weekly Sprint Review\n\nname: 本周 Sprint 回顾\ncron: "0 18 * * 5"\nskill: sprint-review\nchannel: feishu\n\nsteps:\n  - pull_linear_issues\n  - analyze_completion\n  - generate_report\n  - push_to_feishu',
  },
  {
    action: "write",
    path: "memory/decisions/sprint-review-automation.md",
    fileType: "markdown",
    size: "0.6 KB",
    time: "10:22",
    diff: { added: 12, removed: 0 },
    preview:
      "# Decision: Sprint Review Automation\n\n**日期**: 2026-02-19\n**决策**: 使用自建 skill + automation 实现每周 sprint 回顾\n**工具**: Linear API + 飞书推送\n**频率**: 每周五 18:00",
  },
  {
    action: "read",
    path: "memory/context/current-sprint.md",
    fileType: "markdown",
    size: "1.2 KB",
    time: "10:12",
    preview: "# Current Sprint — W9\n\n读取当前 sprint 结构作为 skill 设计参考...",
  },
  {
    action: "read",
    path: "automation/daily-digest.yaml",
    fileType: "yaml",
    size: "0.3 KB",
    time: "10:12",
    preview: "# Daily Digest\n\n参考现有 automation 的配置格式...",
  },
  {
    action: "install",
    path: "skills/sprint-review/SKILL.md",
    fileType: "skill",
    size: "1.4 KB",
    time: "10:18",
    preview:
      "# Sprint Review — 安装完成\n\n✓ Skill 已激活\n✓ Linear OAuth 已授权\n✓ 工具权限已配置\n✓ 加入已安装列表",
  },
  {
    action: "execute",
    path: "skills/sprint-review/SKILL.md",
    fileType: "skill",
    size: "—",
    time: "10:22",
    preview:
      "# Sprint Review — 测试运行\n\n## 执行结果（测试）\n✓ 连接 Linear API 成功\n✓ 拉取 Sprint W9: 12 issues\n✓ 完成率: 67% (8/12)\n✓ Velocity: 42 pts\n✓ 报告生成成功",
  },
];

// ─── Session 6: Design + Notes + Knowledge Management ────────

const SESSION_6_MESSAGES: Message[] = [
  {
    from: "user",
    content: "我有一些关于 landing page 的想法，先帮我记下来，然后用 Figma skill 出几个设计方案",
    attachments: [
      { name: "灵感语音备忘.m4a", type: "audio", size: "1.2 MB" },
      { name: "linear-homepage-ref.png", type: "image", size: "450 KB" },
      { name: "vercel-landing-ref.png", type: "image", size: "380 KB" },
    ],
  },
  {
    from: "clone",
    content: "好的，先记录你的想法到记忆系统...",
    fileOps: [{ action: "create", path: "memory/ideas/landing-page-v2.md" }],
  },
  {
    from: "user",
    content:
      '- hero section 要大胆一点，突出"你的数字分身"\n- 加竞品对比表\n- 底部要有 FAQ\n- 整体风格偏 Linear 那种克制感\n- CTA 要明确：立即体验',
  },
  {
    from: "clone",
    content: "已记录 5 条想法。让我把这些组织一下...",
    fileOps: [
      { action: "write", path: "memory/ideas/landing-page-v2.md" },
      { action: "read", path: "knowledge/references/competitor-linear.md" },
      { action: "read", path: "artifacts/prds/注册流程优化.md" },
    ],
  },
  {
    from: "clone",
    content: "",
    tool: { name: "搜索优秀 SaaS Landing Page 案例", icon: Globe, status: "done" },
  },
  {
    from: "clone",
    content: "",
    tool: { name: "Figma — 生成 Landing Page 设计方案", icon: Palette, status: "done" },
  },
  {
    from: "clone",
    content: "",
    fileOps: [
      { action: "create", path: "artifacts/designs/landing-page-v2-A.md" },
      { action: "create", path: "artifacts/designs/landing-page-v2-B.md" },
      { action: "execute", path: "skills/figma-design/SKILL.md" },
    ],
  },
  {
    from: "clone",
    content:
      '设计方案已生成：\n\n🎨 方案 A：大字报风格 — "Your mind, extended."\n  - Hero 全屏渐变 + 浮动终端动画\n  - 突出文件系统交互\n\n🎨 方案 B：产品截图风格 — Show, don\'t tell\n  - Hero 区展示真实产品截图\n  - 侧重功能演示\n\n两个方案的 Figma 文件已生成。你的笔记已归档到知识库。',
    fileOps: [
      { action: "write", path: "knowledge/references/landing-page-best-practices.md" },
      { action: "write", path: "memory/ideas/landing-page-v2.md" },
    ],
  },
];

const SESSION_6_FILE_OPS: SessionFileOp[] = [
  {
    action: "create",
    path: "artifacts/designs/landing-v2.figma",
    fileType: "figma",
    size: "4.2 MB",
    time: "15:40",
    preview:
      "[Figma 文件] Landing Page V2\n\n含 2 个 Page:\n- 方案 A: 大字报风格\n- 方案 B: 产品截图风格\n\n8 个 Frame, 24 个组件",
  },
  {
    action: "create",
    path: "artifacts/designs/hero-mockup.png",
    fileType: "image",
    size: "380 KB",
    time: "15:41",
    preview: "[PNG 图片] Hero 区域设计稿预览\n\n1440×900, 方案 A\n全屏渐变背景 + 浮动终端动画",
  },
  {
    action: "create",
    path: "artifacts/designs/landing-page-v2-A.md",
    fileType: "markdown",
    size: "2.8 KB",
    time: "15:40",
    diff: { added: 56, removed: 0 },
    preview:
      '# Landing Page V2 — 方案 A\n\n## 风格：大字报\n标语: "Your mind, extended."\n\n### Hero\n- 全屏渐变背景（暖白 → 浅金）\n- 中间浮动终端动画：展示文件系统交互\n- CTA: "立即体验" (醒目按钮)',
  },
  {
    action: "create",
    path: "artifacts/designs/landing-page-v2-B.md",
    fileType: "markdown",
    size: "2.4 KB",
    time: "15:42",
    diff: { added: 48, removed: 0 },
    preview:
      '# Landing Page V2 — 方案 B\n\n## 风格：产品截图\n标语: "Meet your digital clone."\n\n### Hero\n- 左文右图：真实产品截图\n- 动态演示会话 + 文件树',
  },
  {
    action: "create",
    path: "artifacts/designs/onboarding-flow.svg",
    fileType: "svg",
    size: "18 KB",
    time: "15:43",
    preview:
      "[SVG 矢量图] Onboarding 用户流程图\n\n入口 → 角色选择 → 技能激活 → 首次对话 → 上岗完成",
  },
  {
    action: "create",
    path: "artifacts/media/product-demo.mp4",
    fileType: "video",
    size: "12.6 MB",
    time: "15:44",
    preview:
      "[视频] 产品演示录屏 — 45 秒\n\n内容：从添加 Bot → 对话 → 生成 PRD → Feeds 查看\n分辨率：1920×1080, 30fps",
  },
  {
    action: "create",
    path: "memory/ideas/landing-page-v2.md",
    fileType: "markdown",
    size: "0.8 KB",
    time: "15:25",
    diff: { added: 18, removed: 0 },
    preview:
      '# Landing Page V2 Ideas\n\n## 用户想法（原始记录）\n- hero section 要大胆，突出"你的数字分身"\n- 加竞品对比表\n- 底部要有 FAQ',
  },
  {
    action: "write",
    path: "memory/ideas/landing-page-v2.md",
    fileType: "markdown",
    size: "1.2 KB",
    time: "15:45",
    diff: { added: 8, removed: 0 },
    preview:
      "# Landing Page V2 Ideas\n\n## 已整理\n- 方案 A & B 已生成 Figma + PNG\n- 产品 demo 视频已录制\n- 参考了 Linear, Vercel, Raycast 案例",
  },
  {
    action: "write",
    path: "knowledge/references/landing-page-best-practices.md",
    fileType: "markdown",
    size: "1.6 KB",
    time: "15:43",
    diff: { added: 32, removed: 0 },
    preview:
      "# Landing Page Best Practices\n\n## 来源\n联网搜索 + 案例分析\n\n## 关键原则\n- Above the fold: 价值主张 + CTA\n- Mobile-first 设计",
  },
  {
    action: "read",
    path: "knowledge/references/competitor-linear.md",
    fileType: "markdown",
    size: "1.2 KB",
    time: "15:30",
    preview: "# Linear — 竞品资料\n\n参考 Linear 的设计风格和克制感...",
  },
  {
    action: "read",
    path: "artifacts/prds/注册流程优化.md",
    fileType: "markdown",
    size: "2.1 KB",
    time: "15:30",
    preview: "# 注册流程优化 PRD\n\n参考注册流程以确保 landing page CTA 与注册衔接...",
  },
  {
    action: "execute",
    path: "skills/figma-design/SKILL.md",
    fileType: "skill",
    size: "—",
    time: "15:38",
    preview:
      '# Figma Design\n\ntriggers: ["设计", "figma", "UI", "出图"]\ntools: [figma_api, image_gen]\nauth: figma_oauth (✓ 已授权)\n\n## 执行结果\n✓ 生成 Figma 文件 (2 方案)\n✓ 导出 PNG 预览\n✓ 生成 SVG 流程图\n✓ 录制产品 demo 视频',
  },
  {
    action: "execute",
    path: "skills/web-research/SKILL.md",
    fileType: "skill",
    size: "—",
    time: "15:32",
    preview:
      '# Web Research\n\n## 执行结果\n✓ 搜索 "best SaaS landing pages 2026"\n✓ 分析 Linear, Vercel, Raycast, Supabase\n✓ 提取设计模式和最佳实践',
  },
  {
    action: "install",
    path: "skills/figma-design/SKILL.md",
    fileType: "skill",
    size: "1.3 KB",
    time: "15:26",
    preview:
      "# Figma Design — 安装\n\n⚠️ 此 skill 需要 Figma OAuth 授权\n\n✓ 授权完成\n✓ Skill 已激活\n✓ 支持自动出图、导出、评审",
  },
];

// ─── Session 7: CRM Intelligence — Contact Relationship Analysis ──

const SESSION_7_MESSAGES: Message[] = [
  { from: "user", content: "帮我分析一下我最近的联系人情况，有哪些人超过 30 天没联系了？" },
  {
    from: "clone",
    content: "正在扫描你的联系人网络...",
    fileOps: [
      { action: "read", path: "contacts/张明-CTO.md" },
      { action: "read", path: "contacts/李薇-PM.md" },
      { action: "read", path: "contacts/王浩-前端.md" },
      { action: "read", path: "contacts/陈杰-后端.md" },
    ],
  },
  {
    from: "clone",
    content: "",
    tool: { name: "联系人健康度扫描", icon: BarChart3, status: "done" },
  },
  {
    from: "clone",
    content:
      "联系人关系分析完成。共 24 位联系人，6 位需要关注：\n\n🔴 超过 60 天未联系：\n  · 刘强 (投资人) — 上次互动 2/1，讨论 Series A\n  · 赵雪 (设计师) — 上次互动 1/25，外包 Logo\n\n🟡 超过 30 天未联系：\n  · 周磊 (前同事) — 上次互动 2/8，推荐候选人\n  · 孙倩 (市场) — 上次互动 2/5，合作推广\n  · 马飞 (CEO/合作方) — 上次互动 2/10，API 对接\n  · 林涛 (技术顾问) — 上次互动 2/12，架构讨论\n\n💡 建议：刘强是 Series A 关键联系人，建议本周主动更新进展。",
    fileOps: [
      { action: "create", path: "artifacts/reports/contact-health-0222.md" },
      { action: "write", path: "contacts/刘强-投资人.md" },
    ],
  },
  { from: "user", content: "帮我给刘强起草一封邮件，更新最近的产品进展" },
  {
    from: "clone",
    content: "让我先整理最近的进展...",
    fileOps: [
      { action: "read", path: "memory/decisions/competitive-positioning.md" },
      { action: "read", path: "contacts/刘强-投资人.md" },
      { action: "read", path: "memory/context/current-sprint.md" },
    ],
  },
  {
    from: "clone",
    content:
      "邮件草稿已生成：\n\n📧 给刘强的进展更新\n\n基于你上次和他讨论的 3 个关注点（产品定位、用户数据、团队）逐一更新。\n\n已保存到 artifacts/，需要我通过飞书邮箱发送吗？发送前你确认一下内容。",
    fileOps: [
      { action: "create", path: "artifacts/emails/investor-update-liuqiang-0222.md" },
      { action: "write", path: "contacts/刘强-投资人.md" },
    ],
  },
];

const SESSION_7_FILE_OPS: SessionFileOp[] = [
  {
    action: "create",
    path: "artifacts/reports/contact-health-0222.md",
    fileType: "markdown",
    size: "2.4 KB",
    time: "19:15",
    diff: { added: 52, removed: 0 },
    preview:
      "# 联系人健康度报告 — 2026-02-22\n\n## 统计\n- 总联系人: 24\n- 活跃 (7天内): 8\n- 正常 (30天内): 10\n- 需关注 (30-60天): 4\n- 流失风险 (>60天): 2\n\n## 建议行动\n1. 刘强 — 投资人更新\n2. 赵雪 — 设计交付确认",
  },
  {
    action: "create",
    path: "artifacts/emails/investor-update-liuqiang-0222.md",
    fileType: "markdown",
    size: "1.8 KB",
    time: "19:20",
    diff: { added: 38, removed: 0 },
    preview:
      '# Investor Update — 刘强\n\n刘强你好，\n\n上次见面后产品有了重要进展：\n\n1. 产品定位确认为"数字分身"\n2. 核心记忆系统已上线\n3. 团队新增 1 名后端工程师\n\n附：最新 demo 录屏链接',
  },
  {
    action: "write",
    path: "contacts/刘强-投资人.md",
    fileType: "contact",
    size: "1.1 KB",
    time: "19:21",
    diff: { added: 5, removed: 0 },
    preview:
      "# 刘强\n\n**角色**: 投资人 (Series A)\n**关系健康度**: 🔴 需要关注\n**上次互动**: 2026-02-01\n**关注点**: 产品定位、用户数据、团队\n**待办**: 发送进展更新邮件",
  },
  {
    action: "read",
    path: "contacts/张明-CTO.md",
    fileType: "contact",
    size: "0.7 KB",
    time: "19:10",
    preview: "# 张明\n\n读取联系人信息用于健康度分析...",
  },
  {
    action: "read",
    path: "contacts/李薇-PM.md",
    fileType: "contact",
    size: "0.6 KB",
    time: "19:10",
    preview: "# 李薇\n\n读取联系人信息用于健康度分析...",
  },
  {
    action: "read",
    path: "contacts/王浩-前端.md",
    fileType: "contact",
    size: "0.7 KB",
    time: "19:10",
    preview: "# 王浩\n\n读取联系人信息用于健康度分析...",
  },
  {
    action: "read",
    path: "memory/decisions/competitive-positioning.md",
    fileType: "markdown",
    size: "0.9 KB",
    time: "19:18",
    preview: "# Competitive Positioning\n\n读取竞争定位决策，用于投资人更新...",
  },
  {
    action: "execute",
    path: "skills/contact-intelligence/SKILL.md",
    fileType: "skill",
    size: "—",
    time: "19:12",
    preview:
      '# Contact Intelligence\n\ntriggers: ["联系人", "关系", "谁"]\ntools: [contact_scan, memory_search]\n\n## 执行结果\n✓ 扫描 24 个联系人\n✓ 计算关系健康度\n✓ 生成 6 条关注建议',
  },
];

// ─── Session 8: Meeting Action Item Tracker ───────────────────

const SESSION_8_MESSAGES: Message[] = [
  { from: "user", content: "帮我整理今天下午产品对齐会的行动项，这是会议录音的转录" },
  {
    from: "clone",
    content: "正在分析会议内容并匹配联系人...",
    fileOps: [
      { action: "read", path: "contacts/张明-CTO.md" },
      { action: "read", path: "contacts/李薇-PM.md" },
      { action: "read", path: "contacts/王浩-前端.md" },
      { action: "read", path: "contacts/陈杰-后端.md" },
    ],
  },
  {
    from: "clone",
    content: "",
    tool: { name: "会议 Action Item 提取", icon: Clock, status: "done" },
  },
  {
    from: "clone",
    content:
      "从会议转录中提取了 7 个行动项：\n\n📌 你的行动项 (3)：\n  1. ☐ 定稿注册流程 PRD — 截止明天\n  2. ☐ 和刘强确认 Series A 时间线 — 本周内\n  3. ☐ 审核飞书 Bot 权限设计 — 周三前\n\n⏳ 等待对方 (4)：\n  4. 🔄 张明：完成安全审计方案 — 周三前\n  5. 🔄 李薇：输出竞品功能对比 — 周四前\n  6. 🔄 王浩：飞书扫码 demo — 明天\n  7. 🔄 陈杰：数据库 Schema 初稿 — 周三前\n\n要我创建对应的 Todo 吗？分身会自动追踪每个人是否按时完成。",
    fileOps: [
      { action: "create", path: "artifacts/meeting-notes/product-alignment-0222.md" },
      { action: "write", path: "contacts/张明-CTO.md" },
      { action: "write", path: "contacts/李薇-PM.md" },
    ],
  },
  { from: "user", content: "好的，创建 Todo 吧" },
  {
    from: "clone",
    content:
      '已创建 7 个 Todo，分为两组：\n\n✅ 你的 3 个已加入今日/本周待办\n🔄 对方的 4 个设为"等待中"状态\n\n分身每天 10:00 / 15:00 / 20:00 会自动检查完成情况。如果王浩明天没提交 demo，我会提醒你跟进。',
    fileOps: [
      { action: "write", path: "memory/context/current-sprint.md" },
      { action: "write", path: "memory/decisions/product-alignment-0222.md" },
    ],
  },
];

const SESSION_8_FILE_OPS: SessionFileOp[] = [
  {
    action: "create",
    path: "artifacts/meeting-notes/product-alignment-0222.md",
    fileType: "markdown",
    size: "3.2 KB",
    time: "16:30",
    diff: { added: 68, removed: 0 },
    preview:
      "# 产品对齐会纪要 — 2026-02-22\n\n## 参会人\n黄巍(CEO), 张明(CTO), 李薇(PM), 王浩(前端), 陈杰(后端)\n\n## 讨论要点\n1. 注册流程优化 — 采用 OAuth 方案\n2. 安全架构 — 需要独立审计\n3. 飞书 Bot — 扫码登录 demo\n\n## 行动项\n- [owner:黄巍] 定稿注册流程 PRD\n- [waiting:张明] 安全审计方案\n- [waiting:王浩] 飞书扫码 demo",
  },
  {
    action: "write",
    path: "memory/decisions/product-alignment-0222.md",
    fileType: "markdown",
    size: "0.8 KB",
    time: "16:35",
    diff: { added: 15, removed: 0 },
    preview:
      "# Product Alignment Decision — 2026-02-22\n\n**参会人**: 5 人\n**关键决策**:\n- OAuth 方案确认\n- 安全审计独立进行\n- 飞书 Bot 优先做扫码",
  },
  {
    action: "write",
    path: "memory/context/current-sprint.md",
    fileType: "markdown",
    size: "1.5 KB",
    time: "16:36",
    diff: { added: 7, removed: 0 },
    preview:
      '# Current Sprint — W9\n\n## 更新（产品对齐会后）\n- 新增 3 个你的 action items\n- 新增 4 个"等待中"追踪项',
  },
  {
    action: "write",
    path: "contacts/张明-CTO.md",
    fileType: "contact",
    size: "0.9 KB",
    time: "16:32",
    diff: { added: 3, removed: 0 },
    preview: "# 张明\n\n**待办**: 完成安全审计方案 (周三前)\n**状态**: waiting on",
  },
  {
    action: "write",
    path: "contacts/李薇-PM.md",
    fileType: "contact",
    size: "0.7 KB",
    time: "16:32",
    diff: { added: 3, removed: 0 },
    preview: "# 李薇\n\n**待办**: 输出竞品功能对比 (周四前)\n**状态**: waiting on",
  },
  {
    action: "execute",
    path: "skills/meeting-action-tracker/SKILL.md",
    fileType: "skill",
    size: "—",
    time: "16:28",
    preview:
      '# Meeting Action Tracker\n\ntriggers: ["会议", "action item", "行动项"]\ntools: [transcript_parse, contact_match, todo_create]\n\n## 执行结果\n✓ 解析会议转录\n✓ 匹配 4 位联系人\n✓ 提取 7 个 action items\n✓ 区分 mine (3) vs waiting (4)',
  },
];

// ─── Session 9: Proxy Session (分身代问) ─────────────────────

const SESSION_9_MESSAGES: Message[] = [
  {
    from: "user",
    content: "帮我问一下李四 Gateway 重构进度怎么样了，会不会影响我的前端集成？",
  },
  {
    from: "clone",
    content: "",
    cards: [
      {
        type: "collaboration",
        title: "正在连接李四的分身",
        status: "running",
        body: "你的分身 → 李四的分身\n代理查询 Gateway 重构进度",
        path: "contacts/李四-后端.md",
        meta: "Proxy 模式 · 自动发起",
      },
    ],
    fileOps: [{ action: "read", path: "contacts/李四-后端.md" }],
  },
  {
    from: "clone",
    content: "",
    cards: [
      {
        type: "collaboration",
        title: "李四分身回复：Gateway 进度",
        status: "success",
        body: "整体进度：15%（刚启动）\n✓ API 路由层重构：已完成\n🔄 中间件迁移：进行中（鉴权兼容问题）\n📅 预计完成：周四下午",
        path: "contacts/李四-后端.md",
        meta: "Proxy 回复 · 2 分钟",
        actions: [{ label: "查看详情" }, { label: "追问" }],
        viralCta: "李四还没有分身？邀请他创建 →",
      },
    ],
  },
  {
    from: "clone",
    content: "⚠️ 按照当前进度，你的前端集成可能需要延后 1 天。",
    cards: [
      {
        type: "memory",
        title: "决策已记录",
        status: "success",
        body: "Gateway 重构优先级调整\n建议优先处理中间件迁移",
        path: "team/decisions/2026-02-23-gateway-priority.md",
        meta: "团队决策 · 自动归档",
      },
    ],
    fileOps: [{ action: "write", path: "team/decisions/2026-02-23-gateway-priority.md" }],
  },
  {
    from: "user",
    content: "发起对齐，建议他优先处理中间件迁移",
  },
  {
    from: "clone",
    content: "",
    cards: [
      {
        type: "collaboration",
        title: "对齐请求已发送",
        status: "success",
        body: "🤝 推送到 #product-team 群\n内容：建议优先处理中间件迁移\n等待李四确认...",
        meta: "Team Alignment · 待确认",
        actions: [{ label: "查看卡片", primary: true }, { label: "撤回" }],
      },
      {
        type: "upgrade",
        title: "Proxy 功能试用额度",
        status: "warning",
        body: "本月已使用 8/10 次 Proxy 代理对话\n升级 Pro 可无限使用 Proxy + 团队协作",
        actions: [{ label: "升级 Pro — ¥199/月", primary: true }, { label: "暂不需要" }],
        viralCta: "邀请 3 位同事，免费获得 Pro 30 天",
      },
    ],
  },
];

const SESSION_9_FILE_OPS: SessionFileOp[] = [
  {
    action: "read",
    path: "contacts/李四-后端.md",
    fileType: "contact",
    size: "2.1 KB",
    time: "10:30",
  },
  {
    action: "write",
    path: "team/decisions/2026-02-23-gateway-priority.md",
    fileType: "markdown",
    size: "1.4 KB",
    time: "10:32",
    preview:
      "# Gateway 重构优先级调整\n\n**日期**: 2026-02-23\n**类型**: 团队对齐\n\n## 决策\n建议李四优先处理中间件迁移，确保前端集成不延期。",
  },
];

// ─── Session Data Map ─────────────────────────────────────────

export const SESSION_DATA: Record<number, SessionData> = {
  1: { messages: SESSION_1_MESSAGES, fileOps: SESSION_1_FILE_OPS },
  6: { messages: SESSION_2_MESSAGES, fileOps: SESSION_2_FILE_OPS },
  7: { messages: SESSION_7_MESSAGES, fileOps: SESSION_7_FILE_OPS },
  8: { messages: SESSION_8_MESSAGES, fileOps: SESSION_8_FILE_OPS },
  2: { messages: SESSION_3_MESSAGES, fileOps: SESSION_3_FILE_OPS },
  3: { messages: SESSION_4_MESSAGES, fileOps: SESSION_4_FILE_OPS },
  4: { messages: SESSION_5_MESSAGES, fileOps: SESSION_5_FILE_OPS },
  5: { messages: SESSION_6_MESSAGES, fileOps: SESSION_6_FILE_OPS },
  9: { messages: SESSION_9_MESSAGES, fileOps: SESSION_9_FILE_OPS },
};
