import {
  Badge,
  Button,
  GitHubIcon,
  Input,
  ModelLogo,
  PageHeader,
  ProviderLogo,
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
  Switch,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  TextLink,
  cn,
} from "@nexu-design/ui-web";
import * as SelectPrimitive from "@radix-ui/react-select";
import {
  AlertCircle,
  ArrowUpRight,
  BookOpen,
  Check,
  Globe,
  Info,
  Mail,
  Monitor,
  Plus,
  RefreshCw,
  ScrollText,
  Shield,
  Trash2,
  User,
} from "lucide-react";
import { useCallback, useState } from "react";
import { type Locale, useLocale } from "../../hooks/useLocale";
import { openExternal } from "../../utils/open-external";
import { GitHubStarButton } from "./GitHubStarButton";
import { type ModelProvider, type ProviderDetail, getProviderDetails } from "./data";

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

type CustomProviderTemplateId = "custom-openai" | "custom-anthropic";

type CustomProviderDraft = {
  compatibility: CustomProviderTemplateId;
  displayName: string;
  id: string;
  instanceId: string;
  providerTemplateId: CustomProviderTemplateId;
  proxyUrl: string;
};

type ProviderListItem = ProviderDetail & {
  isCustom?: boolean;
  isDraft?: boolean;
  sourceKey?: string;
};

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
  const customProviderTemplates = providers.filter(
    (provider) => provider.id === "custom-openai" || provider.id === "custom-anthropic",
  );
  const baseProviders = providers.filter(
    (provider) => provider.id !== "custom-openai" && provider.id !== "custom-anthropic",
  );
  const [customProviders, setCustomProviders] = useState<ProviderListItem[]>([]);
  const [customProviderDrafts, setCustomProviderDrafts] = useState<CustomProviderDraft[]>([]);
  const [activeProviderId, setActiveProviderId] = useState<string>(initialProviderId);
  const [selectedModelId, setSelectedModelId] = useState<string | null>(() => {
    const nexu = providers.find((p) => p.id === "nexu");
    return nexu?.models[0]?.id ?? null;
  });
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
  const getCustomTemplateLabel = useCallback(
    (templateId: CustomProviderTemplateId) =>
      templateId === "custom-openai"
        ? t("ws.settings.customProviderCompatibilityOpenAI")
        : t("ws.settings.customProviderCompatibilityAnthropic"),
    [t],
  );
  const combinedProviders: ProviderListItem[] = [
    ...baseProviders,
    ...customProviders,
    ...customProviderDrafts.map((draft) => ({
      id: draft.id as ModelProvider,
      name:
        draft.displayName ||
        (draft.instanceId.trim()
          ? `${getCustomTemplateLabel(draft.compatibility)} / ${draft.instanceId.trim()}`
          : t("ws.settings.customProviderDraft")),
      description: t("ws.settings.customProviderDraftDesc"),
      enabled: false,
      apiKeyPlaceholder: draft.compatibility === "custom-openai" ? "sk-..." : "sk-ant-...",
      proxyUrl: draft.proxyUrl,
      models: [],
      isCustom: true,
      isDraft: true,
      sourceKey: draft.id,
    })),
  ];
  const activeProvider =
    combinedProviders.find((p) => p.id === activeProviderId) ?? combinedProviders[0];
  const activeCustomDraft =
    customProviderDrafts.find((draft) => draft.id === activeProviderId) ?? null;
  const isCustomProvider = !!activeProvider?.isCustom;
  const isCustomDraft = !!activeProvider?.isDraft;

  const getFormValues = (providerId: string) => {
    const p = combinedProviders.find((x) => x.id === providerId);
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
        proxyUrl: combinedProviders.find((p) => p.id === providerId)?.proxyUrl ?? "",
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
        const p = combinedProviders.find((x) => x.id === providerId);
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

  const createCustomProviderDraft = () => {
    const id = `custom-draft-${Date.now()}`;
    const draft: CustomProviderDraft = {
      id,
      providerTemplateId: "custom-openai",
      compatibility: "custom-openai",
      instanceId: "",
      displayName: "",
      proxyUrl: "",
    };
    setCustomProviderDrafts((prev) => [...prev, draft]);
    setActiveProviderId(id);
  };

  const updateCustomDraft = (draftId: string, field: keyof CustomProviderDraft, value: string) => {
    setCustomProviderDrafts((prev) =>
      prev.map((draft) => (draft.id === draftId ? { ...draft, [field]: value } : draft)),
    );
  };

  const removeCustomDraft = (draftId: string) => {
    setCustomProviderDrafts((prev) => prev.filter((draft) => draft.id !== draftId));
    if (activeProviderId === draftId) setActiveProviderId("nexu");
  };

  const removeCustomProvider = (providerId: string) => {
    setCustomProviders((prev) => prev.filter((provider) => provider.id !== providerId));
    setFormValues((prev) => {
      const next = { ...prev };
      delete next[providerId];
      return next;
    });
    setSavedValues((prev) => {
      const next = { ...prev };
      delete next[providerId];
      return next;
    });
    if (activeProviderId === providerId) setActiveProviderId("nexu");
  };

  const createCustomProvider = (draft: CustomProviderDraft) => {
    if (!draft.instanceId.trim() || !draft.proxyUrl.trim()) return;
    const instanceId = draft.instanceId.trim();
    const providerId = `${draft.providerTemplateId}/${instanceId}`;
    const providerName =
      draft.displayName.trim() ||
      `${getCustomTemplateLabel(draft.providerTemplateId)} / ${instanceId}`;
    const providerDetail: ProviderListItem = {
      id: providerId as ModelProvider,
      name: providerName,
      description:
        draft.providerTemplateId === "custom-openai"
          ? t("ws.settings.customProviderDescOpenAI")
          : t("ws.settings.customProviderDescAnthropic"),
      enabled: false,
      apiKeyPlaceholder: draft.providerTemplateId === "custom-openai" ? "sk-..." : "sk-ant-...",
      proxyUrl: draft.proxyUrl.trim(),
      models: [],
      isCustom: true,
      sourceKey: providerId,
    };

    setCustomProviders((prev) => [...prev, providerDetail]);
    setCustomProviderDrafts((prev) => prev.filter((item) => item.id !== draft.id));
    setFormValues((prev) => ({
      ...prev,
      [providerId]: {
        apiKey: prev[providerId]?.apiKey ?? "",
        proxyUrl: draft.proxyUrl.trim(),
      },
    }));
    setActiveProviderId(providerId);
  };

  return (
    <div className="h-full overflow-y-auto">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-2 pb-6 sm:pb-8">
        <PageHeader
          density="shell"
          title={t("ws.settings.title")}
          description={t("ws.settings.subtitle")}
          actions={<GitHubStarButton href={githubUrl} label={t("ws.common.starOnGitHub")} />}
        />

        <Tabs
          value={settingsTab}
          onValueChange={(value) => setSettingsTab(value as SettingsTab)}
          className="w-full"
        >
          <TabsList className="mb-6 w-auto">
            {[
              { id: "general" as SettingsTab, labelKey: "ws.settings.tab.general" },
              { id: "providers" as SettingsTab, labelKey: "ws.settings.tab.providers" },
            ].map((tab) => (
              <TabsTrigger key={tab.id} value={tab.id} className="text-[13px]">
                {t(tab.labelKey)}
              </TabsTrigger>
            ))}
          </TabsList>

          {/* ── General Tab ── */}
          <TabsContent value="general" className="space-y-6 mt-0">
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
                        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[12px] border border-border bg-white text-[11px] font-semibold text-text-primary"
                        aria-hidden
                      >
                        {initialsFromEmail(accountEmail)}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div
                          className="text-[12px] font-medium text-text-primary truncate"
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
                      className="rounded-[8px] border border-border bg-surface-0 px-[14px] py-[5px] text-[12px] font-medium text-text-secondary hover:bg-surface-2 hover:text-text-primary transition-colors shrink-0"
                    >
                      {t("ws.settings.account.signOut")}
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <div className="text-[12px] font-medium text-text-primary">
                        {t("ws.settings.account.notSignedIn")}
                      </div>
                      <div className="text-[11px] text-text-tertiary mt-0.5">
                        {t("ws.settings.account.signInDesc")}
                      </div>
                    </div>
                    <Button
                      type="button"
                      variant="primary"
                      size="sm"
                      onClick={() =>
                        openExternal(`${window.location.origin}/openclaw/auth?desktop=1`)
                      }
                      trailingIcon={<ArrowUpRight size={14} />}
                    >
                      {t("ws.settings.account.signIn")}
                    </Button>
                  </div>
                )}
              </div>
            </div>

            {/* Language */}
            <div className="rounded-xl border border-border bg-surface-1 overflow-hidden">
              <div className="px-5 py-4 border-b border-border">
                <div className="flex items-center gap-2">
                  <Globe size={14} className="text-text-secondary" />
                  <h3 className="text-[13px] font-semibold text-text-primary">
                    {t("ws.settings.languageSection")}
                  </h3>
                </div>
              </div>
              <div className="px-5 py-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-6">
                  <div className="min-w-0 flex-1">
                    <div className="text-[12px] font-medium text-text-primary">
                      {t("ws.settings.appearance.language")}
                    </div>
                    <div className="text-[11px] text-text-tertiary mt-0.5">
                      {t("ws.settings.appearance.languageDesc")}
                    </div>
                  </div>
                  <Select value={locale} onValueChange={(v) => setLocale(v as Locale)}>
                    <SelectTrigger
                      className="h-auto min-h-9 w-full min-w-0 shrink-0 py-2 sm:w-[220px]"
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
                    <div className="text-[12px] font-medium text-text-primary">
                      {t("ws.settings.behavior.launchAtLogin")}
                    </div>
                    <div className="text-[11px] text-text-tertiary mt-0.5">
                      {t("ws.settings.behavior.launchAtLoginDesc")}
                    </div>
                  </div>
                  <Switch
                    checked={launchAtLogin}
                    onCheckedChange={setLaunchAtLoginPersist}
                    size="sm"
                    className="shrink-0 mt-0.5"
                  />
                </div>
                <div className="flex items-start justify-between gap-4 pt-4">
                  <div className="min-w-0 flex-1">
                    <div className="text-[12px] font-medium text-text-primary">
                      {t("ws.settings.behavior.showInDock")}
                    </div>
                    <div className="text-[11px] text-text-tertiary mt-0.5">
                      {t("ws.settings.behavior.showInDockDesc")}
                    </div>
                  </div>
                  <Switch
                    checked={showInDock}
                    onCheckedChange={setShowInDockPersist}
                    size="sm"
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
              <div className="px-5 py-4 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-[12px] font-medium text-text-primary">
                      {t("ws.settings.data.analytics")}
                    </div>
                    <div className="text-[11px] text-text-tertiary mt-0.5">
                      {t("ws.settings.data.analyticsDesc")}
                    </div>
                  </div>
                  <Switch checked={analytics} onCheckedChange={setAnalyticsPersist} size="sm" />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-[12px] font-medium text-text-primary">
                      {t("ws.settings.data.crashReports")}
                    </div>
                    <div className="text-[11px] text-text-tertiary mt-0.5">
                      {t("ws.settings.data.crashReportsDesc")}
                    </div>
                  </div>
                  <Switch checked={crashReports} onCheckedChange={setCrashReports} size="sm" />
                </div>
              </div>
            </div>

            {/* Updates */}
            <div className="rounded-xl border border-border bg-surface-1 overflow-hidden">
              <div className="px-5 py-4 border-b border-border">
                <div className="flex items-center gap-2">
                  <RefreshCw size={14} className="text-text-secondary" />
                  <h3 className="text-[13px] font-semibold text-text-primary">
                    {t("ws.settings.updates")}
                  </h3>
                </div>
              </div>
              <div className="px-5 py-4 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-[12px] font-medium text-text-primary">
                      {t("ws.settings.updates.version")}
                    </div>
                    <div className="text-[11px] text-text-tertiary mt-0.5">
                      {t("ws.settings.about.versionNumber")}
                    </div>
                  </div>
                  <button className="rounded-[8px] px-[14px] py-[5px] text-[12px] font-medium border border-border bg-surface-0 text-text-secondary hover:bg-surface-2 hover:text-text-primary transition-colors">
                    {t("ws.settings.updates.checkNow")}
                  </button>
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
                      className="flex items-center gap-2.5 px-2 py-2 rounded-lg text-[12px] font-medium text-text-secondary hover:text-text-primary hover:bg-surface-2 transition-colors -mx-2"
                    >
                      <link.icon size={13} className="text-text-muted shrink-0" />
                      {t(link.labelKey)}
                      <ArrowUpRight size={10} className="text-text-muted ml-auto shrink-0" />
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>

          {/* ── Providers Tab ── */}
          <TabsContent value="providers" className="mt-0">
            <div className="overflow-hidden rounded-2xl border border-border bg-white shadow-[0_1px_2px_rgba(15,23,42,0.03)]">
              <div className="flex min-h-[600px]">
                <section className="flex w-[240px] shrink-0 flex-col border-r border-border-subtle bg-[#fcfcfb]">
                  <div className="px-4 pb-2 pt-3 text-[11px] font-semibold uppercase tracking-[0.12em] text-text-tertiary">
                    {t("ws.settings.tab.providers")}
                  </div>
                  <div className="flex-1 space-y-0.5 overflow-y-auto px-2 pb-3">
                    {combinedProviders.map((p) => {
                      const active = p.id === activeProviderId;
                      return (
                        <button
                          type="button"
                          key={p.id}
                          onClick={() => setActiveProviderId(p.id)}
                          className={cn(
                            "flex w-full items-center gap-2 rounded-xl px-3 py-1.5 text-left transition-colors",
                            active ? "bg-surface-2" : "hover:bg-surface-1",
                          )}
                        >
                          <span className="flex size-6 shrink-0 items-center justify-center rounded-md border border-border-subtle bg-white">
                            <ProviderLogo provider={p.id} size={14} title={p.name} />
                          </span>
                          <span className="min-w-0 flex-1 truncate text-[12px] font-medium text-text-primary">
                            {p.name}
                          </span>
                          {p.isCustom ? (
                            <Badge variant="outline" size="xs" className="shrink-0">
                              {t("ws.settings.customProviderBadge")}
                            </Badge>
                          ) : (
                            <span className="text-[11px] text-text-tertiary">
                              {p.models.length}
                            </span>
                          )}
                        </button>
                      );
                    })}
                    <button
                      type="button"
                      onClick={createCustomProviderDraft}
                      className="mt-1 flex w-full items-center gap-2 rounded-xl border border-dashed border-border-strong px-3 py-1.5 text-left transition-colors hover:bg-surface-1"
                    >
                      <span className="flex size-6 shrink-0 items-center justify-center rounded-md border border-dashed border-border-strong bg-white text-text-secondary">
                        <Plus size={14} />
                      </span>
                      <span className="min-w-0 flex-1 truncate text-[12px] font-medium text-text-secondary">
                        {t("ws.settings.addCustomProvider")}
                      </span>
                    </button>
                  </div>
                </section>

                <section className="min-w-0 flex-1 bg-white px-6 pb-6 pt-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex min-w-0 items-center gap-3">
                      <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-surface-1 text-text-primary">
                        <ProviderLogo
                          provider={activeProvider.id}
                          size={20}
                          title={activeProvider.name}
                        />
                      </span>
                      <div className="min-w-0">
                        <div className="truncate text-[16px] font-semibold text-text-primary">
                          {activeProvider.name}
                        </div>
                        <div className="mt-0.5 truncate text-[12px] text-text-secondary">
                          {activeProvider.description}
                        </div>
                      </div>
                    </div>

                    {isCustomDraft ? (
                      <button
                        type="button"
                        onClick={() => activeCustomDraft && removeCustomDraft(activeCustomDraft.id)}
                        className="inline-flex items-center gap-1.5 text-[12px] font-medium text-text-secondary transition-colors hover:text-[var(--color-error)]"
                      >
                        <Trash2 size={13} />
                        <span>{t("ws.settings.customProviderRemove")}</span>
                      </button>
                    ) : isCustomProvider ? (
                      <button
                        type="button"
                        onClick={() => removeCustomProvider(activeProvider.id)}
                        className="inline-flex items-center gap-1.5 text-[12px] font-medium text-text-secondary transition-colors hover:text-[var(--color-error)]"
                      >
                        <Trash2 size={13} />
                        <span>{t("ws.settings.customProviderRemove")}</span>
                      </button>
                    ) : activeProvider.apiDocsUrl &&
                      !(activeProvider.id === "nexu" && !signedIn) ? (
                      <TextLink
                        href={activeProvider.apiDocsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        size="sm"
                        showArrowUpRight
                      >
                        {t("ws.settings.getApiKey")}
                      </TextLink>
                    ) : null}
                  </div>

                  {activeProvider.id === "nexu" && !signedIn ? (
                    <div className="my-4 rounded-xl border border-[#aee8f7] bg-[#eefafe] px-5 py-4">
                      <div className="text-[14px] font-semibold leading-snug text-[#2bb5da]">
                        {t("ws.settings.signInTitle")}
                      </div>
                      <div className="mt-1.5 text-[12px] leading-relaxed text-text-secondary">
                        {t("ws.settings.signInDesc")}
                      </div>
                      <Button
                        type="button"
                        size="default"
                        className="mt-3.5"
                        onClick={() =>
                          openExternal(`${window.location.origin}/openclaw/auth?desktop=1`)
                        }
                        trailingIcon={<ArrowUpRight size={14} />}
                      >
                        {t("ws.settings.signInBtn")}
                      </Button>
                    </div>
                  ) : null}

                  {isCustomDraft && activeCustomDraft ? (
                    <div className="my-4 space-y-4 p-1">
                      <div>
                        <label className="mb-1 block text-[12px] font-semibold text-text-primary">
                          {t("ws.settings.customProviderCompatibility")}
                        </label>
                        <div className="flex gap-2">
                          {(["custom-openai", "custom-anthropic"] as const).map((templateId) => {
                            const active = activeCustomDraft.compatibility === templateId;
                            return (
                              <button
                                key={templateId}
                                type="button"
                                onClick={() => {
                                  updateCustomDraft(
                                    activeCustomDraft.id,
                                    "compatibility",
                                    templateId,
                                  );
                                  updateCustomDraft(
                                    activeCustomDraft.id,
                                    "providerTemplateId",
                                    templateId,
                                  );
                                }}
                                className={cn(
                                  "rounded-full border px-3 py-1.5 text-[12px] font-medium transition-colors",
                                  active
                                    ? "border-accent bg-accent text-[var(--color-accent-fg)]"
                                    : "border-border bg-surface-0 text-text-secondary hover:bg-surface-1",
                                )}
                              >
                                {templateId === "custom-openai"
                                  ? t("ws.settings.customProviderCompatibilityOpenAI")
                                  : t("ws.settings.customProviderCompatibilityAnthropic")}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                      <div>
                        <label className="mb-1 block text-[12px] font-semibold text-text-primary">
                          {t("ws.settings.customProviderInstanceId")}
                        </label>
                        <Input
                          type="text"
                          placeholder="my-provider"
                          value={activeCustomDraft.instanceId}
                          onChange={(e) =>
                            updateCustomDraft(activeCustomDraft.id, "instanceId", e.target.value)
                          }
                          className="w-full text-[12px]"
                        />
                      </div>
                      <div>
                        <label className="mb-1 block text-[12px] font-semibold text-text-primary">
                          {t("ws.settings.customProviderDisplayName")}
                        </label>
                        <Input
                          type="text"
                          placeholder={t("ws.settings.customProviderDraft")}
                          value={activeCustomDraft.displayName}
                          onChange={(e) =>
                            updateCustomDraft(activeCustomDraft.id, "displayName", e.target.value)
                          }
                          className="w-full text-[12px]"
                        />
                      </div>
                      <div>
                        <label className="mb-1 block text-[12px] font-semibold text-text-primary">
                          {t("ws.settings.customProviderBaseUrl")}
                        </label>
                        <Input
                          type="text"
                          placeholder={
                            activeCustomDraft.compatibility === "custom-openai"
                              ? "https://your-endpoint/v1"
                              : "https://your-anthropic-endpoint"
                          }
                          value={activeCustomDraft.proxyUrl}
                          onChange={(e) =>
                            updateCustomDraft(activeCustomDraft.id, "proxyUrl", e.target.value)
                          }
                          className="w-full text-[12px]"
                        />
                      </div>
                      <div className="flex items-center justify-between gap-3">
                        <button
                          type="button"
                          onClick={() => removeCustomDraft(activeCustomDraft.id)}
                          className="text-[12px] text-text-muted hover:text-text-secondary"
                        >
                          {t("ws.settings.customProviderRemove")}
                        </button>
                        <Button
                          size="sm"
                          disabled={
                            !activeCustomDraft.instanceId.trim() ||
                            !activeCustomDraft.proxyUrl.trim()
                          }
                          onClick={() => createCustomProvider(activeCustomDraft)}
                        >
                          {t("ws.settings.customProviderCreate")}
                        </Button>
                      </div>
                    </div>
                  ) : (
                    activeProvider.id !== "nexu" && (
                      <div className="my-4 space-y-3 p-1">
                        <div>
                          <label className="mb-1 block text-[12px] font-semibold text-text-primary">
                            {t("ws.settings.apiKey")}
                          </label>
                          <Input
                            type="password"
                            placeholder={activeProvider.apiKeyPlaceholder}
                            value={getFormValues(activeProvider.id).apiKey}
                            onChange={(e) =>
                              setFormField(activeProvider.id, "apiKey", e.target.value)
                            }
                            className="w-full text-[12px]"
                          />
                        </div>
                        <div>
                          <label className="mb-1 block text-[12px] font-semibold text-text-primary">
                            {isCustomProvider
                              ? t("ws.settings.customProviderBaseUrl")
                              : t("ws.settings.apiProxyUrl")}
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
                        <div className="flex items-center justify-end gap-2">
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
                    )
                  )}

                  {!(activeProvider.id === "nexu" && !signedIn) && !isCustomDraft ? (
                    <>
                      <div className="my-4 border-t border-border-subtle" />

                      {showSaved && showSavedBannerFor === activeProvider.id ? (
                        <div className="mb-3 flex items-center gap-2 rounded-lg bg-[var(--color-success)]/8 px-3 py-2 text-[11px] text-[var(--color-success)]">
                          <Check size={12} className="shrink-0" />
                          {t("ws.settings.savedSelectModel")}
                        </div>
                      ) : null}
                      {saveError ? (
                        <div className="mb-3 flex items-center gap-2 rounded-lg bg-[var(--color-error)]/8 px-3 py-2 text-[11px] text-[var(--color-error)]">
                          <AlertCircle size={12} className="shrink-0" />
                          <span>{t("ws.settings.connectionFailed")}</span>
                        </div>
                      ) : null}

                      <div className="mb-3 flex items-center justify-between gap-4">
                        <div className="text-[11px] font-semibold uppercase tracking-[0.12em] text-text-tertiary">
                          {t("ws.settings.model")} ({activeProvider.models.length})
                        </div>
                        <button
                          type="button"
                          className="inline-flex items-center gap-2 text-[12px] font-medium text-text-secondary transition-colors hover:text-text-primary"
                        >
                          <RefreshCw size={14} />
                          <span>{t("ws.settings.testConnection")}</span>
                        </button>
                      </div>

                      {activeProvider.models.length === 0 ? (
                        <div className="rounded-xl border border-dashed border-border-subtle bg-surface-0 px-4 py-5">
                          <div className="text-[12px] font-medium text-text-primary">
                            {t("ws.settings.customProviderNoModelsTitle")}
                          </div>
                          <div className="mt-1 text-[11px] text-text-secondary">
                            {t("ws.settings.customProviderNoModelsDesc")}
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-0.5">
                          {activeProvider.models.map((model) => {
                            const isActive = model.id === selectedModelId;
                            return (
                              <button
                                type="button"
                                key={model.id}
                                onClick={() => setSelectedModelId(model.id)}
                                className={cn(
                                  "flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left transition-colors",
                                  isActive ? "bg-surface-2" : "hover:bg-surface-1",
                                )}
                              >
                                <span className="flex size-8 shrink-0 items-center justify-center rounded-lg border border-border-subtle bg-white">
                                  <ModelLogo
                                    model={model.id}
                                    provider={activeProvider.id}
                                    size={16}
                                    title={model.name}
                                  />
                                </span>
                                <span className="min-w-0 flex-1 truncate text-[12px] font-medium text-text-primary">
                                  {model.name}
                                </span>
                                <span className="text-[11px] text-text-tertiary">
                                  {model.contextWindow}
                                </span>
                                {isActive ? (
                                  <Check size={14} className="shrink-0 text-accent" />
                                ) : null}
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </>
                  ) : null}
                </section>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
