import { CloudFullScreenRouteElements, CloudShellRouteElements } from "@nexu-design/demo-pages";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";

const fullScreenExactPaths = new Set([
  "/openclaw/workspace",
  "/openclaw/welcome",
  "/openclaw/invite",
  "/openclaw/onboarding",
  "/openclaw/whatsapp-qr",
  "/openclaw/privacy",
  "/openclaw/terms",
  "/openclaw/channels",
  "/openclaw/skills",
  "/openclaw/pricing",
  "/openclaw/usage",
  "/openclaw/rewards",
  "/openclaw/changelog",
]);

function isFullScreenPath(pathname: string) {
  return (
    fullScreenExactPaths.has(pathname) ||
    pathname.startsWith("/openclaw/auth") ||
    pathname.startsWith("/openclaw/changelog/") ||
    pathname.startsWith("/openclaw/skill/") ||
    pathname.startsWith("/openclaw/growth-demo")
  );
}

export default function App() {
  const location = useLocation();

  if (isFullScreenPath(location.pathname)) {
    return (
      <Routes>
        {CloudFullScreenRouteElements()}
        <Route path="*" element={<Navigate to="/openclaw/welcome" replace />} />
      </Routes>
    );
  }

  return (
    <Routes>
      {CloudShellRouteElements()}
      <Route path="*" element={<Navigate to="/openclaw" replace />} />
    </Routes>
  );
}
