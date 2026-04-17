import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Github,
  Lock,
  Mail,
  ShieldCheck,
  Sparkles,
  Workflow,
} from "lucide-react";
import {
  Alert,
  AlertDescription,
  AuthShell,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Input,
  Separator,
  cn,
} from "@nexu-design/ui-web";
import { TitleBarSpacer } from "@/components/layout/WindowChrome";
import { SlarkAuthRail } from "./slark-auth-rail";

function GoogleIcon({ className }: { className?: string }): React.ReactElement {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none">
      <title>Google</title>
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
const CODE_SLOTS = ["one", "two", "three", "four", "five", "six"] as const;

export function WelcomePage(): React.ReactElement {
  const navigate = useNavigate();
  const [view, setView] = useState<"buttons" | "email">("buttons");
  const [emailStep, setEmailStep] = useState<EmailStep>("email");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const emailInputRef = useRef<HTMLInputElement>(null);
  const passwordInputRef = useRef<HTMLInputElement>(null);
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
    if (emailStep === "verify" && code.every((digit) => digit !== "")) {
      const timer = setTimeout(() => setEmailStep("password"), 300);
      return () => clearTimeout(timer);
    }
  }, [code, emailStep]);

  useEffect(() => {
    if (view !== "email") return;

    if (emailStep === "email") {
      emailInputRef.current?.focus();
      return;
    }

    if (emailStep === "verify") {
      codeRefs.current[0]?.focus();
      return;
    }

    passwordInputRef.current?.focus();
  }, [view, emailStep]);

  const handleEmailSubmit = (): void => {
    const trimmed = email.trim();
    if (!trimmed) return;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setError("Please enter a valid email address");
      return;
    }
    setError("");
    setEmailStep("verify");
  };

  const handleCodeChange = (index: number, value: string): void => {
    let nextValue = value;
    if (nextValue.length > 1) nextValue = nextValue.slice(-1);
    if (nextValue && !/^\d$/.test(nextValue)) return;

    const next = [...code];
    next[index] = nextValue;
    setCode(next);
    setError("");

    if (nextValue && index < 5) {
      codeRefs.current[index + 1]?.focus();
    }
  };

  const handleCodeKeyDown = (index: number, event: React.KeyboardEvent): void => {
    if (event.key === "Backspace" && !code[index] && index > 0) {
      codeRefs.current[index - 1]?.focus();
    }
  };

  const handleCodePaste = (event: React.ClipboardEvent): void => {
    event.preventDefault();
    const pasted = event.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (!pasted) return;

    const next = [...code];
    for (let index = 0; index < 6; index += 1) {
      next[index] = pasted[index] ?? "";
    }

    setCode(next);
    codeRefs.current[Math.min(pasted.length, 5)]?.focus();
  };

  const handlePasswordSubmit = (): void => {
    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setError("");
    login();
  };

  const panelTitle =
    view === "buttons"
      ? "Sign in to Slark"
      : emailStep === "email"
        ? "Continue with email"
        : emailStep === "verify"
          ? "Check your inbox"
          : "Create your password";

  const panelDescription =
    view === "buttons"
      ? "Choose an auth method to create your workspace and connect your first agents."
      : emailStep === "email"
        ? "We’ll send a verification code to your email."
        : emailStep === "verify"
          ? "Enter the 6-digit code to finish verifying your account."
          : "One more step before you enter your workspace.";

  const renderButtonsView = (): React.ReactElement => (
    <div className="space-y-3">
      <Button className="w-full justify-center" size="md" onClick={login}>
        <GoogleIcon className="size-4" />
        Continue with Google
      </Button>
      <Button
        className="w-full justify-center bg-[#24292f] text-white hover:bg-[#24292f]/90"
        size="md"
        onClick={login}
      >
        <Github className="size-4" />
        Continue with GitHub
      </Button>

      <div className="flex items-center gap-3 py-1">
        <Separator className="flex-1" />
        <span className="text-xs font-semibold uppercase tracking-[0.12em] text-text-muted">
          or
        </span>
        <Separator className="flex-1" />
      </div>

      <Button
        variant="outline"
        className="w-full justify-center"
        size="md"
        onClick={() => setView("email")}
      >
        <Mail className="size-4" />
        Continue with Email
      </Button>
    </div>
  );

  const renderEmailFlow = (): React.ReactElement => {
    if (emailStep === "email") {
      return (
        <div className="space-y-4">
          <Input
            ref={emailInputRef}
            type="email"
            value={email}
            invalid={!!error}
            leadingIcon={<Mail className="size-4" />}
            placeholder="you@company.com"
            onChange={(event) => {
              setEmail(event.target.value);
              setError("");
            }}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();
                handleEmailSubmit();
              }
            }}
          />

          {error ? (
            <Alert variant="destructive">
              <AlertCircle className="size-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          ) : null}

          <Button
            className="w-full justify-center"
            onClick={handleEmailSubmit}
            disabled={!email.trim()}
          >
            Send verification code
            <ArrowRight className="size-4" />
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-center text-text-secondary"
            onClick={resetEmail}
          >
            <ArrowLeft className="size-4" />
            Back
          </Button>
        </div>
      );
    }

    if (emailStep === "verify") {
      return (
        <div className="space-y-4">
          <div className="rounded-xl border border-border bg-surface-1 px-4 py-3 text-center">
            <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-brand-subtle text-brand-primary">
              <ShieldCheck className="size-5" />
            </div>
            <p className="text-sm text-text-secondary">We sent a 6-digit code to</p>
            <p className="mt-1 text-sm font-semibold text-text-primary">{email}</p>
          </div>

          <fieldset
            className="flex items-center justify-center gap-2"
            aria-label="Verification code"
          >
            {CODE_SLOTS.map((slot, index) => (
              <input
                key={slot}
                ref={(element) => {
                  codeRefs.current[index] = element;
                }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                aria-label={`Digit ${index + 1} of 6`}
                value={code[index]}
                onChange={(event) => handleCodeChange(index, event.target.value)}
                onKeyDown={(event) => handleCodeKeyDown(index, event)}
                onPaste={index === 0 ? handleCodePaste : undefined}
                className={cn(
                  "h-12 w-11 rounded-xl border bg-surface-0 text-center text-lg font-semibold text-text-primary outline-none transition-colors",
                  error
                    ? "border-destructive focus:border-destructive focus:ring-2 focus:ring-destructive/20"
                    : "border-input focus:border-accent focus:ring-2 focus:ring-accent/20",
                )}
              />
            ))}
          </fieldset>

          {error ? (
            <Alert variant="destructive">
              <AlertCircle className="size-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          ) : null}

          <Button
            className="w-full justify-center"
            disabled={code.some((digit) => digit === "")}
            onClick={() => {
              if (code.some((digit) => digit === "")) {
                setError("Please enter the full code");
                return;
              }

              setError("");
              setEmailStep("password");
            }}
          >
            Verify
            <ArrowRight className="size-4" />
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-center text-text-secondary"
            onClick={() => {
              setEmailStep("email");
              setCode(["", "", "", "", "", ""]);
              setError("");
            }}
          >
            <ArrowLeft className="size-4" />
            Change email
          </Button>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        <Input
          ref={passwordInputRef}
          type="password"
          value={password}
          invalid={!!error && !error.includes("match")}
          leadingIcon={<Lock className="size-4" />}
          placeholder="Password (min 8 characters)"
          onChange={(event) => {
            setPassword(event.target.value);
            setError("");
          }}
        />
        <Input
          type="password"
          value={confirmPassword}
          invalid={!!error && error.includes("match")}
          leadingIcon={<Lock className="size-4" />}
          placeholder="Confirm password"
          onChange={(event) => {
            setConfirmPassword(event.target.value);
            setError("");
          }}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              handlePasswordSubmit();
            }
          }}
        />

        {error ? (
          <Alert variant="destructive">
            <AlertCircle className="size-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        ) : null}

        <Button
          className="w-full justify-center"
          onClick={handlePasswordSubmit}
          disabled={!password || !confirmPassword}
        >
          Create account
          <ArrowRight className="size-4" />
        </Button>
        <Button
          variant="ghost"
          className="w-full justify-center text-text-secondary"
          onClick={() => {
            setEmailStep("verify");
            setPassword("");
            setConfirmPassword("");
            setError("");
          }}
        >
          <ArrowLeft className="size-4" />
          Back
        </Button>
      </div>
    );
  };

  return (
    <div className="flex h-screen flex-col bg-background">
      <TitleBarSpacer />
      <div className="min-h-0 flex-1">
        <AuthShell
          className="h-full min-h-full"
          rail={
            <SlarkAuthRail
              title={
                <>
                  Sign in once.
                  <br />
                  Start shipping.
                </>
              }
              description="Bring your workspace, connected runtimes, and agent teammates into one desktop flow with consistent shells and safer defaults."
              highlights={[
                {
                  icon: Sparkles,
                  text: "Move from sign-in to onboarding without leaving the shared product shell.",
                },
                {
                  icon: Workflow,
                  text: "Create a workspace, connect runtimes, and launch your first agent in one pass.",
                },
                {
                  icon: ShieldCheck,
                  text: "Keep trust cues visible while verification and invite flows stay clear and guided.",
                },
              ]}
            />
          }
          contentInnerClassName="max-w-[420px]"
        >
          <Card
            variant="static"
            padding="lg"
            className="rounded-2xl border-border bg-surface-1 shadow-card"
          >
            <CardHeader className="text-center">
              <CardTitle className="text-2xl text-text-primary">{panelTitle}</CardTitle>
              <CardDescription className="text-sm text-text-secondary">
                {panelDescription}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {view === "buttons" ? renderButtonsView() : renderEmailFlow()}
            </CardContent>
          </Card>
        </AuthShell>
      </div>
    </div>
  );
}
