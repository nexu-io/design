import {
  ArrowRight,
  Check,
  ChevronLeft,
  Eye,
  EyeOff,
  Infinity as InfinityIcon,
  Key,
  Zap,
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLocale } from "../../hooks/useLocale";
import { usePageTitle } from "../../hooks/usePageTitle";

import {
  Button,
  EntityCard,
  EntityCardContent,
  EntityCardDescription,
  EntityCardHeader,
  EntityCardMedia,
  EntityCardMeta,
  EntityCardTitle,
  Input,
} from "@nexu/ui-web";

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

const PROVIDER_OPTIONS = [
  { id: "anthropic", name: "Anthropic", placeholder: "sk-ant-..." },
  { id: "openai", name: "OpenAI", placeholder: "sk-..." },
  { id: "google", name: "Google AI", placeholder: "AIza..." },
  { id: "custom", name: "Custom Endpoint", placeholder: "https://..." },
] as const;

function ProviderLogo({ provider, size = 16 }: { provider: string; size?: number }) {
  const s = { width: size, height: size };
  switch (provider) {
    case "anthropic":
      return (
        <svg style={s} viewBox="0 0 24 24" fill="currentColor">
          <path d="M13.827 3.52h3.603L24 20.48h-3.603l-6.57-16.96zm-7.258 0h3.767L16.906 20.48h-3.674l-1.476-3.914H5.036l-1.466 3.914H0L6.569 3.52zm.658 10.418h4.543L9.548 7.04l-2.32 6.898z" />
        </svg>
      );
    case "openai":
      return (
        <svg style={s} viewBox="0 0 24 24" fill="currentColor">
          <path d="M22.282 9.821a5.985 5.985 0 0 0-.516-4.91 6.046 6.046 0 0 0-6.51-2.9A6.065 6.065 0 0 0 4.981 4.18a5.998 5.998 0 0 0-3.998 2.9 6.042 6.042 0 0 0 .743 7.097 5.98 5.98 0 0 0 .51 4.911 6.051 6.051 0 0 0 6.515 2.9A5.985 5.985 0 0 0 13.26 24a6.056 6.056 0 0 0 5.772-4.206 5.99 5.99 0 0 0 3.997-2.9 6.056 6.056 0 0 0-.747-7.073zM13.26 22.43a4.476 4.476 0 0 1-2.876-1.04l.141-.081 4.779-2.758a.795.795 0 0 0 .392-.681v-6.737l2.02 1.168a.071.071 0 0 1 .038.052v5.583a4.504 4.504 0 0 1-4.494 4.494zM3.6 18.304a4.47 4.47 0 0 1-.535-3.014l.142.085 4.783 2.759a.771.771 0 0 0 .78 0l5.843-3.369v2.332a.08.08 0 0 1-.033.062L9.74 19.95a4.5 4.5 0 0 1-6.14-1.646zM2.34 7.896a4.485 4.485 0 0 1 2.366-1.973V11.6a.766.766 0 0 0 .388.676l5.815 3.355-2.02 1.168a.076.076 0 0 1-.071 0l-4.83-2.786A4.504 4.504 0 0 1 2.34 7.872zm16.597 3.855l-5.833-3.387L15.119 7.2a.076.076 0 0 1 .071 0l4.83 2.791a4.494 4.494 0 0 1-.676 8.105v-5.678a.79.79 0 0 0-.407-.667zm2.01-3.023l-.141-.085-4.774-2.782a.776.776 0 0 0-.785 0L9.409 9.23V6.897a.066.066 0 0 1 .028-.061l4.83-2.787a4.5 4.5 0 0 1 6.68 4.66zm-12.64 4.135l-2.02-1.164a.08.08 0 0 1-.038-.057V6.075a4.5 4.5 0 0 1 7.375-3.453l-.142.08L8.704 5.46a.795.795 0 0 0-.393.681zm1.097-2.365l2.602-1.5 2.607 1.5v2.999l-2.597 1.5-2.607-1.5z" />
        </svg>
      );
    case "google":
      return (
        <svg style={s} viewBox="0 0 24 24" fill="none">
          <path
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
            fill="#4285F4"
          />
          <path
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            fill="#34A853"
          />
          <path
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            fill="#FBBC05"
          />
          <path
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            fill="#EA4335"
          />
        </svg>
      );
    default:
      return (
        <span
          className="flex items-center justify-center rounded text-[9px] font-bold bg-surface-3 text-text-muted"
          style={s}
        >
          {(provider[0] ?? "?").toUpperCase()}
        </span>
      );
  }
}

type Mode = "choose" | "byok";

export default function ClientWelcomePage() {
  const { t } = useLocale();
  usePageTitle(t("welcome.pageTitle"));
  const navigate = useNavigate();

  const [mode, setMode] = useState<Mode>("choose");

  const [selectedProvider, setSelectedProvider] = useState("anthropic");
  const [apiKey, setApiKey] = useState("");
  const [showKey, setShowKey] = useState(false);
  const [customEndpoint, setCustomEndpoint] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [verified, setVerified] = useState(false);

  const activePreset =
    PROVIDER_OPTIONS.find((p) => p.id === selectedProvider) ?? PROVIDER_OPTIONS[0];
  const chooseOptions = [
    {
      id: "login" as const,
      title: t("welcome.option.login.title"),
      badge: t("welcome.option.login.badge"),
      description: t("welcome.option.login.description"),
      highlights: ["Claude Opus 4.6", "GPT-5.4", t("welcome.option.login.highlight.unlimited")],
      meta: [
        t("welcome.option.login.meta.1"),
        t("welcome.option.login.meta.2"),
        t("welcome.option.login.meta.3"),
      ],
      icon: Zap,
      tone: "primary" as const,
    },
    {
      id: "byok" as const,
      title: t("welcome.option.byok.title"),
      badge: t("welcome.option.byok.badge"),
      description: t("welcome.option.byok.description"),
      highlights: ["Anthropic", "OpenAI", "Google AI"],
      meta: [
        t("welcome.option.byok.meta.1"),
        t("welcome.option.byok.meta.2"),
        t("welcome.option.byok.meta.3"),
      ],
      icon: Key,
      tone: "secondary" as const,
    },
  ];

  const handleAccountLogin = () => {
    navigate("/openclaw/auth");
  };
  const handleVerifyKey = () => {
    if (!apiKey.trim()) return;
    setVerifying(true);
    setTimeout(() => {
      setVerifying(false);
      setVerified(true);
    }, 1200);
  };
  const handleByokContinue = () => {
    navigate("/openclaw/workspace");
  };
  const handleByokEntry = () => {
    navigate("/openclaw/workspace?view=settings&tab=providers&provider=anthropic");
  };

  return (
    <div className="w-full max-w-[520px] mx-auto">
      {mode === "choose" && (
        <FadeIn delay={120}>
          <div className="rounded-[28px] border border-border bg-white px-5 pt-5 pb-4 shadow-card sm:px-6 sm:pt-6 sm:pb-4">
            <div className="pb-3">
              <h2
                className="text-[22px] leading-[1.1] tracking-tight text-text-heading"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                {t("welcome.title")}
              </h2>
            </div>

            <div className="mt-3 space-y-2.5">
              {chooseOptions.map((option, index) => (
                <FadeIn key={option.id} delay={180 + index * 90}>
                  <EntityCard
                    role="button"
                    tabIndex={0}
                    interactive
                    onClick={() => {
                      if (option.id === "login") {
                        handleAccountLogin();
                        return;
                      }
                      handleByokEntry();
                    }}
                    onKeyDown={(event: React.KeyboardEvent<HTMLDivElement>) => {
                      if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        if (option.id === "login") {
                          handleAccountLogin();
                          return;
                        }
                        handleByokEntry();
                      }
                    }}
                    className={`group w-full rounded-[20px] text-left transition-all duration-300 ${
                      option.tone === "primary"
                        ? "border-border bg-[linear-gradient(135deg,var(--color-neutral-800)_0%,#232327_100%)] text-white hover:-translate-y-0.5 hover:shadow-[0_14px_32px_rgba(0,0,0,0.16)]"
                        : "border-border bg-surface-0 text-text-primary hover:-translate-y-0.5 hover:border-border-hover hover:shadow-refine"
                    }`}
                  >
                    <EntityCardHeader className="items-center justify-between gap-4 p-5 pb-0">
                      <div className="flex items-center gap-3 min-w-0">
                        <EntityCardMedia
                          className={`h-11 w-11 rounded-2xl ${
                            option.tone === "primary"
                              ? "bg-white/[0.08] text-white"
                              : "bg-surface-2 text-text-primary border border-border"
                          }`}
                        >
                          <option.icon size={18} />
                        </EntityCardMedia>
                        <EntityCardTitle
                          className={`text-[22px] leading-none tracking-tight ${
                            option.tone === "primary" ? "text-white" : "text-text-heading"
                          }`}
                          style={{ fontFamily: "var(--font-heading)" }}
                        >
                          {option.title}
                        </EntityCardTitle>
                      </div>
                      <span
                        className={`inline-flex items-center justify-center rounded-full px-2.5 h-[22px] text-[10px] font-semibold uppercase tracking-[0.14em] leading-none shrink-0 ${
                          option.tone === "primary"
                            ? "bg-[var(--color-brand-primary)] text-white"
                            : "border border-border bg-surface-2 text-text-secondary"
                        }`}
                      >
                        {option.badge}
                      </span>
                    </EntityCardHeader>

                    <EntityCardContent className="p-5">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <EntityCardDescription
                            className={`max-w-[430px] text-[13px] leading-[1.75] ${
                              option.tone === "primary" ? "text-white/64" : "text-text-secondary"
                            }`}
                          >
                            {option.description}
                          </EntityCardDescription>
                        </div>
                        <ArrowRight
                          size={16}
                          className={`mt-4 shrink-0 ${option.tone === "primary" ? "text-white/55" : "text-text-muted"}`}
                        />
                      </div>

                      <div className="mt-4 flex flex-wrap gap-2">
                        {option.highlights.map((tag) => (
                          <span
                            key={tag}
                            className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] leading-none ${
                              option.tone === "primary"
                                ? "border border-white/10 bg-white/[0.06] text-white/78"
                                : "border border-border bg-surface-2 text-text-secondary"
                            }`}
                          >
                            {tag === t("welcome.option.login.highlight.unlimited") && (
                              <InfinityIcon size={11} />
                            )}
                            {tag}
                          </span>
                        ))}
                      </div>

                      <EntityCardMeta
                        className={`mt-4 gap-x-4 gap-y-1 text-[11px] ${
                          option.tone === "primary" ? "text-white/44" : "text-text-muted"
                        }`}
                      >
                        {option.meta.map((item) => (
                          <span key={item}>{item}</span>
                        ))}
                      </EntityCardMeta>
                    </EntityCardContent>
                  </EntityCard>
                </FadeIn>
              ))}
            </div>

            <FadeIn delay={380}>
              <div className="mt-4 flex items-center justify-center gap-4 text-[12px] text-text-muted">
                <Button
                  variant="ghost"
                  size="inline"
                  onClick={() => navigate("/openclaw/terms")}
                  className="text-[12px]"
                >
                  {t("auth.terms")}
                </Button>
                <span className="select-none text-border-hover">·</span>
                <Button
                  variant="ghost"
                  size="inline"
                  onClick={() => navigate("/openclaw/privacy")}
                  className="text-[12px]"
                >
                  {t("auth.privacy")}
                </Button>
              </div>
            </FadeIn>
          </div>
        </FadeIn>
      )}

      {mode === "byok" && (
        <FadeIn delay={100}>
          <div className="rounded-[28px] border border-border bg-white p-5 shadow-card sm:p-7">
            <Button
              variant="ghost"
              size="inline"
              onClick={() => setMode("choose")}
              className="mb-6 text-[13px]"
            >
              <ChevronLeft size={14} />
              {t("welcome.back")}
            </Button>

            <div className="pb-4">
              <div className="inline-flex items-center gap-2 rounded-full border border-border bg-surface-2 px-3 py-1 text-[10px] leading-none font-semibold uppercase tracking-[0.14em] text-text-secondary">
                <Key size={11} />
                BYOK
              </div>
              <h2
                className="mt-4 text-[32px] leading-[0.98] tracking-tight text-text-heading"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                {t("welcome.byok.title")}
              </h2>
              <p className="mt-3 text-[14px] leading-[1.75] text-text-secondary">
                {t("welcome.byok.subtitle")}
              </p>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-2">
              {PROVIDER_OPTIONS.map((p) => (
                <button
                  key={p.id}
                  onClick={() => {
                    setSelectedProvider(p.id);
                    setApiKey("");
                    setVerified(false);
                  }}
                  className={`flex items-center gap-2 rounded-xl px-3 py-3 text-[12px] font-medium transition-all cursor-pointer ${
                    selectedProvider === p.id
                      ? "border border-text-primary bg-surface-3 text-text-primary shadow-rest"
                      : "border border-border bg-surface-0 text-text-secondary hover:border-border-hover hover:text-text-primary"
                  }`}
                >
                  <ProviderLogo provider={p.id} size={16} />
                  {p.name}
                </button>
              ))}
            </div>

            <div className="mt-4 space-y-3">
              <div className="relative">
                <Input
                  type={showKey ? "text" : "password"}
                  value={apiKey}
                  onChange={(e) => {
                    setApiKey(e.target.value);
                    setVerified(false);
                  }}
                  placeholder={activePreset.placeholder}
                  className="rounded-2xl py-3 pr-12 font-mono"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowKey(!showKey)}
                  className="absolute right-1.5 top-1/2 -translate-y-1/2 size-7"
                >
                  {showKey ? <EyeOff size={14} /> : <Eye size={14} />}
                </Button>
              </div>

              {selectedProvider === "custom" && (
                <Input
                  type="text"
                  value={customEndpoint}
                  onChange={(e) => setCustomEndpoint(e.target.value)}
                  placeholder={t("welcome.customEndpoint")}
                  className="rounded-2xl py-3 font-mono"
                />
              )}
            </div>

            <div className="mt-5 rounded-2xl border border-border bg-surface-0 px-4 py-3 text-[12px] leading-[1.7] text-text-secondary">
              {t("welcome.byok.note")}
            </div>

            <div className="mt-5">
              {!verified ? (
                <Button
                  onClick={handleVerifyKey}
                  disabled={!apiKey.trim() || verifying}
                  size="lg"
                  className="w-full h-[48px] rounded-2xl text-[14px] font-semibold active:scale-[0.98]"
                >
                  {verifying ? (
                    <>
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-current/30 border-t-current" />
                      {t("welcome.byok.verify.loading")}
                    </>
                  ) : (
                    t("welcome.byok.verify.idle")
                  )}
                </Button>
              ) : (
                <Button
                  onClick={handleByokContinue}
                  size="lg"
                  className="w-full h-[48px] rounded-2xl bg-success text-[14px] font-semibold text-white hover:bg-success/90 active:scale-[0.98]"
                >
                  <Check size={16} />
                  {t("welcome.byok.success")}
                  <ArrowRight size={14} />
                </Button>
              )}
            </div>
          </div>
        </FadeIn>
      )}
    </div>
  );
}
