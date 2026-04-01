import type { Meta, StoryObj } from "@storybook/react-vite";
import type { ReactNode } from "react";

import { BrandLogo, PlatformLogo, ProviderLogo } from "@nexu-design/ui-web";

const meta = {
  title: "Primitives/Icons",
  tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const providerIds = [
  "nexu",
  "anthropic",
  "openai",
  "google",
  "xai",
  "kimi",
  "glm",
  "minimax",
  "openrouter",
  "siliconflow",
] as const;

const platformIds = ["slack", "feishu", "discord", "telegram", "wechat"] as const;
const brandIds = ["nexu", "github"] as const;

function IconGrid({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="space-y-4">
      <h2 className="text-lg font-semibold text-text-primary">{title}</h2>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">{children}</div>
    </section>
  );
}

function IconCard({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="rounded-xl border border-border bg-surface-1 p-4">
      <div className="flex items-center gap-3">
        <div className="flex size-10 items-center justify-center rounded-lg border border-border bg-surface-0">
          {children}
        </div>
        <div className="text-lg font-medium text-text-primary">{label}</div>
      </div>
    </div>
  );
}

export const Gallery: Story = {
  render: () => (
    <div className="space-y-8 p-6">
      <IconGrid title="Providers">
        {providerIds.map((provider) => (
          <IconCard key={provider} label={provider}>
            <ProviderLogo provider={provider} size={22} title={provider} />
          </IconCard>
        ))}
      </IconGrid>

      <IconGrid title="Platforms">
        {platformIds.map((platform) => (
          <IconCard key={platform} label={platform}>
            <PlatformLogo platform={platform} size={22} title={platform} />
          </IconCard>
        ))}
      </IconGrid>

      <IconGrid title="Brands">
        {brandIds.map((brand) => (
          <IconCard key={brand} label={brand}>
            <BrandLogo brand={brand} size={22} title={brand} />
          </IconCard>
        ))}
      </IconGrid>
    </div>
  ),
};
