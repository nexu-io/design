import * as React from "react";

import { cn } from "../lib/cn";

type SplitViewOrientation = "horizontal" | "vertical";

function formatSize(value: number | string | undefined) {
  if (value === undefined) return undefined;
  return typeof value === "number" ? `${value}px` : value;
}

export interface SplitViewProps extends React.HTMLAttributes<HTMLDivElement> {
  orientation?: SplitViewOrientation;
}

export function SplitView({ className, orientation = "horizontal", ...props }: SplitViewProps) {
  return (
    <div
      data-slot="split-view"
      data-orientation={orientation}
      className={cn(
        "flex min-h-0 min-w-0",
        orientation === "horizontal" ? "flex-row" : "flex-col",
        className,
      )}
      {...props}
    />
  );
}

export interface ResizablePanelProps extends React.HTMLAttributes<HTMLDivElement> {
  orientation?: SplitViewOrientation;
  size?: number | string;
  minSize?: number | string;
  maxSize?: number | string;
  collapsed?: boolean;
}

export const ResizablePanel = React.forwardRef<HTMLDivElement, ResizablePanelProps>(
  (
    {
      className,
      orientation = "horizontal",
      size,
      minSize,
      maxSize,
      collapsed = false,
      style,
      ...props
    },
    ref,
  ) => {
    const dimension = orientation === "horizontal" ? "width" : "height";

    return (
      <div
        ref={ref}
        data-slot="resizable-panel"
        data-orientation={orientation}
        data-collapsed={collapsed ? "true" : "false"}
        className={cn(
          "min-h-0 min-w-0",
          collapsed ? "overflow-hidden" : "",
          size !== undefined || collapsed ? "shrink-0" : "flex-1",
          className,
        )}
        style={{
          ...style,
          [dimension]: collapsed ? "0px" : formatSize(size),
          [orientation === "horizontal" ? "minWidth" : "minHeight"]: collapsed
            ? "0px"
            : formatSize(minSize),
          [orientation === "horizontal" ? "maxWidth" : "maxHeight"]: formatSize(maxSize),
        }}
        {...props}
      />
    );
  },
);

ResizablePanel.displayName = "ResizablePanel";

export interface ResizableHandleProps extends React.HTMLAttributes<HTMLDivElement> {
  orientation?: SplitViewOrientation;
  onResizeStart?: () => void;
  onResize?: (delta: number) => void;
  onResizeEnd?: () => void;
}

export const ResizableHandle = React.forwardRef<HTMLDivElement, ResizableHandleProps>(
  (
    {
      className,
      orientation = "horizontal",
      onMouseDown,
      onResizeStart,
      onResize,
      onResizeEnd,
      ...props
    },
    ref,
  ) => {
    const [dragging, setDragging] = React.useState(false);

    const handleMouseDown = React.useCallback(
      (event: React.MouseEvent<HTMLDivElement>) => {
        onMouseDown?.(event);

        if (event.defaultPrevented) return;

        event.preventDefault();
        setDragging(true);
        onResizeStart?.();

        const start = orientation === "horizontal" ? event.clientX : event.clientY;

        const handleMove = (moveEvent: MouseEvent) => {
          const current = orientation === "horizontal" ? moveEvent.clientX : moveEvent.clientY;
          onResize?.(current - start);
        };

        const handleUp = () => {
          setDragging(false);
          onResizeEnd?.();
          document.removeEventListener("mousemove", handleMove);
          document.removeEventListener("mouseup", handleUp);
        };

        document.addEventListener("mousemove", handleMove);
        document.addEventListener("mouseup", handleUp);
      },
      [onMouseDown, onResize, onResizeEnd, onResizeStart, orientation],
    );

    return (
      <div
        ref={ref}
        role="separator"
        tabIndex={0}
        aria-orientation={orientation === "horizontal" ? "vertical" : "horizontal"}
        data-slot="resizable-handle"
        data-orientation={orientation}
        data-dragging={dragging ? "true" : "false"}
        className={cn(
          "relative shrink-0 transition-colors",
          orientation === "horizontal"
            ? "min-h-full cursor-col-resize"
            : "w-full cursor-row-resize",
          dragging && "bg-accent/40",
          className,
        )}
        onMouseDown={handleMouseDown}
        {...props}
      />
    );
  },
);

ResizableHandle.displayName = "ResizableHandle";
