import { usePanelStore } from "@/stores/panel";
import { cn } from "@nexu-design/ui-web";
import { X } from "lucide-react";
import { useEffect, useRef } from "react";

interface SlidePanelProps {
  children: React.ReactNode;
  title: string;
  width?: string;
}

export function SlidePanel({
  children,
  title,
  width = "w-[420px]",
}: SlidePanelProps): React.ReactElement {
  const closePanel = usePanelStore((s) => s.closePanel);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent): void => {
      if (e.key === "Escape") closePanel();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [closePanel]);

  return (
    <div
      ref={panelRef}
      className={cn(
        "h-full border-l border-border bg-background flex flex-col shrink-0",
        "animate-in slide-in-from-right-4 duration-200",
        width,
      )}
    >
      <div className="flex items-center justify-between h-12 px-4 border-b border-border shrink-0">
        <h2 className="text-sm font-semibold">{title}</h2>
        <button
          type="button"
          onClick={closePanel}
          className="flex items-center justify-center h-7 w-7 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
      <div className="flex-1 overflow-y-auto">{children}</div>
    </div>
  );
}
