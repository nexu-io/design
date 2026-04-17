import { useEffect, useMemo, useState } from "react";
import type { ElementType, ReactElement, ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import {
  Terminal,
  MousePointer,
  Code,
  Cpu,
  Box,
  Sparkles,
  Trash2,
  Wifi,
  RefreshCw,
  ArrowRight,
  Zap,
  Bot,
  Play,
  Square,
  RotateCw,
} from "lucide-react";
import { cn } from "@nexu-design/ui-web";
import { TitleBarSpacer } from "@/components/layout/WindowChrome";
import { useRuntimesStore } from "@/stores/runtimes";
import { useAgentsStore } from "@/stores/agents";
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
      { percent: 74.7, color: "text-foreground" },
      { percent: 20.4, color: "text-muted-foreground" },
      { percent: 2.5, color: "text-slark-primary" },
      { percent: 2.0, color: "text-slark-agent" },
      { percent: 0.4, color: "text-slark-runtime" },
    ],
    models: [
      {
        model: "anthropic/claude-4.6-opus-20260205",
        tokens: "335.7M",
        cost: "",
        color: "bg-foreground",
      },
      {
        model: "anthropic/claude-4.6-sonnet-20260217",
        tokens: "91.8M",
        cost: "",
        color: "bg-muted-foreground",
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
      { percent: 62.0, color: "text-foreground" },
      { percent: 28.0, color: "text-muted-foreground" },
      { percent: 6.5, color: "text-slark-primary" },
      { percent: 2.5, color: "text-slark-agent" },
      { percent: 1.0, color: "text-slark-runtime" },
    ],
    models: [
      {
        model: "anthropic/claude-4.6-sonnet-20260217",
        tokens: "94.7M",
        cost: "$3.20",
        color: "bg-foreground",
      },
      { model: "openai/gpt-4.1", tokens: "42.8M", cost: "$1.05", color: "bg-muted-foreground" },
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
      { percent: 85.0, color: "text-foreground" },
      { percent: 15.0, color: "text-muted-foreground" },
    ],
    models: [
      { model: "gemini-2.5-pro", tokens: "58.5M", cost: "$1.80", color: "bg-foreground" },
      { model: "gemini-2.5-flash", tokens: "10.3M", cost: "$0.35", color: "bg-muted-foreground" },
    ],
    hourlyData: [0, 0, 0, 0, 0, 0, 1, 3, 6, 9, 12, 8, 5, 6, 8, 10, 7, 4, 2, 1, 0, 0, 0, 0],
    createdAt: "4/5/2026, 9:10:00 AM",
    updatedAt: "4/16/2026, 11:30:05 AM",
  },
};

runtimeDataMap["claude-code"] = runtimeDataMap["rt-1"];
runtimeDataMap["opencode"] = runtimeDataMap["rt-2"];
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
  "bg-secondary",
  "bg-slark-online/20",
  "bg-slark-online/40",
  "bg-slark-online/60",
  "bg-slark-online",
];
const weekLabels = ["Mon", "", "Wed", "", "Fri", "", ""];
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

  const heatmap = useMemo(() => {
    if (!rt) return [];
    return Array.from(
      { length: HEATMAP_WEEKS * 7 },
      (_, i) => hash(`${rt.id}-${i}`) % heatmapLevels.length,
    );
  }, [rt]);

  if (runtimes.length === 0) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-muted-foreground">
          <Zap className="h-10 w-10" />
          <p className="text-lg font-medium">No runtimes connected</p>
          <p className="text-sm">Add a runtime to power your agents</p>
        </div>
      </div>
    );
  }

  if (!rt) {
    return (
      <div className="flex h-full flex-col">
        <TitleBarSpacer />
        <div className="flex flex-1 items-center justify-center">
          <div className="flex flex-col items-center gap-3 text-muted-foreground">
            <Wifi className="h-10 w-10" />
            <p className="text-lg font-medium">Select a runtime</p>
          </div>
        </div>
      </div>
    );
  }

  const Icon = typeIcons[rt.type];
  const ver = rt.version ? `v${rt.version}` : "Not installed";
  const hasUpdate = rt.type === "claude-code" && rt.version;
  const data = getData(rt);
  const usage = data.usage[period];

  return (
    <div className="flex h-full flex-col">
      <TitleBarSpacer />
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto px-6 pb-8 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent">
                <Icon className="h-5 w-5" />
              </div>
              <h1 className="text-xl font-semibold">{rt.name}</h1>
            </div>
            <div className="flex items-center gap-2">
              <StatusBadge status={rt.status} />
              <div className="flex items-center gap-1 ml-1">
                {rt.status === "connected" ? (
                  <>
                    <button
                      title="Stop runtime"
                      className="h-8 w-8 flex items-center justify-center rounded-lg border border-border text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
                    >
                      <Square className="h-3 w-3" />
                    </button>
                    <button
                      title="Restart runtime"
                      className="h-8 w-8 flex items-center justify-center rounded-lg border border-border text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
                    >
                      <RotateCw className="h-3.5 w-3.5" />
                    </button>
                  </>
                ) : (
                  <button
                    title="Start runtime"
                    className="h-8 w-8 flex items-center justify-center rounded-lg border border-border text-slark-online hover:bg-slark-online/10 transition-colors"
                  >
                    <Play className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
              <button
                title="Delete runtime"
                className="h-8 w-8 flex items-center justify-center rounded-lg border border-border text-muted-foreground hover:text-destructive hover:border-destructive/30 hover:bg-destructive/10 transition-colors"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          <section className="rounded-xl border border-border p-4 text-sm space-y-3">
            <div className="grid grid-cols-2 gap-x-8 gap-y-3">
              <InfoRow label="Provider" value={providerLabels[rt.type]} />
              <InfoRow label="Last Seen" value={getLastSeen(rt.status)} />
              <InfoRow label="Device" value={`localhost · ${ver} (${rt.name})`} />
              <InfoRow label="CLI Version">
                {hasUpdate ? (
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{ver}</span>
                    <ArrowRight className="h-3 w-3 text-muted-foreground" />
                    <span className="font-mono text-slark-online">v1.1.0</span>
                    <button className="ml-1 h-6 px-2 rounded border border-border text-[11px] font-medium hover:bg-accent transition-colors">
                      Update
                    </button>
                  </div>
                ) : (
                  <span className="font-medium">{ver}</span>
                )}
              </InfoRow>
            </div>
            <button className="h-8 px-3 rounded-md border border-border text-xs font-medium flex items-center gap-1.5 hover:bg-accent transition-colors">
              <RefreshCw className="h-3.5 w-3.5" />
              Test Connection
            </button>
          </section>

          <section className="rounded-xl border border-border p-4">
            <p className="text-sm font-semibold mb-3">Linked Agents</p>
            {(() => {
              const linked = agents.filter((a) => a.runtimeId === rt.id);
              if (linked.length === 0) {
                return (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No agents using this runtime
                  </p>
                );
              }
              return (
                <div className="space-y-1">
                  {linked.map((agent) => (
                    <button
                      key={agent.id}
                      onClick={() => {
                        navigate("/agents");
                        setTimeout(() => useAgentsStore.getState().selectAgent(agent.id), 50);
                      }}
                      className="flex items-center gap-3 w-full px-3 py-2 rounded-lg hover:bg-accent transition-colors text-left"
                    >
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent">
                        {agent.avatar ? (
                          <img src={agent.avatar} alt="" className="h-8 w-8 rounded-lg" />
                        ) : (
                          <Bot className="h-4 w-4 text-muted-foreground" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{agent.name}</p>
                        <p className="text-xs text-muted-foreground truncate">
                          {agent.description}
                        </p>
                      </div>
                      <span
                        className={cn(
                          "h-2 w-2 rounded-full shrink-0",
                          agent.status === "online" && "bg-slark-online",
                          agent.status === "busy" && "bg-slark-busy",
                          agent.status === "offline" && "bg-slark-offline",
                        )}
                      />
                    </button>
                  ))}
                </div>
              );
            })()}
          </section>

          <section className="rounded-xl border border-border p-4">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm font-semibold">Token Usage</p>
              <div className="flex items-center rounded-lg border border-border p-0.5">
                {usagePeriods.map((p) => (
                  <button
                    key={p}
                    onClick={() => setPeriod(p)}
                    className={cn(
                      "px-2.5 py-1 rounded-md text-xs font-medium transition-colors",
                      period === p
                        ? "bg-foreground text-background"
                        : "text-muted-foreground hover:text-foreground",
                    )}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-4 gap-3 mb-3">
              <StatCard label="Input" value={usage.input} />
              <StatCard label="Output" value={usage.output} />
              <StatCard label="Cache Read" value={usage.cacheRead} />
              <StatCard label="Cache Write" value={usage.cacheWrite} />
            </div>
            <p className="text-sm text-muted-foreground mb-5">
              Estimated cost ({period}):{" "}
              <span className="font-semibold text-foreground">{usage.cost}</span>
            </p>

            <div className="border-t border-border pt-4 mb-4">
              <p className="text-xs font-medium text-muted-foreground mb-3">By Model</p>
            </div>
            {data.models.length > 0 ? (
              <>
                <div className="flex flex-col items-center mb-5">
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
                      className="flex items-center gap-2 py-1.5 border-b border-border/40 last:border-0"
                    >
                      <span className={cn("h-2.5 w-2.5 rounded-sm shrink-0", row.color)} />
                      <span className="font-mono text-xs text-muted-foreground truncate flex-1">
                        {row.model}
                      </span>
                      <span className="text-sm font-medium shrink-0">{row.tokens}</span>
                      {row.cost && (
                        <span className="text-xs text-muted-foreground shrink-0 w-14 text-right">
                          {row.cost}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-4">No model usage data</p>
            )}
          </section>

          <section className="rounded-xl border border-border p-4">
            <p className="text-sm font-semibold mb-3">Activity</p>
            <div className="flex gap-1.5">
              <div className="flex flex-col justify-between pr-0.5 py-[1px]">
                {weekLabels.map((w, i) => (
                  <span
                    key={i}
                    className="text-[9px] text-muted-foreground leading-none h-[12px] flex items-center"
                  >
                    {w}
                  </span>
                ))}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex mb-1">
                  {heatmapMonths.map((m, i) => (
                    <span
                      key={i}
                      className="text-[9px] text-muted-foreground"
                      style={{ width: `${100 / heatmapMonths.length}%` }}
                    >
                      {m}
                    </span>
                  ))}
                </div>
                <div
                  className="grid grid-rows-7 grid-flow-col gap-[3px]"
                  style={{ gridTemplateColumns: `repeat(${HEATMAP_WEEKS}, 1fr)` }}
                >
                  {heatmap.map((level, i) => (
                    <div key={i} className={cn("aspect-square rounded-sm", heatmapLevels[level])} />
                  ))}
                </div>
              </div>
            </div>
            <div className="flex items-center justify-end gap-1 mt-2">
              <span className="text-[9px] text-muted-foreground mr-1">Less</span>
              {heatmapLevels.map((cls, i) => (
                <div key={i} className={cn("w-[10px] h-[10px] rounded-sm", cls)} />
              ))}
              <span className="text-[9px] text-muted-foreground ml-1">More</span>
            </div>
          </section>

          <section className="rounded-xl border border-border p-4">
            <div className="grid grid-cols-2 gap-x-8 text-sm">
              <div>
                <span className="text-muted-foreground">Created</span>
                <p className="mt-0.5 font-medium">{data.createdAt}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Updated</span>
                <p className="mt-0.5 font-medium">{data.updatedAt}</p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

function InfoRow({
  label,
  value,
  children,
}: { label: string; value?: string; children?: ReactNode }): ReactElement {
  return (
    <div className="flex justify-between items-start py-1.5 border-b border-border/40">
      <span className="text-muted-foreground">{label}</span>
      <div className="text-right font-medium">{children ?? value}</div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }): ReactElement {
  return (
    <div className="rounded-lg border border-border px-3 py-2.5">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-1 text-lg font-semibold">{value}</p>
    </div>
  );
}

function StatusBadge({ status }: { status: Runtime["status"] }): ReactElement {
  return (
    <div
      className={cn(
        "flex items-center gap-1.5 text-xs font-medium",
        status === "connected" && "text-slark-online",
        status === "disconnected" && "text-muted-foreground",
        status === "error" && "text-destructive",
      )}
    >
      <span
        className={cn(
          "h-2 w-2 rounded-full",
          status === "connected" && "bg-slark-online",
          status === "disconnected" && "bg-slark-offline",
          status === "error" && "bg-destructive",
        )}
      />
      {statusLabels[status]}
    </div>
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
        {segments.map((seg, i) => {
          const d = (seg.percent / 100) * circ;
          const cur = off;
          off += d;
          return (
            <circle
              key={i}
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
        <span className="text-[10px] text-muted-foreground">{sublabel}</span>
      </div>
    </div>
  );
}
