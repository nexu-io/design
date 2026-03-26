import { Check, Crown, ArrowRight, Code2, Sparkles, Globe, TrendingUp, ChevronRight } from 'lucide-react';
import { usePageTitle } from '../../hooks/usePageTitle';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

const PLANS = [
  {
    id: 'free', name: 'Free', price: '$0', credits: 5000, current: true,
    features: ['5,000 credits / month', 'Slack / Discord connect', 'AI coding + content automation', 'Shared compute'],
  },
  {
    id: 'pro', name: 'Pro', price: '$29', credits: 50000, recommended: true,
    features: ['50,000 credits / month', 'Priority compute', 'Custom domain', 'Advanced Workflows', 'Team collaboration'],
  },
  {
    id: 'team', name: 'Team', price: '$99', credits: 200000,
    features: ['200,000 credits / month', 'Dedicated compute', 'Unlimited Workflows', 'SSO integration', 'Dedicated support'],
  },
];

const USAGE = [
  { label: 'AI coding', used: 1280, icon: Code2, color: 'text-[var(--color-info)]', bg: 'bg-[var(--color-info)]' },
  { label: 'Content automation', used: 620, icon: Sparkles, color: 'text-[var(--color-pink)]', bg: 'bg-[var(--color-pink)]' },
  { label: 'Deployments', used: 100, icon: Globe, color: 'text-[var(--color-success)]', bg: 'bg-[var(--color-success)]' },
];

export default function BillingPage() {
  usePageTitle('Billing');
  const totalUsed = USAGE.reduce((s, u) => s + u.used, 0);
  const totalCredits = 5000;

  return (
    <div className="max-w-4xl p-4 sm:p-8 mx-auto">
      <div className="mb-8">
        <h1 className="heading-page">Billing & Credits</h1>
        <p className="heading-page-desc">Manage your plan and credit usage.</p>
      </div>

      <Tabs defaultValue="overview">
        <TabsList className="mb-6 w-fit">
          <TabsTrigger value="overview" className="gap-1.5">
            <TrendingUp size={14} /> Usage overview
          </TabsTrigger>
          <TabsTrigger value="plans" className="gap-1.5">
            <Crown size={14} /> Plan comparison
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="space-y-6">
            <div className="card p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-semibold text-text-primary">Usage this month</h2>
                <Badge>Free Plan</Badge>
              </div>
              <div className="flex items-center gap-4 mb-6">
                <div className="flex-1">
                  <div className="text-3xl font-bold text-text-primary">{totalUsed.toLocaleString()}</div>
                  <div className="text-[12px] text-text-muted mt-0.5">/ {totalCredits.toLocaleString()} credits used</div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-[var(--color-success)]">{(totalCredits - totalUsed).toLocaleString()}</div>
                  <div className="text-[12px] text-text-muted mt-0.5">credits remaining</div>
                </div>
              </div>
              <div className="relative h-3 rounded-full bg-surface-3 overflow-hidden mb-6">
                <div className="absolute inset-y-0 left-0 rounded-full bg-[var(--color-info)]/80" style={{ width: `${(1280 / totalCredits) * 100}%` }} />
                <div className="absolute inset-y-0 rounded-full bg-[var(--color-pink)]/80" style={{ left: `${(1280 / totalCredits) * 100}%`, width: `${(620 / totalCredits) * 100}%` }} />
                <div className="absolute inset-y-0 rounded-full bg-[var(--color-success)]/80" style={{ left: `${((1280 + 620) / totalCredits) * 100}%`, width: `${(100 / totalCredits) * 100}%` }} />
              </div>
              <div className="space-y-3">
                {USAGE.map(cat => (
                  <div key={cat.label} className="flex items-center gap-3">
                    <div className={`w-2.5 h-2.5 rounded-full ${cat.bg} shrink-0`} />
                    <cat.icon size={14} className={cat.color} />
                    <span className="text-[13px] text-text-secondary flex-1">{cat.label}</span>
                    <span className="text-[13px] font-semibold text-text-primary">{cat.used.toLocaleString()}</span>
                    <span className="text-[11px] text-text-muted w-16 text-right">{((cat.used / totalCredits) * 100).toFixed(1)}%</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-6 rounded-[12px] border border-accent/20 bg-accent/5">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Crown size={16} className="text-accent" />
                    <h3 className="text-sm font-semibold text-text-primary">Upgrade to Pro</h3>
                  </div>
                  <p className="text-[13px] text-text-muted">Get 10x credits, priority compute, custom domain, and advanced Workflows</p>
                </div>
                <Button asChild>
                  <a href="#plans">
                    View plans <ArrowRight size={14} />
                  </a>
                </Button>
              </div>
            </div>

            <div className="card p-6">
              <h2 className="text-sm font-semibold text-text-primary mb-4">Extra credit packs</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  { credits: '5,000', price: '$5', savings: '' },
                  { credits: '20,000', price: '$15', savings: 'Save 25%' },
                  { credits: '50,000', price: '$30', savings: 'Save 40%' },
                ].map(pack => (
                  <button key={pack.credits}
                    className="p-4 rounded-[12px] border border-border-subtle hover:border-accent/30 hover:bg-accent/5 transition-all cursor-pointer text-left group">
                    <div className="text-lg font-bold text-text-primary group-hover:text-accent transition-colors">{pack.credits}</div>
                    <div className="text-[12px] text-text-muted">credits</div>
                    <div className="flex items-center gap-2 mt-3">
                      <span className="text-[14px] font-semibold text-text-primary">{pack.price}</span>
                      {pack.savings && (
                        <Badge variant="success">{pack.savings}</Badge>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="plans">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {PLANS.map(plan => (
              <div key={plan.id}
                className={`p-6 rounded-[12px] border border-border-subtle transition-colors ${
                  'recommended' in plan && plan.recommended
                    ? 'border-accent/40 bg-accent/5 ring-1 ring-accent/20'
                    : 'border-border-subtle bg-surface-1'
                }`}>
                {'recommended' in plan && plan.recommended && (
                  <Badge variant="brand" className="mb-3">Recommended</Badge>
                )}
                <h3 className="text-lg font-bold text-text-primary">{plan.name}</h3>
                <div className="flex items-baseline gap-1 mt-2 mb-4">
                  <span className="text-3xl font-bold text-text-primary">{plan.price}</span>
                  <span className="text-[12px] text-text-muted">/ month</span>
                </div>
                <div className="space-y-2.5 mb-6">
                  {plan.features.map(f => (
                    <div key={f} className="flex gap-2 items-center text-[13px] text-text-secondary">
                      <Check size={14} className="text-[var(--color-success)] shrink-0" />
                      {f}
                    </div>
                  ))}
                </div>
                {'current' in plan && plan.current ? (
                  <Button variant="outline" className="w-full cursor-default" disabled>
                    Current plan
                  </Button>
                ) : (
                  <Button
                    variant={'recommended' in plan && plan.recommended ? 'default' : 'outline'}
                    className="w-full"
                  >
                    Upgrade <ChevronRight size={14} />
                  </Button>
                )}
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
