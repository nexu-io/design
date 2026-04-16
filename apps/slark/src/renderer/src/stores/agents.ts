import { create } from 'zustand'
import type { Agent, AgentTemplate } from '@/types'

interface AgentsState {
  agents: Agent[]
  templates: AgentTemplate[]
  selectedAgentId: string | null

  setAgents: (agents: Agent[]) => void
  setTemplates: (templates: AgentTemplate[]) => void
  addAgent: (agent: Agent) => void
  updateAgent: (id: string, updates: Partial<Agent>) => void
  removeAgent: (id: string) => void
  selectAgent: (id: string | null) => void
}

export const useAgentsStore = create<AgentsState>((set) => ({
  agents: [],
  templates: [],
  selectedAgentId: null,

  setAgents: (agents) => set({ agents }),
  setTemplates: (templates) => set({ templates }),
  addAgent: (agent) => set((s) => ({ agents: [...s.agents, agent] })),
  updateAgent: (id, updates) =>
    set((s) => ({
      agents: s.agents.map((a) => (a.id === id ? { ...a, ...updates } : a))
    })),
  removeAgent: (id) => set((s) => ({ agents: s.agents.filter((a) => a.id !== id) })),
  selectAgent: (id) => set({ selectedAgentId: id })
}))
