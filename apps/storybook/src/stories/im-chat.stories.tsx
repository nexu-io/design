import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  Archive,
  ArrowUpRight,
  AtSign,
  Bell,
  Brain,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  GitBranch,
  GitPullRequestArrow,
  Hash,
  LogIn,
  MessageSquareMore,
  MoreHorizontal,
  Paperclip,
  Reply,
  X,
  XCircle,
} from "lucide-react";
import { useState } from "react";

import {
  Avatar,
  AvatarFallback,
  Button,
  ChatMessage,
  EventNotice,
  FileAttachment,
  ImageAttachment,
  ImageGallery,
  Mention,
  TopicCard,
  VideoAttachment,
  VoiceMessage,
  cn,
} from "@nexu-design/ui-web";
import type { ChatSender } from "@nexu-design/ui-web";

/* ------------------------------------------------------------------ *
 * Shared types & mock data
 * ------------------------------------------------------------------ */

type Sender = ChatSender;

const senders = {
  me: {
    id: "u-me",
    name: "Minh",
    avatar: "https://i.pravatar.cc/80?img=12",
    fallback: "MN",
  },
  alice: {
    id: "u-alice",
    name: "Alice Chen",
    avatar: "https://i.pravatar.cc/80?img=47",
    fallback: "AC",
  },
  bob: {
    id: "u-bob",
    name: "Bob Li",
    avatar: "https://i.pravatar.cc/80?img=15",
    fallback: "BL",
  },
  coder: {
    id: "a-coder",
    name: "Coder",
    fallback: "CD",
    isAgent: true,
    accent: "var(--color-brand-primary)",
  },
  reviewer: {
    id: "a-reviewer",
    name: "Reviewer",
    fallback: "RV",
    isAgent: true,
    accent: "var(--color-info)",
  },
  ops: {
    id: "a-ops",
    name: "Ops",
    fallback: "OP",
    isAgent: true,
    accent: "var(--color-warning)",
  },
  docs: {
    id: "a-docs",
    name: "Docs",
    fallback: "DC",
    isAgent: true,
    accent: "var(--color-success)",
  },
} as const satisfies Record<string, Sender>;

/* ------------------------------------------------------------------ *
 * Date divider (Slack pattern)
 * ------------------------------------------------------------------ */

function DateDivider({ label }: { label: React.ReactNode }) {
  return (
    <div className="sticky top-0 z-10 flex items-center gap-3 bg-surface-1/80 px-4 py-1.5 backdrop-blur">
      <span className="h-px flex-1 bg-border-subtle" />
      <span className="rounded-full border border-border-subtle bg-surface-1 px-2.5 py-0.5 text-[11px] font-medium text-text-secondary">
        {label}
      </span>
      <span className="h-px flex-1 bg-border-subtle" />
    </div>
  );
}

/* ------------------------------------------------------------------ *
 * ApprovalCard — human-in-the-loop decision card
 * ------------------------------------------------------------------ */

type ApprovalStatus = "pending" | "approved" | "rejected";

interface ApprovalCardProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  details?: { label: string; value: React.ReactNode }[];
  requester?: string;
  timeAgo?: string;
  initialStatus?: ApprovalStatus;
}

function ApprovalCard({
  icon,
  title,
  description,
  details,
  requester,
  timeAgo,
  initialStatus = "pending",
}: ApprovalCardProps) {
  const [status, setStatus] = useState<ApprovalStatus>(initialStatus);

  const statusLabel =
    status === "pending" ? "Pending" : status === "approved" ? "Approved" : "Rejected";

  const statusPillClass =
    status === "pending"
      ? "bg-warning-subtle text-warning"
      : status === "approved"
        ? "bg-success-subtle text-success"
        : "bg-error-subtle text-error";

  return (
    <div className="flex w-[460px] max-w-full flex-col overflow-hidden rounded-lg border border-border bg-surface-1">
      <div className="flex items-start gap-2.5 px-3 pt-3 pb-2.5">
        <div className="flex size-6 shrink-0 items-center justify-center rounded-md bg-surface-2 text-text-secondary">
          {icon ?? <Bell className="size-3.5" />}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <p className="text-[13px] font-semibold leading-snug text-text-heading">{title}</p>
            <span
              className={cn(
                "shrink-0 rounded-[4px] px-1.5 py-[1px] text-[9px] font-semibold uppercase leading-tight",
                statusPillClass,
              )}
            >
              {statusLabel}
            </span>
          </div>
          {description ? (
            <p className="mt-1 text-[12px] leading-relaxed text-text-secondary">{description}</p>
          ) : null}
        </div>
      </div>

      {details && details.length > 0 ? (
        <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-0.5 border-t border-border-subtle px-3 py-2 text-[12px]">
          {details.map((d) => (
            <div key={d.label} className="contents">
              <dt className="text-text-muted">{d.label}</dt>
              <dd className="truncate font-medium text-text-primary">{d.value}</dd>
            </div>
          ))}
        </dl>
      ) : null}

      <div className="flex items-center justify-between gap-3 border-t border-border-subtle bg-surface-2/30 px-3 py-2">
        {status === "pending" ? (
          <>
            <span className="text-[11px] text-text-muted">
              {requester ? (
                <>
                  Request by <span className="font-medium text-text-secondary">{requester}</span>
                </>
              ) : (
                "Awaiting approval"
              )}
              {timeAgo ? ` · ${timeAgo}` : null}
            </span>
            <div className="flex gap-1.5">
              <Button variant="outline" size="xs" onClick={() => setStatus("rejected")}>
                <X className="size-3" /> Reject
              </Button>
              <Button size="xs" onClick={() => setStatus("approved")}>
                <Check className="size-3" /> Approve
              </Button>
            </div>
          </>
        ) : null}
        {status === "approved" ? (
          <div className="flex w-full items-center justify-between text-[11px]">
            <span className="inline-flex items-center gap-1.5 font-medium text-success">
              <CheckCircle2 className="size-3" />
              Approved — {requester ?? "agent"} will proceed
            </span>
            <button
              type="button"
              className="text-text-muted hover:text-text-secondary"
              onClick={() => setStatus("pending")}
            >
              Undo
            </button>
          </div>
        ) : null}
        {status === "rejected" ? (
          <div className="flex w-full items-center justify-between text-[11px]">
            <span className="inline-flex items-center gap-1.5 font-medium text-error">
              <XCircle className="size-3" />
              Rejected — agent will try a different approach
            </span>
            <button
              type="button"
              className="text-text-muted hover:text-text-secondary"
              onClick={() => setStatus("pending")}
            >
              Undo
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ *
 * AgentExecutionCard — 3-phase (running / streaming / done / failed)
 * ------------------------------------------------------------------ */

type ExecPhase = "running" | "streaming" | "done" | "failed";

interface AgentExecStep {
  tool: string;
  desc: string;
  time?: string;
  status?: "done" | "active" | "pending";
}

interface AgentExecutionCardProps {
  phase: ExecPhase;
  title: string;
  accent?: string;
  toolCalls?: number;
  elapsed?: string;
  steps?: AgentExecStep[];
  summary?: React.ReactNode;
  streamingText?: string;
  defaultExpanded?: boolean;
  quickActions?: boolean;
  failureMessage?: string;
}

function AgentExecutionCard({
  phase,
  title,
  accent = "var(--color-brand-primary)",
  toolCalls,
  elapsed,
  steps,
  summary,
  streamingText,
  defaultExpanded,
  quickActions = true,
  failureMessage,
}: AgentExecutionCardProps) {
  const [expanded, setExpanded] = useState<boolean>(defaultExpanded ?? phase === "running");

  return (
    <div className="w-[520px] max-w-full overflow-hidden rounded-lg border border-border bg-surface-1">
      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        aria-expanded={expanded}
        className={cn(
          "flex w-full items-center gap-3 px-3.5 py-2.5 text-left transition-colors hover:bg-surface-2",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset",
        )}
      >
        <div className="shrink-0">
          {phase === "running" ? (
            <div className="relative flex size-6 items-center justify-center">
              <span
                className="absolute inset-0 animate-ping rounded-full opacity-30"
                style={{ background: accent }}
              />
              <span className="relative size-2.5 rounded-full" style={{ background: accent }} />
            </div>
          ) : phase === "streaming" ? (
            <Brain className="size-4 animate-pulse" style={{ color: accent }} />
          ) : phase === "done" ? (
            <CheckCircle2 className="size-4 text-success" />
          ) : (
            <XCircle className="size-4 text-error" />
          )}
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-[13px] font-medium text-text-heading">{title}</p>
          <p className="mt-0.5 text-[11px] text-text-muted">
            {phase === "running" && (
              <>
                Thinking · <span className="font-mono tabular-nums">{toolCalls ?? 0}</span> tool
                calls
                {elapsed ? (
                  <>
                    {" · "}
                    <span className="font-mono tabular-nums">{elapsed}</span>
                  </>
                ) : null}
              </>
            )}
            {phase === "streaming" && "Writing response…"}
            {phase === "done" && (
              <>
                Completed
                {elapsed ? (
                  <>
                    {" in "}
                    <span className="font-mono tabular-nums">{elapsed}</span>
                  </>
                ) : null}
                {toolCalls ? (
                  <>
                    {" · "}
                    <span className="font-mono tabular-nums">{toolCalls}</span> tool calls
                  </>
                ) : null}
              </>
            )}
            {phase === "failed" && (failureMessage ?? "Failed — click to inspect")}
          </p>
        </div>
        <ChevronDown
          className={cn("size-3.5 text-text-muted transition-transform", expanded && "rotate-180")}
        />
      </button>

      {expanded && steps && steps.length > 0 ? (
        <div className="border-t border-border-subtle bg-surface-2/30 px-4 py-3 text-[12px]">
          <div className="relative space-y-2">
            <span className="absolute left-[3px] top-1 bottom-1 w-px bg-border-subtle" />
            {steps.map((step, i) => {
              const stepStatus =
                step.status ?? (i === steps.length - 1 && phase === "running" ? "active" : "done");
              return (
                <div key={step.tool + step.desc} className="relative flex items-start gap-3">
                  <span
                    className={cn(
                      "relative z-10 mt-[6px] size-[7px] shrink-0 rounded-full ring-2",
                      stepStatus === "done" && "bg-success ring-success/20",
                      stepStatus === "active" &&
                        "animate-pulse bg-brand-primary ring-brand-primary/25",
                      stepStatus === "pending" && "bg-surface-3 ring-surface-3/40",
                    )}
                  />
                  <div className="min-w-0 flex-1">
                    <span className="font-mono text-text-secondary">{step.tool}</span>
                    <span className="text-text-muted"> — {step.desc}</span>
                  </div>
                  {step.time ? (
                    <span className="font-mono text-[10px] tabular-nums text-text-muted">
                      {step.time}
                    </span>
                  ) : null}
                </div>
              );
            })}
          </div>
        </div>
      ) : null}

      {phase === "streaming" && streamingText ? (
        <div className="border-t border-border-subtle px-3.5 py-3 text-[12px] leading-relaxed text-text-primary">
          {streamingText}
          <span
            className="ml-0.5 inline-block h-[14px] w-[2px] align-middle"
            style={{ background: accent, animation: "blink 1s step-end infinite" }}
          />
        </div>
      ) : null}

      {phase === "done" && summary ? (
        <div className="border-t border-border-subtle px-3.5 py-3">
          <div className="text-[12px] leading-relaxed text-text-primary">{summary}</div>
          {quickActions ? (
            <div className="mt-2.5 flex flex-wrap gap-1.5">
              <Button variant="outline" size="xs">
                <ArrowUpRight className="size-3" />
                View full result
              </Button>
              <Button variant="ghost" size="xs">
                <Hash className="size-3" />
                Convert to topic
              </Button>
              <Button variant="ghost" size="xs">
                <Reply className="size-3" />
                Ask follow-up
              </Button>
            </div>
          ) : null}
        </div>
      ) : null}

      {phase === "failed" ? (
        <div className="flex items-center justify-between gap-3 border-t border-border-subtle bg-error-subtle px-3.5 py-2.5">
          <span className="text-[12px] text-error">
            {failureMessage ?? "The agent hit a rate limit and couldn't complete the task."}
          </span>
          <Button variant="outline" size="xs">
            <GitBranch className="size-3" />
            Retry
          </Button>
        </div>
      ) : null}
    </div>
  );
}

/* ------------------------------------------------------------------ *
 * ResultSummaryCard — "highest" visual tier (Agent final output)
 * ------------------------------------------------------------------ */

interface ResultSummaryCardProps {
  accent?: string;
  icon?: React.ReactNode;
  title: string;
  subtitle?: string;
  metrics?: { label: string; value: React.ReactNode; tone?: "neutral" | "positive" | "negative" }[];
  bullets?: string[];
  footer?: React.ReactNode;
}

function ResultSummaryCard({
  accent = "var(--color-brand-primary)",
  icon,
  title,
  subtitle,
  metrics,
  bullets,
  footer,
}: ResultSummaryCardProps) {
  return (
    <div className="w-[540px] max-w-full overflow-hidden rounded-xl border border-border bg-surface-1 shadow-sm">
      <div className="flex items-start gap-3 px-4 pt-3.5 pb-2">
        <div
          className="flex size-9 shrink-0 items-center justify-center rounded-lg"
          style={{ background: `color-mix(in srgb, ${accent} 10%, transparent)`, color: accent }}
        >
          {icon ?? <GitPullRequestArrow className="size-4" />}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[14px] font-semibold text-text-heading leading-tight">{title}</p>
          {subtitle ? <p className="mt-0.5 text-[12px] text-text-muted">{subtitle}</p> : null}
        </div>
      </div>

      {metrics && metrics.length > 0 ? (
        <div className="grid grid-cols-3 divide-x divide-border-subtle border-y border-border-subtle bg-surface-2/30">
          {metrics.map((m) => (
            <div key={m.label} className="px-3 py-2.5">
              <p className="text-[10px] font-medium uppercase tracking-wider text-text-muted">
                {m.label}
              </p>
              <p
                className={cn(
                  "mt-0.5 font-mono text-[15px] font-semibold tabular-nums",
                  m.tone === "positive" && "text-success",
                  m.tone === "negative" && "text-error",
                  (!m.tone || m.tone === "neutral") && "text-text-heading",
                )}
              >
                {m.value}
              </p>
            </div>
          ))}
        </div>
      ) : null}

      {bullets && bullets.length > 0 ? (
        <ul className="space-y-1.5 px-4 pt-3 text-[12px] leading-relaxed text-text-primary">
          {bullets.map((b) => (
            <li key={b} className="flex items-start gap-2">
              <span
                className="mt-[6px] size-1.5 shrink-0 rounded-full"
                style={{ background: accent }}
              />
              <span>{b}</span>
            </li>
          ))}
        </ul>
      ) : null}

      <div className="flex items-center justify-between gap-2 px-4 py-3">
        {footer ?? (
          <div className="flex flex-wrap gap-1.5">
            <Button variant="outline" size="xs">
              <ArrowUpRight className="size-3" />
              View PR
            </Button>
            <Button variant="ghost" size="xs">
              <Hash className="size-3" />
              Convert to topic
            </Button>
            <Button variant="ghost" size="xs">
              <Reply className="size-3" />
              Continue
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ *
 * Channel frame — gives stories a realistic workspace context
 * ------------------------------------------------------------------ */

function ChannelFrame({
  title,
  subtitle,
  children,
  width = 760,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  width?: number;
}) {
  return (
    <div
      className="flex h-[720px] max-h-[85vh] flex-col overflow-hidden rounded-xl border border-border bg-surface-1 shadow-sm"
      style={{ width }}
    >
      <header className="flex shrink-0 items-center justify-between gap-3 border-b border-border-subtle bg-surface-1 px-4 py-2.5">
        <div className="flex min-w-0 items-center gap-2">
          <div className="flex size-6 items-center justify-center rounded-md bg-surface-2 text-text-secondary">
            <Hash className="size-3.5" />
          </div>
          <div className="min-w-0">
            <p className="truncate text-[13px] font-semibold text-text-heading">{title}</p>
            {subtitle ? <p className="truncate text-[11px] text-text-muted">{subtitle}</p> : null}
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-1">
          <span className="flex -space-x-1.5">
            {["AC", "BL", "CD", "RV"].map((f) => (
              <Avatar key={f} className="size-5 border-2 border-surface-1">
                <AvatarFallback className="bg-surface-2 text-[9px] font-semibold text-text-primary">
                  {f}
                </AvatarFallback>
              </Avatar>
            ))}
          </span>
          <span className="ml-1 font-mono text-[11px] tabular-nums text-text-muted">6</span>
          <Button variant="ghost" size="icon-sm" className="ml-1">
            <MoreHorizontal className="size-4" />
          </Button>
        </div>
      </header>

      <div className="min-h-0 flex-1 overflow-y-auto py-2">{children}</div>

      <footer className="shrink-0 border-t border-border-subtle bg-surface-1 px-3 py-2.5">
        <div className="flex items-center gap-2 rounded-lg border border-border bg-surface-1 px-3 py-2">
          <Paperclip className="size-3.5 shrink-0 text-text-muted" />
          <span className="flex-1 truncate text-[12px] text-text-muted">
            Message #backend-platform
          </span>
          <span className="shrink-0 rounded-sm bg-surface-2 px-1.5 py-0.5 font-mono text-[10px] text-text-muted">
            @
          </span>
          <Button size="icon-sm" aria-label="Send message">
            <ArrowUpRight className="size-4" />
          </Button>
        </div>
      </footer>
    </div>
  );
}

/* ------------------------------------------------------------------ *
 * Storybook meta
 * ------------------------------------------------------------------ */

const meta = {
  title: "Scenarios/IM Chat",
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Slack-style messaging surface for the Agent-native IM workspace. Dense, bubble-less, with four visual tiers (Agent result > Topic card > Chat message > Event notice). Each content block — file / image / video / approval / topic / execution log — is designed to sit inside a mixed feed without overpowering plain chat.",
      },
    },
  },
  tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

/* ------------------------------------------------------------------ *
 * Stories
 * ------------------------------------------------------------------ */

export const MixedFeed: Story = {
  name: "Mixed feed (overview)",
  render: () => (
    <ChannelFrame
      title="backend-platform"
      subtitle="Billing service reliability · 3 agents connected"
      width={780}
    >
      <DateDivider
        label={
          <>
            Today · Thu, Apr <span className="font-mono tabular-nums">17</span>
          </>
        }
      />

      <ChatMessage sender={senders.alice} time="09:02">
        Morning everyone — CI failed again overnight on the billing service. Anyone have context
        before I poke at it?
      </ChatMessage>
      <ChatMessage sender={senders.alice} time="09:02" compact>
        It looks like the retry logic we merged last week.
      </ChatMessage>

      <ChatMessage
        sender={senders.ops}
        time="09:03"
        mention="Coder"
        blocks={
          <ApprovalCard
            icon={<GitBranch className="size-4" />}
            title="Redeploy billing-api to staging?"
            description="Latest commit on main has not been deployed. Ops agent can promote it so Coder can bisect against a fresh build."
            details={[
              { label: "Commit", value: "a18b7c3 — fix: retry with jitter" },
              { label: "Env", value: "staging-us-west" },
              { label: "Duration", value: "~4 min" },
            ]}
            requester="Ops"
            timeAgo="just now"
          />
        }
      >
        Caught the overnight failure. I can redeploy the last green build, but promoting to staging
        is gated — can you approve?
      </ChatMessage>

      <EventNotice icon={<LogIn className="size-2.5" />}>
        Bob Li joined #backend-platform
      </EventNotice>

      <ChatMessage sender={senders.bob} time="09:14">
        Started digging — dashboard is at{" "}
        <a href="https://grafana.internal/d/billing-api">grafana.internal/d/billing-api</a>. Here's
        the stack I'm seeing in the logs:
      </ChatMessage>
      <ChatMessage
        sender={senders.bob}
        time="09:14"
        compact
        blocks={
          <>
            <FileAttachment name="billing-api-20260417.log" meta="1.2 MB · log" kind="code" />
            <ImageAttachment
              src="https://picsum.photos/seed/ci-graph/640/360"
              alt="CI failure graph"
              width={360}
              height={200}
              caption="P99 latency jumped at 03:14 UTC — matches deploy window."
            />
          </>
        }
      />

      <ChatMessage
        sender={senders.coder}
        time="09:18"
        blocks={
          <AgentExecutionCard
            phase="done"
            accent="var(--color-brand-primary)"
            title="Investigate billing-api retry loop"
            toolCalls={14}
            elapsed="2m 48s"
            defaultExpanded={false}
            steps={[
              { tool: "git.log", desc: "Scanned last 20 commits on billing-api", time: "00:02" },
              { tool: "fs.read", desc: "src/retry.ts, src/queue.ts", time: "00:08" },
              { tool: "test.run", desc: "Reproduced failure locally (3/5)", time: "01:14" },
              { tool: "fs.edit", desc: "Patched exponential backoff bounds", time: "02:02" },
              { tool: "git.commit", desc: "feat: cap retry delay at 30s", time: "02:36" },
            ]}
            summary={
              <>
                Root cause: unbounded exponential backoff produced 8+ hour retry intervals during
                the midnight outage, so jobs appeared to hang. Patched the ceiling to 30s and added
                a circuit breaker test. Ready for review.
              </>
            }
          />
        }
      >
        Took a look at the retry loop. Short version:
      </ChatMessage>

      <ChatMessage
        sender={senders.coder}
        time="09:18"
        compact
        blocks={
          <ResultSummaryCard
            accent="var(--color-brand-primary)"
            icon={<GitPullRequestArrow className="size-4" />}
            title="PR #2174 — fix: cap retry delay at 30s"
            subtitle="billing-api · ready for review"
            metrics={[
              { label: "Files", value: "3", tone: "neutral" },
              { label: "Added", value: "+42", tone: "positive" },
              { label: "Removed", value: "−17", tone: "negative" },
            ]}
            bullets={[
              "Bounded the exponential backoff to 30s per retry.",
              "Added circuit-breaker integration test covering the 03:14 regression.",
              "Reviewer agent queued and waiting on @Alice.",
            ]}
          />
        }
      />

      <ChatMessage
        sender={senders.alice}
        time="09:21"
        reactions={[
          { emoji: "🎉", count: 3 },
          { emoji: "👀", count: 1 },
        ]}
      >
        Nice. Converting this into a topic so we can track follow-ups.
      </ChatMessage>

      <ChatMessage
        sender={senders.alice}
        time="09:22"
        compact
        blocks={
          <TopicCard
            title="Billing retry regression (Apr 17 outage)"
            author="Alice Chen"
            status="needs-review"
            lastActivity="1m ago"
            replies={8}
            participants={["AC", "BL", "CD", "RV", "OP", "MN"]}
            preview="Reviewer agent flagged one concern about the circuit-breaker threshold; waiting on Alice's call before merging."
            assignee={{ ...senders.reviewer }}
          />
        }
      />

      <EventNotice icon={<AtSign className="size-2.5" />}>
        Reviewer was mentioned by Coder — agent notified
      </EventNotice>

      <ChatMessage
        sender={senders.reviewer}
        time="09:24"
        blocks={
          <AgentExecutionCard
            phase="streaming"
            accent="var(--color-info)"
            title="Review PR #2174"
            streamingText="Verified the jitter logic aligns with our backoff spec. One concern: the circuit breaker threshold of 50% seems low for a retry-heavy service — considering"
          />
        }
      >
        Reviewing now.
      </ChatMessage>

      <ChatMessage sender={senders.me} time="09:30" mention="Reviewer">
        Bump the threshold to 70% — our SLO tolerates a bit more noise than that. Here's a quick
        voice note with the reasoning:
      </ChatMessage>
      <ChatMessage
        sender={senders.me}
        time="09:30"
        compact
        blocks={
          <VoiceMessage
            duration="0:24"
            transcript="We sized the SLO at 99.5 so we've got room, and I'd rather trip the breaker less often than page someone."
          />
        }
      />

      <ChatMessage
        sender={senders.docs}
        time="09:34"
        blocks={<FileAttachment name="incident-2026-04-17.md" meta="6 KB · markdown" kind="doc" />}
      >
        Drafted the postmortem entry based on the timeline above. Will sync it to the runbook once
        the topic is closed.
      </ChatMessage>

      <EventNotice icon={<Archive className="size-2.5" />}>
        3 older events folded · click to expand
      </EventNotice>
    </ChannelFrame>
  ),
};

export const MessageVariants: Story = {
  name: "Message variants",
  render: () => (
    <div className="w-[680px] rounded-lg border border-border bg-surface-1 py-2">
      <ChatMessage sender={senders.alice} time="10:02">
        Plain human message — nothing fancy, same density as Slack.
      </ChatMessage>
      <ChatMessage sender={senders.alice} time="10:02" compact>
        Consecutive reply from the same sender collapses avatar and name.
      </ChatMessage>
      <ChatMessage sender={senders.alice} time="10:02" compact>
        Semantic <strong>bold</strong> and <em>italic</em> are supported inline — use{" "}
        <code className="rounded-sm bg-surface-2 px-1 py-px font-mono text-[12px]">
          &lt;strong&gt;
        </code>{" "}
        /{" "}
        <code className="rounded-sm bg-surface-2 px-1 py-px font-mono text-[12px]">&lt;em&gt;</code>{" "}
        in the body.
      </ChatMessage>
      <ChatMessage
        sender={senders.coder}
        time="10:04"
        reactions={[
          { emoji: "✅", count: 2 },
          { emoji: "🚀", count: 1 },
        ]}
      >
        Agent message — same row geometry as a human message, plus a tinted avatar fallback and a
        uniform green <strong>Agent</strong> badge. Avatar color can vary per agent for visual
        diversity; the badge itself stays identical so the role reads at a glance.
      </ChatMessage>
      <ChatMessage sender={senders.reviewer} time="10:05">
        Second agent, same green badge — only the avatar tint differs.
      </ChatMessage>
      <ChatMessage sender={senders.ops} time="10:06">
        Third agent — still the same badge. Role differentiation happens at the avatar layer.
      </ChatMessage>
      <EventNotice icon={<LogIn className="size-2.5" />}>
        Docs agent joined #backend-platform
      </EventNotice>
      <ChatMessage sender={senders.me} time="10:08" mention="Ops" highlighted>
        <code className="rounded-sm bg-surface-2 px-1 py-px font-mono text-[12px]">@mentions</code>{" "}
        render as compact gray mono pills, not blue links. When a message mentions you, the whole
        row gets a subtle surface tint (the{" "}
        <code className="rounded-sm bg-surface-2 px-1 py-px font-mono text-[12px]">
          highlighted
        </code>{" "}
        state).
      </ChatMessage>
      <ChatMessage sender={senders.bob} time="10:11">
        Inline URLs still render in the system link blue — see{" "}
        <a href="https://github.com/nexu-io/billing-api/pull/2174">PR #2174</a> and the{" "}
        <a href="https://runbook.internal/billing-retry">runbook entry</a> for full context.
      </ChatMessage>
    </div>
  ),
};

export const Attachments: Story = {
  render: () => (
    <div className="w-[680px] rounded-lg border border-border bg-surface-1 py-2">
      <ChatMessage
        sender={senders.alice}
        time="11:02"
        blocks={
          <>
            <FileAttachment name="Q2-billing-review.pdf" meta="2.1 MB · PDF" />
            <FileAttachment name="metrics-2026-04.xlsx" meta="312 KB · spreadsheet" kind="sheet" />
            <FileAttachment name="logs.tar.gz" meta="14.3 MB · archive" kind="archive" />
            <FileAttachment name="reproduce.sh" meta="1.8 KB · shell" kind="code" />
          </>
        }
      >
        Here are the files from the review meeting.
      </ChatMessage>

      <ChatMessage
        sender={senders.bob}
        time="11:07"
        blocks={
          <>
            <ImageAttachment
              src="https://picsum.photos/seed/ui-mock/480/300"
              alt="UI mock"
              width={360}
              height={220}
              caption="Proposed layout — dense column, no bubbles."
            />
            <ImageGallery
              images={[
                { src: "https://picsum.photos/seed/g1/200", alt: "shot 1" },
                { src: "https://picsum.photos/seed/g2/200", alt: "shot 2" },
                { src: "https://picsum.photos/seed/g3/200", alt: "shot 3" },
                { src: "https://picsum.photos/seed/g4/200", alt: "shot 4" },
                { src: "https://picsum.photos/seed/g5/200", alt: "shot 5" },
                { src: "https://picsum.photos/seed/g6/200", alt: "shot 6" },
                { src: "https://picsum.photos/seed/g7/200", alt: "shot 7" },
              ]}
            />
          </>
        }
      >
        Screenshots from the QA run — thumbnail grid folds &gt;6 into a +N overlay.
      </ChatMessage>

      <ChatMessage
        sender={senders.docs}
        time="11:15"
        blocks={
          <VideoAttachment
            thumbnail="https://picsum.photos/seed/vid1/640/360"
            duration="02:37"
            title="Bug-2174-repro.mp4"
            meta="8.4 MB"
          />
        }
      >
        Recorded the repro — happens at 0:48 when the worker retries.
      </ChatMessage>

      <ChatMessage
        sender={senders.me}
        time="11:22"
        blocks={
          <VoiceMessage
            duration="0:18"
            transcript="Let's defer the fix to next sprint — the rollback bought us enough headroom for now."
          />
        }
      >
        Voice note with auto-transcript, shown inline:
      </ChatMessage>
    </div>
  ),
};

export const ApprovalCards: Story = {
  render: () => (
    <div className="flex flex-col gap-5">
      <ApprovalCard
        icon={<GitBranch className="size-4" />}
        title="Merge PR #2174 into main?"
        description="Reviewer agent is satisfied. Merging will trigger a production deploy."
        details={[
          { label: "Branch", value: "fix/retry-bounds → main" },
          { label: "Approvals", value: "1/1 (Reviewer)" },
          { label: "CI", value: "✅ 42/42 tests passing" },
        ]}
        requester="Coder"
        timeAgo="2m ago"
      />
      <ApprovalCard
        icon={<Bell className="size-4" />}
        title="Allow Coder agent to run npm install?"
        description="Agent requested shell access to install the new telemetry SDK. Access is scoped to this project only."
        requester="Coder"
        timeAgo="12s ago"
      />
      <ApprovalCard
        icon={<GitPullRequestArrow className="size-4" />}
        title="Force-push to main?"
        description="Hard-blocked by policy — this card is here to show the rejected state."
        details={[{ label: "Policy", value: "core-repo:no-force-push" }]}
        initialStatus="rejected"
        requester="Ops"
        timeAgo="1m ago"
      />
      <ApprovalCard
        icon={<CheckCircle2 className="size-4" />}
        title="Deploy billing-api v1.9.2 to staging?"
        details={[
          { label: "From", value: "v1.9.1 · 14h in staging" },
          { label: "To", value: "v1.9.2 · commit a18b7c3" },
        ]}
        initialStatus="approved"
        requester="Ops"
        timeAgo="5m ago"
      />
    </div>
  ),
};

export const TopicCards: Story = {
  render: () => (
    <div className="flex w-[600px] flex-col gap-3">
      <TopicCard
        title="Billing retry regression (Apr 17 outage)"
        author="Alice Chen"
        status="active"
        lastActivity="just now"
        replies={8}
        participants={["AC", "BL", "CD", "RV", "OP"]}
        preview="Reviewer flagged one concern about the circuit-breaker threshold; waiting on Alice's call before merging."
        assignee={{ ...senders.reviewer }}
      />
      <TopicCard
        title="RFC: multi-region failover plan"
        author="Bob Li"
        status="needs-review"
        lastActivity="3m ago"
        replies={14}
        participants={["BL", "MN", "CD", "DC"]}
        preview="Draft covers active-active vs active-passive. Needs product sign-off before we scope the infra work."
      />
      <TopicCard
        title="Onboarding wizard drop-off (step 3)"
        author="Coder"
        status="blocked"
        lastActivity="1h ago"
        replies={22}
        participants={["CD", "AC", "MN", "BL", "RV", "DC"]}
        preview="Blocked on design — current SSO provider kicks users out when the verification link expires within 10 min."
      />
      <TopicCard
        title="Quarterly infra budget review"
        author="Ops"
        status="done"
        lastActivity="Yesterday"
        replies={47}
        participants={["OP", "MN", "AC", "BL"]}
        preview="Outcome: $18k/mo saved by right-sizing the async workers. Ops agent will keep the auto-scaler tuned."
      />
      <TopicCard
        title="Removed deprecated /v1 endpoints"
        author="Alice Chen"
        status="archived"
        lastActivity="Mar 28"
        replies={9}
        participants={["AC", "CD", "RV"]}
        preview="Archived after the 90-day sunset window. Summary stored in knowledge base."
      />
    </div>
  ),
};

export const AgentExecution: Story = {
  render: () => (
    <div className="flex flex-col gap-5">
      <AgentExecutionCard
        phase="running"
        accent="var(--color-brand-primary)"
        title="Investigating retry loop…"
        toolCalls={6}
        elapsed="48s"
        defaultExpanded
        steps={[
          { tool: "git.log", desc: "Scanned last 20 commits", time: "00:02", status: "done" },
          { tool: "fs.read", desc: "src/retry.ts, src/queue.ts", time: "00:08", status: "done" },
          { tool: "test.run", desc: "Reproducing locally…", status: "active" },
          { tool: "fs.edit", desc: "Patch pending", status: "pending" },
          { tool: "git.commit", desc: "Commit pending", status: "pending" },
        ]}
      />
      <AgentExecutionCard
        phase="streaming"
        accent="var(--color-info)"
        title="Drafting the code review summary"
        streamingText="The patch looks correct. Backoff is now bounded at 30s per retry, and the new circuit-breaker test covers the regression we saw at 03:14. One concern though — the breaker threshold is set to 50%, which might trip too eagerly for a service"
      />
      <AgentExecutionCard
        phase="done"
        accent="var(--color-brand-primary)"
        title="Investigate billing-api retry loop"
        toolCalls={14}
        elapsed="2m 48s"
        defaultExpanded={false}
        summary={
          <>
            Root cause: unbounded exponential backoff produced 8+ hour retry intervals during the
            midnight outage, so jobs appeared to hang. Patched the ceiling to 30s and added a
            circuit breaker test. Ready for review.
          </>
        }
      />
      <AgentExecutionCard
        phase="failed"
        accent="var(--color-warning)"
        title="Deploy billing-api to production"
        elapsed="12s"
        failureMessage="Deploy rejected — production requires a human approver. Created topic #deploy-approval-2174."
      />
    </div>
  ),
};

export const EventNotices: Story = {
  render: () => (
    <div className="w-[640px] rounded-lg border border-border bg-surface-1 py-2">
      <ChatMessage sender={senders.alice} time="14:02">
        Quiet period — most activity gets folded into event notices until something actionable
        happens.
      </ChatMessage>
      <EventNotice icon={<LogIn className="size-2.5" />}>
        Bob Li joined #backend-platform
      </EventNotice>
      <EventNotice icon={<AtSign className="size-2.5" />}>
        Coder was mentioned by Alice Chen
      </EventNotice>
      <EventNotice icon={<Hash className="size-2.5" />}>
        Alice converted a thread into topic “Billing retry regression (Apr 17 outage)”
      </EventNotice>
      <EventNotice icon={<Archive className="size-2.5" />}>
        <span className="font-mono tabular-nums">3</span> older join/leave events folded · click to
        expand
      </EventNotice>
      <ChatMessage sender={senders.reviewer} time="14:11">
        Back from the rebuild. No regressions detected on the touched files.
      </ChatMessage>
    </div>
  ),
};
