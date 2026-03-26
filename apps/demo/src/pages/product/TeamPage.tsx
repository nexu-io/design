import { Button, StatCard } from "@nexu/ui-web";
import {
  AlertTriangle,
  BarChart3,
  CheckCircle,
  ChevronRight,
  Clock,
  GitPullRequest,
  Radio,
  Sparkles,
  Target,
  UserPlus,
  Users,
  X,
  Zap,
} from "lucide-react";
import { useState } from "react";
import {
  AlignmentDetailPanel,
  CardDetailPanel,
  MemberDetailPanel,
  OKRDetailPanel,
  StatsDetailPanel,
  TaskDetailPanel,
  TaskItemDetailPanel,
} from "./TeamDetailPanels";
import TeamInsightsChat from "./TeamInsightsChat";
import OKRTab from "./TeamOKR";
import SprintTabEnhanced from "./TeamSprint";
import TeamTasks from "./TeamTasks";
import {
  ALIGNMENT_HISTORY,
  type IMCard,
  IM_CARDS,
  type KeyResult,
  OBJECTIVES,
  type Objective,
  type SprintTask,
  TASK_BOARD,
  TEAM_MEMBERS,
  type TaskItem,
  type TeamMember,
} from "./teamData";

type TabId = "okr" | "cards" | "members" | "alignments" | "sprint" | "tasks";

type SelectedItem =
  | { type: "card"; data: IMCard }
  | { type: "member"; data: TeamMember }
  | { type: "alignment"; data: (typeof ALIGNMENT_HISTORY)[number] }
  | { type: "task"; data: SprintTask }
  | { type: "taskItem"; data: TaskItem }
  | { type: "stat"; data: string }
  | { type: "okr"; data: { objectiveId?: string; krId?: string } };

const TABS = [
  { id: "cards" as TabId, label: "任务流", icon: Radio },
  { id: "alignments" as TabId, label: "对齐请求", icon: GitPullRequest },
  { id: "tasks" as TabId, label: "任务", icon: CheckCircle },
  { id: "okr" as TabId, label: "OKR", icon: Target },
  { id: "sprint" as TabId, label: "Sprint", icon: BarChart3 },
  { id: "members" as TabId, label: "成员", icon: Users },
];

const STATUS_COLORS: Record<string, string> = {
  online: "bg-success",
  busy: "bg-warning",
  away: "bg-text-muted",
  offline: "bg-surface-4",
};

const URGENCY_STYLES: Record<string, { bg: string; text: string; label: string }> = {
  low: { bg: "bg-info-subtle", text: "text-info", label: "低" },
  medium: { bg: "bg-warning-subtle", text: "text-warning", label: "中" },
  high: { bg: "bg-danger-subtle", text: "text-danger", label: "高" },
};

// ─── Shared UI ─────────────────────────────────────────────

function ProgressBar({
  value,
  className = "",
}: {
  value: number;
  className?: string;
}) {
  return (
    <div className={`h-1.5 bg-surface-3 rounded-full overflow-hidden ${className}`}>
      <div
        className={`h-full rounded-full transition-all ${
          value >= 100 ? "bg-success" : value >= 50 ? "bg-clone" : "bg-warning"
        }`}
        style={{ width: `${Math.min(value, 100)}%` }}
      />
    </div>
  );
}

function CardWrapper({
  children,
  accent,
  onClick,
  selected,
}: {
  children: React.ReactNode;
  accent?: string;
  onClick?: () => void;
  selected?: boolean;
}) {
  return (
    <div
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onClick={onClick}
      onKeyDown={
        onClick
          ? (e) => {
              if (e.key === "Enter") onClick();
            }
          : undefined
      }
      className={`border rounded-xl overflow-hidden bg-surface-1 transition-colors ${
        onClick ? "cursor-pointer" : ""
      } ${selected ? "ring-2 ring-accent/30 border-accent/40" : ""} ${
        accent ? `border-l-2 ${accent}` : "border-border"
      } ${onClick && !selected ? "hover:border-border-hover" : ""}`}
    >
      {children}
    </div>
  );
}

function CardButton({
  children,
  variant = "default",
  onClick,
}: {
  children: React.ReactNode;
  variant?: "default" | "primary" | "success" | "danger";
  onClick?: (e: React.MouseEvent) => void;
}) {
  const styles = {
    default: "bg-surface-2 text-text-secondary hover:bg-surface-3",
    primary: "bg-accent/10 text-accent hover:bg-accent/15",
    success: "bg-success-subtle text-success hover:bg-success/20",
    danger: "bg-danger-subtle text-danger hover:bg-danger/20",
  };
  return (
    <Button
      type="button"
      size="inline"
      onClick={(e) => {
        e.stopPropagation();
        onClick?.(e);
      }}
      className={`px-3 py-1.5 rounded-lg text-[11px] font-medium transition-colors ${styles[variant]}`}
    >
      {children}
    </Button>
  );
}

// ─── IM Card Components ────────────────────────────────────

function SummaryReportIMCard({
  card,
  onSelect,
  selected,
}: {
  card: Extract<IMCard, { type: "summary_report" }>;
  onSelect: () => void;
  selected: boolean;
}) {
  return (
    <CardWrapper onClick={onSelect} selected={selected}>
      <div className="flex justify-between items-center px-4 py-3 border-b border-border/50">
        <div className="flex gap-2 items-center">
          <BarChart3 size={14} className="text-clone" />
          <span className="text-[13px] font-semibold text-text-primary">
            团队站会 · 2026-02-23（周一）
          </span>
        </div>
        <span className="text-[10px] text-text-muted">{card.sprintName}</span>
      </div>
      <div className="p-4 space-y-3">
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[12px] text-text-secondary">整体进度</span>
            <span className="text-[12px] font-medium text-clone tabular-nums">
              {card.progress}%
            </span>
          </div>
          <ProgressBar value={card.progress} />
        </div>
        <div className="space-y-2">
          {card.members.map((m) => (
            <div key={m.name} className="flex items-center gap-2 text-[12px]">
              <span>{m.avatar}</span>
              <span className="w-10 font-medium text-text-primary">{m.name}</span>
              <span className="flex-1 truncate text-text-secondary">{m.summary}</span>
              {m.done && <CheckCircle size={12} className="text-success shrink-0" />}
              {m.risk && <AlertTriangle size={12} className="text-warning shrink-0" />}
            </div>
          ))}
        </div>
        {card.risks.length > 0 && (
          <div className="p-2.5 bg-warning-subtle/50 rounded-lg">
            <div className="flex items-center gap-1.5 text-[11px] text-warning font-medium mb-1">
              <AlertTriangle size={11} /> 风险提醒
            </div>
            {card.risks.map((r, i) => (
              <div key={i} className="text-[11px] text-text-secondary">
                {r}
              </div>
            ))}
          </div>
        )}
        <div className="flex gap-2 items-center pt-1">
          <CardButton variant="primary">📋 查看完整报告</CardButton>
          <CardButton>💬 讨论</CardButton>
        </div>
      </div>
    </CardWrapper>
  );
}

function StatusQueryIMCard({
  card,
  onSelect,
  selected,
}: {
  card: Extract<IMCard, { type: "status_query" }>;
  onSelect: () => void;
  selected: boolean;
}) {
  return (
    <CardWrapper onClick={onSelect} selected={selected}>
      <div className="flex gap-2 items-center px-4 py-3 border-b border-border/50">
        <Sparkles size={14} className="text-info" />
        <span className="text-[13px] font-semibold text-text-primary">
          {card.target} · 任务进度
        </span>
      </div>
      <div className="p-4 space-y-3">
        {card.tasks.map((t) => (
          <div key={t.name} className="space-y-1">
            <div className="flex items-center justify-between text-[12px]">
              <span className="font-medium text-text-primary">{t.name}</span>
              <span
                className={`tabular-nums ${
                  t.progress >= 100 ? "text-success" : "text-text-secondary"
                }`}
              >
                {t.progress}%
              </span>
            </div>
            <ProgressBar value={t.progress} />
            <div className="text-[10px] text-text-muted">{t.status}</div>
          </div>
        ))}
        {card.note && (
          <div className="p-2.5 bg-surface-2 rounded-lg">
            <div className="text-[11px] text-text-secondary">💬 分身备注：{card.note}</div>
          </div>
        )}
        <div className="flex gap-2 items-center pt-1">
          <CardButton>📌 关注此任务</CardButton>
          <CardButton variant="primary">💬 发起对齐</CardButton>
        </div>
      </div>
      <div className="px-4 py-2 bg-surface-2/50 border-t border-border/30 flex items-center gap-1.5 text-[10px] text-text-muted">
        <Radio size={9} /> via 王五的分身 · 自动回复 · 无需打扰本人
      </div>
    </CardWrapper>
  );
}

function AlignmentRequestIMCard({
  card,
  onSelect,
  selected,
}: {
  card: Extract<IMCard, { type: "alignment_request" }>;
  onSelect: () => void;
  selected: boolean;
}) {
  const [responded, setResponded] = useState(card.status !== "pending");
  const urgency = URGENCY_STYLES[card.urgency];
  return (
    <CardWrapper accent="border-l-warning" onClick={onSelect} selected={selected}>
      <div className="flex justify-between items-center px-4 py-3 border-b border-border/50">
        <div className="flex gap-2 items-center">
          <GitPullRequest size={14} className="text-warning" />
          <span className="text-[13px] font-semibold text-text-primary">
            对齐请求 · 来自{card.from.replace("的分身", "")}
          </span>
        </div>
        <span
          className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${urgency.bg} ${urgency.text}`}
        >
          ⚡ {urgency.label}
        </span>
      </div>
      <div className="p-4 space-y-3">
        <div>
          <div className="text-[12px] text-text-muted mb-1">话题</div>
          <div className="text-[13px] text-text-primary font-medium">{card.topic}</div>
        </div>
        <div className="p-2.5 bg-surface-2 rounded-lg">
          <div className="text-[11px] text-text-muted mb-0.5">📎 背景</div>
          <div className="text-[12px] text-text-secondary">{card.reason}</div>
        </div>
        <div className="text-[12px] text-text-secondary">🎯 建议：{card.suggestion}</div>
        {!responded ? (
          <div className="flex gap-2 items-center pt-1">
            <CardButton variant="success" onClick={() => setResponded(true)}>
              ✅ 同意调整
            </CardButton>
            <CardButton variant="danger">❌ 无法调整</CardButton>
            <CardButton>💬 回复详情</CardButton>
          </div>
        ) : (
          <div className="p-2.5 bg-success-subtle/50 rounded-lg flex items-center gap-2">
            <CheckCircle size={14} className="text-success" />
            <span className="text-[12px] text-success font-medium">
              已同意 · Gateway 重构提前到明天启动
            </span>
          </div>
        )}
      </div>
      <div className="px-4 py-2 bg-surface-2/50 border-t border-border/30 flex items-center gap-1.5 text-[10px] text-text-muted">
        <Zap size={9} /> 自动发起 · 基于任务依赖分析
      </div>
    </CardWrapper>
  );
}

function EventNotificationIMCard({
  card,
  onSelect,
  selected,
}: {
  card: Extract<IMCard, { type: "event_notification" }>;
  onSelect: () => void;
  selected: boolean;
}) {
  return (
    <CardWrapper accent="border-l-success" onClick={onSelect} selected={selected}>
      <div className="flex gap-2 items-center px-4 py-3 border-b border-border/50">
        <CheckCircle size={14} className="text-success" />
        <span className="text-[13px] font-semibold text-text-primary">{card.event}</span>
      </div>
      <div className="p-4 space-y-3">
        <div className="text-[13px] text-text-primary">{card.impact}</div>
        <div className="space-y-1.5">
          {card.updates.map((u, i) => (
            <div key={i} className="flex items-center gap-2 text-[12px] text-text-secondary">
              <div className="w-1 h-1 rounded-full bg-success shrink-0" /> {u}
            </div>
          ))}
        </div>
        <div className="flex gap-2 items-center pt-1">
          <CardButton variant="success">🚀 开始任务</CardButton>
          <CardButton>📅 调整排期</CardButton>
        </div>
      </div>
    </CardWrapper>
  );
}

function GrowthTriggerIMCard({
  card,
  onSelect,
  selected,
}: {
  card: Extract<IMCard, { type: "growth_trigger" }>;
  onSelect: () => void;
  selected: boolean;
}) {
  return (
    <CardWrapper onClick={onSelect} selected={selected}>
      <div className="flex gap-2 items-center px-4 py-3 border-b border-border/50">
        <CheckCircle size={14} className="text-success" />
        <span className="text-[13px] font-semibold text-text-primary">{card.from}完成了任务</span>
      </div>
      <div className="p-4 space-y-3">
        <span className="text-[13px] text-text-primary">📝 {card.taskTitle}已生成</span>
        <div className="grid grid-cols-2 gap-3">
          <div className="p-2.5 bg-success-subtle/50 rounded-lg text-center">
            <div className="text-[18px] font-bold text-success">{card.timeSaved}</div>
            <div className="text-[10px] text-text-muted">实际耗时</div>
          </div>
          <div className="p-2.5 bg-surface-2 rounded-lg text-center">
            <div className="text-[18px] font-bold text-text-muted line-through">
              {card.manualEstimate}
            </div>
            <div className="text-[10px] text-text-muted">手动预估</div>
          </div>
        </div>
        <div className="p-2.5 bg-clone/5 rounded-lg text-[12px] text-text-secondary">
          💡 本周已帮{card.from.replace("的分身", "")}完成 {card.weeklyStats.tasks} 项任务 · 节省约{" "}
          {card.weeklyStats.hours}h
        </div>
        <Button
          type="button"
          size="inline"
          onClick={(e) => e.stopPropagation()}
          className="w-full py-2 bg-accent text-accent-fg rounded-lg text-[12px] font-medium hover:bg-accent-hover transition-colors flex items-center justify-center gap-1.5"
        >
          🤖 我也想要一个分身
        </Button>
      </div>
    </CardWrapper>
  );
}

function IMCardRenderer({
  card,
  onSelect,
  selected,
}: {
  card: IMCard;
  onSelect: () => void;
  selected: boolean;
}) {
  switch (card.type) {
    case "summary_report":
      return <SummaryReportIMCard card={card} onSelect={onSelect} selected={selected} />;
    case "status_query":
      return <StatusQueryIMCard card={card} onSelect={onSelect} selected={selected} />;
    case "alignment_request":
      return <AlignmentRequestIMCard card={card} onSelect={onSelect} selected={selected} />;
    case "event_notification":
      return <EventNotificationIMCard card={card} onSelect={onSelect} selected={selected} />;
    case "growth_trigger":
      return <GrowthTriggerIMCard card={card} onSelect={onSelect} selected={selected} />;
  }
}

// ─── IM Message Thread Wrapper ─────────────────────────────

function IMMessage({
  card,
  onSelect,
  selected,
}: {
  card: IMCard;
  onSelect: () => void;
  selected: boolean;
}) {
  return (
    <div className="flex gap-3 animate-fade-in-up">
      <div className="w-8 h-8 rounded-full bg-clone/10 flex items-center justify-center text-sm shrink-0 mt-0.5">
        {card.fromAvatar}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1.5">
          <span className="text-[12px] font-semibold text-text-primary">{card.from}</span>
          <span className="text-[9px] px-1.5 py-0.5 bg-clone/10 text-clone rounded font-medium">
            BOT
          </span>
          <span className="text-[10px] text-text-muted">{card.time}</span>
          {!card.read && <div className="w-1.5 h-1.5 rounded-full bg-info" />}
        </div>
        <IMCardRenderer card={card} onSelect={onSelect} selected={selected} />
      </div>
    </div>
  );
}

// ─── Tab: IM Cards Stream ──────────────────────────────────

function CardsTab({
  selectedCard,
  onSelectCard,
}: {
  selectedCard: IMCard | null;
  onSelectCard: (c: IMCard) => void;
}) {
  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-between items-center px-5 py-3 border-b border-border bg-surface-1/50 shrink-0">
        <div className="flex gap-2 items-center">
          <span className="text-[11px] px-2 py-0.5 bg-clone/10 text-clone rounded font-medium">
            📱 飞书
          </span>
          <span className="text-[13px] font-medium text-text-primary">#product-team</span>
          <span className="text-[11px] text-text-muted">
            · {TEAM_MEMBERS.filter((m) => m.status === "online").length} 个分身在线
          </span>
        </div>
        <span className="text-[10px] text-text-muted">今日 {IM_CARDS.length} 条卡片</span>
      </div>
      <div className="overflow-y-auto flex-1 p-5 space-y-5">
        <div className="flex gap-3 items-center py-1">
          <div className="flex-1 h-px bg-border" />
          <span className="text-[10px] text-text-muted shrink-0">2026-02-23 周一</span>
          <div className="flex-1 h-px bg-border" />
        </div>
        {IM_CARDS.map((card) => (
          <IMMessage
            key={card.id}
            card={card}
            onSelect={() => onSelectCard(card)}
            selected={selectedCard?.id === card.id}
          />
        ))}
      </div>
    </div>
  );
}

// ─── Tab: Members ──────────────────────────────────────────

function MemberCard({
  member,
  onSelect,
  selected,
}: {
  member: TeamMember;
  onSelect: () => void;
  selected: boolean;
}) {
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onSelect}
      onKeyDown={(e) => {
        if (e.key === "Enter") onSelect();
      }}
      className={`p-4 border rounded-xl bg-surface-1 transition-colors cursor-pointer ${
        selected
          ? "ring-2 ring-accent/30 border-accent/40"
          : "border-border hover:border-border-hover"
      }`}
    >
      <div className="flex gap-3 items-start mb-3">
        <div className="relative">
          <div className="flex justify-center items-center w-10 h-10 text-lg rounded-full bg-surface-3">
            {member.avatar}
          </div>
          <div
            className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-surface-1 ${
              STATUS_COLORS[member.status]
            }`}
          />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex gap-2 items-center">
            <span className="text-[13px] font-semibold text-text-primary">{member.name}</span>
            <span className="text-[10px] px-1.5 py-0.5 bg-clone/10 text-clone rounded font-medium">
              Lv.{member.level}
            </span>
          </div>
          <div className="text-[11px] text-text-secondary">{member.role}</div>
        </div>
        <div className="text-[10px] text-text-muted">{member.channel}</div>
      </div>
      <div className="grid grid-cols-3 gap-2 mb-3">
        <div className="p-2 text-center rounded-lg bg-surface-2">
          <div className="text-[14px] font-bold text-text-primary">{member.tasksInProgress}</div>
          <div className="text-[9px] text-text-muted">进行中</div>
        </div>
        <div className="p-2 text-center rounded-lg bg-surface-2">
          <div className="text-[14px] font-bold text-success">{member.tasksCompleted}</div>
          <div className="text-[9px] text-text-muted">已完成</div>
        </div>
        <div className="p-2 text-center rounded-lg bg-surface-2">
          <div className="text-[14px] font-bold text-clone">{member.alignmentRate}%</div>
          <div className="text-[9px] text-text-muted">默契度</div>
        </div>
      </div>
      <div className="flex items-center justify-between text-[10px]">
        <span className="text-text-muted">最近活跃：{member.lastActive}</span>
        <span className="text-accent flex items-center gap-0.5">
          查看详情 <ChevronRight size={10} />
        </span>
      </div>
    </div>
  );
}

function MembersTab({
  selectedMember,
  onSelectMember,
}: {
  selectedMember: TeamMember | null;
  onSelectMember: (m: TeamMember) => void;
}) {
  const online = TEAM_MEMBERS.filter((m) => m.status === "online").length;
  const total = TEAM_MEMBERS.length;
  return (
    <div className="overflow-y-auto h-full">
      <div className="flex justify-between items-center px-5 py-3 border-b border-border bg-surface-1/50">
        <div className="flex gap-3 items-center">
          <span className="text-[13px] font-medium text-text-primary">团队分身</span>
          <span className="text-[11px] text-text-muted">
            {online}/{total} 在线
          </span>
        </div>
        <span className="text-[10px] px-2 py-1 bg-success-subtle text-success rounded-md font-medium">
          网络效应 +{Math.round((total / 3 - 1) * 100)}% vs 3 人
        </span>
      </div>
      <div className="grid grid-cols-2 gap-4 p-5">
        {TEAM_MEMBERS.map((m) => (
          <MemberCard
            key={m.name}
            member={m}
            onSelect={() => onSelectMember(m)}
            selected={selectedMember?.name === m.name}
          />
        ))}
        <div className="p-4 border-2 border-dashed border-border rounded-xl bg-surface-1/50 hover:border-clone/30 transition-colors cursor-pointer flex flex-col items-center justify-center gap-2 min-h-[160px]">
          <div className="flex justify-center items-center w-10 h-10 rounded-full bg-clone/10">
            <UserPlus size={18} className="text-clone" />
          </div>
          <div className="text-[12px] font-medium text-text-primary">邀请成员</div>
          <div className="text-[10px] text-text-muted text-center">
            发送飞书/Slack 邀请
            <br />1 分钟创建分身
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Tab: Alignments ───────────────────────────────────────

function AlignmentsTab({
  selectedAlignment,
  onSelectCard,
  onSelectAlignment,
}: {
  selectedAlignment: (typeof ALIGNMENT_HISTORY)[number] | null;
  onSelectCard: (c: IMCard) => void;
  onSelectAlignment: (a: (typeof ALIGNMENT_HISTORY)[number]) => void;
}) {
  const pendingCards = IM_CARDS.filter((c) => c.type === "alignment_request") as Extract<
    IMCard,
    { type: "alignment_request" }
  >[];
  return (
    <div className="overflow-y-auto h-full">
      <div className="px-5 py-3 border-b border-border bg-surface-1/50">
        <span className="text-[13px] font-medium text-text-primary">对齐请求</span>
      </div>
      <div className="p-5 space-y-6">
        {pendingCards.length > 0 && (
          <div>
            <div className="text-[11px] font-medium text-warning uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <Clock size={12} /> 待处理 ({pendingCards.length})
            </div>
            <div className="space-y-3">
              {pendingCards.map((card) => (
                <IMMessage
                  key={card.id}
                  card={card}
                  onSelect={() => onSelectCard(card)}
                  selected={false}
                />
              ))}
            </div>
          </div>
        )}
        <div>
          <div className="text-[11px] font-medium text-text-muted uppercase tracking-wider mb-3">
            历史记录
          </div>
          <div className="space-y-2">
            {ALIGNMENT_HISTORY.map((a) => (
              <div
                key={a.id}
                role="button"
                tabIndex={0}
                onClick={() => onSelectAlignment(a)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") onSelectAlignment(a);
                }}
                className={`flex items-center gap-3 p-3 bg-surface-1 border rounded-lg cursor-pointer transition-colors ${
                  selectedAlignment?.id === a.id
                    ? "ring-2 ring-accent/30 border-accent/40"
                    : "border-border hover:border-border-hover"
                }`}
              >
                {a.status === "accepted" ? (
                  <CheckCircle size={14} className="text-success shrink-0" />
                ) : (
                  <X size={14} className="text-danger shrink-0" />
                )}
                <div className="flex-1 min-w-0">
                  <div className="text-[12px] text-text-primary font-medium">{a.topic}</div>
                  <div className="text-[10px] text-text-muted">
                    来自 {a.from}的分身 · {a.time}
                  </div>
                </div>
                <span
                  className={`text-[10px] px-2 py-0.5 rounded-full ${
                    a.status === "accepted"
                      ? "bg-success-subtle text-success"
                      : "bg-danger-subtle text-danger"
                  }`}
                >
                  {a.status === "accepted" ? "已同意" : "已拒绝"}
                </span>
                <ChevronRight size={12} className="text-text-muted shrink-0" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Stats Bar ─────────────────────────────────────────────

function StatsBar({
  onSelectStat,
  selectedStat,
  onSwitchTab,
}: {
  onSelectStat: (id: string) => void;
  selectedStat: string | null;
  onSwitchTab: (tab: TabId) => void;
}) {
  const online = TEAM_MEMBERS.filter((m) => m.status === "online").length;
  const okrProgress = Math.round(
    OBJECTIVES.reduce((s, o) => s + o.progress, 0) / OBJECTIVES.length,
  );
  const stats = [
    {
      id: "okr",
      label: "OKR",
      value: `${okrProgress}%`,
      tone: "accent" as const,
      tab: "okr" as TabId,
    },
    {
      id: "online",
      label: "分身在线",
      value: `${online}/${TEAM_MEMBERS.length}`,
      tone: "success" as const,
      tab: "members" as TabId,
    },
    {
      id: "cards",
      label: "今日卡片",
      value: `${IM_CARDS.length}`,
      tone: "accent" as const,
      tab: "cards" as TabId,
    },
    {
      id: "alignments",
      label: "待对齐",
      value: `${IM_CARDS.filter((c) => c.type === "alignment_request" && !c.read).length}`,
      tone: "warning" as const,
      tab: "alignments" as TabId,
    },
    {
      id: "tasks",
      label: "活跃任务",
      value: `${TASK_BOARD.filter((t) => t.status === "in_progress" || t.status === "todo").length}`,
      tone: "accent" as const,
      tab: "tasks" as TabId,
    },
    {
      id: "sprint",
      label: "Sprint",
      value: "58%",
      tone: "info" as const,
      tab: "sprint" as TabId,
    },
  ];

  return (
    <div className="flex items-center gap-4 px-5 py-2.5 bg-surface-1 border-b border-border">
      {stats.map((s, i) => (
        <button
          key={s.id}
          type="button"
          onClick={() => {
            onSelectStat(s.id);
            onSwitchTab(s.tab);
          }}
          className={`transition-colors rounded-md ${
            selectedStat === s.id ? "bg-accent/5" : "hover:bg-surface-2"
          }`}
        >
          <div className="flex items-center gap-2">
            {i > 0 && <div className="w-px h-8 bg-border" />}
            <StatCard
              label={s.label}
              value={s.value}
              tone={s.tone}
              padding="none"
              className="border-0 bg-transparent shadow-none p-1.5 min-w-[86px]"
            />
          </div>
        </button>
      ))}
    </div>
  );
}

// ─── Detail Panel Router ───────────────────────────────────

function DetailPanelRouter({
  selected,
  onClose,
}: {
  selected: SelectedItem;
  onClose: () => void;
}) {
  switch (selected.type) {
    case "card":
      return <CardDetailPanel card={selected.data} onClose={onClose} />;
    case "member":
      return <MemberDetailPanel member={selected.data} onClose={onClose} />;
    case "alignment":
      return <AlignmentDetailPanel alignment={selected.data} onClose={onClose} />;
    case "task":
      return <TaskDetailPanel task={selected.data} onClose={onClose} />;
    case "taskItem":
      return <TaskItemDetailPanel task={selected.data} onClose={onClose} />;
    case "stat":
      return <StatsDetailPanel statId={selected.data} onClose={onClose} />;
    case "okr":
      return (
        <OKRDetailPanel
          objectiveId={selected.data.objectiveId}
          krId={selected.data.krId}
          onClose={onClose}
        />
      );
  }
}

// ─── Main Page ─────────────────────────────────────────────

export default function TeamPage() {
  const [activeTab, setActiveTab] = useState<TabId>("cards");
  const [selected, setSelected] = useState<SelectedItem | null>(null);

  const handleSelectCard = (card: IMCard) => {
    setSelected((prev) =>
      prev?.type === "card" && prev.data.id === card.id ? null : { type: "card", data: card },
    );
  };
  const handleSelectMember = (member: TeamMember) => {
    setSelected((prev) =>
      prev?.type === "member" && prev.data.name === member.name
        ? null
        : { type: "member", data: member },
    );
  };
  const handleSelectAlignment = (a: (typeof ALIGNMENT_HISTORY)[number]) => {
    setSelected((prev) =>
      prev?.type === "alignment" && prev.data.id === a.id ? null : { type: "alignment", data: a },
    );
  };
  const handleSelectTask = (task: SprintTask) => {
    setSelected((prev) =>
      prev?.type === "task" && prev.data.id === task.id ? null : { type: "task", data: task },
    );
  };
  const handleSelectTaskItem = (task: TaskItem) => {
    setSelected((prev) =>
      prev?.type === "taskItem" && prev.data.id === task.id
        ? null
        : { type: "taskItem", data: task },
    );
  };
  const handleSelectStat = (statId: string) => {
    setSelected((prev) =>
      prev?.type === "stat" && prev.data === statId ? null : { type: "stat", data: statId },
    );
  };
  const handleSelectObjective = (o: Objective) => {
    setSelected((prev) =>
      prev?.type === "okr" && prev.data.objectiveId === o.id && !prev.data.krId
        ? null
        : { type: "okr", data: { objectiveId: o.id } },
    );
  };
  const handleSelectKR = (kr: KeyResult) => {
    setSelected((prev) =>
      prev?.type === "okr" && prev.data.krId === kr.id
        ? null
        : { type: "okr", data: { krId: kr.id } },
    );
  };

  const handleTabSwitch = (tab: TabId, keepSelection = false) => {
    if (activeTab !== tab) {
      setActiveTab(tab);
      if (!keepSelection) setSelected(null);
    }
  };

  const handleClose = () => setSelected(null);

  const atRiskOKR = OBJECTIVES.filter(
    (o) => o.status === "at_risk" || o.status === "behind",
  ).length;

  return (
    <div className="flex flex-col h-full bg-surface-0">
      <StatsBar
        onSelectStat={handleSelectStat}
        selectedStat={selected?.type === "stat" ? selected.data : null}
        onSwitchTab={(tab) => handleTabSwitch(tab, true)}
      />

      {/* Tab bar */}
      <div className="flex items-center gap-0.5 px-5 border-b border-border bg-surface-0">
        {TABS.map((tab) => {
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => handleTabSwitch(tab.id)}
              className={`flex items-center gap-1.5 px-3 py-2.5 text-[12px] font-medium border-b-2 transition-colors ${
                active
                  ? "border-accent text-text-primary"
                  : "border-transparent text-text-muted hover:text-text-secondary"
              }`}
            >
              <tab.icon size={14} />
              {tab.label}
              {tab.id === "tasks" && (
                <span className="text-[9px] px-1 py-0.5 bg-clone/10 text-clone rounded-full ml-0.5">
                  {TASK_BOARD.filter((t) => t.status === "in_progress").length}
                </span>
              )}
              {tab.id === "alignments" && (
                <span className="text-[9px] px-1 py-0.5 bg-warning-subtle text-warning rounded-full ml-0.5">
                  1
                </span>
              )}
              {tab.id === "okr" && atRiskOKR > 0 && (
                <span className="text-[9px] px-1 py-0.5 bg-danger-subtle text-danger rounded-full ml-0.5">
                  {atRiskOKR}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Content + Detail Panel + Insights Chat */}
      <div className="flex overflow-hidden flex-col flex-1 min-h-0">
        <div className="flex overflow-hidden flex-1 min-h-0">
          <div
            className={`transition-all duration-200 overflow-hidden flex flex-col ${
              selected ? "flex-1 min-w-0" : "w-full"
            }`}
          >
            <div className="overflow-hidden flex-1 min-h-0">
              {activeTab === "okr" && (
                <OKRTab
                  selectedOKR={
                    selected?.type === "okr"
                      ? selected.data.krId || selected.data.objectiveId || null
                      : null
                  }
                  onSelectObjective={handleSelectObjective}
                  onSelectKR={handleSelectKR}
                />
              )}
              {activeTab === "cards" && (
                <CardsTab
                  selectedCard={selected?.type === "card" ? selected.data : null}
                  onSelectCard={handleSelectCard}
                />
              )}
              {activeTab === "members" && (
                <MembersTab
                  selectedMember={selected?.type === "member" ? selected.data : null}
                  onSelectMember={handleSelectMember}
                />
              )}
              {activeTab === "alignments" && (
                <AlignmentsTab
                  selectedAlignment={selected?.type === "alignment" ? selected.data : null}
                  onSelectCard={handleSelectCard}
                  onSelectAlignment={handleSelectAlignment}
                />
              )}
              {activeTab === "tasks" && (
                <TeamTasks
                  selectedTask={selected?.type === "taskItem" ? selected.data : null}
                  onSelectTask={handleSelectTaskItem}
                />
              )}
              {activeTab === "sprint" && (
                <SprintTabEnhanced
                  selectedTask={selected?.type === "task" ? selected.data : null}
                  onSelectTask={handleSelectTask}
                />
              )}
            </div>
          </div>

          {selected && <DetailPanelRouter selected={selected} onClose={handleClose} />}
        </div>

        {/* Persistent Insights Chat */}
        <TeamInsightsChat />
      </div>
    </div>
  );
}
