import { useEffect, useRef, useState, useCallback } from 'react'
import { Bot, Hash, Sparkles, Globe, UserPlus, Pencil } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useChatStore } from '@/stores/chat'
import { useWorkspaceStore } from '@/stores/workspace'
import { useAgentsStore } from '@/stores/agents'
import { resolveRef } from '@/mock/data'
import { ContentBlockRenderer } from './ContentBlocks'
import { ContentDetailOverlay } from './ContentDetailOverlay'
import type { Channel, ContentBlock, Message } from '@/types'

const CURRENT_USER_ID = 'u-1'

function formatClock(ts: number): string {
  return new Date(ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

function formatDateLabel(ts: number): string {
  const d = new Date(ts)
  const today = new Date()
  const yesterday = new Date()
  yesterday.setDate(today.getDate() - 1)
  const sameDay = (a: Date, b: Date): boolean =>
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  if (sameDay(d, today)) return 'Today'
  if (sameDay(d, yesterday)) return 'Yesterday'
  return d.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' })
}

function renderContent(content: string): React.ReactNode {
  const parts = content.split(/(```[\s\S]*?```|`[^`]+`|\*\*[^*]+\*\*)/g)
  return parts.map((part, i) => {
    if (part.startsWith('```') && part.endsWith('```')) {
      const code = part.slice(3, -3).replace(/^\w+\n/, '')
      return (
        <pre key={i} className="my-2 rounded-lg bg-muted p-3 text-xs overflow-x-auto">
          <code>{code}</code>
        </pre>
      )
    }
    if (part.startsWith('`') && part.endsWith('`')) {
      return (
        <code key={i} className="rounded bg-muted px-1.5 py-0.5 text-xs">
          {part.slice(1, -1)}
        </code>
      )
    }
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i}>{part.slice(2, -2)}</strong>
    }
    return <span key={i}>{part}</span>
  })
}

interface MessageListProps {
  channelId: string
  channel?: Channel
}

const EMPTY_MESSAGES: never[] = []

function DMEmptyState({ channel }: { channel: Channel }): React.ReactElement {
  const otherMember = channel.members.find((m) => m.id !== CURRENT_USER_ID)
  const resolved = otherMember ? resolveRef(otherMember) : undefined

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="flex flex-col items-center px-6 py-16 max-w-lg mx-auto space-y-3">
        {resolved && (
          <img
            src={resolved.avatar}
            alt={resolved.name}
            className="h-20 w-20 rounded-full"
          />
        )}
        <h3 className="text-xl font-semibold">{resolved?.name ?? channel.name}</h3>
        <p className="text-sm text-muted-foreground text-center">
          {resolved?.isAgent
            ? `This is the beginning of your conversation with ${resolved.name}.`
            : `This is the beginning of your direct message history with ${resolved?.name ?? channel.name}.`}
        </p>
      </div>
    </div>
  )
}

function ChannelEmptyState({ channel }: { channel: Channel }): React.ReactElement {
  const agents = useAgentsStore((s) => s.agents)
  const setPendingDraft = useChatStore((s) => s.setPendingDraft)

  const channelAgents = channel.members
    .filter((m) => m.kind === 'agent')
    .map((m) => agents.find((a) => a.id === m.id))
    .filter(Boolean)

  const handleQuickAction = (text: string): void => {
    setPendingDraft(text)
  }

  const createdRaw = formatDateLabel(channel.createdAt)
  const createdPhrase =
    createdRaw === 'Today' ? 'today' : createdRaw === 'Yesterday' ? 'yesterday' : `on ${createdRaw}`

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="max-w-3xl mx-auto px-6 pt-10 pb-4 space-y-5">
        <div className="space-y-3">
          <div className="flex items-center gap-2.5">
            <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-secondary">
              <Hash className="h-5 w-5 text-foreground" />
            </div>
            <h2 className="text-[22px] font-bold tracking-tight">{channel.name}</h2>
          </div>
          <p className="text-[13px] text-muted-foreground leading-relaxed">
            <span className="font-medium text-foreground">You</span> created this channel {createdPhrase}.{' '}
            {channel.description
              ? channel.description
              : `This is the very beginning of the #${channel.name} channel. Add a description to let others know what it's for.`}
          </p>
          <div className="flex flex-wrap items-center gap-1.5">
            <button className="inline-flex items-center gap-1.5 h-7 px-2.5 rounded-md border border-border text-xs font-medium text-foreground hover:bg-accent transition-colors">
              <UserPlus className="h-3.5 w-3.5" />
              Add people
            </button>
            <button className="inline-flex items-center gap-1.5 h-7 px-2.5 rounded-md border border-border text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-accent transition-colors">
              <Pencil className="h-3.5 w-3.5" />
              Edit description
            </button>
          </div>
        </div>

        {channelAgents.length > 0 && (
          <div className="rounded-xl border border-border/70 bg-secondary/30 p-4 space-y-3">
            <div className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
              <Sparkles className="h-3 w-3" />
              Agents in this channel
            </div>
            <div className="space-y-2">
              {channelAgents.map((agent) => (
                <div key={agent!.id} className="flex items-start gap-3">
                  <img
                    src={agent!.avatar}
                    alt={agent!.name}
                    className="h-8 w-8 rounded-full shrink-0 mt-0.5"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm font-semibold">{agent!.name}</span>
                      <span className="flex items-center gap-0.5 text-[10px] font-medium text-nexu-agent bg-nexu-agent/10 px-1.5 py-0.5 rounded-full">
                        <Bot className="h-2.5 w-2.5" />
                        Agent
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                      {agent!.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-1.5 pt-0.5">
              {channelAgents.slice(0, 3).map((agent) => {
                const prompts = getQuickPrompts(agent!.name, agent!.templateId)
                return prompts.map((prompt, i) => (
                  <button
                    key={`${agent!.id}-${i}`}
                    onClick={() => handleQuickAction(prompt)}
                    className="text-xs px-2.5 py-1 rounded-md bg-background border border-border/60 text-muted-foreground hover:text-foreground hover:border-border transition-colors"
                  >
                    {prompt}
                  </button>
                ))
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function getQuickPrompts(name: string, templateId: string | null): string[] {
  switch (templateId) {
    case 'tpl-1':
      return [`@${name} write a debounce hook`, `@${name} fix this bug`]
    case 'tpl-2':
      return [`@${name} review my PR`, `@${name} check for security issues`]
    case 'tpl-3':
      return [`@${name} check deployment status`, `@${name} run CI pipeline`]
    case 'tpl-4':
      return [`@${name} summarize this thread`, `@${name} draft a doc`]
    default:
      return [`@${name} help me with something`]
  }
}

export function MessageList({ channelId, channel }: MessageListProps): React.ReactElement {
  const messages = useChatStore((s) => s.messages[channelId] ?? EMPTY_MESSAGES)
  const updateMessage = useChatStore((s) => s.updateMessage)
  const currentUserId = useWorkspaceStore((s) => s.currentUserId)
  const bottomRef = useRef<HTMLDivElement>(null)
  const lastMsg = messages[messages.length - 1]
  const [expandedBlock, setExpandedBlock] = useState<ContentBlock | null>(null)
  const closeExpanded = useCallback(() => setExpandedBlock(null), [])

  const handleApproval = (msgId: string, blocks: ContentBlock[] | undefined, approvalId: string, action: 'approved' | 'rejected'): void => {
    if (!blocks) return
    const updated = blocks.map((b) =>
      b.type === 'approval' && b.id === approvalId ? { ...b, status: action } as ContentBlock : b
    )
    updateMessage(channelId, msgId, { blocks: updated })
  }

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages.length, lastMsg?.content])

  if (messages.length === 0) {
    if (channel?.type === 'dm') {
      return <DMEmptyState channel={channel} />
    }
    if (channel) {
      return <ChannelEmptyState channel={channel} />
    }
    return (
      <div className="flex-1 flex items-center justify-center text-muted-foreground text-sm">
        No messages yet. Start the conversation!
      </div>
    )
  }

  return (
    <div className="flex-1 overflow-y-auto py-3">
      {messages.map((msg, idx) => {
        const prev = messages[idx - 1]
        const showDateSeparator =
          !prev ||
          new Date(prev.createdAt).toDateString() !== new Date(msg.createdAt).toDateString()

        if (msg.system?.kind === 'join') {
          const resolved = msg.system.members
            .map((m) => resolveRef(m))
            .filter(Boolean) as { name: string; avatar: string; isAgent: boolean }[]
          if (resolved.length === 0) return null
          const names =
            resolved.length === 1
              ? resolved[0].name
              : resolved.length === 2
                ? `${resolved[0].name} and ${resolved[1].name}`
                : `${resolved[0].name}, ${resolved[1].name} and ${resolved.length - 2} other${resolved.length - 2 === 1 ? '' : 's'}`
          return (
            <div key={msg.id}>
              {showDateSeparator && <DateSeparator ts={msg.createdAt} />}
              <div className="group relative flex items-start gap-3 px-5 pt-2 pb-0.5 hover:bg-muted/40 transition-colors">
                <div className="w-9 shrink-0">
                  <div className="h-9 w-9 rounded-full bg-foreground flex items-center justify-center mt-0.5">
                    <Globe className="h-4 w-4 text-background" />
                  </div>
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-baseline gap-1.5 mb-0.5">
                    <span className="font-bold text-[14px] text-foreground">System</span>
                    <span className="text-[11px] text-muted-foreground">{formatClock(msg.createdAt)}</span>
                  </div>
                  <div className="text-[14px] text-foreground">
                    <span className="text-nexu-primary font-medium">@{names}</span> joined the channel.
                  </div>
                </div>
              </div>
            </div>
          )
        }

        return (
          <div key={msg.id}>
            {showDateSeparator && <DateSeparator ts={msg.createdAt} />}
            <MattermostMessageRow
              msg={msg}
              prev={prev && !prev.system ? prev : undefined}
              currentUserId={currentUserId ?? CURRENT_USER_ID}
              onApproval={handleApproval}
              onExpand={setExpandedBlock}
            />
          </div>
        )
      })}
      <div ref={bottomRef} />
      <ContentDetailOverlay block={expandedBlock} onClose={closeExpanded} />
    </div>
  )
}

function DateSeparator({ ts }: { ts: number }): React.ReactElement {
  return (
    <div className="relative my-3 flex items-center justify-center">
      <span className="absolute inset-x-5 top-1/2 h-px bg-border -translate-y-1/2" />
      <span className="relative z-[1] bg-background text-[12px] font-bold text-foreground px-3">
        {formatDateLabel(ts)}
      </span>
    </div>
  )
}

interface MMRowProps {
  msg: Message
  prev: Message | undefined
  currentUserId: string
  onApproval: (msgId: string, blocks: ContentBlock[] | undefined, approvalId: string, action: 'approved' | 'rejected') => void
  onExpand: (b: ContentBlock) => void
}

function MattermostMessageRow({ msg, prev, onApproval, onExpand }: MMRowProps): React.ReactElement | null {
  const sender = resolveRef(msg.sender)
  if (!sender) return null

  const isSameSender =
    prev &&
    !prev.system &&
    prev.sender.kind === msg.sender.kind &&
    prev.sender.id === msg.sender.id
  const isConsecutive = isSameSender && msg.createdAt - prev!.createdAt < 300000

  return (
    <div className={cn(
      'group relative flex items-start gap-3 px-5 hover:bg-muted/40 transition-colors',
      isConsecutive ? 'py-0' : 'pt-2 pb-0.5'
    )}>
      <div className="w-9 shrink-0">
        {isConsecutive ? (
          <div className="h-[18px] w-9 opacity-0 group-hover:opacity-100 text-[10px] text-muted-foreground text-right pr-1 pt-0.5">
            {formatClock(msg.createdAt)}
          </div>
        ) : (
          <img src={sender.avatar} alt="" className="h-9 w-9 rounded-full mt-0.5" />
        )}
      </div>

      <div className="min-w-0 flex-1">
        {!isConsecutive && (
          <div className="flex items-baseline gap-1.5 mb-0.5">
            <span className="font-bold text-[14px] text-foreground">{sender.name}</span>
            {sender.isAgent && (
              <span className="flex items-center gap-0.5 text-[10px] font-medium text-nexu-agent bg-nexu-agent/10 px-1.5 py-0.5 rounded-full">
                <Bot className="h-2.5 w-2.5" />
                Agent
              </span>
            )}
            <span className="text-[11px] text-muted-foreground">{formatClock(msg.createdAt)}</span>
          </div>
        )}

        {msg.content && (
          <div className="text-[14px] leading-relaxed text-foreground whitespace-pre-wrap break-words">
            {renderContent(msg.content)}
            {msg.isStreaming && (
              <span className="inline-block w-1.5 h-4 bg-current opacity-60 ml-0.5 animate-pulse align-middle" />
            )}
          </div>
        )}

        {msg.blocks && msg.blocks.length > 0 && (
          <div className="flex flex-col gap-2 mt-1 max-w-full">
            {msg.blocks.map((block, bi) => (
              <ContentBlockRenderer
                key={bi}
                block={block}
                isMe={false}
                onApprovalAction={(aid, action) => onApproval(msg.id, msg.blocks, aid, action)}
                onExpand={onExpand}
              />
            ))}
          </div>
        )}

        {msg.reactions.length > 0 && (
          <div className="flex gap-1 mt-1">
            {msg.reactions.map((r) => (
              <span
                key={r.emoji}
                className="flex items-center gap-1 text-xs bg-muted border border-border rounded-full px-2 py-0.5"
              >
                {r.emoji} {r.users.length}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
