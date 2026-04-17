import { AlertCircle, CheckCircle, Settings, X } from "lucide-react";
import type { ChannelId } from "./ChannelsView";
import { ONBOARDING_CHANNELS } from "./channelSetup";

type Props = {
  checkingUpdate: boolean;
  showUpToDate: boolean;
  setShowUpToDate: (v: boolean) => void;
  t: (key: string) => string;
  mockVersion: string;
  showDemoPanel: boolean;
  setShowDemoPanel: (v: boolean) => void;
  demoLoggedIn: boolean;
  setDemoLoggedIn: (v: boolean) => void;
  demoPlan: "free" | "plus" | "pro";
  setDemoPlan: (v: "free" | "plus" | "pro") => void;
  demoBudgetStatus: "healthy" | "warning" | "depleted";
  setDemoBudgetStatus: (v: "healthy" | "warning" | "depleted") => void;
  demoCreditPack: "none" | "2000" | "5200" | "11000" | "55000";
  setDemoCreditPack: (v: "none" | "2000" | "5200" | "11000" | "55000") => void;
  setStarModalStep: (v: "prompt" | "confirm") => void;
  setShowStarModal: (v: boolean) => void;
  setShowSeedanceModal: (v: boolean) => void;
  toast: { message: string; type: "success" | "error" } | null;
  connectedChannels: Set<ChannelId>;
  setConnectedChannels: (v: Set<ChannelId>) => void;
};

export function WorkspaceUtilityOverlays({
  checkingUpdate,
  showUpToDate,
  setShowUpToDate,
  t,
  mockVersion,
  showDemoPanel,
  setShowDemoPanel,
  demoLoggedIn,
  setDemoLoggedIn,
  demoPlan,
  setDemoPlan,
  demoBudgetStatus,
  setDemoBudgetStatus,
  demoCreditPack,
  setDemoCreditPack,
  setStarModalStep: _setStarModalStep,
  setShowStarModal: _setShowStarModal,
  setShowSeedanceModal: _setShowSeedanceModal,
  toast,
  connectedChannels,
  setConnectedChannels,
}: Props) {
  return (
    <>
      {(checkingUpdate || showUpToDate) && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center"
          style={{
            background: "transparent",
            pointerEvents: "none",
            animation: "fadeIn 150ms ease-out",
          }}
          onClick={showUpToDate ? () => setShowUpToDate(false) : undefined}
        >
          <div
            className="flex flex-col items-center w-[260px] px-6 py-6 rounded-[14px] bg-surface-1 text-center"
            style={{
              pointerEvents: "auto",
              boxShadow: "0 24px 48px rgba(0,0,0,0.18), 0 0 0 1px rgba(0,0,0,0.06)",
              animation: "scaleIn 200ms cubic-bezier(0.16,1,0.3,1)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-center w-11 h-11 mb-3.5 rounded-[10px] bg-[#f5f5f5]">
              <img
                src="/brand/logo-black-1.svg"
                alt="nexu"
                className="w-[26px] h-[26px] object-contain"
              />
            </div>

            <h2 className="text-[14px] font-semibold text-[#1c1f23] mb-1">
              {checkingUpdate ? t("ws.update.checking") : t("ws.update.upToDate")}
            </h2>

            {showUpToDate && (
              <p className="text-[12px] text-[#6b7280] leading-[1.4] mb-4">
                {t("ws.update.upToDateSub").replace("{{version}}", mockVersion)}
              </p>
            )}

            {checkingUpdate && (
              <div className="w-full mt-1 mb-2">
                <div className="h-1 w-full rounded-full bg-[rgba(0,0,0,0.06)] overflow-hidden">
                  <div
                    className="h-full w-[35%] rounded-full"
                    style={{
                      background: "#1c1f23",
                      animation: "indeterminateSlide 1.4s ease-in-out infinite",
                    }}
                  />
                </div>
              </div>
            )}

            {showUpToDate && (
              <button
                onClick={() => setShowUpToDate(false)}
                className="w-full py-[7px] rounded-lg bg-[#3478f6] text-white text-[13px] font-medium hover:bg-[#2563eb] transition-colors border-none cursor-pointer mt-1"
                type="button"
              >
                OK
              </button>
            )}
          </div>
        </div>
      )}

      <div
        className="fixed bottom-4 right-4 z-[9999]"
        style={{ WebkitAppRegion: "no-drag" } as React.CSSProperties}
      >
        {showDemoPanel ? (
          <div className="w-[220px] rounded-[14px] border border-border bg-surface-1 shadow-[var(--shadow-dropdown)] overflow-hidden">
            <div className="flex items-center justify-between px-3.5 py-2.5 border-b border-border bg-surface-2">
              <span className="text-[11px] font-semibold text-text-secondary uppercase tracking-wide">
                Demo Controls
              </span>
              <button
                onClick={() => setShowDemoPanel(false)}
                className="text-text-muted hover:text-text-primary transition-colors"
              >
                <X size={13} />
              </button>
            </div>
            <div className="px-3.5 py-3 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[12px] text-text-secondary">登录状态</span>
                <button
                  onClick={() => setDemoLoggedIn(!demoLoggedIn)}
                  className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${demoLoggedIn ? "bg-[var(--color-brand-primary)]" : "bg-border"}`}
                >
                  <span
                    className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition-transform ${demoLoggedIn ? "translate-x-4" : "translate-x-0.5"}`}
                  />
                </button>
              </div>
              <div>
                <div className="text-[11px] text-text-muted mb-1.5">套餐</div>
                <div className="grid grid-cols-2 gap-1">
                  {(["free", "plus", "pro"] as const).map((p) => (
                    <button
                      key={p}
                      onClick={() => setDemoPlan(p)}
                      className={`py-1 rounded-lg text-[12px] font-medium transition-colors capitalize ${demoPlan === p ? "bg-[var(--color-brand-primary)] text-white" : "bg-surface-2 text-text-secondary hover:bg-surface-0"}`}
                    >
                      {p.charAt(0).toUpperCase() + p.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <div className="text-[11px] text-text-muted mb-1.5">额度状态</div>
                <div className="grid grid-cols-3 gap-1">
                  {[
                    { key: "healthy", label: "充足", color: "var(--color-success)" },
                    { key: "warning", label: "预警", color: "var(--color-warning)" },
                    { key: "depleted", label: "耗尽", color: "var(--color-danger)" },
                  ].map(({ key, label, color }) => (
                    <button
                      key={key}
                      onClick={() => setDemoBudgetStatus(key as "healthy" | "warning" | "depleted")}
                      className={`py-1 rounded-lg text-[12px] font-medium transition-colors ${demoBudgetStatus === key ? "text-white" : "bg-surface-2 text-text-secondary hover:bg-surface-0"}`}
                      style={demoBudgetStatus === key ? { background: color } : {}}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <div className="text-[11px] text-text-muted mb-1.5">积分包</div>
                <div className="grid grid-cols-2 gap-1">
                  {(["none", "2000", "5200", "11000", "55000"] as const).map((key) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setDemoCreditPack(key)}
                      className={`py-1 rounded-md text-[12px] font-medium transition-colors ${demoCreditPack === key ? "bg-text-primary text-white" : "bg-surface-2 text-text-secondary hover:bg-surface-0"}`}
                    >
                      {key === "none" ? "无" : `${Number(key).toLocaleString()}`}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div className="text-[11px] text-text-muted mb-1.5">Channel 连接</div>
                <div className="space-y-1">
                  {ONBOARDING_CHANNELS.map((ch) => {
                    const on = connectedChannels.has(ch.id as ChannelId);
                    return (
                      <button
                        key={ch.id}
                        type="button"
                        onClick={() => {
                          const next = new Set(connectedChannels);
                          if (on) next.delete(ch.id as ChannelId);
                          else next.add(ch.id as ChannelId);
                          setConnectedChannels(next);
                        }}
                        className="flex w-full items-center gap-2 rounded-md px-1.5 py-1 hover:bg-surface-2 transition-colors"
                      >
                        <span className="flex h-5 w-5 shrink-0 items-center justify-center">
                          <ch.icon size={14} />
                        </span>
                        <span className="flex-1 text-[11px] text-text-secondary text-left">
                          {ch.shortName}
                        </span>
                        <span
                          className={`relative inline-flex h-[16px] w-[28px] shrink-0 items-center rounded-full transition-colors ${on ? "bg-[var(--color-brand-primary)]" : "bg-border"}`}
                        >
                          <span
                            className={`inline-block h-3 w-3 transform rounded-full bg-white shadow transition-transform ${on ? "translate-x-3.5" : "translate-x-0.5"}`}
                          />
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setShowDemoPanel(true)}
            className="w-8 h-8 rounded-full bg-surface-1 border border-border shadow-[var(--shadow-card)] flex items-center justify-center text-text-muted hover:text-text-primary hover:shadow-[var(--shadow-dropdown)] transition-all"
            title="Demo Controls"
          >
            <Settings size={14} />
          </button>
        )}
      </div>

      {toast && (
        <div
          className="fixed bottom-6 left-1/2 z-[300] -translate-x-1/2 flex items-center gap-2 px-4 py-2.5 rounded-[10px] text-[13px] font-medium shadow-[0_8px_32px_rgba(0,0,0,0.18),0_0_0_1px_rgba(0,0,0,0.06)]"
          style={{
            background: toast.type === "success" ? "var(--color-success)" : "var(--color-danger)",
            color: "#fff",
            animation: "scaleIn 200ms cubic-bezier(0.16,1,0.3,1)",
          }}
        >
          {toast.type === "success" ? <CheckCircle size={15} /> : <AlertCircle size={15} />}
          {toast.message}
        </div>
      )}
    </>
  );
}
