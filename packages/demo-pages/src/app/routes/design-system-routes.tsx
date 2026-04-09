import { Navigate, Route } from "react-router-dom";

import AvatarPage from "../../pages/AvatarPage";
import BPPage from "../../pages/BPPage";
import ColorsPage from "../../pages/ColorsPage";
import ComponentsPage from "../../pages/ComponentsPage";
import CopyPage from "../../pages/CopyPage";
import LandingPreview from "../../pages/LandingPreview";
import MotionPage from "../../pages/MotionPage";
import OverviewPage from "../../pages/OverviewPage";
import TypographyPage from "../../pages/TypographyPage";
import WhyWeBuiltPage from "../../pages/WhyWeBuiltPage";

export function DesignSystemRouteElements() {
  return (
    <>
      <Route path="/" element={<Navigate to="/openclaw/workspace" replace />} />
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
    </>
  );
}
