import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AlertCircle, ArrowLeft, ArrowRight, Github, Lock, Mail } from "lucide-react";
import { Alert, AlertDescription, Button, Input, TextLink, cn } from "@nexu-design/ui-web";
import { SlarkAuthFrame } from "./slark-auth-frame";

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
      ? "Choose how you want to sign in."
      : emailStep === "email"
        ? "We’ll send a 6-digit verification code."
        : emailStep === "verify"
          ? null
          : "Set a password to finish creating your account.";

  const renderButtonsView = (): React.ReactElement => (
    <div className="space-y-4">
      <div className="space-y-2.5">
        <Button className="w-full justify-center" size="md" onClick={login}>
          <Github className="size-[18px]" />
          Continue with GitHub
        </Button>
        <Button variant="outline" className="w-full justify-center" size="md" onClick={login}>
          <GoogleIcon className="-ml-0.5 size-[18px]" />
          Continue with Google
        </Button>
        <Button
          variant="outline"
          className="w-full justify-center"
          size="md"
          onClick={() => setView("email")}
        >
          <Mail className="size-[18px]" />
          Continue with Email
        </Button>
      </div>

      <p className="px-2 text-center text-[11px] leading-relaxed text-text-tertiary">
        By continuing, you agree to our{" "}
        <TextLink href="#" variant="muted" size="xs">
          Terms of Service
        </TextLink>{" "}
        and{" "}
        <TextLink href="#" variant="muted" size="xs">
          Privacy Policy
        </TextLink>
        .
      </p>
    </div>
  );

  const renderBackButton = (onClick: () => void): React.ReactElement => (
    <Button
      variant="ghost"
      size="sm"
      className="mx-auto"
      onClick={onClick}
      leadingIcon={<ArrowLeft size={14} />}
    >
      Back
    </Button>
  );

  const renderEmailFlow = (): React.ReactElement => {
    if (emailStep === "email") {
      return (
        <div className="space-y-3">
          <div className="space-y-2">
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
              <Alert variant="destructive" className="mt-2">
                <AlertCircle className="size-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            ) : null}
          </div>

          <Button
            className="w-full justify-center"
            onClick={handleEmailSubmit}
            disabled={!email.trim()}
            trailingIcon={<ArrowRight size={16} />}
          >
            Send verification code
          </Button>
          {renderBackButton(resetEmail)}
        </div>
      );
    }

    if (emailStep === "verify") {
      return (
        <div className="space-y-5">
          <p className="text-center text-[13px] leading-relaxed text-text-secondary">
            We sent a code to <span className="font-semibold text-text-primary">{email}</span>
          </p>

          <div className="space-y-2">
            <fieldset
              className="flex items-center justify-center gap-1.5"
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
                    "h-11 w-10 rounded-lg border bg-surface-0 text-center text-[17px] font-semibold text-text-primary outline-none transition-colors",
                    error
                      ? "border-destructive focus:border-destructive focus:ring-2 focus:ring-destructive/20"
                      : "border-input focus:border-accent focus:ring-2 focus:ring-accent/20",
                  )}
                />
              ))}
            </fieldset>

            {error ? (
              <Alert variant="destructive" className="mt-2">
                <AlertCircle className="size-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            ) : null}
          </div>

          <div className="space-y-3">
            <Button
              className="w-full justify-center"
              disabled={code.some((digit) => digit === "")}
              trailingIcon={<ArrowRight size={16} />}
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
            </Button>
            {renderBackButton(() => {
              setEmailStep("email");
              setCode(["", "", "", "", "", ""]);
              setError("");
            })}
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-3">
        <div className="space-y-2">
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
            <Alert variant="destructive" className="mt-2">
              <AlertCircle className="size-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          ) : null}
        </div>

        <Button
          className="w-full justify-center"
          onClick={handlePasswordSubmit}
          disabled={!password || !confirmPassword}
          trailingIcon={<ArrowRight size={16} />}
        >
          Create account
        </Button>
        {renderBackButton(() => {
          setEmailStep("verify");
          setPassword("");
          setConfirmPassword("");
          setError("");
        })}
      </div>
    );
  };

  return (
    <SlarkAuthFrame hideFooter>
      <div className="w-full">
        <div className="text-center">
          <h1 className="text-[20px] font-semibold leading-tight text-text-heading">
            {panelTitle}
          </h1>
          {panelDescription ? (
            <p className="mt-1.5 text-[13px] leading-relaxed text-text-secondary">
              {panelDescription}
            </p>
          ) : null}
        </div>
        <div className={cn(view === "buttons" ? "mt-8" : "mt-6")}>
          {view === "buttons" ? renderButtonsView() : renderEmailFlow()}
        </div>
      </div>
    </SlarkAuthFrame>
  );
}
