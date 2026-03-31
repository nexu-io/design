import type { Meta, StoryObj } from "@storybook/react-vite";
import { ArrowRight, Globe2, Shield, Sparkles } from "lucide-react";

import {
  AuthShell,
  BrandRail,
  Button,
  Input,
  Label,
  Stepper,
  StepperItem,
  StepperSeparator,
  ThemeRoot,
} from "@nexu-design/ui-web";

const meta = {
  title: "Patterns/Auth Shell",
  tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

function StoryRail({ tone = "dark" }: { tone?: "light" | "dark" }) {
  const isDark = tone === "dark";

  return (
    <BrandRail
      tone={tone}
      logo={
        <div
          className={
            isDark
              ? "text-lg font-semibold tracking-tight text-white"
              : "text-lg font-semibold tracking-tight text-foreground"
          }
        >
          nexu
        </div>
      }
      logoLabel="Nexu home"
      title={
        <h1
          className={
            isDark
              ? "max-w-[560px] text-[40px] leading-[0.96] tracking-tight text-white sm:text-[52px]"
              : "max-w-[560px] text-[40px] leading-[0.96] tracking-tight text-foreground sm:text-[52px]"
          }
          style={{ fontFamily: "var(--font-heading)" }}
        >
          OpenClaw,
          <br />
          ready to use.
        </h1>
      }
      description="A desktop onboarding shell for auth, setup, and provider connection flows."
      background={
        isDark ? (
          <div className="absolute inset-0 bg-[radial-gradient(120%_120%_at_18%_18%,rgba(255,255,255,0.08),transparent_36%),radial-gradient(80%_80%_at_82%_22%,rgba(180,150,255,0.14),transparent_36%),linear-gradient(180deg,hsl(var(--foreground))_0%,#0a0a0d_100%)]" />
        ) : (
          <div className="absolute inset-0 bg-[radial-gradient(120%_120%_at_18%_18%,rgba(37,99,235,0.08),transparent_36%),radial-gradient(80%_80%_at_82%_22%,rgba(56,189,248,0.12),transparent_36%),linear-gradient(180deg,hsl(var(--secondary))_0%,hsl(var(--background))_100%)]" />
        )
      }
      footer={
        <a
          href="https://github.com/refly-ai/nexu"
          className={
            isDark
              ? "inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white/82"
              : "inline-flex items-center gap-2 rounded-full border border-border bg-background/80 px-4 py-3 text-sm text-text-secondary"
          }
        >
          GitHub
          <ArrowRight className="size-4" />
        </a>
      }
    >
      <div className="space-y-3">
        {[
          { icon: Sparkles, text: "Ship auth and welcome flows with a shared desktop shell." },
          { icon: Shield, text: "Keep brand context, trust cues, and product value visible." },
          { icon: Globe2, text: "Support setup, sign-in, and onboarding steps in one frame." },
        ].map((item) => (
          <div
            key={item.text}
            className={
              isDark
                ? "grid min-h-[72px] grid-cols-[40px_1fr] items-center gap-4 rounded-xl border border-white/10 bg-white/[0.025] px-5 py-4"
                : "grid min-h-[72px] grid-cols-[40px_1fr] items-center gap-4 rounded-xl border border-border bg-background/80 px-5 py-4"
            }
          >
            <div
              className={
                isDark
                  ? "flex h-8 w-8 items-center justify-center rounded-lg bg-white/[0.06]"
                  : "flex h-8 w-8 items-center justify-center rounded-lg bg-primary/8"
              }
            >
              <item.icon className={isDark ? "size-4 text-white/66" : "size-4 text-primary"} />
            </div>
            <p
              className={
                isDark
                  ? "text-[13px] leading-[1.6] text-white/58"
                  : "text-[13px] leading-[1.6] text-text-secondary"
              }
            >
              {item.text}
            </p>
          </div>
        ))}
      </div>
    </BrandRail>
  );
}

export const Login: Story = {
  render: () => (
    <div className="min-h-[720px] overflow-hidden rounded-xl border border-border">
      <AuthShell rail={<StoryRail />}>
        <div className="mx-auto w-full max-w-[380px]">
          <div className="rounded-2xl border border-border bg-surface-1 p-8 shadow-card">
            <div className="mb-6 text-center">
              <h2 className="text-lg font-semibold text-text-primary">Create account</h2>
              <p className="mt-1 text-sm text-text-secondary">Choose how you want to continue.</p>
            </div>

            <div className="space-y-3">
              <Button className="w-full justify-center">Continue with Google</Button>
              <Button className="w-full justify-center bg-[#111] text-white hover:bg-[#222]">
                Continue with GitHub
              </Button>
              <div className="flex items-center gap-3 py-1">
                <div className="flex-1 border-t border-border" />
                <span className="text-[11px] uppercase tracking-wider text-text-muted">or</span>
                <div className="flex-1 border-t border-border" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="storybook-email">Email</Label>
                <Input id="storybook-email" type="email" placeholder="you@company.com" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="storybook-password">Password</Label>
                <Input id="storybook-password" type="password" placeholder="••••••••" />
              </div>
              <Button className="w-full justify-center">Continue</Button>
            </div>
          </div>
        </div>
      </AuthShell>
    </div>
  ),
};

export const LightLogin: Story = {
  render: () => (
    <ThemeRoot theme="light">
      <div className="min-h-[720px] overflow-hidden rounded-xl border border-border bg-background">
        <AuthShell rail={<StoryRail tone="light" />}>
          <div className="mx-auto w-full max-w-[380px]">
            <div className="rounded-2xl border border-border bg-surface-1 p-8 shadow-sm">
              <div className="mb-6 text-center">
                <h2 className="text-lg font-semibold text-text-primary">Create account</h2>
                <p className="mt-1 text-sm text-text-secondary">Choose how you want to continue.</p>
              </div>

              <div className="space-y-3">
                <Button className="w-full justify-center">Continue with Google</Button>
                <Button className="w-full justify-center" variant="secondary">
                  Continue with email
                </Button>
                <div className="flex items-center gap-3 py-1">
                  <div className="flex-1 border-t border-border" />
                  <span className="text-[11px] uppercase tracking-wider text-text-muted">or</span>
                  <div className="flex-1 border-t border-border" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="storybook-light-email">Email</Label>
                  <Input id="storybook-light-email" type="email" placeholder="you@company.com" />
                </div>
                <Button className="w-full justify-center">Continue</Button>
              </div>
            </div>
          </div>
        </AuthShell>
      </div>
    </ThemeRoot>
  ),
};

export const Onboarding: Story = {
  render: () => (
    <div className="min-h-[720px] overflow-hidden rounded-xl border border-border">
      <AuthShell rail={<StoryRail />}>
        <div className="mx-auto w-full max-w-[520px] space-y-6">
          <Stepper>
            <StepperItem status="completed" step={1} label="Profile" className="max-w-[120px]" />
            <StepperSeparator active />
            <StepperItem status="current" step={2} label="Use cases" className="max-w-[120px]" />
            <StepperSeparator />
            <StepperItem status="pending" step={3} label="Channels" className="max-w-[120px]" />
          </Stepper>

          <div className="rounded-3xl border border-border bg-surface-1 p-8 shadow-card">
            <h2 className="text-2xl font-semibold text-text-primary">Tell us how you work</h2>
            <p className="mt-2 text-sm leading-6 text-text-secondary">
              Keep the shell stable while onboarding steps swap inside the content slot.
            </p>
            <div className="mt-6 grid grid-cols-2 gap-3">
              {["Code & Deploy", "Content Creation", "Customer Support", "Research"].map(
                (item, index) => (
                  <button
                    key={item}
                    type="button"
                    className={`rounded-2xl border px-4 py-5 text-left text-sm font-medium transition-colors ${
                      index === 0
                        ? "border-[var(--color-brand-primary)] bg-[var(--color-brand-primary)]/5 text-text-primary"
                        : "border-border bg-surface-0 text-text-secondary"
                    }`}
                  >
                    {item}
                  </button>
                ),
              )}
            </div>
            <div className="mt-6 flex justify-end">
              <Button>
                Continue
                <ArrowRight className="size-4" />
              </Button>
            </div>
          </div>
        </div>
      </AuthShell>
    </div>
  ),
};
