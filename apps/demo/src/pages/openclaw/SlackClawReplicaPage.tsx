import { useMemo } from 'react';
import { Activity, AlertTriangle, ArrowRight, CalendarDays, Check, ChevronRight, Cpu, HardDrive, Link2, MessageSquare, Repeat2, ShieldCheck, Sparkles, Star, UserPlus, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { usePageTitle } from '../../hooks/usePageTitle';
import SlackDemo from '../../components/SlackDemo';
import { Button } from '@/components/ui/button';

const TRUSTED_LOGOS = [
  'Raycast',
  'Vercel',
  'Supabase',
  'Udemy',
  'Framer',
  'Ramp',
  'Linear',
];

const TIMELINE = [
  {
    step: 'Minute 1',
    side: 'left' as const,
    icon: Sparkles,
    title: 'Add to Workspace',
    desc: 'One click. No config, no onboarding calls. nexu joins your workspace instantly.',
  },
  {
    step: 'Minute 2',
    side: 'right' as const,
    icon: Link2,
    title: 'Connect your tools',
    desc: 'Gmail, HubSpot, Jira, Linear, Notion — pick the ones your team already uses. OAuth, done.',
    chips: ['Gmail', 'Jira', 'HubSpot', 'Linear', 'Notion', 'GitHub', 'Google Calendar', 'Salesforce', 'Confluence'],
  },
  {
    step: 'First hour',
    side: 'left' as const,
    icon: MessageSquare,
    title: 'Ask your first question',
    desc: 'Mention @nexu in any channel. It does not just answer — it takes action.',
    preview: '@nexu send Lisa a recap of yesterday’s product meeting',
    preview2: 'Done. Sent to lisa@acme.com',
  },
  {
    step: 'Day 2',
    side: 'right' as const,
    icon: Users,
    title: 'Offload repetitive ops',
    desc: 'A customer emails about a bug. nexu reads the email, reproduces it in a browser, files a Linear ticket with screenshots, and drafts a reply.',
  },
  {
    step: 'Week 1',
    side: 'left' as const,
    icon: CalendarDays,
    title: 'Standups run themselves',
    desc: 'Every morning, nexu checks GitHub, Linear, and Slack — then posts what each person shipped and what needs eyes.',
    preview: '☀️ Daily Update — Jan 15',
    preview2: '• @sarah — merged 2 PRs, closed LIN-142',
  },
  {
    step: 'Month 1',
    side: 'right' as const,
    icon: Activity,
    title: 'Time is yours again',
    desc: 'Status meetings are gone. New hires ask nexu instead of interrupting seniors. Support drafts replies in seconds.',
    metric: '5h',
    metricDesc: 'per week saved per team member',
  },
];

const USE_CASES = [
  {
    title: 'Recurring Ops',
    desc: 'Weekly reports, standup summaries, sprint prep. Build once as a Custom Skill, trigger with one phrase.',
    tags: ['GitHub', 'Calendar', 'Jira'],
  },
  {
    title: 'Cross-Team Handoffs',
    desc: 'Detect handoff moments and route the right info across tools and teams automatically.',
    tags: ['Linear', 'Notion', 'Figma'],
  },
  {
    title: 'Customer Escalations',
    desc: 'Detect critical incidents, route context, and draft customer-facing responses for review.',
    tags: ['Zendesk', 'Linear', 'Notion'],
  },
  {
    title: 'New Hire Onboarding',
    desc: 'Create channels, share docs, schedule first 1:1s, and deliver week-one checklist from one command.',
    tags: ['Notion', 'Calendar', 'Drive'],
  },
  {
    title: 'Incident Response',
    desc: 'Trigger war-room channel, page on-call, post runbook, and keep a live timeline in the first 3 minutes.',
    tags: ['PagerDuty', 'GitHub', 'Datadog'],
  },
];

const PRICING = [
  {
    plan: 'Starter',
    price: '$0',
    note: '$100 credits (one-time) per Slack workspace',
    items: [
      'Slack-native agent in threads + mentions',
      'Persistent workspace context',
      'Integrations + tool execution',
      'Scheduled tasks (reports, check-ins)',
    ],
    cta: 'Get Started for Free',
    highlight: false,
  },
  {
    plan: 'Team',
    price: '$50',
    note: 'per Slack workspace, per month',
    credits: '20,000 credits',
    items: [
      'Everything in Starter, plus',
      'Monthly credit refresh automatically',
      'nexu keeps running without interruption',
      'Priority access to new integrations',
    ],
    cta: 'Choose a Plan',
    highlight: true,
  },
  {
    plan: 'Enterprise',
    price: 'Custom',
    note: 'More powerful model for your team',
    items: [
      'Invoicing + custom billing terms',
      'Security review support + DPA',
      'SLA + priority support',
      'Dedicated onboarding + tailored limits/controls',
    ],
    cta: 'Contact Sales',
    highlight: false,
  },
];

const ENGINE_POINTS = [
  {
    stat: '24/7',
    title: 'always on',
    desc: 'Your AI never sleeps. Fully hosted — no server to manage.',
    icon: Activity,
  },
  {
    stat: '1,000+',
    title: 'built-in tools',
    desc: 'No integrations to wire up, no plugins to install. Everything works out of the box.',
    icon: Cpu,
  },
  {
    stat: '<1 min',
    title: 'to deploy',
    desc: 'No YAML, no config. Add nexu to your team chat and start working together right away.',
    icon: HardDrive,
  },
  {
    stat: 'Zero',
    title: 'data loss',
    desc: 'Persistent memory — nexu remembers your conversations, preferences, and context.',
    icon: Star,
  },
];

const TESTIMONIALS = [
  {
    quote: 'I used to triage 200+ GitHub issues manually every week. nexu does it in minutes and nothing falls through the cracks. I finally have time for actual engineering work.',
    name: 'Sara Patel',
    role: 'Engineering Lead, Basalt',
  },
  {
    quote: 'I was the human router for our team — every question went through me. nexu took over the cross-tool coordination and gave me 10+ hours a week back.',
    name: 'Mike Rodriguez',
    role: 'Head of Ops, Campfire',
  },
  {
    quote: 'Our support team’s response times dropped 60%. nexu handles the routine coordination — pulling account info, checking status, drafting responses — so we focus on real problems.',
    name: 'Anna Liu',
    role: 'VP Support, Daybreak',
  },
  {
    quote: 'The Slack integration was seamless — added it in under a minute, connected our tools, and it just worked. No config files, no setup headaches. It feels like Slack it was always there.',
    name: 'David Torres',
    role: 'Founder, Trigger.dev',
  },
  {
    quote: 'We spent hours every week on status updates — copying from GitHub to Slack to Notion. Now we just ask nexu. The coordination overhead vanished overnight.',
    name: 'James Kim',
    role: 'CTO, Stackline',
  },
];

const CHANNEL_ACCESS = [
  { name: '#engineering', status: 'Active' },
  { name: '#sales', status: 'Active' },
  { name: '#exec-private', status: 'Not added' },
  { name: '#support', status: 'Active' },
  { name: '#finance-ops', status: 'Active' },
];

const ACTIVITY_LOG = [
  '10:17 AM · Action logged to audit trail',
  '10:16 AM · Refund processed — approved by @Sarah',
  '10:15 AM · Read 3 messages in #finance-ops',
  '9:42 AM · Summarized thread in #engineering',
];

const TRUST_FEATURES = [
  {
    title: 'Encrypted by default',
    desc: 'AES-256 at rest, TLS in transit. Tokens never stored in plaintext.',
  },
  {
    title: 'Channel-scoped access',
    desc: 'nexu only reads messages in channels it has been added to.',
  },
  {
    title: 'No training on your data',
    desc: 'We never use your data to train AI models.',
  },
  {
    title: 'Full audit trail',
    desc: 'Every action nexu takes is logged.',
  },
  {
    title: 'Data deletion on uninstall',
    desc: 'When uninstalled, workspace data is deleted within 14 business days.',
  },
];

const VALUE_CALLOUTS = [
  {
    metric: '10+ hours reclaimed weekly',
    desc: 'From human router to focused engineer. Coordination overhead dropped to near zero.',
    name: 'Mike Rodriguez',
    role: 'Head of Ops, Campfire',
  },
  {
    metric: '60% faster support responses',
    desc: 'nexu handles the cross-tool lookup so support handles the human side.',
    name: 'Anna Liu',
    role: 'VP Support, Daybreak',
  },
];

const CONNECTED_TOOLS = [
  'Gmail', 'Jira', 'HubSpot', 'Linear', 'Notion',
  'GitHub', 'Google Calendar', 'Salesforce', 'Confluence',
];

const INTEGRATION_PILLS = [
  { name: 'Jira' },
  { name: 'Notion' },
  { name: 'Salesforce' },
  { name: 'HubSpot' },
  { name: 'Linear', active: true },
  { name: 'Intercom' },
];

export default function SlackClawReplicaPage() {
  usePageTitle('nexu');
  const navigate = useNavigate();

  const tickerItems = useMemo(() => [...TRUSTED_LOGOS, ...TRUSTED_LOGOS, ...TRUSTED_LOGOS], []);
  const testimonialStrip = useMemo(() => [...TESTIMONIALS, ...TESTIMONIALS], []);

  return (
    <div className='min-h-full bg-[#f7f4e8] text-[#1b1b18]'>
      <div className='h-6 bg-[#005c4b] text-[10px] font-medium text-white/85 flex items-center justify-center'>
        nexu is live — the simplest OpenClaw for teams. Deploy in 1 min.
      </div>
      <header className='sticky top-0 z-40 border-b border-black/10 bg-[#f7f4e8]/95 backdrop-blur'>
        <div className='mx-auto flex h-16 max-w-6xl items-center justify-between px-6'>
          <div className='flex items-center gap-2'>
            <img src='/brand/nexu logo-black4.svg' alt='nexu' className='h-6 w-auto object-contain' />
          </div>
          <nav className='hidden items-center gap-6 text-[13px] text-black/70 md:flex'>
            <a href='#how' className='hover:text-black'>How It Works</a>
            <a href='#features' className='hover:text-black'>Features</a>
            <a href='#cases' className='hover:text-black'>Use Cases</a>
            <a href='#customers' className='hover:text-black'>Customers</a>
            <a href='#pricing' className='hover:text-black'>Pricing</a>
          </nav>
          <div className='flex items-center gap-2'>
            <Button variant='outline' size='sm' className='rounded-full border-black/20 hover:bg-white/60'>
              Sign in
            </Button>
            <Button
              onClick={() => navigate('/openclaw/auth')}
              size='sm'
              className='rounded-full bg-black text-white hover:bg-black/90'
            >
              Add to Slack
            </Button>
          </div>
        </div>
      </header>

      <section className='relative overflow-hidden px-6 pb-16 pt-14 sm:pt-20'>
        <div className='pointer-events-none absolute -left-16 top-10 h-48 w-48 rounded-full bg-[#3d8f7c]/20 blur-3xl animate-hero-glow' />
        <div className='pointer-events-none absolute right-6 top-24 h-56 w-56 rounded-full bg-[#1c6a60]/15 blur-3xl animate-hero-glow' style={{ animationDelay: '1.2s' }} />
        <div className='mx-auto grid max-w-6xl gap-10 lg:grid-cols-2'>
          <div>
            <div className='mb-4 inline-flex items-center gap-2 rounded-full border border-black/15 bg-white/60 px-3 py-1 text-[11px] leading-none font-semibold animate-fade-in-up'>
              <span className='h-1.5 w-1.5 rounded-full bg-green-500' />
              Free during beta — deploy in 1 min
            </div>
            <h1 className='text-4xl font-bold leading-[1.05] tracking-tight sm:text-6xl animate-fade-in-up' style={{ animationDelay: '80ms' }}>
              The simplest OpenClaw🦞
              <br />
              <span className='text-black/65'>for your team.</span>
            </h1>
            <p className='mt-5 max-w-xl text-[17px] leading-relaxed text-black/70 animate-fade-in-up' style={{ animationDelay: '140ms' }}>
              Your AI coworker in IM — deploy in 1 minute, no YAML, no setup. 100% office tools & skills built-in, 24/7 next to you.
            </p>
            <div className='mt-7 flex flex-wrap items-center gap-3 animate-fade-in-up' style={{ animationDelay: '200ms' }}>
              <Button
                onClick={() => navigate('/openclaw/auth')}
                className='rounded-full bg-black px-6 py-3 text-sm font-semibold text-white hover:bg-black/90'
              >
                Add to Slack <ArrowRight size={14} />
              </Button>
            </div>
            <div className='mt-8 text-xs text-black/55 animate-fade-in-up' style={{ animationDelay: '260ms' }}>
              The simplest OpenClaw. Free to get started.
            </div>
            <div className='mt-4 flex flex-wrap gap-1.5'>
              {CONNECTED_TOOLS.map((tool, idx) => (
                <span
                  key={tool}
                  className='rounded-full border border-black/15 bg-white/70 px-2.5 py-1 text-[11px] leading-none font-medium text-black/60 animate-fade-in-up'
                  style={{ animationDelay: `${300 + idx * 45}ms` }}
                >
                  {tool}
                </span>
              ))}
            </div>
          </div>
          <div className='animate-fade-in-up animate-float' style={{ animationDelay: '160ms' }}>
            <SlackDemo scenarioKey='coding' height='h-[340px] sm:h-[400px]' />
          </div>
        </div>
      </section>

      <section className='px-6 pb-10'>
        <div className='mx-auto max-w-6xl'>
          <div className='flex items-center gap-8 py-2'>
            <p className='hidden md:block w-44 text-[11px] leading-[1.3] text-black/45 animate-fade-in-up'>
              Trusted by fast-growing companies around the world
            </p>
            <div className='flex-1 overflow-hidden'>
              <div className='flex w-max animate-ticker items-center'>
                {tickerItems.map((logo, idx) => (
                  <div
                    key={`${logo}-${idx}`}
                    className='px-5 text-[25px] font-semibold text-black/48 opacity-90 transition-transform duration-300 hover:-translate-y-0.5'
                  >
                    {logo}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className='px-6 py-14 sm:py-20'>
        <div className='mx-auto max-w-[1000px] rounded-[32px] border border-black/20 bg-[radial-gradient(120%_140%_at_90%_0%,#0d2f36_0%,#121212_45%,#0f1013_100%)] px-6 py-10 text-white animate-engine-breathe sm:px-10 sm:py-12'>
          <div className='mb-8 text-center'>
            <p className='text-[10px] uppercase tracking-[0.2em] text-white/48 animate-fade-in-up'>The engine</p>
            <h2 className='mt-2 text-[48px] leading-[1] tracking-tight text-white animate-fade-in-up' style={{ fontFamily: 'var(--font-heading)', animationDelay: '80ms' }}>
              Why nexu
            </h2>
            <p className='mx-auto mt-3 max-w-3xl text-[13px] leading-relaxed text-white/65 animate-fade-in-up' style={{ animationDelay: '140ms' }}>
              The simplest OpenClaw — ready in under a minute, with persistent memory and every tool your team needs.
            </p>
          </div>
          <div className='grid gap-3 sm:grid-cols-2 lg:grid-cols-4'>
            {ENGINE_POINTS.map((item, idx) => (
              <article
                key={item.title}
                className='rounded-2xl border border-white/12 bg-white/[0.04] p-4 backdrop-blur-sm transition-transform duration-300 hover:-translate-y-1 animate-engine-card-float'
                style={{ animationDelay: `${idx * 220}ms` }}
              >
                <div className='mb-3 inline-flex h-7 w-7 items-center justify-center rounded-md bg-white/8 text-white/70'>
                  <item.icon size={14} />
                </div>
                <div className='text-[43px] leading-none text-white' style={{ fontFamily: 'var(--font-heading)' }}>
                  {item.stat}
                </div>
                <div className='mt-1 text-[11px] text-white/68'>
                  {item.title}
                </div>
                <p className='mt-3 text-[10px] leading-relaxed text-white/45'>{item.desc}</p>
              </article>
            ))}
          </div>
          <p className='mx-auto mt-7 max-w-2xl text-center text-[12px] text-white/60 animate-fade-in-up' style={{ animationDelay: '240ms' }}>
            Works where your team already works — Slack, Discord & Telegram. Always on, always learning.
          </p>
        </div>
      </section>

      <section id='how' className='px-6 py-14 sm:py-20'>
        <div className='mx-auto max-w-6xl'>
          <div className='mb-10 text-center'>
            <h2 className='text-[58px] leading-[1] tracking-tight text-[#1f1f1d] animate-fade-in-up' style={{ fontFamily: 'var(--font-heading)' }}>
              Get started in <span className='italic text-[#c36a2d]'>3 steps.</span>
            </h2>
            <p className='mt-3 text-[15px] text-black/58 animate-fade-in-up' style={{ animationDelay: '80ms' }}>Add nexu to your team chat and start working together in minutes.</p>
          </div>
          <div className='relative mx-auto max-w-[980px]'>
            <div className='absolute left-1/2 top-2 bottom-2 w-px -translate-x-1/2 bg-[#dcdccf] animate-timeline-line' />
            {TIMELINE.map((item, idx) => {
              const Icon = item.icon;
              const card = (
                <article
                  className='w-full max-w-[360px] rounded-2xl border border-[#e7e7da] bg-[#f7f7f2] p-5 shadow-[0_1px_2px_rgba(0,0,0,0.04)] transition-transform duration-300 hover:-translate-y-1 animate-fade-in-up'
                  style={{ animationDelay: `${140 + idx * 80}ms` }}
                >
                  <div className='inline-flex items-center gap-1.5 rounded-full border border-[#e3e4d8] bg-[#eef3ea] px-2.5 py-1'>
                    <Icon size={11} className='text-[#2f6c59]' />
                    <span className='text-[9px] font-semibold uppercase tracking-[0.12em] text-[#5f6f66]'>{item.step}</span>
                  </div>
                  <h3 className='mt-3 text-[31px] leading-[1] tracking-tight text-[#1e1e1c]' style={{ fontFamily: 'var(--font-heading)' }}>
                    {item.title}
                  </h3>
                  <p className='mt-2 text-[12px] leading-[1.6] text-[#5f5f57]'>{item.desc}</p>

                  {item.chips && (
                    <div className='mt-3 flex flex-wrap gap-1.5'>
                      {item.chips.map((chip) => (
                        <span key={chip} className='rounded-full border border-[#e1e2d7] bg-[#f0f2ea] px-2 py-0.5 text-[9px] text-[#5d665f] transition-colors duration-200 hover:bg-[#e8ece1]'>
                          {chip}
                        </span>
                      ))}
                    </div>
                  )}

                  {item.preview && (
                    <div className='mt-3 rounded-xl border border-[#e2e3d9] bg-[#efefea] p-2 text-[10px] text-[#54544c]'>
                      <div>{item.preview}</div>
                      {item.preview2 && <div className='mt-1 text-[#66665e]'>{item.preview2}</div>}
                    </div>
                  )}

                  {item.metric && (
                    <div className='mt-4 flex items-end gap-2'>
                      <div className='text-[54px] leading-none text-[#0e6a56]' style={{ fontFamily: 'var(--font-heading)' }}>
                        {item.metric}
                      </div>
                      <div className='pb-2 text-[11px] text-[#69695f]'>{item.metricDesc}</div>
                    </div>
                  )}
                </article>
              );

              return (
                <div key={item.step} className='grid min-h-[220px] grid-cols-[1fr_46px_1fr] items-center'>
                  <div className='flex justify-end pr-3'>{item.side === 'left' ? card : null}</div>
                  <div className='flex justify-center'>
                    <span className='h-3 w-3 rounded-full border border-[#a7b3ab] bg-[#0c6a56] animate-timeline-dot' style={{ animationDelay: `${idx * 220}ms` }} />
                  </div>
                  <div className='flex justify-start pl-3'>{item.side === 'right' ? card : null}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section id='features' className='px-6 py-14 sm:py-20'>
        <div className='mx-auto max-w-[980px]'>
          <div className='mb-12 text-center'>
            <div className='text-[10px] uppercase tracking-[0.2em] text-black/45 animate-fade-in-up'>How it works</div>
            <h2 className='mt-2 text-[64px] leading-[0.94] tracking-tight text-[#1d1d1b] animate-fade-in-up' style={{ fontFamily: 'var(--font-heading)', animationDelay: '70ms' }}>
              You chat.
              <br />
              <span className='text-[#1d1a35] relative inline-block'>
                nexu gets it done.
                <span className='absolute left-3 right-3 -bottom-1 h-[6px] rounded-full bg-[#5c4bc2]/30 blur-[2px]' />
              </span>
            </h2>
            <p className='mx-auto mt-4 max-w-[540px] text-[14px] leading-relaxed text-black/62 animate-fade-in-up' style={{ animationDelay: '130ms' }}>
              Just describe the task in chat — no code, no config. nexu handles the rest.
            </p>
          </div>
          <div className='mx-auto grid max-w-[760px] gap-3 md:grid-cols-2'>
            <div className='rounded-2xl border border-[#e4e4d7] bg-[#f3f3ec] p-5 transition-transform duration-300 hover:-translate-y-1 animate-fade-in-up' style={{ animationDelay: '170ms' }}>
              <div className='mb-3 text-[10px] text-black/45'>Without nexu</div>
              <div className='mb-3 text-[52px] leading-none text-[#1f1e1b]' style={{ fontFamily: 'var(--font-heading)' }}>
                35 min
              </div>
              <div className='h-px bg-black/10 mb-3' />
              <div className='space-y-1.5 text-[11px] leading-[1.55] text-black/62'>
                <div>Open Linear. Filter by this sprint. Switch to GitHub.</div>
                <div>Count merged PRs. Check which are still in review.</div>
                <div>Open docs. Start a new report. Copy-paste ticket numbers.</div>
                <div>Scan channels for blockers. Draft email. Do this again next Friday.</div>
              </div>
            </div>
            <div className='rounded-2xl border border-[#1f2430] bg-[radial-gradient(130%_130%_at_85%_0%,#0d3642_0%,#14171f_56%,#15151a_100%)] p-5 text-white shadow-[0_8px_24px_rgba(0,0,0,0.22)] transition-transform duration-300 hover:-translate-y-1 animate-fade-in-up animate-feature-glow' style={{ animationDelay: '230ms' }}>
              <div className='mb-3 text-[10px] text-white/52'>With nexu</div>
              <div className='mb-2 text-[52px] leading-none text-white' style={{ fontFamily: 'var(--font-heading)' }}>
                0 min
              </div>
              <div className='h-[2px] rounded-full bg-gradient-to-r from-[#8f7cff] via-[#9f7fff] to-transparent mb-2' />
              <ul className='rounded-xl border border-white/10 bg-white/[0.04] p-3 space-y-1.5 text-[10px] text-white/78'>
                {[
                  'Pulled completed and in-progress issues from Linear',
                  'Summarized merged PRs and open reviews from GitHub',
                  'Drafted and sent status email via Gmail',
                ].map((line, idx) => (
                  <li key={line} className='flex gap-1.5 animate-fade-in-up' style={{ animationDelay: `${300 + idx * 90}ms` }}>
                    <Check size={12} className='mt-0.5 shrink-0 text-[#7de1a3] animate-energy-pulse' style={{ animationDelay: `${idx * 260}ms` }} />
                    {line}
                  </li>
                ))}
              </ul>
              <div className='mt-2 text-[10px] leading-relaxed text-white/66 animate-fade-in-up' style={{ animationDelay: '520ms' }}>
                You set it once: "Send Friday status report at 5 PM." nexu runs it every week from there.
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id='cases' className='px-6 pt-6 pb-14 sm:pb-20'>
        <div className='mx-auto max-w-[1000px] rounded-t-[34px] border border-black/30 bg-[#121318] px-6 pt-8 pb-12 sm:px-10'>
          <div className='text-center text-[10px] uppercase tracking-[0.2em] text-white/52 animate-fade-in-up'>Use cases</div>
          <h2 className='mt-2 text-center text-[56px] leading-[1.02] tracking-tight text-white animate-fade-in-up' style={{ fontFamily: 'var(--font-heading)', animationDelay: '80ms' }}>
            Real coordination, <span className='italic text-[#d87a3a]'>handled</span>
          </h2>

          <div className='mt-10 space-y-10'>
            {USE_CASES.map((item, idx) => {
              const reverse = idx % 2 === 1;
              const VisualIcon = idx === 0 ? Repeat2 : idx === 1 ? Users : idx === 2 ? AlertTriangle : idx === 3 ? UserPlus : Activity;
              const visual = (
                <div
                  className='relative h-[220px] rounded-2xl border border-white/8 bg-[radial-gradient(120%_120%_at_20%_10%,#1f2432_0%,#181b24_55%,#15171d_100%)] overflow-hidden animate-usecase-panel'
                  style={{ animationDelay: `${idx * 180}ms` }}
                >
                  <div className='absolute inset-0 bg-[linear-gradient(120deg,rgba(255,255,255,0.04),transparent_35%,rgba(255,255,255,0.03))]' />
                  <div className='absolute inset-0 flex items-center justify-center'>
                    <div className='relative'>
                      <div className='absolute -inset-8 rounded-full border border-white/10 animate-usecase-orbit' />
                      <div className='absolute -inset-16 rounded-full border border-white/6 animate-usecase-orbit' style={{ animationDelay: '1.2s' }} />
                      <div className='h-16 w-16 rounded-2xl bg-white/8 border border-white/20 flex items-center justify-center animate-usecase-core'>
                        <VisualIcon size={28} className='text-[#d7c4ff]' />
                      </div>
                    </div>
                  </div>
                  <div className='absolute bottom-3 left-3 right-3 flex gap-1.5'>
                    {[...Array(8)].map((_, i) => (
                      <span
                        key={i}
                        className='h-5 flex-1 rounded-md bg-white/[0.06] border border-white/[0.09] animate-usecase-bar'
                        style={{ animationDelay: `${i * 90}ms` }}
                      />
                    ))}
                  </div>
                </div>
              );

              const text = (
                <article className='pt-3 animate-fade-in-up' style={{ animationDelay: `${120 + idx * 120}ms` }}>
                  <h3 className='text-[42px] leading-[0.98] tracking-tight text-white' style={{ fontFamily: 'var(--font-heading)' }}>
                    {item.title}
                  </h3>
                  <p className='mt-3 text-[13px] leading-[1.75] text-white/70'>{item.desc}</p>
                  <div className='mt-4 flex flex-wrap gap-2'>
                    {item.tags.map((tag) => (
                      <span key={tag} className='rounded-full border border-white/14 bg-white/[0.04] px-2.5 py-1 text-[10px] leading-none font-medium text-white/70 transition-colors duration-200 hover:bg-white/[0.1]'>
                        {tag}
                      </span>
                    ))}
                  </div>
                </article>
              );

              return (
                <div key={item.title} className='grid items-center gap-8 md:grid-cols-2'>
                  {reverse ? text : visual}
                  {reverse ? visual : text}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className='px-6 py-16 sm:py-20'>
        <div className='mx-auto max-w-[980px] text-center'>
          <h2
            className='text-[64px] leading-[0.96] tracking-tight text-[#1d1d1a] animate-fade-in-up'
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            1,000+ tools & skills
            <br />
            built-in.
          </h2>
          <p className='mx-auto mt-3 max-w-[600px] text-[13px] leading-relaxed text-black/58 animate-fade-in-up' style={{ animationDelay: '90ms' }}>
            Build, analyze, automate — right from chat. No integrations to wire up, no plugins to install.
          </p>

          <div className='mt-7 flex flex-wrap justify-center gap-2'>
            {INTEGRATION_PILLS.map((tool, idx) => (
              <span
                key={tool.name}
                className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[11px] leading-none font-medium animate-integration-pill transition-transform duration-300 hover:-translate-y-0.5 ${
                  tool.active
                    ? 'border-[#6b7f7a] bg-[#eef2eb] text-[#1e4f43]'
                    : 'border-black/12 bg-[#f2f2eb] text-black/62'
                }`}
                style={{ animationDelay: `${idx * 120}ms` }}
              >
                <span className={`h-1.5 w-1.5 rounded-full ${tool.active ? 'bg-[#0f7a61]' : 'bg-black/25'}`} />
                {tool.name}
              </span>
            ))}
          </div>

          {/* Chat demo cards — 6 channels like original site */}
          <div className='mx-auto mt-8 grid max-w-[900px] gap-3 md:grid-cols-2'>
            {[
              { ch: '#engineering', av: 'MK', abg: '#d6dbff', ac: '#303a80', u: 'Marcus Kim', t: '10:15 AM', q: '@nexu what\'s blocking sprint 12?', a: 'I\'ve checked Linear — 2 items blocked:\n\nAUTH-247 Blocked High — waiting on security review from @dana\nINFRA-341 Blocked High — depends on infra provisioning (ETA tomorrow)\n\nWant me to ping @dana?', r: '🙏 2 · 👀 1' },
              { ch: '#product', av: 'SC', abg: '#ffd6e8', ac: '#8a2054', u: 'Sarah Chen', t: '2:30 PM', q: '@nexu where\'s the Q1 planning doc?', a: 'Found it — Q1 2025 Planning, last edited by Priya 2 days ago:\n\n✓ Finalize pricing tiers\n✓ Hire senior backend engineer\n○ Launch beta program — overdue by 5 days\n○ Complete SOC 2 audit — due Feb 28\n○ Ship v2 onboarding flow — due Mar 7', r: '👍 3' },
              { ch: '#sales', av: 'JR', abg: '#d6f5e8', ac: '#1a5c3a', u: 'James Rivera', t: '11:45 AM', q: '@nexu status on the Acme deal?', a: 'From Salesforce:\n\nAccount: Acme Corp · Enterprise\nStage: Negotiation · $85,000 ARR\nClose: Feb 28, 2025\nChampion: VP Eng · Lisa Park\n\nNo follow-up since last call. Draft a check-in email?', r: '👍 2' },
              { ch: '#marketing', av: 'AR', abg: '#d6f0ff', ac: '#1a4a7a', u: 'Alex Reyes', t: '9:20 AM', q: '@nexu how did Q4 campaign perform?', a: 'Q4 Product Launch from HubSpot:\n\n📣 12,400 contacts reached\n📨 34% open rate (↑ 21%)\n📊 8.2% click-through\n🎯 186 MQLs generated\n🏆 Top: Enterprise at 41%\n\n22% better than Q3 overall.', r: '🔥 4 · 📈 2' },
              { ch: '#engineering', av: 'PA', abg: '#e8d6ff', ac: '#4a2080', u: 'Priya Anand', t: '3:10 PM', q: '@nexu create a bug for login crash on mobile', a: 'Created LIN-892 — "Login crash on mobile (iOS + Android)". Bug High, assigned to @marcus, Sprint 13.\n\nFound 3 matching Sentry errors and linked them.', r: '⚡ 3 · ✅ 1', btns: true },
              { ch: '#support', av: 'DL', abg: '#ffecd6', ac: '#7a4a1a', u: 'Dana Lee', t: '4:05 PM', q: '@nexu what are customers complaining about?', a: 'This week\'s Intercom conversations:\n\n1. CSV export timeouts · 12 tickets ▲ 3×\n2. SSO setup issues · 8 tickets ▲ new\n3. Billing page errors · 5 tickets — steady\n\nExport spike started after yesterday\'s deploy.', r: '🚨 3 · 👍 2' },
            ].map((card, ci) => (
              <div key={`${card.ch}-${ci}`} className='rounded-2xl border border-[#dedfd2] bg-[#f2f2ee] shadow-[0_1px_2px_rgba(0,0,0,0.06)] text-left overflow-hidden animate-fade-in-up animate-chatcard-breathe' style={{ animationDelay: `${180 + ci * 100}ms` }}>
                <div className='border-b border-[#e5e5da] px-3 py-1.5 text-[11px] font-semibold text-black/58'>{card.ch}</div>
                <div className='p-3'>
                  <div className='mb-2 text-[11px] text-black/72'>
                    <div className='flex items-center gap-1.5'>
                      <span className='inline-flex h-5 w-5 items-center justify-center rounded text-[8px] font-semibold' style={{ backgroundColor: card.abg, color: card.ac }}>{card.av}</span>
                      <span className='font-semibold'>{card.u}</span>
                      <span className='text-[10px] text-black/45'>{card.t}</span>
                    </div>
                    <div className='mt-0.5 pl-[26px] text-black/72'>{card.q}</div>
                  </div>
                  <div className='rounded-xl border border-[#e0e1d6] bg-white p-2.5'>
                    <div className='mb-1 flex items-center gap-1.5 text-[11px]'>
                      <span className='inline-flex h-5 w-5 items-center justify-center rounded bg-[#ff6d5e] text-[8px] font-bold text-white'>N</span>
                      <span className='font-semibold text-black/78'>nexu</span>
                      <span className='text-[10px] text-black/40'>APP · {card.t}</span>
                    </div>
                    <div className='whitespace-pre-line text-[11px] leading-[1.55] text-black/72'>{card.a}</div>
                    {card.btns && (
                      <div className='mt-2 flex gap-2'>
                        <Button size='sm' className='h-auto rounded-md bg-[#0f6a53] px-2 py-0.5 text-[9px] font-semibold text-white hover:bg-[#0f6a53]/90'>View in Linear</Button>
                        <Button variant='outline' size='sm' className='h-auto rounded-md border-black/12 bg-white px-2 py-0.5 text-[9px] font-semibold text-black/70'>View Sentry</Button>
                      </div>
                    )}
                    <div className='mt-1.5 text-[9px] text-black/42'>{card.r}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className='mt-6 text-[10px] uppercase tracking-[0.16em] text-black/42 animate-fade-in-up' style={{ animationDelay: '900ms' }}>And many more</div>
        </div>
      </section>

      <section id='trust' className='px-6 py-14 sm:py-20'>
        <div className='mx-auto max-w-[1000px] rounded-[34px] border border-black/25 bg-[radial-gradient(130%_130%_at_85%_0%,#0d3540_0%,#13161e_52%,#111319_100%)] px-7 py-9 text-white sm:px-10 animate-trust-breathe'>
          <div className='grid gap-8 lg:grid-cols-[1fr_0.95fr]'>
            <div>
              <h3 className='text-[54px] leading-[0.98] tracking-tight text-white animate-fade-in-up' style={{ fontFamily: 'var(--font-heading)' }}>
                Your data stays yours.
              </h3>
              <p className='mt-3 max-w-[460px] text-[13px] leading-relaxed text-white/62 animate-fade-in-up' style={{ animationDelay: '80ms' }}>
                Enterprise-grade infrastructure with encryption, tenant isolation, and channel-scoped access.
              </p>
              <div className='mt-5 space-y-2.5'>
                {TRUST_FEATURES.map((item, idx) => (
                  <div key={item.title} className='rounded-xl border border-white/10 bg-white/[0.03] p-3 animate-fade-in-up transition-transform duration-300 hover:-translate-y-0.5' style={{ animationDelay: `${120 + idx * 70}ms` }}>
                    <div className='flex items-center gap-2 text-[12px] font-semibold text-white/90'>
                      <ShieldCheck size={12} className='text-white/65' />
                      {item.title}
                    </div>
                    <div className='mt-1 text-[11px] leading-relaxed text-white/55'>{item.desc}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className='rounded-2xl border border-white/12 bg-white/[0.03] p-4 animate-trust-panel-float'>
              <div className='mb-3 text-[10px] uppercase tracking-[0.12em] text-white/48'>Channel access</div>
              <div className='space-y-1.5'>
                {CHANNEL_ACCESS.map((item, idx) => (
                  <div key={item.name} className='flex items-center justify-between rounded-md border border-white/8 bg-black/15 px-2.5 py-1.5 text-[11px] animate-fade-in-up' style={{ animationDelay: `${160 + idx * 60}ms` }}>
                    <span className='text-white/72'>{item.name}</span>
                    <span className='inline-flex items-center gap-1 text-white/62'>
                      {item.status}
                      <span className={`h-1.5 w-1.5 rounded-full ${item.status === 'Active' ? 'bg-[#61d4a7] animate-status-dot' : 'bg-white/25'}`} />
                    </span>
                  </div>
                ))}
              </div>

              <div className='mt-4 rounded-xl border border-white/10 bg-black/20 p-3'>
                <div className='mb-2 text-[10px] uppercase tracking-[0.12em] text-white/45'>Activity log</div>
                <div className='space-y-1.5'>
                  {ACTIVITY_LOG.map((line) => (
                    <div key={line} className='text-[10px] leading-relaxed text-white/58'>{line}</div>
                  ))}
                </div>
              </div>

              <div className='mt-4 rounded-xl border border-[#2f6f62] bg-[#0f2d2a] p-3'>
                <div className='mb-2 flex items-center justify-between text-[10px] uppercase tracking-[0.12em] text-white/58'>
                  <span>Data protection</span>
                  <span className='text-[#7de1a3]'>All checks passed</span>
                </div>
                <div className='space-y-1.5 text-[10px] text-white/68'>
                  <div className='flex items-center justify-between'>
                    <span>Encryption</span>
                    <span>AES-256 at rest, TLS in transit</span>
                  </div>
                  <div className='flex items-center justify-between'>
                    <span>Model training</span>
                    <span>Never — your data stays private</span>
                  </div>
                  <div className='flex items-center justify-between'>
                    <span>Data retention</span>
                    <span>Deleted within 14 days of uninstall</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className='px-6 pb-8 pt-4'>
        <div className='mx-auto max-w-[980px] text-center'>
          <div className='text-[10px] uppercase tracking-[0.2em] text-black/45 animate-fade-in-up'>How it works under the hood</div>
          <h2 className='mt-2 text-[66px] leading-[0.95] tracking-tight text-[#1d1d1b] animate-fade-in-up' style={{ fontFamily: 'var(--font-heading)', animationDelay: '80ms' }}>
            Built to actually work.
          </h2>
        </div>
      </section>

      <section className='px-6 pb-16 pt-3 sm:pb-20'>
        <div className='mx-auto max-w-[1000px]'>
          <div className='grid items-center gap-9 lg:grid-cols-[0.72fr_1fr]'>
            <div className='max-w-[350px] lg:pl-3 animate-fade-in-up'>
              <h3 className='text-[45px] leading-[1.02] tracking-tight text-[#1f1f1d]' style={{ fontFamily: 'var(--font-heading)' }}>
                An AI with its own computer.
              </h3>
              <p className='mt-3 text-[14px] leading-[1.8] text-black/62 animate-fade-in-up' style={{ animationDelay: '90ms' }}>
                nexu isn&apos;t a stateless chatbot. It&apos;s always running on a dedicated machine — constantly
                listening, building context, and picking up where it left off. It remembers past conversations,
                knows what happened last week, and acts without being asked twice. No re-explaining. No copy-pasting.
              </p>
            </div>

            <div className='w-full max-w-[525px] justify-self-end rounded-[10px] border border-black/35 bg-[#11161d] p-3 text-white shadow-[0_8px_26px_rgba(0,0,0,0.22)] animate-fade-in-up animate-underhood-card' style={{ animationDelay: '150ms' }}>
              <div className='mb-3 flex items-center justify-between rounded-md border border-white/10 bg-black/20 px-3 py-2 text-[11px] animate-fade-in-up' style={{ animationDelay: '220ms' }}>
                <span className='inline-flex items-center gap-2 font-medium text-white/88'>
                  <span className='h-2.5 w-2.5 rounded-[2px] bg-[#e34444]' />
                  nexu&apos;s Workspace
                </span>
                <span className='text-[#49d3a8]'>• LIVE</span>
              </div>

              <div className='grid gap-2 sm:grid-cols-2'>
                {[
                  { title: 'Workspace Context', desc: 'threads + decisions' },
                  { title: 'Hybrid Search', desc: 'vector + keyword' },
                  { title: 'Long-term Memory', desc: 'persisted notes' },
                  { title: 'Filesystem', desc: 'skills + logs' },
                ].map((item, idx) => (
                  <div key={item.title} className='rounded-md border border-white/10 bg-black/20 px-3 py-2.5 animate-fade-in-up' style={{ animationDelay: `${260 + idx * 70}ms` }}>
                    <div className='text-[10px] text-white/85'>{item.title}</div>
                    <div className='mt-0.5 text-[9px] uppercase tracking-[0.06em] text-white/42'>{item.desc}</div>
                  </div>
                ))}
              </div>

              <div className='mt-2.5 rounded-md border border-white/10 bg-black/20 px-3 py-2 text-[10px] text-white/70 animate-fade-in-up' style={{ animationDelay: '540ms' }}>
                @nexu memory ask: staging status
                <span className='float-right text-[#49d3a8]'>+100ms</span>
              </div>

              <div className='mt-2.5 flex flex-wrap items-center gap-1.5 border-t border-white/10 pt-2 text-[9px] text-white/40 animate-fade-in-up' style={{ animationDelay: '610ms' }}>
                <span className='rounded bg-white/5 px-1.5 py-0.5'>job: err-repro</span>
                <span className='rounded bg-[#5a2b19] px-1.5 py-0.5 text-[#f5ac76]'>priority: high</span>
                <span className='rounded bg-[#3b2f1c] px-1.5 py-0.5 text-[#f2be73]'>scope: billing</span>
                <span className='ml-auto'>project id: 21GB</span>
              </div>
            </div>
          </div>

          <div className='mt-10 grid items-center gap-9 lg:grid-cols-[1fr_0.72fr]'>
            <div className='w-full max-w-[525px] rounded-[10px] border border-black/35 bg-[#11161d] p-3 text-white shadow-[0_8px_26px_rgba(0,0,0,0.22)] animate-fade-in-up animate-underhood-card' style={{ animationDelay: '200ms' }}>
              <div className='mb-2 flex items-center gap-2 text-[10px] text-white/56 animate-fade-in-up' style={{ animationDelay: '260ms' }}>
                <span className='h-4 w-4 rounded-full bg-[#39c59a]/20 text-center leading-4 text-[#6de2bc]'>M</span>
                Mike <span className='text-white/35'>10:18 PM</span>
              </div>
              <div className='mb-2 text-[11px] text-white/84 animate-fade-in-up' style={{ animationDelay: '320ms' }}>@nexu run friday standup</div>

              <div className='rounded-md border border-white/10 bg-black/20 p-2.5 animate-fade-in-up' style={{ animationDelay: '380ms' }}>
                <div className='mb-2 flex items-center justify-between text-[10px]'>
                  <span className='inline-flex items-center gap-1.5 text-white/88'>
                    <span className='h-2.5 w-2.5 rounded-[2px] bg-[#e34444]' />
                    nexu
                  </span>
                  <span className='rounded bg-[#0f3d31] px-1.5 py-0.5 text-[9px] text-[#69dbb3]'>ACTIVE</span>
                </div>
                <div className='rounded-md border border-white/10 bg-[#161b22] px-2 py-1.5 text-[10px] text-white/82'>Friday Status Report</div>
                <div className='mt-2 space-y-1 text-[10px] text-white/66'>
                  <div>✓ Linear · 8 completed tickets</div>
                  <div>✓ GitHub · 12 merged PRs</div>
                  <div>✓ Gmail · Drafted status email</div>
                  <div>✓ Slack · Posted summary to #team-updates</div>
                </div>
              </div>

              <div className='mt-2 text-[9px] text-white/38 animate-fade-in-up' style={{ animationDelay: '460ms' }}>Completed in 4.2s | 18 actions | next run in 14h 29m</div>
            </div>

            <div className='max-w-[350px] justify-self-start animate-fade-in-up' style={{ animationDelay: '120ms' }}>
              <h3 className='text-[45px] leading-[1.02] tracking-tight text-[#1f1f1d]' style={{ fontFamily: 'var(--font-heading)' }}>
                Your playbooks, on autopilot
              </h3>
              <p className='mt-3 text-[14px] leading-[1.8] text-black/62 animate-fade-in-up' style={{ animationDelay: '190ms' }}>
                Skills are just plain-English documents that describe a task — no code, no config files.
                Write what you want done in natural language, and nexu follows the instructions.
                Trigger with a phrase or run on a schedule.
              </p>
            </div>
          </div>

          {/* Row 3: Your own server */}
          <div className='mt-10 grid items-center gap-9 lg:grid-cols-[0.72fr_1fr]'>
            <div className='max-w-[350px] lg:pl-3 animate-fade-in-up'>
              <h3 className='text-[45px] leading-[1.02] tracking-tight text-[#1f1f1d]' style={{ fontFamily: 'var(--font-heading)' }}>
                Your own server. Your own rules.
              </h3>
              <p className='mt-3 text-[14px] leading-[1.8] text-black/62 animate-fade-in-up' style={{ animationDelay: '90ms' }}>
                Every team gets a dedicated server — dedicated resources, isolated runtime, encrypted secrets vault.
                Not shared infrastructure. Your data never leaves your instance.
              </p>
            </div>

            <div className='w-full max-w-[525px] justify-self-end rounded-[10px] border border-black/35 bg-[#11161d] p-3 text-white shadow-[0_8px_26px_rgba(0,0,0,0.22)] animate-fade-in-up animate-underhood-card' style={{ animationDelay: '150ms' }}>
              <div className='mb-3 flex items-center justify-between rounded-md border border-white/10 bg-black/20 px-3 py-2 text-[11px] animate-fade-in-up' style={{ animationDelay: '220ms' }}>
                <span className='inline-flex items-center gap-2 font-medium text-white/88'>
                  Your Instance: Acme Corp
                </span>
                <span className='rounded bg-[#0f3d31] px-1.5 py-0.5 text-[9px] text-[#69dbb3]'>ISOLATED</span>
              </div>

              <div className='grid gap-2 sm:grid-cols-2'>
                {[
                  { title: 'Agent Runtime', desc: 'running' },
                  { title: 'Secrets Vault', desc: 'encrypted' },
                  { title: 'Message Store', desc: 'local-only' },
                  { title: 'OAuth Tokens', desc: 'encrypted' },
                ].map((item, idx) => (
                  <div key={item.title} className='rounded-md border border-white/10 bg-black/20 px-3 py-2.5 animate-fade-in-up' style={{ animationDelay: `${260 + idx * 70}ms` }}>
                    <div className='text-[10px] text-white/85'>{item.title}</div>
                    <div className='mt-0.5 text-[9px] uppercase tracking-[0.06em] text-white/42'>{item.desc}</div>
                  </div>
                ))}
              </div>

              <div className='mt-2.5 rounded-md border border-white/10 bg-black/20 px-3 py-2 text-[10px] animate-fade-in-up' style={{ animationDelay: '540ms' }}>
                <div className='mb-1 text-[9px] uppercase tracking-[0.08em] text-white/42'>Usage this month</div>
                <div className='text-[18px] font-semibold text-white' style={{ fontFamily: 'var(--font-heading)' }}>2,847 credits</div>
                <div className='mt-1.5 space-y-1 text-[9px] text-white/58'>
                  <div className='flex justify-between'><span>Sprint reports generated</span><span>312 cr</span></div>
                  <div className='flex justify-between'><span>PRs triaged and summarized</span><span>847 cr</span></div>
                  <div className='flex justify-between'><span>Emails drafted and sent</span><span>156 cr</span></div>
                  <div className='flex justify-between'><span>Messages analyzed</span><span>1,532 cr</span></div>
                </div>
              </div>

              <div className='mt-2.5 flex items-center justify-between rounded-md border border-white/10 bg-black/20 px-3 py-2 text-[10px] animate-fade-in-up' style={{ animationDelay: '610ms' }}>
                <div>
                  <div className='text-white/88'>nexu</div>
                  <div className='text-[9px] text-white/42'>24 members · $49/mo · <span className='text-[#69dbb3]'>$0 per seat</span></div>
                </div>
                <div className='text-right'>
                  <div className='text-white/50 line-through'>Per-seat tools</div>
                  <div className='text-[9px] text-white/42'>24 members · $1,200/mo · $50 per seat</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className='px-6 pb-7 pt-10 sm:pt-14'>
        <div id='customers' className='mx-auto max-w-[1040px] rounded-[34px] bg-[#111319] pb-8 pt-9 text-white animate-social-breathe'>
          <div className='mb-8 text-center'>
            <h2 className='text-[66px] leading-[0.9] tracking-tight text-white animate-fade-in-up' style={{ fontFamily: 'var(--font-heading)' }}>
              Teams that stopped
              <br />
              <span className='bg-gradient-to-r from-[#f2fff7] via-[#7dc8bf] to-[#f2fff7] bg-clip-text text-transparent'>being the glue</span>
            </h2>
          </div>

          <div className='overflow-x-auto no-scrollbar px-4'>
            <div className='flex min-w-max gap-3 animate-social-strip'>
              {testimonialStrip.map((item, idx) => (
                <article key={`${item.name}-${idx}`} className='w-[258px] shrink-0 rounded-xl bg-[#f7f4e8] p-4 text-black transition-transform duration-300 hover:-translate-y-1'>
                  <p className='line-clamp-4 text-[11px] leading-relaxed text-black/72'>{item.quote}</p>
                  <div className='mt-3 flex items-center gap-2'>
                    <div className='h-6 w-6 rounded-full bg-gradient-to-br from-[#d2c3a7] to-[#8b7c68]' />
                    <div>
                      <div className='text-[10px] font-semibold text-black/85'>{item.name}</div>
                      <div className='text-[9px] text-black/50'>{item.role}</div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className='px-6 pb-12 pt-0 sm:pb-16'>
        <div className='mx-auto grid max-w-[1040px] gap-4 md:grid-cols-2'>
          {VALUE_CALLOUTS.map((item, idx) => (
            <article
              key={item.metric}
              className='relative rounded-2xl border border-[#2ea29b]/60 bg-[linear-gradient(140deg,#014f49_0%,#025b5b_48%,#015450_100%)] p-6 text-[#d9fff5] shadow-[0_10px_26px_rgba(0,58,57,0.28)] animate-impact-card transition-transform duration-300 hover:-translate-y-1'
              style={{ animationDelay: `${idx * 220}ms` }}
            >
              <span className='absolute right-4 top-3 text-[12px] text-[#8fe6dd] animate-energy-pulse'>↗</span>
              <h3 className='text-[42px] leading-[0.98] tracking-tight text-[#ecfff9] animate-fade-in-up' style={{ fontFamily: 'var(--font-heading)', animationDelay: `${120 + idx * 220}ms` }}>
                {item.metric}
              </h3>
              <p className='mt-2 max-w-[420px] text-[13px] leading-relaxed text-[#bde8df] animate-fade-in-up' style={{ animationDelay: `${180 + idx * 220}ms` }}>{item.desc}</p>
              <div className='mt-4 flex items-center gap-2 animate-fade-in-up' style={{ animationDelay: `${240 + idx * 220}ms` }}>
                <div className='h-6 w-6 rounded-full bg-gradient-to-br from-[#d2c3a7] to-[#8b7c68]' />
                <div>
                  <div className='text-[11px] font-semibold text-[#ebfffb]'>{item.name}</div>
                  <div className='text-[10px] text-[#a2dbd2]'>{item.role}</div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className='px-6 pb-6 pt-2'>
        <div className='mx-auto max-w-[980px] text-center'>
          <h2 className='text-[62px] leading-[0.95] tracking-tight text-[#1d1d1a] animate-fade-in-up' style={{ fontFamily: 'var(--font-heading)' }}>
            Pay for actions, not headcount
          </h2>
          <p className='mx-auto mt-3 max-w-[520px] text-[13px] leading-relaxed text-black/58 animate-fade-in-up' style={{ animationDelay: '80ms' }}>
            Free during beta. No credit card required. Works in Slack, Discord & Telegram.
          </p>
        </div>
      </section>

      <section id='pricing' className='px-6 py-14 sm:py-20'>
        <div className='mx-auto max-w-[1040px] rounded-[34px] bg-[#111319] px-7 pb-10 pt-11 text-white sm:px-10 animate-pricing-breathe'>
          <div className='mb-9 text-center'>
            <h2 className='text-[62px] leading-[0.95] tracking-tight text-white animate-fade-in-up' style={{ fontFamily: 'var(--font-heading)' }}>
              Pricing
            </h2>
            <p className='mx-auto mt-2 max-w-[440px] text-[13px] leading-relaxed text-white/58 animate-fade-in-up' style={{ animationDelay: '90ms' }}>
              Start for free. Upgrade to get the capacity that exactly matches your team&apos;s needs.
            </p>
          </div>

          <div className='grid gap-3 lg:grid-cols-3'>
            {PRICING.map((p, idx) => (
              <article
                key={p.plan}
                className={`rounded-2xl border px-4 pb-4 pt-5 ${
                  p.highlight
                    ? 'border-[#d8d3bf] bg-[#f7f4e8] text-[#171612] animate-pricing-featured'
                    : 'border-white/8 bg-white/[0.03] text-white animate-pricing-card'
                } transition-transform duration-300 hover:-translate-y-1 animate-fade-in-up relative overflow-hidden`}
                style={{ animationDelay: `${160 + idx * 110}ms` }}
              >
                {p.highlight && <span className='pointer-events-none absolute inset-y-0 -left-1/2 w-1/2 -skew-x-12 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-pricing-sheen' />}
                <div className={`text-[10px] font-semibold uppercase tracking-[0.12em] ${p.highlight ? 'text-black/50' : 'text-white/48'}`}>{p.plan}</div>
                <div className='mt-2 flex items-end gap-1.5'>
                  <div className={`text-[48px] leading-none tracking-tight ${p.highlight ? 'text-black' : 'text-white'}`} style={{ fontFamily: 'var(--font-heading)' }}>
                    {p.price}
                  </div>
                  {p.price !== 'Custom' && (
                    <div className={`pb-1 text-[11px] ${p.highlight ? 'text-black/55' : 'text-white/55'}`}>/month</div>
                  )}
                </div>
                <p className={`mt-1 text-[11px] leading-relaxed ${p.highlight ? 'text-black/58' : 'text-white/45'}`}>{p.note}</p>

                {p.highlight && (
                  <Button variant='outline' className='mt-3 w-full justify-between rounded-md border-black/10 bg-[#ece7d7] px-2.5 py-1.5 text-[11px] text-black/70 hover:bg-[#e5dfcf]'>
                    <span>{p.credits}</span>
                    <span>⌄</span>
                  </Button>
                )}

                <div className={`my-3 h-px ${p.highlight ? 'bg-black/12' : 'bg-white/10'}`} />
                <ul className='space-y-1.5'>
                  {p.items.map((item, itemIdx) => (
                    <li key={item} className={`flex gap-2 text-[11px] leading-relaxed animate-fade-in-up ${p.highlight ? 'text-black/72' : 'text-white/68'}`} style={{ animationDelay: `${240 + idx * 110 + itemIdx * 45}ms` }}>
                      <ChevronRight size={12} className='mt-0.5 shrink-0' />
                      {item}
                    </li>
                  ))}
                </ul>
                <Button
                  className={`mt-5 w-full rounded-full px-4 py-2 text-[12px] font-semibold ${
                    p.highlight
                      ? 'bg-[#e9d7ff] text-[#272136] hover:bg-[#e0cbff]'
                      : 'border border-white/20 bg-transparent text-white/85 hover:bg-white/10'
                  }`}
                >
                  {p.cta}
                </Button>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className='px-4 pb-8 pt-6 sm:px-6 sm:pb-10'>
        <div className='relative mx-auto max-w-[1040px] overflow-hidden rounded-[26px] border border-black/15 bg-[radial-gradient(85%_90%_at_50%_52%,#04675f_0%,#023636_38%,#071017_78%,#0a0d13_100%)] px-6 py-14 text-center text-white sm:px-10 animate-final-cta-breathe'>
          <div className='pointer-events-none absolute inset-0 opacity-35 animate-final-stars-drift' style={{ backgroundImage: 'radial-gradient(#d8f5f0 0.8px, transparent 0.8px)', backgroundSize: '18px 18px' }} />
          <div className='relative'>
            <h2 className='text-[84px] leading-[0.92] tracking-tight text-white animate-fade-in-up' style={{ fontFamily: 'var(--font-heading)' }}>
              The simplest OpenClaw. Always on, always learning.
            </h2>
            <p className='mx-auto mt-3 max-w-[470px] text-[13px] leading-relaxed text-white/66 animate-fade-in-up' style={{ animationDelay: '90ms' }}>
              Free to get started. Works in Slack, Discord & Telegram.
            </p>
            <Button
              onClick={() => navigate('/openclaw/auth')}
              variant='outline'
              className='mt-7 rounded-md border-black/20 bg-white px-5 py-2.5 text-[13px] font-semibold text-[#1d1b18] shadow-[0_8px_16px_rgba(0,0,0,0.25)] hover:bg-white/95 animate-fade-in-up'
              style={{ animationDelay: '180ms' }}
            >
              <img src='/brand/nexu logo-black1.svg' alt='nexu' className='h-4 w-auto object-contain' />
              Add to Slack <ArrowRight size={13} />
            </Button>
            <div className='mt-3 text-[10px] text-white/38 animate-fade-in-up' style={{ animationDelay: '260ms' }}>© 2026 Powerformer, Inc.</div>
          </div>
        </div>
      </section>

      <footer className='bg-[#f7f4e8] px-6 py-8'>
        <div className='text-center text-xs text-black/45'>
          Always on, always learning.
        </div>
      </footer>
    </div>
  );
}
