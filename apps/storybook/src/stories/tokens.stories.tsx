import { useState } from "react";
import type { CSSProperties, ReactNode } from "react";

import type { Meta, StoryContext, StoryObj } from "@storybook/react-vite";

import {
  BRAND_PRESET_LABELS,
  type TokenDefinition,
  accentVariantTokens,
  borderTokens,
  darkSurfaceTokens,
  motionTokens,
  radiusTokens,
  semanticColorTokens,
  shadowTokens,
  spacingTokens,
  surfaceTokens,
  textLevelTokens,
  typographyTokens,
} from "@nexu-design/tokens";
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Input,
  PageHeader,
  PageShell,
  SectionHeader,
} from "@nexu-design/ui-web";

import {
  MOTION_PRESET_LABELS,
  type MotionPreset,
  RADIUS_PRESET_LABELS,
  type RadiusPreset,
  SHADOW_PRESET_LABELS,
  type ShadowPreset,
  buildTokenOverrides,
  getBrandHex,
  getMotionVariables,
  getRadiusVariables,
  getShadowVariables,
} from "../storybook/token-controls";

type TokensStoryArgs = {
  brandColor: string;
  radiusPreset: RadiusPreset;
  shadowPreset: ShadowPreset;
  motionPreset: MotionPreset;
};

const meta = {
  title: "Foundations/Tokens",
  parameters: {
    layout: "fullscreen",
  },
  args: {
    brandColor: getBrandHex("default") ?? "#2563eb",
    radiusPreset: "default",
    shadowPreset: "default",
    motionPreset: "default",
  },
  argTypes: {
    brandColor: {
      control: "color",
      description: "Overrides the primary/ring token for this story canvas.",
    },
    radiusPreset: {
      control: "inline-radio",
      options: Object.keys(RADIUS_PRESET_LABELS),
      description: "Rescales all radius tokens.",
    },
    shadowPreset: {
      control: "inline-radio",
      options: Object.keys(SHADOW_PRESET_LABELS),
      description: "Adjusts shadow intensity across cards and surfaces.",
    },
    motionPreset: {
      control: "inline-radio",
      options: Object.keys(MOTION_PRESET_LABELS),
      description: "Tweaks shared motion tokens.",
    },
  },
} satisfies Meta<TokensStoryArgs>;

export default meta;
type Story = StoryObj<TokensStoryArgs>;

export const Playground: Story = {
  args: {
    brandColor: "rgba(37, 99, 235, 1)",
  },

  render: renderTokensStory,
};

function renderTokensStory(
  args: TokensStoryArgs,
  context: StoryContext<TokensStoryArgs> & {
    globals: {
      theme?: string;
      brandPreset?: keyof typeof BRAND_PRESET_LABELS;
    };
  },
) {
  const canvasStyle = toStyleObject(
    buildTokenOverrides({
      brandColor: args.brandColor,
      radiusPreset: args.radiusPreset,
      shadowPreset: args.shadowPreset,
      motionPreset: args.motionPreset,
    }),
  );

  const brandPreset = context.globals.brandPreset as keyof typeof BRAND_PRESET_LABELS | undefined;
  const activeBrandPreset = (brandPreset && BRAND_PRESET_LABELS[brandPreset]) || "Default";
  const radiusValues = getRadiusVariables(args.radiusPreset);
  const shadowValues = getShadowVariables(args.shadowPreset);
  const motionValues = getMotionVariables(args.motionPreset);

  return (
    <div style={canvasStyle}>
      <PageShell className="mx-auto min-h-screen max-w-7xl px-6 py-8 md:px-10">
        <PageHeader
          title="Token studio"
          description="Inspect semantic tokens, switch global themes from the toolbar, and tune core design seeds live from Controls."
          actions={
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="secondary">Theme: {context.globals.theme ?? "system"}</Badge>
              <Badge variant="secondary">Brand preset: {activeBrandPreset}</Badge>
              <Badge variant="secondary">
                Canvas radius: {RADIUS_PRESET_LABELS[args.radiusPreset]}
              </Badge>
            </div>
          }
        />

        <section className="grid gap-6 xl:grid-cols-[1.4fr_0.9fr]">
          <Card className="bg-card shadow-md">
            <CardHeader>
              <CardTitle>Live preview</CardTitle>
              <CardDescription>
                These components consume semantic tokens, not hard-coded values.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6 lg:grid-cols-2">
              <div className="space-y-4 rounded-lg border border-border bg-background p-5 shadow-sm transition-all duration-normal ease-standard">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-text-secondary">Primary actions</p>
                  <div className="flex flex-wrap gap-3">
                    <Button>Publish update</Button>
                    <Button variant="secondary">Preview docs</Button>
                    <Button variant="outline">Share token link</Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-text-secondary" htmlFor="token-search">
                    Search token
                  </label>
                  <Input id="token-search" placeholder="Try primary, radius, motion..." />
                </div>
                <div className="flex flex-wrap gap-2">
                  <Badge>Primary</Badge>
                  <Badge variant="secondary">Secondary</Badge>
                  <Badge variant="outline">Outline</Badge>
                </div>
              </div>

              <div className="rounded-lg border border-border bg-surface-2 p-5 shadow-sm transition-all duration-normal ease-standard">
                <p className="mb-3 text-sm font-medium text-text-secondary">Surface stress test</p>
                <div className="space-y-3">
                  <div className="rounded-md bg-primary px-4 py-3 text-sm font-medium text-primary-foreground shadow-xs">
                    Brand background uses <code>--primary</code>
                  </div>
                  <div className="rounded-md border border-border bg-card px-4 py-3 text-sm text-text-secondary shadow-sm">
                    Neutral surface inherits the active theme.
                  </div>
                  <div className="rounded-md bg-success px-4 py-3 text-sm font-medium text-success-foreground shadow-xs">
                    Status colors stay independent from brand edits.
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card shadow-md">
            <CardHeader>
              <CardTitle>Active seeds</CardTitle>
              <CardDescription>
                Toolbar changes apply globally. Controls below apply only to this story canvas.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-sm text-text-secondary">
              <SeedRow label="Brand color" value={args.brandColor} />
              <SeedRow label="Radius preset" value={RADIUS_PRESET_LABELS[args.radiusPreset]} />
              <SeedRow label="Shadow preset" value={SHADOW_PRESET_LABELS[args.shadowPreset]} />
              <SeedRow label="Motion preset" value={MOTION_PRESET_LABELS[args.motionPreset]} />
              <div className="rounded-lg border border-border bg-surface-2 p-4">
                <p className="mb-2 font-medium text-text-primary">Global presets</p>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(BRAND_PRESET_LABELS).map(([value, label]) => (
                    <Badge key={value} variant={value === brandPreset ? "default" : "secondary"}>
                      {label}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        <section className="mt-10 space-y-6">
          <SectionHeader
            title="Token reference"
            description="Token metadata is sourced from @nexu-design/tokens so Storybook stays in sync with the package contract."
          />

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {semanticColorTokens.map((token) => (
              <ColorTokenCard key={token.cssVar} token={token} />
            ))}
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {surfaceTokens.map((token) => (
              <SwatchCard key={token.cssVar} token={token} />
            ))}
          </div>

          <div className="grid gap-6 xl:grid-cols-2">
            <TokenGroupCard
              title="Border variants"
              description="Alpha-based borders for layered surfaces."
            >
              {borderTokens.map((token) => (
                <SwatchCard key={token.cssVar} token={token} />
              ))}
            </TokenGroupCard>
            <TokenGroupCard
              title="Text levels"
              description="Extended text hierarchy beyond primary/secondary/muted."
            >
              {textLevelTokens.map((token) => (
                <SwatchCard key={token.cssVar} token={token} />
              ))}
            </TokenGroupCard>
          </div>

          <div className="grid gap-6 xl:grid-cols-2">
            <TokenGroupCard
              title="Dark surfaces"
              description="Intentionally dark panels — hero, brand sections."
            >
              {darkSurfaceTokens.map((token) => (
                <SwatchCard key={token.cssVar} token={token} />
              ))}
            </TokenGroupCard>
            <TokenGroupCard
              title="Accent variants"
              description="Subtle accent washes for hover and active states."
            >
              {accentVariantTokens.map((token) => (
                <SwatchCard key={token.cssVar} token={token} />
              ))}
            </TokenGroupCard>
          </div>

          <TokenGroupCard
            title="Spacing scale"
            description="Base unit 0.25rem (4px). All spacing utilities multiply this value."
          >
            <div className="space-y-1">
              {spacingTokens.map((token) => (
                <SpacingRow key={token.cssVar} token={token} />
              ))}
            </div>
          </TokenGroupCard>

          <div className="grid gap-6 xl:grid-cols-2">
            <TokenGroupCard
              title="Typography"
              description="Font stacks registered as design tokens."
            >
              {typographyTokens.map((token) => (
                <TypographyRow key={token.cssVar} token={token} />
              ))}
            </TokenGroupCard>
            <div className="space-y-6">
              <TokenGroupCard title="Radius scale" description="Shape personality across surfaces.">
                {radiusTokens.map((token) => (
                  <TokenValueRow
                    key={token.cssVar}
                    token={token}
                    value={radiusValues[token.cssVar]}
                  />
                ))}
              </TokenGroupCard>
              <TokenGroupCard title="Shadow scale" description="Depth for overlays and cards.">
                {shadowTokens.map((token) => (
                  <TokenValueRow
                    key={token.cssVar}
                    token={token}
                    value={shadowValues[token.cssVar]}
                  />
                ))}
              </TokenGroupCard>
              <TokenGroupCard title="Motion" description="Shared transition timing primitives.">
                {motionTokens.map((token) => (
                  <TokenValueRow
                    key={token.cssVar}
                    token={token}
                    value={motionValues[token.cssVar]}
                  />
                ))}
              </TokenGroupCard>
            </div>
          </div>
        </section>
      </PageShell>
    </div>
  );
}

function ColorTokenCard({ token }: { token: TokenDefinition }) {
  return (
    <div className="overflow-hidden rounded-lg border border-border bg-card shadow-sm">
      <div
        className="flex min-h-28 items-end justify-between gap-3 p-4"
        style={{
          backgroundColor: token.value,
          color: token.foreground,
        }}
      >
        <div>
          <span className="text-sm font-semibold">{token.name}</span>
          <p className="mt-1 text-xs opacity-90">{token.description}</p>
        </div>
        <CopyButton value={`${token.cssVar}: ${token.value};`} />
      </div>
      <div className="space-y-2 p-4 text-sm text-text-secondary">
        <div className="flex items-center justify-between gap-3">
          <p className="font-medium text-text-primary">{token.utility}</p>
          <CopyButton value={token.utility ?? token.cssVar} />
        </div>
        <code className="block text-xs">{token.cssVar}</code>
        <code className="block text-xs">{token.value}</code>
      </div>
    </div>
  );
}

function SpacingRow({ token }: { token: TokenDefinition }) {
  return (
    <div className="flex items-center gap-3 rounded-md border border-border bg-background px-3 py-1.5 text-sm">
      <code className="w-16 shrink-0 text-xs font-medium text-text-primary">{token.name}</code>
      <div className="h-3 shrink-0 rounded-sm bg-primary" style={{ width: token.value }} />
      <code className="w-20 shrink-0 text-xs text-text-secondary">{token.value}</code>
      <span className="truncate text-xs text-text-muted">{token.description}</span>
    </div>
  );
}

function SwatchCard({ token }: { token: TokenDefinition }) {
  return (
    <div className="flex items-center gap-3 overflow-hidden rounded-lg border border-border bg-card p-3 shadow-sm">
      <div
        className="h-10 w-10 shrink-0 rounded-md border border-border"
        style={{ backgroundColor: token.value }}
      />
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-text-primary">{token.name}</p>
        <code className="text-xs text-text-secondary">{token.cssVar}</code>
      </div>
      <CopyButton value={token.cssVar} />
    </div>
  );
}

function TypographyRow({ token }: { token: TokenDefinition }) {
  return (
    <div className="rounded-md border border-border bg-background px-3 py-2 text-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="font-medium text-text-primary">{token.name}</p>
          <code className="text-xs text-text-secondary">{token.cssVar}</code>
        </div>
        <CopyButton value={token.cssVar} />
      </div>
      <p className="mt-1 text-xs text-text-secondary">{token.description}</p>
      <p className="mt-2 text-sm" style={{ fontFamily: token.value }}>
        The quick brown fox jumps over the lazy dog — 0123456789
      </p>
    </div>
  );
}

function SeedRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-md border border-border bg-background px-3 py-2">
      <span>{label}</span>
      <div className="flex items-center gap-2">
        <code className="text-xs text-text-primary">{value}</code>
        <CopyButton value={value} />
      </div>
    </div>
  );
}

function TokenGroupCard({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <Card className="bg-card shadow-sm">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">{children}</CardContent>
    </Card>
  );
}

function TokenValueRow({ token, value }: { token: TokenDefinition; value: string }) {
  return (
    <div className="rounded-md border border-border bg-background px-3 py-2 text-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="font-medium text-text-primary">{token.name}</p>
          <code className="text-xs text-text-secondary">{token.cssVar}</code>
        </div>
        <CopyButton value={`${token.cssVar}: ${value};`} />
      </div>
      <p className="mt-2 text-text-secondary">{token.description}</p>
      <code className="mt-2 block text-xs text-text-primary">{value}</code>
    </div>
  );
}

function CopyButton({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);

  return (
    <Button
      type="button"
      size="sm"
      variant="outline"
      onClick={async () => {
        if (typeof navigator === "undefined" || !navigator.clipboard) {
          return;
        }

        await navigator.clipboard.writeText(value);
        setCopied(true);
        window.setTimeout(() => setCopied(false), 1200);
      }}
    >
      {copied ? "Copied" : "Copy"}
    </Button>
  );
}

function toStyleObject(overrides: Record<`--${string}`, string>): CSSProperties {
  return overrides as CSSProperties;
}
