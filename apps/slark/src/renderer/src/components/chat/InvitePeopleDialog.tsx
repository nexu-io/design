import { useState, useEffect, useRef, useMemo } from 'react'
import { X, Mail, Send, Check, Eye, Link2, Copy } from 'lucide-react'
import { useT } from '@/i18n'
import { InviteEmailPreview } from '@/components/invite/InviteEmailPreview'

interface InvitePeopleDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

interface PendingInvite {
  email: string
  status: 'sending' | 'sent'
  token: string
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function InvitePeopleDialog({ open, onOpenChange }: InvitePeopleDialogProps): React.ReactElement | null {
  const t = useT()
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [invites, setInvites] = useState<PendingInvite[]>([])
  const [previewEmail, setPreviewEmail] = useState<string | null>(null)
  const [linkCopied, setLinkCopied] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const inviteToken = useMemo(
    () => Math.random().toString(36).slice(2, 10) + Date.now().toString(36),
    [open]
  )
  const inviteLinkUrl = `${window.location.origin}/invite/${inviteToken}`

  const handleCopyLink = async (): Promise<void> => {
    try {
      await navigator.clipboard.writeText(inviteLinkUrl)
      setLinkCopied(true)
      setTimeout(() => setLinkCopied(false), 1500)
    } catch {
      /* noop */
    }
  }

  useEffect(() => {
    if (open) requestAnimationFrame(() => inputRef.current?.focus())
  }, [open])

  if (!open) return null

  const generateToken = (): string =>
    Math.random().toString(36).slice(2, 10) + Date.now().toString(36)

  const handleInvite = (): void => {
    const trimmed = email.trim()
    if (!trimmed) {
      setError(t('invitePeople.enterEmail'))
      return
    }
    if (!EMAIL_RE.test(trimmed)) {
      setError(t('workspace.invalidEmail'))
      return
    }
    if (invites.some((i) => i.email === trimmed)) {
      setError(t('workspace.alreadyInvited'))
      return
    }

    setError('')
    const token = generateToken()
    setInvites((prev) => [...prev, { email: trimmed, status: 'sending', token }])
    setEmail('')

    setTimeout(() => {
      setInvites((prev) =>
        prev.map((i) => (i.email === trimmed ? { ...i, status: 'sent' } : i))
      )
    }, 1200)
  }

  const handleClose = (): void => {
    onOpenChange(false)
    setEmail('')
    setError('')
    setInvites([])
    setPreviewEmail(null)
  }

  const previewInvite = invites.find((i) => i.email === previewEmail)

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={handleClose}
    >
      <div
        className={`rounded-xl border border-border bg-background text-foreground p-0 shadow-xl transition-all ${previewEmail ? 'w-[860px]' : 'w-[460px]'}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 pt-5 pb-1">
          <h2 className="text-base font-semibold text-foreground">
            {previewEmail ? t('invitePeople.emailPreview') : t('invitePeople.title')}
          </h2>
          <button
            onClick={previewEmail ? () => setPreviewEmail(null) : handleClose}
            className="flex items-center justify-center h-7 w-7 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {previewEmail && previewInvite ? (
          <div className="px-5 py-4 space-y-3">
            <div className="text-xs text-muted-foreground space-y-1 px-1">
              <div><span className="font-medium text-foreground">{t('invitePeople.to')}</span> {previewInvite.email}</div>
              <div><span className="font-medium text-foreground">{t('invitePeople.from')}</span> nexu@notifications.nexu.app</div>
              <div><span className="font-medium text-foreground">{t('invitePeople.subject')}</span> Alice Chen invited you to Acme Engineering on Nexu</div>
            </div>
            <div className="rounded-lg overflow-hidden border border-border">
              <InviteEmailPreview
                inviterName="Alice Chen"
                workspaceName="Acme Engineering"
                inviteLink={`${window.location.origin}/invite/${previewInvite.token}`}
              />
            </div>
            <div className="flex justify-end">
              <button
                onClick={() => setPreviewEmail(null)}
                className="h-8 px-3 rounded-md text-sm border border-border hover:bg-accent transition-colors"
              >
                {t('common.back')}
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="px-5 py-4 space-y-4">
              <p className="text-sm text-muted-foreground">
                {t('invitePeople.intro')}
              </p>

              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                  <input
                    ref={inputRef}
                    type="email"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); setError('') }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleInvite()
                      if (e.key === 'Escape') handleClose()
                    }}
                    placeholder={t('workspace.invitePlaceholder')}
                    className="w-full h-9 rounded-md border border-input bg-background pl-9 pr-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                  />
                </div>
                <button
                  onClick={handleInvite}
                  className="flex items-center gap-1.5 h-9 px-3 rounded-md text-sm font-medium bg-foreground text-background hover:bg-foreground/90 disabled:opacity-40 disabled:pointer-events-none transition-colors"
                >
                  <Send className="h-3.5 w-3.5" />
                  {t('common.send')}
                </button>
              </div>

              {error && (
                <p className="text-xs text-destructive-foreground">{error}</p>
              )}

              <div className="flex items-center gap-2 rounded-lg border border-dashed border-border bg-secondary/40 px-3 py-2.5">
                <Link2 className="h-4 w-4 text-muted-foreground shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="text-xs text-muted-foreground mb-0.5">{t('onboarding.shareInviteLink')}</div>
                  <div className="text-xs font-mono text-foreground truncate">{inviteLinkUrl}</div>
                </div>
                <button
                  onClick={handleCopyLink}
                  className="flex items-center gap-1.5 h-7 px-2.5 rounded-md text-xs font-medium border border-border bg-background text-foreground hover:bg-accent transition-colors shrink-0"
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

              {invites.length > 0 && (
                <div className="space-y-2">
                  {invites.map((inv) => (
                    <div
                      key={inv.email}
                      className="group flex items-center gap-3 rounded-lg border border-dashed border-border p-2.5"
                    >
                      <div className="flex h-7 w-7 items-center justify-center rounded-full bg-accent shrink-0">
                        <Mail className="h-3 w-3 text-muted-foreground" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm truncate">{inv.email}</div>
                        <div className="text-xs text-muted-foreground">
                          {inv.status === 'sending' ? t('invitePeople.sending') : t('invitePeople.sent')}
                        </div>
                      </div>
                      {inv.status === 'sending' ? (
                        <div className="h-4 w-4 rounded-full border-2 border-muted-foreground border-t-transparent animate-spin shrink-0" />
                      ) : (
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => setPreviewEmail(inv.email)}
                            className="hidden group-hover:flex items-center justify-center h-6 w-6 rounded hover:bg-accent transition-colors"
                            title={t('invitePeople.previewEmail')}
                          >
                            <Eye className="h-3.5 w-3.5 text-muted-foreground" />
                          </button>
                          <Check className="h-4 w-4 text-nexu-online shrink-0" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex justify-end px-5 pb-5">
              <button
                onClick={handleClose}
                className="h-8 px-3 rounded-md text-sm border border-border text-foreground hover:bg-accent transition-colors"
              >
                {t('common.done')}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
