import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Github, Mail, ArrowRight, ArrowLeft, Lock, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { useT } from "@/i18n";

function GoogleIcon({ className }: { className?: string }): React.ReactElement {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none">
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
}

type EmailStep = "email" | "verify" | "password";

export function WelcomePage(): React.ReactElement {
  const t = useT();
  const navigate = useNavigate();
  const [view, setView] = useState<"buttons" | "email">("buttons");
  const [emailStep, setEmailStep] = useState<EmailStep>("email");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const codeRefs = useRef<(HTMLInputElement | null)[]>([]);

  const login = (): void => {
    navigate("/onboarding/workspace");
  };

  const resetEmail = (): void => {
    setView("buttons");
    setEmailStep("email");
    setEmail("");
    setCode(["", "", "", "", "", ""]);
    setPassword("");
    setConfirmPassword("");
    setError("");
  };

  useEffect(() => {
    if (emailStep === "verify" && code.every((d) => d !== "")) {
      const timer = setTimeout(() => setEmailStep("password"), 300);
      return () => clearTimeout(timer);
    }
  }, [code, emailStep]);

  const handleEmailSubmit = (): void => {
    const trimmed = email.trim();
    if (!trimmed) return;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setError(t("workspace.invalidEmail"));
      return;
    }
    setError("");
    setEmailStep("verify");
  };

  const handleCodeChange = (index: number, value: string): void => {
    if (value.length > 1) value = value.slice(-1);
    if (value && !/^\d$/.test(value)) return;
    const next = [...code];
    next[index] = value;
    setCode(next);
    setError("");
    if (value && index < 5) {
      codeRefs.current[index + 1]?.focus();
    }
  };

  const handleCodeKeyDown = (index: number, e: React.KeyboardEvent): void => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      codeRefs.current[index - 1]?.focus();
    }
  };

  const handleCodePaste = (e: React.ClipboardEvent): void => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (!pasted) return;
    const next = [...code];
    for (let i = 0; i < 6; i++) {
      next[i] = pasted[i] ?? "";
    }
    setCode(next);
    const focusIdx = Math.min(pasted.length, 5);
    codeRefs.current[focusIdx]?.focus();
  };

  const handlePasswordSubmit = (): void => {
    if (password.length < 8) {
      setError(t("onboarding.passwordTooShort"));
      return;
    }
    if (password !== confirmPassword) {
      setError(t("onboarding.passwordsMismatch"));
      return;
    }
    setError("");
    login();
  };

  const renderEmailFlow = (): React.ReactElement => {
    if (emailStep === "email") {
      return (
        <>
          <p className="text-sm text-muted-foreground text-center">{t("onboarding.enterEmail")}</p>
          <div>
            <div
              className={cn(
                "flex items-center gap-2 h-11 rounded-lg border bg-background px-3 transition-shadow focus-within:ring-2",
                error
                  ? "border-destructive focus-within:ring-destructive/30"
                  : "border-input focus-within:ring-ring",
              )}
            >
              <Mail className="h-4 w-4 text-muted-foreground shrink-0" />
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError("");
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleEmailSubmit();
                  }
                }}
                placeholder={t("onboarding.emailPlaceholder")}
                className="flex-1 h-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
                autoFocus
              />
            </div>
            {error && <p className="text-[11px] text-destructive mt-1.5">{error}</p>}
          </div>
          <button
            onClick={handleEmailSubmit}
            disabled={!email.trim()}
            className="flex items-center justify-center gap-2 h-11 rounded-lg font-medium transition-colors bg-foreground text-background hover:bg-foreground/90 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {t("onboarding.sendCode")}
            <ArrowRight className="h-4 w-4" />
          </button>
          <button
            onClick={resetEmail}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <span className="flex items-center gap-1 justify-center">
              <ArrowLeft className="h-3.5 w-3.5" /> {t("common.back")}
            </span>
          </button>
        </>
      );
    }

    if (emailStep === "verify") {
      return (
        <>
          <div className="text-center">
            <div className="flex items-center justify-center h-10 w-10 rounded-xl bg-accent mx-auto mb-3">
              <ShieldCheck className="h-5 w-5 text-muted-foreground" />
            </div>
            <p className="text-sm text-muted-foreground">{t("onboarding.codeSent")}</p>
            <p className="text-sm font-medium mt-0.5">{email}</p>
          </div>
          <div>
            <div className="flex items-center justify-center gap-2">
              {code.map((digit, i) => (
                <input
                  key={i}
                  ref={(el) => {
                    codeRefs.current[i] = el;
                  }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleCodeChange(i, e.target.value)}
                  onKeyDown={(e) => handleCodeKeyDown(i, e)}
                  onPaste={i === 0 ? handleCodePaste : undefined}
                  className={cn(
                    "w-10 h-12 rounded-lg border bg-background text-center text-lg font-semibold focus:outline-none focus:ring-2 transition-shadow",
                    error
                      ? "border-destructive focus:ring-destructive/30"
                      : "border-input focus:ring-ring",
                  )}
                  autoFocus={i === 0}
                />
              ))}
            </div>
            {error && <p className="text-[11px] text-destructive mt-2 text-center">{error}</p>}
          </div>
          <button
            onClick={() => {
              if (code.some((d) => d === "")) {
                setError(t("onboarding.enterFullCode"));
                return;
              }
              setError("");
              setEmailStep("password");
            }}
            disabled={code.some((d) => d === "")}
            className="flex items-center justify-center gap-2 h-11 rounded-lg font-medium transition-colors bg-foreground text-background hover:bg-foreground/90 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {t("onboarding.verify")}
            <ArrowRight className="h-4 w-4" />
          </button>
          <button
            onClick={() => {
              setEmailStep("email");
              setCode(["", "", "", "", "", ""]);
              setError("");
            }}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <span className="flex items-center gap-1 justify-center">
              <ArrowLeft className="h-3.5 w-3.5" /> {t("onboarding.changeEmail")}
            </span>
          </button>
        </>
      );
    }

    return (
      <>
        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            {t("onboarding.setPasswordFor")}{" "}
            <span className="font-medium text-foreground">{email}</span>
          </p>
        </div>
        <div className="space-y-3">
          <div
            className={cn(
              "flex items-center gap-2 h-11 rounded-lg border bg-background px-3 transition-shadow focus-within:ring-2",
              error
                ? "border-destructive focus-within:ring-destructive/30"
                : "border-input focus-within:ring-ring",
            )}
          >
            <Lock className="h-4 w-4 text-muted-foreground shrink-0" />
            <input
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError("");
              }}
              placeholder={t("onboarding.passwordPlaceholder")}
              className="flex-1 h-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
              autoFocus
            />
          </div>
          <div
            className={cn(
              "flex items-center gap-2 h-11 rounded-lg border bg-background px-3 transition-shadow focus-within:ring-2",
              error && error.includes("match")
                ? "border-destructive focus-within:ring-destructive/30"
                : "border-input focus-within:ring-ring",
            )}
          >
            <Lock className="h-4 w-4 text-muted-foreground shrink-0" />
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                setError("");
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handlePasswordSubmit();
                }
              }}
              placeholder={t("onboarding.confirmPasswordPlaceholder")}
              className="flex-1 h-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
            />
          </div>
          {error && <p className="text-[11px] text-destructive">{error}</p>}
        </div>
        <button
          onClick={handlePasswordSubmit}
          disabled={!password || !confirmPassword}
          className="flex items-center justify-center gap-2 h-11 rounded-lg font-medium transition-colors bg-foreground text-background hover:bg-foreground/90 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {t("onboarding.createAccount")}
          <ArrowRight className="h-4 w-4" />
        </button>
        <button
          onClick={() => {
            setEmailStep("verify");
            setPassword("");
            setConfirmPassword("");
            setError("");
          }}
          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <span className="flex items-center gap-1 justify-center">
            <ArrowLeft className="h-3.5 w-3.5" /> {t("common.back")}
          </span>
        </button>
      </>
    );
  };

  return (
    <div className="flex h-screen w-screen items-center justify-center bg-background">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_oklch(0.85_0.05_260)_0%,_transparent_70%)] dark:bg-[radial-gradient(ellipse_at_center,_oklch(0.25_0.05_260)_0%,_transparent_70%)] opacity-40" />
      <div className="relative z-10 flex flex-col items-center gap-8 px-8">
        <h1 className="text-4xl font-bold tracking-tight">Nexu</h1>
        <p className="text-sm text-muted-foreground/70 font-medium tracking-wide uppercase">
          {t("onboarding.appTagline")}
        </p>
        <p className="text-lg text-muted-foreground max-w-md text-center -mt-4">
          {t("onboarding.appSubtitle")}
        </p>

        <div className="flex flex-col gap-3 w-80 mt-4">
          {view === "buttons" ? (
            <>
              <button
                onClick={login}
                className="flex items-center justify-center gap-3 h-11 rounded-lg font-medium transition-colors border border-border bg-background text-foreground hover:bg-accent"
              >
                <GoogleIcon className="h-4 w-4" />
                {t("onboarding.continueWithGoogle")}
              </button>
              <button
                onClick={login}
                className="flex items-center justify-center gap-3 h-11 rounded-lg font-medium transition-colors bg-[#24292f] text-white hover:bg-[#24292f]/90"
              >
                <Github className="h-4 w-4" />
                {t("onboarding.continueWithGithub")}
              </button>
              <button
                onClick={() => setView("email")}
                className="flex items-center justify-center gap-3 h-11 rounded-lg font-medium transition-colors bg-secondary text-secondary-foreground hover:bg-secondary/80"
              >
                <Mail className="h-4 w-4" />
                {t("onboarding.continueWithEmail")}
              </button>
            </>
          ) : (
            renderEmailFlow()
          )}
        </div>
      </div>
    </div>
  );
}
