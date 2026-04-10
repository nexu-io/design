export type Platform =
  | "slack"
  | "feishu"
  | "discord"
  | "telegram"
  | "whatsapp"
  | "wechat"
  | "dingtalk"
  | "qqbot"
  | "wecom";
export type ChannelStatus = "active" | "inactive" | "configuring";
export type DeploymentSource = "coding" | "content";
export type ModelProvider =
  | "nexu"
  | "anthropic"
  | "openai"
  | "google"
  | "ollama"
  | "nvidia"
  | "stepfun"
  | "amazon-bedrock"
  | "deepseek"
  | "mistral"
  | "xai"
  | "together"
  | "huggingface"
  | "qwen"
  | "volcengine"
  | "qianfan"
  | "vllm"
  | "byteplus"
  | "venice"
  | "github-copilot"
  | "xiaomi"
  | "chutes"
  | "kimi"
  | "glm"
  | "moonshot"
  | "zai"
  | "custom-openai"
  | "custom-anthropic"
  | "minimax"
  | "openrouter"
  | "siliconflow"
  | "ppio"
  | "xiaoxiang";

export interface PlatformConfig {
  platform: Platform;
  configured: boolean;
  webhookUrl?: string;
  configuredAt?: string;
}

export type ChatType = "group" | "dm";

export interface Channel {
  id: string;
  platform: Platform;
  chatType: ChatType;
  name: string;
  status: ChannelStatus;
  createdAt: string;
  lastMessage?: string;
  messageCount: number;
  webhookUrl: string;
  botName: string;
}

export interface Deployment {
  id: string;
  channelId: string;
  title: string;
  url: string;
  status: "live" | "building" | "failed";
  createdAt: string;
  linesOfCode: number;
  duration: string;
  source: DeploymentSource;
  contentType?: "newsletter" | "blog" | "tweet-thread" | "landing";
}

export interface BotMessage {
  id: string;
  role: "user" | "bot";
  content: string;
  time: string;
  deployment?: { url: string; title: string };
  contentArtifact?: {
    url: string;
    title: string;
    type: "newsletter" | "blog" | "tweet-thread" | "landing";
  };
  oauthPrompt?: { toolId: string; toolName: string; provider: string };
}

export interface ProviderDetail {
  id: ModelProvider;
  name: string;
  description: string;
  enabled: boolean;
  apiKeyPlaceholder: string;
  proxyUrl: string;
  apiDocsUrl?: string;
  models: ProviderModel[];
}

export interface ProviderModel {
  id: string;
  name: string;
  enabled: boolean;
  contextWindow: string;
  releasedAt: string;
  inputPrice: string;
  outputPrice: string;
  tier?: "plus" | "pro";
}

function createProviderModel(
  id: string,
  name: string,
  contextWindow: string,
  releasedAt: string,
  inputPrice: string,
  outputPrice: string,
  enabled = false,
): ProviderModel {
  return { id, name, enabled, contextWindow, releasedAt, inputPrice, outputPrice };
}

function createProviderDetail({
  id,
  name,
  description,
  apiKeyPlaceholder,
  proxyUrl,
  apiDocsUrl,
  models,
  enabled = false,
}: ProviderDetail): ProviderDetail {
  return { id, name, description, enabled, apiKeyPlaceholder, proxyUrl, apiDocsUrl, models };
}

const PROVIDER_DETAILS: ProviderDetail[] = [
  {
    id: "nexu",
    name: "nexu Official",
    description: "Hosted by nexu, ready to use, no API Key required",
    enabled: true,
    apiKeyPlaceholder: "Not required",
    proxyUrl: "https://api.nexu.dev/v1",
    models: [
      {
        id: "nexu-claude-sonnet-4-6",
        name: "Claude Sonnet 4.6",
        enabled: true,
        contextWindow: "200K",
        releasedAt: "2026-02-17",
        inputPrice: "$3.00/M",
        outputPrice: "$15.00/M",
        tier: "plus",
      },
      {
        id: "nexu-claude-opus-4-6",
        name: "Claude Opus 4.6",
        enabled: true,
        contextWindow: "200K",
        releasedAt: "2026-02-05",
        inputPrice: "$5.00/M",
        outputPrice: "$25.00/M",
        tier: "pro",
      },
      {
        id: "nexu-claude-haiku-4-5",
        name: "Claude Haiku 4.5",
        enabled: false,
        contextWindow: "200K",
        releasedAt: "2025-10-16",
        inputPrice: "$1.00/M",
        outputPrice: "$5.00/M",
      },
    ],
  },
  {
    id: "anthropic",
    name: "Anthropic",
    description: "Claude models, strong at reasoning, coding and long context",
    enabled: true,
    apiKeyPlaceholder: "sk-ant-...",
    proxyUrl: "https://api.anthropic.com",
    apiDocsUrl: "https://console.anthropic.com/settings/keys",
    models: [
      {
        id: "claude-opus-4-6",
        name: "Claude Opus 4.6",
        enabled: true,
        contextWindow: "200K",
        releasedAt: "2026-02-05",
        inputPrice: "$5.00/M",
        outputPrice: "$25.00/M",
      },
      {
        id: "claude-sonnet-4-6",
        name: "Claude Sonnet 4.6",
        enabled: true,
        contextWindow: "200K",
        releasedAt: "2026-02-17",
        inputPrice: "$3.00/M",
        outputPrice: "$15.00/M",
      },
      {
        id: "claude-haiku-4-5",
        name: "Claude Haiku 4.5",
        enabled: false,
        contextWindow: "200K",
        releasedAt: "2025-10-16",
        inputPrice: "$1.00/M",
        outputPrice: "$5.00/M",
      },
    ],
  },
  {
    id: "openai",
    name: "OpenAI",
    description: "GPT models, the world's most widely used LLMs",
    enabled: false,
    apiKeyPlaceholder: "sk-...",
    proxyUrl: "https://api.openai.com/v1",
    apiDocsUrl: "https://platform.openai.com/api-keys",
    models: [
      {
        id: "gpt-5",
        name: "GPT-5",
        enabled: false,
        contextWindow: "1M",
        releasedAt: "2026-01-20",
        inputPrice: "$5.00/M",
        outputPrice: "$15.00/M",
      },
      {
        id: "gpt-4o",
        name: "GPT-4o",
        enabled: false,
        contextWindow: "128K",
        releasedAt: "2025-05-13",
        inputPrice: "$2.50/M",
        outputPrice: "$10.00/M",
      },
      {
        id: "o3",
        name: "o3",
        enabled: false,
        contextWindow: "200K",
        releasedAt: "2025-12-05",
        inputPrice: "$10.00/M",
        outputPrice: "$40.00/M",
      },
    ],
  },
  {
    id: "google",
    name: "Google",
    description: "Gemini models, ultra-long context and multimodal",
    enabled: false,
    apiKeyPlaceholder: "AIza...",
    proxyUrl: "https://generativelanguage.googleapis.com",
    apiDocsUrl: "https://aistudio.google.com/apikey",
    models: [
      {
        id: "gemini-2-5-pro",
        name: "Gemini 2.5 Pro",
        enabled: false,
        contextWindow: "1M",
        releasedAt: "2025-12-11",
        inputPrice: "$1.25/M",
        outputPrice: "$5.00/M",
      },
      {
        id: "gemini-3-flash",
        name: "Gemini 3 Flash",
        enabled: false,
        contextWindow: "1M",
        releasedAt: "2026-02-25",
        inputPrice: "$0.10/M",
        outputPrice: "$0.40/M",
      },
    ],
  },
  {
    id: "xai",
    name: "xAI",
    description: "Grok models, real-time information and reasoning",
    enabled: false,
    apiKeyPlaceholder: "xai-...",
    proxyUrl: "https://api.x.ai/v1",
    apiDocsUrl: "https://console.x.ai/",
    models: [
      {
        id: "grok-3",
        name: "Grok 3",
        enabled: false,
        contextWindow: "128K",
        releasedAt: "2025-11-15",
        inputPrice: "$3.00/M",
        outputPrice: "$15.00/M",
      },
      {
        id: "grok-3-mini",
        name: "Grok 3 Mini",
        enabled: false,
        contextWindow: "128K",
        releasedAt: "2026-01-10",
        inputPrice: "$0.30/M",
        outputPrice: "$0.50/M",
      },
    ],
  },
  {
    id: "kimi",
    name: "Moonshot",
    description: "Kimi models, leading long-text comprehension",
    enabled: true,
    apiKeyPlaceholder: "sk-...",
    proxyUrl: "https://api.moonshot.cn/v1",
    apiDocsUrl: "https://platform.moonshot.cn/console/api-keys",
    models: [
      {
        id: "kimi-k2",
        name: "Kimi K2",
        enabled: true,
        contextWindow: "1M",
        releasedAt: "2026-01-15",
        inputPrice: "¥12.00/M",
        outputPrice: "¥60.00/M",
      },
    ],
  },
  {
    id: "glm",
    name: "Zhipu AI",
    description: "GLM models, strong bilingual Chinese-English capability",
    enabled: false,
    apiKeyPlaceholder: "...",
    proxyUrl: "https://open.bigmodel.cn/api/paas/v4",
    apiDocsUrl: "https://open.bigmodel.cn/usercenter/apikeys",
    models: [
      {
        id: "glm-4-5",
        name: "GLM-4.5",
        enabled: false,
        contextWindow: "128K",
        releasedAt: "2025-11-20",
        inputPrice: "¥5.00/M",
        outputPrice: "¥20.00/M",
      },
    ],
  },
  {
    id: "minimax",
    name: "MiniMax",
    description: "MiniMax models, cost-effective LLMs",
    enabled: false,
    apiKeyPlaceholder: "eyJ...",
    proxyUrl: "https://api.minimax.chat/v1",
    apiDocsUrl: "https://platform.minimaxi.com/user-center/basic-information/interface-key",
    models: [
      {
        id: "minimax-m1",
        name: "MiniMax M1",
        enabled: false,
        contextWindow: "1M",
        releasedAt: "2026-01-08",
        inputPrice: "¥2.00/M",
        outputPrice: "¥8.00/M",
      },
    ],
  },
  {
    id: "openrouter",
    name: "OpenRouter",
    description: "Unified API gateway, aggregating multiple model providers",
    enabled: false,
    apiKeyPlaceholder: "sk-or-...",
    proxyUrl: "https://openrouter.ai/api/v1",
    apiDocsUrl: "https://openrouter.ai/keys",
    models: [
      {
        id: "or-auto",
        name: "Auto (Best)",
        enabled: false,
        contextWindow: "200K",
        releasedAt: "2026-01-01",
        inputPrice: "Per model",
        outputPrice: "Per model",
      },
    ],
  },
  {
    id: "siliconflow",
    name: "SiliconFlow",
    description: "SiliconCloud platform, accelerated model inference",
    enabled: false,
    apiKeyPlaceholder: "sk-...",
    proxyUrl: "https://api.siliconflow.cn/v1",
    apiDocsUrl: "https://cloud.siliconflow.cn/account/ak",
    models: [
      {
        id: "sf-deepseek-v3",
        name: "DeepSeek V3",
        enabled: false,
        contextWindow: "128K",
        releasedAt: "2025-12-26",
        inputPrice: "¥1.00/M",
        outputPrice: "¥2.00/M",
      },
      {
        id: "sf-qwen-2-5-72b",
        name: "Qwen 2.5 72B",
        enabled: false,
        contextWindow: "128K",
        releasedAt: "2025-09-19",
        inputPrice: "¥4.00/M",
        outputPrice: "¥8.00/M",
      },
    ],
  },
  {
    id: "ppio",
    name: "PPIO",
    description: "PPIO Cloud, cost-effective model inference",
    enabled: false,
    apiKeyPlaceholder: "sk-...",
    proxyUrl: "https://api.ppinfra.com/v3/openai",
    apiDocsUrl: "https://ppinfra.com/settings/key-management",
    models: [
      {
        id: "ppio-deepseek-r1",
        name: "DeepSeek R1",
        enabled: false,
        contextWindow: "128K",
        releasedAt: "2025-12-20",
        inputPrice: "¥1.00/M",
        outputPrice: "¥4.00/M",
      },
    ],
  },
  createProviderDetail({
    id: "ollama",
    name: "Ollama",
    description: "Run local open-weight models on your own machine",
    enabled: false,
    apiKeyPlaceholder: "Not required",
    proxyUrl: "http://localhost:11434/v1",
    models: [createProviderModel("qwen3-32b", "Qwen3 32B", "128K", "2026-02-10", "Local", "Local")],
  }),
  createProviderDetail({
    id: "nvidia",
    name: "NVIDIA",
    description: "NVIDIA NIM endpoints for accelerated inference",
    enabled: false,
    apiKeyPlaceholder: "nvapi-...",
    proxyUrl: "https://integrate.api.nvidia.com/v1",
    apiDocsUrl: "https://build.nvidia.com/",
    models: [
      createProviderModel(
        "llama-3_1-nemotron-70b",
        "Llama 3.1 Nemotron 70B",
        "128K",
        "2026-01-06",
        "$0.90/M",
        "$0.90/M",
      ),
    ],
  }),
  createProviderDetail({
    id: "stepfun",
    name: "StepFun",
    description: "Step series multimodal and reasoning models",
    enabled: false,
    apiKeyPlaceholder: "step-...",
    proxyUrl: "https://api.stepfun.com/v1",
    apiDocsUrl: "https://platform.stepfun.com/",
    models: [createProviderModel("step-2", "Step 2", "256K", "2026-01-18", "¥4.00/M", "¥16.00/M")],
  }),
  createProviderDetail({
    id: "amazon-bedrock",
    name: "AWS Bedrock",
    description: "Managed foundation model access through Amazon Bedrock",
    enabled: false,
    apiKeyPlaceholder: "AWS credentials",
    proxyUrl: "https://bedrock-runtime.us-east-1.amazonaws.com",
    apiDocsUrl: "https://console.aws.amazon.com/bedrock/",
    models: [
      createProviderModel(
        "anthropic-claude-3_7-sonnet",
        "Claude 3.7 Sonnet",
        "200K",
        "2026-02-01",
        "$3.00/M",
        "$15.00/M",
      ),
    ],
  }),
  createProviderDetail({
    id: "deepseek",
    name: "DeepSeek",
    description: "DeepSeek reasoning and coder models",
    enabled: false,
    apiKeyPlaceholder: "sk-...",
    proxyUrl: "https://api.deepseek.com/v1",
    apiDocsUrl: "https://platform.deepseek.com/api_keys",
    models: [
      createProviderModel(
        "deepseek-v3-2",
        "DeepSeek V3.2",
        "128K",
        "2026-02-28",
        "$0.27/M",
        "$1.10/M",
      ),
    ],
  }),
  createProviderDetail({
    id: "mistral",
    name: "Mistral AI",
    description: "Mistral flagship and coding models",
    enabled: false,
    apiKeyPlaceholder: "mistral-...",
    proxyUrl: "https://api.mistral.ai/v1",
    apiDocsUrl: "https://console.mistral.ai/api-keys/",
    models: [
      createProviderModel(
        "mistral-large",
        "Mistral Large",
        "128K",
        "2026-01-28",
        "$2.00/M",
        "$6.00/M",
      ),
    ],
  }),
  createProviderDetail({
    id: "together",
    name: "Together AI",
    description: "Open-source model inference across many vendors",
    enabled: false,
    apiKeyPlaceholder: "together-...",
    proxyUrl: "https://api.together.xyz/v1",
    apiDocsUrl: "https://api.together.xyz/settings/api-keys",
    models: [
      createProviderModel(
        "meta-llama-3_3-70b",
        "Llama 3.3 70B Turbo",
        "128K",
        "2026-01-12",
        "$0.88/M",
        "$0.88/M",
      ),
    ],
  }),
  createProviderDetail({
    id: "huggingface",
    name: "Hugging Face",
    description: "Hosted inference for open models from the Hugging Face hub",
    enabled: false,
    apiKeyPlaceholder: "hf_...",
    proxyUrl: "https://router.huggingface.co/v1",
    apiDocsUrl: "https://huggingface.co/settings/tokens",
    models: [
      createProviderModel(
        "qwen2_5-coder-32b",
        "Qwen2.5 Coder 32B",
        "128K",
        "2026-01-09",
        "$0.70/M",
        "$0.70/M",
      ),
    ],
  }),
  createProviderDetail({
    id: "qwen",
    name: "Qwen",
    description: "Alibaba Qwen family with strong multilingual support",
    enabled: false,
    apiKeyPlaceholder: "sk-...",
    proxyUrl: "https://dashscope.aliyuncs.com/compatible-mode/v1",
    apiDocsUrl: "https://bailian.console.aliyun.com/?tab=model#/api-key",
    models: [
      createProviderModel("qwen-max", "Qwen Max", "128K", "2026-01-14", "¥4.00/M", "¥12.00/M"),
    ],
  }),
  createProviderDetail({
    id: "volcengine",
    name: "Volcengine Ark",
    description: "Doubao and partner models on Volcengine Ark",
    enabled: false,
    apiKeyPlaceholder: "ark-...",
    proxyUrl: "https://ark.cn-beijing.volces.com/api/v3",
    apiDocsUrl: "https://console.volcengine.com/ark",
    models: [
      createProviderModel(
        "doubao-pro-32k",
        "Doubao Pro 32K",
        "32K",
        "2026-01-22",
        "¥0.80/M",
        "¥2.00/M",
      ),
    ],
  }),
  createProviderDetail({
    id: "qianfan",
    name: "Baidu Qianfan",
    description: "ERNIE and partner models on Baidu Qianfan",
    enabled: false,
    apiKeyPlaceholder: "bce-...",
    proxyUrl: "https://qianfan.baidubce.com/v2",
    apiDocsUrl: "https://console.bce.baidu.com/qianfan/",
    models: [
      createProviderModel(
        "ernie-4_0-turbo",
        "ERNIE 4.0 Turbo",
        "128K",
        "2026-01-30",
        "¥2.00/M",
        "¥8.00/M",
      ),
    ],
  }),
  createProviderDetail({
    id: "vllm",
    name: "vLLM",
    description: "Self-hosted vLLM endpoints for OpenAI-compatible inference",
    enabled: false,
    apiKeyPlaceholder: "Optional",
    proxyUrl: "http://localhost:8000/v1",
    models: [
      createProviderModel(
        "llama-3_1-8b",
        "Llama 3.1 8B",
        "128K",
        "2026-01-04",
        "Self-hosted",
        "Self-hosted",
      ),
    ],
  }),
  createProviderDetail({
    id: "byteplus",
    name: "BytePlus ModelArk",
    description: "BytePlus hosted model APIs and enterprise inference",
    enabled: false,
    apiKeyPlaceholder: "bp-...",
    proxyUrl: "https://ark.byteplus.com/api/v3",
    apiDocsUrl: "https://console.byteplus.com/modelark",
    models: [
      createProviderModel(
        "doubao-seed-1_6",
        "Doubao Seed 1.6",
        "128K",
        "2026-02-08",
        "$0.90/M",
        "$3.00/M",
      ),
    ],
  }),
  createProviderDetail({
    id: "venice",
    name: "Venice",
    description: "Privacy-first hosted AI models on Venice",
    enabled: false,
    apiKeyPlaceholder: "venice-...",
    proxyUrl: "https://api.venice.ai/api/v1",
    apiDocsUrl: "https://venice.ai/settings/api",
    models: [
      createProviderModel(
        "venice-uncensored",
        "Venice Uncensored",
        "32K",
        "2026-01-11",
        "$3.00/M",
        "$9.00/M",
      ),
    ],
  }),
  createProviderDetail({
    id: "github-copilot",
    name: "GitHub Copilot",
    description: "GitHub-managed access to leading frontier models",
    enabled: false,
    apiKeyPlaceholder: "GitHub token",
    proxyUrl: "https://api.githubcopilot.com",
    apiDocsUrl: "https://github.com/settings/copilot",
    models: [
      createProviderModel(
        "gpt-4_1-copilot",
        "GPT-4.1 via Copilot",
        "128K",
        "2026-02-02",
        "Included",
        "Included",
      ),
    ],
  }),
  createProviderDetail({
    id: "xiaomi",
    name: "Xiaomi MiMo",
    description: "Xiaomi MiMo hosted models and enterprise endpoints",
    enabled: false,
    apiKeyPlaceholder: "mimo-...",
    proxyUrl: "https://api.mimo.com/v1",
    apiDocsUrl: "https://platform.xiaomi.com/",
    models: [createProviderModel("mimo-7b", "MiMo 7B", "32K", "2026-01-16", "¥0.50/M", "¥1.50/M")],
  }),
  createProviderDetail({
    id: "chutes",
    name: "Chutes",
    description: "Managed inference endpoints on Chutes",
    enabled: false,
    apiKeyPlaceholder: "chutes-...",
    proxyUrl: "https://api.chutes.ai/v1",
    apiDocsUrl: "https://app.chutes.ai/settings/api-keys",
    models: [
      createProviderModel(
        "deepseek-r1-distill",
        "DeepSeek R1 Distill",
        "128K",
        "2026-01-03",
        "$0.60/M",
        "$2.40/M",
      ),
    ],
  }),
  createProviderDetail({
    id: "moonshot",
    name: "Moonshot AI",
    description: "Moonshot official endpoints for Kimi and long-context models",
    enabled: false,
    apiKeyPlaceholder: "sk-...",
    proxyUrl: "https://api.moonshot.cn/v1",
    apiDocsUrl: "https://platform.moonshot.cn/console/api-keys",
    models: [
      createProviderModel(
        "moonshot-v1-128k",
        "Moonshot V1 128K",
        "128K",
        "2026-01-07",
        "¥12.00/M",
        "¥60.00/M",
      ),
    ],
  }),
  createProviderDetail({
    id: "zai",
    name: "Z.ai",
    description: "Z.ai hosted multimodal and reasoning models",
    enabled: false,
    apiKeyPlaceholder: "zai-...",
    proxyUrl: "https://api.z.ai/v1",
    apiDocsUrl: "https://platform.z.ai/",
    models: [
      createProviderModel(
        "zai-thinking",
        "Z.ai Thinking",
        "128K",
        "2026-02-12",
        "$1.50/M",
        "$6.00/M",
      ),
    ],
  }),
  createProviderDetail({
    id: "custom-openai",
    name: "Custom OpenAI-compatible",
    description: "Connect any OpenAI-compatible endpoint with your own base URL",
    enabled: false,
    apiKeyPlaceholder: "sk-...",
    proxyUrl: "https://your-openai-compatible-endpoint/v1",
    models: [
      createProviderModel(
        "custom-gpt",
        "Custom OpenAI Model",
        "128K",
        "2026-01-01",
        "Custom",
        "Custom",
      ),
    ],
  }),
  createProviderDetail({
    id: "custom-anthropic",
    name: "Custom Anthropic-compatible",
    description: "Connect any Anthropic-compatible endpoint with your own base URL",
    enabled: false,
    apiKeyPlaceholder: "sk-ant-...",
    proxyUrl: "https://your-anthropic-compatible-endpoint",
    models: [
      createProviderModel(
        "custom-claude",
        "Custom Claude-compatible Model",
        "200K",
        "2026-01-01",
        "Custom",
        "Custom",
      ),
    ],
  }),
  {
    id: "xiaoxiang",
    name: "Xiaoma",
    description: "Enterprise AI inference platform",
    enabled: false,
    apiKeyPlaceholder: "sk-...",
    proxyUrl: "https://api.xiaoma.ai/v1",
    apiDocsUrl: "https://xiaoma.ai/console",
    models: [
      {
        id: "xx-deepseek-v3",
        name: "DeepSeek V3",
        enabled: false,
        contextWindow: "128K",
        releasedAt: "2025-12-26",
        inputPrice: "¥0.80/M",
        outputPrice: "¥1.60/M",
      },
    ],
  },
];

export function getProviderDetails(): ProviderDetail[] {
  return PROVIDER_DETAILS;
}

export const MOCK_CHANNELS: Channel[] = [
  {
    id: "1",
    platform: "feishu",
    chatType: "group",
    name: "#product-dev",
    status: "active",
    createdAt: "2026-02-20",
    lastMessage: "2 min ago",
    messageCount: 128,
    webhookUrl: "https://api.nexu.dev/webhook/feishu/ch_abc123",
    botName: "nexu 🦞",
  },
  {
    id: "2",
    platform: "feishu",
    chatType: "group",
    name: "#engineering",
    status: "active",
    createdAt: "2026-02-18",
    lastMessage: "15 min ago",
    messageCount: 76,
    webhookUrl: "https://api.nexu.dev/webhook/feishu/ch_def456",
    botName: "nexu 🦞",
  },
  {
    id: "3",
    platform: "slack",
    chatType: "dm",
    name: "@Alex",
    status: "active",
    createdAt: "2026-02-21",
    lastMessage: "1 hr ago",
    messageCount: 34,
    webhookUrl: "https://api.nexu.dev/webhook/slack/ch_ghi789",
    botName: "nexu 🦞",
  },
  {
    id: "4",
    platform: "discord",
    chatType: "group",
    name: "#marketing",
    status: "active",
    createdAt: "2026-02-22",
    lastMessage: "30 min ago",
    messageCount: 45,
    webhookUrl: "https://api.nexu.dev/webhook/discord/ch_jkl012",
    botName: "nexu 🦞",
  },
];

export const MOCK_DEPLOYMENTS: Deployment[] = [
  {
    id: "dep-1",
    channelId: "1",
    title: "Product Landing Page",
    url: "https://landing-abc.nexu.dev",
    status: "live",
    createdAt: "2026-02-25 14:32",
    linesOfCode: 320,
    duration: "45s",
    source: "coding",
  },
  {
    id: "dep-2",
    channelId: "1",
    title: "Data Dashboard",
    url: "https://dashboard-xyz.nexu.dev",
    status: "live",
    createdAt: "2026-02-25 11:05",
    linesOfCode: 285,
    duration: "38s",
    source: "coding",
  },
  {
    id: "dep-3",
    channelId: "2",
    title: "Team Wiki",
    url: "https://wiki-eng.nexu.dev",
    status: "live",
    createdAt: "2026-02-24 16:20",
    linesOfCode: 198,
    duration: "32s",
    source: "coding",
  },
  {
    id: "dep-4",
    channelId: "2",
    title: "API Monitor",
    url: "https://monitor-eng.nexu.dev",
    status: "building",
    createdAt: "2026-02-25 15:10",
    linesOfCode: 0,
    duration: "—",
    source: "coding",
  },
  {
    id: "dep-5",
    channelId: "1",
    title: "Internal Tool - Approval Flow",
    url: "",
    status: "failed",
    createdAt: "2026-02-24 09:45",
    linesOfCode: 0,
    duration: "12s",
    source: "coding",
  },
  {
    id: "dep-6",
    channelId: "1",
    title: "nexu Weekly #8",
    url: "https://newsletter-w8.nexu.dev",
    status: "live",
    createdAt: "2026-02-21 18:00",
    linesOfCode: 0,
    duration: "8s",
    source: "content",
    contentType: "newsletter",
  },
  {
    id: "dep-7",
    channelId: "1",
    title: "v0.3 Release Thread",
    url: "https://thread-v03.nexu.dev",
    status: "live",
    createdAt: "2026-02-25 10:15",
    linesOfCode: 0,
    duration: "5s",
    source: "content",
    contentType: "tweet-thread",
  },
  {
    id: "dep-8",
    channelId: "2",
    title: "How We Built a Cyber Office with AI",
    url: "https://blog-cyber-office.nexu.dev",
    status: "live",
    createdAt: "2026-02-24 14:30",
    linesOfCode: 0,
    duration: "12s",
    source: "content",
    contentType: "blog",
  },
  {
    id: "dep-9",
    channelId: "1",
    title: "nexu v0.3 Changelog",
    url: "https://changelog-v03.nexu.dev",
    status: "live",
    createdAt: "2026-02-25 09:00",
    linesOfCode: 0,
    duration: "10s",
    source: "content",
    contentType: "landing",
  },
  {
    id: "dep-10",
    channelId: "2",
    title: "Engineering Weekly Digest #12",
    url: "https://digest-eng-12.nexu.dev",
    status: "live",
    createdAt: "2026-02-22 18:00",
    linesOfCode: 0,
    duration: "7s",
    source: "content",
    contentType: "newsletter",
  },
];

const MOCK_MESSAGES: Record<string, BotMessage[]> = {
  "1": [
    {
      id: "m1",
      role: "user",
      content:
        "Help me build a product Landing Page, modern style, with Hero, Features, CTA sections",
      time: "14:30",
    },
    {
      id: "m2",
      role: "bot",
      content: "Got it! nexu is generating a React + Tailwind Landing Page ⚡",
      time: "14:30",
    },
    {
      id: "m3",
      role: "bot",
      content: "✅ Done! 320 lines of code, deployed live.",
      time: "14:31",
      deployment: { url: "https://landing-abc.nexu.dev", title: "Product Landing Page" },
    },
    {
      id: "m4",
      role: "user",
      content: "Can you make the Hero title bigger and add a gradient?",
      time: "14:35",
    },
    {
      id: "m5",
      role: "bot",
      content: "✅ Updated! Title now 48px + gradient, re-deployed ✅",
      time: "14:35",
      deployment: { url: "https://landing-abc.nexu.dev", title: "Product Landing Page (updated)" },
    },
    { id: "m6", role: "user", content: "Turn this data into a visual dashboard", time: "11:00" },
    {
      id: "m7",
      role: "bot",
      content: "Data file received. nexu is generating Chart.js dashboard...",
      time: "11:01",
    },
    {
      id: "m8",
      role: "bot",
      content: "✅ Data Dashboard is live!",
      time: "11:02",
      deployment: { url: "https://dashboard-xyz.nexu.dev", title: "Data Dashboard" },
    },
    {
      id: "m14",
      role: "bot",
      content: "📬 [Content Automation] Weekly Newsletter executed",
      time: "18:00",
      contentArtifact: {
        url: "https://newsletter-w8.nexu.dev",
        title: "nexu Weekly #8",
        type: "newsletter",
      },
    },
    {
      id: "m15",
      role: "bot",
      content: "🐦 [Content Automation] Twitter Thread triggered",
      time: "10:15",
      contentArtifact: {
        url: "https://thread-v03.nexu.dev",
        title: "v0.3 Release Thread",
        type: "tweet-thread",
      },
    },
  ],
  "2": [
    {
      id: "m9",
      role: "user",
      content: "Create a team wiki page with our engineering docs",
      time: "16:15",
    },
    {
      id: "m10",
      role: "bot",
      content: "Got it! nexu is creating a React-based wiki with markdown support...",
      time: "16:15",
    },
    {
      id: "m11",
      role: "bot",
      content: "✅ Team Wiki deployed! 198 lines of code.",
      time: "16:17",
      deployment: { url: "https://wiki-eng.nexu.dev", title: "Team Wiki" },
    },
    {
      id: "m12",
      role: "user",
      content: "Can you add an API health monitoring dashboard?",
      time: "15:08",
    },
    {
      id: "m13",
      role: "bot",
      content: "Working on it! Setting up API endpoints monitoring...",
      time: "15:09",
    },
    {
      id: "m17",
      role: "bot",
      content: "✍️ [Content Automation] Blog post generated — live now.",
      time: "14:30",
      contentArtifact: {
        url: "https://blog-cyber-office.nexu.dev",
        title: "How We Built a Cyber Office with AI",
        type: "blog",
      },
    },
    {
      id: "m18",
      role: "bot",
      content: "📬 [Content Automation] Engineering Weekly Digest #12 deployed.",
      time: "18:00",
      contentArtifact: {
        url: "https://digest-eng-12.nexu.dev",
        title: "Engineering Weekly Digest #12",
        type: "newsletter",
      },
    },
  ],
  "3": [
    {
      id: "m19",
      role: "user",
      content:
        "Help me check my Google Calendar for tomorrow's meetings and send a summary to the team on Slack",
      time: "09:15",
    },
    {
      id: "m20",
      role: "bot",
      content: "I'd love to help! To access your Google Calendar, I need your authorization first.",
      time: "09:15",
      oauthPrompt: { toolId: "gcal", toolName: "Google Calendar", provider: "Google" },
    },
    {
      id: "m21",
      role: "bot",
      content: "✅ Google Calendar connected! Let me check your schedule for tomorrow...",
      time: "09:16",
    },
    {
      id: "m22",
      role: "bot",
      content:
        "Here's your meeting summary for tomorrow (Feb 26):\n\n• 10:00 — Product Standup (30 min)\n• 11:30 — Design Review with Sarah (1 hr)\n• 14:00 — Sprint Planning (1.5 hr)\n• 16:30 — 1:1 with Manager (30 min)\n\nI've posted the summary to #product-dev on Slack.",
      time: "09:16",
    },
  ],
};

const MOCK_PLATFORM_CONFIGS: PlatformConfig[] = [
  {
    platform: "slack",
    configured: true,
    webhookUrl: "https://api.nexu.dev/webhook/slack/tk_abc123",
    configuredAt: "2026-02-18",
  },
];

export function getPlatformConfig(platform: Platform): PlatformConfig {
  return (
    MOCK_PLATFORM_CONFIGS.find((c) => c.platform === platform) ?? { platform, configured: false }
  );
}

export function getPlatformLabel(platform: Platform): string {
  const labels: Record<Platform, string> = {
    slack: "Slack",
    feishu: "Feishu",
    discord: "Discord",
    telegram: "Telegram",
    whatsapp: "WhatsApp",
    wechat: "WeChat",
    dingtalk: "DingTalk",
    qqbot: "QQ Bot",
    wecom: "WeCom",
  };
  return labels[platform];
}

export function getChannel(id: string): Channel | undefined {
  return MOCK_CHANNELS.find((c) => c.id === id);
}

export function getChannelMessages(channelId: string): BotMessage[] {
  return MOCK_MESSAGES[channelId] ?? [];
}
