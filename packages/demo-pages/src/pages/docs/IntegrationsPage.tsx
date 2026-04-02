import { MessageSquare } from "lucide-react";
import { usePageTitle } from "../../hooks/usePageTitle";

const PLATFORMS = [
  {
    name: "Slack",
    status: "Available",
    statusClass: "text-success",
    desc: "Full integration with channels, threads, and DMs.",
  },
  {
    name: "Feishu / Lark",
    status: "Available",
    statusClass: "text-success",
    desc: "Native bot with group chat and document access.",
  },
  {
    name: "Discord",
    status: "Coming soon",
    statusClass: "text-amber-500",
    desc: "Community and team server support.",
  },
  {
    name: "Microsoft Teams",
    status: "Planned",
    statusClass: "text-text-muted",
    desc: "Enterprise workplace integration.",
  },
];

export default function IntegrationsPage() {
  usePageTitle("Channels");

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-[20px] font-semibold text-text-primary flex items-center gap-2">
          <MessageSquare size={18} className="text-text-muted" />
          Channels
        </h1>
        <p className="mt-3 text-[14px] text-text-secondary leading-relaxed max-w-2xl">
          nexu connects to the platforms your team already uses. Configure channels to determine
          where nexu listens and responds.
        </p>
      </div>

      <div className="space-y-3 max-w-2xl">
        {PLATFORMS.map((p) => (
          <div
            key={p.name}
            className="flex items-start gap-3 p-4 rounded-xl border border-border bg-surface-1"
          >
            <div className="w-9 h-9 rounded-lg bg-surface-2 flex items-center justify-center shrink-0">
              <MessageSquare size={16} className="text-text-secondary" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-[14px] font-semibold text-text-primary">{p.name}</span>
                <span className={`text-[11px] font-medium ${p.statusClass}`}>{p.status}</span>
              </div>
              <p className="text-[13px] text-text-tertiary mt-1 leading-relaxed">{p.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
