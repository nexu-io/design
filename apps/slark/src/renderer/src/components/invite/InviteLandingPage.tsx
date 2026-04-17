import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { Loader2, CheckCircle2, ExternalLink, Users, Sparkles, ShieldCheck } from 'lucide-react'
import { useT } from '@/i18n'
import { useWorkspaceStore } from '@/stores/workspace'

type JoinState = 'idle' | 'joining' | 'joined' | 'error'

export function InviteLandingPage(): React.ReactElement {
  const t = useT()
  const { token } = useParams()
  const completeOnboarding = useWorkspaceStore((s) => s.completeOnboarding)
  const setWorkspace = useWorkspaceStore((s) => s.setWorkspace)
  const [state, setState] = useState<JoinState>('idle')

  const workspaceName = 'Acme Engineering'
  const workspaceAvatar =
    'https://api.dicebear.com/9.x/identicon/svg?seed=acme&backgroundColor=6d28d9'
  const inviterName = 'Alice Chen'
  const inviterAvatar = 'https://api.dicebear.com/9.x/avataaars/svg?seed=alice'
  const memberCount = 24

  const handleJoin = (): void => {
    setState('joining')
    setTimeout(() => {
      setWorkspace({
        id: 'ws-1',
        name: workspaceName,
        avatar: workspaceAvatar,
        createdAt: Date.now()
      })
      completeOnboarding()
      setState('joined')
    }, 1500)
  }

  const handleTryDeepLink = (): void => {
    window.location.href = `nexu://join/${token}`
  }

  return (
    <div className="relative flex min-h-screen w-screen items-center justify-center overflow-hidden bg-background">
      {/* Ambient background glows */}
      <div
        className="pointer-events-none absolute -top-40 -left-40 h-[480px] w-[480px] rounded-full opacity-40 blur-3xl"
        style={{ background: 'radial-gradient(circle, var(--color-nexu-primary, #6366f1) 0%, transparent 70%)' }}
      />
      <div
        className="pointer-events-none absolute -bottom-40 -right-40 h-[520px] w-[520px] rounded-full opacity-30 blur-3xl"
        style={{ background: 'radial-gradient(circle, #a855f7 0%, transparent 70%)' }}
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.015]"
        style={{
          backgroundImage:
            'linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)',
          backgroundSize: '48px 48px'
        }}
      />

      <div className="relative z-10 w-full max-w-md px-6 py-10">
        {/* Logo */}
        <div className="mb-8 flex items-center justify-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-nexu-primary">
            <Sparkles className="h-4 w-4 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight">Nexu</span>
        </div>

        <div className="relative overflow-hidden rounded-2xl border border-border bg-card/80 shadow-2xl backdrop-blur-xl">
          {/* Card top gradient accent */}
          <div
            className="h-1 w-full"
            style={{
              background:
                'linear-gradient(90deg, var(--color-nexu-primary, #6366f1), #a855f7, #ec4899)'
            }}
          />

          <div className="p-8">
            {state === 'idle' && (
              <>
                {/* Workspace identity */}
                <div className="flex flex-col items-center text-center">
                  <div className="relative mb-5">
                    <div className="h-20 w-20 overflow-hidden rounded-2xl border border-border bg-secondary ring-4 ring-background">
                      <img src={workspaceAvatar} alt={workspaceName} className="h-full w-full" />
                    </div>
                    {/* Inviter avatar badge */}
                    <div className="absolute -bottom-2 -right-2 h-9 w-9 overflow-hidden rounded-full border-2 border-background bg-secondary">
                      <img src={inviterAvatar} alt={inviterName} className="h-full w-full" />
                    </div>
                  </div>

                  <p className="text-sm text-muted-foreground">
                    <span className="font-medium text-foreground">{inviterName}</span> {t('invite.invitedYouToJoin')}
                  </p>
                  <h1 className="mt-1 text-2xl font-semibold tracking-tight">{workspaceName}</h1>

                  <div className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-border bg-secondary/50 px-2.5 py-1 text-xs text-muted-foreground">
                    <Users className="h-3 w-3" />
                    <span>{t('invite.membersCount', { count: String(memberCount) })}</span>
                  </div>
                </div>

                {/* Feature highlights */}
                <div className="mt-7 space-y-2.5">
                  {[
                    t('invite.feature1'),
                    t('invite.feature2'),
                    t('invite.feature3')
                  ].map((line, i) => (
                    <div key={i} className="flex items-start gap-2.5">
                      <div className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-nexu-online/15">
                        <CheckCircle2 className="h-3 w-3 text-nexu-online" />
                      </div>
                      <p className="text-sm text-muted-foreground">{line}</p>
                    </div>
                  ))}
                </div>

                {/* CTA */}
                <button
                  onClick={handleJoin}
                  className="mt-7 flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-nexu-primary text-sm font-semibold text-white shadow-lg shadow-nexu-primary/25 transition-all hover:bg-nexu-primary/90 hover:shadow-nexu-primary/40 active:translate-y-px"
                >
                  {t('invite.accept')}
                </button>

                <p className="mt-3 flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
                  <ShieldCheck className="h-3 w-3" />
                  {t('invite.verified')}
                </p>
              </>
            )}

            {state === 'joining' && (
              <div className="flex flex-col items-center py-6">
                <Loader2 className="mb-5 h-10 w-10 animate-spin text-nexu-primary" />
                <p className="text-sm font-medium">{t('invite.joining', { name: workspaceName })}</p>
                <p className="mt-1 text-xs text-muted-foreground">{t('invite.settingUp')}</p>
              </div>
            )}

            {state === 'joined' && (
              <div className="flex flex-col items-center py-2 text-center">
                <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-nexu-online/15">
                  <CheckCircle2 className="h-8 w-8 text-nexu-online" />
                </div>
                <h2 className="text-xl font-semibold">{t('invite.youreIn')}</h2>
                <p className="mt-1.5 text-sm text-muted-foreground">
                  {t('invite.welcomeTo')} <span className="font-medium text-foreground">{workspaceName}</span>
                </p>
                <button
                  onClick={handleTryDeepLink}
                  className="mt-6 flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-nexu-primary text-sm font-semibold text-white shadow-lg shadow-nexu-primary/25 transition-all hover:bg-nexu-primary/90 active:translate-y-px"
                >
                  <ExternalLink className="h-4 w-4" />
                  {t('invite.openInApp')}
                </button>
              </div>
            )}

            {state === 'error' && (
              <div className="flex flex-col items-center py-4 text-center">
                <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-destructive/10">
                  <span className="text-2xl">😕</span>
                </div>
                <h2 className="text-xl font-semibold">{t('invite.invalidTitle')}</h2>
                <p className="mt-1.5 text-sm text-muted-foreground">
                  {t('invite.invalidDesc')}
                </p>
              </div>
            )}
          </div>

          {state === 'idle' && (
            <div className="border-t border-border bg-secondary/30 px-8 py-3">
              <p className="text-center font-mono text-[11px] text-muted-foreground">
                {t('invite.inviteCode')} · <span className="text-foreground/70">{token}</span>
              </p>
            </div>
          )}
        </div>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          {t('invite.termsAgreement')}{' '}
          <span className="underline underline-offset-2 hover:text-foreground cursor-pointer">{t('invite.terms')}</span>
          {' '}{t('invite.and')}{' '}
          <span className="underline underline-offset-2 hover:text-foreground cursor-pointer">{t('invite.privacy')}</span>
        </p>
      </div>
    </div>
  )
}
