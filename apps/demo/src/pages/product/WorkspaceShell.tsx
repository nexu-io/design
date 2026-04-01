import * as React from "react";

import { ResizableHandle, ResizablePanel, SplitView } from "@nexu-design/ui-web";

export interface WorkspaceShellProps extends React.HTMLAttributes<HTMLDivElement> {
  activityBar?: React.ReactNode;
  sidebar?: React.ReactNode;
  detailPanel?: React.ReactNode;
  children?: React.ReactNode;
  defaultSidebarCollapsed?: boolean;
  sidebarCollapsed?: boolean;
  onSidebarCollapsedChange?: (collapsed: boolean) => void;
  sidebarDefaultWidth?: number;
  sidebarWidth?: number;
  onSidebarWidthChange?: (width: number) => void;
  sidebarMinWidth?: number;
  sidebarMaxWidth?: number;
  mainClassName?: string;
  contentClassName?: string;
  sidebarResizerClassName?: string;
}

export function WorkspaceShell({
  activityBar,
  sidebar,
  detailPanel,
  children,
  defaultSidebarCollapsed = false,
  sidebarCollapsed: sidebarCollapsedProp,
  onSidebarCollapsedChange,
  sidebarDefaultWidth = 224,
  sidebarWidth: sidebarWidthProp,
  onSidebarWidthChange,
  sidebarMinWidth = 180,
  sidebarMaxWidth = 480,
  className,
  mainClassName,
  contentClassName,
  sidebarResizerClassName,
  ...rest
}: WorkspaceShellProps) {
  const [isDragging, setIsDragging] = React.useState(false);
  const resizeStartWidthRef = React.useRef(sidebarDefaultWidth);
  const [internalCollapsed, setInternalCollapsed] = React.useState(defaultSidebarCollapsed);
  const [internalWidth, setInternalWidth] = React.useState(sidebarDefaultWidth);

  const sidebarCollapsed =
    sidebarCollapsedProp !== undefined ? sidebarCollapsedProp : internalCollapsed;
  const setSidebarCollapsed = React.useCallback(
    (next: boolean) => {
      onSidebarCollapsedChange?.(next);
      if (sidebarCollapsedProp === undefined) {
        setInternalCollapsed(next);
      }
    },
    [onSidebarCollapsedChange, sidebarCollapsedProp],
  );

  const sidebarWidth = sidebarWidthProp !== undefined ? sidebarWidthProp : internalWidth;
  const setSidebarWidth = React.useCallback(
    (next: number) => {
      const clamped = Math.max(sidebarMinWidth, Math.min(sidebarMaxWidth, next));
      onSidebarWidthChange?.(clamped);
      if (sidebarWidthProp === undefined) {
        setInternalWidth(clamped);
      }
    },
    [sidebarMaxWidth, sidebarMinWidth, onSidebarWidthChange, sidebarWidthProp],
  );

  const handleResize = React.useCallback(
    (offset: number) => {
      const nextWidth = resizeStartWidthRef.current + offset;
      setSidebarWidth(nextWidth);
    },
    [setSidebarWidth],
  );

  React.useEffect(() => {
    if (!sidebar) setSidebarCollapsed(true);
  }, [sidebar, setSidebarCollapsed]);

  return (
    <SplitView
      className={`h-full bg-surface-0 ${isDragging ? "select-none" : ""} ${className ?? ""}`}
      {...rest}
    >
      {activityBar}
      {sidebar && !sidebarCollapsed ? (
        <>
          <ResizablePanel size={sidebarWidth} minSize={sidebarMinWidth} maxSize={sidebarMaxWidth}>
            {sidebar}
          </ResizablePanel>
          <ResizableHandle
            aria-label="Resize sidebar"
            className={`w-1 hover:bg-accent/30 data-[dragging=true]:bg-accent/50 ${sidebarResizerClassName ?? ""}`}
            onResizeStart={() => {
              resizeStartWidthRef.current = sidebarWidth;
              setIsDragging(true);
            }}
            onResize={handleResize}
            onResizeEnd={() => setIsDragging(false)}
          />
        </>
      ) : null}
      <SplitView className="relative flex-1 overflow-hidden">
        <main className={`min-w-0 flex-1 overflow-hidden ${mainClassName ?? ""}`}>
          <div className={`h-full overflow-hidden ${contentClassName ?? ""}`}>{children}</div>
        </main>
        {detailPanel}
      </SplitView>
    </SplitView>
  );
}
