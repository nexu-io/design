import {
  AudioLines,
  BarChart3,
  Blocks,
  BookOpen,
  Bot,
  Brush,
  Calendar,
  Clapperboard,
  CloudCog,
  Code,
  Compass,
  Contact,
  CpuIcon,
  DollarSign,
  FileEdit,
  FileScan,
  FileSliders,
  FileText,
  Film,
  GitPullRequest,
  Globe,
  GlobeLock,
  HardDrive,
  Image,
  ImagePlus,
  Lightbulb,
  Link2,
  Mail,
  MailCheck,
  MailOpen,
  Map as MapIcon,
  Megaphone,
  MessageCircleReply,
  MessageSquare,
  Mic,
  Newspaper,
  Paintbrush,
  Palette,
  Pen,
  PenTool,
  Phone,
  PieChart,
  Presentation,
  ScanSearch,
  Search,
  SearchCheck,
  ShieldCheck,
  Sparkles,
  Store,
  SwatchBook,
  Table,
  TableProperties,
  Terminal,
  TrendingUp,
  UserCheck,
  UserSearch,
  Users,
  UsersRound,
  Video,
  Wand2,
  Zap,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export type SkillSource = "official" | "custom";

export type ToolTag =
  | "office-collab"
  | "file-knowledge"
  | "creative-design"
  | "biz-analysis"
  | "av-generation"
  | "info-content"
  | "dev-tools";

export const TOOL_TAG_LABELS: Record<ToolTag, string> = {
  "office-collab": "Office & Collaboration",
  "file-knowledge": "Files & Knowledge",
  "creative-design": "Creative & Design",
  "biz-analysis": "Business Analysis",
  "av-generation": "Audio & Video",
  "info-content": "Info & Content",
  "dev-tools": "Dev & Tools",
};

export interface OAuthTool {
  id: string;
  name: string;
  provider: string;
}

/** Local SVG brand logos from Simple Icons — standardized, no background, uniform visual weight */
const SKILL_ICON: Record<string, string> = {
  gmail: "/skill-icons/gmail.svg",
  "google-calendar": "/skill-icons/google-calendar.svg",
  slack: "/skill-icons/slack.svg",
  "ms-teams": "/skill-icons/microsoft-teams.svg",
  outlook: "/skill-icons/outlook.svg",
  zoom: "/skill-icons/zoom.svg",
  asana: "/skill-icons/asana.svg",
  trello: "/skill-icons/trello.svg",
  linear: "/skill-icons/linear.svg",
  "google-docs": "/skill-icons/google-docs.svg",
  "google-drive": "/skill-icons/google-drive.svg",
  "google-sheets": "/skill-icons/google-sheets.svg",
  notion: "/skill-icons/notion.svg",
  airtable: "/skill-icons/airtable.svg",
  hubspot: "/skill-icons/hubspot.svg",
  github: "/skill-icons/github.svg",
  gitlab: "/skill-icons/gitlab.svg",
  stripe: "/skill-icons/stripe.svg",
  "google-analytics": "/skill-icons/google-analytics.svg",
  "google-maps": "/skill-icons/google-maps.svg",
  facebook: "/skill-icons/facebook.svg",
  instagram: "/skill-icons/instagram.svg",
  "x-twitter": "/skill-icons/x-twitter.svg",
  reddit: "/skill-icons/reddit.svg",
  youtube: "/skill-icons/youtube.svg",
  perplexity: "/skill-icons/perplexity.svg",
  claude: "/skill-icons/claude.svg",
  brave: "/skill-icons/brave.svg",
  kling: "/skill-icons/kling.svg",
  "nano-banana": "/skill-icons/nano-banana.svg",
  "fish-audio": "/skill-icons/fish-audio.svg",
  jina: "/skill-icons/jina.svg",
  volcengine: "/skill-icons/volcengine.svg",
  listenhub: "/skill-icons/listenhub.svg",
  clawhub: "/skill-icons/clawhub.svg",
  liblibtv: "/skill-icons/liblibtv.svg",
};

export interface SkillDef {
  id: string;
  name: string;
  desc: string;
  icon: LucideIcon;
  /** Real product logo URL (Clearbit). When set, shown instead of icon. */
  logo?: string;
  prompt: string;
  tools?: OAuthTool[];
  examples?: string[];
  longDesc?: string;
  tag: ToolTag;
  source: SkillSource;
  github?: string;
}

export interface SkillCategory {
  id: string;
  label: string;
  icon: LucideIcon;
  skills: SkillDef[];
}

// ── All skills flat list ────────────────────────────────────────────

const ALL_SKILLS: SkillDef[] = [
  // ━━ 1. Office & Collaboration (11) ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  {
    id: "gmail",
    name: "Gmail",
    desc: "Email, search, contacts",
    icon: Mail,
    logo: SKILL_ICON.gmail,
    prompt: "Send an email to [recipient] with subject [subject]",
    tag: "office-collab",
    source: "official",
    tools: [{ id: "gmail", name: "Gmail", provider: "Google" }],
    longDesc:
      "With Gmail connected, nexu can draft, send, search and manage emails. Supports smart reply suggestions, summaries, bulk actions.",
    examples: [
      "Send an email to john@example.com about project progress",
      "Search emails from HR in the past week",
      "Reply to this email in a formal tone",
    ],
  },
  {
    id: "gcal",
    name: "Google Calendar",
    desc: "Schedule and meeting management",
    icon: Calendar,
    logo: SKILL_ICON["google-calendar"],
    prompt: "Create a meeting on [date] [time] with topic [topic]",
    tag: "office-collab",
    source: "official",
    tools: [{ id: "gcal", name: "Google Calendar", provider: "Google" }],
    longDesc:
      "With Google Calendar connected, nexu can manage your schedule, detect conflicts, schedule meetings and send invites.",
    examples: [
      "Create a product review meeting tomorrow at 3pm",
      "Check if I have free time next Wednesday",
      "Reschedule Friday meeting to next Monday",
    ],
  },
  {
    id: "slack",
    name: "Slack",
    desc: "Team messaging and collaboration",
    icon: MessageSquare,
    logo: SKILL_ICON.slack,
    prompt: "Post a message in Slack #general",
    tag: "office-collab",
    source: "official",
    tools: [{ id: "slack", name: "Slack", provider: "Slack" }],
    longDesc:
      "With Slack connected, nexu can send messages, manage channels, search history and more.",
    examples: [
      "Post a message in #general",
      "Search Slack for release plan discussions",
      "Create a new Slack channel",
    ],
  },
  {
    id: "ms-teams",
    name: "Microsoft Teams",
    desc: "Team communication and collaboration",
    icon: MessageSquare,
    logo: SKILL_ICON["ms-teams"],
    prompt: "Send a message in Teams to [team/channel]",
    tag: "office-collab",
    source: "official",
    tools: [{ id: "ms-teams", name: "Microsoft Teams", provider: "Microsoft" }],
    longDesc:
      "With Microsoft Teams connected, nexu can send messages, manage channels and schedule meetings.",
    examples: [
      "Send a message to the product team in Teams",
      "Create a Teams meeting",
      "Search Teams message history",
    ],
  },
  {
    id: "outlook",
    name: "Outlook",
    desc: "Email, calendar and contacts",
    icon: Mail,
    logo: SKILL_ICON.outlook,
    prompt: "Send an email via Outlook to [recipient]",
    tag: "office-collab",
    source: "official",
    tools: [{ id: "outlook", name: "Outlook", provider: "Microsoft" }],
    longDesc: "With Outlook connected, nexu can send/receive emails, manage calendar and contacts.",
    examples: [
      "Send an email via Outlook",
      "Check today's Outlook calendar",
      "Search Outlook emails",
    ],
  },
  {
    id: "zoom",
    name: "Zoom",
    desc: "Video meetings",
    icon: Video,
    logo: SKILL_ICON.zoom,
    prompt: "Schedule a Zoom meeting at [datetime]",
    tag: "office-collab",
    source: "official",
    tools: [{ id: "zoom", name: "Zoom", provider: "Zoom" }],
    longDesc:
      "With Zoom connected, nexu can schedule and manage video meetings, view recordings and manage participants.",
    examples: [
      "Schedule a Zoom meeting tomorrow at 3pm",
      "View recent Zoom recordings",
      "Send Zoom meeting invite to team",
    ],
  },
  {
    id: "asana",
    name: "Asana",
    desc: "Project management and team collaboration",
    icon: Users,
    logo: SKILL_ICON.asana,
    prompt: "Create an Asana task: [task name]",
    tag: "office-collab",
    source: "official",
    tools: [{ id: "asana", name: "Asana", provider: "Asana" }],
    longDesc:
      "With Asana connected, nexu can create and manage tasks, track project progress and assign work.",
    examples: [
      "Create an Asana task: Design review",
      "Check this week's task progress in Asana",
      "Assign this task to a team member",
    ],
  },
  {
    id: "trello",
    name: "Trello",
    desc: "Kanban project management",
    icon: FileText,
    logo: SKILL_ICON.trello,
    prompt: "Create a Trello card: [title]",
    tag: "office-collab",
    source: "official",
    tools: [{ id: "trello", name: "Trello", provider: "Trello" }],
    longDesc:
      "With Trello connected, nexu can manage boards, create and move cards, track task progress.",
    examples: [
      "Create a Trello card: Fix login bug",
      "Move this card to Done column",
      "View Trello todo tasks",
    ],
  },
  {
    id: "linear",
    name: "Linear",
    desc: "Issue and Sprint management",
    icon: Link2,
    logo: SKILL_ICON.linear,
    prompt: "Create a Linear Issue: [title]",
    tag: "office-collab",
    source: "official",
    longDesc:
      "Linear is a modern project management tool for Issues, Sprints and progress tracking. No API key required.",
    examples: [
      "Create a Linear Issue: Fix login page styles",
      "Check current Sprint progress",
      "Move this Issue to next Sprint",
    ],
  },
  {
    id: "email-management",
    name: "Email Management",
    desc: "AI email classification, summary and priority",
    icon: MailOpen,
    prompt: "Organize inbox by priority",
    tag: "office-collab",
    source: "official",
    github: "https://github.com/skillmd-ai/email",
    longDesc:
      "AI-powered email management: auto-classify, summarize, identify important emails and set priority.",
    examples: [
      "Organize inbox by priority",
      "Summarize today's unread email highlights",
      "Sort these emails into folders",
    ],
  },
  {
    id: "reply-assistant",
    name: "Reply Assistant",
    desc: "AI-generated replies, tone and context aware",
    icon: MessageCircleReply,
    prompt: "Write a reply, tone [formal/friendly]",
    tag: "office-collab",
    source: "official",
    github: "https://github.com/skillmd-ai/reply-to-text",
    longDesc:
      "Smart reply skill that generates context-appropriate replies for email, messages and more.",
    examples: [
      "Write a formal reply to this client",
      "Reply to this message in a friendly tone",
      "Write a thank-you email",
    ],
  },

  // ━━ 2. Files & Knowledge (12) ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  {
    id: "google-docs",
    name: "Google Docs",
    desc: "Document creation and editing",
    icon: FileText,
    logo: SKILL_ICON["google-docs"],
    prompt: "Create a Google Docs document with title [title]",
    tag: "file-knowledge",
    source: "official",
    tools: [{ id: "google-docs", name: "Google Docs", provider: "Google" }],
    longDesc:
      "With Google Docs connected, nexu can create, edit and manage documents with collaborative editing and formatting.",
    examples: [
      "Create a new document in Google Docs",
      "Search Google Docs for product specs",
      "Update this document's content",
    ],
  },
  {
    id: "google-drive",
    name: "Google Drive",
    desc: "File storage and sharing",
    icon: HardDrive,
    logo: SKILL_ICON["google-drive"],
    prompt: "Search Google Drive for files related to [keyword]",
    tag: "file-knowledge",
    source: "official",
    tools: [{ id: "google-drive", name: "Google Drive", provider: "Google" }],
    longDesc:
      "With Google Drive connected, nexu can upload, download, search files and manage sharing permissions.",
    examples: [
      "Search Google Drive for product specs",
      "Share this file with the team",
      "List recently modified files",
    ],
  },
  {
    id: "google-sheets",
    name: "Google Sheets",
    desc: "Spreadsheet data management",
    icon: Table,
    logo: SKILL_ICON["google-sheets"],
    prompt: "Create a Google Sheet about [topic]",
    tag: "file-knowledge",
    source: "official",
    tools: [{ id: "google-sheets", name: "Google Sheets", provider: "Google" }],
    longDesc:
      "With Google Sheets connected, nexu can create, read and update spreadsheet data with formulas and analysis.",
    examples: [
      "Create a budget spreadsheet in Google Sheets",
      "Read data from this spreadsheet",
      "Update sales data in the sheet",
    ],
  },
  {
    id: "notion",
    name: "Notion",
    desc: "Knowledge base and page management",
    icon: FileText,
    logo: SKILL_ICON.notion,
    prompt: "Create a Notion page with title [title]",
    tag: "file-knowledge",
    source: "official",
    tools: [{ id: "notion", name: "Notion", provider: "Notion" }],
    longDesc:
      "With Notion connected, nexu can create and edit pages, manage databases and search document content.",
    examples: [
      "Create a Notion page: Product requirements",
      "Search Notion for tech architecture docs",
      "Update this Notion page",
    ],
  },
  {
    id: "onedrive",
    name: "OneDrive",
    desc: "Cloud file storage and sync",
    icon: CloudCog,
    prompt: "Search OneDrive for files related to [keyword]",
    tag: "file-knowledge",
    source: "official",
    tools: [{ id: "onedrive", name: "OneDrive", provider: "Microsoft" }],
    longDesc:
      "With OneDrive connected, nexu can upload, download, search files and manage sharing permissions.",
    examples: [
      "Search OneDrive for product specs",
      "Upload this file to OneDrive",
      "Share this file with the team",
    ],
  },
  {
    id: "excel",
    name: "Excel",
    desc: "Data processing and analysis",
    icon: TableProperties,
    prompt: "Analyze this Excel file's data",
    tag: "file-knowledge",
    source: "official",
    tools: [{ id: "excel", name: "Excel", provider: "Microsoft" }],
    longDesc: "With Excel connected, nexu can read, edit and analyze spreadsheet data.",
    examples: [
      "Analyze this Excel file's data",
      "Create a pivot table",
      "Export this data to Excel",
    ],
  },
  {
    id: "airtable",
    name: "Airtable",
    desc: "Database and spreadsheet collaboration",
    icon: Table,
    logo: SKILL_ICON.airtable,
    prompt: "View [table name] data in Airtable",
    tag: "file-knowledge",
    source: "official",
    tools: [{ id: "airtable", name: "Airtable", provider: "Airtable" }],
    longDesc:
      "With Airtable connected, nexu can manage table data, create views and automate workflows.",
    examples: [
      "View project tracker in Airtable",
      "Create a new record",
      "Filter tasks with status In Progress",
    ],
  },
  {
    id: "pdf-processing",
    name: "PDF Processing",
    desc: "PDF parse, extract, convert and summarize",
    icon: FileScan,
    prompt: "Extract this PDF content and generate a summary",
    tag: "file-knowledge",
    source: "official",
    github: "https://github.com/anthropics/pdf",
    longDesc:
      "AI-powered PDF processing: parse content, extract tables and images, generate summaries, format conversion.",
    examples: [
      "Extract this PDF content and summarize",
      "Extract tables from this PDF",
      "List key clauses from this contract",
    ],
  },
  {
    id: "word-doc",
    name: "Word Document",
    desc: "Word doc create, edit and format",
    icon: FileEdit,
    prompt: "Create a Word document about [topic]",
    tag: "file-knowledge",
    source: "official",
    github: "https://github.com/anthropics/docx",
    longDesc: "AI-powered Word processing: create, edit, format and apply templates.",
    examples: [
      "Create a project proposal Word doc",
      "Format this doc with company template",
      "Fix this report's layout",
    ],
  },
  {
    id: "ppt-presentation",
    name: "PPT Presentation",
    desc: "Presentation create and edit",
    icon: Presentation,
    prompt: "Create a PPT about [topic]",
    tag: "file-knowledge",
    source: "official",
    github: "https://github.com/anthropics/pptx",
    longDesc:
      "AI-powered PPT processing: create presentations, add content and charts, apply templates.",
    examples: [
      "Create a Q1 performance PPT",
      "Add data charts to this PPT",
      "Reformat this deck with company template",
    ],
  },
  {
    id: "excel-analysis",
    name: "Excel Analysis",
    desc: "AI-driven spreadsheet data analysis",
    icon: PieChart,
    prompt: "Analyze this spreadsheet data and find trends",
    tag: "file-knowledge",
    source: "official",
    github: "https://github.com/anthropics/xlsx",
    longDesc:
      "AI-powered Excel analysis: data cleaning, formula generation, chart creation and trend analysis.",
    examples: [
      "Analyze this data and find trends",
      "Create a pivot table",
      "Write a formula for growth rate",
    ],
  },
  {
    id: "doc-coauthoring",
    name: "Doc Coauthoring",
    desc: "Multi-user collaboration and versioning",
    icon: UsersRound,
    prompt: "Integrate team document feedback",
    tag: "file-knowledge",
    source: "official",
    github: "https://github.com/anthropics/doc-coauthoring",
    longDesc:
      "AI-powered doc collaboration: multi-user editing, feedback integration, version diff and conflict resolution.",
    examples: [
      "Integrate team document feedback",
      "Compare these two versions",
      "Summarize comments into edit suggestions",
    ],
  },

  // ━━ 3. Creative & Design (6) ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  {
    id: "ppt-maker",
    name: "PPT Maker",
    desc: "Web-based slide creation",
    icon: FileSliders,
    prompt: "Create a polished slide deck about [topic]",
    tag: "creative-design",
    source: "official",
    github: "https://github.com/zarazhangrui/frontend-slides",
    longDesc:
      "Create polished slides on the web with AI frontend. Rich animations and themes. Popular skill (8.3k Stars).",
    examples: [
      "Create slides for a product launch",
      "Turn this content into a presentation",
      "Design a pitch deck PPT",
    ],
  },
  {
    id: "ux-design",
    name: "UX Design",
    desc: "Professional UI/UX design for multi-platform",
    icon: Paintbrush,
    prompt: "Design a UI for [feature]",
    tag: "creative-design",
    source: "official",
    github: "https://github.com/nextlevelbuilder/ui-ux-pro-max-skill",
    longDesc:
      "AI design assistant for professional UI/UX across mobile, web and desktop. Popular skill (37.6k Stars).",
    examples: [
      "Design a login page UI",
      "Improve this page's UX",
      "Design a mobile interaction flow",
    ],
  },
  {
    id: "canvas-design",
    name: "Canvas Design",
    desc: "AI-driven canvas design and visualization",
    icon: SwatchBook,
    prompt: "Design a [type] canvas",
    tag: "creative-design",
    source: "official",
    github: "https://github.com/anthropics/canvas-design",
    longDesc: "AI-powered canvas design for infographics, flowcharts, posters and more.",
    examples: [
      "Design a product infographic",
      "Draw a system architecture diagram",
      "Create a social media poster",
    ],
  },
  {
    id: "brand-guidelines",
    name: "Brand Guidelines",
    desc: "Brand visual guidelines management",
    icon: Brush,
    prompt: "Create a brand guidelines document",
    tag: "creative-design",
    source: "official",
    github: "https://github.com/anthropics/brand-guidelines",
    longDesc:
      "AI-powered brand guidelines to establish and maintain visual consistency across design outputs.",
    examples: [
      "Create a brand guidelines doc",
      "Check if this design matches brand",
      "Generate a brand color palette",
    ],
  },
  {
    id: "copywriting",
    name: "Copywriting",
    desc: "AI copy creation and optimization",
    icon: PenTool,
    prompt: "Write copy for [scenario]",
    tag: "creative-design",
    source: "official",
    github: "https://github.com/skillmd-ai/copywriting",
    longDesc: "AI-powered copywriting for marketing, product and social media copy.",
    examples: [
      "Write product launch copy",
      "Optimize this landing page copy",
      "Write social media promo copy",
    ],
  },
  {
    id: "frontend-design",
    name: "Frontend Design",
    desc: "AI frontend design and prototyping",
    icon: Blocks,
    prompt: "Design a frontend prototype for [feature]",
    tag: "creative-design",
    source: "official",
    github: "https://github.com/anthropics/frontend-design",
    longDesc: "AI-powered frontend design for high-fidelity prototypes. React, Vue and more.",
    examples: [
      "Design a settings page prototype",
      "Convert this Figma design to code",
      "Design a responsive navbar",
    ],
  },

  // ━━ 4. Business Analytics (9) ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  {
    id: "hubspot",
    name: "HubSpot",
    desc: "CRM and marketing automation",
    icon: Users,
    logo: SKILL_ICON.hubspot,
    prompt: "View recent leads in HubSpot",
    tag: "biz-analysis",
    source: "official",
    tools: [{ id: "hubspot", name: "HubSpot", provider: "HubSpot" }],
    longDesc:
      "With HubSpot connected, nexu can manage CRM, automate marketing emails and analyze sales data.",
    examples: [
      "View recent HubSpot leads",
      "Create a marketing email template",
      "Analyze this month's sales funnel",
    ],
  },
  {
    id: "salesforce",
    name: "Salesforce",
    desc: "CRM platform",
    icon: UserCheck,
    prompt: "View recent sales opportunities in Salesforce",
    tag: "biz-analysis",
    source: "official",
    tools: [{ id: "salesforce", name: "Salesforce", provider: "Salesforce" }],
    longDesc:
      "With Salesforce connected, nexu can manage CRM, track opportunities and generate reports.",
    examples: [
      "View recent Salesforce opportunities",
      "Create a new customer record",
      "Generate monthly sales report",
    ],
  },
  {
    id: "alpha-vantage",
    name: "Alpha Vantage",
    desc: "Stock and financial market data",
    icon: DollarSign,
    prompt: "Check latest quote for [stock symbol]",
    tag: "biz-analysis",
    source: "official",
    longDesc: "Alpha Vantage provides global stocks, forex and crypto data. No API key required.",
    examples: [
      "Check AAPL latest quote",
      "View TSLA trend over past month",
      "Compare GOOG vs MSFT performance",
    ],
  },
  {
    id: "news-monitor",
    name: "News Monitor",
    desc: "Real-time news and industry tracking",
    icon: Newspaper,
    prompt: "Monitor latest news for [industry/keyword]",
    tag: "biz-analysis",
    source: "official",
    github: "https://github.com/browser-act/google-news-api",
    longDesc:
      "AI-powered news monitoring: track industry news, competitor moves, market signals. Auto-summarize and report.",
    examples: [
      "Monitor AI industry news",
      "Track competitor updates",
      "Generate weekly industry news digest",
    ],
  },
  {
    id: "competitor-analysis",
    name: "Competitor Analysis",
    desc: "AI competitor comparison and positioning",
    icon: TrendingUp,
    prompt: "Analyze [competitor] product strategy",
    tag: "biz-analysis",
    source: "official",
    github: "https://github.com/browser-act/amazon-competitor-analyzer",
    longDesc:
      "AI-powered competitor analysis: collect data, compare features, analyze positioning and pricing.",
    examples: [
      "Analyze Notion AI product strategy",
      "Compare our features vs competitors",
      "Create competitor pricing analysis",
    ],
  },
  {
    id: "lead-research",
    name: "Lead Research",
    desc: "Prospect research and qualification",
    icon: UserSearch,
    prompt: "Research [company] as a potential lead",
    tag: "biz-analysis",
    source: "official",
    github: "https://github.com/davila7/lead-research-assistant",
    longDesc:
      "AI-powered lead research: collect and analyze prospect info, assess fit and priority.",
    examples: [
      "Research Stripe as a lead",
      "Prioritize this batch of leads",
      "Map this company's decision chain",
    ],
  },
  {
    id: "seo-analysis",
    name: "SEO Analysis",
    desc: "Search engine optimization analysis",
    icon: SearchCheck,
    prompt: "Analyze [website] SEO status",
    tag: "biz-analysis",
    source: "official",
    github: "https://github.com/AgriciDaniel/claude-seo",
    longDesc:
      "AI-powered SEO analysis: diagnose issues, analyze keyword rankings, provide optimization suggestions.",
    examples: [
      "Analyze website SEO status",
      "Find keywords with ranking drops",
      "Write an SEO-optimized article outline",
    ],
  },
  {
    id: "data-analysis",
    name: "Data Analysis",
    desc: "AI-driven data analysis and visualization",
    icon: ScanSearch,
    prompt: "Analyze this data and find key insights",
    tag: "biz-analysis",
    source: "official",
    github: "https://github.com/skillmd-ai/data-analysis",
    longDesc: "AI-powered data analysis: cleaning, stats, trend forecasting and visualization.",
    examples: [
      "Analyze this data for insights",
      "Create a user growth trend chart",
      "Forecast next month's key metrics",
    ],
  },
  {
    id: "marketing-toolkit",
    name: "Marketing Toolkit",
    desc: "All-in-one marketing strategy and content",
    icon: Megaphone,
    prompt: "Create a marketing plan for [product/campaign]",
    tag: "biz-analysis",
    source: "official",
    github: "https://github.com/coreyhaines31/marketingskills",
    longDesc:
      "All-in-one marketing: strategy, content planning, channel analysis and performance tracking.",
    examples: [
      "Create a product launch marketing plan",
      "Generate a monthly content calendar",
      "Analyze channel ROI",
    ],
  },

  // ━━ 5. Audio & Video Generation (7) ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  {
    id: "fish-audio",
    name: "Fish Audio",
    desc: "Text-to-speech, voice cloning",
    icon: AudioLines,
    logo: SKILL_ICON["fish-audio"],
    prompt: "Convert this text to speech with Fish Audio",
    tag: "av-generation",
    source: "official",
    longDesc:
      "Fish Audio provides high-quality TTS with voice cloning and multi-language support. No API key required.",
    examples: [
      "Convert this text to speech with Fish Audio",
      "Clone a voice to read this article",
      "Generate Chinese speech",
    ],
  },
  {
    id: "nano-banana-pro",
    name: "Nano Banana Pro",
    desc: "Google Nano Banana Pro model",
    icon: Wand2,
    logo: SKILL_ICON["nano-banana"],
    prompt: "Generate [content] with Nano Banana Pro",
    tag: "av-generation",
    source: "official",
    longDesc:
      "Google Nano Banana Pro AI model for high-quality image generation. No API key required.",
    examples: [
      "Generate a product poster with Nano Banana Pro",
      "Generate a Logo with Nano Banana Pro",
    ],
  },
  {
    id: "nano-banana-2",
    name: "Nano Banana 2",
    desc: "Nano Banana upgraded",
    icon: Zap,
    logo: SKILL_ICON["nano-banana"],
    prompt: "Generate [content] with Nano Banana 2",
    tag: "av-generation",
    source: "official",
    longDesc:
      "Google Nano Banana 2 upgraded model for higher quality generation. No API key required.",
    examples: [
      "Generate an illustration with Nano Banana 2",
      "Generate product images with Nano Banana 2",
    ],
  },
  {
    id: "seedream",
    name: "Seedream 4.5",
    desc: "Image generation",
    icon: ImagePlus,
    prompt: "Generate an image with text using Seedream",
    tag: "av-generation",
    source: "official",
    longDesc:
      "Volcengine Seedream 4.5 excels at images with Chinese/English text. Clear, accurate rendering. No API key.",
    examples: [
      'Generate a poster with "Happy New Year" using Seedream',
      "Generate a product image with English slogan",
      "Generate a social media cover image",
    ],
  },
  {
    id: "volcengine-avatar",
    name: "Volcengine Avatar",
    desc: "AI digital human video generation",
    icon: CpuIcon,
    logo: SKILL_ICON.volcengine,
    prompt: "Generate a [topic] video with digital human",
    tag: "av-generation",
    source: "official",
    longDesc:
      "Volcengine AI digital human for realistic avatar videos. Product demos, training. No API key.",
    examples: [
      "Generate a product intro video with digital human",
      "Create a digital human to present this PPT",
      "Generate a training video with digital human",
    ],
  },
  {
    id: "wan-2",
    name: "Wan 2.0",
    desc: "Text-to-video, image-to-video",
    icon: Film,
    prompt: "Turn this image into video with Wan 2.0",
    tag: "av-generation",
    source: "official",
    longDesc: "Volcengine Wan 2.0 supports image-to-video, text-to-video and more. No API key.",
    examples: [
      "Turn this image into video with Wan 2.0",
      "Generate a video from text description",
      "Make product screenshots into animated demo",
    ],
  },
  {
    id: "kling",
    name: "Kling",
    desc: "Image and video generation",
    icon: Lightbulb,
    logo: SKILL_ICON.kling,
    prompt: "Generate an image with Kling: [description]",
    tag: "av-generation",
    source: "official",
    longDesc:
      "Kuaishou Kling for high-quality image/video generation and editing. No API key required.",
    examples: [
      "Generate a product promo image with Kling",
      "Generate a short video with Kling",
      "Edit this image with Kling",
    ],
  },

  // ━━ 6. Information & Content (13) ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  {
    id: "google-analytics",
    name: "Google Analytics",
    desc: "Website traffic and user behavior",
    icon: BarChart3,
    logo: SKILL_ICON["google-analytics"],
    prompt: "View website traffic for the past week",
    tag: "info-content",
    source: "official",
    tools: [{ id: "google-analytics", name: "Google Analytics", provider: "Google" }],
    longDesc:
      "With Google Analytics connected, nexu can view traffic, user behavior and conversion tracking.",
    examples: [
      "View website traffic for past week",
      "Analyze user acquisition channels",
      "Compare last week vs this week conversion",
    ],
  },
  {
    id: "google-maps",
    name: "Google Maps",
    desc: "Location and routing",
    icon: MapIcon,
    logo: SKILL_ICON["google-maps"],
    prompt: "Get directions from [origin] to [destination]",
    tag: "info-content",
    source: "official",
    tools: [{ id: "google-maps", name: "Google Maps", provider: "Google" }],
    longDesc:
      "With Google Maps connected, nexu can query routes, traffic, place search and geocoding.",
    examples: [
      "Get fastest route from office to airport",
      "Search nearby coffee shops",
      "Get coordinates for this address",
    ],
  },
  {
    id: "facebook",
    name: "Facebook",
    desc: "Social content platform",
    icon: Globe,
    logo: SKILL_ICON.facebook,
    prompt: "Post a Facebook update",
    tag: "info-content",
    source: "official",
    tools: [{ id: "facebook", name: "Facebook", provider: "Meta" }],
    longDesc:
      "With Facebook connected, nexu can manage pages, post content, view engagement and manage ads.",
    examples: [
      "Post a Facebook update",
      "View recent page engagement",
      "Manage Facebook ad campaigns",
    ],
  },
  {
    id: "instagram",
    name: "Instagram",
    desc: "Photo and video social platform",
    icon: Image,
    logo: SKILL_ICON.instagram,
    prompt: "Post an Instagram post",
    tag: "info-content",
    source: "official",
    tools: [{ id: "instagram", name: "Instagram", provider: "Meta" }],
    longDesc:
      "With Instagram connected, nexu can create and post content, manage comments and view analytics.",
    examples: ["Post an Instagram post", "View recent post engagement", "Reply to latest comments"],
  },
  {
    id: "x-twitter",
    name: "X (Twitter)",
    desc: "Real-time information stream",
    icon: Globe,
    logo: SKILL_ICON["x-twitter"],
    prompt: "Post a tweet: [content]",
    tag: "info-content",
    source: "official",
    tools: [{ id: "x", name: "X (Twitter)", provider: "X" }],
    longDesc:
      "With X (Twitter) connected, nexu can post tweets, reply to comments, track trends and create content.",
    examples: [
      "Post a tweet: We just launched nexu v0.3",
      "View AI-related trending topics",
      "Write a tweet about product updates",
    ],
  },
  {
    id: "reddit",
    name: "Reddit",
    desc: "Community content and discussion",
    icon: Globe,
    logo: SKILL_ICON.reddit,
    prompt: "Search Reddit for discussions about [topic]",
    tag: "info-content",
    source: "official",
    tools: [{ id: "reddit", name: "Reddit", provider: "Reddit" }],
    longDesc:
      "With Reddit connected, nexu can search discussions, post, manage comments and track trending topics.",
    examples: [
      "Search Reddit for AI Agent discussions",
      "Post to r/programming",
      "Track r/startups hot posts",
    ],
  },
  {
    id: "youtube",
    name: "YouTube",
    desc: "Video content platform",
    icon: Video,
    logo: SKILL_ICON.youtube,
    prompt: "Search YouTube for videos about [topic]",
    tag: "info-content",
    source: "official",
    tools: [{ id: "youtube", name: "YouTube", provider: "Google" }],
    longDesc:
      "With YouTube connected, nexu can search videos, view trend data and manage channel content.",
    examples: [
      "Search YouTube for AI Agent videos",
      "View recent channel analytics",
      "Analyze trending video patterns",
    ],
  },
  {
    id: "perplexity",
    name: "Perplexity",
    desc: "AI real-time search",
    icon: Search,
    logo: SKILL_ICON.perplexity,
    prompt: "Search [query] with Perplexity",
    tag: "info-content",
    source: "official",
    longDesc:
      "Perplexity is AI-powered search with real-time web and cited sources. No API key required.",
    examples: [
      "Search Perplexity for latest AI Agent progress",
      "Find solution for this tech question",
      "Synthesize different perspectives on this topic",
    ],
  },
  {
    id: "apollo",
    name: "Apollo",
    desc: "Company and contact data",
    icon: Contact,
    prompt: "Search Apollo for contacts at [company]",
    tag: "info-content",
    source: "official",
    longDesc:
      "Apollo provides company and contact data for finding prospects and partners. No API key required.",
    examples: [
      "Search Apollo for Stripe contacts",
      "Get basic info for this company",
      "Find CTO-level contacts",
    ],
  },
  {
    id: "jina",
    name: "Jina",
    desc: "URL reading and web parsing",
    icon: GlobeLock,
    logo: SKILL_ICON.jina,
    prompt: "Read this URL content with Jina",
    tag: "info-content",
    source: "official",
    longDesc:
      "Jina reads any URL, extracts and structures web content for analysis and data extraction. No API key.",
    examples: [
      "Read this webpage content with Jina",
      "Extract article body from this page",
      "Convert this page to Markdown",
    ],
  },
  {
    id: "hunter",
    name: "Hunter",
    desc: "Business email finder",
    icon: MailCheck,
    prompt: "Find [company] emails with Hunter",
    tag: "info-content",
    source: "official",
    longDesc:
      "Hunter finds and verifies professional contact emails for business development and recruiting. No API key.",
    examples: [
      "Find Stripe emails with Hunter",
      "Verify this email address",
      "Find CEO email for this company",
    ],
  },
  {
    id: "linkup",
    name: "Linkup",
    desc: "LinkedIn professional search",
    icon: Contact,
    prompt: "Search Linkup for people at [role/company]",
    tag: "info-content",
    source: "official",
    longDesc:
      "Linkup provides smart LinkedIn search for finding professionals by role and company. No API key.",
    examples: [
      "Search for PMs at Google",
      "Find CTOs in AI",
      "Search frontend engineers in San Francisco",
    ],
  },
  {
    id: "twily",
    name: "Twily",
    desc: "Phone and SMS communication",
    icon: Phone,
    prompt: "Send an SMS via Twily to [number]",
    tag: "info-content",
    source: "official",
    longDesc:
      "Twily provides phone and SMS communication with multi-channel messaging. No API key required.",
    examples: ["Send SMS to +86 138xxxx", "Place a call via Twily", "Send a verification code SMS"],
  },

  // ━━ 7. Development & Tools (5) ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  {
    id: "github",
    name: "GitHub",
    desc: "Code repository and API",
    icon: Link2,
    logo: SKILL_ICON.github,
    prompt: "View recent PR and Issue status for [repo]",
    tag: "dev-tools",
    source: "official",
    tools: [{ id: "github", name: "GitHub", provider: "GitHub" }],
    longDesc:
      "With GitHub connected, nexu can manage repos, create and review PRs, manage Issues and search code.",
    examples: [
      "View nexu-app PR and Issue status",
      "Create a PR to fix this bug",
      "Review this PR's code",
    ],
  },
  {
    id: "gitlab",
    name: "GitLab",
    desc: "DevOps platform",
    icon: Link2,
    logo: SKILL_ICON.gitlab,
    prompt: "View Merge Request status for [project] on GitLab",
    tag: "dev-tools",
    source: "official",
    tools: [{ id: "gitlab", name: "GitLab", provider: "GitLab" }],
    longDesc:
      "With GitLab connected, nexu can manage projects, Merge Requests, CI/CD pipelines and Issue tracking.",
    examples: [
      "View recent GitLab Merge Requests",
      "Check CI/CD pipeline status",
      "Create a new Issue",
    ],
  },
  {
    id: "stripe",
    name: "Stripe",
    desc: "Payment infrastructure",
    icon: DollarSign,
    logo: SKILL_ICON.stripe,
    prompt: "View recent Stripe transactions",
    tag: "dev-tools",
    source: "official",
    tools: [{ id: "stripe", name: "Stripe", provider: "Stripe" }],
    longDesc:
      "With Stripe connected, nexu can view transactions, manage subscriptions and analyze revenue.",
    examples: [
      "View recent Stripe transactions",
      "Analyze this month's revenue trend",
      "View subscription churn rate",
    ],
  },
  {
    id: "skill-creator",
    name: "Skill Creator",
    desc: "Create or improve custom skills",
    icon: Sparkles,
    prompt: "Create a custom Skill",
    tag: "dev-tools",
    source: "custom",
    github: "https://github.com/anthropics/skill-creator",
    longDesc:
      "AI-powered Skill Creator for building and publishing custom AI Skills. Templates and visual config.",
    examples: [
      "Create a custom Skill",
      "Package this workflow as a Skill",
      "Generate docs for this Skill",
    ],
  },
  {
    id: "web-artifacts",
    name: "Web Artifacts Builder",
    desc: "Quick Web tools and interactive apps",
    icon: Code,
    prompt: "Build a Web tool for [feature]",
    tag: "dev-tools",
    source: "official",
    github: "https://github.com/anthropics/web-artifacts-builder",
    longDesc:
      "AI-powered Web tool builder for interactive apps, calculators, visualizations and more.",
    examples: [
      "Build an ROI calculator",
      "Create an interactive data visualization page",
      "Build a simple form tool",
    ],
  },

  // ━━ Installed Skills ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  // -- Code --
  {
    id: "claude-code",
    name: "Claude Code",
    desc: "Delegate complex coding tasks to Claude Code",
    icon: Terminal,
    logo: SKILL_ICON.claude,
    prompt: "Use Claude Code to implement [feature]",
    tag: "dev-tools",
    source: "custom",
    github: "https://github.com/anthropics/claude-code",
    longDesc:
      "Delegate complex programming tasks to Claude Code / Codex. Handles multi-file refactors, full-stack features, and code generation.",
    examples: [
      "Implement the auth module",
      "Refactor the database layer",
      "Write unit tests for the API",
    ],
  },
  {
    id: "coding-agent",
    name: "Coding Agent",
    desc: "Autonomous coding agent for GitHub workflows",
    icon: Bot,
    prompt: "Use Coding Agent to work on [task]",
    tag: "dev-tools",
    source: "custom",
    github: "https://github.com/anthropics/coding-agent",
    longDesc:
      "Autonomous coding agent that handles GitHub issues, PR reviews, CI operations and complex multi-step programming tasks.",
    examples: [
      "Fix the failing CI build",
      "Review and merge this PR",
      "Implement the feature from Issue #42",
    ],
  },
  {
    id: "gh-issues",
    name: "GH Issues",
    desc: "Batch process GitHub issues, auto-open PRs",
    icon: GitPullRequest,
    logo: SKILL_ICON.github,
    prompt: "Process GitHub issues in [repo]",
    tag: "dev-tools",
    source: "custom",
    github: "https://github.com/anthropics/gh-issues",
    longDesc:
      "Batch process GitHub issues — triage, label, auto-open PRs, and close stale issues. Streamlines issue-driven development.",
    examples: [
      "Triage all open issues in nexu-app",
      "Auto-open PRs for good-first-issue",
      "Close stale issues older than 30 days",
    ],
  },

  // -- Content Marketing Automation --
  {
    id: "brave-search",
    name: "Brave Search",
    desc: "Web search via Brave Search API",
    icon: Compass,
    logo: SKILL_ICON.brave,
    prompt: "Search the web for [topic]",
    tag: "info-content",
    source: "custom",
    longDesc:
      "Search the web using Brave Search API. Get real-time results for research, competitive analysis, and content creation.",
    examples: [
      "Search for latest AI agent frameworks",
      "Find competitor pricing pages",
      "Research market trends in SaaS",
    ],
  },
  {
    id: "article-reader",
    name: "Article Reader",
    desc: "Read and extract content from web articles",
    icon: BookOpen,
    prompt: "Read and summarize [URL]",
    tag: "info-content",
    source: "custom",
    longDesc:
      "Read web articles, extract key content, and summarize. Supports blogs, news sites, and documentation pages.",
    examples: [
      "Summarize this blog post",
      "Extract key points from this article",
      "Read and compare these two articles",
    ],
  },
  {
    id: "content-writer",
    name: "Content Writer",
    desc: "AI writing for blogs, social posts, and marketing copy",
    icon: Pen,
    prompt: "Write a [type] about [topic]",
    tag: "info-content",
    source: "custom",
    longDesc:
      "AI-powered content writing for blogs, social media posts, newsletters, marketing copy, and long-form articles.",
    examples: [
      "Write a blog post about AI agents",
      "Draft a Twitter thread on product launch",
      "Create newsletter copy for this week",
    ],
  },
  {
    id: "listenhub",
    name: "ListenHub",
    desc: "AI audio generation and podcast creation",
    icon: Mic,
    logo: SKILL_ICON.listenhub,
    prompt: "Generate audio for [content]",
    tag: "av-generation",
    source: "custom",
    longDesc:
      "AI audio generation for podcasts, voiceovers, and audio content. Convert text to speech with natural-sounding voices.",
    examples: [
      "Generate a podcast intro",
      "Create voiceover for this script",
      "Convert blog post to audio",
    ],
  },
  {
    id: "liblibtv",
    name: "LiblibTV",
    desc: "AI video generation for marketing and product",
    icon: Clapperboard,
    logo: SKILL_ICON.liblibtv,
    prompt: "Generate a video for [content]",
    tag: "av-generation",
    source: "custom",
    longDesc:
      "AI video generation for marketing videos, product demos, and social media content. Supports text-to-video and image-to-video.",
    examples: [
      "Create a product demo video",
      "Generate a social media video ad",
      "Make an explainer video",
    ],
  },

  // -- Foundation Skills --
  {
    id: "clawhub",
    name: "ClawHub",
    desc: "Search and install new skills from ClawHub",
    icon: Store,
    logo: SKILL_ICON.clawhub,
    prompt: "Search ClawHub for [skill type]",
    tag: "dev-tools",
    source: "custom",
    longDesc:
      "Browse and install new skills from the ClawHub marketplace. Discover community-built skills and integrations.",
    examples: [
      "Search for SEO skills",
      "Find a Shopify integration skill",
      "Browse trending skills",
    ],
  },
  {
    id: "find-skills",
    name: "Find Skills",
    desc: "Help you find the right skill for your task",
    icon: Compass,
    prompt: "Find a skill for [task]",
    tag: "dev-tools",
    source: "custom",
    longDesc:
      "AI-powered skill discovery. Describe what you want to do and get matched with the best available skills.",
    examples: [
      "Find a skill for social media scheduling",
      "What skill can help with SEO?",
      "Recommend skills for data analysis",
    ],
  },
  {
    id: "skill-vetter",
    name: "Skill Vetter",
    desc: "Security review before installing new skills",
    icon: ShieldCheck,
    prompt: "Review [skill] before installation",
    tag: "dev-tools",
    source: "custom",
    longDesc:
      "Security and quality review for new skills before installation. Checks permissions, data access, and code quality.",
    examples: [
      "Review this skill before installing",
      "Check permissions for this community skill",
      "Audit this skill's data access",
    ],
  },
];

// ── Grouped by tag for SKILL_CATEGORIES ──────────────────────────

export const SKILL_CATEGORIES: SkillCategory[] = [
  {
    id: "office-collab",
    label: "Office & Collaboration",
    icon: MessageSquare,
    skills: ALL_SKILLS.filter((s) => s.tag === "office-collab"),
  },
  {
    id: "file-knowledge",
    label: "Files & Knowledge",
    icon: FileText,
    skills: ALL_SKILLS.filter((s) => s.tag === "file-knowledge"),
  },
  {
    id: "creative-design",
    label: "Creative & Design",
    icon: Palette,
    skills: ALL_SKILLS.filter((s) => s.tag === "creative-design"),
  },
  {
    id: "biz-analysis",
    label: "Business Analysis",
    icon: BarChart3,
    skills: ALL_SKILLS.filter((s) => s.tag === "biz-analysis"),
  },
  {
    id: "av-generation",
    label: "Audio & Video",
    icon: Video,
    skills: ALL_SKILLS.filter((s) => s.tag === "av-generation"),
  },
  {
    id: "info-content",
    label: "Info & Content",
    icon: Search,
    skills: ALL_SKILLS.filter((s) => s.tag === "info-content"),
  },
  {
    id: "dev-tools",
    label: "Dev & Tools",
    icon: Link2,
    skills: ALL_SKILLS.filter((s) => s.tag === "dev-tools"),
  },
];

export const DEFAULT_AUTHORIZED_TOOLS = new Set([
  "gmail",
  "gcal",
  "github",
  "slack",
  "notion",
  "google-docs",
  "google-drive",
  "google-sheets",
]);

export function findSkillById(id: string): { skill: SkillDef; category: SkillCategory } | null {
  for (const cat of SKILL_CATEGORIES) {
    const skill = cat.skills.find((s) => s.id === id);
    if (skill) return { skill, category: cat };
  }
  return null;
}
