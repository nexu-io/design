import { cn } from "@nexu-design/ui-web";
import { Box, Code, Cpu, MousePointer, RefreshCw, Sparkles, Terminal } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

import { useT } from "@/i18n";
import { mockUsers } from "@/mock/data";
import { useRuntimesStore } from "@/stores/runtimes";
import { useWorkspaceStore } from "@/stores/workspace";
import type { Runtime } from "@/types";

interface DetectedRuntime {
  type: Runtime["type"];
  name: string;
  desc: string;
  version: string;
  path: string;
}

const MOCK_DETECTION_POOL: DetectedRuntime[] = [
  {
    type: "claude-code",
    name: "Claude Code",
    desc: "Anthropic",
    version: "1.0.12",
    path: "/usr/local/bin/claude",
  },
  {
    type: "opencode",
    name: "OpenCode",
    desc: "Open-source",
    version: "0.5.3",
    path: "/usr/local/bin/opencode",
  },
  {
    type: "gemini-cli",
    name: "Gemini CLI",
    desc: "Google",
    version: "0.1.0",
    path: "/usr/local/bin/gemini",
  },
  { type: "codex", name: "Codex", desc: "OpenAI", version: "0.3.1", path: "/usr/local/bin/codex" },
];

const typeIcons: Record<Runtime["type"], React.ElementType> = {
  "claude-code": Terminal,
  cursor: MousePointer,
  opencode: Code,
  hermes: Cpu,
  codex: Box,
  "gemini-cli": Sparkles,
};

type Tab = "mine" | "all";

export function RuntimesSidebar(): React.ReactElement {
  const t = useT();
  const { runtimes, addRuntime, selectRuntime, selectedRuntimeId, devSimulateNoDetection } =
    useRuntimesStore();
  const currentUserId = useWorkspaceStore((s) => s.currentUserId);
  const [tab, setTab] = useState<Tab>("mine");
  const [scanning, setScanning] = useState(true);
  const [detected, setDetected] = useState<DetectedRuntime[]>([]);
  const scanTimersRef = useRef<number[]>([]);

  const runScan = (): void => {
    scanTimersRef.current.forEach((t) => clearTimeout(t));
    scanTimersRef.current = [];
    setScanning(true);
    setDetected([]);
    const pool = devSimulateNoDetection ? [] : MOCK_DETECTION_POOL;
    pool.forEach((rt, i) => {
      const t = window.setTimeout(
        () => {
          setDetected((prev) => [...prev, rt]);
        },
        400 + i * 250,
      );
      scanTimersRef.current.push(t);
    });
    const done = window.setTimeout(() => setScanning(false), 400 + pool.length * 250 + 200);
    scanTimersRef.current.push(done);
  };

  useEffect(() => {
    runScan();
    return () => {
      scanTimersRef.current.forEach((t) => clearTimeout(t));
    };
  }, [devSimulateNoDetection]);

  const onlineCount = runtimes.filter((r) => r.status === "connected").length;
  const filtered = tab === "mine" ? runtimes.filter((r) => r.ownerId === currentUserId) : runtimes;

  const existingTypes = useMemo(() => new Set(runtimes.map((r) => r.type)), [runtimes]);
  const detectedNotAdded = detected.filter((d) => !existingTypes.has(d.type));

  const handleAddDetected = (d: DetectedRuntime): void => {
    const newRt: Runtime = {
      id: `rt-${d.type}-${Date.now()}`,
      name: d.name,
      type: d.type,
      status: "connected",
      version: d.version,
      config: { path: d.path },
      ownerId: currentUserId,
    };
    addRuntime(newRt);
    selectRuntime(newRt.id);
    setTab("mine");
  };

  return (
    <div className="flex flex-col h-full">
      <div className="px-3 pb-2 flex items-center gap-2">
        <span className="text-xs text-nav-muted">
          {t("runtimes.online", { online: String(onlineCount), total: String(runtimes.length) })}
        </span>
      </div>

      <div className="px-3 pb-2 flex items-center gap-1">
        <button
          onClick={() => setTab("mine")}
          className={cn(
            "px-2.5 py-1 rounded-md text-xs font-medium transition-colors",
            tab === "mine" ? "bg-nav-active text-white" : "text-nav-muted hover:text-nav-fg",
          )}
        >
          {t("runtimes.mine")}
        </button>
        <button
          onClick={() => setTab("all")}
          className={cn(
            "px-2.5 py-1 rounded-md text-xs font-medium transition-colors",
            tab === "all" ? "bg-nav-active text-white" : "text-nav-muted hover:text-nav-fg",
          )}
        >
          {t("runtimes.all")}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-2 pb-3">
        {filtered.map((rt) => {
          const Icon = typeIcons[rt.type];
          const ownerUser = tab === "all" ? mockUsers.find((u) => u.id === rt.ownerId) : null;
          return (
            <button
              key={rt.id}
              onClick={() => selectRuntime(rt.id)}
              className={cn(
                "flex items-center gap-2.5 w-full px-2 py-2 rounded-md transition-colors",
                selectedRuntimeId === rt.id
                  ? "bg-nav-active text-white"
                  : "text-nav-muted hover:bg-nav-hover hover:text-nav-fg",
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              <div className="min-w-0 flex-1 text-left">
                <div className="text-sm font-medium truncate">{rt.name}</div>
                {ownerUser ? (
                  <div className="flex items-center gap-1 text-xs text-nav-muted">
                    <img src={ownerUser.avatar} alt="" className="h-3 w-3 rounded-full" />
                    <span className="truncate">{ownerUser.name}</span>
                  </div>
                ) : (
                  <div className="text-xs text-nav-muted">{rt.type}</div>
                )}
              </div>
              <div
                className={cn(
                  "h-2 w-2 rounded-full shrink-0",
                  rt.status === "connected" && "bg-nexu-online",
                  rt.status === "disconnected" && "bg-nexu-offline",
                  rt.status === "error" && "bg-destructive",
                )}
              />
            </button>
          );
        })}

        {(scanning || detectedNotAdded.length > 0) && (
          <div className="mt-3 pt-3 border-t border-nav-border">
            <div className="flex items-center justify-between px-2 pb-1.5">
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-medium uppercase tracking-wide text-nav-muted">
                  {t("runtimes.detected")}
                </span>
                {scanning && <RefreshCw className="h-3 w-3 text-nav-muted animate-spin" />}
              </div>
              {!scanning && (
                <button
                  onClick={runScan}
                  className="text-nav-muted hover:text-nav-fg"
                  title={t("runtimes.rescan")}
                >
                  <RefreshCw className="h-3 w-3" />
                </button>
              )}
            </div>

            {!scanning && detectedNotAdded.length === 0 ? (
              <p className="px-2 py-2 text-xs text-nav-muted/70">{t("runtimes.noNew")}</p>
            ) : (
              detectedNotAdded.map((d) => {
                const Icon = typeIcons[d.type];
                return (
                  <div
                    key={d.type}
                    className="group flex items-center gap-2.5 w-full px-2 py-2 rounded-md text-nav-muted hover:bg-nav-hover"
                  >
                    <Icon className="h-4 w-4 shrink-0" />
                    <div className="min-w-0 flex-1 text-left">
                      <div className="text-sm font-medium truncate text-nav-fg">{d.name}</div>
                      <div className="text-xs text-nav-muted truncate">
                        v{d.version} · {d.path}
                      </div>
                    </div>
                    <button
                      onClick={() => handleAddDetected(d)}
                      className="shrink-0 px-2 py-0.5 text-xs font-medium rounded-md bg-nav-active text-white hover:opacity-90"
                    >
                      {t("runtimes.add")}
                    </button>
                  </div>
                );
              })
            )}
          </div>
        )}
      </div>
    </div>
  );
}
