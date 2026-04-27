"use client";

import { Checkbox } from "@nexu-design/ui-web";

export function CheckboxBasicExample() {
  return (
    <div className="flex items-start gap-3">
      <Checkbox id="docs-checkbox-updates" />
      <label className="grid gap-1 text-sm" htmlFor="docs-checkbox-updates">
        <span className="font-medium text-text-heading">Send release updates</span>
        <span className="text-text-secondary">
          Notify this channel when package versions change.
        </span>
      </label>
    </div>
  );
}
