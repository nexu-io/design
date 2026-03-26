import { Cpu, Settings, KeyRound, ChevronDown } from 'lucide-react';
import { usePageTitle } from '../../hooks/usePageTitle';
import Callout from '../../components/docs/Callout';

const PROVIDERS = [
  { name: 'Anthropic', url: 'https://api.anthropic.com', keyFormat: 'sk-ant-...' },
  { name: 'OpenAI', url: 'https://api.openai.com/v1', keyFormat: 'sk-...' },
  { name: 'Google AI', url: 'https://generativelanguage.googleapis.com/v1beta', keyFormat: 'AIza...' },
  { name: 'xAI', url: 'https://api.x.ai/v1', keyFormat: 'xai-...' },
  { name: 'Custom', url: '你的 OpenAI 兼容端点', keyFormat: '取决于服务商' },
];

const FAQ = [
  {
    q: '刚开始用哪种方式比较好？',
    a: '推荐 nexu Official——登录账号后无需任何配置，即可使用 Claude Sonnet 4.6、Claude Opus 4.6 等高质量模型。',
  },
  {
    q: '可以同时配置多个 BYOK 供应商吗？',
    a: '可以。Anthropic、OpenAI、Google AI 等可以独立配置，随时通过顶部 nexu Bot Model 下拉菜单切换。',
  },
  {
    q: 'API Key 会被上传到 nexu 服务器吗？',
    a: '不会。API Key 仅存储在你的本地设备上，不会传输至 nexu 服务器。',
  },
];

function DocImg({ src, alt }: { src: string; alt: string }) {
  return (
    <div className="mt-4 rounded-xl overflow-hidden border border-border shadow-sm max-w-2xl">
      <img src={src} alt={alt} className="w-full h-auto block" />
    </div>
  );
}

function Step({ n, title, children }: { n: number; title: string; children: React.ReactNode }) {
  return (
    <section className="max-w-2xl">
      <h2 className="text-[16px] font-semibold text-text-primary flex items-center gap-2 mb-3">
        <span className="w-6 h-6 rounded-full bg-accent/10 flex items-center justify-center text-[12px] font-bold text-accent shrink-0">{n}</span>
        {title}
      </h2>
      {children}
    </section>
  );
}

export default function LLMProvidersPage() {
  usePageTitle('模型配置');

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-[20px] font-semibold text-text-primary flex items-center gap-2">
          <Cpu size={18} className="text-text-muted" />
          模型配置
        </h1>
        <p className="mt-3 text-[14px] text-text-secondary leading-relaxed max-w-2xl">
          nexu 支持两种模型接入方式：<strong>nexu Official</strong>（托管模型，登录即用）和 <strong>BYOK</strong>（自带 API Key）。两种方式可随时切换，不影响已有对话和渠道连接。
        </p>
      </div>

      {/* Step 1 */}
      <Step n={1} title="打开 Settings">
        <p className="text-[13px] text-text-tertiary leading-relaxed">
          在 nexu 客户端左侧导航栏点击 <strong className="text-text-primary">Settings</strong>，进入 AI Model Providers 配置页面。
        </p>
        <DocImg src="/docs/nexu-settings-open.webp" alt="打开 Settings 页面" />
      </Step>

      {/* Step 2 */}
      <Step n={2} title="选择接入方式">
        <div className="space-y-6">
          {/* Option A */}
          <div className="p-4 rounded-xl border border-border bg-surface-1">
            <div className="flex items-center gap-2 mb-2">
              <Settings size={14} className="text-accent" />
              <span className="text-[14px] font-semibold text-text-primary">方式 A — nexu Official（推荐）</span>
            </div>
            <p className="text-[13px] text-text-tertiary leading-relaxed">
              在左侧供应商列表中选择 <strong className="text-text-primary">nexu Official</strong>，点击 <strong className="text-text-primary">Sign in to nexu</strong> 完成账号登录。登录后无需配置任何 API Key，Claude Sonnet 4.6、Claude Opus 4.6、Claude Haiku 4.5 等模型立即可用。
            </p>
            <DocImg src="/docs/nexu-models-official.webp" alt="nexu Official 模型配置" />
          </div>

          {/* Option B */}
          <div className="p-4 rounded-xl border border-border bg-surface-1">
            <div className="flex items-center gap-2 mb-2">
              <KeyRound size={14} className="text-text-muted" />
              <span className="text-[14px] font-semibold text-text-primary">方式 B — 自带密钥（BYOK）</span>
            </div>
            <p className="text-[13px] text-text-tertiary leading-relaxed mb-3">
              在左侧供应商列表中选择 <strong className="text-text-primary">Anthropic</strong>、<strong className="text-text-primary">OpenAI</strong>、<strong className="text-text-primary">Google AI</strong> 或其他供应商：
            </p>
            <ol className="space-y-1.5 text-[13px] text-text-tertiary">
              <li className="flex items-start gap-2"><span className="font-bold text-accent shrink-0">1.</span>在 <strong className="text-text-primary">API Key</strong> 字段粘贴你的密钥。</li>
              <li className="flex items-start gap-2"><span className="font-bold text-accent shrink-0">2.</span>如需自定义代理，修改 <strong className="text-text-primary">API Proxy URL</strong>。</li>
              <li className="flex items-start gap-2"><span className="font-bold text-accent shrink-0">3.</span>点击 <strong className="text-text-primary">Save</strong>，nexu 会自动验证密钥并加载可用模型列表。</li>
            </ol>
            <DocImg src="/docs/nexu-models-byok.webp" alt="BYOK 自带密钥配置" />
          </div>
        </div>
      </Step>

      {/* Step 3 */}
      <Step n={3} title="选择当前模型">
        <p className="text-[13px] text-text-tertiary leading-relaxed">
          连接成功后，在 Settings 页面顶部 <strong className="text-text-primary">nexu Bot Model</strong> 下拉菜单中选择 Agent 使用的模型，支持跨供应商随时切换。
        </p>
        <DocImg src="/docs/nexu-model-select.webp" alt="选择当前模型" />
      </Step>

      {/* Providers table */}
      <section className="max-w-2xl">
        <h2 className="text-[16px] font-semibold text-text-primary mb-3">支持的供应商</h2>
        <div className="rounded-xl border border-border overflow-hidden">
          <table className="w-full text-[13px]">
            <thead>
              <tr className="bg-surface-1 border-b border-border">
                <th className="text-left px-4 py-2.5 font-medium text-text-secondary">供应商</th>
                <th className="text-left px-4 py-2.5 font-medium text-text-secondary">默认 Base URL</th>
                <th className="text-left px-4 py-2.5 font-medium text-text-secondary">密钥格式</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {PROVIDERS.map(p => (
                <tr key={p.name} className="bg-surface-0">
                  <td className="px-4 py-2.5 font-medium text-text-primary">{p.name}</td>
                  <td className="px-4 py-2.5 text-text-tertiary font-mono text-[12px]">{p.url}</td>
                  <td className="px-4 py-2.5 text-text-tertiary font-mono text-[12px]">{p.keyFormat}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <Callout variant="info">
        添加 BYOK 供应商时，先点击 <strong>Verify Connection</strong> 验证连通性，再保存，确保 nexu 能正确加载可用模型列表。
      </Callout>

      {/* FAQ */}
      <section className="max-w-2xl">
        <h2 className="text-[16px] font-semibold text-text-primary mb-4 flex items-center gap-2">
          <ChevronDown size={16} className="text-text-muted" />
          常见问题
        </h2>
        <div className="space-y-4">
          {FAQ.map(({ q, a }) => (
            <div key={q}>
              <div className="text-[14px] font-semibold text-text-primary mb-1">{q}</div>
              <div className="text-[13px] text-text-tertiary leading-relaxed">{a}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
