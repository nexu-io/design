import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  AlertTriangle,
  Check,
  ChevronDown,
  ChevronUp,
  CircleDashed,
  Hourglass,
  X,
} from "lucide-react";
import { useState } from "react";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Badge,
  Button,
  ChatMessage,
  FileAttachment,
  cn,
} from "@nexu-design/ui-web";

/**
 * Agent Run Message — review-only prototype stories
 *
 * Purpose: prototype three companion components that don't exist in ui-web yet:
 *   - ThinkingLabel : shimmer-animated phase label (Cursor-style)
 *   - AgentRunLog   : collapsible tool-call timeline
 *   - AgentResultCard : structured success/failure output card
 *   - AgentRunMessage : compose ChatMessage + the above into one "agent turn"
 *
 * Design direction captured from product review:
 *   - "Thinking..." text has a subtle shimmer animation (Cursor style)
 *   - Tool call count is de-emphasised (moved to trailing meta row)
 *   - Timeline connector line softened / removed
 *   - State dots minimized — rely more on icon shape + muted color than saturation
 *
 * These are INLINE prototypes only. Do not import them into apps/slark yet.
 * Once approved, they graduate to packages/ui-web in a follow-up PR.
 */

// ---------------------------------------------------------------------------
// Shimmer keyframes — scoped to this story file, not polluting global CSS.
// When graduated to ui-web, move to packages/ui-web/src/styles.css.
// ---------------------------------------------------------------------------

const SHIMMER_STYLES = `
  @keyframes agent-run-shimmer {
    0%   { background-position: 200% 0; }
    100% { background-position: -200% 0; }
  }
  .agent-run-shimmer-text {
    background: linear-gradient(
      90deg,
      var(--color-text-muted) 0%,
      var(--color-text-muted) 40%,
      var(--color-text-heading) 50%,
      var(--color-text-muted) 60%,
      var(--color-text-muted) 100%
    );
    background-size: 200% 100%;
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
    color: transparent;
    animation: agent-run-shimmer 2.4s linear infinite;
  }
  @keyframes agent-run-dot-pulse {
    0%, 100% { opacity: 0.6; transform: scale(1); }
    50%      { opacity: 1; transform: scale(1.2); }
  }
  .agent-run-dot-pulse {
    animation: agent-run-dot-pulse 1.6s ease-in-out infinite;
  }
`;

function SharedStyles(): React.ReactElement {
  // biome-ignore lint/security/noDangerouslySetInnerHtml: prototype-scoped CSS; ok for story
  return <style dangerouslySetInnerHTML={{ __html: SHIMMER_STYLES }} />;
}

// ---------------------------------------------------------------------------
// Data model — mirrors the proposed ui-web type surface
// ---------------------------------------------------------------------------

type RunPhase = "thinking" | "executing" | "reviewing" | "completed" | "failed";
type StepStatus = "done" | "running" | "pending" | "failed";

interface RunStep {
  id: string;
  tool: string;
  description: React.ReactNode;
  status: StepStatus;
  duration?: string;
}

interface ResultAttachment {
  name: string;
  meta?: string;
  kind?: "doc" | "code" | "sheet" | "archive" | "media" | "generic";
}

type ResultTone = "success" | "warning" | "error" | "info";

// ---------------------------------------------------------------------------
// ThinkingLabel — phase text with optional shimmer
// ---------------------------------------------------------------------------

const PHASE_LABEL: Record<RunPhase, string> = {
  thinking: "Thinking",
  executing: "Executing",
  reviewing: "Reviewing",
  completed: "Completed",
  failed: "Failed",
};

const ACTIVE_PHASES: RunPhase[] = ["thinking", "executing", "reviewing"];

function ThinkingLabel({ phase }: { phase: RunPhase }): React.ReactElement {
  const label = PHASE_LABEL[phase];
  const isActive = ACTIVE_PHASES.includes(phase);
  return (
    <span
      className={cn(
        "text-[12px] font-medium tabular-nums",
        !isActive && phase === "completed" && "text-success",
        !isActive && phase === "failed" && "text-error",
      )}
    >
      {isActive ? <span className="agent-run-shimmer-text">{label}…</span> : <>{label}</>}
    </span>
  );
}

// ---------------------------------------------------------------------------
// Step timeline row — minimal dot + mono tool + description + duration
// ---------------------------------------------------------------------------

function StepDot({ status }: { status: StepStatus }): React.ReactElement {
  const base = "inline-flex size-3 shrink-0 items-center justify-center rounded-full";
  if (status === "done") {
    return (
      <span className={cn(base, "text-text-muted")} aria-label="Done">
        <Check className="size-2.5" strokeWidth={2.5} />
      </span>
    );
  }
  if (status === "running") {
    return (
      <span className={cn(base)} aria-label="Running">
        <span className="agent-run-dot-pulse inline-block size-1.5 rounded-full bg-info" />
      </span>
    );
  }
  if (status === "failed") {
    return (
      <span className={cn(base, "text-error")} aria-label="Failed">
        <X className="size-2.5" strokeWidth={3} />
      </span>
    );
  }
  return (
    <span className={cn(base, "text-text-tertiary/60")} aria-label="Pending">
      <CircleDashed className="size-2.5" strokeWidth={1.5} />
    </span>
  );
}

function StepRow({ step }: { step: RunStep }): React.ReactElement {
  const dim = step.status === "pending";
  return (
    <div className={cn("flex items-center gap-2.5 py-1 text-[12px]", dim && "text-text-tertiary")}>
      <StepDot status={step.status} />
      <span
        className={cn(
          "font-mono text-[11px] leading-none",
          step.status === "pending" ? "text-text-tertiary" : "text-text-heading",
        )}
      >
        {step.tool}
      </span>
      <span className="text-text-muted" aria-hidden>
        —
      </span>
      <span
        className={cn(
          "min-w-0 flex-1 truncate leading-tight",
          step.status === "pending" ? "text-text-tertiary" : "text-text-secondary",
        )}
      >
        {step.description}
      </span>
      {step.duration ? (
        <span className="shrink-0 font-mono text-[11px] tabular-nums text-text-muted">
          {step.duration}
        </span>
      ) : null}
    </div>
  );
}

// ---------------------------------------------------------------------------
// AgentRunLog — the "Investigating retry loop" card
// ---------------------------------------------------------------------------

interface AgentRunLogProps {
  title: string;
  phase: RunPhase;
  steps: RunStep[];
  toolCallCount?: number;
  totalDuration?: string;
  defaultExpanded?: boolean;
  className?: string;
}

function AgentRunLog({
  title,
  phase,
  steps,
  toolCallCount,
  totalDuration,
  defaultExpanded = true,
  className,
}: AgentRunLogProps): React.ReactElement {
  const [expanded, setExpanded] = useState(defaultExpanded);

  const metaParts: string[] = [];
  if (toolCallCount !== undefined) {
    metaParts.push(`${toolCallCount} tool call${toolCallCount === 1 ? "" : "s"}`);
  }
  if (totalDuration) metaParts.push(totalDuration);

  return (
    <div
      className={cn(
        "w-full max-w-[620px] overflow-hidden rounded-xl border border-border-subtle bg-surface-0",
        className,
      )}
    >
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        aria-expanded={expanded}
        className={cn(
          "flex w-full items-start justify-between gap-4 px-4 py-3 text-left transition-colors",
          "hover:bg-surface-1/60",
        )}
      >
        <div className="min-w-0 flex-1">
          <div className="truncate text-[14px] font-semibold text-text-heading">{title}</div>
          <div className="mt-1 flex items-center gap-2 text-[11px] leading-none">
            <ThinkingLabel phase={phase} />
            {metaParts.length > 0 ? (
              <>
                <span className="text-text-tertiary" aria-hidden>
                  ·
                </span>
                <span className="font-mono tabular-nums text-text-muted">
                  {metaParts.join(" · ")}
                </span>
              </>
            ) : null}
          </div>
        </div>
        <span className="mt-0.5 shrink-0 text-text-muted" aria-hidden>
          {expanded ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />}
        </span>
      </button>

      {expanded ? (
        <div className="border-t border-border-subtle px-4 py-2">
          {steps.map((step) => (
            <StepRow key={step.id} step={step} />
          ))}
        </div>
      ) : null}
    </div>
  );
}

// ---------------------------------------------------------------------------
// AgentResultCard — structured success / failure output
// ---------------------------------------------------------------------------

const TONE_STRIPE: Record<ResultTone, string> = {
  success: "before:bg-success",
  warning: "before:bg-warning",
  error: "before:bg-error",
  info: "before:bg-info",
};

interface AgentResultCardProps {
  title: string;
  bullets?: React.ReactNode[];
  attachments?: ResultAttachment[];
  tone?: ResultTone;
  className?: string;
}

function AgentResultCard({
  title,
  bullets,
  attachments,
  tone = "success",
  className,
}: AgentResultCardProps): React.ReactElement {
  return (
    <div
      className={cn(
        "relative w-full max-w-[620px] overflow-hidden rounded-xl border border-border-subtle bg-surface-0 pl-4 pr-4 py-3",
        "before:absolute before:left-0 before:top-0 before:h-full before:w-[3px]",
        TONE_STRIPE[tone],
        className,
      )}
    >
      <div className="pl-2">
        <div className="text-[14px] font-semibold text-text-heading">{title}</div>
        {bullets && bullets.length > 0 ? (
          <ul className="mt-2 space-y-1 text-[13px] leading-[1.55] text-text-secondary">
            {bullets.map((b, i) => (
              // biome-ignore lint/suspicious/noArrayIndexKey: bullets are static inside each story; arrays don't reorder
              <li key={i} className="flex gap-2">
                <span className="mt-[7px] inline-block size-[3px] shrink-0 rounded-full bg-text-muted" />
                <span className="min-w-0">{b}</span>
              </li>
            ))}
          </ul>
        ) : null}
        {attachments && attachments.length > 0 ? (
          <div className="mt-3 flex flex-wrap gap-2">
            {attachments.map((a) => (
              <FileAttachment
                key={a.name}
                name={a.name}
                meta={a.meta}
                kind={a.kind ?? "code"}
                className="max-w-[240px]"
              />
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// AgentRunMessage — wraps ChatMessage and adds a status badge next to name
// ---------------------------------------------------------------------------

interface AgentSender {
  id: string;
  name: string;
  avatar?: string;
  fallback: string;
  accent?: string;
}

const STATUS_BADGE: Record<
  "running" | "completed" | "failed" | "waiting",
  { label: string; className: string }
> = {
  running: { label: "进行中", className: "bg-info-subtle text-info" },
  completed: { label: "已完成", className: "bg-success-subtle text-success" },
  failed: { label: "失败", className: "bg-error-subtle text-error" },
  waiting: { label: "待确认", className: "bg-warning-subtle text-warning" },
};

interface AgentRunMessageProps {
  sender: AgentSender;
  time: string;
  status: keyof typeof STATUS_BADGE;
  preamble?: React.ReactNode;
  run?: AgentRunLogProps;
  result?: AgentResultCardProps;
}

/**
 * Prototype that demonstrates the *future* shape of `<ChatMessage>` with a
 * `senderBadge` slot. Built inline here so the real ChatMessage stays
 * untouched until we've landed review.
 *
 * When graduated to ui-web, this composition shrinks to:
 *   <ChatMessage sender={..} time={..} senderBadge={<StatusPill />} blocks={<><RunLog/><ResultCard/></>}>
 *     {preamble}
 *   </ChatMessage>
 */
function AgentRunMessage({
  sender,
  time,
  status,
  preamble,
  run,
  result,
}: AgentRunMessageProps): React.ReactElement {
  const accent = sender.accent ?? "var(--color-brand-primary)";
  const badge = STATUS_BADGE[status];

  return (
    <div className="group relative flex gap-3 px-4 pt-5 pb-1">
      <div className="w-8 shrink-0">
        <Avatar className="size-8 rounded-full">
          {sender.avatar ? <AvatarImage src={sender.avatar} alt={sender.name} /> : null}
          <AvatarFallback
            className="rounded-full text-[10px] font-semibold"
            style={{
              background: `color-mix(in srgb, ${accent} 14%, transparent)`,
              color: accent,
            }}
          >
            {sender.fallback}
          </AvatarFallback>
        </Avatar>
      </div>
      <div className="min-w-0 flex-1">
        <div className="mb-0.5 flex items-baseline gap-1.5">
          <span className="text-[13px] font-semibold text-text-heading">{sender.name}</span>
          <span
            className="inline-flex items-center gap-1 rounded-[4px] px-1.5 py-[1px] text-[10px] font-medium leading-tight"
            style={{
              background: `color-mix(in srgb, ${accent} 14%, transparent)`,
              color: accent,
            }}
          >
            AGENT
          </span>
          <span
            className={cn(
              "inline-flex items-center gap-1 rounded-[4px] px-1.5 py-[1px] text-[10px] font-medium leading-tight",
              badge.className,
            )}
          >
            {status === "running" ? <Hourglass className="size-2.5" /> : null}
            {status === "completed" ? <Check className="size-2.5" strokeWidth={3} /> : null}
            {status === "failed" ? <AlertTriangle className="size-2.5" /> : null}
            {badge.label}
          </span>
          <span
            className="ml-auto font-mono text-[11px] tabular-nums text-text-muted"
            aria-label={`Sent at ${time}`}
          >
            {time}
          </span>
        </div>

        {preamble ? (
          <div className="text-[13px] leading-[1.6] text-text-primary whitespace-pre-wrap break-words">
            {preamble}
          </div>
        ) : null}

        {run || result ? (
          <div className="mt-2 flex flex-col gap-2">
            {run ? <AgentRunLog {...run} /> : null}
            {result ? <AgentResultCard {...result} /> : null}
          </div>
        ) : null}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Sample data — reused across stories
// ---------------------------------------------------------------------------

const AIDER: AgentSender = {
  id: "aider",
  name: "Aider",
  fallback: "AI",
  accent: "#8b5cf6",
};

const retryLoopSteps: RunStep[] = [
  {
    id: "s1",
    tool: "git.log",
    description: "Scanned last 20 commits",
    status: "done",
    duration: "00:02",
  },
  {
    id: "s2",
    tool: "fs.read",
    description: "src/retry.ts, src/queue.ts",
    status: "done",
    duration: "00:08",
  },
  { id: "s3", tool: "test.run", description: "Reproducing locally…", status: "running" },
  { id: "s4", tool: "fs.edit", description: "Patch pending", status: "pending" },
  { id: "s5", tool: "git.commit", description: "Commit pending", status: "pending" },
];

const themeProviderSteps: RunStep[] = [
  {
    id: "s1",
    tool: "fs.read",
    description: "Read existing theme token files",
    status: "done",
    duration: "00:05",
  },
  {
    id: "s2",
    tool: "fs.edit",
    description: "ThemeProvider.tsx created",
    status: "done",
    duration: "03:12",
  },
  {
    id: "s3",
    tool: "fs.edit",
    description: "useTheme.ts hook authored",
    status: "done",
    duration: "02:40",
  },
  {
    id: "s4",
    tool: "test.run",
    description: "12 unit tests passing",
    status: "done",
    duration: "01:18",
  },
  {
    id: "s5",
    tool: "git.commit",
    description: "feat: ThemeProvider + useTheme hook",
    status: "done",
    duration: "00:45",
  },
];

const failedSteps: RunStep[] = [
  {
    id: "s1",
    tool: "fs.read",
    description: "Audited env loader",
    status: "done",
    duration: "00:03",
  },
  {
    id: "s2",
    tool: "fs.edit",
    description: "Patched parse() fallback",
    status: "done",
    duration: "00:32",
  },
  {
    id: "s3",
    tool: "test.run",
    description: "3 of 47 tests failed (auth-*)",
    status: "failed",
    duration: "00:58",
  },
];

// ---------------------------------------------------------------------------
// Meta + stories
// ---------------------------------------------------------------------------

const meta = {
  title: "Scenarios/Agent Run Message",
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Review-only prototypes for three missing ui-web pieces used when an " +
          "agent takes a turn in chat: ThinkingLabel, AgentRunLog, AgentResultCard, " +
          "and the AgentRunMessage composition. Visual style is intentionally " +
          "understated (soft dots, muted connectors, Cursor-style shimmer on " +
          "the phase label); final polish happens after wiring into slark.",
      },
    },
  },
  decorators: [
    (Story) => (
      <div className="flex w-full flex-col gap-6">
        <SharedStyles />
        <Story />
      </div>
    ),
  ],
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

// ---------------------------------------------------------------------------
// Primary stories: the four core run states
// ---------------------------------------------------------------------------

export const Thinking: Story = {
  render: () => (
    <div className="max-w-[680px]">
      <AgentRunMessage
        sender={AIDER}
        time="10:01"
        status="running"
        preamble="Let me look at the retry loop first…"
        run={{
          title: "Investigating retry loop…",
          phase: "thinking",
          toolCallCount: 6,
          totalDuration: "48s",
          steps: retryLoopSteps,
        }}
      />
    </div>
  ),
};

export const Executing: Story = {
  render: () => (
    <div className="max-w-[680px]">
      <AgentRunMessage
        sender={AIDER}
        time="10:15"
        status="running"
        preamble="Patching and re-running tests now."
        run={{
          title: "Fixing retry backoff in src/retry.ts",
          phase: "executing",
          toolCallCount: 9,
          totalDuration: "1m 12s",
          steps: [
            {
              id: "s1",
              tool: "fs.read",
              description: "src/retry.ts",
              status: "done",
              duration: "00:02",
            },
            {
              id: "s2",
              tool: "fs.edit",
              description: "Exponential backoff + jitter",
              status: "done",
              duration: "00:18",
            },
            {
              id: "s3",
              tool: "test.run",
              description: "Running retry-* suite…",
              status: "running",
            },
            {
              id: "s4",
              tool: "fs.edit",
              description: "Docstring update pending",
              status: "pending",
            },
          ],
        }}
      />
    </div>
  ),
};

export const Completed: Story = {
  render: () => (
    <div className="max-w-[680px]">
      <AgentRunMessage
        sender={AIDER}
        time="10:01"
        status="completed"
        preamble="收到，开始实现 ThemeProvider…"
        run={{
          title: "ThemeProvider + useTheme hook",
          phase: "completed",
          toolCallCount: 5,
          totalDuration: "11m 0s",
          defaultExpanded: false,
          steps: themeProviderSteps,
        }}
        result={{
          tone: "success",
          title: "ThemeProvider + useTheme hook 完成",
          bullets: [
            "ThemeProvider: React Context + localStorage + system preference fallback",
            "useTheme: { theme, setTheme, toggleTheme, resolvedTheme }",
            "CSS variables auto-injected on theme change",
          ],
          attachments: [
            { name: "ThemeProvider.tsx", meta: "4.2 KB · tsx", kind: "code" },
            { name: "useTheme.ts", meta: "1.1 KB · ts", kind: "code" },
          ],
        }}
      />
    </div>
  ),
};

export const Failed: Story = {
  render: () => (
    <div className="max-w-[680px]">
      <AgentRunMessage
        sender={AIDER}
        time="11:24"
        status="failed"
        preamble="I attempted to patch the env loader but the auth test suite still breaks."
        run={{
          title: "Attempted: fix env parse fallback",
          phase: "failed",
          toolCallCount: 3,
          totalDuration: "1m 33s",
          steps: failedSteps,
        }}
        result={{
          tone: "error",
          title: "3 tests still failing after patch",
          bullets: [
            <span key="1">
              <code className="rounded bg-surface-2 px-1 py-[1px] font-mono text-[11px]">
                auth.test.ts
              </code>{" "}
              expected <code className="font-mono">401</code>, received{" "}
              <code className="font-mono">500</code>
            </span>,
            "Likely candidate: JWT middleware still reads stale env on hot reload",
            "Recommend reverting the parse() change; mock the env in tests instead",
          ],
          attachments: [{ name: "test-output.log", meta: "12 KB · log", kind: "code" }],
        }}
      />
    </div>
  ),
};

export const WaitingForApproval: Story = {
  render: () => (
    <div className="max-w-[680px]">
      <AgentRunMessage
        sender={AIDER}
        time="10:42"
        status="waiting"
        preamble="Ready to commit — this touches 4 files. Approve to continue."
        run={{
          title: "Refactor: extract retry policy to shared module",
          phase: "reviewing",
          toolCallCount: 7,
          totalDuration: "4m 10s",
          steps: [
            {
              id: "s1",
              tool: "fs.read",
              description: "3 files under src/queue/",
              status: "done",
              duration: "00:06",
            },
            {
              id: "s2",
              tool: "fs.edit",
              description: "src/retry/policy.ts created",
              status: "done",
              duration: "01:22",
            },
            {
              id: "s3",
              tool: "fs.edit",
              description: "src/queue/worker.ts updated",
              status: "done",
              duration: "00:48",
            },
            {
              id: "s4",
              tool: "test.run",
              description: "47 passing",
              status: "done",
              duration: "01:50",
            },
            {
              id: "s5",
              tool: "git.commit",
              description: "Awaiting your approval",
              status: "running",
            },
          ],
        }}
      />
    </div>
  ),
};

// ---------------------------------------------------------------------------
// Secondary stories: subcomponents in isolation, for API review
// ---------------------------------------------------------------------------

export const RunLogStates: Story = {
  name: "AgentRunLog · all phases",
  render: () => (
    <div className="flex max-w-[680px] flex-col gap-3">
      <AgentRunLog
        title="Investigating retry loop…"
        phase="thinking"
        steps={retryLoopSteps}
        toolCallCount={6}
        totalDuration="48s"
      />
      <AgentRunLog
        title="Fixing retry backoff in src/retry.ts"
        phase="executing"
        steps={[
          {
            id: "s1",
            tool: "fs.read",
            description: "src/retry.ts",
            status: "done",
            duration: "00:02",
          },
          {
            id: "s2",
            tool: "fs.edit",
            description: "Exponential backoff + jitter",
            status: "done",
            duration: "00:18",
          },
          { id: "s3", tool: "test.run", description: "Running retry-* suite…", status: "running" },
        ]}
        toolCallCount={9}
        totalDuration="1m 12s"
      />
      <AgentRunLog
        title="ThemeProvider + useTheme hook"
        phase="completed"
        steps={themeProviderSteps}
        toolCallCount={5}
        totalDuration="11m 0s"
        defaultExpanded={false}
      />
      <AgentRunLog
        title="Attempted: fix env parse fallback"
        phase="failed"
        steps={failedSteps}
        toolCallCount={3}
        totalDuration="1m 33s"
      />
    </div>
  ),
};

export const ResultCardTones: Story = {
  name: "AgentResultCard · all tones",
  render: () => (
    <div className="flex max-w-[680px] flex-col gap-3">
      <AgentResultCard
        tone="success"
        title="Migration complete"
        bullets={[
          "12 components moved to @nexu-design/ui-web",
          "3 obsolete local copies deleted",
          "Type errors: 0 · Test failures: 0",
        ]}
        attachments={[{ name: "migration-report.md", meta: "3.4 KB · md", kind: "doc" }]}
      />
      <AgentResultCard
        tone="warning"
        title="Partial fix — deferring 2 edge cases"
        bullets={[
          "Patched main flow; smoke tests green",
          "Deferred: IE11 fallback and SSR hydration edge",
        ]}
      />
      <AgentResultCard
        tone="error"
        title="Build broken"
        bullets={[
          "tsc reports 4 errors in shared types",
          "Reverting last two commits is recommended",
        ]}
        attachments={[{ name: "tsc-output.log", meta: "8.1 KB · log", kind: "code" }]}
      />
      <AgentResultCard
        tone="info"
        title="Dry-run summary"
        bullets={[
          "Would rename 14 files, modify 2",
          "No file deletions",
          "Run with --apply to commit changes",
        ]}
      />
    </div>
  ),
};

// ---------------------------------------------------------------------------
// Scenario story: multi-turn conversation matching original product screenshot
// ---------------------------------------------------------------------------

const JASON: AgentSender = {
  id: "jason",
  name: "Jason",
  fallback: "J",
  accent: "#06b6d4",
};

export const Conversation: Story = {
  name: "Full conversation · multi-turn",
  parameters: { layout: "fullscreen" },
  render: () => (
    <div className="mx-auto flex min-h-screen max-w-[860px] flex-col gap-1 bg-surface-0 py-8">
      <AgentRunMessage
        sender={AIDER}
        time="10:01"
        status="completed"
        preamble="收到，开始实现 ThemeProvider…"
        run={{
          title: "ThemeProvider + useTheme hook",
          phase: "completed",
          toolCallCount: 5,
          totalDuration: "11m 0s",
          defaultExpanded: false,
          steps: themeProviderSteps,
        }}
        result={{
          tone: "success",
          title: "ThemeProvider + useTheme hook 完成",
          bullets: [
            "ThemeProvider: React Context + localStorage + system preference fallback",
            "useTheme: { theme, setTheme, toggleTheme, resolvedTheme }",
            "CSS variables auto-injected on theme change",
          ],
          attachments: [
            { name: "ThemeProvider.tsx", meta: "4.2 KB · tsx", kind: "code" },
            { name: "useTheme.ts", meta: "1.1 KB · ts", kind: "code" },
          ],
        }}
      />

      <ChatMessage
        sender={{ id: JASON.id, name: JASON.name, fallback: JASON.fallback }}
        time="10:20"
      >
        不错，ThemeProvider 看起来没问题。现在需要一个 ThemeToggle 组件，放在 header 右上角。要有
        sun/moon icon 切换动画。
      </ChatMessage>

      <AgentRunMessage
        sender={AIDER}
        time="10:21"
        status="completed"
        preamble="开始实现 ThemeToggle…"
        run={{
          title: "ThemeToggle component",
          phase: "completed",
          toolCallCount: 4,
          totalDuration: "9m 0s",
          defaultExpanded: false,
          steps: [
            {
              id: "s1",
              tool: "fs.read",
              description: "icons/sun.svg, icons/moon.svg",
              status: "done",
              duration: "00:03",
            },
            {
              id: "s2",
              tool: "fs.edit",
              description: "ThemeToggle.tsx authored",
              status: "done",
              duration: "04:12",
            },
            {
              id: "s3",
              tool: "fs.edit",
              description: "Framer Motion swap animation",
              status: "done",
              duration: "03:30",
            },
            {
              id: "s4",
              tool: "test.run",
              description: "Rendering snapshot passed",
              status: "done",
              duration: "01:15",
            },
          ],
        }}
        result={{
          tone: "success",
          title: "ThemeToggle 组件完成，含 icon 切换动画",
          attachments: [{ name: "ThemeToggle.tsx", meta: "2.3 KB · tsx", kind: "code" }],
        }}
      />
    </div>
  ),
};

// ---------------------------------------------------------------------------
// Rationale page — reviewer doc
// ---------------------------------------------------------------------------

export const Rationale: Story = {
  name: "Rationale · why these components",
  parameters: { layout: "padded" },
  render: () => (
    <div className="mx-auto max-w-[720px] space-y-6 text-[13px] leading-relaxed text-text-secondary">
      <header>
        <h1 className="text-[20px] font-semibold text-text-heading">
          Agent Run Message — design rationale
        </h1>
        <p className="mt-2 text-text-muted">
          Prototype context for the three missing pieces: ThinkingLabel, AgentRunLog,
          AgentResultCard. Built inline in this story until approved.
        </p>
      </header>

      <section className="space-y-2">
        <h2 className="text-[15px] font-semibold text-text-heading">
          Why not just extend ContentBlocks (slark) or ChatMessage (ui-web)?
        </h2>
        <p>
          ChatMessage is a generic chat row and rightly stays so. The run log and result card are{" "}
          <em>agent-specific</em> content blocks. They belong <em>inside</em>{" "}
          <code className="font-mono text-[12px]">blocks</code>, not baked into ChatMessage. This
          keeps ChatMessage reusable for human messages and keeps the agent UX in one swappable
          primitive we can iterate without breaking message infrastructure.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-[15px] font-semibold text-text-heading">ChatMessage proposed tweak</h2>
        <p>
          Add a <code className="font-mono text-[12px]">senderBadge</code> slot rendered right after
          the time element, so statuses like "已完成 / 失败 / 待确认" sit in the header row with the
          AGENT pill. Non-breaking; current usages pass{" "}
          <code className="font-mono text-[12px]">undefined</code> and see no visual difference.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-[15px] font-semibold text-text-heading">Visual decisions</h2>
        <ul className="ml-4 list-disc space-y-1">
          <li>
            Phase label (<strong>Thinking / Executing / Reviewing</strong>) uses a subtle shimmer
            while active; static once done / failed. Cursor-style, conveys liveness without
            spinners.
          </li>
          <li>
            Tool call count moved to a <em>trailing</em> meta row and rendered in mono + muted. It's
            reference info, not the headline.
          </li>
          <li>
            Timeline connector dropped; step rows rely on tight vertical rhythm and a per-step dot.
            Less visual noise at scale.
          </li>
          <li>
            Step dots favour <em>icon shape</em> over <em>color saturation</em>: done uses a muted
            check, running uses a small pulsing dot, pending uses a dashed ring, failed keeps a
            saturated red for urgency.
          </li>
          <li>
            Result card keeps a <code className="font-mono text-[12px]">3px</code> tone-coloured
            left stripe — enough to signal success / warn / error / info without a full coloured
            background.
          </li>
        </ul>
      </section>

      <section className="space-y-2">
        <h2 className="text-[15px] font-semibold text-text-heading">
          What graduates to ui-web in the follow-up PR
        </h2>
        <ul className="ml-4 list-disc space-y-1">
          <li>
            <code className="font-mono text-[12px]">AgentRunLog</code> →{" "}
            <code className="font-mono text-[12px]">packages/ui-web/src/primitives/</code>
          </li>
          <li>
            <code className="font-mono text-[12px]">AgentResultCard</code> → same
          </li>
          <li>
            <code className="font-mono text-[12px]">ChatMessage.senderBadge</code> slot
          </li>
          <li>Dedicated primitive stories (per AGENTS.md) + unit + a11y tests</li>
          <li>
            Shimmer keyframes moved into{" "}
            <code className="font-mono text-[12px]">packages/ui-web/src/styles.css</code>
          </li>
        </ul>
      </section>

      <section className="space-y-2">
        <h2 className="text-[15px] font-semibold text-text-heading">Open questions</h2>
        <ol className="ml-4 flex list-decimal flex-col gap-1 text-text-secondary">
          <li>Should running steps expose a "cancel this step" affordance, or only "stop all"?</li>
          <li>
            When a run is <code className="font-mono text-[12px]">waiting_for_approval</code>, where
            does the approve / reject UI live — inline in the run log, or as a separate{" "}
            <code className="font-mono text-[12px]">ApprovalCard</code>?
          </li>
          <li>
            In the failed state, do we always attach the log file, or only when it's under some size
            threshold?
          </li>
        </ol>
        <div>
          <Badge variant="secondary" size="xs">
            Not blocking — punt to after first slark integration
          </Badge>
        </div>
      </section>
    </div>
  ),
};
