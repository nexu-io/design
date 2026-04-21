import { Button, cn } from "@nexu-design/ui-web";
import {
  Bot,
  Clock,
  Github,
  Pause,
  Play,
  Plug,
  Plus,
  Trash2,
  Webhook,
  Workflow,
} from "lucide-react";
import { useEffect, useState } from "react";
import type { ReactElement } from "react";
import { useNavigate } from "react-router-dom";

import { WindowChrome } from "@/components/layout/WindowChrome";
import { type TranslationKey, useT } from "@/i18n";
import { useAgentsStore } from "@/stores/agents";
import { useRoutinesStore } from "@/stores/routines";
import type { Routine, RoutineTriggerKind } from "@/types";

import { CreateRoutineDialog } from "./CreateRoutineDialog";

const triggerIcons: Record<RoutineTriggerKind, React.ElementType> = {
  schedule: Clock,
  github: Github,
  api: Webhook,
  connector: Plug,
};

const connectorLabels: Record<string, string> = {
  figma: "Figma",
  linear: "Linear",
  notion: "Notion",
  slack: "Slack",
  github: "GitHub",
  gmail: "Gmail",
};

const connectorColors: Record<string, string> = {
  figma: "bg-[#F24E1E]",
  linear: "bg-[#5E6AD2]",
  notion: "bg-foreground",
  slack: "bg-[#4A154B]",
  github: "bg-foreground",
  gmail: "bg-[#EA4335]",
};

function formatRelative(ts?: number, never?: string): string {
  if (!ts) return never ?? "—";
  const diff = ts - Date.now();
  const abs = Math.abs(diff);
  const mins = Math.round(abs / 60000);
  if (mins < 60) return diff < 0 ? `${mins} min ago` : `in ${mins} min`;
  const hours = Math.round(mins / 60);
  if (hours < 24) return diff < 0 ? `${hours}h ago` : `in ${hours}h`;
  const days = Math.round(hours / 24);
  return diff < 0 ? `${days}d ago` : `in ${days}d`;
}

export function RoutinesView(): ReactElement {
  const t = useT();
  const navigate = useNavigate();
  const { routines, selectedRoutineId, selectRoutine, toggleRoutine, removeRoutine } =
    useRoutinesStore();
  const agents = useAgentsStore((s) => s.agents);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    if (routines.length > 0 && !selectedRoutineId) selectRoutine(routines[0].id);
  }, [routines, selectedRoutineId, selectRoutine]);

  if (routines.length === 0) {
    return (
      <div className="flex h-full flex-col">
        <WindowChrome className="h-10" />
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-2xl mx-auto px-6 pt-16 pb-10 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-accent mb-3">
              <Workflow className="h-6 w-6" />
            </div>
            <h1 className="text-xl font-semibold mb-2">{t("routines.emptyTitle")}</h1>
            <p className="text-sm text-muted-foreground max-w-md mx-auto mb-6">
              {t("routines.emptyDesc")}
            </p>
            <Button type="button" onClick={() => setDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-1.5" />
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
        <div className="flex-1 flex items-center justify-center text-muted-foreground">
          <p className="text-sm">{t("routines.selectRoutine")}</p>
        </div>
      </div>
    );
  }

  const Icon = triggerIcons[r.trigger.kind];
  const agent = agents.find((a) => a.id === r.agentId);

  return (
    <div className="flex h-full flex-col">
      <WindowChrome className="h-10" />
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto px-6 pb-8 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 min-w-0">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent shrink-0">
                <Icon className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <h1 className="text-xl font-semibold truncate">{r.name}</h1>
                {r.description && (
                  <p className="text-sm text-muted-foreground truncate">{r.description}</p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <StatusBadge status={r.status} />
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => toggleRoutine(r.id)}
                title={r.status === "active" ? t("routines.pause") : t("routines.resume")}
                className="h-8 w-8"
              >
                {r.status === "active" ? (
                  <Pause className="h-3.5 w-3.5" />
                ) : (
                  <Play className="h-3.5 w-3.5" />
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => {
                  removeRoutine(r.id);
                }}
                title={t("routines.delete")}
                className="h-8 w-8 text-muted-foreground hover:text-destructive hover:border-destructive/30 hover:bg-destructive/10"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
              <Button
                type="button"
                onClick={() => setDialogOpen(true)}
                size="sm"
                className="h-8 px-3"
              >
                <Plus className="h-3.5 w-3.5 mr-1" />
                {t("routines.newRoutine")}
              </Button>
            </div>
          </div>

          <section className="rounded-xl border border-border p-4 text-sm space-y-3">
            <div className="grid grid-cols-2 gap-x-8 gap-y-3">
              <InfoRow label={t("routines.trigger")} value={formatTrigger(r, t)} />
              <InfoRow label={t("routines.agent")}>
                {agent ? (
                  <Button
                    type="button"
                    variant="ghost"
                    size="inline"
                    onClick={() => navigate(`/agents/${agent.id}`)}
                    className="flex items-center gap-2 hover:text-foreground"
                  >
                    {agent.avatar ? (
                      <img src={agent.avatar} alt="" className="h-5 w-5 rounded" />
                    ) : (
                      <Bot className="h-4 w-4" />
                    )}
                    <span className="font-medium">{agent.name}</span>
                  </Button>
                ) : (
                  <span className="text-muted-foreground">{t("routines.noAgent")}</span>
                )}
              </InfoRow>
              <InfoRow
                label={t("routines.lastRun")}
                value={formatRelative(r.lastRunAt, t("routines.never"))}
              />
              <InfoRow label={t("routines.nextRun")} value={formatRelative(r.nextRunAt, "—")} />
            </div>
          </section>

          <section className="rounded-xl border border-border p-4">
            <p className="text-sm font-semibold mb-3">{t("routines.connectors")}</p>
            {r.connectors.length === 0 ? (
              <p className="text-sm text-muted-foreground">—</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {r.connectors.map((c) => (
                  <div
                    key={c}
                    className="flex items-center gap-1.5 rounded-md border border-border px-2 py-1 text-xs"
                  >
                    <span
                      className={cn("h-2.5 w-2.5 rounded-sm", connectorColors[c] ?? "bg-accent")}
                    />
                    <span>{connectorLabels[c] ?? c}</span>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
      <CreateRoutineDialog open={dialogOpen} onOpenChange={setDialogOpen} />
    </div>
  );
}

function formatTrigger(r: Routine, t: (key: TranslationKey) => string): string {
  if (r.trigger.kind === "schedule") return r.trigger.cron ?? t("routines.triggerSchedule");
  if (r.trigger.kind === "github")
    return `${r.trigger.githubRepo ?? ""} · ${r.trigger.githubEvent ?? ""}`.trim();
  if (r.trigger.kind === "api") return t("routines.triggerApi");
  return r.trigger.connectorService ?? t("routines.triggerConnector");
}

function StatusBadge({ status }: { status: Routine["status"] }): ReactElement {
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
        "flex items-center gap-1.5 text-xs font-medium",
        status === "active" && "text-nexu-online",
        status === "paused" && "text-muted-foreground",
        status === "error" && "text-destructive",
      )}
    >
      <span
        className={cn(
          "h-2 w-2 rounded-full",
          status === "active" && "bg-nexu-online",
          status === "paused" && "bg-nexu-offline",
          status === "error" && "bg-destructive",
        )}
      />
      {label}
    </div>
  );
}

function InfoRow({
  label,
  value,
  children,
}: {
  label: string;
  value?: string;
  children?: React.ReactNode;
}): ReactElement {
  return (
    <div className="flex justify-between items-start py-1.5 border-b border-border/40">
      <span className="text-muted-foreground">{label}</span>
      <div className="text-right font-medium">{children ?? value}</div>
    </div>
  );
}
