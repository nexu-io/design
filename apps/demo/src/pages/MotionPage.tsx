import { Button, PageHeader, PageShell, SectionHeader } from "@nexu-design/ui-web";
import { useEffect, useState } from "react";
import NexuLoader, { NexuLoadingScreen } from "../components/NexuLoader";

export default function MotionPage() {
  const [showFullscreen, setShowFullscreen] = useState(false);

  useEffect(() => {
    if (showFullscreen) {
      const timer = setTimeout(() => setShowFullscreen(false), 4000);
      return () => clearTimeout(timer);
    }
  }, [showFullscreen]);

  return (
    <PageShell>
      <NexuLoadingScreen show={showFullscreen} />

      <PageHeader
        title="Motion & Animation"
        description="会呼吸的 UI。分身有状态——在线、思考中、工作中、休息中。界面跟随分身状态微妙变化。"
      />

      <section className="mb-12">
        <SectionHeader
          title="nexu Loader — 品牌加载动效"
          className="mb-4 border-b border-border-subtle pb-2"
        />
        <div className="flex items-end gap-12">
          <div className="text-center">
            <NexuLoader size={96} />
            <div className="text-xs text-text-secondary mt-3">96px — 全屏加载</div>
          </div>
          <div className="text-center">
            <NexuLoader size={64} />
            <div className="text-xs text-text-secondary mt-3">64px — 区域加载</div>
          </div>
          <div className="text-center">
            <NexuLoader size={40} />
            <div className="text-xs text-text-secondary mt-3">40px — 按钮/行内</div>
          </div>
        </div>
        <Button onClick={() => setShowFullscreen(true)} className="mt-6 rounded-lg text-sm">
          预览全屏加载效果（4s 后自动关闭）
        </Button>
      </section>

      <section className="mb-12">
        <SectionHeader
          title="Clone Breath — 分身呼吸"
          className="mb-4 border-b border-border-subtle pb-2"
        />
        <div className="flex items-center gap-8">
          <div className="text-center">
            <div className="w-20 h-20 rounded-full bg-surface-3 animate-clone-breath mx-auto flex items-center justify-center">
              <span className="text-2xl">😊</span>
            </div>
            <div className="text-xs text-text-secondary mt-3">在线 / 活跃</div>
            <div className="text-[11px] text-text-muted">3s 周期，琥珀色光晕脉搏</div>
          </div>
          <div className="text-center">
            <div
              className="w-20 h-20 rounded-full bg-surface-3 mx-auto flex items-center justify-center"
              style={{
                animation: "clone-breath 1.5s ease-in-out infinite",
                boxShadow: "0 0 14px 3px rgba(192,138,37,0.35)",
              }}
            >
              <span className="text-2xl">🤔</span>
            </div>
            <div className="text-xs text-text-secondary mt-3">工作中</div>
            <div className="text-[11px] text-text-muted">1.5s 快脉搏，蓝色</div>
          </div>
          <div className="text-center">
            <div
              className="w-20 h-20 rounded-full bg-surface-3 mx-auto flex items-center justify-center"
              style={{
                animation: "clone-breath 4s ease-in-out infinite",
                boxShadow: "0 0 8px 2px rgba(202,138,4,0.25)",
              }}
            >
              <span className="text-2xl">😅</span>
            </div>
            <div className="text-xs text-text-secondary mt-3">能量不足</div>
            <div className="text-[11px] text-text-muted">4s 慢脉搏，琥珀色</div>
          </div>
          <div className="text-center">
            <div className="w-20 h-20 rounded-full bg-surface-3 mx-auto flex items-center justify-center opacity-50">
              <span className="text-2xl">😴</span>
            </div>
            <div className="text-xs text-text-secondary mt-3">休息中</div>
            <div className="text-[11px] text-text-muted">无光环，半透明</div>
          </div>
          <div className="text-center">
            <div
              className="w-20 h-20 rounded-full bg-surface-3 mx-auto flex items-center justify-center"
              style={{
                boxShadow: "0 0 20px 4px rgba(202,138,4,0.35)",
                animation: "clone-breath 0.8s ease-in-out 3",
              }}
            >
              <span className="text-2xl">🤩</span>
            </div>
            <div className="text-xs text-text-secondary mt-3">成就</div>
            <div className="text-[11px] text-text-muted">金色闪烁（短暂）</div>
          </div>
        </div>
      </section>

      <section className="mb-12">
        <SectionHeader
          title="Thinking Dots — 分身思考"
          className="mb-4 border-b border-border-subtle pb-2"
        />
        <div className="bg-surface-2 border border-border rounded-lg px-5 py-4 inline-flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-surface-3 animate-clone-breath flex items-center justify-center text-sm">
            🤔
          </div>
          <div className="flex gap-1.5">
            <div className="w-2 h-2 rounded-full bg-accent typing-dot" />
            <div className="w-2 h-2 rounded-full bg-accent typing-dot" />
            <div className="w-2 h-2 rounded-full bg-accent typing-dot" />
          </div>
          <span className="text-[13px] text-text-secondary">分身在想……</span>
        </div>
      </section>

      <section className="mb-12">
        <SectionHeader
          title="Message Enter — 消息入场"
          className="mb-4 border-b border-border-subtle pb-2"
        />
        <div className="space-y-3 max-w-md">
          <div
            className="animate-fade-in-up bg-surface-2 border border-border rounded-lg px-4 py-3"
            style={{ animationDelay: "0s" }}
          >
            <div className="text-[13px] text-text-primary">搞定了，你看看效果 ✅</div>
          </div>
          <div
            className="animate-fade-in-up bg-surface-2 border border-border rounded-lg px-4 py-3"
            style={{ animationDelay: "0.3s", opacity: 0 }}
          >
            <div className="text-[13px] text-text-primary">
              方案已经写好了，包含 3 种登录方式的对比。
            </div>
          </div>
          <div
            className="animate-fade-in-up bg-surface-2 border border-border rounded-lg px-4 py-3"
            style={{ animationDelay: "0.6s", opacity: 0 }}
          >
            <div className="text-[13px] text-text-primary">
              推荐方案 A，因为你的用户更看重速度。
            </div>
          </div>
        </div>
        <div className="text-[11px] text-text-muted mt-3">
          8px slideUp + fadeIn, 350ms ease-out, staggered
        </div>
      </section>

      <section className="mb-12">
        <SectionHeader
          title="Energy Drain — 能量消耗"
          className="mb-4 border-b border-border-subtle pb-2"
        />
        <div className="max-w-md space-y-4">
          <div>
            <div className="text-xs text-text-secondary mb-1.5">Smooth color transition</div>
            <div
              className="w-full h-3 rounded-full overflow-hidden"
              style={{
                background:
                  "linear-gradient(to right, #16a34a 0%, #16a34a 40%, #ca8a04 60%, #ea580c 80%, #dc2626 100%)",
              }}
            />
            <div className="flex justify-between mt-1">
              <span className="text-[11px] text-text-muted">100%</span>
              <span className="text-[11px] text-text-muted">0%</span>
            </div>
          </div>
          <div>
            <div className="text-xs text-text-secondary mb-1.5">Critical pulse (below 10%)</div>
            <div className="w-full h-3 bg-surface-4 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full bg-danger animate-energy-pulse"
                style={{ width: "7%" }}
              />
            </div>
          </div>
        </div>
      </section>

      <section className="mb-12">
        <SectionHeader
          title="Float — 落地页元素"
          className="mb-4 border-b border-border-subtle pb-2"
        />
        <div className="flex gap-8 items-center">
          <div className="animate-float">
            <div className="w-16 h-16 rounded-2xl bg-accent-subtle border border-accent flex items-center justify-center text-2xl">
              🧠
            </div>
          </div>
          <div className="animate-float" style={{ animationDelay: "0.5s" }}>
            <div className="w-16 h-16 rounded-2xl bg-success-subtle border border-success flex items-center justify-center text-2xl">
              ✅
            </div>
          </div>
          <div className="animate-float" style={{ animationDelay: "1s" }}>
            <div className="w-16 h-16 rounded-2xl bg-warning-subtle border border-warning flex items-center justify-center text-2xl">
              ⚡
            </div>
          </div>
          <div className="text-xs text-text-muted">3s float cycle, staggered delays</div>
        </div>
      </section>

      <section className="mb-12">
        <SectionHeader
          title="Timing Functions"
          className="mb-4 border-b border-border-subtle pb-2"
        />
        <div className="space-y-3 max-w-lg">
          {[
            { name: "ease-default", fn: "cubic-bezier(0.4, 0, 0.2, 1)", use: "通用" },
            { name: "ease-spring", fn: "cubic-bezier(0.34, 1.56, 0.64, 1)", use: "弹性" },
            { name: "ease-bounce", fn: "cubic-bezier(0.68, -0.55, 0.27, 1.55)", use: "Avatar" },
          ].map((t) => (
            <div
              key={t.name}
              className="flex items-center gap-4 bg-surface-2 border border-border rounded-md p-3"
            >
              <div className="text-xs font-mono text-accent w-28">{t.name}</div>
              <div className="text-[11px] font-mono text-text-tertiary flex-1">{t.fn}</div>
              <div className="text-[11px] text-text-muted w-12 text-right">{t.use}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-12">
        <SectionHeader title="Duration Scale" className="mb-4 border-b border-border-subtle pb-2" />
        <div className="flex gap-3">
          {[
            { name: "fast", ms: 100 },
            { name: "normal", ms: 200 },
            { name: "slow", ms: 350 },
            { name: "enter", ms: 500 },
            { name: "breath", ms: 3000 },
          ].map((d) => (
            <div
              key={d.name}
              className="bg-surface-2 border border-border rounded-md p-3 text-center flex-1"
            >
              <div className="text-xs font-mono text-accent">{d.name}</div>
              <div className="text-lg font-bold text-text-primary">{d.ms}</div>
              <div className="text-[11px] text-text-muted">ms</div>
            </div>
          ))}
        </div>
      </section>
    </PageShell>
  );
}
