import { Button, RuntimeLogo, cn } from "@nexu-design/ui-web";
import {
  ArrowRight,
  ArrowUpRight,
  Bot,
  Check,
  Copy,
  Play,
  RefreshCw,
  RotateCw,
  Square,
  Trash2,
  Wifi,
  Zap,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import type { ReactElement, ReactNode } from "react";
import { useNavigate } from "react-router-dom";

import { WindowChrome } from "@/components/layout/WindowChrome";
import { useAgentsStore } from "@/stores/agents";
import { useRuntimesStore } from "@/stores/runtimes";
import type { Runtime } from "@/types";

/**
 * Optical size multiplier for each runtime logo.
 *
 * All logos render inside a canonical surface tile (size-10 / size-12) with
 * a target glyph size of ~50% of the tile. A few brand marks — notably
 * Codex and Gemini CLI — ship with noticeable internal padding baked into
 * their artwork, so rendering them at the same pixel size as the flush
 * marks (Claude Code, Cursor, OpenCode) makes them look visibly smaller.
 *
 * The factor below is multiplied against the base glyph size so those
 * padded marks occupy the same perceived area as the flush ones. Keep it
 * close to `1` — anything over `1.5` starts clipping at the tile edge.
 */
const logoOpticalScale: Partial<Record<InstallGuide["type"], number>> = {
  codex: 1.45,
  "gemini-cli": 1.25,
  pi: 1.2,
};

function getLogoSize(base: number, type: InstallGuide["type"]): number {
  return Math.round(base * (logoOpticalScale[type] ?? 1));
}

const providerLabels: Record<Runtime["type"], string> = {
  "claude-code": "Anthropic",
  cursor: "Cursor",
  opencode: "OpenCode",
  codex: "OpenAI",
  "gemini-cli": "Google",
  hermes: "Local",
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
      { percent: 2.5, color: "text-nexu-primary" },
      { percent: 2.0, color: "text-nexu-agent" },
      { percent: 0.4, color: "text-nexu-runtime" },
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
      { model: "claude-opus-4-6", tokens: "11.4M", cost: "$11.22", color: "bg-nexu-primary" },
      { model: "claude-sonnet-4-6", tokens: "8.8M", cost: "$5.01", color: "bg-nexu-agent" },
      {
        model: "claude-haiku-4-5-20251001",
        tokens: "1.8M",
        cost: "$0.35",
        color: "bg-nexu-runtime",
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
      { percent: 6.5, color: "text-nexu-primary" },
      { percent: 2.5, color: "text-nexu-agent" },
      { percent: 1.0, color: "text-nexu-runtime" },
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
        color: "bg-nexu-primary",
      },
      { model: "openai/o3", tokens: "3.8M", cost: "$0.22", color: "bg-nexu-agent" },
      { model: "google/gemini-2.5-flash", tokens: "1.6M", cost: "$0.05", color: "bg-nexu-runtime" },
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
  "bg-secondary",
  "bg-nexu-online/20",
  "bg-nexu-online/40",
  "bg-nexu-online/60",
  "bg-nexu-online",
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
    return <EmptyRuntimesGuide />;
  }

  if (!rt) {
    return (
      <div className="flex h-full flex-col">
        <WindowChrome className="h-10" />
        <div className="flex flex-1 items-center justify-center">
          <div className="flex flex-col items-center gap-3 text-muted-foreground">
            <Wifi className="h-10 w-10" />
            <p className="text-lg font-medium">Select a runtime</p>
          </div>
        </div>
      </div>
    );
  }

  const ver = rt.version ? `v${rt.version}` : "Not installed";
  const hasUpdate = rt.type === "claude-code" && rt.version;
  const data = getData(rt);
  const usage = data.usage[period];

  return (
    <div className="flex h-full flex-col">
      <WindowChrome className="h-10" />
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto px-6 pb-8 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {/* Canonical logo tile: fixed-size surface chip with a subtle
                  border frames the brand glyph at ~half the container size,
                  matching the `provider-settings` Storybook pattern in
                  `apps/storybook/src/stories/provider-settings.stories.tsx`. */}
              <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl border border-border-subtle bg-surface-1">
                <RuntimeLogo runtime={rt.type} size={getLogoSize(24, rt.type)} />
              </span>
              <h1 className="text-xl font-semibold">{rt.name}</h1>
            </div>
            <div className="flex items-center gap-2">
              <StatusBadge status={rt.status} />
              <div className="flex items-center gap-1 ml-1">
                {rt.status === "connected" ? (
                  <>
                    {/* Outline icon buttons hover to the neutral surface
                        chip (`hover:bg-surface-2`), NOT `hover:bg-accent`.
                        `--color-accent` is reserved for primary filled
                        affordances; using it as a hover state turns the
                        whole row blue / near-black on mouseover and
                        violates the "at most one accent-weighted action
                        per group" rule in AGENTS.md. */}
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      title="Stop runtime"
                      className="h-8 w-8 flex items-center justify-center rounded-lg border border-border text-muted-foreground hover:text-foreground hover:bg-surface-2 transition-colors"
                    >
                      <Square className="h-3 w-3" />
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      title="Restart runtime"
                      className="h-8 w-8 flex items-center justify-center rounded-lg border border-border text-muted-foreground hover:text-foreground hover:bg-surface-2 transition-colors"
                    >
                      <RotateCw className="h-3.5 w-3.5" />
                    </Button>
                  </>
                ) : (
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    title="Start runtime"
                    className="h-8 w-8 flex items-center justify-center rounded-lg border border-border text-nexu-online hover:bg-nexu-online/10 transition-colors"
                  >
                    <Play className="h-3.5 w-3.5" />
                  </Button>
                )}
              </div>
              <Button
                type="button"
                variant="outline"
                size="icon"
                title="Delete runtime"
                className="h-8 w-8 flex items-center justify-center rounded-lg border border-border text-muted-foreground hover:text-destructive hover:border-destructive/30 hover:bg-destructive/10 transition-colors"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>

          <section className="rounded-xl border border-border p-4 text-sm space-y-3">
            <div className="grid grid-cols-2 gap-x-8 gap-y-3">
              <InfoRow label="Provider" value={providerLabels[rt.type]} />
              <InfoRow label="Last seen" value={getLastSeen(rt.status)} />
              <InfoRow label="Device" value={`localhost · ${ver} (${rt.name})`} />
              <InfoRow label="CLI version">
                {hasUpdate ? (
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{ver}</span>
                    <ArrowRight className="h-3 w-3 text-muted-foreground" />
                    <span className="font-mono text-nexu-online">v1.1.0</span>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="ml-1 h-6 px-2 text-[11px] font-medium hover:bg-surface-2 transition-colors"
                    >
                      Update
                    </Button>
                  </div>
                ) : (
                  <span className="font-medium">{ver}</span>
                )}
              </InfoRow>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-8 px-3 text-xs font-medium flex items-center gap-1.5 hover:bg-surface-2 transition-colors"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              Test connection
            </Button>
          </section>

          <section className="rounded-xl border border-border p-4">
            <p className="text-sm font-semibold mb-3">Linked agents</p>
            {(() => {
              const linked = agents.filter((a) => a.runtimeId === rt.id);
              if (linked.length === 0) {
                return (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No agents use this runtime
                  </p>
                );
              }
              return (
                <div className="space-y-1">
                  {linked.map((agent) => (
                    <Button
                      key={agent.id}
                      type="button"
                      variant="ghost"
                      size="inline"
                      onClick={() => {
                        navigate("/agents");
                        setTimeout(() => useAgentsStore.getState().selectAgent(agent.id), 50);
                      }}
                      className="flex items-center gap-3 w-full px-3 py-2 rounded-lg hover:bg-surface-2 transition-colors text-left"
                    >
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-surface-2 ring-1 ring-inset ring-black/5">
                        {agent.avatar ? (
                          <img src={agent.avatar} alt="" className="h-8 w-8 rounded-full" />
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
                          agent.status === "online" && "bg-nexu-online",
                          agent.status === "busy" && "bg-nexu-busy",
                          agent.status === "offline" && "bg-nexu-offline",
                        )}
                      />
                    </Button>
                  ))}
                </div>
              );
            })()}
          </section>

          <section className="rounded-xl border border-border p-4">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm font-semibold">Token usage</p>
              <div className="flex items-center rounded-lg border border-border p-0.5">
                {usagePeriods.map((p) => (
                  <Button
                    key={p}
                    type="button"
                    variant="ghost"
                    size="inline"
                    onClick={() => setPeriod(p)}
                    className={cn(
                      "px-2.5 py-1 rounded-md text-xs font-medium transition-colors",
                      period === p
                        ? "bg-foreground text-background"
                        : "text-muted-foreground hover:text-foreground",
                    )}
                  >
                    {p}
                  </Button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-4 gap-3 mb-3">
              <StatCard label="Input" value={usage.input} />
              <StatCard label="Output" value={usage.output} />
              <StatCard label="Cache read" value={usage.cacheRead} />
              <StatCard label="Cache write" value={usage.cacheWrite} />
            </div>
            <p className="text-sm text-muted-foreground mb-5">
              Estimated cost ({period}):{" "}
              <span className="font-semibold text-foreground">{usage.cost}</span>
            </p>

            <div className="border-t border-border pt-4 mb-4">
              <p className="text-xs font-medium text-muted-foreground mb-3">By model</p>
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
                {weekLabels.map((w) => (
                  <span
                    key={w}
                    className="text-[9px] text-muted-foreground leading-none h-[12px] flex items-center"
                  >
                    {w}
                  </span>
                ))}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex mb-1">
                  {heatmapMonths.map((m) => (
                    <span
                      key={m}
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
                  {heatmap.map((level, index) => (
                    <div
                      key={`heatmap-${index}-${level}`}
                      className={cn("aspect-square rounded-sm", heatmapLevels[level])}
                    />
                  ))}
                </div>
              </div>
            </div>
            <div className="flex items-center justify-end gap-1 mt-2">
              <span className="text-[9px] text-muted-foreground mr-1">Less</span>
              {heatmapLevels.map((cls) => (
                <div key={cls} className={cn("w-[10px] h-[10px] rounded-sm", cls)} />
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

interface InstallGuide {
  type: Runtime["type"] | "openclaw" | "pi";
  name: string;
  desc: string;
  install: string;
  docsUrl: string;
  docsLabel: string;
}

const installGuides: InstallGuide[] = [
  {
    type: "claude-code",
    name: "Claude Code",
    desc: "Anthropic's coding agent",
    install: "npm install -g @anthropic-ai/claude-code",
    docsUrl: "https://docs.claude.com/en/docs/claude-code/overview",
    docsLabel: "docs.claude.com",
  },
  {
    type: "cursor",
    name: "Cursor",
    desc: "AI-first code editor",
    install: "Download the desktop app",
    docsUrl: "https://docs.cursor.com/get-started/installation",
    docsLabel: "docs.cursor.com",
  },
  {
    type: "opencode",
    name: "OpenCode",
    desc: "Open-source coding agent",
    install: "npm install -g opencode-ai",
    docsUrl: "https://opencode.ai/docs",
    docsLabel: "opencode.ai/docs",
  },
  {
    type: "codex",
    name: "Codex",
    desc: "OpenAI coding agent",
    install: "npm install -g @openai/codex",
    docsUrl: "https://github.com/openai/codex#installation",
    docsLabel: "github.com/openai/codex",
  },
  {
    type: "gemini-cli",
    name: "Gemini CLI",
    desc: "Google's AI coding agent",
    install: "npm install -g @google/gemini-cli",
    docsUrl: "https://github.com/google-gemini/gemini-cli#quickstart",
    docsLabel: "github.com/google-gemini/gemini-cli",
  },
  {
    type: "hermes",
    name: "Hermes",
    desc: "Local LLM runtime",
    install: "brew install hermes",
    docsUrl: "https://ollama.com/download",
    docsLabel: "ollama.com/download",
  },
];

function InstallCommand({
  command,
  className,
}: { command: string; className?: string }): ReactElement {
  const [copied, setCopied] = useState(false);

  const handleCopy = (e: React.MouseEvent): void => {
    /* The card routes bare clicks to a docs overlay `<a>` behind the
       content. Prevent default to stop that navigation and stop
       propagation so the parent's hover / link handling leaves this
       button alone. */
    e.preventDefault();
    e.stopPropagation();
    navigator.clipboard
      .writeText(command)
      .then(() => {
        setCopied(true);
        window.setTimeout(() => setCopied(false), 1500);
      })
      .catch(() => {
        /* Clipboard permission denied or unavailable — silently ignore;
           the user can still read and manually copy the command text. */
      });
  };

  return (
    <div
      className={cn(
        "group/cmd flex items-center gap-2 rounded-md bg-secondary/60 pl-2 pr-1 py-1",
        className,
      )}
    >
      <code className="font-mono text-[11px] text-muted-foreground truncate min-w-0 flex-1">
        {command}
      </code>
      <button
        type="button"
        onClick={handleCopy}
        aria-label={copied ? "Copied" : "Copy install command"}
        title={copied ? "Copied" : "Copy command"}
        className={cn(
          "flex size-5 shrink-0 items-center justify-center rounded transition-colors",
          copied
            ? "text-success"
            : "text-muted-foreground hover:text-foreground hover:bg-background",
        )}
      >
        {copied ? <Check className="size-3" /> : <Copy className="size-3" />}
      </button>
    </div>
  );
}

function EmptyRuntimesGuide(): ReactElement {
  return (
    <div className="flex h-full flex-col">
      <WindowChrome className="h-10" />
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto px-6 pb-10">
          <div className="flex flex-col items-center text-center gap-3 pt-6 pb-8">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-surface-2 text-text-primary ring-1 ring-inset ring-black/5">
              <Zap className="h-6 w-6" />
            </div>
            <h1 className="text-xl font-semibold">No runtimes installed</h1>
            <p className="text-sm text-muted-foreground max-w-md">
              Agents need a runtime to execute tasks. Install one of the supported runtimes below,
              then return here to connect it.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {installGuides.map((g) => {
              return (
                /* Card no longer wraps everything in a single `<a>`: the
                   install command needs its own click-to-copy button, and
                   nesting `<button>` inside `<a>` is invalid HTML. Instead
                   the card is a `<div>` with an absolutely-positioned link
                   overlay catching clicks on empty regions, while the
                   copy button sits on its own `z-[1]` stacking context and
                   intercepts its clicks before they reach the overlay. */
                <div
                  key={g.type}
                  className="group relative flex flex-col gap-3 p-4 rounded-xl border border-border hover:border-muted-foreground/50 hover:bg-surface-2 transition-colors"
                >
                  <a
                    href={g.docsUrl}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={`${g.name} installation guide`}
                    className="absolute inset-0 rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <span className="sr-only">Open {g.name} installation guide</span>
                  </a>
                  {/* Non-interactive content opts out of pointer events so
                      the full card area (outside the copy control) routes
                      clicks through to the docs overlay above. */}
                  <div className="relative z-[1] flex items-start gap-3 pointer-events-none">
                    <span className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-border-subtle bg-surface-1">
                      <RuntimeLogo runtime={g.type} size={getLogoSize(20, g.type)} />
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-sm font-medium truncate">{g.name}</p>
                        <ArrowUpRight className="h-3.5 w-3.5 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
                      </div>
                      <p className="text-xs text-muted-foreground truncate">{g.desc}</p>
                    </div>
                  </div>
                  <InstallCommand command={g.install} className="relative z-[1]" />
                  <div className="relative z-[1] flex items-center gap-1 text-[11px] text-muted-foreground pointer-events-none">
                    <span>Installation guide:</span>
                    <span className="font-medium text-foreground/80 group-hover:text-foreground truncate">
                      {g.docsLabel}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          <p className="text-center text-xs text-muted-foreground mt-8">
            Already installed a runtime? Nexu will auto-detect it on next scan.
          </p>
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

const statusLabels: Record<Runtime["status"], string> = {
  connected: "Online",
  disconnected: "Offline",
  error: "Error",
};

function StatusBadge({ status }: { status: Runtime["status"] }): ReactElement {
  return (
    <div
      className={cn(
        "flex items-center gap-1.5 text-xs font-medium",
        status === "connected" && "text-nexu-online",
        status === "disconnected" && "text-muted-foreground",
        status === "error" && "text-destructive",
      )}
    >
      <span
        className={cn(
          "h-2 w-2 rounded-full",
          status === "connected" && "bg-nexu-online",
          status === "disconnected" && "bg-nexu-offline",
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
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="-rotate-90"
        aria-label={`${label} ${sublabel}`}
      >
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
        <span className="text-[10px] text-muted-foreground">{sublabel}</span>
      </div>
    </div>
  );
}
