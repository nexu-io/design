import { GitHubIcon } from "@nexu-design/ui-web";
import { ArrowRight, ArrowUpRight, FileText, MessageSquare, Users } from "lucide-react";
import { usePageTitle } from "../../hooks/usePageTitle";

const RESOURCES = [
  { icon: GitHubIcon, label: "GitHub", desc: "Source code, issues, and contributions", href: "#" },
  { icon: MessageSquare, label: "Community", desc: "Join the discussion on Discord", href: "#" },
  { icon: FileText, label: "API docs", desc: "Reference for developers", href: "#" },
];

export default function CommunityPage() {
  usePageTitle("Community & resources");

  return (
    <>
      <h1 className="text-[22px] font-semibold text-text-primary flex items-center gap-2">
        <Users size={20} className="text-text-muted" />
        Community & resources
      </h1>
      <p className="mt-2 text-[14px] text-text-tertiary leading-relaxed max-w-2xl">
        Get help, share feedback, and connect with other nexu teams.
      </p>

      <section className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl">
        {RESOURCES.map((r) => {
          const Icon = r.icon;
          return (
            <a
              key={r.label}
              href={r.href}
              target="_blank"
              rel="noreferrer"
              className="flex flex-col gap-2 p-4 rounded-xl border border-border bg-surface-1 hover:border-border-hover hover:shadow-sm transition-all group"
            >
              <div className="flex items-center justify-between">
                <div className="w-9 h-9 rounded-lg bg-surface-2 flex items-center justify-center shrink-0">
                  <Icon size={16} className="text-text-secondary" />
                </div>
                <ArrowUpRight
                  size={14}
                  className="text-text-muted group-hover:text-accent shrink-0 transition-colors"
                />
              </div>
              <div>
                <div className="text-[13px] font-semibold text-text-primary">{r.label}</div>
                <p className="text-[12px] text-text-tertiary mt-0.5 leading-relaxed">{r.desc}</p>
              </div>
            </a>
          );
        })}
      </section>

      <div className="mt-8 p-4 rounded-xl border border-accent/20 bg-accent-subtle max-w-2xl">
        <div className="flex items-start gap-3">
          <ArrowRight size={18} className="text-accent shrink-0 mt-0.5" />
          <div>
            <div className="text-[13px] font-semibold text-text-primary">Ready to go deeper?</div>
            <p className="mt-1 text-[12px] text-text-tertiary leading-relaxed">
              Once your team has shipped the first outcome, explore more workflows, connect
              additional channels, and check the changelog for the latest capabilities.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
