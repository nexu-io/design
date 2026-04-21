import { create } from "zustand";
import type { Routine } from "@/types";

const seedRoutines: Routine[] = [
  {
    id: "ro-daily-review",
    name: "Daily code review",
    description: "Review open PRs every morning and post a summary to #dev-review.",
    agentId: "a-code-reviewer",
    trigger: { kind: "schedule", cron: "0 9 * * 1-5" },
    connectors: ["github", "slack"],
    status: "active",
    lastRunAt: Date.now() - 1000 * 60 * 60 * 3,
    nextRunAt: Date.now() + 1000 * 60 * 60 * 21,
    createdBy: "u-1",
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 14,
  },
  {
    id: "ro-pr-triage",
    name: "PR triage on open",
    description: "Label and assign reviewers when a PR is opened.",
    agentId: null,
    trigger: {
      kind: "github",
      githubRepo: "nexu/design",
      githubEvent: "pull_request",
    },
    connectors: ["github", "linear"],
    status: "paused",
    createdBy: "u-1",
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 3,
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
}));
