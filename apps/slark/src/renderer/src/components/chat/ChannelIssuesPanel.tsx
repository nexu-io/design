import { useMemo, useState } from "react";
import {
  Bot,
  Circle,
  CircleCheck,
  CircleDashed,
  type CircleDot,
  CircleSlash,
  Columns3,
  Eye,
  Inbox,
  Rows3,
} from "lucide-react";
import { cn } from "@nexu-design/ui-web";
import { useTopicsStore } from "@/stores/topics";
import { resolveRef } from "@/mock/data";
import type { IssueStatus, Topic } from "@/types";
import { IssuesBoard } from "./IssuesBoard";

const STATUS_META: Record<
  IssueStatus,
  { label: string; icon: typeof CircleDot; dotClass: string; textClass: string }
> = {
  todo: {
    label: "Todo",
    icon: Circle,
    dotClass: "text-text-muted",
    textClass: "text-text-muted",
  },
  in_progress: {
    label: "In progress",
    icon: CircleDashed,
    dotClass: "text-warning",
    textClass: "text-warning",
  },
  in_review: {
    label: "In review",
    icon: Eye,
    dotClass: "text-info",
    textClass: "text-info",
  },
  blocked: {
    label: "Blocked",
    icon: CircleSlash,
    dotClass: "text-danger",
    textClass: "text-danger",
  },
  done: {
    label: "Done",
    icon: CircleCheck,
    dotClass: "text-success",
    textClass: "text-success",
  },
};

type Filter = IssueStatus | "all";
const FILTER_ORDER: Filter[] = ["all", "todo", "in_progress", "in_review", "blocked", "done"];

type ViewMode = "table" | "board";

function formatRelative(ts: number): string {
  const diff = Date.now() - ts;
  const min = Math.floor(diff / 60000);
  if (min < 1) return "just now";
  if (min < 60) return `${min}m ago`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr}h ago`;
  const day = Math.floor(hr / 24);
  if (day < 7) return `${day}d ago`;
  return new Date(ts).toLocaleDateString();
}

interface ChannelIssuesPanelProps {
  channelId: string;
}

export function ChannelIssuesPanel({ channelId }: ChannelIssuesPanelProps): React.ReactElement {
  const topics = useTopicsStore((s) => s.topics);
  const topicMessages = useTopicsStore((s) => s.messages);
  const setActiveTopic = useTopicsStore((s) => s.setActiveTopic);
  const [filter, setFilter] = useState<Filter>("all");
  const [view, setView] = useState<ViewMode>("table");

  const issues = useMemo<Topic[]>(
    () =>
      Object.values(topics)
        .filter((t): t is Topic => !!t.issue && t.rootChannelId === channelId)
        .sort((a, b) => (b.issue?.createdAt ?? 0) - (a.issue?.createdAt ?? 0)),
    [topics, channelId],
  );

  const counts = useMemo(() => {
    const base: Record<Filter, number> = {
      all: issues.length,
      todo: 0,
      in_progress: 0,
      in_review: 0,
      blocked: 0,
      done: 0,
    };
    for (const t of issues) {
      if (t.issue) base[t.issue.status] += 1;
    }
    return base;
  }, [issues]);

  const filtered = useMemo(
    () => (filter === "all" ? issues : issues.filter((t) => t.issue?.status === filter)),
    [issues, filter],
  );

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <div className="flex items-center gap-1 border-b border-border-subtle px-3 py-2">
        {FILTER_ORDER.map((f) => {
          const isActive = filter === f;
          const label = f === "all" ? "All" : STATUS_META[f].label;
          const count = counts[f];
          return (
            <button
              key={f}
              type="button"
              onClick={() => setFilter(f)}
              className={cn(
                "inline-flex h-7 items-center gap-1.5 rounded-md px-2.5 text-[12px] font-medium transition-colors",
                isActive
                  ? "bg-surface-2 text-text-primary"
                  : "text-text-muted hover:bg-surface-2/60 hover:text-text-primary",
              )}
            >
              {label}
              <span className="text-[11px] text-text-tertiary">{count}</span>
            </button>
          );
        })}
        <div className="ml-auto inline-flex items-center gap-0.5 rounded-md bg-surface-2/60 p-0.5">
          <ViewToggle
            icon={<Rows3 className="size-3.5" />}
            active={view === "table"}
            label="Table"
            onClick={() => setView("table")}
          />
          <ViewToggle
            icon={<Columns3 className="size-3.5" />}
            active={view === "board"}
            label="Board"
            onClick={() => setView("board")}
          />
        </div>
      </div>

      {view === "board" ? (
        <IssuesBoard issues={filtered} />
      ) : filtered.length === 0 ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-2 text-text-muted">
          <Inbox className="size-8 opacity-40" />
          <div className="text-sm">
            No issues{" "}
            {filter !== "all" ? `in ${STATUS_META[filter].label.toLowerCase()}` : "in this channel"}
          </div>
          <div className="text-[12px] text-text-tertiary">
            Hover any message and click the issue icon to create one.
          </div>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto">
          <div className="sticky top-0 z-10 grid grid-cols-[24px_1fr_120px_140px_90px_90px] items-center gap-3 border-b border-border-subtle bg-background px-4 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-text-tertiary">
            <span />
            <span>Title</span>
            <span>Status</span>
            <span>Assignee</span>
            <span className="text-right">Replies</span>
            <span className="text-right">Updated</span>
          </div>
          {filtered.map((topic) => {
            const issue = topic.issue;
            if (!issue) return null;
            const meta = STATUS_META[issue.status];
            const Icon = meta.icon;
            const assignee = issue.assignee ? resolveRef(issue.assignee) : undefined;
            const replies = topicMessages[topic.id]?.length ?? 0;
            return (
              <button
                key={topic.id}
                type="button"
                onClick={() => setActiveTopic(topic.id)}
                className="grid w-full grid-cols-[24px_1fr_120px_140px_90px_90px] items-center gap-3 border-b border-border-subtle px-4 py-2 text-left transition-colors hover:bg-surface-2/60"
              >
                <Icon className={cn("size-4 shrink-0", meta.dotClass)} />
                <span className="truncate text-[13px] font-medium text-text-primary">
                  {topic.title}
                </span>
                <span className={cn("truncate text-[12px] font-medium", meta.textClass)}>
                  {meta.label}
                </span>
                <span className="truncate text-[12px] text-text-muted">
                  {assignee ? (
                    <span className="inline-flex items-center gap-1">
                      {assignee.isAgent ? (
                        <Bot className="size-3 shrink-0 text-text-muted" />
                      ) : (
                        <img
                          src={assignee.avatar}
                          alt=""
                          className="size-3.5 shrink-0 rounded-full object-cover"
                        />
                      )}
                      <span className="truncate">{assignee.name}</span>
                    </span>
                  ) : (
                    <span className="text-text-tertiary">—</span>
                  )}
                </span>
                <span className="text-right text-[12px] tabular-nums text-text-muted">
                  {replies}
                </span>
                <span className="text-right text-[12px] tabular-nums text-text-muted">
                  {formatRelative(issue.createdAt)}
                </span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

interface ViewToggleProps {
  icon: React.ReactNode;
  active: boolean;
  label: string;
  onClick: () => void;
}

function ViewToggle({ icon, active, label, onClick }: ViewToggleProps): React.ReactElement {
  return (
    <button
      type="button"
      onClick={onClick}
      title={label}
      aria-label={label}
      className={cn(
        "inline-flex h-6 items-center justify-center rounded px-1.5 transition-colors",
        active
          ? "bg-surface-0 text-text-primary shadow-sm"
          : "text-text-muted hover:text-text-primary",
      )}
    >
      {icon}
    </button>
  );
}
