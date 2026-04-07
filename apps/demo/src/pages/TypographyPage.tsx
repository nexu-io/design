import { PageHeader, PageShell } from "@nexu-design/ui-web";

import { SectionHeader } from "@nexu-design/ui-web";

export default function TypographyPage() {
  return (
    <PageShell>
      <PageHeader
        title="Typography"
        description="Inter + Noto Sans SC, 基于 4px 模块化缩放的字号阶梯。IM 消息 13px，落地页正文 14px。"
      />

      <section className="mb-12">
        <SectionHeader title="Font Family" className="mb-4 border-b border-border-subtle pb-2" />
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-surface-2 border border-border rounded-lg p-5">
            <div className="text-xl font-semibold text-text-primary mb-2 font-sans">
              Inter — The quick brown fox
            </div>
            <div className="text-sm text-text-secondary font-sans">
              你好世界 — Noto Sans SC fallback
            </div>
            <div className="text-[11px] text-text-muted mt-3 font-mono">--font-sans</div>
          </div>
          <div className="bg-surface-2 border border-border rounded-lg p-5">
            <div className="text-xl font-semibold text-text-primary mb-2 font-mono">
              JetBrains Mono — 0O1lI
            </div>
            <div className="text-sm text-text-secondary font-mono">const x = 42;</div>
            <div className="text-[11px] text-text-muted mt-3 font-mono">--font-mono</div>
          </div>
        </div>
      </section>

      <section className="mb-12">
        <SectionHeader title="Type Scale" className="mb-4 border-b border-border-subtle pb-2" />
        <div className="space-y-0">
          {[
            { name: "Hero", size: "48px", lh: "56px", weight: "700", sample: "你的 AI 分身" },
            { name: "H1", size: "32px", lh: "40px", weight: "700", sample: "数字分身设计系统" },
            { name: "H2", size: "24px", lh: "32px", weight: "600", sample: "品牌色 — 分身紫" },
            { name: "H3", size: "20px", lh: "28px", weight: "600", sample: "每日摘要卡片" },
            {
              name: "H4",
              size: "16px",
              lh: "24px",
              weight: "600",
              sample: "你的分身掌握了 5 项技能",
            },
            {
              name: "Body",
              size: "14px",
              lh: "22px",
              weight: "400",
              sample: "分身记住了你的每一个想法、决策、偏好。用了 3 个月，它比你更记得你做过的事。",
            },
            {
              name: "SM (IM)",
              size: "13px",
              lh: "20px",
              weight: "400",
              sample: "搞定了，你看看效果。我已经帮你连接了飞书日历和待办。",
            },
            {
              name: "XS",
              size: "12px",
              lh: "18px",
              weight: "400",
              sample: "2 月 20 日 · 来自飞书对话",
            },
            {
              name: "XXS",
              size: "11px",
              lh: "16px",
              weight: "500",
              sample: "专业版 · 在线 · 5 项技能",
            },
          ].map((t) => (
            <div
              key={t.name}
              className="flex items-baseline gap-6 py-4 border-b border-border-subtle"
            >
              <div className="w-16 shrink-0">
                <div className="text-[11px] font-mono text-accent">{t.name}</div>
                <div className="text-[11px] text-text-muted">{t.size}</div>
              </div>
              <div
                className="flex-1"
                style={{ fontSize: t.size, lineHeight: t.lh, fontWeight: t.weight }}
              >
                {t.sample}
              </div>
              <div className="w-32 shrink-0 text-right">
                <div className="text-[11px] text-text-tertiary">LH: {t.lh}</div>
                <div className="text-[11px] text-text-tertiary">W: {t.weight}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-12">
        <SectionHeader title="Font Weight" className="mb-4 border-b border-border-subtle pb-2" />
        <div className="grid grid-cols-4 gap-4">
          {[
            { weight: 400, name: "Regular", use: "正文、描述" },
            { weight: 500, name: "Medium", use: "标签、按钮" },
            { weight: 600, name: "Semibold", use: "标题、强调" },
            { weight: 700, name: "Bold", use: "Hero、大号数字" },
          ].map((w) => (
            <div key={w.weight} className="bg-surface-2 border border-border rounded-lg p-4">
              <div className="text-2xl text-text-primary mb-2" style={{ fontWeight: w.weight }}>
                Aa 你好
              </div>
              <div className="text-xs text-text-secondary">
                {w.name} — {w.weight}
              </div>
              <div className="text-[11px] text-text-muted">{w.use}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-12">
        <SectionHeader
          title="Spacing Scale (4px base)"
          className="mb-4 border-b border-border-subtle pb-2"
        />
        <div className="space-y-2">
          {[
            { name: "space-1", px: 4 },
            { name: "space-2", px: 8 },
            { name: "space-3", px: 12 },
            { name: "space-4", px: 16 },
            { name: "space-5", px: 20 },
            { name: "space-6", px: 24 },
            { name: "space-8", px: 32 },
            { name: "space-10", px: 40 },
            { name: "space-12", px: 48 },
            { name: "space-16", px: 64 },
          ].map((s) => (
            <div key={s.name} className="flex items-center gap-4">
              <div className="w-24 text-[11px] font-mono text-text-tertiary">{s.name}</div>
              <div className="h-3 rounded-sm bg-accent" style={{ width: s.px }} />
              <div className="text-[11px] text-text-muted">{s.px}px</div>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-12">
        <SectionHeader title="Border Radius" className="mb-4 border-b border-border-subtle pb-2" />
        <div className="flex gap-4">
          {[
            { name: "xs", px: 4 },
            { name: "sm", px: 6 },
            { name: "md", px: 8 },
            { name: "lg", px: 12 },
            { name: "xl", px: 16 },
            { name: "full", px: 9999 },
          ].map((r) => (
            <div key={r.name} className="text-center">
              <div
                className="w-16 h-16 bg-surface-3 border border-border mx-auto"
                style={{ borderRadius: r.px }}
              />
              <div className="text-[11px] text-text-secondary mt-2">{r.name}</div>
              <div className="text-[11px] text-text-muted">
                {r.px === 9999 ? "9999px" : `${r.px}px`}
              </div>
            </div>
          ))}
        </div>
      </section>
    </PageShell>
  );
}
