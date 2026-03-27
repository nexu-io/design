import { Slot } from "@radix-ui/react-slot";
import { ChevronRight } from "lucide-react";
import * as React from "react";

import { cn } from "../lib/cn";

const Breadcrumb = React.forwardRef<HTMLElement, React.ComponentPropsWithoutRef<"nav">>(
  ({ className, "aria-label": ariaLabel = "breadcrumb", ...props }, ref) => (
    <nav
      ref={ref}
      aria-label={ariaLabel}
      data-slot="breadcrumb"
      className={cn(className)}
      {...props}
    />
  ),
);

Breadcrumb.displayName = "Breadcrumb";

const BreadcrumbList = React.forwardRef<HTMLOListElement, React.ComponentPropsWithoutRef<"ol">>(
  ({ className, ...props }, ref) => (
    <ol
      ref={ref}
      data-slot="breadcrumb-list"
      className={cn(
        "flex flex-wrap items-center gap-1.5 text-[12px] text-muted-foreground",
        className,
      )}
      {...props}
    />
  ),
);

BreadcrumbList.displayName = "BreadcrumbList";

const BreadcrumbItem = React.forwardRef<HTMLLIElement, React.ComponentPropsWithoutRef<"li">>(
  ({ className, ...props }, ref) => (
    <li
      ref={ref}
      data-slot="breadcrumb-item"
      className={cn("inline-flex items-center gap-1.5", className)}
      {...props}
    />
  ),
);

BreadcrumbItem.displayName = "BreadcrumbItem";

export interface BreadcrumbLinkProps extends React.ComponentPropsWithoutRef<"a"> {
  asChild?: boolean;
}

const BreadcrumbLink = React.forwardRef<HTMLAnchorElement, BreadcrumbLinkProps>(
  ({ asChild = false, className, ...props }, ref) => {
    const Comp = asChild ? Slot : "a";

    return (
      <Comp
        ref={ref}
        data-slot="breadcrumb-link"
        className={cn("transition-colors hover:text-foreground", className)}
        {...props}
      />
    );
  },
);

BreadcrumbLink.displayName = "BreadcrumbLink";

const BreadcrumbPage = React.forwardRef<HTMLSpanElement, React.ComponentPropsWithoutRef<"span">>(
  ({ className, ...props }, ref) => (
    <span
      ref={ref}
      aria-current="page"
      data-slot="breadcrumb-page"
      className={cn("font-medium text-foreground", className)}
      {...props}
    />
  ),
);

BreadcrumbPage.displayName = "BreadcrumbPage";

const BreadcrumbSeparator = ({
  children,
  className,
  ...props
}: React.ComponentPropsWithoutRef<"span">) => (
  <span
    aria-hidden="true"
    role="presentation"
    data-slot="breadcrumb-separator"
    className={cn("text-muted-foreground", className)}
    {...props}
  >
    {children ?? <ChevronRight className="size-3" />}
  </span>
);

BreadcrumbSeparator.displayName = "BreadcrumbSeparator";

export {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
};
