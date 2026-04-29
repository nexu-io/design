"use client";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@nexu-design/ui-web";

export function SelectBasicExample() {
  return (
    <div className="grid w-full max-w-xs gap-2">
      <label className="text-sm font-medium text-text-heading" htmlFor="docs-select-trigger">
        Model
      </label>
      <Select defaultValue="claude">
        <SelectTrigger id="docs-select-trigger">
          <SelectValue placeholder="Choose a model" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="claude">Claude Sonnet</SelectItem>
          <SelectItem value="gpt">GPT-4.1</SelectItem>
          <SelectItem value="gemini">Gemini 2.5 Pro</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
