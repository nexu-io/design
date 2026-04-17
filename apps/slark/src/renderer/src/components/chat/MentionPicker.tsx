import { Bot } from 'lucide-react'
import { resolveRef } from '@/mock/data'
import type { MemberRef } from '@/types'

interface MentionPickerProps {
  members: MemberRef[]
  query: string
  onSelect: (ref: MemberRef, name: string) => void
  onClose: () => void
}

export function MentionPicker({ members, query, onSelect, onClose }: MentionPickerProps): React.ReactElement {
  const filtered = members.filter((m) => {
    const resolved = resolveRef(m)
    if (!resolved) return false
    return resolved.name.toLowerCase().includes(query.toLowerCase())
  })

  if (filtered.length === 0) {
    return (
      <div className="absolute bottom-full left-0 mb-1 w-64 rounded-lg border border-border bg-popover p-2 shadow-lg">
        <div className="px-2 py-1.5 text-xs text-muted-foreground">No matches</div>
      </div>
    )
  }

  return (
    <div className="absolute bottom-full left-0 mb-1 w-64 rounded-lg border border-border bg-popover shadow-lg overflow-hidden">
      {filtered.map((m) => {
        const resolved = resolveRef(m)
        if (!resolved) return null
        return (
          <button
            key={`${m.kind}-${m.id}`}
            onClick={() => {
              onSelect(m, resolved.name)
              onClose()
            }}
            className="flex items-center gap-2 w-full px-3 py-2 text-sm hover:bg-accent transition-colors"
          >
            <img src={resolved.avatar} alt="" className="h-5 w-5 rounded-full" />
            <span className="flex-1 text-left truncate">{resolved.name}</span>
            {resolved.isAgent && (
              <Bot className="h-3.5 w-3.5 text-nexu-agent" />
            )}
          </button>
        )
      })}
    </div>
  )
}
