import {
  Brain,
  Clock,
  Component,
  Layout,
  Lightbulb,
  MessageSquare,
  Monitor,
  Palette,
  PanelLeft,
  PanelLeftClose,
  Play,
  Presentation,
  Route as RouteIcon,
  Sparkles,
  Type,
  Users,
  Wrench,
  Zap,
} from "lucide-react";
import { useState } from "react";
import { NavLink, Navigate, Route, Routes } from "react-router-dom";

import { CommentSystem } from "../components/CommentSystem";
import { DesignSystemRouteElements } from "./routes/design-system-routes";
import { ProductRouteElements } from "./routes/product-routes";

const DESIGN_NAV = [
  { to: "/why", label: "Why We Build nexu", icon: Lightbulb },
  { to: "/bp", label: "BP PPT", icon: Presentation },
  { to: "/overview", label: "Overview", icon: Brain },
  { to: "/colors", label: "Colors", icon: Palette },
  { to: "/typography", label: "Typography", icon: Type },
  { to: "/components", label: "Components", icon: Component },
  { to: "/motion", label: "Motion", icon: Zap },
  { to: "/avatar", label: "Avatar", icon: Users },
  { to: "/copy", label: "Copy System", icon: MessageSquare },
  { to: "/landing", label: "Landing Page", icon: Layout },
];

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
  items: typeof DESIGN_NAV;
  collapsed: boolean;
}) {
  return (
    <div>
      {!collapsed && (
        <div className="px-3 mb-1 text-[10px] font-medium text-text-muted uppercase tracking-wider">
          {title}
        </div>
      )}
      <div className="space-y-0.5">
        {items.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            title={collapsed ? label : undefined}
            className={({ isActive }) =>
              `flex items-center gap-2.5 rounded-md text-[13px] transition-colors ${
                collapsed ? "justify-center px-0 py-2" : "px-3 py-2"
              } ${
                isActive
                  ? "bg-clone-subtle text-clone font-medium"
                  : "text-text-secondary hover:text-text-primary hover:bg-surface-3"
              }`
            }
          >
            <Icon size={16} />
            {!collapsed && label}
          </NavLink>
        ))}
      </div>
    </div>
  );
}

export function DesignSystemShell() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <>
      <div className="flex h-full">
        <nav
          className={`${
            collapsed ? "w-14" : "w-56"
          } shrink-0 border-r border-border bg-surface-0 flex flex-col transition-all duration-200`}
        >
          {!collapsed && (
            <div className="flex justify-between items-center p-5 border-b border-border">
              <div className="flex gap-2 items-center">
                <div className="flex justify-center items-center w-7 h-7 rounded-lg bg-accent">
                  <span className="text-xs font-bold text-accent-fg">N</span>
                </div>
                <div>
                  <div className="text-sm font-semibold text-text-primary">nexu</div>
                  <div className="text-[11px] text-text-tertiary">Design System</div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setCollapsed(true)}
                className="p-1 rounded transition-colors text-text-muted hover:text-text-secondary"
                title="收起侧边栏"
              >
                <PanelLeftClose size={14} />
              </button>
            </div>
          )}

          <div className={`flex-1 ${collapsed ? "p-1.5" : "p-3"} space-y-4 overflow-y-auto`}>
            <NavSection title="Design System" items={DESIGN_NAV} collapsed={collapsed} />
            <NavSection title="Product Pages" items={PRODUCT_NAV} collapsed={collapsed} />
          </div>

          <div className="p-4 border-t border-border">
            {collapsed ? (
              <button
                type="button"
                onClick={() => setCollapsed(false)}
                className="flex justify-center items-center mx-auto w-7 h-7 rounded-lg transition-colors bg-accent hover:bg-accent-hover"
                title="展开侧边栏"
              >
                <PanelLeft size={14} className="text-accent-fg" />
              </button>
            ) : (
              <div className="text-[11px] text-text-muted">v1.0 — nexu Design System</div>
            )}
          </div>
        </nav>

        <main className="overflow-y-auto flex-1 min-h-0">
          <Routes>
            {DesignSystemRouteElements()}
            {ProductRouteElements()}
            <Route path="*" element={<Navigate to="/overview" replace />} />
          </Routes>
        </main>
      </div>
      <CommentSystem />
    </>
  );
}
