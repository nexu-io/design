import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AlertTriangle, ArrowRight, Check, Loader2, Search, X } from "lucide-react";
import {
  Alert,
  AlertDescription,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Progress,
  cn,
} from "@nexu-design/ui-web";
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
    <Card
      variant="static"
      padding="lg"
      className="rounded-2xl border-border bg-surface-1 shadow-card"
    >
      <CardHeader className="text-center">
        <CardTitle className="text-2xl text-text-primary">
          {phase === "scanning" ? "Detecting runtimes" : "Review detected runtimes"}
        </CardTitle>
        <CardDescription className="text-sm text-text-secondary">
          {phase === "scanning"
            ? "Scanning your machine for compatible AI runtimes."
            : `Found ${detectedCount} runtime${detectedCount !== 1 ? "s" : ""}${errorCount > 0 ? ` • ${errorCount} need attention` : ""}.`}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-5">
        <Alert>
          <Search className="size-4" />
          <AlertDescription>
            Runtimes power your agents. Choose the ones Slark should use when you mention or assign
            work.
          </AlertDescription>
        </Alert>

        {phase === "scanning" ? (
          <div className="space-y-3 rounded-xl border border-border bg-surface-0 p-4">
            <div className="flex items-center gap-2 text-sm text-text-secondary">
              <Loader2 className="size-4 animate-spin" />
              Checking PATH and common install locations…
            </div>
            <Progress value={scanProgress * 100} />
          </div>
        ) : null}

        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {runtimes.map(({ type, name, desc, detected, version, path, error }) => {
            const isSelected = selected.has(type);
            const isError = detected && !!error;
            const isWorking = detected && !error;
            const brand = RUNTIME_BRANDS[type];

            return (
              <button
                key={type}
                type="button"
                onClick={() => phase === "done" && toggleSelect(type)}
                disabled={phase === "scanning" || !isWorking}
                className={cn(
                  "flex min-h-[152px] flex-col items-start gap-3 rounded-2xl border p-4 text-left transition-colors",
                  isWorking && isSelected
                    ? "border-accent bg-accent/5"
                    : isWorking
                      ? "border-border bg-surface-0 hover:bg-surface-2"
                      : isError
                        ? "border-warning/30 bg-warning-subtle/20"
                        : "border-border/60 bg-surface-0 opacity-60",
                )}
              >
                <div className="flex w-full items-center justify-between gap-2">
                  <div
                    className="flex h-8 w-8 items-center justify-center rounded-lg text-xs font-bold text-white"
                    style={{ backgroundColor: brand?.color ?? "#666" }}
                  >
                    {brand?.label ?? "?"}
                  </div>

                  {isWorking ? (
                    <Check
                      className={cn(
                        "size-4 shrink-0",
                        isSelected ? "text-text-primary" : "text-success",
                      )}
                      strokeWidth={3}
                    />
                  ) : isError ? (
                    <AlertTriangle className="size-4 shrink-0 text-warning" />
                  ) : phase === "done" ? (
                    <X className="size-4 shrink-0 text-text-muted" />
                  ) : (
                    <Loader2 className="size-4 shrink-0 animate-spin text-text-muted" />
                  )}
                </div>

                <div className="space-y-1">
                  <div className="text-sm font-semibold text-text-primary">{name}</div>
                  <div className="text-xs leading-relaxed text-text-secondary">{desc}</div>
                </div>

                {isWorking ? (
                  <div className="mt-auto text-xs text-text-tertiary">
                    v{version} • {path}
                  </div>
                ) : null}

                {isError ? (
                  <div className="mt-auto text-xs leading-relaxed text-warning">
                    v{version} • {error}
                  </div>
                ) : null}

                {phase === "done" && !detected ? (
                  <div className="mt-auto text-xs text-text-tertiary">Not found</div>
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
          <Button variant="outline" onClick={() => navigate("/onboarding/agent")}>
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
          >
            Continue with {selected.size} runtime{selected.size !== 1 ? "s" : ""}
            <ArrowRight className="size-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
