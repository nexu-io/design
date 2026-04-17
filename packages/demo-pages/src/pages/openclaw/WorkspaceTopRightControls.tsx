import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  InteractiveRow,
  InteractiveRowContent,
  InteractiveRowLeading,
  InteractiveRowTrailing,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  cn,
} from "@nexu-design/ui-web";
import { Info, LogOut, X } from "lucide-react";
import type React from "react";

import { CreditIcon } from "./iconHelpers";
import { type View, initialsFromEmail } from "./workspaceTypes";

const CREDITS_USAGE_TRIGGER_Z = 2_147_483_646;
const CREDITS_USAGE_PANEL_Z = 2_147_483_647;
const CREDITS_USAGE_TOOLTIP_Z = 2_147_483_647;

type Props = {
  nexuLoggedIn: boolean;
  demoPlan: "free" | "plus" | "pro";
  budget: { remaining: number; bonusRemaining: number; total: number };
  creditPackInfo: { label: string; remaining: number };
  nexuAccountEmail: string;
  setView: (v: View) => void;
  openExternal: (url: string) => void;
  showUsagePanel: boolean;
  usagePanelLayout: { top: number; left: number; width: number } | null;
  openUsagePanel: () => void;
  scheduleCloseUsagePanel: () => void;
  clearUsageLeaveTimer: () => void;
  showAccountPanel: boolean;
  accountPanelLayout: { top: number; right: number } | null;
  openAccountPanel: () => void;
  scheduleCloseAccountPanel: () => void;
  clearAccountLeaveTimer: () => void;
  setShowUsagePanel: (v: boolean) => void;
  setShowAccountPanel: (v: boolean) => void;
  setDemoLoggedIn: (v: boolean) => void;
  creditsShellRef: React.RefObject<HTMLDivElement | null>;
  avatarRef: React.RefObject<HTMLButtonElement | null>;
  budgetStatus?: "healthy" | "warning" | "depleted";
  onBudgetDotClick?: () => void;
};

export function WorkspaceTopRightControls({
  nexuLoggedIn,
  demoPlan,
  budget,
  creditPackInfo,
  nexuAccountEmail,
  setView,
  openExternal,
  showUsagePanel,
  usagePanelLayout,
  openUsagePanel,
  scheduleCloseUsagePanel,
  clearUsageLeaveTimer,
  showAccountPanel,
  accountPanelLayout,
  openAccountPanel,
  scheduleCloseAccountPanel,
  clearAccountLeaveTimer,
  setShowUsagePanel,
  setShowAccountPanel,
  setDemoLoggedIn,
  creditsShellRef,
  avatarRef,
  budgetStatus,
  onBudgetDotClick,
}: Props) {
  if (!nexuLoggedIn) {
    return (
      <div
        className="absolute top-5 right-5"
        style={
          { WebkitAppRegion: "no-drag", zIndex: CREDITS_USAGE_TRIGGER_Z } as React.CSSProperties
        }
      >
        <button
          type="button"
          onClick={() => openExternal(`${window.location.origin}/openclaw/auth?desktop=1`)}
          className="flex items-center gap-2 h-7 pl-3 pr-1 rounded-full bg-surface-0 border border-border cursor-pointer hover:border-border-subtle hover:shadow-sm transition-all shrink-0"
          title="Sign in to nexu"
        >
          <span className="text-[12px] font-medium text-text-secondary leading-none">Sign in</span>
          <span className="flex items-center justify-center size-5 rounded-full bg-surface-2">
            <img src="/brand/nexu logo-black1.svg" alt="nexu" className="size-3" />
          </span>
        </button>
      </div>
    );
  }

  const planKey = demoPlan;
  const isFree = planKey === "free";
  const isPlus = planKey === "plus";
  const PLAN_META: Record<string, { label: string; color: string }> = {
    free: { label: "Free", color: "text-[var(--color-text-muted)]" },
    plus: { label: "Plus", color: "text-[var(--color-info)]" },
    pro: { label: "Pro", color: "text-[var(--color-brand-primary)]" },
  };
  const CREDITS_PILL_STYLES: Record<string, { shell: string; icon: string; value: string }> = {
    free: {
      shell: "bg-surface-0 border border-border-subtle hover:border-border transition-colors",
      icon: "text-text-secondary",
      value: "text-text-primary font-medium",
    },
    plus: {
      shell:
        "bg-[var(--color-info-subtle)] border border-[var(--color-info)]/35 hover:border-[var(--color-info)]/55 transition-colors",
      icon: "text-[var(--color-info)]",
      value: "text-[var(--color-info)] font-semibold",
    },
    pro: {
      shell: cn(
        "relative overflow-hidden border border-[var(--color-brand-primary)]/50",
        "bg-gradient-to-br from-[hsl(var(--accent)/0.24)] via-[var(--color-surface-0)] to-[hsl(var(--accent)/0.11)]",
        "shadow-[0_2px_16px_-4px_hsl(var(--accent)/0.42),inset_0_1px_0_rgba(255,255,255,0.72)]",
        "hover:border-[var(--color-brand-primary)]/70 hover:shadow-[0_4px_22px_-5px_hsl(var(--accent)/0.5),inset_0_1px_0_rgba(255,255,255,0.8)]",
        "transition-[box-shadow,border-color] duration-200",
      ),
      icon: "text-[var(--color-brand-primary)] drop-shadow-[0_0_10px_hsl(var(--accent)/0.5)]",
      value: "text-text-primary font-semibold",
    },
  };

  const plan = PLAN_META[planKey];
  const pillStyle = CREDITS_PILL_STYLES[planKey] ?? CREDITS_PILL_STYLES.free;
  const baseCredits = Math.round(budget.remaining);
  const bonusCredits = Math.round(budget.bonusRemaining);
  const packCredits = creditPackInfo.remaining;
  const totalCredits = baseCredits + bonusCredits + packCredits;

  return (
    <>
      <div
        ref={creditsShellRef}
        className="absolute top-5 right-5"
        style={
          { WebkitAppRegion: "no-drag", zIndex: CREDITS_USAGE_TRIGGER_Z } as React.CSSProperties
        }
      >
        <div className="flex items-center gap-2.5">
          <div
            onMouseEnter={() => {
              openUsagePanel();
              clearAccountLeaveTimer();
              setShowAccountPanel(false);
            }}
            onMouseLeave={scheduleCloseUsagePanel}
            className={cn(
              "flex items-center gap-1 h-7 pl-3 pr-3 rounded-full cursor-default text-[13px]",
              pillStyle.shell,
            )}
          >
            <CreditIcon size={12} className={pillStyle.icon} />
            <span className={cn("text-[13px] tabular-nums leading-none", pillStyle.value)}>
              {totalCredits.toLocaleString()}
            </span>
            {(budgetStatus === "warning" || budgetStatus === "depleted") && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onBudgetDotClick?.();
                }}
                className="relative flex items-center justify-center ml-0.5 cursor-pointer"
                title={budgetStatus === "depleted" ? "Credits depleted" : "Credits running low"}
              >
                <span
                  className={cn(
                    "w-2 h-2 rounded-full shrink-0",
                    budgetStatus === "depleted"
                      ? "bg-[var(--color-danger)]"
                      : "bg-[var(--color-warning)]",
                  )}
                />
                <span
                  className={cn(
                    "absolute inset-0 w-2 h-2 rounded-full animate-ping opacity-75",
                    budgetStatus === "depleted"
                      ? "bg-[var(--color-danger)]"
                      : "bg-[var(--color-warning)]",
                  )}
                />
              </button>
            )}
            {(isFree || isPlus) && (
              <>
                <span className="w-px h-3 bg-border-subtle mx-1.5" />
                <button
                  type="button"
                  className={cn(
                    "text-[13px] font-semibold leading-none cursor-pointer hover:opacity-75 transition-opacity",
                    isPlus ? "text-[var(--color-info)]" : "text-[var(--color-text-heading)]",
                  )}
                  onClick={(e) => {
                    e.stopPropagation();
                    openExternal(`${window.location.origin}/openclaw/pricing`);
                  }}
                >
                  Upgrade
                </button>
              </>
            )}
          </div>
          <button
            ref={avatarRef}
            type="button"
            onClick={() => setView({ type: "settings" })}
            onMouseEnter={() => {
              openAccountPanel();
              clearUsageLeaveTimer();
              setShowUsagePanel(false);
            }}
            onMouseLeave={scheduleCloseAccountPanel}
            className="flex items-center justify-center size-7 rounded-full bg-[var(--color-accent)] text-white text-[12px] font-semibold leading-none cursor-pointer hover:opacity-90 transition-opacity shrink-0"
            title={nexuAccountEmail}
          >
            {initialsFromEmail(nexuAccountEmail)}
          </button>
        </div>
      </div>

      {showUsagePanel && usagePanelLayout && (
        <div
          className="fixed pointer-events-auto"
          style={
            {
              top: usagePanelLayout.top,
              left: usagePanelLayout.left,
              width: usagePanelLayout.width,
              zIndex: CREDITS_USAGE_PANEL_Z,
            } as React.CSSProperties
          }
          onMouseEnter={openUsagePanel}
          onMouseLeave={scheduleCloseUsagePanel}
        >
          <Card
            variant="static"
            padding="none"
            className="overflow-visible bg-white shadow-[var(--shadow-dropdown)]"
          >
            <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 border-b border-border-subtle px-4 py-3">
              <CardTitle className={cn("text-sm font-bold leading-none", plan.color)}>
                {plan.label}
              </CardTitle>
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                className="shrink-0 text-text-muted hover:text-text-secondary"
                onClick={() => setShowUsagePanel(false)}
                onMouseDown={(e) => e.stopPropagation()}
                aria-label="Close"
              >
                <X className="size-4" />
              </Button>
            </CardHeader>

            <CardContent className="mt-0 flex flex-col gap-3 px-4 py-3">
              <InteractiveRow
                tone="subtle"
                className="!items-center !rounded-lg !gap-2 !px-0 !py-0 !border-0 pointer-events-none"
              >
                <InteractiveRowLeading className="flex shrink-0 items-center justify-center">
                  <CreditIcon size={12} className={cn("block shrink-0", pillStyle.icon)} />
                </InteractiveRowLeading>
                <InteractiveRowContent className="flex min-h-0 min-w-0 flex-1 items-center">
                  <span className="text-[13px] font-semibold leading-none text-[var(--color-text-primary)]">
                    Total credits
                  </span>
                </InteractiveRowContent>
                <InteractiveRowTrailing className="flex shrink-0 items-center">
                  <span className="text-[13px] font-bold leading-none tabular-nums text-[var(--color-text-primary)]">
                    {totalCredits}
                  </span>
                </InteractiveRowTrailing>
              </InteractiveRow>

              <Tooltip>
                <TooltipTrigger className="w-full">
                  <div className="flex w-full items-center gap-2 rounded-lg px-0 py-0 text-left">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1 cursor-help">
                        <span className="text-[12px] text-[var(--color-text-muted)]">
                          Plan credits
                        </span>
                        <Info size={10} className="text-[var(--color-text-muted)] shrink-0" />
                      </div>
                    </div>
                    <div className="shrink-0">
                      <span className="text-[12px] text-[var(--color-text-secondary)] tabular-nums">
                        {baseCredits}
                        <span className="text-[var(--color-text-muted)]">
                          /{Math.round(budget.total)}
                        </span>
                      </span>
                    </div>
                  </div>
                </TooltipTrigger>
                <TooltipContent
                  side="bottom"
                  align="start"
                  className={cn("max-w-[220px] text-[10px] leading-relaxed")}
                  style={{ zIndex: CREDITS_USAGE_TOOLTIP_Z }}
                >
                  Included with your plan each cycle; resets when the period ends.
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger className="w-full">
                  <div className="flex w-full items-center gap-2 rounded-lg px-0 py-0 text-left">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1 cursor-help">
                        <span className="text-[12px] text-[var(--color-text-muted)]">
                          Bonus credits
                        </span>
                        <Info size={10} className="text-[var(--color-text-muted)] shrink-0" />
                      </div>
                    </div>
                    <div className="shrink-0">
                      <span className="text-[12px] text-[var(--color-text-secondary)] tabular-nums">
                        {bonusCredits}
                      </span>
                    </div>
                  </div>
                </TooltipTrigger>
                <TooltipContent
                  side="bottom"
                  align="start"
                  className={cn("max-w-[240px] text-[10px] leading-relaxed")}
                  style={{ zIndex: CREDITS_USAGE_TOOLTIP_Z }}
                >
                  From signup rewards, tasks, and promos. Usage order: plan credits → credit pack →
                  bonus credits.
                </TooltipContent>
              </Tooltip>

              {packCredits > 0 && (
                <Tooltip>
                  <TooltipTrigger className="w-full">
                    <div className="flex w-full items-center gap-2 rounded-lg px-0 py-0 text-left">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1 cursor-help">
                          <span className="text-[12px] text-[var(--color-text-muted)]">
                            Credit pack balance
                          </span>
                          <Info size={10} className="text-[var(--color-text-muted)] shrink-0" />
                        </div>
                      </div>
                      <div className="shrink-0">
                        <span className="text-[12px] text-[var(--color-text-secondary)] tabular-nums">
                          {packCredits.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent
                    side="bottom"
                    align="start"
                    className={cn("max-w-[240px] text-[10px] leading-relaxed")}
                    style={{ zIndex: CREDITS_USAGE_TOOLTIP_Z }}
                  >
                    Your purchased {creditPackInfo.label}, valid for 1 month. Usage order: plan
                    credits → credit pack → bonus credits.
                  </TooltipContent>
                </Tooltip>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {showAccountPanel && accountPanelLayout && (
        <div
          className="fixed pointer-events-auto"
          style={
            {
              top: accountPanelLayout.top,
              right: accountPanelLayout.right,
              zIndex: CREDITS_USAGE_PANEL_Z,
            } as React.CSSProperties
          }
          onMouseEnter={openAccountPanel}
          onMouseLeave={scheduleCloseAccountPanel}
        >
          <Card
            variant="static"
            padding="none"
            className="overflow-visible bg-white shadow-[var(--shadow-dropdown)] min-w-[200px]"
          >
            <div className="px-4 py-3 flex items-center gap-2.5">
              <span className="flex items-center justify-center size-8 rounded-full bg-[var(--color-accent)] text-white text-[12px] font-semibold leading-none shrink-0">
                {initialsFromEmail(nexuAccountEmail)}
              </span>
              <span className="text-[13px] font-medium text-text-primary truncate">
                {nexuAccountEmail}
              </span>
            </div>
            <div className="border-t border-border-subtle px-4 py-2.5">
              <button
                type="button"
                className="flex items-center gap-1.5 text-[12px] text-text-muted hover:text-destructive cursor-pointer transition-colors"
                onClick={() => {
                  setShowAccountPanel(false);
                  setDemoLoggedIn(false);
                }}
              >
                <LogOut size={12} />
                Sign out
              </button>
            </div>
          </Card>
        </div>
      )}
    </>
  );
}
