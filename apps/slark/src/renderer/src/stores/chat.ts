import { create } from "zustand";
import type { Channel, IssueMeta, MemberRef, Message, QuotedMessage } from "@/types";
import { useTopicsStore } from "./topics";

export interface PendingQuote {
  channelId: string;
  /** When set, the quote is scoped to this topic instead of the channel feed. */
  topicId?: string;
  quote: QuotedMessage;
}

interface ChatState {
  channels: Channel[];
  activeChannelId: string | null;
  messages: Record<string, Message[]>;
  pendingDraft: string | null;
  pendingScrollToMessageId: string | null;
  pendingScrollFlashCount: number;
  pendingQuote: PendingQuote | null;
  pinnedIds: string[];
  hiddenIds: string[];

  setChannels: (channels: Channel[]) => void;
  setActiveChannel: (id: string) => void;
  addChannel: (channel: Channel) => void;
  updateChannel: (channelId: string, updates: Partial<Channel>) => void;
  removeChannel: (channelId: string) => void;
  addMessage: (channelId: string, message: Message) => void;
  updateMessage: (channelId: string, messageId: string, updates: Partial<Message>) => void;
  recallMessage: (channelId: string, messageId: string) => void;
  setPendingDraft: (text: string | null) => void;
  setPendingScrollToMessage: (messageId: string | null, flashCount?: number) => void;
  setPendingQuote: (quote: PendingQuote | null) => void;
  togglePin: (channelId: string) => void;
  toggleHide: (id: string) => void;
  convertToTopic: (channelId: string, messageId: string, titleOverride?: string) => string | null;
  convertToIssue: (
    channelId: string,
    messageId: string,
    input?: { title?: string; assignee?: MemberRef; labels?: string[] },
  ) => string | null;
}

function deriveTitleFromContent(content: string, fallback: string): string {
  const stripped = content.replace(/\s+/g, " ").trim();
  if (!stripped) return fallback;
  return stripped.length > 60 ? `${stripped.slice(0, 60)}…` : stripped;
}

export const useChatStore = create<ChatState>((set, get) => ({
  channels: [],
  activeChannelId: null,
  messages: {},
  pendingDraft: null,
  pendingScrollToMessageId: null,
  pendingScrollFlashCount: 1,
  pendingQuote: null,
  pinnedIds: [],
  hiddenIds: [],

  setChannels: (channels) => set({ channels }),

  setActiveChannel: (id) => set({ activeChannelId: id }),

  addChannel: (channel) => set((s) => ({ channels: [...s.channels, channel] })),

  updateChannel: (channelId, updates) =>
    set((s) => ({
      channels: s.channels.map((c) => (c.id === channelId ? { ...c, ...updates } : c)),
    })),

  removeChannel: (channelId) =>
    set((s) => ({
      channels: s.channels.filter((c) => c.id !== channelId),
      activeChannelId: s.activeChannelId === channelId ? null : s.activeChannelId,
      messages: Object.fromEntries(Object.entries(s.messages).filter(([id]) => id !== channelId)),
    })),

  addMessage: (channelId, message) =>
    set((state) => ({
      messages: {
        ...state.messages,
        [channelId]: [...(state.messages[channelId] ?? []), message],
      },
    })),

  updateMessage: (channelId, messageId, updates) =>
    set((state) => ({
      messages: {
        ...state.messages,
        [channelId]: (state.messages[channelId] ?? []).map((msg) =>
          msg.id === messageId ? { ...msg, ...updates } : msg,
        ),
      },
    })),

  recallMessage: (channelId, messageId) =>
    set((state) => ({
      messages: {
        ...state.messages,
        [channelId]: (state.messages[channelId] ?? []).map((msg) =>
          msg.id === messageId
            ? {
                ...msg,
                recalled: true,
                recalledAt: Date.now(),
                content: "",
                blocks: undefined,
                reactions: [],
                isStreaming: false,
              }
            : msg,
        ),
      },
    })),

  setPendingDraft: (text) => set({ pendingDraft: text }),

  setPendingScrollToMessage: (messageId, flashCount = 1) =>
    set({ pendingScrollToMessageId: messageId, pendingScrollFlashCount: flashCount }),

  setPendingQuote: (quote) => set({ pendingQuote: quote }),

  togglePin: (channelId) =>
    set((s) => ({
      pinnedIds: s.pinnedIds.includes(channelId)
        ? s.pinnedIds.filter((id) => id !== channelId)
        : [...s.pinnedIds, channelId],
    })),

  toggleHide: (id) =>
    set((s) => ({
      hiddenIds: s.hiddenIds.includes(id)
        ? s.hiddenIds.filter((x) => x !== id)
        : [...s.hiddenIds, id],
    })),

  convertToTopic: (channelId, messageId, titleOverride) => {
    const rootMsg = get().messages[channelId]?.find((m: Message) => m.id === messageId);
    if (!rootMsg) return null;
    if (rootMsg.derivedTopicId) return rootMsg.derivedTopicId;

    const participants = rootMsg.mentions.length
      ? [rootMsg.sender, ...rootMsg.mentions]
      : [rootMsg.sender];

    const topicId = useTopicsStore.getState().createTopic({
      rootChannelId: channelId,
      rootMessageId: messageId,
      title: titleOverride ?? deriveTitleFromContent(rootMsg.content, "Topic"),
      participants,
    });

    set((s) => ({
      messages: {
        ...s.messages,
        [channelId]: (s.messages[channelId] ?? []).map((m) =>
          m.id === messageId ? { ...m, derivedTopicId: topicId } : m,
        ),
      },
    }));

    return topicId;
  },

  convertToIssue: (channelId, messageId, input) => {
    const rootMsg = get().messages[channelId]?.find((m: Message) => m.id === messageId);
    if (!rootMsg) return null;

    // Auto-detect assignee from mentions — prefer an agent mention, else fall
    // back to the first user mention (issues can be assigned to people too).
    const autoAssignee: MemberRef | undefined =
      rootMsg.mentions.find((m) => m.kind === "agent") ?? rootMsg.mentions[0];
    const issueMeta: IssueMeta = {
      status: "todo",
      assignee: input?.assignee ?? autoAssignee,
      labels: input?.labels,
      createdAt: Date.now(),
    };

    const title = input?.title ?? deriveTitleFromContent(rootMsg.content, "Issue");

    let topicId: string | null = rootMsg.derivedTopicId ?? null;
    if (!topicId) {
      const participants = rootMsg.mentions.length
        ? [rootMsg.sender, ...rootMsg.mentions]
        : [rootMsg.sender];
      topicId = useTopicsStore.getState().createTopic({
        rootChannelId: channelId,
        rootMessageId: messageId,
        title,
        participants,
        issue: issueMeta,
      });
      const newTopicId = topicId;
      set((s) => ({
        messages: {
          ...s.messages,
          [channelId]: (s.messages[channelId] ?? []).map((m) =>
            m.id === messageId ? { ...m, derivedTopicId: newTopicId } : m,
          ),
        },
      }));
    } else {
      useTopicsStore.getState().setIssueMeta(topicId, issueMeta);
      useTopicsStore.getState().updateTopic(topicId, { title });
    }

    return topicId;
  },
}));
