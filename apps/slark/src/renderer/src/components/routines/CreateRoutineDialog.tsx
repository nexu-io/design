import {
  Button,
  Dialog,
  DialogBody,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  FormField,
  FormFieldControl,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
  Textarea,
  cn,
} from "@nexu-design/ui-web";
import { ArrowLeft, Bot, Clock, Info, Pencil, Plug, Plus, UserPlus, Webhook } from "lucide-react";
import { useEffect, useState } from "react";

import { CreateAgentDialog } from "@/components/agents/CreateAgentDialog";
import { useT, type TranslationKey } from "@/i18n";
import { useAgentsStore } from "@/stores/agents";
import { useRoutinesStore } from "@/stores/routines";
import { useWorkspaceStore } from "@/stores/workspace";
import type { ConnectorService, Routine, RoutineTrigger, RoutineTriggerKind } from "@/types";

export interface RoutineTemplateInitial {
  name?: string;
  description?: string;
  triggerKind?: RoutineTriggerKind;
  scheduleMode?: "hourly" | "daily" | "weekdays" | "weekly" | "custom";
  scheduleHour?: number;
  scheduleMinute?: number;
  scheduleDow?: number;
  customCron?: string;
  connectorService?: ConnectorService;
  connectorEvent?: string;
  connectorTarget?: string;
}

interface CreateRoutineDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  channelId: string;
  template?: RoutineTemplateInitial;
}

const allConnectors: { service: ConnectorService; name: string; color: string }[] = [
  { service: "figma", name: "Figma", color: "bg-[#F24E1E]" },
  { service: "linear", name: "Linear", color: "bg-[#5E6AD2]" },
  { service: "notion", name: "Notion", color: "bg-foreground" },
  { service: "slack", name: "Slack", color: "bg-[#4A154B]" },
  { service: "github", name: "GitHub", color: "bg-foreground" },
  { service: "gmail", name: "Gmail", color: "bg-[#EA4335]" },
];

const connectorEventOptions: Record<ConnectorService, { value: string; label: string }[]> = {
  figma: [
    { value: "file_update", label: "File updated" },
    { value: "file_comment", label: "New comment" },
    { value: "file_version_update", label: "Version published" },
  ],
  linear: [
    { value: "issue_create", label: "Issue created" },
    { value: "issue_update", label: "Issue updated" },
    { value: "issue_status_change", label: "Issue status changed" },
    { value: "comment_create", label: "New comment" },
  ],
  notion: [
    { value: "page_update", label: "Page updated" },
    { value: "page_create", label: "Page created" },
    { value: "database_update", label: "Database row updated" },
  ],
  slack: [
    { value: "message_posted", label: "Message posted" },
    { value: "mention", label: "Mentioned" },
    { value: "reaction_added", label: "Reaction added" },
  ],
  github: [
    { value: "push", label: "Push" },
    { value: "pull_request", label: "Pull request" },
    { value: "issues", label: "Issues" },
    { value: "release", label: "Release" },
  ],
  gmail: [
    { value: "message_received", label: "New email received" },
    { value: "label_added", label: "Label added" },
  ],
};

const triggerOptions: {
  kind: RoutineTriggerKind;
  icon: React.ElementType;
  labelKey: TranslationKey;
  descKey: TranslationKey;
}[] = [
  {
    kind: "schedule",
    icon: Clock,
    labelKey: "routines.triggerSchedule",
    descKey: "routines.triggerScheduleDesc",
  },
  {
    kind: "api",
    icon: Webhook,
    labelKey: "routines.triggerApi",
    descKey: "routines.triggerApiDesc",
  },
  {
    kind: "connector",
    icon: Plug,
    labelKey: "routines.triggerConnector",
    descKey: "routines.triggerConnectorDesc",
  },
];

export function CreateRoutineDialog({
  open,
  onOpenChange,
  channelId,
  template,
}: CreateRoutineDialogProps): React.ReactElement {
  const t = useT();
  const agents = useAgentsStore((s) => s.agents);
  const repositories = useWorkspaceStore((s) => s.repositories);
  const addRoutine = useRoutinesStore((s) => s.addRoutine);
  const selectRoutine = useRoutinesStore((s) => s.selectRoutine);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [agentId, setAgentId] = useState<string>("");
  const [triggerKind, setTriggerKind] = useState<RoutineTriggerKind | null>(null);
  const [scheduleMode, setScheduleMode] =
    useState<"hourly" | "daily" | "weekdays" | "weekly" | "custom">("weekdays");
  const [scheduleMinute, setScheduleMinute] = useState<number>(0);
  const [scheduleHour, setScheduleHour] = useState<number>(9);
  const [scheduleDow, setScheduleDow] = useState<number>(1);
  const [customCron, setCustomCron] = useState("0 9 * * 1-5");
  const [connectorService, setConnectorService] = useState<ConnectorService>("slack");
  const [connectorEvent, setConnectorEvent] = useState<string>(
    connectorEventOptions.slack[0].value,
  );
  const [connectorTarget, setConnectorTarget] = useState<string>("");
  const [triggerConfigOpen, setTriggerConfigOpen] = useState(false);
  const [createAgentOpen, setCreateAgentOpen] = useState(false);
  const [agentSelectOpen, setAgentSelectOpen] = useState(false);

  useEffect(() => {
    if (!open || !template) return;
    if (template.name !== undefined) setName(template.name);
    if (template.description !== undefined) setDescription(template.description);
    if (template.triggerKind !== undefined) setTriggerKind(template.triggerKind);
    if (template.scheduleMode !== undefined) setScheduleMode(template.scheduleMode);
    if (template.scheduleHour !== undefined) setScheduleHour(template.scheduleHour);
    if (template.scheduleMinute !== undefined) setScheduleMinute(template.scheduleMinute);
    if (template.scheduleDow !== undefined) setScheduleDow(template.scheduleDow);
    if (template.customCron !== undefined) setCustomCron(template.customCron);
    if (template.connectorService !== undefined) {
      setConnectorService(template.connectorService);
      setConnectorEvent(
        template.connectorEvent ?? connectorEventOptions[template.connectorService][0].value,
      );
    } else if (template.connectorEvent !== undefined) {
      setConnectorEvent(template.connectorEvent);
    }
    if (template.connectorTarget !== undefined) setConnectorTarget(template.connectorTarget);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const reset = (): void => {
    setName("");
    setDescription("");
    setAgentId("");
    setTriggerKind(null);
    setScheduleMode("weekdays");
    setScheduleMinute(0);
    setScheduleHour(9);
    setScheduleDow(1);
    setCustomCron("0 9 * * 1-5");
    setConnectorService("slack");
    setConnectorEvent(connectorEventOptions.slack[0].value);
    setConnectorTarget("");
    setTriggerConfigOpen(false);
  };

  const cron = buildCron({
    mode: scheduleMode,
    minute: scheduleMinute,
    hour: scheduleHour,
    dow: scheduleDow,
    custom: customCron,
  });

  const triggerSummary = (() => {
    if (triggerKind === "schedule") return describeScheduleSummary(scheduleMode, scheduleHour, scheduleMinute, scheduleDow, customCron);
    if (triggerKind === "api") return "POST webhook — generated after create";
    const eventLabel =
      connectorEventOptions[connectorService].find((e) => e.value === connectorEvent)?.label ??
      connectorEvent;
    const serviceName =
      allConnectors.find((c) => c.service === connectorService)?.name ?? connectorService;
    const target = connectorTarget ? ` · ${connectorTarget}` : "";
    return `${serviceName} · ${eventLabel}${target}`;
  })();

  const canCreate =
    name.trim().length > 0 && description.trim().length > 0 && triggerKind !== null;

  const handleCreate = (): void => {
    if (!canCreate || triggerKind === null) return;
    const trigger: RoutineTrigger =
      triggerKind === "schedule"
        ? { kind: "schedule", cron: cron.trim() || "0 9 * * *" }
        : triggerKind === "api"
          ? { kind: "api" }
          : {
              kind: "connector",
              connectorService,
              connectorEvent,
              ...(connectorTarget ? { connectorTarget } : {}),
            };

    const routine: Routine = {
      id: `ro-${Date.now()}`,
      channelId,
      name: name.trim(),
      description: description.trim(),
      agentId: agentId || null,
      trigger,
      status: "active",
      createdBy: "u-1",
      createdAt: Date.now(),
    };

    addRoutine(routine);
    selectRoutine(routine.id);
    onOpenChange(false);
    reset();
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        onOpenChange(next);
        if (!next) reset();
      }}
    >
      <DialogContent size="md" className="flex max-h-[85vh] flex-col">
        <DialogHeader>
          <DialogTitle>{t("routines.createRoutineTitle")}</DialogTitle>
        </DialogHeader>

        <DialogBody className="min-h-0 flex-1 overflow-y-auto">
          <div className="space-y-5">
            <FormField
              label={
                <span>
                  {t("agent.name") as string} <span className="text-destructive">*</span>
                </span>
              }
            >
              <FormFieldControl>
                <Input
                  autoFocus
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={t("routines.namePlaceholder")}
                />
              </FormFieldControl>
            </FormField>

            <FormField
              label={
                <span>
                  {t("agent.description") as string}{" "}
                  <span className="text-destructive">*</span>
                </span>
              }
            >
              <FormFieldControl>
                <Textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder={`Example:
• What the agent should do each run (e.g. review open PRs in nexu/design)
• What inputs it should look at (labels, files, authors)
• What it should produce (a digest message in #dev-review, an issue comment, etc.)`}
                  rows={5}
                />
                {description.trim().length === 0 && (
                  <p className="mt-1.5 text-xs text-muted-foreground">
                    Describe the task in plain language — goal, inputs, and the output
                    you expect. The agent uses this as its instructions every run.
                  </p>
                )}
              </FormFieldControl>
            </FormField>

            <FormField label={t("routines.agent")}>
              <FormFieldControl>
                {agents.length === 0 ? (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setCreateAgentOpen(true)}
                    className="w-full justify-start"
                  >
                    <UserPlus className="h-4 w-4 mr-2" />
                    {t("routines.createAgentForRoutine")}
                  </Button>
                ) : (
                  <Select
                    open={agentSelectOpen}
                    onOpenChange={setAgentSelectOpen}
                    value={agentId}
                    onValueChange={setAgentId}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={t("routines.selectAgent")} />
                    </SelectTrigger>
                    <SelectContent>
                      {agents.map((a) => (
                        <SelectItem key={a.id} value={a.id}>
                          <div className="flex items-center gap-2">
                            {a.avatar ? (
                              <img src={a.avatar} alt="" className="h-4 w-4 rounded" />
                            ) : (
                              <Bot className="h-4 w-4" />
                            )}
                            <span>{a.name}</span>
                          </div>
                        </SelectItem>
                      ))}
                      <SelectSeparator />
                      <button
                        type="button"
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => {
                          setAgentSelectOpen(false);
                          setCreateAgentOpen(true);
                        }}
                        className="relative flex w-full cursor-default select-none items-center gap-2 rounded-lg py-2 pl-3 pr-8 text-sm text-muted-foreground outline-none hover:bg-surface-2 hover:text-foreground"
                      >
                        <Plus className="h-4 w-4" />
                        <span>{t("routines.createAgentForRoutine")}</span>
                      </button>
                    </SelectContent>
                  </Select>
                )}
              </FormFieldControl>
            </FormField>

            <div>
              <p className="text-sm font-medium mb-2">{t("routines.trigger")}</p>
              <div className="space-y-2">
                {triggerOptions.map((opt) => {
                  const OptIcon = opt.icon;
                  const selected = triggerKind === opt.kind;
                  return (
                    <button
                      type="button"
                      key={opt.kind}
                      onClick={() => {
                        setTriggerKind(opt.kind);
                        setTriggerConfigOpen(true);
                      }}
                      className={cn(
                        "flex items-start gap-3 w-full px-3 py-2.5 rounded-lg border text-left transition-colors",
                        selected
                          ? "border-foreground/80 bg-accent/50"
                          : "border-border hover:bg-accent/40",
                      )}
                    >
                      <OptIcon className="h-4 w-4 mt-0.5 shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium">{t(opt.labelKey)}</div>
                        <div className="text-xs text-muted-foreground truncate">
                          {selected ? triggerSummary : t(opt.descKey)}
                        </div>
                      </div>
                      {selected ? (
                        <Pencil className="h-3.5 w-3.5 mt-1 shrink-0 text-muted-foreground" />
                      ) : null}
                    </button>
                  );
                })}
              </div>

            </div>

          </div>
        </DialogBody>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {t("common.cancel")}
          </Button>
          <Button onClick={handleCreate} disabled={!canCreate}>
            {t("common.create")}
          </Button>
        </DialogFooter>
      </DialogContent>
      <CreateAgentDialog
        open={createAgentOpen}
        onOpenChange={setCreateAgentOpen}
        onCreated={(agent) => setAgentId(agent.id)}
      />

      <Dialog open={triggerConfigOpen} onOpenChange={setTriggerConfigOpen}>
        <DialogContent size="md" className="flex max-h-[85vh] flex-col">
          <DialogHeader>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setTriggerConfigOpen(false)}
                className="-ml-1 flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground hover:bg-accent hover:text-foreground"
                aria-label="Back"
              >
                <ArrowLeft className="h-4 w-4" />
              </button>
              <DialogTitle className="flex-1">
                {triggerKind === "schedule" && "Configure schedule"}
                {triggerKind === "api" && "Configure API trigger"}
                {triggerKind === "connector" && "Configure connector event"}
              </DialogTitle>
            </div>
          </DialogHeader>
          <DialogBody className="min-h-0 flex-1 space-y-4 overflow-y-auto">
            {triggerKind === "schedule" && (
              <div className="space-y-4">
                <div className="flex flex-wrap gap-1.5">
                  {(
                    [
                      { id: "hourly", label: "Hourly" },
                      { id: "daily", label: "Daily" },
                      { id: "weekdays", label: "Weekdays" },
                      { id: "weekly", label: "Weekly" },
                      { id: "custom", label: "Custom" },
                    ] as const
                  ).map((m) => (
                    <button
                      type="button"
                      key={m.id}
                      onClick={() => setScheduleMode(m.id)}
                      className={cn(
                        "inline-flex h-7 items-center rounded-md border px-2.5 text-xs font-medium transition-colors",
                        scheduleMode === m.id
                          ? "border-foreground/80 bg-accent/60 text-foreground"
                          : "border-border text-muted-foreground hover:bg-accent/40 hover:text-foreground",
                      )}
                    >
                      {m.label}
                    </button>
                  ))}
                </div>

                {scheduleMode === "hourly" && (
                  <label className="flex flex-col gap-1 text-xs text-muted-foreground">
                    At minute
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        min={0}
                        max={59}
                        value={scheduleMinute}
                        onChange={(e) =>
                          setScheduleMinute(clamp(Number(e.target.value), 0, 59))
                        }
                        className="w-24 font-mono text-sm"
                      />
                      <span className="text-xs">every hour</span>
                    </div>
                  </label>
                )}
                {scheduleMode === "daily" && (
                  <TimeOfDayPicker
                    hour={scheduleHour}
                    minute={scheduleMinute}
                    onChange={(h, mm) => {
                      setScheduleHour(h);
                      setScheduleMinute(mm);
                    }}
                    suffix="every day"
                  />
                )}
                {scheduleMode === "weekdays" && (
                  <TimeOfDayPicker
                    hour={scheduleHour}
                    minute={scheduleMinute}
                    onChange={(h, mm) => {
                      setScheduleHour(h);
                      setScheduleMinute(mm);
                    }}
                    suffix="Mon–Fri"
                  />
                )}
                {scheduleMode === "weekly" && (
                  <div className="flex flex-wrap items-end gap-3">
                    <label className="flex flex-col gap-1 text-xs text-muted-foreground">
                      Day
                      <Select
                        value={String(scheduleDow)}
                        onValueChange={(v) => setScheduleDow(Number(v))}
                      >
                        <SelectTrigger className="w-36">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {[
                            "Sunday",
                            "Monday",
                            "Tuesday",
                            "Wednesday",
                            "Thursday",
                            "Friday",
                            "Saturday",
                          ].map((d, i) => (
                            <SelectItem key={d} value={String(i)}>
                              {d}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </label>
                    <TimeOfDayPicker
                      hour={scheduleHour}
                      minute={scheduleMinute}
                      onChange={(h, mm) => {
                        setScheduleHour(h);
                        setScheduleMinute(mm);
                      }}
                    />
                  </div>
                )}
                {scheduleMode === "custom" && (
                  <div>
                    <Input
                      value={customCron}
                      onChange={(e) => setCustomCron(e.target.value)}
                      placeholder={t("routines.cronPlaceholder")}
                      className="font-mono text-sm"
                    />
                    <p className="mt-1 text-xs text-muted-foreground">
                      {t("routines.cronHint")}
                    </p>
                  </div>
                )}

                <NextRunPreview cron={cron} />
              </div>
            )}

            {triggerKind === "api" && (
              <div className="space-y-3">
                <div className="flex items-start gap-2 rounded-lg border border-border bg-surface-1/60 px-3 py-2.5">
                  <Info className="mt-0.5 h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                  <div className="space-y-1 text-xs text-muted-foreground">
                    <p>
                      A webhook URL and signing secret will be generated after you create this
                      routine. You&apos;ll find them on the routine&apos;s detail page.
                    </p>
                    <p className="font-mono text-[11px] text-foreground/60">
                      POST https://api.nexu.app/routines/&lt;id&gt;/trigger
                    </p>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">
                  Send any JSON payload; the routine receives it as input.
                </p>
              </div>
            )}

            {triggerKind === "connector" && (
              <div className="space-y-3">
                <FormField label="Service">
                  <FormFieldControl>
                    <Select
                      value={connectorService}
                      onValueChange={(v) => {
                        const svc = v as ConnectorService;
                        setConnectorService(svc);
                        setConnectorEvent(connectorEventOptions[svc][0].value);
                        setConnectorTarget("");
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {allConnectors.map((c) => (
                          <SelectItem key={c.service} value={c.service}>
                            {c.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormFieldControl>
                </FormField>
                <FormField label="Event">
                  <FormFieldControl>
                    <Select value={connectorEvent} onValueChange={setConnectorEvent}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {connectorEventOptions[connectorService].map((e) => (
                          <SelectItem key={e.value} value={e.value}>
                            {e.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormFieldControl>
                </FormField>
                {connectorService === "github" && (
                  <FormField label={t("routines.selectRepo")}>
                    <FormFieldControl>
                      {repositories.length > 0 ? (
                        <Select value={connectorTarget} onValueChange={setConnectorTarget}>
                          <SelectTrigger>
                            <SelectValue placeholder={t("routines.selectRepo")} />
                          </SelectTrigger>
                          <SelectContent>
                            {repositories.map((repo) => (
                              <SelectItem key={repo.id} value={repo.name}>
                                {repo.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      ) : (
                        <Input
                          value={connectorTarget}
                          onChange={(e) => setConnectorTarget(e.target.value)}
                          placeholder={t("routines.repoPlaceholder")}
                          className="font-mono text-sm"
                        />
                      )}
                    </FormFieldControl>
                  </FormField>
                )}
              </div>
            )}
          </DialogBody>
          <DialogFooter>
            <Button onClick={() => setTriggerConfigOpen(false)}>{t("common.done")}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Dialog>
  );
}


function clamp(n: number, min: number, max: number): number {
  if (Number.isNaN(n)) return min;
  return Math.max(min, Math.min(max, Math.floor(n)));
}

function describeScheduleSummary(
  mode: "hourly" | "daily" | "weekdays" | "weekly" | "custom",
  hour: number,
  minute: number,
  dow: number,
  custom: string,
): string {
  const pad = (n: number): string => (n < 10 ? `0${n}` : String(n));
  const time = `${pad(hour)}:${pad(minute)}`;
  if (mode === "hourly") return `Every hour at :${pad(minute)}`;
  if (mode === "daily") return `Daily at ${time}`;
  if (mode === "weekdays") return `Weekdays at ${time}`;
  if (mode === "weekly") {
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    return `${days[dow] ?? "Mon"} at ${time}`;
  }
  return `Custom: ${custom}`;
}

function buildCron({
  mode,
  minute,
  hour,
  dow,
  custom,
}: {
  mode: "hourly" | "daily" | "weekdays" | "weekly" | "custom";
  minute: number;
  hour: number;
  dow: number;
  custom: string;
}): string {
  if (mode === "custom") return custom.trim() || "0 9 * * *";
  if (mode === "hourly") return `${minute} * * * *`;
  if (mode === "daily") return `${minute} ${hour} * * *`;
  if (mode === "weekdays") return `${minute} ${hour} * * 1-5`;
  return `${minute} ${hour} * * ${dow}`;
}

function NextRunPreview({ cron }: { cron: string }): React.ReactElement {
  const runs = nextCronRuns(cron, 3);
  if (runs.length === 0) {
    return (
      <div className="rounded-md border border-border bg-surface-1/60 px-3 py-2 text-xs text-muted-foreground">
        Couldn&apos;t parse this cron expression — double-check the syntax.
      </div>
    );
  }
  const [first, ...rest] = runs;
  return (
    <div className="rounded-md border border-border bg-surface-1/60 px-3 py-2.5 text-xs">
      <div className="text-muted-foreground">Next run</div>
      <div className="mt-0.5 text-sm font-medium text-foreground">
        {formatRun(first)}
        <span className="ml-1.5 text-xs font-normal text-muted-foreground">
          ({formatRelative(first)})
        </span>
      </div>
      {rest.length > 0 && (
        <div className="mt-2 flex flex-col gap-0.5 text-[11px] text-muted-foreground">
          <div className="font-semibold uppercase tracking-wider">Then</div>
          {rest.map((d) => (
            <div key={d.getTime()}>{formatRun(d)}</div>
          ))}
        </div>
      )}
    </div>
  );
}

function formatRun(d: Date): string {
  return d.toLocaleString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

function formatRelative(d: Date): string {
  const diff = d.getTime() - Date.now();
  if (diff < 0) return "now";
  const m = Math.round(diff / 60000);
  if (m < 1) return "in <1m";
  if (m < 60) return `in ${m}m`;
  const h = Math.round(m / 60);
  if (h < 24) return `in ${h}h`;
  const days = Math.round(h / 24);
  return `in ${days}d`;
}

function nextCronRuns(cron: string, count: number): Date[] {
  const parts = cron.trim().split(/\s+/);
  if (parts.length !== 5) return [];
  const minuteMatch = parseCronField(parts[0], 0, 59);
  const hourMatch = parseCronField(parts[1], 0, 23);
  const domMatch = parseCronField(parts[2], 1, 31);
  const monthMatch = parseCronField(parts[3], 1, 12);
  const dowMatch = parseCronField(parts[4], 0, 6);
  if (!minuteMatch || !hourMatch || !domMatch || !monthMatch || !dowMatch) return [];

  const runs: Date[] = [];
  const start = new Date();
  start.setSeconds(0, 0);
  start.setMinutes(start.getMinutes() + 1);
  const cursor = new Date(start);
  const maxIter = 366 * 24 * 60;
  let iter = 0;
  while (runs.length < count && iter < maxIter) {
    if (
      minuteMatch(cursor.getMinutes()) &&
      hourMatch(cursor.getHours()) &&
      domMatch(cursor.getDate()) &&
      monthMatch(cursor.getMonth() + 1) &&
      dowMatch(cursor.getDay())
    ) {
      runs.push(new Date(cursor));
    }
    cursor.setMinutes(cursor.getMinutes() + 1);
    iter++;
  }
  return runs;
}

function parseCronField(field: string, min: number, max: number): ((n: number) => boolean) | null {
  try {
    const parts = field.split(",");
    const tests: ((n: number) => boolean)[] = [];
    for (const p of parts) {
      const [rangePart, stepPart] = p.split("/");
      const step = stepPart ? Number(stepPart) : 1;
      if (!Number.isFinite(step) || step < 1) return null;
      let lo = min;
      let hi = max;
      if (rangePart !== "*") {
        if (rangePart.includes("-")) {
          const [a, b] = rangePart.split("-").map(Number);
          if (!Number.isFinite(a) || !Number.isFinite(b)) return null;
          lo = a;
          hi = b;
        } else {
          const n = Number(rangePart);
          if (!Number.isFinite(n)) return null;
          lo = n;
          hi = n;
        }
      }
      if (lo < min || hi > max || lo > hi) return null;
      tests.push((n) => n >= lo && n <= hi && (n - lo) % step === 0);
    }
    return (n) => tests.some((t) => t(n));
  } catch {
    return null;
  }
}

interface TimeOfDayPickerProps {
  hour: number;
  minute: number;
  onChange: (hour: number, minute: number) => void;
  suffix?: string;
}

function TimeOfDayPicker({
  hour,
  minute,
  onChange,
  suffix,
}: TimeOfDayPickerProps): React.ReactElement {
  const pad = (n: number): string => (n < 10 ? `0${n}` : String(n));
  const value = `${pad(hour)}:${pad(minute)}`;
  return (
    <label className="flex flex-col gap-1 text-xs text-muted-foreground">
      At time
      <div className="flex items-center gap-2">
        <Input
          type="time"
          value={value}
          onChange={(e) => {
            const [h, m] = e.target.value.split(":");
            onChange(clamp(Number(h), 0, 23), clamp(Number(m), 0, 59));
          }}
          className="w-32 font-mono text-sm"
        />
        {suffix ? <span className="text-xs">{suffix}</span> : null}
      </div>
    </label>
  );
}
