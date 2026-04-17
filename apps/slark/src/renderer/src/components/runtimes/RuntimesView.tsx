import { useEffect, useMemo, useState } from "react";
import type { ElementType, ReactElement, ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Bot,
  Box,
  CircleAlert,
  Code,
  Cpu,
  MousePointer,
  Play,
  RefreshCw,
  RotateCw,
  Sparkles,
  Square,
  Terminal,
  Trash2,
  Wifi,
  Zap,
} from "lucide-react";
import {
  Alert,
  AlertDescription,
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  InteractiveRow,
  InteractiveRowContent,
  InteractiveRowLeading,
  InteractiveRowTrailing,
  PageHeader,
  StatCard,
  Tabs,
  TabsList,
  TabsTrigger,
  cn,
} from "@nexu-design/ui-web";

import { TitleBarSpacer } from "@/components/layout/WindowChrome";
import { useAgentsStore } from "@/stores/agents";
import { useRuntimesStore } from "@/stores/runtimes";
import type { Runtime } from "@/types";

const typeIcons: Record<Runtime["type"], ElementType> = {
  "claude-code": Terminal,
  cursor: MousePointer,
  opencode: Code,
  hermes: Cpu,
  codex: Box,
  "gemini-cli": Sparkles,
};

const providerLabels: Record<Runtime["type"], string> = {
  "claude-code": "Anthropic",
  cursor: "Cursor",
  opencode: "OpenCode",
  codex: "OpenAI",
  "gemini-cli": "Google",
  hermes: "Local",
};

const statusLabels: Record<Runtime["status"], string> = {
  connected: "Online",
  disconnected: "Offline",
  error: "Error",
};

const usagePeriods = ["7d", "30d", "90d"] as const;
type UsagePeriod = (typeof usagePeriods)[number];

interface UsageStats {
  input: string;
  output: string;
  cacheRead: string;
  cacheWrite: string;
  cost: string;
}

interface ModelRow {
  model: string;
  tokens: string;
  cost: string;
  color: string;
}

interface RuntimeData {
  usage: Record<UsagePeriod, UsageStats>;
  dailyDates: string[];
  dailyTokens: number[];
  dailyCosts: number[];
  models: ModelRow[];
  totalTokens: string;
  donutSegments: { percent: number; color: string }[];
  hourlyData: number[];
  createdAt: string;
  updatedAt: string;
}

const runtimeDataMap: Record<string, RuntimeData> = {
  "rt-1": {
    usage: {
      "7d": {
        input: "22.1K",
        output: "280K",
        cacheRead: "95.2M",
        cacheWrite: "8.1M",
        cost: "$3.82",
      },
      "30d": {
        input: "110.5K",
        output: "1.3M",
        cacheRead: "413.4M",
        cacheWrite: "34.7M",
        cost: "$16.57",
      },
      "90d": {
        input: "298K",
        output: "3.8M",
        cacheRead: "1.1B",
        cacheWrite: "89.2M",
        cost: "$42.30",
      },
    },
    dailyDates: [
      "3/29",
      "3/30",
      "4/1",
      "4/2",
      "4/10",
      "4/11",
      "4/12",
      "4/13",
      "4/14",
      "4/15",
      "4/16",
    ],
    dailyTokens: [12, 8, 0, 5, 18, 35, 80, 120, 280, 350, 410],
    dailyCosts: [0.8, 0.5, 0, 0.3, 1.2, 2.1, 4.5, 5.8, 6.2, 6.8, 8.1],
    totalTokens: "449.5M",
    donutSegments: [
      { percent: 74.7, color: "text-[var(--color-text-heading)]" },
      { percent: 20.4, color: "text-[var(--color-text-tertiary)]" },
      { percent: 2.5, color: "text-slark-primary" },
      { percent: 2.0, color: "text-slark-agent" },
      { percent: 0.4, color: "text-slark-runtime" },
    ],
    models: [
      {
        model: "anthropic/claude-4.6-opus-20260205",
        tokens: "335.7M",
        cost: "",
        color: "bg-[var(--color-text-heading)]",
      },
      {
        model: "anthropic/claude-4.6-sonnet-20260217",
        tokens: "91.8M",
        cost: "",
        color: "bg-[var(--color-text-tertiary)]",
      },
      { model: "claude-opus-4-6", tokens: "11.4M", cost: "$11.22", color: "bg-slark-primary" },
      { model: "claude-sonnet-4-6", tokens: "8.8M", cost: "$5.01", color: "bg-slark-agent" },
      {
        model: "claude-haiku-4-5-20251001",
        tokens: "1.8M",
        cost: "$0.35",
        color: "bg-slark-runtime",
      },
    ],
    hourlyData: [0, 0, 0, 0, 0, 1, 2, 5, 12, 18, 22, 15, 8, 10, 14, 20, 16, 11, 6, 3, 2, 1, 0, 0],
    createdAt: "4/16/2026, 10:27:33 AM",
    updatedAt: "4/16/2026, 2:29:58 PM",
  },
  "rt-2": {
    usage: {
      "7d": { input: "8.4K", output: "92K", cacheRead: "31.5M", cacheWrite: "2.8M", cost: "$1.05" },
      "30d": {
        input: "41.2K",
        output: "480K",
        cacheRead: "152.1M",
        cacheWrite: "12.3M",
        cost: "$5.20",
      },
      "90d": {
        input: "105K",
        output: "1.2M",
        cacheRead: "390M",
        cacheWrite: "28.1M",
        cost: "$13.80",
      },
    },
    dailyDates: [
      "3/29",
      "3/30",
      "4/1",
      "4/2",
      "4/10",
      "4/11",
      "4/12",
      "4/13",
      "4/14",
      "4/15",
      "4/16",
    ],
    dailyTokens: [5, 3, 2, 0, 8, 12, 20, 35, 55, 42, 60],
    dailyCosts: [0.2, 0.1, 0.1, 0, 0.4, 0.6, 1.0, 1.5, 2.2, 1.8, 2.5],
    totalTokens: "152.8M",
    donutSegments: [
      { percent: 62.0, color: "text-[var(--color-text-heading)]" },
      { percent: 28.0, color: "text-[var(--color-text-tertiary)]" },
      { percent: 6.5, color: "text-slark-primary" },
      { percent: 2.5, color: "text-slark-agent" },
      { percent: 1.0, color: "text-slark-runtime" },
    ],
    models: [
      {
        model: "anthropic/claude-4.6-sonnet-20260217",
        tokens: "94.7M",
        cost: "$3.20",
        color: "bg-[var(--color-text-heading)]",
      },
      {
        model: "openai/gpt-4.1",
        tokens: "42.8M",
        cost: "$1.05",
        color: "bg-[var(--color-text-tertiary)]",
      },
      {
        model: "anthropic/claude-4.6-opus-20260205",
        tokens: "9.9M",
        cost: "$0.68",
        color: "bg-slark-primary",
      },
      { model: "openai/o3", tokens: "3.8M", cost: "$0.22", color: "bg-slark-agent" },
      {
        model: "google/gemini-2.5-flash",
        tokens: "1.6M",
        cost: "$0.05",
        color: "bg-slark-runtime",
      },
    ],
    hourlyData: [0, 0, 0, 0, 1, 2, 4, 8, 10, 15, 18, 12, 6, 8, 11, 14, 10, 7, 4, 2, 1, 0, 0, 0],
    createdAt: "3/20/2026, 3:15:00 PM",
    updatedAt: "4/16/2026, 1:45:22 PM",
  },
  "rt-5": {
    usage: {
      "7d": { input: "3.2K", output: "45K", cacheRead: "12.1M", cacheWrite: "1.1M", cost: "$0.42" },
      "30d": {
        input: "18.5K",
        output: "210K",
        cacheRead: "68.4M",
        cacheWrite: "5.8M",
        cost: "$2.15",
      },
      "90d": {
        input: "52K",
        output: "580K",
        cacheRead: "175M",
        cacheWrite: "14.2M",
        cost: "$5.90",
      },
    },
    dailyDates: [
      "3/29",
      "3/30",
      "4/1",
      "4/2",
      "4/10",
      "4/11",
      "4/12",
      "4/13",
      "4/14",
      "4/15",
      "4/16",
    ],
    dailyTokens: [0, 0, 3, 1, 5, 8, 15, 22, 18, 30, 25],
    dailyCosts: [0, 0, 0.05, 0.02, 0.15, 0.25, 0.45, 0.7, 0.55, 0.9, 0.75],
    totalTokens: "68.8M",
    donutSegments: [
      { percent: 85.0, color: "text-[var(--color-text-heading)]" },
      { percent: 15.0, color: "text-[var(--color-text-tertiary)]" },
    ],
    models: [
      {
        model: "gemini-2.5-pro",
        tokens: "58.5M",
        cost: "$1.80",
        color: "bg-[var(--color-text-heading)]",
      },
      {
        model: "gemini-2.5-flash",
        tokens: "10.3M",
        cost: "$0.35",
        color: "bg-[var(--color-text-tertiary)]",
      },
    ],
    hourlyData: [0, 0, 0, 0, 0, 0, 1, 3, 6, 9, 12, 8, 5, 6, 8, 10, 7, 4, 2, 1, 0, 0, 0, 0],
    createdAt: "4/5/2026, 9:10:00 AM",
    updatedAt: "4/16/2026, 11:30:05 AM",
  },
};

runtimeDataMap["claude-code"] = runtimeDataMap["rt-1"];
runtimeDataMap.opencode = runtimeDataMap["rt-2"];
runtimeDataMap["gemini-cli"] = runtimeDataMap["rt-5"];

const defaultData: RuntimeData = {
  usage: {
    "7d": { input: "0", output: "0", cacheRead: "0", cacheWrite: "0", cost: "$0" },
    "30d": { input: "0", output: "0", cacheRead: "0", cacheWrite: "0", cost: "$0" },
    "90d": { input: "0", output: "0", cacheRead: "0", cacheWrite: "0", cost: "$0" },
  },
  dailyDates: [],
  dailyTokens: [],
  dailyCosts: [],
  totalTokens: "0",
  donutSegments: [],
  models: [],
  hourlyData: [],
  createdAt: "—",
  updatedAt: "—",
};

const HEATMAP_WEEKS = 40;
const heatmapLevels = [
  "bg-surface-3",
  "bg-slark-online/20",
  "bg-slark-online/40",
  "bg-slark-online/60",
  "bg-slark-online",
];
const weekLabels = [
  { id: "mon", label: "Mon" },
  { id: "tue", label: "" },
  { id: "wed", label: "Wed" },
  { id: "thu", label: "" },
  { id: "fri", label: "Fri" },
  { id: "sat", label: "" },
  { id: "sun", label: "" },
];
const heatmapMonths = ["Jul", "Aug", "Sep", "Oct", "Nov", "Dec", "Jan", "Feb", "Mar", "Apr"];

function hash(s: string): number {
  return Array.from(s).reduce((h, c, i) => (h * 31 + c.charCodeAt(0) + i * 17) % 9973, 7);
}

function getLastSeen(status: Runtime["status"]): string {
  if (status === "connected") return "Just now";
  if (status === "error") return "14 min ago";
  return "2 hours ago";
}

function getData(rt: Runtime): RuntimeData {
  return runtimeDataMap[rt.id] ?? runtimeDataMap[rt.type] ?? defaultData;
}

export function RuntimesView(): ReactElement {
  const navigate = useNavigate();
  const { runtimes, selectedRuntimeId, selectRuntime } = useRuntimesStore();
  const agents = useAgentsStore((s) => s.agents);
  const [period, setPeriod] = useState<UsagePeriod>("30d");

  useEffect(() => {
    if (runtimes.length > 0 && !selectedRuntimeId) selectRuntime(runtimes[0].id);
  }, [runtimes, selectedRuntimeId, selectRuntime]);

  const rt = selectedRuntimeId ? (runtimes.find((r) => r.id === selectedRuntimeId) ?? null) : null;

  const heatmapCells = useMemo(() => {
    if (!rt) return [];
    return Array.from({ length: HEATMAP_WEEKS * 7 }, (_, i) => ({
      key: `${rt.id}-${hash(`${rt.id}-cell-${i}`)}-${i}`,
      level: hash(`${rt.id}-${i}`) % heatmapLevels.length,
    }));
  }, [rt]);

  if (runtimes.length === 0) {
    return (
      <ShellEmptyState
        icon={<Zap className="h-10 w-10 text-text-tertiary" />}
        title="No runtimes connected"
        description="Add a runtime to power your agents."
      />
    );
  }

  if (!rt) {
    return (
      <ShellEmptyState
        icon={<Wifi className="h-10 w-10 text-text-tertiary" />}
        title="Select a runtime"
        description="Pick one from the sidebar to inspect status and usage."
      />
    );
  }

  const Icon = typeIcons[rt.type];
  const ver = rt.version ? `v${rt.version}` : "Not installed";
  const hasUpdate = rt.type === "claude-code" && rt.version;
  const data = getData(rt);
  const usage = data.usage[period];
  const linkedAgents = agents.filter((agent) => agent.runtimeId === rt.id);

  return (
    <div className="h-full overflow-y-auto">
      <div className="mx-auto max-w-[800px] px-4 pt-2 pb-6 sm:px-6 sm:pb-8">
        <TitleBarSpacer />

        <PageHeader
          density="shell"
          title={rt.name}
          description={`${providerLabels[rt.type]} runtime · ${statusLabels[rt.status]}`}
          actions={
            <div className="flex items-center gap-2">
              <StatusBadge status={rt.status} />
              {rt.status === "connected" ? (
                <>
                  <Button title="Stop runtime" variant="outline" size="icon-sm">
                    <Square className="h-3.5 w-3.5" />
                  </Button>
                  <Button title="Restart runtime" variant="outline" size="icon-sm">
                    <RotateCw className="h-3.5 w-3.5" />
                  </Button>
                </>
              ) : (
                <Button
                  title="Start runtime"
                  variant="outline"
                  size="icon-sm"
                  className="text-slark-online"
                >
                  <Play className="h-3.5 w-3.5" />
                </Button>
              )}
              <Button
                title="Delete runtime"
                variant="outline"
                size="icon-sm"
                className="hover:text-destructive hover:border-destructive/30 hover:bg-destructive/5"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </div>
          }
        />

        <div className="space-y-6">
          <Card variant="outlined" padding="md" className="shadow-card">
            <CardContent className="flex items-start gap-3 p-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-surface-2 text-text-heading">
                <Icon className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-sm font-semibold text-text-heading">{rt.name}</h2>
                  <Badge variant="outline" size="xs" className="capitalize">
                    {rt.type}
                  </Badge>
                </div>
                <p className="mt-1 text-xs text-text-secondary">
                  Last seen {getLastSeen(rt.status)} ·{" "}
                  {rt.version ? `v${rt.version}` : "Not installed"}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card variant="outlined" padding="md">
            <CardHeader className="flex-row items-center justify-between space-y-0 pb-4">
              <CardTitle className="text-sm">Runtime details</CardTitle>
              <Button variant="outline" size="sm">
                <RefreshCw className="h-3.5 w-3.5" />
                Test Connection
              </Button>
            </CardHeader>
            <CardContent className="space-y-0 text-sm">
              <div className="grid grid-cols-1 gap-x-8 md:grid-cols-2">
                <InfoRow label="Provider" value={providerLabels[rt.type]} />
                <InfoRow label="Last Seen" value={getLastSeen(rt.status)} />
                <InfoRow label="Device" value={`localhost · ${ver} (${rt.name})`} />
                <InfoRow label="CLI Version">
                  {hasUpdate ? (
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{ver}</span>
                      <ArrowRight className="h-3 w-3 text-text-tertiary" />
                      <span className="font-mono text-slark-online">v1.1.0</span>
                      <Button variant="outline" size="xs" className="ml-1">
                        Update
                      </Button>
                    </div>
                  ) : (
                    <span className="font-medium">{ver}</span>
                  )}
                </InfoRow>
              </div>
            </CardContent>
          </Card>

          <Card variant="outlined" padding="md">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Linked Agents</CardTitle>
            </CardHeader>
            <CardContent>
              {linkedAgents.length === 0 ? (
                <p className="py-4 text-center text-sm text-text-tertiary">
                  No agents using this runtime
                </p>
              ) : (
                <div className="space-y-1">
                  {linkedAgents.map((agent) => (
                    <InteractiveRow
                      key={agent.id}
                      tone="subtle"
                      className="items-center rounded-lg border-transparent px-3 py-2"
                      onClick={() => {
                        navigate("/agents");
                        setTimeout(() => useAgentsStore.getState().selectAgent(agent.id), 50);
                      }}
                    >
                      <InteractiveRowLeading>
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-surface-2">
                          {agent.avatar ? (
                            <img src={agent.avatar} alt="" className="h-8 w-8 rounded-lg" />
                          ) : (
                            <Bot className="h-4 w-4 text-text-tertiary" />
                          )}
                        </div>
                      </InteractiveRowLeading>
                      <InteractiveRowContent>
                        <p className="truncate text-sm font-medium">{agent.name}</p>
                        <p className="truncate text-xs text-text-tertiary">{agent.description}</p>
                      </InteractiveRowContent>
                      <InteractiveRowTrailing className="pt-1">
                        <span
                          className={cn(
                            "h-2 w-2 rounded-full shrink-0",
                            agent.status === "online" && "bg-slark-online",
                            agent.status === "busy" && "bg-slark-busy",
                            agent.status === "offline" && "bg-slark-offline",
                          )}
                        />
                      </InteractiveRowTrailing>
                    </InteractiveRow>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card variant="outlined" padding="md">
            <CardHeader className="pb-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <CardTitle className="text-sm">Token Usage</CardTitle>
                <Tabs value={period} onValueChange={(value) => setPeriod(value as UsagePeriod)}>
                  <TabsList variant="compact">
                    {usagePeriods.map((value) => (
                      <TabsTrigger key={value} value={value} variant="compact">
                        {value}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                </Tabs>
              </div>
            </CardHeader>
            <CardContent>
              <Alert className="mb-4 border-warning/20 bg-warning-subtle">
                <CircleAlert className="size-4 text-warning" />
                <AlertDescription className="text-xs text-text-secondary">
                  Donut, heatmap, and per-model analytics remain local Slark implementations until
                  ui-web ships matching dashboard primitives.
                </AlertDescription>
              </Alert>

              <div className="mb-3 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
                <StatCard variant="outlined" padding="sm" label="Input" value={usage.input} />
                <StatCard variant="outlined" padding="sm" label="Output" value={usage.output} />
                <StatCard
                  variant="outlined"
                  padding="sm"
                  label="Cache Read"
                  value={usage.cacheRead}
                />
                <StatCard
                  variant="outlined"
                  padding="sm"
                  label="Cache Write"
                  value={usage.cacheWrite}
                />
              </div>

              <p className="mb-5 text-sm text-text-tertiary">
                Estimated cost ({period}):{" "}
                <span className="font-semibold text-text-primary">{usage.cost}</span>
              </p>

              <div className="mb-4 border-t border-border pt-4">
                <p className="mb-3 text-xs font-medium text-text-tertiary">By Model</p>
              </div>

              {data.models.length > 0 ? (
                <>
                  <div className="mb-5 flex flex-col items-center">
                    <DonutChart
                      segments={data.donutSegments}
                      label={data.totalTokens}
                      sublabel="tokens"
                    />
                  </div>
                  <div className="space-y-0">
                    {data.models.map((row) => (
                      <div
                        key={row.model}
                        className="flex items-center gap-2 border-b border-border-subtle py-1.5 last:border-0"
                      >
                        <span className={cn("h-2.5 w-2.5 shrink-0 rounded-sm", row.color)} />
                        <span className="flex-1 truncate font-mono text-xs text-text-tertiary">
                          {row.model}
                        </span>
                        <span className="shrink-0 text-sm font-medium">{row.tokens}</span>
                        {row.cost ? (
                          <span className="w-14 shrink-0 text-right text-xs text-text-tertiary">
                            {row.cost}
                          </span>
                        ) : null}
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <p className="py-4 text-center text-sm text-text-tertiary">No model usage data</p>
              )}
            </CardContent>
          </Card>

          <Card variant="outlined" padding="md">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-1.5">
                <div className="flex flex-col justify-between py-[1px] pr-0.5">
                  {weekLabels.map((item) => (
                    <span
                      key={item.id}
                      className="flex h-[12px] items-center text-[9px] leading-none text-text-tertiary"
                    >
                      {item.label}
                    </span>
                  ))}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="mb-1 flex">
                    {heatmapMonths.map((month) => (
                      <span
                        key={month}
                        className="text-[9px] text-text-tertiary"
                        style={{ width: `${100 / heatmapMonths.length}%` }}
                      >
                        {month}
                      </span>
                    ))}
                  </div>
                  <div
                    className="grid grid-flow-col grid-rows-7 gap-[3px]"
                    style={{ gridTemplateColumns: `repeat(${HEATMAP_WEEKS}, 1fr)` }}
                  >
                    {heatmapCells.map((cell) => (
                      <div
                        key={cell.key}
                        className={cn("aspect-square rounded-sm", heatmapLevels[cell.level])}
                      />
                    ))}
                  </div>
                </div>
              </div>
              <div className="mt-2 flex items-center justify-end gap-1">
                <span className="mr-1 text-[9px] text-text-tertiary">Less</span>
                {heatmapLevels.map((className) => (
                  <div key={className} className={cn("h-[10px] w-[10px] rounded-sm", className)} />
                ))}
                <span className="ml-1 text-[9px] text-text-tertiary">More</span>
              </div>
            </CardContent>
          </Card>

          <Card variant="outlined" padding="md">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Metadata</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-x-8 gap-y-4 text-sm md:grid-cols-2">
                <div>
                  <span className="text-text-tertiary">Created</span>
                  <p className="mt-0.5 font-medium">{data.createdAt}</p>
                </div>
                <div>
                  <span className="text-text-tertiary">Updated</span>
                  <p className="mt-0.5 font-medium">{data.updatedAt}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function ShellEmptyState({
  icon,
  title,
  description,
}: {
  icon: ReactNode;
  title: string;
  description: string;
}): ReactElement {
  return (
    <div className="h-full overflow-y-auto">
      <div className="mx-auto max-w-[800px] px-4 pt-2 pb-6 sm:px-6 sm:pb-8">
        <TitleBarSpacer />
        <div className="flex min-h-[calc(100vh-180px)] items-center justify-center">
          <Card variant="outlined" padding="lg" className="w-full max-w-md text-center">
            <CardContent className="flex flex-col items-center gap-3 py-6 text-text-secondary">
              {icon}
              <div className="space-y-1">
                <p className="text-lg font-medium text-text-primary">{title}</p>
                <p className="text-sm">{description}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
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
  children?: ReactNode;
}): ReactElement {
  return (
    <div className="flex items-start justify-between border-b border-border-subtle py-2 last:border-b-0">
      <span className="text-text-tertiary">{label}</span>
      <div className="text-right font-medium">{children ?? value}</div>
    </div>
  );
}

function StatusBadge({ status }: { status: Runtime["status"] }): ReactElement {
  const variant =
    status === "connected" ? "success" : status === "error" ? "destructive" : "outline";

  return (
    <Badge variant={variant} size="sm" className="gap-1.5">
      <span
        className={cn(
          "h-2 w-2 rounded-full",
          status === "connected" && "bg-slark-online",
          status === "disconnected" && "bg-slark-offline",
          status === "error" && "bg-destructive",
        )}
      />
      {statusLabels[status]}
    </Badge>
  );
}

function DonutChart({
  segments,
  label,
  sublabel,
}: {
  segments: { percent: number; color: string }[];
  label: string;
  sublabel: string;
}): ReactElement {
  const size = 140;
  const stroke = 20;
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  let off = 0;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
        <title>{`${label} ${sublabel}`}</title>
        {segments.map((seg) => {
          const d = (seg.percent / 100) * circ;
          const cur = off;
          off += d;
          return (
            <circle
              key={`${seg.color}-${seg.percent}`}
              cx={size / 2}
              cy={size / 2}
              r={r}
              fill="none"
              stroke="currentColor"
              strokeWidth={stroke}
              strokeDasharray={`${d} ${circ - d}`}
              strokeDashoffset={-cur}
              className={seg.color}
            />
          );
        })}
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-base font-bold">{label}</span>
        <span className="text-[10px] text-text-tertiary">{sublabel}</span>
      </div>
    </div>
  );
}
