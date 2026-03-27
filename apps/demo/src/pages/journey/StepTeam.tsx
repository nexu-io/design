import { Button, StatsBar } from "@nexu/ui-web";
import {
  ArrowUp,
  BarChart3,
  Bot,
  CheckCircle,
  Circle,
  Clock,
  GitPullRequest,
  MessageSquare,
  Minus,
  Radio,
  Target,
  User,
  UserPlus,
  Users,
} from "lucide-react";
import { useState } from "react";
import ChatCardGroup from "../product/ChatCards";
import type { ChatCard } from "../product/sessionsData";

const TEAM_MEMBERS = [
  { name: "张三", role: "前端工程师", avatar: "👨‍💻", level: 3, status: "online", alignment: 87 },
  { name: "李四", role: "后端工程师", avatar: "🧑‍💻", level: 2, status: "online", alignment: 73 },
  { name: "王五", role: "UI/UX 设计师", avatar: "👩‍🎨", level: 3, status: "busy", alignment: 91 },
  { name: "赵六", role: "产品经理", avatar: "👩‍💼", level: 4, status: "online", alignment: 95 },
];

const STATUS_COLOR: Record<string, string> = {
  online: "bg-success",
  busy: "bg-warning",
  away: "bg-text-muted",
};

const TEAM_CARDS: Record<string, ChatCard[]> = {
  standup: [
    {
      type: "collaboration",
      title: "团队站会 · Sprint 3",
      status: "success",
      body: "整体进度 58%\n张三：前端集成 + 测试 85%\n李四：Gateway 刚启动 ⚠️\n王五：设计稿 90% ✓",
      actions: [{ label: "📋 查看完整报告", primary: true }, { label: "💬 讨论" }],
      meta: "赵六的分身 · 09:05 自动生成",
    },
  ],
  proxy: [
    {
      type: "collaboration",
      title: "设计组 · 任务进度",
      status: "success",
      body: "设计稿 v2: 90%\n暗色主题: 100% ✅\n交互原型: 60%\n\n分身备注：周三下午可以评审交互原型",
      meta: "via 王五的分身 · 自动回复 · 无需打扰本人",
      viralCta: "💡 也让你的同事拥有分身 — 邀请有奖",
    },
  ],
  align: [
    {
      type: "collaboration",
      title: "对齐请求 · 高优先级",
      status: "warning",
      body: "前端集成依赖 Gateway 重构，可能延期 2 天\n🎯 建议：提前启动 Gateway 重构",
      actions: [{ label: "✅ 同意", primary: true }, { label: "❌ 拒绝" }, { label: "💬 回复" }],
      meta: "自动发起 · 基于任务依赖分析",
    },
  ],
};

// Simplified task data for journey preview
const SIMPLE_TASKS = [
  {
    id: "TK-001",
    title: "Gateway 重构",
    status: "in_progress",
    priority: "high",
    assignee: "李四",
    executor: "agent",
  },
  {
    id: "TK-002",
    title: "前端集成接入",
    status: "todo",
    priority: "urgent",
    assignee: "张三",
    executor: "hybrid",
  },
  {
    id: "TK-003",
    title: "暗色主题设计稿",
    status: "done",
    priority: "medium",
    assignee: "王五",
    executor: "human",
  },
];

type TabId = "cards" | "alignments" | "tasks" | "okr" | "sprint" | "members";

const TABS: { id: TabId; label: string; icon: typeof Radio }[] = [
  { id: "cards", label: "任务流", icon: Radio },
  { id: "alignments", label: "对齐请求", icon: GitPullRequest },
  { id: "tasks", label: "任务", icon: CheckCircle },
  { id: "okr", label: "OKR", icon: Target },
  { id: "sprint", label: "Sprint", icon: BarChart3 },
  { id: "members", label: "成员", icon: Users },
];

// ─── StatsBar ─────────────────────────────────────────────

function TeamStatsBar() {
  const online = TEAM_MEMBERS.filter((m) => m.status === "online").length;
  const stats = [
    { id: "okr", label: "OKR 完成率", value: "86%", tone: "accent" as const },
    {
      id: "online",
      label: "分身在线",
      value: `${online}/${TEAM_MEMBERS.length}`,
      tone: "success" as const,
    },
    { id: "cards", label: "今日卡片", value: "5", tone: "accent" as const },
    { id: "alignments", label: "待对齐", value: "1", tone: "warning" as const },
    { id: "tasks", label: "活跃任务", value: "4", tone: "accent" as const },
    { id: "sprint", label: "Sprint 进度", value: "58%", tone: "info" as const },
  ];

  return <StatsBar items={stats} />;
}

// ─── Simplified Task Card ─────────────────────────────────

function SimpleTaskCard({
  task,
}: {
  task: (typeof SIMPLE_TASKS)[number];
}) {
  const statusConfig: Record<string, { icon: typeof Clock; color: string }> = {
    todo: { icon: Circle, color: "text-info" },
    in_progress: { icon: Clock, color: "text-clone" },
    done: { icon: CheckCircle, color: "text-success" },
  };
  const priorityConfig: Record<string, { icon: typeof ArrowUp; color: string }> = {
    urgent: { icon: ArrowUp, color: "text-danger" },
    high: { icon: ArrowUp, color: "text-warning" },
    medium: { icon: Minus, color: "text-info" },
  };
  const executorConfig: Record<string, { icon: typeof Bot; color: string }> = {
    human: { icon: User, color: "text-text-secondary" },
    agent: { icon: Bot, color: "text-clone" },
    hybrid: { icon: Users, color: "text-info" },
  };
  const status = statusConfig[task.status] ?? statusConfig.todo;
  const priority = priorityConfig[task.priority] ?? priorityConfig.medium;
  const executor = executorConfig[task.executor] ?? executorConfig.human;
  const StatusIcon = status.icon;
  const PriorityIcon = priority.icon;
  const ExecutorIcon = executor.icon;

  return (
    <div className="border border-border rounded-xl bg-surface-1 px-4 py-3 border-l-2 border-l-clone/50">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-[10px] text-text-muted font-mono">{task.id}</span>
        <StatusIcon size={12} className={status.color} />
        <PriorityIcon size={12} className={priority.color} />
      </div>
      <div className="text-[13px] font-medium text-text-primary mb-2">{task.title}</div>
      <div className="flex items-center gap-3 text-[10px] text-text-muted">
        <span>{task.assignee}</span>
        <ExecutorIcon size={10} className={executor.color} />
        <span className={executor.color}>
          {task.executor === "agent" ? "Agent" : task.executor === "hybrid" ? "人+Agent" : "人工"}
        </span>
      </div>
    </div>
  );
}

// ─── TeamInsightsChat indicator (collapsed bar) ──────────────

function ScopedSessionIndicator() {
  return (
    <div className="border-t border-border bg-surface-0">
      <button
        type="button"
        className="w-full px-4 h-[44px] flex items-center gap-2 bg-surface-1 hover:bg-surface-1/80 transition-colors"
      >
        <span className="text-[12px] font-medium text-text-primary">Team Insights</span>
        <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-medium">
          Scoped Session
        </span>
        <span className="text-[10px] text-text-muted">— 限定团队分析 Skills</span>
      </button>
    </div>
  );
}

// ─── Main ──────────────────────────────────────────────────

export default function StepTeam() {
  const [activeTab, setActiveTab] = useState<TabId>("cards");
  const [cardTab, setCardTab] = useState<"standup" | "proxy" | "align">("standup");

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-text-primary mb-2">团队协作 — 分身网络</h2>
        <p className="text-[14px] text-text-secondary max-w-xl mx-auto">
          当团队成员都有分身后，分身之间可以代替人交流、自动对齐、检测依赖风险。 所有交互通过 IM
          卡片推送到飞书/Slack 群。
        </p>
      </div>

      <div className="border border-border rounded-xl bg-surface-0 overflow-hidden">
        <TeamStatsBar />

        {/* Tab bar */}
        <div className="flex items-center gap-0.5 px-5 border-b border-border bg-surface-0">
          {TABS.map((tab) => {
            const active = activeTab === tab.id;
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 px-3 py-2.5 text-[12px] font-medium border-b-2 transition-colors ${
                  active
                    ? "border-accent text-text-primary"
                    : "border-transparent text-text-muted hover:text-text-secondary"
                }`}
              >
                <Icon size={14} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Content area */}
        <div className="flex min-h-[400px]">
          {/* Left: Team members panel */}
          <div className="w-64 border-r border-border bg-surface-1 shrink-0">
            <div className="px-4 py-3 border-b border-border flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users size={14} className="text-clone" />
                <span className="text-[13px] font-semibold text-text-primary">团队分身</span>
                <span className="text-[10px] text-text-muted">3/4 在线</span>
              </div>
              <Button
                variant="ghost"
                size="xs"
                className="h-auto gap-1 bg-accent/10 px-2 py-1 text-[10px] font-medium text-accent"
              >
                <UserPlus size={10} /> 邀请
              </Button>
            </div>
            <div className="p-3 space-y-2">
              {TEAM_MEMBERS.map((m) => (
                <div key={m.name} className="flex items-center gap-3 p-2.5 bg-surface-0 rounded-lg">
                  <div className="relative">
                    <div className="w-8 h-8 rounded-full bg-surface-3 flex items-center justify-center text-sm">
                      {m.avatar}
                    </div>
                    <div
                      className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-surface-1 ${STATUS_COLOR[m.status]}`}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-[12px] font-medium text-text-primary">{m.name}</span>
                      <span className="text-[9px] px-1 py-0.5 bg-clone/10 text-clone rounded">
                        Lv.{m.level}
                      </span>
                    </div>
                    <span className="text-[10px] text-text-muted">{m.role}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-[12px] font-bold text-clone">{m.alignment}%</div>
                    <div className="text-[9px] text-text-muted">默契度</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Tab content */}
          <div className="flex-1 min-w-0 p-4 overflow-auto">
            {activeTab === "cards" && (
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <MessageSquare size={14} className="text-clone" />
                  <span className="text-[13px] font-semibold text-text-primary">IM 卡片流</span>
                </div>
                <div className="flex items-center gap-1 mb-4">
                  {[
                    { id: "standup" as const, label: "📊 站会汇总" },
                    { id: "proxy" as const, label: "🤝 分身代问" },
                    { id: "align" as const, label: "⚠️ 对齐请求" },
                  ].map((t) => (
                    <button
                      key={t.id}
                      onClick={() => setCardTab(t.id)}
                      className={`px-2.5 py-1 rounded-md text-[10px] font-medium transition-colors ${
                        cardTab === t.id
                          ? "bg-accent text-accent-fg"
                          : "bg-surface-3 text-text-muted hover:text-text-secondary"
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-6 h-6 rounded-full bg-clone/10 flex items-center justify-center text-[10px]">
                    {cardTab === "standup" ? "👩‍💼" : cardTab === "proxy" ? "😊" : "👨‍💻"}
                  </div>
                  <span className="text-[11px] font-semibold text-text-primary">
                    {cardTab === "standup"
                      ? "赵六的分身"
                      : cardTab === "proxy"
                        ? "你的分身"
                        : "张三的分身"}
                  </span>
                  <span className="text-[8px] px-1 py-0.5 bg-clone/10 text-clone rounded">BOT</span>
                  <span className="text-[10px] text-text-muted">
                    {cardTab === "standup" ? "09:05" : cardTab === "proxy" ? "10:30" : "14:00"}
                  </span>
                </div>
                <ChatCardGroup cards={TEAM_CARDS[cardTab]} />
              </div>
            )}

            {activeTab === "tasks" && (
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <CheckCircle size={14} className="text-clone" />
                  <span className="text-[13px] font-semibold text-text-primary">任务管理</span>
                </div>
                <div className="space-y-3">
                  {SIMPLE_TASKS.map((t) => (
                    <SimpleTaskCard key={t.id} task={t} />
                  ))}
                </div>
              </div>
            )}

            {activeTab === "alignments" && (
              <div className="flex items-center gap-2 text-text-muted">
                <GitPullRequest size={14} />
                <span className="text-[13px]">对齐请求</span>
                <span className="text-[11px]">— 待对齐卡片展示</span>
              </div>
            )}

            {activeTab === "okr" && (
              <div className="flex items-center gap-2 text-text-muted">
                <Target size={14} />
                <span className="text-[13px]">OKR</span>
                <span className="text-[11px]">— 目标与关键结果</span>
              </div>
            )}

            {activeTab === "sprint" && (
              <div className="flex items-center gap-2 text-text-muted">
                <BarChart3 size={14} />
                <span className="text-[13px]">Sprint</span>
                <span className="text-[11px]">— 迭代进度</span>
              </div>
            )}

            {activeTab === "members" && (
              <div className="flex items-center gap-2 text-text-muted">
                <Users size={14} />
                <span className="text-[13px]">成员</span>
                <span className="text-[11px]">— 成员列表与详情</span>
              </div>
            )}
          </div>
        </div>

        <ScopedSessionIndicator />
      </div>

      {/* Core scenarios */}
      <div className="border border-border rounded-xl bg-surface-1 p-5">
        <h3 className="text-[14px] font-semibold text-text-primary mb-4">核心场景</h3>
        <div className="grid grid-cols-3 gap-4">
          {[
            {
              icon: "🤝",
              title: "分身代问",
              desc: "你的分身向其他成员的分身查询任务进度，自动回复，无需打扰本人。结果以 IM 卡片呈现。",
              tag: "P0 · Phase 4",
            },
            {
              icon: "📊",
              title: "站会自动化",
              desc: "每日自动汇总团队分身任务进度，生成站会 IM 卡片推送到群，包含风险提醒。",
              tag: "P0 · Phase 4",
            },
            {
              icon: "⚠️",
              title: "依赖感知与主动对齐",
              desc: "检测跨成员任务依赖风险，自动发起对齐请求卡片，一键确认调整排期。",
              tag: "P1 · Phase 5",
            },
          ].map((s) => (
            <div key={s.title} className="p-4 bg-surface-0 border border-border rounded-xl">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-lg">{s.icon}</span>
                <span className="text-[13px] font-semibold text-text-primary">{s.title}</span>
              </div>
              <p className="text-[11px] text-text-secondary leading-relaxed mb-3">{s.desc}</p>
              <span className="text-[9px] px-2 py-0.5 bg-clone/10 text-clone rounded-full font-medium">
                {s.tag}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
