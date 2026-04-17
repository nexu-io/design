import { useLocation, useNavigate } from "react-router-dom";
import { Building2, GitFork, Palette, User } from "lucide-react";
import {
  NavigationMenu,
  NavigationMenuButton,
  NavigationMenuItem,
  NavigationMenuList,
  ScrollArea,
  Sidebar as UiSidebar,
  SidebarContent,
  SidebarHeader,
} from "@nexu-design/ui-web";

import { AgentsSidebar } from "@/components/agents/AgentsSidebar";
import { ChatSidebar } from "@/components/chat/ChatSidebar";
import { RuntimesSidebar } from "@/components/runtimes/RuntimesSidebar";

import { TitleBarSpacer } from "./WindowChrome";

const sections = [
  { path: "/chat", label: "Chat" },
  { path: "/agents", label: "Agents" },
  { path: "/runtimes", label: "Runtimes" },
  { path: "/settings", label: "Settings" },
] as const;

export function Sidebar(): React.ReactElement {
  const location = useLocation();

  const currentSection = sections.find((section) => location.pathname.startsWith(section.path));

  const getContent = (): React.ReactNode => {
    if (location.pathname.startsWith("/chat")) return <ChatSidebar />;
    if (location.pathname.startsWith("/agents")) return <AgentsSidebar />;
    if (location.pathname.startsWith("/runtimes")) return <RuntimesSidebar />;
    if (location.pathname.startsWith("/settings")) return <SettingsSidebar />;
    return null;
  };

  return (
    <UiSidebar className="w-64 bg-surface-1">
      <TitleBarSpacer />

      {currentSection ? (
        <SidebarHeader className="px-[18px] pb-3">
          <h2 className="text-sm font-semibold text-text-heading">{currentSection.label}</h2>
        </SidebarHeader>
      ) : null}

      <SidebarContent className="min-h-0">{getContent()}</SidebarContent>
    </UiSidebar>
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
    <ScrollArea className="h-full px-2 pb-3">
      <NavigationMenu>
        <NavigationMenuList>
          {items.map(({ path, label, icon: Icon, exact }) => {
            const isActive = exact
              ? location.pathname === path
              : location.pathname.startsWith(path);

            return (
              <NavigationMenuItem key={path}>
                <NavigationMenuButton
                  active={isActive}
                  onClick={() => navigate(path)}
                  className="rounded-lg text-[13px]"
                >
                  <Icon className="size-4 shrink-0" />
                  <span>{label}</span>
                </NavigationMenuButton>
              </NavigationMenuItem>
            );
          })}
        </NavigationMenuList>
      </NavigationMenu>
    </ScrollArea>
  );
}
