import { create } from "zustand";
import type { Workspace, Repository } from "@/types";

interface WorkspaceState {
  workspaces: Workspace[];
  workspace: Workspace | null;
  isOnboarded: boolean;
  currentUserId: string;
  pendingWelcomeAgentId: string | null;
  repositories: Repository[];
  setWorkspace: (workspace: Workspace) => void;
  addWorkspace: (workspace: Workspace) => void;
  switchWorkspace: (id: string) => void;
  completeOnboarding: () => void;
  setCurrentUser: (userId: string) => void;
  setPendingWelcomeAgent: (agentId: string | null) => void;
  addRepository: (repo: Repository) => void;
  removeRepository: (id: string) => void;
  updateRepository: (id: string, updates: { description?: string }) => void;
  reset: () => void;
}

const defaultWorkspaces: Workspace[] = [
  {
    id: "ws-1",
    name: "Acme Engineering",
    avatar: "https://api.dicebear.com/9.x/identicon/svg?seed=acme&backgroundColor=6d28d9",
    createdAt: Date.now() - 86400000 * 60,
  },
  {
    id: "ws-2",
    name: "Design Studio",
    avatar: "https://api.dicebear.com/9.x/identicon/svg?seed=design&backgroundColor=db2777",
    createdAt: Date.now() - 86400000 * 30,
  },
  {
    id: "ws-3",
    name: "Personal",
    avatar: "https://api.dicebear.com/9.x/identicon/svg?seed=personal&backgroundColor=0891b2",
    createdAt: Date.now() - 86400000 * 10,
  },
];

export const useWorkspaceStore = create<WorkspaceState>((set, get) => ({
  workspaces: defaultWorkspaces,
  workspace: null,
  isOnboarded: false,
  currentUserId: "u-1",
  pendingWelcomeAgentId: null,
  repositories: [],
  setWorkspace: (workspace) => set({ workspace }),
  addWorkspace: (workspace) =>
    set((s) => ({
      workspaces: [...s.workspaces, workspace],
      workspace,
    })),
  switchWorkspace: (id) => {
    const ws = get().workspaces.find((w) => w.id === id);
    if (ws) set({ workspace: ws });
  },
  completeOnboarding: () => set({ isOnboarded: true }),
  setCurrentUser: (userId) => set({ currentUserId: userId }),
  setPendingWelcomeAgent: (agentId) => set({ pendingWelcomeAgentId: agentId }),
  addRepository: (repo) => set((s) => ({ repositories: [...s.repositories, repo] })),
  removeRepository: (id) =>
    set((s) => ({ repositories: s.repositories.filter((r) => r.id !== id) })),
  updateRepository: (id, updates) =>
    set((s) => ({
      repositories: s.repositories.map((r) => (r.id === id ? { ...r, ...updates } : r)),
    })),
  reset: () =>
    set({
      workspace: null,
      isOnboarded: false,
      currentUserId: "u-1",
      pendingWelcomeAgentId: null,
      repositories: [],
    }),
}));
