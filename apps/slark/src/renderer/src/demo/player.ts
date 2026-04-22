import { create } from "zustand";

export type DemoId = "uc01" | "uc02" | "uc03";

export const DEMO_META: Record<DemoId, { title: string; subtitle: string; estSeconds: number }> = {
  uc01: {
    title: "UC-01 · 团队初始化",
    subtitle: "独立开发者 3 分钟搭起 Workspace",
    estSeconds: 55,
  },
  uc02: {
    title: "UC-02 · 建群做文件协作",
    subtitle: "PM + 设计 + Agent 围绕文件推进",
    estSeconds: 95,
  },
  uc03: {
    title: "UC-03 · 自动化例程",
    subtitle: "SRE 周报 Routine 定时跑 + 失败恢复",
    estSeconds: 80,
  },
};

interface DemoState {
  playing: DemoId | null;
  caption: string;
  /** Monotonically-incremented key. Bumped on play/stop so running scripts can bail out. */
  runKey: number;
  play: (id: DemoId) => number;
  stop: () => void;
  setCaption: (text: string) => void;
}

export const useDemoPlayer = create<DemoState>((set, get) => ({
  playing: null,
  caption: "",
  runKey: 0,
  play: (id) => {
    const nextKey = get().runKey + 1;
    set({ playing: id, runKey: nextKey, caption: "" });
    return nextKey;
  },
  stop: () => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
    set((s) => ({ playing: null, runKey: s.runKey + 1, caption: "" }));
  },
  setCaption: (text) => set({ caption: text }),
}));

export class DemoAbortError extends Error {
  constructor() {
    super("demo-aborted");
    this.name = "DemoAbortError";
  }
}

export function isAbortError(err: unknown): err is DemoAbortError {
  return err instanceof DemoAbortError;
}
