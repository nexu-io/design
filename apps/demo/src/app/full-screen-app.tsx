import { CloudFullScreenRouteElements } from '@nexu-design/demo-pages';
import { Navigate, Route, Routes } from 'react-router-dom';

import { CommentSystem } from '../components/CommentSystem';

export function FullScreenApp() {
  return (
    <>
      <Routes>
        {CloudFullScreenRouteElements()}
        <Route path="*" element={<Navigate to="/openclaw/workspace" replace />} />
      </Routes>
      <CommentSystem />
    </>
  );
}
