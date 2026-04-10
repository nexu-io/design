import {
  GitHubIcon,
  NavigationMenu,
  NavigationMenuButton,
  NavigationMenuItem,
  NavigationMenuLabel,
  NavigationMenuList,
  NexuLogoIcon,
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "@nexu-design/ui-web";
import {
  ChevronUp,
  CircleHelp,
  Clock,
  Globe,
  Monitor,
  PanelLeft,
  PanelLeftClose,
  Play,
  Route as RouteIcon,
  Sparkles,
  Users,
  Wrench,
} from "lucide-react";
import { useState } from "react";
import { NavLink, Navigate, Route, Routes, useLocation } from "react-router-dom";

import { CommentSystem } from "../components/CommentSystem";
import { ProductRouteElements } from "./routes/product-routes";

const PRODUCT_NAV = [
  { to: "/demo", label: "Product Demo", icon: Play },
  { to: "/journey", label: "User Journey", icon: RouteIcon },
  { to: "/app/sessions", label: "Sessions", icon: Monitor },
  { to: "/app/team", label: "团队协作", icon: Users },
  { to: "/app/clone", label: "分身搭建", icon: Wrench },
  { to: "/app/automation", label: "Automation", icon: Clock },
  { to: "/app/skills", label: "Skills", icon: Sparkles },
];

function NavSection({
  title,
  items,
  collapsed,
}: {
  title: string;
  items: typeof PRODUCT_NAV;
  collapsed: boolean;
}) {
  const location = useLocation();

  const isSelected = (to: string) =>
    location.pathname === to || location.pathname.startsWith(`${to}/`);

  return (
    <NavigationMenu>
      {!collapsed && <NavigationMenuLabel>{title}</NavigationMenuLabel>}
      <NavigationMenuList>
        {items.map(({ to, label, icon: Icon }) => (
          <NavigationMenuItem key={to}>
            <NavigationMenuButton
              asChild
              active={isSelected(to)}
              className={collapsed ? "justify-center px-0" : undefined}
              title={collapsed ? label : undefined}
            >
              <NavLink to={to}>
                <Icon className="size-4" />
                {!collapsed && label}
              </NavLink>
            </NavigationMenuButton>
          </NavigationMenuItem>
        ))}
      </NavigationMenuList>
    </NavigationMenu>
  );
}

export function DesignSystemShell() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <>
      <div className="flex h-full">
        <Sidebar
          className={`${collapsed ? "w-14" : "w-[220px]"} shrink-0 transition-all duration-200`}
        >
          {collapsed ? (
            <SidebarHeader className="flex h-[52px] items-center justify-center border-b border-border px-3 py-3">
              <NexuLogoIcon size={28} />
            </SidebarHeader>
          ) : (
            <SidebarHeader className="flex items-center justify-between gap-2.5 border-b border-border px-4 py-3">
              <NexuLogoIcon size={28} />
              <div className="min-w-0 flex-1">
                <div className="text-lg font-semibold text-text-primary">Nexu</div>
                <div className="text-2xs text-text-tertiary">Product Demo</div>
              </div>
              <button
                type="button"
                onClick={() => setCollapsed(true)}
                title="收起侧边栏"
                className="shrink-0 rounded-lg p-1.5 text-text-muted transition-colors hover:bg-surface-3 hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <PanelLeftClose size={14} />
              </button>
            </SidebarHeader>
          )}

          <SidebarContent className="flex-1 overflow-y-auto">
            <div className={collapsed ? "px-1.5 pb-1 pt-3" : "px-2 pb-1 pt-3"}>
              <NavSection title="Product Pages" items={PRODUCT_NAV} collapsed={collapsed} />
            </div>
          </SidebarContent>

          {!collapsed && (
            <div className="flex shrink-0 items-center justify-between gap-1 px-3 pb-1.5">
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  className="flex size-7 items-center justify-center rounded-md text-text-secondary transition-colors hover:bg-surface-3 hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  title="Help"
                >
                  <CircleHelp size={16} />
                </button>
                <a
                  href="https://github.com/nexu-io/nexu"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex size-7 items-center justify-center rounded-md text-text-secondary transition-colors hover:bg-surface-3 hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  title="GitHub"
                >
                  <GitHubIcon size={16} />
                </a>
              </div>
              <button
                type="button"
                title="Language"
                className="inline-flex h-7 items-center gap-1.5 rounded-md px-2 text-sm font-medium text-text-secondary transition-colors hover:bg-surface-3 hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <Globe size={14} />
                <span>EN</span>
              </button>
            </div>
          )}

          <SidebarFooter
            className={
              collapsed ? "border-t border-border px-3 py-2" : "border-t border-border px-2 py-2"
            }
          >
            {collapsed ? (
              <button
                type="button"
                onClick={() => setCollapsed(false)}
                title="展开侧边栏"
                className="flex size-7 items-center justify-center rounded-md text-text-secondary transition-colors hover:bg-surface-3 hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <PanelLeft size={14} />
              </button>
            ) : (
              <button
                type="button"
                className="flex w-full items-center gap-2.5 rounded-lg px-2 py-2 transition-all hover:bg-surface-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <div className="flex size-7 shrink-0 items-center justify-center rounded-md bg-gradient-to-br from-accent/20 to-accent/5 text-xs font-bold text-accent ring-1 ring-accent/10">
                  N
                </div>
                <div className="min-w-0 flex-1 text-left">
                  <div className="truncate text-sm font-medium text-text-primary">Nexu Design</div>
                  <div className="truncate text-xs text-text-muted">design@nexu.ai</div>
                </div>
                <ChevronUp size={12} className="shrink-0 rotate-180 text-text-muted/50" />
              </button>
            )}
          </SidebarFooter>
        </Sidebar>

        <main className="min-h-0 flex-1 overflow-y-auto">
          <Routes>
            {ProductRouteElements()}
            <Route path="/openclaw/*" element={<Navigate to="/openclaw/workspace" replace />} />
            <Route path="*" element={<Navigate to="/openclaw/workspace" replace />} />
          </Routes>
        </main>
      </div>
      <CommentSystem />
    </>
  );
}
