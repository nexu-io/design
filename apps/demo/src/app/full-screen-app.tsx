import { Routes } from "react-router-dom";

import { CommentSystem } from "../components/CommentSystem";
import { CloudFullScreenRouteElements } from "./routes/cloud-routes";
import { DocsRouteElements } from "./routes/docs-routes";

export function FullScreenApp() {
  return (
    <>
      <Routes>
        <CloudFullScreenRouteElements />
        <DocsRouteElements />
      </Routes>
      <CommentSystem />
    </>
  );
}
