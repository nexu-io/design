import type { Meta, StoryObj } from "@storybook/react-vite";

import { Button, PricingCard } from "@nexu-design/ui-web";

import { docsDescription } from "../storybook/docs-links";

const meta = {
  title: "Primitives/PricingCard",
  component: PricingCard,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: docsDescription("/components/pricing-card"),
      },
    },
  },
} satisfies Meta<typeof PricingCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    name: "Pro",
    price: "$29",
    period: "/ month",
    description: "Best for solo operators building repeatable workflows.",
    features: ["50,000 credits / month", "Priority compute", "Custom integrations"],
    footer: <Button className="w-full">Upgrade</Button>,
  },
};

export const Comparison: Story = {
  args: {
    name: "Starter",
    price: "$0",
    features: [],
  },
  render: () => (
    <div className="grid w-[920px] grid-cols-3 gap-4 pt-4">
      <PricingCard
        name="Starter"
        price="$0"
        period="/ month"
        description="For initial evaluation and internal prototypes."
        features={["3 active agents", "Shared compute", "Community support"]}
        footer={
          <Button variant="outline" className="w-full">
            Current plan
          </Button>
        }
      />
      <PricingCard
        name="Pro"
        price="$29"
        period="/ month"
        badge="Recommended"
        featured
        description="For teams scaling production automations."
        features={["Unlimited agents", "Priority compute", "Advanced analytics"]}
        footer={<Button className="w-full">Upgrade</Button>}
      />
      <PricingCard
        name="Enterprise"
        price="Custom"
        description="For regulated environments and dedicated support."
        features={["SAML / SSO", "Private networking", "Success manager"]}
        footer={
          <Button variant="secondary" className="w-full">
            Talk to sales
          </Button>
        }
      />
    </div>
  ),
};
