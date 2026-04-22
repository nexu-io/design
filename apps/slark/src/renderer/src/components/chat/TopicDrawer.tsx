import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Button,
  ChatMessage,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Mention,
  Popover,
  PopoverContent,
  PopoverTrigger,
  cn,
} from "@nexu-design/ui-web";
import type { ChatSender } from "@nexu-design/ui-web";
import {
  Bot,
  Circle,
  CircleCheck,
  CircleDashed,
  CircleDot,
  CircleSlash,
  Eye,
  Maximize2,
  Pin,
  Smile,
  X,
  ChevronDown,
} from "lucide-react";
import { useAgentsStore } from "@/stores/agents";
import { useChatStore } from "@/stores/chat";
import { useWorkspaceStore } from "@/stores/workspace";
import { useTopicsStore } from "@/stores/topics";
import { resolveRef } from "@/mock/data";
import type { IssueStatus, MemberRef, Message, Reaction } from "@/types";
import { EmojiPicker } from "./EmojiPicker";
import { MessageInput } from "./MessageInput";
import { TopicSidePanel } from "./TopicSidePanel";

function formatClock(ts: number): string {
  return new Date(ts).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function initialsOf(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

const AGENT_ACCENTS = [
  "var(--color-brand-primary)",
  "var(--color-info)",
  "var(--color-warning)",
  "var(--color-success)",
];

function accentFor(id: string): string {
  let hash = 0;
  for (let i = 0; i < id.length; i++) hash = (hash * 31 + id.charCodeAt(i)) | 0;
  return AGENT_ACCENTS[Math.abs(hash) % AGENT_ACCENTS.length];
}

function toSender(sender: MemberRef): ChatSender | undefined {
  const resolved = resolveRef(sender);
  if (!resolved) return undefined;
  return {
    id: sender.id,
    name: resolved.name,
    avatar: resolved.avatar,
    fallback: initialsOf(resolved.name),
    isAgent: resolved.isAgent,
    accent: resolved.isAgent ? accentFor(sender.id) : undefined,
  };
}

function renderContent(content: string): React.ReactNode {
  const parts = content.split(/(@[\w-]+)/g);
  let offset = 0;
  return parts.map((part) => {
    const key = `${offset}-${part}`;
    offset += part.length;
    if (!part) return null;
    if (/^@[\w-]+$/.test(part)) {
      return <Mention key={key} name={part.slice(1)} />;
    }
    return <span key={key}>{part}</span>;
  });
}

const STATUS_META: Record<IssueStatus, { label: string; icon: typeof CircleDot; className: string }> = {
  todo: {
    label: "Todo",
    icon: Circle,
    className: "bg-surface-2 text-text-muted",
  },
  in_progress: {
    label: "In progress",
    icon: CircleDashed,
    className: "bg-warning-subtle text-warning",
  },
  in_review: {
    label: "In review",
    icon: Eye,
    className: "bg-info-subtle text-info",
  },
  blocked: {
    label: "Blocked",
    icon: CircleSlash,
    className: "bg-danger-subtle text-danger",
  },
  done: {
    label: "Done",
    icon: CircleCheck,
    className: "bg-success-subtle text-success",
  },
};

const STATUS_ORDER: IssueStatus[] = ["todo", "in_progress", "in_review", "blocked", "done"];

export function TopicDrawer({
  variant = "drawer",
}: {
  variant?: "drawer" | "main";
} = {}): React.ReactElement | null {
  const activeTopicId = useTopicsStore((s) => s.activeTopicId);
  const topic = useTopicsStore((s) => (activeTopicId ? s.topics[activeTopicId] : undefined));
  const topicMessages = useTopicsStore((s) =>
    activeTopicId ? (s.messages[activeTopicId] ?? []) : [],
  );
  const setActiveTopic = useTopicsStore((s) => s.setActiveTopic);
  const setActiveChannel = useChatStore((s) => s.setActiveChannel);
  const setPendingScrollToMessage = useChatStore((s) => s.setPendingScrollToMessage);
  const navigate = useNavigate();
  const setIssueStatus = useTopicsStore((s) => s.setIssueStatus);
  const setIssueAssignee = useTopicsStore((s) => s.setIssueAssignee);
  const markTopicRead = useTopicsStore((s) => s.markTopicRead);
  const updateTopicMessage = useTopicsStore((s) => s.updateTopicMessage);
  const agents = useAgentsStore((s) => s.agents);
  const currentUserId = useWorkspaceStore((s) => s.currentUserId) ?? "u-1";
  const [reactionPickerId, setReactionPickerId] = useState<string | null>(null);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const cancelClose = useCallback(() => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
  }, []);

  const scheduleClose = useCallback(() => {
    cancelClose();
    closeTimerRef.current = setTimeout(() => {
      setReactionPickerId(null);
      closeTimerRef.current = null;
    }, 150);
  }, [cancelClose]);

  const openPicker = useCallback(
    (id: string) => {
      cancelClose();
      setReactionPickerId(id);
    },
    [cancelClose],
  );

  useEffect(() => {
    return () => {
      if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    };
  }, []);

  const toggleTopicReaction = (msg: Message, emoji: string): void => {
    if (!activeTopicId) return;
    const existing = msg.reactions.find((r) => r.emoji === emoji);
    let next: Reaction[];
    if (existing) {
      const hasMe = existing.users.includes(currentUserId);
      const nextUsers = hasMe
        ? existing.users.filter((u) => u !== currentUserId)
        : [...existing.users, currentUserId];
      next =
        nextUsers.length === 0
          ? msg.reactions.filter((r) => r.emoji !== emoji)
          : msg.reactions.map((r) =>
              r.emoji === emoji ? { ...r, users: nextUsers } : r,
            );
    } else {
      next = [...msg.reactions, { emoji, users: [currentUserId] }];
    }
    updateTopicMessage(activeTopicId, msg.id, { reactions: next });
  };

  const rootMessage = useChatStore((s) => {
    if (!topic) return undefined;
    return s.messages[topic.rootChannelId]?.find((m) => m.id === topic.rootMessageId);
  });
  const rootChannel = useChatStore((s) =>
    topic ? s.channels.find((c) => c.id === topic.rootChannelId) : undefined,
  );

  const [statusOpen, setStatusOpen] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  const rootSender = useMemo(
    () => (rootMessage ? toSender(rootMessage.sender) : undefined),
    [rootMessage],
  );

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [topicMessages.length]);

  useEffect(() => {
    if (activeTopicId) markTopicRead(activeTopicId);
  }, [activeTopicId, topicMessages.length, markTopicRead]);

  if (!topic || !activeTopicId || !rootChannel) return null;

  const handleClose = (): void => {
    setActiveTopic(null);
    setStatusOpen(false);
  };

  const handleGoToRootChannel = (): void => {
    if (!topic) return;
    setActiveTopic(null);
    setActiveChannel(topic.rootChannelId);
    setPendingScrollToMessage(topic.rootMessageId);
    navigate(`/chat/${topic.rootChannelId}`);
  };

  const issue = topic.issue;
  const status = issue?.status;
  const statusMeta = status ? STATUS_META[status] : undefined;
  const StatusIcon = statusMeta?.icon;
  const assignee = issue?.assigneeAgentId
    ? agents.find((a) => a.id === issue.assigneeAgentId)
    : undefined;

  return (
    <>
    <aside
      className={cn(
        "flex h-full flex-col bg-background",
        variant === "drawer"
          ? "w-[420px] shrink-0 border-l border-border"
          : "min-w-0 flex-1",
      )}
    >
      <div
        className={cn(
          "flex h-[52px] shrink-0 items-center gap-2 border-b border-border px-3",
          variant === "main" && "drag-region pt-2",
        )}
      >
        <div className="flex min-w-0 flex-1 items-center gap-2">
          {issue ? (
            <CircleDot className="size-4 shrink-0 text-brand-primary" />
          ) : (
            <Pin className="size-4 shrink-0 text-text-muted" />
          )}
          <div className="min-w-0">
            <div className="truncate text-[13px] font-semibold">{topic.title}</div>
            <div className="truncate text-[11px] text-text-muted">
              {issue ? "Issue" : "Topic"}
              {rootChannel.type === "channel" ? (
                <>
                  {" · 来自 "}
                  <button
                    type="button"
                    onClick={handleGoToRootChannel}
                    className="no-drag text-brand-primary hover:underline"
                    title="Jump to source message"
                  >
                    #{rootChannel.name}
                  </button>
                </>
              ) : null}
              {" · "}
              {topicMessages.length} repl{topicMessages.length === 1 ? "y" : "ies"}
            </div>
          </div>
        </div>
        <div className={cn("flex items-center gap-2", variant === "main" && "no-drag")}>
        {issue ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                className="inline-flex h-7 items-center gap-1 rounded-md bg-surface-2 px-2 text-[11px] font-medium text-text-primary transition-opacity hover:opacity-80"
                title="Assignee"
              >
                <Bot className="size-3" />
                {assignee ? assignee.name : "Unassigned"}
                <ChevronDown className="size-3 opacity-60" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="max-h-72 w-48 overflow-y-auto">
              <DropdownMenuItem
                onClick={() => setIssueAssignee(activeTopicId, undefined)}
                className={cn(!issue.assigneeAgentId && "font-semibold")}
              >
                <Bot className="size-3.5 text-text-muted" />
                Unassigned
              </DropdownMenuItem>
              {agents.length > 0 ? <DropdownMenuSeparator /> : null}
              {agents.map((a) => (
                <DropdownMenuItem
                  key={a.id}
                  onClick={() => setIssueAssignee(activeTopicId, a.id)}
                  className={cn(a.id === issue.assigneeAgentId && "font-semibold")}
                >
                  <img src={a.avatar} alt="" className="size-4 rounded-full" />
                  {a.name}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        ) : null}
        {issue && statusMeta && StatusIcon ? (
          <div className="relative">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setStatusOpen((v) => !v)}
              className={cn(
                "h-7 gap-1 rounded-md px-2 text-[11px] font-semibold",
                statusMeta.className,
              )}
            >
              <StatusIcon className="size-3" />
              {statusMeta.label}
              <ChevronDown className="size-3" />
            </Button>
            {statusOpen && (
              <div className="absolute right-0 top-8 z-20 w-36 rounded-md border border-border bg-surface-0 p-1 shadow-lg">
                {STATUS_ORDER.map((s) => {
                  const meta = STATUS_META[s];
                  const Icon = meta.icon;
                  return (
                    <button
                      key={s}
                      type="button"
                      className={cn(
                        "flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-left text-[12px] hover:bg-surface-2",
                        s === status && "font-semibold",
                      )}
                      onClick={() => {
                        setIssueStatus(activeTopicId, s);
                        setStatusOpen(false);
                      }}
                    >
                      <Icon className="size-3.5" />
                      {meta.label}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        ) : null}
        {variant === "drawer" ? (
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            onClick={() => setActiveTopic(activeTopicId, "main")}
            aria-label="Open topic detail"
            title="Open topic detail"
          >
            <Maximize2 className="size-4" />
          </Button>
        ) : null}
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          onClick={handleClose}
          aria-label="Close topic"
          title="Close topic"
        >
          <X className="size-4" />
        </Button>
        </div>
      </div>

      {rootMessage && rootSender ? (
        <div className="border-b border-border bg-surface-2/40 px-3 py-2">
          <div className="mb-1 flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wide text-text-muted">
            <Pin className="size-2.5" />
            Root message
          </div>
          <div className="rounded-md bg-surface-0 p-1">
            <ChatMessage sender={rootSender} time={formatClock(rootMessage.createdAt)}>
              {renderContent(rootMessage.content)}
            </ChatMessage>
          </div>
        </div>
      ) : null}

      <div className="flex-1 overflow-y-auto px-1 py-2">
        {topicMessages.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center gap-1 px-6 text-center text-[12px] text-text-muted">
            <MessageSquareIcon />
            <div>Continue the discussion here.</div>
            <div className="text-[11px] text-text-tertiary">
              Replies in a topic stay threaded under the root message.
            </div>
          </div>
        ) : (
          topicMessages.map((msg) => {
            const sender = toSender(msg.sender);
            if (!sender) return null;
            const reactions = msg.reactions.map((r) => ({
              emoji: r.emoji,
              count: r.users.length,
              reacted: r.users.includes(currentUserId),
            }));
            return (
              <div key={msg.id} className="group relative">
                <ChatMessage
                  sender={sender}
                  time={formatClock(msg.createdAt)}
                  reactions={reactions.length > 0 ? reactions : undefined}
                  onReactionClick={(emoji) => toggleTopicReaction(msg, emoji)}
                >
                  {renderContent(msg.content)}
                </ChatMessage>
                <div
                  className={cn(
                    "absolute right-3 top-1 z-10 flex items-center gap-0.5 rounded-md border border-border-subtle bg-surface-0 px-0.5 py-0.5 shadow-sm transition-opacity",
                    reactionPickerId === msg.id
                      ? "pointer-events-auto opacity-100"
                      : "pointer-events-none opacity-0 group-hover:pointer-events-auto group-hover:opacity-100",
                  )}
                >
                  <Popover
                    open={reactionPickerId === msg.id}
                    onOpenChange={(open) => setReactionPickerId(open ? msg.id : null)}
                  >
                    <PopoverTrigger asChild>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon-sm"
                        title="Add reaction"
                        onMouseEnter={() => openPicker(msg.id)}
                        onMouseLeave={scheduleClose}
                      >
                        <Smile className="size-3.5" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent
                      align="end"
                      side="top"
                      sideOffset={6}
                      className="w-auto p-0"
                      onOpenAutoFocus={(e) => e.preventDefault()}
                      onMouseEnter={cancelClose}
                      onMouseLeave={scheduleClose}
                    >
                      <EmojiPicker
                        onSelect={(emoji) => {
                          toggleTopicReaction(msg, emoji);
                          setReactionPickerId(null);
                          cancelClose();
                        }}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            );
          })
        )}
        <div ref={bottomRef} />
      </div>

      <MessageInput
        channelId={rootChannel.id}
        isDmWithAgent={false}
        channel={rootChannel}
        topicId={activeTopicId}
      />
    </aside>
    {variant === "main" ? <TopicSidePanel /> : null}
    </>
  );
}

function MessageSquareIcon(): React.ReactElement {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="opacity-40"
    >
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  );
}
