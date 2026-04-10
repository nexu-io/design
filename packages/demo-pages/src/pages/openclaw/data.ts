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
  | "xai"
  | "kimi"
  | "glm"
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
