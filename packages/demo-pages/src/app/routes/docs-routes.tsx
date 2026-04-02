import { Navigate, Route } from "react-router-dom";

import CommunityPage from "../../pages/docs/CommunityPage";
import DocsChangelogPage from "../../pages/docs/DocsChangelogPage";
import DocsLayout from "../../pages/docs/DocsLayout";
import FaqPage from "../../pages/docs/FaqPage";
import ChannelsDocPage from "../../pages/docs/IntegrationsPage";
import KeyWorkflowsPage from "../../pages/docs/KeyWorkflowsPage";
import LLMProvidersPage from "../../pages/docs/LLMProvidersPage";
import PreRequisitesPage from "../../pages/docs/PreRequisitesPage";
import QuickStartPage from "../../pages/docs/QuickStartPage";
import SetupGuidePage from "../../pages/docs/SetupGuidePage";
import DocsSkillsPage from "../../pages/docs/SkillsPage";
import StarOnGitHubPage from "../../pages/docs/StarOnGitHubPage";
import WhatIsNexuPage from "../../pages/docs/WhatIsNexuPage";
import YourClonePage from "../../pages/docs/YourClonePage";

export function DocsRouteElements() {
  return (
    <>
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
    </>
  );
}
