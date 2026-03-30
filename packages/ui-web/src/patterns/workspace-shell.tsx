import * as React from "react";

import { cn } from "../lib/cn";
import { ResizableHandle, ResizablePanel, SplitView } from "../primitives/split-view";

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

function useControllableState<T>({
  value,
  defaultValue,
  onChange,
}: {
  value: T | undefined;
  defaultValue: T;
  onChange?: (value: T) => void;
}) {
  const [internalValue, setInternalValue] = React.useState(defaultValue);
  const isControlled = value !== undefined;
  const currentValue = isControlled ? value : internalValue;

  const setValue = React.useCallback(
    (nextValue: React.SetStateAction<T>) => {
      const resolvedValue =
        typeof nextValue === "function"
          ? (nextValue as (previousValue: T) => T)(currentValue)
          : nextValue;

      if (!isControlled) {
        setInternalValue(resolvedValue);
      }

      onChange?.(resolvedValue);
    },
    [currentValue, isControlled, onChange],
  );

  return [currentValue, setValue] as const;
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
  ...props
}: WorkspaceShellProps) {
  const [isDragging, setIsDragging] = React.useState(false);
  const resizeStartWidthRef = React.useRef(sidebarDefaultWidth);
  const [sidebarCollapsed, setSidebarCollapsed] = useControllableState<boolean>({
    value: sidebarCollapsedProp,
    defaultValue: defaultSidebarCollapsed,
    onChange: onSidebarCollapsedChange,
  });
  const [sidebarWidth, setSidebarWidth] = useControllableState<number>({
    value: sidebarWidthProp,
    defaultValue: sidebarDefaultWidth,
    onChange: onSidebarWidthChange,
  });

  const handleResize = React.useCallback(
    (offset: number) => {
      const nextWidth = resizeStartWidthRef.current + offset;
      setSidebarWidth(Math.max(sidebarMinWidth, Math.min(sidebarMaxWidth, nextWidth)));
    },
    [setSidebarWidth, sidebarMaxWidth, sidebarMinWidth],
  );

  React.useEffect(() => {
    if (!sidebar) {
      setSidebarCollapsed(true);
    }
  }, [setSidebarCollapsed, sidebar]);

  return (
    <SplitView
      className={cn("h-full bg-surface-0", isDragging && "select-none", className)}
      {...props}
    >
      {activityBar}

      {sidebar && !sidebarCollapsed ? (
        <>
          <ResizablePanel size={sidebarWidth} minSize={sidebarMinWidth} maxSize={sidebarMaxWidth}>
            {sidebar}
          </ResizablePanel>
          <ResizableHandle
            aria-label="Resize sidebar"
            aria-valuemin={sidebarMinWidth}
            aria-valuemax={sidebarMaxWidth}
            aria-valuenow={sidebarWidth}
            className={cn(
              "w-1 hover:bg-accent/30 data-[dragging=true]:bg-accent/50",
              sidebarResizerClassName,
            )}
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
        <main className={cn("min-w-0 flex-1 overflow-hidden", mainClassName)}>
          <div className={cn("h-full overflow-hidden", contentClassName)}>{children}</div>
        </main>
        {detailPanel}
      </SplitView>
    </SplitView>
  );
}
