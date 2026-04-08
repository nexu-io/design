import { Navigate, Route } from "react-router-dom";

import JourneyPage from "../../pages/journey/JourneyPage";
import AutomationPage from "../../pages/product/AutomationPage";
import CloneBuilderPage from "../../pages/product/CloneBuilderPage";
import ProductDemoPage from "../../pages/product/ProductDemoPage";
import ProductLayout from "../../pages/product/ProductLayout";
import SessionsPage from "../../pages/product/SessionsPage";
import SkillsPage from "../../pages/product/SkillsPage";
import TeamPage from "../../pages/product/TeamPage";

export function ProductRouteElements() {
  return (
    <>
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
    </>
  );
}
