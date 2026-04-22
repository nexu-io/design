import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Archive,
  ArchiveRestore,
  ArrowUpRight,
  Bot,
  CheckCheck,
  ChevronDown,
  Circle,
  CircleCheck,
  CircleDashed,
  CircleDot,
  CircleSlash,
  Eye,
  Hash,
  Inbox,
  MoreHorizontal,
  Pin,
} from "lucide-react";
import {
  Button,
  ChatMessage,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Mention,
  cn,
} from "@nexu-design/ui-web";
import type { ChatSender } from "@nexu-design/ui-web";
import { WindowChrome } from "@/components/layout/WindowChrome";
import { useChatStore } from "@/stores/chat";
import { useTopicsStore } from "@/stores/topics";
import { useAgentsStore } from "@/stores/agents";
import { resolveRef } from "@/mock/data";
import type { Channel, IssueStatus, MemberRef, Message, Topic } from "@/types";
import { MessageInput } from "@/components/chat/MessageInput";

const CURRENT_USER_ID = "u-1";

const STATUS_META: Record<
  IssueStatus,
  { label: string; icon: typeof CircleDot; dotClass: string; textClass: string; bgClass: string }
> = {
  todo: {
    label: "Todo",
    icon: Circle,
    dotClass: "text-text-muted",
    textClass: "text-text-muted",
    bgClass: "bg-surface-2 text-text-muted",
  },
  in_progress: {
    label: "In progress",
    icon: CircleDashed,
    dotClass: "text-warning",
    textClass: "text-warning",
    bgClass: "bg-warning-subtle text-warning",
  },
  in_review: {
    label: "In review",
    icon: Eye,
    dotClass: "text-info",
    textClass: "text-info",
    bgClass: "bg-info-subtle text-info",
  },
  blocked: {
    label: "Blocked",
    icon: CircleSlash,
    dotClass: "text-danger",
    textClass: "text-danger",
    bgClass: "bg-danger-subtle text-danger",
  },
  done: {
    label: "Done",
    icon: CircleCheck,
    dotClass: "text-success",
    textClass: "text-success",
    bgClass: "bg-success-subtle text-success",
  },
};

const STATUS_ORDER: IssueStatus[] = ["todo", "in_progress", "in_review", "blocked", "done"];
type Filter = "all" | "unread" | "archived" | IssueStatus;
const FILTER_ORDER: Filter[] = ["all", "unread", ...STATUS_ORDER, "archived"];

function formatRelative(ts: number): string {
  const diff = Date.now() - ts;
  const min = Math.floor(diff / 60000);
  if (min < 1) return "now";
  if (min < 60) return `${min}m`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr}h`;
  const day = Math.floor(hr / 24);
  if (day < 7) return `${day}d`;
  return new Date(ts).toLocaleDateString();
}

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

function previewOf(content: string): string {
  const stripped = content.replace(/\s+/g, " ").trim();
  return stripped.length > 120 ? `${stripped.slice(0, 120)}…` : stripped;
}

interface InboxItem {
  topic: Topic;
  latestMessage: Message | undefined;
  latestActivityAt: number;
  unreadCount: number;
  latestSenderName: string | undefined;
}

export function IssuesView(): React.ReactElement {
  const navigate = useNavigate();
  const topics = useTopicsStore((s) => s.topics);
  const topicMessages = useTopicsStore((s) => s.messages);
  const readAt = useTopicsStore((s) => s.readAt);
  const archived = useTopicsStore((s) => s.archived);
  const markTopicRead = useTopicsStore((s) => s.markTopicRead);
  const markAllRead = useTopicsStore((s) => s.markAllRead);
  const archiveTopics = useTopicsStore((s) => s.archiveTopics);
  const unarchiveTopic = useTopicsStore((s) => s.unarchiveTopic);
  const setIssueStatus = useTopicsStore((s) => s.setIssueStatus);
  const setIssueAssignee = useTopicsStore((s) => s.setIssueAssignee);
  const setActiveTopic = useTopicsStore((s) => s.setActiveTopic);
  const channels = useChatStore((s) => s.channels);
  const channelMessages = useChatStore((s) => s.messages);
  const agents = useAgentsStore((s) => s.agents);
  const [filter, setFilter] = useState<Filter>("all");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const items = useMemo<InboxItem[]>(() => {
    const result: InboxItem[] = [];
    for (const topic of Object.values(topics)) {
      if (!topic.issue) continue;
      const msgs = topicMessages[topic.id] ?? [];
      const latest = msgs[msgs.length - 1];
      const lastReadAt = readAt[topic.id] ?? 0;
      let unread = 0;
      for (const m of msgs) {
        if (m.sender.id !== CURRENT_USER_ID && m.createdAt > lastReadAt) unread += 1;
      }
      const latestSender = latest ? resolveRef(latest.sender) : undefined;
      result.push({
        topic,
        latestMessage: latest,
        latestActivityAt: latest?.createdAt ?? topic.issue.createdAt,
        unreadCount: unread,
        latestSenderName: latestSender?.name,
      });
    }
    result.sort((a, b) => b.latestActivityAt - a.latestActivityAt);
    return result;
  }, [topics, topicMessages, readAt, archived]);

  const counts = useMemo(() => {
    const base: Record<Filter, number> = {
      all: 0,
      unread: 0,
      todo: 0,
      in_progress: 0,
      in_review: 0,
      blocked: 0,
      done: 0,
      archived: 0,
    };
    for (const it of items) {
      if (archived[it.topic.id]) {
        base.archived += 1;
        continue;
      }
      base.all += 1;
      if (it.unreadCount > 0) base.unread += 1;
      if (it.topic.issue) base[it.topic.issue.status] += 1;
    }
    return base;
  }, [items, archived]);

  const filtered = useMemo(() => {
    if (filter === "archived") return items.filter((it) => archived[it.topic.id]);
    const active = items.filter((it) => !archived[it.topic.id]);
    if (filter === "all") return active;
    if (filter === "unread") return active.filter((it) => it.unreadCount > 0);
    return active.filter((it) => it.topic.issue?.status === filter);
  }, [items, filter, archived]);

  useEffect(() => {
    if (selectedId && !filtered.some((it) => it.topic.id === selectedId)) {
      setSelectedId(filtered[0]?.topic.id ?? null);
    } else if (!selectedId && filtered.length > 0) {
      setSelectedId(filtered[0].topic.id);
    }
  }, [filtered, selectedId]);

  const selected = selectedId ? items.find((it) => it.topic.id === selectedId) : undefined;

  useEffect(() => {
    if (selected && selected.unreadCount > 0) {
      markTopicRead(selected.topic.id);
    }
  }, [selected, markTopicRead]);

  const jumpToTopic = (topic: Topic): void => {
    setActiveTopic(topic.id);
    navigate(`/chat/${topic.rootChannelId}`);
  };

  const handleMarkAllRead = (): void => {
    markAllRead(items.filter((it) => it.unreadCount > 0).map((it) => it.topic.id));
  };

  const handleArchiveAll = (): void => {
    archiveTopics(items.map((it) => it.topic.id));
  };

  const handleArchiveAllRead = (): void => {
    archiveTopics(items.filter((it) => it.unreadCount === 0).map((it) => it.topic.id));
  };

  const handleArchiveCompleted = (): void => {
    archiveTopics(
      items.filter((it) => it.topic.issue?.status === "done").map((it) => it.topic.id),
    );
  };

  return (
    <div className="flex h-full flex-col bg-background">
      <WindowChrome className="flex h-[52px] items-center gap-2 border-b border-border px-4 pt-2">
        <Inbox className="size-4 text-text-muted" />
        <h2 className="text-[15px] font-semibold">Inbox</h2>
        <span className="text-xs text-text-muted">
          {counts.unread > 0 ? `${counts.unread} unread · ` : ""}
          {counts.all} total
        </span>
      </WindowChrome>

      <div className="flex flex-1 overflow-hidden">
        <div className="flex w-[340px] shrink-0 flex-col border-r border-border">
          <div className="flex items-center justify-between gap-2 px-3 py-2">
            <span className="text-[13px] font-semibold text-text-primary">Inbox</span>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  className="size-6 text-text-muted hover:text-text-primary"
                  title="More"
                  aria-label="Inbox actions"
                >
                  <MoreHorizontal className="size-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={handleMarkAllRead} disabled={counts.unread === 0}>
                  <CheckCheck className="size-3.5" />
                  Mark all as read
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleArchiveAll} disabled={items.length === 0}>
                  <Archive className="size-3.5" />
                  Archive all
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={handleArchiveAllRead}
                  disabled={items.every((it) => it.unreadCount > 0)}
                >
                  <Archive className="size-3.5" />
                  Archive all read
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={handleArchiveCompleted}
                  disabled={items.every((it) => it.topic.issue?.status !== "done")}
                >
                  <ArchiveRestore className="size-3.5" />
                  Archive completed
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div className="flex flex-wrap items-center gap-1 border-b border-border-subtle px-2 py-2">
            {FILTER_ORDER.map((f) => {
              const isActive = filter === f;
              const label =
                f === "all"
                  ? "All"
                  : f === "unread"
                    ? "Unread"
                    : f === "archived"
                      ? "Archived"
                      : STATUS_META[f].label;
              const count = counts[f];
              return (
                <button
                  key={f}
                  type="button"
                  onClick={() => setFilter(f)}
                  className={cn(
                    "inline-flex h-6 items-center gap-1 rounded px-2 text-[11px] font-medium transition-colors",
                    isActive
                      ? "bg-surface-2 text-text-primary"
                      : "text-text-muted hover:bg-surface-2/60 hover:text-text-primary",
                  )}
                >
                  {label}
                  <span className="text-[10px] text-text-tertiary">{count}</span>
                </button>
              );
            })}
          </div>

          <div className="flex-1 overflow-y-auto">
            {filtered.length === 0 ? (
              <div className="flex h-full flex-col items-center justify-center gap-1 px-6 text-center text-text-muted">
                <Inbox className="size-6 opacity-40" />
                <div className="text-[12px]">Nothing here</div>
              </div>
            ) : (
              filtered.map((item) => (
                <InboxRow
                  key={item.topic.id}
                  item={item}
                  active={item.topic.id === selectedId}
                  onClick={() => setSelectedId(item.topic.id)}
                />
              ))
            )}
          </div>
        </div>

        <div className="flex min-w-0 flex-1 flex-col">
          {selected ? (
            <ThreadPane
              item={selected}
              rootChannel={channels.find((c) => c.id === selected.topic.rootChannelId)}
              rootMessage={
                channelMessages[selected.topic.rootChannelId]?.find(
                  (m) => m.id === selected.topic.rootMessageId,
                )
              }
              messages={topicMessages[selected.topic.id] ?? []}
              readAt={readAt[selected.topic.id] ?? 0}
              assignee={selected.topic.issue?.assignee}
              agents={agents}
              isArchived={!!archived[selected.topic.id]}
              onJump={() => jumpToTopic(selected.topic)}
              onSetStatus={(status) => setIssueStatus(selected.topic.id, status)}
              onSetAssignee={(ref) => setIssueAssignee(selected.topic.id, ref)}
              onUnarchive={() => unarchiveTopic(selected.topic.id)}
              onArchive={() => archiveTopics([selected.topic.id])}
            />
          ) : (
            <div className="flex flex-1 flex-col items-center justify-center gap-2 text-text-muted">
              <Inbox className="size-8 opacity-40" />
              <div className="text-sm">Select an issue</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

interface InboxRowProps {
  item: InboxItem;
  active: boolean;
  onClick: () => void;
}

function InboxRow({ item, active, onClick }: InboxRowProps): React.ReactElement {
  const { topic, latestMessage, unreadCount, latestSenderName, latestActivityAt } = item;
  const issue = topic.issue;
  const meta = issue ? STATUS_META[issue.status] : undefined;
  const StatusIcon = meta?.icon ?? CircleDot;
  const preview = latestMessage ? previewOf(latestMessage.content) : "No replies yet";
  const isUnread = unreadCount > 0;

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex w-full items-start gap-2 border-b border-border-subtle px-3 py-2.5 text-left transition-colors",
        active ? "bg-surface-2" : "hover:bg-surface-2/60",
      )}
    >
      <div className="mt-1 flex w-2 shrink-0 justify-center">
        {isUnread ? <span className="size-1.5 rounded-full bg-brand-primary" /> : null}
      </div>
      <div className="min-w-0 flex-1 space-y-0.5">
        <div className="flex items-center gap-1.5">
          <div
            className={cn(
              "min-w-0 flex-1 truncate text-[13px]",
              isUnread ? "font-semibold text-text-primary" : "font-medium text-text-primary",
            )}
          >
            {topic.title}
          </div>
          <StatusIcon
            className={cn("size-3.5 shrink-0", meta?.dotClass)}
            aria-label={meta?.label}
          />
          <span className="shrink-0 text-[10px] tabular-nums text-text-tertiary">
            {formatRelative(latestActivityAt)}
          </span>
        </div>
        <div className="text-[11px] text-text-muted">
          <span className="line-clamp-2 leading-snug">
            {latestSenderName ? (
              <span className="font-medium text-text-muted/80">{latestSenderName}: </span>
            ) : null}
            {preview}
          </span>
        </div>
        {unreadCount > 1 ? (
          <div className="text-[10px] font-semibold text-brand-primary">
            {unreadCount} new replies
          </div>
        ) : null}
      </div>
    </button>
  );
}

interface ThreadPaneProps {
  item: InboxItem;
  rootChannel: Channel | undefined;
  rootMessage: Message | undefined;
  messages: Message[];
  readAt: number;
  assignee: MemberRef | undefined;
  agents: { id: string; name: string; avatar: string }[];
  isArchived: boolean;
  onJump: () => void;
  onSetStatus: (status: IssueStatus) => void;
  onSetAssignee: (ref: MemberRef | undefined) => void;
  onArchive: () => void;
  onUnarchive: () => void;
}

function ThreadPane({
  item,
  rootChannel,
  rootMessage,
  messages,
  readAt,
  assignee: assigneeRef,
  agents,
  isArchived,
  onJump,
  onSetStatus,
  onSetAssignee,
  onArchive,
  onUnarchive,
}: ThreadPaneProps): React.ReactElement {
  const channelName = rootChannel?.name ?? item.topic.rootChannelId;
  const { topic } = item;
  const issue = topic.issue;
  const meta = issue ? STATUS_META[issue.status] : undefined;
  const StatusIcon = meta?.icon;
  const assigneeInfo = assigneeRef ? resolveRef(assigneeRef) : undefined;
  const peopleMembers: MemberRef[] = rootChannel
    ? rootChannel.members.filter((m): m is Extract<MemberRef, { kind: "user" }> => m.kind === "user")
    : [];
  const isSameRef = (a: MemberRef | undefined, b: MemberRef | undefined): boolean =>
    !!a && !!b && a.kind === b.kind && a.id === b.id;
  const rootSender = rootMessage ? toSender(rootMessage.sender) : undefined;
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "auto" });
  }, [topic.id, messages.length]);

  return (
    <div className="flex h-full flex-col">
      <div className="flex h-[52px] shrink-0 items-center gap-2 border-b border-border px-4">
        {issue ? (
          <CircleDot className="size-4 shrink-0 text-brand-primary" />
        ) : (
          <Pin className="size-4 shrink-0 text-text-muted" />
        )}
        <div className="min-w-0 flex-1">
          <div className="truncate text-[13px] font-semibold text-text-primary">{topic.title}</div>
          <div className="flex items-center gap-1.5 text-[11px] text-text-muted">
            <span className="inline-flex items-center gap-1">
              <Hash className="size-3" />
              {channelName}
            </span>
          </div>
        </div>
        {issue ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                className="inline-flex h-7 items-center gap-1 rounded-md bg-surface-2 px-2 text-[11px] font-medium text-text-primary transition-opacity hover:opacity-80"
                title="Assignee"
              >
                {assigneeInfo ? (
                  <img
                    src={assigneeInfo.avatar}
                    alt=""
                    className="size-4 rounded-full object-cover"
                  />
                ) : (
                  <Bot className="size-3 text-text-muted" />
                )}
                {assigneeInfo ? assigneeInfo.name : "Unassigned"}
                <ChevronDown className="size-3 opacity-60" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="max-h-72 w-52 overflow-y-auto">
              <DropdownMenuItem
                onClick={() => onSetAssignee(undefined)}
                className={cn(!assigneeRef && "font-semibold")}
              >
                <CircleDashed className="size-3.5 text-text-muted" />
                Unassigned
              </DropdownMenuItem>
              {peopleMembers.length > 0 ? (
                <>
                  <DropdownMenuSeparator />
                  <div className="px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-text-muted">
                    People
                  </div>
                  {peopleMembers.map((m) => {
                    const info = resolveRef(m);
                    if (!info) return null;
                    const selected = isSameRef(assigneeRef, m);
                    return (
                      <DropdownMenuItem
                        key={`u-${m.id}`}
                        onClick={() => onSetAssignee(m)}
                        className={cn(selected && "font-semibold")}
                      >
                        <img src={info.avatar} alt="" className="size-4 rounded-full object-cover" />
                        {info.name}
                      </DropdownMenuItem>
                    );
                  })}
                </>
              ) : null}
              {agents.length > 0 ? (
                <>
                  <DropdownMenuSeparator />
                  <div className="px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-text-muted">
                    Agents
                  </div>
                  {agents.map((a) => {
                    const ref: MemberRef = { kind: "agent", id: a.id };
                    const selected = isSameRef(assigneeRef, ref);
                    return (
                      <DropdownMenuItem
                        key={`a-${a.id}`}
                        onClick={() => onSetAssignee(ref)}
                        className={cn(selected && "font-semibold")}
                      >
                        <img src={a.avatar} alt="" className="size-4 rounded-full object-cover" />
                        {a.name}
                      </DropdownMenuItem>
                    );
                  })}
                </>
              ) : null}
            </DropdownMenuContent>
          </DropdownMenu>
        ) : null}
        {issue && meta && StatusIcon ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                className={cn(
                  "inline-flex h-7 items-center gap-1 rounded-md px-2 text-[11px] font-semibold transition-opacity hover:opacity-80",
                  meta.bgClass,
                )}
                title="Change status"
              >
                <StatusIcon className="size-3" />
                {meta.label}
                <ChevronDown className="size-3 opacity-60" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
              {STATUS_ORDER.map((s) => {
                const sMeta = STATUS_META[s];
                const SIcon = sMeta.icon;
                return (
                  <DropdownMenuItem
                    key={s}
                    onClick={() => onSetStatus(s)}
                    className={cn(s === issue.status && "font-semibold")}
                  >
                    <SIcon className={cn("size-3.5", sMeta.dotClass)} />
                    {sMeta.label}
                  </DropdownMenuItem>
                );
              })}
            </DropdownMenuContent>
          </DropdownMenu>
        ) : null}
        {isArchived ? (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onUnarchive}
            className="h-7 gap-1 text-[11px]"
            title="Unarchive"
          >
            <ArchiveRestore className="size-3" />
            Unarchive
          </Button>
        ) : (
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            onClick={onArchive}
            className="size-7"
            title="Archive"
            aria-label="Archive"
          >
            <Archive className="size-3.5" />
          </Button>
        )}
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={onJump}
          className="h-7 gap-1 text-[11px]"
          title="Open in chat"
        >
          Open in chat
          <ArrowUpRight className="size-3" />
        </Button>
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
        {messages.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center gap-1 px-6 text-center text-[12px] text-text-muted">
            <div>No replies yet</div>
            <div className="text-[11px] text-text-tertiary">
              Type below to reply in this issue.
            </div>
          </div>
        ) : (
          messages.map((msg) => {
            const sender = toSender(msg.sender);
            if (!sender) return null;
            const isUnread = msg.sender.id !== CURRENT_USER_ID && msg.createdAt > readAt;
            return (
              <div key={msg.id} className="relative">
                {isUnread ? (
                  <span className="absolute left-1 top-4 size-1.5 rounded-full bg-brand-primary" />
                ) : null}
                <ChatMessage sender={sender} time={formatClock(msg.createdAt)}>
                  {renderContent(msg.content)}
                </ChatMessage>
              </div>
            );
          })
        )}
        <div ref={bottomRef} />
      </div>

      {rootChannel ? (
        <MessageInput
          channelId={rootChannel.id}
          isDmWithAgent={false}
          channel={rootChannel}
          topicId={item.topic.id}
        />
      ) : null}
    </div>
  );
}
