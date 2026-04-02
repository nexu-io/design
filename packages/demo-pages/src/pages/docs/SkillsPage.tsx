import { ChevronDown, Sparkles } from "lucide-react";
import Callout from "../../components/docs/Callout";
import { usePageTitle } from "../../hooks/usePageTitle";

const FAQ = [
  {
    q: "安装技能后需要重启 Agent 吗？",
    a: "不需要。技能支持热加载，Agent 会立即识别并启用新安装的技能。",
  },
  {
    q: "可以安装目录以外的技能吗？",
    a: "可以。nexu 支持本地自定义技能开发，满足个性化需求。详见开发者文档。",
  },
  {
    q: "如何卸载技能？",
    a: "进入 Yours 标签，点击对应技能旁的 Uninstall 即可。",
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
        <span className="w-6 h-6 rounded-full bg-accent/10 flex items-center justify-center text-[12px] font-bold text-accent shrink-0">
          {n}
        </span>
        {title}
      </h2>
      {children}
    </section>
  );
}

export default function SkillsPage() {
  usePageTitle("技能安装");

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-[20px] font-semibold text-text-primary flex items-center gap-2">
          <Sparkles size={18} className="text-text-muted" />
          技能安装
        </h1>
        <p className="mt-3 text-[14px] text-text-secondary leading-relaxed max-w-2xl">
          技能扩展了 Agent 的能力边界——从网络搜索、文档生成，到飞书多维表格操作、第三方 API
          调用，应有尽有。安装一个技能只需几秒钟。
        </p>
      </div>

      {/* Step 1 */}
      <Step n={1} title="打开技能页面">
        <p className="text-[13px] text-text-tertiary leading-relaxed">
          在 nexu 客户端左侧导航栏点击 <strong className="text-text-primary">Skills</strong>
          ，进入技能中心。
          <strong className="text-text-primary"> Explore</strong>{" "}
          标签展示所有可安装的公共技能，支持按分类筛选（Office & Collaboration、Files &
          Knowledge、Creative & Design、Business Analysis、Audio & Video 等）或直接搜索关键词。
        </p>
        <DocImg src="/docs/nexu-skills.webp" alt="nexu 技能目录" />
      </Step>

      {/* Step 2 */}
      <Step n={2} title="找到并安装技能">
        <p className="text-[13px] text-text-tertiary leading-relaxed">
          浏览或搜索目标技能，点击卡片上的 <strong className="text-text-primary">Install</strong>{" "}
          按钮。技能支持热加载，安装后无需重启 Agent 即可立即生效。
        </p>
        <DocImg src="/docs/nexu-skills-search.webp" alt="搜索并安装技能" />
      </Step>

      {/* Step 3 */}
      <Step n={3} title="确认安装">
        <p className="text-[13px] text-text-tertiary leading-relaxed">
          切换到 <strong className="text-text-primary">Yours</strong>{" "}
          标签，查看已安装的技能列表，并可通过开关随时启用或禁用单个技能。
        </p>
        <DocImg src="/docs/nexu-skills-installed.webp" alt="已安装的技能" />
      </Step>

      {/* Step 4 */}
      <Step n={4} title="在对话中使用">
        <p className="text-[13px] text-text-tertiary leading-relaxed">
          技能安装后，直接在渠道对话中描述需求即可，Agent 会自动选择合适的技能完成任务。
        </p>
        <DocImg src="/docs/nexu-skills-chat.webp" alt="技能在对话中的使用效果" />
      </Step>

      <Callout variant="tip">
        从 <strong>Office & Collaboration</strong> 或 <strong>Files & Knowledge</strong>{" "}
        分类入手，这些技能覆盖了大多数团队的日常需求。
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
