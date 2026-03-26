import { Zap, MessageSquare, Shield } from 'lucide-react';
import { usePageTitle } from '../../hooks/usePageTitle';

const FEATURES = [
  {
    icon: Zap,
    title: 'Always-on memory',
    desc: 'Remembers every thread, preference, and decision.',
    color: 'purple',
    iconBg: 'bg-purple-500/10',
    iconColor: 'text-purple-600',
  },
  {
    icon: MessageSquare,
    title: 'Chat-native',
    desc: 'Works inside Slack, Feishu, and other IM platforms.',
    color: 'blue',
    iconBg: 'bg-blue-500/10',
    iconColor: 'text-blue-600',
  },
  {
    icon: Shield,
    title: 'Next to you, not replacing you',
    desc: 'Augments your team — never replaces people.',
    color: 'emerald',
    iconBg: 'bg-emerald-500/10',
    iconColor: 'text-emerald-600',
  },
];

export default function WhatIsNexuPage() {
  usePageTitle('What is nexu?');

  return (
    <>
      <h1 className="text-[22px] font-semibold text-text-primary">What is nexu?</h1>
      <p className="mt-3 text-[14px] text-text-tertiary leading-relaxed max-w-2xl">
        nexu is an AI teammate that lives in your team chat. It remembers your context, learns your style, and ships real work — drafts, research, follow-ups — so you can focus on decisions, not execution. Unlike generic AI assistants, nexu gets better the more your team uses it.
      </p>
      <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl">
        {FEATURES.map((f) => {
          const Icon = f.icon;
          return (
            <div
              key={f.title}
              className="flex flex-col gap-3 p-4 rounded-xl border border-border bg-surface-1"
            >
              <div className={`w-9 h-9 rounded-lg ${f.iconBg} flex items-center justify-center shrink-0`}>
                <Icon size={16} className={f.iconColor} />
              </div>
              <div>
                <div className="text-[13px] font-semibold text-text-primary">{f.title}</div>
                <div className="text-[12px] text-text-tertiary mt-0.5 leading-relaxed">{f.desc}</div>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
