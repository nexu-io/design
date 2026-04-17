import type * as React from 'react'

import { AuthShell, cn } from '@nexu-design/ui-web'
import { TitleBarDragRegion } from '@/components/layout/WindowChrome'

interface SlarkAuthFrameProps {
  children: React.ReactNode
  contentInnerClassName?: string
}

function SlarkAuthBackdrop(): React.ReactElement {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0"
      style={{
        background:
          'radial-gradient(120% 80% at 50% -10%, rgba(45,212,191,0.08), transparent 55%)',
      }}
    />
  )
}

function SlarkAuthMark(): React.ReactElement {
  return (
    <div className="flex flex-col items-center gap-3 text-center">
      <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-border bg-surface-1 text-base font-semibold tracking-tight text-text-primary shadow-sm">
        S
      </div>
      <div className="space-y-1">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-text-tertiary">
          Slark
        </p>
        <p className="text-[12px] text-text-muted">Desktop-first workspace for humans and agents</p>
      </div>
    </div>
  )
}

function SlarkAuthFooter(): React.ReactElement {
  return (
    <p className="text-center text-[11px] text-text-tertiary">
      Sign in, join invites, and finish setup without leaving the shared desktop shell.
    </p>
  )
}

export function SlarkAuthFrame({
  children,
  contentInnerClassName,
}: SlarkAuthFrameProps): React.ReactElement {
  return (
    <div className="relative flex h-screen flex-col bg-background">
      <TitleBarDragRegion />
      <div className="min-h-0 flex-1">
        <AuthShell
          className="h-full min-h-full"
          contentBackdrop={<SlarkAuthBackdrop />}
          contentContainerClassName="items-center p-0"
          contentInnerClassName={cn('w-full max-w-[400px]', contentInnerClassName)}
        >
          <div className="flex flex-col items-center gap-8 px-5 py-8">
            <SlarkAuthMark />
            {children}
            <SlarkAuthFooter />
          </div>
        </AuthShell>
      </div>
    </div>
  )
}
