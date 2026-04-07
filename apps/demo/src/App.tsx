import {
  Brain,
  Clock,
  Component,
  Globe,
  Layout,
  Lightbulb,
  MessageSquare,
  Monitor,
  Palette,
  PanelLeft,
  PanelLeftClose,
  Play,
  Presentation,
  Rocket,
  Route as RouteIcon,
  Sparkles,
  Type,
  Users,
  Wrench,
  Zap,
} from "lucide-react";
import { useState } from "react";
import { NavLink, Navigate, Route, Routes, useLocation } from "react-router-dom";
import { CommentSystem } from "./components/CommentSystem";
import AvatarPage from "./pages/AvatarPage";
import BPPage from "./pages/BPPage";
import ColorsPage from "./pages/ColorsPage";
import ComponentsPage from "./pages/ComponentsPage";
import CopyPage from "./pages/CopyPage";
import GrowthLanding from "./pages/GrowthLanding";
import LandingPreview from "./pages/LandingPreview";
import MotionPage from "./pages/MotionPage";
import OverviewPage from "./pages/OverviewPage";
import TypographyPage from "./pages/TypographyPage";
import WhyWeBuiltPage from "./pages/WhyWeBuiltPage";
import CommunityPage from "./pages/docs/CommunityPage";
import DocsChangelogPage from "./pages/docs/DocsChangelogPage";
import DocsLayout from "./pages/docs/DocsLayout";
import FaqPage from "./pages/docs/FaqPage";
import ChannelsDocPage from "./pages/docs/IntegrationsPage";
import KeyWorkflowsPage from "./pages/docs/KeyWorkflowsPage";
import LLMProvidersPage from "./pages/docs/LLMProvidersPage";
import PreRequisitesPage from "./pages/docs/PreRequisitesPage";
import QuickStartPage from "./pages/docs/QuickStartPage";
import SetupGuidePage from "./pages/docs/SetupGuidePage";
import DocsSkillsPage from "./pages/docs/SkillsPage";
import StarOnGitHubPage from "./pages/docs/StarOnGitHubPage";
import WhatIsNexuPage from "./pages/docs/WhatIsNexuPage";
import YourClonePage from "./pages/docs/YourClonePage";
import JourneyPage from "./pages/journey/JourneyPage";
import AuthPage from "./pages/openclaw/AuthPage";
import AuthShell from "./pages/openclaw/AuthShell";
import PricingPage from "./pages/openclaw/PricingPage";
import ChannelsPage from "./pages/openclaw/ChannelsPage";
import ClientWelcomePage from "./pages/openclaw/ClientWelcomePage";
import GroupGrowthDemo from "./pages/openclaw/GroupGrowthDemo";
import InvitePage from "./pages/openclaw/InvitePage";
import OnboardingPage from "./pages/openclaw/OnboardingPage";
import OpenClawLanding from "./pages/openclaw/OpenClawLanding";
import OpenClawSkillsPage from "./pages/openclaw/OpenClawSkillsPage";
import OpenClawWorkspace from "./pages/openclaw/OpenClawWorkspace";
import PrivacyPolicyPage from "./pages/openclaw/PrivacyPolicyPage";
import RewardsPage from "./pages/openclaw/RewardsPage";
import SkillDetailPage from "./pages/openclaw/SkillDetailPage";
import TermsOfServicePage from "./pages/openclaw/TermsOfServicePage";
import UsagePage from "./pages/openclaw/UsagePage";
import WhatsAppQRPage from "./pages/openclaw/WhatsAppQRPage";
import AutomationPage from "./pages/product/AutomationPage";
import CloneBuilderPage from "./pages/product/CloneBuilderPage";
import ProductDemoPage from "./pages/product/ProductDemoPage";
import ProductLayout from "./pages/product/ProductLayout";
import SessionsPage from "./pages/product/SessionsPage";
import SkillsPage from "./pages/product/SkillsPage";
import TeamPage from "./pages/product/TeamPage";

const DESIGN_NAV = [
  { to: "/why", label: "Why We Build nexu", icon: Lightbulb },
  { to: "/bp", label: "BP PPT", icon: Presentation },
  { to: "/overview", label: "Overview", icon: Brain },
  { to: "/colors", label: "Colors", icon: Palette },
  { to: "/typography", label: "Typography", icon: Type },
  { to: "/components", label: "Components", icon: Component },
  { to: "/motion", label: "Motion", icon: Zap },
  { to: "/avatar", label: "Avatar", icon: Users },
  { to: "/copy", label: "Copy System", icon: MessageSquare },
  { to: "/landing", label: "Landing Page", icon: Layout },
];

const PRODUCT_NAV = [
  { to: "/demo", label: "Product Demo", icon: Play },
  { to: "/journey", label: "User Journey", icon: RouteIcon },
  { to: "/app/sessions", label: "Sessions", icon: Monitor },
  { to: "/app/team", label: "团队协作", icon: Users },
  { to: "/app/clone", label: "分身搭建", icon: Wrench },
  { to: "/app/automation", label: "Automation", icon: Clock },
  { to: "/app/skills", label: "Skills", icon: Sparkles },
];

const GROWTH_NAV = [
  { to: "/openclaw", label: "nexu MVP 🦞", icon: Rocket },
  { to: "/openclaw/growth-demo/new", label: "首次用户 Demo", icon: Zap },
  { to: "/openclaw/growth-demo/existing", label: "同事已开通 Demo", icon: Zap },
  { to: "/growth-landing", label: "Growth Landing", icon: Globe },
];

const CLOUD_WEB_NAV = [
  { to: "/openclaw/welcome", label: "Cloud welcome", icon: Rocket },
  { to: "/openclaw/workspace", label: "Workspace", icon: Monitor },
  { to: "/openclaw/pricing", label: "Pricing / Usage", icon: Clock },
  { to: "/openclaw/rewards", label: "Rewards", icon: Sparkles },
  { to: "/openclaw/skills", label: "Skills", icon: Wrench },
];

function NavSection({
  title,
  items,
  collapsed,
}: {
  title: string;
  items: typeof DESIGN_NAV;
  collapsed: boolean;
}) {
  return (
    <div>
      {!collapsed && (
        <div className="px-3 mb-1 text-[10px] font-medium text-text-muted uppercase tracking-wider">
          {title}
        </div>
      )}
      <div className="space-y-0.5">
        {items.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            title={collapsed ? label : undefined}
            className={({ isActive }) =>
              `flex items-center gap-2.5 rounded-md text-[13px] transition-colors ${
                collapsed ? "justify-center px-0 py-2" : "px-3 py-2"
              } ${
                isActive
                  ? "bg-clone-subtle text-clone font-medium"
                  : "text-text-secondary hover:text-text-primary hover:bg-surface-3"
              }`
            }
          >
            <Icon size={16} />
            {!collapsed && label}
          </NavLink>
        ))}
      </div>
    </div>
  );
}

function DesignSystemShell() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex h-full">
      <nav
        className={`${
          collapsed ? "w-14" : "w-56"
        } shrink-0 border-r border-border bg-surface-0 flex flex-col transition-all duration-200`}
      >
        {/* Header */}
        {!collapsed && (
          <div className="flex justify-between items-center p-5 border-b border-border">
            <div className="flex gap-2 items-center">
              <div className="flex justify-center items-center w-7 h-7 rounded-lg bg-accent">
                <span className="text-xs font-bold text-accent-fg">N</span>
              </div>
              <div>
                <div className="text-sm font-semibold text-text-primary">nexu</div>
                <div className="text-[11px] text-text-tertiary">Design System</div>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setCollapsed(true)}
              className="p-1 rounded transition-colors text-text-muted hover:text-text-secondary"
              title="收起侧边栏"
            >
              <PanelLeftClose size={14} />
            </button>
          </div>
        )}

        {/* Nav */}
        <div className={`flex-1 ${collapsed ? "p-1.5" : "p-3"} space-y-4 overflow-y-auto`}>
          <NavSection title="Design System" items={DESIGN_NAV} collapsed={collapsed} />
          <NavSection title="Product Pages" items={PRODUCT_NAV} collapsed={collapsed} />
          <NavSection title="Cloud Prototype" items={CLOUD_WEB_NAV} collapsed={collapsed} />
          <NavSection title="nexu MVP" items={GROWTH_NAV} collapsed={collapsed} />
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-border">
          {collapsed ? (
            <button
              type="button"
              onClick={() => setCollapsed(false)}
              className="flex justify-center items-center mx-auto w-7 h-7 rounded-lg transition-colors bg-accent hover:bg-accent-hover"
              title="展开侧边栏"
            >
              <PanelLeft size={14} className="text-accent-fg" />
            </button>
          ) : (
            <div className="text-[11px] text-text-muted">v1.0 — nexu Design System</div>
          )}
        </div>
      </nav>
      <main className="overflow-y-auto flex-1 min-h-0">
        <Routes>
          <Route path="/" element={<Navigate to="/openclaw/welcome" replace />} />
          <Route path="/why" element={<WhyWeBuiltPage />} />
          <Route path="/bp" element={<BPPage />} />
          <Route path="/overview" element={<OverviewPage />} />
          <Route path="/colors" element={<ColorsPage />} />
          <Route path="/typography" element={<TypographyPage />} />
          <Route path="/components" element={<ComponentsPage />} />
          <Route path="/motion" element={<MotionPage />} />
          <Route path="/avatar" element={<AvatarPage />} />
          <Route path="/copy" element={<CopyPage />} />
          <Route path="/landing" element={<LandingPreview />} />
          <Route path="/demo" element={<ProductDemoPage />} />
          <Route path="/journey" element={<JourneyPage />} />
          <Route path="/app" element={<Navigate to="/app/clone" replace />} />
          <Route
            path="/app/sessions"
            element={
              <ProductLayout>
                <SessionsPage />
              </ProductLayout>
            }
          />
          <Route
            path="/app/clone"
            element={
              <ProductLayout>
                <CloneBuilderPage />
              </ProductLayout>
            }
          />
          <Route
            path="/app/team"
            element={
              <ProductLayout>
                <TeamPage />
              </ProductLayout>
            }
          />
          <Route
            path="/app/automation"
            element={
              <ProductLayout>
                <AutomationPage />
              </ProductLayout>
            }
          />
          <Route
            path="/app/skills"
            element={
              <ProductLayout>
                <SkillsPage />
              </ProductLayout>
            }
          />
          <Route path="/openclaw" element={<OpenClawLanding />} />
          <Route path="/growth-landing" element={<GrowthLanding />} />
          {/* Catch-all: avoid blank main when path does not match any route */}
          <Route path="*" element={<Navigate to="/openclaw/welcome" replace />} />
        </Routes>
      </main>
    </div>
  );
}

export default function App() {
  const location = useLocation();
  const isFullScreen =
    location.pathname === "/openclaw/workspace" ||
    location.pathname === "/openclaw/welcome" ||
    location.pathname.startsWith("/openclaw/auth") ||
    location.pathname.startsWith("/openclaw/invite") ||
    location.pathname.startsWith("/openclaw/onboarding") ||
    location.pathname.startsWith("/openclaw/whatsapp-qr") ||
    location.pathname === "/openclaw/privacy" ||
    location.pathname === "/openclaw/terms" ||
    location.pathname === "/openclaw/channels" ||
    location.pathname === "/openclaw/pricing" ||
    location.pathname === "/openclaw/rewards" ||
    location.pathname === "/openclaw/usage" ||
    location.pathname === "/openclaw/skills" ||
    location.pathname.startsWith("/openclaw/skill/") ||
    location.pathname.startsWith("/openclaw/growth-demo") ||
    location.pathname === "/openclaw/changelog" ||
    location.pathname.startsWith("/docs/");

  if (isFullScreen) {
    return (
      <>
        <Routes>
          <Route path="/openclaw/workspace" element={<OpenClawWorkspace />} />
          <Route element={<AuthShell />}>
            <Route path="/openclaw/welcome" element={<ClientWelcomePage />} />
            <Route path="/openclaw/auth" element={<AuthPage />} />
          </Route>
          <Route path="/openclaw/invite" element={<InvitePage />} />
          <Route path="/openclaw/onboarding" element={<OnboardingPage />} />
          <Route path="/openclaw/whatsapp-qr" element={<WhatsAppQRPage />} />
          <Route path="/openclaw/privacy" element={<PrivacyPolicyPage />} />
          <Route path="/openclaw/terms" element={<TermsOfServicePage />} />
          <Route path="/openclaw/channels" element={<ChannelsPage />} />
          <Route path="/openclaw/pricing" element={<PricingPage />} />
          <Route path="/openclaw/rewards" element={<RewardsPage />} />
          <Route path="/openclaw/usage" element={<UsagePage />} />
          <Route path="/openclaw/skills" element={<OpenClawSkillsPage />} />
          <Route path="/openclaw/skill/:id" element={<SkillDetailPage />} />
          <Route path="/openclaw/growth-demo" element={<GroupGrowthDemo />} />
          <Route path="/openclaw/growth-demo/new" element={<GroupGrowthDemo />} />
          <Route path="/openclaw/growth-demo/existing" element={<GroupGrowthDemo />} />
          <Route
            path="/docs/get-started"
            element={
              <DocsLayout>
                <WhatIsNexuPage />
              </DocsLayout>
            }
          />
          <Route
            path="/docs/get-started/setup-guide"
            element={
              <DocsLayout>
                <SetupGuidePage />
              </DocsLayout>
            }
          />
          <Route
            path="/docs/get-started/quick-start"
            element={
              <DocsLayout>
                <QuickStartPage />
              </DocsLayout>
            }
          />
          <Route
            path="/docs/get-started/skills"
            element={
              <DocsLayout>
                <DocsSkillsPage />
              </DocsLayout>
            }
          />
          <Route
            path="/docs/get-started/channels"
            element={
              <DocsLayout>
                <ChannelsDocPage />
              </DocsLayout>
            }
          />
          <Route
            path="/docs/get-started/llm-providers"
            element={
              <DocsLayout>
                <LLMProvidersPage />
              </DocsLayout>
            }
          />
          <Route
            path="/docs/get-started/your-clone"
            element={
              <DocsLayout>
                <YourClonePage />
              </DocsLayout>
            }
          />
          <Route
            path="/docs/get-started/pre-requisites"
            element={
              <DocsLayout>
                <PreRequisitesPage />
              </DocsLayout>
            }
          />
          <Route
            path="/docs/get-started/key-workflows"
            element={
              <DocsLayout>
                <KeyWorkflowsPage />
              </DocsLayout>
            }
          />
          <Route
            path="/docs/get-started/faq"
            element={
              <DocsLayout>
                <FaqPage />
              </DocsLayout>
            }
          />
          <Route
            path="/docs/get-started/community"
            element={
              <DocsLayout>
                <CommunityPage />
              </DocsLayout>
            }
          />
          <Route
            path="/docs/get-started/changelog"
            element={
              <DocsLayout>
                <DocsChangelogPage />
              </DocsLayout>
            }
          />
          <Route
            path="/docs/get-started/star"
            element={
              <DocsLayout>
                <StarOnGitHubPage />
              </DocsLayout>
            }
          />
          <Route
            path="/docs/get-started/integrations"
            element={<Navigate to="/docs/get-started/channels" replace />}
          />
          <Route path="/openclaw/changelog" element={<Navigate to="/docs/get-started" replace />} />
          <Route
            path="/openclaw/changelog/*"
            element={<Navigate to="/docs/get-started" replace />}
          />
        </Routes>
        <CommentSystem />
      </>
    );
  }

  return (
    <>
      <DesignSystemShell />
      <CommentSystem />
    </>
  );
}
