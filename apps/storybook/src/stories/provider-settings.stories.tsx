import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  FolderOpen,
  Globe,
  House,
  Languages,
  LogOut,
  MessageCircle,
  RefreshCw,
  Settings,
  Sparkles,
  Star,
  Wrench,
} from "lucide-react";
import { useMemo, useState } from "react";

import { Button, ProviderLogo, cn } from "@nexu-design/ui-web";

type ModelEntry = {
  id: string;
  iconProvider: string;
  label: string;
};

type ProviderEntry = {
  detailName?: string;
  id: string;
  modelCount: number;
  models: ModelEntry[];
  name: string;
  sidebarCount?: number;
};

const nexuModels: ModelEntry[] = [
  { id: "claude-opus-4-6", iconProvider: "anthropic", label: "claude-opus-4-6" },
  { id: "claude-sonnet-4-6", iconProvider: "anthropic", label: "claude-sonnet-4-6" },
  { id: "deepseek-v3.2", iconProvider: "deepseek", label: "deepseek-v3.2" },
  { id: "gemini-2.5-flash", iconProvider: "google", label: "gemini-2.5-flash" },
  { id: "gemini-3-flash-preview", iconProvider: "google", label: "gemini-3-flash-preview" },
  {
    id: "gemini-3.1-flash-lite-preview",
    iconProvider: "google",
    label: "gemini-3.1-flash-lite-preview",
  },
  { id: "gemini-3.1-pro-preview", iconProvider: "google", label: "gemini-3.1-pro-preview" },
  { id: "glm-5", iconProvider: "glm", label: "glm-5" },
  { id: "gpt-5.4", iconProvider: "openai", label: "gpt-5.4" },
  { id: "gpt-5.4-mini", iconProvider: "openai", label: "gpt-5.4-mini" },
  { id: "kimi-k2.5", iconProvider: "kimi", label: "kimi-k2.5" },
  { id: "minimax-m2.5", iconProvider: "minimax", label: "minimax-m2.5" },
  { id: "minimax-m2.7", iconProvider: "minimax", label: "minimax-m2.7" },
];

function buildProviderModels(iconProvider: string, count: number, names: string[]) {
  return Array.from({ length: count }, (_, index) => ({
    id: `${iconProvider}-${index + 1}`,
    iconProvider,
    label: names[index] ?? `${iconProvider}-${index + 1}`,
  }));
}

const providers: ProviderEntry[] = [
  {
    detailName: "nexu",
    id: "nexu",
    modelCount: 13,
    models: nexuModels,
    name: "nexu Official",
    sidebarCount: 13,
  },
  {
    id: "anthropic",
    modelCount: 8,
    models: buildProviderModels("anthropic", 8, [
      "claude-opus-4-6",
      "claude-sonnet-4-6",
      "claude-3.7-sonnet",
      "claude-3.5-sonnet",
      "claude-3.5-haiku",
      "claude-3-opus",
      "claude-3-sonnet",
      "claude-3-haiku",
    ]),
    name: "Anthropic",
  },
  {
    id: "openai",
    modelCount: 122,
    models: buildProviderModels("openai", 16, [
      "gpt-5.4",
      "gpt-5.4-mini",
      "gpt-4.1",
      "gpt-4.1-mini",
      "gpt-4o",
      "gpt-4o-mini",
      "o4-mini",
      "o3",
      "o3-mini",
      "o1",
      "text-embedding-3-large",
      "text-embedding-3-small",
      "whisper-1",
      "tts-1",
      "realtime-preview",
      "omni-moderation-latest",
    ]),
    name: "OpenAI",
    sidebarCount: 122,
  },
  {
    id: "google",
    modelCount: 12,
    models: buildProviderModels("google", 12, [
      "gemini-2.5-flash",
      "gemini-2.5-pro",
      "gemini-3-flash-preview",
      "gemini-3.1-flash-lite-preview",
      "gemini-3.1-pro-preview",
      "gemma-2-27b-it",
      "gemma-2-9b-it",
      "imagen-3",
      "text-embedding-004",
      "aqa",
      "veo-2",
      "learnlm-1.5-pro",
    ]),
    name: "Google AI Studio",
  },
  {
    id: "ollama",
    modelCount: 9,
    models: buildProviderModels("ollama", 9, [
      "qwen3:32b",
      "deepseek-r1:32b",
      "llama3.3:70b",
      "gemma3:27b",
      "mistral-small:24b",
      "phi4:14b",
      "qwen2.5-coder:14b",
      "llava:13b",
      "nomic-embed-text",
    ]),
    name: "Ollama",
  },
  {
    id: "siliconflow",
    modelCount: 28,
    models: buildProviderModels("siliconflow", 10, [
      "deepseek-v3",
      "deepseek-r1",
      "qwen2.5-72b-instruct",
      "glm-4.5",
      "moonshot-v1-128k",
      "minimax-text-01",
      "yi-lightning",
      "doubao-pro-32k",
      "gemma-2-27b-it",
      "bge-m3",
    ]),
    name: "SiliconFlow",
  },
  {
    id: "ppio",
    modelCount: 18,
    models: buildProviderModels("ppio", 8, [
      "deepseek-v3",
      "deepseek-r1",
      "qwen-max",
      "glm-4-plus",
      "llama-3.1-70b",
      "mistral-large",
      "minimax-text-01",
      "embedding-v2",
    ]),
    name: "PPIO",
  },
  {
    id: "nvidia",
    modelCount: 22,
    models: buildProviderModels("nvidia", 8, [
      "llama-3.1-nemotron-70b",
      "nemotron-4-340b",
      "phi-3-medium-128k",
      "mistral-large-2",
      "mixtral-8x22b",
      "nvolveqa-40k",
      "nv-embedqa-e5-v5",
      "cosmos-reason1",
    ]),
    name: "NVIDIA",
  },
  {
    id: "stepfun",
    modelCount: 33,
    models: buildProviderModels("openai", 10, [
      "step-2",
      "step-1v-32k",
      "step-1.5v-mini",
      "step-audio",
      "step-r1-v-mini",
      "step-video-t2v",
      "step-tts-mini",
      "step-embedding-v1",
      "step-math",
      "step-reason",
    ]),
    name: "StepFun",
    sidebarCount: 33,
  },
  {
    id: "aws",
    modelCount: 24,
    models: buildProviderModels("aws", 8, [
      "anthropic.claude-3.7-sonnet",
      "anthropic.claude-3.5-haiku",
      "meta.llama-3.1-70b",
      "mistral.mistral-large",
      "cohere.command-r-plus",
      "amazon.titan-text-premier",
      "amazon.nova-pro",
      "stability.sd3-large",
    ]),
    name: "AWS Bedrock",
  },
  {
    id: "deepseek",
    modelCount: 6,
    models: buildProviderModels("deepseek", 6, [
      "deepseek-v3.2",
      "deepseek-r1",
      "deepseek-v3",
      "deepseek-chat",
      "deepseek-coder",
      "deepseek-reasoner",
    ]),
    name: "DeepSeek",
  },
  {
    id: "openrouter",
    modelCount: 352,
    models: buildProviderModels("openrouter", 14, [
      "anthropic/claude-opus-4-6",
      "anthropic/claude-sonnet-4-6",
      "google/gemini-2.5-flash",
      "openai/gpt-5.4",
      "openai/gpt-5.4-mini",
      "deepseek/deepseek-v3.2",
      "x-ai/grok-3",
      "mistralai/mistral-large",
      "qwen/qwen-max",
      "zhipu/glm-5",
      "moonshot/kimi-k2.5",
      "minimax/minimax-m2.7",
      "meta-llama/llama-3.3-70b",
      "cohere/command-r-plus",
    ]),
    name: "OpenRouter",
    sidebarCount: 352,
  },
  {
    id: "mistral",
    modelCount: 7,
    models: buildProviderModels("openai", 7, [
      "mistral-large",
      "mistral-medium",
      "mistral-small",
      "codestral",
      "pixtral-large",
      "ministral-8b",
      "mistral-embed",
    ]),
    name: "Mistral AI",
  },
  {
    id: "xai",
    modelCount: 5,
    models: buildProviderModels("xai", 5, [
      "grok-3",
      "grok-3-mini",
      "grok-2-vision",
      "grok-beta",
      "grok-embed",
    ]),
    name: "xAI",
  },
  {
    id: "together",
    modelCount: 32,
    models: buildProviderModels("openrouter", 10, [
      "meta-llama/Llama-3.3-70B-Instruct-Turbo",
      "deepseek-ai/DeepSeek-V3",
      "Qwen/Qwen2.5-72B-Instruct-Turbo",
      "mistralai/Mixtral-8x22B-Instruct-v0.1",
      "NousResearch/Nous-Hermes-2-Mixtral-8x7B-DPO",
      "black-forest-labs/FLUX.1-schnell",
      "BAAI/bge-large-en-v1.5",
      "meta-llama/Llama-3.2-11B-Vision-Instruct-Turbo",
      "upstage/SOLAR-10.7B-Instruct-v1.0",
      "google/gemma-2-27b-it",
    ]),
    name: "Together AI",
  },
  {
    id: "huggingface",
    modelCount: 11,
    models: buildProviderModels("huggingface", 11, [
      "Qwen/Qwen2.5-Coder-32B-Instruct",
      "meta-llama/Llama-3.3-70B-Instruct",
      "deepseek-ai/DeepSeek-R1",
      "mistralai/Mistral-7B-Instruct-v0.3",
      "google/gemma-2-27b-it",
      "sentence-transformers/all-MiniLM-L6-v2",
      "BAAI/bge-m3",
      "stabilityai/stable-diffusion-3.5-large",
      "black-forest-labs/FLUX.1-dev",
      "openai/whisper-large-v3",
      "meta-llama/Llama-Guard-3-8B",
    ]),
    name: "Hugging Face",
  },
  {
    id: "qwen",
    modelCount: 14,
    models: buildProviderModels("qwen", 14, [
      "qwen-max",
      "qwen-plus",
      "qwen-turbo",
      "qwen-long",
      "qwen2.5-72b-instruct",
      "qwen2.5-coder-32b-instruct",
      "qvq-max",
      "qwen-vl-max",
      "qwen-vl-plus",
      "qwen-audio-turbo",
      "text-embedding-v3",
      "qwen-tts",
      "qwen-omni-turbo",
      "wanx2.1-t2i",
    ]),
    name: "Qwen",
  },
  {
    id: "volcengine",
    modelCount: 17,
    models: buildProviderModels("openai", 10, [
      "doubao-pro-32k",
      "doubao-lite-32k",
      "doubao-vision-pro",
      "doubao-video",
      "doubao-embedding",
      "deepseek-v3",
      "deepseek-r1",
      "skylark-chat",
      "seedream-3.0",
      "seewe-tts",
    ]),
    name: "Volcengine Ark",
  },
];

type ConversationEntry = {
  age: string;
  channel: string;
  live?: boolean;
  title: string;
};

const conversations: ConversationEntry[] = [
  { age: "23h ago", channel: "WeChat", live: true, title: "o9cq80..." },
  { age: "2d ago", channel: "Web", live: true, title: "local-p..." },
  { age: "3/18/2026", channel: "Web", live: true, title: "heartb..." },
];

function AppRailItem({
  active = false,
  count,
  icon: Icon,
  label,
}: {
  active?: boolean;
  count?: number;
  icon: typeof House;
  label: string;
}) {
  return (
    <button
      type="button"
      className={cn(
        "flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left transition-colors",
        active ? "bg-surface-2 text-text-primary" : "text-text-secondary hover:bg-surface-1",
      )}
    >
      <Icon size={20} className="shrink-0" />
      <span className="flex-1 text-[18px] font-medium">{label}</span>
      {typeof count === "number" ? (
        <span className="text-[14px] text-text-tertiary">{count}</span>
      ) : null}
    </button>
  );
}

function ConversationRow({ age, channel, live, title }: ConversationEntry) {
  return (
    <button
      type="button"
      className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition-colors hover:bg-surface-1"
    >
      <span className="flex size-10 shrink-0 items-center justify-center rounded-full border border-border bg-white text-text-secondary">
        {channel === "WeChat" ? "💬" : <Globe size={18} />}
      </span>

      <span className="min-w-0 flex-1">
        <span className="flex items-center gap-2">
          <span className="truncate text-[16px] font-medium text-text-primary">{title}</span>
          {live ? (
            <span className="rounded-full bg-[var(--color-success-subtle)] px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-[var(--color-success)]">
              Live
            </span>
          ) : null}
        </span>
        <span className="mt-1 flex items-center gap-2 text-[14px] text-text-tertiary">
          <span>{channel}</span>
          <span>·</span>
          <span>{age}</span>
        </span>
      </span>

      <span className="size-3 shrink-0 rounded-full bg-[var(--color-success)]" />
    </button>
  );
}

function ProviderListItem({
  active,
  onClick,
  provider,
}: {
  active: boolean;
  onClick: () => void;
  provider: ProviderEntry;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left transition-colors",
        active ? "bg-surface-2" : "hover:bg-surface-1",
      )}
    >
      <span className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-border-subtle bg-white text-text-primary">
        <ProviderLogo provider={provider.id} size={20} title={provider.name} />
      </span>

      <span className="min-w-0 flex-1 truncate text-[18px] font-medium text-text-primary">
        {provider.name}
      </span>

      {typeof provider.sidebarCount === "number" ? (
        <span className="shrink-0 text-[14px] text-text-tertiary">{provider.sidebarCount}</span>
      ) : null}
    </button>
  );
}

function ModelRow({ model }: { model: ModelEntry }) {
  return (
    <button
      type="button"
      className="flex w-full items-center gap-4 rounded-xl px-4 py-3 text-left transition-colors hover:bg-surface-1"
    >
      <span className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-border-subtle bg-white text-text-primary">
        <ProviderLogo provider={model.iconProvider} size={18} title={model.label} />
      </span>
      <span className="truncate text-[18px] font-medium text-text-primary">{model.label}</span>
    </button>
  );
}

function ProviderSettingsScenario() {
  const [activeProviderId, setActiveProviderId] = useState("nexu");

  const activeProvider = useMemo(
    () => providers.find((provider) => provider.id === activeProviderId) ?? providers[0],
    [activeProviderId],
  );

  return (
    <div className="min-h-screen bg-surface-0 text-text-primary">
      <div className="flex min-h-screen">
        <aside className="flex w-[292px] shrink-0 flex-col border-r border-border-subtle bg-[#f6f6f3] px-4 pb-4 pt-6">
          <div className="mb-8 flex items-center justify-between px-2">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-2 text-[#ff5f57]">
                <span className="size-5 rounded-full bg-[#ff5f57]" />
                <span className="size-5 rounded-full bg-[#febc2e]" />
                <span className="size-5 rounded-full bg-[#28c840]" />
              </span>
            </div>
          </div>

          <div className="mb-10 flex items-center justify-between px-2">
            <div className="flex items-center gap-3">
              <ProviderLogo provider="nexu" size={40} title="nexu" />
              <span className="text-[30px] font-semibold tracking-tight text-text-primary">
                nexu
              </span>
            </div>
            <button type="button" className="rounded-lg p-2 text-text-tertiary hover:bg-surface-1">
              <LogOut size={18} />
            </button>
          </div>

          <nav className="space-y-2">
            <AppRailItem icon={House} label="Home" />
            <AppRailItem count={65} icon={Sparkles} label="Skills" />
            <AppRailItem active icon={Settings} label="Settings" />
          </nav>

          <div className="mt-10 px-2">
            <div className="mb-4 text-[14px] font-semibold uppercase tracking-[0.12em] text-text-tertiary">
              Conversations
            </div>
            <div className="space-y-1.5">
              {conversations.map((conversation) => (
                <ConversationRow key={conversation.title} {...conversation} />
              ))}
            </div>
          </div>

          <div className="mt-auto space-y-4">
            <div className="rounded-[24px] border border-[#f2d4b4] bg-[#fff8ef] p-5 shadow-sm">
              <div className="flex items-center gap-4">
                <span className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-[#ffb32d] text-white shadow-sm">
                  <Star size={24} fill="currentColor" />
                </span>
                <div className="min-w-0 flex-1 text-[15px] leading-6 text-text-primary">
                  <div className="font-semibold">Share nexu,</div>
                  <div>earn extra credits</div>
                </div>
                <span className="text-[22px] text-text-tertiary">›</span>
              </div>
            </div>

            <div className="flex items-center justify-between px-3 text-[14px] text-text-secondary">
              <div className="flex items-center gap-2">
                <Sparkles size={14} className="text-[var(--color-brand-primary)]" />
                <span>Balance</span>
              </div>
              <span>1100 credits</span>
            </div>

            <div className="flex items-center justify-between px-2 pt-2 text-text-tertiary">
              <div className="flex items-center gap-4">
                <MessageCircle size={18} />
                <Wrench size={18} />
              </div>
              <div className="flex items-center gap-2 text-[14px]">
                <Languages size={18} />
                <span>EN</span>
              </div>
            </div>
          </div>
        </aside>

        <main className="min-w-0 flex-1 bg-surface-0 px-10 pb-10 pt-8 xl:px-14">
          <div className="mx-auto max-w-[1296px]">
            <div className="mb-10 flex items-start justify-between gap-6">
              <div>
                <h1 className="text-[58px] font-semibold leading-none tracking-[-0.04em] text-text-primary">
                  Settings
                </h1>
                <p className="mt-3 text-[18px] text-text-secondary">Manage AI model providers</p>
              </div>

              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  className="h-12 rounded-2xl border-[#f4c77b] bg-[#fffaf0] px-5 text-[15px] font-medium text-[#b86c00] shadow-none hover:bg-[#fff4de]"
                >
                  <span className="flex items-center gap-3">
                    <Star size={16} />
                    <span>Star on GitHub</span>
                    <span className="text-[14px] text-[#b59b74]">(2,438)</span>
                    <span>↗</span>
                  </span>
                </Button>

                <Button variant="outline" className="h-12 rounded-2xl px-5 text-[15px] font-medium">
                  <span className="flex items-center gap-2.5">
                    <FolderOpen size={16} />
                    <span>Workspace</span>
                  </span>
                </Button>
              </div>
            </div>

            <div className="overflow-hidden rounded-[28px] border border-border bg-white shadow-[0_1px_2px_rgba(15,23,42,0.03)]">
              <div className="flex min-h-[980px]">
                <section className="flex w-[344px] shrink-0 flex-col border-r border-border-subtle bg-[#fcfcfb]">
                  <div className="px-7 pb-4 pt-5 text-[13px] font-semibold uppercase tracking-[0.12em] text-text-tertiary">
                    Providers
                  </div>
                  <div className="flex-1 space-y-1 overflow-y-auto px-3 pb-5">
                    {providers.map((provider) => (
                      <ProviderListItem
                        key={provider.id}
                        active={provider.id === activeProvider.id}
                        onClick={() => setActiveProviderId(provider.id)}
                        provider={provider}
                      />
                    ))}
                  </div>
                </section>

                <section className="min-w-0 flex-1 bg-white px-8 pb-8 pt-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex min-w-0 items-center gap-4">
                      <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-surface-1 text-text-primary">
                        <ProviderLogo
                          provider={activeProvider.id}
                          size={24}
                          title={activeProvider.detailName ?? activeProvider.name}
                        />
                      </span>

                      <div className="min-w-0">
                        <div className="truncate text-[20px] font-semibold text-text-primary">
                          {activeProvider.detailName ?? activeProvider.name}
                        </div>
                      </div>
                    </div>

                    <Button variant="outline" className="rounded-2xl px-5 text-[15px] font-medium">
                      {activeProvider.id === "nexu" ? "Log out" : "Get API key"}
                    </Button>
                  </div>

                  <div className="my-8 border-t border-border-subtle" />

                  <div className="mb-6 flex items-center justify-between gap-4">
                    <div className="text-[14px] font-semibold uppercase tracking-[0.12em] text-text-tertiary">
                      Available models ({activeProvider.modelCount})
                    </div>

                    <button
                      type="button"
                      className="inline-flex items-center gap-2 text-[14px] font-medium text-text-secondary transition-colors hover:text-text-primary"
                    >
                      <RefreshCw size={15} />
                      <span>Refresh model list</span>
                    </button>
                  </div>

                  <div className="space-y-1.5">
                    {activeProvider.models.map((model) => (
                      <ModelRow key={model.id} model={model} />
                    ))}
                  </div>
                </section>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

const meta = {
  title: "Scenarios/Provider Settings",
  component: Button,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Full-page restoration of the canonical model provider configuration surface, including workspace rail, provider sidebar, managed-provider header actions, and dense available-model rows.",
      },
    },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const CanonicalProviderSettings: Story = {
  name: "Canonical provider settings",
  render: () => <ProviderSettingsScenario />,
};
