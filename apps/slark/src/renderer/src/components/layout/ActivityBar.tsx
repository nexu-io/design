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
    /* Width pinned to 64px: 40px icon (`size-10`) + 12px breathing room on
       each side. PR #59's `w-[84px]` (22px padding) felt roomy and made
       the icons look lost in the rail; PR #57's `w-14`/56px (8px) felt
       tight against the traffic lights and reduced the visual weight of
       the rail. 64px lands between Linear (60px) and Slack (70px) — a
       comfortable Mac-native chrome density. TitleBarSpacer `h-[40px]`
       kept so the first header row clears `trafficLightPosition` (y:14
       + hit target) with a consistent gap.

       `pl-1.5` (6px) is deliberate and MUST match the base-plate's
       `p-1.5` on the right of the rail in AppLayout. Without it,
       `items-center` centres icons inside the 64px rail alone (x=12
       to x=52), which reads visually left-shifted once you include
       the 6px base-plate gap before the inner panel's rounded corner
       (right gap = 18px vs left gap = 12px). The `pl-1.5` offset
       re-centres icons against the full `rail + base-plate` chrome
       so left gap (to window edge) equals right gap (to panel
       corner) = 15px. Keep this padding in sync with AppLayout's
       `p-1.5`; if that changes, this must change too. */
    <UiActivityBar surface="glass" className="w-16 border-r-0 py-0 pl-1.5 text-nav-fg">
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
              {/* `+` placeholder tile sits on the dropdown surface, which PR
                  #57's dark-mode ladder lifted to `surface-2`. The old
                  `bg-secondary/40` fill became invisible there (secondary ≡
                  surface-2 in dark, so 40% of it on top of itself reads as
                  no fill). Switch to the translucent `foreground` tint used
                  by the outline / secondary button variants — it borrows
                  value contrast from the text colour, so it reads on both
                  the light-mode popover card *and* the dark-mode surface-2
                  dropdown without re-tuning per theme. Border stays since
                  that's the "empty add-slot" outline. */}
              <div className="flex size-10 items-center justify-center rounded-lg border border-border bg-foreground/[0.03] dark:bg-foreground/[0.06]">
                <Plus className="size-4 text-muted-foreground" />
              </div>
              <span className="flex-1 text-left text-sm text-foreground">Add workspace</span>
              {workspaces.length >= 5 ? (
                <span className="shrink-0 text-[10px] text-muted-foreground">
                  {workspaces.length}/5
                </span>
              ) : null}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </ActivityBarHeader>

      <ActivityBarContent className="gap-1.5">
        {navItems.map(({ icon: Icon, path, labelKey }) => {
          const isActive = location.pathname.startsWith(path);

          return (
            <ActivityBarItem
              key={path}
              active={isActive}
              onClick={() => navigate(path)}
              className="no-drag relative size-10 rounded-xl text-nav-muted hover:bg-nav-hover hover:text-nav-fg data-[active=true]:bg-nav-active data-[active=true]:text-nav-active-fg"
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
