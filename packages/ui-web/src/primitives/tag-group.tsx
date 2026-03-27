import * as React from "react";

import { cn } from "../lib/cn";
import { Badge, type BadgeProps } from "./badge";

const TagGroup = React.forwardRef<HTMLDivElement, React.ComponentPropsWithoutRef<"div">>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      role="list"
      data-slot="tag-group"
      className={cn("flex flex-wrap items-center gap-1.5", className)}
      {...props}
    />
  ),
);

TagGroup.displayName = "TagGroup";

function TagGroupItem(props: BadgeProps) {
  return <Badge role="listitem" data-slot="tag-group-item" {...props} />;
}

export { TagGroup, TagGroupItem };
