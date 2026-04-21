import { Navigate, Route, Routes } from "react-router-dom";

import { CreateWorkspaceStep } from "./CreateWorkspaceStep";
import { JoinWorkspaceStep } from "./JoinWorkspaceStep";
import { SlarkAuthFrame } from "./slark-auth-frame";

export function OnboardingFlow(): React.ReactElement {
  return (
    <SlarkAuthFrame contentInnerClassName="mx-auto w-full max-w-[440px]" hideBranding hideFooter>
      <Routes>
        <Route path="workspace" element={<CreateWorkspaceStep />} />
        <Route path="join" element={<JoinWorkspaceStep />} />
        <Route path="*" element={<Navigate to="workspace" replace />} />
      </Routes>
    </SlarkAuthFrame>
  );
}
