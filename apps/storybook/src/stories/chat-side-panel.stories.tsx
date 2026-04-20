import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  ArrowUpRight,
  BookOpen,
  Boxes,
  Download,
  ExternalLink,
  FileCode,
  FileText,
  Hash,
  MessageSquareMore,
  MoreHorizontal,
  PanelRightClose,
  PanelRightOpen,
  Paperclip,
  Pin,
  Search,
  Send,
  Sparkles,
  Users,
  Video,
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
  DetailPanel,
  DetailPanelCloseButton,
  DetailPanelContent,
  DetailPanelHeader,
  DetailPanelTitle,
  FileAttachment,
  Input,
  InteractiveRow,
  InteractiveRowContent,
  InteractiveRowLeading,
  InteractiveRowTrailing,
  ResizablePanel,
  ScrollArea,
  SplitView,
  StatusDot,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  TextLink,
  cn,
} from "@nexu-design/ui-web";

/**
 * Chat Side Panel — review-only prototype stories
 *
 * Purpose: prototype the "open/close on the right" panel for a group chat
 * with inline layout (no overlay). Opening the panel pushes the message
 * list, instead of floating on top of it.
 *
 *   [Messages]  |  [Side panel 360px]
 *
 * Key constraints captured from product review:
 *   - Inline layout — panel participates in flex flow, does NOT overlay.
 *   - No backdrop / scrim. Message list stays interactive while panel is open.
 *   - Smooth width transition on open / close (200ms ease-standard).
 *   - Content area has tabs: 产物 / 成员 / 文件 / 置顶.
 *
 * Composition: SplitView + ResizablePanel + DetailPanel + Tabs, all from
 * @nexu-design/ui-web. No ad-hoc primitives in this story.
 */

const meta = {
  title: "Scenarios/Chat Side Panel",
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Review-only story: inline right-side panel for group chats. No backdrop, " +
          "panel pushes content, with tabs for 产物 / 成员 / 文件 / 置顶. No changes " +
          "to apps/slark yet.",
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

// ---------------------------------------------------------------------------
// Shared window frame — approximates the slark Electron window so reviewers
// judge density at the real size. Same dimensions as onboarding-flow stories.
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
        <span className="text-[11px] font-semibold uppercase tracking-wide text-text-muted">
          {label}
        </span>
        {sublabel ? <span className="text-[11px] text-text-tertiary">· {sublabel}</span> : null}
      </div>
      <div className="h-[720px] w-[1024px] overflow-hidden rounded-lg border border-border-subtle bg-surface-0 shadow-sm">
        {children}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Mock data
// ---------------------------------------------------------------------------

const me = {
  id: "u-me",
  name: "Minh",
  avatar: "https://i.pravatar.cc/80?img=12",
  fallback: "MN",
};

const alice = {
  id: "u-alice",
  name: "Alice Chen",
  avatar: "https://i.pravatar.cc/80?img=47",
  fallback: "AC",
};

const bob = {
  id: "u-bob",
  name: "Bob Li",
  avatar: "https://i.pravatar.cc/80?img=15",
  fallback: "BL",
};

const coder = {
  id: "a-coder",
  name: "Coder",
  fallback: "CD",
  isAgent: true,
  accent: "var(--color-brand-primary)",
};

interface ArtifactItem {
  id: string;
  icon: React.ElementType;
  title: string;
  meta: string;
  author: string;
  time: string;
  kind: "canvas" | "code" | "doc" | "video";
}

const artifacts: ArtifactItem[] = [
  {
    id: "art-1",
    icon: Sparkles,
    title: "Onboarding 1.5-step — proposal canvas",
    meta: "Canvas · updated 5 min ago",
    author: "Alice Chen",
    time: "14:32",
    kind: "canvas",
  },
  {
    id: "art-2",
    icon: FileCode,
    title: "retry-policy.ts",
    meta: "Code · 4.2 KB",
    author: "Coder",
    time: "13:58",
    kind: "code",
  },
  {
    id: "art-3",
    icon: FileText,
    title: "Growth Ops · weekly digest",
    meta: "Doc · 12 sections",
    author: "Bob Li",
    time: "Yesterday",
    kind: "doc",
  },
  {
    id: "art-4",
    icon: Video,
    title: "Bug-2174 repro walkthrough",
    meta: "Video · 02:37",
    author: "Docs agent",
    time: "Monday",
    kind: "video",
  },
];

interface MemberItem {
  id: string;
  name: string;
  avatar?: string;
  fallback: string;
  role: string;
  status: "online" | "away" | "offline";
  isAgent?: boolean;
}

const members: MemberItem[] = [
  {
    id: "u-me",
    name: "Minh (you)",
    avatar: me.avatar,
    fallback: "MN",
    role: "Owner",
    status: "online",
  },
  {
    id: "u-alice",
    name: "Alice Chen",
    avatar: alice.avatar,
    fallback: "AC",
    role: "Design lead",
    status: "online",
  },
  {
    id: "u-bob",
    name: "Bob Li",
    avatar: bob.avatar,
    fallback: "BL",
    role: "Eng manager",
    status: "away",
  },
  {
    id: "a-coder",
    name: "Coder",
    fallback: "CD",
    role: "Code agent · Claude Sonnet 4",
    status: "online",
    isAgent: true,
  },
  {
    id: "a-reviewer",
    name: "Reviewer",
    fallback: "RV",
    role: "Review agent · GPT-5",
    status: "online",
    isAgent: true,
  },
  {
    id: "a-ops",
    name: "Ops",
    fallback: "OP",
    role: "Ops agent · offline for maintenance",
    status: "offline",
    isAgent: true,
  },
];

interface FileItem {
  id: string;
  name: string;
  meta: string;
  kind: "code" | "archive" | "doc" | "media";
  uploader: string;
  time: string;
}

const files: FileItem[] = [
  {
    id: "f-1",
    name: "retry-policy.ts",
    meta: "4.2 KB · TypeScript",
    kind: "code",
    uploader: "Coder",
    time: "13:58",
  },
  {
    id: "f-2",
    name: "logs.tar.gz",
    meta: "14.3 MB · archive",
    kind: "archive",
    uploader: "Alice Chen",
    time: "11:05",
  },
  {
    id: "f-3",
    name: "Q2-plan.pdf",
    meta: "1.1 MB · document",
    kind: "doc",
    uploader: "Bob Li",
    time: "Yesterday",
  },
  {
    id: "f-4",
    name: "ui-mock.png",
    meta: "640 KB · image",
    kind: "media",
    uploader: "Alice Chen",
    time: "Monday",
  },
];

interface PinnedItem {
  id: string;
  author: string;
  time: string;
  text: string;
}

const pinned: PinnedItem[] = [
  {
    id: "p-1",
    author: "Alice Chen",
    time: "Apr 18",
    text:
      "Channel ground rules: agents run with read-only shell by default. Anything that " +
      "modifies state requires an explicit approval card.",
  },
  {
    id: "p-2",
    author: "Bob Li",
    time: "Apr 15",
    text: "Weekly digest every Friday 16:00 — Coder and Ops publish a summary of all merged PRs.",
  },
  {
    id: "p-3",
    author: "Minh",
    time: "Apr 10",
    text: "Use @Reviewer to trigger a review; use @Ops for deploy questions.",
  },
];

// ---------------------------------------------------------------------------
// Channel header
// ---------------------------------------------------------------------------

interface ChannelHeaderProps {
  name: string;
  description: string;
  memberCount: number;
  panelOpen: boolean;
  onTogglePanel: () => void;
}

function ChannelHeader({
  name,
  description,
  memberCount,
  panelOpen,
  onTogglePanel,
}: ChannelHeaderProps) {
  return (
    <header className="flex h-12 shrink-0 items-center gap-3 border-b border-border-subtle bg-surface-0 px-4">
      <Hash size={16} className="text-text-muted" />
      <div className="flex min-w-0 flex-1 items-baseline gap-2">
        <span className="truncate text-[14px] font-semibold text-text-heading">{name}</span>
        <span className="truncate text-[12px] text-text-muted">{description}</span>
      </div>
      <div className="flex items-center gap-1">
        <Button variant="ghost" size="icon-sm" aria-label="Search">
          <Search size={14} />
        </Button>
        <Button variant="ghost" size="icon-sm" aria-label="Members">
          <Users size={14} />
          <span className="ml-1 text-[11px] font-medium">{memberCount}</span>
        </Button>
        <Button
          variant={panelOpen ? "soft" : "ghost"}
          size="icon-sm"
          aria-label={panelOpen ? "Close side panel" : "Open side panel"}
          onClick={onTogglePanel}
        >
          {panelOpen ? <PanelRightClose size={14} /> : <PanelRightOpen size={14} />}
        </Button>
        <Button variant="ghost" size="icon-sm" aria-label="More">
          <MoreHorizontal size={14} />
        </Button>
      </div>
    </header>
  );
}

// ---------------------------------------------------------------------------
// Message list (static mock, enough to gauge density when panel pushes)
// ---------------------------------------------------------------------------

function MessageList() {
  return (
    <ScrollArea className="min-h-0 flex-1">
      <div className="flex flex-col gap-4 px-5 py-4">
        <ChatMessage sender={alice} time="13:42">
          Pushed a first cut of the onboarding 1.5-step proposal — canvas is in the side panel under{" "}
          <strong>产物</strong>. Would love eng input on whether the deferred runtime step is
          feasible.
        </ChatMessage>
        <ChatMessage sender={bob} time="13:44">
          Feasible. The runtime detection path already runs on first launch — we just skip it during
          onboarding and surface it as a card in the workspace.
        </ChatMessage>
        <ChatMessage
          sender={coder}
          time="13:58"
          blocks={<FileAttachment name="retry-policy.ts" meta="4.2 KB · TypeScript" kind="code" />}
        >
          Attached the retry-policy module I extracted while reproducing bug-2174. Once approved we
          can wire it into{" "}
          <code className="rounded bg-surface-2 px-1.5 py-0.5 text-[12px]">@nexu-design/utils</code>
          .
        </ChatMessage>
        <ChatMessage sender={me} time="14:05">
          Thanks. I'll route review through @Reviewer after lunch. Pinning the ground rules again
          for the new joiners — see 置顶 tab.
        </ChatMessage>
        <ChatMessage sender={alice} time="14:32">
          Canvas updated with the side-by-side comparison. Pushing a storybook PR tonight.
        </ChatMessage>
      </div>
    </ScrollArea>
  );
}

// ---------------------------------------------------------------------------
// Composer
// ---------------------------------------------------------------------------

function Composer() {
  return (
    <div className="shrink-0 border-t border-border-subtle bg-surface-0 px-4 py-3">
      <div className="flex items-center gap-2 rounded-lg border border-border bg-surface-1 px-3 py-2">
        <Button variant="ghost" size="icon-sm" aria-label="Attach">
          <Paperclip size={14} />
        </Button>
        <input
          className="flex-1 bg-transparent text-[13px] text-text-primary outline-none placeholder:text-text-muted"
          placeholder="Send a message to #design-review"
        />
        <Button size="sm" leadingIcon={<Send size={12} />}>
          Send
        </Button>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Side panel tabs
// ---------------------------------------------------------------------------

const PANEL_TABS = [
  { value: "artifacts", label: "产物", icon: Boxes },
  { value: "members", label: "成员", icon: Users },
  { value: "files", label: "文件", icon: Paperclip },
  { value: "pinned", label: "置顶", icon: Pin },
] as const;

type PanelTabValue = (typeof PANEL_TABS)[number]["value"];

function kindBadgeClass(kind: ArtifactItem["kind"]) {
  switch (kind) {
    case "canvas":
      return "bg-[var(--color-brand-subtle)] text-[var(--color-brand-primary)]";
    case "code":
      return "bg-[var(--color-info-subtle)] text-[var(--color-info)]";
    case "doc":
      return "bg-surface-2 text-text-secondary";
    case "video":
      return "bg-[var(--color-warning-subtle)] text-[var(--color-warning)]";
  }
}

function statusToneClass(status: MemberItem["status"]) {
  switch (status) {
    case "online":
      return "text-[var(--color-success)]";
    case "away":
      return "text-[var(--color-warning)]";
    case "offline":
      return "text-text-muted";
  }
}

function statusDotStatus(status: MemberItem["status"]) {
  switch (status) {
    case "online":
      return "success" as const;
    case "away":
      return "warning" as const;
    case "offline":
      return "neutral" as const;
  }
}

interface SidePanelContentProps {
  initialTab?: PanelTabValue;
}

function SidePanelContent({ initialTab = "artifacts" }: SidePanelContentProps) {
  const [value, setValue] = useState<PanelTabValue>(initialTab);

  return (
    <Tabs
      value={value}
      onValueChange={(v) => setValue(v as PanelTabValue)}
      className="flex min-h-0 flex-1 flex-col"
    >
      <div className="shrink-0 border-b border-border-subtle px-3 py-2">
        <TabsList variant="compact" className="w-full justify-between">
          {PANEL_TABS.map((tab) => {
            const Icon = tab.icon;
            return (
              <TabsTrigger key={tab.value} value={tab.value} variant="compact" className="flex-1">
                <Icon size={12} />
                {tab.label}
              </TabsTrigger>
            );
          })}
        </TabsList>
      </div>

      <TabsContent value="artifacts" className="min-h-0 flex-1 data-[state=inactive]:hidden">
        <ScrollArea className="h-full">
          <div className="flex flex-col gap-1 px-2 py-2">
            {artifacts.map((item) => {
              const Icon = item.icon;
              return (
                <InteractiveRow key={item.id} tone="subtle" className="items-start py-2">
                  <InteractiveRowLeading>
                    <div
                      className={cn(
                        "flex size-8 shrink-0 items-center justify-center rounded-md",
                        kindBadgeClass(item.kind),
                      )}
                    >
                      <Icon size={14} />
                    </div>
                  </InteractiveRowLeading>
                  <InteractiveRowContent>
                    <div className="truncate text-[13px] font-medium text-text-primary">
                      {item.title}
                    </div>
                    <div className="mt-0.5 truncate text-[11px] text-text-muted">
                      {item.meta} · {item.author} · {item.time}
                    </div>
                  </InteractiveRowContent>
                  <InteractiveRowTrailing>
                    <ArrowUpRight size={14} className="text-text-muted" />
                  </InteractiveRowTrailing>
                </InteractiveRow>
              );
            })}
          </div>
        </ScrollArea>
      </TabsContent>

      <TabsContent value="members" className="min-h-0 flex-1 data-[state=inactive]:hidden">
        <ScrollArea className="h-full">
          <div className="flex flex-col gap-1 px-2 py-2">
            <div className="px-2 pb-1 pt-2 text-[10px] font-semibold uppercase tracking-wide text-text-tertiary">
              Humans · {members.filter((m) => !m.isAgent).length}
            </div>
            {members
              .filter((m) => !m.isAgent)
              .map((m) => (
                <InteractiveRow key={m.id} tone="subtle">
                  <InteractiveRowLeading>
                    <div className="relative">
                      <Avatar className="size-8">
                        {m.avatar ? <AvatarImage src={m.avatar} alt="" /> : null}
                        <AvatarFallback>{m.fallback}</AvatarFallback>
                      </Avatar>
                      <StatusDot
                        status={statusDotStatus(m.status)}
                        className="absolute -right-0.5 -bottom-0.5 ring-2 ring-surface-0"
                      />
                    </div>
                  </InteractiveRowLeading>
                  <InteractiveRowContent>
                    <div className="truncate text-[13px] font-medium text-text-primary">
                      {m.name}
                    </div>
                    <div className={cn("mt-0.5 truncate text-[11px]", statusToneClass(m.status))}>
                      {m.role}
                    </div>
                  </InteractiveRowContent>
                </InteractiveRow>
              ))}
            <div className="px-2 pb-1 pt-3 text-[10px] font-semibold uppercase tracking-wide text-text-tertiary">
              Agents · {members.filter((m) => m.isAgent).length}
            </div>
            {members
              .filter((m) => m.isAgent)
              .map((m) => (
                <InteractiveRow key={m.id} tone="subtle">
                  <InteractiveRowLeading>
                    <div className="relative">
                      <Avatar className="size-8">
                        <AvatarFallback>{m.fallback}</AvatarFallback>
                      </Avatar>
                      <StatusDot
                        status={statusDotStatus(m.status)}
                        className="absolute -right-0.5 -bottom-0.5 ring-2 ring-surface-0"
                      />
                    </div>
                  </InteractiveRowLeading>
                  <InteractiveRowContent>
                    <div className="flex items-center gap-1.5">
                      <span className="truncate text-[13px] font-medium text-text-primary">
                        {m.name}
                      </span>
                      <Badge variant="outline" size="xs">
                        Agent
                      </Badge>
                    </div>
                    <div className={cn("mt-0.5 truncate text-[11px]", statusToneClass(m.status))}>
                      {m.role}
                    </div>
                  </InteractiveRowContent>
                </InteractiveRow>
              ))}
          </div>
        </ScrollArea>
      </TabsContent>

      <TabsContent value="files" className="min-h-0 flex-1 data-[state=inactive]:hidden">
        <ScrollArea className="h-full">
          <div className="flex flex-col gap-2 px-3 py-3">
            <Input placeholder="Search files in this channel" leadingIcon={<Search size={14} />} />
            <div className="flex flex-col gap-1.5 pt-1">
              {files.map((f) => (
                <FileAttachment
                  key={f.id}
                  name={f.name}
                  meta={`${f.meta} · ${f.uploader} · ${f.time}`}
                  kind={f.kind}
                />
              ))}
            </div>
          </div>
        </ScrollArea>
      </TabsContent>

      <TabsContent value="pinned" className="min-h-0 flex-1 data-[state=inactive]:hidden">
        <ScrollArea className="h-full">
          <div className="flex flex-col gap-3 px-3 py-3">
            {pinned.map((p) => (
              <div key={p.id} className="rounded-lg border border-border-subtle bg-surface-1 p-3">
                <div className="flex items-center gap-2">
                  <Pin size={12} className="text-text-muted" />
                  <span className="text-[12px] font-medium text-text-primary">{p.author}</span>
                  <span className="text-[11px] text-text-muted">· {p.time}</span>
                </div>
                <p className="mt-1.5 text-[12px] leading-relaxed text-text-secondary">{p.text}</p>
              </div>
            ))}
          </div>
        </ScrollArea>
      </TabsContent>
    </Tabs>
  );
}

// ---------------------------------------------------------------------------
// Main shell — chat + side panel composition
// ---------------------------------------------------------------------------

interface ChatShellProps {
  panelOpen: boolean;
  onTogglePanel: () => void;
  initialTab?: PanelTabValue;
}

function ChatShell({ panelOpen, onTogglePanel, initialTab = "artifacts" }: ChatShellProps) {
  return (
    <div className="flex h-full flex-col">
      <ChannelHeader
        name="#design-review"
        description="Cross-functional design reviews and agent outputs"
        memberCount={members.length}
        panelOpen={panelOpen}
        onTogglePanel={onTogglePanel}
      />
      <SplitView className="flex-1 overflow-hidden">
        <ResizablePanel className="flex min-w-[360px] flex-col">
          <MessageList />
          <Composer />
        </ResizablePanel>
        <ResizablePanel
          size={360}
          collapsed={!panelOpen}
          className="transition-[width] duration-[200ms] ease-[cubic-bezier(0.2,0,0,1)]"
        >
          <DetailPanel width="100%" className="h-full">
            <DetailPanelHeader>
              <div className="min-w-0 flex-1">
                <DetailPanelTitle>#design-review</DetailPanelTitle>
                <p className="mt-0.5 text-[11px] text-text-muted">
                  Shared context — artifacts, members, files, pinned
                </p>
              </div>
              <DetailPanelCloseButton onClick={onTogglePanel}>
                <X size={14} />
              </DetailPanelCloseButton>
            </DetailPanelHeader>
            <DetailPanelContent className="flex min-h-0 flex-col">
              <SidePanelContent initialTab={initialTab} />
            </DetailPanelContent>
          </DetailPanel>
        </ResizablePanel>
      </SplitView>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Stories
// ---------------------------------------------------------------------------

export const Closed: Story = {
  name: "Closed · baseline",
  render: () => (
    <div className="flex min-h-screen items-start justify-center bg-surface-2 p-6">
      <WindowFrame label="Panel closed" sublabel="Message list uses the full width">
        <ChatShell panelOpen={false} onTogglePanel={() => {}} />
      </WindowFrame>
    </div>
  ),
};

export const OpenArtifacts: Story = {
  name: "Open · 产物 (Artifacts)",
  render: () => (
    <div className="flex min-h-screen items-start justify-center bg-surface-2 p-6">
      <WindowFrame
        label="Panel open · 产物"
        sublabel="Messages compressed to 664px, panel 360px inline"
      >
        <ChatShell panelOpen onTogglePanel={() => {}} initialTab="artifacts" />
      </WindowFrame>
    </div>
  ),
};

export const OpenMembers: Story = {
  name: "Open · 成员 (Members)",
  render: () => (
    <div className="flex min-h-screen items-start justify-center bg-surface-2 p-6">
      <WindowFrame label="Panel open · 成员" sublabel="Humans and agents grouped, status-dotted">
        <ChatShell panelOpen onTogglePanel={() => {}} initialTab="members" />
      </WindowFrame>
    </div>
  ),
};

export const OpenFiles: Story = {
  name: "Open · 文件 (Files)",
  render: () => (
    <div className="flex min-h-screen items-start justify-center bg-surface-2 p-6">
      <WindowFrame label="Panel open · 文件" sublabel="Searchable, reuses FileAttachment primitive">
        <ChatShell panelOpen onTogglePanel={() => {}} initialTab="files" />
      </WindowFrame>
    </div>
  ),
};

export const OpenPinned: Story = {
  name: "Open · 置顶 (Pinned)",
  render: () => (
    <div className="flex min-h-screen items-start justify-center bg-surface-2 p-6">
      <WindowFrame label="Panel open · 置顶" sublabel="Pinned messages with author + timestamp">
        <ChatShell panelOpen onTogglePanel={() => {}} initialTab="pinned" />
      </WindowFrame>
    </div>
  ),
};

function InteractiveShell() {
  const [open, setOpen] = useState(true);
  const [tab, setTab] = useState<PanelTabValue>("artifacts");
  return (
    <div className="flex min-h-screen flex-col items-center gap-4 bg-surface-2 p-6">
      <div className="flex items-center gap-2">
        <Button
          size="sm"
          variant={open ? "outline" : "default"}
          onClick={() => setOpen((v) => !v)}
          leadingIcon={open ? <PanelRightClose size={14} /> : <PanelRightOpen size={14} />}
        >
          {open ? "Close panel" : "Open panel"}
        </Button>
        <div className="flex items-center gap-1 rounded-md border border-border bg-surface-1 p-0.5">
          {PANEL_TABS.map((t) => (
            <button
              key={t.value}
              type="button"
              onClick={() => {
                setTab(t.value);
                setOpen(true);
              }}
              className={cn(
                "rounded px-2 py-1 text-[11px] font-medium transition-colors",
                tab === t.value
                  ? "bg-surface-0 text-text-heading shadow-sm"
                  : "text-text-secondary hover:text-text-primary",
              )}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>
      <WindowFrame
        label="Transition"
        sublabel="200ms ease-standard · no overlay · message list pushes"
      >
        <ChatShell panelOpen={open} onTogglePanel={() => setOpen((v) => !v)} initialTab={tab} />
      </WindowFrame>
    </div>
  );
}

export const Transition: Story = {
  name: "Transition · interactive",
  render: () => <InteractiveShell />,
};

export const Rationale: Story = {
  name: "Rationale",
  render: () => (
    <div className="min-h-screen bg-surface-2 p-10">
      <div className="mx-auto max-w-[720px] rounded-xl border border-border-subtle bg-surface-0 p-8 shadow-sm">
        <h1 className="text-[20px] font-semibold text-text-heading">
          Why an inline side panel, not an overlay?
        </h1>
        <p className="mt-2 text-[13px] text-text-secondary">
          For a group chat with agents in the loop, the side panel is a second workspace — not a
          transient drawer. Users keep it open while reading messages, reference artifacts, and
          check who's online. An overlay would block the message list and force users to
          close/reopen repeatedly. An inline panel participates in layout: the message list
          compresses, stays interactive, and no backdrop is needed.
        </p>

        <h2 className="mt-6 text-[15px] font-semibold text-text-heading">Tab rationale</h2>
        <ul className="mt-2 space-y-2 text-[13px] text-text-secondary">
          <li>
            <strong className="text-text-primary">产物 (Artifacts)</strong> — canvas, code, docs,
            videos produced during the conversation. This is the primary value-add tab because AI
            collaboration generates artifacts constantly.
          </li>
          <li>
            <strong className="text-text-primary">成员 (Members)</strong> — humans first, agents
            second. Each row surfaces role + status to disambiguate "who's here" versus "who's on
            call".
          </li>
          <li>
            <strong className="text-text-primary">文件 (Files)</strong> — reuses the
            <code className="rounded bg-surface-2 px-1.5 py-0.5 font-mono text-[12px]">
              FileAttachment
            </code>
            primitive. Searchable, scoped to the channel.
          </li>
          <li>
            <strong className="text-text-primary">置顶 (Pinned)</strong> — channel ground rules,
            onboarding notes, standing announcements. Read-mostly.
          </li>
        </ul>

        <h2 className="mt-6 text-[15px] font-semibold text-text-heading">Interaction rules</h2>
        <ul className="mt-2 space-y-2 text-[13px] text-text-secondary">
          <li>Open/close via the toolbar icon on the right side of the channel header.</li>
          <li>
            Width animates on open/close (200ms,{" "}
            <code className="rounded bg-surface-2 px-1.5 py-0.5 font-mono text-[12px]">
              --ease-standard
            </code>
            ). Content pushes, never overlays.
          </li>
          <li>Panel state is per-channel and per-device; default is remembered.</li>
          <li>Tab state is also per-channel — returning to a channel restores last-viewed tab.</li>
          <li>Minimum message list width is 360px; below that the panel force-closes.</li>
        </ul>

        <h2 className="mt-6 text-[15px] font-semibold text-text-heading">Follow-up</h2>
        <p className="mt-2 text-[13px] text-text-secondary">
          After design review, graduate the composition into an{" "}
          <code className="rounded bg-surface-2 px-1.5 py-0.5 font-mono text-[12px]">
            apps/slark
          </code>{" "}
          panel in the chat view. The primitives used here (
          <code className="rounded bg-surface-2 px-1.5 py-0.5 font-mono text-[12px]">
            SplitView
          </code>
          ,{" "}
          <code className="rounded bg-surface-2 px-1.5 py-0.5 font-mono text-[12px]">
            ResizablePanel
          </code>
          ,{" "}
          <code className="rounded bg-surface-2 px-1.5 py-0.5 font-mono text-[12px]">
            DetailPanel
          </code>
          , <code className="rounded bg-surface-2 px-1.5 py-0.5 font-mono text-[12px]">Tabs</code>)
          are already shipped in{" "}
          <code className="rounded bg-surface-2 px-1.5 py-0.5 font-mono text-[12px]">
            @nexu-design/ui-web
          </code>
          ; this PR adds no new primitives.
        </p>

        <div className="mt-6 flex items-center gap-4 border-t border-border-subtle pt-4">
          <TextLink href="#" className="inline-flex items-center gap-1">
            Related: Feishu / Lark side panel <ExternalLink size={12} />
          </TextLink>
          <TextLink href="#" className="inline-flex items-center gap-1">
            Related: Slack right rail <ExternalLink size={12} />
          </TextLink>
        </div>
      </div>
    </div>
  ),
};
