import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Hash, Globe, Search, Plus, Check, Pin, PinOff } from "lucide-react";
import { Button, Input, cn } from "@nexu-design/ui-web";

import { useT } from "@/i18n";
import { useChatStore } from "@/stores/chat";
import { mockChannels, resolveRef } from "@/mock/data";
import { CreateChannelDialog } from "./CreateChannelDialog";
import type { Channel } from "@/types";

interface ContextMenuState {
  x: number;
  y: number;
  channel: Channel;
}

function useContextMenu(): {
  menu: ContextMenuState | null;
  open: (e: React.MouseEvent, channel: Channel) => void;
  close: () => void;
} {
  const [menu, setMenu] = useState<ContextMenuState | null>(null);
  const close = useCallback((): void => {
    setMenu(null);
  }, []);

  useEffect(() => {
    if (!menu) return;
    const handler = (): void => close();
    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, [menu, close]);

  const open = (e: React.MouseEvent, channel: Channel): void => {
    e.preventDefault();
    setMenu({ x: e.clientX, y: e.clientY, channel });
  };

  return { menu, open, close };
}

export function ChatSidebar(): React.ReactElement {
  const t = useT();
  const navigate = useNavigate();
  const { channelId } = useParams();
  const channels = useChatStore((s) => s.channels);
  const setChannels = useChatStore((s) => s.setChannels);
  const setActiveChannel = useChatStore((s) => s.setActiveChannel);
  const removeChannel = useChatStore((s) => s.removeChannel);
  const pinnedIds = useChatStore((s) => s.pinnedIds);
  const togglePin = useChatStore((s) => s.togglePin);
  const [search, setSearch] = useState("");
  const [createOpen, setCreateOpen] = useState(false);
  const { menu, open: openCtx, close: closeCtx } = useContextMenu();

  useEffect(() => {
    if (channels.length === 0) setChannels(mockChannels);
  }, [channels.length, setChannels]);

  const handleSelect = (id: string): void => {
    setActiveChannel(id);
    navigate(`/chat/${id}`);
  };

  const handleMarkDone = (e: React.MouseEvent, ch: Channel): void => {
    e.stopPropagation();
    const remaining = channels.filter((c) => c.id !== ch.id);
    removeChannel(ch.id);

    if (channelId === ch.id) {
      const next = remaining.find((c) => c.type === "channel") ?? remaining[0];
      if (next) {
        setActiveChannel(next.id);
        navigate(`/chat/${next.id}`);
      } else {
        navigate("/chat");
      }
    }
  };

  const filterBySearch = (c: Channel): boolean => {
    if (!search) return true;
    const q = search.toLowerCase();
    if (c.name.toLowerCase().includes(q)) return true;
    const other = c.members.find((m) => m.id !== "u-1");
    const resolved = other ? resolveRef(other) : undefined;
    return resolved?.name.toLowerCase().includes(q) ?? false;
  };

  const pinnedSet = new Set(pinnedIds);

  const pinnedChannels = pinnedIds
    .map((id) => channels.find((c) => c.id === id))
    .filter((c): c is Channel => c != null && filterBySearch(c));

  // Channels and DMs share one unified list sorted by recency. Keeping
  // them under a single section (instead of two sub-headers) matches
  // the modern Slack/Linear conversation-list pattern where what you
  // talked to last is what surfaces first, regardless of whether the
  // thread is a channel or a 1:1. The `+` affordance stays on the
  // section header since that's still the only way to create a new
  // channel; DMs start implicitly from a message.
  const conversationList = channels
    .filter((c) => !pinnedSet.has(c.id) && filterBySearch(c))
    .sort((a, b) => b.lastMessageAt - a.lastMessageAt);

  const renderRow = (c: Channel, opts?: { showDelete?: boolean }): React.ReactElement => {
    const isActive = channelId === c.id;
    const isChannel = c.type === "channel";
    const otherMember = !isChannel ? c.members.find((m) => m.id !== "u-1") : undefined;
    const resolved = otherMember ? resolveRef(otherMember) : undefined;
    const label = isChannel ? c.name : (resolved?.name ?? c.name);
    const unread = c.unreadCount > 0;

    return (
      <div
        key={c.id}
        onContextMenu={(e) => openCtx(e, c)}
        className={cn("group/item relative w-full")}
      >
        <Button
          type="button"
          variant="ghost"
          size="inline"
          onClick={() => handleSelect(c.id)}
          className={cn(
            "flex items-center gap-2.5 w-full rounded-md pl-2 pr-2 py-2 text-[13px] transition-colors",
            isActive
              ? "bg-nav-active text-nav-active-fg font-semibold"
              : unread
                ? "text-nav-fg hover:bg-nav-hover"
                : "text-nav-muted hover:bg-nav-hover hover:text-nav-fg",
          )}
        >
          {isChannel ? (
            <Globe className="h-3.5 w-3.5 shrink-0 opacity-90" />
          ) : resolved ? (
            // Avatar ring follows the app-wide rule:
            // `ring-black/5 dark:ring-white/10`. Without this the edge
            // of light-background avatars (fair-skin emoji, white-edge
            // illustrations) dissolves into the sidebar in light mode
            // and blends into the panel in dark mode, which is why DMs
            // looked "border-less" next to other avatars in the app.
            <img
              src={resolved.avatar}
              alt=""
              className="h-3.5 w-3.5 rounded-full shrink-0 ring-1 ring-inset ring-black/5 dark:ring-white/10"
            />
          ) : (
            <Hash className="h-3.5 w-3.5 shrink-0" />
          )}
          <span className="truncate flex-1 text-left">{label}</span>
          {unread ? (
            <span
              className={cn(
                "ml-auto flex h-4 min-w-4 items-center justify-center rounded-full bg-brand-primary text-accent-fg text-[10px] font-semibold px-1",
                opts?.showDelete && "group-hover/item:hidden",
              )}
            >
              {c.unreadCount}
            </span>
          ) : null}
        </Button>
        {opts?.showDelete && (
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            onClick={(e) => handleMarkDone(e, c)}
            className="absolute right-2 top-1/2 ml-auto hidden h-5 w-5 -translate-y-1/2 items-center justify-center rounded hover:bg-nav-hover text-nav-muted hover:text-nav-fg transition-colors group-hover/item:flex"
            title="Mark as done"
            aria-label="Mark as done"
          >
            <Check className="h-3 w-3" strokeWidth={2.5} />
          </Button>
        )}
      </div>
    );
  };

  const channelCount = channels.filter((c) => c.type === "channel").length;
  const atLimit = channelCount >= 20;

  return (
    <div className="flex flex-col h-full">
      {/* No `pt-*` on the search wrap — the 12px gap from the sidebar's
          page title down to here is owned by `SidebarHeader`'s `pb-3`
          (spacing rule in layout/Sidebar.tsx).
          `pb-4` = 16px below the search, matching AgentsSidebar so the
          first section header sits at the same vertical distance from
          the search input across sidebars. */}
      <div className="px-3 pb-4">
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={t("chat.search")}
          leadingIcon={<Search className="h-3.5 w-3.5 text-nav-muted" />}
          className="h-8 border-border-subtle bg-nav-input text-nav-fg shadow-none focus-within:border-transparent focus-within:ring-1 focus-within:ring-nav-ring"
          inputClassName="text-[13px] placeholder:text-nav-muted/50"
        />
      </div>

      {/* Unified list rhythm across all sidebars:
          - `space-y-3` (12px) between sibling sections
          - each section header uses `px-2 py-1.5 gap-1.5` (11px uppercase)
          - each section's rows use `space-y-0.5` for tight list rhythm
          Keep this in sync with AgentsSidebar / RuntimesSidebar. */}
      <div className="flex-1 overflow-y-auto px-3 pb-2 space-y-3">
        {pinnedChannels.length > 0 && (
          <div>
            <div className="flex items-center gap-1.5 px-2 py-1.5 text-[11px] font-semibold text-nav-muted uppercase tracking-wider">
              <Pin className="h-3.5 w-3.5" />
              <span className="flex-1">Pinned</span>
            </div>
            <div className="space-y-0.5">{pinnedChannels.map((c) => renderRow(c))}</div>
          </div>
        )}

        <div>
          <div className="flex items-center gap-1.5 px-2 py-1.5 text-[11px] font-semibold text-nav-muted uppercase tracking-wider">
            <span className="flex-1">Channels</span>
            {/* Plain inline button (not the `Button` primitive) matches the
                compact 20px affordance used in AgentsSidebar so the two
                section headers read as siblings. The primitive's own
                `inline-flex gap-1.5` base + `icon-sm` sizing rendered
                slightly taller and visually off-axis next to the uppercase
                label row. */}
            <button
              type="button"
              onClick={() => setCreateOpen(true)}
              disabled={atLimit}
              aria-label={
                atLimit
                  ? t("chat.channelLimitReached", { count: String(channelCount) })
                  : t("chat.createChannel")
              }
              title={
                atLimit
                  ? t("chat.channelLimitReached", { count: String(channelCount) })
                  : t("chat.createChannel")
              }
              className="flex h-5 w-5 items-center justify-center rounded text-nav-muted transition-colors hover:bg-nav-hover hover:text-nav-fg disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent"
            >
              <Plus className="h-3.5 w-3.5" />
            </button>
          </div>
          <div className="space-y-0.5">
            {conversationList.map((c) => renderRow(c, { showDelete: true }))}
          </div>
        </div>
      </div>

      {menu && (
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
            className="absolute z-50 w-44 rounded-lg border border-border bg-popover text-foreground shadow-lg overflow-hidden py-1"
          >
            <Button
              type="button"
              variant="ghost"
              size="inline"
              onClick={() => {
                togglePin(menu.channel.id);
                closeCtx();
              }}
              className="flex items-center gap-2 w-full px-3 py-1.5 text-sm text-left hover:bg-surface-2 transition-colors"
            >
              {pinnedSet.has(menu.channel.id) ? (
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
          </div>
        </div>
      )}

      <CreateChannelDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        onCreated={(id) => handleSelect(id)}
      />
    </div>
  );
}
