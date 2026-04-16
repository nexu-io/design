import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Hash, Search, Bot, User, Plus, X, Pin, PinOff } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useChatStore } from '@/stores/chat'
import { mockChannels, resolveRef } from '@/mock/data'
import { CreateChannelDialog } from './CreateChannelDialog'
import { CreateAgentDialog } from '@/components/agents/CreateAgentDialog'
import { InvitePeopleDialog } from './InvitePeopleDialog'
import type { Channel } from '@/types'

interface ContextMenuState {
  x: number
  y: number
  channel: Channel
}

function useContextMenu(): {
  menu: ContextMenuState | null
  open: (e: React.MouseEvent, channel: Channel) => void
  close: () => void
} {
  const [menu, setMenu] = useState<ContextMenuState | null>(null)
  const close = (): void => setMenu(null)

  useEffect(() => {
    if (!menu) return
    const handler = (): void => close()
    document.addEventListener('click', handler)
    return () => document.removeEventListener('click', handler)
  }, [menu])

  const open = (e: React.MouseEvent, channel: Channel): void => {
    e.preventDefault()
    setMenu({ x: e.clientX, y: e.clientY, channel })
  }

  return { menu, open, close }
}

export function ChatSidebar(): React.ReactElement {
  const navigate = useNavigate()
  const { channelId } = useParams()
  const channels = useChatStore((s) => s.channels)
  const setChannels = useChatStore((s) => s.setChannels)
  const setActiveChannel = useChatStore((s) => s.setActiveChannel)
  const removeChannel = useChatStore((s) => s.removeChannel)
  const pinnedIds = useChatStore((s) => s.pinnedIds)
  const togglePin = useChatStore((s) => s.togglePin)
  const [search, setSearch] = useState('')
  const [createOpen, setCreateOpen] = useState(false)
  const [inviteOpen, setInviteOpen] = useState(false)
  const [createAgentOpen, setCreateAgentOpen] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<Channel | null>(null)
  const { menu, open: openCtx, close: closeCtx } = useContextMenu()

  useEffect(() => {
    if (channels.length === 0) setChannels(mockChannels)
  }, [channels.length, setChannels])

  const handleSelect = (id: string): void => {
    setActiveChannel(id)
    navigate(`/chat/${id}`)
  }

  const handleDeleteClick = (e: React.MouseEvent, ch: Channel): void => {
    e.stopPropagation()
    setDeleteTarget(ch)
  }

  const handleDeleteConfirm = (): void => {
    if (!deleteTarget) return
    const remaining = channels.filter((c) => c.id !== deleteTarget.id)
    removeChannel(deleteTarget.id)

    if (channelId === deleteTarget.id) {
      const next = remaining.find((c) => c.type === 'channel') ?? remaining[0]
      if (next) {
        setActiveChannel(next.id)
        navigate(`/chat/${next.id}`)
      } else {
        navigate('/chat')
      }
    }
    setDeleteTarget(null)
  }

  const filterBySearch = (c: Channel): boolean => {
    if (!search) return true
    const q = search.toLowerCase()
    if (c.name.toLowerCase().includes(q)) return true
    const other = c.members.find((m) => m.id !== 'u-1')
    const resolved = other ? resolveRef(other) : undefined
    return resolved?.name.toLowerCase().includes(q) ?? false
  }

  const pinnedSet = new Set(pinnedIds)

  const pinnedChannels = pinnedIds
    .map((id) => channels.find((c) => c.id === id))
    .filter((c): c is Channel => c != null && filterBySearch(c))

  const channelList = channels.filter(
    (c) => c.type === 'channel' && !pinnedSet.has(c.id) && filterBySearch(c)
  )
  const peopleDMs = channels.filter((c) => {
    if (c.type !== 'dm' || pinnedSet.has(c.id) || !filterBySearch(c)) return false
    return c.members.every((m) => m.kind === 'user')
  })
  const agentDMs = channels.filter((c) => {
    if (c.type !== 'dm' || pinnedSet.has(c.id) || !filterBySearch(c)) return false
    return c.members.some((m) => m.kind === 'agent')
  })

  const renderItemIcon = (c: Channel): React.ReactNode => {
    if (c.type === 'channel') {
      return <Hash className="h-3.5 w-3.5 shrink-0" />
    }
    const otherMember = c.members.find((m) => m.id !== 'u-1')
    const resolved = otherMember ? resolveRef(otherMember) : undefined
    if (resolved) {
      return <img src={resolved.avatar} alt="" className="h-5 w-5 rounded-full shrink-0" />
    }
    return null
  }

  const renderItemLabel = (c: Channel): string => {
    if (c.type === 'channel') return c.name
    const otherMember = c.members.find((m) => m.id !== 'u-1')
    const resolved = otherMember ? resolveRef(otherMember) : undefined
    return resolved?.name ?? c.name
  }

  const renderSidebarItem = (
    c: Channel,
    opts?: { showDelete?: boolean }
  ): React.ReactElement => (
    <button
      key={c.id}
      onClick={() => handleSelect(c.id)}
      onContextMenu={(e) => openCtx(e, c)}
      className={cn(
        'group/item flex items-center gap-2 w-full px-2 py-1.5 rounded-md text-sm transition-colors',
        channelId === c.id
          ? 'bg-accent text-accent-foreground'
          : 'text-muted-foreground hover:bg-accent/50 hover:text-foreground'
      )}
    >
      {renderItemIcon(c)}
      <span className="truncate flex-1 text-left">{renderItemLabel(c)}</span>
      {c.unreadCount > 0 ? (
        <span className={cn(
          'ml-auto flex h-5 min-w-5 items-center justify-center rounded-full bg-foreground text-background text-xs font-medium px-1.5',
          opts?.showDelete && 'group-hover/item:hidden'
        )}>
          {c.unreadCount}
        </span>
      ) : null}
      {opts?.showDelete && (
        <span
          role="button"
          tabIndex={-1}
          onClick={(e) => handleDeleteClick(e, c)}
          className="ml-auto hidden h-5 w-5 items-center justify-center rounded hover:bg-destructive/20 hover:text-destructive transition-colors group-hover/item:flex"
          title="Delete channel"
        >
          <X className="h-3 w-3" />
        </span>
      )}
    </button>
  )

  return (
    <div className="flex flex-col h-full">
      <div className="px-3 pb-3">
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search"
            className="w-full h-8 rounded-md border border-input bg-background pl-8 pr-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-2 space-y-4">
        {pinnedChannels.length > 0 && (
          <div>
            <div className="flex items-center gap-1.5 px-2 py-1 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
              <Pin className="h-3 w-3" />
              Pinned
            </div>
            {pinnedChannels.map((c) => renderSidebarItem(c))}
          </div>
        )}

        <div>
          <div className="flex items-center gap-1.5 px-2 py-1 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
            <Hash className="h-3 w-3" />
            <span className="flex-1">Channels</span>
            <button
              onClick={() => setCreateOpen(true)}
              className="flex items-center justify-center h-4 w-4 rounded hover:bg-accent hover:text-foreground transition-colors"
              title="Create channel"
            >
              <Plus className="h-3 w-3" />
            </button>
          </div>
          {channelList.map((c) => renderSidebarItem(c, { showDelete: true }))}
        </div>

        {peopleDMs.length > 0 && (
          <div>
            <div className="flex items-center gap-1.5 px-2 py-1 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
              <User className="h-3 w-3" />
              <span className="flex-1">People</span>
              <button
                onClick={() => setInviteOpen(true)}
                className="flex items-center justify-center h-4 w-4 rounded hover:bg-accent hover:text-foreground transition-colors"
                title="Invite people"
              >
                <Plus className="h-3 w-3" />
              </button>
            </div>
            {peopleDMs.map((c) => renderSidebarItem(c))}
          </div>
        )}

        {agentDMs.length > 0 && (
          <div>
            <div className="flex items-center gap-1.5 px-2 py-1 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
              <Bot className="h-3 w-3" />
              <span className="flex-1">Agents</span>
              <button
                onClick={() => setCreateAgentOpen(true)}
                className="flex items-center justify-center h-4 w-4 rounded hover:bg-accent hover:text-foreground transition-colors"
                title="Create agent"
              >
                <Plus className="h-3 w-3" />
              </button>
            </div>
            {agentDMs.map((c) => renderSidebarItem(c))}
          </div>
        )}
      </div>

      {menu && (
        <div
          className="fixed inset-0 z-50"
          onClick={closeCtx}
          onContextMenu={(e) => { e.preventDefault(); closeCtx() }}
        >
          <div
            style={{ left: menu.x, top: menu.y }}
            className="absolute z-50 w-44 rounded-lg border border-border bg-popover shadow-lg overflow-hidden py-1"
          >
            <button
              onClick={() => {
                togglePin(menu.channel.id)
                closeCtx()
              }}
              className="flex items-center gap-2 w-full px-3 py-1.5 text-sm text-left hover:bg-accent transition-colors"
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
        </div>
      )}

      <CreateChannelDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        onCreated={(id) => handleSelect(id)}
      />

      <InvitePeopleDialog open={inviteOpen} onOpenChange={setInviteOpen} />

      <CreateAgentDialog open={createAgentOpen} onOpenChange={setCreateAgentOpen} />

      {deleteTarget && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          onClick={() => setDeleteTarget(null)}
        >
          <div
            className="w-[360px] rounded-xl border border-border bg-background p-5 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-base font-semibold">Delete #{deleteTarget.name}?</h3>
            <p className="text-sm text-muted-foreground mt-2">
              This will permanently delete the channel and all its messages. This action cannot be undone.
            </p>
            <div className="flex justify-end gap-2 mt-5">
              <button
                onClick={() => setDeleteTarget(null)}
                className="h-8 px-3 rounded-md text-sm border border-border hover:bg-accent transition-colors"
              >
                Cancel
              </button>
              <button
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
  )
}
