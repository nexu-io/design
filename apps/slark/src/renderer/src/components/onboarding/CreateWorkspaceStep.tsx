import { useState, useRef, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowRight, Building2, Mail, Send, Check, Link2, Copy, LogIn } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useT } from '@/i18n'
import { useWorkspaceStore } from '@/stores/workspace'

type Mode = 'create' | 'join'

export function CreateWorkspaceStep(): React.ReactElement {
  const t = useT()
  const navigate = useNavigate()
  const setWorkspace = useWorkspaceStore((s) => s.setWorkspace)
  const completeOnboarding = useWorkspaceStore((s) => s.completeOnboarding)

  const [mode, setMode] = useState<Mode>('create')

  // Create mode state
  const [name, setName] = useState('')
  const [invitedEmails, setInvitedEmails] = useState<string[]>([])
  const [emailInput, setEmailInput] = useState('')
  const [emailError, setEmailError] = useState('')
  const [linkCopied, setLinkCopied] = useState(false)
  const emailRef = useRef<HTMLInputElement>(null)
  const errorTimerRef = useRef<ReturnType<typeof setTimeout>>(null)
  const copyTimerRef = useRef<ReturnType<typeof setTimeout>>(null)

  // Join mode state
  const [inviteLink, setInviteLink] = useState('')
  const [joinError, setJoinError] = useState('')
  const [joining, setJoining] = useState(false)

  const inviteToken = useMemo(
    () => Math.random().toString(36).slice(2, 10) + Date.now().toString(36),
    []
  )
  const inviteLinkUrl = `${window.location.origin}/invite/${inviteToken}`

  const isValidEmail = (email: string): boolean =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

  const showError = (msg: string): void => {
    setEmailError(msg)
    if (errorTimerRef.current) clearTimeout(errorTimerRef.current)
    errorTimerRef.current = setTimeout(() => setEmailError(''), 3000)
  }

  const addEmail = (): void => {
    const email = emailInput.trim()
    if (!email) return
    if (!isValidEmail(email)) {
      showError(t('workspace.invalidEmail'))
      return
    }
    if (invitedEmails.includes(email)) {
      showError(t('onboarding.emailAlreadyAdded'))
      return
    }
    setInvitedEmails((prev) => [...prev, email])
    setEmailInput('')
    setEmailError('')
  }

  const handleEmailKeyDown = (e: React.KeyboardEvent): void => {
    if (e.key === 'Enter') {
      e.preventDefault()
      addEmail()
    }
  }

  const handleCopyLink = async (): Promise<void> => {
    try {
      await navigator.clipboard.writeText(inviteLinkUrl)
    } catch {
      // fallback — ignore
    }
    setLinkCopied(true)
    if (copyTimerRef.current) clearTimeout(copyTimerRef.current)
    copyTimerRef.current = setTimeout(() => setLinkCopied(false), 2000)
  }

  const handleContinue = (): void => {
    if (!name.trim()) return
    setWorkspace({
      id: `ws-${Date.now()}`,
      name: name.trim(),
      createdAt: Date.now()
    })
    navigate('/onboarding/runtime')
  }

  const handleJoin = (): void => {
    const link = inviteLink.trim()
    if (!link) {
      setJoinError(t('onboarding.pasteInviteOrCode'))
      return
    }
    // Accept full URL or bare token
    const tokenMatch = link.match(/invite\/([^/?#]+)/)
    const token = tokenMatch ? tokenMatch[1] : link
    if (token.length < 4) {
      setJoinError(t('onboarding.invalidInviteLink'))
      return
    }
    setJoinError('')
    setJoining(true)
    setTimeout(() => {
      setWorkspace({
        id: 'ws-1',
        name: 'Acme Engineering',
        avatar:
          'https://api.dicebear.com/9.x/identicon/svg?seed=acme&backgroundColor=6d28d9',
        createdAt: Date.now()
      })
      completeOnboarding()
      setJoining(false)
      navigate('/')
    }, 1200)
  }

  return (
    <div className="flex flex-col items-center gap-6 pt-10">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-accent">
        <Building2 className="h-7 w-7 text-muted-foreground" />
      </div>
      <div className="text-center">
        <h2 className="text-2xl font-semibold">
          {mode === 'create' ? t('onboarding.createWorkspace') : t('onboarding.joinWorkspace')}
        </h2>
        <p className="text-muted-foreground mt-2">
          {mode === 'create'
            ? t('onboarding.createWorkspaceDesc')
            : t('onboarding.joinWorkspaceDesc')}
        </p>
      </div>

      <div className="inline-flex items-center gap-1 rounded-lg bg-secondary p-1">
        <button
          onClick={() => setMode('create')}
          className={cn(
            'flex items-center gap-1.5 h-8 px-3 rounded-md text-sm font-medium transition-colors',
            mode === 'create'
              ? 'bg-background text-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground'
          )}
        >
          <Building2 className="h-3.5 w-3.5" />
          {t('onboarding.createNew')}
        </button>
        <button
          onClick={() => setMode('join')}
          className={cn(
            'flex items-center gap-1.5 h-8 px-3 rounded-md text-sm font-medium transition-colors',
            mode === 'join'
              ? 'bg-background text-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground'
          )}
        >
          <LogIn className="h-3.5 w-3.5" />
          {t('onboarding.joinExisting')}
        </button>
      </div>

      {mode === 'create' ? (
        <>
          <div className="w-full max-w-sm space-y-5">
            <div>
              <label className="text-sm font-medium mb-1.5 block">{t('onboarding.workspaceName')}</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={t('onboarding.workspaceNamePlaceholder')}
                className="w-full h-10 rounded-lg border border-input bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                autoFocus
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-1.5 block">{t('onboarding.inviteMembers')}</label>
              <div className="flex items-center gap-2">
                <div
                  className={cn(
                    'flex-1 flex items-center gap-2 h-10 rounded-lg border bg-background px-3 transition-shadow focus-within:ring-2',
                    emailError
                      ? 'border-destructive focus-within:ring-destructive/30'
                      : 'border-input focus-within:ring-ring'
                  )}
                >
                  <Mail className="h-4 w-4 text-muted-foreground shrink-0" />
                  <input
                    ref={emailRef}
                    type="email"
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    onKeyDown={handleEmailKeyDown}
                    placeholder={t('workspace.invitePlaceholder')}
                    className="flex-1 h-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
                  />
                </div>
                <button
                  onClick={addEmail}
                  disabled={!emailInput.trim()}
                  className="flex items-center gap-1.5 h-10 px-4 rounded-lg bg-foreground text-background text-sm font-medium disabled:opacity-40 disabled:cursor-not-allowed hover:bg-foreground/90 transition-colors shrink-0"
                >
                  <Send className="h-3.5 w-3.5" />
                  {t('workspace.invite')}
                </button>
              </div>
              {emailError && (
                <p className="text-[11px] text-destructive-foreground mt-1.5">{emailError}</p>
              )}

              <div className="mt-3 flex items-center gap-2 rounded-lg border border-dashed border-border bg-secondary/40 px-3 py-2.5">
                <Link2 className="h-4 w-4 text-muted-foreground shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="text-xs text-muted-foreground mb-0.5">{t('onboarding.shareInviteLink')}</div>
                  <div className="text-xs font-mono text-foreground truncate">{inviteLinkUrl}</div>
                </div>
                <button
                  onClick={handleCopyLink}
                  className="flex items-center gap-1.5 h-7 px-2.5 rounded-md text-xs font-medium border border-border bg-background hover:bg-accent transition-colors shrink-0"
                >
                  {linkCopied ? (
                    <>
                      <Check className="h-3 w-3 text-nexu-online" />
                      {t('common.copied')}
                    </>
                  ) : (
                    <>
                      <Copy className="h-3 w-3" />
                      {t('common.copy')}
                    </>
                  )}
                </button>
              </div>

              {invitedEmails.length > 0 && (
                <div className="mt-3 space-y-1">
                  {invitedEmails.map((email) => (
                    <div
                      key={email}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-lg border border-border"
                    >
                      <Mail className="h-4 w-4 text-muted-foreground shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium truncate">{email}</div>
                        <div className="text-xs text-muted-foreground">{t('onboarding.invitationSent')}</div>
                      </div>
                      <Check className="h-3.5 w-3.5 text-nexu-online shrink-0" />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <button
            onClick={handleContinue}
            disabled={!name.trim()}
            className="flex items-center gap-2 h-11 px-6 rounded-lg bg-foreground text-background font-medium disabled:opacity-40 disabled:cursor-not-allowed hover:bg-foreground/90 transition-colors mt-2"
          >
            {t('common.continue')}
            <ArrowRight className="h-4 w-4" />
          </button>
        </>
      ) : (
        <>
          <div className="w-full max-w-sm space-y-5">
            <div>
              <label className="text-sm font-medium mb-1.5 block">{t('onboarding.inviteLink')}</label>
              <div
                className={cn(
                  'flex items-center gap-2 h-10 rounded-lg border bg-background px-3 transition-shadow focus-within:ring-2',
                  joinError
                    ? 'border-destructive focus-within:ring-destructive/30'
                    : 'border-input focus-within:ring-ring'
                )}
              >
                <Link2 className="h-4 w-4 text-muted-foreground shrink-0" />
                <input
                  type="text"
                  value={inviteLink}
                  onChange={(e) => {
                    setInviteLink(e.target.value)
                    setJoinError('')
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      handleJoin()
                    }
                  }}
                  placeholder={t('onboarding.invitePlaceholderUrl')}
                  className="flex-1 h-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
                  autoFocus
                />
              </div>
              {joinError && (
                <p className="text-[11px] text-destructive-foreground mt-1.5">{joinError}</p>
              )}
              <p className="text-xs text-muted-foreground mt-2">
                {t('onboarding.inviteHint')}
              </p>
            </div>
          </div>

          <button
            onClick={handleJoin}
            disabled={!inviteLink.trim() || joining}
            className="flex items-center gap-2 h-11 px-6 rounded-lg bg-foreground text-background font-medium disabled:opacity-40 disabled:cursor-not-allowed hover:bg-foreground/90 transition-colors mt-2"
          >
            {joining ? (
              <>
                <div className="h-4 w-4 rounded-full border-2 border-background border-t-transparent animate-spin" />
                {t('onboarding.joining')}
              </>
            ) : (
              <>
                {t('onboarding.joinWorkspaceCta')}
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </>
      )}
    </div>
  )
}
