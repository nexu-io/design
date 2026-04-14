import {
  Badge,
  Button,
  Input,
  PageHeader,
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
  Switch,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Textarea,
} from "@nexu-design/ui-web";
import * as SelectPrimitive from "@radix-ui/react-select";
import {
  ArrowUpRight,
  BookOpen,
  Check,
  Globe,
  HelpCircle,
  Plus,
  RefreshCw,
  Shield,
  Sparkles,
  Trash2,
  User,
} from "lucide-react";
import { useState } from "react";

const HARNESS_AGENTS = [
  { id: "claude-sonnet", name: "Claude Sonnet", model: "claude-sonnet-4-5", provider: "anthropic", description: "General purpose assistant", capabilities: ["writing", "analysis", "code"], isDefault: true },
  { id: "claude-code", name: "Claude Code", model: "claude-code", provider: "anthropic", description: "Autonomous coding agent", capabilities: ["code", "debugging", "devops"] },
  { id: "deepseek-v3", name: "DeepSeek V3", model: "deepseek-v3-0324", provider: "nexu", description: "Cost-efficient reasoning", capabilities: ["analysis", "math", "code"] },
  { id: "gpt-4o", name: "GPT-4o", model: "gpt-4o", provider: "openai", description: "Multimodal understanding", capabilities: ["writing", "vision", "code"] },
  { id: "gemini-pro", name: "Gemini 2.5 Pro", model: "gemini-2.5-pro", provider: "google", description: "Long context reasoning", capabilities: ["research", "analysis", "code"] },
];

const PROVIDERS = [
  { id: "anthropic", name: "Anthropic", models: ["claude-sonnet-4-5", "claude-opus-4", "claude-haiku-4-5", "claude-code"] },
  { id: "openai", name: "OpenAI", models: ["gpt-4o", "gpt-4o-mini", "o3"] },
  { id: "google", name: "Google", models: ["gemini-2.5-pro", "gemini-2.5-flash"] },
  { id: "nexu", name: "Nexu (Proxy)", models: ["deepseek-v3-0324", "deepseek-r1"] },
];

const CAPABILITY_OPTIONS = ["writing", "analysis", "code", "research", "debugging", "devops", "math", "reasoning", "vision"];

function SettingRow({ label, description, children }: { label: string; description?: string; children: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-4 py-3">
      <div>
        <div className="text-[13px] font-medium text-text-primary">{label}</div>
        {description && <div className="text-[11px] text-text-muted mt-0.5">{description}</div>}
      </div>
      <div className="shrink-0">{children}</div>
    </div>
  );
}

function SettingSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-6">
      <div className="text-[11px] font-bold text-text-muted uppercase tracking-wider mb-2">{title}</div>
      <div className="divide-y divide-border">{children}</div>
    </div>
  );
}

function GeneralTab() {
  const [launchAtLogin, setLaunchAtLogin] = useState(true);
  const [showInDock, setShowInDock] = useState(true);
  const [analytics, setAnalytics] = useState(true);

  return (
    <>
      <SettingSection title="账户">
        <div className="flex items-center gap-3 py-3">
          <div className="h-9 w-9 rounded-full bg-surface-3 flex items-center justify-center">
            <User size={16} className="text-text-muted" />
          </div>
          <div className="flex-1">
            <div className="text-[13px] font-medium text-text-primary">Tom</div>
            <div className="text-[11px] text-text-muted">tom@nexu.ai</div>
          </div>
          <Button type="button" variant="outline" size="xs">退出登录</Button>
        </div>
      </SettingSection>
      <SettingSection title="行为">
        <SettingRow label="开机启动" description="登录时自动启动 Nexu">
          <Switch checked={launchAtLogin} onCheckedChange={setLaunchAtLogin} />
        </SettingRow>
        <SettingRow label="Dock 显示" description="在 macOS Dock 显示图标">
          <Switch checked={showInDock} onCheckedChange={setShowInDock} />
        </SettingRow>
      </SettingSection>
      <SettingSection title="数据与隐私">
        <SettingRow label="使用分析" description="帮助我们改进产品">
          <Switch checked={analytics} onCheckedChange={setAnalytics} />
        </SettingRow>
      </SettingSection>
      <SettingSection title="关于">
        <SettingRow label="版本" description="Nexu Demo v0.2.0">
          <Button type="button" variant="outline" size="xs"><RefreshCw size={12} />检查更新</Button>
        </SettingRow>
        <div className="flex items-center gap-4 py-3">
          {[
            { label: "文档", icon: BookOpen },
            { label: "帮助", icon: HelpCircle },
            { label: "隐私政策", icon: Shield },
          ].map((link) => (
            <button key={link.label} type="button" className="flex items-center gap-1 text-[11px] text-text-secondary hover:text-text-primary transition-colors">
              <link.icon size={12} />{link.label}<ArrowUpRight size={10} className="text-text-muted" />
            </button>
          ))}
        </div>
      </SettingSection>
    </>
  );
}

function AgentsTab() {
  const [selectedId, setSelectedId] = useState(HARNESS_AGENTS[0].id);
  const selected = HARNESS_AGENTS.find((a) => a.id === selectedId) ?? HARNESS_AGENTS[0];
  const [name, setName] = useState(selected.name);
  const [provider, setProvider] = useState(selected.provider);
  const [model, setModel] = useState(selected.model);
  const [description, setDescription] = useState(selected.description);
  const [isDefault, setIsDefault] = useState(selected.isDefault ?? false);
  const [capabilities, setCapabilities] = useState<string[]>(selected.capabilities);

  const handleSelect = (id: string) => {
    const a = HARNESS_AGENTS.find((x) => x.id === id);
    if (!a) return;
    setSelectedId(id);
    setName(a.name);
    setProvider(a.provider);
    setModel(a.model);
    setDescription(a.description);
    setIsDefault(a.isDefault ?? false);
    setCapabilities(a.capabilities);
  };

  const currentProvider = PROVIDERS.find((p) => p.id === provider);

  return (
    <div className="flex gap-0 -mx-4">
      {/* Agent list */}
      <div className="w-[200px] shrink-0 border-r border-border pr-0">
        <div className="px-3 py-2 text-[11px] font-bold text-text-muted uppercase tracking-wider">已配置的 Agents</div>
        <div className="space-y-0.5 px-2">
          {HARNESS_AGENTS.map((a) => (
            <button
              key={a.id}
              type="button"
              className={`w-full flex items-center gap-2 px-2.5 py-2 rounded-lg text-left transition-colors ${a.id === selectedId ? "bg-surface-2" : "hover:bg-surface-2"}`}
              onClick={() => handleSelect(a.id)}
            >
              <Sparkles size={13} className="text-text-muted shrink-0" />
              <div className="min-w-0 flex-1">
                <div className="text-[12px] font-medium text-text-primary truncate">{a.name}</div>
                <div className="text-[10px] text-text-muted truncate">{a.model}</div>
              </div>
              {a.isDefault && <Badge variant="outline" size="xs" className="text-[8px] shrink-0">默认</Badge>}
            </button>
          ))}
        </div>
        <div className="px-2 pt-2">
          <Button type="button" variant="ghost" size="sm" className="w-full justify-start border border-dashed border-border text-text-muted">
            <Plus size={14} />添加 Agent
          </Button>
        </div>
      </div>

      {/* Agent detail */}
      <div className="flex-1 px-5 py-2">
        <div className="text-[14px] font-medium text-text-primary mb-4">{selected.name}</div>
        <div className="space-y-4">
          <div>
            <label className="text-[12px] font-medium text-text-primary block mb-1">名称</label>
            <Input value={name} onChange={(e) => setName(e.target.value)} className="h-8 text-[13px]" />
          </div>
          <div>
            <label className="text-[12px] font-medium text-text-primary block mb-1">Provider</label>
            <Select value={provider} onValueChange={setProvider}>
              <SelectTrigger className="w-full h-8 text-[12px]"><SelectValue /></SelectTrigger>
              <SelectContent>
                {PROVIDERS.map((p) => (
                  <SelectPrimitive.Item key={p.id} value={p.id} className="relative flex cursor-pointer select-none items-center rounded-lg py-2 pl-3 pr-8 text-[12px] outline-none hover:bg-surface-2 focus:bg-surface-2">
                    <SelectPrimitive.ItemText>{p.name}</SelectPrimitive.ItemText>
                    <span className="absolute right-2 flex items-center"><SelectPrimitive.ItemIndicator><Check size={12} /></SelectPrimitive.ItemIndicator></span>
                  </SelectPrimitive.Item>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-[12px] font-medium text-text-primary block mb-1">Model</label>
            <Select value={model} onValueChange={setModel}>
              <SelectTrigger className="w-full h-8 text-[12px]"><SelectValue /></SelectTrigger>
              <SelectContent>
                {(currentProvider?.models ?? []).map((m) => (
                  <SelectPrimitive.Item key={m} value={m} className="relative flex cursor-pointer select-none items-center rounded-lg py-2 pl-3 pr-8 text-[12px] font-mono outline-none hover:bg-surface-2 focus:bg-surface-2">
                    <SelectPrimitive.ItemText>{m}</SelectPrimitive.ItemText>
                    <span className="absolute right-2 flex items-center"><SelectPrimitive.ItemIndicator><Check size={12} /></SelectPrimitive.ItemIndicator></span>
                  </SelectPrimitive.Item>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-[12px] font-medium text-text-primary block mb-1">描述</label>
            <Textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={2} className="text-[13px]" />
          </div>
          <div>
            <label className="text-[12px] font-medium text-text-primary block mb-1.5">能力标签</label>
            <div className="flex flex-wrap gap-1.5">
              {CAPABILITY_OPTIONS.map((cap) => {
                const active = capabilities.includes(cap);
                return (
                  <button
                    key={cap}
                    type="button"
                    className={`px-2 py-1 rounded-md text-[11px] border transition-colors ${active ? "bg-accent/10 border-accent/30 text-accent" : "bg-surface-2 border-border text-text-muted hover:text-text-secondary"}`}
                    onClick={() => setCapabilities((prev) => active ? prev.filter((c) => c !== cap) : [...prev, cap])}
                  >
                    {cap}
                  </button>
                );
              })}
            </div>
          </div>
          <div className="flex items-center justify-between py-2">
            <div>
              <div className="text-[12px] font-medium text-text-primary">设为默认</div>
              <div className="text-[10px] text-text-muted">新对话默认使用此 Agent</div>
            </div>
            <Switch checked={isDefault} onCheckedChange={setIsDefault} />
          </div>
          <div className="flex items-center justify-between pt-2 border-t border-border">
            <Button type="button" variant="destructive" size="xs"><Trash2 size={12} />删除 Agent</Button>
            <Button type="button" size="sm">保存</Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SettingsPage() {
  return (
    <div className="flex-1 overflow-y-auto">
      <div className="max-w-[800px] mx-auto px-4 sm:px-6 pt-2 pb-6 sm:pb-8">
        <PageHeader title="设置" className="pb-6" />
        <Tabs defaultValue="agents">
          <TabsList className="mb-6">
            <TabsTrigger value="general">通用</TabsTrigger>
            <TabsTrigger value="agents">Agents</TabsTrigger>
          </TabsList>
          <TabsContent value="general"><GeneralTab /></TabsContent>
          <TabsContent value="agents"><AgentsTab /></TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
