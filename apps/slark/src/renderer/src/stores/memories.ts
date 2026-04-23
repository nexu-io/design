import { create } from "zustand";
import type { Memory, MemoryKind, MemoryMethod, MemorySource } from "@/types";

const DAY = 1000 * 60 * 60 * 24;

function buildSeedMemories(): Memory[] {
  const now = Date.now();
  return [
    {
      id: "mem-welcome-1",
      channelId: "ch-welcome",
      kind: "context",
      content:
        "This channel is the onboarding space for new workspace members. Keep replies friendly and avoid jargon.",
      source: "user",
      authorId: "u-1",
      method: "seed",
      createdAt: now - DAY * 14,
      updatedAt: now - DAY * 14,
    },
    {
      id: "mem-welcome-2",
      channelId: "ch-welcome",
      kind: "preference",
      content:
        "Alice prefers concise summaries (≤3 bullet points) over long prose when agents report back on tasks.",
      source: "agent",
      authorId: "a-code-reviewer",
      method: "seed",
      createdAt: now - DAY * 6,
      updatedAt: now - DAY * 2,
    },
    {
      id: "mem-welcome-3",
      channelId: "ch-welcome",
      kind: "decision",
      content:
        "Default deploy target is staging-east. Production deploys require explicit @mention of a maintainer.",
      source: "user",
      authorId: "u-1",
      method: "seed",
      createdAt: now - DAY * 3,
      updatedAt: now - DAY * 3,
    },
  ];
}

interface NewMemoryInput {
  channelId: string;
  kind: MemoryKind;
  content: string;
  source?: MemorySource;
  authorId?: string;
  method?: MemoryMethod;
  sourceMessageId?: string;
  sourceTopicId?: string;
}

export interface RecentSave {
  memoryId: string;
  channelId: string;
  source: MemorySource;
  /** Anchor so the inline "saved · undo" chip can render under the right message. */
  sourceMessageId?: string;
  at: number;
}

export type ProposalStatus = "dismissed" | "saved";

interface MemoriesState {
  memories: Memory[];
  recentSave: RecentSave | null;
  proposals: Record<string, ProposalStatus>;
  keywordTriggerEnabled: boolean;

  addMemory: (input: NewMemoryInput) => Memory;
  updateMemory: (id: string, updates: Partial<Pick<Memory, "content" | "kind">>) => void;
  removeMemory: (id: string) => void;

  dismissRecentSave: (memoryId?: string) => void;
  undoRecentSave: () => void;

  setProposalStatus: (messageId: string, status: ProposalStatus) => void;

  setKeywordTriggerEnabled: (enabled: boolean) => void;

  clearAllMemories: () => void;
  resetToSeed: () => void;
}

export const useMemoriesStore = create<MemoriesState>((set, get) => ({
  memories: buildSeedMemories(),
  recentSave: null,
  proposals: {},
  keywordTriggerEnabled: true,

  addMemory: (input) => {
    const now = Date.now();
    const memory: Memory = {
      id: `mem-${now}-${Math.random().toString(36).slice(2, 7)}`,
      channelId: input.channelId,
      kind: input.kind,
      content: input.content,
      source: input.source ?? "user",
      authorId: input.authorId ?? "u-1",
      method: input.method ?? "explicit",
      sourceMessageId: input.sourceMessageId,
      sourceTopicId: input.sourceTopicId,
      createdAt: now,
      updatedAt: now,
    };
    set((s) => ({
      memories: [memory, ...s.memories],
      recentSave: {
        memoryId: memory.id,
        channelId: memory.channelId,
        source: memory.source,
        sourceMessageId: memory.sourceMessageId,
        at: now,
      },
    }));
    return memory;
  },

  updateMemory: (id, updates) =>
    set((s) => ({
      memories: s.memories.map((m) =>
        m.id === id ? { ...m, ...updates, updatedAt: Date.now() } : m,
      ),
    })),

  removeMemory: (id) =>
    set((s) => ({
      memories: s.memories.filter((m) => m.id !== id),
      recentSave: s.recentSave?.memoryId === id ? null : s.recentSave,
    })),

  dismissRecentSave: (memoryId) =>
    set((s) => {
      if (!s.recentSave) return s;
      if (memoryId && s.recentSave.memoryId !== memoryId) return s;
      return { ...s, recentSave: null };
    }),

  undoRecentSave: () => {
    const pending = get().recentSave;
    if (!pending) return;
    set((s) => ({
      memories: s.memories.filter((m) => m.id !== pending.memoryId),
      recentSave: null,
    }));
  },

  setProposalStatus: (messageId, status) =>
    set((s) => ({ proposals: { ...s.proposals, [messageId]: status } })),

  setKeywordTriggerEnabled: (enabled) => set({ keywordTriggerEnabled: enabled }),

  clearAllMemories: () => set({ memories: [], recentSave: null, proposals: {} }),

  resetToSeed: () =>
    set({
      memories: buildSeedMemories(),
      recentSave: null,
      proposals: {},
    }),
}));
