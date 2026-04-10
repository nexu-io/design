import {
  Button,
  GitHubIcon,
  Input,
  PageHeader,
  SectionHeader,
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
  Switch,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  cn,
} from "@nexu-design/ui-web";
import * as SelectPrimitive from "@radix-ui/react-select";
import {
  AlertCircle,
  ArrowUpRight,
  BookOpen,
  Check,
  ChevronDown,
  Globe,
  Info,
  Loader2,
  Mail,
  Monitor,
  RefreshCw,
  ScrollText,
  Shield,
  Star,
  User,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { type Locale, useLocale } from "../../hooks/useLocale";
import { openExternal } from "../../utils/open-external";
import { type ModelProvider, getProviderDetails } from "./data";
import { ProviderLogo } from "./iconHelpers";

const WORKSPACE_LOCALE_OPTIONS: { value: Locale; nativeLabel: string; englishLabel: string }[] = [
  { value: "en", nativeLabel: "English", englishLabel: "English" },
  { value: "zh", nativeLabel: "简体中文", englishLabel: "Chinese (Simplified)" },
];

function WorkspaceLocaleSelectItem({
  value,
  nativeLabel,
  englishLabel,
}: {
  value: Locale;
  nativeLabel: string;
  englishLabel: string;
}) {
  return (
    <SelectPrimitive.Item
      value={value}
      className={cn(
        "relative flex w-full cursor-pointer select-none items-center rounded-lg py-2 pl-3 pr-10 text-left outline-none",
        "text-text-primary hover:bg-[var(--color-surface-2)] focus:bg-[var(--color-surface-2)]",
        "data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      )}
    >
      <SelectPrimitive.ItemText>
        <span className="flex min-w-0 flex-1 flex-col gap-0.5">
          <span className="text-[13px] font-normal leading-snug">{nativeLabel}</span>
          <span className="text-[11px] leading-snug text-text-tertiary">{englishLabel}</span>
        </span>
      </SelectPrimitive.ItemText>
      <span className="pointer-events-none absolute right-2 top-1/2 flex size-4 -translate-y-1/2 items-center justify-center">
        <SelectPrimitive.ItemIndicator>
          <Check size={14} className="text-text-primary" />
        </SelectPrimitive.ItemIndicator>
      </span>
    </SelectPrimitive.Item>
  );
}

type SettingsTab = "general" | "providers";

type WorkspaceView =
  | { type: "home" }
  | { type: "conversations"; channelId?: string }
  | { type: "deployments" }
  | { type: "skills" }
  | { type: "schedule" }
  | { type: "rewards" }
  | { type: "settings"; tab?: SettingsTab; providerId?: ModelProvider };

type SettingsViewProps = {
  initialTab?: SettingsTab;
  initialProviderId?: ModelProvider;
  signedIn?: boolean;
  accountEmail?: string;
  onSignOut?: () => void;
  onNavigate?: (view: WorkspaceView) => void;
  demoPlan?: "free" | "plus" | "pro";
  demoBudgetStatus?: "healthy" | "warning" | "depleted";
  githubUrl: string;
};

function initialsFromEmail(email: string): string {
  if (!email.trim()) return "?";
  const local = email.split("@")[0]?.trim() ?? "";
  if (!local) return "?";
  const parts = local
    .replace(/[._-]+/g, " ")
    .split(" ")
    .filter(Boolean);
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase().slice(0, 2);
  return local.slice(0, 2).toUpperCase();
}

export function SettingsView({
  initialTab = "general",
  initialProviderId = "anthropic",
  signedIn = false,
  accountEmail = "",
  onSignOut,
  onNavigate: _onNavigate,
  demoPlan: _demoPlan = "pro",
  demoBudgetStatus: _demoBudgetStatus = "healthy",
  githubUrl,
}: SettingsViewProps) {
  const { t, locale, setLocale } = useLocale();
  const [settingsTab, setSettingsTab] = useState<SettingsTab>(initialTab);
  const [analytics, setAnalytics] = useState(() => {
    try {
      const v = localStorage.getItem("nexu_analytics");
      if (v === "0") return false;
      if (v === "1") return true;
      return true;
    } catch {
      return true;
    }
  });
  const setAnalyticsPersist = useCallback((v: boolean) => {
    setAnalytics(v);
    try {
      localStorage.setItem("nexu_analytics", v ? "1" : "0");
    } catch {
      /* ignore */
    }
  }, []);
  const [crashReports, setCrashReports] = useState(true);
  const [launchAtLogin, setLaunchAtLogin] = useState(() => {
    try {
      return localStorage.getItem("nexu_launch_at_login") === "1";
    } catch {
      return false;
    }
  });
  const setLaunchAtLoginPersist = useCallback((v: boolean) => {
    setLaunchAtLogin(v);
    try {
      localStorage.setItem("nexu_launch_at_login", v ? "1" : "0");
    } catch {
      /* ignore */
    }
  }, []);

  const [showInDock, setShowInDock] = useState(() => {
    try {
      return localStorage.getItem("nexu_show_in_dock") !== "0";
    } catch {
      return true;
    }
  });
  const setShowInDockPersist = useCallback((v: boolean) => {
    setShowInDock(v);
    try {
      localStorage.setItem("nexu_show_in_dock", v ? "1" : "0");
    } catch {
      /* ignore */
    }
  }, []);
  const providers = getProviderDetails();
  const [configuredProviders, setConfiguredProviders] = useState<Set<string>>(
    () => new Set(["nexu"]),
  );
  const availableModels = providers
    .filter((p) => p.id === "nexu" || configuredProviders.has(p.id))
    .flatMap((p) => p.models.map((m) => ({ ...m, providerName: p.name, providerId: p.id })));
  const [activeProviderId, setActiveProviderId] = useState<ModelProvider>(initialProviderId);
  const [selectedModelId, setSelectedModelId] = useState<string | null>(() => {
    const nexu = providers.find((p) => p.id === "nexu");
    return nexu?.models[0]?.id ?? null;
  });
  const [showModelDropdown, setShowModelDropdown] = useState(false);
  const [formValues, setFormValues] = useState<
    Record<string, { apiKey: string; proxyUrl: string }>
  >({});
  const [savedValues, setSavedValues] = useState<
    Record<string, { apiKey: string; proxyUrl: string }>
  >({});
  const [saveStates, setSaveStates] = useState<Record<string, "idle" | "saving" | "saved">>({});
  const [saveErrors, setSaveErrors] = useState<Record<string, string>>({});
  const [showSavedBannerFor, setShowSavedBannerFor] = useState<string | null>(null);
  const [checkStates, setCheckStates] = useState<
    Record<string, "idle" | "checking" | "success" | "error">
  >({});
  const modelDropdownRef = useRef<HTMLDivElement>(null);

  const activeProvider = providers.find((p) => p.id === activeProviderId) ?? providers[0];
  const selectedModel = selectedModelId
    ? (availableModels.find((m) => m.id === selectedModelId) ?? null)
    : null;

  useEffect(() => {
    if (!showModelDropdown) return;
    const handler = (e: MouseEvent) => {
      if (modelDropdownRef.current && !modelDropdownRef.current.contains(e.target as Node)) {
        setShowModelDropdown(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [showModelDropdown]);

  const getFormValues = (providerId: string) => {
    const p = providers.find((x) => x.id === providerId);
    return formValues[providerId] ?? { apiKey: "", proxyUrl: p?.proxyUrl ?? "" };
  };

  const isDirty = (providerId: string) => {
    const saved = savedValues[providerId];
    if (!saved) return true;
    const curr = getFormValues(providerId);
    return curr.apiKey !== saved.apiKey || curr.proxyUrl !== saved.proxyUrl;
  };

  const setFormField = (providerId: string, field: "apiKey" | "proxyUrl", value: string) => {
    setFormValues((prev) => {
      const curr = prev[providerId] ?? {
        apiKey: "",
        proxyUrl: providers.find((p) => p.id === providerId)?.proxyUrl ?? "",
      };
      return { ...prev, [providerId]: { ...curr, [field]: value } };
    });
    if (savedValues[providerId]) setSaveStates((prev) => ({ ...prev, [providerId]: "idle" }));
  };

  // Save = verify + save in one step
  const handleSave = (providerId: string) => {
    setSaveErrors((prev) => ({ ...prev, [providerId]: "" }));
    setSaveStates((prev) => ({ ...prev, [providerId]: "saving" }));
    const curr = getFormValues(providerId);
    setTimeout(() => {
      const verifyOk = Math.random() > 0.2; // 80% success for prototype
      if (verifyOk) {
        setSaveStates((prev) => ({ ...prev, [providerId]: "saved" }));
        setSavedValues((prev) => ({ ...prev, [providerId]: { ...curr } }));
        setConfiguredProviders((prev) => new Set([...prev, providerId]));
        const p = providers.find((x) => x.id === providerId);
        if (p?.models[0]) setSelectedModelId(p.models[0].id);
        setShowSavedBannerFor(providerId);
        setTimeout(() => setShowSavedBannerFor(null), 2500);
      } else {
        setSaveErrors((prev) => ({ ...prev, [providerId]: "ws.settings.connectionFailedShort" }));
        setSaveStates((prev) => ({ ...prev, [providerId]: "idle" }));
      }
    }, 1200);
  };

  const handleCheck = (providerId: string) => {
    setCheckStates((prev) => ({ ...prev, [providerId]: "checking" }));
    setTimeout(() => {
      setCheckStates((prev) => ({
        ...prev,
        [providerId]: Math.random() > 0.3 ? "success" : "error",
      }));
      setTimeout(() => setCheckStates((prev) => ({ ...prev, [providerId]: "idle" })), 3000);
    }, 1500);
  };

  const saveState = saveStates[activeProvider.id] ?? "idle";
  const saveError = saveErrors[activeProvider.id] ?? "";
  const checkState = checkStates[activeProvider.id] ?? "idle";
  const providerDirty = activeProvider.id !== "nexu" && isDirty(activeProvider.id);
  const showSaved = saveState === "saved" && !providerDirty;

  type UpdateCheckState = "idle" | "checking" | "up-to-date" | "available";
  const [updateCheckState, setUpdateCheckState] = useState<UpdateCheckState>("idle");
  const updateToastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const MOCK_NEW_VERSION = "0.2.0";

  const handleCheckForUpdates = () => {
    if (updateCheckState === "checking") return;
    setUpdateCheckState("checking");
    if (updateToastTimer.current) clearTimeout(updateToastTimer.current);

    setTimeout(() => {
      const hasNewUpdate = Math.random() > 0.5;
      setUpdateCheckState(hasNewUpdate ? "available" : "up-to-date");

      if (!hasNewUpdate) {
        updateToastTimer.current = setTimeout(() => setUpdateCheckState("idle"), 4000);
      }
    }, 1800);
  };

  const handleInstallUpdate = () => {
    setUpdateCheckState("checking");
    setTimeout(() => setUpdateCheckState("idle"), 2000);
  };

  return (
    <div className="h-full overflow-y-auto">
      <div className="max-w-[800px] mx-auto px-4 sm:px-6 pt-2 pb-6 sm:pb-8">
        <PageHeader
          density="shell"
          title={t("ws.settings.title")}
          description={t("ws.settings.subtitle")}
          actions={
            <a
              href={githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="link-github-star group"
            >
              <Star
                size={13}
                className="text-amber-500 group-hover:fill-amber-500 transition-colors shrink-0"
              />
              {t("ws.common.starOnGitHub")}
              <ArrowUpRight size={11} className="shrink-0 translate-y-px" />
            </a>
          }
        />

        <Tabs
          value={settingsTab}
          onValueChange={(v) => setSettingsTab(v as SettingsTab)}
        >
          <TabsList className="mb-6">
            <TabsTrigger value="general">
              {t("ws.settings.tab.general")}
            </TabsTrigger>
            <TabsTrigger value="providers">
              {t("ws.settings.tab.providers")}
            </TabsTrigger>
          </TabsList>

          {/* ── General Tab ── */}
          <TabsContent value="general" className="mt-0">
            <div className="space-y-6">
            {/* Account */}
            <div className="rounded-xl border border-border bg-surface-1 overflow-hidden">
              <div className="px-5 py-4 border-b border-border">
                <div className="flex items-center gap-2">
                  <User size={14} className="text-text-secondary" />
                  <h3 className="text-[13px] font-semibold text-text-primary">
                    {t("ws.settings.account")}
                  </h3>
                </div>
              </div>
              <div className="px-5 py-4 space-y-4">
                {signedIn ? (
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex min-w-0 flex-1 items-center gap-3">
                      <div
                        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[12px] bg-[var(--color-accent)] text-[11px] font-semibold text-white"
                        aria-hidden
                      >
                        {initialsFromEmail(accountEmail)}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div
                          className="text-[13px] font-medium text-text-primary truncate"
                          title={accountEmail || undefined}
                        >
                          {accountEmail || "—"}
                        </div>
                        <div className="mt-0.5 text-[11px] text-text-tertiary">
                          {t("ws.settings.account.signedInDesc")}
                        </div>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => onSignOut?.()}
                      className="rounded-[8px] border border-border bg-surface-0 px-[14px] py-[5px] text-[12px] font-medium text-text-primary hover:text-destructive hover:border-destructive/30 hover:bg-destructive/5 transition-colors shrink-0"
                    >
                      {t("ws.settings.account.signOut")}
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <div className="text-[13px] font-medium text-text-primary">
                        {t("ws.settings.account.notSignedIn")}
                      </div>
                      <div className="text-[11px] text-text-tertiary mt-0.5">
                        {t("ws.settings.account.signInDesc")}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        openExternal(`${window.location.origin}/openclaw/auth?desktop=1`)
                      }
                      className="inline-flex shrink-0 items-center gap-1.5 rounded-[8px] px-[14px] py-[5px] text-[12px] font-medium bg-accent text-accent-fg hover:bg-accent-hover transition-colors"
                    >
                      {t("ws.settings.account.signIn")}
                      <ArrowUpRight size={11} />
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Language */}
            <div className="rounded-xl border border-border bg-surface-1 overflow-hidden">
              <div className="px-5 py-4">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-2 min-w-0 flex-1">
                    <Globe size={14} className="text-text-secondary shrink-0" />
                    <h3 className="text-[13px] font-semibold text-text-primary">
                      {t("ws.settings.languageSection")}
                    </h3>
                  </div>
                  <Select value={locale} onValueChange={(v) => setLocale(v as Locale)}>
                    <SelectTrigger
                      className="h-auto min-h-9 w-[220px] shrink-0 py-2"
                      aria-label={t("ws.settings.appearance.language")}
                    >
                      <SelectValue>
                        {WORKSPACE_LOCALE_OPTIONS.find((o) => o.value === locale)?.nativeLabel ??
                          locale}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent position="popper" sideOffset={6} align="end">
                      {WORKSPACE_LOCALE_OPTIONS.map((opt) => (
                        <WorkspaceLocaleSelectItem
                          key={opt.value}
                          value={opt.value}
                          nativeLabel={opt.nativeLabel}
                          englishLabel={opt.englishLabel}
                        />
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Application behavior — launch at login + Dock (native reads nexu_launch_at_login, nexu_show_in_dock) */}
            <div className="rounded-xl border border-border bg-surface-1 overflow-hidden">
              <div className="px-5 py-4 border-b border-border">
                <div className="flex items-center gap-2">
                  <Monitor size={14} className="text-text-secondary" />
                  <h3 className="text-[13px] font-semibold text-text-primary">
                    {t("ws.settings.behavior")}
                  </h3>
                </div>
              </div>
              <div className="px-5 py-4 divide-y divide-border">
                <div className="flex items-start justify-between gap-4 pb-4">
                  <div className="min-w-0 flex-1">
                    <div className="text-[13px] font-medium text-text-primary">
                      {t("ws.settings.behavior.launchAtLogin")}
                    </div>
                    <div className="text-[11px] text-text-tertiary mt-0.5">
                      {t("ws.settings.behavior.launchAtLoginDesc")}
                    </div>
                  </div>
                  <Switch
                    checked={launchAtLogin}
                    onCheckedChange={setLaunchAtLoginPersist}
                    className="shrink-0 mt-0.5"
                  />
                </div>
                <div className="flex items-start justify-between gap-4 pt-4">
                  <div className="min-w-0 flex-1">
                    <div className="text-[13px] font-medium text-text-primary">
                      {t("ws.settings.behavior.showInDock")}
                    </div>
                    <div className="text-[11px] text-text-tertiary mt-0.5">
                      {t("ws.settings.behavior.showInDockDesc")}
                    </div>
                  </div>
                  <Switch
                    checked={showInDock}
                    onCheckedChange={setShowInDockPersist}
                    className="shrink-0 mt-0.5"
                  />
                </div>
              </div>
            </div>

            {/* Data & Privacy */}
            <div className="rounded-xl border border-border bg-surface-1 overflow-hidden">
              <div className="px-5 py-4 border-b border-border">
                <div className="flex items-center gap-2">
                  <Shield size={14} className="text-text-secondary" />
                  <h3 className="text-[13px] font-semibold text-text-primary">
                    {t("ws.settings.data")}
                  </h3>
                </div>
              </div>
              <div className="px-5 py-4 divide-y divide-border">
                <div className="flex items-start justify-between gap-4 pb-4">
                  <div className="min-w-0 flex-1">
                    <div className="text-[13px] font-medium text-text-primary">
                      {t("ws.settings.data.analytics")}
                    </div>
                    <div className="text-[11px] text-text-tertiary mt-0.5">
                      {t("ws.settings.data.analyticsDesc")}
                    </div>
                  </div>
                  <Switch
                    checked={analytics}
                    onCheckedChange={setAnalyticsPersist}
                    className="shrink-0 mt-0.5"
                  />
                </div>
                <div className="flex items-start justify-between gap-4 pt-4">
                  <div className="min-w-0 flex-1">
                    <div className="text-[13px] font-medium text-text-primary">
                      {t("ws.settings.data.crashReports")}
                    </div>
                    <div className="text-[11px] text-text-tertiary mt-0.5">
                      {t("ws.settings.data.crashReportsDesc")}
                    </div>
                  </div>
                  <Switch
                    checked={crashReports}
                    onCheckedChange={setCrashReports}
                    className="shrink-0 mt-0.5"
                  />
                </div>
              </div>
            </div>

            {/* Updates */}
            <div className="rounded-xl border border-border bg-surface-1 overflow-hidden">
              <div className="px-5 py-4">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-2 min-w-0 flex-1">
                    <RefreshCw size={14} className="text-text-secondary shrink-0" />
                    <h3 className="text-[13px] font-semibold text-text-primary">
                      {t("ws.settings.updates")}
                    </h3>
                    <span className="text-[11px] text-text-tertiary">
                      {t("ws.settings.about.versionNumber")}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {updateCheckState === "checking" && (
                      <span className="inline-flex items-center gap-1.5 text-[12px] text-text-muted">
                        <Loader2 size={13} className="animate-spin" />
                        {t("ws.update.checking")}
                      </span>
                    )}
                    {updateCheckState === "up-to-date" && (
                      <span className="inline-flex items-center gap-1.5 text-[12px] text-[var(--color-success)]">
                        <Check size={13} />
                        {t("ws.update.upToDate")}
                      </span>
                    )}
                    {updateCheckState === "available" && (
                      <>
                        <span className="text-[12px] text-text-secondary">
                          {t("ws.update.readyToInstall").replace("{{version}}", MOCK_NEW_VERSION)}
                        </span>
                        <button
                          onClick={handleInstallUpdate}
                          className="rounded-[8px] px-[14px] py-[5px] text-[12px] font-medium bg-accent text-accent-fg hover:bg-accent-hover transition-colors"
                        >
                          {t("ws.update.installRestart")}
                        </button>
                      </>
                    )}
                    {updateCheckState === "idle" && (
                      <button
                        onClick={handleCheckForUpdates}
                        className="rounded-[8px] px-[14px] py-[5px] text-[12px] font-medium border border-border bg-surface-0 text-text-primary hover:bg-surface-2 transition-colors"
                      >
                        {t("ws.settings.updates.checkNow")}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* About */}
            <div className="rounded-xl border border-border bg-surface-1 overflow-hidden">
              <div className="px-5 py-4 border-b border-border">
                <div className="flex items-center gap-2">
                  <Info size={14} className="text-text-secondary" />
                  <h3 className="text-[13px] font-semibold text-text-primary">
                    {t("ws.settings.about")}
                  </h3>
                </div>
              </div>
              <div className="px-5 py-4">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent/10 to-accent/5 flex items-center justify-center shrink-0">
                    <img src="/brand/nexu logo-black1.svg" alt="nexu" className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-[13px] font-semibold text-text-primary">
                      {t("ws.settings.about.version")}
                    </div>
                    <div className="text-[11px] text-text-tertiary">
                      {t("ws.settings.about.versionNumber")} · {t("ws.settings.about.licenseValue")}
                    </div>
                  </div>
                </div>
                <div className="space-y-1">
                  {[
                    {
                      labelKey: "ws.settings.about.docs",
                      url: "https://docs.nexu.io",
                      icon: BookOpen,
                    },
                    { labelKey: "ws.settings.about.github", url: githubUrl, icon: GitHubIcon },
                    {
                      labelKey: "ws.settings.about.changelog",
                      url: "https://docs.nexu.io/changelog",
                      icon: ScrollText,
                    },
                    {
                      labelKey: "ws.settings.about.feedback",
                      url: `${githubUrl}/issues/new`,
                      icon: Mail,
                    },
                  ].map((link) => (
                    <a
                      key={link.labelKey}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2.5 px-2 py-2 rounded-lg text-[12px] font-medium text-text-primary hover:bg-surface-2 transition-colors -mx-2"
                    >
                      <link.icon size={13} className="text-text-secondary shrink-0" />
                      {t(link.labelKey)}
                      <ArrowUpRight size={10} className="text-text-muted ml-auto shrink-0" />
                    </a>
                  ))}
                </div>
              </div>
            </div>
            </div>
          </TabsContent>

          {/* ── Providers Tab ── */}
          <TabsContent value="providers" className="mt-0">
            {/* Nexu Bot model selector */}
            <div className="relative mb-8" ref={modelDropdownRef}>
              <div className="rounded-xl border border-border bg-surface-1 px-4 py-3.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent/10 to-accent/5 flex items-center justify-center shrink-0">
                      <img src="/brand/nexu logo-black1.svg" alt="nexu" className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-[13px] font-semibold text-text-primary">
                        {t("ws.settings.nexuBotModel")}
                      </div>
                      <div className="text-[11px] text-text-tertiary">
                        {t("ws.settings.nexuBotModelDesc")}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowModelDropdown((v) => !v)}
                    className="inline-flex min-h-9 items-center gap-2 px-3 py-2 rounded-lg border border-border bg-surface-0 text-base font-medium text-text-primary transition-all hover:border-border-hover hover:bg-surface-2"
                  >
                    {selectedModel ? (
                      <>
                        <span className="w-4 h-4 shrink-0 flex items-center justify-center">
                          <ProviderLogo provider={selectedModel.providerId} size={14} />
                        </span>
                        {selectedModel.name}
                      </>
                    ) : (
                      <span className="text-text-muted">{t("ws.settings.select")}</span>
                    )}
                    <ChevronDown size={14} className="text-text-muted" />
                  </button>
                </div>
              </div>

              {showModelDropdown && (
                <div className="absolute top-full left-0 right-0 z-20 mt-1 rounded-xl border border-border bg-surface-0 shadow-lg overflow-hidden max-h-[320px] overflow-y-auto">
                  {providers
                    .filter((p) => p.id === "nexu" || configuredProviders.has(p.id))
                    .map((p) => (
                      <div key={p.id}>
                        <div className="sticky top-0 bg-surface-0 px-3 pt-2.5 pb-1 text-sm font-semibold uppercase tracking-wider text-text-tertiary">
                          {p.name}
                        </div>
                        {p.models.map((m) => {
                          const isSelected = m.id === selectedModelId;
                          return (
                            <button
                              key={m.id}
                              onClick={() => {
                                setSelectedModelId(m.id);
                                setShowModelDropdown(false);
                              }}
                              className={`flex min-h-9 w-full items-center gap-2.5 px-3 py-2 text-left transition-colors ${isSelected ? "bg-accent/5" : "hover:bg-surface-2"}`}
                            >
                              <span className="flex size-4 shrink-0 items-center justify-center">
                                <ProviderLogo provider={p.id} size={14} />
                              </span>
                              <span
                                className={`min-w-0 flex-1 truncate text-base ${isSelected ? "font-semibold text-accent" : "font-medium text-text-primary"}`}
                              >
                                {m.name}
                              </span>
                              {isSelected && <Check size={14} className="text-accent shrink-0" />}
                            </button>
                          );
                        })}
                      </div>
                    ))}
                </div>
              )}
            </div>

            <div
              className="flex gap-0 rounded-xl border border-border bg-surface-1 overflow-hidden"
              style={{ minHeight: 520 }}
            >
              {/* Left: Provider list — flat, no enabled/disabled split */}
              <div className="w-56 shrink-0 bg-surface-0 overflow-y-auto">
                <div className="p-2 space-y-0.5">
                  {providers.map((p) => {
                    const active = p.id === activeProviderId;
                    return (
                      <button
                        key={p.id}
                        onClick={() => setActiveProviderId(p.id)}
                        className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-left transition-colors ${
                          active ? "bg-surface-3" : "hover:bg-surface-2"
                        }`}
                      >
                        <span className="w-5 h-5 shrink-0 flex items-center justify-center">
                          <ProviderLogo provider={p.id} size={16} />
                        </span>
                        <span
                          className={`flex-1 text-[12px] font-medium truncate ${active ? "text-accent" : "text-text-primary"}`}
                        >
                          {p.name}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Right: Provider detail */}
              <div className="flex-1 overflow-y-auto p-5">
                {/* Header — no enable/disable switch */}
                <SectionHeader
                  className="mb-5 items-start"
                  title={
                    <div className="flex min-w-0 items-center gap-3">
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-surface-2">
                        <ProviderLogo provider={activeProvider.id} size={20} />
                      </span>
                      <div className="min-w-0">
                        <div className="text-[14px] font-semibold text-text-primary">
                          {activeProvider.name}
                        </div>
                        <div className="text-[11px] text-text-tertiary">
                          {activeProvider.description}
                        </div>
                      </div>
                    </div>
                  }
                  action={
                    activeProvider.apiDocsUrl ? (
                      <a
                        href={activeProvider.apiDocsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-[12px] leading-none text-[var(--color-link)] no-underline hover:no-underline"
                      >
                        {t("ws.settings.getApiKey")}
                        <ArrowUpRight size={12} className="shrink-0" />
                      </a>
                    ) : undefined
                  }
                />

                {/* Nexu login card */}
                {activeProvider.id === "nexu" && (
                  <div className="rounded-xl border border-[var(--color-brand-primary)]/25 bg-[var(--color-brand-subtle)] px-4 py-4 mb-6">
                    <div className="text-[13px] font-semibold text-[var(--color-brand-primary)]">
                      {t("ws.settings.signInTitle")}
                    </div>
                    <div className="text-[12px] leading-[1.7] text-text-secondary mt-1.5">
                      {t("ws.settings.signInDesc")}
                    </div>
                    <button
                      onClick={() =>
                        openExternal(`${window.location.origin}/openclaw/auth?desktop=1`)
                      }
                      className="mt-4 inline-flex items-center gap-2 rounded-lg bg-accent px-3.5 py-2 text-[12px] font-medium text-accent-fg transition-colors hover:bg-accent/90 cursor-pointer"
                    >
                      {t("ws.settings.signInBtn")}
                      <ArrowUpRight size={12} />
                    </button>
                  </div>
                )}

                {/* API Key + Proxy URL + Save (hidden for nexu) */}
                {activeProvider.id !== "nexu" && (
                  <div className="space-y-4 mb-6">
                    <div className="text-[10px] uppercase tracking-wider text-text-muted mb-3">
                      {t("ws.settings.apiKeySteps")}
                    </div>
                    <div>
                      <label className="block text-[13px] font-semibold text-text-primary mb-3">
                        {t("ws.settings.apiKey")}
                      </label>
                      <Input
                        type="password"
                        placeholder={activeProvider.apiKeyPlaceholder}
                        value={getFormValues(activeProvider.id).apiKey}
                        onChange={(e) => setFormField(activeProvider.id, "apiKey", e.target.value)}
                        className="w-full text-[12px]"
                      />
                    </div>
                    <div>
                      <label className="block text-[13px] font-semibold text-text-primary mb-3">
                        {t("ws.settings.apiProxyUrl")}
                      </label>
                      <Input
                        type="text"
                        value={getFormValues(activeProvider.id).proxyUrl}
                        onChange={(e) =>
                          setFormField(activeProvider.id, "proxyUrl", e.target.value)
                        }
                        className="w-full text-[12px]"
                      />
                    </div>
                    <div className="flex items-center justify-end gap-3 flex-wrap">
                      <button
                        type="button"
                        onClick={() => handleCheck(activeProvider.id)}
                        disabled={checkState === "checking" || saveState === "saving"}
                        className="text-[12px] text-text-muted hover:text-text-secondary disabled:opacity-50"
                      >
                        {checkState === "checking" && t("ws.settings.testing")}
                        {checkState === "success" && t("ws.settings.connectedStatus")}
                        {checkState === "error" && t("ws.settings.retryTest")}
                        {checkState === "idle" && t("ws.settings.testConnection")}
                      </button>
                      <Button
                        onClick={() => handleSave(activeProvider.id)}
                        disabled={showSaved}
                        loading={saveState === "saving"}
                        size="sm"
                        className={cn(
                          "w-[120px] shrink-0",
                          showSaved &&
                            "border border-[var(--color-success)]/20 bg-[var(--color-success)]/10 text-[var(--color-success)] hover:bg-[var(--color-success)]/10",
                        )}
                      >
                        {showSaved ? t("ws.common.saved") : t("ws.common.save")}
                      </Button>
                    </div>
                  </div>
                )}

                {/* Model list — flat, no switches */}
                <div>
                  {showSaved && showSavedBannerFor === activeProvider.id && (
                    <div className="flex items-center gap-2 mb-3 px-3 py-2 rounded-lg bg-[var(--color-success)]/8 text-[11px] text-[var(--color-success)]">
                      <Check size={12} className="shrink-0" />
                      {t("ws.settings.savedSelectModel")}
                    </div>
                  )}
                  {saveError && (
                    <div className="flex items-center gap-2 mb-3 px-3 py-2 rounded-lg bg-[var(--color-error)]/8 text-[11px] text-[var(--color-error)]">
                      <AlertCircle size={12} className="shrink-0" />
                      <span>{t("ws.settings.connectionFailed")}</span>
                    </div>
                  )}
                  <SectionHeader
                    className="mb-3"
                    title={
                      <div className="text-[13px] font-semibold text-text-primary">
                        {t("ws.settings.model")}{" "}
                        <span className="font-normal text-text-tertiary">
                          {activeProvider.models.length}
                        </span>
                      </div>
                    }
                  />
                  <div className="space-y-1.5">
                    {activeProvider.models.map((model) => {
                      const isActive = model.id === selectedModelId;
                      return (
                        <button
                          key={model.id}
                          onClick={() => setSelectedModelId(model.id)}
                          className={`w-full min-h-9 flex items-center justify-between gap-3 rounded-lg border-none px-3 py-2.5 text-left transition-all ${
                            isActive
                              ? "ring-1 ring-[var(--color-brand-primary)]/50 bg-[var(--color-brand-subtle)]"
                              : "bg-surface-2 hover:bg-surface-3"
                          }`}
                        >
                          <div className="flex min-w-0 flex-1 items-center gap-2.5">
                            <span className="flex size-4 shrink-0 items-center justify-center rounded-md">
                              <ProviderLogo provider={activeProvider.id} size={14} />
                            </span>
                            <div
                              className={`truncate text-base ${isActive ? "font-semibold text-text-primary" : "font-medium text-text-secondary"}`}
                            >
                              {model.name}
                            </div>
                          </div>
                          <div className="flex shrink-0 items-center gap-2">
                            <span className="text-sm text-text-tertiary tabular-nums">
                              {model.contextWindow}
                            </span>
                            {isActive && (
                              <Check
                                size={14}
                                className="shrink-0 text-[var(--color-brand-primary)]"
                              />
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
