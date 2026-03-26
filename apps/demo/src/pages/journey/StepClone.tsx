import { useState } from "react";
import {
  Shield,
  Globe,
  Pencil,
  Wrench,
  Rss,
  Activity,
  FileText,
  Brain,
  Plus,
  Send,
  ChevronRight,
  MessageSquare,
  Phone,
  Database,
} from "lucide-react";
import ChatCardGroup from "../product/ChatCards";
import type { ChatCard } from "../product/sessionsData";

const SOUL_FILES = [
  { label: "角色", value: "全栈工程师 · 产品经理" },
  { label: "领域", value: "Web 开发 · AI 应用 · SaaS" },
  { label: "沟通", value: "简洁直接 · 技术术语用英文" },
  { label: "习惯", value: "晚上效率高 · 先做难的 · 迭代快" },
];

const WORLDVIEW = [
  { icon: "🎯", label: "产品哲学", value: "用户体验 > 功能数量" },
  { icon: "⚡", label: "技术观", value: "实用主义，先跑起来再优化" },
  { icon: "🧭", label: "决策原则", value: '"这让分身更懂用户了吗？"' },
];

type FeedItemType =
  | "automation"
  | "session"
  | "skill"
  | "memory"
  | "proactive"
  | "team";

const FEED_ITEMS: {
  type: FeedItemType;
  icon: string;
  title: string;
  desc: string;
  time: string;
  files?: number;
  memories?: number;
}[] = [
  {
    type: "proactive",
    icon: "📊",
    title: "今日战况复盘已生成",
    desc: "完成 12 个任务，生成 3 份文档，新增 5 条记忆",
    time: "22:00",
    files: 3,
    memories: 5,
  },
  {
    type: "team",
    icon: "🤝",
    title: "张三的分身查询了你的任务进度",
    desc: "分身已自动回复 Gateway 重构时间线",
    time: "14:30",
  },
  {
    type: "automation",
    icon: "⚡",
    title: "竞品监控触发 — Notion 发布 AI 更新",
    desc: "已自动生成竞品分析摘要并存入 artifacts",
    time: "18:30",
    files: 1,
  },
  {
    type: "session",
    icon: "💬",
    title: "注册流程优化方案完成",
    desc: "基于 OAuth 选型，生成完整 PRD + 流程图",
    time: "16:45",
    files: 2,
    memories: 1,
  },
  {
    type: "memory",
    icon: "🧠",
    title: "记忆整理完成 — 发现 3 条冲突",
    desc: "自动整理本周 23 条记忆，建议确认 3 条变更",
    time: "14:00",
    memories: 23,
  },
];

const FEED_TYPE_STYLES: Record<FeedItemType, string> = {
  automation: "bg-blue-500/10 text-blue-600",
  session: "bg-emerald-500/10 text-emerald-600",
  skill: "bg-purple-500/10 text-purple-600",
  memory: "bg-amber-500/10 text-amber-600",
  proactive: "bg-orange-500/10 text-orange-600",
  team: "bg-cyan-500/10 text-cyan-600",
};

// Sample ChatCards to preview how feed items appear as cards in sessions
const FEED_CARD_PREVIEWS: ChatCard[] = [
  {
    type: "automation",
    title: "今日战况复盘",
    status: "success",
    body: "✓ 扫描 3 个活跃 Session\n✓ 生成日报并推送到飞书群",
    path: "artifacts/reports/daily-digest-0221.md",
    meta: "cron: 每天 22:00",
  },
  {
    type: "collaboration",
    title: "李四分身回复：Gateway 进度",
    status: "success",
    body: "整体进度：15%\nAPI 路由层已完成，中间件迁移进行中",
    path: "contacts/李四-后端.md",
    meta: "Proxy 回复 · 2 分钟",
  },
  {
    type: "file",
    title: "注册流程优化 PRD",
    status: "success",
    body: "方案 A：Google OAuth + 飞书扫码\n预计注册转化率提升 40%",
    path: "artifacts/prds/注册流程优化.md",
    diff: { added: 48, removed: 0 },
  },
];

const CHANNELS_NATIVE = [
  {
    name: "Email",
    icon: "📧",
    status: "connected",
    desc: "tom@refly.ai · IMAP 已配置",
    badge: "零安装",
  },
  {
    name: "SMS",
    icon: "💬",
    status: "connected",
    desc: "+86 138****7890 · Twilio",
    badge: "零安装",
  },
  {
    name: "WhatsApp",
    icon: "📱",
    status: "pending",
    desc: "待绑定手机号",
    badge: "零安装",
  },
];

const CHANNELS_IM = [
  {
    name: "飞书",
    icon: "🐦",
    status: "connected",
    desc: "Bot 已上线 · 主渠道",
  },
  {
    name: "Slack",
    icon: "💼",
    status: "connected",
    desc: "OAuth 已授权 · 3 个 Channel",
  },
  { name: "Telegram", icon: "✈️", status: "pending", desc: "待配置 Bot Token" },
  { name: "Discord", icon: "🎮", status: "off", desc: "即将支持" },
  { name: "企业微信", icon: "🏢", status: "off", desc: "即将支持" },
];

const MEMORY_CATEGORIES = [
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

const MEMORY_SAMPLE = [
  { category: "ideas", content: 'AI 视为"赛博合伙人"的协作理念', icon: "💡" },
  {
    category: "decisions",
    content: "PostgreSQL + TypeORM 替代 MongoDB",
    icon: "⚖️",
  },
  {
    category: "preferences",
    content: "喜欢运动，乒乓球和跑步，影视达人",
    icon: "⭐",
  },
];

type TabId = "feeds" | "channels" | "memory";

export default function StepClone() {
  const [activeTab, setActiveTab] = useState<TabId>("feeds");

  const TABS: { id: TabId; label: string; icon: typeof Rss }[] = [
    { id: "feeds", label: "Feeds", icon: Rss },
    { id: "channels", label: "Channels", icon: MessageSquare },
    { id: "memory", label: "Memory", icon: Database },
  ];

  return (
    <div className="max-w-5xl mx-auto px-6 py-8">
      <div className="mb-6">
        <h1 className="text-lg font-bold text-text-primary">分身搭建</h1>
        <p className="text-[13px] text-text-secondary mt-1">
          配置你的数字分身 — 所有信息存储在分身的大脑中，越用越懂你
        </p>
      </div>

      <div className="flex gap-6 items-start">
        {/* Left: PersonaPanel (condensed, product-aligned) */}
        <div className="w-60 shrink-0 space-y-4">
          <div className="text-center">
            <div className="relative inline-block">
              <div className="w-16 h-16 rounded-full bg-surface-3 animate-clone-breath-subtle flex items-center justify-center text-3xl mx-auto">
                😊
              </div>
              <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 bg-accent text-accent-fg text-[9px] font-bold px-1.5 py-0.5 rounded-full">
                Lv.3
              </div>
            </div>
            <div className="mt-3 text-base font-semibold text-text-primary">
              我的分身
            </div>
            <div className="text-[12px] text-text-secondary">全栈工程师</div>
            <div className="flex items-center justify-center gap-1 mt-1">
              <div className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
              <span className="text-[10px] text-success">
                在线 · 已陪伴 49 天
              </span>
            </div>

            <button className="mt-2.5 w-full flex items-center justify-center gap-1 px-3 py-1.5 bg-clone/10 border border-clone/20 rounded-lg text-[11px] text-clone font-medium hover:bg-clone/15 transition-colors">
              <Wrench size={11} />
              初始化 / 编辑分身
            </button>

            <div className="mt-2.5 px-1">
              <div className="flex items-center justify-between text-[10px] mb-1">
                <span className="text-text-muted">对齐率</span>
                <span className="text-clone font-medium tabular-nums">78%</span>
              </div>
              <div className="h-1.5 bg-surface-3 rounded-full overflow-hidden">
                <div
                  className="h-full bg-clone rounded-full"
                  style={{ width: "78%" }}
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-1.5">
            {[
              { v: "1,770", l: "轮次" },
              { v: "162", l: "文件" },
              { v: "223", l: "记忆" },
              { v: "6", l: "联系人" },
            ].map((s) => (
              <div
                key={s.l}
                className="bg-surface-2 border border-border rounded-md p-2 text-center"
              >
                <div className="text-sm font-bold text-text-primary tabular-nums">
                  {s.v}
                </div>
                <div className="text-[9px] text-text-muted">{s.l}</div>
              </div>
            ))}
          </div>

          <div>
            <div className="flex items-center gap-1 mb-1.5">
              <Shield size={11} className="text-clone" />
              <span className="text-[10px] font-medium text-text-secondary uppercase tracking-wider">
                人设特质
              </span>
            </div>
            <div className="space-y-1">
              {SOUL_FILES.map((f) => (
                <div
                  key={f.label}
                  className="flex items-start gap-1.5 p-1.5 bg-surface-2 border border-border rounded-md group hover:border-border-hover transition-colors"
                >
                  <div className="text-[9px] text-text-muted w-8 shrink-0 pt-0.5 uppercase">
                    {f.label}
                  </div>
                  <div className="flex-1 text-[10px] text-text-primary leading-relaxed">
                    {f.value}
                  </div>
                  <Pencil
                    size={8}
                    className="text-text-muted opacity-0 group-hover:opacity-100 shrink-0 mt-0.5"
                  />
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center gap-1 mb-1.5">
              <Globe size={11} className="text-info" />
              <span className="text-[10px] font-medium text-text-secondary uppercase tracking-wider">
                世界观
              </span>
            </div>
            <div className="space-y-1">
              {WORLDVIEW.map((w) => (
                <div
                  key={w.label}
                  className="flex items-start gap-1.5 p-1.5 bg-surface-2 border border-border rounded-md"
                >
                  <span className="text-xs shrink-0">{w.icon}</span>
                  <div>
                    <div className="text-[10px] font-medium text-text-primary">
                      {w.label}
                    </div>
                    <div className="text-[9px] text-text-secondary">
                      {w.value}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Tab-based content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1 mb-4 border-b border-border">
            {TABS.map((t) => (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id)}
                className={`flex items-center gap-1 px-3 py-2 text-[12px] border-b-2 -mb-px transition-colors ${
                  activeTab === t.id
                    ? "border-accent text-text-primary font-medium"
                    : "border-transparent text-text-secondary"
                }`}
              >
                <t.icon size={13} /> {t.label}
              </button>
            ))}
          </div>

          {activeTab === "feeds" && (
            <>
              <div className="bg-surface-1 border border-border rounded-xl p-3 mb-4">
                <div className="flex items-center gap-2">
                  <input
                    placeholder="有什么想法？随时开始对话..."
                    className="flex-1 bg-surface-0 border border-border rounded-lg px-3 py-2 text-[12px] text-text-primary placeholder:text-text-muted focus:outline-none focus:border-[var(--color-brand-primary)]/30 focus:ring-1 focus:ring-[var(--color-brand-primary)]/20 transition-colors"
                  />
                  <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-accent text-white hover:bg-accent/90 transition-colors">
                    <Send size={14} />
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-3 px-1 mb-3">
                <div className="flex items-center gap-1 text-[11px] text-text-secondary">
                  <Activity size={12} className="text-emerald-500" />
                  <span>今日活跃</span>
                  <span className="font-medium text-text-primary">12 项</span>
                </div>
                <div className="h-3 w-px bg-border" />
                <div className="flex items-center gap-1 text-[11px] text-text-secondary">
                  <FileText size={12} className="text-blue-500" />
                  <span className="font-medium text-text-primary">7</span> 文件
                </div>
                <div className="h-3 w-px bg-border" />
                <div className="flex items-center gap-1 text-[11px] text-text-secondary">
                  <Brain size={12} className="text-amber-500" />
                  <span className="font-medium text-text-primary">14</span> 记忆
                </div>
              </div>

              <div className="space-y-2 mb-4">
                {FEED_ITEMS.map((item) => (
                  <div
                    key={item.title}
                    className="group bg-surface-1 border border-border rounded-xl p-3 hover:border-border-hover transition-colors cursor-pointer"
                  >
                    <div className="flex items-start gap-2.5">
                      <span className="text-base mt-0.5">{item.icon}</span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 mb-0.5">
                          <span
                            className={`text-[9px] font-medium px-1 py-0.5 rounded ${
                              FEED_TYPE_STYLES[item.type]
                            }`}
                          >
                            {item.type}
                          </span>
                          <span className="text-[10px] text-text-muted ml-auto">
                            {item.time}
                          </span>
                        </div>
                        <h4 className="text-[12px] font-medium text-text-primary">
                          {item.title}
                        </h4>
                        <p className="text-[11px] text-text-secondary mt-0.5">
                          {item.desc}
                        </p>
                        <div className="flex items-center gap-2 mt-1.5">
                          {item.files != null && (
                            <span className="text-[10px] text-text-muted flex items-center gap-0.5">
                              <FileText size={9} /> {item.files}
                            </span>
                          )}
                          {item.memories != null && (
                            <span className="text-[10px] text-text-muted flex items-center gap-0.5">
                              <Brain size={9} /> {item.memories}
                            </span>
                          )}
                          <span className="text-[10px] text-accent font-medium ml-auto opacity-0 group-hover:opacity-100 flex items-center gap-0.5">
                            查看详情 <ChevronRight size={9} />
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-border pt-4">
                <div className="text-[11px] text-text-muted mb-2">
                  Feed 中的活动会以卡片形式出现在 Session 中：
                </div>
                <ChatCardGroup cards={FEED_CARD_PREVIEWS} interactive={false} />
              </div>

              <div className="text-center py-3">
                <button className="flex items-center gap-1 mx-auto text-[11px] text-text-muted hover:text-text-secondary transition-colors">
                  <Plus size={11} /> 加载更多
                </button>
              </div>
            </>
          )}

          {activeTab === "channels" && (
            <div className="space-y-6">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-5 h-5 rounded bg-success-subtle flex items-center justify-center">
                    <Phone size={11} className="text-success" />
                  </div>
                  <span className="text-[13px] font-semibold text-text-primary">
                    原生渠道
                  </span>
                  <span className="text-[10px] text-success bg-success-subtle px-1.5 py-0.5 rounded-full font-medium">
                    零安装
                  </span>
                </div>
                <div className="text-[12px] text-text-secondary mb-2 pl-7">
                  无需下载 App — 发消息即可启动分身
                </div>
                <div className="space-y-2">
                  {CHANNELS_NATIVE.map((ch) => (
                    <div
                      key={ch.name}
                      className="flex items-center gap-3 p-3 bg-surface-2 border border-border rounded-lg"
                    >
                      <span className="text-xl">{ch.icon}</span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="text-[13px] font-medium text-text-primary">
                            {ch.name}
                          </span>
                          {ch.badge && (
                            <span className="text-[9px] px-1 py-0.5 rounded bg-success-subtle text-success">
                              {ch.badge}
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-text-secondary">
                          {ch.desc}
                        </div>
                      </div>
                      {ch.status === "connected" && (
                        <span className="text-[10px] text-success bg-success-subtle px-2 py-0.5 rounded">
                          已连接
                        </span>
                      )}
                      {ch.status === "pending" && (
                        <span className="text-[10px] text-accent bg-accent/10 px-2 py-0.5 rounded">
                          配置
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-5 h-5 rounded bg-clone/10 flex items-center justify-center">
                    <MessageSquare size={11} className="text-clone" />
                  </div>
                  <span className="text-[13px] font-semibold text-text-primary">
                    IM 平台
                  </span>
                </div>
                <div className="space-y-2">
                  {CHANNELS_IM.map((ch) => (
                    <div
                      key={ch.name}
                      className="flex items-center gap-3 p-3 bg-surface-2 border border-border rounded-lg"
                    >
                      <span className="text-xl">{ch.icon}</span>
                      <div className="flex-1 min-w-0">
                        <span className="text-[13px] font-medium text-text-primary">
                          {ch.name}
                        </span>
                        <span className="text-[11px] text-text-secondary ml-2">
                          {ch.desc}
                        </span>
                      </div>
                      {ch.status === "connected" && (
                        <span className="text-[10px] text-success bg-success-subtle px-2 py-0.5 rounded">
                          已连接
                        </span>
                      )}
                      {ch.status === "pending" && (
                        <span className="text-[10px] text-accent bg-accent/10 px-2 py-0.5 rounded">
                          配置
                        </span>
                      )}
                      {ch.status === "off" && (
                        <span className="text-[10px] text-text-muted">
                          即将支持
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <button className="w-full flex items-center justify-center gap-2 p-3 border border-dashed border-border rounded-xl text-[12px] text-text-secondary hover:text-text-primary hover:border-border-hover transition-colors">
                <Plus size={14} /> 添加渠道
              </button>
            </div>
          )}

          {activeTab === "memory" && (
            <div className="space-y-4">
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                {MEMORY_CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    className="flex items-center gap-1 px-2.5 py-1.5 rounded-full text-[12px] whitespace-nowrap bg-surface-2 text-text-secondary border border-border hover:border-border-hover transition-colors"
                  >
                    <span className="text-[11px]">{cat.icon}</span>
                    {cat.label}
                    <span className="text-[10px] text-text-muted tabular-nums">
                      {cat.count}
                    </span>
                  </button>
                ))}
              </div>

              <div className="space-y-2">
                {MEMORY_SAMPLE.map((m, i) => (
                  <div
                    key={i}
                    className="p-3 bg-surface-2 border border-border rounded-xl hover:border-border-hover transition-colors"
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm">{m.icon}</span>
                      <span className="text-[12px] font-medium text-clone">
                        {
                          MEMORY_CATEGORIES.find((c) => c.id === m.category)
                            ?.label
                        }
                      </span>
                    </div>
                    <div className="text-[12px] text-text-primary leading-relaxed pl-5">
                      {m.content}
                    </div>
                  </div>
                ))}
              </div>

              <button className="w-full flex items-center justify-center gap-2 p-3 border border-dashed border-border rounded-xl text-[12px] text-text-secondary hover:text-text-primary hover:border-border-hover transition-colors">
                <Plus size={14} /> 查看全部记忆
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}