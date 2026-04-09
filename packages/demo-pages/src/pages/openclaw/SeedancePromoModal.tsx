import { ArrowUpRight, Check, Clock, Sparkles, Star, X } from 'lucide-react';
import { useEffect, useState } from 'react';

import { openExternal } from '../../utils/open-external';

type SeedanceStep = 'star' | 'feishu';

const FEISHU_GROUP_URL =
  'https://applink.feishu.cn/client/chat/chatter/add_by_link?link_token=98drf9e0-928f-4706-b0af-e515abfb12c0';
const SEEDANCE_TUTORIAL_URL =
  'https://powerformer.feishu.cn/wiki/OFxFw2MpyiFWKpk9n2Dc7joEngc';
const SEEDANCE_COUNTDOWN_CYCLE_MS = 2 * 24 * 60 * 60 * 1000;
const SEEDANCE_COUNTDOWN_LOOP_END_MS = Date.now() + SEEDANCE_COUNTDOWN_CYCLE_MS - 1000;

function getSeedanceCountdown(now: number) {
  const cycleRemainingMs =
    (((SEEDANCE_COUNTDOWN_LOOP_END_MS - now) % SEEDANCE_COUNTDOWN_CYCLE_MS) +
      SEEDANCE_COUNTDOWN_CYCLE_MS) %
    SEEDANCE_COUNTDOWN_CYCLE_MS;
  const remainingMs =
    cycleRemainingMs === 0 ? SEEDANCE_COUNTDOWN_CYCLE_MS - 1000 : cycleRemainingMs;
  const totalSeconds = Math.floor(remainingMs / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return {
    days,
    hours,
    minutes,
    seconds,
    compactLabel: `${String(days).padStart(2, '0')}天 ${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`,
  };
}

function SeedanceCountdownBlocks({ now, compact = false }: { now: number; compact?: boolean }) {
  const countdown = getSeedanceCountdown(now);

  if (compact) {
    return (
      <div
        className="inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-semibold leading-none shadow-sm tabular-nums"
        style={{
          color: 'white',
          background:
            'linear-gradient(135deg, color-mix(in srgb, var(--color-warning) 82%, white), color-mix(in srgb, var(--color-danger) 78%, var(--color-warning) 22%))',
          borderColor:
            'color-mix(in srgb, var(--color-danger) 56%, var(--color-warning) 32%, white)',
          boxShadow: 'var(--shadow-focus)',
        }}
      >
        <Clock size={10} className="shrink-0" />
        <span>{countdown.compactLabel}</span>
      </div>
    );
  }

  return null;
}

export function SeedancePromoModal({ onClose }: { onClose: () => void }) {
  const [step, setStep] = useState<SeedanceStep>('star');
  const [starred, setStarred] = useState(false);
  const [countdownNow, setCountdownNow] = useState(Date.now());

  const handleStar = () => {
    openExternal('https://github.com/refly-ai/nexu');
    setStarred(true);
  };

  const stepDots: SeedanceStep[] = ['star', 'feishu'];
  const stepMeta: Record<SeedanceStep, string> = {
    star: '第一步：GitHub Star 并截图',
    feishu: '第二步：加入飞书群并填写问卷',
  };

  useEffect(() => {
    const timer = window.setInterval(() => setCountdownNow(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-[4px]" onClick={onClose} />
      <div
        className="relative mx-4 w-full max-w-[348px] overflow-hidden rounded-2xl border border-border bg-surface-1 shadow-[0_24px_64px_rgba(0,0,0,0.24),0_0_0_1px_rgba(0,0,0,0.06)]"
        style={{ animation: 'scaleIn 220ms cubic-bezier(0.16,1,0.3,1)' }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute right-3.5 top-3.5 z-20 flex h-6 w-6 items-center justify-center rounded-full text-text-muted transition-colors hover:bg-white/70 hover:text-text-primary"
        >
          <X size={13} />
        </button>

        <div
          className="relative border-b"
          style={{
            background:
              'linear-gradient(135deg, color-mix(in srgb, var(--color-warning) 16%, white), color-mix(in srgb, var(--color-brand-primary) 8%, white))',
            borderColor: 'color-mix(in srgb, var(--color-warning) 18%, white)',
          }}
        >
          <div
            className="absolute inset-0 opacity-60"
            style={{
              background:
                'radial-gradient(circle at top right, color-mix(in srgb, var(--color-brand-primary) 12%, transparent), transparent 45%)',
            }}
          />
          <div className="relative px-5 pb-4 pt-5">
            <div className="flex flex-wrap items-center gap-2">
              <div className="inline-flex items-center gap-1.5 rounded-full border border-white/60 bg-white/75 px-2.5 py-1 text-[10px] font-semibold leading-none text-[var(--color-warning)] shadow-sm">
                <Sparkles size={10} />
                限时体验
              </div>
              <SeedanceCountdownBlocks now={countdownNow} compact />
            </div>
            <div className="mt-3">
              <h2 className="text-[18px] font-semibold leading-tight text-text-primary">
                领取 Seedance 2.0 体验 Key
              </h2>
            </div>
          </div>
        </div>

        <div className="px-5 pb-5 pt-4">
          <div className="mb-4 flex items-center justify-between">
            <div className="text-[14px] font-semibold text-text-primary">{stepMeta[step]}</div>
            <div className="shrink-0 flex items-center gap-1.5">
              {stepDots.map((s) => (
                <div
                  key={s}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    s === step
                      ? 'w-5 bg-[var(--color-brand-primary)]'
                      : stepDots.indexOf(s) < stepDots.indexOf(step)
                        ? 'w-2 bg-[var(--color-brand-primary)]/40'
                        : 'w-2 bg-border'
                  }`}
                />
              ))}
            </div>
          </div>

          {step === 'star' && (
            <>
              <div
                className="mb-4 rounded-[12px] border px-4 py-3"
                style={{
                  background: 'color-mix(in srgb, var(--color-warning) 7%, white)',
                  borderColor: 'color-mix(in srgb, var(--color-warning) 16%, white)',
                }}
              >
                <div className="flex items-start gap-3">
                  <div
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[12px] border"
                    style={{
                      background: 'color-mix(in srgb, var(--color-warning) 12%, white)',
                      borderColor: 'color-mix(in srgb, var(--color-warning) 18%, white)',
                    }}
                  >
                    <Star size={18} className="fill-[var(--color-warning)] text-[var(--color-warning)]" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-[11px] leading-relaxed text-text-muted">
                      在 GitHub 为 nexu star；并将点完后的仓库页面进行截图。
                    </div>
                  </div>
                </div>
              </div>
              <button
                onClick={handleStar}
                className={`mb-2.5 flex h-[40px] w-full items-center justify-center gap-2 rounded-[10px] text-[13px] font-semibold transition-colors ${
                  starred
                    ? 'border border-border bg-surface-1 text-text-secondary hover:bg-surface-2'
                    : 'bg-[#24292f] text-white hover:bg-[#1c2026]'
                }`}
              >
                {starred ? (
                  <Check size={13} className="text-[var(--color-success)]" />
                ) : (
                  <Star size={13} className="fill-amber-400 text-amber-400" />
                )}
                {starred ? '已点 Star' : '去 GitHub Star'}
              </button>
              <button
                onClick={() => setStep('feishu')}
                disabled={!starred}
                className={`w-full rounded-[10px] text-[12px] font-medium transition-colors ${
                  starred
                    ? 'h-[40px] bg-[#24292f] text-white hover:bg-[#1c2026]'
                    : 'h-[38px] cursor-not-allowed border border-border text-text-secondary hover:bg-surface-2 disabled:opacity-30'
                }`}
              >
                我已经截图，去进群填问卷
              </button>
            </>
          )}

          {step === 'feishu' && (
            <>
              <p className="mb-4 text-[12px] leading-relaxed text-text-secondary">
                加入飞书群并填写问卷后，我们会联系并发送 Key。拿到 Key 后，将其输入到 nexu Bot
                即可开始体验。
              </p>
              <button
                onClick={() => openExternal(SEEDANCE_TUTORIAL_URL)}
                className="mb-3 inline-flex w-full items-center justify-center gap-1.5 text-[12px] font-medium text-[var(--color-brand-primary)] hover:underline"
              >
                <ArrowUpRight size={12} />
                查看教程：如何在 nexu Bot 中体验 Seedance 2.0
              </button>

              <button
                onClick={() => openExternal(FEISHU_GROUP_URL)}
                className="mb-2.5 flex h-[40px] w-full items-center justify-center gap-2 rounded-[10px] bg-[var(--color-brand-primary)] text-[13px] font-semibold text-white transition-opacity hover:opacity-90"
              >
                <ArrowUpRight size={14} className="shrink-0" />
                点击链接加入飞书群
              </button>
              <button
                onClick={onClose}
                className="h-[36px] w-full rounded-[10px] text-[12px] text-text-muted transition-colors hover:bg-surface-2 hover:text-text-secondary"
              >
                好的，已了解
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
