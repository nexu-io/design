import { Navigate, Route } from "react-router-dom";

import GrowthLanding from "../../pages/GrowthLanding";
import AuthPage from "../../pages/openclaw/AuthPage";
import AuthShell from "../../pages/openclaw/AuthShell";
import ChannelsPage from "../../pages/openclaw/ChannelsPage";
import ClientWelcomePage from "../../pages/openclaw/ClientWelcomePage";
import GroupGrowthDemo from "../../pages/openclaw/GroupGrowthDemo";
import InvitePage from "../../pages/openclaw/InvitePage";
import OnboardingPage from "../../pages/openclaw/OnboardingPage";
import OpenClawLanding from "../../pages/openclaw/OpenClawLanding";
import OpenClawSkillsPage from "../../pages/openclaw/OpenClawSkillsPage";
import OpenClawWorkspace from "../../pages/openclaw/OpenClawWorkspace";
import PrivacyPolicyPage from "../../pages/openclaw/PrivacyPolicyPage";
import SkillDetailPage from "../../pages/openclaw/SkillDetailPage";
import TermsOfServicePage from "../../pages/openclaw/TermsOfServicePage";
import WhatsAppQRPage from "../../pages/openclaw/WhatsAppQRPage";

export function CloudShellRouteElements() {
  return (
    <>
      <Route path="/openclaw" element={<OpenClawLanding />} />
      <Route path="/growth-landing" element={<GrowthLanding />} />
    </>
  );
}

export function CloudFullScreenRouteElements() {
  return (
    <>
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
      <Route path="/openclaw/skills" element={<OpenClawSkillsPage />} />
      <Route path="/openclaw/skill/:id" element={<SkillDetailPage />} />
      <Route path="/openclaw/growth-demo" element={<GroupGrowthDemo />} />
      <Route path="/openclaw/growth-demo/new" element={<GroupGrowthDemo />} />
      <Route path="/openclaw/growth-demo/existing" element={<GroupGrowthDemo />} />
      <Route path="/openclaw/changelog" element={<Navigate to="/docs/get-started" replace />} />
      <Route path="/openclaw/changelog/*" element={<Navigate to="/docs/get-started" replace />} />
    </>
  );
}
