import { create } from "zustand";

export interface Sticker {
  id: string;
  url: string;
  name: string;
  addedAt: number;
}

interface StickersState {
  stickers: Sticker[];
  addSticker: (url: string, name?: string) => void;
  removeSticker: (id: string) => void;
}

const STORAGE_KEY = "nexu:stickers:v2";

const DEFAULT_STICKERS: Sticker[] = [
  {
    id: "sk-default-claude",
    url: "/stickers/claude-meme.png",
    name: "claude 聪明",
    addedAt: 0,
  },
];

function load(): Sticker[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_STICKERS;
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return DEFAULT_STICKERS;
    return parsed.filter(
      (s) =>
        s &&
        typeof s.id === "string" &&
        typeof s.url === "string" &&
        typeof s.name === "string",
    );
  } catch {
    return DEFAULT_STICKERS;
  }
}

function persist(list: Sticker[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  } catch {
    // ignore quota errors
  }
}

export const useStickersStore = create<StickersState>((set) => ({
  stickers: load(),
  addSticker: (url, name) =>
    set((state) => {
      const next: Sticker = {
        id: `sk-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        url,
        name: name ?? "sticker",
        addedAt: Date.now(),
      };
      const list = [next, ...state.stickers];
      persist(list);
      return { stickers: list };
    }),
  removeSticker: (id) =>
    set((state) => {
      const list = state.stickers.filter((s) => s.id !== id);
      persist(list);
      return { stickers: list };
    }),
}));
