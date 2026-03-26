import { useState, useCallback, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ArrowLeft, ArrowRight, Check, X,
  Globe, MessageSquare, User, Monitor, Users,
  Zap, Link2, Eye, Crown,
} from 'lucide-react'
import { Button } from '@nexu/ui-web'
import StepLanding from './StepLanding'
import StepOnboarding from './StepOnboarding'
import StepClone from './StepClone'
import StepSession from './StepSession'
import StepAutomation from './StepAutomation'
import StepTeam from './StepTeam'
import StepIM from './StepIM'
import StepPreview from './StepPreview'
import StepUpgrade from './StepUpgrade'

const STEPS = [
  { id: 'landing', label: 'Landing Page', icon: Globe, desc: '龙虾的赛博办公室' },
  { id: 'onboarding', label: 'Onboarding', icon: MessageSquare, desc: '分身初始化' },
  { id: 'clone', label: '分身入口', icon: User, desc: '产品主界面' },
  { id: 'session', label: 'Session', icon: Monitor, desc: '对话交互' },
  { id: 'automation', label: 'Automation & Skills', icon: Zap, desc: '自动化 + 能力' },
  { id: 'team', label: '团队协作', icon: Users, desc: '人与分身共存的办公协作网络' },
  { id: 'im', label: 'IM 接入', icon: Link2, desc: '飞书 / Slack' },
  { id: 'preview', label: '接入预览', icon: Eye, desc: '最终效果' },
  { id: 'upgrade', label: '解锁超能力', icon: Crown, desc: '升级 + 邀请团队' },
] as const

const STEP_COMPONENTS = [
  StepLanding,
  StepOnboarding,
  StepClone,
  StepSession,
  StepAutomation,
  StepTeam,
  StepIM,
  StepPreview,
  StepUpgrade,
]

export default function JourneyPage() {
  const [currentStep, setCurrentStep] = useState(0)
  const [direction, setDirection] = useState<'next' | 'prev'>('next')
  const [animating, setAnimating] = useState(false)
  const navigate = useNavigate()

  const goTo = useCallback((idx: number, dir: 'next' | 'prev') => {
    if (animating || idx < 0 || idx >= STEPS.length) return
    setDirection(dir)
    setAnimating(true)
    setTimeout(() => {
      setCurrentStep(idx)
      setAnimating(false)
    }, 250)
  }, [animating])

  const next = useCallback(() => goTo(currentStep + 1, 'next'), [currentStep, goTo])
  const prev = useCallback(() => goTo(currentStep - 1, 'prev'), [currentStep, goTo])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') next()
      if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') prev()
      if (e.key === 'Escape') navigate('/overview')
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [next, prev, navigate])

  const StepComponent = STEP_COMPONENTS[currentStep]
  const isFirst = currentStep === 0
  const isLast = currentStep === STEPS.length - 1

  return (
    <div className='fixed inset-0 z-50 bg-surface-0 flex flex-col'>
      {/* Top bar */}
      <header className='h-12 border-b border-border bg-surface-0/90 backdrop-blur-md flex items-center px-4 gap-4 shrink-0'>
        <button
          onClick={() => navigate('/overview')}
          className='p-1.5 rounded-lg hover:bg-surface-3 text-text-muted transition-colors'
          title='返回'
        >
          <X size={16} />
        </button>

        <div className='flex-1 flex items-center justify-center gap-1'>
          {STEPS.map((step, i) => {
            const isDone = i < currentStep
            const isActive = i === currentStep
            return (
              <button
                key={step.id}
                onClick={() => goTo(i, i > currentStep ? 'next' : 'prev')}
                className='flex items-center gap-1 group'
                title={step.label}
              >
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold transition-all ${
                  isDone
                    ? 'bg-success text-white'
                    : isActive
                      ? 'bg-accent text-accent-fg ring-2 ring-accent/20'
                      : 'bg-surface-3 text-text-muted group-hover:bg-surface-4'
                }`}>
                  {isDone ? <Check size={12} /> : i + 1}
                </div>
                <span className={`text-[11px] hidden lg:inline transition-colors ${
                  isActive ? 'text-text-primary font-medium' : 'text-text-muted group-hover:text-text-secondary'
                }`}>
                  {step.label}
                </span>
                {i < STEPS.length - 1 && (
                  <div className={`w-6 h-px mx-0.5 transition-colors ${
                    isDone ? 'bg-success' : 'bg-border'
                  }`} />
                )}
              </button>
            )
          })}
        </div>

        <div className='text-[11px] text-text-muted tabular-nums'>
          {currentStep + 1} / {STEPS.length}
        </div>
      </header>

      {/* Step content */}
      <main className='flex-1 overflow-hidden relative'>
        <div
          className={`absolute inset-0 transition-all duration-200 ease-out ${
            animating
              ? direction === 'next'
                ? 'opacity-0 -translate-x-8'
                : 'opacity-0 translate-x-8'
              : 'opacity-100 translate-x-0'
          }`}
        >
          <div className='h-full overflow-y-auto'>
            <StepComponent />
          </div>
        </div>
      </main>

      {/* Bottom nav */}
      <footer className='h-14 border-t border-border bg-surface-0/90 backdrop-blur-md flex items-center justify-between px-6 shrink-0'>
        <Button
          onClick={prev}
          disabled={isFirst}
          variant='ghost'
          size='sm'
          className={`gap-1.5 px-4 text-[13px] ${
            isFirst
              ? 'text-text-muted cursor-not-allowed'
              : 'text-text-secondary hover:text-text-primary hover:bg-surface-3'
          }`}
        >
          <ArrowLeft size={14} />
          上一步
        </Button>

        <div className='text-[12px] text-text-muted'>
          {STEPS[currentStep].desc}
        </div>

        <Button
          onClick={isLast ? () => navigate('/overview') : next}
          size='sm'
          className={`gap-1.5 px-5 text-[13px] ${
            isLast
              ? 'bg-success text-white hover:bg-success/90'
              : 'bg-accent text-accent-fg hover:bg-accent-hover'
          }`}
        >
          {isLast ? '完成旅程' : '下一步'}
          <ArrowRight size={14} />
        </Button>
      </footer>
    </div>
  )
}
