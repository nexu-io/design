import { Outlet } from "react-router-dom";
import { ActivityBar } from "./ActivityBar";
import { Sidebar } from "./Sidebar";

export function AppLayout(): React.ReactElement {
  return (
    <div className="flex h-screen w-screen overflow-hidden bg-surface-0 text-text-primary">
      <ActivityBar />
      <Sidebar />
      <main className="min-w-0 flex-1 bg-background">
        <Outlet />
      </main>
    </div>
  );
}
