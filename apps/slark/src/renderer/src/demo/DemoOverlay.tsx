import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { X } from "lucide-react";
import { DEMO_META, type DemoId, isAbortError, useDemoPlayer } from "./player";
import { buildCtx } from "./ctx";
import { runUC01 } from "./scripts/uc01";
import { runUC02 } from "./scripts/uc02";
import { runUC03 } from "./scripts/uc03";

const SCRIPTS: Record<DemoId, (ctx: ReturnType<typeof buildCtx>) => Promise<void>> = {
  uc01: runUC01,
  uc02: runUC02,
  uc03: runUC03,
};

// Module-level guard so StrictMode's real unmount/remount cycle doesn't start the script twice.
// (A component-level useRef would be reset on the fresh mount and let a second script through.)
const startedRunKeys = new Set<number>();

export function DemoOverlay(): React.ReactElement | null {
  const playing = useDemoPlayer((s) => s.playing);
  const caption = useDemoPlayer((s) => s.caption);
  const runKey = useDemoPlayer((s) => s.runKey);
  const stop = useDemoPlayer((s) => s.stop);
  const navigate = useNavigate();

  useEffect(() => {
    if (!playing) return;
    if (startedRunKeys.has(runKey)) return;
    startedRunKeys.add(runKey);

    const ctx = buildCtx({ runKey, navigate });
    const script = SCRIPTS[playing];
    script(ctx)
      .then(() => {
        // Leave the final caption visible briefly, then clear.
        setTimeout(() => {
          if (useDemoPlayer.getState().runKey === runKey) useDemoPlayer.getState().stop();
        }, 1800);
      })
      .catch((err) => {
        if (!isAbortError(err)) {
          console.error("[demo] script error", err);
        }
      });
  }, [playing, runKey, navigate]);

  if (!playing) return null;

  const meta = DEMO_META[playing];

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-[1000] flex justify-center pb-6">
      <div className="pointer-events-auto flex max-w-[720px] items-center gap-3 rounded-2xl border border-border bg-card/95 px-4 py-2.5 shadow-2xl backdrop-blur-md">
        <div className="flex flex-col gap-0.5">
          <div className="flex items-center gap-2 text-[10.5px] font-semibold uppercase tracking-[0.08em] text-nexu-primary">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-nexu-primary opacity-75" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-nexu-primary" />
            </span>
            {meta.title}
          </div>
          <div className="min-h-[20px] text-[13px] leading-snug text-foreground">
            {caption || meta.subtitle}
          </div>
        </div>
        <button
          type="button"
          onClick={stop}
          className="ml-2 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          title="Stop demo"
          aria-label="Stop demo"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}
