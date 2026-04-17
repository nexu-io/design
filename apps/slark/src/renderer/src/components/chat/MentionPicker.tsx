import { resolveRef } from "@/mock/data";
import type { MemberRef } from "@/types";
import {
  Badge,
  Card,
  InteractiveRow,
  InteractiveRowContent,
  InteractiveRowLeading,
  InteractiveRowTrailing,
  ScrollArea,
} from "@nexu-design/ui-web";
import { Bot } from "lucide-react";

interface MentionPickerProps {
  members: MemberRef[];
  query: string;
  onSelect: (ref: MemberRef, name: string) => void;
  onClose: () => void;
}

export function MentionPicker({
  members,
  query,
  onSelect,
  onClose,
}: MentionPickerProps): React.ReactElement {
  const filtered = members.filter((m) => {
    const resolved = resolveRef(m);
    if (!resolved) return false;
    return resolved.name.toLowerCase().includes(query.toLowerCase());
  });

  if (filtered.length === 0) {
    return (
      <Card
        variant="outline"
        padding="none"
        className="absolute bottom-full left-0 mb-1 w-64 overflow-hidden border-border bg-popover p-2 shadow-dropdown"
      >
        <div className="px-2 py-1.5 text-xs text-text-secondary">No matches</div>
      </Card>
    );
  }

  return (
    <Card
      variant="outline"
      padding="none"
      className="absolute bottom-full left-0 mb-1 w-64 overflow-hidden border-border bg-popover shadow-dropdown"
    >
      <ScrollArea className="max-h-64 p-1">
        <div className="space-y-1">
          {filtered.map((m) => {
            const resolved = resolveRef(m);
            if (!resolved) return null;
            return (
              <InteractiveRow
                key={`${m.kind}-${m.id}`}
                tone="subtle"
                className="items-center gap-2 rounded-lg px-2.5 py-2"
                onClick={() => {
                  onSelect(m, resolved.name);
                  onClose();
                }}
              >
                <InteractiveRowLeading>
                  <img src={resolved.avatar} alt="" className="h-5 w-5 rounded-full" />
                </InteractiveRowLeading>
                <InteractiveRowContent className="truncate text-left text-sm text-text-primary">
                  {resolved.name}
                </InteractiveRowContent>
                {resolved.isAgent ? (
                  <InteractiveRowTrailing>
                    <Badge variant="accent" size="xs" className="gap-1">
                      <Bot className="size-3" />
                      Agent
                    </Badge>
                  </InteractiveRowTrailing>
                ) : null}
              </InteractiveRow>
            );
          })}
        </div>
      </ScrollArea>
    </Card>
  );
}
