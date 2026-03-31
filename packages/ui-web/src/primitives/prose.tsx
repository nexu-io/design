import { type VariantProps, cva } from "class-variance-authority";
import * as React from "react";

import { cn } from "../lib/cn";

const proseVariants = cva(
  [
    "prose-nexu",
    "[&_h1]:text-[1.4em] [&_h1]:font-bold [&_h1]:mb-[0.6em] [&_h1]:pb-[0.3em] [&_h1]:border-b [&_h1]:border-[var(--color-border)]",
    "[&_h2]:text-[1.2em] [&_h2]:font-semibold [&_h2]:mt-[1.2em] [&_h2]:mb-[0.4em]",
    "[&_h3]:text-[1.05em] [&_h3]:font-semibold [&_h3]:mt-[1em] [&_h3]:mb-[0.3em]",
    "[&_p]:mb-[0.7em]",
    "[&_ul]:mb-[0.7em] [&_ul]:pl-[1.5em] [&_ol]:mb-[0.7em] [&_ol]:pl-[1.5em]",
    "[&_li]:my-[0.15em] [&_li_::marker]:text-[var(--color-text-tertiary)]",
    "[&_strong]:font-semibold [&_strong]:text-[var(--color-text-primary)]",
    "[&_em]:italic",
    "[&_a]:text-[var(--color-info)] [&_a]:underline [&_a]:underline-offset-2 [&_a:hover]:opacity-80",
    "[&_blockquote]:my-[0.5em] [&_blockquote]:px-[0.8em] [&_blockquote]:py-[0.4em] [&_blockquote]:border-l-[3px] [&_blockquote]:border-[var(--color-border-hover)] [&_blockquote]:text-[var(--color-text-secondary)] [&_blockquote]:bg-[var(--color-surface-2)] [&_blockquote]:rounded-r-[4px]",
    "[&_code]:font-mono [&_code]:text-[0.88em] [&_code]:px-[0.35em] [&_code]:py-[0.15em] [&_code]:bg-[var(--color-surface-3)] [&_code]:rounded-[3px] [&_code]:text-[var(--color-text-primary)]",
    "[&_pre]:my-[0.5em] [&_pre]:px-[1em] [&_pre]:py-[0.8em] [&_pre]:bg-[var(--color-surface-2)] [&_pre]:border [&_pre]:border-[var(--color-border)] [&_pre]:rounded-[6px] [&_pre]:overflow-x-auto",
    "[&_pre_code]:p-0 [&_pre_code]:bg-transparent [&_pre_code]:text-[0.85em] [&_pre_code]:leading-[1.5]",
    "[&_table]:w-full [&_table]:my-[0.5em] [&_table]:border-collapse [&_table]:text-[0.9em]",
    "[&_th]:px-[0.6em] [&_th]:py-[0.4em] [&_th]:border [&_th]:border-[var(--color-border)] [&_th]:text-left [&_th]:bg-[var(--color-surface-2)] [&_th]:font-semibold [&_th]:text-[0.88em] [&_th]:text-[var(--color-text-secondary)]",
    "[&_td]:px-[0.6em] [&_td]:py-[0.4em] [&_td]:border [&_td]:border-[var(--color-border)] [&_td]:text-left",
    "[&_hr]:border-none [&_hr]:border-t [&_hr]:border-[var(--color-border)] [&_hr]:my-[1em]",
    "[&_input[type=checkbox]]:mr-[0.4em] [&_input[type=checkbox]]:accent-[var(--color-accent)]",
  ].join(" "),
  {
    variants: {
      size: {
        default: "text-[13px] leading-[1.7]",
        compact:
          "text-[11px] leading-[1.6] [&_h1]:text-[1.2em] [&_h2]:text-[1.1em] [&_pre]:px-[0.7em] [&_pre]:py-[0.5em] [&_table]:text-[0.85em]",
      },
    },
    defaultVariants: {
      size: "default",
    },
  },
);

export interface ProseProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof proseVariants> {}

export const Prose = React.forwardRef<HTMLDivElement, ProseProps>(
  ({ className, size, ...props }, ref) => (
    <div
      ref={ref}
      data-slot="prose"
      className={cn(proseVariants({ size }), "text-[var(--color-text-primary)]", className)}
      {...props}
    />
  ),
);

Prose.displayName = "Prose";

export { proseVariants };
