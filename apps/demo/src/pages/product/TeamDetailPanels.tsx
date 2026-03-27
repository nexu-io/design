import {
  Button,
  DetailPanel,
  DetailPanelCloseButton,
  DetailPanelContent,
  DetailPanelHeader,
  DetailPanelTitle,
  PanelFooter,
  PanelFooterActions,
  TagGroup,
  TagGroupItem,
} from "@nexu-design/ui-web";
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  BarChart3,
  CheckCircle,
  Clock,
  ExternalLink,
  FileText,
  GitPullRequest,
  MessageSquare,
  Send,
  Users,
  X,
} from "lucide-react";
import { useState } from "react";
import {
  type ALIGNMENT_HISTORY,
  type ActivityItem,
  type BIPStep,
  CARD_BIP_FLOWS,
  CARD_FILE_OPS,
  type FileOp,
  type IMCard,
  MEMBER_ACTIVITIES,
  OBJECTIVES,
  SPRINT_TASKS,
  type SprintTask,
  TASK_BOARD,
  TASK_CHANGE_LOGS,
  TEAM_MEMBERS,
  type TaskItem,
  type TeamMember,
} from "./teamData";

// ─── Shared Components ─────────────────────────────────────

function PanelShell({
  title,
  badge,
  badgeColor,
  icon: Icon,
  onClose,
  children,
  footer,
}: {
  title: string;
  badge?: string;
  badgeColor?: string;
  icon: React.ElementType;
  onClose: () => void;
  children: React.ReactNode;
  footer?: React.ReactNode;
}) {
  return (
    <DetailPanel width={400} className="bg-surface-0 animate-slide-in-right">
      <DetailPanelHeader className="items-center shrink-0">
        <div className="flex justify-center items-center w-8 h-8 rounded-lg bg-clone/10">
          <Icon size={14} className="text-clone" />
        </div>
        <div className="flex-1 min-w-0">
          {badge && (
            <span
              className={`text-[9px] font-medium px-1.5 py-0.5 rounded ${
                badgeColor || "bg-clone/10 text-clone"
              }`}
            >
              {badge}
            </span>
          )}
          <DetailPanelTitle className="truncate">{title}</DetailPanelTitle>
        </div>
        <DetailPanelCloseButton
          onClick={onClose}
          srLabel="关闭详情"
          className="hover:bg-surface-3 text-text-muted"
        />
      </DetailPanelHeader>
      <DetailPanelContent className="overflow-y-auto">{children}</DetailPanelContent>
      {footer && <PanelFooter className="shrink-0 px-3 py-3">{footer}</PanelFooter>}
    </DetailPanel>
  );
}

function BIPFlowSection({ steps }: { steps: BIPStep[] }) {
  return (
    <div className="px-4 py-3 border-b border-border">
      <div className="text-[10px] text-text-muted font-medium uppercase tracking-wider mb-2.5">
        BIP 协议流程
      </div>
      <div className="space-y-0">
        {steps.map((step, i) => (
          <div key={i} className="flex gap-2.5">
            <div className="flex flex-col items-center">
              <div
                className={`w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold shrink-0 ${
                  step.status === "done"
                    ? "bg-success text-white"
                    : step.status === "active"
                      ? "bg-warning text-white animate-pulse"
                      : "bg-surface-3 text-text-muted"
                }`}
              >
                {step.status === "done" ? "✓" : step.status === "active" ? "⏳" : i + 1}
              </div>
              {i < steps.length - 1 && (
                <div
                  className={`w-px flex-1 my-0.5 ${
                    step.status === "done" ? "bg-success/30" : "bg-border"
                  }`}
                />
              )}
            </div>
            <div className="flex-1 pb-3 min-w-0">
              <div className="text-[11px] text-text-primary font-medium">{step.label}</div>
              {step.detail && (
                <div className="text-[10px] text-text-muted mt-0.5 font-mono">{step.detail}</div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function FileOpsSection({ ops }: { ops: FileOp[] }) {
  const ACTION_STYLES: Record<string, { color: string; label: string }> = {
    read: { color: "text-info bg-info-subtle", label: "READ" },
    write: { color: "text-clone bg-clone/10", label: "WRITE" },
    create: { color: "text-success bg-success-subtle", label: "CREATE" },
  };

  return (
    <div className="px-4 py-3 border-b border-border">
      <div className="text-[10px] text-text-muted font-medium uppercase tracking-wider mb-2">
        文件操作
      </div>
      <div className="space-y-1.5">
        {ops.map((op, i) => {
          const s = ACTION_STYLES[op.action];
          const parts = op.path.split("/");
          const file = parts.pop()!;
          return (
            <div
              key={i}
              className="flex items-center gap-1.5 p-2 bg-surface-1 border border-border rounded-lg text-[11px]"
            >
              <span className={`px-1 py-0.5 rounded text-[8px] font-bold ${s.color}`}>
                {s.label}
              </span>
              <FileText size={10} className="text-text-muted shrink-0" />
              <span className="font-medium truncate text-text-primary">{file}</span>
              <span className="text-text-muted truncate ml-auto text-[9px] font-mono">
                {parts.join("/")}/
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ActivitySection({
  items,
  title,
}: {
  items: ActivityItem[];
  title?: string;
}) {
  const TYPE_ICONS: Record<string, { icon: React.ElementType; color: string }> = {
    card: { icon: MessageSquare, color: "text-clone" },
    task: { icon: Activity, color: "text-info" },
    alignment: { icon: GitPullRequest, color: "text-warning" },
    session: { icon: MessageSquare, color: "text-success" },
  };

  return (
    <div className="px-4 py-3">
      <div className="text-[10px] text-text-muted font-medium uppercase tracking-wider mb-2">
        {title || "最近活动"}
      </div>
      <div className="space-y-1.5">
        {items.map((item, i) => {
          const t = TYPE_ICONS[item.type];
          return (
            <div
              key={i}
              className="flex items-start gap-2.5 p-2 bg-surface-1 border border-border rounded-lg"
            >
              <t.icon size={12} className={`${t.color} shrink-0 mt-0.5`} />
              <div className="flex-1 min-w-0">
                <div className="text-[11px] text-text-primary">{item.content}</div>
                <div className="text-[9px] text-text-muted mt-0.5">{item.time}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function FollowUpInput({
  placeholder,
  onSend,
}: {
  placeholder: string;
  onSend?: () => void;
}) {
  const [value, setValue] = useState("");
  const handleSend = () => {
    if (!value.trim()) return;
    setValue("");
    onSend?.();
  };
  return (
    <div className="flex gap-2 items-end px-3 py-2 rounded-xl border bg-surface-1 border-border">
      <textarea
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
          }
        }}
        placeholder={placeholder}
        rows={1}
        className="flex-1 bg-transparent text-[12px] text-text-primary placeholder:text-text-muted resize-none focus:outline-none leading-relaxed"
      />
      <Button
        type="button"
        size="inline"
        onClick={handleSend}
        className="p-1.5 bg-accent text-accent-fg rounded-lg shrink-0 hover:bg-accent-hover transition-colors"
      >
        <Send size={12} />
      </Button>
    </div>
  );
}

// ─── Card Detail Panel ─────────────────────────────────────

const CARD_TYPE_LABELS: Record<string, { label: string; color: string }> = {
  summary_report: { label: "站会汇总", color: "bg-clone/10 text-clone" },
  status_query: { label: "状态查询", color: "bg-info-subtle text-info" },
  alignment_request: {
    label: "对齐请求",
    color: "bg-warning-subtle text-warning",
  },
  event_notification: {
    label: "事件通知",
    color: "bg-success-subtle text-success",
  },
  growth_trigger: { label: "裂变触发", color: "bg-accent/10 text-accent" },
};

export function CardDetailPanel({
  card,
  onClose,
}: {
  card: IMCard;
  onClose: () => void;
}) {
  const typeInfo = CARD_TYPE_LABELS[card.type];
  const bipFlow = CARD_BIP_FLOWS[card.id];
  const fileOps = CARD_FILE_OPS[card.id];

  return (
    <PanelShell
      title={
        card.type === "summary_report"
          ? "站会汇总详情"
          : card.type === "status_query"
            ? `${(card as any).target} 任务进度`
            : card.type === "alignment_request"
              ? (card as any).topic
              : card.type === "event_notification"
                ? (card as any).event
                : (card as any).taskTitle
      }
      badge={typeInfo.label}
      badgeColor={typeInfo.color}
      icon={MessageSquare}
      onClose={onClose}
      footer={
        <div className="space-y-2">
          <FollowUpInput placeholder="追问详情、调整排期..." />
          <PanelFooterActions>
            <Button
              type="button"
              size="inline"
              className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-surface-2 border border-border rounded-lg text-[11px] text-text-primary hover:bg-surface-3 transition-colors"
            >
              <ExternalLink size={10} /> 在 Session 中展开
            </Button>
            <Button
              type="button"
              size="inline"
              className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-accent/10 border border-accent/20 rounded-lg text-[11px] text-accent hover:bg-accent/15 transition-colors"
            >
              <ArrowRight size={10} /> 查看相关任务
            </Button>
          </PanelFooterActions>
        </div>
      }
    >
      {/* Card meta */}
      <div className="px-4 py-3 border-b border-border">
        <div className="grid grid-cols-3 gap-3">
          <div className="text-center">
            <div className="text-[11px] text-text-muted">来源</div>
            <div className="text-[12px] font-medium text-text-primary mt-0.5">{card.from}</div>
          </div>
          <div className="text-center">
            <div className="text-[11px] text-text-muted">渠道</div>
            <div className="text-[12px] font-medium text-text-primary mt-0.5">{card.channel}</div>
          </div>
          <div className="text-center">
            <div className="text-[11px] text-text-muted">时间</div>
            <div className="text-[12px] font-medium text-text-primary mt-0.5">{card.time}</div>
          </div>
        </div>
      </div>

      {/* Type-specific summary */}
      <div className="px-4 py-3 border-b border-border">
        <div className="text-[10px] text-text-muted font-medium uppercase tracking-wider mb-2">
          摘要
        </div>
        {card.type === "summary_report" && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-[12px]">
              <span className="text-text-secondary">Sprint 进度</span>
              <span className="font-bold text-clone">{card.progress}%</span>
            </div>
            <div className="h-1.5 bg-surface-3 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full bg-clone"
                style={{ width: `${card.progress}%` }}
              />
            </div>
            <div className="space-y-1">
              {card.members.map((m) => (
                <div key={m.name} className="flex items-center gap-2 text-[11px]">
                  <span>{m.avatar}</span>
                  <span className="font-medium text-text-primary">{m.name}</span>
                  <span className="flex-1 truncate text-text-muted">— {m.summary}</span>
                </div>
              ))}
            </div>
            {card.risks.length > 0 && (
              <div className="p-2 rounded-lg bg-warning-subtle/50">
                {card.risks.map((r, i) => (
                  <div key={i} className="text-[10px] text-warning flex items-start gap-1">
                    <AlertTriangle size={10} className="shrink-0 mt-0.5" /> {r}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
        {card.type === "status_query" && (
          <div className="space-y-2">
            {card.tasks.map((t) => (
              <div key={t.name} className="flex items-center justify-between text-[11px]">
                <span className="text-text-primary">{t.name}</span>
                <span
                  className={t.progress >= 100 ? "text-success font-medium" : "text-text-muted"}
                >
                  {t.progress}%
                </span>
              </div>
            ))}
            {card.note && (
              <div className="p-2 bg-surface-2 rounded-lg text-[10px] text-text-secondary">
                💬 {card.note}
              </div>
            )}
          </div>
        )}
        {card.type === "alignment_request" && (
          <div className="space-y-2">
            <div className="text-[12px] text-text-primary font-medium">{card.topic}</div>
            <div className="text-[11px] text-text-secondary">{card.reason}</div>
            <div className="text-[11px] text-clone">🎯 {card.suggestion}</div>
          </div>
        )}
        {card.type === "event_notification" && (
          <div className="space-y-2">
            <div className="text-[12px] text-text-primary">{card.impact}</div>
            {card.updates.map((u, i) => (
              <div key={i} className="flex items-center gap-1.5 text-[11px] text-text-secondary">
                <div className="w-1 h-1 rounded-full bg-success" /> {u}
              </div>
            ))}
          </div>
        )}
        {card.type === "growth_trigger" && (
          <div className="space-y-2">
            <div className="grid grid-cols-2 gap-2">
              <div className="p-2 text-center rounded-lg bg-success-subtle/50">
                <div className="text-[16px] font-bold text-success">{card.timeSaved}</div>
                <div className="text-[9px] text-text-muted">实际耗时</div>
              </div>
              <div className="p-2 text-center rounded-lg bg-surface-2">
                <div className="text-[16px] font-bold text-text-muted line-through">
                  {card.manualEstimate}
                </div>
                <div className="text-[9px] text-text-muted">手动预估</div>
              </div>
            </div>
            <div className="text-[11px] text-text-secondary">
              💡 本周: {card.weeklyStats.tasks} 任务 · 节省 {card.weeklyStats.hours}h
            </div>
          </div>
        )}
      </div>

      {/* BIP Flow */}
      {bipFlow && <BIPFlowSection steps={bipFlow} />}

      {/* File Ops */}
      {fileOps && fileOps.length > 0 && <FileOpsSection ops={fileOps} />}
    </PanelShell>
  );
}

// ─── Member Detail Panel ───────────────────────────────────

export function MemberDetailPanel({
  member,
  onClose,
}: {
  member: TeamMember;
  onClose: () => void;
}) {
  const tasks = SPRINT_TASKS.filter((t) => t.assignee === member.name);
  const activities = MEMBER_ACTIVITIES[member.name] || [];

  const STATUS_LABELS: Record<string, { label: string; color: string }> = {
    online: { label: "在线", color: "text-success" },
    busy: { label: "忙碌", color: "text-warning" },
    away: { label: "离开", color: "text-text-muted" },
    offline: { label: "离线", color: "text-text-muted" },
  };

  const TASK_STYLES: Record<string, { bg: string; text: string; label: string }> = {
    done: { bg: "bg-success-subtle", text: "text-success", label: "完成" },
    in_progress: { bg: "bg-clone/10", text: "text-clone", label: "进行中" },
    blocked: { bg: "bg-danger-subtle", text: "text-danger", label: "阻塞" },
    todo: { bg: "bg-surface-3", text: "text-text-muted", label: "待开始" },
  };

  const statusInfo = STATUS_LABELS[member.status];

  return (
    <PanelShell
      title={member.name}
      badge={member.role}
      icon={Users}
      onClose={onClose}
      footer={
        <PanelFooterActions>
          <Button
            type="button"
            size="inline"
            className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 bg-accent text-accent-fg rounded-lg text-[11px] font-medium hover:bg-accent-hover transition-colors"
          >
            <MessageSquare size={11} /> 查询进度
          </Button>
          <Button
            type="button"
            size="inline"
            className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 bg-surface-2 border border-border rounded-lg text-[11px] text-text-primary hover:bg-surface-3 transition-colors"
          >
            <GitPullRequest size={11} /> 发起对齐
          </Button>
        </PanelFooterActions>
      }
    >
      {/* Profile header */}
      <div className="px-4 py-4 border-b border-border">
        <div className="flex gap-3 items-center mb-3">
          <div className="relative">
            <div className="flex justify-center items-center w-12 h-12 text-xl rounded-full bg-surface-3">
              {member.avatar}
            </div>
            <div
              className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-surface-0 ${
                member.status === "online"
                  ? "bg-success"
                  : member.status === "busy"
                    ? "bg-warning"
                    : "bg-text-muted"
              }`}
            />
          </div>
          <div>
            <div className="flex gap-2 items-center">
              <span className="text-[15px] font-bold text-text-primary">{member.name}</span>
              <span className="text-[10px] px-1.5 py-0.5 bg-clone/10 text-clone rounded font-medium">
                Lv.{member.level}
              </span>
              <span className={`text-[10px] ${statusInfo.color}`}>{statusInfo.label}</span>
            </div>
            <div className="text-[12px] text-text-secondary mt-0.5">
              {member.role} · {member.channel}
            </div>
          </div>
        </div>
        <div className="grid grid-cols-4 gap-2">
          {[
            {
              label: "进行中",
              value: member.tasksInProgress,
              color: "text-text-primary",
            },
            {
              label: "已完成",
              value: member.tasksCompleted,
              color: "text-success",
            },
            {
              label: "默契度",
              value: `${member.alignmentRate}%`,
              color: "text-clone",
            },
            {
              label: "最近活跃",
              value: member.lastActive,
              color: "text-text-muted",
              small: true,
            },
          ].map((s) => (
            <div key={s.label} className="p-2 text-center rounded-lg bg-surface-1">
              <div className={`text-[${(s as any).small ? "10" : "14"}px] font-bold ${s.color}`}>
                {s.value}
              </div>
              <div className="text-[8px] text-text-muted mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Current tasks */}
      <div className="px-4 py-3 border-b border-border">
        <div className="text-[10px] text-text-muted font-medium uppercase tracking-wider mb-2">
          当前任务 ({tasks.length})
        </div>
        <div className="space-y-1.5">
          {tasks.map((task) => {
            const st = TASK_STYLES[task.status];
            return (
              <div
                key={task.id}
                className="flex gap-2 items-center p-2 rounded-lg border bg-surface-1 border-border"
              >
                <span className={`text-[8px] px-1 py-0.5 rounded font-bold ${st.bg} ${st.text}`}>
                  {st.label}
                </span>
                <span className="text-[11px] text-text-primary flex-1 truncate">{task.title}</span>
                <div className="overflow-hidden w-12 h-1 rounded-full bg-surface-3">
                  <div
                    className={`h-full rounded-full ${
                      task.progress >= 100 ? "bg-success" : "bg-clone"
                    }`}
                    style={{ width: `${task.progress}%` }}
                  />
                </div>
                <span className="text-[9px] text-text-muted tabular-nums">{task.progress}%</span>
              </div>
            );
          })}
          {tasks.length === 0 && (
            <div className="text-[11px] text-text-muted py-2 text-center">暂无任务</div>
          )}
        </div>
      </div>

      {/* Recent activities */}
      <ActivitySection items={activities} />
    </PanelShell>
  );
}

// ─── Alignment Detail Panel ────────────────────────────────

export function AlignmentDetailPanel({
  alignment,
  onClose,
}: {
  alignment: (typeof ALIGNMENT_HISTORY)[number];
  onClose: () => void;
}) {
  return (
    <PanelShell
      title={alignment.topic}
      badge={alignment.status === "accepted" ? "已同意" : "已拒绝"}
      badgeColor={
        alignment.status === "accepted"
          ? "bg-success-subtle text-success"
          : "bg-danger-subtle text-danger"
      }
      icon={GitPullRequest}
      onClose={onClose}
      footer={
        <PanelFooterActions>
          <Button
            type="button"
            size="inline"
            className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-surface-2 border border-border rounded-lg text-[11px] text-text-primary hover:bg-surface-3 transition-colors"
          >
            <ExternalLink size={10} /> 查看相关对话
          </Button>
          <Button
            type="button"
            size="inline"
            className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-accent/10 border border-accent/20 rounded-lg text-[11px] text-accent hover:bg-accent/15 transition-colors"
          >
            <GitPullRequest size={10} /> 重新发起
          </Button>
        </PanelFooterActions>
      }
    >
      {/* Alignment summary */}
      <div className="px-4 py-3 border-b border-border">
        <div className="flex gap-3 items-center mb-3">
          <div className="flex justify-center items-center w-8 h-8 text-sm rounded-full bg-surface-3">
            {alignment.fromAvatar}
          </div>
          <div>
            <div className="text-[12px] font-medium text-text-primary">
              来自 {alignment.from}的分身
            </div>
            <div className="text-[10px] text-text-muted">{alignment.time}</div>
          </div>
        </div>
        <div className="space-y-2">
          <div>
            <div className="text-[10px] text-text-muted mb-0.5">话题</div>
            <div className="text-[13px] text-text-primary font-medium">{alignment.topic}</div>
          </div>
          <div className="p-2.5 bg-surface-1 border border-border rounded-lg">
            <div className="text-[10px] text-text-muted mb-0.5">📎 原因</div>
            <div className="text-[11px] text-text-secondary">{alignment.reason}</div>
          </div>
        </div>
      </div>

      {/* Decision */}
      <div className="px-4 py-3 border-b border-border">
        <div className="text-[10px] text-text-muted font-medium uppercase tracking-wider mb-2">
          处理结果
        </div>
        <div
          className={`p-3 rounded-lg flex items-start gap-2.5 ${
            alignment.status === "accepted" ? "bg-success-subtle/50" : "bg-danger-subtle/50"
          }`}
        >
          {alignment.status === "accepted" ? (
            <CheckCircle size={14} className="text-success shrink-0 mt-0.5" />
          ) : (
            <X size={14} className="text-danger shrink-0 mt-0.5" />
          )}
          <div>
            <div
              className={`text-[12px] font-medium ${
                alignment.status === "accepted" ? "text-success" : "text-danger"
              }`}
            >
              {alignment.status === "accepted" ? "已同意" : "已拒绝"}
            </div>
            <div className="text-[11px] text-text-secondary mt-0.5">{alignment.response}</div>
          </div>
        </div>
      </div>

      {/* BIP flow */}
      <BIPFlowSection
        steps={[
          { label: `${alignment.from}分身检测到对齐需求`, status: "done" },
          { label: "生成对齐请求卡片", status: "done" },
          { label: "推送 IM 卡片到群", status: "done" },
          { label: "等待你的响应", status: "done", detail: alignment.time },
          {
            label: alignment.status === "accepted" ? "你同意了调整" : "你拒绝了调整",
            status: "done",
            detail: alignment.response,
          },
          { label: "通知发起方结果", status: "done" },
        ]}
      />

      {/* Impact */}
      <div className="px-4 py-3">
        <div className="text-[10px] text-text-muted font-medium uppercase tracking-wider mb-2">
          影响范围
        </div>
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 p-2 bg-surface-1 border border-border rounded-lg text-[11px]">
            <Users size={11} className="text-text-muted" />
            <span className="text-text-secondary">涉及成员</span>
            <span className="ml-auto font-medium text-text-primary">{alignment.from}、你</span>
          </div>
          <div className="flex items-center gap-2 p-2 bg-surface-1 border border-border rounded-lg text-[11px]">
            <FileText size={11} className="text-text-muted" />
            <span className="text-text-secondary">相关文件</span>
            <span className="text-text-primary font-medium ml-auto font-mono text-[10px]">
              team/decisions/
            </span>
          </div>
        </div>
      </div>
    </PanelShell>
  );
}

// ─── Task Detail Panel ─────────────────────────────────────

export function TaskDetailPanel({
  task,
  onClose,
}: {
  task: SprintTask;
  onClose: () => void;
}) {
  const member = TEAM_MEMBERS.find((m) => m.name === task.assignee);
  const changeLogs = TASK_CHANGE_LOGS[task.id] || [];
  const downstream = SPRINT_TASKS.filter((t) => t.dependency === task.id);
  const upstream = task.dependency ? SPRINT_TASKS.find((t) => t.id === task.dependency) : null;

  const TASK_STYLES: Record<string, { bg: string; text: string; label: string }> = {
    done: { bg: "bg-success-subtle", text: "text-success", label: "已完成" },
    in_progress: { bg: "bg-clone/10", text: "text-clone", label: "进行中" },
    blocked: { bg: "bg-danger-subtle", text: "text-danger", label: "阻塞中" },
    todo: { bg: "bg-surface-3", text: "text-text-muted", label: "待开始" },
  };

  const st = TASK_STYLES[task.status];

  return (
    <PanelShell
      title={task.title}
      badge={`${task.id} · ${st.label}`}
      badgeColor={`${st.bg} ${st.text}`}
      icon={BarChart3}
      onClose={onClose}
      footer={
        <div className="space-y-2">
          <FollowUpInput placeholder="调整排期、追问进度、分配子任务..." />
          <PanelFooterActions>
            <Button
              type="button"
              size="inline"
              className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-accent text-accent-fg rounded-lg text-[11px] font-medium hover:bg-accent-hover transition-colors"
            >
              <MessageSquare size={10} /> 查询详细进度
            </Button>
          </PanelFooterActions>
        </div>
      }
    >
      {/* Task overview */}
      <div className="px-4 py-3 border-b border-border">
        <div className="grid grid-cols-2 gap-3 mb-3">
          <div className="p-2.5 bg-surface-1 rounded-lg">
            <div className="text-[10px] text-text-muted">进度</div>
            <div className="flex gap-2 items-center mt-1">
              <div className="flex-1 h-1.5 bg-surface-3 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${
                    task.progress >= 100 ? "bg-success" : "bg-clone"
                  }`}
                  style={{ width: `${task.progress}%` }}
                />
              </div>
              <span className="text-[12px] font-bold text-text-primary tabular-nums">
                {task.progress}%
              </span>
            </div>
          </div>
          <div className="p-2.5 bg-surface-1 rounded-lg">
            <div className="text-[10px] text-text-muted">状态</div>
            <span
              className={`text-[11px] font-medium mt-1 inline-block px-2 py-0.5 rounded ${st.bg} ${st.text}`}
            >
              {st.label}
            </span>
          </div>
        </div>

        {/* Assignee */}
        {member && (
          <div className="flex items-center gap-2.5 p-2.5 bg-surface-1 border border-border rounded-lg">
            <div className="flex justify-center items-center w-7 h-7 text-sm rounded-full bg-surface-3">
              {member.avatar}
            </div>
            <div className="flex-1">
              <div className="text-[12px] font-medium text-text-primary">{member.name}</div>
              <div className="text-[10px] text-text-muted">
                {member.role} · {member.channel}
              </div>
            </div>
            <span className="text-[10px] text-clone font-medium">Lv.{member.level}</span>
          </div>
        )}
      </div>

      {/* Dependencies */}
      {(upstream || downstream.length > 0) && (
        <div className="px-4 py-3 border-b border-border">
          <div className="text-[10px] text-text-muted font-medium uppercase tracking-wider mb-2">
            依赖关系
          </div>
          <div className="space-y-1.5">
            {upstream && (
              <div className="flex items-center gap-2 p-2 bg-surface-1 border border-border rounded-lg text-[11px]">
                <span className="text-[8px] px-1 py-0.5 bg-info-subtle text-info rounded font-bold">
                  上游
                </span>
                <span className="font-mono text-text-muted">{upstream.id}</span>
                <span className="flex-1 text-text-primary">{upstream.title}</span>
                <span className="text-text-muted">{upstream.assignee}</span>
              </div>
            )}
            {downstream.map((d) => (
              <div
                key={d.id}
                className="flex items-center gap-2 p-2 bg-surface-1 border border-border rounded-lg text-[11px]"
              >
                <span className="text-[8px] px-1 py-0.5 bg-warning-subtle text-warning rounded font-bold">
                  下游
                </span>
                <span className="font-mono text-text-muted">{d.id}</span>
                <span className="flex-1 text-text-primary">{d.title}</span>
                <span className="text-text-muted">{d.assignee}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Change log */}
      {changeLogs.length > 0 && (
        <div className="px-4 py-3 border-b border-border">
          <div className="text-[10px] text-text-muted font-medium uppercase tracking-wider mb-2">
            变更记录
          </div>
          <div className="space-y-1.5">
            {changeLogs.map((log, i) => (
              <div
                key={i}
                className="flex items-center gap-2 p-2 bg-surface-1 border border-border rounded-lg text-[10px]"
              >
                <Clock size={10} className="text-text-muted shrink-0" />
                <span className="text-text-muted">{log.time}</span>
                <span className="flex-1 text-text-secondary">
                  {log.from} → <span className="font-medium text-text-primary">{log.to}</span>
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Related files */}
      <div className="px-4 py-3">
        <div className="text-[10px] text-text-muted font-medium uppercase tracking-wider mb-2">
          相关文件
        </div>
        <div className="space-y-1.5">
          <div className="flex items-center gap-1.5 p-2 bg-surface-1 border border-border rounded-lg text-[11px]">
            <FileText size={10} className="text-text-muted" />
            <span className="font-medium text-text-primary">sprint.md</span>
            <span className="text-text-muted ml-auto font-mono text-[9px]">team/</span>
          </div>
          {task.status === "blocked" && upstream && (
            <div className="flex items-center gap-1.5 p-2 bg-surface-1 border border-border rounded-lg text-[11px]">
              <FileText size={10} className="text-warning" />
              <span className="font-medium text-text-primary">gateway-priority.md</span>
              <span className="text-text-muted ml-auto font-mono text-[9px]">team/decisions/</span>
            </div>
          )}
        </div>
      </div>
    </PanelShell>
  );
}

// ─── Stats Detail Panel ────────────────────────────────────

const STAT_PANEL_CONFIG: Record<string, { title: string; icon: typeof BarChart3 }> = {
  okr: { title: "OKR 概览", icon: Activity },
  online: { title: "分身在线状态", icon: Users },
  cards: { title: "今日任务流", icon: MessageSquare },
  alignments: { title: "待对齐请求", icon: GitPullRequest },
  tasks: { title: "活跃任务", icon: CheckCircle },
  sprint: { title: "Sprint 进度", icon: BarChart3 },
};

export function StatsDetailPanel({
  statId,
  onClose,
}: {
  statId: string;
  onClose: () => void;
}) {
  const cfg = STAT_PANEL_CONFIG[statId] || STAT_PANEL_CONFIG.sprint;
  return (
    <PanelShell title={cfg.title} icon={cfg.icon} onClose={onClose}>
      {statId === "online" && (
        <div className="px-4 py-3">
          <div className="text-[10px] text-text-muted font-medium uppercase tracking-wider mb-2">
            成员状态
          </div>
          <div className="space-y-1.5">
            {TEAM_MEMBERS.map((m) => (
              <div
                key={m.name}
                className="flex items-center gap-2.5 p-2.5 bg-surface-1 border border-border rounded-lg"
              >
                <div className="relative">
                  <div className="flex justify-center items-center w-7 h-7 text-sm rounded-full bg-surface-3">
                    {m.avatar}
                  </div>
                  <div
                    className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-surface-1 ${
                      m.status === "online"
                        ? "bg-success"
                        : m.status === "busy"
                          ? "bg-warning"
                          : "bg-text-muted"
                    }`}
                  />
                </div>
                <div className="flex-1">
                  <div className="text-[12px] font-medium text-text-primary">{m.name}</div>
                  <div className="text-[10px] text-text-muted">{m.role}</div>
                </div>
                <span
                  className={`text-[10px] ${
                    m.status === "online"
                      ? "text-success"
                      : m.status === "busy"
                        ? "text-warning"
                        : "text-text-muted"
                  }`}
                >
                  {m.status === "online" ? "在线" : m.status === "busy" ? "忙碌" : "离开"}
                </span>
                <span className="text-[9px] text-text-muted">{m.lastActive}</span>
              </div>
            ))}
          </div>
        </div>
      )}
      {statId === "cards" && (
        <div className="px-4 py-3">
          <div className="text-[10px] text-text-muted font-medium uppercase tracking-wider mb-2">
            今日卡片分布
          </div>
          <div className="space-y-2">
            {[
              { type: "站会汇总", count: 1, color: "bg-clone" },
              { type: "状态查询", count: 1, color: "bg-info" },
              { type: "事件通知", count: 1, color: "bg-success" },
              { type: "对齐请求", count: 1, color: "bg-warning" },
              { type: "裂变触发", count: 1, color: "bg-accent" },
            ].map((c) => (
              <div key={c.type} className="flex gap-2 items-center">
                <div className={`w-2 h-2 rounded-full ${c.color}`} />
                <span className="text-[11px] text-text-primary flex-1">{c.type}</span>
                <span className="text-[12px] font-bold text-text-primary tabular-nums">
                  {c.count}
                </span>
              </div>
            ))}
          </div>
          <div className="mt-3 p-2.5 bg-surface-1 border border-border rounded-lg">
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-text-muted">未读</span>
              <span className="font-bold text-warning">2</span>
            </div>
            <div className="flex items-center justify-between text-[11px] mt-1">
              <span className="text-text-muted">已读</span>
              <span className="font-bold text-success">3</span>
            </div>
          </div>
        </div>
      )}
      {statId === "alignments" && (
        <div className="px-4 py-3">
          <div className="text-[10px] text-text-muted font-medium uppercase tracking-wider mb-2">
            待处理
          </div>
          <div className="p-3 rounded-lg border bg-warning-subtle/30 border-warning/20">
            <div className="text-[12px] font-medium text-text-primary">Gateway 重构排期提前</div>
            <div className="text-[10px] text-text-secondary mt-1">
              来自张三的分身 · 紧急程度：高
            </div>
            <div className="flex gap-2 items-center mt-2">
              <Button
                type="button"
                size="inline"
                className="px-2.5 py-1 bg-success-subtle text-success rounded-lg text-[10px] font-medium"
              >
                ✅ 同意
              </Button>
              <Button
                type="button"
                size="inline"
                className="px-2.5 py-1 bg-danger-subtle text-danger rounded-lg text-[10px]"
              >
                ❌ 拒绝
              </Button>
            </div>
          </div>
          <div className="text-[10px] text-text-muted font-medium uppercase tracking-wider mb-2 mt-4">
            本周统计
          </div>
          <div className="grid grid-cols-3 gap-2">
            <div className="p-2 text-center rounded-lg bg-surface-1">
              <div className="text-[14px] font-bold text-success">3</div>
              <div className="text-[9px] text-text-muted">已同意</div>
            </div>
            <div className="p-2 text-center rounded-lg bg-surface-1">
              <div className="text-[14px] font-bold text-danger">1</div>
              <div className="text-[9px] text-text-muted">已拒绝</div>
            </div>
            <div className="p-2 text-center rounded-lg bg-surface-1">
              <div className="text-[14px] font-bold text-warning">1</div>
              <div className="text-[9px] text-text-muted">待处理</div>
            </div>
          </div>
        </div>
      )}
      {statId === "sprint" && (
        <div className="px-4 py-3">
          <div className="text-[10px] text-text-muted font-medium uppercase tracking-wider mb-2">
            Sprint 3 概览
          </div>
          <div className="mb-3">
            <div className="flex items-center justify-between text-[12px] mb-1">
              <span className="text-text-secondary">整体进度</span>
              <span className="font-bold text-clone">58%</span>
            </div>
            <div className="overflow-hidden h-2 rounded-full bg-surface-3">
              <div className="h-full rounded-full bg-clone" style={{ width: "58%" }} />
            </div>
            <div className="flex items-center justify-between text-[10px] text-text-muted mt-1">
              <span>02-17 → 03-02</span>
              <span>剩余 7 天</span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {[
              {
                label: "已完成",
                value: SPRINT_TASKS.filter((t) => t.status === "done").length,
                color: "text-success",
              },
              {
                label: "进行中",
                value: SPRINT_TASKS.filter((t) => t.status === "in_progress").length,
                color: "text-clone",
              },
              {
                label: "阻塞",
                value: SPRINT_TASKS.filter((t) => t.status === "blocked").length,
                color: "text-danger",
              },
              {
                label: "待开始",
                value: SPRINT_TASKS.filter((t) => t.status === "todo").length,
                color: "text-text-muted",
              },
            ].map((s) => (
              <div key={s.label} className="text-center p-2.5 bg-surface-1 rounded-lg">
                <div className={`text-[16px] font-bold ${s.color}`}>{s.value}</div>
                <div className="text-[9px] text-text-muted">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      )}
      {statId === "okr" &&
        (() => {
          const okrProgress = Math.round(
            OBJECTIVES.reduce((s, o) => s + o.progress, 0) / OBJECTIVES.length,
          );
          const atRisk = OBJECTIVES.filter((o) => o.status === "at_risk" || o.status === "behind");
          const onTrack = OBJECTIVES.filter((o) => o.status === "on_track");
          const achieved = OBJECTIVES.filter((o) => o.status === "achieved");
          return (
            <div className="px-4 py-3">
              <div className="mb-3">
                <div className="flex items-center justify-between text-[12px] mb-1">
                  <span className="text-text-secondary">整体 OKR 完成度</span>
                  <span className="font-bold text-accent">{okrProgress}%</span>
                </div>
                <div className="overflow-hidden h-2 rounded-full bg-surface-3">
                  <div
                    className="h-full rounded-full bg-accent"
                    style={{ width: `${okrProgress}%` }}
                  />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2 mb-3">
                <div className="text-center p-2.5 bg-surface-1 rounded-lg">
                  <div className="text-[16px] font-bold text-success">
                    {achieved.length + onTrack.length}
                  </div>
                  <div className="text-[9px] text-text-muted">正常</div>
                </div>
                <div className="text-center p-2.5 bg-surface-1 rounded-lg">
                  <div className="text-[16px] font-bold text-warning">
                    {atRisk.filter((o) => o.status === "at_risk").length}
                  </div>
                  <div className="text-[9px] text-text-muted">有风险</div>
                </div>
                <div className="text-center p-2.5 bg-surface-1 rounded-lg">
                  <div className="text-[16px] font-bold text-danger">
                    {atRisk.filter((o) => o.status === "behind").length}
                  </div>
                  <div className="text-[9px] text-text-muted">落后</div>
                </div>
              </div>
              <div className="text-[10px] text-text-muted font-medium uppercase tracking-wider mb-2">
                各目标进度
              </div>
              <div className="space-y-2">
                {OBJECTIVES.map((o) => {
                  const st =
                    o.status === "on_track"
                      ? "text-success"
                      : o.status === "at_risk"
                        ? "text-warning"
                        : o.status === "behind"
                          ? "text-danger"
                          : "text-success";
                  return (
                    <div key={o.id} className="p-2.5 bg-surface-1 border border-border rounded-lg">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[11px] font-medium text-text-primary truncate flex-1">
                          {o.title}
                        </span>
                        <span className={`text-[10px] font-bold ml-2 ${st}`}>{o.progress}%</span>
                      </div>
                      <div className="overflow-hidden h-1 rounded-full bg-surface-3">
                        <div
                          className={`h-full rounded-full ${o.status === "on_track" ? "bg-success" : o.status === "at_risk" ? "bg-warning" : o.status === "behind" ? "bg-danger" : "bg-success"}`}
                          style={{ width: `${o.progress}%` }}
                        />
                      </div>
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-[9px] text-text-muted">{o.owner}</span>
                        <span className="text-[9px] text-text-muted">
                          {o.keyResults.length} KRs
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })()}
      {statId === "tasks" &&
        (() => {
          const inProgress = TASK_BOARD.filter((t) => t.status === "in_progress");
          const todo = TASK_BOARD.filter((t) => t.status === "todo");
          const done = TASK_BOARD.filter((t) => t.status === "done");
          const agentTasks = TASK_BOARD.filter((t) => t.executor === "agent");
          const activeTasks = [...inProgress, ...todo];
          return (
            <div className="px-4 py-3">
              <div className="grid grid-cols-2 gap-2 mb-3">
                <div className="text-center p-2.5 bg-surface-1 rounded-lg">
                  <div className="text-[16px] font-bold text-clone">{inProgress.length}</div>
                  <div className="text-[9px] text-text-muted">进行中</div>
                </div>
                <div className="text-center p-2.5 bg-surface-1 rounded-lg">
                  <div className="text-[16px] font-bold text-warning">{todo.length}</div>
                  <div className="text-[9px] text-text-muted">待开始</div>
                </div>
                <div className="text-center p-2.5 bg-surface-1 rounded-lg">
                  <div className="text-[16px] font-bold text-success">{done.length}</div>
                  <div className="text-[9px] text-text-muted">已完成</div>
                </div>
                <div className="text-center p-2.5 bg-surface-1 rounded-lg">
                  <div className="text-[16px] font-bold text-accent">{agentTasks.length}</div>
                  <div className="text-[9px] text-text-muted">Agent 执行</div>
                </div>
              </div>
              <div className="text-[10px] text-text-muted font-medium uppercase tracking-wider mb-2">
                活跃任务
              </div>
              <div className="space-y-1.5">
                {activeTasks.slice(0, 6).map((t) => {
                  const prioColor =
                    t.priority === "urgent"
                      ? "text-danger"
                      : t.priority === "high"
                        ? "text-warning"
                        : "text-text-muted";
                  const statusDot =
                    t.status === "in_progress" ? "bg-clone animate-pulse" : "bg-surface-4";
                  const execIcon =
                    t.executor === "agent" ? "🤖" : t.executor === "hybrid" ? "🤝" : "👤";
                  return (
                    <div
                      key={t.id}
                      className="flex items-center gap-2 p-2 bg-surface-1 border border-border rounded-lg"
                    >
                      <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${statusDot}`} />
                      <div className="flex-1 min-w-0">
                        <div className="text-[11px] font-medium text-text-primary truncate">
                          {t.title}
                        </div>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className={`text-[9px] ${prioColor}`}>{t.priority}</span>
                          <span className="text-[9px] text-text-muted">{t.assignee}</span>
                        </div>
                      </div>
                      <span className="text-[10px] shrink-0">{execIcon}</span>
                      {t.progress > 0 && (
                        <span className="text-[9px] text-text-muted tabular-nums shrink-0">
                          {t.progress}%
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })()}
    </PanelShell>
  );
}

// ─── OKR Detail Panel ──────────────────────────────────────

const OKR_STATUS_INFO: Record<string, { label: string; color: string }> = {
  on_track: { label: "On Track", color: "bg-success-subtle text-success" },
  at_risk: { label: "At Risk", color: "bg-warning-subtle text-warning" },
  behind: { label: "Behind", color: "bg-danger-subtle text-danger" },
  achieved: { label: "Achieved", color: "bg-success-subtle text-success" },
};

export function OKRDetailPanel({
  objectiveId,
  krId,
  onClose,
}: {
  objectiveId?: string;
  krId?: string;
  onClose: () => void;
}) {
  const objective = OBJECTIVES.find(
    (o) => o.id === objectiveId || o.keyResults.some((kr) => kr.id === krId),
  );
  const keyResult = objective?.keyResults.find((kr) => kr.id === krId);

  if (!objective) return null;

  const statusInfo = OKR_STATUS_INFO[objective.status];

  return (
    <PanelShell
      title={keyResult ? keyResult.title : objective.title}
      badge={
        keyResult
          ? `${keyResult.id} · ${keyResult.progress}%`
          : `${objective.id} · ${statusInfo.label}`
      }
      badgeColor={
        keyResult
          ? keyResult.progress >= 80
            ? "bg-success-subtle text-success"
            : keyResult.progress >= 50
              ? "bg-clone/10 text-clone"
              : "bg-warning-subtle text-warning"
          : statusInfo.color
      }
      icon={Activity}
      onClose={onClose}
      footer={
        <div className="flex gap-2 items-center">
          <Button
            type="button"
            size="inline"
            className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-accent text-accent-fg rounded-lg text-[11px] font-medium hover:bg-accent-hover transition-colors"
          >
            <MessageSquare size={10} /> 讨论 OKR
          </Button>
          <Button
            type="button"
            size="inline"
            className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-surface-2 border border-border rounded-lg text-[11px] text-text-primary hover:bg-surface-3 transition-colors"
          >
            <ExternalLink size={10} /> 编辑目标
          </Button>
        </div>
      }
    >
      {/* Objective overview */}
      <div className="px-4 py-3 border-b border-border">
        <div className="flex gap-2 items-center mb-2">
          <span className="text-[10px] font-mono text-text-muted">{objective.id}</span>
          <span className={`text-[9px] font-medium px-1.5 py-0.5 rounded-full ${statusInfo.color}`}>
            {statusInfo.label}
          </span>
          <span className="text-[10px] text-text-muted">{objective.quarter}</span>
        </div>
        <div className="text-[12px] text-text-primary font-medium leading-snug">
          {objective.title}
        </div>
        <div className="text-[11px] text-text-muted mt-1">{objective.description}</div>

        <div className="mt-3">
          <div className="flex items-center justify-between text-[10px] mb-1">
            <span className="text-text-muted">整体进度</span>
            <span className="font-bold text-text-primary">{objective.progress}%</span>
          </div>
          <div className="overflow-hidden h-2 rounded-full bg-surface-3">
            <div
              className={`h-full rounded-full ${
                objective.progress >= 80
                  ? "bg-success"
                  : objective.progress >= 50
                    ? "bg-clone"
                    : "bg-warning"
              }`}
              style={{ width: `${objective.progress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Key Results list */}
      <div className="px-4 py-3 border-b border-border">
        <div className="text-[10px] text-text-muted font-medium uppercase tracking-wider mb-2">
          Key Results ({objective.keyResults.length})
        </div>
        <div className="space-y-2">
          {objective.keyResults.map((kr) => {
            const isHighlighted = kr.id === krId;
            return (
              <div
                key={kr.id}
                className={`p-2.5 rounded-lg border transition-colors ${
                  isHighlighted ? "border-accent/40 bg-accent/5" : "border-border bg-surface-1"
                }`}
              >
                <div className="flex justify-between items-center mb-1">
                  <span className="text-[11px] text-text-primary font-medium">{kr.title}</span>
                  <span
                    className={`text-[10px] font-bold ${
                      kr.progress >= 100
                        ? "text-success"
                        : kr.progress >= 50
                          ? "text-clone"
                          : "text-warning"
                    }`}
                  >
                    {kr.progress}%
                  </span>
                </div>
                <div className="overflow-hidden mb-1 h-1 rounded-full bg-surface-3">
                  <div
                    className={`h-full rounded-full ${
                      kr.progress >= 100
                        ? "bg-success"
                        : kr.progress >= 50
                          ? "bg-clone"
                          : "bg-warning"
                    }`}
                    style={{ width: `${kr.progress}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-[9px] text-text-muted">
                  <span>
                    {kr.current} / {kr.target}
                  </span>
                  <span>{kr.owner}</span>
                </div>
                {kr.linkedTasks.length > 0 && (
                  <div className="flex gap-1 mt-1.5">
                    {kr.linkedTasks.map((tid) => {
                      const task = SPRINT_TASKS.find((t) => t.id === tid);
                      return task ? (
                        <span
                          key={tid}
                          className="text-[8px] px-1 py-0.5 bg-surface-2 text-text-muted rounded"
                        >
                          {tid} {task.title}
                        </span>
                      ) : null;
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Owner & tags */}
      <div className="px-4 py-3">
        <div className="text-[10px] text-text-muted font-medium uppercase tracking-wider mb-2">
          信息
        </div>
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 p-2 bg-surface-1 border border-border rounded-lg text-[11px]">
            <Users size={11} className="text-text-muted" />
            <span className="text-text-secondary">负责人</span>
            <span className="ml-auto font-medium text-text-primary">
              {objective.ownerAvatar} {objective.owner}
            </span>
          </div>
          <div className="flex items-center gap-2 p-2 bg-surface-1 border border-border rounded-lg text-[11px]">
            <Activity size={11} className="text-text-muted" />
            <span className="text-text-secondary">达标 KR</span>
            <span className="ml-auto font-medium text-text-primary">
              {objective.keyResults.filter((kr) => kr.progress >= 100).length}/
              {objective.keyResults.length}
            </span>
          </div>
        </div>
        <TagGroup className="mt-2 gap-1">
          {objective.tags.map((t) => (
            <TagGroupItem key={t} size="xs" radius="md" className="bg-surface-2 text-text-muted">
              {t}
            </TagGroupItem>
          ))}
        </TagGroup>
      </div>
    </PanelShell>
  );
}

// ─── Task Item Detail Panel ─────────────────────────────────

const TASK_STATUS_MAP: Record<string, { bg: string; text: string; label: string }> = {
  backlog: { bg: "bg-surface-3", text: "text-text-muted", label: "待规划" },
  todo: { bg: "bg-info-subtle", text: "text-info", label: "待开始" },
  in_progress: { bg: "bg-clone/10", text: "text-clone", label: "进行中" },
  done: { bg: "bg-success-subtle", text: "text-success", label: "已完成" },
  archived: { bg: "bg-surface-3", text: "text-text-muted", label: "已归档" },
};

const PRIORITY_MAP: Record<string, { text: string; label: string }> = {
  urgent: { text: "text-danger", label: "紧急" },
  high: { text: "text-warning", label: "高" },
  medium: { text: "text-info", label: "中" },
  low: { text: "text-text-muted", label: "低" },
};

const EXECUTOR_MAP: Record<string, { label: string; emoji: string }> = {
  human: { label: "人工执行", emoji: "👤" },
  agent: { label: "Agent 执行", emoji: "🤖" },
  hybrid: { label: "人 + Agent", emoji: "🤝" },
};

export function TaskItemDetailPanel({
  task,
  onClose,
}: {
  task: TaskItem;
  onClose: () => void;
}) {
  const st = TASK_STATUS_MAP[task.status];
  const pr = PRIORITY_MAP[task.priority];
  const ex = EXECUTOR_MAP[task.executor];
  const member = TEAM_MEMBERS.find((m) => m.name === task.assignee);
  const deps = task.dependencies ? TASK_BOARD.filter((t) => task.dependencies?.includes(t.id)) : [];
  const dependents = TASK_BOARD.filter((t) => t.dependencies?.includes(task.id));
  const subtasksDone = task.subtasks?.filter((s) => s.done).length ?? 0;
  const subtasksTotal = task.subtasks?.length ?? 0;

  return (
    <PanelShell
      title={task.title}
      badge={`${task.id} · ${st.label}`}
      badgeColor={`${st.bg} ${st.text}`}
      icon={BarChart3}
      onClose={onClose}
      footer={
        <div className="space-y-2">
          <FollowUpInput placeholder="追问进度、委托 Agent、调整排期..." />
          <div className="flex gap-2 items-center">
            {task.status === "in_progress" && (
              <Button
                type="button"
                size="inline"
                className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-success text-white rounded-lg text-[11px] font-medium hover:bg-success/90 transition-colors"
              >
                <CheckCircle size={10} /> 标记完成
              </Button>
            )}
            {task.executor !== "agent" && (
              <Button
                type="button"
                size="inline"
                className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-clone/10 text-clone rounded-lg text-[11px] font-medium hover:bg-clone/20 transition-colors"
              >
                🤖 委托给 Agent
              </Button>
            )}
          </div>
        </div>
      }
    >
      {/* Overview */}
      <div className="px-4 py-3 border-b border-border">
        <div className="grid grid-cols-3 gap-2 mb-3">
          <div className="p-2 bg-surface-1 rounded-lg text-center">
            <div className="text-[9px] text-text-muted">状态</div>
            <span
              className={`text-[11px] font-medium mt-0.5 inline-block px-1.5 py-0.5 rounded ${st.bg} ${st.text}`}
            >
              {st.label}
            </span>
          </div>
          <div className="p-2 bg-surface-1 rounded-lg text-center">
            <div className="text-[9px] text-text-muted">优先级</div>
            <span className={`text-[11px] font-medium mt-0.5 ${pr.text}`}>{pr.label}</span>
          </div>
          <div className="p-2 bg-surface-1 rounded-lg text-center">
            <div className="text-[9px] text-text-muted">执行方式</div>
            <span className="text-[11px] font-medium mt-0.5 text-text-primary">
              {ex.emoji} {ex.label}
            </span>
          </div>
        </div>

        {/* Progress */}
        <div className="p-2.5 bg-surface-1 rounded-lg mb-3">
          <div className="flex justify-between items-center mb-1">
            <span className="text-[10px] text-text-muted">
              进度 {subtasksTotal > 0 && `(${subtasksDone}/${subtasksTotal} 子任务)`}
            </span>
            <span className="text-[12px] font-bold text-text-primary tabular-nums">
              {task.progress}%
            </span>
          </div>
          <div className="h-1.5 bg-surface-3 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full ${task.progress >= 100 ? "bg-success" : "bg-clone"}`}
              style={{ width: `${task.progress}%` }}
            />
          </div>
        </div>

        {/* Assignee */}
        {member && (
          <div className="flex items-center gap-2.5 p-2.5 bg-surface-1 border border-border rounded-lg">
            <div className="flex justify-center items-center w-7 h-7 text-sm rounded-full bg-surface-3">
              {member.avatar}
            </div>
            <div className="flex-1">
              <div className="text-[12px] font-medium text-text-primary">{member.name}</div>
              <div className="text-[10px] text-text-muted">
                {member.role} · Lv.{member.level}
              </div>
            </div>
            <span className="text-[10px] text-text-muted">{member.channel}</span>
          </div>
        )}
      </div>

      {/* Description */}
      {task.description && (
        <div className="px-4 py-3 border-b border-border">
          <div className="text-[10px] text-text-muted font-medium uppercase tracking-wider mb-1.5">
            描述
          </div>
          <div className="text-[12px] text-text-secondary leading-relaxed">{task.description}</div>
        </div>
      )}

      {/* Subtasks */}
      {task.subtasks && task.subtasks.length > 0 && (
        <div className="px-4 py-3 border-b border-border">
          <div className="text-[10px] text-text-muted font-medium uppercase tracking-wider mb-2">
            子任务 ({subtasksDone}/{subtasksTotal})
          </div>
          <div className="space-y-1.5">
            {task.subtasks.map((sub, i) => (
              <div key={i} className="flex items-center gap-2 text-[12px]">
                {sub.done ? (
                  <CheckCircle size={14} className="text-success shrink-0" />
                ) : (
                  <div className="w-3.5 h-3.5 rounded-full border-2 border-border shrink-0" />
                )}
                <span className={sub.done ? "text-text-muted line-through" : "text-text-primary"}>
                  {sub.title}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Meta */}
      <div className="px-4 py-3 border-b border-border">
        <div className="text-[10px] text-text-muted font-medium uppercase tracking-wider mb-2">
          详细信息
        </div>
        <div className="space-y-2 text-[12px]">
          {task.sprintId && (
            <div className="flex justify-between">
              <span className="text-text-muted">Sprint</span>
              <span className="text-text-primary font-medium">{task.sprintId}</span>
            </div>
          )}
          {task.okrTitle && (
            <div className="flex justify-between">
              <span className="text-text-muted">OKR</span>
              <span className="text-info text-[11px] truncate max-w-[200px]">
                {task.okrId} {task.okrTitle}
              </span>
            </div>
          )}
          {task.dueDate && (
            <div className="flex justify-between">
              <span className="text-text-muted">截止日期</span>
              <span
                className={
                  task.status !== "done" && task.dueDate <= "02-24"
                    ? "text-danger font-medium"
                    : "text-text-primary"
                }
              >
                {task.dueDate}
              </span>
            </div>
          )}
          <div className="flex justify-between">
            <span className="text-text-muted">来源</span>
            <span className="text-text-primary">{task.sourceRef ?? task.source}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-text-muted">创建时间</span>
            <span className="text-text-primary">{task.createdAt}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-text-muted">更新时间</span>
            <span className="text-text-primary">{task.updatedAt}</span>
          </div>
        </div>
      </div>

      {/* Dependencies */}
      {(deps.length > 0 || dependents.length > 0) && (
        <div className="px-4 py-3 border-b border-border">
          <div className="text-[10px] text-text-muted font-medium uppercase tracking-wider mb-2">
            依赖关系
          </div>
          {deps.length > 0 && (
            <div className="mb-2">
              <div className="text-[10px] text-text-muted mb-1">依赖（上游）</div>
              {deps.map((d) => (
                <div
                  key={d.id}
                  className="flex items-center gap-2 p-2 bg-surface-1 rounded-lg text-[11px]"
                >
                  <AlertTriangle size={12} className="text-warning shrink-0" />
                  <span className="font-mono text-text-muted">{d.id}</span>
                  <span className="text-text-primary">{d.title}</span>
                  <span className="ml-auto text-text-muted">{d.progress}%</span>
                </div>
              ))}
            </div>
          )}
          {dependents.length > 0 && (
            <div>
              <div className="text-[10px] text-text-muted mb-1">被依赖（下游）</div>
              {dependents.map((d) => (
                <div
                  key={d.id}
                  className="flex items-center gap-2 p-2 bg-surface-1 rounded-lg text-[11px]"
                >
                  <ArrowRight size={12} className="text-info shrink-0" />
                  <span className="font-mono text-text-muted">{d.id}</span>
                  <span className="text-text-primary">{d.title}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Linked files */}
      {task.linkedFiles && task.linkedFiles.length > 0 && (
        <div className="px-4 py-3 border-b border-border">
          <div className="text-[10px] text-text-muted font-medium uppercase tracking-wider mb-2">
            关联文件
          </div>
          <div className="space-y-1">
            {task.linkedFiles.map((f) => (
              <div
                key={f}
                className="flex items-center gap-1.5 text-[11px] text-info hover:underline cursor-pointer p-1.5 rounded hover:bg-surface-1"
              >
                <FileText size={11} /> {f}
                <ExternalLink size={9} className="ml-auto text-text-muted shrink-0" />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tags */}
      <div className="px-4 py-3">
        <div className="text-[10px] text-text-muted font-medium uppercase tracking-wider mb-2">
          标签
        </div>
        <TagGroup>
          {task.tags.map((tag) => (
            <TagGroupItem key={tag} className="bg-surface-3 text-text-muted">
              {tag}
            </TagGroupItem>
          ))}
        </TagGroup>
      </div>
    </PanelShell>
  );
}
