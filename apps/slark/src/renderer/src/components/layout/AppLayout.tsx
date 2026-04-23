import { ResizableHandle } from "@nexu-design/ui-web";
import { useLayoutEffect, useRef, useState } from "react";
import { Outlet } from "react-router-dom";

import {
  ACTIVITY_BAR_MAX_WIDTH,
  ACTIVITY_BAR_MIN_WIDTH,
  MAIN_MIN_WIDTH,
  SIDEBAR_MAX_WIDTH,
  SIDEBAR_MIN_WIDTH,
  useLayoutStore,
} from "@/stores/layout";

import { ActivityBar } from "./ActivityBar";
import { Sidebar } from "./Sidebar";
import { TitleBarDragRegion } from "./WindowChrome";

/**
 * Width of the invisible resize handles (rail splitter + sidebar
 * splitter). 4px is the smallest hit-zone that still feels reliably
 * grabbable with a trackpad; a single column of pixels is too
 * slippery.
 */
const HANDLE_WIDTH = 4;

export function AppLayout(): React.ReactElement {
  /* ────────────────────────────────────────────────────────────
     Layout model — "frosted base plate + floating island".

     Window chrome decomposes left-to-right into:
       1. ActivityBar — fixed width, native vibrancy frosted glass.
       2. Base plate — transparent HTML, lets macOS sidebar vibrancy
          render a frosted strip around the island on three sides
          (top / right / bottom). The left side is intentionally
          `pl-0` so the island sits flush against the rail, removing
          the visible "gap between rail and sidebar" the user
          flagged on the Feishu-parity pass.
       3. Floating island — solid `bg-surface-1` rounded panel
          with a soft `shadow-sm`. Only the right side is rounded
          (`rounded-r-lg`); the left side is flat so it can butt
          directly against the rail without leaving rounded-corner
          slivers of vibrancy showing between them.

     Why this shape works for the macOS transparent-window resize
     lag ("浮岛跟不上底板"):
       - During a native window-edge drag, Chromium's compositor
         pauses HTML painting, but macOS native vibrancy keeps
         repainting. The visible artifact is the HTML layer (rail
         excluded, since its width is fixed) appearing to trail
         the vibrancy layer by a few frames.
       - We can't structurally eliminate that — alpha-composited
         windows just have this tax on macOS. The mitigation lives
         in `main/index.ts`: a `will-resize` listener calls
         `webContents.invalidate()` to nudge Chromium into
         repainting on every resize tick, which materially narrows
         the trailing gap. See main/index.ts for the rationale.

     Sidebar width derivation:
       - On first paint `panelWidth === 0` (ResizeObserver hasn't
         reported yet). Skip clamping so the user sees their
         persisted width, not a flash of min width.
       - Once measured:
           usable        = panelWidth - 2·HANDLE_WIDTH
           maxSidebar    = usable − MAIN_MIN_WIDTH
           collapsed     = maxSidebar < SIDEBAR_MIN_WIDTH
           effectiveWidth = clamp(sidebarPref, SIDEBAR_MIN, min(SIDEBAR_MAX, maxSidebar))
         When `collapsed` the sidebar and its splitter are both
         unmounted — main takes the full usable width.
     ──────────────────────────────────────────────────────────── */
  const panelRef = useRef<HTMLDivElement>(null);
  const [panelWidth, setPanelWidth] = useState(0);
  const sidebarPref = useLayoutStore((s) => s.sidebarWidth);
  const setSidebarWidth = useLayoutStore((s) => s.setSidebarWidth);
  const activityBarWidth = useLayoutStore((s) => s.activityBarWidth);
  const setActivityBarWidth = useLayoutStore((s) => s.setActivityBarWidth);
  const sidebarDragStartRef = useRef(0);
  const activityBarDragStartRef = useRef(0);

  useLayoutEffect(() => {
    const el = panelRef.current;
    if (!el) return;
    setPanelWidth(el.getBoundingClientRect().width);

    if (typeof ResizeObserver === "undefined") return;
    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (entry) setPanelWidth(entry.contentRect.width);
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const usableWidth = panelWidth > 0 ? panelWidth - HANDLE_WIDTH * 2 : 0;
  const maxSidebarByMain = usableWidth > 0 ? usableWidth - MAIN_MIN_WIDTH : SIDEBAR_MAX_WIDTH;
  const sidebarCollapsed = usableWidth > 0 && maxSidebarByMain < SIDEBAR_MIN_WIDTH;
  const effectiveSidebarWidth = sidebarCollapsed
    ? 0
    : Math.max(
        SIDEBAR_MIN_WIDTH,
        Math.min(Math.min(SIDEBAR_MAX_WIDTH, maxSidebarByMain), sidebarPref),
      );

  const handleSidebarResizeStart = (): void => {
    sidebarDragStartRef.current = effectiveSidebarWidth;
  };

  const handleSidebarResize = (delta: number): void => {
    const next = sidebarDragStartRef.current + delta;
    setSidebarWidth(Math.min(next, maxSidebarByMain));
  };

  const handleActivityBarResizeStart = (): void => {
    activityBarDragStartRef.current = activityBarWidth;
  };

  const handleActivityBarResize = (delta: number): void => {
    setActivityBarWidth(activityBarDragStartRef.current + delta);
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden">
      <ActivityBar />
      {/* Base plate: frosted frame around the floating island on
          all four sides. The HTML tint here MUST stay in lock-step
          with the rail's `surface="glass"` variant (see
          `packages/ui-web/src/primitives/activity-bar.tsx`) —
          otherwise rail and frame read as two different materials
          and produce a visible cut.
          Light: `bg-white/30 backdrop-saturate-150` — white wash on
          light sidebar vibrancy.
          Dark: `bg-surface-0/85` — a `surface-0` wash over native
          vibrancy. This is required because the app has its own
          dark-mode toggle that is NOT coupled to the OS appearance.
          A user running macOS in Light Mode but toggling the app
          into dark mode keeps a **light** native vibrancy behind
          the chrome; the 85 % overlay mutes that leak to a
          non-distracting amount while still letting a frosted feel
          come through — going higher starts to read as flat opaque.
          `backdrop-saturate-100` explicitly neutralises the
          light-mode saturate boost so any residual leak isn't
          colour-amplified.
          Keeping rail and frame tinted together also keeps the
          transparent-window resize lag in sync: both regions
          freeze together during a drag, so the only lag edge is
          the outer window boundary — which the
          `will-resize → webContents.invalidate()` mitigation in
          `main/index.ts` already narrows to a single frame.
          `p-1` = 4px — small enough that rail and sidebar read as
          "adjacent panels, not split by a gutter", large enough
          to let the island's rounded corners breathe and show the
          drop shadow without getting clipped. */}
      <div className="relative flex flex-1 min-w-0 overflow-hidden bg-white/30 p-1 backdrop-saturate-150 dark:bg-surface-0/85 dark:backdrop-saturate-100">
        <TitleBarDragRegion />

        {/* Floating island — the inner panel. Fully rounded on all
            four corners. Shadow is a single very soft drop only —
            2px offset + 4px blur at 6 % alpha. No hairline ring
            because a zero-blur outer spread draws a crisp line on
            ALL four sides; the left side of the island sat on
            light vibrancy and the ring read as a hard seam with
            the rail, which the user flagged.
            A plain drop shadow fades toward the top and the left
            (directionally weighted by the y-offset), so the
            island's top/left edges are defined only by the subtle
            bg difference between surface-1 and sidebar vibrancy,
            while the bottom-right still shows a soft lift. */}
        <div
          ref={panelRef}
          className="relative flex flex-1 min-w-0 overflow-hidden rounded-lg bg-surface-1 shadow-[0_2px_4px_rgba(0,0,0,0.06)]"
        >
          {/* Rail-width splitter. Positioned absolutely at x=0 of the
              island so it overlays the first 4px of the Sidebar (or
              of `main`, when Sidebar is collapsed) without taking
              any extra horizontal space. User-facing intent: "drag
              the Sidebar's left edge to widen the navigation rail",
              which matches Feishu's Mac client. Kept transparent /
              no hover tint — zero visible seam between rail and
              Sidebar, only the `col-resize` cursor signals the
              affordance. `z-10` sits above Sidebar/main content but
              below `TitleBarDragRegion` (`z-20`), so the top 40px
              of this strip still registers as window-drag area. */}
          <ResizableHandle
            onResizeStart={handleActivityBarResizeStart}
            onResize={handleActivityBarResize}
            aria-label="Resize navigation rail"
            aria-valuemin={ACTIVITY_BAR_MIN_WIDTH}
            aria-valuemax={ACTIVITY_BAR_MAX_WIDTH}
            aria-valuenow={activityBarWidth}
            className="absolute inset-y-0 left-0 z-10 w-1 bg-transparent"
          />

          {!sidebarCollapsed && (
            <>
              <Sidebar style={{ width: effectiveSidebarWidth }} />
              {/* Sidebar → main splitter. 4px hit zone with a 1px
                  visual divider centred inside, mirroring how Slack /
                  Feishu mark the column boundary. */}
              <ResizableHandle
                onResizeStart={handleSidebarResizeStart}
                onResize={handleSidebarResize}
                aria-label="Resize sidebar"
                aria-valuemin={SIDEBAR_MIN_WIDTH}
                aria-valuemax={SIDEBAR_MAX_WIDTH}
                aria-valuenow={effectiveSidebarWidth}
                className="group w-1 bg-transparent transition-colors hover:bg-border/20 data-[dragging=true]:bg-accent/40"
              >
                <div className="mx-auto h-full w-px bg-border-subtle transition-colors group-hover:bg-border" />
              </ResizableHandle>
            </>
          )}

          <main className="flex-1 min-w-0">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}
