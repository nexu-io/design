import type * as React from "react";

import { AuthShell, BrandRail } from "@nexu-design/ui-web";
import { Bot, MessageSquare, Sparkles } from "lucide-react";

import { TitleBarDragRegion } from "@/components/layout/WindowChrome";
import { cn } from "@/lib/utils";

interface SlarkAuthFrameProps {
  children: React.ReactNode;
  contentInnerClassName?: string;
  hideBranding?: boolean;
  hideFooter?: boolean;
}

function SlarkAuthBackdrop(): React.ReactElement {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0"
      style={{
        background:
          "radial-gradient(120% 80% at 50% -10%, color-mix(in srgb, var(--color-brand-primary) 18%, transparent), transparent 55%)",
      }}
    />
  );
}

function SlarkBrandBackdrop(): React.ReactElement {
  return (
    <div className="absolute inset-0 bg-[radial-gradient(120%_120%_at_18%_18%,rgba(255,255,255,0.08),transparent_36%),radial-gradient(80%_80%_at_82%_22%,color-mix(in_srgb,var(--color-brand-primary)_28%,transparent),transparent_36%),linear-gradient(180deg,#10131a_0%,#080a0f_100%)]" />
  );
}

function SlarkBrandRail(): React.ReactElement {
  return (
    <BrandRail
      logo={
        <div className="flex items-center gap-2 text-white">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10">
            <Sparkles className="size-4" />
          </div>
          <div>
            <div className="text-lg font-semibold tracking-tight">Slark</div>
            <div className="text-[11px] text-white/58">Desktop-first workspace</div>
          </div>
        </div>
      }
      logoLabel="Slark"
      title={
        <h1
          className="max-w-[460px] text-[40px] leading-[0.98] tracking-tight text-white sm:text-[48px]"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          Bring your workspace,
          <br />
          agents, and invites together.
        </h1>
      }
      description="Keep auth, onboarding, and invite entry points inside one shared desktop shell with drag-safe framing."
      background={<SlarkBrandBackdrop />}
      footer={
        <div className="space-y-3">
          {[
            {
              icon: MessageSquare,
              text: "Chat, onboarding, and workspace navigation share the same UI system.",
            },
            {
              icon: Bot,
              text: "Keep setup flows aligned with the desktop shell and agent-first product shape.",
            },
          ].map((item) => (
            <div
              key={item.text}
              className="grid min-h-[68px] grid-cols-[36px_1fr] items-center gap-4 rounded-xl border border-white/10 bg-white/[0.025] px-4 py-3"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/[0.06]">
                <item.icon className="size-4 text-white/70" />
              </div>
              <p className="text-sm leading-[1.6] text-white/60">{item.text}</p>
            </div>
          ))}
        </div>
      }
    />
  );
}

function SlarkAuthFooter(): React.ReactElement {
  return (
    <p className="text-center text-[11px] text-text-tertiary">
      Sign in, accept invites, and finish setup without leaving the shared desktop shell.
    </p>
  );
}

export function SlarkAuthFrame({
  children,
  contentInnerClassName,
  hideBranding = false,
  hideFooter = false,
}: SlarkAuthFrameProps): React.ReactElement {
  return (
    <div className="relative flex h-screen flex-col overflow-hidden bg-background">
      <TitleBarDragRegion />
      <div className="min-h-0 flex-1">
        <AuthShell
          rail={hideBranding ? undefined : <SlarkBrandRail />}
          className="h-full min-h-full"
          contentBackdrop={<SlarkAuthBackdrop />}
          contentContainerClassName="items-center p-0"
          contentInnerClassName={cn("mx-auto w-full max-w-[420px]", contentInnerClassName)}
        >
          <div className="flex min-h-full flex-col justify-center px-5 py-8">
            {children}
            {hideFooter ? null : (
              <div className="mt-8">
                <SlarkAuthFooter />
              </div>
            )}
          </div>
        </AuthShell>
      </div>
    </div>
  );
}
