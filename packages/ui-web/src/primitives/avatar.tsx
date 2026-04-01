import * as AvatarPrimitive from "@radix-ui/react-avatar";
import type * as React from "react";

import { cn } from "../lib/cn";
import { NexuMarkIcon } from "./logo";

function Avatar({ className, ...props }: React.ComponentProps<typeof AvatarPrimitive.Root>) {
  return (
    <AvatarPrimitive.Root
      data-slot="avatar"
      className={cn("relative flex size-10 shrink-0 overflow-hidden rounded-full", className)}
      {...props}
    />
  );
}

function AvatarImage({ className, ...props }: React.ComponentProps<typeof AvatarPrimitive.Image>) {
  return (
    <AvatarPrimitive.Image
      data-slot="avatar-image"
      className={cn("aspect-square size-full", className)}
      {...props}
    />
  );
}

function AvatarFallback({
  className,
  children,
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Fallback>) {
  return (
    <AvatarPrimitive.Fallback
      data-slot="avatar-fallback"
      className={cn(
        "flex size-full items-center justify-center rounded-[inherit] bg-muted text-sm font-medium text-muted-foreground",
        className,
      )}
      {...props}
    >
      {children ?? <NexuMarkIcon size={16} className="text-muted-foreground" />}
    </AvatarPrimitive.Fallback>
  );
}

export { Avatar, AvatarFallback, AvatarImage };
