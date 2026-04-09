import { ArrowUpRight } from 'lucide-react';

import { PageHeader } from '@nexu-design/ui-web';

import { useLocale } from '../../hooks/useLocale';
import { MOCK_CHANNELS, MOCK_DEPLOYMENTS } from './data';

export function DeploymentsView() {
  const { t } = useLocale();
  const deployments = MOCK_DEPLOYMENTS;
  const channelMap = Object.fromEntries(MOCK_CHANNELS.map((c) => [c.id, c.name]));

  const statusDot: Record<string, string> = {
    live: 'status-dot-live',
    building: 'status-dot-building',
    failed: 'status-dot-failed',
  };
  const statusLabel: Record<string, { textKey: string; color: string }> = {
    live: { textKey: 'ws.deployments.statusLive', color: 'text-[var(--color-success)]' },
    building: { textKey: 'ws.deployments.statusBuilding', color: 'text-[var(--color-warning)]' },
    failed: { textKey: 'ws.deployments.statusFailed', color: 'text-[var(--color-danger)]' },
  };

  const colStyle = { gridTemplateColumns: '1fr 88px 112px 140px 40px' };

  return (
    <div className="h-full overflow-y-auto">
      <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6 sm:py-8">
        <PageHeader
          density="shell"
          title={t('ws.deployments.title')}
          description={t('ws.deployments.subtitle')}
        />

        <div className="data-table">
          <div className="data-table-header" style={colStyle}>
            <span>{t('ws.deployments.colName')}</span>
            <span>{t('ws.deployments.colStatus')}</span>
            <span>{t('ws.deployments.colChannel')}</span>
            <span>{t('ws.deployments.colDeployed')}</span>
            <span />
          </div>
          {deployments.map((d) => {
            const channelName = d.channelId ? channelMap[d.channelId] : null;
            const sl = statusLabel[d.status] ?? statusLabel.live!;
            return (
              <div key={d.id} className="data-table-row" style={colStyle}>
                <span className="truncate text-[13px] font-medium text-text-primary" title={d.title}>
                  {d.title}
                </span>
                <span className="flex items-center gap-1.5">
                  <span className={`status-dot ${statusDot[d.status] ?? ''}`} />
                  <span className={`text-[12px] font-medium ${sl.color}`}>{t(sl.textKey)}</span>
                </span>
                <span>
                  {channelName && (
                    <span className="rounded-full bg-surface-2 px-2 py-0.5 text-[11px] leading-none text-text-muted">
                      {channelName}
                    </span>
                  )}
                </span>
                <span className="text-[12px] tabular-nums text-text-muted">{d.createdAt}</span>
                <span>
                  {d.url && (
                    <a
                      href={d.url}
                      target="_blank"
                      rel="noreferrer"
                      className="group/link relative flex h-6 w-6 items-center justify-center rounded-md text-text-secondary transition-colors hover:bg-surface-2 hover:text-text-primary"
                      title={d.url.replace(/^https?:\/\//, '')}
                    >
                      <ArrowUpRight size={12} />
                    </a>
                  )}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
