import { LoaderCircle } from "lucide-react";
import type * as React from "react";

import { cn } from "../lib/cn";

export interface SpinnerProps extends React.SVGAttributes<SVGSVGElement> {
  size?: "sm" | "md" | "lg";
}

const sizeClasses = {
  sm: "size-4",
  md: "size-5",
  lg: "size-6",
};

export function Spinner({ className, size = "md", ...props }: SpinnerProps) {
  return (
    <LoaderCircle
      className={cn("animate-spin text-muted-foreground", sizeClasses[size], className)}
      {...props}
    />
  );
}
