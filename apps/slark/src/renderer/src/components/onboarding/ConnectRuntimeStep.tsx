import { Button, RuntimeLogo, cn } from "@nexu-design/ui-web";
import {
  AlertTriangle,
  ArrowRight,
  Check,
  ChevronDown,
  ArrowUpRight,
  Loader2,
  RefreshCw,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useRuntimesStore } from "@/stores/runtimes";
import type { Runtime } from "@/types";

const INSTALL_GUIDES: {
  type: string;
  name: string;
  desc: string;
  install: string;
  docsUrl: string;
  docsLabel: string;
}[] = [
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
    desc: "Nous Research agent",
    install: "See repo for install steps",
    docsUrl: "https://github.com/nousresearch/hermes-agent",
    docsLabel: "github.com/nousresearch/hermes-agent",
  },
  {
    type: "openclaw",
    name: "OpenClaw",
    desc: "Multi-agent orchestrator",
    install: "npm install -g openclaw",
    docsUrl: "https://github.com/openclaw/openclaw#install",
    docsLabel: "github.com/openclaw",
  },
  {
    type: "pi",
    name: "Pi",
    desc: "Conversational AI assistant",
    install: "brew install pi-cli",
    docsUrl: "https://pi.ai/docs/cli",
    docsLabel: "pi.ai/docs",
  },
];

interface DetectedRuntime {
  type: string;
  name: string;
  desc: string;
  detected: boolean;
  version?: string;
  path?: string;
  error?: string;
}

const LOGO_OPTICAL_SCALE: Record<string, number> = {
  codex: 1.45,
  "gemini-cli": 1.25,
  pi: 1.2,
};

function getLogoSize(base: number, type: string): number {
  return Math.round(base * (LOGO_OPTICAL_SCALE[type] ?? 1));
}

const SCAN_DURATION = 3500;
const STAGGER_DELAY = 400;

export function ConnectRuntimeStep(): React.ReactElement {
  const navigate = useNavigate();
  const setGlobalRuntimes = useRuntimesStore((s) => s.setRuntimes);
  const devSimulateNone = useRuntimesStore((s) => s.devSimulateNone);
  const [phase, setPhase] = useState<"scanning" | "done">("scanning");
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
    const mockResults: { index: number; version: string; path: string; error?: string }[] =
      devSimulateNone
        ? []
        : [
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
    };

    const timers = mockResults.map(({ index, version, path, error }, i) =>
      setTimeout(
        () => {
          setRuntimes((prev) =>
            prev.map((rt, j) =>
              j === index ? { ...rt, detected: true, version, path, error } : rt,
            ),
          );
          revealedCount++;
          if (revealedCount === mockResults.length) {
            setTimeout(finishScan, 400);
          }
        },
        STAGGER_DELAY * (i + 2),
      ),
    );

    const doneTimer = setTimeout(finishScan, SCAN_DURATION);

    return () => {
      timers.forEach(clearTimeout);
      clearTimeout(doneTimer);
    };
  }, [devSimulateNone]);

  useEffect(() => {
    if (phase === "done") {
      const workingTypes = runtimes.filter((r) => r.detected && !r.error).map((r) => r.type);
      setSelected(new Set(workingTypes));
    }
  }, [phase, runtimes]);

  const toggleSelect = (type: string): void => {
    const rt = runtimes.find((r) => r.type === type);
    if (!rt?.detected || rt.error) return;
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(type)) next.delete(type);
      else next.add(type);
      return next;
    });
  };

  const [showMore, setShowMore] = useState(false);

  const errorCount = runtimes.filter((r) => r.detected && r.error).length;
  const detectedCount = runtimes.filter((r) => r.detected).length;
  const showTutorial = phase === "done" && detectedCount === 0;

  const readyRuntimes = runtimes.filter((r) => r.detected && !r.error);
  const attentionRuntimes = runtimes.filter((r) => r.detected && !!r.error);
  const notInstalled = runtimes.filter((r) => !r.detected);
  const otherRuntimes = [...attentionRuntimes, ...notInstalled];

  useEffect(() => {
    if (phase === "done" && readyRuntimes.length === 0) {
      setShowMore(true);
    }
  }, [phase, readyRuntimes.length]);

  const goSkip = (): void => navigate("/onboarding/agent");
  const goContinue = (): void => {
    const selectedRuntimes: Runtime[] = runtimes
      .filter((r) => r.detected && !r.error && selected.has(r.type))
      .map((r) => ({
        id: `rt-${r.type}`,
        name: r.name,
        type: r.type as Runtime["type"],
        status: "connected" as const,
        version: r.version,
        config: r.path ? { path: r.path } : {},
        ownerId: "u-1",
      }));
    setGlobalRuntimes(selectedRuntimes);
    navigate("/onboarding/agent");
  };

  return (
    <div className="flex flex-col items-center gap-6 pt-6">
      <div className="text-center max-w-lg">
        <h2 className="text-xl font-semibold text-text-primary">
          {phase === "scanning"
            ? "Detecting runtimes…"
            : showTutorial
              ? "No runtimes found"
              : "Runtimes detected"}
        </h2>
        {(phase === "scanning" || showTutorial) && (
          <p className="mt-1 text-sm text-text-secondary">
            {phase === "scanning"
              ? "Scanning your system for installed AI runtimes"
              : "Install a runtime below, then rescan."}
          </p>
        )}
      </div>

      {phase === "done" && !showTutorial && (
        <StatusBar
          readyCount={readyRuntimes.length}
          attentionCount={errorCount}
          totalCount={runtimes.length}
          selectedCount={selected.size}
        />
      )}

      {showTutorial && (
        <div className="grid grid-cols-4 gap-2.5 w-full max-w-2xl">
          {INSTALL_GUIDES.map((g) => (
            <a
              key={g.type}
              href={g.docsUrl}
              target="_blank"
              rel="noreferrer"
              className="group flex flex-col gap-1.5 p-3 rounded-xl border border-border hover:border-border-hover hover:bg-surface-2 transition-all text-left"
            >
              <div className="flex items-center justify-between w-full">
                <span className="flex size-8 shrink-0 items-center justify-center rounded-lg border border-border-subtle bg-surface-1">
                  <RuntimeLogo runtime={g.type} size={getLogoSize(16, g.type)} />
                </span>
                <ArrowUpRight className="size-3.5 text-text-primary" />
              </div>
              <div className="text-sm font-medium text-text-primary leading-tight">{g.name}</div>
              <div className="text-[11px] text-text-muted truncate group-hover:text-text-secondary transition-colors">
                {g.docsLabel}
              </div>
            </a>
          ))}
        </div>
      )}

      {phase === "scanning" && !showTutorial && (
        <div className="grid grid-cols-3 gap-3 w-full max-w-2xl">
          {runtimes.map((runtime) => (
            <DetectedCard
              key={runtime.type}
              runtime={runtime}
              phase={phase}
              selected={selected}
              onToggle={toggleSelect}
            />
          ))}
        </div>
      )}

      {phase === "done" && !showTutorial && (
        <div className="w-full max-w-2xl flex flex-col gap-4">
          {readyRuntimes.length > 0 && (
            <div className="grid grid-cols-3 gap-3">
              {readyRuntimes.map((runtime) => (
                <DetectedCard
                  key={runtime.type}
                  runtime={runtime}
                  phase={phase}
                  selected={selected}
                  onToggle={toggleSelect}
                />
              ))}
            </div>
          )}

          {otherRuntimes.length > 0 && (
            <div>
              {readyRuntimes.length > 0 && (
                <button
                  type="button"
                  onClick={() => setShowMore((v) => !v)}
                  aria-expanded={showMore}
                  className="flex items-center gap-1.5 text-xs font-medium text-text-secondary hover:text-text-primary transition-colors"
                >
                  <ChevronDown
                    className={cn(
                      "size-3.5 transition-transform",
                      showMore ? "rotate-180" : "rotate-0",
                    )}
                  />
                  {showMore ? "Hide" : "Show"} {otherRuntimes.length} other runtime
                  {otherRuntimes.length !== 1 ? "s" : ""}
                </button>
              )}
              {showMore && (
                <div className={cn("grid grid-cols-3 gap-3", readyRuntimes.length > 0 && "mt-3")}>
                  {otherRuntimes.map((runtime) => (
                    <OtherRuntimeCard key={runtime.type} runtime={runtime} />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      <div className="flex flex-col items-center gap-2 mt-4">
        {showTutorial ? (
          <Button
            type="button"
            onClick={() => window.location.reload()}
            className="min-w-[240px]"
            leadingIcon={<RefreshCw className="size-4" />}
          >
            Rescan
          </Button>
        ) : (
          <Button
            type="button"
            onClick={goContinue}
            disabled={phase === "scanning" || selected.size === 0}
            className="min-w-[240px]"
            trailingIcon={<ArrowRight className="size-4" />}
          >
            Continue with {selected.size} runtime{selected.size !== 1 ? "s" : ""}
          </Button>
        )}
        <Button type="button" onClick={goSkip} variant="ghost" size="sm">
          Skip for now
        </Button>
      </div>
    </div>
  );
}

function StatusBar({
  readyCount,
  attentionCount,
  totalCount,
  selectedCount,
}: {
  readyCount: number;
  attentionCount: number;
  totalCount: number;
  selectedCount: number;
}): React.ReactElement {
  const hasAttention = attentionCount > 0;
  const allSelected = readyCount > 0 && selectedCount === readyCount;

  const guidance = hasAttention
    ? "Pick the ones you want, or resolve issues below to include more."
    : readyCount === 0
      ? "No runtimes can be used yet. Resolve issues below or skip for now."
      : allSelected
        ? "You're all set. Continue when ready."
        : "Pick the runtimes you want to use, then continue.";

  return (
    <div className="w-full max-w-2xl flex items-center justify-between gap-4 rounded-lg border border-border bg-surface-1 px-4 py-2.5">
      <div className="flex items-center gap-3">
        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-text-primary">
          <span
            className={cn(
              "inline-block size-1.5 rounded-full",
              readyCount > 0 ? "bg-success" : "bg-border-strong",
            )}
          />
          {readyCount}/{totalCount} ready
        </span>
        {hasAttention && (
          <>
            <span className="h-3 w-px bg-border" aria-hidden="true" />
            <span className="inline-flex items-center gap-1.5 text-xs font-medium text-text-secondary">
              <AlertTriangle className="size-3.5 text-text-muted" />
              {attentionCount} need attention
            </span>
          </>
        )}
      </div>
      <span className="text-xs text-text-secondary text-right">{guidance}</span>
    </div>
  );
}

function DetectedCard({
  runtime,
  phase,
  selected,
  onToggle,
}: {
  runtime: DetectedRuntime;
  phase: "scanning" | "done";
  selected: Set<string>;
  onToggle: (type: string) => void;
}): React.ReactElement {
  const { type, name, desc, detected, version, error } = runtime;
  const isSelected = selected.has(type);
  const isScanning = phase === "scanning" && !detected;
  const isError = detected && !!error;
  const isWorking = detected && !error;

  const base =
    "group flex flex-col items-stretch gap-2 p-4 rounded-xl border bg-card text-left transition-[box-shadow,transform,border-color] duration-200 ease-out";

  const stateClasses = (() => {
    if (isWorking && isSelected) {
      return "border-[var(--color-brand-primary)] shadow-refine";
    }
    if (isWorking) {
      return "border-[var(--color-border-subtle)] shadow-rest hover:-translate-y-px hover:shadow-refine hover:border-[var(--color-border)] cursor-pointer";
    }
    if (isError) {
      return "border-[var(--color-border-subtle)] shadow-rest";
    }
    return "border-[var(--color-border-subtle)] shadow-rest opacity-60";
  })();

  return (
    <button
      type="button"
      onClick={() => phase === "done" && isWorking && onToggle(type)}
      disabled={phase === "scanning" || !isWorking}
      aria-pressed={isWorking ? isSelected : undefined}
      className={cn(base, stateClasses, "disabled:cursor-default")}
    >
      <div className="flex items-center gap-2.5 w-full">
        <span className="flex size-7 shrink-0 items-center justify-center rounded-lg border border-border-subtle bg-surface-1">
          <RuntimeLogo runtime={type} size={getLogoSize(14, type)} />
        </span>
        <div className="flex-1 min-w-0 text-sm font-semibold text-text-heading truncate">
          {name}
        </div>
        {isWorking && isSelected && (
          <Check className="size-4 shrink-0 text-[var(--color-brand-primary)]" strokeWidth={3} />
        )}
        {isError && <AlertTriangle className="size-4 shrink-0 text-text-muted" />}
        {isScanning && <Loader2 className="size-4 shrink-0 text-text-muted animate-spin" />}
      </div>
      <div className="text-xs text-text-muted truncate">{desc}</div>
      {isWorking && (
        <div className="text-[11px] text-text-muted truncate w-full font-mono">v{version}</div>
      )}
      {isError && (
        <div
          className="text-xs text-text-muted w-full leading-tight truncate"
          title={`v${version} · ${error}`}
        >
          v{version} · {error}
        </div>
      )}
    </button>
  );
}

function OtherRuntimeCard({ runtime }: { runtime: DetectedRuntime }): React.ReactElement {
  const { type, name, desc, detected, version, error } = runtime;
  const hasError = detected && !!error;
  const guide = INSTALL_GUIDES.find((g) => g.type === type);

  const cardClasses =
    "group flex flex-col items-stretch gap-2 p-4 rounded-xl border border-[var(--color-border-subtle)] bg-card text-left shadow-rest transition-[box-shadow,transform,border-color] duration-200 ease-out";

  const errorLine = hasError ? `v${version} · ${error}` : "";

  const content = (
    <>
      <div className="flex items-center gap-2.5 w-full">
        <span className="flex size-7 shrink-0 items-center justify-center rounded-lg border border-border-subtle bg-surface-1">
          <RuntimeLogo runtime={type} size={getLogoSize(14, type)} />
        </span>
        <div className="flex-1 min-w-0 text-sm font-semibold text-text-heading truncate">
          {name}
        </div>
        {hasError ? (
          <AlertTriangle className="size-4 shrink-0 text-text-muted" />
        ) : (
          <ArrowUpRight className="size-4 shrink-0 text-text-primary" />
        )}
      </div>
      <div className="text-xs text-text-muted truncate">{desc}</div>
      {hasError ? (
        <div className="text-xs text-text-muted w-full leading-tight truncate" title={errorLine}>
          {errorLine}
        </div>
      ) : (
        <div className="text-xs font-medium text-[var(--color-brand-primary)] w-full leading-tight">
          Install
        </div>
      )}
    </>
  );

  if (hasError) {
    return <div className={cardClasses}>{content}</div>;
  }

  return (
    <a
      href={guide?.docsUrl}
      target="_blank"
      rel="noreferrer"
      className={cn(
        cardClasses,
        "hover:-translate-y-px hover:shadow-refine hover:border-[var(--color-border)] cursor-pointer",
      )}
    >
      {content}
    </a>
  );
}
