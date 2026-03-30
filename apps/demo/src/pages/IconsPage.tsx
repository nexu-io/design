import { PageHeader, PageShell, SectionHeader } from "@nexu-design/ui-web";

const FIGMA_ICON_LIBRARY = {
  name: "✕ Untitled UI Icons – 1-100 essential (Figma icons, Community)",
  url: "https://www.figma.com/design/nVKpObpC2UXEaXHCfdeKIk/%E2%9D%96-Untitled-UI-Icons-%E2%80%93-1-100--essential-Figma-icons--Community-?node-id=181-128951&t=6oiFqgbkpteDwoQZ-1",
};

export default function IconsPage() {
  return (
    <PageShell>
      <PageHeader
        title="Icons"
        description="设计稿图标来自 Figma Community 免费库 Untitled UI Icons（1–100 essential）。开发实现可用 Lucide/Heroicons 对齐语义与风格。"
      />

      <section className="mb-12">
        <SectionHeader
          title="Figma 图标库（设计权威来源）"
          className="mb-4 border-b border-border-subtle pb-2"
        />
        <div className="bg-surface-2 rounded-lg border border-border p-6">
          <div className="font-medium text-text-primary mb-1">{FIGMA_ICON_LIBRARY.name}</div>
          <a
            href={FIGMA_ICON_LIBRARY.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-accent hover:underline break-all"
          >
            {FIGMA_ICON_LIBRARY.url}
          </a>
          <p className="mt-3 text-[13px] text-text-secondary">
            设计侧在 Figma 中统一使用该库；新增图标时优先从此库选取并注明名称/节点，便于与开发对齐。
          </p>
        </div>
      </section>

      <section className="mb-12">
        <SectionHeader title="使用规范" className="mb-4 border-b border-border-subtle pb-2" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="rounded-lg border border-border p-4">
            <div className="text-xs font-semibold text-text-primary mb-2">尺寸</div>
            <ul className="text-[13px] text-text-secondary space-y-1">
              <li>导航/列表：16×16 px</li>
              <li>按钮内：16×20 px</li>
              <li>强调/空状态：24×24 或 32×32</li>
            </ul>
          </div>
          <div className="rounded-lg border border-border p-4">
            <div className="text-xs font-semibold text-text-primary mb-2">颜色 (Token)</div>
            <ul className="text-[13px] text-text-secondary space-y-1">
              <li>默认：text-secondary / text-primary</li>
              <li>悬停：text-primary / accent</li>
              <li>禁用：text-muted</li>
              <li>强调：accent / clone</li>
            </ul>
          </div>
          <div className="rounded-lg border border-border p-4">
            <div className="text-xs font-semibold text-text-primary mb-2">风格</div>
            <ul className="text-[13px] text-text-secondary space-y-1">
              <li>线型 (outline) 或面型 (solid) 按组件统一</li>
              <li>线宽与 Figma 库一致（如 1.5–2px）</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="mb-12">
        <SectionHeader title="设计 ↔ 开发" className="mb-4 border-b border-border-subtle pb-2" />
        <p className="text-sm text-text-secondary mb-2">
          Figma 使用本库；代码中可用 <strong className="text-text-primary">Lucide React</strong> 或{" "}
          <strong className="text-text-primary">Heroicons</strong> 实现，以同语义、同尺寸、颜色用
          design token 为准。
        </p>
        <p className="text-[13px] text-text-tertiary">
          完整说明见{" "}
          <code className="px-1.5 py-0.5 rounded bg-surface-3 font-mono text-[12px]">
            design-system/docs/ICON-LIBRARY.md
          </code>
          。
        </p>
      </section>
    </PageShell>
  );
}
