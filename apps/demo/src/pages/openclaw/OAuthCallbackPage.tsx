import { ProviderLogo, SlackIcon } from "@nexu-design/ui-web";
import { ArrowLeft, Check, ExternalLink, Shield } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { findSkillById } from "./skillData";

// Map toolId to display info
function getToolInfo(toolId: string) {
  // Try to find in skillData first
  const result = findSkillById(toolId);
  if (result) {
    const { skill } = result;
    const provider = skill.tools?.[0]?.provider ?? "nexu";
    return { name: skill.name, provider, isGoogle: provider === "Google" };
  }
  // Fallback for common tools
  const fallback: Record<string, { name: string; provider: string; isGoogle: boolean }> = {
    gcal: { name: "Google Calendar", provider: "Google", isGoogle: true },
    gmail: { name: "Gmail", provider: "Google", isGoogle: true },
    "google-drive": { name: "Google Drive", provider: "Google", isGoogle: true },
    "google-docs": { name: "Google Docs", provider: "Google", isGoogle: true },
    "google-sheets": { name: "Google Sheets", provider: "Google", isGoogle: true },
    slack: { name: "Slack", provider: "Slack", isGoogle: false },
    notion: { name: "Notion", provider: "Notion", isGoogle: false },
    github: { name: "GitHub", provider: "GitHub", isGoogle: false },
  };
  return fallback[toolId] ?? { name: toolId, provider: toolId, isGoogle: false };
}

type AuthPhase = "connecting" | "authorizing" | "success";

export default function OAuthCallbackPage() {
  const { toolId } = useParams<{ toolId: string }>();
  const [phase, setPhase] = useState<AuthPhase>("connecting");
  const tool = getToolInfo(toolId ?? "");

  useEffect(() => {
    // Simulate OAuth flow
    const t1 = setTimeout(() => setPhase("authorizing"), 1200);
    const t2 = setTimeout(() => setPhase("success"), 3000);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  return (
    <div className="min-h-screen bg-surface-0 flex items-center justify-center">
      <div className="w-full max-w-sm mx-4">
        {/* Card */}
        <div className="rounded-2xl border border-border bg-surface-1 shadow-lg overflow-hidden">
          {/* Header */}
          <div className="px-6 pt-6 pb-4 text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-surface-3 flex items-center justify-center">
                {tool.isGoogle ? (
                  <ProviderLogo provider="google" size={20} />
                ) : (
                  <span className="text-[18px] font-bold text-text-primary">{tool.name[0]}</span>
                )}
              </div>
              <div className="flex items-center gap-1 text-text-muted">
                <div className="w-1.5 h-1.5 rounded-full bg-border" />
                <div className="w-6 h-px bg-border" />
                <div className="w-1.5 h-1.5 rounded-full bg-border" />
              </div>
              <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center">
                <div className="flex justify-center items-center w-7 h-7 rounded bg-accent">
                  <span className="text-[10px] font-bold text-accent-fg">N</span>
                </div>
              </div>
            </div>
            <h1 className="text-[18px] font-bold text-text-primary mb-1">
              {phase === "success" ? "Connected!" : `Connect ${tool.name}`}
            </h1>
            <p className="text-[13px] text-text-muted">
              {phase === "success"
                ? `${tool.name} is now connected to nexu`
                : `nexu is requesting access to your ${tool.name} account`}
            </p>
          </div>

          {/* Body */}
          <div className="px-6 pb-6">
            {phase !== "success" ? (
              <>
                {/* Permissions list */}
                <div className="rounded-xl bg-surface-0 border border-border p-4 mb-4">
                  <div className="text-[11px] font-semibold text-text-muted uppercase tracking-wider mb-3">
                    Permissions requested
                  </div>
                  <div className="space-y-2.5">
                    {[
                      `Read your ${tool.name} data`,
                      "Perform actions on your behalf",
                      "Access will be scoped to nexu tasks only",
                    ].map((perm) => (
                      <div key={perm} className="flex items-start gap-2.5">
                        <Shield size={12} className="text-accent shrink-0 mt-0.5" />
                        <span className="text-[12px] text-text-secondary leading-relaxed">
                          {perm}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Progress indicator */}
                <div className="flex items-center justify-center gap-3 py-4">
                  <div className="w-4 h-4 border-2 border-accent/30 border-t-accent rounded-full animate-spin" />
                  <span className="text-[13px] text-text-muted">
                    {phase === "connecting"
                      ? `Connecting to ${tool.provider}...`
                      : "Waiting for authorization..."}
                  </span>
                </div>

                <p className="text-[11px] text-text-muted text-center leading-relaxed">
                  nexu uses OAuth 2.0. Your credentials are never stored. You can revoke access
                  anytime.
                </p>
              </>
            ) : (
              <>
                {/* Success state */}
                <div className="flex flex-col items-center py-6">
                  <div className="w-14 h-14 rounded-full bg-emerald-500/10 flex items-center justify-center mb-4">
                    <Check size={28} className="text-emerald-500" />
                  </div>
                  <p className="text-[14px] font-semibold text-text-primary mb-1">
                    Authorization successful
                  </p>
                  <p className="text-[12px] text-text-muted text-center mb-6">
                    nexu can now access your {tool.name} to complete tasks. You can manage
                    connections in your workspace settings.
                  </p>

                  {/* Return to Slack button */}
                  <a
                    href="https://slack.com/app"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-xl bg-[#4A154B] text-white text-[13px] font-medium hover:bg-[#3e1240] transition-colors mb-2.5"
                  >
                    <SlackIcon size={16} />
                    Return to Slack
                    <ExternalLink size={12} className="opacity-60" />
                  </a>

                  <Link
                    to="/openclaw/workspace"
                    className="flex items-center justify-center gap-1.5 w-full px-4 py-2.5 rounded-xl border border-border text-text-secondary text-[13px] font-medium hover:bg-surface-2 transition-colors"
                  >
                    <ArrowLeft size={14} />
                    Go to Workspace
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-4">
          <p className="text-[11px] text-text-muted">
            Powered by nexu ·{" "}
            <Link to="/openclaw/privacy" className="hover:underline">
              Privacy Policy
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
