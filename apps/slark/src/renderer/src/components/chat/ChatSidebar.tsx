import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Bot,
  Check,
  CircleDot,
  Globe,
  Hash,
  MessagesSquare,
  Pencil,
  Pin,
  PinOff,
  Search,
} from "lucide-react";
import { Button, Input, cn } from "@nexu-design/ui-web";

import { useT } from "@/i18n";
import { useChatStore } from "@/stores/chat";
import { useAgentsStore } from "@/stores/agents";
import { useTopicsStore } from "@/stores/topics";
import { mockChannels, resolveRef } from "@/mock/data";
import { CreateChannelDialog } from "./CreateChannelDialog";
import type { Channel } from "@/types";

const CURRENT_USER_ID = "u-1";

interface ConvoItem {
  key: string;
  kind: "channel" | "dm-user" | "dm-agent" | "topic";
  channelId: string;
  topicId?: string;
  title: string;
  subtitle: string;
  avatarUrl?: string;
  iconKind?: "globe" | "topic";
  lastActivityAt: number;
  unreadCount: number;
  openIssues?: number;
  hasIssue?: boolean;
  hasAgent?: boolean;
  hasMention?: boolean;
  canHide: boolean;
  canPin: boolean;
}

type ConvoFilter = "all" | "human" | "agent" | "issue" | "mention";

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
        (c) =>
          c.type === "dm" && c.members.some((m) => m.kind === "agent" && m.id === agent.id),
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
    if (item.topicId) {
      setActiveTopic(item.topicId);
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
          (it) =>
            it.title.toLowerCase().includes(q) || it.subtitle.toLowerCase().includes(q),
        )
      : list.filter((it) => !hiddenSet.has(it.key));

    bySearch.sort((a, b) => b.lastActivityAt - a.lastActivityAt);
    return bySearch;
  }, [
    channels,
    messagesMap,
    topics,
    topicMessages,
    topicArchived,
    topicReadAt,
    search,
    hiddenIds,
  ]);

  const openIssueCountByChannel = useMemo(() => {
    const acc: Record<string, number> = {};
    for (const topic of Object.values(topics)) {
      if (!topic.issue || topic.issue.status === "done") continue;
      acc[topic.rootChannelId] = (acc[topic.rootChannelId] ?? 0) + 1;
    }
    return acc;
  }, [topics]);

  // Pinned items: always show (not affected by category filter) so the header doesn't jitter.
  const pinnedItems = items.filter((it) => pinnedSet.has(it.key));
  // Rest items: apply category filter only here.
  const restItems = items.filter((it) => {
    if (pinnedSet.has(it.key)) return false;
    switch (filter) {
      case "all":
        return true;
      case "human":
        return !it.hasAgent;
      case "agent":
        return !!it.hasAgent;
      case "issue":
        return !!it.hasIssue;
      case "mention":
        return !!it.hasMention;
      default:
        return true;
    }
  });

  const channelCount = channels.filter((c) => c.type === "channel").length;
  const atLimit = channelCount >= 20;

  const renderRow = (item: ConvoItem): React.ReactElement => {
    const isActive = item.topicId
      ? false // topic rows never "active" via URL
      : channelId === item.channelId;
    const unread = item.unreadCount > 0;
    const openIssues = item.kind === "channel" ? (openIssueCountByChannel[item.channelId] ?? 0) : 0;
    const isTopic = item.kind === "topic";

    return (
      <div
        key={item.key}
        onContextMenu={(e) => openCtx(e, item)}
        className="group/item relative w-full"
      >
        {/* Topic accent bar — visually anchors topic under its parent channel */}
        {isTopic ? (
          <span
            aria-hidden
            className="pointer-events-none absolute left-[9px] top-0 h-full w-[2px] bg-brand-primary/40"
          />
        ) : null}

        <button
          type="button"
          onClick={() => handleSelect(item)}
          className={cn(
            "flex w-full items-start gap-2.5 py-2 pr-3 text-left transition-colors",
            isTopic ? "pl-6" : "pl-3",
            isActive
              ? "bg-nav-active text-nav-active-fg"
              : unread
                ? "text-nav-fg hover:bg-nav-hover"
                : "text-nav-muted hover:bg-nav-hover hover:text-nav-fg",
          )}
        >
          <div className="relative shrink-0">
            {item.avatarUrl ? (
              <img src={item.avatarUrl} alt="" className="size-8 rounded-lg" />
            ) : isTopic ? (
              <div className="flex size-7 items-center justify-center rounded-lg bg-brand-primary/15">
                <MessagesSquare className="size-3.5 text-brand-primary" />
              </div>
            ) : item.iconKind === "globe" ? (
              <div className="flex size-8 items-center justify-center rounded-lg bg-surface-2">
                <Globe className="size-4 text-text-muted" />
              </div>
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
              {isTopic ? (
                <span className="shrink-0 rounded-sm bg-brand-primary/15 px-1 py-[1px] text-[9px] font-semibold uppercase tracking-wider text-brand-primary">
                  Topic
                </span>
              ) : null}
              <span
                className={cn(
                  "min-w-0 flex-1 truncate",
                  isTopic ? "text-[12.5px]" : "text-[13px]",
                  unread || isActive ? "font-semibold" : "font-medium",
                  isActive
                    ? "text-nav-active-fg"
                    : unread
                      ? "text-nav-fg"
                      : "text-nav-fg/90",
                )}
              >
                {item.title}
              </span>
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
                  isActive
                    ? "text-nav-active-fg/80"
                    : unread
                      ? "text-nav-fg/80"
                      : "text-nav-muted",
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
          <Pencil className="size-3.5" />
        </Button>
      </div>

      <div className="flex items-center gap-0.5 px-2 pb-1.5">
        {(
          [
            { value: "all", label: "All" },
            { value: "human", label: "Human" },
            { value: "agent", label: "Agent" },
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
                active={channelId === it.channelId && !it.topicId}
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
          <div className="flex size-9 items-center justify-center rounded-full bg-surface-2">
            <Globe className="size-4 text-text-muted" />
          </div>
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
