import { useEffect, useRef } from 'react'
import { useParams } from 'react-router-dom'
import { MessageSquare, Hash, Bot } from 'lucide-react'
import { useChatStore } from '@/stores/chat'
import { useWorkspaceStore } from '@/stores/workspace'
import { useAgentsStore } from '@/stores/agents'
import { mockMessages, mockChannels, resolveRef, getSlarkIntroResponse } from '@/mock/data'
import { MessageList } from './MessageList'
import { MessageInput } from './MessageInput'

export function ChatView(): React.ReactElement {
  const { channelId } = useParams()
  const channels = useChatStore((s) => s.channels)
  const addMessage = useChatStore((s) => s.addMessage)
  const updateMessage = useChatStore((s) => s.updateMessage)
  const welcomeFired = useRef(false)
  const loadedChannels = useRef(new Set<string>())

  useEffect(() => {
    if (!channelId) return
    if (useChatStore.getState().activeChannelId !== channelId) {
      useChatStore.getState().setActiveChannel(channelId)
    }
    const skipMock = channelId === 'ch-welcome' && !!useWorkspaceStore.getState().pendingWelcomeAgentId
    if (!loadedChannels.current.has(channelId) && mockMessages[channelId] && !skipMock) {
      loadedChannels.current.add(channelId)
      mockMessages[channelId].forEach((msg) => addMessage(channelId, msg))
    }
  }, [channelId, addMessage])

  useEffect(() => {
    if (welcomeFired.current || channelId !== 'ch-welcome') return
    const pendingAgentId = useWorkspaceStore.getState().pendingWelcomeAgentId
    if (!pendingAgentId) return

    const timer = setTimeout(() => {
      if (welcomeFired.current) return
      welcomeFired.current = true
      loadedChannels.current.add('ch-welcome')
      useWorkspaceStore.getState().setPendingWelcomeAgent(null)

      const agent = useAgentsStore.getState().agents.find((a) => a.id === pendingAgentId)
      if (!agent) return

      const fullContent = getSlarkIntroResponse(agent.name, agent.description)
      const replyId = `msg-onboard-reply-${Date.now()}`
      const tokens = fullContent.split(/(?<=\s)|(?=\s)/)

      addMessage('ch-welcome', {
        id: replyId,
        channelId: 'ch-welcome',
        sender: { kind: 'agent', id: agent.id },
        content: '',
        mentions: [],
        reactions: [],
        createdAt: Date.now(),
        isStreaming: true
      })

      let idx = 0
      const tick = (): void => {
        const chunk = Math.floor(Math.random() * 2) + 1
        idx = Math.min(idx + chunk, tokens.length)
        updateMessage('ch-welcome', replyId, {
          content: tokens.slice(0, idx).join('')
        })
        if (idx >= tokens.length) {
          updateMessage('ch-welcome', replyId, { isStreaming: false })
        } else {
          setTimeout(tick, 25 + Math.random() * 35)
        }
      }
      setTimeout(tick, 80)
    }, 800)

    return () => clearTimeout(timer)
  }, [channelId, addMessage, updateMessage])

  if (!channelId) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-muted-foreground">
          <MessageSquare className="h-10 w-10" />
          <p className="text-lg font-medium">Select a channel to start chatting</p>
        </div>
      </div>
    )
  }

  const channel = channels.find((c) => c.id === channelId) ??
    mockChannels.find((c) => c.id === channelId)
  if (!channel) {
    return (
      <div className="flex h-full items-center justify-center text-muted-foreground">
        Channel not found
      </div>
    )
  }

  const isDmWithAgent = channel.type === 'dm' && channel.members.some((m) => m.kind === 'agent')
  const otherMember = channel.type === 'dm'
    ? channel.members.find((m) => m.id !== 'u-1')
    : undefined
  const otherResolved = otherMember ? resolveRef(otherMember) : undefined

  return (
    <div className="flex h-full flex-col">
      <div className="drag-region h-10 shrink-0" />
      <div className="flex items-center gap-2 px-4 h-12 border-b border-border shrink-0">
        {channel.type === 'channel' ? (
          <Hash className="h-4 w-4 text-muted-foreground" />
        ) : otherResolved?.isAgent ? (
          <Bot className="h-4 w-4 text-slark-agent" />
        ) : null}
        <h2 className="font-semibold text-sm">
          {channel.type === 'dm' ? otherResolved?.name ?? channel.name : channel.name}
        </h2>
        {channel.description && (
          <span className="text-xs text-muted-foreground ml-2">{channel.description}</span>
        )}
        {channel.type === 'channel' && (
          <span className="ml-auto text-xs text-muted-foreground">
            {channel.members.length} members
          </span>
        )}
      </div>
      <MessageList channelId={channelId} channel={channel} />
      <MessageInput channelId={channelId} isDmWithAgent={isDmWithAgent} channel={channel} />
    </div>
  )
}
