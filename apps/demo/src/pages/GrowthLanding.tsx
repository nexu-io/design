import { useState } from 'react'
import {
  MessageSquare,
  Brain,
  TrendingUp,
  FileText,
  Quote,
  ShoppingCart,
  Rocket,
  User,
  ChevronDown,
  ArrowRight,
  Sparkles,
  Eye,
  BarChart3,
  Send,
  CheckCircle2,
  Hash,
  Globe,
} from 'lucide-react'
import { Button } from '@nexu/ui-web'

const SEGMENTS = [
  {
    id: 'ecommerce',
    icon: ShoppingCart,
    label: 'E-commerce Teams',
    tagline: 'Customer insights on autopilot',
    color: 'text-emerald-600',
    bg: 'bg-emerald-50',
    border: 'border-emerald-200',
    scenarios: [
      {
        icon: BarChart3,
        title: 'Customer Feedback Digest',
        desc: 'Hundreds of messages in your support group every day. Your bot auto-generates a daily feedback report — complaints, praise, trends.',
        value: 'Know what customers feel in 30 seconds',
      },
      {
        icon: FileText,
        title: 'Chat → Product Copy',
        desc: 'Your team discusses product highlights in the group. The bot extracts selling points and drafts listing copy instantly.',
        value: 'Discussion becomes copy, 3x faster to list',
      },
      {
        icon: Send,
        title: 'Reviews → Social Posts',
        desc: 'Great customer reviews are scattered in chat. The bot turns them into beautiful, shareable social media cards.',
        value: 'Zero-cost UGC content production',
      },
    ],
  },
  {
    id: 'startup',
    icon: Rocket,
    label: 'Startup Teams',
    tagline: 'Your Slack becomes a content engine',
    color: 'text-blue-600',
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    scenarios: [
      {
        icon: TrendingUp,
        title: 'Chat → Social Content',
        desc: 'Your team shares brilliant insights in Slack every day, but no one has time to write blog posts. The bot drafts X/LinkedIn posts from your discussions.',
        value: 'Team discussions → brand content, zero extra work',
      },
      {
        icon: FileText,
        title: 'Daily Group Digest',
        desc: '500 messages a day. Your bot generates a structured daily report — decisions, progress, blockers, action items.',
        value: 'Everyone catches up in 30 seconds',
      },
      {
        icon: Quote,
        title: 'Quote Cards',
        desc: 'Brilliant insights vanish in the message stream. The bot detects standout quotes and generates shareable branded cards.',
        value: 'Team thinking, visualized and shareable',
      },
    ],
  },
  {
    id: 'creator',
    icon: User,
    label: 'Creators & Freelancers',
    tagline: 'Your personal brand, on autopilot',
    color: 'text-purple-600',
    bg: 'bg-purple-50',
    border: 'border-purple-200',
    scenarios: [
      {
        icon: Eye,
        title: 'Multi-Group Summary',
        desc: "You're in 10+ groups. Can't read them all. The bot aggregates highlights across all your groups, ranked by importance.",
        value: '5 minutes to catch up on everything',
      },
      {
        icon: Sparkles,
        title: 'Thought → Post',
        desc: 'You drop a smart take in a group chat. The bot catches it and drafts a social media post. One tap to publish.',
        value: "Say it once, it's content forever",
      },
      {
        icon: FileText,
        title: 'Weekly Newsletter Draft',
        desc: 'Want to run a newsletter but spend 2 hours collecting material? The bot curates your best group chat moments into a draft.',
        value: '2 hours → 5 minutes',
      },
    ],
  },
]

const QUOTE_CARD_EXAMPLE = {
  quote: 'The real moat is not the model — it\'s the memory.',
  author: 'Sarah Chen',
  role: 'CEO @ Acme',
  source: '#product-strategy',
}

const FAQS = [
  { q: 'Which platforms do you support?', a: 'Slack, Discord, and Feishu (Lark) today. WhatsApp and Telegram are on the roadmap.' },
  { q: 'Can the bot read all my messages?', a: 'The bot only monitors channels you explicitly select. You control what it sees, and all data stays private to your workspace.' },
  { q: 'Is it noisy in my channels?', a: 'By default, the bot is silent — it only posts digests at scheduled times or when you @mention it. No spam, ever.' },
  { q: 'How is this different from ChatGPT?', a: 'ChatGPT forgets you every conversation. nexu remembers everything, lives in your existing IM, and proactively turns your group chats into actionable content.' },
  { q: 'How do I get access?', a: 'nexu is currently invite-only. Request early access or get an invite code from an existing user. Every user gets 3 invite codes to share.' },
  { q: 'What does it cost?', a: 'Free to start with 500 credits/month — all scenarios included, no feature gates. Pro ($29/mo) gives you 5,000 credits. Team ($19/person/mo) adds shared memory across your team\'s clones.' },
]

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false)
  return (
    <div className='border-b border-border'>
      <button onClick={() => setOpen(!open)} className='w-full flex items-center justify-between py-4 text-left cursor-pointer'>
        <span className='text-sm font-medium text-text-primary'>{q}</span>
        <ChevronDown size={16} className={`text-text-tertiary shrink-0 ml-4 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && <div className='pb-4 text-sm text-text-secondary leading-relaxed'>{a}</div>}
    </div>
  )
}

export default function GrowthLanding() {
  const [activeSegment, setActiveSegment] = useState('startup')
  const segment = SEGMENTS.find(s => s.id === activeSegment)!

  return (
    <div className='min-h-full bg-surface-0'>

      {/* ── Nav ── */}
      <nav className='fixed top-0 left-0 right-0 z-50 bg-surface-0/80 backdrop-blur-md border-b border-border'>
        <div className='max-w-5xl mx-auto px-6 h-14 flex items-center justify-between'>
          <div className='flex items-center gap-2'>
            <div className='w-7 h-7 rounded-lg bg-accent flex items-center justify-center'>
              <span className='text-xs font-bold text-accent-fg'>N</span>
            </div>
            <span className='text-sm font-semibold text-text-primary'>nexu</span>
          </div>
          <div className='flex items-center gap-6'>
            <a href='#problem' className='text-xs text-text-secondary hover:text-text-primary transition-colors'>Problem</a>
            <a href='#segments' className='text-xs text-text-secondary hover:text-text-primary transition-colors'>Use Cases</a>
            <a href='#how' className='text-xs text-text-secondary hover:text-text-primary transition-colors'>How It Works</a>
            <a href='#pricing' className='text-xs text-text-secondary hover:text-text-primary transition-colors'>Pricing</a>
            <Button size='sm'>
              Add to Slack
            </Button>
          </div>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className='pt-32 pb-20 px-6'>
        <div className='max-w-3xl mx-auto text-center'>
          <div className='inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-clone-subtle text-clone text-[11px] leading-none font-medium mb-6'>
            <Sparkles size={12} /> Works with Slack · Discord · Feishu
          </div>
          <h1 className='text-4xl font-bold text-text-primary tracking-tight leading-tight mb-5'>
            Your group chats are a gold mine.<br />
            <span className='text-clone'>Stop letting it go to waste.</span>
          </h1>
          <p className='text-base text-text-secondary leading-relaxed max-w-xl mx-auto mb-8'>
            nexu is an AI clone that lives in your group chats — it generates daily digests,
            captures golden quotes, and turns team discussions into ready-to-publish social content.
            Automatically. Every day.
          </p>
          <div className='flex items-center justify-center gap-3'>
            <Button size='lg'>
              Request Early Access <ArrowRight size={14} />
            </Button>
            <Button variant='outline' size='lg'>
              Watch Demo
            </Button>
          </div>
          <p className='text-[11px] text-text-muted mt-4'>Invite-only early access · Free to start · 2 min setup</p>
        </div>
      </section>

      {/* ── Problem ── */}
      <section id='problem' className='py-20 px-6 bg-surface-2'>
        <div className='max-w-4xl mx-auto'>
          <div className='text-center mb-14'>
            <div className='text-[11px] font-semibold text-clone mb-3 tracking-widest uppercase'>The Problem</div>
            <h2 className='text-2xl font-bold text-text-primary tracking-tight'>
              Your best ideas are dying in group chats
            </h2>
            <p className='text-sm text-text-tertiary mt-3 max-w-lg mx-auto leading-relaxed'>
              Every day, your team produces insights, decisions, and brilliant takes — all buried in hundreds of messages nobody will ever scroll back to read.
            </p>
          </div>

          <div className='grid grid-cols-3 gap-6'>
            {[
              { icon: MessageSquare, stat: '500+', label: 'messages/day', desc: 'in an average team channel' },
              { icon: Brain, stat: '93%', label: 'forgotten', desc: 'of valuable discussions are never captured' },
              { icon: TrendingUp, stat: '0', label: 'content produced', desc: 'from all those conversations' },
            ].map(item => (
              <div key={item.label} className='bg-surface-1 border border-border rounded-xl p-6 text-center'>
                <item.icon size={20} className='mx-auto mb-3 text-text-tertiary' />
                <div className='text-3xl font-bold text-text-primary mb-1'>{item.stat}</div>
                <div className='text-xs font-medium text-text-secondary mb-1'>{item.label}</div>
                <div className='text-[11px] text-text-muted'>{item.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Solution: What nexu does ── */}
      <section className='py-20 px-6'>
        <div className='max-w-4xl mx-auto'>
          <div className='text-center mb-14'>
            <div className='text-[11px] font-semibold text-clone mb-3 tracking-widest uppercase'>The Solution</div>
            <h2 className='text-2xl font-bold text-text-primary tracking-tight'>
              Three things. Every day. Automatically.
            </h2>
          </div>

          <div className='grid grid-cols-3 gap-8'>
            {/* Daily Digest */}
            <div className='space-y-4'>
              <div className='w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center'>
                <FileText size={18} className='text-blue-600' />
              </div>
              <h3 className='text-base font-semibold text-text-primary'>Daily Digest</h3>
              <p className='text-sm text-text-secondary leading-relaxed'>
                Every morning, your clone posts a structured summary of yesterday's chats — key decisions, progress updates, action items, and risks.
              </p>
              <div className='bg-surface-2 border border-border rounded-lg p-3 text-[12px] text-text-secondary leading-relaxed'>
                <div className='font-medium text-text-primary mb-1.5 text-[11px]'>📋 Daily Digest · Feb 25</div>
                <div className='space-y-1'>
                  <div>🔴 <strong>Needs input:</strong> OAuth scope for Sprint 2</div>
                  <div>🟡 <strong>FYI:</strong> Design review → Thursday 2pm</div>
                  <div>🟢 <strong>Done:</strong> CI pipeline fixed by Alex</div>
                </div>
                <div className='mt-2 text-[10px] text-text-muted'>⏱ 237 messages → 30 sec read</div>
              </div>
            </div>

            {/* Quote Cards */}
            <div className='space-y-4'>
              <div className='w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center'>
                <Quote size={18} className='text-amber-600' />
              </div>
              <h3 className='text-base font-semibold text-text-primary'>Quote Cards</h3>
              <p className='text-sm text-text-secondary leading-relaxed'>
                Your clone spots brilliant takes in group chat and turns them into beautiful, branded cards you can share on social media in one tap.
              </p>
              <div className='bg-surface-1 border border-border rounded-lg p-4 relative'>
                <div className='text-[13px] text-text-primary leading-relaxed italic mb-3'>
                  "{QUOTE_CARD_EXAMPLE.quote}"
                </div>
                <div className='flex items-center gap-2'>
                  <div className='w-6 h-6 rounded-full bg-clone/15 flex items-center justify-center text-[10px]'>S</div>
                  <div>
                    <div className='text-[11px] font-medium text-text-primary'>{QUOTE_CARD_EXAMPLE.author}</div>
                    <div className='text-[10px] text-text-muted'>{QUOTE_CARD_EXAMPLE.role} · {QUOTE_CARD_EXAMPLE.source}</div>
                  </div>
                </div>
                <div className='absolute top-2 right-3 text-[9px] text-text-muted flex items-center gap-1'>
                  <span className='w-3.5 h-3.5 rounded bg-accent flex items-center justify-center text-accent-fg text-[7px] font-bold'>N</span>
                  nexu
                </div>
              </div>
            </div>

            {/* Social Content */}
            <div className='space-y-4'>
              <div className='w-10 h-10 rounded-xl bg-violet-50 border border-violet-200 flex items-center justify-center'>
                <Send size={18} className='text-violet-600' />
              </div>
              <h3 className='text-base font-semibold text-text-primary'>Social Content</h3>
              <p className='text-sm text-text-secondary leading-relaxed'>
                Your clone extracts shareable insights from group discussions and drafts ready-to-post content for X, LinkedIn, or your blog.
              </p>
              <div className='bg-surface-2 border border-border rounded-lg p-3 text-[12px] text-text-secondary leading-relaxed'>
                <div className='font-medium text-text-primary mb-1.5 text-[11px]'>✨ Draft ready · from #product</div>
                <div className='text-text-secondary'>We spent 2 weeks debating OAuth vs. magic links. Here's why we chose both — and the framework that made the decision obvious...</div>
                <div className='flex gap-2 mt-2'>
                  <span className='text-[10px] px-2 py-0.5 rounded bg-surface-3 text-text-muted'>Post to X</span>
                  <span className='text-[10px] px-2 py-0.5 rounded bg-surface-3 text-text-muted'>Post to LinkedIn</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Segments ── */}
      <section id='segments' className='py-20 px-6 bg-surface-2'>
        <div className='max-w-4xl mx-auto'>
          <div className='text-center mb-10'>
            <div className='text-[11px] font-semibold text-clone mb-3 tracking-widest uppercase'>Use Cases</div>
            <h2 className='text-2xl font-bold text-text-primary tracking-tight'>Built for teams that live in group chats</h2>
          </div>

          {/* Segment Tabs */}
          <div className='flex justify-center gap-2 mb-10'>
            {SEGMENTS.map(seg => (
              <button
                key={seg.id}
                onClick={() => setActiveSegment(seg.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-[13px] font-medium transition-all cursor-pointer ${
                  activeSegment === seg.id
                    ? `${seg.bg} ${seg.color} ${seg.border} border`
                    : 'text-text-secondary hover:bg-surface-3 border border-transparent'
                }`}
              >
                <seg.icon size={14} /> {seg.label}
              </button>
            ))}
          </div>

          {/* Segment Content */}
          <div className='text-center mb-8'>
            <p className='text-sm text-text-secondary'>{segment.tagline}</p>
          </div>

          <div className='grid grid-cols-3 gap-6'>
            {segment.scenarios.map(sc => (
              <div key={sc.title} className='bg-surface-1 border border-border rounded-xl p-5 hover:border-border-hover transition-colors'>
                <sc.icon size={18} className={`mb-3 ${segment.color}`} />
                <h4 className='text-sm font-semibold text-text-primary mb-2'>{sc.title}</h4>
                <p className='text-[12px] text-text-secondary leading-relaxed mb-3'>{sc.desc}</p>
                <div className='flex items-center gap-1.5 text-[11px] text-clone font-medium'>
                  <CheckCircle2 size={12} /> {sc.value}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section id='how' className='py-20 px-6'>
        <div className='max-w-4xl mx-auto'>
          <div className='text-center mb-14'>
            <div className='text-[11px] font-semibold text-clone mb-3 tracking-widest uppercase'>How It Works</div>
            <h2 className='text-2xl font-bold text-text-primary tracking-tight'>2 minutes to set up. Works forever.</h2>
          </div>

          <div className='grid grid-cols-4 gap-6'>
            {[
              { step: '01', icon: Hash, title: 'Add the bot', desc: 'One-click install from Slack App Directory, Discord, or Feishu.' },
              { step: '02', icon: Eye, title: 'Pick your channels', desc: 'Tell the bot which channels to monitor. It stays silent until needed.' },
              { step: '03', icon: FileText, title: 'Get your first digest', desc: 'Instantly generates today\'s digest from existing messages. Value in seconds.' },
              { step: '04', icon: Sparkles, title: 'Content flows daily', desc: 'Every day: digest, quote cards, social drafts. Your chat becomes a content engine.' },
            ].map(item => (
              <div key={item.step} className='text-center'>
                <div className='text-[10px] font-bold text-clone mb-3'>{item.step}</div>
                <div className='w-10 h-10 rounded-xl bg-surface-2 border border-border flex items-center justify-center mx-auto mb-3'>
                  <item.icon size={18} className='text-text-secondary' />
                </div>
                <h4 className='text-sm font-semibold text-text-primary mb-1.5'>{item.title}</h4>
                <p className='text-[12px] text-text-secondary leading-relaxed'>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Viral / Social Proof ── */}
      <section className='py-16 px-6 bg-surface-2'>
        <div className='max-w-4xl mx-auto'>
          <div className='text-center mb-10'>
            <div className='text-[11px] font-semibold text-clone mb-3 tracking-widest uppercase'>Built to Spread</div>
            <h2 className='text-2xl font-bold text-text-primary tracking-tight'>Every output is designed to be shared</h2>
            <p className='text-sm text-text-tertiary mt-3 max-w-lg mx-auto leading-relaxed'>
              Quote cards carry your brand. Digests get forwarded. Social drafts get posted. Your team's daily chats become your marketing engine.
            </p>
          </div>

          <div className='grid grid-cols-3 gap-6'>
            {[
              { icon: Quote, title: 'Quote cards with brand', desc: 'Every card carries your logo and "Made with nexu". When your team shares, you both grow.' },
              { icon: BarChart3, title: 'Chat Wrapped reports', desc: 'Weekly stats your team actually wants to share — like Spotify Wrapped, but for group chats.' },
              { icon: Globe, title: 'One-tap publishing', desc: '"This take deserves to be seen." The bot detects shareable moments and lets you post in 3 seconds.' },
            ].map(item => (
              <div key={item.title} className='bg-surface-1 border border-border rounded-xl p-5'>
                <item.icon size={18} className='text-clone mb-3' />
                <h4 className='text-sm font-semibold text-text-primary mb-2'>{item.title}</h4>
                <p className='text-[12px] text-text-secondary leading-relaxed'>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Pricing ── */}
      <section id='pricing' className='py-20 px-6'>
        <div className='max-w-3xl mx-auto'>
          <div className='text-center mb-14'>
            <div className='text-[11px] font-semibold text-clone mb-3 tracking-widest uppercase'>Pricing</div>
            <h2 className='text-2xl font-bold text-text-primary tracking-tight'>Start free. Upgrade when you can't stop.</h2>
          </div>

          <p className='text-center text-sm text-text-secondary mb-10 -mt-4'>All plans include every scenario. No feature gates — just more credits.</p>
          <div className='grid grid-cols-3 gap-6'>
            {[
              {
                name: 'Free',
                price: '$0',
                desc: 'Invite code required',
                features: ['500 credits/month', 'All scenarios included', 'Unlimited channels', '3 invite codes to share'],
                cta: 'Request Invite',
                primary: false,
              },
              {
                name: 'Pro',
                price: '$29',
                desc: '/month',
                features: ['5,000 credits/month', 'All scenarios included', 'Unlimited channels', 'Custom brand style', 'Priority support'],
                cta: 'Start Pro Trial',
                primary: true,
              },
              {
                name: 'Team',
                price: '$19',
                desc: '/person/month',
                features: ['5,000 credits/person/month', 'All scenarios included', 'Shared team memory', 'Cross-clone knowledge sharing', 'Team Wrapped reports', 'Admin dashboard'],
                cta: 'Contact Us',
                primary: false,
              },
            ].map(plan => (
              <div key={plan.name} className={`rounded-xl p-6 ${plan.primary ? 'bg-accent text-accent-fg border-2 border-accent ring-4 ring-accent/10' : 'bg-surface-1 border border-border'}`}>
                <div className={`text-xs font-medium mb-1 ${plan.primary ? 'text-accent-fg/70' : 'text-text-muted'}`}>{plan.name}</div>
                <div className='flex items-baseline gap-1 mb-4'>
                  <span className={`text-2xl font-bold ${plan.primary ? '' : 'text-text-primary'}`}>{plan.price}</span>
                  <span className={`text-xs ${plan.primary ? 'text-accent-fg/70' : 'text-text-muted'}`}>{plan.desc}</span>
                </div>
                <div className='space-y-2 mb-6'>
                  {plan.features.map(f => (
                    <div key={f} className={`flex items-center gap-2 text-[12px] ${plan.primary ? 'text-accent-fg/90' : 'text-text-secondary'}`}>
                      <CheckCircle2 size={12} className={plan.primary ? 'text-accent-fg/60' : 'text-clone'} /> {f}
                    </div>
                  ))}
                </div>
                <Button
                  variant={plan.primary ? 'secondary' : 'default'}
                  size='sm'
                  className='w-full'
                >
                  {plan.cta}
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className='py-20 px-6 bg-surface-2'>
        <div className='max-w-2xl mx-auto'>
          <div className='text-center mb-10'>
            <h2 className='text-2xl font-bold text-text-primary tracking-tight'>Frequently Asked Questions</h2>
          </div>
          <div>
            {FAQS.map(faq => <FAQItem key={faq.q} q={faq.q} a={faq.a} />)}
          </div>
        </div>
      </section>

      {/* ── Final CTA ── */}
      <section className='py-24 px-6'>
        <div className='max-w-2xl mx-auto text-center'>
          <h2 className='text-2xl font-bold text-text-primary tracking-tight mb-4'>
            Your team talked about 47 great ideas today.<br />
            <span className='text-clone'>How many will you remember tomorrow?</span>
          </h2>
          <p className='text-sm text-text-secondary mb-8'>Join the early access. Your first digest is free.</p>
          <Button size='lg'>
            Request Early Access <ArrowRight size={14} />
          </Button>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className='py-8 px-6 border-t border-border'>
        <div className='max-w-4xl mx-auto flex items-center justify-between'>
          <div className='flex items-center gap-2'>
            <div className='w-5 h-5 rounded bg-accent flex items-center justify-center'>
              <span className='text-[8px] font-bold text-accent-fg'>N</span>
            </div>
            <span className='text-xs text-text-muted'>nexu · Your mind, extended.</span>
          </div>
          <div className='flex items-center gap-4 text-[11px] text-text-muted'>
            <a href='#' className='hover:text-text-secondary'>Privacy</a>
            <a href='#' className='hover:text-text-secondary'>Terms</a>
            <a href='#' className='hover:text-text-secondary'>X / Twitter</a>
            <a href='#' className='hover:text-text-secondary'>GitHub</a>
          </div>
        </div>
      </footer>
    </div>
  )
}
