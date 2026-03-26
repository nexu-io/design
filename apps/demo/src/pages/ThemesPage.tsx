import { Link } from 'react-router-dom'
import { PageShell, PageHeader, Section } from '../components/Section'

const THEMES = [
  {
    id: 'default',
    name: '默认 (nexu)',
    desc: 'nexu 产品与 Design System 默认主题。暖白背景、黑色主交互色、分身琥珀色，Cursor/Linear 风格，偏沉稳与产品感。',
    surface: '#fdfcfa',
    accent: '#1a1a1a',
    clone: '#c08a25',
    use: 'nexu 官网、产品内页、BP/落地页、对外品牌一致场景。',
  },
  {
    id: 'online',
    name: '线上版本 (Refly AI)',
    desc: '从 Refly AI 工作流/Dashboard 界面提取的 light theme。白底、绿色主色、橙色次要强调，偏轻量、工具型产品。',
    surface: '#ffffff',
    accent: '#1eab60',
    clone: '#1eab60',
    use: 'Refly 线上工作流、模板市场、Dashboard 等与现有 Refly AI 一致的场景。',
  },
]

export default function ThemesPage() {
  return (
    <PageShell>
      <PageHeader
        title="Themes — 主题"
        description="设计系统支持多套主题。在侧栏底部切换「默认」/「线上」可实时预览；Colors、Components 等页会随当前主题变化。"
      />

      <Section title="主题列表">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {THEMES.map((t) => (
            <div
              key={t.id}
              className="rounded-xl border border-border bg-surface-1 overflow-hidden"
            >
              <div className="flex gap-3 p-4">
                <div
                  className="w-12 h-12 rounded-lg shrink-0 border border-border"
                  style={{ backgroundColor: t.surface }}
                />
                <div className="w-12 h-12 rounded-lg shrink-0 border border-border" style={{ backgroundColor: t.accent }} />
                <div className="w-12 h-12 rounded-lg shrink-0 border border-border" style={{ backgroundColor: t.clone }} />
              </div>
              <div className="px-4 pb-4">
                <div className="font-semibold text-text-primary">{t.name}</div>
                <p className="mt-1 text-[13px] text-text-secondary leading-relaxed">{t.desc}</p>
                <p className="mt-2 text-[12px] text-text-tertiary">
                  <span className="font-medium text-text-secondary">适用：</span>
                  {t.use}
                </p>
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section title="如何切换主题">
        <div className="bg-surface-2 rounded-lg border border-border p-6">
          <p className="text-sm text-text-secondary mb-4">
            在左侧边栏<strong className="text-text-primary">底部</strong>有两个按钮：「默认」「线上」。点击即可切换当前主题；选择会写入本地存储，刷新后保持。
          </p>
          <p className="text-[13px] text-text-tertiary">
            技术实现：线上版本通过 <code className="px-1.5 py-0.5 rounded bg-surface-3 font-mono text-[12px]">data-theme=&quot;online&quot;</code> 作用于{' '}
            <code className="px-1.5 py-0.5 rounded bg-surface-3 font-mono text-[12px]">&lt;html&gt;</code>，覆盖{' '}
            <code className="px-1.5 py-0.5 rounded bg-surface-3 font-mono text-[12px]">--color-*</code> 等 CSS 变量。所有使用 token 的组件会自动跟随当前主题。
          </p>
        </div>
      </Section>

      <Section title="文档">
        <ul className="space-y-2 text-sm text-text-secondary">
          <li>
            <Link to="/colors" className="text-accent hover:underline">Colors</Link> — 默认主题色板参考；线上版本完整色板见 DESIGN-SYSTEM-ONLINE.md
          </li>
          <li>
            <Link to="/components" className="text-accent hover:underline">Components</Link> — 使用 token 的组件会随侧栏主题切换而变化
          </li>
          <li>
            <span className="text-text-tertiary">DESIGN-SYSTEM-ONLINE.md</span> — 线上版本完整规范（色彩、圆角、组件约定）
          </li>
        </ul>
      </Section>
    </PageShell>
  )
}
