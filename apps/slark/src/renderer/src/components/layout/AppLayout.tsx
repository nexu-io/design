import { Outlet } from "react-router-dom";
import { ActivityBar } from "./ActivityBar";
import { Sidebar } from "./Sidebar";

export function AppLayout(): React.ReactElement {
  return (
    <div className="flex h-screen w-screen overflow-hidden">
      <ActivityBar />
      <div className="h-full w-64 shrink-0 bg-surface-0/70 backdrop-blur-md">
        <Sidebar />
      </div>
      <main className="flex-1 min-w-0 bg-surface-1">
        <Outlet />
      </main>
    </div>
  );
}
