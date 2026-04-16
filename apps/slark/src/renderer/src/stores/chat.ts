import { create } from 'zustand'
import type { Channel, Message } from '@/types'

interface ChatState {
  channels: Channel[]
  activeChannelId: string | null
  messages: Record<string, Message[]>
  pendingDraft: string | null
  pinnedIds: string[]

  setChannels: (channels: Channel[]) => void
  setActiveChannel: (id: string) => void
  addChannel: (channel: Channel) => void
  removeChannel: (channelId: string) => void
  addMessage: (channelId: string, message: Message) => void
  updateMessage: (channelId: string, messageId: string, updates: Partial<Message>) => void
  setPendingDraft: (text: string | null) => void
  togglePin: (channelId: string) => void
}

export const useChatStore = create<ChatState>((set) => ({
  channels: [],
  activeChannelId: null,
  messages: {},
  pendingDraft: null,
  pinnedIds: [],

  setChannels: (channels) => set({ channels }),

  setActiveChannel: (id) => set({ activeChannelId: id }),

  addChannel: (channel) => set((s) => ({ channels: [...s.channels, channel] })),

  removeChannel: (channelId) =>
    set((s) => ({
      channels: s.channels.filter((c) => c.id !== channelId),
      activeChannelId: s.activeChannelId === channelId ? null : s.activeChannelId,
      messages: Object.fromEntries(
        Object.entries(s.messages).filter(([id]) => id !== channelId)
      )
    })),

  addMessage: (channelId, message) =>
    set((state) => ({
      messages: {
        ...state.messages,
        [channelId]: [...(state.messages[channelId] ?? []), message]
      }
    })),

  updateMessage: (channelId, messageId, updates) =>
    set((state) => ({
      messages: {
        ...state.messages,
        [channelId]: (state.messages[channelId] ?? []).map((msg) =>
          msg.id === messageId ? { ...msg, ...updates } : msg
        )
      }
    })),

  setPendingDraft: (text) => set({ pendingDraft: text }),

  togglePin: (channelId) =>
    set((s) => ({
      pinnedIds: s.pinnedIds.includes(channelId)
        ? s.pinnedIds.filter((id) => id !== channelId)
        : [...s.pinnedIds, channelId]
    }))
}))
