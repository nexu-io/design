import { create } from "zustand";
import type { Routine } from "@/types";

const seedRoutines: Routine[] = [
  {
    id: "ro-daily-review",
    channelId: "ch-welcome",
    name: "Daily code review",
    description: "Review open PRs every morning and post a summary to #dev-review.",
    agentId: "a-code-reviewer",
    trigger: { kind: "schedule", cron: "0 9 * * 1-5" },
    status: "active",
    lastRunAt: Date.now() - 1000 * 60 * 60 * 3,
    nextRunAt: Date.now() + 1000 * 60 * 60 * 21,
    runs: [
      {
        id: "run-1",
        startedAt: Date.now() - 1000 * 60 * 60 * 3,
        completedAt: Date.now() - 1000 * 60 * 60 * 3 + 4200,
        kind: "scheduled",
        status: "success",
      },
    ],
    createdBy: "u-1",
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 14,
  },
  {
    id: "ro-pr-triage",
    channelId: "ch-welcome",
    name: "PR triage on open",
    description: "Label and assign reviewers when a PR is opened.",
    agentId: null,
    trigger: {
      kind: "connector",
      connectorService: "github",
      connectorEvent: "pull_request",
      connectorTarget: "nexu/design",
    },
    status: "paused",
    createdBy: "u-1",
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 3,
  },
  {
    id: "ro-showcase-digest",
    channelId: "ch-showcase",
    name: "Weekly design digest",
    description: "Post a highlight reel of last week's design explorations every Monday.",
    agentId: null,
    trigger: { kind: "schedule", cron: "0 10 * * 1" },
    status: "active",
    nextRunAt: Date.now() + 1000 * 60 * 60 * 40,
    createdBy: "u-1",
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 7,
  },
];

interface RoutinesState {
  routines: Routine[];
  selectedRoutineId: string | null;

  setRoutines: (routines: Routine[]) => void;
  addRoutine: (routine: Routine) => void;
  updateRoutine: (id: string, updates: Partial<Routine>) => void;
  removeRoutine: (id: string) => void;
  selectRoutine: (id: string | null) => void;
  toggleRoutine: (id: string) => void;
  runNow: (id: string, opts?: { messageId?: string }) => string;
  completeRun: (routineId: string, runId: string, status: "success" | "error") => void;
}

export const useRoutinesStore = create<RoutinesState>((set) => ({
  routines: seedRoutines,
  selectedRoutineId: null,

  setRoutines: (routines) => set({ routines }),
  addRoutine: (routine) => set((s) => ({ routines: [routine, ...s.routines] })),
  updateRoutine: (id, updates) =>
    set((s) => ({
      routines: s.routines.map((r) => (r.id === id ? { ...r, ...updates } : r)),
    })),
  removeRoutine: (id) => set((s) => ({ routines: s.routines.filter((r) => r.id !== id) })),
  selectRoutine: (id) => set({ selectedRoutineId: id }),
  toggleRoutine: (id) =>
    set((s) => ({
      routines: s.routines.map((r) =>
        r.id === id ? { ...r, status: r.status === "active" ? "paused" : "active" } : r,
      ),
    })),
  runNow: (id, opts) => {
    const runId = `run-${Date.now()}`;
    set((s) => ({
      routines: s.routines.map((r) =>
        r.id === id
          ? {
              ...r,
              lastRunAt: Date.now(),
              runs: [
                {
                  id: runId,
                  startedAt: Date.now(),
                  kind: "manual",
                  status: "running",
                  ...(opts?.messageId ? { messageId: opts.messageId } : {}),
                },
                ...(r.runs ?? []),
              ],
            }
          : r,
      ),
    }));
    return runId;
  },
  completeRun: (routineId, runId, status) =>
    set((s) => ({
      routines: s.routines.map((r) =>
        r.id === routineId
          ? {
              ...r,
              runs: (r.runs ?? []).map((run) =>
                run.id === runId ? { ...run, status, completedAt: Date.now() } : run,
              ),
            }
          : r,
      ),
    })),
}));
