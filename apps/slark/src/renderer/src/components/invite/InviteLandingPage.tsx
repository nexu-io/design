import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { Loader2, CheckCircle2, ExternalLink } from 'lucide-react'
import { useWorkspaceStore } from '@/stores/workspace'

type JoinState = 'idle' | 'joining' | 'joined' | 'error'

export function InviteLandingPage(): React.ReactElement {
  const { token } = useParams()
  const completeOnboarding = useWorkspaceStore((s) => s.completeOnboarding)
  const setWorkspace = useWorkspaceStore((s) => s.setWorkspace)
  const [state, setState] = useState<JoinState>('idle')

  const workspaceName = 'Acme Engineering'
  const inviterName = 'Alice Chen'

  const handleJoin = (): void => {
    setState('joining')
    setTimeout(() => {
      setWorkspace({
        id: 'ws-1',
        name: workspaceName,
        avatar: 'https://api.dicebear.com/9.x/identicon/svg?seed=acme&backgroundColor=6d28d9',
        createdAt: Date.now()
      })
      completeOnboarding()
      setState('joined')
    }, 1500)
  }

  const handleTryDeepLink = (): void => {
    window.location.href = `slark://join/${token}`
  }

  return (
    <div className="flex h-screen w-screen items-center justify-center bg-background">
      <div className="flex flex-col items-center max-w-md mx-auto px-6 text-center">
        <span className="text-3xl font-bold text-slark-primary tracking-tight mb-8">Slark</span>

        {state === 'idle' && (
          <>
            <div className="flex items-center justify-center h-16 w-16 rounded-2xl bg-secondary mb-6">
              <span className="text-2xl">👋</span>
            </div>
            <h1 className="text-xl font-semibold mb-2">
              {inviterName} invited you to join
            </h1>
            <p className="text-2xl font-bold mb-2">{workspaceName}</p>
            <p className="text-sm text-muted-foreground mb-8">
              Collaborate with your team and AI agents — write code, review PRs, and ship faster.
            </p>
            <button
              onClick={handleJoin}
              className="h-11 px-8 rounded-lg bg-slark-primary text-white text-sm font-semibold hover:bg-slark-primary/90 transition-colors"
            >
              Join {workspaceName}
            </button>
            <p className="text-xs text-muted-foreground mt-4">
              Invite code: <span className="font-mono text-foreground/70">{token}</span>
            </p>
          </>
        )}

        {state === 'joining' && (
          <>
            <Loader2 className="h-10 w-10 text-slark-primary animate-spin mb-6" />
            <p className="text-sm text-muted-foreground">Joining workspace...</p>
          </>
        )}

        {state === 'joined' && (
          <>
            <CheckCircle2 className="h-12 w-12 text-slark-online mb-6" />
            <h2 className="text-xl font-semibold mb-2">You're in! 🎉</h2>
            <p className="text-sm text-muted-foreground mb-8">
              You've successfully joined <strong>{workspaceName}</strong>.
            </p>
            <button
              onClick={handleTryDeepLink}
              className="flex items-center justify-center gap-2 h-11 px-8 rounded-lg bg-slark-primary text-white text-sm font-semibold hover:bg-slark-primary/90 transition-colors"
            >
              <ExternalLink className="h-4 w-4" />
              Open in Slark App
            </button>
          </>
        )}

        {state === 'error' && (
          <>
            <div className="flex items-center justify-center h-16 w-16 rounded-2xl bg-destructive/10 mb-6">
              <span className="text-2xl">😕</span>
            </div>
            <h2 className="text-xl font-semibold mb-2">Invalid Invite</h2>
            <p className="text-sm text-muted-foreground mb-6">
              This invitation link is invalid or has expired. Ask your teammate for a new one.
            </p>
          </>
        )}
      </div>
    </div>
  )
}
