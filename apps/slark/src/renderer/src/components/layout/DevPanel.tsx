import { Button, Switch, cn } from "@nexu-design/ui-web";
import {
  ChevronDown,
  ChevronUp,
  CircleDot,
  GripVertical,
  LogIn,
  LogOut,
  Play,
  RotateCcw,
  Settings2,
  Sparkles,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { DEMO_META, type DemoId, useDemoPlayer } from "@/demo/player";
import { mockRuntimes, mockUsers } from "@/mock/data";
import { useMemoriesStore } from "@/stores/memories";
import { useRuntimesStore } from "@/stores/runtimes";
import { useTopicsStore } from "@/stores/topics";
import { useWorkspaceStore } from "@/stores/workspace";

type AppState = "welcome" | "onboarding" | "app";

const POS_STORAGE_KEY = "nexu.devPanel.pos";
const PANEL_WIDTH = 280;
const PANEL_HEIGHT_COLLAPSED = 36;

function loadInitialPos(): { x: number; y: number } {
  try {
    const raw = localStorage.getItem(POS_STORAGE_KEY);
    if (raw) {
      const p = JSON.parse(raw);
      if (typeof p.x === "number" && typeof p.y === "number") return p;
    }
  } catch {
    /* ignore */
  }
  return {
    x: window.innerWidth - PANEL_WIDTH - 16,
    y: window.innerHeight - PANEL_HEIGHT_COLLAPSED - 16,
  };
}

/** Small uppercase section label. */
function SectionLabel({ children }: { children: React.ReactNode }): React.ReactElement {
  return (
    <div className="px-3 pt-3 pb-1.5 text-[10px] font-medium uppercase tracking-[0.08em] text-muted-foreground">
      {children}
    </div>
  );
}

/** Row: icon + text on the left, slot on the right (switch / action / count). */
function ControlRow({
  icon: Icon,
  label,
  children,
  title,
}: {
  icon?: React.ElementType;
  label: string;
  children?: React.ReactNode;
  title?: string;
}): React.ReactElement {
  return (
    <div title={title} className="flex h-8 items-center gap-2 px-3 text-[12px] text-foreground/85">
      {Icon ? <Icon className="h-3.5 w-3.5 shrink-0 text-muted-foreground" /> : null}
      <span className="flex-1 truncate">{label}</span>
      {children}
    </div>
  );
}

/** Small ghost inline button used on the right of a ControlRow. */
function RowAction({
  onClick,
  children,
  tone = "neutral",
  disabled,
}: {
  onClick?: () => void;
  children: React.ReactNode;
  tone?: "neutral" | "danger";
  disabled?: boolean;
}): React.ReactElement {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "inline-flex h-6 items-center gap-1 rounded-md px-2 text-[11px] font-medium transition-colors",
        "disabled:cursor-not-allowed disabled:opacity-40",
        tone === "danger"
          ? "text-danger hover:bg-danger-subtle"
          : "text-muted-foreground hover:bg-accent hover:text-foreground",
      )}
    >
      {children}
    </button>
  );
}

export function DevPanel(): React.ReactElement {
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState(loadInitialPos);
  const dragStateRef = useRef<{ dx: number; dy: number } | null>(null);
  const [dragging, setDragging] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem(POS_STORAGE_KEY, JSON.stringify(pos));
    } catch {
      /* ignore */
    }
  }, [pos]);

  const handleDragPointerDown = (e: React.PointerEvent): void => {
    if ((e.target as HTMLElement).closest("button[data-no-drag]")) return;
    dragStateRef.current = { dx: e.clientX - pos.x, dy: e.clientY - pos.y };
    setDragging(true);
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handleDragPointerMove = (e: React.PointerEvent): void => {
    const st = dragStateRef.current;
    if (!st) return;
    const maxX = window.innerWidth - 40;
    const maxY = window.innerHeight - 40;
    const x = Math.max(-PANEL_WIDTH + 60, Math.min(maxX, e.clientX - st.dx));
    const y = Math.max(0, Math.min(maxY, e.clientY - st.dy));
    setPos({ x, y });
  };

  const handleDragPointerUp = (e: React.PointerEvent): void => {
    dragStateRef.current = null;
    setDragging(false);
    try {
      (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {
      /* ignore */
    }
  };

  const navigate = useNavigate();
  const location = useLocation();
  const {
    isOnboarded,
    currentUserId,
    setCurrentUser,
    completeOnboarding,
    switchWorkspace,
    reset,
    workspaces,
    addWorkspace,
  } = useWorkspaceStore();
  const workspacesAtLimit = workspaces.length >= 5;
  const fillWorkspacesToLimit = (): void => {
    const missing = 5 - workspaces.length;
    for (let i = 0; i < missing; i++) {
      const idx = workspaces.length + i + 1;
      addWorkspace({
        id: `ws-dev-${idx}-${Date.now()}`,
        name: `Dev Workspace ${idx}`,
        avatar: `https://api.dicebear.com/9.x/identicon/svg?seed=dev-${idx}`,
        createdAt: Date.now(),
      });
    }
  };

  const {
    runtimes,
    setRuntimes,
    devSimulateNone,
    setDevSimulateNone,
    devSimulateNoDetection,
    setDevSimulateNoDetection,
  } = useRuntimesStore();
  const hasRuntimes = runtimes.length > 0 && !devSimulateNone;

  const seedDemoIssues = useTopicsStore((s) => s.seedDemoIssues);
  const clearDemoIssues = useTopicsStore((s) => s.clearDemoIssues);
  const demoIssueCount = useTopicsStore(
    (s) => Object.keys(s.topics).filter((id) => id.startsWith("tp-demo-")).length,
  );
  const hasDemoIssues = demoIssueCount > 0;

  const demoPlaying = useDemoPlayer((s) => s.playing);
  const playDemo = useDemoPlayer((s) => s.play);
  const stopDemo = useDemoPlayer((s) => s.stop);
  const demoIds: DemoId[] = ["uc01", "uc02", "uc03"];

  const memoriesCount = useMemoriesStore((s) => s.memories.length);
  const keywordTriggerEnabled = useMemoriesStore((s) => s.keywordTriggerEnabled);
  const setKeywordTriggerEnabled = useMemoriesStore((s) => s.setKeywordTriggerEnabled);
  const clearAllMemories = useMemoriesStore((s) => s.clearAllMemories);
  const resetMemoriesToSeed = useMemoriesStore((s) => s.resetToSeed);
  const hasMemories = memoriesCount > 0;

  const currentState: AppState = !isOnboarded
    ? location.pathname.startsWith("/onboarding")
      ? "onboarding"
      : "welcome"
    : "app";

  const jumpTo = (state: AppState): void => {
    switch (state) {
      case "welcome":
        reset();
        navigate("/");
        break;
      case "onboarding":
        reset();
        navigate("/onboarding/workspace");
        break;
      case "app":
        switchWorkspace("ws-1");
        completeOnboarding();
        navigate("/chat");
        break;
    }
  };

  const states: { id: AppState; label: string; icon: React.ElementType }[] = [
    { id: "welcome", label: "Logged out", icon: LogOut },
    { id: "onboarding", label: "Onboarding", icon: LogIn },
    { id: "app", label: "Main app", icon: Settings2 },
  ];

  if (!open) {
    return (
      <div
        onPointerDown={handleDragPointerDown}
        onPointerMove={handleDragPointerMove}
        onPointerUp={handleDragPointerUp}
        onPointerCancel={handleDragPointerUp}
        style={{ left: pos.x, top: pos.y }}
        className={cn(
          "fixed z-[999] flex h-9 items-center gap-1.5 rounded-lg bg-nexu-primary/90 pl-2 pr-3 text-xs font-medium text-white shadow-lg hover:bg-nexu-primary transition-colors select-none",
          dragging ? "cursor-grabbing" : "cursor-grab",
        )}
      >
        <GripVertical className="h-3.5 w-3.5 opacity-70" />
        <Button
          type="button"
          variant="ghost"
          size="inline"
          data-no-drag
          onClick={() => !dragging && setOpen(true)}
          className="flex items-center gap-1.5"
        >
          <Settings2 className="h-3.5 w-3.5" />
          Dev
          <ChevronUp className="h-3 w-3" />
        </Button>
      </div>
    );
  }

  return (
    <div
      style={{ left: pos.x, top: pos.y, width: PANEL_WIDTH }}
      className="fixed z-[999] overflow-hidden rounded-xl border border-border bg-card shadow-2xl"
    >
      {/* Header — slim drag strip, neutral bg, close on the right. */}
      <div
        onPointerDown={handleDragPointerDown}
        onPointerMove={handleDragPointerMove}
        onPointerUp={handleDragPointerUp}
        onPointerCancel={handleDragPointerUp}
        className={cn(
          "flex h-9 items-center gap-1.5 border-b border-border bg-surface-1 pl-2.5 pr-1 select-none",
          dragging ? "cursor-grabbing" : "cursor-grab",
        )}
      >
        <GripVertical className="h-3.5 w-3.5 text-muted-foreground/60" />
        <span className="flex-1 text-[11.5px] font-semibold tracking-wide text-foreground">
          Dev
        </span>
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          data-no-drag
          onClick={() => setOpen(false)}
          className="h-6 w-6 text-muted-foreground hover:text-foreground"
        >
          <ChevronDown className="h-3.5 w-3.5" />
        </Button>
      </div>

      <div className="max-h-[min(560px,80vh)] divide-y divide-border overflow-y-auto">
        {/* App state — segmented control */}
        <div className="pb-2">
          <SectionLabel>App state</SectionLabel>
          <div className="mx-3 flex items-center rounded-lg border border-border bg-surface-1 p-0.5">
            {states.map(({ id, label, icon: Icon }) => {
              const isActive = currentState === id;
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => jumpTo(id)}
                  className={cn(
                    "flex h-6 flex-1 items-center justify-center gap-1 rounded-md text-[11px] font-medium transition-colors",
                    isActive
                      ? "bg-card text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  <Icon className="h-3 w-3" />
                  {label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Auto demos */}
        <div className="pb-2">
          <SectionLabel>Auto demo</SectionLabel>
          <div className="flex flex-col gap-1 px-2">
            {demoIds.map((id) => {
              const meta = DEMO_META[id];
              const active = demoPlaying === id;
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => {
                    if (active) {
                      stopDemo();
                    } else {
                      playDemo(id);
                    }
                  }}
                  className={cn(
                    "group flex items-center gap-2 rounded-md px-2 py-1.5 text-left text-[11.5px] transition-colors",
                    active
                      ? "bg-nexu-primary/10 text-foreground"
                      : "text-foreground/85 hover:bg-accent",
                  )}
                >
                  <span
                    className={cn(
                      "inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full",
                      active
                        ? "bg-nexu-primary text-white"
                        : "bg-surface-2 text-muted-foreground group-hover:bg-nexu-primary/80 group-hover:text-white",
                    )}
                  >
                    <Play className="h-2.5 w-2.5" />
                  </span>
                  <span className="flex flex-1 flex-col">
                    <span className="font-medium leading-tight">{meta.title}</span>
                    <span className="text-[10px] text-muted-foreground leading-tight">
                      {meta.subtitle}
                    </span>
                  </span>
                  <span className="text-[10px] text-muted-foreground">
                    {active ? "Stop" : `~${meta.estSeconds}s`}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Current user — horizontal avatar row */}
        <div className="pb-2">
          <SectionLabel>Current user</SectionLabel>
          <div className="flex items-center gap-1.5 px-3">
            {mockUsers.map((user) => {
              const isActive = currentUserId === user.id;
              const isOwner = user.role === "owner";
              return (
                <button
                  key={user.id}
                  type="button"
                  onClick={() => setCurrentUser(user.id)}
                  title={`${user.name}${isOwner ? " · owner" : ""}`}
                  className={cn(
                    "relative h-8 w-8 shrink-0 overflow-hidden rounded-full transition-all",
                    isActive
                      ? "ring-2 ring-nexu-primary ring-offset-2 ring-offset-card"
                      : "opacity-70 hover:opacity-100",
                  )}
                >
                  <img src={user.avatar} alt={user.name} className="h-full w-full object-cover" />
                  {isOwner ? (
                    <span
                      aria-hidden
                      className="absolute -right-0.5 -bottom-0.5 inline-flex h-3 w-3 items-center justify-center rounded-full bg-nexu-primary ring-2 ring-card"
                    >
                      <Sparkles className="h-2 w-2 text-white" />
                    </span>
                  ) : null}
                </button>
              );
            })}
          </div>
        </div>

        {/* Runtimes */}
        <div className="py-1">
          <SectionLabel>Runtimes</SectionLabel>
          <ControlRow label="Simulate no runtimes">
            <Switch
              size="sm"
              checked={!hasRuntimes}
              onCheckedChange={(checked) => {
                if (checked) {
                  setRuntimes([]);
                  setDevSimulateNone(true);
                } else {
                  setDevSimulateNone(false);
                  setRuntimes(mockRuntimes);
                }
              }}
              data-no-drag
            />
          </ControlRow>
          <ControlRow label="Simulate no detection">
            <Switch
              size="sm"
              checked={devSimulateNoDetection}
              onCheckedChange={setDevSimulateNoDetection}
              data-no-drag
            />
          </ControlRow>
        </div>

        {/* Memory */}
        <div className="py-1">
          <SectionLabel>Memory</SectionLabel>
          <ControlRow label={`Memories · ${memoriesCount}`}>
            <RowAction
              onClick={() => (hasMemories ? clearAllMemories() : resetMemoriesToSeed())}
              tone={hasMemories ? "danger" : "neutral"}
            >
              {hasMemories ? "Clear" : "Seed"}
            </RowAction>
          </ControlRow>
          <ControlRow
            label="Keyword trigger"
            title="Trigger words: 记住 / remember / 以后都 / 默认"
          >
            <Switch
              size="sm"
              checked={keywordTriggerEnabled}
              onCheckedChange={setKeywordTriggerEnabled}
              data-no-drag
            />
          </ControlRow>
        </div>

        {/* Issues */}
        <div className="py-1">
          <SectionLabel>Issues</SectionLabel>
          <ControlRow
            icon={CircleDot}
            label={`Demo issues · ${demoIssueCount}`}
            title="Seed 10 topics in #design-showcase — 2 per status"
          >
            <RowAction
              onClick={() => (hasDemoIssues ? clearDemoIssues() : seedDemoIssues())}
              tone={hasDemoIssues ? "danger" : "neutral"}
            >
              {hasDemoIssues ? "Clear" : "Seed 10"}
            </RowAction>
          </ControlRow>
        </div>

        {/* Workspaces */}
        <div className="py-1">
          <SectionLabel>Workspaces</SectionLabel>
          <ControlRow label={`Count · ${workspaces.length}/5`}>
            <RowAction onClick={fillWorkspacesToLimit} disabled={workspacesAtLimit}>
              {workspacesAtLimit ? "At limit" : "Fill"}
            </RowAction>
          </ControlRow>
        </div>

        {/* Reset — footer */}
        <div className="p-2">
          <button
            type="button"
            onClick={() => {
              reset();
              navigate("/");
            }}
            className="flex h-7 w-full items-center justify-center gap-1.5 rounded-md text-[11px] font-medium text-danger transition-colors hover:bg-danger-subtle"
          >
            <RotateCcw className="h-3 w-3" />
            Reset all state
          </button>
        </div>
      </div>
    </div>
  );
}
