import { ResizableHandle, ResizablePanel, SplitView } from "@nexu-design/ui-web";

export function SplitViewBasicExample() {
  return (
    <SplitView className="h-[280px] w-full max-w-[720px] overflow-hidden rounded-xl border border-border bg-surface-1">
      <ResizablePanel size={220} className="bg-surface-2 p-4">
        <div className="text-sm font-medium text-text-primary">Navigation</div>
        <p className="mt-2 text-sm text-text-secondary">Pinned filters and saved views.</p>
      </ResizablePanel>
      <ResizableHandle className="w-px bg-border" />
      <ResizablePanel className="p-4">
        <div className="text-sm font-medium text-text-primary">Workspace</div>
        <p className="mt-2 text-sm text-text-secondary">Open task detail with notes and actions.</p>
      </ResizablePanel>
    </SplitView>
  );
}
