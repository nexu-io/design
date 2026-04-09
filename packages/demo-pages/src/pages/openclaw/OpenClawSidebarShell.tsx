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
import {
  DingTalkIconSetup,
  DiscordIconSetup,
  FeishuIconSetup,
  QQBotIconSetup,
  SlackIconSetup,
  TelegramIconSetup,
  WeChatIconSetup,
  WeComIconSetup,
  WhatsAppIconSetup,
} from "./channelSetup";
import { MOCK_CHANNELS } from "./data";
import type { View } from "./workspaceTypes";

type NavItem = {
  id: View["type"];
  labelKey: string;
  icon: React.ComponentType<{ size?: number }>;
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
  onResizeStart: (e: React.MouseEvent) => void;
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
  onResizeStart,
}: Props) {
  return (
    <>
      <button
        onClick={() => {
          const next = !collapsed;
          setCollapsed(next);
          localStorage.setItem("nexu_sidebar_collapsed", String(next));
        }}
        className="absolute top-2 left-[88px] z-50 rounded-md p-1.5 text-text-tertiary transition-colors hover:bg-black/5 hover:text-text-primary"
        style={{ WebkitAppRegion: "no-drag" } as React.CSSProperties}
        title={collapsed ? t("ws.sidebar.expand") : t("ws.sidebar.collapse")}
      >
        {collapsed ? <PanelLeftOpen size={16} /> : <PanelLeftClose size={16} />}
      </button>

      <div
        className={`sidebar-vibrancy flex shrink-0 flex-col overflow-hidden ${collapsed ? "w-0" : ""}`}
        style={
          {
            ...(!collapsed ? { width: sidebarWidth } : {}),
            transition: isResizing ? "none" : "width 200ms",
            WebkitAppRegion: "drag",
          } as React.CSSProperties
        }
      >
        <div className="h-16 shrink-0" />

        <div
          className="flex items-center justify-between px-3 pb-3"
          style={{ WebkitAppRegion: "no-drag" } as React.CSSProperties}
        >
          <img src="/brand/logo-black-1.svg" alt="nexu" className="h-6 object-contain" />
          {hasUpdate && updateDismissed && (
            <button
              onClick={onReopenUpdate}
              className="rounded-full px-2 py-1 text-[12px] leading-none font-semibold bg-[var(--color-brand-primary)] text-white hover:opacity-85 transition-opacity"
            >
              {t("ws.sidebar.update")}
            </button>
          )}
        </div>

        <div
          className="flex-1 overflow-y-auto"
          style={{ WebkitAppRegion: "no-drag" } as React.CSSProperties}
        >
          <div className="px-2 pb-1 pt-4">
            {navItems.map((item) => {
              const active = view.type === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setView({ type: item.id } as View)}
                  className={`nav-item mt-0.5 flex w-full items-center gap-2.5 whitespace-nowrap rounded-[var(--radius-6)] px-3 py-2 text-[13px] transition-colors ${active ? "nav-item-active" : ""}`}
                >
                  <item.icon size={16} />
                  {t(item.labelKey)}
                  {item.id === "skills" && (
                    <span className="ml-auto text-[10px] text-text-tertiary font-normal">
                      {capabilitiesNavCount}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <div className="px-2 pt-8">
            <div className="sidebar-section-label mb-1.5">{t("ws.nav.conversations")}</div>
            <div className="space-y-0.5">
              {MOCK_CHANNELS.map((ch) => {
                const active = view.type === "conversations" && view.channelId === ch.id;
                const ChannelIcon =
                  (
                    {
                      slack: SlackIconSetup,
                      feishu: FeishuIconSetup,
                      discord: DiscordIconSetup,
                      telegram: TelegramIconSetup,
                      whatsapp: WhatsAppIconSetup,
                      wechat: WeChatIconSetup,
                      dingtalk: DingTalkIconSetup,
                      qqbot: QQBotIconSetup,
                      wecom: WeComIconSetup,
                    } as Record<string, typeof SlackIconSetup>
                  )[ch.platform] || SlackIconSetup;
                return (
                  <button
                    key={ch.id}
                    onClick={() => setView({ type: "conversations", channelId: ch.id })}
                    className={`nav-item flex w-full items-center gap-2.5 rounded-[10px] px-3 py-2 text-left transition-colors ${active ? "nav-item-active" : ""}`}
                  >
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-xl border border-border bg-surface-1 shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
                      <ChannelIcon size={14} />
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex min-w-0 items-center gap-2">
                        <div
                          className={`truncate whitespace-nowrap text-[12px] font-medium ${active ? "" : "text-text-primary"}`}
                        >
                          {ch.name}
                        </div>
                      </div>
                      <div className="mt-0.5 flex items-center gap-1.5 truncate whitespace-nowrap text-[10px] text-text-muted">
                        <span>{ch.platform.charAt(0).toUpperCase() + ch.platform.slice(1)}</span>
                        <span className="text-border">·</span>
                        <span>{ch.messageCount} msgs</span>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {nexuLoggedIn && budgetClaimedCount < budgetChannelCount && (
            <div className="mb-3 px-3" style={{ WebkitAppRegion: "no-drag" } as React.CSSProperties}>
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
          className="flex shrink-0 items-center justify-between gap-1 px-3 pb-2.5"
          style={{ WebkitAppRegion: "no-drag" } as React.CSSProperties}
        >
          <div className="flex items-center gap-1">
            <div className="relative shrink-0" ref={helpRef}>
              {showHelpMenu && (
                <div className="absolute z-20 bottom-full left-1/2 -translate-x-1/2 mb-2 w-[200px]">
                  <div className="rounded-xl border bg-surface-1 border-border shadow-xl shadow-black/10 overflow-hidden">
                    <div className="p-1.5">
                      <a
                        href="https://docs.nexu.ai"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-[12px] font-medium text-text-secondary transition-all hover:bg-black/5 hover:text-text-primary"
                      >
                        <BookOpen size={14} />
                        {t("ws.help.documentation")}
                      </a>
                      <a
                        href="mailto:hi@nexu.ai"
                        className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-[12px] font-medium text-text-secondary transition-all hover:bg-black/5 hover:text-text-primary"
                      >
                        <Mail size={14} />
                        {t("ws.help.contactUs")}
                      </a>
                    </div>
                    <div className="border-t border-border p-1.5">
                      <button
                        type="button"
                        onClick={onCheckUpdates}
                        className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-[12px] font-medium text-text-secondary transition-all hover:bg-black/5 hover:text-text-primary"
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
                className={`w-7 h-7 flex items-center justify-center rounded-md transition-colors cursor-pointer ${showHelpMenu ? "text-text-primary bg-surface-2" : "text-text-secondary hover:text-text-primary hover:bg-surface-2"}`}
                title={t("ws.help.title")}
              >
                <CircleHelp size={16} />
              </button>
            </div>
            <a
              href={githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="shrink-0 w-7 h-7 flex items-center justify-center rounded-md text-text-secondary hover:text-text-primary hover:bg-surface-2 transition-colors"
              title={
                stars && stars > 0
                  ? `${t("ws.help.github")} · ${stars.toLocaleString()} stars`
                  : t("ws.help.github")
              }
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
              </svg>
            </a>
          </div>
          <button
            type="button"
            onClick={() => setLocale(locale === "en" ? "zh" : "en")}
            className="inline-flex h-7 shrink-0 items-center gap-1.5 rounded-md px-2 text-sm font-medium text-text-secondary transition-colors hover:bg-surface-2 hover:text-text-primary"
            title={t("ws.help.language")}
          >
            <Globe size={14} />
            <span>{locale === "en" ? "EN" : "中文"}</span>
          </button>
        </div>
      </div>

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

      {!collapsed && (
        <div
          onMouseDown={onResizeStart}
          className="w-[3px] shrink-0 cursor-col-resize group relative z-10"
          style={{ WebkitAppRegion: "no-drag" } as React.CSSProperties}
        >
          <div className="absolute inset-y-0 -left-[2px] -right-[2px]" />
        </div>
      )}
    </>
  );
}
