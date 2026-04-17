import { useLocation, useNavigate } from "react-router-dom";
import { Building2, GitFork, Palette, User } from "lucide-react";
import { cn } from "@nexu-design/ui-web";
import { ChatSidebar } from "@/components/chat/ChatSidebar";
import { AgentsSidebar } from "@/components/agents/AgentsSidebar";
import { RuntimesSidebar } from "@/components/runtimes/RuntimesSidebar";

const sections = [
  { path: "/chat", label: "Chat" },
  { path: "/agents", label: "Agents" },
  { path: "/runtimes", label: "Runtimes" },
  { path: "/settings", label: "Settings" },
] as const;

export function Sidebar(): React.ReactElement {
  const location = useLocation();

  const currentSection = sections.find((s) => location.pathname.startsWith(s.path));

  const getContent = (): React.ReactNode => {
    if (location.pathname.startsWith("/chat")) return <ChatSidebar />;
    if (location.pathname.startsWith("/agents")) return <AgentsSidebar />;
    if (location.pathname.startsWith("/runtimes")) return <RuntimesSidebar />;
    if (location.pathname.startsWith("/settings")) return <SettingsSidebar />;
    return null;
  };

  return (
    <div className="flex flex-col w-60 border-r border-border bg-background">
      <div className="drag-region h-[38px] shrink-0" />
      {currentSection && (
        <div className="px-3 pb-2">
          <h2 className="text-sm font-semibold">{currentSection.label}</h2>
        </div>
      )}
      {getContent()}
    </div>
  );
}

function SettingsSidebar(): React.ReactElement {
  const navigate = useNavigate();
  const location = useLocation();

  const items = [
    { path: "/settings", label: "Workspace", icon: Building2, exact: true },
    { path: "/settings/repositories", label: "Repositories", icon: GitFork, exact: false },
    { path: "/settings/appearance", label: "Appearance", icon: Palette, exact: false },
    { path: "/settings/profile", label: "Profile", icon: User, exact: false },
  ];

  return (
    <div className="flex-1 overflow-y-auto px-2 space-y-0.5">
      {items.map(({ path, label, icon: Icon, exact }) => {
        const isActive = exact ? location.pathname === path : location.pathname.startsWith(path);
        return (
          <button
            key={path}
            onClick={() => navigate(path)}
            className={cn(
              "flex items-center gap-2.5 w-full px-2.5 py-2 rounded-lg text-sm transition-colors",
              isActive
                ? "bg-accent text-foreground font-medium"
                : "text-muted-foreground hover:bg-accent/50 hover:text-foreground",
            )}
          >
            <Icon className="h-4 w-4 shrink-0" />
            {label}
          </button>
        );
      })}
    </div>
  );
}
