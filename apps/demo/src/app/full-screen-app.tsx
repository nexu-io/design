import { Routes } from "react-router-dom";

import { CommentSystem } from "../components/CommentSystem";
import { DocsRouteElements } from "./routes/docs-routes";

export function FullScreenApp() {
  return (
    <>
      <Routes>
        {DocsRouteElements()}
      </Routes>
      <CommentSystem />
    </>
  );
}
