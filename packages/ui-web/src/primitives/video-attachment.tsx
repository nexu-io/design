import { Play } from "lucide-react";
import * as React from "react";

import { cn } from "../lib/cn";

/**
 * Native button attributes plus video metadata and thumbnail source.
 */
export interface VideoAttachmentProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  thumbnail: string;
  /** Displayed duration, e.g. "02:37". */
  duration: string;
  title: string;
  /** Optional file size or other meta, shown trailing in the footer. */
  meta?: React.ReactNode;
  thumbnailAlt?: string;
}

/**
 * Video attachment card with a play-overlay thumbnail and a title/meta footer.
 *
 * @example
 * <VideoAttachment thumbnail="/repro.jpg" duration="02:37" title="Bug-2174-repro.mp4" meta="8.4 MB" />
 */
export const VideoAttachment = React.forwardRef<HTMLButtonElement, VideoAttachmentProps>(
  (
    { className, thumbnail, duration, title, meta, thumbnailAlt, type = "button", ...props },
    ref,
  ) => {
    return (
      <button
        ref={ref}
        type={type}
        data-slot="video-attachment"
        className={cn(
          "group block w-[360px] max-w-full overflow-hidden rounded-lg border border-border bg-surface-1 text-left transition-colors",
          "hover:border-border-hover hover:shadow-sm",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
          className,
        )}
        {...props}
      >
        <div className="relative aspect-video bg-surface-3">
          <img
            src={thumbnail}
            alt={thumbnailAlt ?? title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.015]"
          />
          <span className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />
          <span className="absolute inset-0 flex items-center justify-center" aria-hidden>
            <span className="flex size-12 items-center justify-center rounded-full bg-white/95 shadow-lg transition-transform duration-200 group-hover:scale-110">
              <Play className="ml-0.5 size-5 fill-gray-900 text-gray-900" />
            </span>
          </span>
          <span className="absolute bottom-2 right-2 rounded-sm bg-black/70 px-1.5 py-0.5 font-mono text-[10px] font-medium tracking-wide text-white">
            {duration}
          </span>
        </div>
        <div className="flex items-center justify-between gap-2 px-3 py-2">
          <span className="truncate text-[12px] font-medium text-text-primary">{title}</span>
          {meta ? <span className="shrink-0 text-[11px] text-text-muted">{meta}</span> : null}
        </div>
      </button>
    );
  },
);

VideoAttachment.displayName = "VideoAttachment";
