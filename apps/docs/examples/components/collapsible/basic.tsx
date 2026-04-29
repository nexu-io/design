import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@nexu-design/ui-web";

export function CollapsibleBasicExample() {
  return (
    <div className="w-[560px] rounded-xl border border-border bg-surface-1 p-4">
      <Collapsible defaultOpen>
        <div className="flex items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="text-lg font-semibold text-text-primary">Escalation policy</div>
            <div className="text-sm text-text-muted">Expand to review the fallback path.</div>
          </div>
          <CollapsibleTrigger className="inline-flex shrink-0 items-center rounded-md px-3 py-2 text-sm font-medium text-text-secondary transition-colors hover:bg-surface-2 hover:text-text-primary">
            Details
          </CollapsibleTrigger>
        </div>
        <CollapsibleContent className="mt-3 rounded-lg border border-border bg-surface-2 px-3 py-2.5 text-sm text-text-secondary">
          If the owner does not respond, the issue escalates to the on-call lead.
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}
