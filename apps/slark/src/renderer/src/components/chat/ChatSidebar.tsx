import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Hash, Globe, Search, Plus, X, Pin, PinOff } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useT } from '@/i18n'
import { useChatStore } from '@/stores/chat'
import { mockChannels, resolveRef } from '@/mock/data'
import { CreateChannelDialog } from './CreateChannelDialog'
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
  const t = useT()
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

  const renderRow = (
    c: Channel,
    opts?: { showDelete?: boolean }
  ): React.ReactElement => {
    const isActive = channelId === c.id
    const isChannel = c.type === 'channel'
    const otherMember = !isChannel ? c.members.find((m) => m.id !== 'u-1') : undefined
    const resolved = otherMember ? resolveRef(otherMember) : undefined
    const label = isChannel ? c.name : resolved?.name ?? c.name
    const unread = c.unreadCount > 0

    return (
      <button
        key={c.id}
        onClick={() => handleSelect(c.id)}
        onContextMenu={(e) => openCtx(e, c)}
        className={cn(
          'group/item relative flex items-center gap-2 w-full pl-3 pr-2 py-[5px] text-[13px] transition-colors',
          isActive
            ? 'bg-nav-active text-white font-semibold'
            : unread
              ? 'text-nav-fg hover:bg-nav-hover'
              : 'text-nav-muted hover:bg-nav-hover hover:text-nav-fg'
        )}
      >
        {isChannel ? (
          <Globe className="h-4 w-4 shrink-0 opacity-90" />
        ) : resolved ? (
          <img src={resolved.avatar} alt="" className="h-4 w-4 rounded-full shrink-0" />
        ) : (
          <Hash className="h-4 w-4 shrink-0" />
        )}
        <span className="truncate flex-1 text-left">{label}</span>
        {unread ? (
          <span className={cn(
            'ml-auto flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-nexu-primary text-white text-[10px] font-semibold px-1.5',
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
            className="ml-auto hidden h-5 w-5 items-center justify-center rounded hover:bg-nav-hover text-nav-muted hover:text-nav-fg transition-colors group-hover/item:flex"
            title={t('chat.deleteChannel')}
          >
            <X className="h-3 w-3" />
          </span>
        )}
      </button>
    )
  }

  const channelCount = channels.filter((c) => c.type === 'channel').length
  const atLimit = channelCount >= 20

  return (
    <div className="flex flex-col h-full">
      <div className="px-3 pb-2">
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-nav-muted" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t('chat.search')}
            className="w-full h-8 rounded-md bg-nav-input text-nav-fg pl-8 pr-3 text-[13px] placeholder:text-nav-muted focus:outline-none focus:ring-1 focus:ring-nav-ring"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pb-2 space-y-1">
        {pinnedChannels.length > 0 && (
          <div>
            <div className="flex items-center gap-1.5 px-4 pt-2 pb-1 text-[10px] font-semibold text-nav-muted uppercase tracking-wider">
              <Pin className="h-3 w-3" />
              <span className="flex-1">{t('chat.pinned')}</span>
            </div>
            {pinnedChannels.map((c) => renderRow(c))}
          </div>
        )}

        <div>
          <div className="flex items-center gap-1.5 px-4 pt-2 pb-1 text-[10px] font-semibold text-nav-muted uppercase tracking-wider">
            <span className="flex-1">{t('chat.channels')}</span>
            <button
              onClick={() => setCreateOpen(true)}
              disabled={atLimit}
              className="flex items-center justify-center h-4 w-4 rounded hover:bg-nav-hover hover:text-nav-fg transition-colors disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent"
              title={atLimit ? t('chat.channelLimitReached', { count: String(channelCount) }) : t('chat.createChannel')}
            >
              <Plus className="h-3 w-3" />
            </button>
          </div>
          {channelList.map((c) => renderRow(c, { showDelete: true }))}
          <button
            onClick={() => !atLimit && setCreateOpen(true)}
            disabled={atLimit}
            className="flex items-center gap-2 w-full pl-3 pr-2 py-[5px] text-[13px] text-nav-muted hover:bg-nav-hover hover:text-nav-fg transition-colors disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent"
          >
            <Plus className="h-4 w-4 shrink-0" />
            <span>{t('chat.addChannels')}</span>
          </button>
        </div>

      </div>

      {menu && (
        <div
          className="fixed inset-0 z-50"
          onClick={closeCtx}
          onContextMenu={(e) => { e.preventDefault(); closeCtx() }}
        >
          <div
            style={{ left: menu.x, top: menu.y }}
            className="absolute z-50 w-44 rounded-lg border border-border bg-popover text-foreground shadow-lg overflow-hidden py-1"
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
                  {t('chat.unpin')}
                </>
              ) : (
                <>
                  <Pin className="h-3.5 w-3.5" />
                  {t('chat.pinToTop')}
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

      {deleteTarget && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          onClick={() => setDeleteTarget(null)}
        >
          <div
            className="w-[360px] rounded-xl border border-border bg-background text-foreground p-5 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-base font-semibold">{t('chat.deleteChannelTitle', { name: deleteTarget.name })}</h3>
            <p className="text-sm text-muted-foreground mt-2">
              {t('chat.deleteChannelDesc')}
            </p>
            <div className="flex justify-end gap-2 mt-5">
              <button
                onClick={() => setDeleteTarget(null)}
                className="h-8 px-3 rounded-md text-sm border border-border hover:bg-accent transition-colors"
              >
                {t('common.cancel')}
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="h-8 px-4 rounded-md text-sm font-medium bg-destructive text-white hover:bg-destructive/90 transition-colors"
              >
                {t('common.delete')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
