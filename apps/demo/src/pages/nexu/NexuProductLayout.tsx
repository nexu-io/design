import {
  ActivityBar,
  ActivityBarContent,
  ActivityBarFooter,
  ActivityBarHeader,
  ActivityBarIndicator,
  ActivityBarItem,
  SplitView,
} from "@nexu/ui-web";
import {
  ClipboardCheck,
  LayoutDashboard,
  Send,
  Settings,
  Sparkles,
  TrendingUp,
  Users,
  Zap,
} from "lucide-react";
import { NavLink, Outlet, useLocation } from "react-router-dom";

const NEXU_NAV = [
  { to: "/nexu", end: true, icon: LayoutDashboard, label: "工作台" },
  { to: "/nexu/avatars", end: false, icon: Users, label: "分身与角色" },
  { to: "/nexu/task", end: false, icon: Send, label: "任务下达" },
  { to: "/nexu/approvals", end: false, icon: ClipboardCheck, label: "审批中心" },
  { to: "/nexu/progress", end: false, icon: TrendingUp, label: "进度与 ROI" },
  { to: "/nexu/skills", end: false, icon: Sparkles, label: "技能与知识库" },
  { to: "/nexu/settings", end: false, icon: Settings, label: "集成与设置" },
];

export default function NexuProductLayout() {
  const location = useLocation();

  return (
    <SplitView className="h-full bg-surface-1">
      <ActivityBar className="w-14 border-border-subtle py-3">
        <ActivityBarHeader className="mb-4 w-full border-b-0 pb-0">
          <div className="flex flex-col items-center gap-1">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent">
              <span className="text-sm font-bold text-accent-fg">N</span>
            </div>
            <span className="text-[10px] font-medium text-text-tertiary">nexu</span>
          </div>
        </ActivityBarHeader>

        <ActivityBarContent>
          {NEXU_NAV.map(({ to, end, icon: Icon, label }) => {
            const isActive = end ? location.pathname === to : location.pathname.startsWith(to);

            return (
              <ActivityBarItem
                key={to}
                asChild
                active={isActive}
                title={label}
                className="text-text-secondary hover:bg-surface-2 hover:text-text-primary"
              >
                <NavLink to={to} end={end}>
                  {isActive && <ActivityBarIndicator />}
                  <Icon size={18} className={isActive ? "" : "opacity-60"} />
                </NavLink>
              </ActivityBarItem>
            );
          })}
        </ActivityBarContent>

        <ActivityBarFooter className="border-border-subtle">
          <div className="flex h-8 w-8 items-center justify-center" title="Credits">
            <Zap size={14} className="text-text-tertiary" />
          </div>
        </ActivityBarFooter>
      </ActivityBar>

      <main className="min-w-0 flex-1 overflow-y-auto bg-surface-1">
        <Outlet />
      </main>
    </SplitView>
  );
}
