import {
  GitHubIcon,
  NavigationMenu,
  NavigationMenuButton,
  NavigationMenuItem,
  NavigationMenuLabel,
  NavigationMenuList,
  PlatformLogo,
  Sidebar,
  SidebarContent,
  SidebarHeader,
  StatusDot,
} from "@nexu-design/ui-web";
import type { PlatformName } from "@nexu-design/ui-web";
import {
  CircleHelp,
  Globe,
  Loader2,
  Mail,
  PanelLeftClose,
  PanelLeftOpen,
  ScrollText,
} from "lucide-react";
import { BookOpen } from "lucide-react";
import type React from "react";

import { ArrowLeft, Settings } from "lucide-react";
import LanguageSwitcher from "../../components/LanguageSwitcher";
import { MOCK_CHANNELS } from "./data";
import type { View } from "./workspaceTypes";

const MAC_COLLAPSE_BUTTON_LEFT = 74;
const MAC_COLLAPSE_BUTTON_TOP = 10;
const WINDOWS_COLLAPSE_BUTTON_LEFT = 12;
const WINDOWS_COLLAPSE_BUTTON_TOP = 64;

type NavItem = {
  id: View["type"];
  labelKey: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
};

type Props = {
  t: (key: string) => string;
  collapsed: boolean;
  setCollapsed: (v: boolean) => void;
  sidebarWidth: number;
  isResizing: boolean;
  hasUpdate: boolean;
  updateDismissed: boolean;
  onReopenUpdate: () => void;
  view: View;
  setView: (v: View) => void;
  capabilitiesNavCount: number;
  nexuLoggedIn: boolean;
  budgetClaimedCount: number;
  budgetChannelCount: number;
  showHelpMenu: boolean;
  setShowHelpMenu: (v: boolean) => void;
  helpRef: React.RefObject<HTMLDivElement | null>;
  locale: "en" | "zh";
  setLocale: (v: "en" | "zh") => void;
  onCheckUpdates: () => void;
  stars?: number;
  githubUrl: string;
  navItems: NavItem[];
};

export function OpenClawSidebarShell({
  t,
  collapsed,
  setCollapsed,
  sidebarWidth,
  isResizing,
  hasUpdate,
  updateDismissed,
  onReopenUpdate,
  view,
  setView,
  capabilitiesNavCount,
  nexuLoggedIn,
  budgetClaimedCount,
  budgetChannelCount,
  showHelpMenu,
  setShowHelpMenu,
  helpRef,
  locale,
  setLocale,
  onCheckUpdates,
  stars,
  githubUrl,
  navItems,
}: Props) {
  const platform =
    (navigator as Navigator & { userAgentData?: { platform?: string } }).userAgentData?.platform ??
    navigator.userAgent ??
    "";
  const isMacOS = /mac/i.test(platform);

  return (
    <>
      {collapsed && (
        <button
          onClick={() => {
            const next = !collapsed;
            setCollapsed(next);
            localStorage.setItem("nexu_sidebar_collapsed", String(next));
          }}
          className={`fixed z-50 hidden h-8 w-8 items-center justify-center rounded-lg transition-colors md:flex ${
            isMacOS
              ? "text-text-muted hover:text-text-primary"
              : "text-text-tertiary hover:bg-black/5 hover:text-text-primary"
          }`}
          style={
            {
              top: isMacOS ? MAC_COLLAPSE_BUTTON_TOP : WINDOWS_COLLAPSE_BUTTON_TOP,
              left: isMacOS ? MAC_COLLAPSE_BUTTON_LEFT : WINDOWS_COLLAPSE_BUTTON_LEFT,
              transform: isMacOS ? "translateZ(0)" : undefined,
              backfaceVisibility: isMacOS ? "hidden" : undefined,
              WebkitAppRegion: "no-drag",
            } as React.CSSProperties
          }
          title={t("ws.sidebar.expand")}
        >
          <PanelLeftOpen size={16} />
        </button>
      )}

      <Sidebar
        className={`flex shrink-0 flex-col overflow-hidden border-r-0 ${collapsed ? "w-0" : ""}`}
        style={
          {
            ...(!collapsed ? { width: sidebarWidth } : {}),
            transition: isResizing ? "none" : "width 200ms",
            WebkitAppRegion: "drag",
            background: "rgba(255, 255, 255, 0.08)",
          } as React.CSSProperties
        }
      >
        <div className="h-[54px] shrink-0" />

        <SidebarHeader
          className="flex shrink-0 items-center justify-between px-3 pb-0"
          style={{ WebkitAppRegion: "no-drag" } as React.CSSProperties}
        >
          <div className="flex min-w-0 items-center gap-2">
            <img src="/brand/logo-black-1.svg" alt="nexu" className="h-6 object-contain" />
            {!isMacOS && (
              <button
                onClick={() => {
                  const next = !collapsed;
                  setCollapsed(next);
                  localStorage.setItem("nexu_sidebar_collapsed", String(next));
                }}
                className="shrink-0 rounded-lg p-1.5 text-text-muted transition-colors hover:bg-surface-3 hover:text-text-primary"
                title={t("ws.sidebar.collapse")}
              >
                <PanelLeftClose size={14} />
              </button>
            )}
          </div>
          <div className="flex items-center gap-2">
            {hasUpdate && updateDismissed && (
              <button
                onClick={onReopenUpdate}
                className="rounded-full bg-[var(--color-brand-primary)] px-2 py-1 text-[12px] font-semibold leading-none text-white transition-opacity hover:opacity-85"
              >
                {t("ws.sidebar.update")}
              </button>
            )}
            {isMacOS && (
              <button
                onClick={() => {
                  const next = !collapsed;
                  setCollapsed(next);
                  localStorage.setItem("nexu_sidebar_collapsed", String(next));
                }}
                className="fixed z-50 hidden h-8 w-8 items-center justify-center rounded-lg text-text-muted transition-colors hover:text-text-primary md:flex"
                style={
                  {
                    top: MAC_COLLAPSE_BUTTON_TOP,
                    left: MAC_COLLAPSE_BUTTON_LEFT,
                    transform: "translateZ(0)",
                    backfaceVisibility: "hidden",
                    WebkitAppRegion: "no-drag",
                  } as React.CSSProperties
                }
                title={t("ws.sidebar.collapse")}
              >
                <PanelLeftClose size={14} />
              </button>
            )}
          </div>
        </SidebarHeader>

        <SidebarContent
          className="flex-1 overflow-y-auto"
          style={{ WebkitAppRegion: "no-drag" } as React.CSSProperties}
        >
          <div className="px-2 pb-1 pt-3">
            <NavigationMenu>
              <NavigationMenuList>
                {navItems.map((item) => (
                  <NavigationMenuItem key={item.id}>
                    <NavigationMenuButton
                      active={view.type === item.id}
                      onClick={() => setView({ type: item.id } as View)}
                      className="whitespace-nowrap"
                    >
                      <item.icon className="size-4" />
                      {t(item.labelKey)}
                    </NavigationMenuButton>
                  </NavigationMenuItem>
                ))}
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          <div className="px-2 pt-6">
            <NavigationMenuLabel className="whitespace-nowrap">
              {t("ws.nav.conversations")}
            </NavigationMenuLabel>
            <div className="space-y-0.5">
              {MOCK_CHANNELS.map((ch) => {
                const active = view.type === "conversations" && view.channelId === ch.id;
                return (
                  <button
                    key={ch.id}
                    onClick={() => setView({ type: "conversations", channelId: ch.id })}
                    className={`flex w-full items-center gap-2.5 rounded-[10px] px-3 py-2 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                      active
                        ? "bg-surface-2 text-text-primary"
                        : "text-text-secondary hover:bg-surface-2 hover:text-text-primary"
                    }`}
                  >
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-xl border border-border bg-surface-1 shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
                      <PlatformLogo platform={ch.platform as PlatformName} size={14} />
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex min-w-0 items-center gap-2">
                        <div className="truncate whitespace-nowrap text-[12px] font-medium text-current">
                          {ch.name}
                        </div>
                      </div>
                      <div className="mt-0.5 flex items-center gap-1.5 truncate text-xs text-text-muted">
                        <span>{ch.platform.charAt(0).toUpperCase() + ch.platform.slice(1)}</span>
                        <span className="text-border">·</span>
                        <span>{ch.messageCount} msgs</span>
                      </div>
                    </div>
                    <StatusDot
                      status={
                        ch.status === "active"
                          ? "success"
                          : ch.status === "configuring"
                            ? "warning"
                            : "neutral"
                      }
                      size="sm"
                      aria-hidden="true"
                    />
                  </button>
                );
              })}
            </div>
          </div>
        </SidebarContent>

        {nexuLoggedIn && budgetClaimedCount < budgetChannelCount && (
          <div className="px-3 mb-2" style={{ WebkitAppRegion: "no-drag" } as React.CSSProperties}>
            <button
              type="button"
              onClick={() => setView({ type: "rewards" })}
              className="w-full rounded-[10px] border border-[var(--color-brand-primary)]/12 bg-[var(--color-brand-subtle)] px-3 py-3 text-left hover:border-[var(--color-brand-primary)]/20 hover:!bg-[var(--color-brand-primary)]/[0.06]"
            >
              <span className="block text-[12px] font-semibold text-[var(--color-brand-primary)] leading-[1.3] truncate">
                {t("budget.viral.title")}
              </span>
            </button>
          </div>
        )}

        <div
          className="flex shrink-0 items-center justify-between gap-1 px-3 pb-1.5"
          style={{ WebkitAppRegion: "no-drag" } as React.CSSProperties}
        >
          <div className="flex items-center gap-1">
            <div className="relative shrink-0" ref={helpRef}>
              {showHelpMenu && (
                <div className="absolute bottom-full left-0 z-20 mb-2 w-44">
                  <div className="rounded-xl border bg-surface-1 border-border shadow-xl shadow-black/10 overflow-hidden">
                    <div className="p-1.5">
                      <a
                        href="https://docs.nexu.ai"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-[12px] font-medium text-text-secondary transition-all hover:bg-surface-2 hover:text-text-primary"
                      >
                        <BookOpen size={14} />
                        {t("ws.help.documentation")}
                      </a>
                      <a
                        href="mailto:hi@nexu.ai"
                        className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-[12px] font-medium text-text-secondary transition-all hover:bg-surface-2 hover:text-text-primary"
                      >
                        <Mail size={14} />
                        {t("ws.help.contactUs")}
                      </a>
                    </div>
                    <div className="border-t border-border p-1.5">
                      <button
                        type="button"
                        onClick={onCheckUpdates}
                        className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-[12px] font-medium text-text-secondary transition-all hover:bg-surface-2 hover:text-text-primary"
                      >
                        <Loader2 size={14} />
                        Check for Updates…
                      </button>
                      <a
                        href="https://nexu.ai/changelog"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2.5 w-full px-3 py-2 rounded-lg text-[12px] font-medium text-text-secondary hover:text-text-primary hover:bg-surface-2 transition-all"
                      >
                        <ScrollText size={14} />
                        {t("ws.help.changelog")}
                      </a>
                    </div>
                  </div>
                </div>
              )}
              <button
                type="button"
                onClick={() => setShowHelpMenu(!showHelpMenu)}
                className={`flex h-7 w-7 items-center justify-center rounded-md transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${showHelpMenu ? "bg-surface-3 text-text-primary" : "text-text-secondary hover:bg-surface-3 hover:text-text-primary"}`}
                title={t("ws.help.title")}
              >
                <CircleHelp size={16} />
              </button>
            </div>
            <a
              href={githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-text-secondary transition-colors hover:bg-surface-3 hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              title={
                stars && stars > 0
                  ? `${t("ws.help.github")} · ${stars.toLocaleString()} stars`
                  : t("ws.help.github")
              }
            >
              <GitHubIcon size={16} />
            </a>
          </div>
          <button
            type="button"
            onClick={() => setLocale(locale === "en" ? "zh" : "en")}
            className="inline-flex h-7 shrink-0 items-center gap-1.5 rounded-md px-2 text-sm font-medium text-text-secondary transition-colors hover:bg-surface-3 hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            title={t("ws.help.language")}
          >
            <Globe size={14} />
            <span>{locale === "en" ? "EN" : "中文"}</span>
          </button>
        </div>
      </Sidebar>

      <div className="hidden">
        <button className="p-1.5 rounded-lg text-text-secondary hover:text-text-primary">
          <ArrowLeft size={16} />
        </button>
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <div className="flex justify-center items-center w-6 h-6 rounded-md bg-accent shrink-0">
            <span className="text-[9px] font-bold text-accent-fg">N</span>
          </div>
          <span className="text-sm font-semibold text-text-primary truncate">nexu</span>
        </div>
        <LanguageSwitcher variant="muted" />
        <button
          onClick={() => setView({ type: "settings" })}
          className="p-1.5 rounded-lg text-text-secondary hover:text-text-primary"
        >
          <Settings size={16} />
        </button>
      </div>
    </>
  );
}
