import { create } from "zustand";

export type PanelType = "agents" | "agent-detail" | "runtimes" | "settings" | null;

interface PanelState {
  activePanel: PanelType;
  panelData: Record<string, unknown>;
  openPanel: (panel: PanelType, data?: Record<string, unknown>) => void;
  closePanel: () => void;
  togglePanel: (panel: PanelType) => void;
}

export const usePanelStore = create<PanelState>((set, get) => ({
  activePanel: null,
  panelData: {},
  openPanel: (panel, data = {}) => set({ activePanel: panel, panelData: data }),
  closePanel: () => set({ activePanel: null, panelData: {} }),
  togglePanel: (panel) => {
    const current = get().activePanel;
    if (current === panel) {
      set({ activePanel: null, panelData: {} });
    } else {
      set({ activePanel: panel, panelData: {} });
    }
  },
}));
