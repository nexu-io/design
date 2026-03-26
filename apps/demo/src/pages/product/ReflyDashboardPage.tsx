import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ArrowUp,
  Plus,
  MoreVertical,
  Eye,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'

const MY_WORKFLOWS = [
  {
    title: 'Quick Start: Refly AI',
    platforms: ['notion', 'figma', 'twitter'],
    extra: 5,
    date: '2026-01-05',
  },
  {
    title: 'Manners Product Search',
    platforms: ['notion', 'figma', 'twitter'],
    extra: 5,
    date: '2026-01-05',
  },
  {
    title: 'AI Assistant Introduction',
    platforms: ['notion', 'figma', 'twitter'],
    extra: 5,
    date: '2026-01-05',
  },
]

const MARKETPLACE_TABS = ['Featured', 'Sales', 'Marketing', 'Research', 'Business']

const MARKETPLACE_ITEMS = [
  { name: 'Marketing Poster Generator', views: 4351, image: 1 },
  { name: 'Marketing Poster Generator', views: 4351, image: 2 },
  { name: 'Marketing Poster Generator', views: 4351, image: 3 },
  { name: 'Marketing Poster Generator', views: 4351, image: 4 },
]

const PLATFORM_COLORS = ['#1a1a1a', '#f24e1e', '#1da1f2']

export default function ReflyDashboardPage() {
  const [query, setQuery] = useState('')
  const [activeTab, setActiveTab] = useState('Featured')
  const navigate = useNavigate()

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (!query.trim()) return
    navigate('/app/sessions')
  }

  return (
    <div className='h-full overflow-y-auto bg-white'>
      <div className='mx-auto max-w-[960px] px-8 py-10 space-y-10'>
        {/* Hero — Brand heading + Input */}
        <section className='flex flex-col items-center gap-6 pt-4'>
          <h1 className='text-center'>
            <span className='font-[Manrope] text-[28px] italic font-bold text-[var(--color-text-primary)] tracking-tight'>
              Refly AI
            </span>
            {'  '}
            <span className='font-[Manrope] text-[22px] font-semibold text-[var(--color-text-primary)] tracking-tight'>
              Your Workflow Creation Partner
            </span>
          </h1>

          <form
            onSubmit={handleSubmit}
            className='relative w-full max-w-[640px]'
          >
            <div
              className='rounded-[16px] border border-[var(--color-brand-primary)]/40 bg-white p-4 pr-14 shadow-[var(--shadow-m)] transition-all duration-200 focus-within:border-[var(--color-brand-primary)] focus-within:shadow-[var(--shadow-focus)]'
            >
              <textarea
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                rows={3}
                placeholder='Hi, what workflow do you want to create today?'
                className='w-full resize-none border-0 bg-transparent text-[15px] leading-relaxed text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:outline-none font-[Inter]'
              />
            </div>
            <Button
              type='submit'
              size='icon'
              className='absolute bottom-4 right-4 h-[36px] w-[36px] rounded-full bg-[var(--color-brand-primary)] text-white shadow-sm hover:opacity-90'
            >
              <ArrowUp size={18} strokeWidth={2.5} />
            </Button>
          </form>
        </section>

        {/* My Workflows */}
        <section className='space-y-4'>
          <div className='flex items-center justify-between'>
            <h2 className='text-[18px] font-semibold text-[var(--color-text-primary)] font-[Manrope]'>
              My Workflows
            </h2>
            <Button variant='ghost' className='text-[13px] text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)] h-auto px-0'>
              more
            </Button>
          </div>

          <div className='grid grid-cols-4 gap-4'>
            {/* New Workflow card */}
            <button
              type='button'
              className='flex flex-col items-center justify-center gap-3 rounded-[24px] border border-[var(--color-border)] bg-white p-6 shadow-[var(--shadow-card)] transition-all hover:border-[var(--color-border-hover)] hover:shadow-[0_4px_12px_0_rgba(0,0,0,0.12)]'
            >
              <div className='flex h-[48px] w-[48px] items-center justify-center rounded-full border-2 border-dashed border-[var(--color-border)] text-[var(--color-text-muted)]'>
                <Plus size={24} />
              </div>
              <span className='text-[14px] font-medium text-[var(--color-text-secondary)]'>
                New Workflow
              </span>
            </button>

            {/* Workflow cards */}
            {MY_WORKFLOWS.map((wf) => (
              <div
                key={wf.title}
                className='flex flex-col justify-between rounded-[24px] border border-[var(--color-border)] bg-white p-4 shadow-[var(--shadow-card)] transition-all hover:border-[var(--color-border-hover)] hover:shadow-[0_4px_12px_0_rgba(0,0,0,0.12)]'
              >
                <div>
                  <h3 className='text-[14px] font-semibold text-[var(--color-text-primary)] leading-[1.4] mb-3 font-[Inter]'>
                    {wf.title}
                  </h3>
                  <div className='flex items-center gap-1'>
                    {PLATFORM_COLORS.map((color, i) => (
                      <div
                        key={i}
                        className='h-[22px] w-[22px] rounded-full border-2 border-white'
                        style={{
                          backgroundColor: color,
                          marginLeft: i > 0 ? '-6px' : 0,
                        }}
                      />
                    ))}
                    <span className='ml-1 text-[11px] text-[var(--color-text-muted)]'>
                      +{wf.extra}
                    </span>
                  </div>
                </div>
                <div className='mt-3 flex items-center justify-between'>
                  <span className='text-[12px] text-[var(--color-text-muted)]'>
                    {wf.date}
                  </span>
                  <Button variant='ghost' size='icon' className='h-6 w-6 text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)]'>
                    <MoreVertical size={16} />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Marketplace */}
        <section className='space-y-4'>
          <div className='flex items-center justify-between'>
            <h2 className='text-[18px] font-semibold text-[var(--color-text-primary)] font-[Manrope]'>
              Marketplace
            </h2>
            <Button variant='ghost' className='text-[13px] text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)] h-auto px-0'>
              more
            </Button>
          </div>

          {/* Category tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className='bg-transparent gap-2 p-0'>
              {MARKETPLACE_TABS.map((tab) => (
                <TabsTrigger
                  key={tab}
                  value={tab}
                  className='rounded-full px-4 py-1.5 text-[13px] font-medium text-[var(--color-text-secondary)] data-[state=active]:bg-[var(--color-brand-primary)] data-[state=active]:text-white data-[state=active]:shadow-sm hover:bg-[var(--color-surface-2)]'
                >
                  {tab}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>

          {/* Template cards */}
          <div className='grid grid-cols-4 gap-4'>
            {MARKETPLACE_ITEMS.map((item, idx) => (
              <div
                key={idx}
                className='group cursor-pointer overflow-hidden rounded-[24px] border border-[var(--color-border)] bg-white shadow-[var(--shadow-card)] transition-all hover:border-[var(--color-border-hover)] hover:shadow-[0_4px_12px_0_rgba(0,0,0,0.12)]'
              >
                {/* Image placeholder */}
                <div className='relative h-[140px] overflow-hidden'>
                  <div
                    className='h-full w-full'
                    style={{
                      background: `linear-gradient(${135 + idx * 30}deg, ${
                        ['#2d1b69', '#1a3a4a', '#4a1a3a', '#1a2a4a'][idx]
                      } 0%, ${
                        ['#8b5cf6', '#3db9ce', '#f472b6', '#60a5fa'][idx]
                      } 50%, ${
                        ['#c084fc', '#7dcedc', '#fb7185', '#93c5fd'][idx]
                      } 100%)`,
                    }}
                  />
                  <div className='absolute bottom-2 left-3 flex items-center gap-1 rounded-full bg-black/50 px-2 py-0.5 text-[11px] leading-none text-white backdrop-blur-sm'>
                    <Eye size={12} />
                    {item.views.toLocaleString()}
                  </div>
                </div>
                <div className='p-3'>
                  <h4 className='text-[13px] font-medium text-[var(--color-text-primary)] group-hover:text-[var(--color-brand-primary)] transition-colors'>
                    {item.name}
                  </h4>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
