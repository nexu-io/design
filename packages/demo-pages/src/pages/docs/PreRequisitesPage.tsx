import { Shield } from "lucide-react";
import { usePageTitle } from "../../hooks/usePageTitle";

const WORKSPACE_ITEMS = ["Admin access", "Active channel", "Slack/Feishu connected"];

const TEAM_ITEMS = ["Concrete workflow", "DRI for rollout", "20 minutes for quick start"];

export default function PreRequisitesPage() {
  usePageTitle("Pre-requisites");

  return (
    <>
      <h1 className="text-[22px] font-semibold text-text-primary flex items-center gap-2">
        <Shield size={20} className="text-text-muted" />
        Pre-requisites
      </h1>
      <p className="mt-2 text-[14px] text-text-tertiary leading-relaxed max-w-2xl">
        Before you start, make sure your workspace meets these requirements.
      </p>
      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl">
        <div className="p-4 rounded-xl border border-border bg-surface-1">
          <div className="text-[13px] font-semibold text-text-primary mb-3">Workspace</div>
          <ul className="space-y-2">
            {WORKSPACE_ITEMS.map((item) => (
              <li key={item} className="flex items-start gap-2 text-[13px] text-text-tertiary">
                <span className="text-success shrink-0">✓</span>
                {item}
              </li>
            ))}
          </ul>
        </div>
        <div className="p-4 rounded-xl border border-border bg-surface-1">
          <div className="text-[13px] font-semibold text-text-primary mb-3">Team readiness</div>
          <ul className="space-y-2">
            {TEAM_ITEMS.map((item) => (
              <li key={item} className="flex items-start gap-2 text-[13px] text-text-tertiary">
                <span className="text-success shrink-0">✓</span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}
