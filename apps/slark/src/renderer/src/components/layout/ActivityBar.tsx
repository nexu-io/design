import { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { MessageSquare, Users, Zap, Settings, Plus, LogOut, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { useT, type TranslationKey } from "@/i18n";
import { useWorkspaceStore } from "@/stores/workspace";

import { WindowChrome } from "./WindowChrome";

const navItems: { icon: typeof MessageSquare; path: string; labelKey: TranslationKey }[] = [
  { icon: MessageSquare, path: "/chat", labelKey: "section.chat" },
  { icon: Users, path: "/agents", labelKey: "section.team" },
  { icon: Zap, path: "/runtimes", labelKey: "section.runtimes" },
];

export function ActivityBar(): React.ReactElement {
  const navigate = useNavigate();
  const location = useLocation();
  const t = useT();
  const { workspace, workspaces, switchWorkspace, reset } = useWorkspaceStore();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent): void => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    if (menuOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuOpen]);

  return (
    <div className="flex flex-col items-center w-[56px] bg-nav-surface shrink-0">
      <WindowChrome className={cn("h-[38px] w-full", menuOpen && "pointer-events-none")} />

      <div className="relative mb-3" ref={menuRef}>
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="no-drag flex h-10 w-10 items-center justify-center rounded-xl overflow-hidden ring-1 ring-white/10 hover:ring-white/30 transition-all"
          title={workspace?.name ?? "Nexu"}
        >
          {workspace?.avatar ? (
            <img src={workspace.avatar} alt="" className="h-10 w-10 rounded-xl" />
          ) : (
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-nexu-primary/80 to-nexu-primary text-white font-bold text-base">
              {(workspace?.name ?? "S").charAt(0).toUpperCase()}
            </div>
          )}
        </button>

        {menuOpen && (
          <>
            <div className="no-drag fixed inset-0 z-40" onClick={() => setMenuOpen(false)} />
            <div className="absolute top-0 left-[60px] z-50 w-[320px] rounded-2xl border border-border bg-popover text-popover-foreground shadow-2xl overflow-hidden py-1.5">
              {workspaces.map((ws, idx) => {
                const isActive = ws.id === workspace?.id;
                const slug = ws.name
                  .toLowerCase()
                  .replace(/[^a-z0-9]+/g, "-")
                  .replace(/^-|-$/g, "");
                return (
                  <button
                    key={ws.id}
                    onClick={() => {
                      switchWorkspace(ws.id);
                      setMenuOpen(false);
                    }}
                    className="flex items-center gap-3 w-full px-2.5 py-2 rounded-lg hover:bg-accent transition-colors mx-1"
                  >
                    <div className="relative shrink-0">
                      {ws.avatar ? (
                        <img src={ws.avatar} alt="" className="h-10 w-10 rounded-lg" />
                      ) : (
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-nexu-primary/80 to-nexu-primary text-white font-bold text-base">
                          {ws.name.charAt(0).toUpperCase()}
                        </div>
                      )}
                      {isActive && (
                        <span className="absolute -top-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-nexu-online ring-2 ring-popover" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0 text-left">
                      <div className="text-sm font-semibold text-foreground truncate flex items-center gap-1.5">
                        {ws.name}
                        {isActive && <Check className="h-3.5 w-3.5 text-nexu-primary shrink-0" />}
                      </div>
                      <div className="text-xs text-muted-foreground truncate">{slug}.nexu.app</div>
                    </div>
                    {idx < 9 && (
                      <span className="text-xs text-muted-foreground shrink-0 tracking-wider">
                        ⌘{idx + 1}
                      </span>
                    )}
                  </button>
                );
              })}

              <button
                onClick={() => setMenuOpen(false)}
                disabled={workspaces.length >= 5}
                title={workspaces.length >= 5 ? "Workspace limit reached (5 max)" : undefined}
                className="flex items-center gap-3 w-full px-2.5 py-2 rounded-lg hover:bg-accent transition-colors mx-1 disabled:opacity-50 disabled:hover:bg-transparent disabled:cursor-not-allowed"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-secondary/40 shrink-0">
                  <Plus className="h-4 w-4 text-muted-foreground" />
                </div>
                <span className="flex-1 text-left text-sm text-foreground">
                  {t("workspace.addWorkspace")}
                </span>
                {workspaces.length >= 5 && (
                  <span className="text-[10px] text-muted-foreground shrink-0">
                    {workspaces.length}/5
                  </span>
                )}
              </button>

              <div className="h-px bg-border my-1.5 mx-2" />

              <button
                onClick={() => {
                  setMenuOpen(false);
                  reset();
                  navigate("/");
                }}
                className="flex items-center gap-2.5 w-full px-3 py-1.5 rounded-lg text-xs text-destructive-foreground hover:bg-destructive/10 transition-colors mx-1"
              >
                <LogOut className="h-3.5 w-3.5" />
                {t("workspace.logOut")}
              </button>
            </div>
          </>
        )}
      </div>

      <div className="flex flex-col items-center gap-1.5 flex-1">
        {navItems.map(({ icon: Icon, path, labelKey }) => {
          const isActive = location.pathname.startsWith(path);
          return (
            <button
              key={path}
              onClick={() => navigate(path)}
              className={cn(
                "no-drag relative flex items-center justify-center w-10 h-10 rounded-xl transition-colors",
                isActive
                  ? "bg-white/25 text-white"
                  : "text-white/75 hover:text-white hover:bg-white/15",
              )}
              title={t(labelKey)}
            >
              <Icon className="w-[19px] h-[19px]" />
              {isActive && (
                <span className="absolute -left-2.5 top-2 bottom-2 w-[3px] rounded-r-full bg-nav-fg" />
              )}
            </button>
          );
        })}
      </div>

      <button
        onClick={() => navigate("/settings")}
        className={cn(
          "no-drag flex items-center justify-center w-10 h-10 rounded-xl transition-colors mb-3",
          location.pathname.startsWith("/settings")
            ? "bg-white/25 text-white"
            : "text-white/75 hover:text-white hover:bg-white/15",
        )}
        title="Settings"
      >
        <Settings className="w-[19px] h-[19px]" />
      </button>
    </div>
  );
}
