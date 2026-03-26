import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Check, ArrowLeft, Shield, ExternalLink } from 'lucide-react';
import { findSkillById } from './skillData';

function GoogleIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
    </svg>
  );
}

function SlackIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523A2.528 2.528 0 0 1 0 15.165a2.527 2.527 0 0 1 2.522-2.52h2.52v2.52zm1.271 0a2.527 2.527 0 0 1 2.521-2.52 2.527 2.527 0 0 1 2.521 2.52v6.313A2.528 2.528 0 0 1 8.834 24a2.528 2.528 0 0 1-2.521-2.522v-6.313z" fill="#E01E5A" />
      <path d="M8.834 5.042a2.528 2.528 0 0 1-2.521-2.52A2.528 2.528 0 0 1 8.834 0a2.528 2.528 0 0 1 2.521 2.522v2.52H8.834zm0 1.271a2.527 2.527 0 0 1 2.521 2.521 2.527 2.527 0 0 1-2.521 2.521H2.522A2.528 2.528 0 0 1 0 8.834a2.528 2.528 0 0 1 2.522-2.521h6.312z" fill="#36C5F0" />
      <path d="M18.956 8.834a2.528 2.528 0 0 1 2.522-2.521A2.528 2.528 0 0 1 24 8.834a2.528 2.528 0 0 1-2.522 2.521h-2.522V8.834zm-1.27 0a2.528 2.528 0 0 1-2.523 2.521 2.527 2.527 0 0 1-2.52-2.521V2.522A2.527 2.527 0 0 1 15.163 0a2.528 2.528 0 0 1 2.523 2.522v6.312z" fill="#2EB67D" />
      <path d="M15.163 18.956a2.528 2.528 0 0 1 2.523 2.522A2.528 2.528 0 0 1 15.163 24a2.527 2.527 0 0 1-2.52-2.522v-2.522h2.52zm0-1.27a2.527 2.527 0 0 1-2.52-2.523 2.527 2.527 0 0 1 2.52-2.52h6.315A2.528 2.528 0 0 1 24 15.163a2.528 2.528 0 0 1-2.522 2.523h-6.315z" fill="#ECB22E" />
    </svg>
  );
}

// Map toolId to display info
function getToolInfo(toolId: string) {
  // Try to find in skillData first
  const result = findSkillById(toolId);
  if (result) {
    const { skill } = result;
    const provider = skill.tools?.[0]?.provider ?? 'nexu';
    return { name: skill.name, provider, isGoogle: provider === 'Google' };
  }
  // Fallback for common tools
  const fallback: Record<string, { name: string; provider: string; isGoogle: boolean }> = {
    gcal: { name: 'Google Calendar', provider: 'Google', isGoogle: true },
    gmail: { name: 'Gmail', provider: 'Google', isGoogle: true },
    'google-drive': { name: 'Google Drive', provider: 'Google', isGoogle: true },
    'google-docs': { name: 'Google Docs', provider: 'Google', isGoogle: true },
    'google-sheets': { name: 'Google Sheets', provider: 'Google', isGoogle: true },
    slack: { name: 'Slack', provider: 'Slack', isGoogle: false },
    notion: { name: 'Notion', provider: 'Notion', isGoogle: false },
    github: { name: 'GitHub', provider: 'GitHub', isGoogle: false },
  };
  return fallback[toolId] ?? { name: toolId, provider: toolId, isGoogle: false };
}

type AuthPhase = 'connecting' | 'authorizing' | 'success';

export default function OAuthCallbackPage() {
  const { toolId } = useParams<{ toolId: string }>();
  const [phase, setPhase] = useState<AuthPhase>('connecting');
  const tool = getToolInfo(toolId ?? '');

  useEffect(() => {
    // Simulate OAuth flow
    const t1 = setTimeout(() => setPhase('authorizing'), 1200);
    const t2 = setTimeout(() => setPhase('success'), 3000);
    return () => { clearTimeout(t1); clearTimeout(t2); };
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
                {tool.isGoogle ? <GoogleIcon /> : (
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
              {phase === 'success' ? 'Connected!' : `Connect ${tool.name}`}
            </h1>
            <p className="text-[13px] text-text-muted">
              {phase === 'success'
                ? `${tool.name} is now connected to nexu`
                : `nexu is requesting access to your ${tool.name} account`}
            </p>
          </div>

          {/* Body */}
          <div className="px-6 pb-6">
            {phase !== 'success' ? (
              <>
                {/* Permissions list */}
                <div className="rounded-xl bg-surface-0 border border-border p-4 mb-4">
                  <div className="text-[11px] font-semibold text-text-muted uppercase tracking-wider mb-3">Permissions requested</div>
                  <div className="space-y-2.5">
                    {[
                      `Read your ${tool.name} data`,
                      `Perform actions on your behalf`,
                      `Access will be scoped to nexu tasks only`,
                    ].map((perm, i) => (
                      <div key={i} className="flex items-start gap-2.5">
                        <Shield size={12} className="text-accent shrink-0 mt-0.5" />
                        <span className="text-[12px] text-text-secondary leading-relaxed">{perm}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Progress indicator */}
                <div className="flex items-center justify-center gap-3 py-4">
                  <div className="w-4 h-4 border-2 border-accent/30 border-t-accent rounded-full animate-spin" />
                  <span className="text-[13px] text-text-muted">
                    {phase === 'connecting' ? 'Connecting to ' + tool.provider + '...' : 'Waiting for authorization...'}
                  </span>
                </div>

                <p className="text-[11px] text-text-muted text-center leading-relaxed">
                  nexu uses OAuth 2.0. Your credentials are never stored. You can revoke access anytime.
                </p>
              </>
            ) : (
              <>
                {/* Success state */}
                <div className="flex flex-col items-center py-6">
                  <div className="w-14 h-14 rounded-full bg-emerald-500/10 flex items-center justify-center mb-4">
                    <Check size={28} className="text-emerald-500" />
                  </div>
                  <p className="text-[14px] font-semibold text-text-primary mb-1">Authorization successful</p>
                  <p className="text-[12px] text-text-muted text-center mb-6">
                    nexu can now access your {tool.name} to complete tasks. You can manage connections in your workspace settings.
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
            Powered by nexu · <Link to="/openclaw/privacy" className="hover:underline">Privacy Policy</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
