import { Button, GitHubIcon, ProviderLogo } from "@nexu-design/ui-web";
import { ArrowRight, Check, Mail } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useLocale } from "../../hooks/useLocale";
import { usePageTitle } from "../../hooks/usePageTitle";

/* ── Animated wrapper ── */
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

/* ═════════════════════════════════════════════ */

export default function AuthPage() {
  const { t } = useLocale();
  const [searchParams] = useSearchParams();
  const isDesktopFlow = searchParams.get("desktop") === "1";
  usePageTitle(t("auth.welcomeBack"));
  const navigate = useNavigate();
  const [mode, setMode] = useState<"login" | "register">("register");
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [loading, setLoading] = useState<"google" | "email" | "github" | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [authSuccess, setAuthSuccess] = useState(false);
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    if (!authSuccess) return;
    if (countdown <= 0) {
      if (isDesktopFlow) window.close();
      return;
    }
    const timer = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [authSuccess, countdown, isDesktopFlow]);

  const onAuthComplete = () => {
    if (isDesktopFlow) {
      setAuthSuccess(true);
    } else {
      navigate("/openclaw/workspace");
    }
  };

  const handleGitHubAuth = () => {
    setLoading("github");
    setTimeout(() => {
      setLoading(null);
      onAuthComplete();
    }, 800);
  };

  const handleGoogleAuth = () => {
    setLoading("google");
    setTimeout(() => {
      setLoading(null);
      onAuthComplete();
    }, 1200);
  };

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setEmailError("");
    if (!email.trim()) {
      setEmailError(t("auth.error.email"));
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailError(t("auth.error.emailInvalid"));
      return;
    }
    if (!password.trim() || password.length < 6) {
      setEmailError(t("auth.error.password"));
      return;
    }
    setLoading("email");
    setTimeout(() => {
      setLoading(null);
      onAuthComplete();
    }, 1200);
  };

  if (authSuccess) {
    return (
      <div className="w-full max-w-[380px] mx-auto">
        <FadeIn delay={0}>
          <div className="bg-surface-1 border border-border rounded-2xl p-8 shadow-[0_2px_8px_rgba(0,0,0,0.04)] text-center">
            <div className="w-14 h-14 rounded-full bg-[var(--color-success)]/10 flex items-center justify-center mx-auto mb-5">
              <Check size={28} className="text-[var(--color-success)]" />
            </div>
            <h2 className="text-[18px] font-semibold text-text-primary tracking-tight mb-2">
              {t("auth.success.title")}
            </h2>
            <p className="text-[13px] text-text-tertiary leading-relaxed mb-6">
              {t("auth.success.desc")}
            </p>
            <p className="text-[12px] text-text-muted mb-4">
              {t("auth.success.countdown").replace("{n}", String(countdown))}
            </p>
            <Button
              onClick={() => {
                if (isDesktopFlow) window.close();
                else navigate("/openclaw/workspace");
              }}
              className="flex items-center justify-center gap-2 w-full h-11 rounded-lg text-[14px] font-medium border border-border bg-surface-0 text-text-primary hover:bg-surface-2 hover:border-border-hover active:scale-[0.98] transition-all cursor-pointer"
            >
              {t("auth.success.backToApp")}
            </Button>
          </div>
        </FadeIn>
      </div>
    );
  }

  return (
    <div className="w-full max-w-[380px] mx-auto">
      {/* Mobile tagline */}
      <FadeIn delay={100} className="lg:hidden text-center mb-6">
        <p className="text-[14px] text-text-secondary leading-relaxed whitespace-pre-line">
          {t("auth.tagline")}
        </p>
      </FadeIn>

      {/* Card */}
      <FadeIn delay={150}>
        <div className="bg-surface-1 border border-border rounded-2xl p-7 sm:p-8 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
          {/* Header */}
          <div className="text-center mb-7">
            <h2 className="text-[18px] font-semibold text-text-primary tracking-tight">
              {mode === "register" ? t("auth.createAccount") : t("auth.welcomeBack")}
            </h2>
            <p className="mt-1.5 text-[13px] text-text-tertiary">
              {mode === "register" ? t("auth.chooseMethod") : t("auth.loginToContinue")}
            </p>
          </div>

          {/* Auth buttons */}
          <div className="space-y-2.5">
            {/* Google */}
            <Button
              onClick={handleGoogleAuth}
              disabled={loading !== null}
              className="group flex items-center justify-center gap-2 w-full h-11 rounded-lg text-[14px] font-medium border border-border bg-surface-0 text-text-primary hover:bg-surface-2 hover:border-border-hover active:scale-[0.98] transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              {loading === "google" ? (
                <div className="w-4 h-4 border-2 border-text-muted/30 border-t-text-secondary rounded-full animate-spin" />
              ) : (
                <>
                  <ProviderLogo provider="google" size={16} />
                  <span>{t("auth.google")}</span>
                  <ArrowRight
                    size={14}
                    className="opacity-0 -ml-1 group-hover:opacity-60 group-hover:ml-0 transition-all"
                  />
                </>
              )}
            </Button>

            {/* GitHub */}
            <Button
              onClick={handleGitHubAuth}
              disabled={loading !== null}
              className="group flex items-center justify-center gap-2 w-full h-11 rounded-lg text-[14px] font-semibold bg-[#111] text-white hover:bg-[#222] active:scale-[0.98] transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              {loading === "github" ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <GitHubIcon size={17} />
                  <span>{t("auth.github.login")}</span>
                  <ArrowRight
                    size={14}
                    className="opacity-0 -ml-1 group-hover:opacity-60 group-hover:ml-0 transition-all"
                  />
                </>
              )}
            </Button>

            {/* Divider */}
            <div className="flex items-center gap-3 py-1">
              <div className="flex-1 border-t border-border" />
              <span className="text-[11px] text-text-muted uppercase tracking-wider select-none">
                {t("auth.or")}
              </span>
              <div className="flex-1 border-t border-border" />
            </div>

            {/* Email */}
            {showEmailForm ? (
              <div>
                <form onSubmit={handleEmailSubmit} className="space-y-2.5">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setEmailError("");
                    }}
                    placeholder={t("auth.email.placeholder")}
                    className="w-full h-11 px-3.5 rounded-lg border border-border bg-surface-0 text-[14px] text-text-primary placeholder:text-text-muted focus:outline-none focus:border-text-tertiary focus:ring-1 focus:ring-text-muted/20 transition-colors"
                  />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setEmailError("");
                    }}
                    placeholder={
                      mode === "register"
                        ? t("auth.password.placeholder.register")
                        : t("auth.password.placeholder.login")
                    }
                    className="w-full h-11 px-3.5 rounded-lg border border-border bg-surface-0 text-[14px] text-text-primary placeholder:text-text-muted focus:outline-none focus:border-text-tertiary focus:ring-1 focus:ring-text-muted/20 transition-colors"
                  />
                  {emailError && <p className="text-[12px] text-red-500 pl-0.5">{emailError}</p>}
                  <Button
                    type="submit"
                    disabled={loading !== null}
                    className="flex items-center justify-center w-full h-11 rounded-lg text-[14px] font-medium bg-[#111] text-white hover:bg-[#222] active:scale-[0.98] transition-all disabled:opacity-40 cursor-pointer"
                  >
                    {loading === "email" ? (
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <span>
                        {mode === "register" ? t("auth.submit.register") : t("auth.submit.login")}
                      </span>
                    )}
                  </Button>
                </form>
                <Button
                  type="button"
                  variant="ghost"
                  size="inline"
                  onClick={() => setShowEmailForm(false)}
                  className="mt-3 w-full justify-center text-[12px] text-text-muted transition-colors hover:text-text-secondary"
                >
                  {t("auth.otherMethods")}
                </Button>
              </div>
            ) : (
              <Button
                onClick={() => setShowEmailForm(true)}
                className="flex items-center justify-center gap-2 w-full h-11 rounded-lg text-[14px] font-medium border border-border bg-surface-0 text-text-primary hover:bg-surface-2 hover:border-border-hover active:scale-[0.98] transition-all cursor-pointer"
              >
                <Mail size={15} />
                <span>{mode === "register" ? t("auth.emailRegister") : t("auth.emailLogin")}</span>
              </Button>
            )}
          </div>

          {/* Toggle login/register */}
          <div className="flex items-center justify-center gap-1.5 mt-6 pt-5 border-t border-border">
            <span className="text-[13px] text-text-muted">
              {mode === "register" ? t("auth.hasAccount") : t("auth.noAccount")}
            </span>
            <Button
              type="button"
              variant="ghost"
              size="inline"
              onClick={() => {
                setMode(mode === "register" ? "login" : "register");
                setShowEmailForm(false);
                setEmailError("");
              }}
              className="h-auto p-0 text-[13px] font-medium text-text-primary hover:bg-transparent hover:underline underline-offset-2"
            >
              {mode === "register" ? t("auth.login") : t("auth.register")}
            </Button>
          </div>
        </div>
      </FadeIn>
    </div>
  );
}
