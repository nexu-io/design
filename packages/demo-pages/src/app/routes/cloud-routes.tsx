import type { ReactElement } from "react";
import { Navigate, Route } from "react-router-dom";

import GrowthLanding from "../../pages/GrowthLanding";
import AuthPage from "../../pages/openclaw/AuthPage";
import AuthShell from "../../pages/openclaw/AuthShell";
import ChannelsPage from "../../pages/openclaw/ChannelsPage";
import ClientWelcomePage from "../../pages/openclaw/ClientWelcomePage";
import GroupGrowthDemo from "../../pages/openclaw/GroupGrowthDemo";
import InvitePage from "../../pages/openclaw/InvitePage";
import NexuPricingPage from "../../pages/openclaw/NexuPricingPage";
import OnboardingPage from "../../pages/openclaw/OnboardingPage";
import OpenClawLanding from "../../pages/openclaw/OpenClawLanding";
import OpenClawWorkspace from "../../pages/openclaw/OpenClawWorkspace";
import PrivacyPolicyPage from "../../pages/openclaw/PrivacyPolicyPage";
import RewardsPage from "../../pages/openclaw/RewardsPage";
import SkillDetailPage from "../../pages/openclaw/SkillDetailPage";
import TermsOfServicePage from "../../pages/openclaw/TermsOfServicePage";
import UsagePage from "../../pages/openclaw/UsagePage";
import WhatsAppQRPage from "../../pages/openclaw/WhatsAppQRPage";
import { OpenClawDemoStateProvider } from "../../pages/openclaw/demo-state";

function withOpenClawDemoState(element: ReactElement) {
  return <OpenClawDemoStateProvider>{element}</OpenClawDemoStateProvider>;
}

export function CloudShellRouteElements() {
  return (
    <>
      <Route path="/openclaw" element={withOpenClawDemoState(<OpenClawLanding />)} />
      <Route path="/growth-landing" element={<GrowthLanding />} />
    </>
  );
}

export function CloudFullScreenRouteElements() {
  return (
    <>
      <Route path="/openclaw/workspace" element={withOpenClawDemoState(<OpenClawWorkspace />)} />
      <Route element={<AuthShell />}>
        <Route path="/openclaw/welcome" element={withOpenClawDemoState(<ClientWelcomePage />)} />
        <Route path="/openclaw/auth" element={withOpenClawDemoState(<AuthPage />)} />
      </Route>
      <Route path="/openclaw/invite" element={withOpenClawDemoState(<InvitePage />)} />
      <Route path="/openclaw/onboarding" element={withOpenClawDemoState(<OnboardingPage />)} />
      <Route path="/openclaw/whatsapp-qr" element={withOpenClawDemoState(<WhatsAppQRPage />)} />
      <Route path="/openclaw/privacy" element={withOpenClawDemoState(<PrivacyPolicyPage />)} />
      <Route path="/openclaw/terms" element={withOpenClawDemoState(<TermsOfServicePage />)} />
      <Route path="/openclaw/channels" element={withOpenClawDemoState(<ChannelsPage />)} />
      <Route path="/openclaw/skill/:id" element={withOpenClawDemoState(<SkillDetailPage />)} />
      <Route path="/openclaw/pricing" element={withOpenClawDemoState(<NexuPricingPage />)} />
      <Route path="/openclaw/usage" element={withOpenClawDemoState(<UsagePage />)} />
      <Route path="/openclaw/rewards" element={withOpenClawDemoState(<RewardsPage />)} />
      <Route path="/openclaw/growth-demo" element={withOpenClawDemoState(<GroupGrowthDemo />)} />
      <Route path="/openclaw/growth-demo/new" element={withOpenClawDemoState(<GroupGrowthDemo />)} />
      <Route
        path="/openclaw/growth-demo/existing"
        element={withOpenClawDemoState(<GroupGrowthDemo />)}
      />
      <Route path="/openclaw/changelog" element={<Navigate to="/openclaw/workspace" replace />} />
      <Route path="/openclaw/changelog/*" element={<Navigate to="/openclaw/workspace" replace />} />
    </>
  );
}
