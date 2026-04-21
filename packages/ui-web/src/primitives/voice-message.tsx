import { ChevronDown, Play, Volume2 } from "lucide-react";
import * as React from "react";

import { cn } from "../lib/cn";

/**
 * A synthetic waveform used when the caller does not supply one. The waveform
 * is intentionally decorative — stable heights, low visual weight — so it
 * reads as "there is audio here" without competing with the message text.
 * Values are tuned for a compact `h-3` (12px) bar container; keep custom
 * waveforms in roughly the 1–4 range (final render = value + 2 so max ≈ 6px).
 */
const DEFAULT_WAVEFORM = [1, 1, 2, 3, 2, 2, 3, 4, 3, 2, 3, 4, 3, 2, 2, 1, 3, 2, 1, 2];

export interface VoiceMessageProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Formatted duration label, e.g. "0:24". */
  duration: string;
  /**
   * Optional transcript. Hidden by default; a "Show transcript" toggle appears
   * on hover and reveals the text. Pass `defaultTranscriptOpen` to start
   * expanded.
   */
  transcript?: React.ReactNode;
  /** If true, the transcript is expanded on first render (default: false). */
  defaultTranscriptOpen?: boolean;
  /** Accessible label for the transcript toggle (localisable). */
  transcriptToggleLabel?: string;
  /** Waveform bar heights in pixels; a stable default is used when omitted. */
  waveform?: number[];
  /** Called when the play button is pressed. */
  onPlay?: () => void;
  /** Visual state — `playing` fills the waveform in full brand colour. */
  state?: "idle" | "playing";
}

/**
 * Voice-note attachment with a play button, waveform, duration, and optional transcript.
 *
 * @example
 * <VoiceMessage duration="0:24" transcript="We sized the SLO at 99.5…" />
 */
export const VoiceMessage = React.forwardRef<HTMLDivElement, VoiceMessageProps>(
  (
    {
      className,
      duration,
      transcript,
      defaultTranscriptOpen = false,
      transcriptToggleLabel,
      waveform = DEFAULT_WAVEFORM,
      onPlay,
      state = "idle",
      ...props
    },
    ref,
  ) => {
    const [transcriptOpen, setTranscriptOpen] = React.useState(defaultTranscriptOpen);
    const hasTranscript = transcript !== undefined && transcript !== null && transcript !== "";
    const toggleLabel =
      transcriptToggleLabel ?? (transcriptOpen ? "Hide transcript" : "Show transcript");

    return (
      <div
        ref={ref}
        data-slot="voice-message"
        className={cn("flex w-[360px] max-w-full flex-col items-start gap-1.5", className)}
        {...props}
      >
        <div
          data-slot="voice-message-card"
          className="w-full rounded-lg border border-border bg-surface-1 px-3 py-2.5"
        >
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onPlay}
              aria-label={state === "playing" ? "Pause voice note" : "Play voice note"}
              className={cn(
                "flex size-8 shrink-0 items-center justify-center rounded-full transition-transform duration-200",
                "bg-surface-2 text-text-primary hover:scale-110",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
              )}
            >
              <Play className="ml-0.5 size-3.5 fill-current" />
            </button>
            <div
              className="flex h-3 flex-1 items-center gap-[2px]"
              aria-hidden
              data-slot="voice-message-waveform"
            >
              {waveform.map((height, index) => (
                <span
                  key={`${index}-${height}`}
                  className={cn(
                    "w-[2px] rounded-full",
                    state === "playing" ? "bg-text-secondary" : "bg-text-muted",
                  )}
                  style={{ height: `${height + 2}px` }}
                />
              ))}
            </div>
            <span className="shrink-0 font-mono text-[11px] tabular-nums text-text-secondary">
              {duration}
            </span>
          </div>
          {hasTranscript && transcriptOpen ? (
            <p className="mt-2 border-t border-border-subtle pt-2 text-[12px] leading-relaxed text-text-secondary">
              <Volume2 className="mr-1 inline-block size-3 align-[-1px] text-text-muted" />
              {transcript}
            </p>
          ) : null}
        </div>
        {hasTranscript ? (
          <button
            type="button"
            onClick={() => setTranscriptOpen((prev) => !prev)}
            aria-expanded={transcriptOpen}
            data-slot="voice-message-transcript-toggle"
            className={cn(
              "inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[11px] font-medium text-text-secondary transition-colors",
              "hover:bg-surface-2 hover:text-text-primary",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:ring-offset-background",
            )}
          >
            <ChevronDown
              className={cn(
                "size-3 transition-transform duration-200",
                transcriptOpen ? "rotate-180" : "rotate-0",
              )}
            />
            {toggleLabel}
          </button>
        ) : null}
      </div>
    );
  },
);

VoiceMessage.displayName = "VoiceMessage";
