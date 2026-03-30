import type * as React from "react";

import { cn } from "../lib/cn";

export interface BrandRailProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  logo?: React.ReactNode;
  logoLabel?: string;
  onLogoClick?: () => void;
  topRight?: React.ReactNode;
  title?: React.ReactNode;
  description?: React.ReactNode;
  footer?: React.ReactNode;
  background?: React.ReactNode;
  bodyClassName?: string;
}

export function BrandRail({
  logo,
  logoLabel = "Brand",
  onLogoClick,
  topRight,
  title,
  description,
  footer,
  background,
  className,
  bodyClassName,
  children,
  ...props
}: BrandRailProps) {
  const LogoTag = onLogoClick ? "button" : "div";

  return (
    <aside
      className={cn("relative flex min-h-full w-full overflow-hidden text-white", className)}
      {...props}
    >
      {background ? <div className="absolute inset-0">{background}</div> : null}

      <div className="relative z-10 flex w-full flex-col justify-between px-10 pb-12 pt-8 xl:px-12 xl:py-12">
        <div className="flex items-center justify-between gap-4">
          <LogoTag
            {...(onLogoClick
              ? {
                  type: "button" as const,
                  onClick: onLogoClick,
                  "aria-label": logoLabel,
                  className: "flex items-center",
                }
              : { className: "flex items-center" })}
          >
            {logo}
          </LogoTag>
          {topRight ?? <div />}
        </div>

        <div className={cn("space-y-8", bodyClassName)}>
          {title || description ? (
            <div>
              {title ? <div className="max-w-[560px] text-white">{title}</div> : null}
              {description ? (
                <div className="mt-6 max-w-[460px] text-[14px] leading-[1.8] text-white/58">
                  {description}
                </div>
              ) : null}
            </div>
          ) : null}
          {children}
        </div>

        <div>{footer}</div>
      </div>
    </aside>
  );
}
