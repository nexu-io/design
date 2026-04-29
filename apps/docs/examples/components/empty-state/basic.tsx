import { Button, EmptyState } from "@nexu-design/ui-web";

export function EmptyStateBasicExample() {
  return (
    <div className="w-[520px]">
      <EmptyState
        title="No channels connected"
        description="Connect your first channel to start receiving events."
        icon={<span aria-hidden="true">🔌</span>}
        action={<Button>Connect channel</Button>}
      />
    </div>
  );
}
