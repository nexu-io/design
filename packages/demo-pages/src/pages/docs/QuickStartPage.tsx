import { FastForward, Info, KeyRound, Rocket } from "lucide-react";
import Callout from "../../components/docs/Callout";
import { usePageTitle } from "../../hooks/usePageTitle";

export default function QuickStartPage() {
  usePageTitle("Quick start");

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-[20px] font-semibold text-text-primary flex items-center gap-2">
          <Rocket size={18} className="text-text-muted" />
          Quick start
        </h1>
        <p className="mt-2 text-[14px] text-text-secondary leading-relaxed max-w-2xl">
          Go from zero to first real outcome in 20 minutes.
        </p>
      </div>

      <Callout variant="info">
        Before starting, make sure you've completed the{" "}
        <a href="/docs/get-started/setup-guide" className="underline font-medium text-blue-700">
          Setup Guide
        </a>{" "}
        and nexu is active in at least one channel.
      </Callout>

      <section>
        <h2 className="text-[16px] font-semibold text-text-primary flex items-center gap-2 mb-3">
          <KeyRound size={16} className="text-text-muted" />
          Introduction
        </h2>
        <p className="text-[13px] text-text-tertiary leading-relaxed max-w-2xl">
          nexu works best when you treat it as a teammate: give context, clarify what "done" means,
          and iterate on drafts. The more specific you are, the better the output.
        </p>
      </section>

      <section>
        <h2 className="text-[16px] font-semibold text-text-primary flex items-center gap-2 mb-3">
          <FastForward size={16} className="text-text-muted" />
          20-minute quick start
        </h2>
        <p className="text-[13px] text-text-tertiary leading-relaxed max-w-2xl mb-4">
          Workspace rollout in 3 steps:
        </p>
        <ol className="list-decimal list-inside space-y-2 text-[13px] text-text-tertiary max-w-2xl">
          <li>
            <strong className="text-text-primary">Pick one channel and owner.</strong> Start in a
            single team channel with a clear DRI.
          </li>
          <li>
            <strong className="text-text-primary">Align on one real use case.</strong> Choose a task
            that matters this week (not a toy example).
          </li>
          <li>
            <strong className="text-text-primary">Run the 20-minute loop below.</strong> Use Add →
            Task → Example → Ask to ship a first outcome.
          </li>
        </ol>

        <Callout variant="tip">
          Choose a task your team does every week — like drafting a standup summary or preparing
          meeting notes. Repetitive tasks show value fastest.
        </Callout>

        <div className="mt-6 space-y-4 max-w-2xl">
          <h3 className="text-[14px] font-medium text-text-primary">The loop</h3>

          <div className="flex items-start gap-3 p-4 rounded-xl border border-border bg-surface-1">
            <span className="w-7 h-7 rounded-full bg-accent/10 flex items-center justify-center shrink-0 text-[13px] font-bold text-accent">
              1
            </span>
            <div>
              <div className="text-[14px] font-semibold text-text-primary">Add</div>
              <div className="text-[13px] text-text-tertiary mt-1">
                Add nexu to your team chat and start a thread.
              </div>
            </div>
          </div>

          <div className="flex items-start gap-3 p-4 rounded-xl border border-border bg-surface-1">
            <span className="w-7 h-7 rounded-full bg-accent/10 flex items-center justify-center shrink-0 text-[13px] font-bold text-accent">
              2
            </span>
            <div>
              <div className="text-[14px] font-semibold text-text-primary">Task</div>
              <div className="text-[13px] text-text-tertiary mt-1">
                Paste a real task you need done this week. Include constraints and what "done" looks
                like.
              </div>
            </div>
          </div>

          <div className="flex items-start gap-3 p-4 rounded-xl border border-border bg-surface-1">
            <span className="w-7 h-7 rounded-full bg-accent/10 flex items-center justify-center shrink-0 text-[13px] font-bold text-accent">
              3
            </span>
            <div>
              <div className="text-[14px] font-semibold text-text-primary">Example</div>
              <div className="text-[13px] text-text-tertiary mt-1">
                Attach one example (doc, link, screenshot, or past output) so nexu can match your
                style.
              </div>
            </div>
          </div>

          <div className="flex items-start gap-3 p-4 rounded-xl border border-border bg-surface-1">
            <span className="w-7 h-7 rounded-full bg-accent/10 flex items-center justify-center shrink-0 text-[13px] font-bold text-accent">
              4
            </span>
            <div>
              <div className="text-[14px] font-semibold text-text-primary">Ask</div>
              <div className="text-[13px] text-text-tertiary mt-1">
                Ask nexu for a first draft plus next steps. Then iterate with feedback.
              </div>
            </div>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-[16px] font-semibold text-text-primary flex items-center gap-2 mb-3">
          <Info size={16} className="text-text-muted" />
          Key concepts
        </h2>
        <div className="space-y-3 max-w-2xl">
          <div className="flex items-start gap-3">
            <span className="w-2 h-2 rounded-full bg-accent mt-1.5 shrink-0" />
            <div>
              <span className="font-medium text-text-primary">Context.</span>{" "}
              <span className="text-text-tertiary">
                Goals, constraints, and examples you give nexu.
              </span>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <span className="w-2 h-2 rounded-full bg-accent mt-1.5 shrink-0" />
            <div>
              <span className="font-medium text-text-primary">Outcome.</span>{" "}
              <span className="text-text-tertiary">
                What "done" looks like for this task or project.
              </span>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <span className="w-2 h-2 rounded-full bg-accent mt-1.5 shrink-0" />
            <div>
              <span className="font-medium text-text-primary">Iteration.</span>{" "}
              <span className="text-text-tertiary">
                Review, refine, and ship based on nexu's drafts.
              </span>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <span className="w-2 h-2 rounded-full bg-accent mt-1.5 shrink-0" />
            <div>
              <span className="font-medium text-text-primary">Memory.</span>{" "}
              <span className="text-text-tertiary">
                nexu accumulates context over time — preferences, past decisions, team patterns.
              </span>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <span className="w-2 h-2 rounded-full bg-accent mt-1.5 shrink-0" />
            <div>
              <span className="font-medium text-text-primary">Skills.</span>{" "}
              <span className="text-text-tertiary">
                Reusable capabilities nexu can invoke — from drafting to data lookups.
              </span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
