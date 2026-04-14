import {
  Badge,
  Button,
  Dialog,
  DialogBody,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
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
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  Bot,
  Check,
  ChevronDown,
  Code2,
  Diamond,
  ExternalLink,
  FileText,
  Globe,
  HelpCircle,
  Info,
  Mail,
  Monitor,
  MousePointer2,
  Pause,
  Play,
  Plus,
  RefreshCw,
  ScrollText,
  Search,
  Shield,
  Smartphone,
  Sparkles,
  Terminal,
  Trash2,
  User,
  X,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { type Locale, useLocale } from "../../hooks/useLocale";
import { openExternal } from "../../utils/open-external";
import { GitHubStarButton } from "./GitHubStarButton";
import {
  type ModelProvider,
  type ProviderDetail,
  type ProviderModel,
  getDefaultModelsForCustomProvider,
  getModelCatalogueForProvider,
  getProviderDetails,
} from "./data";
import { TierPlusBadge, TierProBadge, getModelIconProvider } from "./iconHelpers";

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

type SettingsTab = "general" | "agents" | "providers" | "harness" | "instruction";

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

function AgentModelSelect({ t, onGoToProviders }: { t: (key: string) => string; onGoToProviders?: () => void }) {
  const providers = getProviderDetails();
  const enabledProviders = providers.filter((p) => p.enabled);
  const allModels = enabledProviders.flatMap((p) =>
    p.models.filter((m) => m.enabled).map((m) => ({ ...m, providerId: p.id, providerName: p.name })),
  );
  const [selectedId, setSelectedId] = useState(allModels[0]?.id ?? "");
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(() => {
    const m = allModels.find((x) => x.id === selectedId);
    return new Set(m ? [m.providerId] : enabledProviders.length > 0 ? [enabledProviders[0].id] : []);
  });
  const ref = useRef<HTMLDivElement>(null);
  const selected = allModels.find((m) => m.id === selectedId) ?? allModels[0];

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  useEffect(() => {
    if (open) {
      setSearch("");
      const m = allModels.find((x) => x.id === selectedId);
      setExpandedGroups(new Set(m ? [m.providerId] : enabledProviders.length > 0 ? [enabledProviders[0].id] : []));
    }
  }, [open]);

  const query = search.toLowerCase().trim();
  const filtered = enabledProviders
    .map((p) => ({
      ...p,
      models: p.models.filter(
        (m) => m.enabled && (!query || m.name.toLowerCase().includes(query) || p.name.toLowerCase().includes(query)),
      ),
    }))
    .filter((p) => p.models.length > 0);

  return (
    <div className="relative" ref={ref}>
      <label className="text-[12px] font-medium text-text-primary block mb-1.5">
        {t("ws.agents.model")}
      </label>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex w-full h-9 items-center gap-2 rounded-lg border border-border bg-surface-0 px-3 text-[13px] text-text-primary transition-all hover:border-border-hover"
      >
        {selected ? (
          <>
            <span className="flex size-4 shrink-0 items-center justify-center">
              <ProviderLogo provider={getModelIconProvider(selected.name) || selected.providerId || "nexu"} size={14} />
            </span>
            <span className="flex-1 text-left truncate">{selected.name}</span>
            {selected.tier === "pro" ? <TierProBadge height={13} className="shrink-0" /> : null}
            {selected.tier === "plus" ? <TierPlusBadge height={13} className="shrink-0" /> : null}
            {selected.providerId === "nexu" && !selected.tier ? (
              <span className="shrink-0 rounded-[4px] bg-gradient-to-r from-[#3DB9CE] to-[#34D399] px-1.5 py-[2px] text-[9px] font-bold text-white">
                Unlimited
              </span>
            ) : null}
          </>
        ) : (
          <span className="text-text-muted">{t("ws.agents.modelDefault")}</span>
        )}
        <ChevronDown size={12} className={cn("ml-auto text-text-muted shrink-0 transition-transform", open && "rotate-180")} />
      </button>

      {open && (
        <div className="absolute z-50 mt-1 left-0 w-full rounded-xl border border-border bg-surface-1 shadow-xl">
          <div className="px-3 pt-3 pb-2">
            <div className="flex items-center gap-2.5 rounded-lg border border-border bg-surface-0 px-3 py-2">
              <Search size={14} className="text-text-muted shrink-0" />
              <input
                type="text"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  if (e.target.value.trim()) setExpandedGroups(new Set(enabledProviders.map((p) => p.id)));
                }}
                placeholder={t("ws.home.searchModels")}
                className="flex-1 bg-transparent text-xs font-normal text-text-primary placeholder:text-text-muted/50 outline-none"
              />
            </div>
          </div>
          <div className="relative px-3 pb-2">
            <div className="max-h-[280px] overflow-y-auto py-1" style={{ overscrollBehavior: "contain" }}>
              {filtered.length === 0 ? (
                <div className="px-4 py-6 text-center text-xs text-text-muted">
                  {t("ws.home.noMatchingModels")}
                </div>
              ) : (
                filtered.map((provider) => {
                  const isExpanded = expandedGroups.has(provider.id) || !!query;
                  return (
                    <div key={provider.id}>
                      <button
                        type="button"
                        onClick={() => {
                          if (query) return;
                          setExpandedGroups((prev) => {
                            const next = new Set(prev);
                            if (next.has(provider.id)) next.delete(provider.id);
                            else next.add(provider.id);
                            return next;
                          });
                        }}
                        className="flex min-h-9 w-full items-center gap-2 rounded-lg pl-4 pr-3 py-2 transition-colors hover:bg-surface-2"
                      >
                        <ChevronDown
                          size={12}
                          className={cn("text-text-secondary transition-transform", !isExpanded && "-rotate-90")}
                        />
                        <span className="flex size-4 shrink-0 items-center justify-center">
                          <ProviderLogo provider={provider.id} size={14} />
                        </span>
                        <span className="text-xs font-normal text-text-secondary">{provider.name}</span>
                      </button>
                      {isExpanded &&
                        provider.models.map((model) => (
                          <button
                            key={model.id}
                            type="button"
                            onClick={() => {
                              setSelectedId(model.id);
                              setOpen(false);
                            }}
                            className={cn(
                              "flex min-h-9 w-full items-center gap-2.5 rounded-lg pl-7 pr-3 py-2 text-left transition-colors hover:bg-surface-2",
                              model.id === selectedId && "bg-accent/10 font-medium",
                            )}
                          >
                            <span className="flex size-4 shrink-0 items-center justify-center">
                              <ProviderLogo provider={getModelIconProvider(model.name) || provider.id || "nexu"} size={14} />
                            </span>
                            <span className="flex flex-1 items-center gap-1.5 min-w-0">
                              <span className={cn("truncate text-xs", model.id === selectedId ? "font-semibold text-text-heading" : "font-normal text-text-primary")}>
                                {model.name}
                              </span>
                              {model.tier === "pro" && <TierProBadge height={14} className="shrink-0" />}
                              {model.tier === "plus" && <TierPlusBadge height={14} className="shrink-0" />}
                              {provider.id === "nexu" && !model.tier && (
                                <span className="shrink-0 rounded-[4px] bg-gradient-to-r from-[#3DB9CE] to-[#34D399] px-1.5 py-[2px] text-[9px] font-bold text-white">
                                  Unlimited
                                </span>
                              )}
                            </span>
                            {provider.id === "nexu" && model.creditsPerConversation ? (
                              <span className="shrink-0 text-[9px] font-normal tabular-nums text-text-muted/60">
                                {"~"}{model.creditsPerConversation}{" 积分/次"}
                              </span>
                            ) : model.inputPrice ? (
                              <span className="shrink-0 text-[9px] font-normal tabular-nums text-text-muted/60">
                                {(model.inputPrice || "").replace(/\.00/g, "").replace(/\/M$/, "")}
                                {" / "}
                                {(model.outputPrice || "").replace(/\.00/g, "").replace(/\/M$/, "")}
                              </span>
                            ) : null}
                          </button>
                        ))}
                    </div>
                  );
                })
              )}
            </div>
          </div>
          <div className="border-t border-border px-3 py-2">
            <button
              type="button"
              onClick={() => {
                setOpen(false);
                onGoToProviders?.();
              }}
              className="flex min-h-9 w-full items-center gap-2 rounded-lg px-3 py-2 text-left transition-colors hover:bg-surface-2"
            >
              <Settings size={14} className="text-text-primary" />
              <span className="text-[12px] font-medium text-text-primary">
                {t("ws.home.configureProviders")}
              </span>
              <ArrowRight size={12} className="ml-auto text-text-secondary" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

type AgentTab = "dashboard" | "instructions" | "skills" | "configuration" | "runs" | "budget";
const AGENT_TABS: { id: AgentTab; label: string }[] = [
  { id: "instructions", label: "Instructions" },
];

const HARNESS_OPTIONS = [
  { id: "pi", name: "Pi", descKey: "ws.harness.pi.desc", icon: Terminal, active: false, advantageKey: "ws.harness.pi.advantage" },
  { id: "claude-code", name: "Claude Code", descKey: "ws.harness.claudeCode.desc", icon: Sparkles, active: true, advantageKey: "ws.harness.claudeCode.advantage" },
  { id: "codex", name: "Codex", descKey: "ws.harness.codex.desc", icon: Code2, active: false, advantageKey: "ws.harness.codex.advantage" },
  { id: "cursor", name: "Cursor", descKey: "ws.harness.cursor.desc", icon: MousePointer2, active: false, advantageKey: "ws.harness.cursor.advantage" },
  { id: "gemini-cli", name: "Gemini CLI", descKey: "ws.harness.gemini.desc", icon: Diamond, active: false, advantageKey: "ws.harness.gemini.advantage" },
];

function AgentDetailView({ t, onGoToProviders }: { t: (key: string) => string; onGoToProviders: () => void }) {
  const [agentTab, setAgentTab] = useState<AgentTab>("instructions");
  const [activeHarness, setActiveHarness] = useState("claude-code");

  const currentHarness = HARNESS_OPTIONS.find((h) => h.id === activeHarness) ?? HARNESS_OPTIONS[0];
  const CurrentIcon = currentHarness.icon;

  return (
    <div>
      {/* Breadcrumb */}
      <div className="text-[12px] text-text-muted mb-4">
        <span className="hover:text-text-primary cursor-pointer transition-colors">Harness</span>
        <span className="mx-1.5">&gt;</span>
        <span className="text-text-primary">OpenClaw</span>
        {agentTab !== "dashboard" && (
          <>
            <span className="mx-1.5">&gt;</span>
            <span className="text-text-primary capitalize">{agentTab}</span>
          </>
        )}
      </div>

      {/* Agent header */}
      <div className="flex items-center gap-3 mb-5">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-surface-2 border border-border">
          <Globe size={22} className="text-text-secondary" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-[20px] font-semibold text-text-primary leading-tight">OpenClaw</div>
          <div className="text-[12px] text-text-muted">OpenClaw</div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--color-success)]/30 bg-[var(--color-success)]/10 px-2.5 py-1 text-[11px] font-medium text-[var(--color-success)]">
            <span className="relative flex h-1.5 w-1.5"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--color-success)] opacity-75" /><span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[var(--color-success)]" /></span>
            running
          </span>
        </div>
      </div>

      {/* ── Harness Switcher (prominent) ── */}
      <div className="rounded-xl border border-border bg-surface-1 mb-6 overflow-hidden">
        <div className="px-5 py-3 border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bot size={14} className="text-text-secondary" />
            <span className="text-[13px] font-semibold text-text-primary">Code Agent Harness</span>
          </div>
          <span className="text-[11px] text-text-muted">Current: <span className="font-medium text-text-primary">{currentHarness.name}</span></span>
        </div>
        <div className="px-4 py-3 flex gap-2 overflow-x-auto">
          {HARNESS_OPTIONS.map((h) => {
            const Icon = h.icon;
            const isActive = h.id === activeHarness;
            return (
              <button
                key={h.id}
                type="button"
                onClick={() => setActiveHarness(h.id)}
                className={cn(
                  "flex flex-col items-center gap-1.5 rounded-xl border px-4 py-3 min-w-[100px] text-center transition-all shrink-0",
                  isActive
                    ? "border-accent bg-accent/5 shadow-sm"
                    : "border-border bg-surface-0 hover:border-border-hover hover:bg-surface-2",
                )}
              >
                <Icon size={18} className={isActive ? "text-accent" : "text-text-secondary"} />
                <span className={cn("text-[11px] font-medium", isActive ? "text-accent" : "text-text-primary")}>{h.name}</span>
                <span className="text-[9px] text-text-muted">{t(h.descKey)}</span>
              </button>
            );
          })}
          <button
            type="button"
            className="flex flex-col items-center justify-center gap-1 rounded-xl border border-dashed border-border px-4 py-3 min-w-[80px] text-text-muted hover:border-accent hover:text-accent transition-all shrink-0"
          >
            <Plus size={16} />
            <span className="text-[10px]">More</span>
          </button>
        </div>
      </div>

      {/* Sub-tabs */}
      <div className="flex items-center gap-0 border-b border-border mb-6">
        {AGENT_TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setAgentTab(tab.id)}
            className={cn(
              "px-3 py-2.5 text-[13px] font-medium transition-colors border-b-2 -mb-px",
              agentTab === tab.id
                ? "border-text-primary text-text-primary"
                : "border-transparent text-text-muted hover:text-text-secondary",
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {agentTab === "dashboard" && (
        <div className="space-y-6">
          {/* Latest Run */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-[14px] font-semibold text-text-primary">Latest Run</h3>
              <button type="button" className="text-[12px] text-text-muted hover:text-text-primary transition-colors">View details &rarr;</button>
            </div>
            <div className="rounded-xl border border-border bg-surface-1 px-5 py-4">
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="outline" size="xs" className="bg-[var(--color-success)]/15 text-[var(--color-success)] border-0">succeeded</Badge>
                <span className="text-[12px] text-text-muted font-mono">a3f8c2e1</span>
                <Badge variant="outline" size="xs">Timer</Badge>
                <span className="ml-auto text-[11px] text-text-muted">21m ago</span>
              </div>
              <div className="text-[13px] text-text-primary">Inbox empty. No action needed this cycle.</div>
            </div>
          </div>

          {/* Stats grid */}
          <div className="grid grid-cols-4 gap-3">
            {[
              { title: "Run Activity", subtitle: "Last 14 days" },
              { title: "Issues by Priority", subtitle: "Last 14 days" },
              { title: "Issues by Status", subtitle: "Last 14 days" },
              { title: "Success Rate", subtitle: "Last 14 days" },
            ].map((stat) => (
              <div key={stat.title} className="rounded-xl border border-border bg-surface-1 px-4 py-3">
                <div className="text-[12px] font-medium text-text-primary">{stat.title}</div>
                <div className="text-[10px] text-text-muted mb-3">{stat.subtitle}</div>
                <div className="h-16 flex items-end gap-1">
                  {[30, 45, 20, 60, 35, 50, 70].map((h, i) => (
                    <div key={i} className="flex-1 rounded-sm bg-[var(--color-success)]" style={{ height: `${h}%` }} />
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Costs */}
          <div>
            <h3 className="text-[14px] font-semibold text-text-primary mb-3">Costs</h3>
            <div className="grid grid-cols-4 gap-3">
              {[
                { label: "Input tokens", value: "42" },
                { label: "Output tokens", value: "8.4k" },
                { label: "Cached tokens", value: "872.6k" },
                { label: "Total cost", value: "$0.00" },
              ].map((item) => (
                <div key={item.label} className="rounded-xl border border-border bg-surface-1 px-4 py-3">
                  <div className="text-[11px] text-text-muted mb-1">{item.label}</div>
                  <div className="text-[18px] font-semibold text-text-primary">{item.value}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {agentTab === "instructions" && (
        <div className="space-y-4">
          <div className="flex gap-4">
            {/* Files list */}
            <div className="w-[240px] shrink-0 rounded-xl border border-border bg-surface-1 overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 border-b border-border">
                <span className="text-[13px] font-semibold text-text-primary">Files</span>
                <button type="button" className="text-text-muted hover:text-text-primary"><Plus size={14} /></button>
              </div>
              {[
                { name: "AGENTS.md", size: "1480B" },
                { name: "HEARTBEAT.md", size: "3005B" },
                { name: "SOUL.md", size: "2590B" },
                { name: "TOOLS.md", size: "86B" },
              ].map((file) => (
                <div key={file.name} className="flex items-center justify-between px-4 py-2.5 hover:bg-surface-2 cursor-pointer transition-colors">
                  <div className="flex items-center gap-2">
                    <ScrollText size={13} className="text-text-muted" />
                    <span className="text-[12px] text-text-primary">{file.name}</span>
                  </div>
                  {file.badge ? (
                    <Badge variant="outline" size="xs" className="text-[9px]">{file.badge}</Badge>
                  ) : (
                    <span className="text-[10px] text-text-muted">{file.size}</span>
                  )}
                </div>
              ))}
            </div>
            {/* File preview */}
            <div className="flex-1 rounded-xl border border-border bg-surface-1 overflow-hidden">
              <div className="px-5 py-3 border-b border-border">
                <div className="text-[13px] font-semibold text-text-primary">AGENTS.md</div>
                <div className="text-[11px] text-text-muted">markdown file</div>
              </div>
              <div className="px-5 py-4 text-[13px] text-text-primary font-mono leading-relaxed whitespace-pre-wrap bg-surface-0">
{`You are the OpenClaw agent. Your job is to manage
conversations across channels and coordinate with
other agents.

Your home directory is $AGENT_HOME. Everything
personal to you — life, memory, knowledge — lives
there.

## Capabilities

1. Route messages to appropriate agents
2. Manage channel connections (Feishu, Slack, etc.)
3. Coordinate multi-agent workflows
4. Monitor conversation health & SLA`}
              </div>
            </div>
          </div>
        </div>
      )}

      {agentTab === "configuration" && (
        <div className="space-y-8 max-w-[640px]">
          {/* Identity */}
          <div>
            <h3 className="text-[14px] font-semibold text-text-primary mb-4">Identity</h3>
            <div className="space-y-4">
              <div>
                <label className="text-[12px] font-medium text-text-muted block mb-1.5">Name</label>
                <Input defaultValue="OpenClaw" className="h-9 text-[13px]" />
              </div>
              <div>
                <label className="text-[12px] font-medium text-text-muted block mb-1.5">Title</label>
                <Input placeholder="e.g. VP of Engineering" className="h-9 text-[13px]" />
              </div>
              <div>
                <label className="text-[12px] font-medium text-text-muted block mb-1.5">Capabilities</label>
                <Input placeholder="Describe what this agent can do..." className="h-9 text-[13px]" />
              </div>
            </div>
          </div>

          {/* Code Agent Harness */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-[14px] font-semibold text-text-primary">Code Agent Harness</h3>
                <p className="text-[11px] text-text-muted mt-0.5">Select which Code Agent runs inside OpenClaw. Default is Pi.</p>
              </div>
              <Button type="button" variant="outline" size="xs">{t("ws.agents.testNow")}</Button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-[12px] font-medium text-text-muted block mb-1.5">Code Agent</label>
                <Select defaultValue="pi">
                  <SelectTrigger className="w-full h-9 text-[13px]"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {[
                      { value: "pi", label: "Pi", desc: "Default — built-in Code Agent" },
                      { value: "claude-code", label: "Claude Code", desc: "Anthropic — local CLI agent" },
                      { value: "codex", label: "Codex", desc: "OpenAI — local CLI agent" },
                      { value: "cursor", label: "Cursor", desc: "Cursor — local IDE agent" },
                      { value: "gemini-cli", label: "Gemini CLI", desc: "Google — local CLI agent" },
                      { value: "opencode", label: "OpenCode", desc: "Multi-provider local agent" },
                      { value: "hermes", label: "Hermes Agent", desc: "Multi-provider local agent" },
                    ].map((agent) => (
                      <SelectPrimitive.Item key={agent.value} value={agent.value} className="relative flex cursor-pointer select-none items-center rounded-lg py-2 pl-3 pr-8 text-[12px] outline-none hover:bg-surface-2 focus:bg-surface-2">
                        <SelectPrimitive.ItemText>
                          <span className="flex items-center gap-2">
                            <span className="font-medium">{agent.label}</span>
                            <span className="text-[10px] text-text-muted">{agent.desc}</span>
                          </span>
                        </SelectPrimitive.ItemText>
                        <span className="absolute right-2 flex items-center"><SelectPrimitive.ItemIndicator><Check size={12} /></SelectPrimitive.ItemIndicator></span>
                      </SelectPrimitive.Item>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Permissions & Configuration */}
          <div>
            <h3 className="text-[14px] font-semibold text-text-primary mb-4">Permissions & Configuration</h3>
            <div className="space-y-4">
              <div>
                <label className="text-[12px] font-medium text-text-muted block mb-1.5">Command</label>
                <Input defaultValue="claude" className="h-9 text-[13px] font-mono" />
              </div>
              <AgentModelSelect t={t} onGoToProviders={onGoToProviders} />
              <div>
                <label className="text-[12px] font-medium text-text-muted block mb-1.5">Thinking effort</label>
                <Select defaultValue="auto">
                  <SelectTrigger className="w-full h-9 text-[13px]"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {["Auto", "Low", "Medium", "High"].map((v) => (
                      <SelectPrimitive.Item key={v} value={v.toLowerCase()} className="relative flex cursor-pointer select-none items-center rounded-lg py-2 pl-3 pr-8 text-[12px] outline-none hover:bg-surface-2 focus:bg-surface-2">
                        <SelectPrimitive.ItemText>{v}</SelectPrimitive.ItemText>
                        <span className="absolute right-2 flex items-center"><SelectPrimitive.ItemIndicator><Check size={12} /></SelectPrimitive.ItemIndicator></span>
                      </SelectPrimitive.Item>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="text-[12px] font-medium text-text-muted">Enable Chrome</div>
                  <div className="text-[10px] text-text-muted mt-0.5">Allow the code agent to control a browser</div>
                </div>
                <Switch defaultChecked={false} />
              </div>
            </div>
          </div>
        </div>
      )}

      {agentTab === "skills" && (
        <div className="text-[13px] text-text-muted py-12 text-center">No skills configured yet.</div>
      )}
    </div>
  );
}

const ADAPTER_TYPES = [
  { id: "claude-code", name: "Claude Code", descKey: "ws.agents.desc.claudeCode", icon: Sparkles, recommended: true },
  { id: "codex", name: "Codex", descKey: "ws.agents.desc.codex", icon: Code2, recommended: true },
  { id: "gemini-cli", name: "Gemini CLI", descKey: "ws.agents.desc.geminiCli", icon: Diamond },
  { id: "opencode", name: "OpenCode", descKey: "ws.agents.desc.opencode", icon: Smartphone },
  { id: "pi", name: "Pi", descKey: "ws.agents.desc.pi", icon: Terminal },
  { id: "cursor", name: "Cursor", descKey: "ws.agents.desc.cursor", icon: MousePointer2 },
  { id: "hermes", name: "Hermes Agent", descKey: "ws.agents.desc.hermes", icon: Bot },
];

function AgentAdapterGrid({ t }: { t: (key: string) => string }) {
  const [selected, setSelected] = useState("claude-code");
  const [expanded, setExpanded] = useState(false);

  const recommended = ADAPTER_TYPES.filter((a) => a.recommended);
  const more = ADAPTER_TYPES.filter((a) => !a.recommended);

  return (
    <div className="space-y-3">
      {/* Recommended */}
      <div className="grid grid-cols-2 gap-2">
        {recommended.map((adapter) => {
          const Icon = adapter.icon;
          const isActive = adapter.id === selected;
          return (
            <button
              key={adapter.id}
              type="button"
              onClick={() => setSelected(adapter.id)}
              className={cn(
                "relative flex flex-col items-center gap-1.5 rounded-xl border px-4 py-4 text-center transition-all",
                isActive
                  ? "border-accent bg-accent/5 shadow-sm"
                  : "border-border bg-surface-1 hover:border-border hover:bg-surface-2",
              )}
            >
              <Badge
                size="xs"
                className="absolute -top-1.5 right-2 bg-success text-white text-[8px] px-1.5 py-0"
              >
                {t("ws.agents.recommended")}
              </Badge>
              <Icon size={20} className={isActive ? "text-accent" : "text-text-secondary"} />
              <div className="text-[12px] font-medium text-text-primary">{adapter.name}</div>
              <div className="text-[10px] text-text-muted">{t(adapter.descKey)}</div>
            </button>
          );
        })}
      </div>

      {/* More Adapter Types toggle */}
      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        className="flex items-center gap-1 text-[11px] text-text-muted hover:text-text-secondary transition-colors mx-auto"
      >
        <ChevronDown
          size={12}
          className={cn("transition-transform", expanded && "rotate-180")}
        />
        {t("ws.agents.moreAdapters")}
      </button>

      {/* More adapters */}
      {expanded && (
        <div className="grid grid-cols-2 gap-2">
          {more.map((adapter) => {
            const Icon = adapter.icon;
            const isActive = adapter.id === selected;
            return (
              <button
                key={adapter.id}
                type="button"
                onClick={() => !adapter.dimmed && setSelected(adapter.id)}
                className={cn(
                  "flex flex-col items-center gap-1.5 rounded-xl border px-4 py-4 text-center transition-all",
                  adapter.dimmed
                    ? "border-border/50 bg-surface-1 opacity-50 cursor-not-allowed"
                    : isActive
                      ? "border-accent bg-accent/5 shadow-sm"
                      : "border-border bg-surface-1 hover:border-border hover:bg-surface-2",
                )}
              >
                <Icon
                  size={20}
                  className={
                    adapter.dimmed
                      ? "text-text-muted"
                      : isActive
                        ? "text-accent"
                        : "text-text-secondary"
                  }
                />
                <div className="text-[12px] font-medium text-text-primary">{adapter.name}</div>
                <div className="text-[10px] text-text-muted">{t(adapter.descKey)}</div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
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
  const [showAddAgent, setShowAddAgent] = useState(false);
  const [activeHarnessMain, setActiveHarnessMain] = useState("claude-code");
  const [selectedInstructionFile, setSelectedInstructionFile] = useState("AGENTS.md");
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
  const baseProviders = providers.filter(
    (provider) => provider.id !== "custom-openai" && provider.id !== "custom-anthropic",
  );
  const [customProviders, setCustomProviders] = useState<ProviderListItem[]>([]);
  const [customProviderDrafts, setCustomProviderDrafts] = useState<CustomProviderDraft[]>([]);
  const [modelOverrides, setModelOverrides] = useState<Record<string, ProviderModel[]>>({});
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
  const [providerSearch, setProviderSearch] = useState("");
  const [showAddModelDialog, setShowAddModelDialog] = useState(false);
  const [addModelSearch, setAddModelSearch] = useState("");
  const getCustomTemplateLabel = useCallback(
    (templateId: CustomProviderTemplateId) =>
      templateId === "custom-openai"
        ? t("ws.settings.customProviderCompatibilityOpenAI")
        : t("ws.settings.customProviderCompatibilityAnthropic"),
    [t],
  );
  const combinedProviders: ProviderListItem[] = [
    ...baseProviders.map((p) =>
      modelOverrides[p.id] ? { ...p, models: modelOverrides[p.id] } : p,
    ),
    ...customProviders.map((p) =>
      modelOverrides[p.id] ? { ...p, models: modelOverrides[p.id] } : p,
    ),
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
  const filteredProviders = providerSearch.trim()
    ? combinedProviders.filter((p) => {
        const q = providerSearch.toLowerCase().trim();
        return (
          p.name.toLowerCase().includes(q) ||
          p.models.some((m) => m.name.toLowerCase().includes(q))
        );
      })
    : combinedProviders;
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
      models: getDefaultModelsForCustomProvider(draft.providerTemplateId),
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

  const getProviderModels = (providerId: string): ProviderModel[] => {
    const p = combinedProviders.find((x) => x.id === providerId);
    return p?.models ?? [];
  };

  const removeModelFromProvider = (providerId: string, modelId: string) => {
    const current = getProviderModels(providerId);
    setModelOverrides((prev) => ({
      ...prev,
      [providerId]: current.filter((m) => m.id !== modelId),
    }));
    if (selectedModelId === modelId) setSelectedModelId(null);
  };

  const addModelToProvider = (providerId: string, model: ProviderModel) => {
    const current = getProviderModels(providerId);
    setModelOverrides((prev) => ({
      ...prev,
      [providerId]: [...current, { ...model, enabled: true }],
    }));
    setShowAddModelDialog(false);
    setAddModelSearch("");
  };

  const addCustomModelToProvider = (providerId: string, modelId: string) => {
    const model: ProviderModel = {
      id: modelId,
      name: modelId,
      enabled: true,
      contextWindow: "128K",
      releasedAt: new Date().toISOString().slice(0, 10),
      inputPrice: "Custom",
      outputPrice: "Custom",
    };
    addModelToProvider(providerId, model);
  };

  const sidebarItems: { id: SettingsTab; labelKey: string; icon: typeof Globe }[] = [
    { id: "general", labelKey: "ws.settings.tab.general", icon: Monitor },
    { id: "providers", labelKey: "ws.settings.tab.providers", icon: Globe },
    { id: "harness", labelKey: "ws.settings.tab.harness", icon: Bot },
    { id: "instruction", labelKey: "ws.settings.tab.instruction", icon: FileText },
  ];

  return (
    <div className="flex h-full">
      {/* ── Left Sidebar ── */}
      <div className="w-[200px] shrink-0 border-r border-border bg-[#fcfcfb] flex flex-col">
        <div className="px-4 pt-4 pb-2">
          <span className="text-[14px] font-semibold text-text-primary">{t("ws.settings.title")}</span>
        </div>

        <div className="flex-1 overflow-y-auto px-2 pb-4">
          <div>
            {sidebarItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setSettingsTab(item.id)}
                  className={cn(
                    "w-full flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-left transition-colors",
                    settingsTab === item.id ? "bg-surface-2 font-medium" : "hover:bg-surface-2",
                  )}
                >
                  <Icon size={14} className="text-text-secondary shrink-0" />
                  <span className="text-[12px] text-text-primary">{t(item.labelKey)}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Main Content ── */}
      <div className="flex-1 overflow-y-auto">
        <div className="px-6 pt-4 pb-8">

        <Tabs
          value={settingsTab}
          onValueChange={(value) => setSettingsTab(value as SettingsTab)}
          className="w-full"
        >
          <TabsList className="sr-only">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="agents">Agents</TabsTrigger>
            <TabsTrigger value="providers">Providers</TabsTrigger>
            <TabsTrigger value="harness">Harness</TabsTrigger>
            <TabsTrigger value="instruction">Instruction</TabsTrigger>
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

          {/* ── Agents Tab (Agent detail) ── */}
          <TabsContent value="agents" className="mt-0">
            <AgentDetailView t={t} onGoToProviders={() => setSettingsTab("providers")} />

            {/* Add Agent Dialog */}
            <Dialog open={showAddAgent} onOpenChange={setShowAddAgent}>
              <DialogContent size="lg" className="max-h-[85vh] flex flex-col">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <Bot size={16} />
                    {t("ws.agents.title")}
                  </DialogTitle>
                  <DialogDescription>{t("ws.agents.subtitle")}</DialogDescription>
                </DialogHeader>
                <DialogBody className="overflow-y-auto flex-1 space-y-5">
                  {/* Agent name */}
                  <div>
                    <label className="text-[12px] font-medium text-text-primary block mb-1.5">
                      {t("ws.agents.name")}
                    </label>
                    <Input placeholder={t("ws.agents.namePlaceholder")} className="h-9 text-[13px]" defaultValue="" />
                  </div>

                  {/* Adapter type */}
                  <div>
                    <label className="text-[12px] font-medium text-text-primary block mb-2">
                      {t("ws.agents.adapterType")}
                    </label>
                    <AgentAdapterGrid t={t} />
                  </div>

                  {/* Model */}
                  <AgentModelSelect t={t} onGoToProviders={() => { setShowAddAgent(false); setSettingsTab("providers"); }} />

                  {/* Adapter environment check */}
                  <div className="rounded-lg border border-border bg-surface-2/50 px-4 py-3 flex items-center justify-between gap-4">
                    <div>
                      <div className="text-[13px] font-medium text-text-primary">
                        {t("ws.agents.envCheck")}
                      </div>
                      <div className="text-[11px] text-text-muted mt-0.5">
                        {t("ws.agents.envCheckDesc")}
                      </div>
                    </div>
                    <Button type="button" variant="outline" size="sm" className="shrink-0">
                      {t("ws.agents.testNow")}
                    </Button>
                  </div>
                </DialogBody>
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setShowAddAgent(false)}>
                    {t("ws.common.cancel") || "Cancel"}
                  </Button>
                  <Button type="button" onClick={() => setShowAddAgent(false)}>
                    {t("ws.agents.addAgent")}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </TabsContent>

          {/* ── Harness Tab ── */}
          <TabsContent value="harness" className="mt-0">
            <div className="space-y-6">
              <PageHeader
                title={t("ws.settings.tab.harness")}
                description={t("ws.harness.subtitle")}
              />
              <div className="space-y-2">
                {HARNESS_OPTIONS.map((h) => {
                  const Icon = h.icon;
                  const isActive = h.id === activeHarnessMain;
                  return (
                    <button
                      key={h.id}
                      type="button"
                      onClick={() => setActiveHarnessMain(h.id)}
                      className={cn(
                        "w-full flex items-start gap-4 rounded-xl border p-4 text-left transition-all",
                        isActive
                          ? "border-[var(--color-accent)] bg-[hsl(var(--accent)/0.04)] shadow-[0_0_0_1px_var(--color-accent)]"
                          : "border-border bg-white hover:border-border-hover hover:bg-surface-1",
                      )}
                    >
                      <div className={cn(
                        "flex items-center justify-center w-10 h-10 rounded-xl shrink-0 mt-0.5",
                        isActive ? "bg-[hsl(var(--accent)/0.1)]" : "bg-surface-1",
                      )}>
                        <Icon size={20} className={isActive ? "text-[var(--color-accent)]" : "text-text-secondary"} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className={cn("text-[13px] font-semibold", isActive ? "text-[var(--color-accent)]" : "text-text-primary")}>{h.name}</span>
                          <span className="text-[11px] text-text-muted">{t(h.descKey)}</span>
                          {isActive && (
                            <span className="ml-auto text-[10px] font-medium text-[var(--color-accent)] bg-[hsl(var(--accent)/0.1)] px-2 py-0.5 rounded-full shrink-0">{t("ws.harness.current")}</span>
                          )}
                        </div>
                        <p className="text-[12px] text-text-muted mt-1 leading-relaxed">{t(h.advantageKey)}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </TabsContent>

          {/* ── Instruction Tab ── */}
          <TabsContent value="instruction" className="mt-0">
            <div className="space-y-6">
              <PageHeader
                title={t("ws.settings.tab.instruction")}
                description={t("ws.settings.instruction.readonly")}
              />
              <div className="overflow-hidden rounded-2xl border border-border bg-white shadow-[0_1px_2px_rgba(15,23,42,0.03)]">
                <div className="flex min-h-[500px]">
                  {/* File list */}
                  <div className="w-[240px] shrink-0 border-r border-border bg-[#fcfcfb]">
                    <div className="flex items-center justify-between px-4 pt-3 pb-2">
                      <span className="text-[12px] font-semibold text-text-primary">{t("ws.settings.instruction.files")}</span>
                    </div>
                    <div className="px-2 pb-3 space-y-0.5">
                      {(
                        [
                          { name: "AGENTS.md", size: "1480B" },
                          { name: "BOOTSTRAP.md", size: "1820B" },
                          { name: "HEARTBEAT.md", size: "3005B" },
                          { name: "IDENTITY.md", size: "1240B" },
                          { name: "SOUL.md", size: "2590B" },
                          { name: "TOOLS.md", size: "86B" },
                          { name: "USER.md", size: "960B" },
                        ] as const
                      ).map((file) => (
                        <button
                          key={file.name}
                          type="button"
                          onClick={() => setSelectedInstructionFile(file.name)}
                          className={cn(
                            "w-full flex items-center gap-2 rounded-lg px-3 py-2 text-left transition-colors",
                            selectedInstructionFile === file.name ? "bg-surface-2" : "hover:bg-surface-1",
                          )}
                        >
                          <ScrollText size={14} className="text-text-muted shrink-0" />
                          <span className="text-[12px] text-text-primary flex-1 truncate">{file.name}</span>
                          {"badge" in file ? (
                            <span className="text-[9px] font-semibold text-[var(--color-accent)] bg-[hsl(var(--accent)/0.1)] px-1.5 py-0.5 rounded">{file.badge}</span>
                          ) : (
                            <span className="text-[10px] text-text-muted tabular-nums">{file.size}</span>
                          )}
                        </button>
                      ))}
                    </div>
                    <div className="px-3 pt-2 pb-3 border-t border-border">
                      <button
                        type="button"
                        onClick={() => openExternal("file:///Users")}
                        className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-[12px] font-medium text-text-secondary hover:bg-surface-1 transition-colors"
                      >
                        <ExternalLink size={14} />
                        <span>{t("ws.settings.instruction.openLocal")}</span>
                      </button>
                    </div>
                  </div>
                  {/* File preview */}
                  <div className="flex-1 p-5 overflow-y-auto">
                    <div className="mb-3">
                      <h3 className="text-[14px] font-semibold text-text-primary">{selectedInstructionFile}</h3>
                      <span className="text-[11px] text-text-muted">markdown file</span>
                    </div>
                    <pre className="text-[13px] font-mono whitespace-pre-wrap text-text-secondary leading-relaxed bg-surface-0 rounded-lg p-4 border border-border">
{selectedInstructionFile === "AGENTS.md" ? `You are the OpenClaw agent. Your job is to manage
conversations across channels and coordinate with
other agents.

Your home directory is $AGENT_HOME. Everything
personal to you — life, memory, knowledge — lives
there.

## Capabilities

1. Route messages to appropriate agents
2. Manage channel connections (Feishu, Slack, etc.)
3. Coordinate multi-agent workflows
4. Monitor conversation health & SLA` : selectedInstructionFile === "BOOTSTRAP.md" ? `# Bootstrap

Run once on first launch to initialize the agent.

## Steps
1. Load identity from IDENTITY.md
2. Read soul configuration from SOUL.md
3. Register available tools from TOOLS.md
4. Connect to assigned channels
5. Start heartbeat loop` : selectedInstructionFile === "HEARTBEAT.md" ? `# Heartbeat Configuration

Schedule: every 15 minutes
Mode: check-and-act

## On each heartbeat:
1. Check inbox for new messages
2. Process pending tasks
3. Report status to dashboard` : selectedInstructionFile === "IDENTITY.md" ? `# Identity

name: OpenClaw
role: AI Agent Orchestrator
version: 1.0.0

## Description
The primary orchestration agent responsible for
managing cross-channel conversations and delegating
tasks to specialized sub-agents.

## Scope
- All connected IM channels
- Task routing and delegation
- Status monitoring` : selectedInstructionFile === "SOUL.md" ? `# Soul — Core Identity

You are a professional AI assistant.
You communicate clearly and efficiently.
You prioritize user goals above all else.

## Personality Traits
- Direct and concise
- Proactive problem solver
- Respectful of user time` : selectedInstructionFile === "USER.md" ? `# User Preferences

## Communication
- Language: auto-detect from user input
- Tone: professional but friendly
- Response length: concise by default

## Workflow
- Always confirm before destructive actions
- Summarize long outputs
- Proactively suggest next steps` : `# Tools

Available tools:
- file_read
- file_write
- shell_exec`}
                    </pre>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* ── Providers Tab ── */}
          <TabsContent value="providers" className="mt-0">
            <div className="overflow-hidden rounded-2xl border border-border bg-white shadow-[0_1px_2px_rgba(15,23,42,0.03)]">
              <div className="flex min-h-[600px] max-h-[calc(100vh-220px)]">
                <section className="flex w-[216px] shrink-0 flex-col border-r border-border-subtle bg-[#fcfcfb]">
                  <div className="px-4 pb-2 pt-3 text-[11px] font-semibold uppercase tracking-[0.12em] text-text-tertiary">
                    {t("ws.settings.tab.providers")}
                  </div>
                  <div className="px-2 pb-2">
                    <div className="relative">
                      <Search size={13} className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-text-muted" />
                      <input
                        type="text"
                        value={providerSearch}
                        onChange={(e) => setProviderSearch(e.target.value)}
                        placeholder={t("ws.settings.searchProviders")}
                        className="h-7 w-full rounded-lg border border-border-subtle bg-white pl-7 pr-2 text-[11px] text-text-primary placeholder:text-text-muted outline-none focus:border-accent focus:ring-1 focus:ring-accent/20"
                      />
                    </div>
                  </div>
                  <div className="flex-1 space-y-0.5 overflow-y-auto px-2 pb-3">
                    {filteredProviders.map((p) => {
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
                  </div>
                  <div className="shrink-0 border-t border-border-subtle px-2 py-2">
                    <button
                      type="button"
                      onClick={createCustomProviderDraft}
                      className="flex w-full items-center gap-2 rounded-xl border border-dashed border-border-strong px-3 py-1.5 text-left transition-colors hover:bg-surface-1"
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

                <section className="min-w-0 flex-1 overflow-y-auto bg-white px-6 pb-6 pt-5">
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
                        <div className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-text-tertiary">
                          {t("ws.settings.model")} ({activeProvider.models.length})
                          {activeProvider.id === "nexu" && (
                            <button
                              type="button"
                              onClick={() =>
                                openExternal("https://docs.nexu.io/zh/guide/model-pricing")
                              }
                              className="flex size-4 items-center justify-center text-text-muted transition-colors hover:text-text-primary"
                              title="模型积分消耗说明"
                            >
                              <HelpCircle size={12} />
                            </button>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          {activeProvider.id !== "nexu" && (
                            <button
                              type="button"
                              onClick={() => {
                                setAddModelSearch("");
                                setShowAddModelDialog(true);
                              }}
                              className="inline-flex items-center gap-1 text-[12px] font-medium text-text-secondary transition-colors hover:text-text-primary"
                            >
                              <Plus size={13} />
                              <span>{t("ws.settings.addModel")}</span>
                            </button>
                          )}
                          {activeProvider.id === "nexu" && (
                            <button
                              type="button"
                              className="inline-flex items-center gap-2 text-[12px] font-medium text-text-secondary transition-colors hover:text-text-primary"
                            >
                              <RefreshCw size={14} />
                              <span>{t("ws.settings.refreshModels")}</span>
                            </button>
                          )}
                        </div>
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
                                  "group/model flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left transition-colors",
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
                                <span className="flex min-w-0 flex-1 items-center gap-1.5">
                                  <span className="truncate text-[12px] font-medium text-text-primary">
                                    {model.name}
                                  </span>
                                  {model.tier === "pro" && (
                                    <TierProBadge height={13} className="shrink-0" />
                                  )}
                                  {model.tier === "plus" && (
                                    <TierPlusBadge height={13} className="shrink-0" />
                                  )}
                                  {activeProvider.id === "nexu" && !model.tier && (
                                    <span className="shrink-0 rounded-[4px] bg-gradient-to-r from-[#3DB9CE] to-[#34D399] px-1.5 py-[2px] text-[9px] font-bold text-white">
                                      Unlimited
                                    </span>
                                  )}
                                </span>
                                {activeProvider.id === "nexu" && model.creditsPerConversation ? (
                                  <span className="shrink-0 text-[10px] tabular-nums text-text-tertiary">
                                    ~{model.creditsPerConversation} 积分/次
                                  </span>
                                ) : activeProvider.id !== "nexu" ? (
                                  <span className="shrink-0 text-[10px] tabular-nums text-text-tertiary">
                                    {model.inputPrice.replace(/\.00/g, "").replace(/\/M$/, "")}
                                    {" / "}
                                    {model.outputPrice.replace(/\.00/g, "").replace(/\/M$/, "")}
                                  </span>
                                ) : null}
                                {isActive ? (
                                  <Check size={14} className="shrink-0 text-accent" />
                                ) : null}
                                {activeProvider.id !== "nexu" && (
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      removeModelFromProvider(activeProvider.id, model.id);
                                    }}
                                    className="ml-1 flex size-5 shrink-0 items-center justify-center rounded-md text-text-muted opacity-0 transition-all hover:bg-[var(--color-error)]/10 hover:text-[var(--color-error)] group-hover/model:opacity-100"
                                    title={t("ws.settings.removeModel")}
                                  >
                                    <X size={12} />
                                  </button>
                                )}
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </>
                  ) : null}
                </section>
              </div>

              {/* Add Model Dialog */}
              <Dialog open={showAddModelDialog} onOpenChange={setShowAddModelDialog}>
                <DialogContent size="sm" className="max-h-[70vh] flex flex-col">
                  <DialogHeader>
                    <DialogTitle>{t("ws.settings.addModelTitle")}</DialogTitle>
                    <DialogDescription>{t("ws.settings.addModelDesc")}</DialogDescription>
                  </DialogHeader>
                  <DialogBody className="flex-1 overflow-hidden flex flex-col gap-3">
                    {(() => {
                      const templateId = activeProvider?.isCustom
                        ? (activeProvider.id.startsWith("custom-anthropic") ? "custom-anthropic" : "custom-openai") as "custom-openai" | "custom-anthropic"
                        : null;
                      const catalogue = templateId
                        ? getModelCatalogueForProvider(templateId)
                        : providers.find((p) => p.id === activeProvider?.id)?.models ?? [];
                      const existingIds = new Set(activeProvider?.models.map((m) => m.id) ?? []);
                      const hasCatalogue = catalogue.filter((m) => !existingIds.has(m.id)).length > 0;
                      const q = addModelSearch.toLowerCase().trim();
                      const filtered = catalogue
                        .filter((m) => !existingIds.has(m.id))
                        .filter((m) => !q || m.name.toLowerCase().includes(q) || m.id.toLowerCase().includes(q));

                      if (!hasCatalogue) {
                        /* ── No catalogue: simple manual input ── */
                        return (
                          <div className="space-y-3 py-1">
                            <div>
                              <label className="mb-1.5 block text-[12px] font-medium text-text-secondary">
                                {t("ws.settings.customModelId")}
                              </label>
                              <Input
                                type="text"
                                value={addModelSearch}
                                onChange={(e) => setAddModelSearch(e.target.value)}
                                placeholder="e.g. gpt-4o, claude-sonnet-4-6"
                                className="w-full text-[13px]"
                                autoFocus
                                onKeyDown={(e) => {
                                  if (e.key === "Enter" && addModelSearch.trim() && !existingIds.has(addModelSearch.trim())) {
                                    addCustomModelToProvider(activeProvider.id, addModelSearch.trim());
                                  }
                                }}
                              />
                            </div>
                            <div className="flex justify-end">
                              <Button
                                size="sm"
                                disabled={!addModelSearch.trim() || existingIds.has(addModelSearch.trim())}
                                onClick={() => addCustomModelToProvider(activeProvider.id, addModelSearch.trim())}
                              >
                                {t("ws.settings.addModelConfirm")}
                              </Button>
                            </div>
                          </div>
                        );
                      }

                      /* ── Has catalogue: searchable list + manual fallback ── */
                      return (
                        <>
                          <div className="relative">
                            <Search size={14} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
                            <input
                              type="text"
                              value={addModelSearch}
                              onChange={(e) => setAddModelSearch(e.target.value)}
                              placeholder={t("ws.settings.addModelPlaceholder")}
                              className="h-9 w-full rounded-lg border border-border-subtle bg-white pl-9 pr-3 text-[13px] text-text-primary placeholder:text-text-muted outline-none focus:border-accent focus:ring-1 focus:ring-accent/20"
                              autoFocus
                            />
                          </div>
                          <div className="flex-1 overflow-y-auto -mx-1 px-1 max-h-[320px]">
                            {filtered.length > 0 ? (
                              <div className="space-y-0.5">
                                {filtered.map((model) => (
                                  <button
                                    key={model.id}
                                    type="button"
                                    onClick={() => addModelToProvider(activeProvider.id, model)}
                                    className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left transition-colors hover:bg-surface-1"
                                  >
                                    <span className="flex size-7 shrink-0 items-center justify-center rounded-lg border border-border-subtle bg-white">
                                      <ModelLogo model={model.id} provider={activeProvider.id} size={14} title={model.name} />
                                    </span>
                                    <span className="min-w-0 flex-1">
                                      <span className="block truncate text-[12px] font-medium text-text-primary">{model.name}</span>
                                      <span className="block text-[10px] text-text-tertiary">{model.contextWindow} context</span>
                                    </span>
                                    <span className="shrink-0 text-[10px] tabular-nums text-text-tertiary">
                                      {model.inputPrice.replace(/\.00/g, "").replace(/\/M$/, "")} / {model.outputPrice.replace(/\.00/g, "").replace(/\/M$/, "")}
                                    </span>
                                  </button>
                                ))}
                              </div>
                            ) : q ? (
                              <div className="py-4 text-center text-[12px] text-text-muted">
                                {t("ws.settings.noMatchingModels")}
                              </div>
                            ) : null}
                            {q && !existingIds.has(addModelSearch.trim()) && (
                              <div className={cn(filtered.length > 0 && "mt-1 border-t border-border-subtle pt-2")}>
                                <button
                                  type="button"
                                  onClick={() => addCustomModelToProvider(activeProvider.id, addModelSearch.trim())}
                                  disabled={!addModelSearch.trim()}
                                  className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left transition-colors hover:bg-surface-1 disabled:opacity-40 disabled:pointer-events-none"
                                >
                                  <span className="flex size-7 shrink-0 items-center justify-center rounded-lg border border-dashed border-border-strong bg-white text-text-secondary">
                                    <Plus size={13} />
                                  </span>
                                  <span className="min-w-0 flex-1">
                                    <span className="block truncate text-[12px] font-medium text-text-primary">{addModelSearch.trim()}</span>
                                    <span className="block text-[10px] text-text-tertiary">{t("ws.settings.customModelId")}</span>
                                  </span>
                                </button>
                              </div>
                            )}
                          </div>
                        </>
                      );
                    })()}
                  </DialogBody>
                </DialogContent>
              </Dialog>
            </div>
          </TabsContent>
        </Tabs>
        </div>
      </div>
    </div>
  );
}
