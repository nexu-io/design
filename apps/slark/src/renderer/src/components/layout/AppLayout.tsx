import { Outlet } from "react-router-dom";
import { ActivityBar } from "./ActivityBar";
import { Sidebar } from "./Sidebar";
import { TitleBarDragRegion } from "./WindowChrome";

export function AppLayout(): React.ReactElement {
  return (
    <div className="flex h-screen w-screen overflow-hidden">
      <ActivityBar />
      {/* Base plate — continuous surface extending from the ActivityBar */}
      <div className="relative flex flex-1 min-w-0 bg-white/30 backdrop-saturate-150 p-1.5">
        <TitleBarDragRegion />
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
