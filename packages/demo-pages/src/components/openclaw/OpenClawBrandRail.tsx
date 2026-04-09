import { BrandRail, GitHubIcon, NexuLogoIcon, NexuMarkIcon } from "@nexu-design/ui-web";
import { ArrowRight, Infinity as InfinityIcon, Shield, Sparkles } from "lucide-react";
import type { ReactNode } from "react";
import { useGitHubStars } from "../../hooks/useGitHubStars";
import { useLocale } from "../../hooks/useLocale";

const GITHUB_URL = "https://github.com/refly-ai/nexu";

function FadeIn({
  children,
  delay = 0,
  className = "",
}: { children: ReactNode; delay?: number; className?: string }) {
  return (
    <div
      className={`animate-fade-in-up ${className}`}
      style={{ animationDelay: `${delay}ms`, animationFillMode: "both" }}
    >
      {children}
    </div>
  );
}

export default function OpenClawBrandRail({
  topRight,
  onLogoClick,
}: {
  topRight?: ReactNode;
  onLogoClick: () => void;
}) {
  const { stars } = useGitHubStars();
  const { t } = useLocale();
  const bullets = [
    { icon: Sparkles, text: t("brand.bullet.openclaw") },
    { icon: Shield, text: t("brand.bullet.feishu") },
    { icon: InfinityIcon, text: t("brand.bullet.models") },
  ];

  return (
    <BrandRail
      logo={<NexuLogoIcon size={32} className="text-white xl:size-9" />}
      logoLabel="OpenClaw home"
      onLogoClick={onLogoClick}
      topRight={<FadeIn delay={80}>{topRight ?? <div />}</FadeIn>}
      background={
        <>
          <div className="absolute inset-0 bg-[radial-gradient(120%_120%_at_18%_18%,rgba(255,255,255,0.08),transparent_36%),radial-gradient(80%_80%_at_82%_22%,rgba(180,150,255,0.14),transparent_36%),linear-gradient(180deg,var(--color-dark-bg)_0%,#0a0a0d_100%)]" />
          <div className="absolute -right-20 bottom-0 opacity-[0.05]">
            <NexuMarkIcon size={360} className="text-white" />
          </div>
        </>
      }
      title={
        <FadeIn delay={220}>
          <h1
            className="max-w-[560px] text-[40px] leading-[0.96] tracking-tight text-white sm:text-[52px] lg:text-[64px]"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            {t("brand.title.line1")}
            <br />
            {t("brand.title.line2")}
          </h1>
        </FadeIn>
      }
      description={
        <FadeIn delay={300}>
          <span>{t("brand.body")}</span>
        </FadeIn>
      }
      footer={
        <FadeIn delay={520}>
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-3 rounded-[var(--radius-24)] border border-dark-border bg-dark-surface/92 px-5 py-4 text-[13px] font-medium text-white/82 shadow-dropdown-dark transition-all hover:border-white/12 hover:bg-white/[0.06] hover:text-white"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-[var(--radius-16)] border border-white/6 bg-white/[0.05] text-white">
              <GitHubIcon size={18} />
            </div>
            <span>{t("brand.github")}</span>
            {stars && stars > 0 && (
              <span className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-black/20 px-2.5 py-1 text-[11px] leading-none text-white/82">
                <svg
                  width="11"
                  height="11"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="text-warning"
                  aria-hidden="true"
                  focusable="false"
                >
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
                {stars.toLocaleString()}
              </span>
            )}
            <ArrowRight
              size={15}
              className="opacity-65 transition-transform group-hover:translate-x-0.5"
            />
          </a>
        </FadeIn>
      }
    >
      <div className="space-y-3">
        {bullets.map((item, index) => (
          <FadeIn key={item.text} delay={380 + index * 80}>
            <div className="grid min-h-[72px] grid-cols-[40px_1fr] items-center gap-4 rounded-[var(--radius-16)] border border-dark-border bg-white/[0.025] px-5 py-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-[var(--radius-12)] bg-white/[0.06]">
                <item.icon size={15} className="text-white/66" />
              </div>
              <p className="text-[13px] leading-[1.6] text-white/58">{item.text}</p>
            </div>
          </FadeIn>
        ))}
      </div>
    </BrandRail>
  );
}
