import { useT } from "@/i18n";
import { mockRuntimes } from "@/mock/data";
import { Select, SelectContent, SelectItem, SelectTrigger, StatusDot } from "@nexu-design/ui-web";

interface RuntimePickerProps {
  value: string | null;
  onChange: (id: string | null) => void;
}

const NONE_RUNTIME_VALUE = "__none__";

function getRuntimeStatus(
  status: (typeof mockRuntimes)[number]["status"],
): "success" | "neutral" | "error" {
  switch (status) {
    case "connected":
      return "success";
    case "error":
      return "error";
    default:
      return "neutral";
  }
}

export function RuntimePicker({ value, onChange }: RuntimePickerProps): React.ReactElement {
  const t = useT();
  const selected = value ? mockRuntimes.find((r) => r.id === value) : null;

  return (
    <Select
      value={value ?? NONE_RUNTIME_VALUE}
      onValueChange={(nextValue) => onChange(nextValue === NONE_RUNTIME_VALUE ? null : nextValue)}
    >
      <SelectTrigger className="h-10">
        {selected ? (
          <span className="flex min-w-0 items-center gap-3 text-left">
            <StatusDot status={getRuntimeStatus(selected.status)} size="default" />
            <span className="truncate text-[13px] text-text-primary">{selected.name}</span>
          </span>
        ) : (
          <span className="truncate text-[13px] text-text-muted">{t("runtime.noRuntime")}</span>
        )}
      </SelectTrigger>

      <SelectContent className="max-h-[240px]">
        <SelectItem value={NONE_RUNTIME_VALUE} className="py-2.5">
          <span className="text-[13px] text-text-muted">{t("runtime.noRuntime")}</span>
        </SelectItem>

        {mockRuntimes.map((rt) => (
          <SelectItem key={rt.id} value={rt.id} className="py-2.5">
            <span className="flex min-w-0 items-center gap-3 pr-4">
              <StatusDot status={getRuntimeStatus(rt.status)} size="default" />
              <span className="min-w-0 flex-1">
                <span className="block truncate text-[13px] text-text-primary">{rt.name}</span>
                <span className="block truncate text-[11px] text-text-muted">
                  {rt.type}
                  {rt.version ? ` v${rt.version}` : ""}
                </span>
              </span>
            </span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
