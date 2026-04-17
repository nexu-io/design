import {
  ActivityBarContent,
  ActivityBarFooter,
  ActivityBarHeader,
  ActivityBarIndicator,
  ActivityBarItem,
  Avatar,
  AvatarFallback,
  AvatarImage,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  ActivityBar as UiActivityBar,
  cn,
} from "@nexu-design/ui-web";
import { Bot, Check, LogOut, MessageSquare, Plus, Settings, Zap } from "lucide-react";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { useWorkspaceStore } from "@/stores/workspace";

import { TitleBarSpacer } from "./WindowChrome";

const navItems = [
  { icon: MessageSquare, path: "/chat", label: "Chat" },
  { icon: Bot, path: "/agents", label: "Agents" },
  { icon: Zap, path: "/runtimes", label: "Runtimes" },
] as const;

export function ActivityBar(): React.ReactElement {
  const navigate = useNavigate();
  const location = useLocation();
  const { workspace, workspaces, switchWorkspace, reset } = useWorkspaceStore();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <UiActivityBar className="w-14 bg-surface-1 py-0">
      <TitleBarSpacer className={cn("mb-3", menuOpen && "no-drag")} />

      <ActivityBarHeader className="mb-4 w-10 border-b-0 pb-0">
        <DropdownMenu open={menuOpen} onOpenChange={setMenuOpen}>
          <DropdownMenuTrigger asChild>
            <ActivityBarItem
              className="no-drag size-10 overflow-hidden rounded-xl p-0 hover:bg-surface-2"
              title={workspace?.name ?? "Slark"}
            >
              <Avatar className="size-10 rounded-xl">
                <AvatarImage src={workspace?.avatar} alt={workspace?.name ?? "Workspace"} />
                <AvatarFallback className="rounded-xl bg-brand-subtle text-sm font-bold text-brand-primary">
                  {(workspace?.name ?? "S").charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </ActivityBarItem>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="start" side="right" className="no-drag w-60">
            <DropdownMenuLabel className="px-3 py-2">
              <div className="truncate text-sm font-semibold text-text-primary">
                {workspace?.name}
              </div>
              <div className="text-xs font-normal text-text-tertiary">alice@acme.dev</div>
            </DropdownMenuLabel>

            <DropdownMenuSeparator />
            <DropdownMenuLabel>Workspaces</DropdownMenuLabel>

            {workspaces.map((ws) => (
              <DropdownMenuItem
                key={ws.id}
                onClick={() => switchWorkspace(ws.id)}
                className="gap-2.5 rounded-lg text-[13px]"
              >
                <Avatar className="size-5 rounded-md">
                  <AvatarImage src={ws.avatar} alt={ws.name} />
                  <AvatarFallback className="rounded-md text-[10px] font-bold">
                    {ws.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <span className="min-w-0 flex-1 truncate">{ws.name}</span>
                {ws.id === workspace?.id ? (
                  <Check className="size-3.5 shrink-0 stroke-[3] text-text-heading" />
                ) : null}
              </DropdownMenuItem>
            ))}

            <DropdownMenuSeparator />

            <DropdownMenuItem
              onClick={() => setMenuOpen(false)}
              className="gap-2.5 rounded-lg text-[13px] text-text-secondary"
            >
              <Plus className="size-3.5" />
              Create workspace
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem
              onClick={() => {
                reset();
                navigate("/");
              }}
              className="gap-2.5 rounded-lg text-[13px] text-destructive focus:text-destructive"
            >
              <LogOut className="size-3.5" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </ActivityBarHeader>

      <ActivityBarContent className="gap-2">
        {navItems.map(({ icon: Icon, path, label }) => {
          const isActive = location.pathname.startsWith(path);

          return (
            <ActivityBarItem
              key={path}
              active={isActive}
              onClick={() => navigate(path)}
              className="no-drag size-10 rounded-xl"
              title={label}
            >
              {isActive ? <ActivityBarIndicator /> : null}
              <Icon className="size-[18px]" />
            </ActivityBarItem>
          );
        })}
      </ActivityBarContent>

      <ActivityBarFooter className="w-10 border-t-0 pb-3 pt-0">
        <ActivityBarItem
          active={location.pathname.startsWith("/settings")}
          onClick={() => navigate("/settings")}
          className="no-drag size-10 rounded-xl"
          title="Settings"
        >
          {location.pathname.startsWith("/settings") ? <ActivityBarIndicator /> : null}
          <Settings className="size-[18px]" />
        </ActivityBarItem>
      </ActivityBarFooter>
    </UiActivityBar>
  );
}
