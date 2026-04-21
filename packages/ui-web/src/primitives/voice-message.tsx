import { Captions, Play, Volume2 } from "lucide-react";
import * as React from "react";

import { cn } from "../lib/cn";

/**
 * A synthetic waveform used when the caller does not supply one; stable heights
 * so the visual rhythm is consistent across renders.
 */
const DEFAULT_WAVEFORM = [3, 6, 10, 14, 8, 12, 18, 22, 16, 10, 14, 20, 18, 8, 12, 6, 14, 10, 4, 8];

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
        className={cn(
          "group/voice flex w-[360px] max-w-full flex-col gap-2 rounded-lg border border-border bg-surface-1 px-3 py-2.5",
          className,
        )}
        {...props}
      >
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onPlay}
            aria-label={state === "playing" ? "Pause voice note" : "Play voice note"}
            className={cn(
              "flex size-8 shrink-0 items-center justify-center rounded-full transition-colors",
              "bg-surface-2 text-text-primary hover:bg-accent hover:text-accent-fg",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
            )}
          >
            <Play className="ml-0.5 size-3.5 fill-current" />
          </button>
          <div
            className="flex h-7 flex-1 items-end gap-[2px]"
            aria-hidden
            data-slot="voice-message-waveform"
          >
            {waveform.map((height, index) => (
              <span
                key={`${index}-${height}`}
                className={cn(
                  "w-[3px] rounded-full",
                  state === "playing" ? "bg-text-primary" : "bg-text-muted",
                )}
                style={{ height: `${height + 6}px` }}
              />
            ))}
          </div>
          {hasTranscript ? (
            <button
              type="button"
              onClick={() => setTranscriptOpen((prev) => !prev)}
              aria-label={toggleLabel}
              aria-expanded={transcriptOpen}
              data-slot="voice-message-transcript-toggle"
              className={cn(
                "flex size-6 shrink-0 items-center justify-center rounded-md transition-all",
                "focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:ring-offset-background",
                transcriptOpen
                  ? "bg-surface-2 text-text-primary opacity-100"
                  : "text-text-muted opacity-0 hover:bg-surface-2 hover:text-text-primary group-hover/voice:opacity-100",
              )}
            >
              <Captions className="size-3.5" />
            </button>
          ) : null}
          <span className="shrink-0 font-mono text-[11px] tabular-nums text-text-secondary">
            {duration}
          </span>
        </div>
        {hasTranscript && transcriptOpen ? (
          <p className="border-t border-border-subtle pt-2 text-[12px] leading-relaxed text-text-secondary">
            <Volume2 className="mr-1 inline-block size-3 align-[-1px] text-text-muted" />
            {transcript}
          </p>
        ) : null}
      </div>
    );
  },
);

VoiceMessage.displayName = "VoiceMessage";
