import { BarChart3, Bell, Brain, CheckCircle, Clock, Database, FileText, Mail, Plus, Search, Shield, TrendingUp, Users } from 'lucide-react';
import { useState, type ElementType } from 'react';

import { Button, PageHeader } from '@nexu-design/ui-web';

import { useLocale } from '../../hooks/useLocale';

interface ScheduleTask {
  id: string;
  name: string;
  time: string;
  timeSlot: 'morning' | 'afternoon' | 'evening' | 'night';
  cron: string;
  status: 'completed' | 'running' | 'upcoming' | 'idle';
  result?: string;
  icon: ElementType;
  channel: string;
}

const SCHEDULE_ICON_COLOR = 'var(--color-brand-primary)';

const TODAY_SCHEDULE: ScheduleTask[] = [
  { id: 's1', name: 'Morning Briefing', time: '08:30', timeSlot: 'morning', cron: 'Daily 08:30', status: 'completed', result: '3 meetings · 5 todos · 1 urgent', icon: FileText, channel: 'Feishu' },
  { id: 's2', name: 'Social Media Sweep', time: '09:00', timeSlot: 'morning', cron: 'Daily 09:00', status: 'completed', result: 'Scanned 2,340 posts · engaged 8 · found 2 leads', icon: TrendingUp, channel: 'Slack' },
  { id: 's3', name: 'TODO Check #1', time: '10:00', timeSlot: 'morning', cron: 'Daily 10:00 / 15:00', status: 'completed', result: 'Reminded 3 items · 1 overdue', icon: Bell, channel: 'Feishu' },
  { id: 's4', name: 'Action Item Tracker', time: '10:00', timeSlot: 'morning', cron: 'Daily 10:00 / 15:00 / 20:00', status: 'completed', result: 'Checked 7 items · 3 done · tracking 4', icon: CheckCircle, channel: 'Feishu' },
  { id: 's5', name: 'Email Digest', time: '12:00', timeSlot: 'afternoon', cron: 'Every 30min (work hours)', status: 'completed', result: 'Filtered 23 emails · 4 worth reading', icon: Mail, channel: 'Feishu' },
  { id: 's6', name: 'Competitor Monitor', time: '14:00', timeSlot: 'afternoon', cron: 'Daily 14:00', status: 'running', result: 'Scanning product updates…', icon: Search, channel: 'Slack' },
  { id: 's7', name: 'TODO Check #2', time: '15:00', timeSlot: 'afternoon', cron: 'Daily 10:00 / 15:00', status: 'upcoming', icon: Bell, channel: 'Feishu' },
  { id: 's8', name: 'Growth Metrics Report', time: '17:00', timeSlot: 'evening', cron: 'Daily 17:00', status: 'upcoming', icon: BarChart3, channel: 'Feishu' },
  { id: 's9', name: 'Action Item Tracker #3', time: '20:00', timeSlot: 'evening', cron: 'Daily 10:00 / 15:00 / 20:00', status: 'upcoming', icon: CheckCircle, channel: 'Feishu' },
  { id: 's10', name: 'Daily Debrief', time: '22:00', timeSlot: 'night', cron: 'Daily 22:00', status: 'upcoming', icon: Brain, channel: 'Feishu' },
  { id: 's11', name: 'Security Audit', time: '03:00', timeSlot: 'night', cron: 'Daily 03:00', status: 'upcoming', icon: Shield, channel: 'Feishu' },
];

const WEEKLY_TASKS: { name: string; day: string; time: string; icon: ElementType }[] = [
  { name: 'Contact Health Scan', day: 'Mon', time: '09:00', icon: Users },
  { name: 'Competitor Weekly Brief', day: 'Wed', time: '14:00', icon: Search },
  { name: 'Sprint Review', day: 'Fri', time: '17:00', icon: FileText },
  { name: 'Memory Consolidation', day: 'Sun', time: '20:00', icon: Database },
];

export function SchedulePanel() {
  const { t } = useLocale();
  const [tab, setTab] = useState<'today' | 'week'>('today');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const currentHour = 14;
  const completedCount = TODAY_SCHEDULE.filter((tk) => tk.status === 'completed').length;
  const runningCount = TODAY_SCHEDULE.filter((tk) => tk.status === 'running').length;
  const upcomingCount = TODAY_SCHEDULE.filter((tk) => tk.status === 'upcoming').length;

  const timeSlots: { key: ScheduleTask['timeSlot']; labelKey: string; range: string }[] = [
    { key: 'morning', labelKey: 'ws.schedule.morning', range: '06:00 – 12:00' },
    { key: 'afternoon', labelKey: 'ws.schedule.afternoon', range: '12:00 – 17:00' },
    { key: 'evening', labelKey: 'ws.schedule.evening', range: '17:00 – 22:00' },
    { key: 'night', labelKey: 'ws.schedule.night', range: '22:00 – 06:00' },
  ];

  const statusDot = (status: ScheduleTask['status']) => {
    switch (status) {
      case 'completed':
        return 'bg-[var(--color-success)]';
      case 'running':
        return 'bg-[var(--color-warning)] animate-pulse';
      case 'upcoming':
        return 'bg-[var(--color-text-muted)]';
      default:
        return 'bg-[var(--color-text-placeholder)]';
    }
  };

  const statusLabel = (status: ScheduleTask['status']) => {
    switch (status) {
      case 'completed':
        return t('ws.schedule.completed');
      case 'running':
        return t('ws.schedule.running');
      case 'upcoming':
        return t('ws.schedule.upcoming');
      default:
        return t('ws.schedule.idle');
    }
  };

  return (
    <div className="h-full overflow-y-auto">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-2 pb-6 sm:pb-8">
        <PageHeader
          density="shell"
          title={t('ws.schedule.title')}
          description={t('ws.schedule.subtitle')}
          actions={<Button variant="outline" size="sm" className="gap-1.5"><Plus size={14} />{t('ws.schedule.addTask')}</Button>}
        />

        <div className="flex items-center gap-4 mb-5">
          <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-[var(--color-success)]" /><span className="text-[12px] text-text-secondary">{completedCount} {t('ws.schedule.completed')}</span></div>
          <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-[var(--color-warning)] animate-pulse" /><span className="text-[12px] text-text-secondary">{runningCount} {t('ws.schedule.running')}</span></div>
          <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-text-muted" /><span className="text-[12px] text-text-secondary">{upcomingCount} {t('ws.schedule.upcoming')}</span></div>
          <span className="text-[11px] text-text-tertiary ml-auto">{t('ws.schedule.taskSummary').replace('{{tasks}}', String(TODAY_SCHEDULE.length))}</span>
        </div>

        <div className="inline-flex items-center gap-1 p-1 rounded-full bg-surface-2 mb-5">
          {[{ id: 'today' as const, label: t('ws.schedule.today') }, { id: 'week' as const, label: t('ws.schedule.thisWeek') }].map((item) => {
            const active = tab === item.id;
            return (
              <button key={item.id} onClick={() => setTab(item.id)} className={`px-4 py-1.5 rounded-full text-[12px] font-medium transition-all ${active ? 'bg-surface-1 text-text-primary shadow-[var(--shadow-rest)]' : 'text-text-muted hover:text-text-secondary'}`}>
                {item.label}
              </button>
            );
          })}
        </div>

        {tab === 'today' && (
          <div className="space-y-6">
            {timeSlots.map((slot) => {
              const tasks = TODAY_SCHEDULE.filter((tk) => tk.timeSlot === slot.key);
              if (tasks.length === 0) return null;
              const isCurrentSlot =
                (slot.key === 'morning' && currentHour >= 6 && currentHour < 12) ||
                (slot.key === 'afternoon' && currentHour >= 12 && currentHour < 17) ||
                (slot.key === 'evening' && currentHour >= 17 && currentHour < 22) ||
                (slot.key === 'night' && (currentHour >= 22 || currentHour < 6));

              return (
                <div key={slot.key}>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="flex items-center gap-2">
                      <span className={`text-[13px] font-semibold ${isCurrentSlot ? 'text-text-primary' : 'text-text-tertiary'}`}>{t(slot.labelKey)}</span>
                      <span className="text-[11px] text-text-placeholder">{slot.range}</span>
                    </div>
                    {isCurrentSlot && <span className="text-[10px] leading-none font-medium px-2 py-1 rounded-full bg-[var(--color-brand-primary)] text-white">{t('ws.schedule.now')}</span>}
                    <div className="flex-1 h-px bg-border" />
                  </div>

                  <div className="space-y-2 pl-1">
                    {tasks.map((task) => {
                      const Icon = task.icon;
                      const expanded = expandedId === task.id;
                      return (
                        <div key={task.id}>
                          <button
                            onClick={() => setExpandedId(expanded ? null : task.id)}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-[10px] border transition-all text-left group ${task.status === 'running' ? 'border-[var(--color-warning)]/30 bg-[var(--color-warning)]/[0.04]' : 'border-border hover:border-border-hover bg-surface-0'}`}
                          >
                            <span className="text-[12px] tabular-nums text-text-tertiary w-10 shrink-0 font-mono">{task.time}</span>
                            <span className={`w-2 h-2 rounded-full shrink-0 ${statusDot(task.status)}`} />
                            <span className="w-7 h-7 rounded-[8px] flex items-center justify-center shrink-0 border border-border bg-surface-1"><Icon size={14} style={{ color: SCHEDULE_ICON_COLOR }} /></span>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <span className="text-[13px] font-medium text-text-primary truncate">{task.name}</span>
                                <span className="text-[10px] leading-none font-medium px-1.5 py-0.5 rounded-full border border-border text-text-muted shrink-0">{task.channel}</span>
                              </div>
                              {task.result && <p className="text-[11px] text-text-tertiary mt-0.5 truncate">{task.result}</p>}
                            </div>
                            <span className={`text-[11px] shrink-0 ${task.status === 'completed' ? 'text-[var(--color-success)]' : task.status === 'running' ? 'text-[var(--color-warning)]' : 'text-text-muted'}`}>{statusLabel(task.status)}</span>
                          </button>

                          {expanded && (
                            <div className="ml-14 mt-1 px-4 py-3 rounded-[8px] bg-surface-2 border border-border text-[12px] text-text-secondary space-y-1.5">
                              <div className="flex items-center gap-2"><Clock size={12} className="text-text-muted" /><span>{t('ws.schedule.recurring')}: {task.cron}</span></div>
                              {task.result && <div className="flex items-center gap-2"><CheckCircle size={12} className="text-[var(--color-success)]" /><span>{task.result}</span></div>}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {tab === 'week' && (
          <div className="space-y-2">
            <p className="text-[12px] text-text-tertiary mb-3">{t('ws.schedule.weekIntro')}</p>
            {WEEKLY_TASKS.map((task, i) => {
              const Icon = task.icon;
              return (
                <div key={i} className="flex items-center gap-3 px-4 py-3 rounded-[10px] border border-border bg-surface-0 hover:border-border-hover transition-colors">
                  <span className="text-[12px] tabular-nums text-text-tertiary w-8 shrink-0 font-mono font-medium">{task.day}</span>
                  <span className="text-[12px] tabular-nums text-text-tertiary w-10 shrink-0 font-mono">{task.time}</span>
                  <span className="w-7 h-7 rounded-[8px] flex items-center justify-center shrink-0 border border-border bg-surface-1"><Icon size={14} style={{ color: SCHEDULE_ICON_COLOR }} /></span>
                  <span className="text-[13px] font-medium text-text-primary flex-1 truncate">{task.name}</span>
                </div>
              );
            })}

            <div className="mt-6 card px-4 py-3">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-[13px] font-semibold text-text-primary">{t('ws.schedule.dailyOverview')}</span>
                <div className="flex-1 h-px bg-border" />
                <span className="text-[11px] text-text-tertiary tabular-nums">{TODAY_SCHEDULE.length}</span>
              </div>
              <p className="text-[12px] text-text-secondary leading-relaxed">{t('ws.schedule.singleAgentNote')}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
