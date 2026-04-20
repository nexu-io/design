import { useAgentsStore } from "@/stores/agents";
import type {
  User,
  Agent,
  AgentTemplate,
  Skill,
  Runtime,
  Channel,
  Message,
  Workspace,
  MemberRef,
} from "@/types";

export const mockWorkspace: Workspace = {
  id: "ws-1",
  name: "Acme Engineering",
  avatar: undefined,
  createdAt: Date.now() - 86400000 * 30,
};

export const mockUsers: User[] = [
  {
    id: "u-1",
    name: "Alice Chen",
    email: "alice@acme.dev",
    avatar: "https://api.dicebear.com/9.x/notionists/svg?seed=alice",
    status: "online",
    role: "owner",
  },
  {
    id: "u-2",
    name: "Bob Kim",
    email: "bob@acme.dev",
    avatar: "https://api.dicebear.com/9.x/notionists/svg?seed=bob",
    status: "online",
    role: "member",
  },
  {
    id: "u-3",
    name: "Charlie Park",
    email: "charlie@acme.dev",
    avatar: "https://api.dicebear.com/9.x/notionists/svg?seed=charlie",
    status: "away",
    role: "member",
  },
  {
    id: "u-4",
    name: "Diana Wu",
    email: "diana@acme.dev",
    avatar: "https://api.dicebear.com/9.x/notionists/svg?seed=diana",
    status: "offline",
    role: "member",
  },
];

export const mockSkills: Skill[] = [
  {
    id: "sk-1",
    name: "Code Review",
    description: "Analyze code for bugs, style issues, and improvements",
    icon: "scan-search",
    type: "bundled",
    config: {},
  },
  {
    id: "sk-2",
    name: "Test Generation",
    description: "Generate unit and integration tests",
    icon: "flask-conical",
    type: "bundled",
    config: {},
  },
  {
    id: "sk-3",
    name: "Documentation",
    description: "Generate and update documentation",
    icon: "file-text",
    type: "bundled",
    config: {},
  },
  {
    id: "sk-4",
    name: "Design Critique",
    description: "Review UI designs for accessibility and UX",
    icon: "palette",
    type: "bundled",
    config: {},
  },
  {
    id: "sk-5",
    name: "Data Query",
    description: "Write and optimize SQL/data queries",
    icon: "database",
    type: "bundled",
    config: {},
  },
  {
    id: "sk-6",
    name: "Refactor",
    description: "Suggest and apply code refactoring patterns",
    icon: "git-branch",
    type: "bundled",
    config: {},
  },
];

export const mockAgentTemplates: AgentTemplate[] = [
  {
    id: "tpl-1",
    name: "Coder",
    description:
      "Full-stack coding agent. Writes features, fixes bugs, refactors code, and generates tests. Supports multiple languages and frameworks.",
    avatar: "https://api.dicebear.com/9.x/bottts/svg?seed=coder&backgroundColor=4f46e5",
    defaultPrompt:
      "You are Coder, a senior full-stack engineer. You write clean, well-tested code, debug issues methodically, and generate comprehensive test coverage. Always explain your reasoning.",
    defaultSkills: ["sk-1", "sk-2", "sk-6"],
    category: "development",
  },
  {
    id: "tpl-2",
    name: "Reviewer",
    description:
      "Code review agent. Analyzes pull requests for bugs, security issues, and style violations. Provides constructive feedback with suggested fixes.",
    avatar: "https://api.dicebear.com/9.x/bottts/svg?seed=reviewer&backgroundColor=ec4899",
    defaultPrompt:
      "You are Reviewer, a meticulous code reviewer. You catch bugs, identify edge cases, suggest improvements, and ensure code quality standards are met. Be thorough but constructive.",
    defaultSkills: ["sk-1", "sk-3"],
    category: "development",
  },
  {
    id: "tpl-3",
    name: "Ops",
    description:
      "DevOps agent. Manages CI/CD pipelines, troubleshoots deployment failures, monitors infrastructure health, and automates operational tasks.",
    avatar: "https://api.dicebear.com/9.x/bottts/svg?seed=ops&backgroundColor=f59e0b",
    defaultPrompt:
      "You are Ops, a senior DevOps engineer. You manage CI/CD pipelines, troubleshoot deployments, monitor system health, and optimize infrastructure. Prioritize reliability and automation.",
    defaultSkills: ["sk-5"],
    category: "ops",
  },
  {
    id: "tpl-4",
    name: "Teammate",
    description:
      "General-purpose team assistant. Answers questions, drafts documentation, summarizes threads, and helps with day-to-day collaboration tasks.",
    avatar: "https://api.dicebear.com/9.x/bottts/svg?seed=teammate&backgroundColor=10b981",
    defaultPrompt:
      "You are Teammate, a helpful team member. You answer questions, write and update documentation, summarize discussions, and help with day-to-day tasks. Be concise and actionable.",
    defaultSkills: ["sk-3", "sk-5"],
    category: "general",
  },
];

export const mockAgents: Agent[] = [
  {
    id: "a-1",
    name: "Coder",
    avatar: mockAgentTemplates[0].avatar,
    description: mockAgentTemplates[0].description,
    systemPrompt: mockAgentTemplates[0].defaultPrompt,
    status: "online",
    skills: [mockSkills[0], mockSkills[1], mockSkills[5]],
    runtimeId: "rt-1",
    templateId: "tpl-1",
    createdBy: "u-1",
    createdAt: Date.now() - 86400000 * 7,
  },
  {
    id: "a-2",
    name: "Reviewer",
    avatar: mockAgentTemplates[1].avatar,
    description: mockAgentTemplates[1].description,
    systemPrompt: mockAgentTemplates[1].defaultPrompt,
    status: "online",
    skills: [mockSkills[0], mockSkills[2]],
    runtimeId: "rt-2",
    templateId: "tpl-2",
    createdBy: "u-1",
    createdAt: Date.now() - 86400000 * 5,
  },
];

export const mockRuntimes: Runtime[] = [
  {
    id: "rt-1",
    name: "Claude Code (Local)",
    type: "claude-code",
    status: "connected",
    version: "1.0.12",
    config: { path: "/usr/local/bin/claude" },
    ownerId: "u-1",
  },
  {
    id: "rt-2",
    name: "OpenCode",
    type: "opencode",
    status: "connected",
    version: "0.5.3",
    config: { path: "/usr/local/bin/opencode" },
    ownerId: "u-1",
  },
  {
    id: "rt-3",
    name: "Cursor Agent",
    type: "cursor",
    status: "disconnected",
    version: undefined,
    config: {},
    ownerId: "u-2",
  },
  {
    id: "rt-4",
    name: "Codex",
    type: "codex",
    status: "disconnected",
    version: undefined,
    config: {},
    ownerId: "u-2",
  },
  {
    id: "rt-5",
    name: "Gemini CLI",
    type: "gemini-cli",
    status: "connected",
    version: "0.1.0",
    config: { path: "/usr/local/bin/gemini" },
    ownerId: "u-1",
  },
  {
    id: "rt-6",
    name: "Hermes",
    type: "hermes",
    status: "disconnected",
    version: undefined,
    config: {},
    ownerId: "u-3",
  },
];

const user1Ref: MemberRef = { kind: "user", id: "u-1" };
const user2Ref: MemberRef = { kind: "user", id: "u-2" };
const user3Ref: MemberRef = { kind: "user", id: "u-3" };
const agent1Ref: MemberRef = { kind: "agent", id: "a-1" };
const agent2Ref: MemberRef = { kind: "agent", id: "a-2" };

export const mockChannels: Channel[] = [
  {
    id: "ch-welcome",
    name: "Welcome to Nexu!",
    description: "",
    type: "channel",
    members: [user1Ref, user2Ref, user3Ref, agent1Ref, agent2Ref],
    lastMessageAt: Date.now() - 60000,
    unreadCount: 0,
    createdAt: Date.now() - 86400000 * 30,
  },
  {
    id: "ch-showcase",
    name: "design-showcase",
    description: "Every message surface the component library ships, in one feed.",
    type: "channel",
    members: [user1Ref, user2Ref, user3Ref, agent1Ref, agent2Ref],
    lastMessageAt: Date.now() - 45000,
    unreadCount: 3,
    createdAt: Date.now() - 86400000 * 2,
  },
  {
    id: "dm-u-2",
    name: "Bob Kim",
    type: "dm",
    members: [user1Ref, user2Ref],
    lastMessageAt: Date.now() - 120000,
    unreadCount: 1,
    createdAt: Date.now() - 86400000 * 20,
  },
  {
    id: "dm-u-3",
    name: "Charlie Park",
    type: "dm",
    members: [user1Ref, user3Ref],
    lastMessageAt: Date.now() - 7200000,
    unreadCount: 0,
    createdAt: Date.now() - 86400000 * 15,
  },
  {
    id: "dm-agent-1",
    name: "CodeBot",
    type: "dm",
    members: [user1Ref, agent1Ref],
    lastMessageAt: Date.now() - 180000,
    unreadCount: 2,
    createdAt: Date.now() - 86400000 * 6,
  },
  {
    id: "dm-agent-2",
    name: "DesignReviewer",
    type: "dm",
    members: [user1Ref, agent2Ref],
    lastMessageAt: Date.now() - 3600000,
    unreadCount: 0,
    createdAt: Date.now() - 86400000 * 4,
  },
];

const NOW = Date.now();
const MIN = 60 * 1000;

export const mockMessages: Record<string, Message[]> = {
  "ch-showcase": [
    {
      id: "sc-0-join",
      channelId: "ch-showcase",
      sender: user1Ref,
      content: "",
      mentions: [],
      reactions: [],
      createdAt: NOW - 26 * 60 * MIN,
      system: {
        kind: "join",
        members: [user2Ref, user3Ref, agent1Ref, agent2Ref],
      },
    },
    {
      id: "sc-0-kickoff",
      channelId: "ch-showcase",
      sender: user1Ref,
      content:
        "Spinning up a reference channel with every chat surface the library ships. Poke around and react where something feels off.",
      mentions: [],
      reactions: [{ emoji: "👋", users: ["u-2", "u-3"] }],
      createdAt: NOW - 25 * 60 * MIN,
    },
    {
      id: "sc-1",
      channelId: "ch-showcase",
      sender: user1Ref,
      content:
        "Rolling through every surface the design system ships for chat. Let's take inventory.",
      mentions: [],
      reactions: [{ emoji: "👀", users: ["u-2", "u-3"] }],
      createdAt: NOW - 48 * MIN,
    },
    {
      id: "sc-2",
      channelId: "ch-showcase",
      sender: user2Ref,
      content: "Here's the latest hero shot from the landing redesign:",
      blocks: [
        {
          type: "image",
          url: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=640&q=75",
          alt: "Dashboard hero shot — analytics overview",
        },
      ],
      mentions: [],
      reactions: [{ emoji: "🔥", users: ["u-1"] }],
      createdAt: NOW - 47 * MIN,
    },
    {
      id: "sc-3",
      channelId: "ch-showcase",
      sender: user3Ref,
      content: "And the full exploration — eight variants from the review session.",
      blocks: [
        {
          type: "gallery",
          images: [
            {
              url: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=320&q=70",
              alt: "Variant A",
            },
            {
              url: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=320&q=70",
              alt: "Variant B",
            },
            {
              url: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=320&q=70",
              alt: "Variant C",
            },
            {
              url: "https://images.unsplash.com/photo-1553484771-047a44eee27b?w=320&q=70",
              alt: "Variant D",
            },
            {
              url: "https://images.unsplash.com/photo-1559028012-481c04fa702d?w=320&q=70",
              alt: "Variant E",
            },
            {
              url: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=320&q=70",
              alt: "Variant F",
            },
            {
              url: "https://images.unsplash.com/photo-1517430816045-df4b7de11d1d?w=320&q=70",
              alt: "Variant G",
            },
            {
              url: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=320&q=70",
              alt: "Variant H",
            },
          ],
        },
      ],
      mentions: [],
      reactions: [],
      createdAt: NOW - 44 * MIN,
    },
    {
      id: "sc-4",
      channelId: "ch-showcase",
      sender: user2Ref,
      content: "Bug-2174 is reproducible — recorded the flow end-to-end.",
      blocks: [
        {
          type: "video",
          thumbnail: "https://images.unsplash.com/photo-1551808525-51a94da548ce?w=720&q=70",
          duration: "02:37",
          title: "Bug-2174-repro.mp4",
          size: 8_400_000,
        },
      ],
      mentions: [],
      reactions: [{ emoji: "🎥", users: ["u-1"] }],
      createdAt: NOW - 40 * MIN,
    },
    {
      id: "sc-5",
      channelId: "ch-showcase",
      sender: user3Ref,
      content: "Quick voice recap from the PM sync — 24s, TL;DR at the end.",
      blocks: [
        {
          type: "voice",
          duration: "0:24",
          transcript:
            "We sized the billing-retry SLO at 99.5% for the quarter, and agreed to defer the backoff overhaul until the shared rate-limiter lands.",
          waveform: [4, 8, 12, 18, 22, 14, 10, 16, 24, 20, 14, 8, 6, 12, 18, 22, 16, 10, 6, 4],
        },
      ],
      mentions: [],
      reactions: [],
      createdAt: NOW - 38 * MIN,
    },
    {
      id: "sc-6",
      channelId: "ch-showcase",
      sender: user1Ref,
      content: "Dropping the spec + test fixtures in case anyone wants to reproduce locally:",
      blocks: [
        {
          type: "file",
          name: "billing-retry-spec.pdf",
          size: 1_840_000,
          url: "#",
          mimeType: "application/pdf",
        },
        {
          type: "file",
          name: "fixtures.zip",
          size: 6_120_000,
          url: "#",
          mimeType: "application/zip",
        },
        {
          type: "file",
          name: "retry-metrics.csv",
          size: 212_000,
          url: "#",
          mimeType: "text/csv",
        },
      ],
      mentions: [],
      reactions: [{ emoji: "🙏", users: ["u-2", "u-3"] }],
      createdAt: NOW - 35 * MIN,
    },
    {
      id: "sc-7",
      channelId: "ch-showcase",
      sender: user2Ref,
      content:
        "Mentioning @Coder — can you draft the retry helper? Something along the lines of `exponentialBackoff(attempt, base)`.",
      mentions: [agent1Ref],
      reactions: [],
      createdAt: NOW - 32 * MIN,
    },
    {
      id: "sc-8",
      channelId: "ch-showcase",
      sender: agent1Ref,
      content: "On it. Here's a first pass that honours the jitter policy from the spec:",
      blocks: [
        {
          type: "code",
          language: "typescript",
          filename: "retry.ts",
          code: "export function exponentialBackoff(attempt: number, base = 200): number {\n  const ceiling = Math.min(base * 2 ** attempt, 30_000)\n  const jitter = Math.random() * ceiling * 0.2\n  return Math.floor(ceiling - jitter)\n}\n\nexport async function withRetry<T>(\n  fn: () => Promise<T>,\n  opts: { max?: number; base?: number } = {},\n): Promise<T> {\n  const { max = 5, base = 200 } = opts\n  let lastErr: unknown\n  for (let i = 0; i < max; i++) {\n    try {\n      return await fn()\n    } catch (err) {\n      lastErr = err\n      await sleep(exponentialBackoff(i, base))\n    }\n  }\n  throw lastErr\n}",
        },
      ],
      mentions: [],
      reactions: [{ emoji: "👍", users: ["u-2", "u-1"] }],
      createdAt: NOW - 30 * MIN,
    },
    {
      id: "sc-9",
      channelId: "ch-showcase",
      sender: agent1Ref,
      content: "Wiring it into the billing client. Here's the minimal diff:",
      blocks: [
        {
          type: "diff",
          filename: "src/billing/client.ts",
          content:
            '@@ -14,9 +14,13 @@\n import { httpPost } from "../http"\n+import { withRetry } from "./retry"\n \n export async function chargeCustomer(id: string, amount: number) {\n-  const res = await httpPost(`/billing/${id}/charge`, { amount })\n+  const res = await withRetry(\n+    () => httpPost(`/billing/${id}/charge`, { amount }),\n+    { max: 5, base: 250 },\n+  )\n   if (!res.ok) throw new BillingError(res)\n   return res.json()\n }',
          additions: 5,
          deletions: 1,
        },
      ],
      mentions: [],
      reactions: [],
      createdAt: NOW - 28 * MIN,
    },
    {
      id: "sc-10",
      channelId: "ch-showcase",
      sender: agent1Ref,
      content: "",
      blocks: [
        {
          type: "action",
          title: "Running unit tests for billing client",
          description: "pnpm --filter billing test --changed",
          status: "running",
          tool: "pnpm-test",
        },
      ],
      mentions: [],
      reactions: [],
      createdAt: NOW - 26 * MIN,
    },
    {
      id: "sc-11",
      channelId: "ch-showcase",
      sender: agent1Ref,
      content: "",
      blocks: [
        {
          type: "tool-result",
          tool: "pnpm-test",
          input: "pnpm --filter billing test --changed",
          output:
            "PASS  src/billing/retry.test.ts\n  exponentialBackoff\n    ✓ grows exponentially (8 ms)\n    ✓ caps at 30s ceiling (3 ms)\n    ✓ applies ±20% jitter (12 ms)\n  withRetry\n    ✓ retries on transient failure (42 ms)\n    ✓ throws after max attempts (38 ms)\n\nTest Suites: 1 passed, 1 total\nTests:       5 passed, 5 total\nTime:        0.87 s",
          status: "success",
        },
      ],
      mentions: [],
      reactions: [{ emoji: "✅", users: ["u-1"] }],
      createdAt: NOW - 25 * MIN,
    },
    {
      id: "sc-12",
      channelId: "ch-showcase",
      sender: agent1Ref,
      content: "",
      blocks: [
        {
          type: "progress",
          title: "Staging rollout",
          current: 3,
          total: 5,
          steps: [
            { label: "Build artifact", status: "done" },
            { label: "Push image", status: "done" },
            { label: "Canary 10%", status: "done" },
            { label: "Ramp to 50%", status: "active" },
            { label: "Promote to 100%", status: "pending" },
          ],
        },
      ],
      mentions: [],
      reactions: [],
      createdAt: NOW - 22 * MIN,
    },
    {
      id: "sc-13",
      channelId: "ch-showcase",
      sender: agent1Ref,
      content: "Need a sign-off before promoting past 50%.",
      blocks: [
        {
          type: "approval",
          id: "showcase-approval-1",
          title: "Promote billing-client v2.4.1 to 100%?",
          description:
            "Canary and 50% have held for 18 minutes with p99 latency steady at 184 ms and error rate at 0.02%.",
          status: "pending",
        },
      ],
      mentions: [],
      reactions: [],
      createdAt: NOW - 20 * MIN,
    },
    {
      id: "sc-13b-ping",
      channelId: "ch-showcase",
      sender: user2Ref,
      content:
        "@Alice Chen eyes on the approval when you're free — graphs look clean but want a second read.",
      mentions: [user1Ref],
      reactions: [],
      createdAt: NOW - 17 * MIN,
    },
    {
      id: "sc-14",
      channelId: "ch-showcase",
      sender: user1Ref,
      content: "Good stuff. Let's spin up a tracking topic so we don't lose the follow-ups.",
      mentions: [],
      reactions: [],
      createdAt: NOW - 14 * MIN,
    },
    {
      id: "sc-15",
      channelId: "ch-showcase",
      sender: user1Ref,
      content: "",
      blocks: [
        {
          type: "topic",
          id: "topic-1",
          title: "Billing retry storms — Q3 hardening",
          author: "Alice Chen",
          status: "needs-review",
          lastActivity: "2 min ago",
          replies: 14,
          participants: ["AC", "BL", "CP", "CD"],
          preview:
            "Root cause looks like the new exponential-backoff config under the shared rate-limiter. Coder proposed a retry helper — need eyes on the jitter policy.",
          assignee: {
            name: "Coder",
            isAgent: true,
            accent: "var(--color-brand-primary)",
          },
        },
        {
          type: "topic",
          id: "topic-2",
          title: "Landing redesign — hero + gallery",
          author: "Bob Kim",
          status: "active",
          lastActivity: "12 min ago",
          replies: 6,
          participants: ["BL", "CP", "AC", "DR", "CD", "MN", "KL"],
          preview: "Eight variants explored; narrowing to three finalists for Thursday's review.",
        },
        {
          type: "topic",
          id: "topic-3",
          title: "Auth rotation — 24h complete",
          author: "Charlie Park",
          status: "done",
          lastActivity: "1 h ago",
          replies: 3,
          participants: ["CP", "AC"],
          preview: "All services rotated. Ephemeral tokens now mandatory for internal RPC.",
        },
        {
          type: "topic",
          id: "topic-4",
          title: "IndexedDB migration — blocked on Safari",
          author: "Bob Kim",
          status: "blocked",
          lastActivity: "yesterday",
          replies: 21,
          participants: ["BL", "CP", "AC"],
          preview:
            "Safari 17.1 still throws QuotaExceeded on the dry-run — need a smaller chunk size before we can ship.",
        },
        {
          type: "topic",
          id: "topic-5",
          title: "Onboarding copy — v1 specs (archived)",
          author: "Alice Chen",
          status: "archived",
          lastActivity: "Mar 14",
          replies: 8,
          participants: ["AC", "DR"],
          preview: "Superseded by the v2 plan tracked in #growth-experiments.",
        },
      ],
      mentions: [],
      reactions: [{ emoji: "📌", users: ["u-2", "u-3"] }],
      createdAt: NOW - 12 * MIN,
    },
    {
      id: "sc-16",
      channelId: "ch-showcase",
      sender: user2Ref,
      content:
        "That's every block in one feed — images, gallery, video, voice, files, code, diff, action, tool output, progress, approval, and topic cards. Ship it. 🚀",
      mentions: [],
      reactions: [
        { emoji: "🚀", users: ["u-1", "u-3"] },
        { emoji: "🎯", users: ["u-1"] },
      ],
      createdAt: NOW - 2 * MIN,
    },
  ],
  "ch-welcome": [
    {
      id: "m-1",
      channelId: "ch-welcome",
      sender: agent1Ref,
      content:
        "Hey everyone! 👋 I'm **Coder**, your coding assistant. You can @mention me anytime to write code, debug issues, or generate tests.\n\nHere's what I can help with:\n- Writing & debugging code\n- Test generation\n- Refactoring suggestions\n\nJust say `@Coder` followed by your request!",
      mentions: [],
      reactions: [],
      createdAt: Date.now() - 3600000,
    },
    {
      id: "m-2",
      channelId: "ch-welcome",
      sender: agent2Ref,
      content:
        "Hi team! 🔍 I'm **Reviewer**. I can review your PRs, catch bugs, and suggest improvements. Just @mention me with a link or paste your code!",
      mentions: [],
      reactions: [],
      createdAt: Date.now() - 3000000,
    },
    {
      id: "m-3",
      channelId: "ch-welcome",
      sender: user1Ref,
      content:
        "Welcome to Nexu, everyone! This is where we collaborate with our AI agents. Feel free to try @mentioning them here 🚀",
      mentions: [],
      reactions: [],
      createdAt: Date.now() - 2400000,
    },
  ],
  "dm-agent-1": [
    {
      id: "dm-m-1",
      channelId: "dm-agent-1",
      sender: user1Ref,
      content: "Hey Coder, can you help me write a debounce hook?",
      mentions: [],
      reactions: [],
      createdAt: Date.now() - 600000,
    },
    {
      id: "dm-m-2",
      channelId: "dm-agent-1",
      sender: agent1Ref,
      content: "Sure! Here's a type-safe debounce hook:",
      blocks: [
        {
          type: "code",
          language: "typescript",
          filename: "useDebounce.ts",
          code: "function useDebounce<T>(value: T, delay: number): T {\n  const [debouncedValue, setDebouncedValue] = useState(value)\n\n  useEffect(() => {\n    const timer = setTimeout(() => setDebouncedValue(value), delay)\n    return () => clearTimeout(timer)\n  }, [value, delay])\n\n  return debouncedValue\n}",
        },
      ],
      mentions: [],
      reactions: [],
      createdAt: Date.now() - 540000,
    },
    {
      id: "dm-m-3",
      channelId: "dm-agent-1",
      sender: user1Ref,
      content: "Nice! Can you also review this screenshot of the current UI?",
      blocks: [
        {
          type: "image",
          url: "https://placehold.co/400x250/1e1e2e/white?text=UI+Screenshot",
          alt: "Current dashboard UI",
        },
      ],
      mentions: [],
      reactions: [],
      createdAt: Date.now() - 480000,
    },
    {
      id: "dm-m-4",
      channelId: "dm-agent-1",
      sender: agent1Ref,
      content: "",
      blocks: [
        {
          type: "action",
          title: "Analyzing UI screenshot",
          description: "Running visual analysis on the uploaded image",
          status: "success" as const,
          tool: "vision-analyze",
        },
        {
          type: "tool-result",
          tool: "vision-analyze",
          input: "Analyze UI screenshot for accessibility and design issues",
          output:
            "✓ Color contrast: PASS (4.8:1 ratio)\n✓ Font sizes: PASS (min 14px)\n✗ Touch targets: FAIL (some buttons < 44px)\n✓ Layout hierarchy: PASS\n\nOverall score: 87/100",
          status: "success" as const,
        },
      ],
      mentions: [],
      reactions: [],
      createdAt: Date.now() - 420000,
    },
    {
      id: "dm-m-5",
      channelId: "dm-agent-1",
      sender: agent1Ref,
      content: "I found a small button sizing issue. Here's the fix:",
      blocks: [
        {
          type: "diff",
          filename: "src/components/Button.tsx",
          content:
            '@@ -12,7 +12,7 @@\n export function Button({ children, size = "md" }) {\n   return (\n     <button\n-      className="px-3 py-1 rounded-md"\n+      className="px-4 py-2.5 min-h-[44px] rounded-md"\n     >\n       {children}\n     </button>',
          additions: 1,
          deletions: 1,
        },
      ],
      mentions: [],
      reactions: [],
      createdAt: Date.now() - 360000,
    },
    {
      id: "dm-m-6",
      channelId: "dm-agent-1",
      sender: agent1Ref,
      content: "",
      blocks: [
        {
          type: "approval",
          id: "approval-1",
          title: "Apply button fix to production?",
          description: "This will update Button.tsx and trigger a deployment to staging first.",
          status: "pending" as const,
        },
      ],
      mentions: [],
      reactions: [],
      createdAt: Date.now() - 300000,
    },
    {
      id: "dm-m-7",
      channelId: "dm-agent-1",
      sender: agent1Ref,
      content: "",
      blocks: [
        {
          type: "progress",
          title: "Running test suite",
          current: 3,
          total: 5,
          steps: [
            { label: "Lint", status: "done" as const },
            { label: "Unit tests", status: "done" as const },
            { label: "Integration", status: "done" as const },
            { label: "E2E", status: "active" as const },
            { label: "Deploy", status: "pending" as const },
          ],
        },
      ],
      mentions: [],
      reactions: [],
      createdAt: Date.now() - 240000,
    },
    {
      id: "dm-m-8",
      channelId: "dm-agent-1",
      sender: user1Ref,
      content: "Here are the design specs:",
      blocks: [
        {
          type: "file",
          name: "design-specs-v2.pdf",
          size: 2457600,
          url: "#",
          mimeType: "application/pdf",
        },
        { type: "file", name: "assets.zip", size: 15728640, url: "#", mimeType: "application/zip" },
      ],
      mentions: [],
      reactions: [],
      createdAt: Date.now() - 180000,
    },
  ],
};

const agentResponses = [
  "I've analyzed the code and here are my findings:\n\n1. The function complexity is within acceptable limits\n2. Test coverage looks good at 87%\n3. One potential memory leak in the event listener — make sure to clean up in `useEffect` return\n\nOverall, solid implementation!",
  "Let me break this down step by step:\n\n**Problem:** The current implementation has O(n²) complexity\n**Solution:** We can optimize using a hash map approach\n\n```typescript\nconst lookup = new Map(items.map(item => [item.id, item]))\n```\n\nThis brings it down to O(n). Want me to implement the full refactor?",
  "Great question! Here's how I'd approach this:\n\n- First, let's establish the data flow\n- Then we'll set up proper error boundaries\n- Finally, we'll add optimistic updates for better UX\n\nShall I start with a prototype?",
  "I've reviewed the design and here are my thoughts:\n\n**Strengths:**\n- Clean visual hierarchy\n- Good use of whitespace\n- Consistent with the design system\n\n**Improvements:**\n- Add loading skeletons for better perceived performance\n- Consider a hover state for the interactive cards\n- The mobile breakpoint needs attention at 375px\n\nNice work overall! 🎨",
  "Here's the analysis of your data:\n\n| Metric | This Week | Last Week | Change |\n|--------|-----------|-----------|--------|\n| Users  | 1,247     | 1,103     | +13%   |\n| Events | 45,892    | 41,200    | +11%   |\n| Errors | 23        | 45        | -49%   |\n\nThe error rate improvement is significant. The new error handling middleware is working well.",
];

export function getRandomAgentResponse(): string {
  return agentResponses[Math.floor(Math.random() * agentResponses.length)];
}

export function resolveRef(
  ref: MemberRef,
): { name: string; avatar: string; isAgent: boolean } | undefined {
  if (ref.kind === "user") {
    const user = mockUsers.find((u) => u.id === ref.id);
    if (!user) return undefined;
    return { name: user.name, avatar: user.avatar, isAgent: false };
  }
  const agent =
    mockAgents.find((a) => a.id === ref.id) ??
    useAgentsStore.getState().agents.find((a) => a.id === ref.id);
  if (!agent) return undefined;
  return { name: agent.name, avatar: agent.avatar, isAgent: true };
}

export function getNexuIntroResponse(agentName: string, agentDescription: string): string {
  const desc = agentDescription.charAt(0).toLowerCase() + agentDescription.slice(1);
  return [
    `Hey everyone! 👋 I'm **${agentName}** — ${desc}${desc.endsWith(".") ? "" : "."}\n`,
    "Welcome to **Nexu**, your team's AI-native workspace where humans and agents collaborate side by side.\n",
    "**Here's what you can do:**",
    "- **@mention** me in any channel to assign tasks",
    "- **DM** me directly for focused 1-on-1 work",
    "- Create more **Agents** with different specialties from Settings",
    "- Connect **Runtimes** like Claude Code, Cursor, or OpenCode to power your agents\n",
    `Just type @${agentName} followed by what you need. Let's build something great together 🚀`,
  ].join("\n");
}
