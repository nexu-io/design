import { Star, Heart, GitFork, Users, ArrowUpRight, Sparkles, Shield, Globe } from 'lucide-react';
import { usePageTitle } from '../../hooks/usePageTitle';
import { useGitHubStars } from '../../hooks/useGitHubStars';

const GITHUB_URL = 'https://github.com/refly-ai/nexu';

const REASONS = [
  {
    icon: Sparkles,
    title: 'Shape the product',
    desc: 'Stars signal demand — they help us prioritize features and attract contributors who build what you need.',
  },
  {
    icon: Shield,
    title: 'Support open source',
    desc: 'nexu is fully open-source. Your star keeps the project visible and sustainable for the long term.',
  },
  {
    icon: Users,
    title: 'Grow the community',
    desc: 'More stars → more contributors → better skills, integrations, and documentation for everyone.',
  },
  {
    icon: Globe,
    title: 'Stay in the loop',
    desc: 'Starring a repo adds it to your GitHub feed — you\'ll see releases, discussions, and updates as they happen.',
  },
];

export default function StarOnGitHubPage() {
  usePageTitle('Star us on GitHub');
  const { stars } = useGitHubStars();

  return (
    <>
      <h1 className="text-[22px] font-semibold text-text-primary flex items-center gap-2">
        <Star size={20} className="text-amber-400" />
        Star us on GitHub
      </h1>
      <p className="mt-2 text-[14px] text-text-tertiary leading-relaxed max-w-2xl">
        nexu is open-source and community-driven. A GitHub star is the simplest way to support us — it takes one click and makes a real difference.
      </p>

      {/* Hero CTA */}
      <div className="mt-8 max-w-2xl">
        <a
          href={GITHUB_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="group flex items-center gap-5 p-6 rounded-2xl border border-border bg-gradient-to-br from-surface-0 via-surface-1 to-amber-50/30 hover:border-amber-300/50 hover:shadow-md transition-all"
        >
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400/20 to-amber-500/10 flex items-center justify-center shrink-0">
            <Star size={28} className="text-amber-500" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[16px] font-semibold text-text-primary">refly-ai/nexu</div>
            <div className="text-[13px] text-text-secondary mt-0.5">
              Your AI teammate — always-on memory, chat-native, open source
            </div>
            {stars && stars > 0 && (
              <div className="flex items-center gap-3 mt-2 text-[12px] text-text-muted">
                <span className="inline-flex items-center gap-1">
                  <Star size={11} className="text-amber-400 fill-amber-400" />
                  {stars.toLocaleString()} stars
                </span>
                <span className="inline-flex items-center gap-1">
                  <GitFork size={11} />
                  Open source
                </span>
              </div>
            )}
          </div>
          <div className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-[#24292f] text-white text-[14px] font-medium group-hover:bg-[#1b1f23] transition-colors shrink-0">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/></svg>
            Star on GitHub
            <ArrowUpRight size={14} className="opacity-60 group-hover:opacity-100 transition-opacity" />
          </div>
        </a>
      </div>

      {/* Why star */}
      <section className="mt-10 max-w-2xl">
        <h2 className="text-[16px] font-semibold text-text-primary mb-4">Why your star matters</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {REASONS.map((r) => {
            const Icon = r.icon;
            return (
              <div
                key={r.title}
                className="flex gap-3 p-4 rounded-xl border border-border bg-surface-1"
              >
                <div className="w-9 h-9 rounded-lg bg-surface-2 flex items-center justify-center shrink-0">
                  <Icon size={16} className="text-text-secondary" />
                </div>
                <div>
                  <div className="text-[13px] font-semibold text-text-primary">{r.title}</div>
                  <p className="text-[12px] text-text-tertiary mt-0.5 leading-relaxed">{r.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Other ways to help */}
      <section className="mt-10 max-w-2xl">
        <h2 className="text-[16px] font-semibold text-text-primary mb-4">Other ways to contribute</h2>
        <div className="space-y-3">
          <a
            href={`${GITHUB_URL}/issues`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 p-3 rounded-xl border border-border bg-surface-1 hover:border-border-hover hover:shadow-sm transition-all group"
          >
            <div className="w-8 h-8 rounded-lg bg-surface-2 flex items-center justify-center shrink-0">
              <Heart size={14} className="text-rose-400" />
            </div>
            <div className="flex-1">
              <div className="text-[13px] font-semibold text-text-primary">Report bugs & request features</div>
              <p className="text-[12px] text-text-tertiary">Open an issue on GitHub — we read every one.</p>
            </div>
            <ArrowUpRight size={14} className="text-text-muted group-hover:text-accent transition-colors shrink-0" />
          </a>
          <a
            href={`${GITHUB_URL}/pulls`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 p-3 rounded-xl border border-border bg-surface-1 hover:border-border-hover hover:shadow-sm transition-all group"
          >
            <div className="w-8 h-8 rounded-lg bg-surface-2 flex items-center justify-center shrink-0">
              <GitFork size={14} className="text-blue-400" />
            </div>
            <div className="flex-1">
              <div className="text-[13px] font-semibold text-text-primary">Submit a pull request</div>
              <p className="text-[12px] text-text-tertiary">Fix a bug, add a skill, or improve the docs.</p>
            </div>
            <ArrowUpRight size={14} className="text-text-muted group-hover:text-accent transition-colors shrink-0" />
          </a>
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 p-3 rounded-xl border border-border bg-surface-1 hover:border-border-hover hover:shadow-sm transition-all group"
          >
            <div className="w-8 h-8 rounded-lg bg-surface-2 flex items-center justify-center shrink-0">
              <Users size={14} className="text-emerald-400" />
            </div>
            <div className="flex-1">
              <div className="text-[13px] font-semibold text-text-primary">Spread the word</div>
              <p className="text-[12px] text-text-tertiary">Share nexu with your team or on social media.</p>
            </div>
            <ArrowUpRight size={14} className="text-text-muted group-hover:text-accent transition-colors shrink-0" />
          </a>
        </div>
      </section>
    </>
  );
}
