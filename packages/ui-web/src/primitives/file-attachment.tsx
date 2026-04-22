import { type VariantProps, cva } from "class-variance-authority";
import {
  Download,
  FileArchive,
  FileSpreadsheet,
  FileText,
  Image as ImageIcon,
  Terminal,
} from "lucide-react";
import * as React from "react";

import { cn } from "../lib/cn";

const iconTileVariants = cva(
  "flex size-9 shrink-0 items-center justify-center rounded-md [&_svg]:size-4",
  {
    variants: {
      kind: {
        doc: "bg-info-subtle text-info",
        sheet: "bg-success-subtle text-success",
        archive: "bg-warning-subtle text-warning",
        code: "bg-surface-3 text-text-primary",
        media: "bg-brand-subtle text-brand-primary",
        generic: "bg-surface-2 text-text-secondary",
      },
    },
    defaultVariants: {
      kind: "doc",
    },
  },
);

export type FileAttachmentKind = NonNullable<VariantProps<typeof iconTileVariants>["kind"]>;

const defaultIcons: Record<FileAttachmentKind, React.ElementType> = {
  doc: FileText,
  sheet: FileSpreadsheet,
  archive: FileArchive,
  code: Terminal,
  media: ImageIcon,
  generic: FileText,
};

/**
 * Native button attributes plus file metadata and optional icon / trailing overrides.
 */
export interface FileAttachmentProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Visible file name (truncated on overflow). */
  name: string;
  /** Supporting line — typically size and/or type, e.g. "1.2 MB · log". */
  meta?: React.ReactNode;
  /** Semantic category — picks default icon + tile color. */
  kind?: FileAttachmentKind;
  /** Override the icon rendered inside the tile. */
  icon?: React.ElementType;
  /** Trailing slot. Defaults to a hover-reveal download icon. */
  trailing?: React.ReactNode;
}

/**
 * Compact file attachment row used inside messages and feeds.
 *
 * @example
 * <FileAttachment name="billing-api.log" meta="1.2 MB · log" kind="code" />
 *
 * @example
 * <FileAttachment name="Q2-review.pdf" meta="2.1 MB · PDF" onClick={() => open(file)} />
 */
export const FileAttachment = React.forwardRef<HTMLButtonElement, FileAttachmentProps>(
  ({ className, name, meta, kind = "doc", icon, trailing, type = "button", ...props }, ref) => {
    const Icon = icon ?? defaultIcons[kind];

    return (
      <button
        ref={ref}
        type={type}
        data-slot="file-attachment"
        className={cn(
          "group flex w-[360px] max-w-full items-center gap-3 rounded-lg border border-border bg-surface-1 px-3 py-2.5 text-left transition-colors",
          "hover:border-border-hover hover:bg-surface-2",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
          className,
        )}
        {...props}
      >
        <span className={iconTileVariants({ kind })} aria-hidden>
          <Icon />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block truncate text-[13px] font-medium text-text-primary">{name}</span>
          {meta ? (
            <span className="mt-0.5 block truncate text-[11px] text-text-muted">{meta}</span>
          ) : null}
        </span>
        <span className="shrink-0 text-text-muted" aria-hidden>
          {trailing ?? (
            <Download className="size-3.5 opacity-0 transition-opacity group-hover:opacity-100" />
          )}
        </span>
      </button>
    );
  },
);

FileAttachment.displayName = "FileAttachment";
