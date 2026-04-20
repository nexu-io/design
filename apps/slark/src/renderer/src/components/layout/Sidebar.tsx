import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Building2,
  Palette,
  User,
  ChevronDown,
  UserPlus,
  Settings as SettingsIcon,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ChatSidebar } from "@/components/chat/ChatSidebar";
import { AgentsSidebar } from "@/components/agents/AgentsSidebar";
import { RuntimesSidebar } from "@/components/runtimes/RuntimesSidebar";
import { InvitePeopleDialog } from "@/components/chat/InvitePeopleDialog";
import { useWorkspaceStore } from "@/stores/workspace";
import { useT, type TranslationKey } from "@/i18n";

import { WindowChrome } from "./WindowChrome";

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
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!menuOpen) return;
    const handler = (e: MouseEvent): void => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [menuOpen]);

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
    <div className="flex flex-col w-64 bg-nav text-nav-fg shadow-[inset_-1px_0_0_rgba(0,0,0,0.2)]">
      <WindowChrome className="h-[38px]" />
      <div className="no-drag px-3 pb-2">
        {location.pathname.startsWith("/chat") && (
          <div className="relative" ref={menuRef}>
            <button
              type="button"
              onClick={() => setMenuOpen((v) => !v)}
              className="flex items-center gap-1.5 w-full rounded-md px-1.5 py-1 hover:bg-nav-hover transition-colors"
            >
              <span className="text-[15px] font-bold tracking-tight truncate">
                {workspace?.name ?? "Nexu"}
              </span>
              <ChevronDown
                className={cn(
                  "h-3.5 w-3.5 text-nav-muted shrink-0 transition-transform",
                  menuOpen && "rotate-180",
                )}
              />
            </button>

            {menuOpen && (
              <div className="absolute top-full left-0 z-50 mt-1 w-72 rounded-xl border border-border bg-popover text-foreground shadow-2xl overflow-hidden">
                <div className="flex items-center gap-3 px-3 py-3 border-b border-border">
                  {workspace?.avatar ? (
                    <img src={workspace.avatar} alt="" className="h-10 w-10 rounded-lg shrink-0" />
                  ) : (
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-nexu-primary/80 to-nexu-primary text-white font-bold shrink-0">
                      {workspaceInitial}
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-semibold truncate">
                      {workspace?.name ?? "Nexu"}
                    </div>
                    <div className="text-[11px] text-muted-foreground truncate">
                      {workspaceHandle}
                    </div>
                  </div>
                </div>

                <div className="p-1.5">
                  <button
                    type="button"
                    onClick={() => {
                      setMenuOpen(false);
                      setShowInvite(true);
                    }}
                    className="flex items-center gap-2.5 w-full px-2.5 py-2 rounded-md text-xs hover:bg-accent transition-colors text-left"
                  >
                    <UserPlus className="h-3.5 w-3.5 shrink-0" />
                    <span className="flex-1 truncate">
                      {workspace?.name
                        ? `Invite people to ${workspace.name}`
                        : t("workspace.inviteMembers")}
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setMenuOpen(false);
                      navigate("/settings");
                    }}
                    className="flex items-center gap-2.5 w-full px-2.5 py-2 rounded-md text-xs hover:bg-accent transition-colors text-left"
                  >
                    <SettingsIcon className="h-3.5 w-3.5 shrink-0" />
                    <span className="flex-1">{t("settings.workspace")}</span>
                  </button>
                </div>

                <div className="border-t border-border p-1.5">
                  <button
                    type="button"
                    onClick={() => {
                      setMenuOpen(false);
                      reset();
                      navigate("/");
                    }}
                    className="flex items-center gap-2.5 w-full px-2.5 py-2 rounded-md text-xs text-destructive-foreground hover:bg-destructive/10 transition-colors text-left"
                  >
                    <LogOut className="h-3.5 w-3.5 shrink-0" />
                    <span className="flex-1">Log out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
        {currentSection && location.pathname.startsWith("/chat") === false && (
          <div className="mt-1 px-1.5 text-[11px] font-medium uppercase tracking-wider text-nav-muted">
            {t(currentSection.labelKey)}
          </div>
        )}
      </div>
      {getContent()}
      <InvitePeopleDialog open={showInvite} onOpenChange={setShowInvite} />
    </div>
  );
}

function SettingsSidebar(): React.ReactElement {
  const navigate = useNavigate();
  const location = useLocation();

  const items: {
    path: string;
    label: string;
    icon: typeof Building2;
    exact: boolean;
  }[] = [
    { path: "/settings", label: "Workspace", icon: Building2, exact: true },
    { path: "/settings/appearance", label: "Appearance", icon: Palette, exact: false },
    { path: "/settings/profile", label: "Profile", icon: User, exact: false },
  ];

  return (
    <div className="flex-1 overflow-y-auto px-2 space-y-0.5">
      {items.map(({ path, label, icon: Icon, exact }) => {
        const isActive = exact ? location.pathname === path : location.pathname.startsWith(path);
        return (
          <button
            type="button"
            key={path}
            onClick={() => navigate(path)}
            className={cn(
              "flex items-center gap-2.5 w-full px-2.5 py-1.5 rounded-md text-sm transition-colors",
              isActive
                ? "bg-nav-active text-white font-medium"
                : "text-nav-muted hover:bg-nav-hover hover:text-nav-fg",
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
