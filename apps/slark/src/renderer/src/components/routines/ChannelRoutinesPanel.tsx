import { Button, Switch, cn } from "@nexu-design/ui-web";
import {
  ArrowUpRight,
  CircleCheck,
  CircleX,
  Clock,
  Loader2,
  Pencil,
  Play,
  Plug,
  Plus,
  RotateCcw,
  Trash2,
  Webhook,
  Workflow,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import type { ReactElement } from "react";

import { type TranslationKey, useT } from "@/i18n";
import { useAgentsStore } from "@/stores/agents";
import { useChatStore } from "@/stores/chat";
import { useRoutinesStore } from "@/stores/routines";
import type { Message, Routine, RoutineRun, RoutineTrigger, RoutineTriggerKind } from "@/types";

import { CreateRoutineDialog, type RoutineTemplateInitial } from "./CreateRoutineDialog";

interface RoutineTemplate {
  id: string;
  icon: React.ElementType;
  name: string;
  description: string;
  triggerLabel: string;
  initial: RoutineTemplateInitial;
}

const ROUTINE_TEMPLATES: RoutineTemplate[] = [
  {
    id: "daily-pr-review",
    icon: Clock,
    name: "Daily PR review",
    description:
      "Review open pull requests every weekday morning and post a summary of what needs attention.",
    triggerLabel: "Weekdays at 09:00",
    initial: {
      name: "Daily PR review",
      description:
        "Every weekday at 09:00, list all open PRs in our repos, group by author, flag any that have been waiting > 24h for review, and post the summary to this channel.",
      triggerKind: "schedule",
      scheduleMode: "weekdays",
      scheduleHour: 9,
      scheduleMinute: 0,
    },
  },
  {
    id: "pr-triage",
    icon: Plug,
    name: "PR triage on open",
    description:
      "When a pull request is opened in GitHub, apply the right labels and suggest reviewers.",
    triggerLabel: "GitHub · pull_request",
    initial: {
      name: "PR triage",
      description:
        "When a pull request is opened, read the title and changed paths, apply appropriate area labels (frontend / backend / docs), and suggest two reviewers based on recent CODEOWNERS activity.",
      triggerKind: "connector",
      connectorService: "github",
      connectorEvent: "pull_request",
    },
  },
  {
    id: "weekly-digest",
    icon: Clock,
    name: "Weekly digest",
    description:
      "Post a highlight reel of last week's merged PRs and closed issues every Monday morning.",
    triggerLabel: "Mon at 10:00",
    initial: {
      name: "Weekly digest",
      description:
        "Every Monday at 10:00, summarize last week's merged PRs, closed issues, and notable design explorations. Post the digest in this channel with links.",
      triggerKind: "schedule",
      scheduleMode: "weekly",
      scheduleDow: 1,
      scheduleHour: 10,
      scheduleMinute: 0,
    },
  },
  {
    id: "incident-notifier",
    icon: Plug,
    name: "Incident notifier",
    description:
      "When a high-priority Linear issue is filed, page the channel and start a triage topic.",
    triggerLabel: "Linear · issue_create",
    initial: {
      name: "Incident notifier",
      description:
        "When a new Linear issue is created with priority Urgent, post an @channel alert with the title, reporter, and a link, and open a new topic titled 'Incident: <issue title>' for triage.",
      triggerKind: "connector",
      connectorService: "linear",
      connectorEvent: "issue_create",
    },
  },
  {
    id: "hourly-monitor",
    icon: Clock,
    name: "Hourly health check",
    description: "Run a periodic check every hour and raise a flag if the agent finds anomalies.",
    triggerLabel: "Every hour",
    initial: {
      name: "Hourly health check",
      description:
        "Every hour on the hour, check service health dashboards for anomalies. If error rate > 1% or latency p95 > 500ms, post an alert with the offending service and a chart link.",
      triggerKind: "schedule",
      scheduleMode: "hourly",
      scheduleMinute: 0,
    },
  },
  {
    id: "webhook-runner",
    icon: Webhook,
    name: "Manual webhook runner",
    description:
      "Expose a POST endpoint you can call from CI or other services to trigger the agent.",
    triggerLabel: "POST webhook",
    initial: {
      name: "Manual webhook runner",
      description:
        "When this webhook receives a POST request, run the agent with the request payload as input and post the result back to this channel.",
      triggerKind: "api",
    },
  },
];

type TFn = (key: TranslationKey, vars?: Record<string, string>) => string;

const triggerIcons: Record<RoutineTriggerKind, React.ElementType> = {
  schedule: Clock,
  api: Webhook,
  connector: Plug,
};

function pad2(n: number): string {
  return n < 10 ? `0${n}` : String(n);
}

function formatTimeOfDay(hour: number, min: number): string {
  const h12 = hour % 12 === 0 ? 12 : hour % 12;
  const ampm = hour < 12 ? "AM" : "PM";
  return `${h12}:${pad2(min)} ${ampm}`;
}

function describeSchedule(trigger: RoutineTrigger, t: TFn): string {
  if (trigger.kind !== "schedule" || !trigger.cron) return t("routines.triggerSchedule");
  const parts = trigger.cron.trim().split(/\s+/);
  if (parts.length !== 5) return t("routines.runsCustomCron", { cron: trigger.cron });
  const [minRaw, hourRaw, dom, mon, dow] = parts;
  const min = Number(minRaw);
  const hour = Number(hourRaw);
  if (Number.isNaN(min) || Number.isNaN(hour)) {
    return t("routines.runsCustomCron", { cron: trigger.cron });
  }
  const time = formatTimeOfDay(hour, min);
  if (dom === "*" && mon === "*" && dow === "*") return t("routines.runsDaily", { time });
  if (dom === "*" && mon === "*" && dow === "1-5") return t("routines.runsWeekdays", { time });
  return t("routines.runsCustomCron", { cron: trigger.cron });
}

function describeTrigger(r: Routine, t: TFn): string {
  if (r.trigger.kind === "schedule") return describeSchedule(r.trigger, t);
  if (r.trigger.kind === "api") return t("routines.triggerApiRuns");
  const service = r.trigger.connectorService ?? "connector";
  const event = r.trigger.connectorEvent ?? "event";
  const target = r.trigger.connectorTarget;
  if (target) {
    return t("routines.triggerConnectorRunsTarget", { service, event, target });
  }
  return t("routines.triggerConnectorRuns", { service, event });
}

function triggerSectionLabel(kind: RoutineTriggerKind, t: TFn): string {
  return kind === "schedule" ? t("routines.repeats") : t("routines.trigger");
}

function sidebarTriggerLabel(r: Routine, t: TFn): string {
  if (r.trigger.kind === "schedule") {
    if (!r.trigger.cron) return t("routines.triggerSchedule");
    const parts = r.trigger.cron.trim().split(/\s+/);
    if (parts.length !== 5) return r.trigger.cron;
    const [minRaw, hourRaw, dom, mon, dow] = parts;
    const min = Number(minRaw);
    const hour = Number(hourRaw);
    if (Number.isNaN(min) || Number.isNaN(hour)) return r.trigger.cron;
    const time = formatTimeOfDay(hour, min);
    if (dom === "*" && mon === "*" && dow === "*") return `Daily · ${time}`;
    if (dom === "*" && mon === "*" && dow === "1-5") return `Weekdays · ${time}`;
    return r.trigger.cron;
  }
  if (r.trigger.kind === "api") return t("routines.triggerApi");
  const service = r.trigger.connectorService ?? "connector";
  const event = r.trigger.connectorEvent;
  return event ? `${service} · ${event}` : service;
}

function formatNextRun(ts?: number): string {
  if (!ts) return "—";
  const d = new Date(ts);
  const now = new Date();
  const sameDay = d.toDateString() === now.toDateString();
  const tomorrow = new Date(now);
  tomorrow.setDate(now.getDate() + 1);
  const isTomorrow = d.toDateString() === tomorrow.toDateString();
  const time = formatTimeOfDay(d.getHours(), d.getMinutes());
  if (sameDay) return `Today at ${time}`;
  if (isTomorrow) return `Tomorrow at ${time}`;
  return `${d.toLocaleDateString(undefined, { month: "short", day: "numeric" })} at ${time}`;
}

function formatRunDuration(run: RoutineRun): string | null {
  if (run.status === "running" || !run.completedAt) return null;
  const ms = Math.max(0, run.completedAt - run.startedAt);
  if (ms < 1000) return `${ms}ms`;
  const s = ms / 1000;
  if (s < 60) return `${s.toFixed(s < 10 ? 1 : 0)}s`;
  const m = Math.floor(s / 60);
  const rem = Math.round(s - m * 60);
  return rem === 0 ? `${m}m` : `${m}m ${rem}s`;
}

function formatRunStartedAt(ts: number): string {
  const d = new Date(ts);
  const now = new Date();
  const sameDay = d.toDateString() === now.toDateString();
  const time = formatTimeOfDay(d.getHours(), d.getMinutes());
  if (sameDay) return `Today at ${time}`;
  return `${d.toLocaleDateString(undefined, { month: "short", day: "numeric" })} at ${time}`;
}

interface ChannelRoutinesPanelProps {
  channelId: string;
  /** When rendered inside a 1:1 DM with an agent, lock the routine's agent field to this id. */
  lockedAgentId?: string;
  onJumpToMessage?: (messageId: string) => void;
}

export function ChannelRoutinesPanel({
  channelId,
  lockedAgentId,
  onJumpToMessage,
}: ChannelRoutinesPanelProps): ReactElement {
  const t = useT();
  const {
    routines,
    selectedRoutineId,
    selectRoutine,
    toggleRoutine,
    removeRoutine,
    runNow,
    completeRun,
  } = useRoutinesStore();
  const addMessage = useChatStore((s) => s.addMessage);
  const updateMessage = useChatStore((s) => s.updateMessage);
  const agents = useAgentsStore((s) => s.agents);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogTemplate, setDialogTemplate] = useState<RoutineTemplateInitial | undefined>(
    undefined,
  );
  const [toastOpen, setToastOpen] = useState(false);
  const [lastRunMessageId, setLastRunMessageId] = useState<string | null>(null);
  const [lastRunStatus, setLastRunStatus] = useState<RoutineRun["status"] | null>(null);

  const openCreateDialog = (tpl?: RoutineTemplateInitial): void => {
    setDialogTemplate(tpl);
    setDialogOpen(true);
  };

  const handleRunNow = (routine: Routine): void => {
    const agent = routine.agentId ? (agents.find((a) => a.id === routine.agentId) ?? null) : null;
    const messageId = `msg-routine-${routine.id}-${Date.now()}`;
    const agentRef = agent
      ? ({ kind: "agent", id: agent.id } as const)
      : ({ kind: "agent", id: "routine-runner" } as const);
    const message: Message = {
      id: messageId,
      channelId,
      sender: agentRef,
      content: buildRoutineRunMessage(routine, "running"),
      mentions: [],
      reactions: [],
      createdAt: Date.now(),
      isStreaming: true,
    };
    addMessage(channelId, message);
    const runId = runNow(routine.id, { messageId });
    setLastRunMessageId(messageId);
    setLastRunStatus("running");
    setToastOpen(true);

    const outcome: "success" | "error" = Math.random() < 0.8 ? "success" : "error";
    const delay = 1400 + Math.floor(Math.random() * 1200);
    setTimeout(() => {
      completeRun(routine.id, runId, outcome);
      updateMessage(channelId, messageId, {
        content: buildRoutineRunMessage(routine, outcome),
        isStreaming: false,
      });
      setLastRunStatus(outcome);
    }, delay);
  };

  const channelRoutines = useMemo(
    () => routines.filter((r) => r.channelId === channelId),
    [routines, channelId],
  );

  const selected = useMemo(
    () =>
      selectedRoutineId ? (channelRoutines.find((r) => r.id === selectedRoutineId) ?? null) : null,
    [channelRoutines, selectedRoutineId],
  );

  useEffect(() => {
    if (selectedRoutineId && !channelRoutines.some((r) => r.id === selectedRoutineId)) {
      selectRoutine(null);
    }
  }, [channelId, channelRoutines, selectedRoutineId, selectRoutine]);

  useEffect(() => {
    if (!toastOpen) return;
    if (lastRunStatus === "running") return;
    const timeout = setTimeout(() => setToastOpen(false), 4000);
    return () => clearTimeout(timeout);
  }, [toastOpen, lastRunStatus]);

  return (
    <div className="relative flex flex-1 overflow-hidden">
      <div className="flex w-[260px] shrink-0 flex-col border-r border-border-subtle">
        <div className="flex items-center justify-between px-3 py-2">
          <span className="text-[10px] font-medium uppercase tracking-wider text-text-muted">
            {t("routines.count", { count: String(channelRoutines.length) })}
          </span>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            onClick={() => openCreateDialog()}
            title={t("routines.newRoutine")}
            className="text-text-muted hover:text-text-primary"
          >
            <Plus className="h-3.5 w-3.5" />
          </Button>
        </div>
        <div className="flex-1 overflow-y-auto px-2 pb-3">
          {channelRoutines.length === 0 ? (
            <div className="px-3 py-8 text-center">
              <p className="text-xs text-text-muted">
                No routines yet — pick a template on the right to get started.
              </p>
            </div>
          ) : (
            channelRoutines.map((r) => {
              const Icon = triggerIcons[r.trigger.kind];
              const active = selectedRoutineId === r.id;
              return (
                <Button
                  key={r.id}
                  type="button"
                  variant="ghost"
                  size="inline"
                  onClick={() => selectRoutine(r.id)}
                  className={cn(
                    "flex w-full items-center gap-2.5 rounded-md px-2 py-2 transition-colors",
                    active
                      ? "bg-surface-2 text-text-primary"
                      : "text-text-muted hover:bg-surface-2/60 hover:text-text-primary",
                  )}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  <div className="min-w-0 flex-1 text-left">
                    <div className="truncate text-sm font-medium">{r.name}</div>
                    <div className="truncate text-xs text-text-muted">
                      {sidebarTriggerLabel(r, t)}
                    </div>
                  </div>
                  <div
                    className={cn(
                      "h-2 w-2 shrink-0 rounded-full",
                      r.status === "active" && "bg-nexu-online",
                      r.status === "paused" && "bg-nexu-offline",
                      r.status === "error" && "bg-destructive",
                    )}
                  />
                </Button>
              );
            })
          )}
        </div>
      </div>

      <div className="min-w-0 flex-1 overflow-y-auto">
        {channelRoutines.length === 0 ? (
          <div className="mx-auto max-w-3xl px-8 pt-10 pb-16">
            <div className="mb-8 text-center">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-accent">
                <Workflow className="h-6 w-6" />
              </div>
              <h2 className="mb-2 text-lg font-semibold">{t("routines.emptyTitle")}</h2>
              <p className="text-sm text-text-muted">{t("routines.emptyDesc")}</p>
            </div>

            <div className="mb-3 flex items-baseline justify-between">
              <h3 className="text-sm font-medium text-text-muted">Start from a template</h3>
              <Button
                type="button"
                variant="ghost"
                size="inline"
                onClick={() => openCreateDialog()}
                className="text-xs text-text-muted hover:text-text-primary"
              >
                <Plus className="mr-1 h-3 w-3" />
                Start from scratch
              </Button>
            </div>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {ROUTINE_TEMPLATES.map((tpl) => {
                const TplIcon = tpl.icon;
                return (
                  <button
                    type="button"
                    key={tpl.id}
                    onClick={() => openCreateDialog(tpl.initial)}
                    className="group flex flex-col gap-2 rounded-lg border border-border bg-card px-3.5 py-3 text-left transition-colors hover:border-foreground/60 hover:bg-accent/40"
                  >
                    <div className="flex items-center gap-2">
                      <span className="flex h-7 w-7 items-center justify-center rounded-md bg-accent text-text-muted group-hover:text-text-primary">
                        <TplIcon className="h-3.5 w-3.5" />
                      </span>
                      <span className="truncate text-sm font-medium">{tpl.name}</span>
                    </div>
                    <p className="line-clamp-2 text-xs leading-relaxed text-text-muted">
                      {tpl.description}
                    </p>
                    <span className="mt-0.5 inline-flex w-fit items-center rounded bg-surface-2 px-1.5 py-0.5 font-mono text-[10px] text-text-muted">
                      {tpl.triggerLabel}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        ) : !selected ? (
          <div className="flex h-full items-center justify-center text-sm text-text-muted">
            {t("routines.selectRoutine")}
          </div>
        ) : (
          <div className="mx-auto max-w-3xl px-8 pt-6 pb-16">
            <div className="mb-8 flex items-start justify-between gap-6">
              <div className="min-w-0 flex-1">
                <h1 className="mb-3 truncate text-2xl font-semibold tracking-tight">
                  {selected.name}
                </h1>
                <div className="flex flex-wrap items-center gap-3">
                  <Switch
                    checked={selected.status === "active"}
                    onCheckedChange={() => toggleRoutine(selected.id)}
                    aria-label={
                      selected.status === "active" ? t("routines.pause") : t("routines.resume")
                    }
                  />
                  <StatusPill status={selected.status} />
                  <HeaderRunHint routine={selected} t={t} />
                </div>
              </div>

              <div className="flex shrink-0 items-center gap-1">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9 text-text-muted hover:text-text-primary"
                  title={t("routines.edit")}
                  onClick={() => openCreateDialog()}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9 text-text-muted hover:text-destructive"
                  title={t("routines.delete")}
                  onClick={() => removeRoutine(selected.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
                <Button
                  type="button"
                  className="ml-1 h-9 px-3.5"
                  onClick={() => handleRunNow(selected)}
                >
                  <Play className="mr-1.5 h-3.5 w-3.5 fill-current" />
                  {t("routines.runNow")}
                </Button>
              </div>
            </div>

            <div className="space-y-8 border-t border-border-subtle pt-6">
              <Section title={triggerSectionLabel(selected.trigger.kind, t)}>
                <div className="flex items-center gap-2.5">
                  <span className="flex h-7 w-7 items-center justify-center rounded-md bg-surface-2 text-text-muted">
                    {(() => {
                      const TriggerIcon = triggerIcons[selected.trigger.kind];
                      return <TriggerIcon className="h-3.5 w-3.5" />;
                    })()}
                  </span>
                  <p className="text-sm">{describeTrigger(selected, t)}</p>
                </div>
              </Section>

              <Section title={t("routines.instructions")}>
                <div className="rounded-lg border border-border-subtle bg-surface-2/40 px-4 py-3 text-sm leading-relaxed">
                  {selected.description || <span className="text-text-muted">—</span>}
                </div>
              </Section>

              <Section title={t("routines.runs")}>
                {(selected.runs ?? []).length === 0 ? (
                  <p className="text-sm text-text-muted">{t("routines.noRuns")}</p>
                ) : (
                  <ul className="space-y-1">
                    {(selected.runs ?? []).map((run) => (
                      <RunRow
                        key={run.id}
                        run={run}
                        onJump={
                          run.messageId && onJumpToMessage
                            ? () => onJumpToMessage(run.messageId!)
                            : undefined
                        }
                        onRetry={run.status === "error" ? () => handleRunNow(selected) : undefined}
                      />
                    ))}
                  </ul>
                )}
              </Section>
            </div>
          </div>
        )}
      </div>

      {toastOpen ? (
        <div className="pointer-events-none absolute right-6 top-4 z-50">
          <div
            className={cn(
              "pointer-events-auto flex items-center gap-2 rounded-lg border bg-card px-3 py-2 text-sm shadow-md",
              lastRunStatus === "success" && "border-nexu-online/40",
              lastRunStatus === "error" && "border-destructive/40",
              (!lastRunStatus || lastRunStatus === "running") && "border-border",
            )}
          >
            {lastRunStatus === "running" ? (
              <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
            ) : lastRunStatus === "success" ? (
              <CircleCheck className="h-4 w-4 text-nexu-online" />
            ) : lastRunStatus === "error" ? (
              <CircleX className="h-4 w-4 text-destructive" />
            ) : (
              <span className="flex h-4 w-4 items-center justify-center rounded-full border border-muted-foreground/40 text-[10px] text-muted-foreground">
                i
              </span>
            )}
            <div className="flex flex-col leading-tight">
              <span className="font-medium">
                {lastRunStatus === "running" && "Running…"}
                {lastRunStatus === "success" && "Run completed"}
                {lastRunStatus === "error" && "Run failed"}
                {!lastRunStatus && t("routines.runStarted")}
              </span>
              <span className="text-[11px] text-muted-foreground">
                {lastRunStatus === "running" &&
                  "The agent is working — you'll see its reply in chat when it's done."}
                {lastRunStatus === "success" && "Agent posted its reply to this channel."}
                {lastRunStatus === "error" &&
                  "The agent hit an error. Check the reply for details."}
              </span>
            </div>
            {lastRunStatus === "error" && selected ? (
              <button
                type="button"
                onClick={() => {
                  handleRunNow(selected);
                }}
                className="ml-1 inline-flex items-center gap-1 rounded-md border border-destructive/40 px-2 py-0.5 text-xs font-medium text-destructive hover:bg-destructive/10"
              >
                <RotateCcw className="h-3 w-3" />
                Retry
              </button>
            ) : null}
            {lastRunMessageId && onJumpToMessage ? (
              <button
                type="button"
                onClick={() => {
                  onJumpToMessage(lastRunMessageId);
                  setToastOpen(false);
                }}
                className="ml-1 inline-flex items-center gap-1 rounded-md bg-foreground/5 px-2 py-0.5 text-xs font-medium text-foreground hover:bg-foreground/10"
              >
                View reply
                <ArrowUpRight className="h-3 w-3" />
              </button>
            ) : null}
            <button
              type="button"
              onClick={() => setToastOpen(false)}
              className="ml-1 self-start text-muted-foreground hover:text-foreground"
              aria-label="dismiss"
            >
              ×
            </button>
          </div>
        </div>
      ) : null}

      <CreateRoutineDialog
        open={dialogOpen}
        onOpenChange={(next) => {
          setDialogOpen(next);
          if (!next) setDialogTemplate(undefined);
        }}
        channelId={channelId}
        lockedAgentId={lockedAgentId}
        template={dialogTemplate}
      />
    </div>
  );
}

function HeaderRunHint({ routine, t }: { routine: Routine; t: TFn }): ReactElement | null {
  if (routine.status === "active" && routine.nextRunAt) {
    return (
      <span className="text-sm text-text-muted">
        {t("routines.nextRunInline", { when: formatNextRun(routine.nextRunAt) })}
      </span>
    );
  }
  if (routine.status === "active" && routine.trigger.kind !== "schedule") {
    return <span className="text-sm text-text-muted">{t("routines.waitingForTrigger")}</span>;
  }
  if (routine.lastRunAt) {
    return (
      <span className="text-sm text-text-muted">
        {t("routines.lastRunInline", { when: formatNextRun(routine.lastRunAt) })}
      </span>
    );
  }
  return null;
}

function Section({ title, children }: { title: string; children: React.ReactNode }): ReactElement {
  return (
    <section>
      <h3 className="mb-2 text-sm font-medium text-text-muted">{title}</h3>
      {children}
    </section>
  );
}

function StatusPill({ status }: { status: Routine["status"] }): ReactElement {
  const t = useT();
  const label =
    status === "active"
      ? t("routines.statusActive")
      : status === "paused"
        ? t("routines.statusPaused")
        : t("routines.statusError");
  return (
    <div
      className={cn(
        "inline-flex items-center gap-1.5 rounded-md px-2 py-0.5 text-xs font-medium",
        status === "active" && "bg-nexu-online/15 text-nexu-online",
        status === "paused" && "bg-muted text-muted-foreground",
        status === "error" && "bg-destructive/10 text-destructive",
      )}
    >
      <span
        className={cn(
          "h-1.5 w-1.5 rounded-full",
          status === "active" && "bg-nexu-online",
          status === "paused" && "bg-muted-foreground",
          status === "error" && "bg-destructive",
        )}
      />
      {label}
    </div>
  );
}

function RunRow({
  run,
  onJump,
  onRetry,
}: {
  run: RoutineRun;
  onJump?: () => void;
  onRetry?: () => void;
}): ReactElement {
  const t = useT();
  const statusLabel =
    run.status === "running" ? "Running" : run.status === "success" ? "Success" : "Failed";
  const KindIcon = run.kind === "manual" ? Play : Clock;
  const kindLabel = run.kind === "manual" ? t("routines.runManual") : t("routines.runScheduled");
  const duration = formatRunDuration(run);
  return (
    <li className="group flex items-center gap-3 rounded-md px-2 py-2 hover:bg-surface-2/60">
      <RunStatusIcon status={run.status} />
      <div className="flex min-w-0 flex-1 items-center gap-2">
        <span className="text-sm">{formatRunStartedAt(run.startedAt)}</span>
        <span
          className="inline-flex items-center gap-1 text-[11px] text-text-muted"
          title={kindLabel}
        >
          <span className="h-3 w-px bg-border-subtle" />
          <KindIcon className="h-3 w-3" />
          <span className="capitalize">{run.kind}</span>
        </span>
        {duration ? <span className="text-[11px] text-text-muted">· {duration}</span> : null}
      </div>
      <span
        className={cn(
          "rounded-sm px-1.5 py-0.5 text-[10px] font-semibold tracking-wider",
          run.status === "running" && "bg-muted text-muted-foreground",
          run.status === "success" && "bg-nexu-online/15 text-nexu-online",
          run.status === "error" && "bg-destructive/10 text-destructive",
        )}
      >
        {statusLabel}
      </span>
      {onRetry ? (
        <button
          type="button"
          onClick={onRetry}
          className="inline-flex items-center gap-1 rounded-md border border-destructive/30 px-2 py-1 text-xs font-medium text-destructive hover:bg-destructive/10"
          title="Retry this run"
        >
          <RotateCcw className="h-3 w-3" />
          Retry
        </button>
      ) : null}
      {onJump ? (
        <button
          type="button"
          onClick={onJump}
          className={cn(
            "inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium text-text-muted hover:bg-surface-2 hover:text-text-primary",
            // For failed runs the Retry button is already the primary call-to-action,
            // so keep "View reply" visible alongside rather than hover-only.
            onRetry
              ? ""
              : "opacity-0 transition-opacity group-hover:opacity-100 focus-visible:opacity-100",
          )}
          title="View reply in chat"
        >
          View reply
          <ArrowUpRight className="h-3 w-3" />
        </button>
      ) : null}
    </li>
  );
}

function RunStatusIcon({ status }: { status: RoutineRun["status"] }): ReactElement {
  if (status === "running")
    return <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />;
  if (status === "success") return <CircleCheck className="h-4 w-4 text-nexu-online" />;
  return <CircleX className="h-4 w-4 text-destructive" />;
}

function buildRoutineRunMessage(routine: Routine, status: "running" | "success" | "error"): string {
  const prefix =
    status === "running"
      ? `⏳ **${routine.name}** — running now (manual trigger)`
      : status === "success"
        ? `✅ **${routine.name}** — completed`
        : `⚠️ **${routine.name}** — failed`;
  const body = routine.description
    ? routine.description
    : "One run of this routine was triggered from the Routines tab.";
  if (status === "running") {
    return `${prefix}\n\n${body}\n\n_Working on it — I'll update this message with the result._`;
  }
  if (status === "error") {
    return `${prefix}\n\n${body}\n\n_Hit an error on this run — check the agent's logs for details, or retry from the Routines tab._`;
  }
  return `${prefix}\n\n${body}`;
}
