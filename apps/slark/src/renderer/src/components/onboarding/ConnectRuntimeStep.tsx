import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AlertTriangle, ArrowRight, Check, Loader2, X } from "lucide-react";
import { Alert, AlertDescription, Button, Progress, cn } from "@nexu-design/ui-web";
import { useRuntimesStore } from "@/stores/runtimes";
import type { Runtime } from "@/types";

interface DetectedRuntime {
  type: string;
  name: string;
  desc: string;
  detected: boolean;
  version?: string;
  path?: string;
  error?: string;
}

const RUNTIME_BRANDS: Record<string, { label: string; color: string }> = {
  "claude-code": { label: ">_", color: "#B45309" },
  cursor: { label: "▸", color: "#171717" },
  opencode: { label: "</>", color: "#059669" },
  codex: { label: "◎", color: "#0369A1" },
  "gemini-cli": { label: "✦", color: "#4285F4" },
  hermes: { label: "H", color: "#EA580C" },
  openclaw: { label: "⊞", color: "#7C3AED" },
  pi: { label: "π", color: "#DB2777" },
};

const SCAN_DURATION = 3500;
const STAGGER_DELAY = 400;

export function ConnectRuntimeStep(): React.ReactElement {
  const navigate = useNavigate();
  const setGlobalRuntimes = useRuntimesStore((state) => state.setRuntimes);
  const [phase, setPhase] = useState<"scanning" | "done">("scanning");
  const [scanProgress, setScanProgress] = useState(0);
  const [runtimes, setRuntimes] = useState<DetectedRuntime[]>([
    { type: "claude-code", name: "Claude Code", desc: "Anthropic's coding agent", detected: false },
    { type: "cursor", name: "Cursor", desc: "AI-first code editor", detected: false },
    { type: "opencode", name: "OpenCode", desc: "Open-source coding agent", detected: false },
    { type: "codex", name: "Codex", desc: "OpenAI coding agent", detected: false },
    { type: "gemini-cli", name: "Gemini CLI", desc: "Google's AI coding agent", detected: false },
    { type: "hermes", name: "Hermes", desc: "Local LLM runtime", detected: false },
    { type: "openclaw", name: "OpenClaw", desc: "Multi-agent orchestrator", detected: false },
    { type: "pi", name: "Pi", desc: "Conversational AI assistant", detected: false },
  ]);
  const [selected, setSelected] = useState<Set<string>>(new Set());

  useEffect(() => {
    const start = Date.now();
    const progressInterval = setInterval(() => {
      const elapsed = Date.now() - start;
      setScanProgress(Math.min(elapsed / SCAN_DURATION, 1));
    }, 50);

    const mockResults: { index: number; version: string; path: string; error?: string }[] = [
      { index: 0, version: "1.0.12", path: "/usr/local/bin/claude" },
      { index: 2, version: "0.5.3", path: "/usr/local/bin/opencode" },
      { index: 4, version: "0.1.0", path: "/usr/local/bin/gemini" },
      {
        index: 6,
        version: "0.2.1",
        path: "/usr/local/bin/openclaw",
        error: "Requires update (min v0.3.0)",
      },
      { index: 7, version: "1.3.0", path: "/usr/local/bin/pi", error: "Auth token expired" },
    ];

    let revealedCount = 0;
    let finished = false;

    const finishScan = (): void => {
      if (finished) return;
      finished = true;
      setPhase("done");
      clearInterval(progressInterval);
      setScanProgress(1);
    };

    const timers = mockResults.map(({ index, version, path, error }, offset) =>
      setTimeout(
        () => {
          setRuntimes((previous) =>
            previous.map((runtime, runtimeIndex) =>
              runtimeIndex === index
                ? { ...runtime, detected: true, version, path, error }
                : runtime,
            ),
          );
          revealedCount += 1;
          if (revealedCount === mockResults.length) {
            setTimeout(finishScan, 400);
          }
        },
        STAGGER_DELAY * (offset + 2),
      ),
    );

    const doneTimer = setTimeout(finishScan, SCAN_DURATION);

    return () => {
      clearInterval(progressInterval);
      timers.forEach(clearTimeout);
      clearTimeout(doneTimer);
    };
  }, []);

  useEffect(() => {
    if (phase === "done") {
      const workingTypes = runtimes
        .filter((runtime) => runtime.detected && !runtime.error)
        .map((runtime) => runtime.type);
      setSelected(new Set(workingTypes));
    }
  }, [phase, runtimes]);

  const toggleSelect = (type: string): void => {
    const runtime = runtimes.find((item) => item.type === type);
    if (!runtime?.detected || runtime.error) return;

    setSelected((previous) => {
      const next = new Set(previous);
      if (next.has(type)) next.delete(type);
      else next.add(type);
      return next;
    });
  };

  const errorCount = runtimes.filter((runtime) => runtime.detected && runtime.error).length;
  const detectedCount = runtimes.filter((runtime) => runtime.detected).length;

  return (
    <div className="w-full">
      <div className="text-center">
        <h1 className="text-[20px] font-semibold leading-tight text-text-heading">
          {phase === "scanning" ? "Detecting runtimes" : "Review detected runtimes"}
        </h1>
        <p className="mt-1.5 text-[13px] leading-relaxed text-text-secondary">
          {phase === "scanning"
            ? "Scanning your machine for compatible AI runtimes."
            : `Found ${detectedCount} runtime${detectedCount !== 1 ? "s" : ""}${errorCount > 0 ? ` • ${errorCount} need attention` : ""}.`}
        </p>
      </div>

      <div className="mt-6 space-y-5">
        {phase === "scanning" ? (
          <div className="space-y-2">
            <div className="flex items-center justify-center gap-2 text-[12px] text-text-secondary">
              <Loader2 className="size-3.5 animate-spin" />
              Checking PATH and common install locations…
            </div>
            <Progress value={scanProgress * 100} className="h-1" />
          </div>
        ) : null}

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {runtimes.map(({ type, name, desc, detected, version, path, error }) => {
            const isSelected = selected.has(type);
            const isError = detected && !!error;
            const isWorking = detected && !error;
            const notFound = phase === "done" && !detected;
            const brand = RUNTIME_BRANDS[type];
            const brandColor = brand?.color ?? "#666";

            return (
              <button
                key={type}
                type="button"
                onClick={() => phase === "done" && toggleSelect(type)}
                disabled={phase === "scanning" || !isWorking}
                className={cn(
                  "flex min-h-[128px] flex-col items-start gap-3 rounded-xl border p-3.5 text-left transition-colors",
                  isWorking && isSelected
                    ? "border-accent bg-accent/5"
                    : isWorking
                      ? "border-border bg-surface-0 hover:bg-surface-2"
                      : isError
                        ? "border-warning/40 bg-warning-subtle"
                        : "border-dashed border-border bg-surface-0",
                )}
              >
                <div className="flex w-full items-center justify-between gap-2">
                  <div
                    className="flex h-7 w-7 items-center justify-center rounded-md text-[11px] font-semibold"
                    style={{
                      color: notFound ? undefined : brandColor,
                      backgroundColor: notFound ? undefined : `${brandColor}1A`,
                    }}
                  >
                    {brand?.label ?? "?"}
                  </div>

                  {isWorking && isSelected ? (
                    <div className="flex size-4 shrink-0 items-center justify-center rounded-full bg-accent">
                      <Check className="size-3 text-accent-fg" strokeWidth={3} />
                    </div>
                  ) : isWorking ? (
                    <Check className="size-4 shrink-0 text-success" strokeWidth={3} />
                  ) : isError ? (
                    <AlertTriangle className="size-4 shrink-0 text-warning" />
                  ) : phase === "done" ? (
                    <X className="size-4 shrink-0 text-text-muted" />
                  ) : (
                    <Loader2 className="size-4 shrink-0 animate-spin text-text-muted" />
                  )}
                </div>

                <div className="space-y-1">
                  <div
                    className={cn(
                      "text-[13px] font-semibold",
                      notFound ? "text-text-muted" : "text-text-primary",
                    )}
                  >
                    {name}
                  </div>
                  <div
                    className={cn(
                      "text-[11px] leading-relaxed",
                      notFound ? "text-text-muted" : "text-text-secondary",
                    )}
                  >
                    {desc}
                  </div>
                </div>

                {isWorking ? (
                  <div className="mt-auto w-full truncate font-mono text-[10.5px] text-text-tertiary">
                    v{version} · {path}
                  </div>
                ) : null}

                {isError ? (
                  <div className="mt-auto w-full truncate font-mono text-[10.5px] text-warning">
                    v{version} · {error}
                  </div>
                ) : null}

                {notFound ? (
                  <div className="mt-auto text-[11px] text-text-muted">Not found</div>
                ) : null}
              </button>
            );
          })}
        </div>

        {errorCount > 0 && phase === "done" ? (
          <Alert variant="warning">
            <AlertTriangle className="size-4" />
            <AlertDescription>
              Some runtimes were detected but need attention before they can be selected.
            </AlertDescription>
          </Alert>
        ) : null}

        <div className="flex justify-end gap-2">
          <Button variant="ghost" onClick={() => navigate("/onboarding/agent")}>
            Skip for now
          </Button>
          <Button
            onClick={() => {
              const selectedRuntimes: Runtime[] = runtimes
                .filter(
                  (runtime) => runtime.detected && !runtime.error && selected.has(runtime.type),
                )
                .map((runtime) => ({
                  id: `rt-${runtime.type}`,
                  name: runtime.name,
                  type: runtime.type as Runtime["type"],
                  status: "connected" as const,
                  version: runtime.version,
                  config: runtime.path ? { path: runtime.path } : {},
                  ownerId: "u-1",
                }));

              setGlobalRuntimes(selectedRuntimes);
              navigate("/onboarding/agent");
            }}
            disabled={phase === "scanning" || selected.size === 0}
            trailingIcon={<ArrowRight size={16} />}
          >
            Continue with {selected.size} runtime{selected.size !== 1 ? "s" : ""}
          </Button>
        </div>
      </div>
    </div>
  );
}
