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
  EntityCardMedia,
  EntityCardMeta,
  EntityCardTitle,
  Input,
  ProviderLogo,
} from "@nexu-design/ui-web";

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
                  <button
                    type="button"
                    onClick={() => {
                      if (option.id === "login") {
                        handleAccountLogin();
                        return;
                      }
                      handleByokEntry();
                    }}
                    className={`group w-full rounded-[20px] text-left transition-all duration-300 ${
                      option.tone === "primary"
                        ? "border-border bg-[linear-gradient(135deg,var(--color-neutral-800)_0%,#232327_100%)] text-white hover:-translate-y-0.5 hover:shadow-[0_14px_32px_rgba(0,0,0,0.16)]"
                        : "border-border bg-surface-0 text-text-primary hover:-translate-y-0.5 hover:border-border-hover hover:shadow-refine"
                    }`}
                  >
                    <div className="items-center justify-between gap-4 p-5 pb-0 flex">
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
                    </div>

                    <div className="p-5">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p
                            className={`max-w-[430px] text-[13px] leading-[1.75] ${option.tone === "primary" ? "text-white/64" : "text-text-secondary"}`}
                          >
                            {option.description}
                          </p>
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
                    </div>
                  </button>
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
                  type="button"
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
