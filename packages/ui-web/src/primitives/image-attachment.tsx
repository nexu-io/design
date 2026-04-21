import * as React from "react";

import { cn } from "../lib/cn";

/**
 * Figure attributes plus image source, dimensions, and an optional caption.
 */
export interface ImageAttachmentProps extends React.HTMLAttributes<HTMLElement> {
  src: string;
  alt?: string;
  /** Rendered width in pixels; maps to the inline style. */
  width?: number;
  /** Rendered height in pixels; maps to the inline style. */
  height?: number;
  caption?: React.ReactNode;
  /** When provided, the image becomes keyboard-activatable (role="button"). */
  onSelect?: () => void;
  imgClassName?: string;
}

/**
 * Single image attachment with optional caption; sized for inline use inside messages.
 *
 * @example
 * <ImageAttachment src="/ci-graph.png" alt="CI failures" width={360} height={220} caption="..." />
 */
export const ImageAttachment = React.forwardRef<HTMLElement, ImageAttachmentProps>(
  (
    {
      className,
      src,
      alt = "",
      width = 360,
      height = 220,
      caption,
      onSelect,
      imgClassName,
      ...props
    },
    ref,
  ) => {
    const interactive = typeof onSelect === "function";

    return (
      <figure
        ref={ref}
        data-slot="image-attachment"
        className={cn("inline-block m-0", className)}
        {...props}
      >
        <div
          className={cn(
            "group overflow-hidden rounded-lg border border-border bg-surface-2",
            interactive && "cursor-zoom-in",
          )}
          style={{ width, height }}
          role={interactive ? "button" : undefined}
          tabIndex={interactive ? 0 : undefined}
          onClick={interactive ? onSelect : undefined}
          onKeyDown={
            interactive
              ? (event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    onSelect?.();
                  }
                }
              : undefined
          }
        >
          <img
            src={src}
            alt={alt}
            className={cn(
              "h-full w-full object-cover transition-transform duration-300",
              interactive && "group-hover:scale-[1.02]",
              imgClassName,
            )}
          />
        </div>
        {caption ? (
          <figcaption className="mt-1 text-[11px] italic text-text-muted">{caption}</figcaption>
        ) : null}
      </figure>
    );
  },
);

ImageAttachment.displayName = "ImageAttachment";
