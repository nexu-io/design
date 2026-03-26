import { LayoutGrid } from 'lucide-react';
import { usePageTitle } from '../../hooks/usePageTitle';

const WORKFLOWS = [
  {
    step: 1,
    title: 'Drafting',
    desc: 'Turn rough task inputs into polished first drafts. Paste your brief, attach examples, and let nexu produce a structured output you can iterate on.',
  },
  {
    step: 2,
    title: 'Review loop',
    desc: 'Improve drafts with structured feedback directly in chat. Point out what to change — nexu remembers your style and applies it consistently.',
  },
  {
    step: 3,
    title: 'Shipping',
    desc: 'Finalize deliverables with clear next steps. nexu generates summaries, action items, and follow-up threads automatically.',
  },
];

export default function KeyWorkflowsPage() {
  usePageTitle('Key workflows');

  return (
    <>
      <h1 className="text-[22px] font-semibold text-text-primary flex items-center gap-2">
        <LayoutGrid size={20} className="text-text-muted" />
        Key workflows
      </h1>
      <p className="mt-2 text-[14px] text-text-tertiary leading-relaxed max-w-2xl">
        Core patterns teams use with nexu every day.
      </p>

      <section className="mt-8 space-y-4 max-w-2xl">
        {WORKFLOWS.map((w) => (
          <div
            key={w.step}
            className="flex items-start gap-4 p-4 rounded-xl border border-border bg-surface-1"
          >
            <div className="w-8 h-8 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center shrink-0">
              <span className="text-[13px] font-semibold text-accent">{w.step}</span>
            </div>
            <div>
              <div className="text-[13px] font-semibold text-text-primary">{w.title}</div>
              <p className="mt-0.5 text-[12px] text-text-tertiary leading-relaxed">{w.desc}</p>
            </div>
          </div>
        ))}
      </section>
    </>
  );
}
