"use client";

import { Switch } from "@nexu-design/ui-web";

export function SwitchBasicExample() {
  return (
    <div className="flex items-center gap-3">
      <Switch id="docs-switch-sync" defaultChecked />
      <label className="text-sm font-medium text-text-heading" htmlFor="docs-switch-sync">
        Sync automatically
      </label>
    </div>
  );
}
