import { AnimatePresence, motion } from 'framer-motion';
import { AlertCircle, CheckCircle2, Download, X } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

import {
  Alert,
  AlertDescription,
  Button,
  ScrollArea,
  ToggleGroup,
  ToggleGroupItem,
  cn,
} from '@nexu-design/ui-web';

import type { RewardChannel } from '../../hooks/useBudget';
import { openExternal } from '../../utils/open-external';

const SHARE_MATERIAL_STAMP_OPTIONS = [
  '/share-material/stamp-1.png',
  '/share-material/stamp-2.png',
  '/share-material/stamp-3.png',
  '/share-material/stamp-4.png',
  '/share-material/stamp-6.png',
] as const;

function formatRewardAmount(n: number): string {
  return String(Math.round(n));
}

function formatCreditsPlain(n: number): string {
  return formatRewardAmount(n);
}

function downloadShareCard() {
  const W = 1080;
  const H = 1080;
  const PAD = 80;
  const canvas = document.createElement('canvas');
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d')!;

  const grad = ctx.createLinearGradient(0, 0, W, H);
  grad.addColorStop(0, '#f8fafc');
  grad.addColorStop(1, '#e2e8f0');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, W, H);

  ctx.fillStyle = '#0f172a';
  ctx.font = 'bold 64px system-ui, -apple-system, sans-serif';
  ctx.fillText('nexu', PAD, 160);

  ctx.fillStyle = '#475569';
  ctx.font = '32px system-ui, -apple-system, sans-serif';
  const tagline = 'The simplest open-source openclaw desktop app';
  ctx.fillText(tagline, PAD, 220);

  ctx.fillStyle = '#64748b';
  ctx.font = '28px system-ui, -apple-system, sans-serif';
  const lines = [
    'Bridge your Agent to WeChat, Feishu,',
    'Slack & Discord in one click.',
    '',
    'Works with Claude Code, Codex & any LLM.',
    'BYOK, OAuth, local-first.',
  ];
  let y = 320;
  for (const line of lines) {
    if (line) ctx.fillText(line, PAD, y);
    y += 42;
  }

  ctx.fillStyle = '#0f172a';
  ctx.font = 'bold 28px system-ui, -apple-system, sans-serif';
  ctx.fillText('github.com/refly-ai/nexu', PAD, H - 120);

  ctx.fillStyle = '#94a3b8';
  ctx.font = '24px system-ui, -apple-system, sans-serif';
  ctx.fillText('Star ⭐ & try it free', PAD, H - 76);

  canvas.toBlob((blob) => {
    if (!blob) return;
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'nexu-share.png';
    a.click();
    URL.revokeObjectURL(url);
  }, 'image/png');
}

function getRewardMaterialLaunchUrl(channelId: string): string | null {
  switch (channelId) {
    case 'xiaohongshu':
      return 'https://www.xiaohongshu.com/explore';
    case 'jike':
      return 'https://web.okjike.com';
    case 'feishu':
      return 'https://www.feishu.cn';
    case 'wechat':
      return null;
    default:
      return null;
  }
}

export function RewardMaterialModal({
  channel,
  onClose,
  onClaim,
  t,
}: {
  channel: RewardChannel;
  onClose: () => void;
  onClaim: () => void;
  t: (key: string) => string;
}) {
  const [completed, setCompleted] = useState(false);
  const [busy, setBusy] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);
  const [stampIndex, setStampIndex] = useState(0);
  const launchUrl = getRewardMaterialLaunchUrl(channel.id);
  const previewSrc = SHARE_MATERIAL_STAMP_OPTIONS[stampIndex] ?? SHARE_MATERIAL_STAMP_OPTIONS[0];

  const handleSaveCopyAll = async () => {
    if (busy || completed) return;
    setBusy(true);
    setActionError(null);
    try {
      downloadShareCard();
      await navigator.clipboard.writeText(t('rewards.shareBioClip'));
      onClaim();
      const place = t(`reward.${channel.id}.toastPlace`);
      toast.success(t('rewards.material.toastPublish').replace('{place}', place));
      setCompleted(true);
      if (launchUrl) void openExternal(launchUrl);
    } catch {
      setActionError(t('rewards.material.actionError'));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/35 backdrop-blur-[2px]" onClick={onClose} />
      <div
        className="relative w-full max-w-[min(96vw,620px)] overflow-hidden rounded-[var(--radius-16)] border border-border bg-surface-1 shadow-[var(--shadow-dropdown)] animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between gap-2 border-b border-border px-6 py-4">
          <h3 className="truncate pr-2 text-[14px] font-semibold text-text-primary">
            {t(`reward.${channel.id}.name`)}
          </h3>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            onClick={onClose}
            className="shrink-0 text-text-tertiary"
            aria-label="Close"
          >
            <X size={16} />
          </Button>
        </div>
        <div className="flex flex-col gap-4 px-6 pb-4 pt-4 sm:flex-row sm:items-stretch sm:gap-5">
          <div className="flex min-w-0 flex-col gap-1 sm:min-w-12 sm:w-12 sm:self-stretch">
            <p className="text-[11px] font-medium uppercase tracking-wide text-text-tertiary">
              {t('rewards.material.styleLabel')}
            </p>
            <ToggleGroup
              type="single"
              value={String(stampIndex)}
              onValueChange={(v) => {
                if (v !== '') setStampIndex(Number(v));
              }}
              className="flex flex-row gap-1.5 overflow-x-auto pb-0.5 !border-0 !bg-transparent !p-0 shadow-none [-webkit-overflow-scrolling:touch] sm:flex-col sm:gap-1.5 sm:overflow-visible sm:pb-0"
              aria-label={t('rewards.material.stylePickerAria')}
            >
              {SHARE_MATERIAL_STAMP_OPTIONS.map((src, i) => (
                <ToggleGroupItem
                  key={src}
                  value={String(i)}
                  aria-label={t('rewards.material.styleOptionAria')
                    .replace('{n}', String(i + 1))
                    .replace('{total}', String(SHARE_MATERIAL_STAMP_OPTIONS.length))}
                  className={cn(
                    'relative size-12 shrink-0 overflow-hidden !rounded-[8px] border-2 border-border !px-0 !py-0 !shadow-none',
                    'bg-white !shadow-[var(--shadow-rest)] hover:!bg-white hover:text-inherit',
                    'data-[state=on]:border-[var(--color-brand-primary)] data-[state=on]:!bg-white data-[state=on]:!shadow-md',
                    'data-[state=on]:ring-2 data-[state=on]:ring-[var(--color-brand-primary)]/25',
                    'focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
                    'sm:h-auto sm:w-full sm:aspect-square sm:flex-none sm:shrink-0',
                  )}
                >
                  <img
                    src={src}
                    alt=""
                    className="pointer-events-none h-full w-full object-cover"
                    loading="lazy"
                  />
                  <span className="pointer-events-none absolute left-0.5 top-0.5 flex h-3.5 min-w-3.5 items-center justify-center rounded bg-black/45 px-0.5 text-[8px] font-bold leading-none tabular-nums text-white">
                    {i + 1}
                  </span>
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
          </div>
          <div className="flex min-w-0 flex-1 justify-center sm:justify-start">
            <div className="aspect-[3/4] w-full max-w-[220px] overflow-hidden rounded-[var(--radius-12)] border border-border bg-white shadow-[var(--shadow-rest)]">
              <img
                key={previewSrc}
                src={previewSrc}
                alt=""
                className="h-full w-full object-cover"
                loading="lazy"
              />
            </div>
          </div>
          <div className="flex min-h-0 w-full min-w-0 flex-1 flex-col sm:h-[calc(220px*4/3)] sm:min-h-[calc(220px*4/3)]">
            <AnimatePresence mode="wait">
              {completed ? (
                <motion.div
                  key="done"
                  initial={{ opacity: 0, y: 10, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ type: 'spring', stiffness: 380, damping: 28 }}
                  className="flex h-full min-h-0 flex-col"
                >
                  <div className="min-h-0 flex-1 overflow-y-auto">
                    <Alert
                      variant="default"
                      className="flex flex-col !items-stretch gap-2 border-[var(--color-brand-primary)]/25 bg-[var(--color-brand-subtle)] text-sm"
                    >
                      <div className="flex w-full min-w-0 items-center justify-start gap-3">
                        <CheckCircle2
                          className="size-6 shrink-0 text-[var(--color-brand-primary)]"
                          strokeWidth={2}
                          aria-hidden
                        />
                        <span className="inline-flex min-w-0 shrink-0 items-baseline gap-1">
                          <span className="text-[18px] font-bold leading-none tabular-nums text-[var(--color-brand-primary)]">
                            {channel.reward === 1 ? '+1' : `+${formatCreditsPlain(channel.reward)}`}
                          </span>
                          <span className="text-sm font-semibold leading-none text-[var(--color-brand-primary)]">
                            {channel.reward === 1
                              ? t('rewards.material.successCreditsWordOne')
                              : t('rewards.material.successCreditsWordMany')}
                          </span>
                        </span>
                      </div>
                      <AlertDescription className="mb-0 text-[13px] leading-relaxed">
                        {t('rewards.material.successPublishHint')}
                      </AlertDescription>
                    </Alert>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="todo"
                  initial={{ opacity: 0, y: 10, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ type: 'spring', stiffness: 380, damping: 28 }}
                  className="flex h-full min-h-0 flex-col"
                >
                  <div className="mb-2 text-[13px] font-semibold text-text-primary">
                    {t('rewards.material.todoTitle')}
                  </div>
                  <div className="min-h-0 flex-1 overflow-hidden">
                    <ScrollArea className="h-full pr-2">
                      <ol className="space-y-2 pb-1">
                        {[
                          t('rewards.material.todo1'),
                          t('rewards.material.todo2'),
                          t('rewards.material.todo3').replace(
                            '{credits}',
                            formatCreditsPlain(channel.reward),
                          ),
                        ].map((body, i) => (
                          <li key={body} className="flex items-start gap-2.5">
                            <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-surface-2 text-[11px] font-semibold text-text-secondary">
                              {i + 1}
                            </span>
                            <span className="min-w-0 flex-1 text-[14px] leading-relaxed text-text-secondary">
                              {body}
                            </span>
                          </li>
                        ))}
                      </ol>
                    </ScrollArea>
                  </div>
                  <div className="mt-auto flex w-full shrink-0 flex-col gap-2 pt-3">
                    <Button
                      type="button"
                      size="default"
                      className="w-full text-sm font-semibold"
                      loading={busy}
                      leadingIcon={<Download size={16} />}
                      onClick={() => void handleSaveCopyAll()}
                    >
                      {t('rewards.material.downloadAndPost')}
                    </Button>
                    {actionError ? (
                      <Alert variant="destructive" className="px-3 py-2 text-sm">
                        <AlertCircle className="size-4 shrink-0" aria-hidden />
                        <AlertDescription className="text-[12px] text-destructive">
                          {actionError}
                        </AlertDescription>
                      </Alert>
                    ) : null}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
