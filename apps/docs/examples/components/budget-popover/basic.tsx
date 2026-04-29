import { Button, BudgetPopover } from "@nexu-design/ui-web";

export function BudgetPopoverBasicExample() {
  return (
    <BudgetPopover
      defaultOpen
      trigger={<Button variant="outline">View details</Button>}
      title="Credit usage this month"
      description="Review current usage mix and open the full usage page for plan details."
      items={[
        { id: "ai-coding", label: "AI coding", value: "1,280", dotClassName: "bg-info" },
        { id: "content", label: "Content automation", value: "620", dotClassName: "bg-pink" },
        { id: "deployments", label: "Deployments", value: "100", dotClassName: "bg-success" },
      ]}
      summary="3,000 credits left this month · resets in ~12 days."
      footer={<Button size="sm">Open Settings → Usage</Button>}
    />
  );
}
