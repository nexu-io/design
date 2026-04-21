import { create } from "zustand";
import type { IssueMeta, IssueStatus, MemberRef, Message, Topic } from "@/types";

interface TopicsState {
  topics: Record<string, Topic>;
  messages: Record<string, Message[]>;
  activeTopicId: string | null;
  readAt: Record<string, number>;
  archived: Record<string, boolean>;

  createTopic: (input: {
    rootChannelId: string;
    rootMessageId: string;
    title: string;
    participants: MemberRef[];
    issue?: IssueMeta;
  }) => string;
  addTopicMessage: (topicId: string, message: Message) => void;
  updateTopicMessage: (topicId: string, messageId: string, updates: Partial<Message>) => void;
  setActiveTopic: (topicId: string | null) => void;
  updateTopic: (topicId: string, updates: Partial<Topic>) => void;
  setIssueMeta: (topicId: string, issue: IssueMeta | undefined) => void;
  setIssueStatus: (topicId: string, status: IssueStatus) => void;
  setIssueAssignee: (topicId: string, agentId: string | undefined) => void;
  markTopicRead: (topicId: string) => void;
  markAllRead: (topicIds: string[]) => void;
  archiveTopics: (topicIds: string[]) => void;
  unarchiveTopic: (topicId: string) => void;
}

function randomId(): string {
  return `tp-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;
}

export const useTopicsStore = create<TopicsState>((set) => ({
  topics: {},
  messages: {},
  activeTopicId: null,
  readAt: {},
  archived: {},

  createTopic: ({ rootChannelId, rootMessageId, title, participants, issue }) => {
    const id = randomId();
    set((s) => ({
      topics: {
        ...s.topics,
        [id]: {
          id,
          rootChannelId,
          rootMessageId,
          title,
          createdAt: Date.now(),
          participants,
          issue,
        },
      },
      messages: { ...s.messages, [id]: [] },
    }));
    return id;
  },

  addTopicMessage: (topicId, message) =>
    set((s) => ({
      messages: {
        ...s.messages,
        [topicId]: [...(s.messages[topicId] ?? []), message],
      },
    })),

  updateTopicMessage: (topicId, messageId, updates) =>
    set((s) => ({
      messages: {
        ...s.messages,
        [topicId]: (s.messages[topicId] ?? []).map((m) =>
          m.id === messageId ? { ...m, ...updates } : m,
        ),
      },
    })),

  setActiveTopic: (topicId) => set({ activeTopicId: topicId }),

  updateTopic: (topicId, updates) =>
    set((s) =>
      s.topics[topicId]
        ? { topics: { ...s.topics, [topicId]: { ...s.topics[topicId], ...updates } } }
        : s,
    ),

  setIssueMeta: (topicId, issue) =>
    set((s) =>
      s.topics[topicId]
        ? { topics: { ...s.topics, [topicId]: { ...s.topics[topicId], issue } } }
        : s,
    ),

  setIssueStatus: (topicId, status) =>
    set((s) => {
      const topic = s.topics[topicId];
      if (!topic?.issue) return s;
      const nextIssue: IssueMeta = { ...topic.issue, status };
      return { topics: { ...s.topics, [topicId]: { ...topic, issue: nextIssue } } };
    }),

  setIssueAssignee: (topicId, agentId) =>
    set((s) => {
      const topic = s.topics[topicId];
      if (!topic?.issue) return s;
      const nextIssue: IssueMeta = { ...topic.issue, assigneeAgentId: agentId };
      return { topics: { ...s.topics, [topicId]: { ...topic, issue: nextIssue } } };
    }),

  markTopicRead: (topicId) =>
    set((s) => ({ readAt: { ...s.readAt, [topicId]: Date.now() } })),

  markAllRead: (topicIds) =>
    set((s) => {
      const now = Date.now();
      const next = { ...s.readAt };
      for (const id of topicIds) next[id] = now;
      return { readAt: next };
    }),

  archiveTopics: (topicIds) =>
    set((s) => {
      const next = { ...s.archived };
      for (const id of topicIds) next[id] = true;
      return { archived: next };
    }),

  unarchiveTopic: (topicId) =>
    set((s) => {
      if (!s.archived[topicId]) return s;
      const next = { ...s.archived };
      delete next[topicId];
      return { archived: next };
    }),
}));
