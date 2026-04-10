import { type ReactNode, createContext, useCallback, useContext, useState } from "react";

export type Locale = "en" | "zh";

interface LocaleCtx {
  locale: Locale;
  setLocale: (l: Locale) => void;
  t: (key: string) => string;
}

const STORAGE_KEY = "nexu_locale";

function detectDefault(): Locale {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === "en" || stored === "zh") return stored;
  } catch {
    /* ignore */
  }
  const lang = navigator.language || "";
  return lang.startsWith("zh") ? "zh" : "en";
}

const LocaleContext = createContext<LocaleCtx>({
  locale: "en",
  setLocale: () => {},
  t: (k) => k,
});

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(detectDefault);

  const setLocale = useCallback((l: Locale) => {
    setLocaleState(l);
    try {
      localStorage.setItem(STORAGE_KEY, l);
    } catch {
      /* ignore */
    }
  }, []);

  const t = useCallback(
    (key: string) => {
      const dict = locale === "zh" ? zh : en;
      return (dict as Record<string, string>)[key] ?? key;
    },
    [locale],
  );

  return (
    <LocaleContext.Provider value={{ locale, setLocale, t }}>{children}</LocaleContext.Provider>
  );
}

export function useLocale() {
  return useContext(LocaleContext);
}

// ─── Translations ───

const en: Record<string, string> = {
  // Landing - Header
  "nav.skills": "Skills",
  "nav.features": "Features",
  "nav.useCases": "Use Cases",
  "nav.customers": "Customers",
  "nav.signIn": "Sign in",
  "nav.getStarted": "Get started free",
  "nav.starOnGithub": "Star on GitHub",

  // Landing - Hero
  "hero.title": "Your AI coworker, open source",
  "hero.subtitle":
    "Multi-model AI agent that lives in Feishu, Slack & Discord. MIT licensed, self-hostable, ready in 1 minute.",

  // Landing - Core USP
  "usp.label": "Why nexu",
  "usp.title": "Multi-model engine. Native IM integration. Fully open source.",

  // Landing - Bento
  "bento.card1.title": "Multi-model, one interface",
  "bento.card1.desc":
    "Claude Opus 4.6, GPT-5.4, Gemini 3.0 — switch models freely. Bring your own key or use ours.",
  "bento.card2.title": "MIT open source, self-hostable",
  "bento.card2.desc":
    "Full source on GitHub. Deploy on your own infra, keep data under your control. No vendor lock-in, ever.",
  "bento.card3.title": "Native in Feishu, Slack & Discord",

  // Landing - Tools
  "tools.label": "Extensible",
  "tools.sublabel": "Skills & Integrations",
  "tools.title": "1,000+ TOOLS. INSTALL IN ONE CLICK.",

  // Landing - Strikethrough
  "strike.1": "Vendor lock-in",
  "strike.2": "Black-box AI",
  "strike.3": "Data leaving your servers",

  // Landing - Everything
  "everything.title": "One agent, every channel —",

  // Landing - Features intro
  "features.label": "Open source. Built for teams.",
  "features.intro": "One AI teammate across every channel",

  // Landing - Feature accordion
  "feat.1.title": "Multi-model freedom",
  "feat.1.desc":
    "Claude Opus 4.6, GPT-5.4, Gemini 3.0 — use any model, switch anytime. Bring your own API key or use our hosted endpoint.",
  "feat.2.title": "IM-native agent",
  "feat.2.desc":
    "nexu lives where your team already works — Feishu, Slack, Discord. No new app to learn, no context switching.",
  "feat.3.title": "Open source & self-host",
  "feat.3.desc":
    "MIT licensed. Deploy on your own infrastructure, audit every line of code, keep all data on your servers.",
  "feat.4.title": "Skills marketplace",
  "feat.4.desc":
    "Install community-built skills in one click — from competitive analysis to sprint reviews. Or build your own.",
  "feat.5.title": "Memory that compounds",
  "feat.5.desc":
    "nexu remembers your context, preferences, and decisions. The longer you use it, the smarter it gets.",

  // Landing - KPI
  "kpi.heading1": "Built for",
  "kpi.heading2": "Real Teams",
  "kpi.1.label": "Setup time",
  "kpi.1.value": "<1 min",
  "kpi.1.desc":
    "Add nexu to your Slack or Discord workspace and start chatting immediately. No server setup required.",
  "kpi.2.label": "Models supported",
  "kpi.2.value": "10+",
  "kpi.2.desc":
    "Claude Opus 4.6, GPT-5.4, Gemini 3.0, Llama and more. Switch freely or bring your own API key.",
  "kpi.3.label": "IM platforms",
  "kpi.3.value": "3+",
  "kpi.3.desc": "Feishu, Slack, Discord — native integration. WhatsApp and Telegram coming soon.",
  "kpi.4.label": "License",
  "kpi.4.value": "MIT",
  "kpi.4.desc":
    "Fully open source under MIT license. Fork it, self-host it, extend it — no strings attached.",
  "kpi.5.label": "Community skills",
  "kpi.5.value": "100+",
  "kpi.5.desc":
    "Install pre-built skills for competitive analysis, sprint reviews, content creation, and more.",
  "kpi.6.label": "Data residency",
  "kpi.6.value": "100%",
  "kpi.6.desc": "Self-host on your own infrastructure. Your data never leaves your servers.",

  // Landing - Promise
  "promise.label": "Why open source",
  "promise.p1":
    "We believe AI that works alongside your team should be transparent, auditable, and under your control.",
  "promise.p2":
    "Most AI tools are black boxes — you send data to someone else's server, hope for the best, and have no idea what happens inside. That's not how we think work tools should be built.",
  "promise.p3":
    "nexu is MIT licensed. Every line of code is on GitHub. You can self-host it, fork it, extend it, audit it. Your conversations, your memory, your data — they stay yours.",
  "promise.p4":
    "Open source isn't just a license. It's a promise: the tool that runs your team's workflow will never hold your data hostage, never lock you in, never disappear behind a paywall.",

  // Landing - Community
  "community.label": "Community",
  "community.title": "Trusted by teams building the future of work",
  "community.card1":
    "nexu is fully open source under the MIT license. Inspect every line, self-host on your infrastructure, and extend with community-built skills. Your AI teammate, your rules.",
  "community.card2.label": "Multi-model",
  "community.card2":
    "Switch between Claude Opus 4.6, GPT-5.4, Gemini 3.0, and more — use the best model for each task without changing tools.",
  "community.card3": "Works with the tools you already use",

  // Landing - Footer
  "footer.copyright": "© 2026 nexu Technologies, Inc.",

  // Auth
  "auth.tagline": "Your AI coworker,\nstarts here",
  "auth.subtitle":
    "Connect Feishu, Slack, Discord — automate your team workflow with AI. Open source, secure, ready to go.",
  "auth.feat1": "Multi-model engine, Claude Opus 4.6 / GPT-5.4 / Gemini 3.0 out of the box",
  "auth.feat2": "Feishu, Slack, Discord native integration",
  "auth.feat3": "MIT open source license, full data ownership",
  "auth.github": "Star us on GitHub",
  "auth.createAccount": "Create account",
  "auth.welcomeBack": "Welcome back",
  "auth.chooseMethod": "Choose a method to start using nexu",
  "auth.loginToContinue": "Log in to continue using nexu",
  "auth.google": "Continue with Google",
  "auth.github.login": "Continue with GitHub",
  "auth.or": "or",
  "auth.emailRegister": "Email sign up",
  "auth.emailLogin": "Email log in",
  "auth.email.placeholder": "Your email",
  "auth.password.placeholder.register": "Set password (min 6 chars)",
  "auth.password.placeholder.login": "Your password",
  "auth.submit.register": "Create account",
  "auth.submit.login": "Log in",
  "auth.otherMethods": "← Other methods",
  "auth.hasAccount": "Already have an account?",
  "auth.noAccount": "Don't have an account?",
  "auth.login": "Log in",
  "auth.register": "Create account",
  "auth.terms": "Terms of Service",
  "auth.privacy": "Privacy Policy",
  "auth.error.email": "Please enter your email",
  "auth.error.emailInvalid": "Please enter a valid email",
  "auth.error.password": "Password must be at least 6 characters",
  "auth.success.title": "Connected!",
  "auth.success.desc":
    "Your Nexu desktop client is now connected to your cloud account. You can close this tab and return to the app.",
  "auth.success.countdown": "{n}s to auto-close",
  "auth.success.backToApp": "Back to app",
  "brand.label": "AI client for your work",
  "brand.title.line1": "OpenClaw,",
  "brand.title.line2": "ready to use.",
  "brand.body":
    "nexu turns OpenClaw into a truly ready-to-use product experience, bringing Feishu tools and top-tier model access into one unified workspace.",
  "brand.bullet.openclaw": "Turns OpenClaw into a truly out-of-the-box experience",
  "brand.bullet.feishu": "Deep support for Feishu tools and workflows",
  "brand.bullet.models":
    "Top-tier model access: Claude Opus 4.6, GPT-5.4, MiniMax 2.5, GLM 5.0, Kimi K2.5, and more",
  "brand.github": "Star us on GitHub",
  "welcome.pageTitle": "Welcome to nexu",
  "welcome.mobileLabel": "Client",
  "welcome.label": "Get started",
  "welcome.title": "Choose how to start",
  "welcome.subtitle":
    "Choose how you want to start with nexu. Use the official account path for the full experience, or connect your own API key directly.",
  "welcome.option.login.title": "Use your nexu account",
  "welcome.option.login.badge": "Recommended",
  "welcome.option.login.description":
    "Complete browser-based sign in and instantly access nexu hosted premium models and the full product experience.",
  "welcome.option.login.meta.1": "Google / GitHub / Email",
  "welcome.option.login.meta.2": "Browser OAuth",
  "welcome.option.login.meta.3": "Best for most users",
  "welcome.option.login.highlight.unlimited": "Unlimited usage",
  "welcome.option.byok.title": "Use your own models",
  "welcome.option.byok.badge": "BYOK",
  "welcome.option.byok.description":
    "Skip sign in and connect your own API keys directly. Local-first, flexible, and fully under your control.",
  "welcome.option.byok.meta.1": "No sign up required",
  "welcome.option.byok.meta.2": "Local configuration",
  "welcome.option.byok.meta.3": "Best for advanced users",
  "welcome.back": "Back to options",
  "welcome.byok.title": "Connect your models",
  "welcome.byok.subtitle":
    "No account required. Choose a provider and enter your API key. Every configuration stays under your control.",
  "welcome.byok.note":
    "Your API key is used only for this client configuration. You do not need to create a nexu account first.",
  "welcome.byok.verify.loading": "Verifying...",
  "welcome.byok.verify.idle": "Verify connection",
  "welcome.byok.success": "Connected, enter nexu",
  "welcome.customEndpoint": "API Base URL (e.g. http://localhost:11434/v1)",

  // Workspace — Nav & Sidebar
  "ws.nav.home": "Home",
  "ws.nav.deployments": "Deployments",
  "ws.nav.rewards": "Rewards",
  "ws.nav.skills": "Skills",
  "ws.nav.settings": "Settings",
  "ws.nav.conversations": "Conversations",
  "ws.sidebar.expand": "Expand sidebar",
  "ws.sidebar.collapse": "Collapse sidebar",
  "ws.sidebar.update": "Update",

  // Workspace — Update banner
  "ws.update.downloading": "Downloading\u2026",
  "ws.update.available": "v{{version}} available",
  "ws.update.ready": "v{{version}} ready",
  "ws.update.failed": "Update failed",
  "ws.update.download": "Download",
  "ws.update.restart": "Restart",
  "ws.update.retry": "Retry",
  "ws.update.changelog": "Changelog",
  "ws.update.later": "Later",
  "ws.update.checking": "Checking for updates\u2026",
  "ws.update.upToDate": "You\u2019re up to date!",
  "ws.update.upToDateSub": "nexu {{version}} is the latest version.",
  "ws.update.readyToInstall": "v{{version}} downloaded, ready to install",
  "ws.update.installRestart": "Install",

  // Workspace — Help menu
  "ws.help.documentation": "Documentation",
  "ws.help.contactUs": "Contact us",
  "ws.help.changelog": "Changelog",
  "ws.help.title": "Help",
  "ws.help.github": "GitHub",
  "ws.help.language": "Language",

  // Workspace — Common
  "ws.common.starOnGitHub": "Star on GitHub",
  "ws.common.search": "Search",
  "ws.common.cancel": "Cancel",
  "ws.common.connect": "Connect",
  "ws.common.save": "Save",
  "ws.common.saving": "Saving",
  "ws.common.saved": "Saved",
  "ws.common.all": "All",

  // Budget & rewards
  "budget.viral.title": "Share nexu, earn credits",
  "budget.cta.checked": "Check in",
  "budget.cta.goStar": "Go to Star",
  "budget.cta.getMaterial": "Download & Post",
  "budget.cta.post": "Post",
  "budget.meterRewardsFootnote": "Earn credits in Rewards — they stack into this balance.",
  "reward.daily_checkin.name": "Daily check-in",
  "reward.daily_checkin.desc": "Once per day",
  "reward.github_star.name": "Star nexu on GitHub",
  "reward.github_star.desc": "One-time reward",
  "reward.x_share.name": "Post on X",
  "reward.x_share.desc": "Once per week",
  "reward.reddit.name": "Share on Reddit",
  "reward.reddit.desc": "Once per week",
  "reward.xiaohongshu.name": "Post on Xiaohongshu",
  "reward.xiaohongshu.desc": "Once per week",
  "reward.lingying.name": "Post on LinkedIn",
  "reward.lingying.desc": "Once per week",
  "reward.jike.name": "Post on Jike",
  "reward.jike.desc": "Once per week",
  "reward.wechat.name": "Share to WeChat",
  "reward.wechat.desc": "Once per week",
  "reward.feishu.name": "Share to Feishu",
  "reward.feishu.desc": "Once per week",
  "reward.facebook.name": "Share on Facebook",
  "reward.facebook.desc": "Once per week",
  "reward.whatsapp.name": "Share on WhatsApp",
  "reward.whatsapp.desc": "Once per week",
  "rewards.title": "Earn more usage",
  "rewards.desc": "Complete community tasks to unlock extra hosted usage credits.",
  "rewards.totalCredits": "Total credits {n}",
  "rewards.taskProgress": "One-time tasks {a} / {b}",
  "rewards.tasksShort": "Tasks",
  "rewards.creditsShort": "Credits earned",
  "rewards.creditsMaxHint": "Cap: complete each task once plus daily check-in.",
  "rewards.group.daily": "Daily",
  "rewards.group.opensource": "Open Source",
  "rewards.group.social": "Social & messaging",
  "rewards.progress": "{earned} / {total} credits",
  "rewards.weeklyAvailableIn": "Available in {n} days",
  "rewards.weeklyAvailableTomorrow": "Available tomorrow",
  "rewards.ctaDoneMany": "+{n} credits · done",

  // Workspace — Skills
  "ws.skills.title": "Skills",
  "ws.skills.subtitle": "Manage AI capabilities",
  "ws.skills.import": "Import",
  "ws.skills.yours": "Yours",
  "ws.skills.explore": "Explore",
  "ws.skills.personal": "Personal",
  "ws.skills.installed": "Installed",
  "ws.skills.uninstall": "Uninstall",
  "ws.skills.installing": "Installing…",
  "ws.skills.install": "Install",
  "ws.skills.emptyYours": 'No installed skills yet. Click "+ Import" to add one.',
  "ws.skills.emptySearch": "No matching skills found",

  // Workspace — Home
  "ws.home.idle": "Idle",
  "ws.home.waitingForActivation": "Waiting for activation",
  "ws.home.connectToActivate": "Connect an IM channel to activate me.",
  "ws.home.chooseChannel": "Choose a channel to get started",
  "ws.home.addNexuBot": "Add nexu Bot",
  "ws.home.configureCredentials": "Configure Bot credentials",
  "ws.home.viewSetupGuide": "View {name} setup guide",
  "ws.home.closeDialog": "Close dialog",
  "ws.home.telegramSetupDesc":
    "Create a bot in BotFather, paste the token here, then add the bot to any group where you want replies. Nexu will reply in groups only when the bot is mentioned.",
  "ws.home.telegramQuickSetup": "Quick setup",
  "ws.home.telegramStep1": "Open Telegram and chat with BotFather.",
  "ws.home.telegramStep2": "Create a bot with `/newbot`.",
  "ws.home.telegramStep3": "Copy the HTTP API token and paste it below.",
  "ws.home.telegramStep4": "Add the bot to a group if you want group replies.",
  "ws.home.running": "Running",
  "ws.home.notSelected": "Not selected",
  "ws.home.searchModels": "Search models...",
  "ws.home.noMatchingModels": "No matching models",
  "ws.home.configureProviders": "Configure AI providers",
  "ws.home.messagesToday": "10 messages today",
  "ws.home.activeAgo": "Active 13 hr ago",
  "ws.home.channels": "Channels",
  "ws.home.connected": "Connected",
  "ws.home.disconnect": "Disconnect",
  "ws.home.chat": "Chat",
  "ws.home.starNexu": "Star nexu on GitHub",
  "ws.home.starCta": "Help us grow the open-source community — your star makes a difference",
  "ws.home.github": "github",
  "ws.home.seedanceBannerTitle": "Get your Seedance 2.0 trial key",
  "ws.home.seedanceBannerSubtitle":
    "nexu now supports Seedance 2.0. Star the repo, join the Feishu group, and fill out the form — we'll follow up with your key.",
  "ws.home.seedanceBannerDismiss": "Dismiss promo banner",
  "ws.home.seedanceModalBadge": "Limited-time access",
  "ws.home.seedanceModalTitle": "Get your Seedance 2.0 trial key",
  "ws.home.seedanceModalStepStar": "Step 1: Star on GitHub and take a screenshot",
  "ws.home.seedanceModalStepFeishu": "Step 2: Join the Feishu group and fill out the form",
  "ws.home.seedanceModalStarHint":
    "Star nexu on GitHub, then take a screenshot of the starred repository page.",
  "ws.home.seedanceModalStarred": "Starred",
  "ws.home.seedanceModalStarCta": "Go star on GitHub",
  "ws.home.seedanceModalContinue": "I took the screenshot, continue to the group form",
  "ws.home.seedanceModalFeishuHint":
    "After joining the Feishu group and submitting the form, we'll follow up and send your key. Once you have the key, enter it in nexu Bot to start trying Seedance.",
  "ws.home.seedanceModalTutorial": "View tutorial: how to try Seedance 2.0 in nexu Bot",
  "ws.home.seedanceModalFeishuCta": "Join the Feishu group via link",
  "ws.home.seedanceModalDone": "Got it",

  // Workspace — Conversations
  "ws.conversations.selectFromSidebar": "Select a conversation from the sidebar",

  // Workspace — Deployments
  "ws.deployments.title": "Deployments",
  "ws.deployments.subtitle": "All deployment records",
  "ws.deployments.colName": "Name",
  "ws.deployments.colStatus": "Status",
  "ws.deployments.colChannel": "Channel",
  "ws.deployments.colDeployed": "Deployed",
  "ws.deployments.statusLive": "Live",
  "ws.deployments.statusBuilding": "Building",
  "ws.deployments.statusFailed": "Failed",

  // Workspace — Settings
  "ws.settings.title": "Settings",
  "ws.settings.subtitle": "Manage AI model providers",
  "ws.settings.tab.general": "General",
  "ws.settings.tab.providers": "AI Model Providers",
  "ws.settings.account": "Account",
  "ws.settings.account.signedInDesc": "Your desktop app is connected to a nexu cloud account.",
  "ws.settings.account.signOut": "Sign out",
  "ws.settings.account.notSignedIn": "Not signed in",
  "ws.settings.account.signInDesc": "Sign in to sync settings and access premium models.",
  "ws.settings.account.signIn": "Sign in",
  "ws.settings.languageSection": "Language",
  "ws.settings.appearance.language": "Language",
  "ws.settings.appearance.languageDesc": "Choose the display language",
  "ws.settings.behavior": "Application Behavior",
  "ws.settings.behavior.launchAtLogin": "Launch at startup",
  "ws.settings.behavior.launchAtLoginDesc": "Automatically open Nexu when your computer starts.",
  "ws.settings.behavior.showInDock": "Show in Dock",
  "ws.settings.behavior.showInDockDesc": "Show nexu in your Mac Dock for quick access.",
  "ws.settings.data": "Data & Privacy",
  "ws.settings.data.analytics": "Usage analytics",
  "ws.settings.data.analyticsDesc": "Help improve nexu with anonymous usage data",
  "ws.settings.data.crashReports": "Crash reports",
  "ws.settings.data.crashReportsDesc": "Send crash reports automatically to help fix bugs",
  "ws.settings.updates": "Updates",
  "ws.settings.updates.checkNow": "Check for updates",
  "ws.settings.updates.version": "Version",
  "ws.settings.about": "About",
  "ws.settings.about.version": "nexu Desktop",
  "ws.settings.about.versionNumber": "v0.1.0-beta",
  "ws.settings.about.licenseValue": "MIT",
  "ws.settings.about.docs": "Documentation",
  "ws.settings.about.github": "GitHub Repository",
  "ws.settings.about.changelog": "Changelog",
  "ws.settings.about.feedback": "Send feedback",
  "ws.settings.workspace": "Workspace",
  "ws.settings.nexuBotModel": "nexu Bot Model",
  "ws.settings.nexuBotModelDesc": "The model your nexu bot uses for conversations and tasks",
  "ws.settings.select": "Select...",
  "ws.settings.getApiKey": "Get API Key",
  "ws.settings.signInTitle": "Sign in to use nexu official models",
  "ws.settings.signInDesc":
    "Sign in with your nexu account to access unlimited premium models like Claude Opus 4.6, GPT-5.4, and more — no API key needed.",
  "ws.settings.signInBtn": "Sign in to nexu",
  "ws.settings.apiKeySteps": "1. Fill in API Key · 2. Save · 3. Select model in workspace",
  "ws.settings.apiKey": "API Key",
  "ws.settings.apiProxyUrl": "API Proxy URL",
  "ws.settings.testing": "Testing...",
  "ws.settings.connectedStatus": "Connected",
  "ws.settings.retryTest": "Retry test",
  "ws.settings.testConnection": "Test connection",
  "ws.settings.savedSelectModel": "Saved — select a model below",
  "ws.settings.connectionFailed":
    "Connection failed. Check your API key format, or use Test connection to verify.",
  "ws.settings.connectionFailedShort": "Connection failed. Check your API key and try again.",
  "ws.settings.model": "Model",
};

const zh: Record<string, string> = {
  // Landing - Header
  "nav.skills": "Skills",
  "nav.features": "功能",
  "nav.useCases": "使用场景",
  "nav.customers": "客户",
  "nav.signIn": "登录",
  "nav.getStarted": "免费开始",
  "nav.starOnGithub": "Star on GitHub",

  // Landing - Hero
  "hero.title": "你的 AI 同事，完全开源",
  "hero.subtitle":
    "多模型 AI Agent，原生集成飞书、Slack、Discord。MIT 开源协议，可私有化部署，1 分钟上手。",

  // Landing - Core USP
  "usp.label": "为什么选 nexu",
  "usp.title": "多模型引擎。IM 原生集成。完全开源。",

  // Landing - Bento
  "bento.card1.title": "多模型，统一界面",
  "bento.card1.desc":
    "Claude Opus 4.6、GPT-5.4、Gemini 3.0 — 自由切换模型。可用自己的 Key，也可用我们的。",
  "bento.card2.title": "MIT 开源，可私有化部署",
  "bento.card2.desc": "源码全部开放在 GitHub。部署在你自己的服务器上，数据完全自主可控。",
  "bento.card3.title": "飞书、Slack、Discord 原生集成",

  // Landing - Tools
  "tools.label": "可扩展",
  "tools.sublabel": "Skills 与集成",
  "tools.title": "1,000+ 工具，一键安装",

  // Landing - Strikethrough
  "strike.1": "厂商锁定",
  "strike.2": "黑盒 AI",
  "strike.3": "数据离开你的服务器",

  // Landing - Everything
  "everything.title": "一个 Agent，覆盖所有渠道 —",

  // Landing - Features intro
  "features.label": "开源。为团队而生。",
  "features.intro": "一个 AI 队友，覆盖每个渠道",

  // Landing - Feature accordion
  "feat.1.title": "多模型自由",
  "feat.1.desc":
    "Claude Opus 4.6、GPT-5.4、Gemini 3.0 — 任意模型随时切换。可用自己的 API Key，也可用我们的托管端点。",
  "feat.2.title": "IM 原生 Agent",
  "feat.2.desc":
    "nexu 就在你团队日常使用的工具里 — 飞书、Slack、Discord。无需学习新工具，无需切换上下文。",
  "feat.3.title": "开源 & 可私有化部署",
  "feat.3.desc": "MIT 开源协议。部署在你自己的基础设施上，审计每一行代码，数据完全留在你的服务器。",
  "feat.4.title": "Skills 市场",
  "feat.4.desc": "一键安装社区构建的 Skill — 从竞品分析到 Sprint 回顾。也可以自己构建。",
  "feat.5.title": "越用越聪明的记忆",
  "feat.5.desc": "nexu 记住你的上下文、偏好和决策。用得越久，它就越懂你。",

  // Landing - KPI
  "kpi.heading1": "为真实",
  "kpi.heading2": "团队而生",
  "kpi.1.label": "部署时间",
  "kpi.1.value": "<1 分钟",
  "kpi.1.desc": "把 nexu 添加到你的 Slack 或 Discord 工作区，立即开始对话。无需服务器配置。",
  "kpi.2.label": "支持模型",
  "kpi.2.value": "10+",
  "kpi.2.desc": "Claude Opus 4.6、GPT-5.4、Gemini 3.0、Llama 等。自由切换或使用自己的 API Key。",
  "kpi.3.label": "IM 平台",
  "kpi.3.value": "3+",
  "kpi.3.desc": "飞书、Slack、Discord 原生集成。WhatsApp 和 Telegram 即将支持。",
  "kpi.4.label": "开源协议",
  "kpi.4.value": "MIT",
  "kpi.4.desc": "完全开源，MIT 协议。Fork、私有化部署、二次开发，没有任何限制。",
  "kpi.5.label": "社区 Skills",
  "kpi.5.value": "100+",
  "kpi.5.desc": "安装预构建的 Skill：竞品分析、Sprint 回顾、内容创作等。",
  "kpi.6.label": "数据自主",
  "kpi.6.value": "100%",
  "kpi.6.desc": "私有化部署在你自己的基础设施上。你的数据永远不会离开你的服务器。",

  // Landing - Promise
  "promise.label": "为什么开源",
  "promise.p1": "我们相信，与你团队并肩工作的 AI，应该是透明的、可审计的、由你掌控的。",
  "promise.p2":
    "大多数 AI 工具都是黑盒 — 你把数据发送到别人的服务器，然后祈祷一切顺利，完全不知道里面发生了什么。我们认为工作工具不应该这样。",
  "promise.p3":
    "nexu 采用 MIT 开源协议。每一行代码都在 GitHub 上。你可以私有化部署、Fork、扩展、审计。你的对话、你的记忆、你的数据 — 都属于你。",
  "promise.p4":
    "开源不只是一个协议。它是一个承诺：运行你团队工作流的工具，永远不会绑架你的数据，永远不会锁定你，永远不会藏在付费墙后面。",

  // Landing - Community
  "community.label": "社区",
  "community.title": "被构建未来工作方式的团队所信赖",
  "community.card1":
    "nexu 完全开源，MIT 协议。审查每一行代码，私有化部署在你的基础设施上，用社区构建的 Skill 扩展。你的 AI 队友，你做主。",
  "community.card2.label": "多模型",
  "community.card2":
    "在 Claude Opus 4.6、GPT-5.4、Gemini 3.0 等模型间自由切换 — 为每个任务使用最合适的模型，无需更换工具。",
  "community.card3": "与你已经在用的工具无缝协作",

  // Landing - Footer
  "footer.copyright": "© 2026 nexu Technologies, Inc.",

  // Auth
  "auth.tagline": "你的赛博员工，\n从这里开始",
  "auth.subtitle": "连接飞书、Slack、Discord，用 AI 自动化你的团队工作流。开源、安全、即开即用。",
  "auth.feat1": "多模型引擎，Claude Opus 4.6 / GPT-5.4 / Gemini 3.0 开箱即用",
  "auth.feat2": "飞书、Slack、Discord 原生集成",
  "auth.feat3": "MIT 开源协议，数据自主可控",
  "auth.github": "Star us on GitHub",
  "auth.createAccount": "创建账号",
  "auth.welcomeBack": "欢迎回来",
  "auth.chooseMethod": "选择一种方式开始使用 nexu",
  "auth.loginToContinue": "登录以继续使用 nexu",
  "auth.google": "使用 Google 登录",
  "auth.github.login": "使用 GitHub 登录",
  "auth.or": "或",
  "auth.emailRegister": "邮箱注册",
  "auth.emailLogin": "邮箱登录",
  "auth.email.placeholder": "你的邮箱",
  "auth.password.placeholder.register": "设置密码（至少 6 位）",
  "auth.password.placeholder.login": "你的密码",
  "auth.submit.register": "创建账号",
  "auth.submit.login": "登录",
  "auth.otherMethods": "← 其他登录方式",
  "auth.hasAccount": "已有账号？",
  "auth.noAccount": "还没有账号？",
  "auth.login": "登录",
  "auth.register": "创建账号",
  "auth.terms": "服务条款",
  "auth.privacy": "隐私政策",
  "auth.error.email": "请填写邮箱",
  "auth.error.emailInvalid": "请输入有效的邮箱",
  "auth.error.password": "密码至少 6 位",
  "auth.success.title": "已连接！",
  "auth.success.desc": "你的 Nexu 桌面端已连接到云端账号。你可以关闭此标签页，返回桌面端应用。",
  "auth.success.countdown": "{n} 秒后自动关闭",
  "auth.success.backToApp": "返回应用",
  "brand.label": "你的工作 AI 客户端",
  "brand.title.line1": "OpenClaw，",
  "brand.title.line2": "开箱即用",
  "brand.body":
    "nexu 让 OpenClaw 变成一个安装即可使用的完整产品。飞书文档、日历、审批等工具能力开箱可用，同时接入 Claude、GPT 等顶级模型，所有工作都在一个工作台里完成。",
  "brand.bullet.openclaw": "安装即用，无需额外配置 OpenClaw",
  "brand.bullet.feishu": "飞书文档、日历、审批等工具能力开箱可用",
  "brand.bullet.models":
    "连接了 Claude Opus 4.6、GPT-5.4、MiniMax 2.5、GLM 5.0、Kimi K2.5 等顶级模型",
  "brand.github": "在 GitHub 上 Star nexu",
  "welcome.pageTitle": "欢迎来到 nexu",
  "welcome.mobileLabel": "客户端",
  "welcome.label": "开始使用",
  "welcome.title": "选择你的开始方式",
  "welcome.subtitle":
    "选择一种方式开始使用 nexu。你可以使用官方账号获得完整体验，或直接连接你自己的 API Key。",
  "welcome.option.login.title": "使用 nexu 账号",
  "welcome.option.login.badge": "推荐",
  "welcome.option.login.description":
    "通过浏览器授权登录后，直接使用 nexu 官方预设的高级模型和完整体验。",
  "welcome.option.login.meta.1": "Google / GitHub / 邮箱",
  "welcome.option.login.meta.2": "Browser OAuth",
  "welcome.option.login.meta.3": "适合大多数用户",
  "welcome.option.login.highlight.unlimited": "无限量使用",
  "welcome.option.byok.title": "使用你自己的模型",
  "welcome.option.byok.badge": "BYOK",
  "welcome.option.byok.description":
    "不登录也可以开始，直接连接你自己的 API Key，本地优先，完全可控。",
  "welcome.option.byok.meta.1": "无需注册",
  "welcome.option.byok.meta.2": "本地配置",
  "welcome.option.byok.meta.3": "适合高级用户",
  "welcome.back": "返回选择",
  "welcome.byok.title": "连接你的模型",
  "welcome.byok.subtitle": "不需要账号，选择服务商并输入你的 API Key。所有配置都由你自己掌控。",
  "welcome.byok.note": "你的 API Key 只用于当前客户端配置，不会要求你先创建 nexu 账号。",
  "welcome.byok.verify.loading": "验证中...",
  "welcome.byok.verify.idle": "验证连接",
  "welcome.byok.success": "连接成功，进入 nexu",
  "welcome.customEndpoint": "API Base URL（例如 http://localhost:11434/v1）",

  // Workspace — Nav & Sidebar
  "ws.nav.home": "首页",
  "ws.nav.deployments": "Deployments",
  "ws.nav.rewards": "奖励",
  "ws.nav.skills": "Skills",
  "ws.nav.settings": "设置",
  "ws.nav.conversations": "对话",
  "ws.sidebar.expand": "展开侧边栏",
  "ws.sidebar.collapse": "收起侧边栏",
  "ws.sidebar.update": "更新",

  // Workspace — Update banner
  "ws.update.downloading": "下载中\u2026",
  "ws.update.available": "v{{version}} 可用",
  "ws.update.ready": "v{{version}} 已就绪",
  "ws.update.failed": "更新失败",
  "ws.update.download": "下载",
  "ws.update.restart": "重启",
  "ws.update.retry": "重试",
  "ws.update.changelog": "更新日志",
  "ws.update.later": "稍后",
  "ws.update.checking": "正在检查更新\u2026",
  "ws.update.upToDate": "已是最新版本！",
  "ws.update.upToDateSub": "nexu {{version}} 是最新版本。",
  "ws.update.readyToInstall": "v{{version}} 已下载，可直接安装",
  "ws.update.installRestart": "安装",

  // Workspace — Help menu
  "ws.help.documentation": "文档",
  "ws.help.contactUs": "联系我们",
  "ws.help.changelog": "更新日志",
  "ws.help.title": "帮助",
  "ws.help.github": "GitHub",
  "ws.help.language": "语言",

  // Workspace — Common
  "ws.common.starOnGitHub": "Star on GitHub",
  "ws.common.search": "搜索",
  "ws.common.cancel": "取消",
  "ws.common.connect": "连接",
  "ws.common.save": "保存",
  "ws.common.saving": "保存中",
  "ws.common.saved": "已保存",
  "ws.common.all": "全部",

  // Budget & rewards
  "budget.viral.title": "分享 nexu，获取额外积分",
  "budget.cta.checked": "立即打卡",
  "budget.cta.goStar": "去点 Star",
  "budget.cta.getMaterial": "下载并去发布",
  "budget.cta.post": "去发布",
  "budget.meterRewardsFootnote": "在「奖励」里做任务获得的点数会叠加到这条额度上。",
  "reward.daily_checkin.name": "每日打卡",
  "reward.daily_checkin.desc": "每天一次",
  "reward.github_star.name": "在 GitHub 上 Star nexu",
  "reward.github_star.desc": "一次性奖励",
  "reward.x_share.name": "分享到 X",
  "reward.x_share.desc": "每周可领一次",
  "reward.reddit.name": "分享到 Reddit",
  "reward.reddit.desc": "每周可领一次",
  "reward.xiaohongshu.name": "分享到小红书",
  "reward.xiaohongshu.desc": "每周可领一次",
  "reward.lingying.name": "分享到 LinkedIn",
  "reward.lingying.desc": "每周可领一次",
  "reward.jike.name": "分享到即刻",
  "reward.jike.desc": "每周可领一次",
  "reward.wechat.name": "分享到微信",
  "reward.wechat.desc": "每周可领一次",
  "reward.feishu.name": "分享到飞书",
  "reward.feishu.desc": "每周可领一次",
  "reward.facebook.name": "分享到 Facebook",
  "reward.facebook.desc": "每周可领一次",
  "reward.whatsapp.name": "分享到 WhatsApp",
  "reward.whatsapp.desc": "每周可领一次",
  "rewards.title": "获取更多用量",
  "rewards.desc": "完成社区任务，解锁更多托管模型用量点数。",
  "rewards.totalCredits": "累计获得 {n} 点",
  "rewards.taskProgress": "一次性任务 {a} / {b}",
  "rewards.tasksShort": "任务",
  "rewards.creditsShort": "已获点数",
  "rewards.creditsMaxHint": "上限：每个任务完成一次，再加每日打卡。",
  "rewards.group.daily": "每日",
  "rewards.group.opensource": "开源社区",
  "rewards.group.social": "社交与即时通讯",
  "rewards.progress": "{earned} / {total} 点",
  "rewards.weeklyAvailableIn": "{n} 天后可再次领取",
  "rewards.weeklyAvailableTomorrow": "明天可再次领取",
  "rewards.ctaDoneMany": "+{n} 点 · 已完成",

  // Workspace — Skills
  "ws.skills.title": "Skills",
  "ws.skills.subtitle": "管理 AI 能力",
  "ws.skills.import": "导入",
  "ws.skills.yours": "我的",
  "ws.skills.explore": "探索",
  "ws.skills.personal": "个人",
  "ws.skills.installed": "已安装",
  "ws.skills.uninstall": "卸载",
  "ws.skills.installing": "安装中…",
  "ws.skills.install": "安装",
  "ws.skills.emptyYours": '暂无已安装的 Skill，点击"+ 导入"添加。',
  "ws.skills.emptySearch": "没有匹配的 Skill",

  // Workspace — Home
  "ws.home.idle": "空闲",
  "ws.home.waitingForActivation": "等待激活",
  "ws.home.connectToActivate": "连接一个 IM 频道来激活我。",
  "ws.home.chooseChannel": "选择一个频道开始",
  "ws.home.addNexuBot": "添加 nexu Bot",
  "ws.home.configureCredentials": "配置 Bot 凭证",
  "ws.home.viewSetupGuide": "查看 {name} 配置指南",
  "ws.home.closeDialog": "关闭弹窗",
  "ws.home.telegramSetupDesc":
    "先在 BotFather 创建机器人，把 token 粘贴到这里，然后把机器人加入你希望它回复的群组。Nexu 只会在群组中被提及时回复。",
  "ws.home.telegramQuickSetup": "快速配置",
  "ws.home.telegramStep1": "打开 Telegram 并与 BotFather 对话。",
  "ws.home.telegramStep2": "使用 `/newbot` 创建一个机器人。",
  "ws.home.telegramStep3": "复制 HTTP API token 并粘贴到下方。",
  "ws.home.telegramStep4": "如果希望在群组中回复，请把机器人加入群组。",
  "ws.home.running": "运行中",
  "ws.home.notSelected": "未选择",
  "ws.home.searchModels": "搜索模型...",
  "ws.home.noMatchingModels": "没有匹配的模型",
  "ws.home.configureProviders": "配置 AI 服务商",
  "ws.home.messagesToday": "今日 10 条消息",
  "ws.home.activeAgo": "13 小时前活跃",
  "ws.home.channels": "频道",
  "ws.home.connected": "已连接",
  "ws.home.disconnect": "断开连接",
  "ws.home.chat": "聊天",
  "ws.home.starNexu": "在 GitHub 上 Star nexu",
  "ws.home.starCta": "帮助我们壮大开源社区 — 你的 Star 很重要",
  "ws.home.github": "github",
  "ws.home.seedanceBannerTitle": "领取 Seedance 2.0 体验 Key",
  "ws.home.seedanceBannerSubtitle":
    "nexu 已支持 Seedance 2.0。Star 后加入飞书群并填写问卷，我们会联系并发送 Key。",
  "ws.home.seedanceBannerDismiss": "关闭活动横幅",
  "ws.home.seedanceModalBadge": "限时体验",
  "ws.home.seedanceModalTitle": "领取 Seedance 2.0 体验 Key",
  "ws.home.seedanceModalStepStar": "第一步：GitHub Star 并截图",
  "ws.home.seedanceModalStepFeishu": "第二步：加入飞书群并填写问卷",
  "ws.home.seedanceModalStarHint": "在 GitHub 为 nexu star；并将点完后的仓库页面进行截图。",
  "ws.home.seedanceModalStarred": "已点 Star",
  "ws.home.seedanceModalStarCta": "去 GitHub Star",
  "ws.home.seedanceModalContinue": "我已经截图，去进群填问卷",
  "ws.home.seedanceModalFeishuHint":
    "加入飞书群并填写问卷后，我们会联系并发送 Key。拿到 Key 后，将其输入到 nexu Bot 即可开始体验。",
  "ws.home.seedanceModalTutorial": "查看教程：如何在 nexu Bot 中体验 Seedance 2.0",
  "ws.home.seedanceModalFeishuCta": "点击链接加入飞书群",
  "ws.home.seedanceModalDone": "好的，已了解",

  // Workspace — Conversations
  "ws.conversations.selectFromSidebar": "从侧边栏选择一个对话",

  // Workspace — Deployments
  "ws.deployments.title": "部署",
  "ws.deployments.subtitle": "所有部署记录",
  "ws.deployments.colName": "名称",
  "ws.deployments.colStatus": "状态",
  "ws.deployments.colChannel": "频道",
  "ws.deployments.colDeployed": "部署时间",
  "ws.deployments.statusLive": "运行中",
  "ws.deployments.statusBuilding": "构建中",
  "ws.deployments.statusFailed": "失败",

  // Workspace — Settings
  "ws.settings.title": "设置",
  "ws.settings.subtitle": "管理 AI 模型服务商",
  "ws.settings.tab.general": "通用",
  "ws.settings.tab.providers": "AI 模型服务商",
  "ws.settings.account": "账户",
  "ws.settings.account.signedInDesc": "你的桌面端已连接到 nexu 云端账号。",
  "ws.settings.account.signOut": "退出登录",
  "ws.settings.account.notSignedIn": "未登录",
  "ws.settings.account.signInDesc": "登录后可同步设置并使用高级模型。",
  "ws.settings.account.signIn": "登录",
  "ws.settings.languageSection": "语言",
  "ws.settings.appearance.language": "语言",
  "ws.settings.appearance.languageDesc": "选择界面显示语言",
  "ws.settings.behavior": "应用行为",
  "ws.settings.behavior.launchAtLogin": "开机时启动应用",
  "ws.settings.behavior.launchAtLoginDesc": "当您的电脑开机启动时自动打开 Nexu。",
  "ws.settings.behavior.showInDock": "在 Dock 中显示应用",
  "ws.settings.behavior.showInDockDesc": "在您的 Mac Dock 中显示 nexu，以便快速访问。",
  "ws.settings.data": "数据与隐私",
  "ws.settings.data.analytics": "使用分析",
  "ws.settings.data.analyticsDesc": "发送匿名使用数据以帮助改进 nexu",
  "ws.settings.data.crashReports": "崩溃报告",
  "ws.settings.data.crashReportsDesc": "自动发送崩溃报告以帮助修复问题",
  "ws.settings.updates": "更新",
  "ws.settings.updates.checkNow": "检查更新",
  "ws.settings.updates.version": "版本",
  "ws.settings.about": "关于",
  "ws.settings.about.version": "nexu 桌面端",
  "ws.settings.about.versionNumber": "v0.1.0-beta",
  "ws.settings.about.licenseValue": "MIT",
  "ws.settings.about.docs": "文档",
  "ws.settings.about.github": "GitHub 仓库",
  "ws.settings.about.changelog": "更新日志",
  "ws.settings.about.feedback": "发送反馈",
  "ws.settings.workspace": "工作区",
  "ws.settings.nexuBotModel": "nexu Bot 模型",
  "ws.settings.nexuBotModelDesc": "nexu Bot 用于对话和任务的模型",
  "ws.settings.select": "选择...",
  "ws.settings.getApiKey": "获取 API Key",
  "ws.settings.signInTitle": "登录以使用 nexu 官方模型",
  "ws.settings.signInDesc":
    "登录 nexu 账号即可无限使用 Claude Opus 4.6、GPT-5.4 等高级模型，无需 API Key。",
  "ws.settings.signInBtn": "登录 nexu",
  "ws.settings.apiKeySteps": "1. 填写 API Key · 2. 保存 · 3. 在工作区选择模型",
  "ws.settings.apiKey": "API Key",
  "ws.settings.apiProxyUrl": "API 代理地址",
  "ws.settings.testing": "测试中...",
  "ws.settings.connectedStatus": "已连接",
  "ws.settings.retryTest": "重新测试",
  "ws.settings.testConnection": "测试连接",
  "ws.settings.savedSelectModel": "已保存 — 在下方选择模型",
  "ws.settings.connectionFailed": "连接失败，请检查 API Key 格式，或使用测试连接验证。",
  "ws.settings.connectionFailedShort": "连接失败，请检查 API Key 后重试。",
  "ws.settings.model": "模型",
};
