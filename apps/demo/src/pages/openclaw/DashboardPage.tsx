import { Badge, Button, SectionHeader, StatCard } from "@nexu/ui-web";
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
            <Badge variant="brand" size="xs">
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

  return (
    <div className="max-w-5xl p-4 sm:p-8 mx-auto">
      <div className="mb-8">
        <h1 className="heading-page">Dashboard</h1>
        <p className="heading-page-desc">Cyber office overview — Lobster 🦞 status report.</p>
      </div>

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
      <div className="card mb-8 p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Zap size={14} className="text-accent" />
            <h2 className="text-sm font-semibold text-text-primary">Credit usage this month</h2>
            <Badge size="xs">Free Plan</Badge>
          </div>
          <Button
            variant="link"
            size="sm"
            onClick={() => navigate("/openclaw/workspace/billing")}
            className="text-[11px]"
          >
            View details <ArrowUpRight size={12} />
          </Button>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-4">
          <div className="flex-1 relative h-2.5 rounded-full bg-surface-3 overflow-hidden">
            <div
              className="absolute inset-y-0 left-0 rounded-full bg-[var(--color-info)]/80"
              style={{ width: "25.6%" }}
            />
            <div
              className="absolute inset-y-0 rounded-full bg-[var(--color-pink)]/80"
              style={{ left: "25.6%", width: "12.4%" }}
            />
            <div
              className="absolute inset-y-0 rounded-full bg-[var(--color-success)]/80"
              style={{ left: "38%", width: "2%" }}
            />
          </div>
          <span className="text-[12px] font-medium text-text-primary shrink-0">2,000 / 5,000</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
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
          ].map((cat) => (
            <div key={cat.label} className="flex items-center gap-2.5">
              <div className={`w-2 h-2 rounded-full ${cat.bg} shrink-0`} />
              <cat.icon size={12} className={cat.color} />
              <span className="text-[12px] text-text-secondary">{cat.label}</span>
              <span className="text-[12px] font-semibold text-text-primary ml-auto">
                {cat.used.toLocaleString()}
              </span>
            </div>
          ))}
        </div>
        <div className="mt-4 pt-3 border-t border-border/50 flex flex-col sm:flex-row gap-3 sm:gap-0 sm:items-center sm:justify-between">
          <div className="text-[11px] text-text-muted">
            3,000 credits left this month · ~12 days remaining
          </div>
          <Button
            variant="soft"
            size="xs"
            onClick={() => navigate("/openclaw/workspace/billing")}
            className="font-semibold"
          >
            <Crown size={10} /> Upgrade to Pro for 10x credits
          </Button>
        </div>
      </div>

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
