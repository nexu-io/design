import { useLocation } from "react-router-dom";

import { DesignSystemShell } from "./app/design-system-shell";
import { FullScreenApp } from "./app/full-screen-app";
import { isFullScreenPath } from "./app/route-matches";

export default function App() {
  const location = useLocation();

  return isFullScreenPath(location.pathname) ? <FullScreenApp /> : <DesignSystemShell />;
}
