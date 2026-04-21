import { Button, Switch, cn } from "@nexu-design/ui-web";
import {
  ChevronLeft,
  CircleCheck,
  CircleX,
  Loader2,
  Pencil,
  Play,
  Plus,
  Trash2,
  Workflow,
} from "lucide-react";
import { useEffect, useState } from "react";
import type { ReactElement } from "react";
import { useNavigate } from "react-router-dom";

import { WindowChrome } from "@/components/layout/WindowChrome";
import { type TranslationKey, useT } from "@/i18n";
import { useRoutinesStore } from "@/stores/routines";
import type { Routine, RoutineRun, RoutineTrigger } from "@/types";

import { ConnectorBadge } from "./ConnectorBadge";
import { CreateRoutineDialog } from "./CreateRoutineDialog";

function pad2(n: number): string {
  return n < 10 ? `0${n}` : String(n);
}

function formatTimeOfDay(hour: number, min: number): string {
  const h12 = hour % 12 === 0 ? 12 : hour % 12;
  const ampm = hour < 12 ? "AM" : "PM";
  return `${h12}:${pad2(min)} ${ampm}`;
}

type TFn = (key: TranslationKey, vars?: Record<string, string>) => string;

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
  if (dom === "*" && mon === "*" && dow === "*") {
    return t("routines.runsDaily", { time });
  }
  if (dom === "*" && mon === "*" && dow === "1-5") {
    return t("routines.runsWeekdays", { time });
  }
  return t("routines.runsCustomCron", { cron: trigger.cron });
}

function describeTrigger(r: Routine, t: TFn): string {
  if (r.trigger.kind === "schedule") return describeSchedule(r.trigger, t);
  if (r.trigger.kind === "github") {
    return t("routines.triggerGithubDetail", {
      repo: r.trigger.githubRepo ?? "—",
      event: r.trigger.githubEvent ?? "event",
    });
  }
  if (r.trigger.kind === "api") return t("routines.triggerApiDetail");
  return t("routines.triggerConnectorDetail", {
    service: r.trigger.connectorService ?? "connector",
  });
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

function formatRunStartedAt(ts: number): string {
  const d = new Date(ts);
  const now = new Date();
  const sameDay = d.toDateString() === now.toDateString();
  const time = formatTimeOfDay(d.getHours(), d.getMinutes());
  if (sameDay) return `Today at ${time}`;
  return `${d.toLocaleDateString(undefined, { month: "short", day: "numeric" })} at ${time}`;
}

export function RoutinesView(): ReactElement {
  const t = useT();
  const navigate = useNavigate();
  const { routines, selectedRoutineId, selectRoutine, toggleRoutine, removeRoutine, runNow } =
    useRoutinesStore();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [toastOpen, setToastOpen] = useState(false);

  useEffect(() => {
    if (routines.length > 0 && !selectedRoutineId) selectRoutine(routines[0].id);
  }, [routines, selectedRoutineId, selectRoutine]);

  useEffect(() => {
    if (!toastOpen) return;
    const timeout = setTimeout(() => setToastOpen(false), 3000);
    return () => clearTimeout(timeout);
  }, [toastOpen]);

  if (routines.length === 0) {
    return (
      <div className="flex h-full flex-col">
        <WindowChrome className="h-10" />
        <div className="flex-1 overflow-y-auto">
          <div className="mx-auto max-w-2xl px-6 pt-16 pb-10 text-center">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-accent">
              <Workflow className="h-6 w-6" />
            </div>
            <h1 className="mb-2 text-xl font-semibold">{t("routines.emptyTitle")}</h1>
            <p className="mx-auto mb-6 max-w-md text-sm text-muted-foreground">
              {t("routines.emptyDesc")}
            </p>
            <Button type="button" onClick={() => setDialogOpen(true)}>
              <Plus className="mr-1.5 h-4 w-4" />
              {t("routines.createFirst")}
            </Button>
          </div>
        </div>
        <CreateRoutineDialog open={dialogOpen} onOpenChange={setDialogOpen} />
      </div>
    );
  }

  const r = selectedRoutineId ? (routines.find((x) => x.id === selectedRoutineId) ?? null) : null;

  if (!r) {
    return (
      <div className="flex h-full flex-col">
        <WindowChrome className="h-10" />
        <div className="flex flex-1 items-center justify-center text-muted-foreground">
          <p className="text-sm">{t("routines.selectRoutine")}</p>
        </div>
      </div>
    );
  }

  const isActive = r.status === "active";
  const runs = r.runs ?? [];

  return (
    <div className="relative flex h-full flex-col">
      <WindowChrome className="h-10" />
      <div className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-3xl px-8 pt-4 pb-16">
          <button
            type="button"
            onClick={() => {
              selectRoutine(null);
              navigate("/routines");
            }}
            className="mb-6 inline-flex items-center gap-0.5 text-sm text-muted-foreground hover:text-foreground"
          >
            <ChevronLeft className="h-4 w-4" />
            {t("routines.backToAll")}
          </button>

          <div className="mb-8 flex items-start justify-between gap-6">
            <div className="min-w-0 flex-1">
              <h1 className="mb-3 truncate text-3xl font-semibold tracking-tight">{r.name}</h1>
              <div className="flex flex-wrap items-center gap-3">
                <Switch
                  checked={isActive}
                  onCheckedChange={() => toggleRoutine(r.id)}
                  aria-label={isActive ? t("routines.pause") : t("routines.resume")}
                />
                <StatusPill status={r.status} />
                {isActive && r.nextRunAt ? (
                  <span className="text-sm text-muted-foreground">
                    {t("routines.nextRunInline", { when: formatNextRun(r.nextRunAt) })}
                  </span>
                ) : null}
              </div>
            </div>

            <div className="flex shrink-0 items-center gap-1">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-9 w-9 text-muted-foreground hover:text-foreground"
                title={t("routines.edit")}
                onClick={() => setDialogOpen(true)}
              >
                <Pencil className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-9 w-9 text-muted-foreground hover:text-destructive"
                title={t("routines.delete")}
                onClick={() => removeRoutine(r.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                className="ml-1 h-9 px-3.5"
                onClick={() => {
                  runNow(r.id);
                  setToastOpen(true);
                }}
              >
                <Play className="mr-1.5 h-3.5 w-3.5 fill-current" />
                {t("routines.runNow")}
              </Button>
            </div>
          </div>

          <div className="space-y-8">
            <Section title={t("routines.repeats")}>
              <p className="text-base">{describeTrigger(r, t)}</p>
            </Section>

            <Section title={t("routines.connectors")}>
              {r.connectors.length === 0 ? (
                <p className="text-sm text-muted-foreground">—</p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {r.connectors.map((c) => (
                    <ConnectorBadge key={c} service={c} />
                  ))}
                </div>
              )}
            </Section>

            {r.description ? (
              <Section title={t("routines.instructions")}>
                <div className="rounded-lg bg-accent/50 px-4 py-3 text-sm leading-relaxed">
                  {r.description}
                </div>
              </Section>
            ) : null}

            <Section title={t("routines.runs")}>
              {runs.length === 0 ? (
                <p className="text-sm text-muted-foreground">{t("routines.noRuns")}</p>
              ) : (
                <ul className="space-y-1">
                  {runs.map((run) => (
                    <RunRow key={run.id} run={run} />
                  ))}
                </ul>
              )}
            </Section>
          </div>
        </div>
      </div>

      {toastOpen ? (
        <div className="pointer-events-none absolute right-6 top-4 z-50">
          <div className="pointer-events-auto flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 text-sm shadow-md">
            <span className="flex h-4 w-4 items-center justify-center rounded-full border border-muted-foreground/40 text-[10px] text-muted-foreground">
              i
            </span>
            <span>{t("routines.runStarted")}</span>
            <button
              type="button"
              onClick={() => setToastOpen(false)}
              className="ml-2 text-muted-foreground hover:text-foreground"
              aria-label="dismiss"
            >
              ×
            </button>
          </div>
        </div>
      ) : null}

      <CreateRoutineDialog open={dialogOpen} onOpenChange={setDialogOpen} />
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }): ReactElement {
  return (
    <section>
      <h3 className="mb-2 text-sm font-medium text-muted-foreground">{title}</h3>
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

function RunRow({ run }: { run: RoutineRun }): ReactElement {
  const t = useT();
  return (
    <li className="flex items-center gap-3 rounded-md px-2 py-2 hover:bg-accent/40">
      <RunStatusIcon status={run.status} />
      <span className="text-sm">{formatRunStartedAt(run.startedAt)}</span>
      <span className="rounded-sm bg-muted px-1.5 py-0.5 text-[10px] font-semibold tracking-wider text-muted-foreground">
        {run.kind === "manual" ? t("routines.runManual") : t("routines.runScheduled")}
      </span>
    </li>
  );
}

function RunStatusIcon({ status }: { status: RoutineRun["status"] }): ReactElement {
  if (status === "running")
    return <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />;
  if (status === "success") return <CircleCheck className="h-4 w-4 text-nexu-online" />;
  return <CircleX className="h-4 w-4 text-destructive" />;
}
