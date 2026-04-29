import {
  InteractiveRow,
  InteractiveRowContent,
  InteractiveRowLeading,
  InteractiveRowTrailing,
} from "@nexu-design/ui-web";

export function InteractiveRowBasicExample() {
  return (
    <InteractiveRow className="w-[420px] p-3" selected>
      <InteractiveRowLeading>
        <div className="flex size-8 items-center justify-center rounded-lg bg-surface-3 text-xs font-semibold">
          AI
        </div>
      </InteractiveRowLeading>
      <InteractiveRowContent>
        <div className="text-sm font-medium text-text-primary">Automation review</div>
        <div className="text-sm text-text-secondary">Pending approval from finance</div>
      </InteractiveRowContent>
      <InteractiveRowTrailing>
        <span className="text-xs text-text-muted">2 min ago</span>
      </InteractiveRowTrailing>
    </InteractiveRow>
  );
}
