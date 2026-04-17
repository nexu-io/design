import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Hash, Search, Bot, User, Plus, X, Pin, PinOff } from "lucide-react";
import { Badge, Button, Input, ScrollArea, cn } from "@nexu-design/ui-web";
import { useChatStore } from "@/stores/chat";
import { mockChannels, resolveRef } from "@/mock/data";
import { CreateChannelDialog } from "./CreateChannelDialog";
import { CreateAgentDialog } from "@/components/agents/CreateAgentDialog";
import { InvitePeopleDialog } from "./InvitePeopleDialog";
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
  const close = useCallback((): void => setMenu(null), []);

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
  const [inviteOpen, setInviteOpen] = useState(false);
  const [createAgentOpen, setCreateAgentOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Channel | null>(null);
  const { menu, open: openCtx, close: closeCtx } = useContextMenu();

  useEffect(() => {
    if (channels.length === 0) setChannels(mockChannels);
  }, [channels.length, setChannels]);

  const handleSelect = (id: string): void => {
    setActiveChannel(id);
    navigate(`/chat/${id}`);
  };

  const handleDeleteClick = (e: React.MouseEvent, ch: Channel): void => {
    e.stopPropagation();
    setDeleteTarget(ch);
  };

  const handleDeleteConfirm = (): void => {
    if (!deleteTarget) return;
    const remaining = channels.filter((c) => c.id !== deleteTarget.id);
    removeChannel(deleteTarget.id);

    if (channelId === deleteTarget.id) {
      const next = remaining.find((c) => c.type === "channel") ?? remaining[0];
      if (next) {
        setActiveChannel(next.id);
        navigate(`/chat/${next.id}`);
      } else {
        navigate("/chat");
      }
    }
    setDeleteTarget(null);
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

  const channelList = channels.filter(
    (c) => c.type === "channel" && !pinnedSet.has(c.id) && filterBySearch(c),
  );
  const peopleDMs = channels.filter((c) => {
    if (c.type !== "dm" || pinnedSet.has(c.id) || !filterBySearch(c)) return false;
    return c.members.every((m) => m.kind === "user");
  });
  const agentDMs = channels.filter((c) => {
    if (c.type !== "dm" || pinnedSet.has(c.id) || !filterBySearch(c)) return false;
    return c.members.some((m) => m.kind === "agent");
  });

  const renderItemIcon = (c: Channel): React.ReactNode => {
    if (c.type === "channel") {
      return <Hash className="h-3.5 w-3.5 shrink-0" />;
    }
    const otherMember = c.members.find((m) => m.id !== "u-1");
    const resolved = otherMember ? resolveRef(otherMember) : undefined;
    if (resolved) {
      return (
        <img src={resolved.avatar} alt="" className="h-[18px] w-[18px] rounded-full shrink-0" />
      );
    }
    return null;
  };

  const renderItemLabel = (c: Channel): string => {
    if (c.type === "channel") return c.name;
    const otherMember = c.members.find((m) => m.id !== "u-1");
    const resolved = otherMember ? resolveRef(otherMember) : undefined;
    return resolved?.name ?? c.name;
  };

  const renderSidebarItem = (c: Channel, opts?: { showDelete?: boolean }): React.ReactElement => (
    <div key={c.id} className="group/item flex items-center gap-1">
      <button
        type="button"
        onClick={() => handleSelect(c.id)}
        onContextMenu={(e) => openCtx(e, c)}
        className={cn(
          "flex min-w-0 flex-1 items-center gap-2 rounded-lg px-2.5 py-2 text-[13px] transition-colors",
          channelId === c.id
            ? "bg-surface-2 text-text-primary"
            : "text-text-secondary hover:bg-surface-2 hover:text-text-primary",
        )}
      >
        {renderItemIcon(c)}
        <span className="truncate flex-1 text-left">{renderItemLabel(c)}</span>
        {c.unreadCount > 0 ? (
          <Badge
            variant="default"
            size="xs"
            className={cn(
              "ml-auto min-w-5 justify-center px-1.5",
              opts?.showDelete && "group-hover/item:hidden",
            )}
          >
            {c.unreadCount}
          </Badge>
        ) : null}
      </button>

      {opts?.showDelete ? (
        <button
          type="button"
          onClick={(e) => handleDeleteClick(e, c)}
          className="hidden h-7 w-7 shrink-0 items-center justify-center rounded-md text-text-secondary transition-colors hover:bg-destructive/10 hover:text-destructive group-hover/item:flex"
          title="Delete channel"
        >
          <X className="h-3 w-3" />
        </button>
      ) : null}
    </div>
  );

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="px-3 pb-3">
        <Input
          size="sm"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search"
          leadingIcon={<Search className="size-3.5" />}
        />
      </div>

      <ScrollArea className="min-h-0 flex-1 px-2 pb-3">
        <div className="space-y-4 pr-1">
          {pinnedChannels.length > 0 && (
            <div>
              <div className="flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.08em] text-text-tertiary">
                <Pin className="h-3 w-3" />
                Pinned
              </div>
              {pinnedChannels.map((c) => renderSidebarItem(c))}
            </div>
          )}

          <div>
            <div className="flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.08em] text-text-tertiary">
              <Hash className="h-3 w-3" />
              <span className="flex-1">Channels</span>
              <Button
                onClick={() => setCreateOpen(true)}
                variant="ghost"
                size="icon-sm"
                className="h-5 w-5 rounded-md text-text-secondary hover:bg-surface-2 hover:text-text-primary"
                title="Create channel"
              >
                <Plus className="h-3 w-3" />
              </Button>
            </div>
            {channelList.map((c) => renderSidebarItem(c, { showDelete: true }))}
          </div>

          {peopleDMs.length > 0 && (
            <div>
              <div className="flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.08em] text-text-tertiary">
                <User className="h-3 w-3" />
                <span className="flex-1">People</span>
                <Button
                  onClick={() => setInviteOpen(true)}
                  variant="ghost"
                  size="icon-sm"
                  className="h-5 w-5 rounded-md text-text-secondary hover:bg-surface-2 hover:text-text-primary"
                  title="Invite people"
                >
                  <Plus className="h-3 w-3" />
                </Button>
              </div>
              {peopleDMs.map((c) => renderSidebarItem(c))}
            </div>
          )}

          {agentDMs.length > 0 && (
            <div>
              <div className="flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.08em] text-text-tertiary">
                <Bot className="h-3 w-3" />
                <span className="flex-1">Agents</span>
                <Button
                  onClick={() => setCreateAgentOpen(true)}
                  variant="ghost"
                  size="icon-sm"
                  className="h-5 w-5 rounded-md text-text-secondary hover:bg-surface-2 hover:text-text-primary"
                  title="Create agent"
                >
                  <Plus className="h-3 w-3" />
                </Button>
              </div>
              {agentDMs.map((c) => renderSidebarItem(c))}
            </div>
          )}
        </div>
      </ScrollArea>

      {menu && (
        <>
          <button
            type="button"
            className="fixed inset-0 z-50"
            onClick={closeCtx}
            onContextMenu={(e) => {
              e.preventDefault();
              closeCtx();
            }}
            aria-label="Close channel menu"
          />
          <div
            style={{ left: menu.x, top: menu.y }}
            className="absolute z-50 w-44 rounded-lg border border-border bg-popover py-1 shadow-lg overflow-hidden"
          >
            <button
              type="button"
              onClick={() => {
                togglePin(menu.channel.id);
                closeCtx();
              }}
              className="flex w-full items-center gap-2 px-3 py-1.5 text-left text-sm transition-colors hover:bg-accent"
            >
              {pinnedSet.has(menu.channel.id) ? (
                <>
                  <PinOff className="h-3.5 w-3.5" />
                  Unpin
                </>
              ) : (
                <>
                  <Pin className="h-3.5 w-3.5" />
                  Pin to top
                </>
              )}
            </button>
          </div>
        </>
      )}

      <CreateChannelDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        onCreated={(id) => handleSelect(id)}
      />

      <InvitePeopleDialog open={inviteOpen} onOpenChange={setInviteOpen} />

      <CreateAgentDialog open={createAgentOpen} onOpenChange={setCreateAgentOpen} />

      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <button
            type="button"
            className="absolute inset-0 bg-black/50"
            onClick={() => setDeleteTarget(null)}
            aria-label="Close delete channel dialog"
          />
          <div className="relative w-[360px] rounded-xl border border-border bg-background p-5 shadow-xl">
            <h3 className="text-base font-semibold">Delete #{deleteTarget.name}?</h3>
            <p className="text-sm text-muted-foreground mt-2">
              This will permanently delete the channel and all its messages. This action cannot be
              undone.
            </p>
            <div className="flex justify-end gap-2 mt-5">
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                className="h-8 px-3 rounded-md text-sm border border-border hover:bg-accent transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteConfirm}
                className="h-8 px-4 rounded-md text-sm font-medium bg-destructive text-white hover:bg-destructive/90 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
