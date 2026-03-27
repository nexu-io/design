import {
  Button,
  EntityCard,
  EntityCardContent,
  EntityCardDescription,
  EntityCardFooter,
  EntityCardHeader,
  EntityCardMedia,
  EntityCardMeta,
  EntityCardTitle,
  ToggleGroup,
  ToggleGroupItem,
} from "@nexu-design/ui-web";
import {
  Activity,
  ArrowUpRight,
  Brain,
  Check,
  ChevronRight,
  Database,
  ExternalLink,
  FileText,
  FolderOpen,
  Globe,
  Mail,
  MessageSquare,
  Pencil,
  Phone,
  Plus,
  RefreshCw,
  Rss,
  Send,
  Shield,
  Sparkles,
  Users,
  Wrench,
  X,
} from "lucide-react";
import type React from "react";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import OnboardingChat from "./OnboardingChat";
import { useProductLayout } from "./ProductLayoutContext";

const TABS = [
  { id: "feeds", label: "Feeds", icon: Rss },
  { id: "channels", label: "Channels", icon: MessageSquare },
  { id: "contacts", label: "Contacts", icon: Users },
  { id: "memory", label: "Memory", icon: Database },
  { id: "artifacts", label: "产物", icon: FileText },
  { id: "worldview", label: "世界观", icon: Globe },
] as const;

type TabId = (typeof TABS)[number]["id"];

type ChannelCategory = "native" | "im";

interface Channel {
  name: string;
  icon: string;
  status: "connected" | "pending" | "off";
  desc: string;
  badge: string | null;
  category: ChannelCategory;
  stats: { rounds: number; files: number; memories: number; contacts: number } | null;
  recent: { type: string; label: string; time: string }[];
  highlight?: string;
}

const CHANNELS: Channel[] = [
  // Native channels — zero install, every device has them
  {
    name: "Email",
    icon: "📧",
    status: "connected",
    desc: "tom@refly.ai · IMAP/SMTP 已配置",
    badge: "零安装",
    category: "native",
    stats: { rounds: 342, files: 28, memories: 45, contacts: 8 },
    recent: [
      { type: "file", label: "分身回复了投资人 Alex 的 follow-up", time: "1 小时前" },
      { type: "memory", label: "从邮件中提取了合作意向备忘", time: "3 小时前" },
    ],
    highlight: "发邮件给分身 = 启动一个 Session。附件自动存入 artifacts，关键信息记入 memory。",
  },
  {
    name: "SMS / iMessage",
    icon: "💬",
    status: "connected",
    desc: "+86 138****7890 · Twilio 接入",
    badge: "零安装",
    category: "native",
    stats: { rounds: 87, files: 5, memories: 23, contacts: 3 },
    recent: [
      { type: "memory", label: "短信指令：帮我查下明天的日程", time: "30 分钟前" },
      { type: "file", label: "分身回复了日程摘要", time: "30 分钟前" },
    ],
    highlight: "给分身发短信，随时随地发指令。无需打开任何 App，最原生的交互方式。",
  },
  {
    name: "WhatsApp",
    icon: "📱",
    status: "pending",
    desc: "待绑定手机号 · Meta API",
    badge: "零安装",
    category: "native",
    stats: null,
    recent: [],
    highlight: "全球 20 亿用户的即时通讯。给分身的 WhatsApp 号发消息就能开始工作。",
  },
  // IM platform channels
  {
    name: "飞书",
    icon: "🐦",
    status: "connected",
    desc: "Bot 已上线 · WebSocket 活跃",
    badge: "主渠道",
    category: "im",
    stats: { rounds: 1247, files: 89, memories: 156, contacts: 5 },
    recent: [
      { type: "memory", label: "记录了 OAuth 选型决策", time: "20 分钟前" },
      { type: "file", label: "生成了注册流程 PRD", time: "2 小时前" },
    ],
  },
  {
    name: "Slack",
    icon: "💼",
    status: "connected",
    desc: "OAuth 已授权 · 3 个 Channel",
    badge: null,
    category: "im",
    stats: { rounds: 523, files: 34, memories: 67, contacts: 3 },
    recent: [{ type: "file", label: "更新了竞品分析报告", time: "昨天" }],
  },
  {
    name: "Telegram",
    icon: "✈️",
    status: "pending",
    desc: "待配置 Bot Token",
    badge: null,
    category: "im",
    stats: null,
    recent: [],
  },
  {
    name: "Discord",
    icon: "🎮",
    status: "off",
    desc: "即将支持",
    badge: "敬请期待",
    category: "im",
    stats: null,
    recent: [],
  },
  {
    name: "企业微信",
    icon: "🏢",
    status: "off",
    desc: "即将支持",
    badge: "敬请期待",
    category: "im",
    stats: null,
    recent: [],
  },
];

const CONTACTS = [
  {
    name: "张明",
    role: "CTO",
    team: "Engineering",
    file: "contacts/张明-CTO.md",
    avatar: "👨‍💻",
    channel: "飞书",
    relation: "直属上级",
    notes: "偏好异步沟通，技术决策倾向稳定成熟方案，周三下午有固定 1on1",
    lastInteraction: "今天",
  },
  {
    name: "李薇",
    role: "Product Manager",
    team: "Product",
    file: "contacts/李薇-PM.md",
    avatar: "👩‍💼",
    channel: "飞书",
    relation: "核心协作",
    notes: "需求文档偏好 Notion 格式，喜欢用数据说话，每周一提交周报",
    lastInteraction: "2 小时前",
  },
  {
    name: "王浩",
    role: "前端工程师",
    team: "Engineering",
    file: "contacts/王浩-前端.md",
    avatar: "🧑‍💻",
    channel: "飞书",
    relation: "同组同事",
    notes: "React + TypeScript 专家，负责 Design System，代码审查很仔细",
    lastInteraction: "昨天",
  },
  {
    name: "刘芳",
    role: "UI/UX 设计师",
    team: "Design",
    file: "contacts/刘芳-设计.md",
    avatar: "👩‍🎨",
    channel: "Slack",
    relation: "跨组协作",
    notes: "偏好 Figma 评审，设计稿交付用 Notion，注重细节和动效",
    lastInteraction: "3 天前",
  },
  {
    name: "陈杰",
    role: "后端工程师",
    team: "Engineering",
    file: "contacts/陈杰-后端.md",
    avatar: "👨‍🔧",
    channel: "飞书",
    relation: "同组同事",
    notes: "NestJS + PostgreSQL 负责人，接口文档写得好，喜欢 TDD",
    lastInteraction: "昨天",
  },
  {
    name: "Alex Chen",
    role: "Investor / Advisor",
    team: "External",
    file: "contacts/alex-investor.md",
    avatar: "🤵",
    channel: "Email",
    relation: "投资人",
    notes: "关注 MAU 和 Retention 数据，每月一次 update，偏好英文沟通",
    lastInteraction: "1 周前",
  },
];

const CONTACT_GROUPS = [
  {
    name: "Product Team",
    file: "contacts/_groups/product-team.md",
    members: ["张明", "李薇", "王浩", "刘芳", "陈杰"],
    icon: "🏢",
  },
  {
    name: "Engineering",
    file: "contacts/_groups/engineering.md",
    members: ["张明", "王浩", "陈杰"],
    icon: "⚙️",
  },
  {
    name: "Founders & Investors",
    file: "contacts/_groups/founders.md",
    members: ["Alex Chen"],
    icon: "💼",
  },
];

const MEMORY_CATEGORIES = [
  { id: "all", label: "全部", icon: "📋", count: 223 },
  { id: "ideas", label: "想法", icon: "💡", count: 31 },
  { id: "tone", label: "口吻", icon: "🗣️", count: 8 },
  { id: "preferences", label: "喜好", icon: "⭐", count: 24 },
  { id: "habits", label: "习惯", icon: "🔄", count: 15 },
  { id: "status", label: "近况", icon: "📍", count: 12 },
  { id: "goals", label: "目标", icon: "🎯", count: 18 },
  { id: "worldview", label: "世界观", icon: "🌏", count: 9 },
  { id: "decisions", label: "决策", icon: "⚖️", count: 18 },
  { id: "facts", label: "事实", icon: "📎", count: 67 },
];

const MEMORY_ENTRIES = [
  {
    id: 1,
    category: "goals",
    content:
      "我是一名在上海的产品经理，其公司 refly.ai 正在构建基于 Openclaw 的数字员工基础设施，并刚完成了一轮顶级 VC 投资。",
    private: true,
    source: "conversation",
    time: "2 天前",
  },
  {
    id: 2,
    category: "ideas",
    content:
      '我认为当前很多人对 AI 的使用还停留在"电子宠物"阶段，但我更认同将 AI 视为"赛博合伙人"的协作理念。',
    private: false,
    source: "conversation",
    time: "3 天前",
  },
  {
    id: 3,
    category: "worldview",
    content:
      "AI 的关键在于其行动力，即 AI 不应只停留在思考层面，而必须能映射到现实世界，产生实际的连接和改变。",
    private: true,
    source: "extracted",
    time: "4 天前",
  },
  {
    id: 4,
    category: "preferences",
    content: "我喜欢运动，特别是乒乓球和跑步，同时也是一位影视达人。",
    private: true,
    source: "conversation",
    time: "5 天前",
  },
  {
    id: 5,
    category: "habits",
    content: "我的心态似乎比较好，即使有工作压力通常也不会影响睡眠。",
    private: true,
    source: "extracted",
    time: "5 天前",
  },
  {
    id: 6,
    category: "tone",
    content: "简洁直接，偏技术术语，喜欢用类比解释复杂概念，中文为主但技术词用英文。",
    private: false,
    source: "fine-tuned",
    time: "1 周前",
  },
  {
    id: 7,
    category: "decisions",
    content: "用户决定使用 PostgreSQL + TypeORM 替代 MongoDB，理由是关系型查询更适合多模块 JOIN。",
    private: false,
    source: "auto-extracted",
    time: "1 周前",
  },
  {
    id: 8,
    category: "status",
    content: "当前 Sprint 主要任务：注册流程优化、Design System 改版、记忆系统设计。",
    private: false,
    source: "proactive",
    time: "今天",
  },
  {
    id: 9,
    category: "ideas",
    content:
      "观察到中心化 Agent IM bot（如 Manus 在 Telegram 上的 Personal Agent）被封，开始思考去中心化产品形态的风险。",
    private: false,
    source: "conversation",
    time: "6 天前",
  },
  {
    id: 10,
    category: "goals",
    content: "我有提升自己的目标，积极招聘增长/商业化/产品人才，打造世界级产品。",
    private: true,
    source: "extracted",
    time: "1 周前",
  },
];

const MEMORY_CHANGELOG = [
  { action: "merge", desc: "合并了「我是 Openclaw 的用户」相关记忆", time: "1 天前" },
  {
    action: "extract",
    desc: "从 Tom 和 @biubiu暴雨 对话中提取了记忆点",
    source: "随便聊了聊",
    time: "2 天前",
  },
  {
    action: "extract",
    desc: "从 Tom 和 @就爱喝无糖 对话中提取了记忆点",
    source: "随便聊了聊",
    time: "3 天前",
  },
  { action: "merge", desc: "合并了「AI 的行动力」相关世界观记忆", time: "5 天前" },
  { action: "edit", desc: "Tom 编辑了一条记忆：口吻偏好", time: "6 天前" },
  { action: "extract", desc: "自动提取了 PostgreSQL 选型决策", source: "技术讨论", time: "1 周前" },
];

const ARTIFACT_FOLDERS = [
  {
    folder: "artifacts/prds/",
    count: 8,
    desc: "产品需求文档",
    files: ["注册流程优化.md", "onboarding-redesign.md", "onboarding-flowchart.svg"],
  },
  {
    folder: "artifacts/research/",
    count: 14,
    desc: "竞品分析、市场调研",
    files: ["竞品注册流程对比.md", "市场调研数据.xlsx", "用户访谈-20260218.mp4"],
  },
  {
    folder: "artifacts/code/",
    count: 5,
    desc: "Schema、代码片段、API",
    files: ["schema-design.sql", "oauth-callback.ts", "api-spec.json"],
  },
  {
    folder: "artifacts/designs/",
    count: 9,
    desc: "设计稿、Figma、UI 截图",
    files: ["landing-v2.figma", "hero-mockup.png", "onboarding-flow.svg", "brand-guide.pdf"],
  },
  {
    folder: "artifacts/reports/",
    count: 7,
    desc: "Sprint 回顾、周报、指标",
    files: ["sprint-review-w8.md", "monthly-metrics.xlsx", "investor-deck.pptx"],
  },
  {
    folder: "artifacts/media/",
    count: 6,
    desc: "产品 Demo、播客、素材",
    files: ["product-demo.mp4", "podcast-ep3.mp3", "logo-final.svg", "screenshot-feeds.png"],
  },
];

const SOUL_FILES = [
  { path: ".soul/identity.md", label: "角色", value: "全栈工程师", editable: true },
  { path: ".soul/persona.md", label: "领域", value: "Web 开发 · AI 应用 · SaaS", editable: true },
  {
    path: ".soul/persona.md",
    label: "沟通风格",
    value: "简洁直接 · 偏技术 · 喜欢用类比",
    editable: true,
  },
  { path: ".soul/persona.md", label: "语言", value: "中文为主 · 技术术语用英文", editable: true },
  {
    path: ".soul/persona.md",
    label: "工作习惯",
    value: "晚上效率高 · 喜欢先做难的 · 迭代速度快",
    editable: true,
  },
];

const WORLDVIEW_FILES = [
  {
    path: ".soul/values.md",
    label: "产品哲学",
    value: "用户体验 > 功能数量，简单 > 复杂",
    icon: "🎯",
  },
  {
    path: ".soul/worldview.md",
    label: "技术价值观",
    value: "实用主义，不过度工程化，先跑起来再优化",
    icon: "⚡",
  },
  {
    path: ".soul/worldview.md",
    label: "决策原则",
    value: '"这让分身更懂用户了吗？" — 是就做，不是就砍',
    icon: "🧭",
  },
  {
    path: ".soul/values.md",
    label: "沟通准则",
    value: "直说结论，不说废话，有代码就直接写",
    icon: "💬",
  },
  {
    path: ".soul/worldview.md",
    label: "优先级框架",
    value: "用户感知价值 > 技术优雅度 > 扩展性",
    icon: "📊",
  },
];

function ChannelStatBadge({ icon, label, value }: { icon: string; label: string; value: number }) {
  return (
    <div className="flex items-center gap-1.5 text-[11px] text-text-secondary" title={label}>
      <span className="text-[10px]">{icon}</span>
      <span className="tabular-nums font-medium text-text-primary">{value.toLocaleString()}</span>
      <span className="text-text-muted">{label}</span>
    </div>
  );
}

// --- Feed data types & mock data ---

type FeedItemType = "automation" | "session" | "skill" | "memory" | "proactive" | "team";

interface FeedItem {
  id: string;
  type: FeedItemType;
  title: string;
  desc: string;
  time: string;
  icon: string;
  tags: string[];
  link?: { label: string; to: string };
  files?: number;
  memories?: number;
}

const FEED_ITEMS: FeedItem[] = [
  {
    id: "f1",
    type: "proactive",
    icon: "📊",
    title: "今日战况复盘已生成",
    desc: "完成 12 个任务，生成 3 份文档，新增 5 条记忆。整体对齐率提升 2%。",
    time: "22:00",
    tags: ["每日复盘", "自动"],
    link: { label: "查看详情", to: "/app/sessions" },
    files: 3,
    memories: 5,
  },
  {
    id: "f9",
    type: "team",
    icon: "🤝",
    title: "张三的分身查询了你的任务进度",
    desc: "张三的前端集成需要确认你的 Gateway 重构时间线，分身已自动回复当前进度。",
    time: "14:30",
    tags: ["分身代问", "自动回复"],
    link: { label: "查看对话", to: "/app/team" },
  },
  {
    id: "f10",
    type: "team",
    icon: "📋",
    title: "站会汇总已推送到 #product-team",
    desc: "Sprint 3 进度 58%，1 个风险项：Gateway 重构进度偏慢。已推送 IM 卡片。",
    time: "09:05",
    tags: ["站会", "自动"],
    link: { label: "查看卡片", to: "/app/team" },
    files: 1,
  },
  {
    id: "f2",
    type: "automation",
    icon: "⚡",
    title: "竞品监控触发 — Notion 发布 AI 功能更新",
    desc: "检测到 Notion 发布 AI blocks 功能。已自动生成竞品分析摘要并存入 artifacts。",
    time: "18:30",
    tags: ["竞品监控", "触发"],
    link: { label: "查看分析", to: "/app/sessions" },
    files: 1,
  },
  {
    id: "f3",
    type: "session",
    icon: "💬",
    title: "注册流程优化方案完成",
    desc: "基于 OAuth 选型决策，生成完整 PRD，包含流程图和技术方案。",
    time: "16:45",
    tags: ["PRD", "主动对话"],
    link: { label: "继续对话", to: "/app/sessions" },
    files: 2,
    memories: 1,
  },
  {
    id: "f4",
    type: "skill",
    icon: "🔧",
    title: "Figma 设计稿导出 Skill 运行成功",
    desc: "自动导出 3 张设计稿为 PNG，并上传到 artifacts/designs/ 目录。",
    time: "15:20",
    tags: ["Skills", "Figma"],
    files: 3,
  },
  {
    id: "f5",
    type: "proactive",
    icon: "🧠",
    title: "记忆整理完成 — 发现 3 条冲突记忆",
    desc: "自动整理本周新增记忆 23 条，发现 3 条决策冲突，建议人工确认。",
    time: "14:00",
    tags: ["记忆维护", "自动"],
    link: { label: "查看冲突", to: "/app/clone?tab=memory" },
    memories: 23,
  },
  {
    id: "f6",
    type: "automation",
    icon: "📬",
    title: "飞书日报已发送",
    desc: "今日工作日报已自动汇总并推送到飞书群「产品核心群」。",
    time: "12:00",
    tags: ["飞书", "定时"],
  },
  {
    id: "f7",
    type: "session",
    icon: "🔍",
    title: "Deep Research: AI Agent 市场分析",
    desc: "基于 23 篇文献和 5 个竞品数据源，生成 8000 字分析报告。",
    time: "昨天 21:30",
    tags: ["调研", "深度"],
    link: { label: "阅读报告", to: "/app/sessions" },
    files: 1,
    memories: 4,
  },
  {
    id: "f8",
    type: "skill",
    icon: "🚀",
    title: "部署 Skill 执行完成",
    desc: "前端构建成功，已部署到 Vercel production 环境。构建耗时 42s。",
    time: "昨天 18:00",
    tags: ["CI/CD", "Vercel"],
    files: 1,
  },
];

const FEED_TYPE_STYLES: Record<FeedItemType, { bg: string; text: string; label: string }> = {
  automation: { bg: "bg-blue-500/10", text: "text-blue-600", label: "Automation" },
  session: { bg: "bg-emerald-500/10", text: "text-emerald-600", label: "Session" },
  skill: { bg: "bg-purple-500/10", text: "text-purple-600", label: "Skill" },
  memory: { bg: "bg-amber-500/10", text: "text-amber-600", label: "Memory" },
  proactive: { bg: "bg-orange-500/10", text: "text-orange-600", label: "主动" },
  team: { bg: "bg-cyan-500/10", text: "text-cyan-600", label: "Team" },
};

interface FeedDetailMsg {
  from: "clone" | "system";
  content: string;
}

interface FeedFileOp {
  action: "create" | "write" | "read";
  path: string;
}

interface FeedDetail {
  messages: FeedDetailMsg[];
  fileOps: FeedFileOp[];
  sessionId?: string;
}

const FEED_DETAILS: Record<string, FeedDetail> = {
  f1: {
    messages: [
      { from: "system", content: "⏰ 定时任务 每日复盘 触发 22:00" },
      {
        from: "clone",
        content:
          "今日复盘报告已生成：\n\n✅ 完成任务 12 个\n📄 生成文档 3 份（PRD、竞品分析、迁移方案）\n🧠 新增记忆 5 条\n📈 对齐率 73% → 75% (+2%)\n\n亮点：注册优化 PRD 获得 PM 认可，竞品分析发现 Notion 关键差异点。",
      },
      {
        from: "clone",
        content:
          "建议明天优先推进：\n1. 数据库迁移 PR Review（陈杰待 review）\n2. Landing Page V2 设计稿定稿\n3. 竞品监控异常处理 — Notion 新功能跟进",
      },
    ],
    fileOps: [
      { action: "create", path: "artifacts/reports/daily-review-0221.md" },
      { action: "write", path: "memory/context/current-sprint.md" },
      { action: "write", path: ".soul/identity.md" },
    ],
    sessionId: "daily-review-0221",
  },
  f2: {
    messages: [
      { from: "system", content: "⚡ 竞品监控触发 — 检测到 Notion 产品更新" },
      {
        from: "clone",
        content:
          'Notion 发布了 AI Blocks 功能更新：\n\n• 新增 AI 自动填充数据库属性\n• Inline AI 编辑增强（直接在文档内调整）\n• AI 模板市场扩展\n\n已自动更新竞品分析文档，关键发现：Notion 正在从"AI 助手"转向"AI 自动化"定位，与我们的 Agent Computer 有直接竞争。',
      },
    ],
    fileOps: [
      { action: "write", path: "knowledge/references/competitor-notion.md" },
      { action: "create", path: "artifacts/research/notion-ai-blocks-analysis.md" },
    ],
    sessionId: "competitor-notion-update",
  },
  f3: {
    messages: [
      {
        from: "clone",
        content:
          "注册流程优化方案已完成 ✅\n\n核心内容：\n• 方案 A：OAuth 优先（推荐）\n• 方案 B：飞书扫码\n• 包含完整流程图和技术方案\n• 预计注册转化率提升 40%",
      },
      {
        from: "clone",
        content:
          "已将 PRD 存入 artifacts/prds/，同时更新了 OAuth 选型决策记录。需要我展开某个部分吗？",
      },
    ],
    fileOps: [
      { action: "create", path: "artifacts/prds/注册流程优化.md" },
      { action: "write", path: "memory/decisions/auth-oauth.md" },
    ],
    sessionId: "registration-optimization",
  },
  f4: {
    messages: [
      { from: "system", content: "🔧 Skill 执行完成 — figma-export" },
      {
        from: "clone",
        content:
          "Figma 设计稿导出完成：\n\n• hero-mockup.png (380 KB)\n• onboarding-flow.svg (18 KB)\n• brand-guide.pdf (1.2 MB)\n\n已存入 artifacts/designs/ 目录。",
      },
    ],
    fileOps: [
      { action: "create", path: "artifacts/designs/hero-mockup.png" },
      { action: "create", path: "artifacts/designs/onboarding-flow.svg" },
      { action: "create", path: "artifacts/designs/brand-guide.pdf" },
    ],
  },
  f5: {
    messages: [
      { from: "system", content: "🧠 记忆维护任务执行 — 自动整理" },
      {
        from: "clone",
        content:
          '本周记忆整理完成：\n\n📊 新增 23 条记忆\n♻️ 合并重复 4 条\n⚠️ 发现 3 条冲突：\n\n1. 技术选型：前次说"考虑 Supabase"，本周决策"用 TypeORM + PostgreSQL"\n2. 产品定位：早期说"AI 助手"，现在明确"Agent Computer"\n3. 命名：从"Clone"改为"nexu（奈苏）"\n\n建议确认这些决策变更，我会自动清理旧记忆。',
      },
    ],
    fileOps: [
      { action: "write", path: "memory/decisions/" },
      { action: "write", path: ".soul/identity.md" },
      { action: "read", path: "memory/facts/" },
    ],
  },
  f6: {
    messages: [
      { from: "system", content: "📬 定时任务 飞书日报 触发 12:00" },
      {
        from: "clone",
        content:
          "飞书日报已推送到「产品核心群」：\n\n今日工作摘要：\n• 完成注册流程 PRD\n• 竞品分析 - Linear/Notion/Cursor 对比\n• 数据库迁移 SQL 编写（3 个 migration）\n\n推送成功 ✅ 已有 3 人已读",
      },
    ],
    fileOps: [{ action: "create", path: "artifacts/reports/daily-summary-0221.md" }],
  },
  f7: {
    messages: [
      {
        from: "clone",
        content:
          'Deep Research 报告完成（AI Agent 市场分析）：\n\n📚 数据源：23 篇文献 + 5 个竞品\n📝 报告：8000 字深度分析\n\n核心发现：\n1. AI Agent 市场 2026 预计 $47B\n2. 个人 Agent 赛道尚无明确赢家\n3. "Agent Computer" 定位可建立差异化\n4. 文件系统 + 技能系统是关键壁垒',
      },
    ],
    fileOps: [
      { action: "create", path: "artifacts/research/ai-agent-market-2026.md" },
      { action: "write", path: "memory/context/market-landscape.md" },
    ],
    sessionId: "deep-research-agent-market",
  },
  f8: {
    messages: [
      { from: "system", content: "🚀 Skill 执行完成 — deploy-vercel" },
      {
        from: "clone",
        content:
          "部署完成 ✅\n\n• 构建耗时：42s\n• 部署环境：Vercel Production\n• URL: https://nexu.app\n• Bundle size: 312 KB (gzipped)\n\n无错误，所有检查通过。",
      },
    ],
    fileOps: [{ action: "create", path: "artifacts/reports/deploy-log-0220.md" }],
  },
};

const FILE_OP_ACTION_STYLES: Record<string, { color: string; label: string }> = {
  create: { color: "text-success bg-success-subtle", label: "CREATE" },
  write: { color: "text-clone bg-clone/10", label: "WRITE" },
  read: { color: "text-info bg-info-subtle", label: "READ" },
};

function FeedDetailPanel({ item, onClose }: { item: FeedItem; onClose: () => void }) {
  const navigate = useNavigate();
  const [followUp, setFollowUp] = useState("");
  const detail = FEED_DETAILS[item.id];
  const style = FEED_TYPE_STYLES[item.type];

  if (!detail) return null;

  const handleFollowUp = () => {
    if (!followUp.trim()) return;
    navigate("/app/sessions");
  };

  return (
    <div className="w-[380px] shrink-0 border-l border-border flex flex-col bg-surface-0 h-full">
      {/* Header */}
      <div className="px-4 py-3 border-b border-border flex items-center gap-3 shrink-0">
        <span className="text-lg">{item.icon}</span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 mb-0.5">
            <span
              className={`text-[9px] font-medium px-1.5 py-0.5 rounded ${style.bg} ${style.text}`}
            >
              {style.label}
            </span>
            <span className="text-[10px] text-text-muted">{item.time}</span>
          </div>
          <h3 className="text-[13px] font-semibold text-text-primary truncate">{item.title}</h3>
        </div>
        <button
          onClick={onClose}
          className="p-1 rounded-md hover:bg-surface-3 text-text-muted transition-colors shrink-0"
        >
          <X size={14} />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2.5 min-h-0">
        {detail.messages.map((msg, i) => (
          <div key={i}>
            {msg.from === "system" ? (
              <div className="flex items-center gap-2 py-1.5">
                <div className="h-px flex-1 bg-border" />
                <span className="text-[10px] text-text-muted shrink-0">{msg.content}</span>
                <div className="h-px flex-1 bg-border" />
              </div>
            ) : (
              <div className="flex gap-2">
                <div className="w-5 h-5 rounded-full bg-clone/15 flex items-center justify-center text-[10px] shrink-0 mt-0.5">
                  😊
                </div>
                <div className="bg-surface-1 border border-border rounded-xl rounded-bl-sm px-3 py-2 text-[12px] text-text-primary leading-relaxed whitespace-pre-line max-w-full">
                  {msg.content}
                </div>
              </div>
            )}
          </div>
        ))}

        {/* File ops in chat */}
        {detail.fileOps.length > 0 && (
          <div className="space-y-1 pt-1">
            <div className="text-[10px] text-text-muted font-medium uppercase tracking-wider px-1">
              文件操作
            </div>
            {detail.fileOps.map((op, i) => {
              const opStyle = FILE_OP_ACTION_STYLES[op.action];
              const parts = op.path.split("/");
              const fileName = parts.pop() || "";
              return (
                <div
                  key={i}
                  className="flex items-center gap-1.5 px-2 py-1.5 bg-surface-1 border border-border rounded-lg text-[11px]"
                >
                  <span className={`px-1 py-0.5 rounded text-[9px] font-bold ${opStyle.color}`}>
                    {opStyle.label}
                  </span>
                  <FileText size={11} className="text-text-muted shrink-0" />
                  <span className="text-text-primary font-medium truncate">{fileName}</span>
                  <span className="text-text-muted truncate ml-auto text-[10px] font-mono">
                    {parts.join("/")}/
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Follow-up input */}
      <div className="border-t border-border p-3 space-y-2 shrink-0">
        <div className="flex items-end gap-2 bg-surface-1 border border-border rounded-xl px-3 py-2">
          <textarea
            value={followUp}
            onChange={(e) => setFollowUp(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleFollowUp();
              }
            }}
            placeholder="追问、展开、提需求..."
            rows={1}
            className="flex-1 bg-transparent text-[12px] text-text-primary placeholder:text-text-muted resize-none focus:outline-none leading-relaxed"
          />
          <Button
            type="button"
            size="inline"
            onClick={handleFollowUp}
            className="p-1.5 bg-accent text-accent-fg rounded-lg shrink-0 hover:bg-accent-hover transition-colors"
          >
            <Send size={12} />
          </Button>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2">
          {detail.sessionId && (
            <Button
              type="button"
              size="inline"
              onClick={() => navigate("/app/sessions")}
              className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-surface-2 border border-border rounded-lg text-[11px] text-text-primary hover:bg-surface-3 transition-colors"
            >
              <ExternalLink size={11} />在 Session 中展开
            </Button>
          )}
          <Button
            type="button"
            size="inline"
            onClick={() => navigate("/app/sessions")}
            className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-accent/10 border border-accent/20 rounded-lg text-[11px] text-accent hover:bg-accent/15 transition-colors"
          >
            <Plus size={11} />新 Session 继续
          </Button>
        </div>
      </div>
    </div>
  );
}

function FeedsTab() {
  const navigate = useNavigate();
  const [chatInput, setChatInput] = useState("");
  const [selectedFeed, setSelectedFeed] = useState<FeedItem | null>(null);

  const handleSend = () => {
    if (!chatInput.trim()) return;
    navigate("/app/sessions");
    setChatInput("");
  };

  return (
    <div className="flex gap-0 items-stretch -mr-6">
      {/* Feed list */}
      <div
        className={`space-y-4 transition-all duration-200 ${selectedFeed ? "flex-1 min-w-0" : "w-full"}`}
      >
        {/* Quick chat input */}
        <div className="bg-surface-1 border border-border rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="flex-1 relative">
              <input
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                placeholder="有什么想法？随时开始对话..."
                className="w-full bg-surface-0 border border-border rounded-lg px-4 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-[var(--color-brand-primary)]/30 focus:ring-1 focus:ring-[var(--color-brand-primary)]/20 transition-colors"
              />
            </div>
            <Button
              type="button"
              size="inline"
              onClick={handleSend}
              className="w-9 h-9 flex items-center justify-center rounded-lg bg-accent text-white hover:bg-accent/90 transition-colors"
            >
              <Send size={16} />
            </Button>
          </div>
          <div className="flex items-center gap-2 mt-2.5">
            <span className="text-[11px] text-text-muted">快捷：</span>
            {["帮我写 PRD", "跑一下竞品监控", "今天做了什么"].map((q) => (
              <button
                key={q}
                onClick={() => {
                  setChatInput(q);
                  navigate("/app/sessions");
                }}
                className="text-[11px] px-2 py-1 rounded-md bg-surface-2 text-text-secondary hover:text-text-primary hover:bg-surface-3 transition-colors"
              >
                {q}
              </button>
            ))}
          </div>
        </div>

        {/* Activity summary bar */}
        <div className="flex items-center gap-4 px-1">
          <div className="flex items-center gap-1.5 text-[12px] text-text-secondary">
            <Activity size={13} className="text-emerald-500" />
            <span>今日活跃</span>
            <span className="font-medium text-text-primary">12 项</span>
          </div>
          <div className="h-3 w-px bg-border" />
          <div className="flex items-center gap-1.5 text-[12px] text-text-secondary">
            <FileText size={13} className="text-blue-500" />
            <span className="font-medium text-text-primary">7</span>
            <span>文件</span>
          </div>
          <div className="h-3 w-px bg-border" />
          <div className="flex items-center gap-1.5 text-[12px] text-text-secondary">
            <Brain size={13} className="text-amber-500" />
            <span className="font-medium text-text-primary">14</span>
            <span>记忆</span>
          </div>
          <div className="flex-1" />
          <span className="text-[11px] text-text-muted">自动刷新 · 5 分钟前</span>
        </div>

        {/* Feed stream */}
        <div className="space-y-2">
          {FEED_ITEMS.map((item) => {
            const style = FEED_TYPE_STYLES[item.type];
            const isSelected = selectedFeed?.id === item.id;
            return (
              <div
                key={item.id}
                role="button"
                tabIndex={0}
                onClick={() => setSelectedFeed(isSelected ? null : item)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") setSelectedFeed(isSelected ? null : item);
                }}
                className={`group bg-surface-1 border rounded-xl p-4 transition-colors cursor-pointer ${
                  isSelected
                    ? "border-accent bg-accent/[0.03]"
                    : "border-border hover:border-border-hover"
                }`}
              >
                <div className="flex items-start gap-3">
                  <span className="text-lg mt-0.5">{item.icon}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span
                        className={`text-[10px] font-medium px-1.5 py-0.5 rounded ${style.bg} ${style.text}`}
                      >
                        {style.label}
                      </span>
                      {item.tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-[10px] px-1.5 py-0.5 rounded bg-surface-2 text-text-muted"
                        >
                          {tag}
                        </span>
                      ))}
                      <span className="text-[11px] text-text-muted ml-auto shrink-0">
                        {item.time}
                      </span>
                    </div>
                    <h4 className="text-[13px] font-medium text-text-primary mb-0.5">
                      {item.title}
                    </h4>
                    <p className="text-[12px] text-text-secondary leading-relaxed">{item.desc}</p>
                    <div className="flex items-center gap-3 mt-2">
                      {item.files != null && (
                        <span className="text-[11px] text-text-muted flex items-center gap-1">
                          <FileText size={11} /> {item.files} 文件
                        </span>
                      )}
                      {item.memories != null && (
                        <span className="text-[11px] text-text-muted flex items-center gap-1">
                          <Brain size={11} /> {item.memories} 记忆
                        </span>
                      )}
                      <div className="flex-1" />
                      <span
                        className={`text-[11px] text-accent font-medium flex items-center gap-1 transition-opacity ${
                          isSelected ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                        }`}
                      >
                        {isSelected ? "收起详情" : "查看详情"}
                        <ChevronRight
                          size={11}
                          className={`transition-transform ${isSelected ? "rotate-180" : ""}`}
                        />
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Load more */}
        <div className="text-center py-2">
          <Button
            type="button"
            size="inline"
            className="text-[12px] text-text-muted hover:text-text-secondary transition-colors"
          >
            加载更多...
          </Button>
        </div>
      </div>

      {/* Detail panel */}
      {selectedFeed && (
        <div
          className="shrink-0 ml-4 sticky top-0 self-start"
          style={{ height: "calc(100vh - 160px)" }}
        >
          <FeedDetailPanel item={selectedFeed} onClose={() => setSelectedFeed(null)} />
        </div>
      )}
    </div>
  );
}

function ChannelCard({ ch }: { ch: Channel }) {
  return (
    <EntityCard interactive className="overflow-hidden bg-surface-2">
      <EntityCardHeader className="items-center gap-4">
        <EntityCardMedia className="h-10 w-10 rounded-lg bg-surface-3 text-2xl">
          {ch.icon}
        </EntityCardMedia>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <EntityCardTitle className="text-sm">{ch.name}</EntityCardTitle>
            {ch.badge && (
              <span
                className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${
                  ch.badge === "主渠道"
                    ? "bg-clone/10 text-clone"
                    : ch.badge === "零安装"
                      ? "bg-success-subtle text-success"
                      : "bg-surface-3 text-text-muted"
                }`}
              >
                {ch.badge}
              </span>
            )}
          </div>
          <EntityCardDescription className="mt-0.5 text-xs">{ch.desc}</EntityCardDescription>
        </div>
        <div className="flex items-center gap-2">
          {ch.status === "connected" && (
            <span className="flex items-center gap-1 text-xs text-success bg-success-subtle px-2 py-1 rounded-md">
              <Check size={12} /> 已连接
            </span>
          )}
          {ch.status === "pending" && (
            <Button
              type="button"
              size="inline"
              className="text-xs text-accent bg-accent-subtle px-2.5 py-1 rounded-md hover:bg-accent-glow transition-colors font-medium"
            >
              配置
            </Button>
          )}
          {ch.status === "off" && <span className="text-xs text-text-muted">—</span>}
        </div>
      </EntityCardHeader>

      {/* Native channel highlight */}
      {ch.highlight && ch.status !== "off" && (
        <EntityCardContent className="pt-0">
          <div className="rounded-lg border border-success/10 bg-success-subtle/30 p-2.5">
            <div className="text-[11px] text-text-secondary leading-relaxed flex items-start gap-2">
              <Sparkles size={12} className="text-success shrink-0 mt-0.5" />
              {ch.highlight}
            </div>
          </div>
        </EntityCardContent>
      )}

      {ch.stats && (
        <EntityCardContent className="space-y-2.5 pt-0">
          <div className="flex items-center gap-4 flex-wrap">
            <ChannelStatBadge icon="💬" label="轮次" value={ch.stats.rounds} />
            <ChannelStatBadge icon="📄" label="文件" value={ch.stats.files} />
            <ChannelStatBadge icon="🧠" label="记忆" value={ch.stats.memories} />
            <ChannelStatBadge icon="👤" label="联系人" value={ch.stats.contacts} />
          </div>

          {ch.recent.length > 0 && (
            <div className="pt-2 border-t border-border-subtle space-y-1">
              {ch.recent.map((r, i) => (
                <div key={i} className="flex items-center gap-2 text-[11px] group cursor-pointer">
                  <span className="text-[10px]">{r.type === "memory" ? "🧠" : "📄"}</span>
                  <span className="text-text-secondary group-hover:text-text-primary transition-colors">
                    {r.label}
                  </span>
                  <span className="text-text-muted ml-auto shrink-0">{r.time}</span>
                  <ArrowUpRight
                    size={12}
                    className="text-text-muted opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
                  />
                </div>
              ))}
            </div>
          )}
        </EntityCardContent>
      )}
    </EntityCard>
  );
}

function ChannelsTab() {
  const nativeChannels = CHANNELS.filter((c) => c.category === "native");
  const imChannels = CHANNELS.filter((c) => c.category === "im");

  return (
    <div className="space-y-6">
      {/* Native channels section */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <div className="w-5 h-5 rounded bg-success-subtle flex items-center justify-center">
            <Phone size={11} className="text-success" />
          </div>
          <span className="text-[13px] font-semibold text-text-primary">原生渠道</span>
          <span className="text-[10px] text-success bg-success-subtle px-1.5 py-0.5 rounded-full font-medium">
            零安装
          </span>
        </div>
        <div className="text-[12px] text-text-secondary mb-3 pl-7">
          无需下载任何 App — 每个手机都有短信和邮件。发一条消息就能启动分身工作。
        </div>
        <div className="space-y-3">
          {nativeChannels.map((ch) => (
            <ChannelCard key={ch.name} ch={ch} />
          ))}
        </div>
      </div>

      {/* IM platform channels section */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <div className="w-5 h-5 rounded bg-clone/10 flex items-center justify-center">
            <MessageSquare size={11} className="text-clone" />
          </div>
          <span className="text-[13px] font-semibold text-text-primary">IM 平台</span>
          <span className="text-[10px] text-text-muted">团队协作 · 群聊 · 卡片交互</span>
        </div>
        <div className="space-y-3">
          {imChannels.map((ch) => (
            <ChannelCard key={ch.name} ch={ch} />
          ))}
        </div>
      </div>

      <Button
        type="button"
        size="inline"
        className="w-full flex items-center justify-center gap-2 p-3 border border-dashed border-border rounded-xl text-sm text-text-secondary hover:text-text-primary hover:border-border-hover transition-colors"
      >
        <Plus size={16} />
        添加渠道
      </Button>
    </div>
  );
}

function ContactsTab() {
  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-surface-2 border border-border rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-text-primary">6</div>
          <div className="text-xs text-text-secondary mt-1">联系人</div>
        </div>
        <div className="bg-surface-2 border border-border rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-text-primary">3</div>
          <div className="text-xs text-text-secondary mt-1">群组</div>
        </div>
        <div className="bg-surface-2 border border-border rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-clone">12</div>
          <div className="text-xs text-text-secondary mt-1">本周互动</div>
        </div>
      </div>

      {/* Groups */}
      <div>
        <div className="text-sm font-medium text-text-primary mb-3">~/clone/contacts/_groups/</div>
        <div className="flex flex-wrap gap-2">
          {CONTACT_GROUPS.map((g) => (
            <div
              key={g.name}
              className="flex items-center gap-2 px-3 py-2 bg-surface-2 border border-border rounded-lg hover:border-border-hover transition-colors cursor-pointer"
            >
              <span>{g.icon}</span>
              <span className="text-[13px] text-text-primary font-medium">{g.name}</span>
              <span className="text-[11px] text-text-muted">{g.members.length} 人</span>
            </div>
          ))}
        </div>
      </div>

      {/* People */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="text-sm font-medium text-text-primary">~/clone/contacts/</div>
          <Button
            type="button"
            size="inline"
            className="flex items-center gap-1 text-xs text-text-secondary hover:text-text-primary transition-colors"
          >
            <RefreshCw size={12} />
            同步通讯录
          </Button>
        </div>
        <div className="space-y-2">
          {CONTACTS.map((c) => (
            <EntityCard key={c.name} interactive className="group rounded-lg bg-surface-2">
              <EntityCardHeader className="items-center gap-3 p-3">
                <EntityCardMedia className="h-9 w-9 rounded-full bg-surface-3 text-lg">
                  {c.avatar}
                </EntityCardMedia>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <EntityCardTitle className="text-[13px]">{c.name}</EntityCardTitle>
                    <span className="text-[10px] px-1.5 py-0.5 bg-surface-3 rounded text-text-muted">
                      {c.role}
                    </span>
                    <span className="text-[10px] px-1.5 py-0.5 bg-surface-3 rounded text-text-muted">
                      {c.relation}
                    </span>
                  </div>
                  <EntityCardDescription className="mt-0.5 text-[11px]">
                    {c.notes}
                  </EntityCardDescription>
                </div>
                <div className="flex flex-col items-end gap-1 shrink-0">
                  <div className="flex items-center gap-1 text-[10px] text-text-muted">
                    {c.channel === "Email" ? (
                      <Mail size={10} />
                    ) : c.channel === "Slack" ? (
                      <MessageSquare size={10} />
                    ) : (
                      <Phone size={10} />
                    )}
                    {c.channel}
                  </div>
                  <span className="text-[10px] text-text-muted">{c.lastInteraction}</span>
                </div>
              </EntityCardHeader>
              <EntityCardFooter className="justify-between opacity-0 transition-opacity group-hover:opacity-100">
                <EntityCardMeta className="mt-0 font-mono text-[10px]">{c.file}</EntityCardMeta>
                <button type="button" className="p-0.5 text-text-muted hover:text-text-secondary">
                  <Pencil size={10} />
                </button>
              </EntityCardFooter>
            </EntityCard>
          ))}
        </div>
      </div>

      <Button
        type="button"
        size="inline"
        className="w-full flex items-center justify-center gap-2 p-3 border border-dashed border-border rounded-xl text-sm text-text-secondary hover:text-text-primary hover:border-border-hover transition-colors"
      >
        <Plus size={16} />
        添加联系人
      </Button>
    </div>
  );
}

function MemoryTab() {
  const [activeCat, setActiveCat] = useState("all");
  const [showChangelog, setShowChangelog] = useState(false);

  const filtered =
    activeCat === "all" ? MEMORY_ENTRIES : MEMORY_ENTRIES.filter((m) => m.category === activeCat);

  return (
    <div className="space-y-4">
      {/* Category filter bar */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
        {MEMORY_CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCat(cat.id)}
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-full text-[12px] whitespace-nowrap transition-colors border ${
              activeCat === cat.id
                ? "bg-accent text-accent-fg border-accent"
                : "bg-surface-2 text-text-secondary border-border hover:border-border-hover"
            }`}
          >
            <span className="text-[11px]">{cat.icon}</span>
            {cat.label}
            <span
              className={`text-[10px] tabular-nums ${activeCat === cat.id ? "text-accent-fg/70" : "text-text-muted"}`}
            >
              {cat.count}
            </span>
          </button>
        ))}
      </div>

      {/* Update history link */}
      <button
        onClick={() => setShowChangelog(!showChangelog)}
        className="w-full flex items-center justify-between px-4 py-2.5 bg-surface-2 border border-border rounded-xl hover:border-border-hover transition-colors"
      >
        <span className="text-[13px] text-text-secondary">查看记忆更新记录</span>
        <ChevronRight
          size={14}
          className={`text-text-muted transition-transform ${showChangelog ? "rotate-90" : ""}`}
        />
      </button>

      {/* Changelog panel */}
      {showChangelog && (
        <div className="bg-surface-2 border border-border rounded-xl p-4 space-y-2">
          <div className="text-[13px] font-medium text-text-primary mb-3">记忆记录</div>
          {MEMORY_CHANGELOG.map((log, i) => (
            <div
              key={i}
              className="flex items-start gap-3 py-2 border-b border-border-subtle last:border-0"
            >
              <div className="w-5 h-5 rounded-full bg-surface-3 flex items-center justify-center shrink-0 mt-0.5">
                {log.action === "merge" && <span className="text-[10px]">🔗</span>}
                {log.action === "extract" && <span className="text-[10px]">💎</span>}
                {log.action === "edit" && <span className="text-[10px]">✏️</span>}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[12px] text-text-primary">{log.desc}</div>
                {log.source && (
                  <div className="text-[11px] text-text-muted mt-0.5">来源：{log.source}</div>
                )}
              </div>
              <span className="text-[11px] text-text-muted shrink-0">{log.time}</span>
            </div>
          ))}
        </div>
      )}

      {/* Memory entries */}
      <div className="space-y-2">
        {filtered.map((m) => {
          const cat = MEMORY_CATEGORIES.find((c) => c.id === m.category);
          return (
            <div
              key={m.id}
              className="p-4 bg-surface-2 border border-border rounded-xl hover:border-border-hover transition-colors group"
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="text-sm">{cat?.icon}</span>
                <span className="text-[12px] font-medium text-clone">{cat?.label}</span>
                <div className="ml-auto flex items-center gap-2">
                  {m.source === "fine-tuned" && (
                    <span className="text-[9px] px-1.5 py-0.5 bg-clone/10 text-clone rounded-full">
                      微调
                    </span>
                  )}
                  {m.source === "auto-extracted" && (
                    <span className="text-[9px] px-1.5 py-0.5 bg-info-subtle text-info rounded-full">
                      自动提取
                    </span>
                  )}
                  {m.source === "proactive" && (
                    <span className="text-[9px] px-1.5 py-0.5 bg-success-subtle text-success rounded-full">
                      主动更新
                    </span>
                  )}
                  <span className="text-[10px] text-text-muted">{m.time}</span>
                </div>
              </div>
              <div className="text-[13px] text-text-primary leading-relaxed">{m.content}</div>
              <div className="flex items-center gap-2 mt-2.5">
                {m.private && (
                  <span className="flex items-center gap-1 text-[10px] text-text-muted">
                    <Shield size={10} />
                    私密记忆
                  </span>
                )}
                <button className="ml-auto p-1 text-text-muted opacity-0 group-hover:opacity-100 transition-opacity hover:text-text-secondary">
                  <Pencil size={11} />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Fine-tune button */}
      <div className="flex justify-center pt-2">
        <Button
          type="button"
          size="inline"
          className="flex items-center gap-2 px-5 py-2.5 bg-accent text-accent-fg rounded-full text-[13px] font-medium hover:bg-accent-hover transition-colors shadow-sm"
        >
          <Sparkles size={14} />
          记忆微调
        </Button>
      </div>
    </div>
  );
}

function ArtifactsTab() {
  return (
    <div className="space-y-4">
      <div className="text-sm font-medium text-text-primary mb-2">~/clone/artifacts/</div>
      <div className="space-y-2">
        {ARTIFACT_FOLDERS.map((t) => (
          <div
            key={t.folder}
            className="p-3 bg-surface-2 border border-border rounded-lg hover:border-border-hover transition-colors group"
          >
            <div className="flex items-center gap-3 mb-2">
              <FolderOpen size={14} className="text-role-founder" />
              <div className="flex-1 min-w-0">
                <div className="text-[12px] font-mono text-text-primary">{t.folder}</div>
                <div className="text-[11px] text-text-muted">{t.desc}</div>
              </div>
              <div className="text-xs text-text-secondary tabular-nums">{t.count} files</div>
              <ChevronRight
                size={14}
                className="text-text-muted opacity-0 group-hover:opacity-100 transition-opacity"
              />
            </div>
            <div className="pl-7 flex flex-wrap gap-1">
              {t.files.map((f) => (
                <span
                  key={f}
                  className="text-[10px] px-1.5 py-0.5 bg-surface-3 rounded text-text-muted font-mono"
                >
                  {f}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
      <Button
        type="button"
        size="inline"
        className="w-full flex items-center justify-center gap-2 p-3 border border-dashed border-border rounded-xl text-sm text-text-secondary hover:text-text-primary hover:border-border-hover transition-colors"
      >
        <Plus size={16} />
        添加产物文件夹
      </Button>
    </div>
  );
}

function PersonaPanel({ onOpenOnboarding }: { onOpenOnboarding: () => void }) {
  return (
    <div className="space-y-4">
      {/* Avatar & Identity */}
      <div className="text-center">
        <div className="relative inline-block">
          <div className="w-20 h-20 rounded-full bg-surface-3 animate-clone-breath-subtle flex items-center justify-center text-4xl mx-auto">
            😊
          </div>
          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 bg-accent text-accent-fg text-[10px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap">
            Lv.3
          </div>
        </div>
        <div className="mt-4 text-lg font-semibold text-text-primary">我的分身</div>
        <div className="text-sm text-text-secondary">全栈工程师</div>
        <div className="flex items-center justify-center gap-1.5 mt-1.5">
          <div className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
          <span className="text-[11px] text-success">在线 · 已陪伴 49 天</span>
        </div>

        {/* Onboarding entry */}
        <Button
          type="button"
          size="inline"
          onClick={onOpenOnboarding}
          className="mt-3 w-full flex items-center justify-center gap-1.5 px-3 py-2 bg-clone/10 border border-clone/20 rounded-xl text-[12px] text-clone font-medium hover:bg-clone/15 transition-colors"
        >
          <Wrench size={13} />
          初始化 / 编辑分身
        </Button>

        {/* Alignment rate */}
        <div className="mt-3 px-2">
          <div className="flex items-center justify-between text-[10px] mb-1">
            <span className="text-text-muted">对齐率</span>
            <span className="text-clone font-medium tabular-nums">78%</span>
          </div>
          <div className="h-1.5 bg-surface-3 rounded-full overflow-hidden">
            <div className="h-full bg-clone rounded-full transition-all" style={{ width: "78%" }} />
          </div>
          <div className="text-[9px] text-text-muted mt-1">
            多聊天多"喂养"，对齐率越高分身越懂你
          </div>
        </div>
      </div>

      {/* Vital Stats */}
      <div className="grid grid-cols-2 gap-2">
        <div className="bg-surface-2 border border-border rounded-lg p-2.5 text-center">
          <div className="text-base font-bold text-text-primary tabular-nums">1,770</div>
          <div className="text-[10px] text-text-muted">对话轮次</div>
        </div>
        <div className="bg-surface-2 border border-border rounded-lg p-2.5 text-center">
          <div className="text-base font-bold text-text-primary tabular-nums">162</div>
          <div className="text-[10px] text-text-muted">文件数</div>
        </div>
        <div className="bg-surface-2 border border-border rounded-lg p-2.5 text-center">
          <div className="text-base font-bold text-text-primary tabular-nums">223</div>
          <div className="text-[10px] text-text-muted">记忆条目</div>
        </div>
        <div className="bg-surface-2 border border-border rounded-lg p-2.5 text-center">
          <div className="text-base font-bold text-text-primary tabular-nums">6</div>
          <div className="text-[10px] text-text-muted">联系人</div>
        </div>
      </div>

      {/* Soul Properties */}
      <div>
        <div className="flex items-center gap-1 mb-2">
          <Shield size={12} className="text-clone" />
          <span className="text-[11px] font-medium text-text-secondary uppercase tracking-wider">
            人设特质
          </span>
        </div>
        <div className="space-y-1.5">
          {SOUL_FILES.map((f, i) => (
            <div
              key={i}
              className="flex items-start gap-2 p-2 bg-surface-2 border border-border rounded-lg group hover:border-border-hover transition-colors"
            >
              <div className="text-[10px] text-text-muted w-14 shrink-0 pt-0.5 uppercase tracking-wider">
                {f.label}
              </div>
              <div className="flex-1 text-[12px] text-text-primary leading-relaxed">{f.value}</div>
              {f.editable && (
                <button className="p-0.5 text-text-muted opacity-0 group-hover:opacity-100 transition-opacity hover:text-text-secondary shrink-0">
                  <Pencil size={10} />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Worldview Summary */}
      <div>
        <div className="flex items-center gap-1 mb-2">
          <Globe size={12} className="text-info" />
          <span className="text-[11px] font-medium text-text-secondary uppercase tracking-wider">
            世界观
          </span>
        </div>
        <div className="space-y-1.5">
          {WORLDVIEW_FILES.slice(0, 3).map((w) => (
            <div
              key={w.label}
              className="flex items-start gap-2 p-2 bg-surface-2 border border-border rounded-lg group hover:border-border-hover transition-colors"
            >
              <span className="text-sm shrink-0">{w.icon}</span>
              <div className="flex-1 min-w-0">
                <div className="text-[11px] font-medium text-text-primary">{w.label}</div>
                <div className="text-[11px] text-text-secondary leading-relaxed">{w.value}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* File Path */}
      <div className="pt-2 border-t border-border">
        <div className="text-[10px] text-text-muted font-mono text-center">
          ~/.soul/identity.md · persona.md · worldview.md
        </div>
      </div>
    </div>
  );
}

function WorldviewTab() {
  return (
    <div className="space-y-3">
      {WORLDVIEW_FILES.map((w) => (
        <div
          key={w.label}
          className="p-4 bg-surface-2 border border-border rounded-xl hover:border-border-hover transition-colors group"
        >
          <div className="flex items-center gap-2 mb-2">
            <span className="text-lg">{w.icon}</span>
            <span className="text-sm font-medium text-text-primary">{w.label}</span>
            <span className="text-[10px] text-text-muted font-mono ml-auto opacity-0 group-hover:opacity-100 transition-opacity">
              {w.path}
            </span>
            <button className="p-1 text-text-muted opacity-0 group-hover:opacity-100 transition-opacity hover:text-text-secondary">
              <Pencil size={12} />
            </button>
          </div>
          <div className="text-[13px] text-text-secondary pl-7 leading-relaxed">{w.value}</div>
        </div>
      ))}
      <Button
        type="button"
        size="inline"
        className="w-full flex items-center justify-center gap-2 p-3 border border-dashed border-border rounded-xl text-sm text-text-secondary hover:text-text-primary hover:border-border-hover transition-colors"
      >
        <Plus size={16} />
        添加世界观条目
      </Button>
    </div>
  );
}

const TAB_COMPONENTS: Record<TabId, () => React.JSX.Element> = {
  feeds: FeedsTab,
  channels: ChannelsTab,
  contacts: ContactsTab,
  memory: MemoryTab,
  artifacts: ArtifactsTab,
  worldview: WorldviewTab,
};

export default function CloneBuilderPage() {
  const [searchParams] = useSearchParams();
  const tabFromUrl = searchParams.get("tab") as TabId | null;
  const [activeTab, setActiveTab] = useState<TabId>(
    tabFromUrl && TABS.some((t) => t.id === tabFromUrl) ? tabFromUrl : "feeds",
  );
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    if (tabFromUrl && TABS.some((t) => t.id === tabFromUrl)) {
      setActiveTab(tabFromUrl);
    }
  }, [tabFromUrl]);

  const TabContent = TAB_COMPONENTS[activeTab];
  const { expandFileTree } = useProductLayout();

  return (
    <div className="h-full overflow-y-auto">
      <div className="max-w-5xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-xl font-bold text-text-primary">分身搭建</h1>
          <p className="text-sm text-text-secondary mt-1">
            配置你的数字分身 — 所有配置存储在
            <Button
              type="button"
              size="inline"
              onClick={expandFileTree}
              className="font-mono text-text-primary hover:text-accent transition-colors ml-1 inline-flex items-center gap-1"
            >
              <FolderOpen size={12} />
              ~/clone/
            </Button>
            文件系统中
          </p>
        </div>

        <div className="flex gap-6 items-start">
          {/* Left: Persona — always visible */}
          <div className="w-64 shrink-0 sticky top-8">
            <PersonaPanel onOpenOnboarding={() => setShowOnboarding(true)} />
          </div>

          {/* Right: Configuration tabs */}
          <div className="flex-1 min-w-0">
            <ToggleGroup
              type="single"
              value={activeTab}
              onValueChange={(value: string) => {
                if (value) setActiveTab(value as TabId);
              }}
              variant="underline"
              aria-label="Clone builder sections"
              className="mb-6"
            >
              {TABS.map((t) => (
                <ToggleGroupItem
                  key={t.id}
                  value={t.id}
                  variant="underline"
                  className="gap-1.5 text-[13px]"
                >
                  <t.icon size={14} />
                  {t.label}
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
            <TabContent />
          </div>
        </div>
      </div>

      {showOnboarding && <OnboardingChat onClose={() => setShowOnboarding(false)} />}
    </div>
  );
}
