import { Button, RuntimeLogo, cn } from "@nexu-design/ui-web";
import { RefreshCw } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

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

type Tab = "mine" | "all";

export function RuntimesSidebar(): React.ReactElement {
  const { runtimes, addRuntime, selectRuntime, selectedRuntimeId, devSimulateNoDetection } =
    useRuntimesStore();
  const currentUserId = useWorkspaceStore((s) => s.currentUserId);
  const [tab, setTab] = useState<Tab>("mine");
  const [scanning, setScanning] = useState(true);
  const [detected, setDetected] = useState<DetectedRuntime[]>([]);
  const scanTimersRef = useRef<number[]>([]);

  const runScan = useCallback((): void => {
    for (const timer of scanTimersRef.current) {
      clearTimeout(timer);
    }
    scanTimersRef.current = [];
    setScanning(true);
    setDetected([]);
    const pool = devSimulateNoDetection ? [] : MOCK_DETECTION_POOL;
    for (const [index, runtime] of pool.entries()) {
      const t = window.setTimeout(
        () => {
          setDetected((prev) => [...prev, runtime]);
        },
        400 + index * 250,
      );
      scanTimersRef.current.push(t);
    }
    const done = window.setTimeout(() => setScanning(false), 400 + pool.length * 250 + 200);
    scanTimersRef.current.push(done);
  }, [devSimulateNoDetection]);

  useEffect(() => {
    runScan();
    return () => {
      for (const timer of scanTimersRef.current) {
        clearTimeout(timer);
      }
    };
  }, [runScan]);

  const onlineCount = runtimes.filter((r) => r.status === "connected").length;
  const hasRuntimes = runtimes.length > 0;
  /*
   * Filter tabs + the `N/M online` meta only carry weight once at least
   * one runtime exists. In the empty state both collapse to `0/0` /
   * `Mine=All=∅`, so we hide them to keep the header focused on the
   * single action that actually matters (picking from the Detected
   * list below). They reappear automatically after the first Add.
   */
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
      {/* Unified header row — `Runtimes` section label and the `N/M online`
          meta share one line, at the same `px-3` padding as the tabs and
          list below, so everything left-aligns cleanly. The `px-1.5` ghost
          indent the outer Sidebar applies to generic section labels is
          explicitly suppressed for `/runtimes` so this header takes over.
          Title treatment (13px semibold `text-nav-fg`) mirrors the Teammate
          sidebar's page title so the two functional sidebars read at the
          same hierarchy level. The meta "N/M online" stays muted/11px so
          it reads as secondary. */}
      <div className="px-3 pb-1.5 flex items-baseline justify-between">
        <span className="text-[13px] font-semibold uppercase tracking-wider text-nav-fg">
          Runtimes
        </span>
        {hasRuntimes ? (
          <span className="text-[11px] text-nav-muted tabular-nums">
            {onlineCount}/{runtimes.length} online
          </span>
        ) : null}
      </div>

      {hasRuntimes ? (
        <div className="px-3 pb-2 flex items-center gap-1">
          <Button
            type="button"
            variant="ghost"
            size="inline"
            onClick={() => setTab("mine")}
            className={cn(
              "px-2.5 py-1 rounded-md text-xs font-medium transition-colors",
              tab === "mine"
                ? "bg-nav-active text-nav-active-fg"
                : "text-nav-muted hover:text-nav-fg",
            )}
          >
            Mine
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="inline"
            onClick={() => setTab("all")}
            className={cn(
              "px-2.5 py-1 rounded-md text-xs font-medium transition-colors",
              tab === "all"
                ? "bg-nav-active text-nav-active-fg"
                : "text-nav-muted hover:text-nav-fg",
            )}
          >
            All
          </Button>
        </div>
      ) : (
        <div className="pb-1" />
      )}

      <div className="flex-1 overflow-y-auto px-2 pb-3">
        <div className="space-y-0.5">
          {filtered.map((rt) => {
            const ownerUser = tab === "all" ? mockUsers.find((u) => u.id === rt.ownerId) : null;
            return (
              <Button
                key={rt.id}
                type="button"
                variant="ghost"
                size="inline"
                onClick={() => selectRuntime(rt.id)}
                className={cn(
                  "flex items-center gap-2.5 w-full px-2 py-2 rounded-md transition-colors",
                  selectedRuntimeId === rt.id
                    ? "bg-nav-active text-nav-active-fg"
                    : "text-nav-muted hover:bg-nav-hover hover:text-nav-fg",
                )}
              >
                <RuntimeLogo runtime={rt.type} size={16} className="shrink-0" />
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
              </Button>
            );
          })}
        </div>

        {(scanning || detectedNotAdded.length > 0) && (
          <div className="mt-3 pt-3 border-t border-nav-border">
            {/* The label sits on the left and the rescan affordance always
                occupies the same trailing slot, regardless of state. While
                `scanning`, the same button renders the spinning glyph and
                is disabled; idle, it becomes clickable. Previously the
                spinner lived inline next to the label and a separate
                button mounted on the right only when idle, which caused
                the label and icon to jump horizontally on every rescan. */}
            <div className="flex items-center justify-between px-2 pb-1.5">
              <span className="text-[11px] font-medium uppercase tracking-wide text-nav-muted">
                Detected on this device
              </span>
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                onClick={runScan}
                disabled={scanning}
                className="text-nav-muted hover:text-nav-fg"
                title={scanning ? "Scanning…" : "Rescan"}
              >
                <RefreshCw className={cn("h-3 w-3", scanning && "animate-spin")} />
              </Button>
            </div>

            {!scanning && detectedNotAdded.length === 0 ? (
              <p className="px-2 py-2 text-xs text-nav-muted/70">No new runtimes found.</p>
            ) : (
              <div className="space-y-0.5">
                {detectedNotAdded.map((d) => {
                  return (
                    <div
                      key={d.type}
                      className="group flex items-center gap-2.5 w-full px-2 py-2 rounded-md text-nav-muted hover:bg-nav-hover"
                    >
                      <RuntimeLogo runtime={d.type} size={16} className="shrink-0" />
                      <div className="min-w-0 flex-1 text-left">
                        <div className="text-sm font-medium truncate text-nav-fg">{d.name}</div>
                        <div className="text-xs font-normal text-text-tertiary truncate">
                          v{d.version} · {d.path}
                        </div>
                      </div>
                      {/* `outline` is the canonical weight for secondary actions
                        (AGENTS.md). The primary black fill was too heavy for
                        a row-level affordance repeated 4 times in a narrow
                        sidebar and made the panel feel shouty. */}
                      <Button
                        type="button"
                        size="xs"
                        variant="outline"
                        onClick={() => handleAddDetected(d)}
                        className="shrink-0"
                      >
                        Add
                      </Button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
