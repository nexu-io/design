import { create } from "zustand";

/* ────────────────────────────────────────────────────────────
   Shell layout constraints (Feishu-style window resize).

   The app has three horizontal regions:
     ┌─────────────┬─────────────┬─────────────────────────┐
     │ ActivityBar │   Sidebar   │          Main           │
     └─────────────┴─────────────┴─────────────────────────┘

   ActivityBar (nav rail):
     - collapsed default (64px) shows icons only;
     - can be drag-expanded up to ~200px to reveal labels
       (Chat / Teammate / Runtimes / Settings).
     - No auto-collapse — purely a user preference.

   Sidebar (chat list / runtimes list / settings list):
     - drag-resizable in [SIDEBAR_MIN, SIDEBAR_MAX];
     - auto-collapses to 0 when the right-of-rail panel can no
       longer fit `MAIN_MIN_WIDTH + SIDEBAR_MIN_WIDTH` (plus the
       two 4px resize handles). As soon as the window widens back
       past that threshold the sidebar re-appears at the user's
       preferred width.

   Main (chat view / agents / runtimes / settings):
     - no hard preference; always fills the remaining space;
     - `MAIN_MIN_WIDTH` is the floor that governs Sidebar
       auto-collapse (see above).
   ──────────────────────────────────────────────────────────── */

export const ACTIVITY_BAR_MIN_WIDTH = 64;
export const ACTIVITY_BAR_MAX_WIDTH = 200;
export const ACTIVITY_BAR_DEFAULT_WIDTH = 64;
/**
 * Width threshold above which the ActivityBar renders in
 * "expanded" mode: items become full-width rows with labels
 * next to the icon. Below the threshold items stay square
 * 40×40 icons. Chosen at 96px so a fingertip-drag past the
 * default `w-16` reliably flips the label layer without
 * visual jitter.
 */
export const ACTIVITY_BAR_EXPAND_THRESHOLD = 96;

export const SIDEBAR_MIN_WIDTH = 220;
export const SIDEBAR_MAX_WIDTH = 400;
export const SIDEBAR_DEFAULT_WIDTH = 256;
/**
 * Minimum main-pane width. The Sidebar auto-collapses when the
 * right-of-rail panel width drops below
 * `MAIN_MIN_WIDTH + SIDEBAR_MIN_WIDTH`. Set to 520 so the
 * collapse triggers at a window width the user can actually
 * reach by dragging (Electron's `minWidth` is lowered to
 * match); any smaller and the chat header + composer would
 * start reading as cramped.
 */
export const MAIN_MIN_WIDTH = 520;

const ACTIVITY_BAR_STORAGE_KEY = "nexu-activity-bar-width";
const SIDEBAR_STORAGE_KEY = "nexu-sidebar-width";

const clampActivityBar = (value: number): number =>
  Math.max(ACTIVITY_BAR_MIN_WIDTH, Math.min(ACTIVITY_BAR_MAX_WIDTH, Math.round(value)));

const clampSidebar = (value: number): number =>
  Math.max(SIDEBAR_MIN_WIDTH, Math.min(SIDEBAR_MAX_WIDTH, Math.round(value)));

const readPersistedWidth = (
  key: string,
  fallback: number,
  clamp: (n: number) => number,
): number => {
  if (typeof localStorage === "undefined") return fallback;
  try {
    const stored = localStorage.getItem(key);
    if (stored === null) return fallback;
    const parsed = Number.parseInt(stored, 10);
    if (!Number.isFinite(parsed)) return fallback;
    return clamp(parsed);
  } catch {
    return fallback;
  }
};

const writePersistedWidth = (key: string, value: number): void => {
  try {
    localStorage.setItem(key, String(value));
  } catch {
    /* ignore storage errors (private mode, quota, etc.) */
  }
};

interface LayoutState {
  /** User-preferred ActivityBar width; clamped to [MIN, MAX]. */
  activityBarWidth: number;
  /** User-preferred Sidebar width; clamped to [MIN, MAX]. */
  sidebarWidth: number;
  setActivityBarWidth: (width: number) => void;
  setSidebarWidth: (width: number) => void;
}

export const useLayoutStore = create<LayoutState>((set) => ({
  activityBarWidth: readPersistedWidth(
    ACTIVITY_BAR_STORAGE_KEY,
    ACTIVITY_BAR_DEFAULT_WIDTH,
    clampActivityBar,
  ),
  sidebarWidth: readPersistedWidth(SIDEBAR_STORAGE_KEY, SIDEBAR_DEFAULT_WIDTH, clampSidebar),
  setActivityBarWidth: (width) => {
    const next = clampActivityBar(width);
    writePersistedWidth(ACTIVITY_BAR_STORAGE_KEY, next);
    set({ activityBarWidth: next });
  },
  setSidebarWidth: (width) => {
    const next = clampSidebar(width);
    writePersistedWidth(SIDEBAR_STORAGE_KEY, next);
    set({ sidebarWidth: next });
  },
}));
