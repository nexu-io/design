import {
  Badge,
  BudgetPopover,
  Button,
  CreditsCapsule,
  PageHeader,
  SectionHeader,
  StatCard,
} from "@nexu-design/ui-web";
import {
  AlertTriangle,
  ArrowUpRight,
  CheckCircle2,
  Clock,
  Code2,
  Crown,
  ExternalLink,
  Globe,
  Loader2,
  MessageSquare,
  Radio,
  Rocket,
  Sparkles,
  Zap,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import { usePageTitle } from "../../hooks/usePageTitle";
import {
  type Activity,
  type Deployment,
  MOCK_ACTIVITIES,
  MOCK_CHANNELS,
  MOCK_DEPLOYMENTS,
  MOCK_WORKFLOWS,
  getPlatformLabel,
} from "./data";

function DeploymentRow({ dep }: { dep: Deployment }) {
  const statusConfig: Record<string, { icon: typeof CheckCircle2; color: string }> = {
    live: { icon: CheckCircle2, color: "text-[var(--color-success)]" },
    building: { icon: Loader2, color: "text-[var(--color-warning)] animate-spin" },
    failed: { icon: AlertTriangle, color: "text-[var(--color-danger)]" },
  };
  const s = statusConfig[dep.status];
  return (
    <div className="flex gap-3 items-center py-3 border-b border-border last:border-0">
      <s.icon size={14} className={s.color} />
      <div className="flex-1 min-w-0">
        <div className="flex gap-2 items-center">
          <span className="text-[13px] font-medium text-text-primary truncate">{dep.title}</span>
          {dep.source === "content" && (
            <Badge variant="accent" size="xs">
              Content
            </Badge>
          )}
        </div>
        <div className="text-[11px] text-text-muted">{dep.createdAt}</div>
      </div>
      {dep.url && (
        <a
          href={dep.url}
          target="_blank"
          rel="noreferrer"
          className="flex gap-1 items-center text-[11px] text-[var(--color-success)] hover:text-[var(--color-success)] font-medium shrink-0"
        >
          Preview <ExternalLink size={10} />
        </a>
      )}
    </div>
  );
}

function ActivityRow({ activity, onNavigate }: { activity: Activity; onNavigate?: () => void }) {
  const typeConfig: Record<string, { icon: typeof Rocket; iconColor: string }> = {
    deploy: { icon: Rocket, iconColor: "text-[var(--color-success)]" },
    message: { icon: MessageSquare, iconColor: "text-[var(--color-info)]" },
    config: { icon: Radio, iconColor: "text-[var(--color-pink)]" },
    error: { icon: AlertTriangle, iconColor: "text-[var(--color-danger)]" },
    content: { icon: Sparkles, iconColor: "text-[var(--color-pink)]" },
  };
  const t = typeConfig[activity.type];

  const content = (
    <>
      <div className="flex justify-center items-center w-7 h-7 rounded-[12px] shrink-0 mt-0.5 bg-white border border-border">
        <t.icon size={13} className={t.iconColor} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-[13px] text-text-primary leading-relaxed">{activity.content}</div>
        <div className="flex gap-2 items-center mt-0.5">
          {activity.channelName && <Badge className="text-[11px]">{activity.channelName}</Badge>}
          <span className="text-[11px] text-text-muted">· {activity.time}</span>
        </div>
      </div>
    </>
  );

  if (onNavigate) {
    return (
      <Button
        type="button"
        variant="ghost"
        size="inline"
        onClick={onNavigate}
        className="-mx-2 flex w-[calc(100%+1rem)] items-start gap-3 rounded-lg border-b border-border px-2 py-3 text-left last:border-0 hover:bg-surface-2/50"
      >
        {content}
      </Button>
    );
  }

  return (
    <div className="flex gap-3 items-start border-b border-border py-3 last:border-0">
      {content}
    </div>
  );
}

function UsageChart() {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const values = [12, 28, 8, 35, 22, 5, 18];
  const max = Math.max(...values);

  return (
    <div className="flex gap-3 items-end h-32">
      {days.map((day, i) => (
        <div key={day} className="flex flex-col flex-1 items-center gap-1.5">
          <div
            className="relative w-full rounded-t-md bg-[var(--color-success)]/80 transition-all hover:bg-[var(--color-success)] group"
            style={{ height: `${(values[i] / max) * 100}%`, minHeight: 4 }}
          >
            <div className="absolute -top-6 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 text-[10px] text-text-primary bg-surface-3 px-2 py-0.5 rounded transition-opacity whitespace-nowrap">
              {values[i]} uses
            </div>
          </div>
          <span className="text-[10px] text-text-muted">{day}</span>
        </div>
      ))}
    </div>
  );
}

export default function DashboardPage() {
  usePageTitle("Dashboard");
  const navigate = useNavigate();
  const activeChannels = MOCK_CHANNELS.filter((c) => c.status === "active").length;
  const liveDeployments = MOCK_DEPLOYMENTS.filter((d) => d.status === "live").length;
  const activeWorkflows = MOCK_WORKFLOWS.filter((w) => w.status === "active").length;
  const usageCategories = [
    {
      label: "AI coding",
      used: 1280,
      icon: Code2,
      color: "text-[var(--color-info)]",
      bg: "bg-[var(--color-info)]",
    },
    {
      label: "Content automation",
      used: 620,
      icon: Sparkles,
      color: "text-[var(--color-pink)]",
      bg: "bg-[var(--color-pink)]",
    },
    {
      label: "Deployments",
      used: 100,
      icon: Globe,
      color: "text-[var(--color-success)]",
      bg: "bg-[var(--color-success)]",
    },
  ] as const;
  const usedCredits = usageCategories.reduce((sum, category) => sum + category.used, 0);
  const totalCredits = 5000;
  const remainingCredits = totalCredits - usedCredits;

  return (
    <div className="max-w-5xl p-4 sm:p-8 mx-auto">
      <PageHeader
        title="Dashboard"
        description="Cyber office overview — Lobster 🦞 status report."
      />

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        <StatCard
          label="Active channels"
          value={activeChannels.toString()}
          meta={`${MOCK_CHANNELS.length} total`}
          icon={Radio}
          tone="success"
        />
        <StatCard
          label="Live deployments"
          value={liveDeployments.toString()}
          meta="Code + content"
          icon={Globe}
          tone="info"
        />
        <StatCard
          label="Content Workflows"
          value={activeWorkflows.toString()}
          meta={`${MOCK_WORKFLOWS.length} total`}
          icon={Sparkles}
          tone="accent"
        />
        <StatCard
          label="Credits balance"
          value="3,000"
          meta="5,000 total"
          icon={Zap}
          tone="warning"
        />
      </div>

      {/* Credit usage */}
      <CreditsCapsule
        className="mb-8"
        title={
          <div className="flex items-center gap-2">
            <Zap size={14} className="text-accent" />
            <span>Credit usage this month</span>
          </div>
        }
        badge={<Badge size="xs">Free Plan</Badge>}
        value={`${remainingCredits.toLocaleString()} left`}
        meta={`${usedCredits.toLocaleString()} / ${totalCredits.toLocaleString()} used this month`}
        hint="~12 days until reset"
        progress={usedCredits}
        progressMax={totalCredits}
        progressVariant="accent"
        action={
          <BudgetPopover
            trigger={
              <Button variant="link" size="sm" className="text-[11px]">
                View details <ArrowUpRight size={12} />
              </Button>
            }
            title="Credit usage this month"
            description="Review current usage mix, then jump into Settings → Usage for the full plan and rewards breakdown."
            items={usageCategories.map((category) => ({
              id: category.label.toLowerCase().replace(/\s+/g, "-"),
              label: category.label,
              value: category.used.toLocaleString(),
              icon: category.icon,
              dotClassName: category.bg,
            }))}
            summary={
              <>
                <span className="font-semibold text-text-primary">
                  {remainingCredits.toLocaleString()} credits left
                </span>{" "}
                this month · resets in ~12 days.
              </>
            }
            footer={
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate("/openclaw/workspace?view=settings&tab=usage")}
                >
                  Open Settings → Usage
                </Button>
                <Button size="sm" onClick={() => navigate("/openclaw/pricing")}>
                  Upgrade plan
                </Button>
              </>
            }
          />
        }
        breakdown={
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {usageCategories.map((category) => (
              <div key={category.label} className="flex items-center gap-2.5">
                <div className={`h-2 w-2 shrink-0 rounded-full ${category.bg}`} />
                <category.icon size={12} className={category.color} />
                <span className="text-[12px] text-text-secondary">{category.label}</span>
                <span className="ml-auto text-[12px] font-semibold text-text-primary">
                  {category.used.toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        }
        footer={
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="text-[11px] text-text-muted">
              Rewards credits stack on top of your plan credits once weekly tasks are claimed.
            </div>
            <Button
              variant="soft"
              size="xs"
              onClick={() => navigate("/openclaw/pricing")}
              className="font-semibold"
            >
              <Crown size={10} /> Upgrade to Pro for 10x credits
            </Button>
          </div>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-3 space-y-6">
          <div className="card p-5">
            <SectionHeader
              className="mb-4"
              title={
                <span className="text-sm font-semibold text-text-primary">Recent activity</span>
              }
              action={
                <span className="text-[11px] text-text-muted">{MOCK_ACTIVITIES.length} items</span>
              }
            />
            <div>
              {MOCK_ACTIVITIES.map((a) => (
                <ActivityRow
                  key={a.id}
                  activity={a}
                  onNavigate={
                    a.channelId
                      ? () => navigate(`/openclaw/workspace/channels/${a.channelId}`)
                      : undefined
                  }
                />
              ))}
            </div>
          </div>
          <div className="card p-5">
            <SectionHeader
              className="mb-4"
              title={<span className="text-sm font-semibold text-text-primary">All outputs</span>}
              action={
                <span className="text-[11px] text-text-muted">{MOCK_DEPLOYMENTS.length} total</span>
              }
            />
            <div>
              {MOCK_DEPLOYMENTS.map((d) => (
                <DeploymentRow key={d.id} dep={d} />
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="card p-5">
            <SectionHeader
              className="mb-4"
              title={
                <span className="text-sm font-semibold text-text-primary">Usage this week</span>
              }
              action={
                <div className="flex gap-1 items-center text-[11px] text-text-muted">
                  <Clock size={10} /> 128 requests
                </div>
              }
            />
            <UsageChart />
          </div>
          <div className="card p-5">
            <h2 className="text-sm font-semibold text-text-primary mb-3">Channels</h2>
            <div className="space-y-2">
              {MOCK_CHANNELS.map((ch) => (
                <Button
                  key={ch.id}
                  variant="ghost"
                  size="inline"
                  onClick={() => navigate(`/openclaw/workspace/channels/${ch.id}`)}
                  className="group -mx-2 flex w-full items-center gap-3 rounded-lg px-2 py-2 text-left transition-colors hover:bg-surface-3"
                >
                  <div
                    className={`w-2 h-2 rounded-full shrink-0 ${ch.status === "active" ? "bg-[var(--color-success)]" : "bg-surface-3"}`}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="text-[13px] font-medium text-text-primary truncate">
                      {ch.name}
                    </div>
                    <div className="text-[11px] text-text-muted">
                      {getPlatformLabel(ch.platform)} · {ch.messageCount} messages
                    </div>
                  </div>
                  <ArrowUpRight
                    size={12}
                    className="text-text-muted opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
                  />
                </Button>
              ))}
            </div>
          </div>
          <div className="card p-5">
            <h2 className="text-sm font-semibold text-text-primary mb-3">Quick actions</h2>
            <div className="space-y-2">
              {[
                {
                  label: "Add channel",
                  action: () => navigate("/openclaw/workspace/channels"),
                  icon: Radio,
                },
                {
                  label: "View all outputs",
                  action: () => navigate("/openclaw/workspace/channels"),
                  icon: Globe,
                },
                { label: "Docs", action: () => {}, icon: ExternalLink },
              ].map((a) => (
                <Button
                  key={a.label}
                  variant="ghost"
                  size="inline"
                  onClick={a.action}
                  className="-mx-2 flex w-full items-center gap-2.5 rounded-lg px-2 py-2 text-[13px] text-text-secondary hover:bg-surface-3 hover:text-text-primary"
                >
                  <a.icon size={14} className="text-text-muted" />
                  {a.label}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
