import {
  FileText, Brain, Wrench, Clock, Users, Crown,
  ChevronRight, ExternalLink, Plus, Minus,
} from 'lucide-react'
import type { ChatCard, CardType, CardStatus } from './sessionsData'

export type CardActionType = 'openFile' | 'navigate' | 'showPricing'

export interface CardAction {
  type: CardActionType
  payload: string
}

export interface ChatCardGroupProps {
  cards: ChatCard[]
  onCardAction?: (action: CardAction) => void
  interactive?: boolean
}

function resolveCardAction(card: ChatCard): CardAction | null {
  switch (card.type) {
    case 'file':
    case 'memory':
      return card.path ? { type: 'openFile', payload: card.path } : null
    case 'skill':
      return { type: 'navigate', payload: '/app/skills' }
    case 'automation':
      return card.path ? { type: 'openFile', payload: card.path } : { type: 'navigate', payload: '/app/automation' }
    case 'collaboration':
      return { type: 'navigate', payload: '/app/team' }
    case 'upgrade':
      return { type: 'showPricing', payload: '' }
    default:
      return null
  }
}

const CARD_CONFIG: Record<CardType, {
  icon: typeof FileText
  label: string
  accent: string
  border: string
  iconBg: string
}> = {
  file: {
    icon: FileText,
    label: '文件',
    accent: 'text-emerald-400',
    border: 'border-l-emerald-500/60',
    iconBg: 'bg-emerald-500/10',
  },
  memory: {
    icon: Brain,
    label: '记忆',
    accent: 'text-violet-400',
    border: 'border-l-violet-500/60',
    iconBg: 'bg-violet-500/10',
  },
  skill: {
    icon: Wrench,
    label: '技能',
    accent: 'text-amber-400',
    border: 'border-l-amber-500/60',
    iconBg: 'bg-amber-500/10',
  },
  automation: {
    icon: Clock,
    label: '自动化',
    accent: 'text-blue-400',
    border: 'border-l-blue-500/60',
    iconBg: 'bg-blue-500/10',
  },
  collaboration: {
    icon: Users,
    label: '协作',
    accent: 'text-cyan-400',
    border: 'border-l-cyan-500/60',
    iconBg: 'bg-cyan-500/10',
  },
  upgrade: {
    icon: Crown,
    label: '升级',
    accent: 'text-orange-400',
    border: 'border-l-orange-500/60',
    iconBg: 'bg-orange-500/10',
  },
}

const STATUS_CONFIG: Record<CardStatus, { label: string; dot: string; bg: string }> = {
  success: { label: '完成', dot: 'bg-emerald-400', bg: 'bg-emerald-500/10 text-emerald-400' },
  running: { label: '执行中', dot: 'bg-blue-400 animate-pulse', bg: 'bg-blue-500/10 text-blue-400' },
  warning: { label: '注意', dot: 'bg-amber-400', bg: 'bg-amber-500/10 text-amber-400' },
  info: { label: '信息', dot: 'bg-slate-400', bg: 'bg-slate-500/10 text-slate-400' },
  locked: { label: '锁定', dot: 'bg-orange-400', bg: 'bg-orange-500/10 text-orange-400' },
}

function CardItem({ card, onCardAction, interactive = false }: {
  card: ChatCard
  onCardAction?: (action: CardAction) => void
  interactive?: boolean
}) {
  const cfg = CARD_CONFIG[card.type]
  const st = STATUS_CONFIG[card.status]
  const Icon = cfg.icon
  const action = interactive ? resolveCardAction(card) : null

  const handleClick = () => {
    if (action && onCardAction) onCardAction(action)
  }

  const handleActionBtn = (btn: { label: string; primary?: boolean }, e: React.MouseEvent) => {
    e.stopPropagation()
    if (!onCardAction) return
    if (btn.primary && action) {
      onCardAction(action)
    } else if (card.type === 'upgrade') {
      onCardAction({ type: 'showPricing', payload: '' })
    } else if (action) {
      onCardAction(action)
    }
  }

  return (
    <div
      onClick={handleClick}
      className={`border border-border/60 ${cfg.border} border-l-2 rounded-lg bg-surface-2/80 backdrop-blur-sm overflow-hidden transition-all hover:border-border ${
        interactive && action ? 'cursor-pointer hover:bg-surface-2 group' : ''
      }`}
    >
      {/* Header */}
      <div className='flex items-center gap-2 px-3 py-2 border-b border-border/40'>
        <div className={`w-5 h-5 rounded flex items-center justify-center ${cfg.iconBg}`}>
          <Icon size={11} className={cfg.accent} />
        </div>
        <span className='text-[11px] font-medium text-text-primary flex-1 truncate'>
          {card.title}
        </span>
        <span className='flex items-center gap-1'>
          <span className={`w-1.5 h-1.5 rounded-full ${st.dot}`} />
          <span className={`text-[9px] px-1.5 py-0.5 rounded-full ${st.bg}`}>
            {st.label}
          </span>
        </span>
      </div>

      {/* Body */}
      <div className='px-3 py-2'>
        <p className='text-[11px] text-text-secondary leading-relaxed whitespace-pre-line'>
          {card.body}
        </p>

        {card.diff && (
          <div className='flex items-center gap-2 mt-1.5'>
            <span className='flex items-center gap-0.5 text-[10px] text-emerald-400'>
              <Plus size={9} />
              {card.diff.added}
            </span>
            {card.diff.removed > 0 && (
              <span className='flex items-center gap-0.5 text-[10px] text-red-400'>
                <Minus size={9} />
                {card.diff.removed}
              </span>
            )}
          </div>
        )}

        {card.path && (
          <div className='flex items-center gap-1 mt-1.5 text-[10px] text-text-muted group-hover:text-accent transition-colors'>
            <span className='font-mono truncate'>~/clone/{card.path}</span>
            <ExternalLink size={9} className='shrink-0 opacity-50 group-hover:opacity-100' />
          </div>
        )}

        {card.meta && (
          <div className='text-[10px] text-text-muted mt-1 opacity-70'>
            {card.meta}
          </div>
        )}
      </div>

      {/* Actions */}
      {card.actions && card.actions.length > 0 && (
        <div className='flex items-center gap-1.5 px-3 py-1.5 border-t border-border/30'>
          {card.actions.map((btn, i) => (
            <button
              key={i}
              onClick={(e) => handleActionBtn(btn, e)}
              className={`text-[10px] px-2.5 py-1 rounded-md transition-colors ${
                btn.primary
                  ? 'bg-accent text-accent-fg hover:bg-accent/90'
                  : 'bg-surface-3 text-text-secondary hover:bg-surface-3/80'
              }`}
            >
              {btn.label}
            </button>
          ))}
          <ChevronRight size={10} className='ml-auto text-text-muted opacity-50 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all' />
        </div>
      )}

      {/* Viral CTA */}
      {card.viralCta && (
        <div className='px-3 py-1.5 bg-gradient-to-r from-accent/5 to-transparent border-t border-accent/10'>
          <span className='text-[9px] text-accent cursor-pointer hover:underline'>
            {card.viralCta}
          </span>
        </div>
      )}
    </div>
  )
}

export default function ChatCardGroup({ cards, onCardAction, interactive = false }: ChatCardGroupProps) {
  return (
    <div className='space-y-1.5'>
      {cards.map((card, i) => (
        <CardItem key={i} card={card} onCardAction={onCardAction} interactive={interactive} />
      ))}
    </div>
  )
}
