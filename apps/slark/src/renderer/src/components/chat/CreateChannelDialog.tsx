import { useState, useEffect, useRef } from 'react'
import { Hash, X } from 'lucide-react'
import { useChatStore } from '@/stores/chat'
import { useAgentsStore } from '@/stores/agents'
import { mockUsers } from '@/mock/data'
import type { Channel, MemberRef } from '@/types'

interface CreateChannelDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onCreated?: (channelId: string) => void
}

export function CreateChannelDialog({ open, onOpenChange, onCreated }: CreateChannelDialogProps): React.ReactElement | null {
  const addChannel = useChatStore((s) => s.addChannel)
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (open) {
      requestAnimationFrame(() => inputRef.current?.focus())
    }
  }, [open])

  if (!open) return null

  const handleCreate = (): void => {
    const trimmed = name.trim().toLowerCase().replace(/\s+/g, '-')
    if (!trimmed) return

    const channel: Channel = {
      id: `ch-${Date.now()}`,
      name: trimmed,
      description: description.trim() || undefined,
      type: 'channel',
      members: [
        ...mockUsers.map((u): MemberRef => ({ kind: 'user', id: u.id })),
        ...useAgentsStore.getState().agents.map((a): MemberRef => ({ kind: 'agent', id: a.id }))
      ],
      lastMessageAt: Date.now(),
      unreadCount: 0,
      createdAt: Date.now()
    }

    const id = channel.id
    addChannel(channel)
    setName('')
    setDescription('')
    onOpenChange(false)
    setTimeout(() => onCreated?.(id), 0)
  }

  const handleKeyDown = (e: React.KeyboardEvent): void => {
    if (e.key === 'Enter' && !e.shiftKey && name.trim()) {
      e.preventDefault()
      handleCreate()
    }
    if (e.key === 'Escape') {
      onOpenChange(false)
    }
  }

  const handleOverlayClick = (e: React.MouseEvent): void => {
    if (e.target === e.currentTarget) onOpenChange(false)
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={handleOverlayClick}
    >
      <div className="w-[420px] rounded-xl border border-border bg-background p-0 shadow-xl">
        <div className="flex items-center justify-between px-5 pt-5 pb-1">
          <h2 className="text-base font-semibold">Create Channel</h2>
          <button
            onClick={() => onOpenChange(false)}
            className="flex items-center justify-center h-7 w-7 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="px-5 py-4 space-y-4">
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Name</label>
            <div className="relative">
              <Hash className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <input
                ref={inputRef}
                value={name}
                onChange={(e) => setName(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="e.g. design-review"
                className="w-full h-9 rounded-md border border-input bg-background pl-9 pr-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium">
              Description <span className="text-muted-foreground font-normal">(optional)</span>
            </label>
            <input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="What's this channel about?"
              className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
            />
          </div>
        </div>

        <div className="flex justify-end gap-2 px-5 pb-5">
          <button
            onClick={() => onOpenChange(false)}
            className="h-8 px-3 rounded-md text-sm border border-border hover:bg-accent transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleCreate}
            disabled={!name.trim()}
            className="h-8 px-4 rounded-md text-sm font-medium bg-foreground text-background hover:bg-foreground/90 disabled:opacity-40 disabled:pointer-events-none transition-colors"
          >
            Create
          </button>
        </div>
      </div>
    </div>
  )
}
