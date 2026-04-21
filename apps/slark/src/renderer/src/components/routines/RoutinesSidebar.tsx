import { Button, cn } from "@nexu-design/ui-web";
import { Clock, Github, Plug, Plus, Webhook } from "lucide-react";
import { useState } from "react";

import { useT } from "@/i18n";
import { useRoutinesStore } from "@/stores/routines";
import type { RoutineTriggerKind } from "@/types";

import { CreateRoutineDialog } from "./CreateRoutineDialog";

const triggerIcons: Record<RoutineTriggerKind, React.ElementType> = {
  schedule: Clock,
  github: Github,
  api: Webhook,
  connector: Plug,
};

export function RoutinesSidebar(): React.ReactElement {
  const t = useT();
  const { routines, selectedRoutineId, selectRoutine } = useRoutinesStore();
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <div className="flex h-full flex-col">
      <div className="px-3 pb-2 flex items-center justify-between">
        <span className="text-xs text-nav-muted">
          {t("routines.count", { count: String(routines.length) })}
        </span>
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          onClick={() => setDialogOpen(true)}
          className="text-nav-muted hover:text-nav-fg"
          title={t("routines.newRoutine")}
        >
          <Plus className="h-3.5 w-3.5" />
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto px-2 pb-3">
        {routines.length === 0 ? (
          <div className="px-3 py-6 text-center">
            <p className="text-xs text-nav-muted mb-3">{t("routines.emptyTitle")}</p>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setDialogOpen(true)}
              className="h-7 px-2.5 text-xs"
            >
              <Plus className="h-3 w-3 mr-1" />
              {t("routines.newRoutine")}
            </Button>
          </div>
        ) : (
          routines.map((r) => {
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
                  "flex items-center gap-2.5 w-full px-2 py-2 rounded-md transition-colors",
                  active
                    ? "bg-nav-active text-nav-active-fg"
                    : "text-nav-muted hover:bg-nav-hover hover:text-nav-fg",
                )}
              >
                <Icon className="h-4 w-4 shrink-0" />
                <div className="min-w-0 flex-1 text-left">
                  <div className="text-sm font-medium truncate">{r.name}</div>
                  <div className="text-xs text-nav-muted truncate">
                    {r.trigger.kind === "schedule" &&
                      (r.trigger.cron ?? t("routines.triggerSchedule"))}
                    {r.trigger.kind === "github" &&
                      `${r.trigger.githubRepo ?? "GitHub"} · ${r.trigger.githubEvent ?? "event"}`}
                    {r.trigger.kind === "api" && t("routines.triggerApi")}
                    {r.trigger.kind === "connector" &&
                      (r.trigger.connectorService ?? t("routines.triggerConnector"))}
                  </div>
                </div>
                <div
                  className={cn(
                    "h-2 w-2 rounded-full shrink-0",
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

      <CreateRoutineDialog open={dialogOpen} onOpenChange={setDialogOpen} />
    </div>
  );
}
