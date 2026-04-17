import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Building2, Mail, Send, Check } from "lucide-react";
import { cn } from "@nexu-design/ui-web";
import { useWorkspaceStore } from "@/stores/workspace";

export function CreateWorkspaceStep(): React.ReactElement {
  const navigate = useNavigate();
  const setWorkspace = useWorkspaceStore((s) => s.setWorkspace);
  const [name, setName] = useState("");
  const [invitedEmails, setInvitedEmails] = useState<string[]>([]);
  const [emailInput, setEmailInput] = useState("");
  const [emailError, setEmailError] = useState("");
  const emailRef = useRef<HTMLInputElement>(null);
  const errorTimerRef = useRef<ReturnType<typeof setTimeout>>(null);

  const isValidEmail = (email: string): boolean => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const showError = (msg: string): void => {
    setEmailError(msg);
    if (errorTimerRef.current) clearTimeout(errorTimerRef.current);
    errorTimerRef.current = setTimeout(() => setEmailError(""), 3000);
  };

  const addEmail = (): void => {
    const email = emailInput.trim();
    if (!email) return;
    if (!isValidEmail(email)) {
      showError("Please enter a valid email address");
      return;
    }
    if (invitedEmails.includes(email)) {
      showError("This email has already been added");
      return;
    }
    setInvitedEmails((prev) => [...prev, email]);
    setEmailInput("");
    setEmailError("");
  };

  const handleEmailKeyDown = (e: React.KeyboardEvent): void => {
    if (e.key === "Enter") {
      e.preventDefault();
      addEmail();
    }
  };

  const handleContinue = (): void => {
    if (!name.trim()) return;
    setWorkspace({
      id: `ws-${Date.now()}`,
      name: name.trim(),
      createdAt: Date.now(),
    });
    navigate("/onboarding/runtime");
  };

  return (
    <div className="flex flex-col items-center gap-6 pt-10">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-accent">
        <Building2 className="h-7 w-7 text-muted-foreground" />
      </div>
      <div className="text-center">
        <h2 className="text-2xl font-semibold">Create your workspace</h2>
        <p className="text-muted-foreground mt-2">Set up your team space and invite colleagues</p>
      </div>

      <div className="w-full max-w-sm space-y-5">
        <div>
          <label className="text-sm font-medium mb-1.5 block">Workspace name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Acme Engineering"
            className="w-full h-10 rounded-lg border border-input bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            autoFocus
          />
        </div>

        <div>
          <label className="text-sm font-medium mb-1.5 block">Invite Members</label>
          <div className="flex items-center gap-2">
            <div
              className={cn(
                "flex-1 flex items-center gap-2 h-10 rounded-lg border bg-background px-3 transition-shadow focus-within:ring-2",
                emailError
                  ? "border-destructive focus-within:ring-destructive/30"
                  : "border-input focus-within:ring-ring",
              )}
            >
              <Mail className="h-4 w-4 text-muted-foreground shrink-0" />
              <input
                ref={emailRef}
                type="email"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                onKeyDown={handleEmailKeyDown}
                placeholder="colleague@company.com"
                className="flex-1 h-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
              />
            </div>
            <button
              onClick={addEmail}
              disabled={!emailInput.trim()}
              className="flex items-center gap-1.5 h-10 px-4 rounded-lg bg-foreground text-background text-sm font-medium disabled:opacity-40 disabled:cursor-not-allowed hover:bg-foreground/90 transition-colors shrink-0"
            >
              <Send className="h-3.5 w-3.5" />
              Invite
            </button>
          </div>
          {emailError && (
            <p className="text-[11px] text-destructive-foreground mt-1.5">{emailError}</p>
          )}

          {invitedEmails.length > 0 && (
            <div className="mt-3 space-y-1">
              {invitedEmails.map((email) => (
                <div
                  key={email}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg border border-border"
                >
                  <Mail className="h-4 w-4 text-muted-foreground shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium truncate">{email}</div>
                    <div className="text-xs text-muted-foreground">Invitation sent</div>
                  </div>
                  <Check className="h-3.5 w-3.5 text-slark-online shrink-0" />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <button
        onClick={handleContinue}
        disabled={!name.trim()}
        className="flex items-center gap-2 h-11 px-6 rounded-lg bg-foreground text-background font-medium disabled:opacity-40 disabled:cursor-not-allowed hover:bg-foreground/90 transition-colors mt-2"
      >
        Continue
        <ArrowRight className="h-4 w-4" />
      </button>
    </div>
  );
}
