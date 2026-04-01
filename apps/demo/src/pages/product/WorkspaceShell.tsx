import type { ReactNode } from "react";

interface WorkspaceShellProps {
  activityBar?: ReactNode;
  sidebar?: ReactNode;
  detailPanel?: ReactNode;
  children: ReactNode;
  className?: string;
  contentClassName?: string;
  sidebarCollapsed?: boolean;
  onSidebarCollapsedChange?: (collapsed: boolean) => void;
  sidebarWidth?: number;
  onSidebarWidthChange?: (width: number) => void;
  sidebarDefaultWidth?: number;
  sidebarMinWidth?: number;
  sidebarMaxWidth?: number;
}

export default function WorkspaceShell({
  activityBar,
  sidebar,
  detailPanel,
  children,
  className,
  contentClassName,
  sidebarCollapsed,
}: WorkspaceShellProps) {
  return (
    <div className={`flex h-full min-h-0 overflow-hidden ${className ?? ""}`.trim()}>
      {activityBar}
      {!sidebarCollapsed ? sidebar : null}
      <main className={`min-w-0 flex-1 ${contentClassName ?? ""}`.trim()}>{children}</main>
      {detailPanel}
    </div>
  );
}
