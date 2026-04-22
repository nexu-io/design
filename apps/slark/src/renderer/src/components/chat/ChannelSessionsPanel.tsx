import { cn } from "@nexu-design/ui-web";
import {
  ArrowUpRight,
  Bot,
  CircleCheck,
  CircleX,
  Clock,
  Loader2,
  MessageSquare,
  Workflow,
} from "lucide-react";
import { useMemo, useState, type ReactElement } from "react";

import { ChannelRoutinesPanel } from "@/components/routines/ChannelRoutinesPanel";
import { useT } from "@/i18n";
import { useAgentsStore } from "@/stores/agents";
import { useRoutinesStore } from "@/stores/routines";
import { useSessionsStore } from "@/stores/sessions";
import type { Agent, ChatTaskSession, Routine, RoutineRun } from "@/types";

type SubView = "activity" | "routines";

interface ChannelSessionsPanelProps {
  channelId: string;
  agentId: string;
  onJumpToMessage?: (messageId: string) => void;
}

/**
 * Unified "Session" feed rendered inside a 1:1 agent DM.
 *
 * Merges two kinds of work the agent does for the user in this DM:
 *   1. Conversation-initiated tasks (user asks → agent replies) — sourced from useSessionsStore
 *   2. Routine runs scheduled or manually triggered — sourced from useRoutinesStore
 *
 * Both are rendered as rows on a single chronological timeline.
 */
export function ChannelSessionsPanel({
  channelId,
  agentId,
  onJumpToMessage,
}: ChannelSessionsPanelProps): ReactElement {
  const t = useT();
  const tasks = useSessionsStore((s) => s.tasks);
  const routines = useRoutinesStore((s) => s.routines);
  const agents = useAgentsStore((s) => s.agents);
  const agent = agents.find((a) => a.id === agentId);

  const [subView, setSubView] = useState<SubView>("activity");

  const channelTasks = useMemo(
    () => tasks.filter((t) => t.channelId === channelId),
    [tasks, channelId],
  );

  const channelRoutines = useMemo(
    () => routines.filter((r) => r.channelId === channelId),
    [routines, channelId],
  );

  type TimelineEntry =
    | { kind: "task"; startedAt: number; task: ChatTaskSession }
    | { kind: "run"; startedAt: number; routine: Routine; run: RoutineRun };

  const timeline: TimelineEntry[] = useMemo(() => {
    const entries: TimelineEntry[] = [];
    for (const task of channelTasks) {
      entries.push({ kind: "task", startedAt: task.startedAt, task });
    }
    for (const r of channelRoutines) {
      for (const run of r.runs ?? []) {
        entries.push({ kind: "run", startedAt: run.startedAt, routine: r, run });
      }
    }
    entries.sort((a, b) => b.startedAt - a.startedAt);
    return entries;
  }, [channelTasks, channelRoutines]);

  // Group by day for readable headers.
  const grouped = useMemo(() => {
    const groups = new Map<string, TimelineEntry[]>();
    for (const entry of timeline) {
      const key = groupKey(entry.startedAt);
      const list = groups.get(key);
      if (list) list.push(entry);
      else groups.set(key, [entry]);
    }
    return Array.from(groups.entries());
  }, [timeline]);

  const runningCount = useMemo(
    () =>
      channelTasks.filter((t) => t.status === "running").length +
      channelRoutines.reduce(
        (acc, r) => acc + (r.runs ?? []).filter((run) => run.status === "running").length,
        0,
      ),
    [channelTasks, channelRoutines],
  );

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      {/* Segmented sub-view toggle */}
      <div className="flex shrink-0 items-center gap-2 border-b border-border-subtle px-4 py-2">
        <div className="inline-flex items-center rounded-md bg-surface-2/60 p-0.5">
          <SubViewTab
            active={subView === "activity"}
            onClick={() => setSubView("activity")}
            label={t("sessions.subviewActivity")}
            count={timeline.length}
          />
          <SubViewTab
            active={subView === "routines"}
            onClick={() => setSubView("routines")}
            label={t("sessions.subviewRoutines")}
            count={channelRoutines.length}
          />
        </div>
        {subView === "activity" && runningCount > 0 ? (
          <span className="inline-flex items-center gap-1 rounded-full bg-info-subtle px-2 py-0.5 text-[11px] font-medium text-info">
            <Loader2 className="h-3 w-3 animate-spin" />
            {t("sessions.runningCount", { count: String(runningCount) })}
          </span>
        ) : null}
      </div>

      {/* Body */}
      {subView === "routines" ? (
        <ChannelRoutinesPanel
          channelId={channelId}
          lockedAgentId={agentId}
          onJumpToMessage={onJumpToMessage}
        />
      ) : (
        <div className="min-h-0 flex-1 overflow-y-auto">
          {timeline.length === 0 ? (
            <EmptyState agent={agent} onOpenRoutines={() => setSubView("routines")} />
          ) : (
          <div className="px-4 py-3">
            {grouped.map(([dayLabel, entries]) => (
              <section key={dayLabel} className="mb-4 last:mb-0">
                <h3 className="mb-1.5 text-[10px] font-medium uppercase tracking-wider text-text-muted">
                  {dayLabel}
                </h3>
                <ul className="space-y-0.5">
                  {entries.map((entry) =>
                    entry.kind === "task" ? (
                      <TaskRow
                        key={`task-${entry.task.id}`}
                        task={entry.task}
                        onJump={
                          entry.task.replyMessageId && onJumpToMessage
                            ? () => onJumpToMessage(entry.task.replyMessageId!)
                            : entry.task.sourceMessageId && onJumpToMessage
                              ? () => onJumpToMessage(entry.task.sourceMessageId!)
                              : undefined
                        }
                      />
                    ) : (
                      <RoutineRunRow
                        key={`run-${entry.run.id}`}
                        routine={entry.routine}
                        run={entry.run}
                        onJump={
                          entry.run.messageId && onJumpToMessage
                            ? () => onJumpToMessage(entry.run.messageId!)
                            : undefined
                        }
                      />
                    ),
                  )}
                </ul>
              </section>
            ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function SubViewTab({
  active,
  onClick,
  label,
  count,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  count: number;
}): ReactElement {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex h-6 items-center gap-1.5 rounded px-2.5 text-[12px] font-medium transition-colors",
        active
          ? "bg-surface-0 text-text-primary shadow-sm"
          : "text-text-muted hover:text-text-primary",
      )}
    >
      <span>{label}</span>
      {count > 0 ? (
        <span
          className={cn(
            "rounded-full px-1.5 text-[10px] font-semibold tabular-nums",
            active ? "bg-surface-2 text-text-muted" : "text-text-muted",
          )}
        >
          {count}
        </span>
      ) : null}
    </button>
  );
}

function TaskRow({
  task,
  onJump,
}: {
  task: ChatTaskSession;
  onJump?: () => void;
}): ReactElement {
  const t = useT();
  const duration = formatDuration(task.startedAt, task.completedAt);
  return (
    <li className="group flex items-center gap-3 rounded-md px-2 py-1.5 hover:bg-surface-2/50">
      <StatusIcon status={task.status} />
      <div className="flex min-w-0 flex-1 items-center gap-2">
        <span className="truncate text-[13px] text-text-primary">{task.title}</span>
      </div>
      <span className="inline-flex shrink-0 items-center gap-1 rounded-md bg-info-subtle px-1.5 py-0.5 text-[10.5px] font-medium text-info">
        <MessageSquare className="h-3 w-3" />
        {t("sessions.triggerChat")}
      </span>
      <span className="shrink-0 text-[11px] tabular-nums text-text-muted">
        {formatClock(task.startedAt)}
        {duration ? ` · ${duration}` : ""}
      </span>
      {onJump ? (
        <button
          type="button"
          onClick={onJump}
          className="inline-flex shrink-0 items-center gap-1 rounded-md px-1.5 py-0.5 text-[11px] font-medium text-text-muted opacity-0 transition hover:bg-surface-2 hover:text-text-primary focus-visible:opacity-100 group-hover:opacity-100"
          title={t("sessions.viewInChat")}
        >
          {t("sessions.viewInChat")}
          <ArrowUpRight className="h-3 w-3" />
        </button>
      ) : null}
    </li>
  );
}

function RoutineRunRow({
  routine,
  run,
  onJump,
}: {
  routine: Routine;
  run: RoutineRun;
  onJump?: () => void;
}): ReactElement {
  const t = useT();
  const duration = formatDuration(run.startedAt, run.completedAt);
  return (
    <li className="group flex items-center gap-3 rounded-md px-2 py-1.5 hover:bg-surface-2/50">
      <StatusIcon status={run.status} />
      <div className="flex min-w-0 flex-1 items-center gap-2">
        <span className="truncate text-[13px] text-text-primary">{routine.name}</span>
      </div>
      <span className="inline-flex shrink-0 items-center gap-1 rounded-md bg-success-subtle px-1.5 py-0.5 text-[10.5px] font-medium text-success">
        <Workflow className="h-3 w-3" />
        {run.kind === "manual" ? t("sessions.triggerManual") : t("sessions.triggerScheduled")}
      </span>
      <span className="shrink-0 text-[11px] tabular-nums text-text-muted">
        {formatClock(run.startedAt)}
        {duration ? ` · ${duration}` : ""}
      </span>
      {onJump ? (
        <button
          type="button"
          onClick={onJump}
          className="inline-flex shrink-0 items-center gap-1 rounded-md px-1.5 py-0.5 text-[11px] font-medium text-text-muted opacity-0 transition hover:bg-surface-2 hover:text-text-primary focus-visible:opacity-100 group-hover:opacity-100"
          title={t("sessions.viewInChat")}
        >
          {t("sessions.viewInChat")}
          <ArrowUpRight className="h-3 w-3" />
        </button>
      ) : null}
    </li>
  );
}

function StatusIcon({
  status,
}: {
  status: "running" | "success" | "error";
}): ReactElement {
  if (status === "running")
    return <Loader2 className="h-4 w-4 shrink-0 animate-spin text-info" />;
  if (status === "success")
    return <CircleCheck className="h-4 w-4 shrink-0 text-success" />;
  return <CircleX className="h-4 w-4 shrink-0 text-danger" />;
}

function EmptyState({
  agent,
  onOpenRoutines,
}: {
  agent: Agent | undefined;
  onOpenRoutines: () => void;
}): ReactElement {
  const t = useT();
  return (
    <div className="mx-auto flex max-w-md flex-col items-center px-6 pt-16 text-center">
      <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-surface-2">
        {agent?.avatar ? (
          <img src={agent.avatar} alt="" className="h-7 w-7 rounded-lg" />
        ) : (
          <Bot className="h-5 w-5 text-text-muted" />
        )}
      </div>
      <h2 className="mb-1.5 text-[15px] font-semibold text-text-primary">
        {t("sessions.emptyTitle")}
      </h2>
      <p className="mb-4 text-[12.5px] leading-relaxed text-text-muted">
        {t("sessions.emptyDesc")}
      </p>
      <button
        type="button"
        onClick={onOpenRoutines}
        className="inline-flex h-8 items-center gap-1.5 rounded-md border border-border-subtle bg-surface-2/60 px-3 text-[12.5px] font-medium text-text-primary hover:bg-surface-2"
      >
        <Clock className="h-3.5 w-3.5" />
        {t("sessions.createRoutine")}
      </button>
    </div>
  );
}

function formatDuration(startedAt: number, completedAt?: number): string | null {
  if (!completedAt) return null;
  const ms = Math.max(0, completedAt - startedAt);
  if (ms < 1000) return `${ms}ms`;
  const s = ms / 1000;
  if (s < 60) return `${s.toFixed(s < 10 ? 1 : 0)}s`;
  const m = Math.floor(s / 60);
  const rem = Math.round(s - m * 60);
  return rem === 0 ? `${m}m` : `${m}m ${rem}s`;
}

function formatClock(ts: number): string {
  const d = new Date(ts);
  const h = d.getHours();
  const m = d.getMinutes();
  const pad = (n: number): string => (n < 10 ? `0${n}` : String(n));
  return `${pad(h)}:${pad(m)}`;
}

function groupKey(ts: number): string {
  const d = new Date(ts);
  const now = new Date();
  const sameDay = d.toDateString() === now.toDateString();
  if (sameDay) return "Today";
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  if (d.toDateString() === yesterday.toDateString()) return "Yesterday";
  return d.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: d.getFullYear() === now.getFullYear() ? undefined : "numeric",
  });
}
