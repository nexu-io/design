import * as React from "react";

import { cn } from "../lib/cn";

export interface ImageGalleryItem {
  src: string;
  alt?: string;
}

export interface ImageGalleryProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "onSelect"> {
  images: ImageGalleryItem[];
  /** Maximum thumbnails to show before folding into a +N tile. Defaults to 6. */
  maxVisible?: number;
  /** Called with the clicked image (or index when invoked via the +N tile). */
  onSelect?: (image: ImageGalleryItem, index: number) => void;
}

/**
 * Fixed-grid thumbnail gallery that folds overflow into a `+N` tile.
 *
 * @example
 * <ImageGallery images={shots} onSelect={(_, i) => openLightbox(i)} />
 */
export const ImageGallery = React.forwardRef<HTMLDivElement, ImageGalleryProps>(
  ({ className, images, maxVisible = 6, onSelect, ...props }, ref) => {
    const visible = images.slice(0, maxVisible);
    const overflow = Math.max(0, images.length - maxVisible);
    const interactive = typeof onSelect === "function";

    return (
      <div
        ref={ref}
        data-slot="image-gallery"
        className={cn(
          "grid max-w-[480px] grid-cols-3 gap-1 overflow-hidden rounded-lg border border-border",
          className,
        )}
        {...props}
      >
        {visible.map((img, i) => {
          const isLast = i === visible.length - 1;
          const showOverflow = isLast && overflow > 0;

          const content = (
            <>
              <img
                src={img.src}
                alt={img.alt ?? ""}
                className={cn(
                  "h-full w-full object-cover transition-transform duration-300",
                  interactive && "group-hover:scale-[1.04]",
                )}
              />
              {showOverflow ? (
                <span className="absolute inset-0 flex items-center justify-center bg-black/55 text-sm font-semibold text-white">
                  +{overflow}
                </span>
              ) : null}
            </>
          );

          const commonClass = cn(
            "group relative aspect-square overflow-hidden bg-surface-2",
            interactive && "cursor-zoom-in",
          );

          if (interactive) {
            return (
              <button
                key={img.src}
                type="button"
                onClick={() => onSelect?.(img, i)}
                className={cn(
                  commonClass,
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:ring-offset-background",
                )}
              >
                {content}
              </button>
            );
          }

          return (
            <div key={img.src} className={commonClass}>
              {content}
            </div>
          );
        })}
      </div>
    );
  },
);

ImageGallery.displayName = "ImageGallery";
