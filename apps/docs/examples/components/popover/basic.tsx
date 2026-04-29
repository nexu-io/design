"use client";

import { Button, Popover, PopoverContent, PopoverTrigger } from "@nexu-design/ui-web";

export function PopoverBasicExample() {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">Open summary</Button>
      </PopoverTrigger>
      <PopoverContent className="grid gap-2">
        <h3 className="text-sm font-semibold text-text-heading">Release readiness</h3>
        <p className="text-sm text-text-secondary">
          Three checks passed. One package still needs a changeset before publishing.
        </p>
      </PopoverContent>
    </Popover>
  );
}
