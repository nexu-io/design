import { Outlet } from "react-router-dom";
import { ActivityBar } from "./ActivityBar";
import { Sidebar } from "./Sidebar";
import { TitleBarDragRegion } from "./WindowChrome";

export function AppLayout(): React.ReactElement {
  return (
    <div className="flex h-screen w-screen overflow-hidden">
      <ActivityBar />
      {/* Base plate — the frosted frame between the window edge and the
          inner floating panel. MUST use the exact same glass recipe as
          the ActivityBar's `surface="glass"` variant (see
          `packages/ui-web/src/primitives/activity-bar.tsx`) so the rail
          and the surrounding frame read as one continuous frosted layer
          rather than two mismatched chromes. */}
      <div className="relative flex flex-1 min-w-0 bg-white/30 backdrop-saturate-150 dark:bg-black/80 dark:backdrop-saturate-125 dark:backdrop-blur-md p-1.5">
        <TitleBarDragRegion />
        {/* Inner floating panel — one continuous surface. Sidebar and
            main share the same `bg-surface-1` so the panel reads as a
            single rounded chrome instead of two tonal columns glued
            together. The thin `border-l` between them still delineates
            the sidebar boundary. */}
        <div className="flex flex-1 min-w-0 overflow-hidden rounded-lg bg-surface-1 shadow-sm">
          <Sidebar />
          <main className="flex-1 min-w-0 border-l border-border-subtle">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}
