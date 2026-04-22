import { create } from "zustand";
import type { ChatTaskSession } from "@/types";

const DAY = 1000 * 60 * 60 * 24;
const HOUR = 1000 * 60 * 60;
const MIN = 1000 * 60;

const seedTasks: ChatTaskSession[] = [
  // Coder DM — a finished task
  {
    id: "task-coder-1",
    channelId: "dm-agent-1",
    agentId: "a-1",
    title: "Draft a debounce hook with cancel support",
    status: "success",
    startedAt: Date.now() - 2 * HOUR,
    completedAt: Date.now() - 2 * HOUR + 18 * 1000,
  },
  // Coder DM — a failed task yesterday
  {
    id: "task-coder-2",
    channelId: "dm-agent-1",
    agentId: "a-1",
    title: "Fix the chart tooltip regression in Safari 17",
    status: "error",
    startedAt: Date.now() - DAY - 3 * HOUR,
    completedAt: Date.now() - DAY - 3 * HOUR + 42 * 1000,
  },
  // Coder DM — a successful task 2 days ago
  {
    id: "task-coder-3",
    channelId: "dm-agent-1",
    agentId: "a-1",
    title: "Refactor the retry helper to use exponential backoff",
    status: "success",
    startedAt: Date.now() - 2 * DAY - 4 * HOUR,
    completedAt: Date.now() - 2 * DAY - 4 * HOUR + 1 * MIN + 12 * 1000,
  },
  // DesignReviewer DM — one finished task
  {
    id: "task-dr-1",
    channelId: "dm-agent-2",
    agentId: "a-2",
    title: "Review onboarding screens for contrast issues",
    status: "success",
    startedAt: Date.now() - 6 * HOUR,
    completedAt: Date.now() - 6 * HOUR + 28 * 1000,
  },
];

interface StartTaskInput {
  id?: string;
  channelId: string;
  agentId: string;
  title: string;
  sourceMessageId?: string;
  replyMessageId?: string;
}

interface SessionsState {
  tasks: ChatTaskSession[];
  startTask: (input: StartTaskInput) => string;
  completeTask: (id: string, status: "success" | "error") => void;
  setReplyMessage: (id: string, replyMessageId: string) => void;
}

export const useSessionsStore = create<SessionsState>((set) => ({
  tasks: seedTasks,
  startTask: (input) => {
    const id = input.id ?? `task-${Date.now()}`;
    const task: ChatTaskSession = {
      id,
      channelId: input.channelId,
      agentId: input.agentId,
      title: input.title,
      status: "running",
      startedAt: Date.now(),
      sourceMessageId: input.sourceMessageId,
      replyMessageId: input.replyMessageId,
    };
    set((s) => ({ tasks: [task, ...s.tasks] }));
    return id;
  },
  completeTask: (id, status) =>
    set((s) => ({
      tasks: s.tasks.map((t) =>
        t.id === id ? { ...t, status, completedAt: Date.now() } : t,
      ),
    })),
  setReplyMessage: (id, replyMessageId) =>
    set((s) => ({
      tasks: s.tasks.map((t) => (t.id === id ? { ...t, replyMessageId } : t)),
    })),
}));
