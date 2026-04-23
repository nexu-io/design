import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Bot,
  Check,
  Circle,
  CircleCheck,
  CircleDashed,
  CircleDot,
  CircleSlash,
  Eye,
  Hash,
  MessagesSquare,
  Pin,
  PinOff,
  Plus,
  Search,
} from "lucide-react";
import { Button, Input, cn } from "@nexu-design/ui-web";

import { useT } from "@/i18n";
import { useChatStore } from "@/stores/chat";
import { useAgentsStore } from "@/stores/agents";
import { useTopicsStore } from "@/stores/topics";
import { mockChannels, mockMessages, resolveRef } from "@/mock/data";
import { CreateChannelDialog } from "./CreateChannelDialog";
import { ChannelAvatar } from "./ChannelAvatar";
import type { Channel, IssueStatus } from "@/types";

const CURRENT_USER_ID = "u-1";

const ISSUE_STATUS_META: Record<
  IssueStatus,
  { icon: typeof Circle; bubble: string; text: string; label: string }
> = {
  todo: {
    icon: Circle,
    bubble: "bg-surface-2",
    text: "text-text-muted",
    label: "Todo",
  },
  in_progress: {
    icon: CircleDashed,
    bubble: "bg-warning/15",
    text: "text-warning",
    label: "In progress",
  },
  in_review: {
    icon: Eye,
    bubble: "bg-info/15",
    text: "text-info",
    label: "In review",
  },
  blocked: {
    icon: CircleSlash,
    bubble: "bg-danger/15",
    text: "text-danger",
    label: "Blocked",
  },
  done: {
    icon: CircleCheck,
    bubble: "bg-success/15",
    text: "text-success",
    label: "Done",
  },
};

interface ConvoItem {
  key: string;
  kind: "channel" | "dm-user" | "dm-agent" | "topic";
  channelId: string;
  topicId?: string;
  title: string;
  subtitle: string;
  avatarUrl?: string;
  channelAvatar?: string;
  iconKind?: "globe" | "topic";
  lastActivityAt: number;
  unreadCount: number;
  openIssues?: number;
  hasIssue?: boolean;
  issueStatus?: IssueStatus;
  hasAgent?: boolean;
  hasMention?: boolean;
  canHide: boolean;
  canPin: boolean;
}

type ConvoFilter = "all" | "human" | "agent" | "topic" | "issue" | "mention";

interface ContextMenuState {
  x: number;
  y: number;
  item: ConvoItem;
}

function useContextMenu(): {
  menu: ContextMenuState | null;
  open: (e: React.MouseEvent, item: ConvoItem) => void;
  close: () => void;
} {
  const [menu, setMenu] = useState<ContextMenuState | null>(null);
  const close = useCallback((): void => setMenu(null), []);

  useEffect(() => {
    if (!menu) return;
    const handler = (): void => close();
    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, [menu, close]);

  const open = (e: React.MouseEvent, item: ConvoItem): void => {
    e.preventDefault();
    setMenu({ x: e.clientX, y: e.clientY, item });
  };

  return { menu, open, close };
}

function formatShortTime(ts: number): string {
  const now = Date.now();
  const diff = now - ts;
  if (diff < 60_000) return "now";
  if (diff < 3_600_000) return `${Math.floor(diff / 60_000)}m`;
  const today = new Date();
  const d = new Date(ts);
  const sameDay =
    today.getFullYear() === d.getFullYear() &&
    today.getMonth() === d.getMonth() &&
    today.getDate() === d.getDate();
  if (sameDay) {
    return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  }
  const yesterday = new Date(now - 86_400_000);
  const isYesterday =
    yesterday.getFullYear() === d.getFullYear() &&
    yesterday.getMonth() === d.getMonth() &&
    yesterday.getDate() === d.getDate();
  if (isYesterday) return "Yesterday";
  if (now - ts < 7 * 86_400_000) {
    return d.toLocaleDateString([], { weekday: "short" });
  }
  return d.toLocaleDateString([], { month: "numeric", day: "numeric" });
}

function stripMarkdown(text: string): string {
  return text
    .replace(/`{3}[\s\S]*?`{3}/g, "code")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/\*{1,2}([^*]+)\*{1,2}/g, "$1")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/!\[[^\]]*\]\([^)]+\)/g, "image")
    .replace(/@\[[^\]]+\]\(mention:\/\/[^)]+\)/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

export function ChatSidebar(): React.ReactElement {
  const t = useT();
  const navigate = useNavigate();
  const { channelId } = useParams();
  const channels = useChatStore((s) => s.channels);
  const messagesMap = useChatStore((s) => s.messages);
  const setChannels = useChatStore((s) => s.setChannels);
  const setActiveChannel = useChatStore((s) => s.setActiveChannel);
  const pinnedIds = useChatStore((s) => s.pinnedIds);
  const togglePin = useChatStore((s) => s.togglePin);
  const hiddenIds = useChatStore((s) => s.hiddenIds);
  const toggleHide = useChatStore((s) => s.toggleHide);

  const topics = useTopicsStore((s) => s.topics);
  const topicMessages = useTopicsStore((s) => s.messages);
  const topicArchived = useTopicsStore((s) => s.archived);
  const topicReadAt = useTopicsStore((s) => s.readAt);
  const setActiveTopic = useTopicsStore((s) => s.setActiveTopic);
  const activeTopicId = useTopicsStore((s) => s.activeTopicId);

  const agents = useAgentsStore((s) => s.agents);

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<ConvoFilter>("all");
  const [createOpen, setCreateOpen] = useState(false);
  const { menu, open: openCtx, close: closeCtx } = useContextMenu();

  useEffect(() => {
    if (channels.length === 0) setChannels(mockChannels);
  }, [channels.length, setChannels]);

  // Auto-create (if missing) + pin a DM for each agent, exactly once per session.
  // Tracking in a ref means a user can manually unpin later without us re-pinning.
  const pinnedAgentRef = useRef<Set<string>>(new Set());
  useEffect(() => {
    if (channels.length === 0) return; // wait for channels to hydrate
    for (const agent of agents) {
      if (pinnedAgentRef.current.has(agent.id)) continue;
      pinnedAgentRef.current.add(agent.id);

      const state = useChatStore.getState();
      let dm = state.channels.find(
        (c) => c.type === "dm" && c.members.some((m) => m.kind === "agent" && m.id === agent.id),
      );
      if (!dm) {
        const newDm: Channel = {
          id: `dm-${agent.id}`,
          name: agent.name,
          type: "dm",
          members: [
            { kind: "user", id: CURRENT_USER_ID },
            { kind: "agent", id: agent.id },
          ],
          lastMessageAt: Date.now(),
          unreadCount: 0,
          createdAt: Date.now(),
        };
        useChatStore.getState().addChannel(newDm);
        dm = newDm;
      }
      if (!useChatStore.getState().pinnedIds.includes(dm.id)) {
        useChatStore.getState().togglePin(dm.id);
      }
    }
  }, [agents, channels.length]);

  const pinnedSet = useMemo(() => new Set(pinnedIds), [pinnedIds]);

  const handleSelect = (item: ConvoItem): void => {
    // Preload mock messages synchronously so TopicDrawer can resolve rootMessage on
    // the very first render after navigate (otherwise the drawer flashes blank or
    // appears to be "just the channel"). No-op if the channel was already hydrated.
    if (item.topicId) {
      const store = useChatStore.getState();
      const existing = store.messages[item.channelId] ?? [];
      if (existing.length === 0 && mockMessages[item.channelId]) {
        for (const msg of mockMessages[item.channelId]) {
          store.addMessage(item.channelId, msg);
        }
      }
      setActiveTopic(item.topicId, "main");
    } else {
      setActiveTopic(null);
    }
    setActiveChannel(item.channelId);
    navigate(`/chat/${item.channelId}`);
  };

  const handleSelectChannel = (id: string): void => {
    setActiveChannel(id);
    setActiveTopic(null);
    navigate(`/chat/${id}`);
  };

  const handleHideClick = (e: React.MouseEvent, item: ConvoItem): void => {
    e.stopPropagation();
    toggleHide(item.key);
    // If the hidden item is currently open, navigate away.
    if (!item.topicId && channelId === item.channelId) {
      navigate("/chat");
    }
  };

  const items = useMemo<ConvoItem[]>(() => {
    const list: ConvoItem[] = [];

    for (const c of channels) {
      const msgs = messagesMap[c.id] ?? [];
      const last = msgs.length > 0 ? msgs[msgs.length - 1] : undefined;
      const lastActivityAt = last?.createdAt ?? c.lastMessageAt ?? c.createdAt;
      const previewBody = last ? stripMarkdown(last.content) : "No messages yet";
      const hasAgent = c.members.some((m) => m.kind === "agent");
      const hasMention = msgs.some((m) =>
        m.mentions?.some((ref) => ref.kind === "user" && ref.id === CURRENT_USER_ID),
      );

      if (c.type === "channel") {
        const senderName = last ? resolveRef(last.sender)?.name : undefined;
        const preview = last && senderName ? `${senderName}: ${previewBody}` : previewBody;
        list.push({
          key: c.id,
          kind: "channel",
          channelId: c.id,
          title: c.name,
          subtitle: preview,
          iconKind: "globe",
          channelAvatar: c.avatar,
          lastActivityAt,
          unreadCount: c.unreadCount,
          hasAgent,
          hasMention,
          canHide: true,
          canPin: true,
        });
      } else {
        const other = c.members.find((m) => m.id !== CURRENT_USER_ID);
        const resolved = other ? resolveRef(other) : undefined;
        const isAgent = resolved?.isAgent === true;
        const title = resolved?.name ?? c.name;
        const preview = last ? previewBody : isAgent ? "Say hi to get started" : "No messages yet";
        list.push({
          key: c.id,
          kind: isAgent ? "dm-agent" : "dm-user",
          channelId: c.id,
          title,
          subtitle: preview,
          avatarUrl: resolved?.avatar,
          lastActivityAt,
          unreadCount: c.unreadCount,
          hasAgent: isAgent,
          hasMention,
          canHide: true,
          canPin: true,
        });
      }
    }

    for (const topic of Object.values(topics)) {
      if (topicArchived[topic.id]) continue;
      const tMsgs = topicMessages[topic.id] ?? [];
      if (tMsgs.length === 0) continue;
      const last = tMsgs[tMsgs.length - 1];
      const channel = channels.find((c) => c.id === topic.rootChannelId);
      const channelLabel = channel
        ? channel.type === "channel"
          ? `in #${channel.name}`
          : `in ${channel.name}`
        : "";
      const senderName = resolveRef(last.sender)?.name;
      const body = stripMarkdown(last.content);
      const subtitle = [channelLabel, senderName ? `${senderName}: ${body}` : body]
        .filter(Boolean)
        .join(" · ");
      const unread = tMsgs.filter(
        (m) => m.sender.id !== CURRENT_USER_ID && m.createdAt > (topicReadAt[topic.id] ?? 0),
      ).length;
      const topicHasAgent =
        topic.participants.some((p) => p.kind === "agent") ||
        tMsgs.some((m) => m.sender.kind === "agent");
      const topicHasMention = tMsgs.some((m) =>
        m.mentions?.some((ref) => ref.kind === "user" && ref.id === CURRENT_USER_ID),
      );
      list.push({
        key: `topic:${topic.id}`,
        kind: "topic",
        channelId: topic.rootChannelId,
        topicId: topic.id,
        title: topic.title,
        subtitle,
        iconKind: "topic",
        lastActivityAt: last.createdAt,
        unreadCount: unread,
        openIssues: 0,
        hasIssue: !!topic.issue,
        issueStatus: topic.issue?.status,
        hasAgent: topicHasAgent,
        hasMention: topicHasMention,
        canHide: true,
        canPin: true,
      });
    }

    // Apply search + hidden (category filter is NOT applied here; pinned bypasses it).
    const q = search.trim().toLowerCase();
    const hiddenSet = new Set(hiddenIds);
    const bySearch = q
      ? list.filter(
          (it) => it.title.toLowerCase().includes(q) || it.subtitle.toLowerCase().includes(q),
        )
      : list.filter((it) => !hiddenSet.has(it.key));

    bySearch.sort((a, b) => b.lastActivityAt - a.lastActivityAt);
    return bySearch;
  }, [channels, messagesMap, topics, topicMessages, topicArchived, topicReadAt, search, hiddenIds]);

  const openIssueCountByChannel = useMemo(() => {
    const acc: Record<string, number> = {};
    for (const topic of Object.values(topics)) {
      if (!topic.issue || topic.issue.status === "done") continue;
      acc[topic.rootChannelId] = (acc[topic.rootChannelId] ?? 0) + 1;
    }
    return acc;
  }, [topics]);

  // Channels whose topics contain a mention of the current user — used so the `@`
  // filter can surface a parent channel even when the channel itself has no direct
  // @me messages (only a topic under it does).
  const channelsWithMentionedTopic = useMemo(() => {
    const acc = new Set<string>();
    for (const topic of Object.values(topics)) {
      const tMsgs = topicMessages[topic.id] ?? [];
      const hit = tMsgs.some((m) =>
        m.mentions?.some((ref) => ref.kind === "user" && ref.id === CURRENT_USER_ID),
      );
      if (hit) acc.add(topic.rootChannelId);
    }
    return acc;
  }, [topics, topicMessages]);

  const matchesFilter = useCallback(
    (it: ConvoItem): boolean => {
      switch (filter) {
        case "all":
          return true;
        case "human":
          return it.kind === "dm-user";
        case "agent":
          return it.kind === "dm-agent";
        case "topic":
          return it.kind === "topic" && !it.hasIssue;
        case "issue":
          return !!it.hasIssue;
        case "mention":
          if (it.hasMention) return true;
          // Topic under no-@me channel still needs nothing extra (it already has hasMention).
          // But a channel with no direct @me but a mentioned topic should appear too.
          if (it.kind !== "topic" && channelsWithMentionedTopic.has(it.channelId)) return true;
          return false;
        default:
          return true;
      }
    },
    [filter, channelsWithMentionedTopic],
  );

  // Filter applies to BOTH pinned and rest so the sections stay in sync with the tab.
  const pinnedItems = items.filter((it) => pinnedSet.has(it.key) && matchesFilter(it));
  const restItems = items.filter((it) => !pinnedSet.has(it.key) && matchesFilter(it));

  const channelCount = channels.filter((c) => c.type === "channel").length;
  const atLimit = channelCount >= 20;

  const renderRow = (item: ConvoItem): React.ReactElement => {
    const isActive = item.topicId
      ? activeTopicId === item.topicId
      : channelId === item.channelId && !activeTopicId;
    const unread = item.unreadCount > 0;
    const openIssues = item.kind === "channel" ? (openIssueCountByChannel[item.channelId] ?? 0) : 0;
    const isTopic = item.kind === "topic";

    return (
      <div
        key={item.key}
        onContextMenu={(e) => openCtx(e, item)}
        className="group/item relative w-full"
      >
        <button
          type="button"
          onClick={() => handleSelect(item)}
          className={cn(
            "flex w-full items-start gap-2.5 pr-3 text-left transition-colors",
            // Topic uses a smaller avatar (size-6), so nudge left-padding so its
            // center aligns with the channel avatar center (pl-3 + size-8/2 = 28px).
            isTopic ? "py-1.5 pl-4" : "py-2 pl-3",
            isActive
              ? "bg-nav-active text-nav-active-fg"
              : unread
                ? "text-nav-fg hover:bg-nav-hover"
                : "text-nav-muted hover:bg-nav-hover hover:text-nav-fg",
            // Done issues read as "archived" — dim the whole row (unless active/unread).
            isTopic && item.issueStatus === "done" && !isActive && !unread && "opacity-65",
          )}
        >
          <div className="relative shrink-0">
            {item.avatarUrl ? (
              <img src={item.avatarUrl} alt="" className="size-8 rounded-lg" />
            ) : isTopic ? (
              (() => {
                const statusMeta = item.issueStatus
                  ? ISSUE_STATUS_META[item.issueStatus]
                  : undefined;
                const StatusIcon = statusMeta?.icon ?? MessagesSquare;
                return (
                  <div
                    className={cn(
                      "flex size-6 items-center justify-center rounded-full ring-2 ring-nav",
                      isActive
                        ? "bg-nav-active-fg/20 ring-nav-active"
                        : statusMeta
                          ? statusMeta.bubble
                          : "bg-brand-primary/15",
                    )}
                    title={statusMeta?.label}
                  >
                    <StatusIcon
                      className={cn(
                        "size-3",
                        isActive
                          ? "text-nav-active-fg"
                          : statusMeta
                            ? statusMeta.text
                            : "text-brand-primary",
                      )}
                    />
                  </div>
                );
              })()
            ) : item.iconKind === "globe" ? (
              <ChannelAvatar
                channel={{
                  id: item.channelId,
                  name: item.title,
                  avatar: item.channelAvatar,
                }}
                size={32}
              />
            ) : (
              <div className="flex size-8 items-center justify-center rounded-lg bg-surface-2">
                <Hash className="size-4 text-text-muted" />
              </div>
            )}
            {item.kind === "dm-agent" ? (
              <span
                className="absolute -bottom-0.5 -right-0.5 flex size-3.5 items-center justify-center rounded-full bg-surface-0"
                title="Agent"
              >
                <Bot className="size-2.5 text-nexu-agent" />
              </span>
            ) : null}
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              <span
                className={cn(
                  "min-w-0 flex-1 truncate",
                  isTopic ? "text-[12.5px]" : "text-[13px]",
                  unread || isActive ? "font-semibold" : "font-medium",
                  isActive ? "text-nav-active-fg" : unread ? "text-nav-fg" : "text-nav-fg/90",
                )}
              >
                {item.title}
              </span>
              {isTopic && item.issueStatus
                ? (() => {
                    const statusMeta = ISSUE_STATUS_META[item.issueStatus];
                    return (
                      <span
                        title={statusMeta.label}
                        className={cn(
                          "shrink-0 size-1.5 rounded-full",
                          isActive
                            ? "bg-nav-active-fg/60"
                            : item.issueStatus === "in_progress"
                              ? "bg-warning"
                              : item.issueStatus === "in_review"
                                ? "bg-info"
                                : item.issueStatus === "blocked"
                                  ? "bg-danger text-danger status-pulse"
                                  : item.issueStatus === "done"
                                    ? "bg-success"
                                    : "bg-text-muted/60",
                        )}
                      />
                    );
                  })()
                : null}
              <span
                className={cn(
                  "shrink-0 text-[10px] tabular-nums",
                  isActive ? "text-nav-active-fg/70" : "text-nav-muted",
                )}
              >
                {formatShortTime(item.lastActivityAt)}
              </span>
            </div>
            <div className="mt-0.5 flex items-center gap-1.5">
              <span
                className={cn(
                  "min-w-0 flex-1 truncate text-[11.5px]",
                  isActive ? "text-nav-active-fg/80" : unread ? "text-nav-fg/80" : "text-nav-muted",
                )}
              >
                {item.subtitle}
              </span>
              {openIssues > 0 ? (
                <span
                  title={`${openIssues} open issue${openIssues === 1 ? "" : "s"}`}
                  className="inline-flex h-[16px] shrink-0 items-center gap-0.5 rounded-full bg-surface-2 px-1.5 text-[10px] font-semibold text-text-muted"
                >
                  <CircleDot className="size-2.5 text-brand-primary" />
                  {openIssues}
                </span>
              ) : null}
              {unread ? (
                <span className="flex h-[16px] min-w-[16px] shrink-0 items-center justify-center rounded-full bg-brand-primary px-1 text-[10px] font-semibold text-accent-fg">
                  {item.unreadCount}
                </span>
              ) : null}
            </div>
          </div>
        </button>

        {/* Hover: archive button (removed from list; still searchable) */}
        {item.canHide ? (
          <button
            type="button"
            onClick={(e) => handleHideClick(e, item)}
            className="absolute right-1.5 top-1.5 hidden size-5 items-center justify-center rounded bg-nav/85 text-nav-muted backdrop-blur transition-colors hover:bg-nav-hover hover:text-nav-fg group-hover/item:flex"
            title="Archive"
            aria-label="Archive"
          >
            <Check className="size-3" />
          </button>
        ) : null}
      </div>
    );
  };

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-1.5 px-3 pb-2">
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={t("chat.search")}
          leadingIcon={<Search className="h-3.5 w-3.5 text-nav-muted" />}
          className="h-8 flex-1 border-transparent bg-nav-input text-nav-fg shadow-none focus-within:border-transparent focus-within:ring-1 focus-within:ring-nav-ring"
          inputClassName="text-[13px] placeholder:text-nav-muted"
        />
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          onClick={() => setCreateOpen(true)}
          disabled={atLimit}
          className="size-8 shrink-0 rounded-md text-nav-muted hover:bg-nav-hover hover:text-nav-fg disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent"
          title={
            atLimit
              ? t("chat.channelLimitReached", { count: String(channelCount) })
              : t("chat.createChannel")
          }
        >
          <Plus className="size-4" />
        </Button>
      </div>

      <div className="flex items-center gap-0.5 px-2 pb-1.5">
        {(
          [
            { value: "all", label: "All" },
            { value: "human", label: "Human" },
            { value: "agent", label: "Agent" },
            { value: "topic", label: "Topic" },
            { value: "issue", label: "Issue" },
            { value: "mention", label: "@" },
          ] as { value: ConvoFilter; label: string }[]
        ).map((f) => {
          const active = filter === f.value;
          return (
            <button
              key={f.value}
              type="button"
              onClick={() => setFilter(f.value)}
              className={cn(
                "inline-flex h-6 shrink-0 items-center justify-center rounded-md px-1.5 text-[11px] font-medium transition-colors",
                active
                  ? "bg-nav-active text-nav-active-fg"
                  : "text-nav-muted hover:bg-nav-hover hover:text-nav-fg",
              )}
            >
              {f.label}
            </button>
          );
        })}
      </div>

      {pinnedItems.length > 0 ? (
        <div className="border-t border-nav-border px-2 pt-2 pb-1.5">
          <div className="grid grid-cols-5 gap-x-0.5 gap-y-1.5">
            {pinnedItems.map((it) => (
              <PinnedTile
                key={it.key}
                item={it}
                active={
                  it.topicId
                    ? activeTopicId === it.topicId
                    : channelId === it.channelId && !activeTopicId
                }
                onClick={() => handleSelect(it)}
                onContextMenu={(e) => openCtx(e, it)}
              />
            ))}
          </div>
        </div>
      ) : null}

      <div className="flex-1 overflow-y-auto pb-2">
        {restItems.length > 0 ? (
          restItems.map((it) => renderRow(it))
        ) : (
          <div className="px-4 py-6 text-center text-[11px] text-nav-muted">
            {search
              ? "No matches."
              : filter === "all"
                ? "No chats yet."
                : filter === "mention"
                  ? "No @mentions."
                  : `No ${filter} conversations.`}
          </div>
        )}
      </div>

      {menu ? (
        <div
          className="fixed inset-0 z-50"
          onMouseDown={closeCtx}
          onContextMenu={(e) => {
            e.preventDefault();
            closeCtx();
          }}
        >
          <div
            style={{ left: menu.x, top: menu.y }}
            onMouseDown={(e) => e.stopPropagation()}
            className="absolute z-50 w-44 overflow-hidden rounded-lg border border-border bg-popover py-1 text-foreground shadow-lg"
          >
            {menu.item.canPin ? (
              <Button
                type="button"
                variant="ghost"
                size="inline"
                onClick={() => {
                  togglePin(menu.item.key);
                  closeCtx();
                }}
                className="flex w-full items-center gap-2 px-3 py-1.5 text-left text-sm transition-colors hover:bg-accent"
              >
                {pinnedSet.has(menu.item.key) ? (
                  <>
                    <PinOff className="h-3.5 w-3.5" />
                    {t("chat.unpin")}
                  </>
                ) : (
                  <>
                    <Pin className="h-3.5 w-3.5" />
                    {t("chat.pinToTop")}
                  </>
                )}
              </Button>
            ) : (
              <div className="px-3 py-1.5 text-xs text-text-muted">No actions</div>
            )}
          </div>
        </div>
      ) : null}

      <CreateChannelDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        onCreated={(id) => handleSelectChannel(id)}
      />
    </div>
  );
}

interface PinnedTileProps {
  item: ConvoItem;
  active: boolean;
  onClick: () => void;
  onContextMenu: (e: React.MouseEvent) => void;
}

function PinnedTile({ item, active, onClick, onContextMenu }: PinnedTileProps): React.ReactElement {
  const unread = item.unreadCount > 0;
  return (
    <button
      type="button"
      onClick={onClick}
      onContextMenu={onContextMenu}
      title={item.title}
      className={cn(
        "group/tile flex flex-col items-center gap-1 rounded-md px-0.5 py-1 transition-colors",
        active ? "bg-nav-active/40" : "hover:bg-nav-hover",
      )}
    >
      <div className="relative">
        {item.avatarUrl ? (
          <img src={item.avatarUrl} alt="" className="size-9 rounded-full" />
        ) : item.iconKind === "topic" ? (
          <div className="flex size-9 items-center justify-center rounded-full bg-surface-2">
            <CircleDot className="size-4 text-brand-primary" />
          </div>
        ) : item.iconKind === "globe" ? (
          <ChannelAvatar
            channel={{
              id: item.channelId,
              name: item.title,
              avatar: item.channelAvatar,
            }}
            size={36}
            className="rounded-full"
          />
        ) : (
          <div className="flex size-9 items-center justify-center rounded-full bg-surface-2">
            <Hash className="size-4 text-text-muted" />
          </div>
        )}
        {item.kind === "dm-agent" ? (
          <span
            className="absolute -bottom-0.5 -right-0.5 flex size-3.5 items-center justify-center rounded-full bg-nav ring-2 ring-nav"
            title="Agent"
          >
            <Bot className="size-2.5 text-nexu-agent" />
          </span>
        ) : null}
        {unread ? (
          <span className="absolute -right-1 -top-1 flex h-[16px] min-w-[16px] items-center justify-center rounded-full bg-brand-primary px-1 text-[9px] font-semibold text-accent-fg ring-2 ring-nav">
            {item.unreadCount > 99 ? "99+" : item.unreadCount}
          </span>
        ) : null}
      </div>
      <span
        className={cn(
          "w-full truncate text-center text-[10px] leading-tight",
          active ? "font-semibold text-nav-fg" : "text-nav-muted",
        )}
      >
        {item.title}
      </span>
    </button>
  );
}
