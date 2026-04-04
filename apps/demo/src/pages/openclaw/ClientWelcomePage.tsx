import { ArrowRight, KeyRound, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useLocale } from "../../hooks/useLocale";
import { usePageTitle } from "../../hooks/usePageTitle";

function FadeIn({
  children,
  delay = 0,
  className = "",
}: { children: React.ReactNode; delay?: number; className?: string }) {
  return (
    <div
      className={`animate-fade-in-up ${className}`}
      style={{ animationDelay: `${delay}ms`, animationFillMode: "both" }}
    >
      {children}
    </div>
  );
}

export default function ClientWelcomePage() {
  const { t } = useLocale();
  usePageTitle(t("welcome.pageTitle"));
  const navigate = useNavigate();

  const handleAccountLogin = () => {
    navigate("/openclaw/auth");
  };
  const handleByokEntry = () => {
    navigate("/openclaw/workspace?view=settings&tab=providers&provider=anthropic");
  };

  return (
    <div className="w-full max-w-[520px] mx-auto">
      <FadeIn delay={120}>
        <div className="rounded-[24px] border border-border bg-white px-6 py-7 shadow-card sm:px-8 sm:py-8">
          <img src="/brand/logo-black-1.svg" alt="nexu" className="h-6 w-auto mx-auto" />

          <div className="mt-5 text-center">
            <h2
              className="text-[24px] leading-[1.1] tracking-tight text-text-heading"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              {t("welcome.title")}
            </h2>
            <p className="mt-2 text-[13px] leading-[1.7] text-text-secondary">
              {t("welcome.option.login.description")}
            </p>
          </div>

          <div className="mt-6 space-y-2.5">
            <button
              type="button"
              onClick={handleAccountLogin}
              className="group flex w-full items-center justify-between rounded-2xl border border-border bg-surface-0 px-4 py-3.5 text-left transition-all hover:border-border-hover hover:bg-surface-2"
            >
              <span className="flex items-center gap-3">
                <span className="inline-flex size-9 items-center justify-center rounded-xl bg-surface-2 text-text-primary">
                  <Sparkles size={16} />
                </span>
                <span>
                  <span className="block text-[14px] font-semibold text-text-primary">
                    {t("welcome.option.login.title")}
                  </span>
                  <span className="block text-[12px] text-text-muted">
                    {t("welcome.option.login.badge")}
                  </span>
                </span>
              </span>
              <ArrowRight size={14} className="text-text-muted" />
            </button>

            <button
              type="button"
              onClick={handleByokEntry}
              className="group flex w-full items-center justify-between rounded-2xl border border-border bg-surface-0 px-4 py-3.5 text-left transition-all hover:border-border-hover hover:bg-surface-2"
            >
              <span className="flex items-center gap-3">
                <span className="inline-flex size-9 items-center justify-center rounded-xl bg-surface-2 text-text-primary">
                  <KeyRound size={16} />
                </span>
                <span>
                  <span className="block text-[14px] font-semibold text-text-primary">
                    {t("welcome.option.byok.title")}
                  </span>
                  <span className="block text-[12px] text-text-muted">
                    {t("welcome.option.byok.badge")}
                  </span>
                </span>
              </span>
              <ArrowRight size={14} className="text-text-muted" />
            </button>
          </div>

          <p className="mt-5 text-center text-[12px] text-text-muted">
            {t("welcome.option.byok.description")}
          </p>
        </div>
      </FadeIn>
    </div>
  );
}
