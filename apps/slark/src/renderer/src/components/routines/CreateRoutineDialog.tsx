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
  SelectTrigger,
  SelectValue,
  Textarea,
  cn,
} from "@nexu-design/ui-web";
import { AlertTriangle, Bot, Clock, Github, Plug, Plus, UserPlus, Webhook, X } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { useT, type TranslationKey } from "@/i18n";
import { useAgentsStore } from "@/stores/agents";
import { useRoutinesStore } from "@/stores/routines";
import { useWorkspaceStore } from "@/stores/workspace";
import type { ConnectorService, Routine, RoutineTrigger, RoutineTriggerKind } from "@/types";

interface CreateRoutineDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const allConnectors: { service: ConnectorService; name: string; color: string }[] = [
  { service: "figma", name: "Figma", color: "bg-[#F24E1E]" },
  { service: "linear", name: "Linear", color: "bg-[#5E6AD2]" },
  { service: "notion", name: "Notion", color: "bg-foreground" },
  { service: "slack", name: "Slack", color: "bg-[#4A154B]" },
  { service: "github", name: "GitHub", color: "bg-foreground" },
  { service: "gmail", name: "Gmail", color: "bg-[#EA4335]" },
];

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
    kind: "github",
    icon: Github,
    labelKey: "routines.triggerGithub",
    descKey: "routines.triggerGithubDesc",
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
}: CreateRoutineDialogProps): React.ReactElement {
  const t = useT();
  const navigate = useNavigate();
  const agents = useAgentsStore((s) => s.agents);
  const repositories = useWorkspaceStore((s) => s.repositories);
  const addRoutine = useRoutinesStore((s) => s.addRoutine);
  const selectRoutine = useRoutinesStore((s) => s.selectRoutine);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [agentId, setAgentId] = useState<string>("");
  const [triggerKind, setTriggerKind] = useState<RoutineTriggerKind>("schedule");
  const [cron, setCron] = useState("0 9 * * 1-5");
  const [githubRepo, setGithubRepo] = useState<string>("");
  const [githubEvent, setGithubEvent] = useState<"push" | "pull_request" | "issues" | "release">(
    "pull_request",
  );
  const [connectorService, setConnectorService] = useState<ConnectorService>("slack");
  const [connectors, setConnectors] = useState<ConnectorService[]>([
    "figma",
    "linear",
    "notion",
    "slack",
  ]);
  const [detailsTab, setDetailsTab] = useState<"connectors" | "permissions">("connectors");

  const reset = (): void => {
    setName("");
    setDescription("");
    setAgentId("");
    setTriggerKind("schedule");
    setCron("0 9 * * 1-5");
    setGithubRepo("");
    setGithubEvent("pull_request");
    setConnectorService("slack");
    setConnectors(["figma", "linear", "notion", "slack"]);
    setDetailsTab("connectors");
  };

  const toggleConnector = (s: ConnectorService): void => {
    setConnectors((prev) => (prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]));
  };

  const githubDisabled = !githubRepo;

  const canCreate = (() => {
    if (!name.trim()) return false;
    if (triggerKind === "github" && !githubRepo) return false;
    return true;
  })();

  const handleCreate = (): void => {
    if (!canCreate) return;
    const trigger: RoutineTrigger =
      triggerKind === "schedule"
        ? { kind: "schedule", cron: cron.trim() || "0 9 * * *" }
        : triggerKind === "github"
          ? { kind: "github", githubRepo, githubEvent }
          : triggerKind === "api"
            ? { kind: "api" }
            : { kind: "connector", connectorService };

    const routine: Routine = {
      id: `ro-${Date.now()}`,
      name: name.trim(),
      description: description.trim(),
      agentId: agentId || null,
      trigger,
      connectors,
      status: "active",
      createdBy: "u-1",
      createdAt: Date.now(),
    };

    addRoutine(routine);
    selectRoutine(routine.id);
    onOpenChange(false);
    reset();
  };

  const availableConnectors = allConnectors.filter((c) => !connectors.includes(c.service));

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        onOpenChange(next);
        if (!next) reset();
      }}
    >
      <DialogContent size="md">
        <DialogHeader>
          <DialogTitle>{t("routines.createRoutineTitle")}</DialogTitle>
        </DialogHeader>

        <DialogBody>
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

            <FormField label={t("agent.description")}>
              <FormFieldControl>
                <Textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder={t("routines.descPlaceholder")}
                  rows={3}
                />
              </FormFieldControl>
            </FormField>

            <FormField label={t("routines.agent")}>
              <FormFieldControl>
                {agents.length === 0 ? (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      onOpenChange(false);
                      navigate("/agents");
                    }}
                    className="w-full justify-start"
                  >
                    <UserPlus className="h-4 w-4 mr-2" />
                    {t("routines.createAgentForRoutine")}
                  </Button>
                ) : (
                  <Select value={agentId} onValueChange={setAgentId}>
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
                    </SelectContent>
                  </Select>
                )}
                {agents.length > 0 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="inline"
                    onClick={() => {
                      onOpenChange(false);
                      navigate("/agents");
                    }}
                    className="mt-1.5 text-xs text-muted-foreground hover:text-foreground"
                  >
                    <Plus className="h-3 w-3 mr-1" />
                    {t("routines.createAgentForRoutine")}
                  </Button>
                )}
              </FormFieldControl>
            </FormField>

            <div>
              <p className="text-sm font-medium mb-2">{t("routines.trigger")}</p>
              <div className="space-y-2">
                {triggerOptions.map((opt) => {
                  const OptIcon = opt.icon;
                  const disabled =
                    opt.kind === "github" && githubDisabled && triggerKind !== "github";
                  const selected = triggerKind === opt.kind;
                  return (
                    <button
                      type="button"
                      key={opt.kind}
                      disabled={disabled}
                      onClick={() => setTriggerKind(opt.kind)}
                      className={cn(
                        "flex items-start gap-3 w-full px-3 py-2.5 rounded-lg border text-left transition-colors",
                        selected
                          ? "border-foreground/80 bg-accent/50"
                          : "border-border hover:bg-accent/40",
                        disabled && "opacity-50 cursor-not-allowed",
                      )}
                    >
                      <OptIcon className="h-4 w-4 mt-0.5 shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium">{t(opt.labelKey)}</div>
                        <div className="text-xs text-muted-foreground">{t(opt.descKey)}</div>
                      </div>
                      {opt.kind === "github" && githubDisabled && (
                        <span className="text-xs text-muted-foreground">
                          {t("routines.triggerGithubNeedRepo")}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              {triggerKind === "schedule" && (
                <div className="mt-3">
                  <Input
                    value={cron}
                    onChange={(e) => setCron(e.target.value)}
                    placeholder={t("routines.cronPlaceholder")}
                    className="font-mono text-sm"
                  />
                  <p className="text-xs text-muted-foreground mt-1">{t("routines.cronHint")}</p>
                </div>
              )}
              {triggerKind === "github" && (
                <div className="mt-3 space-y-2">
                  {repositories.length > 0 ? (
                    <Select value={githubRepo} onValueChange={setGithubRepo}>
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
                      value={githubRepo}
                      onChange={(e) => setGithubRepo(e.target.value)}
                      placeholder={t("routines.repoPlaceholder")}
                      className="font-mono text-sm"
                    />
                  )}
                  <Select
                    value={githubEvent}
                    onValueChange={(v) => setGithubEvent(v as typeof githubEvent)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="push">push</SelectItem>
                      <SelectItem value="pull_request">pull_request</SelectItem>
                      <SelectItem value="issues">issues</SelectItem>
                      <SelectItem value="release">release</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
              {triggerKind === "connector" && (
                <div className="mt-3">
                  <Select
                    value={connectorService}
                    onValueChange={(v) => setConnectorService(v as ConnectorService)}
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
                </div>
              )}
            </div>

            <div>
              <div className="flex items-center gap-4 border-b border-border mb-3">
                <button
                  type="button"
                  onClick={() => setDetailsTab("connectors")}
                  className={cn(
                    "pb-2 text-sm font-medium transition-colors flex items-center gap-1.5",
                    detailsTab === "connectors"
                      ? "text-foreground border-b-2 border-foreground -mb-px"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {t("routines.connectors")}
                  <span className="text-xs bg-accent rounded-full px-1.5 py-0.5">
                    {connectors.length}
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => setDetailsTab("permissions")}
                  className={cn(
                    "pb-2 text-sm font-medium transition-colors",
                    detailsTab === "permissions"
                      ? "text-foreground border-b-2 border-foreground -mb-px"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {t("routines.permissions")}
                </button>
              </div>

              {detailsTab === "connectors" ? (
                <div className="space-y-3">
                  <p className="text-xs text-muted-foreground">{t("routines.connectorsHint")}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {connectors.map((svc) => {
                      const meta = allConnectors.find((c) => c.service === svc);
                      return (
                        <div
                          key={svc}
                          className="flex items-center gap-1.5 rounded-md border border-border bg-surface-0 pl-2 pr-1 py-1 text-xs"
                        >
                          <span
                            className={cn("h-2.5 w-2.5 rounded-sm", meta?.color ?? "bg-accent")}
                          />
                          <span>{meta?.name ?? svc}</span>
                          <button
                            type="button"
                            onClick={() => toggleConnector(svc)}
                            className="ml-0.5 text-muted-foreground hover:text-foreground"
                            aria-label={`remove ${svc}`}
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      );
                    })}
                    {availableConnectors.length > 0 && (
                      <AddConnectorButton
                        label={t("routines.addConnector")}
                        options={availableConnectors}
                        onAdd={(svc) => toggleConnector(svc)}
                      />
                    )}
                  </div>
                  <div className="flex items-start gap-2 rounded-lg border border-nexu-warning/30 bg-nexu-warning/10 px-3 py-2 text-xs text-foreground/80">
                    <AlertTriangle className="h-3.5 w-3.5 mt-0.5 shrink-0 text-nexu-warning" />
                    <p>{t("routines.connectorsWarning")}</p>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground py-4 text-center">
                  {t("routines.permissions")} · coming soon
                </p>
              )}
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
    </Dialog>
  );
}

function AddConnectorButton({
  label,
  options,
  onAdd,
}: {
  label: string;
  options: { service: ConnectorService; name: string; color: string }[];
  onAdd: (s: ConnectorService) => void;
}): React.ReactElement {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-1 rounded-md border border-dashed border-border px-2 py-1 text-xs text-muted-foreground hover:text-foreground hover:border-foreground/40"
      >
        <Plus className="h-3 w-3" />
        {label}
      </button>
      {open && (
        <div className="absolute left-0 top-full mt-1 z-50 min-w-[160px] rounded-lg border border-border bg-popover shadow-lg py-1">
          {options.map((opt) => (
            <button
              key={opt.service}
              type="button"
              onClick={() => {
                onAdd(opt.service);
                setOpen(false);
              }}
              className="flex items-center gap-2 w-full px-2.5 py-1.5 text-left text-xs hover:bg-accent"
            >
              <span className={cn("h-2.5 w-2.5 rounded-sm", opt.color)} />
              {opt.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
