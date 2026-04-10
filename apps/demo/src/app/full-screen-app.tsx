import { CloudFullScreenRouteElements, OpenClawDemoStateProvider } from "@nexu-design/demo-pages";
import { Navigate, Route, Routes } from "react-router-dom";

import { CommentSystem } from "../components/CommentSystem";

export function FullScreenApp() {
  return (
    <OpenClawDemoStateProvider>
      <>
        <Routes>
          {CloudFullScreenRouteElements()}
          <Route path="*" element={<Navigate to="/openclaw/workspace" replace />} />
        </Routes>
        <CommentSystem />
      </>
    </OpenClawDemoStateProvider>
  );
}
