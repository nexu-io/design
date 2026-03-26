import type { ReactNode } from 'react'

export function PageHeader({ title, description }: { title: string; description: string }) {
  return (
    <div className='mb-10'>
      <h1 className='text-2xl font-bold text-text-primary'>{title}</h1>
      <p className='mt-2 text-sm text-text-secondary max-w-2xl'>{description}</p>
    </div>
  )
}

export function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className='mb-12'>
      <h2 className='text-base font-semibold text-text-primary mb-4 pb-2 border-b border-border-subtle'>{title}</h2>
      {children}
    </section>
  )
}

export function PageShell({ children }: { children: ReactNode }) {
  return <div className='max-w-5xl mx-auto p-8'>{children}</div>
}
