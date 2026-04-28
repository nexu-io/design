import { Badge, Button, CreditsCapsule } from "@nexu-design/ui-web";

export function CreditsCapsuleBasicExample() {
  return (
    <CreditsCapsule
      title="Credit usage this month"
      badge={<Badge size="xs">Free Plan</Badge>}
      value="3,000 left"
      meta="2,000 / 5,000 used this month"
      hint="~12 days until reset"
      progress={2000}
      progressMax={5000}
      action={
        <Button variant="link" size="sm">
          View details
        </Button>
      }
      breakdown={
        <div className="grid gap-3 sm:grid-cols-3">
          <div className="text-[12px] text-text-secondary">AI coding · 1,280</div>
          <div className="text-[12px] text-text-secondary">Content automation · 620</div>
          <div className="text-[12px] text-text-secondary">Deployments · 100</div>
        </div>
      }
      footer={
        <div className="text-[12px] text-text-muted">
          Rewards credits stack on top of plan credits.
        </div>
      }
    />
  );
}
