import { Circle } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
  cn,
} from "@nexu-design/ui-web";
import { mockRuntimes } from "@/mock/data";

interface RuntimePickerProps {
  value: string | null;
  onChange: (id: string | null) => void;
}

export function RuntimePicker({ value, onChange }: RuntimePickerProps): React.ReactElement {
  const selected = value ? mockRuntimes.find((r) => r.id === value) : null;
  const noRuntimeValue = "__none__";

  return (
    <Select
      value={value ?? noRuntimeValue}
      onValueChange={(nextValue) => onChange(nextValue === noRuntimeValue ? null : nextValue)}
    >
      <SelectTrigger className="h-10">
        {selected ? (
          <div className="flex items-center gap-2.5 min-w-0">
            <Circle
              className={cn(
                "size-2 fill-current stroke-none shrink-0",
                selected.status === "connected" && "text-slark-online",
                selected.status === "disconnected" && "text-slark-offline",
                selected.status === "error" && "text-destructive",
              )}
            />
            <span className="truncate">{selected.name}</span>
          </div>
        ) : (
          <SelectValue placeholder="No runtime" />
        )}
      </SelectTrigger>
      <SelectContent className="max-h-[240px]">
        <SelectGroup>
          <SelectItem value={noRuntimeValue} className="hover:bg-surface-2 rounded-lg">
            No runtime
          </SelectItem>
          {mockRuntimes.map((rt) => (
            <SelectItem key={rt.id} value={rt.id} className="hover:bg-surface-2 rounded-lg pr-10">
              <div className="flex items-center gap-2.5 min-w-0 w-full">
                <Circle
                  className={cn(
                    "size-2 fill-current stroke-none shrink-0",
                    rt.status === "connected" && "text-slark-online",
                    rt.status === "disconnected" && "text-slark-offline",
                    rt.status === "error" && "text-destructive",
                  )}
                />
                <div className="min-w-0 flex-1">
                  <div className="text-sm text-foreground truncate">{rt.name}</div>
                  <div className="text-xs text-muted-foreground truncate">
                    {rt.type}
                    {rt.version ? ` v${rt.version}` : ""}
                  </div>
                </div>
              </div>
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
