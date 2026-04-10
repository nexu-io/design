import { GitHubIcon, buttonVariants, cn } from '@nexu-design/ui-web'
import { ArrowUpRight } from 'lucide-react'

interface GitHubStarButtonProps {
  href: string
  label: string
  stars?: number
  className?: string
  iconSize?: number
}

export function GitHubStarButton({
  href,
  label,
  stars,
  className,
  iconSize = 13,
}: GitHubStarButtonProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        buttonVariants({ variant: 'outline', size: 'sm' }),
        'shrink-0 rounded-full border-amber-300/60 bg-amber-50/80 text-amber-700 shadow-none',
        'hover:border-amber-400/70 hover:bg-amber-100/80 hover:text-amber-800 hover:shadow-xs',
        'focus-visible:ring-amber-200 focus-visible:ring-offset-0',
        className,
      )}
    >
      <GitHubIcon size={iconSize} />
      {label}
      {typeof stars === 'number' && stars > 0 ? (
        <span className="tabular-nums text-[10px] text-text-muted">({stars.toLocaleString()})</span>
      ) : null}
      <ArrowUpRight size={11} className="shrink-0 translate-y-px" />
    </a>
  )
}
