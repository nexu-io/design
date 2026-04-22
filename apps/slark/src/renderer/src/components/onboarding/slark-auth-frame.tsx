import type * as React from "react";

import { AuthShell, cn } from "@nexu-design/ui-web";
import { Bot, MessageSquare } from "lucide-react";

import brandRailReveal from "@/assets/brand-rail-reveal.webm";
import nexuMark from "@/assets/nexu-mark.svg";
import { TitleBarDragRegion } from "@/components/layout/WindowChrome";

interface SlarkAuthFrameProps {
  children: React.ReactNode;
  contentInnerClassName?: string;
  hideBranding?: boolean;
  /**
   * Vertical alignment of content within the shell.
   * - "center" (default): vertically centered — good for single, short auth screens.
   * - "top": anchored to top with a comfortable offset — use for multi-step flows
   *   where content height varies (onboarding) so the upper elements don't shift
   *   when the lower ones grow/shrink.
   */
  verticalAlign?: "center" | "top";
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
    <div aria-hidden="true" className="absolute inset-0 overflow-hidden">
      {/* Base dark gradient */}
      <div className="absolute inset-0 bg-[linear-gradient(180deg,#10131a_0%,#080a0f_100%)]" />

      {/* ASCII-style reveal animation. Plays once on mount, holds on the
          last frame (no loop — a constantly restarting reveal is jarring
          in a persistent brand surface). Muted + playsInline are required
          for autoplay in Chromium / Electron. Transparent WebM provides
          its own alpha, so no blend mode or invert filter is needed. */}
      <video
        src={brandRailReveal}
        autoPlay
        muted
        playsInline
        preload="auto"
        className="pointer-events-none absolute inset-y-0 right-0 h-full w-[85%] object-cover object-[75%_center]"
      />

      {/* Left-side soft vignette to guarantee logo + title legibility even
          when the animation extends toward the center. */}
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(8,10,15,0.92)_0%,rgba(8,10,15,0.70)_28%,rgba(8,10,15,0.30)_55%,transparent_80%)]" />

      {/* Soft top-left highlight — subtle monochrome lift on the hero area. */}
      <div className="absolute inset-0 bg-[radial-gradient(120%_120%_at_18%_18%,rgba(255,255,255,0.06),transparent_36%)]" />
    </div>
  );
}

const BRAND_TILES = [
  {
    icon: MessageSquare,
    title: "Humans and agents, one workspace",
    text: "Agents join your channels and DMs, working alongside the team.",
  },
  {
    icon: Bot,
    title: "Your models, your runtime",
    text: "Bring OpenAI, Claude, or local models via Ollama and LM Studio.",
  },
] as const;

function SlarkBrandRail(): React.ReactElement {
  return (
    <aside className="relative flex min-h-full w-full overflow-hidden text-white">
      <SlarkBrandBackdrop />

      <div className="relative z-10 flex w-full flex-col px-10 pb-12 pt-10 xl:px-12 xl:pb-12 xl:pt-12">
        {/* Hero: logo + title, vertically centered in the space above tiles */}
        <div className="flex flex-1 flex-col justify-center">
          <div className="space-y-6">
            <img src={nexuMark} alt="nexu" className="h-12 w-12 select-none" draggable={false} />

            <h1
              className="max-w-[460px] text-[40px] leading-[1.05] tracking-tight text-white sm:text-[44px]"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Slack for the Agent Era, built for human &amp; agent collaboration.
            </h1>
          </div>
        </div>

        {/* Feature tiles pinned to the bottom */}
        <div className="space-y-3 pt-10">
          {BRAND_TILES.map((item) => (
            <div
              key={item.title}
              className="grid grid-cols-[36px_1fr] items-start gap-4 rounded-xl border border-white/10 bg-white/[0.025] px-4 py-3.5"
            >
              <div className="mt-0.5 flex h-8 w-8 items-center justify-center rounded-lg bg-white/[0.06]">
                <item.icon className="size-4 text-white/80" />
              </div>
              <div className="space-y-1">
                <p className="text-[13px] font-semibold leading-tight text-white/90">
                  {item.title}
                </p>
                <p className="text-[13px] leading-[1.55] text-white/60">{item.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}

export function SlarkAuthFrame({
  children,
  contentInnerClassName,
  hideBranding = false,
  verticalAlign = "center",
}: SlarkAuthFrameProps): React.ReactElement {
  return (
    <div className="relative flex h-screen flex-col overflow-hidden bg-background">
      <TitleBarDragRegion />
      <div className="min-h-0 flex-1">
        <AuthShell
          rail={hideBranding ? undefined : <SlarkBrandRail />}
          className="h-full min-h-full"
          contentBackdrop={<SlarkAuthBackdrop />}
          contentContainerClassName={cn(
            "p-0",
            verticalAlign === "top" ? "items-start pt-[10vh]" : "items-center",
          )}
          contentInnerClassName={cn("mx-auto w-full max-w-[420px]", contentInnerClassName)}
        >
          <div className="flex min-h-full flex-col px-5 pb-8">{children}</div>
        </AuthShell>
      </div>
    </div>
  );
}
