import { useState } from "react";
import { cn } from "@nexu-design/ui-web";
import {
  Check,
  ChevronDown,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  CircleDot,
  Circle,
  Eye,
  FileDiff,
  Hand,
  ListChecks,
  Map,
  Pencil,
  RefreshCw,
  Terminal,
  X,
} from "lucide-react";

type PanelTab = "preview" | "diff" | "terminal" | "tasks" | "plan";

interface TabMeta {
  value: PanelTab;
  label: string;
  icon: typeof Eye;
  shortcut?: string;
  hasUpdate?: boolean;
}

const TABS: TabMeta[] = [
  { value: "preview", label: "Preview", icon: Eye, shortcut: "⇧⌘P" },
  { value: "diff", label: "Diff", icon: FileDiff, shortcut: "⇧⌘D" },
  { value: "terminal", label: "Terminal", icon: Terminal, shortcut: "⌃`" },
  { value: "tasks", label: "Tasks", icon: ListChecks, hasUpdate: true },
  { value: "plan", label: "Plan", icon: Map },
];

export function TopicSidePanel(): React.ReactElement {
  const [collapsed, setCollapsed] = useState(false);
  const [tab, setTab] = useState<PanelTab>("diff");

  if (collapsed) {
    return (
      <div className="flex h-full shrink-0 flex-col border-l border-border bg-surface-1/30">
        <button
          type="button"
          onClick={() => setCollapsed(false)}
          className="flex h-[52px] w-10 items-center justify-center border-b border-border text-text-muted hover:bg-surface-2 hover:text-text-primary"
          title="Expand panel"
        >
          <ChevronsLeft className="size-4" />
        </button>
        <div className="flex flex-col items-center gap-1 py-2">
          {TABS.map((t) => {
            const Icon = t.icon;
            return (
              <button
                key={t.value}
                type="button"
                onClick={() => {
                  setTab(t.value);
                  setCollapsed(false);
                }}
                title={t.label}
                className="relative flex size-8 items-center justify-center rounded-md text-text-muted transition-colors hover:bg-surface-2 hover:text-text-primary"
              >
                <Icon className="size-4" />
                {t.hasUpdate ? (
                  <span className="absolute right-1.5 top-1.5 size-1.5 rounded-full bg-info" />
                ) : null}
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <aside className="flex h-full w-[440px] shrink-0 flex-col border-l border-border bg-surface-1/30">
      <div className="flex h-[52px] shrink-0 items-center gap-1 border-b border-border px-2">
        <div className="flex min-w-0 flex-1 items-center gap-0.5 overflow-x-auto">
          {TABS.map((t) => {
            const Icon = t.icon;
            const active = tab === t.value;
            return (
              <button
                key={t.value}
                type="button"
                onClick={() => setTab(t.value)}
                className={cn(
                  "relative inline-flex h-8 shrink-0 items-center gap-1.5 rounded-md px-2 text-[12px] font-medium transition-colors",
                  active
                    ? "bg-surface-2 text-text-primary"
                    : "text-text-muted hover:bg-surface-2/60 hover:text-text-primary",
                )}
                title={t.shortcut ? `${t.label} (${t.shortcut})` : t.label}
              >
                <Icon className="size-3.5" />
                {t.label}
                {t.hasUpdate ? <span className="size-1.5 rounded-full bg-info" /> : null}
              </button>
            );
          })}
        </div>
        <button
          type="button"
          onClick={() => setCollapsed(true)}
          className="flex size-7 shrink-0 items-center justify-center rounded-md text-text-muted transition-colors hover:bg-surface-2 hover:text-text-primary"
          title="Collapse panel"
        >
          <ChevronsRight className="size-4" />
        </button>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto">
        <PanelBody tab={tab} />
      </div>
    </aside>
  );
}

function PanelBody({ tab }: { tab: PanelTab }): React.ReactElement {
  switch (tab) {
    case "preview":
      return <PreviewMock />;
    case "diff":
      return <DiffMock />;
    case "terminal":
      return <TerminalMock />;
    case "tasks":
      return <TasksMock />;
    case "plan":
      return <PlanMock />;
  }
}

/** Add a protocol when missing so `localhost:5173` and bare hosts still load. */
function toIframeSrc(raw: string): string {
  const trimmed = raw.trim();
  if (!trimmed) return "about:blank";
  if (/^[a-z][a-z0-9+.-]*:\/\//i.test(trimmed)) return trimmed; // already has scheme
  if (/^about:|^data:|^blob:/i.test(trimmed)) return trimmed;
  // Bare path like "/preview-demo.html" → current origin.
  if (trimmed.startsWith("/") && typeof window !== "undefined") {
    return `${window.location.origin}${trimmed}`;
  }
  return `http://${trimmed}`;
}

/**
 * Default preview target — points at the demo HTML served from this app's own
 * dev server so the iframe always has something to load. Derived from
 * `window.location` so we pick up the actual running port (5173, 5174, …).
 */
function getDefaultPreviewUrl(): string {
  if (typeof window === "undefined" || !window.location.host) {
    return "localhost:5173/preview-demo.html";
  }
  return `${window.location.host}/preview-demo.html`;
}

function PreviewMock(): React.ReactElement {
  const [url, setUrl] = useState(getDefaultPreviewUrl);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(url);
  // Bumped on manual reload to force the iframe to re-request its src.
  const [reloadToken, setReloadToken] = useState(0);

  const commit = () => {
    const next = draft.trim();
    if (next) setUrl(next);
    else setDraft(url);
    setEditing(false);
  };
  const cancel = () => {
    setDraft(url);
    setEditing(false);
  };
  const reload = () => setReloadToken((n) => n + 1);

  const iframeSrc = toIframeSrc(url);

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-2 border-b border-border px-3 py-2 text-[11px] text-text-muted">
        <span className="inline-flex size-2 shrink-0 rounded-full bg-success" />
        {editing ? (
          <>
            <input
              autoFocus
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") commit();
                else if (e.key === "Escape") cancel();
              }}
              onBlur={commit}
              className="min-w-0 flex-1 rounded border border-border bg-background px-1.5 py-0.5 font-mono text-[11px] text-text-primary outline-none focus:border-brand-primary"
              placeholder="localhost:5173"
            />
            <button
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={commit}
              className="flex size-5 shrink-0 items-center justify-center rounded text-text-muted hover:bg-surface-2 hover:text-text-primary"
              title="Save"
            >
              <Check className="size-3" />
            </button>
            <button
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={cancel}
              className="flex size-5 shrink-0 items-center justify-center rounded text-text-muted hover:bg-surface-2 hover:text-text-primary"
              title="Cancel"
            >
              <X className="size-3" />
            </button>
          </>
        ) : (
          <>
            <button
              type="button"
              onClick={() => {
                setDraft(url);
                setEditing(true);
              }}
              className="group flex min-w-0 items-center gap-1 rounded px-1 py-0.5 hover:bg-surface-2 hover:text-text-primary"
              title="Edit preview URL"
            >
              <span className="truncate font-mono">{url}</span>
              <Pencil className="size-3 shrink-0 opacity-0 transition-opacity group-hover:opacity-100" />
            </button>
            <button
              type="button"
              onClick={reload}
              className="flex size-5 shrink-0 items-center justify-center rounded text-text-muted hover:bg-surface-2 hover:text-text-primary"
              title="Reload"
            >
              <RefreshCw className="size-3" />
            </button>
            <span className="ml-auto text-text-tertiary">connected</span>
          </>
        )}
      </div>
      <div className="relative min-h-0 flex-1 bg-surface-0">
        <iframe
          key={`${iframeSrc}#${reloadToken}`}
          src={iframeSrc}
          title={`Preview of ${url}`}
          className="absolute inset-0 h-full w-full border-0 bg-white"
          sandbox="allow-forms allow-modals allow-popups allow-same-origin allow-scripts"
          referrerPolicy="no-referrer"
        />
      </div>
    </div>
  );
}

function DiffMock(): React.ReactElement {
  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-2 border-b border-border px-3 py-2 text-[11px]">
        <span className="font-mono text-text-muted">main</span>
        <ChevronRight className="size-3 text-text-tertiary" />
        <span className="font-mono text-text-primary">dev-shared</span>
        <button
          type="button"
          className="ml-auto flex size-5 items-center justify-center rounded text-text-muted hover:bg-surface-2 hover:text-text-primary"
          title="Close"
        >
          <X className="size-3" />
        </button>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-3 py-2">
        <div className="mb-2 flex items-center gap-1.5 text-[11px]">
          <ChevronDown className="size-3 text-text-muted" />
          <span className="font-mono text-text-muted">apps/slark/src/renderer/src/app/App.tsx</span>
          <span className="text-success">+2</span>
          <span className="text-danger">-0</span>
        </div>

        <div className="rounded-md border border-border bg-surface-0 font-mono text-[11px] leading-5">
          <FoldRow label="9 unmodified lines" />

          <DiffLine num={10} tone="context">
            <Code>
              <Kw>import</Kw> {"{ "}
              <Ident>WelcomePage</Ident>
              {" }"} <Kw>from</Kw> <Str>&quot;@/components/onboarding/WelcomePage&quot;</Str>;
            </Code>
          </DiffLine>
          <DiffLine num={11} tone="context">
            <Code>
              <Kw>import</Kw> {"{ "}
              <Ident>OnboardingFlow</Ident>
              {" }"} <Kw>from</Kw> <Str>&quot;@/components/onboarding/OnboardingFlow&quot;</Str>;
            </Code>
          </DiffLine>
          <DiffLine num={12} tone="context">
            <Code>
              <Kw>import</Kw> {"{ "}
              <Ident>ChatView</Ident>
              {" }"} <Kw>from</Kw> <Str>&quot;@/components/chat/ChatView&quot;</Str>;
            </Code>
          </DiffLine>
          <DiffLine num={13} tone="add">
            <Code>
              <Kw>import</Kw> {"{ "}
              <Ident>IssuesView</Ident>
              {" }"} <Kw>from</Kw> <Str>&quot;@/components/issues/IssuesView&quot;</Str>;
            </Code>
          </DiffLine>
          <DiffLine num={14} tone="context">
            <Code>
              <Kw>import</Kw> {"{ "}
              <Ident>AgentsView</Ident>
              {" }"} <Kw>from</Kw> <Str>&quot;@/components/agents/AgentsView&quot;</Str>;
            </Code>
          </DiffLine>
          <DiffLine num={15} tone="add">
            <Code>
              <Kw>import</Kw> {"{ "}
              <Ident>AgentDetail</Ident>
              {" }"} <Kw>from</Kw> <Str>&quot;@/components/agents/AgentDetail&quot;</Str>;
            </Code>
          </DiffLine>
          <DiffLine num={16} tone="context">
            <Code>
              <Kw>import</Kw> {"{ "}
              <Ident>UserDetail</Ident>
              {" }"} <Kw>from</Kw> <Str>&quot;@/components/agents/UserDetail&quot;</Str>;
            </Code>
          </DiffLine>

          <FoldRow label="74 unmodified lines" />

          <DiffLine num={91} tone="context">
            <Code>
              {"        "}
              <Tag>&lt;Route</Tag> <Attr>path</Attr>=<Str>&quot;/&quot;</Str> <Attr>element</Attr>=
              {"{"}
              <Tag>&lt;Navigate</Tag> <Attr>to</Attr>=<Str>&quot;/chat/ch-welcome&quot;</Str>{" "}
              <Attr>replace</Attr> <Tag>/&gt;</Tag>
              {"}"} <Tag>/&gt;</Tag>
            </Code>
          </DiffLine>
        </div>
      </div>
    </div>
  );
}

function FoldRow({ label }: { label: string }): React.ReactElement {
  return (
    <div className="flex items-center gap-1.5 border-b border-border px-2 py-1 text-text-tertiary">
      <ChevronDown className="size-3" />
      <span>{label}</span>
    </div>
  );
}

function DiffLine({
  num,
  tone,
  children,
}: {
  num: number;
  tone: "context" | "add" | "remove";
  children: React.ReactNode;
}): React.ReactElement {
  return (
    <div
      className={cn(
        "flex items-start gap-2 px-2 py-[1px]",
        tone === "add" && "bg-success/10",
        tone === "remove" && "bg-danger/10",
      )}
    >
      <span
        aria-hidden
        className={cn(
          "-mx-2 w-[2px] shrink-0 self-stretch",
          tone === "add" ? "bg-success" : "bg-transparent",
        )}
      />
      <span className="w-6 shrink-0 text-right text-text-tertiary tabular-nums">{num}</span>
      <span className="min-w-0 flex-1 whitespace-pre-wrap break-all">{children}</span>
    </div>
  );
}

function Code({ children }: { children: React.ReactNode }): React.ReactElement {
  return <span className="text-text-primary">{children}</span>;
}
function Kw({ children }: { children: React.ReactNode }): React.ReactElement {
  return <span className="text-danger">{children}</span>;
}
function Ident({ children }: { children: React.ReactNode }): React.ReactElement {
  return <span className="text-text-primary">{children}</span>;
}
function Str({ children }: { children: React.ReactNode }): React.ReactElement {
  return <span className="text-success">{children}</span>;
}
function Tag({ children }: { children: React.ReactNode }): React.ReactElement {
  return <span className="text-info">{children}</span>;
}
function Attr({ children }: { children: React.ReactNode }): React.ReactElement {
  return <span className="text-warning">{children}</span>;
}

function TerminalMock(): React.ReactElement {
  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-2 border-b border-border px-3 py-2 text-[11px] text-text-muted">
        <Terminal className="size-3" />
        <span className="font-mono">zsh — design</span>
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto bg-surface-0 px-3 py-2 font-mono text-[11px] leading-5 text-text-primary">
        <div className="text-text-muted">Your user&apos;s .npmrc file (${"{HOME}"}/.npmrc)</div>
        <div className="text-text-muted">
          has a <span className="text-warning">`globalconfig`</span> and/or a{" "}
          <span className="text-warning">`prefix`</span> setting, which
        </div>
        <div className="text-text-muted">are incompatible with nvm.</div>
        <div className="text-text-muted">
          Run <span className="text-info">`nvm use --delete-prefix v22.22.2 --silent`</span> to
          unset it.
        </div>
        <div className="mt-1 flex items-center gap-1">
          <span className="text-success">sunqingyu@MacBook-Pro</span>
          <span className="text-text-muted">design</span>
          <span className="text-info">%</span>
          <span className="inline-block h-[14px] w-[7px] animate-pulse bg-text-primary/70" />
        </div>
      </div>
    </div>
  );
}

function TasksMock(): React.ReactElement {
  return (
    <div className="flex h-full flex-col gap-3 overflow-y-auto px-3 py-3">
      <TaskSection title="Running">
        <TaskCard
          title="Restart slark dev after ui-web rebuild"
          subtitle="Running"
          badge="Bash"
          tone="running"
          dismissable
        />
      </TaskSection>

      <TaskSection title="Completed">
        <TaskCard
          title="Check TS errors excluding pre-existing"
          subtitle="Completed"
          badge="Bash"
          tone="completed"
        />
        <TaskCard
          title="slark readiness after rebuild"
          subtitle="Stopped"
          badge="Bash"
          tone="stopped"
        />
        <TaskCard
          title="Build tokens + ui-web packages"
          subtitle="Completed"
          badge="Bash"
          tone="completed"
        />
        <TaskCard title="bzx0vakdn" subtitle="Stopped" badge="Task" tone="stopped" />
        <TaskCard
          title="slark electron dev readiness"
          subtitle="Stopped"
          badge="Bash"
          tone="stopped"
        />
      </TaskSection>
    </div>
  );
}

function TaskSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}): React.ReactElement {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="px-1 text-[11px] font-semibold uppercase tracking-wider text-text-muted">
        {title}
      </div>
      <div className="flex flex-col gap-1.5">{children}</div>
    </div>
  );
}

function TaskCard({
  title,
  subtitle,
  badge,
  tone,
  dismissable,
}: {
  title: string;
  subtitle: string;
  badge: "Bash" | "Task";
  tone: "running" | "completed" | "stopped";
  dismissable?: boolean;
}): React.ReactElement {
  return (
    <div className="flex items-start gap-2.5 rounded-md border border-border bg-surface-0 px-2.5 py-2">
      <div className="mt-0.5 shrink-0">
        {tone === "running" ? (
          <span className="inline-flex size-2 animate-pulse rounded-full bg-info" />
        ) : tone === "completed" ? (
          <span className="inline-flex size-3.5 items-center justify-center rounded-full border border-text-tertiary/60 text-text-muted">
            <svg
              viewBox="0 0 12 12"
              className="size-2.5"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <path d="M2.5 6.5L5 9l4.5-5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
        ) : (
          <Hand className="size-3.5 text-text-muted" />
        )}
      </div>
      <div className="min-w-0 flex-1">
        <div className="truncate text-[12px] font-medium text-text-primary">{title}</div>
        <div className="mt-0.5 text-[11px] text-text-muted">{subtitle}</div>
      </div>
      <span className="shrink-0 rounded-md bg-surface-2 px-1.5 py-0.5 text-[10px] font-semibold text-text-muted">
        {badge}
      </span>
      {dismissable ? (
        <button
          type="button"
          className="flex size-5 shrink-0 items-center justify-center rounded text-text-muted hover:bg-surface-2 hover:text-text-primary"
          title="Stop"
        >
          <X className="size-3" />
        </button>
      ) : null}
    </div>
  );
}

function PlanMock(): React.ReactElement {
  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-2 border-b border-border px-3 py-2 text-[11px]">
        <span className="font-semibold text-text-primary">Plan</span>
        <span className="rounded bg-surface-2 px-1.5 py-0.5 font-mono text-[10px] text-text-muted">
          3 / 6
        </span>
        <span className="ml-auto text-text-tertiary">Updated 2m ago</span>
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto px-3 py-3">
        <div className="mb-3">
          <div className="text-[12px] font-semibold text-text-primary">
            Add editable preview URL + plan panel content
          </div>
          <div className="mt-1 text-[11px] text-text-muted">
            Dev Controls panel now lets the user replace the preview target and surfaces the plan
            Claude is executing.
          </div>
        </div>

        <div className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-text-muted">
          Steps
        </div>
        <div className="flex flex-col gap-0">
          <PlanStep
            state="done"
            title="Locate Dev Controls preview panel"
            detail="TopicSidePanel.tsx → PreviewMock renders localhost:5173 header."
          />
          <PlanStep
            state="done"
            title="Make preview URL user-replaceable"
            detail="Inline edit with Enter/Escape, blur-to-save, and a reload affordance."
          />
          <PlanStep
            state="done"
            title="Audit Plan tab empty state"
            detail="Empty placeholder replaced with a structured plan list."
          />
          <PlanStep
            state="active"
            title="Fill Plan panel with concrete content"
            detail="Steps, status chips, and a summary so the panel feels live instead of stubbed."
          />
          <PlanStep
            state="pending"
            title="Wire plan data to agent run state"
            detail="Source plan items from the active topic's agent run rather than mock content."
          />
          <PlanStep
            state="pending"
            title="Persist preview URL per workspace"
            detail="Store the preview target in workspace settings so reopening keeps the override."
          />
        </div>

        <div className="mt-4 rounded-md border border-border bg-surface-0 px-2.5 py-2">
          <div className="flex items-center gap-1.5 text-[11px] font-semibold text-text-primary">
            <Map className="size-3 text-text-muted" />
            Notes
          </div>
          <ul className="mt-1.5 flex flex-col gap-1 text-[11px] text-text-muted">
            <li>• Keep inline edit interaction consistent with channel name editing.</li>
            <li>• Validate URLs lightly — allow bare host:port as well as full URLs.</li>
            <li>• Don't break the Preview mock screenshot used in onboarding.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

function PlanStep({
  state,
  title,
  detail,
}: {
  state: "done" | "active" | "pending";
  title: string;
  detail?: string;
}): React.ReactElement {
  return (
    <div className="flex gap-2 py-1.5">
      <div className="mt-0.5 shrink-0">
        {state === "done" ? (
          <span className="inline-flex size-4 items-center justify-center rounded-full bg-success/15 text-success">
            <Check className="size-3" />
          </span>
        ) : state === "active" ? (
          <span className="inline-flex size-4 items-center justify-center rounded-full bg-info/15 text-info">
            <CircleDot className="size-3" />
          </span>
        ) : (
          <Circle className="size-4 text-text-tertiary" />
        )}
      </div>
      <div className="min-w-0 flex-1">
        <div
          className={cn(
            "text-[12px]",
            state === "done"
              ? "text-text-muted line-through decoration-text-tertiary/60"
              : state === "active"
                ? "font-medium text-text-primary"
                : "text-text-primary",
          )}
        >
          {title}
        </div>
        {detail ? <div className="mt-0.5 text-[11px] text-text-muted">{detail}</div> : null}
      </div>
    </div>
  );
}
