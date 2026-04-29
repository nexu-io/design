import { Button, PricingCard } from "@nexu-design/ui-web";

export function PricingCardBasicExample() {
  return (
    <PricingCard
      name="Pro"
      price="$29"
      period="/ month"
      description="Best for solo operators building repeatable workflows."
      features={["50,000 credits / month", "Priority compute", "Custom integrations"]}
      footer={<Button className="w-full">Upgrade</Button>}
    />
  );
}
