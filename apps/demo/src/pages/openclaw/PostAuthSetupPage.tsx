import { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Check, Loader2, Settings, Sparkles, Brain } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePageTitle } from '../../hooks/usePageTitle';
import { Badge } from '@nexu/ui-web';

function SlackIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523A2.528 2.528 0 0 1 0 15.165a2.527 2.527 0 0 1 2.522-2.52h2.52v2.52zm1.271 0a2.527 2.527 0 0 1 2.521-2.52 2.527 2.527 0 0 1 2.521 2.52v6.313A2.528 2.528 0 0 1 8.834 24a2.528 2.528 0 0 1-2.521-2.522v-6.313z" fill="#E01E5A" />
      <path d="M8.834 5.042a2.528 2.528 0 0 1-2.521-2.52A2.528 2.528 0 0 1 8.834 0a2.528 2.528 0 0 1 2.521 2.522v2.52H8.834zm0 1.271a2.527 2.527 0 0 1 2.521 2.521 2.527 2.527 0 0 1-2.521 2.521H2.522A2.528 2.528 0 0 1 0 8.834a2.528 2.528 0 0 1 2.522-2.521h6.312z" fill="#36C5F0" />
      <path d="M18.956 8.834a2.528 2.528 0 0 1 2.522-2.521A2.528 2.528 0 0 1 24 8.834a2.528 2.528 0 0 1-2.522 2.521h-2.522V8.834zm-1.27 0a2.528 2.528 0 0 1-2.523 2.521 2.527 2.527 0 0 1-2.52-2.521V2.522A2.527 2.527 0 0 1 15.163 0a2.528 2.528 0 0 1 2.523 2.522v6.312z" fill="#2EB67D" />
      <path d="M15.163 18.956a2.528 2.528 0 0 1 2.523 2.522A2.528 2.528 0 0 1 15.163 24a2.527 2.527 0 0 1-2.52-2.522v-2.522h2.52zm0-1.27a2.527 2.527 0 0 1-2.52-2.523 2.527 2.527 0 0 1 2.52-2.52h6.315A2.528 2.528 0 0 1 24 15.163a2.528 2.528 0 0 1-2.522 2.523h-6.315z" fill="#ECB22E" />
    </svg>
  );
}

interface SetupStep {
  id: string;
  label: string;
  detail: string;
  duration: number;
  icon: React.ComponentType<{ size?: number }>;
}

const SETUP_STEPS: SetupStep[] = [
  { id: 'install', label: 'Installing nexu Bot', detail: 'Adding bot to your Slack workspace', duration: 1200, icon: SlackIcon },
  { id: 'tools', label: 'Authorizing tools', detail: 'Gmail, Calendar, Drive, Docs, Sheets', duration: 1500, icon: Settings },
  { id: 'skills', label: 'Activating skills', detail: 'Enabling AI capabilities for your team', duration: 1000, icon: Sparkles },
  { id: 'memory', label: 'Initializing memory', detail: 'Creating your personal memory space', duration: 800, icon: Brain },
];

type StepStatus = 'pending' | 'running' | 'done';
type Phase = 'connect' | 'installing' | 'done';

export default function PostAuthSetupPage() {
  usePageTitle('Connect Slack');
  const navigate = useNavigate();
  const [phase, setPhase] = useState<Phase>('connect');
  const [hovering, setHovering] = useState(false);
  const [stepStatuses, setStepStatuses] = useState<Record<string, StepStatus>>(
    () => Object.fromEntries(SETUP_STEPS.map(s => [s.id, 'pending']))
  );

  const runSteps = useCallback(async () => {
    for (const step of SETUP_STEPS) {
      setStepStatuses(prev => ({ ...prev, [step.id]: 'running' }));
      await new Promise(resolve => setTimeout(resolve, step.duration));
      setStepStatuses(prev => ({ ...prev, [step.id]: 'done' }));
    }
    setPhase('done');
  }, []);

  const handleAddToSlack = () => {
    setPhase('installing');
    setTimeout(runSteps, 400);
  };

  useEffect(() => {
    if (phase === 'done') {
      const timer = setTimeout(() => {
        sessionStorage.setItem('nexu_from_setup', '1');
        navigate('/openclaw/workspace');
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [phase, navigate]);

  const doneCount = SETUP_STEPS.filter(s => stepStatuses[s.id] === 'done').length;
  const progress = (doneCount / SETUP_STEPS.length) * 100;

  return (
    <div className="min-h-screen bg-surface-0 flex flex-col relative overflow-hidden">
      {/* Background layers */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(var(--color-accent-rgb,99,102,241),0.06)_0%,transparent_50%)] pointer-events-none" />
      <div
        className="absolute inset-0 opacity-[0.12] pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(rgba(0,0,0,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.03) 1px, transparent 1px)',
          backgroundSize: '56px 56px',
        }}
      />

      {/* Nav */}
      <nav className="relative z-10 flex items-center justify-between px-6 sm:px-10 h-14 shrink-0">
        <button onClick={() => navigate('/openclaw')} className="flex items-center gap-2.5">
          <img src="/brand/nexu logo-black4.svg" alt="nexu" className="h-6 w-auto object-contain" />
        </button>
      </nav>

      {/* Main */}
      <div className="relative z-10 flex-1 flex items-center justify-center px-6 py-12">

        {phase === 'connect' && (
          <div className="w-full max-w-[480px]">

            {/* Content */}
            <div className="flex-1 min-w-0 text-center">
              {/* Connection graphic — horizontal */}
              <div className="flex items-center gap-3 mb-6 justify-center">
                <div className="w-12 h-12 rounded-[12px] bg-surface-1 border border-border flex items-center justify-center shadow-sm">
                  <SlackIcon size={26} />
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-5 h-px bg-border" />
                  <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                  <div className="w-5 h-px bg-border" />
                </div>
                <div className="w-12 h-12 rounded-[12px] bg-surface-1 border border-border flex items-center justify-center shadow-sm p-1.5">
                  <img src="/brand/nexu logo-black1.svg" alt="nexu" className="h-full w-auto object-contain" />
                </div>
              </div>

              <h1 className="text-[26px] sm:text-[32px] font-bold text-text-primary leading-[1.15] tracking-tight mb-3">
                Add nexu to your Slack
              </h1>
              <p className="text-[14px] text-text-tertiary leading-relaxed max-w-[420px] mx-auto mb-8">
                Your AI coworker joins right where your team works. @ it in any channel — 1,000+ tools built-in, persistent memory, always learning.
              </p>

              {/* Inline highlights */}
              <div className="flex flex-wrap gap-2 mb-8 justify-center">
                {['Deploy in 1 min', '1,000+ tools', 'Zero data loss', '24/7 always on'].map(tag => (
                  <Badge key={tag} variant="outline" size="lg">
                    {tag}
                  </Badge>
                ))}
              </div>

              {/* CTA */}
              <button
                onClick={handleAddToSlack}
                onMouseEnter={() => setHovering(true)}
                onMouseLeave={() => setHovering(false)}
                className="group relative inline-flex items-center justify-center gap-3 px-8 py-3.5 rounded-lg text-[15px] font-semibold bg-[#4A154B] text-white transition-all overflow-hidden shadow-md shadow-[#4A154B]/15 hover:shadow-lg hover:shadow-[#4A154B]/25"
              >
                <div className={`absolute inset-0 bg-gradient-to-r from-[#E01E5A]/20 via-[#36C5F0]/20 to-[#2EB67D]/20 transition-opacity duration-500 ${hovering ? 'opacity-100' : 'opacity-0'}`} />
                <div className="relative flex items-center gap-3">
                  <SlackIcon size={20} />
                  Add to Slack
                  <ArrowRight size={15} className={`transition-transform duration-200 ${hovering ? 'translate-x-0.5' : ''}`} />
                </div>
              </button>

              <p className="text-[11px] text-text-muted mt-4 max-w-[380px] mx-auto leading-relaxed">
                Free during beta. Only accesses channels it's invited to.
              </p>
            </div>
          </div>
        )}

        {(phase === 'installing' || phase === 'done') && (
          <div className="w-full max-w-[520px]">
            {/* Hero graphic — animated connection */}
            <div className="flex justify-center mb-8">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative flex items-center gap-4"
              >
                <div className="w-14 h-14 rounded-[12px] bg-surface-1 border border-border flex items-center justify-center shadow-sm">
                  <SlackIcon size={28} />
                </div>
                <div className="flex items-center gap-2">
                  <motion.div
                    className="w-8 h-0.5 bg-gradient-to-r from-border to-accent/50"
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  />
                  <motion.div
                    className="w-3 h-3 rounded-full bg-accent"
                    animate={{ scale: [1, 1.2, 1], opacity: [0.8, 1, 0.8] }}
                    transition={{ duration: 1.2, repeat: Infinity }}
                  />
                  <motion.div
                    className="w-8 h-0.5 bg-gradient-to-r from-accent/50 to-border"
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 1.5, repeat: Infinity, delay: 0.3 }}
                  />
                </div>
                <div className="w-14 h-14 rounded-[12px] bg-surface-1 border border-border flex items-center justify-center shadow-sm p-2">
                  <img src="/brand/nexu logo-black1.svg" alt="nexu" className="h-full w-auto object-contain" />
                </div>
              </motion.div>
            </div>

            <div className="text-center">
              <h1 className="text-[28px] sm:text-[34px] font-bold text-text-primary leading-[1.15] tracking-tight mb-3">
                {phase === 'done' ? (
                  <>nexu is in your Slack. <span className="text-accent">Let&apos;s go.</span></>
                ) : (
                  'Deploying your AI coworker...'
                )}
              </h1>
              <p className="text-[14px] text-text-tertiary leading-relaxed max-w-[420px] mx-auto mb-8">
                {phase === 'done'
                  ? '1,000+ tools activated, memory initialized. @ nexu in any channel — or explore your workspace first.'
                  : 'Connecting Slack, activating 1,000+ tools, and initializing persistent memory. This only takes a few seconds.'}
              </p>

              {/* Progress bar — gradient */}
              <div className="max-w-[420px] mx-auto mb-10">
                <div className="h-2 rounded-full bg-surface-1 border border-border overflow-hidden">
                  <motion.div
                    className="h-full rounded-full bg-gradient-to-r from-accent to-accent/80"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.5, ease: 'easeOut' }}
                  />
                </div>
                <div className="flex justify-between mt-2.5">
                  <span className="text-[12px] font-medium text-text-secondary">{doneCount}/{SETUP_STEPS.length} steps</span>
                  <span className="text-[12px] font-medium text-accent">{Math.round(progress)}%</span>
                </div>
              </div>
            </div>

            {/* Steps with icons */}
            <div className="space-y-2 max-w-[420px] mx-auto mb-10">
              <AnimatePresence>
                {SETUP_STEPS.map((step, idx) => {
                  const status = stepStatuses[step.id];
                  const Icon = step.icon;
                  return (
                    <motion.div
                      key={step.id}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className={`flex items-center gap-4 px-4 py-3.5 rounded-lg transition-all text-left ${
                        status === 'running'
                          ? 'bg-accent/8 border border-accent/12 shadow-sm shadow-accent/5'
                          : status === 'done'
                            ? 'bg-[var(--color-success-subtle)] border border-[rgba(52,110,88,0.15)]'
                            : 'border border-border/50 bg-surface-1/50 opacity-60'
                      }`}
                    >
                      <div className="w-10 h-10 rounded-[12px] flex items-center justify-center shrink-0 bg-white border border-border">
                        {status === 'done' ? (
                          <div className="w-6 h-6 rounded-full bg-[rgba(52,110,88,0.20)] flex items-center justify-center">
                            <Check size={14} className="text-[var(--color-success)]" />
                          </div>
                        ) : status === 'running' ? (
                          <Loader2 size={18} className="text-accent animate-spin" />
                        ) : (
                          <span className="text-text-muted"><Icon size={18} /></span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className={`text-[14px] font-semibold ${
                          status === 'done' ? 'text-[var(--color-success)]' : status === 'running' ? 'text-text-primary' : 'text-text-muted'
                        }`}>
                          {step.label}
                        </div>
                        <div className="text-[12px] text-text-muted mt-0.5">{step.detail}</div>
                      </div>
                      {status === 'done' && (
                        <Badge variant="success" className="shrink-0">Done</Badge>
                      )}
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>

          </div>
        )}
      </div>

      {/* Footer */}
      <div className="relative z-10 flex items-center justify-center gap-4 pb-5 text-[11px] text-text-muted">
        <Link to="/openclaw/terms" className="hover:text-text-secondary transition-colors">
          Terms
        </Link>
        <Link to="/openclaw/privacy" className="hover:text-text-secondary transition-colors">
          Privacy
        </Link>
        <span>© 2026 Powerformer, Inc.</span>
      </div>
    </div>
  );
}
