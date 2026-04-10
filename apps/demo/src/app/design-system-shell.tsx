import {
  Button,
  NavItem,
  NavigationMenu,
  NavigationMenuLabel,
  NavigationMenuList,
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "@nexu-design/ui-web";
import {
  Clock,
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

  return (
    <NavigationMenu>
      {!collapsed && (
        <NavigationMenuLabel className="px-3">{title}</NavigationMenuLabel>
      )}
      <NavigationMenuList>
        {items.map(({ to, label, icon: Icon }) => (
          <NavItem
            key={to}
            asChild
            tone="accent"
            selected={location.pathname === to}
            className={collapsed ? "justify-center px-0" : undefined}
            title={collapsed ? label : undefined}
          >
            <NavLink to={to}>
              <Icon size={16} />
              {!collapsed && label}
            </NavLink>
          </NavItem>
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
          className={`${
            collapsed ? "w-14" : "w-56"
          } shrink-0 bg-surface-0 transition-all duration-200`}
        >
          {!collapsed && (
            <SidebarHeader className="flex justify-between items-center border-b border-border p-5">
              <div className="flex gap-2 items-center">
                <div className="flex justify-center items-center w-7 h-7 rounded-lg bg-accent">
                  <span className="text-xs font-bold text-accent-fg">N</span>
                </div>
                <div>
                  <div className="text-sm font-semibold text-text-primary">nexu</div>
                  <div className="text-[11px] text-text-tertiary">Product Demo</div>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={() => setCollapsed(true)}
                title="收起侧边栏"
              >
                <PanelLeftClose size={14} />
              </Button>
            </SidebarHeader>
          )}

          <SidebarContent className={`${collapsed ? "p-1.5" : "p-3"} space-y-4 overflow-y-auto`}>
            <NavSection title="Product Pages" items={PRODUCT_NAV} collapsed={collapsed} />
          </SidebarContent>

          <SidebarFooter className="border-t border-border p-4">
            {collapsed ? (
              <Button
                variant="default"
                size="icon-sm"
                onClick={() => setCollapsed(false)}
                className="mx-auto"
                title="展开侧边栏"
              >
                <PanelLeft size={14} />
              </Button>
            ) : (
              <div className="text-[11px] text-text-muted">v1.0 — nexu Product Demo</div>
            )}
          </SidebarFooter>
        </Sidebar>

        <main className="overflow-y-auto flex-1 min-h-0">
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
