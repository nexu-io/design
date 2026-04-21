import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  NavigationMenu,
  NavigationMenuButton,
  NavigationMenuItem,
  NavigationMenuList,
  ScrollArea,
  SidebarContent,
  SidebarHeader,
  Sidebar as UiSidebar,
  cn,
} from "@nexu-design/ui-web";
import {
  Building2,
  ChevronDown,
  LogOut,
  Palette,
  Settings as SettingsIcon,
  User,
  UserPlus,
} from "lucide-react";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { AgentsSidebar } from "@/components/agents/AgentsSidebar";
import { ChatSidebar } from "@/components/chat/ChatSidebar";
import { InvitePeopleDialog } from "@/components/chat/InvitePeopleDialog";
import { RuntimesSidebar } from "@/components/runtimes/RuntimesSidebar";
import { type TranslationKey, useT } from "@/i18n";
import { useWorkspaceStore } from "@/stores/workspace";

import { TitleBarSpacer } from "./WindowChrome";

const sections: { path: string; labelKey: TranslationKey }[] = [
  { path: "/chat", labelKey: "section.chat" },
  { path: "/agents", labelKey: "section.team" },
  { path: "/runtimes", labelKey: "section.runtimes" },
  { path: "/settings", labelKey: "section.settings" },
];

export function Sidebar(): React.ReactElement {
  const location = useLocation();
  const navigate = useNavigate();
  const t = useT();
  const workspace = useWorkspaceStore((s) => s.workspace);
  const reset = useWorkspaceStore((s) => s.reset);
  const [menuOpen, setMenuOpen] = useState(false);
  const [showInvite, setShowInvite] = useState(false);

  const currentSection = sections.find((s) => location.pathname.startsWith(s.path));

  const getContent = (): React.ReactNode => {
    if (location.pathname.startsWith("/chat")) return <ChatSidebar />;
    if (location.pathname.startsWith("/agents")) return <AgentsSidebar />;
    if (location.pathname.startsWith("/runtimes")) return <RuntimesSidebar />;
    if (location.pathname.startsWith("/settings")) return <SettingsSidebar />;
    return null;
  };

  const workspaceInitial = (workspace?.name ?? "N").charAt(0).toUpperCase();
  const workspaceHandle = workspace
    ? `${workspace.name.toLowerCase().replace(/\s+/g, "-")}.nexu.app`
    : "nexu.app";

  return (
    <UiSidebar className="w-64 border-r border-nav-border bg-nav text-nav-fg shadow-none">
      <TitleBarSpacer className="h-[38px]" />

      <SidebarHeader className="no-drag px-3 pb-2">
        {location.pathname.startsWith("/chat") ? (
          <DropdownMenu open={menuOpen} onOpenChange={setMenuOpen}>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                className="flex w-full items-center gap-1.5 rounded-md px-1.5 py-1 text-left hover:bg-nav-hover transition-colors"
              >
                <span className="truncate text-[15px] font-bold tracking-tight">
                  {workspace?.name ?? "Nexu"}
                </span>
                <ChevronDown
                  className={cn(
                    "h-3.5 w-3.5 shrink-0 text-nav-muted transition-transform",
                    menuOpen && "rotate-180",
                  )}
                />
              </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="start" className="no-drag mt-1 w-72 rounded-xl">
              <div className="flex items-center gap-3 border-b border-border px-3 py-3">
                {workspace?.avatar ? (
                  <img src={workspace.avatar} alt="" className="h-10 w-10 shrink-0 rounded-lg" />
                ) : (
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-nexu-primary/80 to-nexu-primary font-bold text-accent-fg">
                    {workspaceInitial}
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-semibold">{workspace?.name ?? "Nexu"}</div>
                  <div className="truncate text-[11px] text-muted-foreground">
                    {workspaceHandle}
                  </div>
                </div>
              </div>

              <div className="p-1.5">
                <DropdownMenuItem
                  onClick={() => setShowInvite(true)}
                  className="gap-2.5 rounded-md px-2.5 py-2 text-xs"
                >
                  <UserPlus className="h-3.5 w-3.5 shrink-0" />
                  <span className="flex-1 truncate">
                    {workspace?.name
                      ? `Invite people to ${workspace.name}`
                      : t("workspace.inviteMembers")}
                  </span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => navigate("/settings")}
                  className="gap-2.5 rounded-md px-2.5 py-2 text-xs"
                >
                  <SettingsIcon className="h-3.5 w-3.5 shrink-0" />
                  <span className="flex-1">{t("settings.workspace")}</span>
                </DropdownMenuItem>
              </div>

              <DropdownMenuSeparator />

              <div className="p-1.5">
                <DropdownMenuItem
                  onClick={() => {
                    reset();
                    navigate("/");
                  }}
                  className="gap-2.5 rounded-md px-2.5 py-2 text-xs text-destructive focus:text-destructive"
                >
                  <LogOut className="h-3.5 w-3.5 shrink-0" />
                  <span className="flex-1">{t("workspace.logOut")}</span>
                </DropdownMenuItem>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : currentSection && !location.pathname.startsWith("/runtimes") ? (
          /* The runtimes panel owns its own header row (label + online
             count on a single line) so we skip the generic label here
             — otherwise the label sits at a different indent than the
             content below it. */
          <div className="mt-1 px-1.5 text-[11px] font-medium uppercase tracking-wider text-nav-muted">
            {t(currentSection.labelKey)}
          </div>
        ) : null}
      </SidebarHeader>

      <SidebarContent className="min-h-0">{getContent()}</SidebarContent>

      <InvitePeopleDialog open={showInvite} onOpenChange={setShowInvite} />
    </UiSidebar>
  );
}

function SettingsSidebar(): React.ReactElement {
  const navigate = useNavigate();
  const location = useLocation();
  const t = useT();

  const items: {
    path: string;
    label: string;
    icon: typeof Building2;
    exact: boolean;
  }[] = [
    { path: "/settings", label: t("settings.workspace"), icon: Building2, exact: true },
    { path: "/settings/appearance", label: t("settings.appearance"), icon: Palette, exact: false },
    { path: "/settings/profile", label: t("settings.profile"), icon: User, exact: false },
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
                  className="rounded-md px-2.5 py-1.5 text-sm text-nav-muted data-[active=true]:bg-nav-active data-[active=true]:text-nav-active-fg hover:bg-nav-hover hover:text-nav-fg"
                >
                  <Icon className="h-4 w-4 shrink-0" />
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
