import { CloudFullScreenRouteElements } from "@nexu-design/demo-pages";
import { Navigate, Route, Routes } from "react-router-dom";

import { CommentSystem } from "../components/CommentSystem";
import { DocsRouteElements } from "./routes/docs-routes";

export function FullScreenApp() {
  return (
    <>
      <Routes>
        {CloudFullScreenRouteElements()}
        {DocsRouteElements()}
        <Route path="*" element={<Navigate to="/openclaw/welcome" replace />} />
      </Routes>
      <CommentSystem />
    </>
  );
}
