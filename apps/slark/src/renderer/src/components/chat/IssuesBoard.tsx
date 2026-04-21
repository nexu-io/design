import {
  Bot,
  Circle,
  CircleCheck,
  CircleDashed,
  CircleDot,
  CircleSlash,
  Eye,
} from "lucide-react";
import { cn } from "@nexu-design/ui-web";
import { useTopicsStore } from "@/stores/topics";
import { useAgentsStore } from "@/stores/agents";
import type { IssueStatus, Topic } from "@/types";

const STATUS_META: Record<
  IssueStatus,
  { label: string; icon: typeof CircleDot; dotClass: string }
> = {
  todo: { label: "Todo", icon: Circle, dotClass: "text-text-muted" },
  in_progress: { label: "In progress", icon: CircleDashed, dotClass: "text-warning" },
  in_review: { label: "In review", icon: Eye, dotClass: "text-info" },
  blocked: { label: "Blocked", icon: CircleSlash, dotClass: "text-danger" },
  done: { label: "Done", icon: CircleCheck, dotClass: "text-success" },
};

const COLUMN_ORDER: IssueStatus[] = ["todo", "in_progress", "in_review", "blocked", "done"];

function formatRelative(ts: number): string {
  const diff = Date.now() - ts;
  const min = Math.floor(diff / 60000);
  if (min < 1) return "just now";
  if (min < 60) return `${min}m`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr}h`;
  const day = Math.floor(hr / 24);
  if (day < 7) return `${day}d`;
  return new Date(ts).toLocaleDateString();
}

interface IssuesBoardProps {
  issues: Topic[];
}

export function IssuesBoard({ issues }: IssuesBoardProps): React.ReactElement {
  const topicMessages = useTopicsStore((s) => s.messages);
  const setActiveTopic = useTopicsStore((s) => s.setActiveTopic);
  const agents = useAgentsStore((s) => s.agents);

  const grouped: Record<IssueStatus, Topic[]> = {
    todo: [],
    in_progress: [],
    in_review: [],
    blocked: [],
    done: [],
  };
  for (const topic of issues) {
    if (topic.issue) grouped[topic.issue.status].push(topic);
  }

  return (
    <div className="flex-1 overflow-x-auto overflow-y-hidden">
      <div className="flex h-full min-w-max gap-3 px-3 py-3">
        {COLUMN_ORDER.map((status) => {
          const meta = STATUS_META[status];
          const Icon = meta.icon;
          const column = grouped[status];
          return (
            <div
              key={status}
              className="flex h-full w-[260px] shrink-0 flex-col rounded-lg bg-surface-2/40"
            >
              <div className="flex shrink-0 items-center gap-1.5 px-3 py-2">
                <Icon className={cn("size-3.5", meta.dotClass)} />
                <span className="text-[12px] font-semibold text-text-primary">{meta.label}</span>
                <span className="text-[11px] text-text-tertiary">{column.length}</span>
              </div>
              <div className="flex-1 space-y-2 overflow-y-auto px-2 pb-2">
                {column.length === 0 ? (
                  <div className="flex h-20 items-center justify-center text-[11px] text-text-tertiary">
                    Empty
                  </div>
                ) : (
                  column.map((topic) => {
                    const issue = topic.issue;
                    if (!issue) return null;
                    const assignee = issue.assigneeAgentId
                      ? agents.find((a) => a.id === issue.assigneeAgentId)
                      : undefined;
                    const replies = topicMessages[topic.id]?.length ?? 0;
                    return (
                      <button
                        key={topic.id}
                        type="button"
                        onClick={() => setActiveTopic(topic.id)}
                        className="flex w-full flex-col gap-2 rounded-md border border-border-subtle bg-surface-0 p-2.5 text-left transition-colors hover:border-border hover:bg-surface-1"
                      >
                        <div className="line-clamp-2 text-[12.5px] font-medium leading-snug text-text-primary">
                          {topic.title}
                        </div>
                        <div className="flex items-center gap-2 text-[11px] text-text-muted">
                          {assignee ? (
                            <span className="inline-flex items-center gap-1">
                              <Bot className="size-3" />
                              <span className="truncate max-w-[80px]">{assignee.name}</span>
                            </span>
                          ) : null}
                          {assignee ? <span>·</span> : null}
                          <span>{replies} repl{replies === 1 ? "y" : "ies"}</span>
                          <span className="ml-auto">{formatRelative(issue.createdAt)}</span>
                        </div>
                      </button>
                    );
                  })
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
