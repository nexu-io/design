import type * as React from "react";

import { cn } from "../lib/cn";

export interface SkillMarketplaceCardProps extends React.HTMLAttributes<HTMLDivElement> {
  name: string;
  description: string;
  categoryLabel?: string | null;
  logo?: string;
  icon: React.ElementType<{ size?: number; className?: string }>;
  dimmed?: boolean;
  footer?: React.ReactNode;
}

export function SkillMarketplaceCard({
  name,
  description,
  categoryLabel,
  logo,
  icon: Icon,
  dimmed,
  footer,
  className,
  ...props
}: SkillMarketplaceCardProps) {
  return (
    <div
      data-slot="skill-marketplace-card"
      className={cn(
        "flex flex-col rounded-2xl border border-border-subtle bg-surface-1 p-4 shadow-[var(--shadow-rest)] transition-shadow duration-200 hover:shadow-[var(--shadow-refine)]",
        dimmed && "opacity-55",
        className,
      )}
      {...props}
    >
      <div className="mb-2 flex items-center gap-3">
        <div className="flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-[10px] border border-border bg-white">
          {logo ? (
            <>
              <img
                src={logo}
                alt=""
                className="size-[18px] object-contain"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                  const fb = e.currentTarget.nextElementSibling as HTMLElement | null;
                  if (fb) fb.style.display = "flex";
                }}
              />
              <div className="hidden size-full items-center justify-center">
                <Icon size={18} className="text-text-secondary" />
              </div>
            </>
          ) : (
            <Icon size={18} className="text-text-secondary" />
          )}
        </div>
        <div className="min-w-0 flex-1">
          <div className="truncate text-sm font-semibold text-text-heading">{name}</div>
          {categoryLabel != null && categoryLabel !== "" ? (
            <span className="text-2xs text-text-muted">{categoryLabel}</span>
          ) : null}
        </div>
      </div>
      <p className="mb-3 line-clamp-2 text-xs leading-relaxed text-text-tertiary">{description}</p>
      {footer ? <div className="mt-auto flex items-center justify-between">{footer}</div> : null}
    </div>
  );
}
