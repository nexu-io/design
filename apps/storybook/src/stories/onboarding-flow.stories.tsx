import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  ArrowRight,
  Bot,
  Building2,
  Check,
  ChevronDown,
  LogIn,
  MessageSquare,
  Search,
  Sparkles,
  Users,
  X,
  Zap,
} from "lucide-react";

import {
  Alert,
  AlertDescription,
  AlertTitle,
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  EmptyState,
  FormField,
  FormFieldControl,
  Input,
  Label,
  Stepper,
  StepperItem,
  StepperSeparator,
  TextLink,
  ThemeRoot,
} from "@nexu-design/ui-web";

/**
 * Onboarding Flow — review comparison stories
 *
 * Purpose: compare the current 3-step onboarding (Workspace / Runtime / Agent)
 * against a proposed 1.5-step flow that defers Runtime + Agent setup into the
 * workspace itself. Used for cross-functional review before touching the real
 * `apps/slark` implementation.
 *
 * Source of current flow: apps/slark/src/renderer/src/components/onboarding/*
 */
const meta = {
  title: "Scenarios/Onboarding Flow",
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Review-only story: compares the current 3-step onboarding against a " +
          "proposed 1.5-step variant. No changes to apps/slark yet.",
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

// ---------------------------------------------------------------------------
// Shared window frame — approximates the slark Electron window so reviewers
// can judge information density at the real size.
// ---------------------------------------------------------------------------

interface WindowFrameProps {
  label: string;
  sublabel?: string;
  children: React.ReactNode;
}

function WindowFrame({ label, sublabel, children }: WindowFrameProps) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-baseline gap-2">
        <span className="text-sm font-semibold text-text-primary">{label}</span>
        {sublabel ? <span className="text-xs text-text-muted">{sublabel}</span> : null}
      </div>
      <div className="w-[640px] overflow-hidden rounded-xl border border-border bg-surface-0 shadow-sm">
        <div className="flex h-8 items-center gap-1.5 border-b border-border-subtle bg-surface-1 px-3">
          <span className="size-2.5 rounded-full bg-[#ff5f57]" />
          <span className="size-2.5 rounded-full bg-[#febc2e]" />
          <span className="size-2.5 rounded-full bg-[#28c840]" />
        </div>
        <div className="h-[520px] overflow-auto">{children}</div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// CURRENT FLOW — reconstruction of the existing 3-step onboarding
// ---------------------------------------------------------------------------

function CurrentStepper({ current }: { current: 1 | 2 | 3 }) {
  const step = (n: 1 | 2 | 3) =>
    n < current ? "completed" : n === current ? "current" : "pending";

  return (
    <Stepper className="mx-auto max-w-md">
      <StepperItem status={step(1)} step={1} label="Workspace" />
      <StepperSeparator active={current > 1} />
      <StepperItem status={step(2)} step={2} label="Runtime" />
      <StepperSeparator active={current > 2} />
      <StepperItem status={step(3)} step={3} label="Agent" />
    </Stepper>
  );
}

function CurrentStep1Workspace() {
  return (
    <div className="flex flex-col items-center gap-6 px-8 py-8">
      <CurrentStepper current={1} />

      <div className="flex size-14 items-center justify-center rounded-2xl bg-surface-2">
        <Building2 className="size-7 text-text-secondary" />
      </div>
      <div className="text-center">
        <h2 className="text-xl font-semibold text-text-primary">Create your workspace</h2>
        <p className="mt-1 text-sm text-text-secondary">Set up a team space and invite people.</p>
      </div>

      <div className="inline-flex items-center gap-1 rounded-lg bg-surface-2 p-1">
        <button
          type="button"
          className="flex h-8 items-center gap-1.5 rounded-md bg-surface-0 px-3 text-sm font-medium shadow-sm"
        >
          <Building2 className="size-3.5" /> Create new
        </button>
        <button
          type="button"
          className="flex h-8 items-center gap-1.5 rounded-md px-3 text-sm font-medium text-text-muted"
        >
          <LogIn className="size-3.5" /> Join existing
        </button>
      </div>

      <div className="w-full max-w-sm space-y-4">
        <FormField label="Workspace name">
          <FormFieldControl>
            <Input placeholder="e.g. Acme Engineering" />
          </FormFieldControl>
        </FormField>

        <FormField label="Invite members">
          <FormFieldControl>
            <div className="flex items-center gap-2">
              <Input placeholder="teammate@company.com" />
              <Button variant="outline" size="sm">
                Invite
              </Button>
            </div>
          </FormFieldControl>
        </FormField>

        <div className="flex items-center gap-2 rounded-lg border border-dashed border-border bg-surface-1/60 px-3 py-2.5">
          <div className="min-w-0 flex-1">
            <div className="text-xs text-text-muted">Or share invite link</div>
            <div className="truncate font-mono text-xs text-text-primary">
              http://localhost:5173/invite/c07he0…
            </div>
          </div>
          <Button variant="outline" size="xs">
            Copy
          </Button>
        </div>
      </div>

      <Button trailingIcon={<ArrowRight className="size-4" />} disabled>
        Continue
      </Button>
    </div>
  );
}

const CURRENT_RUNTIMES = [
  { name: "Claude Code", detected: true, version: "1.0.12", color: "#B45309", label: ">_" },
  { name: "Cursor", detected: false, color: "#171717", label: "▸" },
  { name: "OpenCode", detected: true, version: "0.5.3", color: "#059669", label: "</>" },
  { name: "Codex", detected: false, color: "#0369A1", label: "◎" },
  { name: "Gemini CLI", detected: true, version: "0.1.0", color: "#4285F4", label: "✦" },
  { name: "Hermes", detected: false, color: "#EA580C", label: "H" },
  { name: "OpenClaw", detected: true, version: "0.2.1", color: "#7C3AED", label: "⊞", error: true },
  { name: "Pi", detected: false, color: "#DB2777", label: "π" },
];

function CurrentStep2Runtime() {
  return (
    <div className="flex flex-col items-center gap-6 px-8 py-8">
      <CurrentStepper current={2} />

      <div className="text-center">
        <h2 className="text-xl font-semibold text-text-primary">Runtimes Detected</h2>
        <p className="mt-1 text-sm text-text-secondary">
          Found 3 runtimes on your system · 1 needs attention
        </p>
        <p className="mt-3 text-xs leading-relaxed text-text-muted">
          Runtimes power your Agents — each agent connects to a runtime to execute tasks.
        </p>
      </div>

      <div className="grid w-full max-w-xl grid-cols-4 gap-3">
        {CURRENT_RUNTIMES.map((rt) => {
          const isWorking = rt.detected && !rt.error;
          return (
            <div
              key={rt.name}
              className={`relative flex min-h-[112px] flex-col items-start gap-2 rounded-xl border p-3 text-left ${
                isWorking
                  ? "border-accent bg-accent/10"
                  : rt.error
                    ? "border-warning/40 bg-warning-subtle/40"
                    : "border-border opacity-50"
              }`}
            >
              <div className="flex w-full items-center justify-between">
                <div
                  className="flex size-6 items-center justify-center rounded-md text-[10px] font-bold text-white"
                  style={{ backgroundColor: rt.color }}
                >
                  {rt.label}
                </div>
                {isWorking ? <Check className="size-3 text-success" /> : null}
                {rt.error ? <span className="text-[10px] font-medium text-warning">!</span> : null}
                {!rt.detected ? <X className="size-3 text-text-muted" /> : null}
              </div>
              <div>
                <div className="text-sm font-medium text-text-primary">{rt.name}</div>
                <div className="text-[11px] text-text-muted">
                  {isWorking
                    ? `v${rt.version}`
                    : rt.error
                      ? `v${rt.version} · needs update`
                      : "Not found"}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm">
          Skip for now
        </Button>
        <Button trailingIcon={<ArrowRight className="size-4" />}>Continue with 3 runtimes</Button>
      </div>
    </div>
  );
}

const CURRENT_TEMPLATES = [
  { name: "Code Reviewer", desc: "Reviews pull requests, flags risks, suggests fixes." },
  { name: "Product Manager", desc: "Drafts PRDs, tracks tickets, writes release notes." },
  { name: "Support Triage", desc: "Categorizes tickets, drafts replies, escalates." },
  { name: "Research Assistant", desc: "Summarizes docs, finds sources, compares options." },
];

function CurrentStep3aTemplates() {
  return (
    <div className="flex flex-col items-center gap-6 px-8 py-8">
      <CurrentStepper current={3} />
      <div className="text-center">
        <h2 className="text-xl font-semibold text-text-primary">Create your first Agent</h2>
        <p className="mt-1 text-sm text-text-secondary">Choose a template to get started.</p>
      </div>

      <div className="grid w-full grid-cols-2 gap-3">
        {CURRENT_TEMPLATES.map((tpl) => (
          <button
            key={tpl.name}
            type="button"
            className="flex items-start gap-3 rounded-xl border border-border p-4 text-left hover:border-foreground/30 hover:bg-surface-2"
          >
            <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-accent/10">
              <Bot className="size-5 text-accent" />
            </div>
            <div className="min-w-0">
              <div className="text-sm font-medium text-text-primary">{tpl.name}</div>
              <div className="mt-0.5 line-clamp-2 text-xs text-text-muted">{tpl.desc}</div>
            </div>
          </button>
        ))}
      </div>

      <button
        type="button"
        className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-border p-3 text-sm text-text-muted hover:border-foreground/30"
      >
        + Start from scratch
      </button>
      <Button variant="ghost" size="sm">
        Skip for now
      </Button>
    </div>
  );
}

function CurrentStep3bSettings() {
  return (
    <div className="flex flex-col items-center gap-6 px-8 py-8">
      <CurrentStepper current={3} />
      <div className="text-center">
        <h2 className="text-xl font-semibold text-text-primary">Customize your Agent</h2>
        <p className="mt-1 text-sm text-text-secondary">
          Set a name, description, and connect a runtime.
        </p>
      </div>

      <div className="w-full max-w-md space-y-4">
        <div className="flex items-center gap-3 rounded-xl border border-border bg-surface-1 p-3">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-accent/10">
            <Bot className="size-5 text-accent" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-xs text-text-muted">Based on template</div>
            <div className="text-sm font-medium">Code Reviewer</div>
          </div>
        </div>

        <FormField label="Agent Name">
          <FormFieldControl>
            <Input defaultValue="Code Reviewer" />
          </FormFieldControl>
        </FormField>

        <FormField label="Description">
          <FormFieldControl>
            <textarea
              rows={3}
              defaultValue="Reviews pull requests, flags risks, suggests fixes."
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </FormFieldControl>
        </FormField>

        <FormField label="Runtime">
          <FormFieldControl>
            <button
              type="button"
              className="flex h-10 w-full items-center justify-between rounded-lg border border-border bg-background px-3 text-sm"
            >
              <span className="flex items-center gap-2">
                <span className="size-2 rounded-full bg-success" />
                Claude Code
              </span>
              <ChevronDown className="size-4 text-text-muted" />
            </button>
          </FormFieldControl>
        </FormField>
      </div>

      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm">
          ← Back to templates
        </Button>
        <Button leadingIcon={<Sparkles className="size-4" />}>Create Agent</Button>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// PROPOSED FLOW — 1.5 steps: one onboarding screen, then land in the workspace
// ---------------------------------------------------------------------------

function ProposedStep1Combined() {
  return (
    <div className="flex flex-col items-center gap-6 px-8 py-10">
      <div className="flex size-14 items-center justify-center rounded-2xl bg-surface-2">
        <Building2 className="size-7 text-text-secondary" />
      </div>
      <div className="text-center">
        <h2 className="text-xl font-semibold text-text-primary">Name your workspace</h2>
        <p className="mt-1 text-sm text-text-secondary">
          One step to get in. Invite teammates and pick agents from inside.
        </p>
      </div>

      <div className="w-full max-w-sm space-y-4">
        <FormField label="Workspace name">
          <FormFieldControl>
            <Input autoFocus placeholder="e.g. Acme Engineering" />
          </FormFieldControl>
        </FormField>

        <div className="flex items-center gap-2 rounded-lg bg-surface-1 px-3 py-2.5">
          <Check className="size-3.5 text-success" strokeWidth={3} />
          <span className="text-xs text-text-secondary">
            Detected <strong className="text-text-primary">3 runtimes</strong> on this Mac — Claude
            Code, OpenCode, Gemini CLI
          </span>
          <TextLink href="#" size="xs" className="ml-auto shrink-0">
            Details
          </TextLink>
        </div>

        <div className="flex items-center justify-center gap-2 text-xs text-text-muted">
          <LogIn className="size-3" />
          Got an invite link?{" "}
          <TextLink href="#" size="xs">
            Join a workspace
          </TextLink>
        </div>
      </div>

      <Button size="lg" trailingIcon={<ArrowRight className="size-4" />}>
        Continue
      </Button>

      <p className="text-[11px] text-text-muted">~15 seconds to your first message.</p>
    </div>
  );
}

function ProposedLandedWorkspace() {
  return (
    <div className="flex h-full flex-col bg-surface-0">
      <div className="flex items-center gap-3 border-b border-border px-5 py-3">
        <div className="flex size-6 items-center justify-center rounded-md bg-accent text-[11px] font-bold text-accent-foreground">
          A
        </div>
        <div className="flex-1">
          <div className="flex items-baseline gap-2">
            <span className="text-sm font-semibold text-text-primary">Acme Engineering</span>
            <span className="text-xs text-text-muted">· #general</span>
          </div>
        </div>
        <Badge variant="outline" size="xs">
          <Sparkles className="size-3" />1 agent ready
        </Badge>
      </div>

      <div className="flex-1 space-y-4 overflow-auto px-5 py-4">
        <Alert variant="info" className="gap-3">
          <Users className="size-4" />
          <div className="flex-1">
            <AlertTitle>Bring your team along</AlertTitle>
            <AlertDescription>
              Share your invite link or send email invitations from workspace settings.
            </AlertDescription>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <Button variant="outline" size="xs">
              Invite
            </Button>
            <button
              type="button"
              aria-label="Dismiss"
              className="text-text-muted hover:text-text-primary"
            >
              <X className="size-3.5" />
            </button>
          </div>
        </Alert>

        <div className="flex items-start gap-3 rounded-lg bg-surface-1 p-4">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-accent/10">
            <Bot className="size-5 text-accent" />
          </div>
          <div className="min-w-0 flex-1 space-y-2">
            <div className="flex items-baseline gap-2">
              <span className="text-sm font-semibold text-text-primary">Claude</span>
              <Badge variant="secondary" size="xs">
                <Zap className="size-3" /> via Claude Code
              </Badge>
              <span className="text-xs text-text-muted">· just now</span>
            </div>
            <p className="text-sm leading-relaxed text-text-secondary">
              Hi! I'm your first teammate. I detected{" "}
              <strong className="text-text-primary">Claude Code</strong> on your Mac and connected
              as your default agent.
            </p>
            <div className="flex flex-wrap gap-2 pt-1">
              <Badge variant="outline" size="sm">
                @claude summarize this repo
              </Badge>
              <Badge variant="outline" size="sm">
                @claude review my last PR
              </Badge>
            </div>
          </div>
        </div>

        <EmptyState
          className="border-dashed bg-surface-1/40 py-6"
          icon={<MessageSquare className="size-6 text-text-muted" />}
          title={<span className="text-base">Say hi to your agent</span>}
          description={
            <span className="text-xs">
              Or create another one from the sidebar — browse templates, pick a runtime, done.
            </span>
          }
          action={
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                Browse templates
              </Button>
              <Button size="sm" trailingIcon={<ArrowRight className="size-3.5" />}>
                Try a prompt
              </Button>
            </div>
          }
        />
      </div>

      <div className="border-t border-border bg-surface-1 px-5 py-3">
        <div className="flex items-center gap-2 rounded-lg border border-border bg-surface-0 px-3 py-2">
          <span className="text-sm text-text-muted">Message #general or @mention an agent…</span>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// RATIONALE panel — shown alongside the flows for context
// ---------------------------------------------------------------------------

function RationalePanel() {
  return (
    <Card padding="lg" className="w-[640px] bg-surface-1">
      <CardHeader>
        <CardTitle className="text-lg">Why 1.5 steps instead of 3</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 text-sm text-text-secondary">
        <div>
          <Label className="text-xs uppercase tracking-wide text-text-muted">The gap</Label>
          <p className="mt-1">
            Current flow mixes three kinds of work into one pipeline: organization config
            (Workspace, one-time), machine probing (Runtime, environment-dependent), and a
            high-frequency product action (Agent, repeatable). Only the first belongs in onboarding.
          </p>
        </div>
        <div>
          <Label className="text-xs uppercase tracking-wide text-text-muted">The change</Label>
          <ul className="mt-1 list-disc space-y-1 pl-5">
            <li>
              <strong>Workspace + Runtime</strong> merged — scan runs in the background while the
              user names the workspace; the result shows as a single confirmation line.
            </li>
            <li>
              <strong>Invite members</strong> moved to a dismissible in-workspace banner — first
              users rarely commit to inviting before they see value.
            </li>
            <li>
              <strong>Agent creation</strong> moved out of onboarding — we auto-mount a default
              agent based on the first detected runtime, so the user can @mention it immediately.
              Template browsing stays available from the sidebar as a normal product action.
            </li>
          </ul>
        </div>
        <div>
          <Label className="text-xs uppercase tracking-wide text-text-muted">What it enables</Label>
          <p className="mt-1">
            Time-to-first-message drops from 4 screens to 2. The positioning from the competitive
            analysis — <em>"Agent as teammate"</em> — is reinforced because the user lands in a room
            that already has a teammate in it, instead of assembling one first.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

// ---------------------------------------------------------------------------
// STORIES
// ---------------------------------------------------------------------------

export const CurrentFlow: Story = {
  name: "Current · 4 screens (Workspace → Runtime → Agent templates → Agent settings)",
  render: () => (
    <ThemeRoot>
      <div className="min-h-screen bg-surface-2 p-8">
        <div className="mx-auto mb-6 max-w-[2800px]">
          <h1 className="text-2xl font-semibold text-text-primary">
            Current onboarding (as shipped in apps/slark)
          </h1>
          <p className="mt-1 text-sm text-text-secondary">
            Three stepper labels, but four actual screens because the Agent step has an internal
            template → settings split. User reaches their first conversation on screen 5.
          </p>
        </div>
        <div className="flex gap-6 overflow-x-auto pb-6">
          <WindowFrame label="Screen 1" sublabel="Workspace · create">
            <CurrentStep1Workspace />
          </WindowFrame>
          <WindowFrame label="Screen 2" sublabel="Runtime · detection grid">
            <CurrentStep2Runtime />
          </WindowFrame>
          <WindowFrame label="Screen 3" sublabel="Agent · pick template">
            <CurrentStep3aTemplates />
          </WindowFrame>
          <WindowFrame label="Screen 4" sublabel="Agent · configure">
            <CurrentStep3bSettings />
          </WindowFrame>
        </div>
      </div>
    </ThemeRoot>
  ),
};

export const ProposedFlow: Story = {
  name: "Proposed · 1.5 steps (Workspace + background scan → Workspace with default agent)",
  render: () => (
    <ThemeRoot>
      <div className="min-h-screen bg-surface-2 p-8">
        <div className="mx-auto mb-6 max-w-[2800px]">
          <h1 className="text-2xl font-semibold text-text-primary">
            Proposed onboarding (for review)
          </h1>
          <p className="mt-1 text-sm text-text-secondary">
            One required screen. Runtime detection is implicit. Agent creation defers to the
            workspace itself — a default agent is auto-mounted from the first detected runtime so
            the user can send a message immediately.
          </p>
        </div>
        <div className="flex gap-6 overflow-x-auto pb-6">
          <WindowFrame label="Screen 1" sublabel="Workspace + implicit runtime scan">
            <ProposedStep1Combined />
          </WindowFrame>
          <WindowFrame label="Screen 2" sublabel="Landed in #general · agent ready">
            <ProposedLandedWorkspace />
          </WindowFrame>
        </div>
      </div>
    </ThemeRoot>
  ),
};

export const SideBySide: Story = {
  name: "Side by side · current vs proposed",
  render: () => (
    <ThemeRoot>
      <div className="min-h-screen bg-surface-2 p-8">
        <div className="mx-auto mb-6 max-w-[2800px]">
          <h1 className="text-2xl font-semibold text-text-primary">
            Onboarding comparison — review cut
          </h1>
          <p className="mt-1 text-sm text-text-secondary">
            Top row: current shipped flow. Bottom row: proposed. Same viewport size so information
            density is comparable.
          </p>
        </div>

        <section className="mb-8">
          <div className="mb-3 flex items-center gap-2">
            <Badge variant="outline" size="sm">
              Current
            </Badge>
            <span className="text-sm text-text-secondary">
              4 screens · ~45s–90s to first message · 3 decisions before product value
            </span>
          </div>
          <div className="flex gap-6 overflow-x-auto pb-6">
            <WindowFrame label="1" sublabel="Workspace">
              <CurrentStep1Workspace />
            </WindowFrame>
            <WindowFrame label="2" sublabel="Runtime">
              <CurrentStep2Runtime />
            </WindowFrame>
            <WindowFrame label="3" sublabel="Agent templates">
              <CurrentStep3aTemplates />
            </WindowFrame>
            <WindowFrame label="4" sublabel="Agent settings">
              <CurrentStep3bSettings />
            </WindowFrame>
          </div>
        </section>

        <section>
          <div className="mb-3 flex items-center gap-2">
            <Badge
              variant="accent"
              size="sm"
              className="bg-[var(--color-brand-subtle)] text-[var(--color-brand-primary)]"
            >
              Proposed
            </Badge>
            <span className="text-sm text-text-secondary">
              2 screens · ~15s to first message · 1 decision, everything else inferred
            </span>
          </div>
          <div className="flex gap-6 overflow-x-auto pb-6">
            <WindowFrame label="1" sublabel="Workspace + implicit runtime scan">
              <ProposedStep1Combined />
            </WindowFrame>
            <WindowFrame label="2" sublabel="Landed in #general">
              <ProposedLandedWorkspace />
            </WindowFrame>
            <RationalePanel />
          </div>
        </section>
      </div>
    </ThemeRoot>
  ),
};

export const Rationale: Story = {
  name: "Rationale · designer notes",
  render: () => (
    <ThemeRoot>
      <div className="min-h-screen bg-surface-2 p-8">
        <div className="mx-auto max-w-[720px] space-y-6">
          <div>
            <h1 className="text-2xl font-semibold text-text-primary">
              Onboarding review — rationale
            </h1>
            <p className="mt-1 text-sm text-text-secondary">
              Context for reviewers before they open the Current / Proposed stories.
            </p>
          </div>

          <RationalePanel />

          <Card padding="lg" variant="outline">
            <CardHeader>
              <CardTitle className="text-lg">Open questions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-text-secondary">
              <p>
                <strong className="text-text-primary">Q1.</strong> If no runtimes are detected on
                step 1, should we block Continue or still land the user in the workspace with an
                empty-state "Install a runtime" card? (Recommendation: land them — the workspace can
                also demo without a live agent.)
              </p>
              <p>
                <strong className="text-text-primary">Q2.</strong> Should the default agent use the
                first detected runtime alphabetically, or the one the user is most likely to have
                configured credentials for? (Recommendation: alphabetical for determinism; revisit
                with telemetry.)
              </p>
              <p>
                <strong className="text-text-primary">Q3.</strong> The "Browse templates" entry
                point — sidebar button, command palette, or empty-state CTA only? (Recommendation:
                all three, starting with the empty-state so it's visible on day one.)
              </p>
            </CardContent>
          </Card>

          <Alert variant="info">
            <Search className="size-4" />
            <div>
              <AlertTitle>Not wired to real flow yet</AlertTitle>
              <AlertDescription>
                This story is for review only. No changes to{" "}
                <code className="font-mono">apps/slark/src/renderer/src/components/onboarding</code>{" "}
                have been made. Once approved, the implementation will land in two follow-up PRs.
              </AlertDescription>
            </div>
          </Alert>
        </div>
      </div>
    </ThemeRoot>
  ),
};
