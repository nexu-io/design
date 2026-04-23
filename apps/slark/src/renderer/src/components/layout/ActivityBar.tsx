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
  cn,
} from "@nexu-design/ui-web";
import { Check, MessageSquare, Plus, Settings, Users, Zap } from "lucide-react";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { useT, type TranslationKey } from "@/i18n";
import { ACTIVITY_BAR_EXPAND_THRESHOLD, useLayoutStore } from "@/stores/layout";
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
  const activityBarWidth = useLayoutStore((s) => s.activityBarWidth);
  const expanded = activityBarWidth > ACTIVITY_BAR_EXPAND_THRESHOLD;

  /* ────────────────────────────────────────────────────────────
     Collapsed (`w = ACTIVITY_BAR_MIN_WIDTH`, 64px):
       - items render as 40×40 icon-only rounded squares;
       - header/footer inner widths pin to `w-10` (40px) so the
         square icons and horizontal dividers stay self-centred
         inside the 64px rail (see the PR #59 width rationale
         preserved in the `pl-1.5` comment below).

     Expanded (`w > ACTIVITY_BAR_EXPAND_THRESHOLD`, ≥ 96px):
       - each item becomes a full-width row, icon left + label
         right, 10px gap between;
       - header/footer inner widths stretch to `w-full` so the
         workspace-switcher row and the settings row visually
         align with the nav rows below/above them.
     ──────────────────────────────────────────────────────────── */

  const navItemClass = cn(
    "no-drag rounded-xl text-nav-muted transition-colors",
    "hover:bg-nav-hover hover:text-nav-fg",
    "data-[active=true]:bg-nav-active data-[active=true]:text-nav-active-fg",
    expanded ? "h-10 w-full justify-start gap-2.5 px-2.5" : "size-10",
  );

  return (
    /* Width pinned to 64px at rest: 40px icon (`size-10`) + 12px
       breathing room on each side. `pl-1.5` gives the 40×40 icons a
       bit of left gutter inside the 64px rail (icons sit at x=6..46,
       with 18px of space on the right) — rail + Sidebar are now
       flush with no intermediate padding, so this no longer needs
       to mirror a base-plate gap, but the slight left bias still
       reads as intentional "this column is a rail, not a toolbar".

       In expanded mode we also add `pr-2` so labels don't kiss
       the Sidebar's left edge. */
    <UiActivityBar
      surface="glass"
      style={{ width: activityBarWidth }}
      className={cn(
        "shrink-0 border-r-0 py-0 pl-1.5 text-nav-fg",
        expanded ? "pr-2 items-stretch" : "items-center",
      )}
    >
      <TitleBarSpacer className="mb-3 h-[40px]" />

      {/* Header inner width pinned to `w-10` regardless of expanded
          state: the avatar button is always a 40×40 square tile, so
          stretching the header to `w-full` in expanded mode would just
          add empty right-side whitespace beside the tile. Kept
          `items-stretch` on the rail container so the nav rows below
          can still span the full expanded width. */}
      <ActivityBarHeader className="mb-4 w-10 border-b-0 pb-0">
        <DropdownMenu open={menuOpen} onOpenChange={setMenuOpen}>
          <DropdownMenuTrigger asChild>
            {/* Workspace avatar stays icon-only in both collapsed and
                expanded modes. The expanded Sidebar already renders the
                workspace name (15px bold) in its top row, so repeating
                it next to the rail avatar reads as duplicated chrome
                and visually fights the Sidebar header for attention.
                The avatar alone is enough to signal which workspace
                the switcher targets; `title` preserves the hover
                tooltip for wayfinding. */}
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
                divider implies a semantic break that doesn't exist. */}
            <DropdownMenuItem
              disabled={workspaces.length >= 5}
              title={workspaces.length >= 5 ? "Workspace limit reached (5 max)" : undefined}
              className="gap-3 rounded-lg px-2.5 py-2"
              onClick={() => setMenuOpen(false)}
            >
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

      <ActivityBarContent className={cn("gap-1.5", expanded ? "items-stretch" : "items-center")}>
        {navItems.map(({ icon: Icon, path, labelKey }) => {
          const isActive = location.pathname.startsWith(path);

          return (
            <ActivityBarItem
              key={path}
              active={isActive}
              onClick={() => navigate(path)}
              className={navItemClass}
              title={expanded ? undefined : t(labelKey)}
            >
              <Icon className={cn("shrink-0", expanded ? "size-[17px]" : "size-[19px]")} />
              {expanded ? (
                <span className="truncate text-[13px] font-medium">{t(labelKey)}</span>
              ) : null}
            </ActivityBarItem>
          );
        })}
      </ActivityBarContent>

      <ActivityBarFooter
        className={cn("border-t-0 pb-3 pt-0", expanded ? "w-full items-stretch" : "w-10")}
      >
        <ActivityBarItem
          active={location.pathname.startsWith("/settings")}
          onClick={() => navigate("/settings")}
          className={navItemClass}
          title={expanded ? undefined : t("section.settings")}
        >
          <Settings className={cn("shrink-0", expanded ? "size-[17px]" : "size-[19px]")} />
          {expanded ? (
            <span className="truncate text-[13px] font-medium">{t("section.settings")}</span>
          ) : null}
        </ActivityBarItem>
      </ActivityBarFooter>
    </UiActivityBar>
  );
}
