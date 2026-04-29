"use client";

import {
  Button,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@nexu-design/ui-web";

export function TooltipBasicExample() {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="outline">Hover for details</Button>
        </TooltipTrigger>
        <TooltipContent>Available to workspace admins only.</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
