import {
  ActivityBar as UiActivityBar,
  ActivityBarContent,
  ActivityBarFooter,
  ActivityBarHeader,
  ActivityBarItem,
  Avatar,
  AvatarFallback,
  AvatarImage,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@nexu-design/ui-web";
import { Check, MessageSquare, Plus, Settings, Users, Zap } from "lucide-react";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { useT, type TranslationKey } from "@/i18n";
import { useWorkspaceStore } from "@/stores/workspace";

import { TitleBarSpacer } from "./WindowChrome";

const navItems: { icon: typeof MessageSquare; path: string; labelKey: TranslationKey }[] = [
  { icon: MessageSquare, path: "/chat", labelKey: "section.chat" },
  { icon: Users, path: "/agents", labelKey: "section.team" },
  { icon: Zap, path: "/runtimes", labelKey: "section.runtimes" },
];

function getWorkspaceSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function ActivityBar(): React.ReactElement {
  const navigate = useNavigate();
  const location = useLocation();
  const t = useT();
  const { workspace, workspaces, switchWorkspace } = useWorkspaceStore();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <UiActivityBar className="w-[84px] border-r border-border-subtle bg-surface-0/70 py-0 text-nav-fg backdrop-blur-md">
      <TitleBarSpacer className="mb-3 h-[40px]" />

      <ActivityBarHeader className="mb-4 w-10 border-b-0 pb-0">
        <DropdownMenu open={menuOpen} onOpenChange={setMenuOpen}>
          <DropdownMenuTrigger asChild>
            <ActivityBarItem
              className="no-drag size-10 overflow-hidden rounded-xl p-0 text-nav-fg hover:bg-nav-hover hover:text-nav-fg"
              title={workspace?.name ?? "Nexu"}
            >
              <Avatar className="size-10 rounded-xl">
                <AvatarImage src={workspace?.avatar} alt={workspace?.name ?? "Workspace"} />
                <AvatarFallback className="rounded-xl bg-gradient-to-br from-nexu-primary/80 to-nexu-primary text-sm font-bold text-accent-fg">
                  {(workspace?.name ?? "S").charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </ActivityBarItem>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="start" side="right" className="no-drag w-72 rounded-2xl">
            {workspaces.map((ws, idx) => {
              const isActive = ws.id === workspace?.id;

              return (
                <DropdownMenuItem
                  key={ws.id}
                  onClick={() => switchWorkspace(ws.id)}
                  className="gap-3 rounded-lg px-2.5 py-2"
                >
                  <Avatar className="size-10 rounded-lg">
                    <AvatarImage src={ws.avatar} alt={ws.name} />
                    <AvatarFallback className="rounded-lg bg-gradient-to-br from-nexu-primary/80 to-nexu-primary text-sm font-bold text-accent-fg">
                      {ws.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5 text-sm font-semibold text-foreground">
                      <span className="truncate">{ws.name}</span>
                      {isActive ? <Check className="size-3.5 shrink-0 text-nexu-primary" /> : null}
                    </div>
                    <div className="truncate text-xs text-muted-foreground">
                      {getWorkspaceSlug(ws.name)}.nexu.app
                    </div>
                  </div>
                  {idx < 9 ? (
                    <span className="shrink-0 text-xs tracking-wider text-muted-foreground">
                      ⌘{idx + 1}
                    </span>
                  ) : null}
                </DropdownMenuItem>
              );
            })}

            {/* No separator here — `Add workspace` is a sibling affordance
                to the workspace rows above (same row treatment, just with a
                `+` tile instead of an avatar), so splitting them with a
                divider implies a semantic break that doesn't exist. The
                separator only appears before `Sign out` to fence off the
                destructive action. */}
            <DropdownMenuItem
              disabled={workspaces.length >= 5}
              title={workspaces.length >= 5 ? "Workspace limit reached (5 max)" : undefined}
              className="gap-3 rounded-lg px-2.5 py-2"
              onClick={() => setMenuOpen(false)}
            >
              <div className="flex size-10 items-center justify-center rounded-lg border border-border bg-secondary/40">
                <Plus className="size-4 text-muted-foreground" />
              </div>
              <span className="flex-1 text-left text-sm text-foreground">Add workspace</span>
              {workspaces.length >= 5 ? (
                <span className="shrink-0 text-[10px] text-muted-foreground">
                  {workspaces.length}/5
                </span>
              ) : null}
            </DropdownMenuItem>

            {/* Sign-out was intentionally removed from the workspace
                switcher. This menu is a workspace picker — mixing a
                destructive account action into it conflates "switch
                tenant" with "leave the product", and users expect
                sign-out to live in Settings / account UI. The picker
                now ends on `Add workspace`, keeping the menu scoped to
                workspace-level intents. */}
          </DropdownMenuContent>
        </DropdownMenu>
      </ActivityBarHeader>

      <ActivityBarContent className="gap-2">
        {navItems.map(({ icon: Icon, path, labelKey }) => {
          const isActive = location.pathname.startsWith(path);

          return (
            <ActivityBarItem
              key={path}
              active={isActive}
              onClick={() => navigate(path)}
              className="no-drag size-10 rounded-xl text-nav-muted hover:bg-nav-hover hover:text-nav-fg data-[active=true]:bg-nav-active data-[active=true]:text-nav-active-fg"
              title={t(labelKey)}
            >
              <Icon className="size-[19px]" />
            </ActivityBarItem>
          );
        })}
      </ActivityBarContent>

      <ActivityBarFooter className="w-10 border-t-0 pb-3 pt-0">
        <ActivityBarItem
          active={location.pathname.startsWith("/settings")}
          onClick={() => navigate("/settings")}
          className="no-drag size-10 rounded-xl text-nav-muted hover:bg-nav-hover hover:text-nav-fg data-[active=true]:bg-nav-active data-[active=true]:text-nav-active-fg"
          title={t("section.settings")}
        >
          <Settings className="size-[19px]" />
        </ActivityBarItem>
      </ActivityBarFooter>
    </UiActivityBar>
  );
}
