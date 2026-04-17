import { useState, useRef, useEffect } from "react";
import { ChevronDown, Check } from "lucide-react";
import { cn } from "@nexu-design/ui-web";
import { mockRuntimes } from "@/mock/data";

interface RuntimePickerProps {
  value: string | null;
  onChange: (id: string | null) => void;
}

export function RuntimePicker({ value, onChange }: RuntimePickerProps): React.ReactElement {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const selected = value ? mockRuntimes.find((r) => r.id === value) : null;

  useEffect(() => {
    if (!open) return;
    const handleClick = (e: MouseEvent): void => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex items-center gap-3 w-full h-10 px-3 rounded-md border border-input bg-background text-sm text-left hover:bg-accent/30 transition-colors"
      >
        {selected ? (
          <>
            <div
              className={cn(
                "h-2 w-2 rounded-full shrink-0",
                selected.status === "connected" && "bg-slark-online",
                selected.status === "disconnected" && "bg-slark-offline",
                selected.status === "error" && "bg-destructive",
              )}
            />
            <span className="flex-1 truncate">{selected.name}</span>
          </>
        ) : (
          <span className="flex-1 text-muted-foreground">No runtime</span>
        )}
        <ChevronDown
          className={cn(
            "h-3.5 w-3.5 text-muted-foreground transition-transform",
            open && "rotate-180",
          )}
        />
      </button>

      {open && (
        <div className="absolute z-50 mt-1 w-full max-h-[240px] overflow-y-auto rounded-lg border border-border bg-popover shadow-lg animate-in fade-in-0 zoom-in-95 duration-100">
          {mockRuntimes.map((rt) => (
            <button
              type="button"
              key={rt.id}
              onClick={() => {
                onChange(rt.id);
                setOpen(false);
              }}
              className={cn(
                "flex items-center gap-3 w-full px-3 py-2.5 text-sm text-left transition-colors hover:bg-accent",
                value === rt.id && "bg-accent/50",
              )}
            >
              <div
                className={cn(
                  "h-2 w-2 rounded-full shrink-0",
                  rt.status === "connected" && "bg-slark-online",
                  rt.status === "disconnected" && "bg-slark-offline",
                  rt.status === "error" && "bg-destructive",
                )}
              />
              <div className="min-w-0 flex-1">
                <div className="text-sm">{rt.name}</div>
                <div className="text-xs text-muted-foreground">
                  {rt.type}
                  {rt.version ? ` v${rt.version}` : ""}
                </div>
              </div>
              {value === rt.id && <Check className="h-3.5 w-3.5 text-foreground shrink-0" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
