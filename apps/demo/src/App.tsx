import { CloudShellRouteElements } from "@nexu-design/demo-pages";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";

import { DesignSystemShell } from "./app/design-system-shell";
import { FullScreenApp } from "./app/full-screen-app";
import { isCloudShellPath, isFullScreenPath } from "./app/route-matches";
import { CommentSystem } from "./components/CommentSystem";

function CloudShellApp() {
  return (
    <>
      <Routes>
        {CloudShellRouteElements()}
        <Route path="*" element={<Navigate to="/openclaw" replace />} />
      </Routes>
      <CommentSystem />
    </>
  );
}

export default function App() {
  const location = useLocation();
  const { pathname } = location;

  if (isFullScreenPath(pathname)) {
    return <FullScreenApp />;
  }

  if (isCloudShellPath(pathname)) {
    return <CloudShellApp />;
  }

  return <DesignSystemShell />;
}
