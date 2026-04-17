import { useState, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import { Mail, Send, Check, Shield, Trash2, Moon, Sun, Monitor, Languages, ChevronDown } from 'lucide-react'
import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import { cn } from '@/lib/utils'
import { useWorkspaceStore } from '@/stores/workspace'
import { useThemeStore } from '@/stores/theme'
import { useLocaleStore, LOCALES, type Locale } from '@/stores/locale'
import { useT } from '@/i18n'
import { mockUsers } from '@/mock/data'

interface PendingInvite {
  email: string
  status: 'pending' | 'sending' | 'sent'
}

export function SettingsView(): React.ReactElement {
  const location = useLocation()
  const t = useT()
  const { theme, setTheme } = useThemeStore()
  const locale = useLocaleStore((s) => s.locale)
  const setLocale = useLocaleStore((s) => s.setLocale)
  const workspace = useWorkspaceStore((s) => s.workspace)
  const currentUserId = useWorkspaceStore((s) => s.currentUserId)
  const currentUser = mockUsers.find((u) => u.id === currentUserId) ?? mockUsers[0]
  const [inviteEmail, setInviteEmail] = useState('')
  const [pendingInvites, setPendingInvites] = useState<PendingInvite[]>([])
  const [emailError, setEmailError] = useState('')
  const errorTimerRef = useRef<ReturnType<typeof setTimeout>>(null)
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)

  const activeTab = location.pathname.startsWith('/settings/appearance')
    ? 'appearance'
    : location.pathname.startsWith('/settings/profile')
      ? 'profile'
      : 'workspace'

  const isValidEmail = (email: string): boolean =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

  const showError = (msg: string): void => {
    setEmailError(msg)
    if (errorTimerRef.current) clearTimeout(errorTimerRef.current)
    errorTimerRef.current = setTimeout(() => setEmailError(''), 3000)
  }

  const handleInvite = (): void => {
    const email = inviteEmail.trim()
    if (!email) return
    if (!isValidEmail(email)) {
      showError(t('workspace.invalidEmail'))
      return
    }
    if (pendingInvites.some((i) => i.email === email)) {
      showError(t('workspace.alreadyInvited'))
      return
    }

    setEmailError('')
    setPendingInvites((prev) => [...prev, { email, status: 'sending' }])
    setInviteEmail('')

    setTimeout(() => {
      setPendingInvites((prev) =>
        prev.map((i) => (i.email === email ? { ...i, status: 'sent' } : i))
      )
    }, 1200)
  }

  return (
    <div className="h-full overflow-y-auto">
      <div className="max-w-2xl mx-auto p-6">
        <div className="drag-region h-10" />

        {activeTab === 'workspace' && (
          <div className="space-y-6">
            <div>
              <label className="text-sm font-medium mb-2 block">{t('workspace.name')}</label>
              <input
                type="text"
                defaultValue={workspace?.name ?? ''}
                className="w-full h-10 rounded-lg border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-3 block">{t('workspace.inviteMembers')}</label>
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    type="email"
                    value={inviteEmail}
                    onChange={(e) => {
                      setInviteEmail(e.target.value)
                      if (emailError) setEmailError('')
                    }}
                    onKeyDown={(e) => e.key === 'Enter' && handleInvite()}
                    placeholder={t('workspace.invitePlaceholder')}
                    className={cn(
                      'w-full h-10 rounded-lg border bg-background pl-10 pr-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 transition-shadow',
                      emailError
                        ? 'border-destructive focus:ring-destructive/30'
                        : 'border-input focus:ring-ring'
                    )}
                  />
                </div>
                <button
                  onClick={handleInvite}
                  disabled={!inviteEmail.trim()}
                  className="flex items-center gap-2 h-10 px-4 rounded-lg bg-foreground text-background text-sm font-medium disabled:opacity-40 disabled:cursor-not-allowed hover:bg-foreground/90 transition-colors"
                >
                  <Send className="h-3.5 w-3.5" />
                  {t('workspace.invite')}
                </button>
              </div>
              {emailError ? (
                <p className="text-[11px] text-destructive-foreground mt-1.5">{emailError}</p>
              ) : inviteEmail.trim() ? (
                <p className="text-[11px] text-muted-foreground mt-1.5">
                  {t('workspace.pressEnterToInvite')}
                </p>
              ) : null}
              {pendingInvites.length > 0 && (
                <div className="mt-3 space-y-2">
                  {pendingInvites.map((invite) => (
                    <div key={invite.email} className="flex items-center gap-3 rounded-lg border border-dashed border-border p-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent">
                        <Mail className="h-3.5 w-3.5 text-muted-foreground" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm">{invite.email}</div>
                        <div className="text-xs text-muted-foreground">
                          {invite.status === 'sending' && t('workspace.sending')}
                          {invite.status === 'sent' && t('workspace.sent')}
                        </div>
                      </div>
                      {invite.status === 'sending' && (
                        <div className="h-4 w-4 rounded-full border-2 border-muted-foreground border-t-transparent animate-spin" />
                      )}
                      {invite.status === 'sent' && (
                        <Check className="h-4 w-4 text-nexu-online" />
                      )}
                      {invite.status === 'pending' && (
                        <span className="text-xs text-muted-foreground">{t('workspace.pending')}</span>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
            {currentUser.role === 'owner' && (
              <div className="rounded-xl border border-destructive/30 p-4 mt-2">
                <h3 className="text-sm font-semibold text-destructive-foreground mb-1">{t('workspace.dangerZone')}</h3>
                <p className="text-xs text-muted-foreground mb-3">{t('workspace.dangerHint')}</p>
                <button
                  onClick={() => setDeleteConfirmOpen(true)}
                  className="flex items-center gap-2 h-9 px-4 rounded-lg border border-destructive/50 text-destructive-foreground text-sm font-medium hover:bg-destructive/10 transition-colors"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  {t('workspace.delete')}
                </button>
              </div>
            )}
          </div>
        )}

        {activeTab === 'appearance' && (
          <div className="space-y-6">
            <div>
              <label className="text-sm font-medium mb-3 block">{t('appearance.theme')}</label>
              <div className="grid grid-cols-3 gap-3">
                {([
                  { id: 'light' as const, labelKey: 'appearance.light' as const, icon: Sun },
                  { id: 'dark' as const, labelKey: 'appearance.dark' as const, icon: Moon },
                  { id: 'system' as const, labelKey: 'appearance.system' as const, icon: Monitor }
                ]).map(({ id, labelKey, icon: Icon }) => (
                  <button
                    key={id}
                    onClick={() => setTheme(id)}
                    className={cn(
                      'flex flex-col items-center justify-center gap-2 h-24 rounded-xl text-sm font-medium transition-colors',
                      id === 'dark' && 'bg-zinc-950 text-zinc-100',
                      id === 'light' && 'bg-zinc-100 text-zinc-900',
                      id === 'system' && 'bg-linear-to-br from-zinc-100 from-50% to-zinc-950 to-50% text-zinc-500',
                      theme === id ? 'border-2 border-foreground' : 'border border-border'
                    )}
                  >
                    <Icon className="h-5 w-5" />
                    {t(labelKey)}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">{t('appearance.language')}</label>
              <p className="text-xs text-muted-foreground mb-3">{t('appearance.languageHint')}</p>
              <LanguagePicker locale={locale} onChange={setLocale} />
            </div>
          </div>
        )}

        {activeTab === 'profile' && (
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <img src={currentUser.avatar} alt="" className="h-16 w-16 rounded-full" />
              <button className="h-8 px-3 rounded-md text-sm border border-border hover:bg-accent transition-colors">
                {t('profile.changeAvatar')}
              </button>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">{t('profile.name')}</label>
              <input
                type="text"
                defaultValue={currentUser.name}
                className="w-full h-10 rounded-lg border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">{t('profile.email')}</label>
              <input
                type="email"
                defaultValue={currentUser.email}
                disabled
                className="w-full h-10 rounded-lg border border-input bg-secondary px-3 text-sm text-muted-foreground"
              />
            </div>
          </div>
        )}
      </div>

      {deleteConfirmOpen && (
        <DeleteConfirmDialog
          workspaceName={workspace?.name ?? 'this workspace'}
          onCancel={() => setDeleteConfirmOpen(false)}
          onConfirm={() => {
            setDeleteConfirmOpen(false)
          }}
        />
      )}
    </div>
  )
}

function LanguagePicker({
  locale,
  onChange
}: {
  locale: Locale
  onChange: (l: Locale) => void
}): React.ReactElement {
  const current = LOCALES.find((l) => l.code === locale) ?? LOCALES[0]
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button
          type="button"
          className="flex items-center gap-2 w-full h-10 rounded-lg border border-input bg-background px-3 text-sm hover:bg-accent/40 focus:outline-none focus:ring-2 focus:ring-ring transition-colors"
        >
          <Languages className="h-4 w-4 text-muted-foreground shrink-0" />
          <span className="flex-1 text-left truncate">{current.nativeLabel}</span>
          <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0" />
        </button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content
          align="start"
          sideOffset={4}
          className="z-50 min-w-[var(--radix-dropdown-menu-trigger-width)] max-h-[320px] overflow-y-auto rounded-lg border border-border bg-popover p-1 shadow-lg animate-in fade-in-0 zoom-in-95 duration-100"
        >
          {LOCALES.map((l) => {
            const active = l.code === locale
            return (
              <DropdownMenu.Item
                key={l.code}
                onSelect={() => onChange(l.code)}
                className={cn(
                  'flex items-center gap-2 px-2.5 py-1.5 rounded-md text-sm cursor-pointer outline-none hover:bg-accent focus:bg-accent transition-colors',
                  active && 'bg-accent/60'
                )}
              >
                <Check
                  className={cn('h-3.5 w-3.5 shrink-0', active ? 'text-foreground' : 'text-transparent')}
                />
                <span className="flex-1">{l.nativeLabel}</span>
                <span className="text-xs text-muted-foreground">{l.label}</span>
              </DropdownMenu.Item>
            )
          })}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  )
}

function DeleteConfirmDialog({
  workspaceName,
  onCancel,
  onConfirm
}: {
  workspaceName: string
  onCancel: () => void
  onConfirm: () => void
}): React.ReactElement {
  const t = useT()
  const [confirmText, setConfirmText] = useState('')
  const isMatch = confirmText === workspaceName

  const introParts = t('workspace.deleteConfirmIntro', { name: '\u0000' }).split('\u0000')
  const typeParts = t('workspace.deleteTypeToConfirm', { name: '\u0000' }).split('\u0000')

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={(e) => e.target === e.currentTarget && onCancel()}
    >
      <div className="w-[420px] rounded-xl border border-border bg-background shadow-xl">
        <div className="px-5 pt-5 pb-1">
          <h2 className="text-base font-semibold text-destructive-foreground">{t('workspace.deleteTitle')}</h2>
        </div>

        <div className="px-5 py-4 space-y-3">
          <p className="text-sm text-muted-foreground">
            {introParts[0]}
            <span className="font-medium text-foreground">{workspaceName}</span>
            {introParts[1]}
          </p>
          <p className="text-sm text-muted-foreground">
            {typeParts[0]}
            <span className="font-mono text-foreground bg-secondary px-1.5 py-0.5 rounded text-xs">{workspaceName}</span>
            {typeParts[1]}
          </p>
          <input
            value={confirmText}
            onChange={(e) => setConfirmText(e.target.value)}
            onKeyDown={(e) => e.key === 'Escape' && onCancel()}
            placeholder={workspaceName}
            autoFocus
            className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
          />
        </div>

        <div className="flex justify-end gap-2 px-5 pb-5">
          <button
            onClick={onCancel}
            className="h-8 px-3 rounded-md text-sm border border-border hover:bg-accent transition-colors"
          >
            {t('workspace.cancel')}
          </button>
          <button
            onClick={onConfirm}
            disabled={!isMatch}
            className="h-8 px-4 rounded-md text-sm font-medium bg-destructive text-white hover:bg-destructive/90 disabled:opacity-40 disabled:pointer-events-none transition-colors"
          >
            <span className="flex items-center gap-1.5">
              <Trash2 className="h-3.5 w-3.5" />
              {t('workspace.deleteForever')}
            </span>
          </button>
        </div>
      </div>
    </div>
  )
}
