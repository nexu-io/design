import { AlertCircle, Check, Loader2, RefreshCw, Star } from "lucide-react";
import { useState } from "react";

export function StarModal({
  step,
  onStar,
  onConfirm,
  onSkip,
}: {
  step: "prompt" | "confirm";
  onStar: () => void;
  onConfirm: () => void;
  onSkip: () => void;
}) {
  const [verifying, setVerifying] = useState(false);
  const [verifyResult, setVerifyResult] = useState<"idle" | "success" | "fail">("idle");

  const handleVerify = () => {
    setVerifying(true);
    setVerifyResult("idle");
    setTimeout(() => {
      const passed = Math.random() < 0.7;
      setVerifying(false);
      if (passed) {
        setVerifyResult("success");
        onConfirm();
      } else {
        setVerifyResult("fail");
      }
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-[3px]"
        onClick={verifying ? undefined : onSkip}
      />
      <div
        className="relative mx-4 w-full max-w-[360px] overflow-hidden rounded-2xl border border-border bg-surface-1 shadow-[0_24px_64px_rgba(0,0,0,0.22),0_0_0_1px_rgba(0,0,0,0.06)]"
        style={{ animation: "scaleIn 220ms cubic-bezier(0.16,1,0.3,1)" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 pb-5 pt-6">
          {step === "prompt" ? (
            <>
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-[14px] border border-amber-200/60 bg-amber-50">
                <Star size={24} className="fill-amber-400 text-amber-500" />
              </div>
              <h2 className="mb-1.5 text-center text-[15px] font-bold text-text-primary">
                🎉 Channel 连接成功！
              </h2>
              <p className="mb-1 text-center text-[13px] leading-relaxed text-text-secondary">
                如果 nexu 对你有帮助，给我们一个 GitHub Star 吧
              </p>
              <p className="mb-4 text-center text-[12px] leading-relaxed text-text-muted">
                Star 后可领取 <span className="font-semibold text-amber-500">+300 积分</span>
                奖励，用于调用 AI 模型
              </p>
              <div className="mb-5 flex items-center justify-center gap-1.5">
                <div className="inline-flex items-center gap-1.5 rounded-full border border-amber-200/60 bg-amber-50 px-3 py-1.5">
                  <Star size={12} className="fill-amber-400 text-amber-500" />
                  <span className="text-[12px] font-semibold leading-none tabular-nums text-amber-600">
                    +300 积分
                  </span>
                </div>
              </div>
              <button
                onClick={onStar}
                className="mb-2.5 flex h-[40px] w-full items-center justify-center gap-2 rounded-[10px] bg-[#24292f] text-[13px] font-semibold text-white transition-colors hover:bg-[#1c2026]"
              >
                <Star size={14} className="fill-amber-400 text-amber-400" />去 GitHub Star
              </button>
              <button
                onClick={onSkip}
                className="h-[36px] w-full rounded-[10px] text-[12px] text-text-muted transition-colors hover:bg-surface-2 hover:text-text-secondary"
              >
                稍后再说
              </button>
            </>
          ) : (
            <>
              {verifying ? (
                <>
                  <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-[14px] bg-surface-2">
                    <Loader2 size={22} className="animate-spin text-text-muted" />
                  </div>
                  <h2 className="mb-1.5 text-center text-[15px] font-bold text-text-primary">
                    正在验证…
                  </h2>
                  <p className="mb-2 text-center text-[12px] leading-relaxed text-text-muted">
                    正在检查你的 GitHub Star 状态，请稍候
                  </p>
                </>
              ) : verifyResult === "fail" ? (
                <>
                  <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-[14px] border border-[var(--color-danger)]/20 bg-[var(--color-danger)]/10">
                    <AlertCircle size={24} className="text-[var(--color-danger)]" />
                  </div>
                  <h2 className="mb-1.5 text-center text-[15px] font-bold text-text-primary">
                    未检测到 Star
                  </h2>
                  <p className="mb-1 text-center text-[12px] leading-relaxed text-text-secondary">
                    抱歉，暂未检测到你对该仓库的 Star 操作，无法发放奖励。
                  </p>
                  <p className="mb-4 text-center text-[12px] leading-relaxed text-text-muted">
                    你也可以通过左下角「奖励」入口，在社交平台分享领取更多积分。
                  </p>
                  <div className="flex items-center gap-2.5">
                    <button
                      onClick={onSkip}
                      className="h-[38px] flex-1 rounded-[10px] border border-border text-[12px] font-medium text-text-secondary transition-colors hover:bg-surface-2"
                    >
                      关闭
                    </button>
                    <button
                      onClick={handleVerify}
                      className="flex h-[38px] flex-1 items-center justify-center gap-1.5 rounded-[10px] bg-[#24292f] text-[12px] font-semibold text-white transition-colors hover:bg-[#1c2026]"
                    >
                      <RefreshCw size={12} />
                      重新检测
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-[14px] border border-[var(--color-success)]/20 bg-[var(--color-success)]/10">
                    <Check size={24} className="text-[var(--color-success)]" />
                  </div>
                  <h2 className="mb-1.5 text-center text-[15px] font-bold text-text-primary">
                    已经 Star 了吗？
                  </h2>
                  <p className="mb-4 text-center text-[12px] leading-relaxed text-text-secondary">
                    确认后我们将为你发放{" "}
                    <span className="font-semibold text-[var(--color-success)]">+300 积分</span>
                  </p>
                  <div className="flex items-center gap-2.5">
                    <button
                      onClick={onSkip}
                      className="h-[38px] flex-1 rounded-[10px] border border-border text-[12px] font-medium text-text-secondary transition-colors hover:bg-surface-2"
                    >
                      还没有
                    </button>
                    <button
                      onClick={handleVerify}
                      className="h-[38px] flex-1 rounded-[10px] bg-[var(--color-success)] text-[12px] font-semibold text-white transition-opacity hover:opacity-90"
                    >
                      已完成，领取积分
                    </button>
                  </div>
                </>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
