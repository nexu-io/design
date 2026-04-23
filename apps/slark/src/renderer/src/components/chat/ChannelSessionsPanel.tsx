import {
  ArrowUpRight,
  Bot,
  CircleCheck,
  CircleX,
  Loader2,
  MessageSquare,
  Workflow,
} from "lucide-react";
import { useMemo, type ReactElement } from "react";

import { useT } from "@/i18n";
import { useAgentsStore } from "@/stores/agents";
import { useRoutinesStore } from "@/stores/routines";
import { useSessionsStore } from "@/stores/sessions";
import type { Agent, ChatTaskSession, Routine, RoutineRun } from "@/types";

interface ChannelSessionsPanelProps {
  agentId: string;
  onJumpToMessage?: (messageId: string, targetChannelId: string) => void;
}

/**
 * Unified "Session" feed for a 1:1 agent DM.
 *
 * Shows every session this agent has performed for the user, regardless of
 * which channel it took place in. Two kinds are merged:
 *   1. Conversation-initiated tasks (user asks → agent replies) — from useSessionsStore
 *   2. Routine runs scheduled or manually triggered — from useRoutinesStore
 *
 * Rows are a single chronological timeline. Clicking a row jumps to the
 * source message — cross-channel navigation is supported.
 */
export function ChannelSessionsPanel({
  agentId,
  onJumpToMessage,
}: ChannelSessionsPanelProps): ReactElement {
  const t = useT();
  const tasks = useSessionsStore((s) => s.tasks);
  const routines = useRoutinesStore((s) => s.routines);
  const agents = useAgentsStore((s) => s.agents);
  const agent = agents.find((a) => a.id === agentId);

  const agentTasks = useMemo(() => tasks.filter((t) => t.agentId === agentId), [tasks, agentId]);

  const agentRoutines = useMemo(
    () => routines.filter((r) => r.agentId === agentId),
    [routines, agentId],
  );

  type TimelineEntry =
    | { kind: "task"; startedAt: number; task: ChatTaskSession }
    | { kind: "run"; startedAt: number; routine: Routine; run: RoutineRun };

  const timeline: TimelineEntry[] = useMemo(() => {
    const entries: TimelineEntry[] = [];
    for (const task of agentTasks) {
      entries.push({ kind: "task", startedAt: task.startedAt, task });
    }
    for (const r of agentRoutines) {
      for (const run of r.runs ?? []) {
        entries.push({ kind: "run", startedAt: run.startedAt, routine: r, run });
      }
    }
    entries.sort((a, b) => b.startedAt - a.startedAt);
    return entries;
  }, [agentTasks, agentRoutines]);

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
      agentTasks.filter((t) => t.status === "running").length +
      agentRoutines.reduce(
        (acc, r) => acc + (r.runs ?? []).filter((run) => run.status === "running").length,
        0,
      ),
    [agentTasks, agentRoutines],
  );

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      {runningCount > 0 ? (
        <div className="flex shrink-0 items-center gap-2 border-b border-border-subtle px-4 py-2">
          <span className="inline-flex items-center gap-1 rounded-full bg-info-subtle px-2 py-0.5 text-[11px] font-medium text-info">
            <Loader2 className="h-3 w-3 animate-spin" />
            {t("sessions.runningCount", { count: String(runningCount) })}
          </span>
        </div>
      ) : null}

      <div className="min-h-0 flex-1 overflow-y-auto">
        {timeline.length === 0 ? (
          <EmptyState agent={agent} />
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
                        onJump={(() => {
                          if (!onJumpToMessage) return undefined;
                          const targetId = entry.task.replyMessageId ?? entry.task.sourceMessageId;
                          if (!targetId) return undefined;
                          return () => onJumpToMessage(targetId, entry.task.channelId);
                        })()}
                      />
                    ) : (
                      <RoutineRunRow
                        key={`run-${entry.run.id}`}
                        routine={entry.routine}
                        run={entry.run}
                        onJump={(() => {
                          const messageId = entry.run.messageId;
                          if (!messageId || !onJumpToMessage) return undefined;
                          return () => onJumpToMessage(messageId, entry.routine.channelId);
                        })()}
                      />
                    ),
                  )}
                </ul>
              </section>
            ))}
          </div>
        )}
      </div>
    </div>
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
  if (status === "running") return <Loader2 className="h-4 w-4 shrink-0 animate-spin text-info" />;
  if (status === "success") return <CircleCheck className="h-4 w-4 shrink-0 text-success" />;
  return <CircleX className="h-4 w-4 shrink-0 text-danger" />;
}

function EmptyState({ agent }: { agent: Agent | undefined }): ReactElement {
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
      <p className="text-[12.5px] leading-relaxed text-text-muted">{t("sessions.emptyDesc")}</p>
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
