import { create } from 'zustand'
import type { Runtime } from '@/types'

interface RuntimesState {
  runtimes: Runtime[]
  selectedRuntimeId: string | null
  devSimulateNone: boolean
  devSimulateNoDetection: boolean

  setRuntimes: (runtimes: Runtime[]) => void
  addRuntime: (runtime: Runtime) => void
  updateRuntime: (id: string, updates: Partial<Runtime>) => void
  removeRuntime: (id: string) => void
  selectRuntime: (id: string | null) => void
  setDevSimulateNone: (v: boolean) => void
  setDevSimulateNoDetection: (v: boolean) => void
}

export const useRuntimesStore = create<RuntimesState>((set) => ({
  runtimes: [],
  selectedRuntimeId: null,
  devSimulateNone: false,
  devSimulateNoDetection: false,

  setRuntimes: (runtimes) => set({ runtimes }),
  setDevSimulateNone: (v) => set({ devSimulateNone: v }),
  setDevSimulateNoDetection: (v) => set({ devSimulateNoDetection: v }),
  addRuntime: (runtime) => set((s) => ({ runtimes: [...s.runtimes, runtime] })),
  updateRuntime: (id, updates) =>
    set((s) => ({
      runtimes: s.runtimes.map((r) => (r.id === id ? { ...r, ...updates } : r))
    })),
  removeRuntime: (id) => set((s) => ({ runtimes: s.runtimes.filter((r) => r.id !== id) })),
  selectRuntime: (id) => set({ selectedRuntimeId: id })
}))
